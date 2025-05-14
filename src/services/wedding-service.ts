
import { supabase } from '@/integrations/supabase/client';
import { Wedding } from '@/lib/store';
import { mapWeddingData } from '@/lib/mappers/supabase-mappers';
import { toast } from '@/hooks/use-toast';

export const fetchUserWedding = async (userId: string): Promise<Wedding | null> => {
  try {
    console.log("Buscando dados de casamento para usuário:", userId);
    
    const { data: wedding, error } = await supabase
      .from('weddings')
      .select('*')
      .eq('owner_id', userId)
      .maybeSingle();
    
    if (error) {
      console.error('Erro ao buscar casamento:', error);
      throw error;
    }
    
    if (!wedding) {
      console.log("Nenhum casamento encontrado para este usuário");
      return null;
    }
    
    console.log("Casamento encontrado:", wedding);
    return mapWeddingData(wedding);
  } catch (error: any) {
    console.error('Erro ao buscar casamento:', error);
    return null;
  }
};

export const setupWedding = async (
  userId: string,
  coupleName: string, 
  weddingDate: Date, 
  partnerEmail?: string
): Promise<Wedding | null> => {
  try {
    console.log("Configurando casamento para usuário:", userId);
    console.log("Dados:", { coupleName, weddingDate, partnerEmail });
    
    // Check if a wedding already exists for this user
    const existingWedding = await fetchUserWedding(userId);
    if (existingWedding) {
      console.log("Casamento já existe para este usuário, retornando dados existentes");
      return existingWedding;
    }
    
    // Create the wedding
    const { data: wedding, error } = await supabase
      .from('weddings')
      .insert([
        { 
          couple_name: coupleName, 
          wedding_date: weddingDate.toISOString().split('T')[0],
          owner_id: userId,
          partner_id: null // Will be updated if partner is invited
        }
      ])
      .select()
      .single();
    
    if (error) {
      console.error('Erro ao criar casamento:', error);
      throw error;
    }
    
    if (!wedding) {
      console.error('Nenhum casamento retornado após inserção');
      return null;
    }
    
    // Send invitation to partner if email provided
    if (partnerEmail && partnerEmail.trim() !== '') {
      // In a real app, we would send an email invitation here
      console.log(`Convite seria enviado para ${partnerEmail}`);
    }
    
    console.log("Casamento configurado com sucesso:", wedding);
    
    toast({
      title: "Casamento configurado",
      description: "Seu planejamento de casamento foi criado com sucesso!",
    });
    
    return mapWeddingData(wedding);
  } catch (error: any) {
    console.error('Erro na configuração do casamento:', error);
    toast({
      title: "Erro na configuração",
      description: error.message || "Não foi possível configurar seu casamento",
      variant: "destructive",
    });
    return null;
  }
};
