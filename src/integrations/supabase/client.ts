
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://vkqxqoexnbaehhyaxraz.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZrcXhxb2V4bmJhZWhoeWF4cmF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxNzk2MzQsImV4cCI6MjA2Mjc1NTYzNH0.cn5V71UlS-W1M_Mo6K55xPZy5UnnCjWJui5Gq_j9bvs";

// Configure the Supabase client with explicit auth options
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});

// To import the supabase client, use:
// import { supabase } from "@/integrations/supabase/client";
