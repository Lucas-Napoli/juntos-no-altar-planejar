
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

export const useAuth = () => {
  const { setUser, setWedding, user } = useStore();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check for active session on mount
    const initAuth = async () => {
      setIsLoading(true);
      try {
        const userData = await getCurrentUser();
        
        if (userData) {
          // Set user data
          setUser(userData);
          
          // Get wedding data for the user
          const wedding = await fetchUserWedding(userData.id);
          
          if (wedding) {
            setWedding(wedding);
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    // Listen for auth changes
    const subscription = setupAuthListener(async (userData) => {
      if (userData) {
        // Set user data
        setUser(userData);
        
        // Get wedding data for the user
        const wedding = await fetchUserWedding(userData.id);
        
        if (wedding) {
          setWedding(wedding);
        }
      } else {
        setUser(null);
        setWedding(null);
      }
    });

    return () => {
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
    } finally {
      setIsLoading(false);
    }
  };

  const setupWedding = async (coupleName: string, weddingDate: Date, partnerEmail?: string) => {
    if (!user) return null;
    
    setIsLoading(true);
    try {
      const wedding = await setupWeddingService(user.id, coupleName, weddingDate, partnerEmail);
      
      if (wedding) {
        setWedding(wedding);
      }
      
      return wedding;
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
