
import { User, Wedding } from '@/lib/store';

// Helper function to map Supabase user to our store User type
export const mapSupabaseUser = (supabaseUser: any): User => {
  return {
    id: supabaseUser.id,
    name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || 'User',
    email: supabaseUser.email
  };
};

// Helper function to map database wedding to our store Wedding type
export const mapWeddingData = (weddingData: any): Wedding | null => {
  if (!weddingData) return null;
  
  return {
    id: weddingData.id,
    coupleName: weddingData.couple_name,
    weddingDate: weddingData.wedding_date,
    ownerId: weddingData.owner_id,
    partnerId: weddingData.partner_id
  };
};
