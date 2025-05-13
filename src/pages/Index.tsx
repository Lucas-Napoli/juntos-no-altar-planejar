
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useStore } from '@/lib/store';

const Index = () => {
  const { user } = useStore();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-wedding-light to-background">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6">
        <div className="text-2xl font-bold text-wedding-secondary">
          PlanejaJunto
        </div>
        
        <div className="flex gap-4">
          {user ? (
            <Button asChild>
              <Link to="/dashboard">Meu Planejamento</Link>
            </Button>
          ) : (
            <>
              <Button variant="outline" asChild>
                <Link to="/login">Entrar</Link>
              </Button>
              <Button asChild>
                <Link to="/register">Registrar</Link>
              </Button>
            </>
          )}
        </div>
      </nav>
      
      {/* Hero Section */}
      <div className="container px-4 py-20 flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 space-y-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-wedding-dark">
            Planejem juntos o 
            <span className="text-wedding-secondary"> casamento </span>
            dos seus sonhos
          </h1>
          
          <p className="text-lg text-muted-foreground max-w-md">
            Uma plataforma colaborativa para que casais possam organizar cada detalhe do grande dia com facilidade.
          </p>
          
          <div className="flex flex-wrap gap-3 pt-4">
            <Button size="lg" className="bg-wedding-secondary" asChild>
              <Link to="/register">Começar agora</Link>
            </Button>
            
            <Button size="lg" variant="outline" asChild>
              <Link to="/login">Já tem uma conta?</Link>
            </Button>
          </div>
        </div>
        
        <div className="flex-1 flex justify-center">
          <div className="w-full max-w-md aspect-square rounded-full bg-wedding-primary bg-opacity-20 flex items-center justify-center">
            <div className="text-center p-8">
              <div className="text-5xl font-semibold text-wedding-primary mb-4">
                PlanejaJunto
              </div>
              <div className="text-lg text-muted-foreground">
                Conecte-se ao Supabase para iniciar
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="container px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">
          Tudo o que você precisa para o seu casamento
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard 
            title="Lista de Convidados" 
            description="Gerencie convidados, confirmações e acompanhantes em um só lugar."
          />
          <FeatureCard 
            title="Controle de Orçamento" 
            description="Acompanhe todos os gastos e visualize em categorias para não estourar o orçamento."
          />
          <FeatureCard 
            title="Checklist de Tarefas" 
            description="Organize tarefas entre o casal para não esquecer nenhum detalhe."
          />
          <FeatureCard 
            title="Gestão de Fornecedores" 
            description="Armazene contatos e contratos de todos os fornecedores do evento."
          />
        </div>
      </div>
      
      {/* Call to Action */}
      <div className="bg-wedding-secondary bg-opacity-10 py-16 px-4">
        <div className="container text-center max-w-2xl mx-auto">
          <h3 className="text-3xl font-bold mb-4">
            Pronto para começar a planejar?
          </h3>
          <p className="text-lg text-muted-foreground mb-8">
            Junte-se a outros casais que estão tornando o planejamento do casamento uma experiência incrível.
          </p>
          <Button size="lg" className="bg-wedding-secondary" asChild>
            <Link to="/register">Criar minha conta grátis</Link>
          </Button>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-wedding-dark text-white py-12 px-4">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-8 md:mb-0">
              <div className="text-xl font-bold text-wedding-secondary mb-2">
                PlanejaJunto
              </div>
              <p className="text-sm text-gray-400">
                Planejamento de casamento para casais
              </p>
            </div>
            
            <div className="text-sm text-gray-400">
              © {new Date().getFullYear()} PlanejaJunto. Todos os direitos reservados.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

interface FeatureCardProps {
  title: string;
  description: string;
}

const FeatureCard = ({ title, description }: FeatureCardProps) => (
  <div className="bg-white rounded-lg p-6 shadow-sm border border-border">
    <h3 className="text-xl font-semibold mb-3 text-wedding-secondary">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </div>
);

export default Index;
