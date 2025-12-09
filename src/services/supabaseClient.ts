// src/services/supabaseClient.ts

import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Lendo as chaves (elas serão strings vazias se não forem encontradas)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''; 
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

let supabase: SupabaseClient | undefined; // O cliente pode ser undefined

if (!supabaseUrl || !supabaseAnonKey) {
  // Apenas avisa. O cliente permanece undefined.
  console.warn("AVISO: Chaves Supabase não configuradas. A persistência de dados estará desativada.");
} else {
  // SÓ INICIALIZA SE AS CHAVES EXISTIREM
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  } catch (error) {
    console.error("Erro ao inicializar o Supabase, mas a URL/Key existe:", error);
  }
}

// Exporta o cliente (pode ser um cliente Supabase ou undefined)
export { supabase };