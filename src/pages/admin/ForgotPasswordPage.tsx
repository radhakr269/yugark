import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, ArrowLeft, ShieldCheck, AlertCircle, CheckCircle2, Lock, Sparkles } from 'lucide-react';
import { requestPasswordReset, AUTHORIZED_RECOVERY_EMAIL } from '../../lib/supabase/auth';
import { isSupabaseConfigured } from '../../lib/supabase/client';
import { SEOHead } from '../../components/SEOHead';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setStatusMessage(null);
    setIsLoading(true);

    try {
      const result = await requestPasswordReset(email.trim());
      setHasSubmitted(true);
      setStatusMessage(result.message);
    } catch (err: any) {
      setErrorMessage(err.message || 'Unable to process password reset request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#111A15] text-[#FAF8F5] flex flex-col justify-between p-4 sm:p-8">
      <SEOHead
        title="Admin Password Recovery"
        description="Secure password reset for Yugark Digital Studio authorized administrators."
        canonicalPath="/admin/forgot-password"
      />

      {/* Top Navigation */}
      <div className="max-w-6xl w-full mx-auto flex items-center justify-between">
        <Link
          to="/admin/login"
          className="inline-flex items-center gap-2 text-xs font-medium text-[#A5C2B1] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Admin Login</span>
        </Link>
        <span className="text-[10px] font-mono tracking-widest uppercase text-[#7E887E]">
          Recovery Protocol 2.0
        </span>
      </div>

      {/* Reset Card */}
      <div className="max-w-md w-full mx-auto my-12 bg-[#1A2621] rounded-2xl sm:rounded-3xl p-8 sm:p-10 border border-[#2D4536] shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-full bg-[#253A2E] text-[#A5C2B1] flex items-center justify-center mx-auto mb-4 border border-[#334E3E]">
            <Lock className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-mono tracking-[0.25em] text-[#A5C2B1] uppercase block mb-1">
            YUGARK DIGITAL STUDIO
          </span>
          <h1 className="font-serif-title text-2xl sm:text-3xl font-medium text-white mb-2">
            Password Recovery
          </h1>
          <p className="text-xs text-[#CAD6CE] leading-relaxed">
            Enter your authorized studio email. A secure recovery link will be dispatched to your inbox.
          </p>
        </div>

        {/* Authorized Studio Email Hint */}
        <div className="mb-6 p-4 rounded-xl bg-[#233B2E]/60 border border-[#314B3B] text-xs text-[#CAD6CE] space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#A5C2B1] font-semibold text-[11px] uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-[#25D366]" />
              <span>Authorized Admin Identity</span>
            </div>
            <button
              type="button"
              onClick={() => setEmail(AUTHORIZED_RECOVERY_EMAIL)}
              className="text-[10px] font-mono text-[#FAF8F5] underline hover:text-[#A5C2B1] cursor-pointer"
            >
              Fill {AUTHORIZED_RECOVERY_EMAIL}
            </button>
          </div>
          <p className="text-[11px] text-[#A2B3A7] leading-relaxed">
            Recovery emails are dispatched via Supabase Auth to registered studio administrator accounts. Redirects to <code className="text-white bg-[#1B2B22] px-1 rounded font-mono">https://yugark.in/reset-password</code> upon email link confirmation.
          </p>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-red-950/50 border border-red-800/60 text-xs text-red-200 flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
            <div className="leading-relaxed">{errorMessage}</div>
          </div>
        )}

        {hasSubmitted && statusMessage && (
          <div className="mb-6 p-4 rounded-xl bg-[#1B3527] border border-[#2D5A3F] text-xs text-[#DCFCE7] space-y-3">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#4ADE80] mt-0.5 shrink-0" />
              <div className="leading-relaxed font-medium">
                {statusMessage}
              </div>
            </div>
            <p className="text-[11px] text-[#A7D7B9] leading-relaxed pl-6.5">
              Please check your spam folder if the email does not appear within 2 minutes. Once opened, follow the link to establish your new secret password.
            </p>
            <div className="pt-2 pl-6.5 border-t border-[#2A4D39]">
              <Link
                to="/admin/login"
                className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-white hover:text-[#A5C2B1] underline"
              >
                <span>Return to Login</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        )}

        {!hasSubmitted && (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#A5C2B1] mb-2">
                Administrator Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="business@yugark.in"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#121B16] border border-[#2D4536] text-xs sm:text-sm text-white placeholder-[#5A635C] focus:outline-none focus:ring-2 focus:ring-[#A5C2B1]"
                />
                <Mail className="w-4 h-4 text-[#7C887E] absolute left-3.5 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-full bg-[#FAF8F5] text-[#121614] text-xs font-semibold tracking-wider hover:bg-white transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 cursor-pointer mt-2"
            >
              <span>{isLoading ? 'Dispatching Reset Link...' : 'Send Password Recovery Link'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        )}

        <div className="mt-6 pt-5 border-t border-[#24352D] text-center">
          <Link
            to="/admin/login"
            className="text-xs text-[#A5C2B1] hover:text-white transition-colors"
          >
            Remember your credentials? <span className="underline">Sign in</span>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-[11px] text-[#6E7C73]">
        © 2026 Yugark Digital Studio • Protected by Supabase Row-Level Security
      </div>
    </div>
  );
};
