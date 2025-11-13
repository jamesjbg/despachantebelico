import { createClient } from '@supabase/supabase-js';

// As chaves agora são lidas das Variáveis de Ambiente configuradas na Vercel.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("As variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY precisam ser definidas no ambiente de implantação (Vercel).");
}

export const supabase = createClient(supabaseUrl, supabaseKey);