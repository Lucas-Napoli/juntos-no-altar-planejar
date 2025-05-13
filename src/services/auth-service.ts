
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { mapSupabaseUser } from '@/lib/mappers/supabase-mappers';
import { User } from '@/lib/store';

export const getSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  } catch (error: any) {
    console.error('Get session error:', error);
    return null;
  }
};

export const getCurrentUser = async (): Promise<User | null> => {
  const session = await getSession();
  if (!session?.user) return null;
  return mapSupabaseUser(session.user);
};

export const loginWithPassword = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return {
      user: data.user ? mapSupabaseUser(data.user) : null,
      session: data.session
    };
  } catch (error: any) {
    toast({
      title: "Falha no login",
      description: error.message || "Verifique suas credenciais e tente novamente",
      variant: "destructive",
    });
    return { user: null, session: null };
  }
};

export const registerUser = async (email: string, password: string) => {
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
    
    return {
      user: data.user ? mapSupabaseUser(data.user) : null,
      session: data.session
    };
  } catch (error: any) {
    toast({
      title: "Falha no registro",
      description: error.message || "Não foi possível criar sua conta",
      variant: "destructive",
    });
    return { user: null, session: null };
  }
};

export const logoutUser = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return true;
  } catch (error: any) {
    toast({
      title: "Erro ao sair",
      description: error.message || "Não foi possível encerrar sua sessão",
      variant: "destructive",
    });
    return false;
  }
};

export const setupAuthListener = (
  onAuthChange: (user: User | null) => void
) => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    async (event, session) => {
      if (session?.user) {
        onAuthChange(mapSupabaseUser(session.user));
      } else {
        onAuthChange(null);
      }
    }
  );

  return subscription;
};
