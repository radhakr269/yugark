import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle, ArrowLeft, Key } from 'lucide-react';
import { signInAdmin, getAdminSession } from '../../lib/supabase/auth';
import { isSupabaseConfigured } from '../../lib/supabase/client';
import { SEOHead } from '../../components/SEOHead';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is already logged in
    async function checkExistingSession() {
      const session = await getAdminSession();
      if (session) {
        navigate('/admin');
      }
    }
    checkExistingSession();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      if (!isSupabaseConfigured) {
        setErrorMsg(
          'Supabase credentials pending. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to enable authentication.'
        );
        setIsLoading(false);
        return;
      }

      await signInAdmin(email.trim(), password);
      navigate('/admin');
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid administrator credentials or unassigned role.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#111A15] text-[#FAF8F5] flex flex-col justify-between p-4 sm:p-8">
      <SEOHead
        title="Admin Portal Authentication"
        description="Secure administrator access for Yugark Digital Studio management."
        canonicalPath="/admin/login"
      />

      {/* Top Bar */}
      <div className="max-w-6xl w-full mx-auto flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-medium text-[#A5C2B1] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Studio Website</span>
        </Link>
        <span className="text-[10px] font-mono tracking-widest uppercase text-[#7E887E]">
          Security Layer 2.0
        </span>
      </div>

      {/* Login Card */}
      <div className="max-w-md w-full mx-auto my-12 bg-[#1A2621] rounded-2xl sm:rounded-3xl p-8 sm:p-10 border border-[#2D4536] shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-full bg-[#253A2E] text-[#A5C2B1] flex items-center justify-center mx-auto mb-4 border border-[#334E3E]">
            <Lock className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-mono tracking-[0.25em] text-[#A5C2B1] uppercase block mb-1">
            YUGARK DIGITAL STUDIO
          </span>
          <h1 className="font-serif-title text-2xl sm:text-3xl font-medium text-white mb-2">
            Admin Portal Access
          </h1>
          <p className="text-xs text-[#CAD6CE]">
            Authorized personnel only. All access attempts are verified.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-red-950/50 border border-red-800/60 text-xs text-red-200 flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
            <div className="leading-relaxed">{errorMsg}</div>
          </div>
        )}

        {!isSupabaseConfigured && (
          <div className="mb-6 p-4 rounded-xl bg-[#233B2E]/60 border border-[#314B3B] text-xs text-[#CAD6CE] space-y-2">
            <div className="flex items-center justify-between font-semibold text-[#A5C2B1]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#25D366]" />
                <span>Sandbox Admin Mode</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEmail('admin@yugark.in');
                  setPassword('admin123');
                }}
                className="text-[10px] font-mono text-[#FAF8F5] underline hover:text-[#A5C2B1] cursor-pointer"
              >
                Auto-fill credentials
              </button>
            </div>
            <p className="leading-relaxed text-[11px] text-[#A2B3A7]">
              Supabase credentials pending in <code className="text-[#FAF8F5]">.env</code>. You can log in with{' '}
              <strong className="text-white">admin@yugark.in</strong> to access and test the complete persistent admin dashboard.
            </p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#A5C2B1] mb-2">
              Administrator Email
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@yugark.in"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#121B16] border border-[#2D4536] text-xs sm:text-sm text-white placeholder-[#5A635C] focus:outline-none focus:ring-2 focus:ring-[#A5C2B1]"
              />
              <Mail className="w-4 h-4 text-[#7C887E] absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#A5C2B1] mb-2">
              Secret Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#121B16] border border-[#2D4536] text-xs sm:text-sm text-white placeholder-[#5A635C] focus:outline-none focus:ring-2 focus:ring-[#A5C2B1]"
              />
              <Key className="w-4 h-4 text-[#7C887E] absolute left-3.5 top-3.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-full bg-[#FAF8F5] text-[#121614] text-xs font-semibold tracking-wider hover:bg-white transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 cursor-pointer mt-2"
          >
            <span>{isLoading ? 'Verifying Credentials...' : 'Authenticate as Administrator'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

      {/* Footer */}
      <div className="text-center text-[11px] text-[#6E7C73]">
        © 2026 Yugark Digital Studio • Protected by Supabase Row-Level Security
      </div>
    </div>
  );
};
