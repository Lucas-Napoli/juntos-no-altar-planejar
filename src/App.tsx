
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";

// Authentication Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import SetupWedding from "./pages/auth/SetupWedding";

// Dashboard Layout & Pages
import DashboardLayout from "./components/layouts/DashboardLayout";
import Dashboard from "./pages/dashboard/Dashboard";
import GuestList from "./pages/guests/GuestList";
import NotFound from "./pages/NotFound";
import Index from "./pages/Index";

const App = () => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public landing page */}
            <Route path="/" element={<Index />} />
            
            {/* Auth routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/setup" element={<SetupWedding />} />
            
            {/* Protected dashboard routes */}
            <Route path="/" element={<DashboardLayout />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="guests" element={<GuestList />} />
              <Route path="budget" element={<Dashboard />} /> {/* Placeholder */}
              <Route path="tasks" element={<Dashboard />} /> {/* Placeholder */}
              <Route path="vendors" element={<Dashboard />} /> {/* Placeholder */}
            </Route>
            
            {/* Catch all other routes */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
