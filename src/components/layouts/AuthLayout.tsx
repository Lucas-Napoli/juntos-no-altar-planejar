
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useStore } from '@/lib/store';
import { Navigate } from 'react-router-dom';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  footer?: React.ReactNode;
}

const AuthLayout = ({
  children,
  title,
  description,
  footer
}: AuthLayoutProps) => {
  const { user } = useStore();
  
  // Redirect to dashboard if user is already logged in
  if (user) {
    return <Navigate to="/dashboard" />;
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-wedding-light to-background flex items-center justify-center p-4">
      <div className="max-w-md w-full animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-wedding-secondary">PlanejaJunto</h1>
          <p className="text-muted-foreground mt-2">Planejamento de casamento para casais</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </CardHeader>
          <CardContent>
            {children}
          </CardContent>
          {footer && (
            <CardFooter className="flex justify-center">
              {footer}
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
};

export default AuthLayout;
