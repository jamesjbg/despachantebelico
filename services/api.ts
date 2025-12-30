import { supabase } from '../lib/supabaseClient';
import type { Service, Post, Testimonial, Client, DocumentTemplate, AssetFile, Product } from '../types';

// --- Helper para Checklist Padrão ---
const ensureServiceChecklist = (service: Service): Service => {
    if (service.document_checklist && service.document_checklist.length > 0) {
        return service;
    }
    const s = { ...service };
    const titleLower = s.title.toLowerCase();

    if (titleLower.includes('concessão')) {
        s.document_checklist = [
            'Comprovante de Capacidade Técnica',
            'Laudo de Aptidão Psicológica',
            'Certidões de Antecedentes Criminais (Federal, Estadual, Militar, Eleitoral)',
            'Declaração de Idoneidade',
            'Documento de Identificação Pessoal (RG/CNH)',
            'Comprovante de Residência Fixa',
            'Comprovante de Ocupação Lícita',
            'Declaração de Segurança do Acervo',
            'Comprovante de Filiação a Clube de Tiro'
        ];
    } else if (titleLower.includes('renovação')) {
        s.document_checklist = [
            'Requerimento de Renovação',
            'Cópia do CR anterior',
            'Documento de Identificação Pessoal',
            'Comprovante de Residência Atualizado',
            'Laudo de Aptidão Psicológica',
            'Comprovante de Capacidade Técnica',
            'Declaração de Habitualidade',
            'Certidões Negativas'
        ];
    }
    return s;
};

// --- Asset Management (Storage) ---
export const uploadAsset = async (file: File) => {
    // Limpeza de nome do arquivo para evitar erros no banco
    const fileExt = file.name.split('.').pop();
    const cleanFileName = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
    const filePath = `public/${cleanFileName}`;

    const { error } = await supabase.storage.from('assets').upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
    });
    
    if (error) {
        console.error("Erro no upload Supabase:", error);
        if (error.message.includes('row-level security')) {
            throw new Error("Erro de Permissão: Você precisa rodar o script SQL em Configurações > Manutenção.");
        }
        throw error;
    }
    
    const { data } = supabase.storage.from('assets').getPublicUrl(filePath);
    return data.publicUrl;
};

export const listAssets = async (): Promise<AssetFile[]> => {
    const { data, error } = await supabase.storage.from('assets').list('public', { limit: 100 });
    if (error) return [];
    return (data || []).map(item => ({ name: item.name, created_at: item.created_at }));
};

export const deleteAsset = async (assetName: string) => {
    const filePath = `public/${assetName}`;
    const { error } = await supabase.storage.from('assets').remove([filePath]);
    if (error) throw error;
    return { success: true };
};

// --- Settings API ---
export const getSettings = async () => {
    const { data, error } = await supabase.from('settings').select('settings_data').eq('id', 1).single();
    if (error) throw error;
    return data.settings_data;
};

export const saveSettings = async (settings: any) => {
    const { data, error } = await supabase.from('settings').update({ settings_data: settings }).eq('id', 1).select().single();
    if (error) throw error;
    return data;
};

// --- Public API ---
export const getServices = async (): Promise<Service[]> => {
    const { data, error } = await supabase.from('services').select('*').order('title');
    if (error) throw error;
    return (data || []).map(ensureServiceChecklist);
};
export const getPosts = async (limit?: number): Promise<Post[]> => {
    let query = supabase.from('posts').select('*').order('created_at', { descending: true });
    if (limit) query = query.limit(limit);
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
};
export const getTestimonials = async (): Promise<Testimonial[]> => {
    const { data, error } = await supabase.from('testimonials').select('*').order('created_at');
    if (error) throw error;
    return data || [];
};
export const getPostById = async (id: string): Promise<Post | null> => {
    const { data, error } = await supabase.from('posts').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
};
export const getServiceById = async (id: string): Promise<Service | null> => {
    const { data, error } = await supabase.from('services').select('*').eq('id', id).single();
    if (error) throw error;
    return data ? ensureServiceChecklist(data) : null;
};
export const getPublicProducts = async (): Promise<Product[]> => {
    const { data, error } = await supabase.from('products').select('*').order('nome_completo');
    if (error) throw error;
    return data || [];
};
export const getFeaturedProducts = async (limit?: number): Promise<Product[]> => {
    let query = supabase.from('products').select('*').eq('featured', true).order('created_at', { descending: true });
    if (limit) query = query.limit(limit);
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
};

// --- Admin API ---
export const getAdminServices = getServices;
export const saveAdminService = async (service: Partial<Service>) => {
    const { data, error } = await supabase.from('services').upsert(service).select().single();
    if (error) throw error;
    return data;
};
export const deleteAdminService = async (id: string) => {
    const { data, error } = await supabase.from('services').delete().eq('id', id).select();
    if (error) throw error;
    return { success: true };
};
export const getAdminPosts = getPosts;
export const saveAdminPost = async (post: Partial<Post>) => {
    if (!post.id) post.created_at = new Date().toISOString();
    const { data, error } = await supabase.from('posts').upsert(post).select().single();
    if (error) throw error;
    return data;
};
export const deleteAdminPost = async (id: string) => {
    const { error } = await supabase.from('posts').delete().eq('id', id);
    if (error) throw error;
    return { success: true };
};
export const getAdminTestimonials = getTestimonials;
export const saveAdminTestimonial = async (testimonial: Partial<Testimonial>) => {
    const { data, error } = await supabase.from('testimonials').upsert(testimonial).select().single();
    if (error) throw error;
    return data;
};
export const deleteAdminTestimonial = async (id: string) => {
    const { error } = await supabase.from('testimonials').delete().eq('id', id);
    if (error) throw error;
    return { success: true };
};

export const getAdminClients = async (): Promise<Client[]> => {
    const { data, error } = await supabase.from('clients').select('*').order('name');
    if (error) throw error;
    return data || [];
};
export const getAdminClientById = async (id: string): Promise<Client | null> => {
    const { data, error } = await supabase.from('clients').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
};
export const saveAdminClient = async (client: Partial<Client>) => {
    const payload = { ...client };
    if (!payload.id || payload.id === 'new') delete payload.id;
    const { data, error } = await supabase.from('clients').upsert(payload).select().single();
    if (error) throw error;
    return data;
};
export const deleteAdminClient = async (id: string) => {
    const { error } = await supabase.from('clients').delete().eq('id', id);
    if (error) throw error;
    return { success: true };
};

export const getAdminDocumentTemplates = async (): Promise<DocumentTemplate[]> => {
    const { data, error } = await supabase.from('document_templates').select('*').order('title');
    if (error) throw error;
    return data || [];
};
export const getAdminDocumentTemplateById = async (id: string): Promise<DocumentTemplate | null> => {
    const { data, error } = await supabase.from('document_templates').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
};
export const saveAdminDocumentTemplate = async (template: Partial<DocumentTemplate>) => {
    const { data, error } = await supabase.from('document_templates').upsert(template).select().single();
    if (error) throw error;
    return data;
};
export const deleteAdminDocumentTemplate = async (id: string) => {
    const { error } = await supabase.from('document_templates').delete().eq('id', id);
    if (error) throw error;
    return { success: true };
};

export const getAdminProducts = getPublicProducts;
export const saveAdminProduct = async (product: Partial<Product>) => {
    const { data, error } = await supabase.from('products').upsert(product).select().single();
    if (error) throw error;
    return data;
};
export const deleteAdminProduct = async (id: string) => {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw error;
    return { success: true };
};
