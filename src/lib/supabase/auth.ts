import { supabase, isSupabaseConfigured } from './client';
import { AdminRoleRecord } from './types';

export interface AdminAuthState {
  user: any | null;
  role: AdminRoleRecord | null;
  isAdmin: boolean;
  isLoading: boolean;
}

export interface AdminValidationResult {
  isAuthenticated: boolean;
  isAdmin: boolean;
  user: any | null;
  role: AdminRoleRecord | null;
  error?: string;
}

/**
 * Validates active admin session with Supabase server-side session and admin role authorization.
 * Strict enforcement:
 * - Checks active cryptographic session via Supabase Auth
 * - Validates authentic user identity via getUser()
 * - Queries public.admin_roles for user_id to confirm super_admin/admin/editor permissions
 * - Never trusts insecure client-side localStorage flags in production
 */
export async function validateAdminSession(): Promise<AdminValidationResult> {
  if (!isSupabaseConfigured) {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('yugark_admin_session');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.session && parsed.role) {
            return {
              isAuthenticated: true,
              isAdmin: true,
              user: parsed.session.user,
              role: parsed.role,
            };
          }
        } catch {}
      }
    }
    return {
      isAuthenticated: false,
      isAdmin: false,
      user: null,
      role: null,
      error: 'Administrator authentication required. Please sign in.',
    };
  }

  try {
    // 1. Verify active session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) {
      return {
        isAuthenticated: false,
        isAdmin: false,
        user: null,
        role: null,
        error: sessionError?.message || 'No active administrator session found. Please log in.',
      };
    }

    // 2. Verify authentic user object with Supabase Auth
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return {
        isAuthenticated: false,
        isAdmin: false,
        user: null,
        role: null,
        error: userError?.message || 'Unable to authenticate administrator user.',
      };
    }

    // 3. Verify user's administrative role in database
    const { data: roleData, error: roleError } = await supabase
      .from('admin_roles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (roleError || !roleData) {
      return {
        isAuthenticated: true,
        isAdmin: false,
        user,
        role: null,
        error: 'Access denied. Account is authenticated but has not been assigned administrator privileges in public.admin_roles.',
      };
    }

    const roleName = roleData.role;
    if (!['super_admin', 'admin', 'editor'].includes(roleName)) {
      return {
        isAuthenticated: true,
        isAdmin: false,
        user,
        role: null,
        error: 'Access denied. Account does not possess sufficient administrative permissions.',
      };
    }

    return {
      isAuthenticated: true,
      isAdmin: true,
      user,
      role: roleData as AdminRoleRecord,
    };
  } catch (err: any) {
    console.error('[Yugark Auth] Admin validation exception:', err);
    return {
      isAuthenticated: false,
      isAdmin: false,
      user: null,
      role: null,
      error: err?.message || 'Security check failed. Please re-authenticate.',
    };
  }
}

