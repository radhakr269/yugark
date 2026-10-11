import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Lock,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Check,
  X,
  KeyRound,
} from 'lucide-react';
import { verifyRecoverySession, updateAdminPassword } from '../../lib/supabase/auth';
import { supabase, isSupabaseConfigured } from '../../lib/supabase/client';
import { SEOHead } from '../../components/SEOHead';

export const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [isVerifying, setIsVerifying] = useState(true);
  const [isSessionValid, setIsSessionValid] = useState(false);
  const [userEmail, setUserEmail] = useState<string | undefined>();
  const [sessionError, setSessionError] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function checkSession() {
      setIsVerifying(true);
      setSessionError(null);

      // 1. Inspect URL parameters for error codes or descriptions sent by Supabase
      if (typeof window !== 'undefined') {
        const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
        const searchParams = new URLSearchParams(window.location.search);
        const urlError =
          hashParams.get('error_description') ||
          searchParams.get('error_description') ||
          hashParams.get('error') ||
          searchParams.get('error');

        if (urlError) {
          if (isMounted) {
            setIsSessionValid(false);
            setSessionError(decodeURIComponent(urlError.replace(/\+/g, ' ')));
            setIsVerifying(false);
          }
          return;
        }

        // 2. PKCE code exchange if present in query parameters
        const code = searchParams.get('code');
        if (code && isSupabaseConfigured) {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) {
            console.error('[Yugark Auth] exchangeCodeForSession failed:', exchangeError);
            if (isMounted) {
              setIsSessionValid(false);
              setSessionError(exchangeError.message || 'Recovery token is invalid or expired.');
              setIsVerifying(false);
            }
            return;
          }
        }
      }

      // 3. Initial session verification with short delay retry if URL has tokens
      let res = await verifyRecoverySession();
      if (
        !res.isValid &&
        typeof window !== 'undefined' &&
        (window.location.hash.includes('access_token') || window.location.hash.includes('type=recovery'))
      ) {
        // Wait briefly for Supabase JS client to parse the URL hash
        await new Promise((resolve) => setTimeout(resolve, 500));
        res = await verifyRecoverySession();
      }

      if (!isMounted) return;

      if (res.isValid) {
        setIsSessionValid(true);
        setUserEmail(res.email);
        setSessionError(null);
      } else {
        setIsSessionValid(false);
        setSessionError(res.error || 'This recovery link is either expired, already consumed, or invalid.');
      }
      setIsVerifying(false);
    }

    checkSession();

    // 4. Subscribe to Supabase auth events (handles PASSWORD_RECOVERY and SIGNED_IN)
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;
      if (event === 'PASSWORD_RECOVERY' || (event === 'SIGNED_IN' && session)) {
        const res = await verifyRecoverySession();
        if (isMounted) {
          if (res.isValid) {
            setIsSessionValid(true);
            setUserEmail(res.email);
            setSessionError(null);
          }
          setIsVerifying(false);
        }
      }
    });

    return () => {
      isMounted = false;
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  // Password requirements calculation
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasDigit = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const passwordsMatch = password.length > 0 && password === confirmPassword;
  const isFormValid =
    hasMinLength && hasUppercase && hasLowercase && hasDigit && hasSpecial && passwordsMatch;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!passwordsMatch) {
      setErrorMessage('Passwords do not match. Please verify both inputs.');
      return;
    }

    if (!isFormValid) {
      setErrorMessage('Please ensure your new password satisfies all security criteria below.');
      return;
    }

    setIsLoading(true);

    try {
      await updateAdminPassword(password);
      setIsSuccess(true);
      setTimeout(() => {
        navigate('/admin/login');
      }, 3500);
    } catch (err: any) {
      setErrorMessage(err.message || 'Unable to update password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#111A15] text-[#FAF8F5] flex flex-col justify-between p-4 sm:p-8">
      <SEOHead
        title="Admin Password Reset"
        description="Establish new secure password credentials for Yugark Digital Studio administrator account."
        canonicalPath="/admin/reset-password"
      />

      {/* Top Bar */}
      <div className="max-w-6xl w-full mx-auto flex items-center justify-between">
        <Link
          to="/admin/login"
          className="inline-flex items-center gap-2 text-xs font-medium text-[#A5C2B1] hover:text-white transition-colors"
        >
          <ArrowRight className="w-3.5 h-3.5 rotate-180" />
          <span>Back to Admin Login</span>
        </Link>
        <span className="text-[10px] font-mono tracking-widest uppercase text-[#7E887E]">
          Recovery Verification
        </span>
      </div>

      {/* Main Content Card */}
      <div className="max-w-md w-full mx-auto my-10 bg-[#1A2621] rounded-2xl sm:rounded-3xl p-8 sm:p-10 border border-[#2D4536] shadow-2xl">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-full bg-[#253A2E] text-[#A5C2B1] flex items-center justify-center mx-auto mb-4 border border-[#334E3E]">
            <KeyRound className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-mono tracking-[0.25em] text-[#A5C2B1] uppercase block mb-1">
            SECURITY CREDENTIALS
          </span>
          <h1 className="font-serif-title text-2xl sm:text-3xl font-medium text-white mb-2">
            Set New Password
          </h1>
          <p className="text-xs text-[#CAD6CE]">
            Create a robust secret password for your administrator account.
          </p>
        </div>

        {/* Verifying Session Loading State */}
        {isVerifying && (
          <div className="py-12 text-center space-y-3">
            <div className="w-8 h-8 border-2 border-[#A5C2B1] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-[#A2B3A7]">Verifying cryptographic recovery token...</p>
          </div>
        )}

        {/* Invalid or Expired Session */}
        {!isVerifying && !isSessionValid && (
          <div className="space-y-5">
            <div className="p-4 rounded-xl bg-red-950/60 border border-red-800/70 text-xs text-red-200 space-y-2">
              <div className="flex items-center gap-2 font-semibold text-red-300">
                <AlertCircle className="w-4 h-4 text-red-400" />
                <span>Recovery Token Invalid</span>
              </div>
              <p className="leading-relaxed text-[11px] text-red-200/90">
                {sessionError || 'This recovery link is either expired, already consumed, or invalid.'}
              </p>
            </div>
            <Link
              to="/admin/forgot-password"
              className="w-full py-3.5 rounded-full bg-[#FAF8F5] text-[#121614] text-xs font-semibold tracking-wider hover:bg-white transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer"
            >
              <span>Request Fresh Recovery Link</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        {/* Success State */}
        {!isVerifying && isSessionValid && isSuccess && (
          <div className="p-5 rounded-xl bg-[#1B3527] border border-[#2D5A3F] text-xs text-[#DCFCE7] space-y-3 text-center">
            <CheckCircle2 className="w-8 h-8 text-[#4ADE80] mx-auto" />
            <h2 className="font-serif-title text-lg font-medium text-white">Password Updated Successfully</h2>
            <p className="text-[11px] text-[#A7D7B9] leading-relaxed">
              Your new administrator credentials have been securely stored. In accordance with security protocols, you must now sign in.
            </p>
            <p className="text-[10px] text-[#719B81] font-mono">Redirecting to login in a few seconds...</p>
            <div className="pt-2">
              <button
                onClick={() => navigate('/admin/login')}
                className="w-full py-2.5 rounded-full bg-white text-[#121614] text-xs font-semibold hover:bg-[#FAF8F5] cursor-pointer"
              >
                Sign In Now
              </button>
            </div>
          </div>
        )}

        {/* Form State */}
        {!isVerifying && isSessionValid && !isSuccess && (
          <form onSubmit={handleSubmit} className="space-y-4">
            {userEmail && (
              <div className="p-2.5 rounded-lg bg-[#203127] border border-[#2B4234] text-[11px] text-[#B0C8B9] flex items-center justify-between">
                <span>Account:</span>
                <span className="font-mono text-white font-medium">{userEmail}</span>
              </div>
            )}

            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-800/70 text-xs text-red-200 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                <div className="leading-relaxed">{errorMessage}</div>
              </div>
            )}

            {/* New Password */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#A5C2B1] mb-1.5">
                New Secret Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter strong password"
                  className="w-full pl-10 pr-11 py-2.5 rounded-xl bg-[#121B16] border border-[#2D4536] text-xs sm:text-sm text-white placeholder-[#5A635C] focus:outline-none focus:ring-2 focus:ring-[#A5C2B1]"
                />
                <Lock className="w-4 h-4 text-[#7C887E] absolute left-3.5 top-3" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-[#7C887E] hover:text-white transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#A5C2B1] mb-1.5">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className="w-full pl-10 pr-11 py-2.5 rounded-xl bg-[#121B16] border border-[#2D4536] text-xs sm:text-sm text-white placeholder-[#5A635C] focus:outline-none focus:ring-2 focus:ring-[#A5C2B1]"
                />
                <Lock className="w-4 h-4 text-[#7C887E] absolute left-3.5 top-3" />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3.5 top-3 text-[#7C887E] hover:text-white transition-colors cursor-pointer"
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Password Criteria Checklist */}
            <div className="p-3 rounded-xl bg-[#15201A] border border-[#25392D] space-y-1.5 text-[10.5px]">
              <span className="font-semibold text-[#8C9E91] uppercase tracking-wider block text-[9.5px]">
                Password Strength Criteria:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                <div className={`flex items-center gap-1.5 ${hasMinLength ? 'text-[#4ADE80]' : 'text-[#7D887F]'}`}>
                  {hasMinLength ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                  <span>Min 8 characters</span>
                </div>
                <div className={`flex items-center gap-1.5 ${hasUppercase ? 'text-[#4ADE80]' : 'text-[#7D887F]'}`}>
                  {hasUppercase ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                  <span>Uppercase letter (A-Z)</span>
                </div>
                <div className={`flex items-center gap-1.5 ${hasLowercase ? 'text-[#4ADE80]' : 'text-[#7D887F]'}`}>
                  {hasLowercase ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                  <span>Lowercase letter (a-z)</span>
                </div>
                <div className={`flex items-center gap-1.5 ${hasDigit ? 'text-[#4ADE80]' : 'text-[#7D887F]'}`}>
                  {hasDigit ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                  <span>Number (0-9)</span>
                </div>
                <div className={`flex items-center gap-1.5 ${hasSpecial ? 'text-[#4ADE80]' : 'text-[#7D887F]'}`}>
                  {hasSpecial ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                  <span>Special character</span>
                </div>
                <div className={`flex items-center gap-1.5 ${passwordsMatch ? 'text-[#4ADE80]' : 'text-[#7D887F]'}`}>
                  {passwordsMatch ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                  <span>Passwords match</span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !isFormValid}
              className="w-full py-3.5 rounded-full bg-[#FAF8F5] text-[#121614] text-xs font-semibold tracking-wider hover:bg-white transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer mt-3"
            >
              <span>{isLoading ? 'Updating Credentials...' : 'Save New Password & Sign In'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        )}
      </div>

      {/* Footer */}
      <div className="text-center text-[11px] text-[#6E7C73]">
        © 2026 Yugark Digital Studio • Protected by Supabase Row-Level Security
      </div>
    </div>
  );
};
