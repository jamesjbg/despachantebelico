import { supabase } from './supabaseClient';

const BUCKET_NAME = 'images';

/**
 * Sanitizes a string to be URL and file-system friendly.
 * @param name The original file name.
 * @returns A sanitized file name.
 */
const sanitizeFileName = (name: string): string => {
  // Get the name without the extension
  const nameWithoutExt = name.substring(0, name.lastIndexOf('.')) || name;
  
  return nameWithoutExt
    .toLowerCase()
    // Replace accented characters with non-accented ones
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    // Replace spaces and other invalid characters with an underscore
    .replace(/[^a-z0-9_.-]/g, '_')
    // Remove consecutive underscores
    .replace(/_{2,}/g, '_');
};


/**
 * Uploads a file to Supabase Storage and returns its public URL.
 * @param file The file to upload.
 * @returns The public URL of the uploaded file.
 */
export const uploadImage = async (file: File): Promise<string> => {
  try {
    const fileExt = file.name.split('.').pop();
    if (!fileExt) {
      throw new Error("Não foi possível determinar a extensão do arquivo.");
    }

    // Sanitize the original name and append a unique identifier
    const sanitizedBaseName = sanitizeFileName(file.name);
    const fileName = `${sanitizedBaseName}_${Date.now()}.${fileExt}`;
    
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, file);

    if (error) {
      throw error;
    }

    // Get the public URL for the uploaded file
    const { data } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(fileName);
      
    return data.publicUrl;

  } catch (error: any) {
    console.error('Error uploading image:', error);
    if (error.message?.includes('Bucket not found')) {
         throw new Error('Falha no upload: O "bucket" de imagens não foi encontrado no Supabase. Verifique se ele foi criado, chamado "images", e se está público.');
    }
    // Provide a user-friendly error message
    throw new Error('Falha no upload da imagem. Verifique o console para mais detalhes.');
  }
};
