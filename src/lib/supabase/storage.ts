import { supabase, isSupabaseConfigured } from './client';

const env: Record<string, string | undefined> =
  typeof import.meta !== 'undefined' && import.meta.env
    ? (import.meta.env as any)
    : typeof process !== 'undefined' && process.env
    ? process.env
    : {};

/**
 * Centralized Supabase Storage bucket name for CMS media
 * Defaults to 'public-cms-media' as configured in Supabase Storage setup
 */
export const CMS_STORAGE_BUCKET = (
  env.VITE_SUPABASE_STORAGE_BUCKET ||
  env.SUPABASE_STORAGE_BUCKET ||
  'public-cms-media'
).trim().replace(/^["']|["']$/g, '');

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
 * Check if the configured public storage bucket exists in Supabase
 */
export async function verifyStorageBucketExists(): Promise<{ exists: boolean; error?: string }> {
  if (!isSupabaseConfigured) return { exists: false, error: 'Supabase is not configured' };
  try {
    const { data, error } = await supabase.storage.getBucket(CMS_STORAGE_BUCKET);
    if (error) {
      return { exists: false, error: error.message };
    }
    return { exists: Boolean(data) };
  } catch (err: any) {
    return { exists: false, error: err?.message || 'Storage check failed' };
  }
}

/**
 * Upload an admin asset to the Supabase Storage bucket
 */
export async function uploadCmsMedia(
  file: File,
  folder: string = 'demos'
): Promise<UploadMediaResult> {
  // Validate MIME type
  if (!ALLOWED_IMAGE_MIME_TYPES.includes(file.type)) {
    throw new Error(`Unsupported file type: ${file.type}. Allowed formats: JPG, PNG, WebP.`);
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

  if (!isSupabaseConfigured) {
    // Convert to Data URL for client-side persistence in sandbox
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Failed to read image file'));
      reader.readAsDataURL(file);
    });

    return {
      publicUrl: dataUrl,
      storagePath,
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type,
    };
  }

  const { data, error } = await supabase.storage
    .from(CMS_STORAGE_BUCKET)
    .upload(storagePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    const errorMsg = (error.message || '').toLowerCase();
    const statusCode = (error as any)?.statusCode || (error as any)?.status;
    const errorCode = (error as any)?.code || (error as any)?.error;

    if (
      errorMsg.includes('bucket not found') ||
      statusCode === 404 ||
      statusCode === '404' ||
      errorCode === 'NoSuchBucket'
    ) {
      throw new Error(
        `Supabase Storage bucket "${CMS_STORAGE_BUCKET}" not found in your Supabase project. Please execute the storage SQL migration to create the bucket or create "${CMS_STORAGE_BUCKET}" as a Public bucket in Supabase Storage.`
      );
    }
    throw error;
  }

  const { data: publicUrlData } = supabase.storage
    .from(CMS_STORAGE_BUCKET)
    .getPublicUrl(data.path);

  return {
    publicUrl: publicUrlData.publicUrl,
    storagePath: data.path,
    fileName: file.name,
    fileSize: file.size,
    mimeType: file.type,
  };
}
