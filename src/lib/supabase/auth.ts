import { supabase, isSupabaseConfigured } from './client';
import { AdminRoleRecord } from './types';

export interface AdminAuthState {
  user: any | null;
  role: AdminRoleRecord | null;
  isAdmin: boolean;
  isLoading: boolean;
}

export async function signInAdmin(email: string, password: string) {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured yet. Please supply VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment.');
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  // Verify that the user has an admin role
  const { data: roleData, error: roleError } = await supabase
    .from('admin_roles')
    .select('*')
    .eq('user_id', data.user.id)
    .single();

  if (roleError || !roleData) {
    await supabase.auth.signOut();
    throw new Error('Access denied. This account does not possess authorized administrator privileges.');
  }

  return { session: data.session, user: data.user, role: roleData as AdminRoleRecord };
}

export async function signOutAdmin() {
  if (!isSupabaseConfigured) return;
  await supabase.auth.signOut();
}

export async function getCurrentAdminRole(): Promise<AdminRoleRecord | null> {
  if (!isSupabaseConfigured) return null;

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: roleData } = await supabase
      .from('admin_roles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    return roleData as AdminRoleRecord | null;
  } catch (err) {
    console.error('Error fetching admin role:', err);
    return null;
  }
}

export async function getAdminSession() {
  if (!isSupabaseConfigured) return null;
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}
