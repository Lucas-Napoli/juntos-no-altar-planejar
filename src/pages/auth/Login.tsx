
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { toast } from '@/hooks/use-toast';
import AuthLayout from '@/components/layouts/AuthLayout';
import useAuth from '@/hooks/use-auth';

// Form validation schema
const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const { login, setupWedding, isLoading } = useAuth();
  const navigate = useNavigate();

  // Initialize form
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Form submission handler
  const onSubmit = async (data: LoginFormValues) => {
    const result = await login(data.email, data.password);
    
    if (result.user) {
      // Verificar se há configurações de casamento pendentes
      const pendingSetupStr = localStorage.getItem('pendingWeddingSetup');
      
      if (pendingSetupStr) {
        try {
          const pendingSetup = JSON.parse(pendingSetupStr);
          
          // Configurar casamento com os dados salvos
          const setupResult = await setupWedding(
            pendingSetup.coupleName, 
            new Date(pendingSetup.weddingDate)
          );
          
          if (setupResult) {
            // Limpar dados pendentes após configuração bem-sucedida
            localStorage.removeItem('pendingWeddingSetup');
            toast({
              title: "Configuração concluída",
              description: "Seu casamento foi configurado com sucesso!",
            });
          }
        } catch (error) {
          console.error("Erro ao processar configuração pendente:", error);
        }
      }
      
      navigate('/dashboard');
    }
  };

  return (
    <AuthLayout 
      title="Login" 
      description="Entre na sua conta para acessar seu planejamento"
      footer={
        <div className="text-sm text-muted-foreground">
          Não tem uma conta?{' '}
          <Link to="/register" className="text-primary hover:underline">
            Registre-se
          </Link>
        </div>
      }
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail</FormLabel>
                <FormControl>
                  <Input placeholder="seu@email.com" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Senha</FormLabel>
                <FormControl>
                  <Input placeholder="******" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>
      </Form>
    </AuthLayout>
  );
};

export default Login;
