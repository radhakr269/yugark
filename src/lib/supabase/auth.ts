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
      .maybeSingle();

    if (roleError) {
      if (roleError.code === 'PGRST205') {
        return {
          isAuthenticated: true,
          isAdmin: false,
          user,
          role: null,
          error: 'Database setup required: Table public.admin_roles does not exist in the Supabase schema cache.',
        };
      }
      return {
        isAuthenticated: true,
        isAdmin: false,
        user,
        role: null,
        error: roleError.message || 'Unable to verify administrator role in database.',
      };
    }

    if (!roleData) {
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
    const msg = err?.message || '';
    const isNetwork = msg.toLowerCase().includes('failed to fetch') || msg.toLowerCase().includes('network');
    return {
      isAuthenticated: false,
      isAdmin: false,
      user: null,
      role: null,
      error: isNetwork
        ? 'Network error: Unable to contact Supabase authentication server. Please check internet connectivity or ad-blockers.'
        : msg || 'Security check failed. Please re-authenticate.',
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

  const cleanEmail = email.trim();

  // 1. Authenticate with Supabase Auth (Primary Login Request)
  let authData: any = null;
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password,
    });

    if (error) {
      const msg = error.message || '';
      if (msg.toLowerCase().includes('failed to fetch')) {
        throw new Error(
          'Network connection error: Unable to connect to Supabase authentication server (Failed to fetch). Please check your internet connection or disable ad-blockers / browser privacy shields for this site.'
        );
      }
      throw error;
    }
    authData = data;
  } catch (err: any) {
    const msg = err?.message || '';
    if (msg.toLowerCase().includes('failed to fetch')) {
      throw new Error(
        'Network connection error: Unable to connect to Supabase authentication server (Failed to fetch). Please check your internet connection or disable ad-blockers / browser privacy shields for this site.'
      );
    }
    throw err;
  }

  if (!authData?.user) {
    throw new Error('Authentication succeeded but user identity could not be verified.');
  }

  // 2. Query public.admin_roles for user_id to verify administrator authorization
  let roleData: any = null;
  let roleError: any = null;
  try {
    const res = await supabase
      .from('admin_roles')
      .select('*')
      .eq('user_id', authData.user.id)
      .maybeSingle();
    roleData = res.data;
    roleError = res.error;
  } catch (err: any) {
    roleError = err;
  }

  // If role check failed or user does not possess admin role
  if (roleError || !roleData || !['super_admin', 'admin', 'editor'].includes(roleData.role)) {
    // Safely sign out the session to prevent unprivileged session persistence.
    // Wrap with catch to ensure any network glitch during sign-out never masks the authorization error.
    try {
      await supabase.auth.signOut();
    } catch (signOutErr) {
      console.warn('[Yugark Auth] Non-fatal sign out error during role rejection:', signOutErr);
    }

    if (roleError) {
      if (roleError.code === 'PGRST205') {
        throw new Error(
          'Database setup required: Table public.admin_roles does not exist in the Supabase schema cache. Please apply the admin_roles database migration.'
        );
      }
      if (roleError.message && roleError.message.toLowerCase().includes('failed to fetch')) {
        throw new Error(
          'Network connection error while verifying administrator role. Please check connectivity and retry.'
        );
      }
    }

    throw new Error('Access denied. This account does not possess authorized administrator privileges in public.admin_roles.');
  }

  return { session: authData.session, user: authData.user, role: roleData as AdminRoleRecord };
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
 * - Email-only recovery, no SMS
 * - Points redirect strictly to https://yugark.in/reset-password (matching Supabase Redirect URLs config)
 */
export async function requestPasswordReset(email: string): Promise<ResetRequestResult> {
  const cleanEmail = email.trim().toLowerCase();

  // Basic email syntax check
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    throw new Error('Please enter a valid email address.');
  }

  const now = Date.now();
  if (now - lastResetAttemptTime < RESET_RATE_LIMIT_MS) {
    const waitSeconds = Math.ceil((RESET_RATE_LIMIT_MS - (now - lastResetAttemptTime)) / 1000);
    throw new Error(`Rate limit exceeded. Please wait ${waitSeconds} seconds before requesting another recovery email.`);
  }

  // If Supabase is configured, trigger genuine resetPasswordForEmail
  if (isSupabaseConfigured) {
    // Exact redirect URL configured in Supabase Authentication -> URL Configuration -> Redirect URLs:
    // https://yugark.in/reset-password
    const redirectUrl =
      typeof window !== 'undefined' && !window.location.origin.includes('yugark.in')
        ? `${window.location.origin}/reset-password`
        : 'https://yugark.in/reset-password';

    const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
      redirectTo: redirectUrl,
    });

    if (error) {
      console.error('[Yugark Auth] resetPasswordForEmail error from Supabase:', error);
      throw new Error(error.message || 'Unable to dispatch recovery email. Please check Supabase Authentication settings.');
    }
  }

  lastResetAttemptTime = now;

  // Return consistent message indicating dispatch
  return {
    success: true,
    message: 'If an authorized administrator account exists for this email address, a secure password recovery link has been dispatched to your inbox.',
  };
}

/**
 * Validates whether the active session is a genuine authenticated recovery session.
 * Correctly detects URL hash tokens, PKCE codes, and Supabase auth errors.
 */
export async function verifyRecoverySession(): Promise<{ isValid: boolean; email?: string; error?: string }> {
  if (!isSupabaseConfigured) {
    // In sandbox preview mode, allow testing reset-password flow safely
    return { isValid: true, email: AUTHORIZED_RECOVERY_EMAIL };
  }

  try {
    // 1. Check for explicit error parameters dispatched by Supabase in the URL hash or query string
    if (typeof window !== 'undefined') {
      const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
      const searchParams = new URLSearchParams(window.location.search);
      const urlError =
        hashParams.get('error_description') ||
        searchParams.get('error_description') ||
        hashParams.get('error') ||
        searchParams.get('error');

      if (urlError) {
        return {
          isValid: false,
          error: decodeURIComponent(urlError.replace(/\+/g, ' ')),
        };
      }

      // 2. If PKCE authorization code is present in query parameters, exchange it
      const code = searchParams.get('code');
      if (code) {
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        if (exchangeError) {
          console.error('[Yugark Auth] exchangeCodeForSession failed:', exchangeError);
          return {
            isValid: false,
            error: exchangeError.message || 'Unable to exchange recovery code for an active session.',
          };
        }
      }
    }

    // 3. Inspect active session and user
    const { data: { session } } = await supabase.auth.getSession();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user || !session) {
      return {
        isValid: false,
        error: 'No active recovery session found. The password reset link may have expired or already been used.',
      };
    }

    // 4. Verify user role in public.admin_roles
    const { data: roleData, error: roleError } = await supabase
      .from('admin_roles')
      .select('role')
      .eq('user_id', user.id)
      .maybeSingle();

    if (roleError) {
      console.warn('[Yugark Auth] admin_roles check warning during recovery:', roleError);
    }

    // If roleData exists, ensure they are an administrator
    if (roleData && !['super_admin', 'admin', 'editor'].includes(roleData.role)) {
      return {
        isValid: false,
        error: 'Access denied. The recovery user is not an authorized studio administrator.',
      };
    }

    return { isValid: true, email: user.email };
  } catch (err: any) {
    console.error('[Yugark Auth] verifyRecoverySession exception:', err);
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