export async function signInAdmin(email: string, password: string) {
  if (!isSupabaseConfigured) {
    // Sandbox mode authentication for local development only
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

  // Verify that the authenticated user possesses an administrative role in admin_roles
  const { data: roleData, error: roleError } = await supabase
    .from('admin_roles')
    .select('*')
    .eq('user_id', data.user.id)
    .single();

  if (roleError || !roleData || !['super_admin', 'admin', 'editor'].includes(roleData.role)) {
    await supabase.auth.signOut();
    throw new Error('Access denied. This account does not possess authorized administrator privileges in public.admin_roles.');
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
  const result = await validateAdminSession();
  return result.isAdmin ? result.role : null;
}

export async function getAdminSession() {
  const result = await validateAdminSession();
  if (!result.isAuthenticated || !result.isAdmin) return null;
  if (!isSupabaseConfigured) {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('yugark_admin_session');
      if (saved) {
        try {
          return JSON.parse(saved).session;
        } catch {}
      }
    }
    return null;
  }
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

// Security: Rate limiting state for password reset requests (minimum 60s between calls)
let lastResetAttemptTime = 0;
const RESET_RATE_LIMIT_MS = 60000;

export const AUTHORIZED_RECOVERY_EMAIL = 'business@yugark.in';

export interface ResetRequestResult {
  success: boolean;
  message: string;
}

/**
 * Initiates the password recovery flow via Supabase Auth email delivery.
 * Security enforcement:
 * - Rate limited to 1 request per 60 seconds per client
 * - Always yields a neutral response without exposing account existence
 * - Email-only recovery, no SMS
 * - Points redirect to /admin/reset-password
 */
export async function requestPasswordReset(email: string): Promise<ResetRequestResult> {
  const now = Date.now();
  if (now - lastResetAttemptTime < RESET_RATE_LIMIT_MS) {
    const waitSeconds = Math.ceil((RESET_RATE_LIMIT_MS - (now - lastResetAttemptTime)) / 1000);
    throw new Error(`Rate limit exceeded. Please wait ${waitSeconds} seconds before requesting another recovery email.`);
  }
  lastResetAttemptTime = now;

  const cleanEmail = email.trim().toLowerCase();

  // Basic email syntax check
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    throw new Error('Please enter a valid email address.');
  }

  // If Supabase is configured, trigger genuine resetPasswordForEmail
  if (isSupabaseConfigured) {
    try {
      const redirectUrl = typeof window !== 'undefined'
        ? `${window.location.origin}/admin/reset-password`
        : 'https://yugark.in/admin/reset-password';

      await supabase.auth.resetPasswordForEmail(cleanEmail, {
        redirectTo: redirectUrl,
      });
    } catch {
      // Intentionally catch and ignore specific backend error to prevent account enumeration attacks
    }
  }

  // Return consistent neutral message to prevent account discovery
  return {
    success: true,
    message: 'If an authorized administrator account exists for this email address, a secure password recovery link has been dispatched to your inbox.',
  };
}

/**
 * Validates whether the active session is a genuine authenticated recovery session.
 * Rejects expired or missing tokens.
 */
export async function verifyRecoverySession(): Promise<{ isValid: boolean; email?: string; error?: string }> {
  if (!isSupabaseConfigured) {
    // In sandbox preview mode, allow testing reset-password flow safely
    return { isValid: true, email: AUTHORIZED_RECOVERY_EMAIL };
  }

  try {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return {
        isValid: false,
        error: 'No active or valid recovery session found. The password reset link may have expired or already been used.',
      };
    }

    // Verify user role has administrator permissions before permitting password change
    const { data: roleData, error: roleError } = await supabase
      .from('admin_roles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (roleError || !roleData) {
      return {
        isValid: false,
        error: 'Access denied. The recovery user is not an authorized studio administrator.',
      };
    }

    return { isValid: true, email: user.email };
  } catch (err: any) {
    return {
      isValid: false,
      error: err.message || 'Unable to verify recovery link security token.',
    };
  }
}

/**
 * Securely updates the administrator's password after verifying password strength
 * and the genuine authenticated recovery session.
 * Immediately invalidates recovery session upon completion to require fresh login.
 */
export async function updateAdminPassword(newPassword: string): Promise<void> {
  // 1. Password Strength Validation
  if (newPassword.length < 8) {
    throw new Error('Password must be at least 8 characters long.');
  }
  if (!/[A-Z]/.test(newPassword)) {
    throw new Error('Password must contain at least one uppercase letter.');
  }
  if (!/[a-z]/.test(newPassword)) {
    throw new Error('Password must contain at least one lowercase letter.');
  }
  if (!/[0-9]/.test(newPassword)) {
    throw new Error('Password must contain at least one numerical digit.');
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) {
    throw new Error('Password must contain at least one special character (!@#$%^&*...).');
  }

  // 2. Apply Update via Supabase Auth
  if (isSupabaseConfigured) {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      throw error;
    }

    // 3. Immediately sign out to invalidate recovery session and force clean login
    await supabase.auth.signOut();
  } else {
    // In sandbox preview mode
    if (typeof window !== 'undefined') {
      localStorage.removeItem('yugark_admin_session');
    }
  }
}

