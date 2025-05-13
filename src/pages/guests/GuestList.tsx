
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, User, CheckSquare, X, Pencil } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// Guest type definition
type Guest = {
  id: string;
  name: string;
  email: string;
  phone: string;
  confirmed: boolean;
  companions: number;
};

// Form validation schema
const guestSchema = z.object({
  name: z.string().min(2, 'Nome é obrigatório'),
  email: z.string().email('E-mail inválido').or(z.literal('')),
  phone: z.string().min(8, 'Telefone inválido').or(z.literal('')),
  confirmed: z.boolean().default(false),
  companions: z.number().min(0).default(0),
});

type GuestFormValues = z.infer<typeof guestSchema>;

const GuestList = () => {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  
  // Filter guests based on search and tab
  const filteredGuests = guests.filter(guest => {
    const matchesSearch = guest.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         guest.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'confirmed') return matchesSearch && guest.confirmed;
    if (activeTab === 'pending') return matchesSearch && !guest.confirmed;
    
    return matchesSearch;
  });
  
  // Stats
  const totalGuests = guests.length;
  const confirmedGuests = guests.filter(guest => guest.confirmed).length;
  const totalAttendees = guests.reduce((sum, guest) => 
    sum + (guest.confirmed ? 1 + guest.companions : 0), 0);
  
  // Add new guest
  const handleAddGuest = (data: GuestFormValues) => {
    const newGuest: Guest = {
      id: crypto.randomUUID(),
      ...data,
    };
    
    setGuests(prev => [...prev, newGuest]);
    setIsAddDialogOpen(false);
    toast.success('Convidado adicionado com sucesso');
  };
  
  // Edit guest
  const handleEditGuest = (data: GuestFormValues) => {
    if (!editingGuest) return;
    
    setGuests(prev => prev.map(g => 
      g.id === editingGuest.id ? { ...g, ...data } : g
    ));
    
    setEditingGuest(null);
    toast.success('Convidado atualizado com sucesso');
  };
  
  // Delete guest
  const handleDeleteGuest = (id: string) => {
    setGuests(prev => prev.filter(g => g.id !== id));
    toast.success('Convidado removido com sucesso');
  };
  
  // Toggle confirmation
  const toggleConfirmation = (id: string) => {
    setGuests(prev => prev.map(g => 
      g.id === id ? { ...g, confirmed: !g.confirmed } : g
    ));
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Convidados</h1>
          <p className="text-muted-foreground">
            Gerencie sua lista de convidados aqui.
          </p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Convidado
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Convidado</DialogTitle>
              <DialogDescription>
                Preencha os detalhes do convidado abaixo.
              </DialogDescription>
            </DialogHeader>
            <GuestForm onSubmit={handleAddGuest} onCancel={() => setIsAddDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total de Convidados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalGuests}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Confirmados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{confirmedGuests}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total de Presentes</CardTitle>
            <CardDescription className="text-xs">Inclui acompanhantes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAttendees}</div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Lista de Convidados</CardTitle>
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar convidados..."
              className="max-w-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Tabs defaultValue="all" className="w-full" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 max-w-md">
              <TabsTrigger value="all">Todos</TabsTrigger>
              <TabsTrigger value="confirmed">Confirmados</TabsTrigger>
              <TabsTrigger value="pending">Pendentes</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          {filteredGuests.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm 
                ? "Nenhum convidado encontrado para a busca." 
                : "Nenhum convidado adicionado ainda. Clique em 'Adicionar Convidado' para começar."}
            </div>
          ) : (
            <div className="rounded-md border">
              <div className="grid grid-cols-12 p-4 bg-muted text-sm font-medium">
                <div className="col-span-4">Nome</div>
                <div className="col-span-3">Contato</div>
                <div className="col-span-2 text-center">Confirmado</div>
                <div className="col-span-2 text-center">Acompanhantes</div>
                <div className="col-span-1"></div>
              </div>
              
              {filteredGuests.map((guest) => (
                <div 
                  key={guest.id}
                  className="grid grid-cols-12 p-4 text-sm items-center border-t"
                >
                  <div className="col-span-4 font-medium">{guest.name}</div>
                  <div className="col-span-3 text-muted-foreground">
                    {guest.email || guest.phone}
                  </div>
                  <div className="col-span-2 flex justify-center">
                    <button
                      className={`rounded-md p-1 ${
                        guest.confirmed 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-muted text-muted-foreground'
                      }`}
                      onClick={() => toggleConfirmation(guest.id)}
                    >
                      {guest.confirmed ? (
                        <CheckSquare className="h-4 w-4" />
                      ) : (
                        <User className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  <div className="col-span-2 text-center">
                    {guest.companions}
                  </div>
                  <div className="col-span-1 flex justify-end gap-1">
                    <Dialog open={!!editingGuest} onOpenChange={(open) => !open && setEditingGuest(null)}>
                      <DialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => setEditingGuest(guest)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Editar Convidado</DialogTitle>
                          <DialogDescription>
                            Altere os detalhes do convidado abaixo.
                          </DialogDescription>
                        </DialogHeader>
                        {editingGuest && (
                          <GuestForm 
                            initialData={editingGuest} 
                            onSubmit={handleEditGuest}
                            onCancel={() => setEditingGuest(null)}
                          />
                        )}
                      </DialogContent>
                    </Dialog>
                    
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleDeleteGuest(guest.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

interface GuestFormProps {
  initialData?: Guest;
  onSubmit: (data: GuestFormValues) => void;
  onCancel: () => void;
}

const GuestForm = ({ initialData, onSubmit, onCancel }: GuestFormProps) => {
  const form = useForm<GuestFormValues>({
    resolver: zodResolver(guestSchema),
    defaultValues: initialData ? {
      name: initialData.name,
      email: initialData.email,
      phone: initialData.phone,
      confirmed: initialData.confirmed,
      companions: initialData.companions
    } : {
      name: '',
      email: '',
      phone: '',
      confirmed: false,
      companions: 0
    }
  });
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Nome do convidado" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="email@exemplo.com" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="(00) 00000-0000" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          <FormField
            control={form.control}
            name="confirmed"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Presença Confirmada</FormLabel>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="companions"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Acompanhantes</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    {...field} 
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    min="0"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">
            {initialData ? 'Salvar Alterações' : 'Adicionar Convidado'}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default GuestList;
