
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Define Wedding Type
export type Wedding = {
  id: string;
  coupleName: string;
  weddingDate: string;
  ownerId: string;
  partnerId: string | null;
};

// Define User Type
export type User = {
  id: string;
  name: string;
  email: string;
};

// Define Store Types
interface AppState {
  // Auth
  user: User | null;
  wedding: Wedding | null;
  
  // UI State
  isLoading: boolean;
  isSidebarOpen: boolean;
  
  // Actions
  setUser: (user: User | null) => void;
  setWedding: (wedding: Wedding | null) => void;
  setLoading: (isLoading: boolean) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  resetStore: () => void;
}

// Create zustand store with persistence
export const useStore = create<AppState>()(
  persist(
    (set) => ({
      // Initial state
      user: null,
      wedding: null,
      isLoading: false,
      isSidebarOpen: true,
      
      // Actions
      setUser: (user) => set({ user }),
      setWedding: (wedding) => set({ wedding }),
      setLoading: (isLoading) => set({ isLoading }),
      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      setSidebarOpen: (open) => set({ isSidebarOpen: open }),
      resetStore: () => set({ user: null, wedding: null }),
    }),
    {
      name: 'planejajunto-storage',
      partialize: (state) => ({ user: state.user, wedding: state.wedding }),
    }
  )
);
