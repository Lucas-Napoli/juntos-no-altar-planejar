
import { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { fetchUserWedding, setupWedding as setupWeddingService } from '@/services/wedding-service';
import { 
  getCurrentUser, 
  setupAuthListener, 
  loginWithPassword, 
  registerUser, 
  logoutUser 
} from '@/services/auth-service';
import { toast } from '@/hooks/use-toast';

export const useAuth = () => {
  const { setUser, setWedding, user } = useStore();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    
    // Check for active session on mount
    const initAuth = async () => {
      setIsLoading(true);
      try {
        const userData = await getCurrentUser();
        
        if (userData && isMounted) {
          // Set user data
          setUser(userData);
          
          console.log("Usuário autenticado:", userData);
          
          // Get wedding data for the user
          const wedding = await fetchUserWedding(userData.id);
          
          if (wedding && isMounted) {
            console.log("Dados do casamento carregados:", wedding);
            setWedding(wedding);
          } else {
            console.log("Nenhum dado de casamento encontrado para o usuário");
            setWedding(null);
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    initAuth();

    // Listen for auth changes
    const subscription = setupAuthListener(async (userData) => {
      if (userData && isMounted) {
        // Set user data
        setUser(userData);
        
        // Get wedding data for the user
        const wedding = await fetchUserWedding(userData.id);
        
        if (wedding && isMounted) {
          setWedding(wedding);
        } else {
          setWedding(null);
        }
      } else if (isMounted) {
        setUser(null);
        setWedding(null);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [setUser, setWedding]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const result = await loginWithPassword(email, password);
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const result = await registerUser(email, password);
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await logoutUser();
      // Garantir que os estados sejam limpos depois do logout
      setUser(null);
      setWedding(null);
    } finally {
      setIsLoading(false);
    }
  };

  const setupWedding = async (coupleName: string, weddingDate: Date, partnerEmail?: string) => {
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
      } else {
        console.log("Falha ao configurar casamento");
      }
      
      return wedding;
    } catch (error) {
      console.error("Erro ao configurar casamento:", error);
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
