import { createClient, SupabaseClient } from '@supabase/supabase-js';

const env: Record<string, string | undefined> =
  typeof import.meta !== 'undefined' && import.meta.env
    ? (import.meta.env as any)
    : typeof process !== 'undefined' && process.env
    ? process.env
    : {};

const rawUrl = env.VITE_SUPABASE_URL || env.SUPABASE_URL || '';
const rawKey = env.VITE_SUPABASE_ANON_KEY || env.SUPABASE_ANON_KEY || '';

// Clean whitespace, enclosing quotes, and trailing slashes
const cleanUrl = typeof rawUrl === 'string'
  ? rawUrl.trim().replace(/^["']|["']$/g, '').replace(/\/+$/, '')
  : '';
const cleanKey = typeof rawKey === 'string'
  ? rawKey.trim().replace(/^["']|["']$/g, '')
  : '';

export const isSupabaseConfigured = Boolean(
  cleanUrl &&
  cleanKey &&
  cleanUrl.startsWith('https://') &&
  !cleanUrl.includes('placeholder') &&
  !cleanUrl.includes('your-project-id')
);

// Fallback stub URL to prevent runtime instantiation errors if env vars are pending
const safeUrl = isSupabaseConfigured ? cleanUrl : 'https://placeholder-yugark.supabase.co';
const safeKey = isSupabaseConfigured ? cleanKey : 'placeholder-anon-key';

export const supabase: SupabaseClient = createClient(safeUrl, safeKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
