import { supabase, isSupabaseConfigured } from './client';

export const ALLOWED_IMAGE_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

export const MAX_IMAGE_FILE_SIZE = 10 * 1024 * 1024; // 10MB

/**
 * Validate that a URL is safe for external link opening
 * Rejects unsafe schemes such as javascript:, data:, vbscript:
 */
export function isSafeExternalUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim().toLowerCase();
  if (
    trimmed.startsWith('javascript:') ||
    trimmed.startsWith('data:') ||
    trimmed.startsWith('vbscript:') ||
    trimmed.startsWith('file:')
  ) {
    return false;
  }
  return trimmed.startsWith('https://') || trimmed.startsWith('http://') || trimmed.startsWith('/');
}

export interface UploadMediaResult {
  publicUrl: string;
  storagePath: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
}

/**
 * Upload an admin asset to the Supabase Storage bucket
 */
export async function uploadCmsMedia(
  file: File,
  folder: string = 'demos'
): Promise<UploadMediaResult> {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase Storage is not configured. Supply VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
  }

  // Validate MIME type
  if (!ALLOWED_IMAGE_MIME_TYPES.includes(file.type)) {
    throw new Error(`Unsupported file type: ${file.type}. Allowed: JPG, PNG, WebP.`);
  }

  // Validate File Size
  if (file.size > MAX_IMAGE_FILE_SIZE) {
    throw new Error(`File size (${(file.size / 1024 / 1024).toFixed(1)}MB) exceeds maximum limit of 10MB.`);
  }

  // Sanitize file name and create unique path
  const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const cleanBaseName = file.name
    .replace(/\.[^/.]+$/, '')
    .replace(/[^a-zA-Z0-9-_]/g, '_')
    .substring(0, 40);
  const uniqueId = Math.random().toString(36).substring(2, 10);
  const storagePath = `${folder}/${Date.now()}-${uniqueId}-${cleanBaseName}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from('public-cms-media')
    .upload(storagePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    throw error;
  }

  const { data: publicUrlData } = supabase.storage
    .from('public-cms-media')
    .getPublicUrl(data.path);

  return {
    publicUrl: publicUrlData.publicUrl,
    storagePath: data.path,
    fileName: file.name,
    fileSize: file.size,
    mimeType: file.type,
  };
}
