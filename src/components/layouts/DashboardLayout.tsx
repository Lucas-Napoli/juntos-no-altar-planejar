
import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useStore } from '@/lib/store';
import Sidebar from '@/components/navigation/Sidebar';
import TopBar from '@/components/navigation/TopBar';
import { Loader2 } from 'lucide-react';

const DashboardLayout = () => {
  const { user, wedding, isSidebarOpen, setSidebarOpen } = useStore();
  const [isLoading, setIsLoading] = useState(true);

  // Add a small delay to ensure the store is properly loaded
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  // Handle responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    // Initialize based on current window size
    handleResize();

    // Set up event listener
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, [setSidebarOpen]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-wedding-secondary" />
        <span className="ml-2">Carregando...</span>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    console.log("Não há usuário autenticado, redirecionando para login");
    return <Navigate to="/login" replace />;
  }

  // Redirect to setup if no wedding data
  if (!wedding) {
    console.log("Usuário autenticado, mas sem dados de casamento, redirecionando para setup");
    return <Navigate to="/setup" replace />;
  }

  console.log("Usuário autenticado e dados de casamento presentes, exibindo dashboard");
  
  return (
    <div className="h-screen flex flex-col">
      <TopBar />
      
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        
        <main className={`flex-1 overflow-y-auto p-4 md:p-6 transition-all ${isSidebarOpen ? 'md:ml-64' : ''}`}>
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
