
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useStore } from '@/lib/store';
import { toast } from './use-toast';

export const useAuth = () => {
  const { setUser, setWedding, user } = useStore();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check for active session on mount
    const initAuth = async () => {
      setIsLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          // Get user data
          setUser(session.user);
          
          // Get wedding data for the user
          const { data: wedding } = await supabase
            .from('weddings')
            .select('*')
            .eq('owner_id', session.user.id)
            .maybeSingle();
          
          if (wedding) {
            setWedding(wedding);
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        toast({
          title: "Erro de autenticação",
          description: "Não foi possível verificar sua sessão",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user);
          
          // Get wedding data for the user
          const { data: wedding } = await supabase
            .from('weddings')
            .select('*')
            .eq('owner_id', session.user.id)
            .maybeSingle();
            
          if (wedding) {
            setWedding(wedding);
          }
        } else {
          setUser(null);
          setWedding(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [setUser, setWedding]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return data;
    } catch (error: any) {
      toast({
        title: "Falha no login",
        description: error.message || "Verifique suas credenciais e tente novamente",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;
      
      toast({
        title: "Registro bem-sucedido",
        description: "Verifique seu email para confirmar seu cadastro",
      });
      
      return data;
    } catch (error: any) {
      toast({
        title: "Falha no registro",
        description: error.message || "Não foi possível criar sua conta",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      setWedding(null);
    } catch (error: any) {
      toast({
        title: "Erro ao sair",
        description: error.message || "Não foi possível encerrar sua sessão",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const setupWedding = async (coupleName: string, weddingDate: Date, partnerEmail?: string) => {
    if (!user) return null;
    
    setIsLoading(true);
    try {
      // Create the wedding
      const { data: wedding, error } = await supabase
        .from('weddings')
        .insert([
          { 
            couple_name: coupleName, 
            wedding_date: weddingDate.toISOString().split('T')[0],
            owner_id: user.id,
            partner_id: null // Will be updated if partner is invited
          }
        ])
        .select()
        .single();
      
      if (error) throw error;
      
      // Send invitation to partner if email provided
      if (partnerEmail && partnerEmail.trim() !== '') {
        // In a real app, we would send an email invitation here
        console.log(`Invitation would be sent to ${partnerEmail}`);
      }
      
      setWedding(wedding);
      
      toast({
        title: "Casamento configurado",
        description: "Seu planejamento de casamento foi criado com sucesso!",
      });
      
      return wedding;
    } catch (error: any) {
      toast({
        title: "Erro na configuração",
        description: error.message || "Não foi possível configurar seu casamento",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    login,
    register,
    logout,
    setupWedding,
    isLoading,
    isAuthenticated: !!user,
  };
};

export default useAuth;
