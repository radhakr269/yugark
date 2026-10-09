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
    // Sandbox mode authentication
    if (email.toLowerCase().includes('admin') || email.toLowerCase().includes('yugark')) {
      const sandboxRole: AdminRoleRecord = {
        id: 'sandbox-role-1',
        user_id: 'sandbox-admin-user',
        role: 'super_admin',
        full_name: 'Studio Director (Admin)',
        permissions: {
          manage_content: true,
          manage_leads: true,
          manage_settings: true,
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      const sandboxSession = {
        access_token: 'sandbox-admin-token',
        user: { id: 'sandbox-admin-user', email },
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem('yugark_admin_session', JSON.stringify({ session: sandboxSession, role: sandboxRole }));
      }
      return { session: sandboxSession, user: sandboxSession.user, role: sandboxRole };
    } else {
      throw new Error('Access denied. Please use an authorized studio email (e.g., admin@yugark.in).');
    }
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
  if (typeof window !== 'undefined') {
    localStorage.removeItem('yugark_admin_session');
  }
  if (!isSupabaseConfigured) return;
  await supabase.auth.signOut();
}

export async function getCurrentAdminRole(): Promise<AdminRoleRecord | null> {
  if (!isSupabaseConfigured) {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('yugark_admin_session');
      if (saved) {
        try {
          return JSON.parse(saved).role as AdminRoleRecord;
        } catch {}
      }
    }
    // Return default super_admin in sandbox so admin dashboard preview is accessible
    return {
      id: 'sandbox-role-1',
      user_id: 'sandbox-admin-user',
      role: 'super_admin',
      full_name: 'Studio Director',
      permissions: { manage_content: true, manage_leads: true, manage_settings: true },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }

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
  if (!isSupabaseConfigured) {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('yugark_admin_session');
      if (saved) {
        try {
          return JSON.parse(saved).session;
        } catch {}
      }
      // In sandbox mode return a valid mock session
      return { access_token: 'sandbox-token', user: { email: 'admin@yugark.in' } };
    }
    return null;
  }
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}
