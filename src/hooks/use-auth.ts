
import { useState, useEffect, useCallback } from 'react';
import { useStore } from '@/lib/store';
import { fetchUserWedding, setupWedding as setupWeddingService } from '@/services/wedding-service';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { User, Session } from '@supabase/supabase-js';
import { mapSupabaseUser } from '@/lib/mappers/supabase-mappers';

export const useAuth = () => {
  const { setUser, setWedding, user, resetStore } = useStore();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [session, setSession] = useState<Session | null>(null);

  // Initialize auth state
  useEffect(() => {
    let isMounted = true;
    
    const initAuth = async () => {
      try {
        setIsLoading(true);
        
        // First set up auth state listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (event, currentSession) => {
            if (!isMounted) return;

            console.log('Auth state change:', event, currentSession?.user?.id);
            setSession(currentSession);

            if (currentSession?.user) {
              const mappedUser = mapSupabaseUser(currentSession.user);
              setUser(mappedUser);
              
              // Use setTimeout to avoid recursive calls in Supabase client
              setTimeout(async () => {
                if (!isMounted) return;
                try {
                  const wedding = await fetchUserWedding(mappedUser.id);
                  if (isMounted) {
                    console.log('Wedding data loaded:', wedding);
                    setWedding(wedding);
                  }
                } catch (error) {
                  console.error('Error fetching wedding data:', error);
                } finally {
                  if (isMounted) {
                    setIsLoading(false);
                  }
                }
              }, 0);
            } else {
              resetStore();
              setIsLoading(false);
            }
          }
        );

        // Then check for existing session
        const { data: { session: existingSession } } = await supabase.auth.getSession();
        if (existingSession?.user && isMounted) {
          const mappedUser = mapSupabaseUser(existingSession.user);
          setUser(mappedUser);

          // Load wedding data
          try {
            const wedding = await fetchUserWedding(mappedUser.id);
            if (isMounted) {
              setWedding(wedding);
            }
          } catch (error) {
            console.error('Error fetching wedding data:', error);
          }
        }

        if (isMounted) {
          setIsLoading(false);
        }

        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    initAuth();

    return () => {
      isMounted = false;
    };
  }, [setUser, setWedding, resetStore]);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Falha no login",
          description: error.message || "Verifique suas credenciais e tente novamente",
          variant: "destructive",
        });
        return { user: null, session: null };
      }

      return {
        user: data.user ? mapSupabaseUser(data.user) : null,
        session: data.session
      };
    } catch (error: any) {
      toast({
        title: "Falha no login",
        description: error.message || "Ocorreu um erro inesperado",
        variant: "destructive",
      });
      return { user: null, session: null };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Note que o signUp não loga o usuário automaticamente quando email_confirmation é necessário
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Falha no registro",
          description: error.message || "Não foi possível criar sua conta",
          variant: "destructive",
        });
        return { user: null, session: null };
      }

      // Verificar se confirmação de email é necessária
      if (data.session === null) {
        toast({
          title: "Verificação de email necessária",
          description: "Um link de confirmação foi enviado para seu email. Por favor verifique seu email antes de fazer login.",
          duration: 8000,
        });
      } else {
        toast({
          title: "Registro bem-sucedido",
          description: "Conta criada com sucesso",
        });
      }

      return {
        user: data.user ? mapSupabaseUser(data.user) : null,
        session: data.session
      };
    } catch (error: any) {
      toast({
        title: "Falha no registro",
        description: error.message || "Ocorreu um erro inesperado",
        variant: "destructive",
      });
      return { user: null, session: null };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast({
          title: "Erro ao sair",
          description: error.message || "Não foi possível encerrar sua sessão",
          variant: "destructive",
        });
        return false;
      }
      
      // Clear application state
      resetStore();
      return true;
    } catch (error: any) {
      toast({
        title: "Erro ao sair",
        description: error.message || "Ocorreu um erro inesperado",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [resetStore]);

  const setupWedding = useCallback(async (coupleName: string, weddingDate: Date, partnerEmail?: string) => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para configurar um casamento",
        variant: "destructive"
      });
      return null;
    }
    
    setIsLoading(true);
    try {
      console.log("Configurando casamento para usuário:", user.id);
      const wedding = await setupWeddingService(user.id, coupleName, weddingDate, partnerEmail);
      
      if (wedding) {
        console.log("Casamento configurado com sucesso:", wedding);
        setWedding(wedding);
        return wedding;
      } else {
        console.log("Falha ao configurar casamento");
        return null;
      }
    } catch (error) {
      console.error("Erro ao configurar casamento:", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user, setWedding]);

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
