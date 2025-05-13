
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useStore } from '@/lib/store';
import { Calendar, CreditCard, User, CheckSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { wedding } = useStore();
  
  // Mock data (in a real app, this would come from Supabase)
  const stats = {
    guests: { total: 0, confirmed: 0 },
    budget: { total: 0, spent: 0 },
    tasks: { total: 0, completed: 0 },
    vendors: { total: 0, contracted: 0 }
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Bem-vindo ao seu Planejamento
          </h1>
          <p className="text-muted-foreground">
            Gerencie todos os detalhes do seu grande dia.
          </p>
        </div>
        
        <WeddingCountdownCard date={wedding?.weddingDate || ''} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Convidados"
          icon={<User className="h-5 w-5" />}
          value={`${stats.guests.confirmed}/${stats.guests.total}`}
          description="convidados confirmados"
          linkTo="/guests"
        />
        
        <StatCard
          title="Orçamento"
          icon={<CreditCard className="h-5 w-5" />}
          value={`R$ ${stats.budget.spent.toLocaleString()}/${stats.budget.total.toLocaleString()}`}
          description={`${stats.budget.total > 0 
            ? Math.round((stats.budget.spent / stats.budget.total) * 100) 
            : 0}% utilizado`}
          linkTo="/budget"
        />
        
        <StatCard
          title="Tarefas"
          icon={<CheckSquare className="h-5 w-5" />}
          value={`${stats.tasks.completed}/${stats.tasks.total}`}
          description="tarefas concluídas"
          linkTo="/tasks"
        />
        
        <StatCard
          title="Fornecedores"
          icon={<Calendar className="h-5 w-5" />}
          value={`${stats.vendors.contracted}/${stats.vendors.total}`}
          description="fornecedores contratados"
          linkTo="/vendors"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TasksPreview />
        <BudgetPreview />
      </div>
    </div>
  );
};

interface StatCardProps {
  title: string;
  icon: React.ReactNode;
  value: string;
  description: string;
  linkTo: string;
}

const StatCard = ({ title, icon, value, description, linkTo }: StatCardProps) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <div className="h-4 w-4 text-muted-foreground">{icon}</div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{description}</p>
      <Button variant="link" className="p-0 h-auto mt-2" asChild>
        <Link to={linkTo}>Ver detalhes</Link>
      </Button>
    </CardContent>
  </Card>
);

const TasksPreview = () => (
  <Card>
    <CardHeader>
      <CardTitle>Próximas Tarefas</CardTitle>
      <CardDescription>Tarefas a serem realizadas em breve</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="text-muted-foreground text-center py-8">
        Conecte o Supabase para visualizar suas tarefas
      </div>
    </CardContent>
  </Card>
);

const BudgetPreview = () => (
  <Card>
    <CardHeader>
      <CardTitle>Resumo do Orçamento</CardTitle>
      <CardDescription>Visão geral dos seus gastos</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="text-muted-foreground text-center py-8">
        Conecte o Supabase para visualizar seu orçamento
      </div>
    </CardContent>
  </Card>
);

const WeddingCountdownCard = ({ date }: { date: string }) => {
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
    return (
      <Card className="min-w-[200px]">
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-wedding-secondary">
              Grande dia chegou! 🎉
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="min-w-[200px]">
      <CardContent className="pt-6">
        <div className="text-center">
          <div className="text-sm text-muted-foreground mb-2">Contagem Regressiva</div>
          <div className="text-3xl font-bold text-wedding-secondary">
            {timeLeft.days} <span className="text-sm font-normal">dias</span>
          </div>
          <div className="text-sm text-muted-foreground mt-1">
            {timeLeft.hours}h {timeLeft.minutes}min
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Dashboard;
