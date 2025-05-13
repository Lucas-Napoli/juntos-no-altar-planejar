
import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Navigate, useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { toast } from '@/hooks/use-toast';
import AuthLayout from '@/components/layouts/AuthLayout';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { useStore } from '@/lib/store';
import { useAuth } from '@/hooks/use-auth';

// Form validation schema
const setupSchema = z.object({
  coupleName: z.string().min(2, 'Nome do casal é obrigatório'),
  weddingDate: z.date({
    required_error: 'Data do casamento é obrigatória',
  }).refine(date => date > new Date(), {
    message: 'A data do casamento deve ser no futuro'
  }),
  partnerEmail: z.string().email('E-mail inválido').optional().or(z.literal('')),
});

type SetupFormValues = z.infer<typeof setupSchema>;

const SetupWedding = () => {
  const { user, wedding } = useStore();
  const { setupWedding } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Redirect if user is not logged in
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Redirect if wedding already exists
  if (wedding) {
    return <Navigate to="/dashboard" />;
  }

  // Initialize form
  const form = useForm<SetupFormValues>({
    resolver: zodResolver(setupSchema),
    defaultValues: {
      coupleName: '',
      partnerEmail: '',
    },
  });

  // Form submission handler
  const onSubmit = async (data: SetupFormValues) => {
    setIsLoading(true);
    
    try {
      const wedding = await setupWedding(data.coupleName, data.weddingDate, data.partnerEmail);
      
      if (wedding) {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Setup error:', error);
      toast({
        title: "Erro ao configurar casamento",
        description: "Por favor, tente novamente",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Configure seu casamento" 
      description="Forneça os detalhes do seu grande dia"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="coupleName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do casal</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Maria & João" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="weddingDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data do casamento</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "dd/MM/yyyy")
                        ) : (
                          <span>Selecione uma data</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date()}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="partnerEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail do(a) parceiro(a)</FormLabel>
                <FormControl>
                  <Input placeholder="parceiro@email.com" type="email" {...field} />
                </FormControl>
                <FormDescription>
                  Opcional: convidar o(a) parceiro(a) para planejar junto
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Configurando...' : 'Começar a planejar'}
          </Button>
        </form>
      </Form>
    </AuthLayout>
  );
};

export default SetupWedding;
