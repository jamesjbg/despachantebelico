
import { supabase } from './supabaseClient';
import { Product, Promotion, ThemeTab, ColorPalette, Testimonial, SiteContent } from '../types';
import { COLOR_PALETTES, INITIAL_PROMOTION, INITIAL_SITE_CONTENT } from '../constants';

// Generic error handler
const handleError = (error: any, context: string) => {
  const message = error.message || 'Ocorreu um erro desconhecido.';
  console.error(`Supabase error in ${context}:`, error);
  
  // Check for common RLS error message and provide a helpful tip.
  if (message.includes('new row violates row-level security policy') || message.includes('policy')) {
    throw new Error(`Erro de permissão ao tentar '${context}'. Verifique se a Segurança em Nível de Linha (RLS) está desativada para a tabela correspondente no painel do Supabase.`);
  }

  throw new Error(`Falha em '${context}': ${message}`);
};

// --- Fetch All Initial Data ---
export const fetchAllData = async () => {
  try {
    const [
      productsRes,
      promotionRes,
      tabsRes,
      testimonialsRes,
      siteContentRes,
      themeRes
    ] = await Promise.all([
      supabase.from('products').select('*').order('name', { ascending: true }),
      supabase.from('promotion').select('*').limit(1).maybeSingle(),
      supabase.from('tabs').select('*').order('title', { ascending: true }),
      supabase.from('testimonials').select('*'),
      supabase.from('site_content').select('*').limit(1).maybeSingle(),
      supabase.from('theme').select('*').limit(1).maybeSingle(),
    ]);

    if (productsRes.error) throw productsRes.error;
    if (promotionRes.error) throw promotionRes.error;
    if (tabsRes.error) throw tabsRes.error;
    if (testimonialsRes.error) throw testimonialsRes.error;
    if (siteContentRes.error) throw siteContentRes.error;
    if (themeRes.error) throw themeRes.error;
    
    const themeData = themeRes.data;
    const currentPalette: ColorPalette = themeData 
      ? { name: themeData.name, colors: themeData.colors }
      : COLOR_PALETTES[0];

    const rawTestimonials = testimonialsRes.data;
    const validTestimonials = Array.isArray(rawTestimonials)
      ? rawTestimonials.filter(t => t && typeof t.id !== 'undefined' && t.id !== null) as Testimonial[]
      : [];

    return {
      products: productsRes.data as Product[] || [],
      promotion: promotionRes.data as Promotion || INITIAL_PROMOTION,
      tabs: tabsRes.data as ThemeTab[] || [],
      testimonials: validTestimonials,
      _rawTestimonials: rawTestimonials, // For diagnostics
      siteContent: siteContentRes.data as SiteContent || INITIAL_SITE_CONTENT,
      currentPalette: currentPalette,
    };
  } catch (error) {
    handleError(error, 'fetchAllData');
    return null;
  }
};


// --- Products ---
export const addProduct = async (product: Omit<Product, 'id'>): Promise<Product> => {
    const { data, error } = await supabase.from('products').insert(product).select().single();
    if (error) handleError(error, 'adicionar produto');
    return data as Product;
};
export const updateProduct = async (product: Product): Promise<Product> => {
    const { data, error } = await supabase.from('products').update(product).eq('id', product.id).select().single();
    if (error) handleError(error, 'atualizar produto');
    return data as Product;
};
export const deleteProduct = async (id: string) => {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) handleError(error, 'deletar produto');
};

// --- Tabs ---
export const addTab = async (tab: Omit<ThemeTab, 'id'>): Promise<ThemeTab> => {
    const newTab = { ...tab, id: tab.title.toLowerCase().replace(/\s+/g, '-') + Date.now() }
    const { data, error } = await supabase.from('tabs').insert(newTab).select().single();
    if (error) handleError(error, 'adicionar aba');
    return data as ThemeTab;
};
export const updateTab = async (tab: ThemeTab): Promise<ThemeTab> => {
    const { data, error } = await supabase.from('tabs').update(tab).eq('id', tab.id).select().single();
    if (error) handleError(error, 'atualizar aba');
    return data as ThemeTab;
};
export const deleteTab = async (id: string) => {
    const { error } = await supabase.from('tabs').delete().eq('id', id);
    if (error) handleError(error, 'deletar aba');
};

// --- Testimonials ---
export const addTestimonial = async (testimonial: Omit<Testimonial, 'id'>): Promise<Testimonial> => {
    const { data, error } = await supabase.from('testimonials').insert(testimonial).select().single();
    if (error) handleError(error, 'adicionar feedback');
    return data as Testimonial;
};
export const updateTestimonial = async (testimonial: Testimonial): Promise<Testimonial> => {
    const { data, error } = await supabase.from('testimonials').update(testimonial).eq('id', testimonial.id).select().single();
    if (error) handleError(error, 'atualizar feedback');
    return data as Testimonial;
};
export const deleteTestimonial = async (id: string) => {
    const { error } = await supabase.from('testimonials').delete().eq('id', id);
    if (error) handleError(error, 'deletar feedback');
};


// --- Single Row Tables (Promotion, SiteContent, Theme) ---
export const updatePromotion = async (promotion: Promotion): Promise<Promotion> => {
    const { data, error } = await supabase.from('promotion').upsert(promotion).select().single();
    if (error) handleError(error, 'atualizar promoção');
    return data as Promotion;
};

export const updateSiteContent = async (content: SiteContent): Promise<SiteContent> => {
    const { data, error } = await supabase.from('site_content').upsert(content).select().single();
    if (error) handleError(error, 'atualizar conteúdo do site');
    return data as SiteContent;
};

export const updateTheme = async (palette: ColorPalette): Promise<ColorPalette> => {
    const themeToSave = {
        id: 'current_theme',
        name: palette.name,
        colors: palette.colors,
    };
    const { data, error } = await supabase.from('theme').upsert(themeToSave).select().single();
    if (error) handleError(error, 'atualizar tema');
    return { name: data.name, colors: data.colors };
};
