
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useStore } from '@/lib/store';
import { Calendar, User, CreditCard, CheckSquare, Home } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
}

const NavItem = ({ to, icon, label, isActive }: NavItemProps) => (
  <Link
    to={to}
    className={cn(
      "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
      isActive 
        ? "bg-sidebar-accent text-sidebar-accent-foreground" 
        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
    )}
  >
    <div className="flex h-5 w-5 items-center justify-center">
      {icon}
    </div>
    <span>{label}</span>
  </Link>
);

const Sidebar = () => {
  const { isSidebarOpen, wedding } = useStore();
  const location = useLocation();
  
  if (!isSidebarOpen) return null;
  
  return (
    <div className="hidden md:flex flex-col w-64 bg-sidebar fixed inset-y-0 pt-16 z-10 border-r">
      <div className="flex-1 flex flex-col overflow-y-auto p-4">
        <div className="px-3 py-2">
          <h2 className="text-lg font-semibold text-wedding-secondary mb-1">
            {wedding?.coupleName}
          </h2>
          <WeddingCountdown date={wedding?.weddingDate || ''} />
        </div>
        
        <Separator className="my-4" />
        
        <nav className="flex-1 space-y-1">
          <NavItem 
            to="/dashboard" 
            icon={<Home className="h-4 w-4" />} 
            label="Início" 
            isActive={location.pathname === '/dashboard'} 
          />
          <NavItem 
            to="/guests" 
            icon={<User className="h-4 w-4" />} 
            label="Convidados" 
            isActive={location.pathname.startsWith('/guests')} 
          />
          <NavItem 
            to="/budget" 
            icon={<CreditCard className="h-4 w-4" />} 
            label="Orçamento" 
            isActive={location.pathname.startsWith('/budget')} 
          />
          <NavItem 
            to="/tasks" 
            icon={<CheckSquare className="h-4 w-4" />} 
            label="Tarefas" 
            isActive={location.pathname.startsWith('/tasks')} 
          />
          <NavItem 
            to="/vendors" 
            icon={<Calendar className="h-4 w-4" />} 
            label="Fornecedores" 
            isActive={location.pathname.startsWith('/vendors')} 
          />
        </nav>
      </div>
    </div>
  );
};

// Wedding countdown component
const WeddingCountdown = ({ date }: { date: string }) => {
  const [timeLeft, setTimeLeft] = React.useState<{
    days: number;
    hours: number;
    minutes: number;
  } | null>(null);

  React.useEffect(() => {
    if (!date) return;

    const calculateTimeLeft = () => {
      const difference = new Date(date).getTime() - new Date().getTime();
      
      if (difference <= 0) {
        return null;
      }
      
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60)
      };
    };
    
    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 60000); // Update every minute
    
    return () => clearInterval(timer);
  }, [date]);

  if (!timeLeft) {
    return <p className="text-sm text-muted-foreground">Grande dia chegou! 🎉</p>;
  }

  return (
    <div className="text-sm text-muted-foreground">
      <p>Faltam:</p>
      <p className="font-medium text-wedding-secondary">
        {timeLeft.days} dias, {timeLeft.hours} horas
      </p>
    </div>
  );
};

export default Sidebar;
