
import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useStore } from '@/lib/store';
import Sidebar from '@/components/navigation/Sidebar';
import TopBar from '@/components/navigation/TopBar';

const DashboardLayout = () => {
  const { user, wedding, isSidebarOpen, setSidebarOpen } = useStore();

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

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Redirect to setup if no wedding data
  if (!wedding) {
    return <Navigate to="/setup" />;
  }

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
