
import { supabase } from '@/integrations/supabase/client';
import { Wedding } from '@/lib/store';
import { mapWeddingData } from '@/lib/mappers/supabase-mappers';
import { toast } from '@/hooks/use-toast';

export const fetchUserWedding = async (userId: string): Promise<Wedding | null> => {
  try {
    const { data: wedding, error } = await supabase
      .from('weddings')
      .select('*')
      .eq('owner_id', userId)
      .maybeSingle();
    
    if (error) throw error;
    return mapWeddingData(wedding);
  } catch (error: any) {
    console.error('Error fetching wedding:', error);
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
    
    if (error) throw error;
    
    // Send invitation to partner if email provided
    if (partnerEmail && partnerEmail.trim() !== '') {
      // In a real app, we would send an email invitation here
      console.log(`Invitation would be sent to ${partnerEmail}`);
    }
    
    toast({
      title: "Casamento configurado",
      description: "Seu planejamento de casamento foi criado com sucesso!",
    });
    
    return mapWeddingData(wedding);
  } catch (error: any) {
    toast({
      title: "Erro na configuração",
      description: error.message || "Não foi possível configurar seu casamento",
      variant: "destructive",
    });
    return null;
  }
};
