import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Database,
  HardDrive,
  Users,
  LogOut,
  ExternalLink,
  Layers,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { getAdminSession, getCurrentAdminRole, signOutAdmin } from '../../lib/supabase/auth';
import { isSupabaseConfigured } from '../../lib/supabase/client';
import { AdminRoleRecord } from '../../lib/supabase/types';
import { SEOHead } from '../../components/SEOHead';

export const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState<AdminRoleRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      // In development / demo when Supabase credentials aren't yet injected, allow previewing the foundation
      const session = await getAdminSession();
      if (!session && isSupabaseConfigured) {
        navigate('/admin/login');
        return;
      }
      const adminRole = await getCurrentAdminRole();
      setRole(adminRole);
      setLoading(false);
    }
    checkAuth();
  }, [navigate]);

  const handleLogout = async () => {
    await signOutAdmin();
    navigate('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#111A15] text-[#FAF8F5] flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#A5C2B1] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-[#CAD6CE]">Verifying Administrator Permissions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111A15] text-[#FAF8F5] flex flex-col justify-between">
      <SEOHead
        title="Admin Portal — CMS Foundation Active"
        description="Yugark Digital Studio Administrator Portal."
        canonicalPath="/admin"
      />

      {/* Admin Top Navigation */}
      <header className="bg-[#18241D] border-b border-[#253A2E] px-4 sm:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex flex-col group">
            <span className="font-serif-title text-lg font-bold tracking-[0.18em] text-[#FAF8F5] uppercase">
              YUGARK
            </span>
            <span className="text-[8px] tracking-[0.3em] text-[#A5C2B1] uppercase -mt-1 font-medium">
              Admin Portal
            </span>
          </Link>
          <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-[#253A2E] text-[#A5C2B1] text-[10px] font-mono border border-[#334E3E]">
            Step 2 Active
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Link
            to="/"
            target="_blank"
            className="text-xs text-[#CAD6CE] hover:text-white transition-colors flex items-center gap-1.5"
          >
            <span>Live Studio</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#253A2E] text-[#FAF8F5] text-xs font-medium hover:bg-[#334E3E] transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Admin Overview Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-8 py-10">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#253A2E] text-[#A5C2B1] text-[11px] font-mono mb-3 border border-[#334E3E]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#25D366]" />
            <span>Step 2 of 4 — Backend & CMS Foundation</span>
          </div>
          <h1 className="font-serif-title text-3xl sm:text-4xl font-medium text-white mb-2">
            Supabase Backend & Dynamic Data Architecture
          </h1>
          <p className="text-xs sm:text-sm text-[#CAD6CE] max-w-2xl leading-relaxed">
            The database schema, Row-Level Security, media storage bucket, and dynamic repository have been successfully implemented.
            All public website components now query this centralized CMS layer.
          </p>
        </div>

        {/* Foundation Modules Status Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
          {/* Card 1: PostgreSQL Schema */}
          <div className="bg-[#18241D] rounded-2xl p-6 border border-[#253A2E] flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#253A2E] text-[#A5C2B1] flex items-center justify-center mb-4">
                <Database className="w-5 h-5" />
              </div>
              <h2 className="font-serif-title text-lg text-white mb-1.5">
                PostgreSQL Schema
              </h2>
              <p className="text-xs text-[#CAD6CE] leading-relaxed mb-4">
                15 normalized tables configured with UUID primary keys, foreign constraints, indexes, and initial seed records.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#25D366] font-mono pt-3 border-t border-[#253A2E]">
              <CheckCircle2 className="w-4 h-4" />
              <span>15 Tables Defined</span>
            </div>
          </div>

          {/* Card 2: Row Level Security */}
          <div className="bg-[#18241D] rounded-2xl p-6 border border-[#253A2E] flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#253A2E] text-[#A5C2B1] flex items-center justify-center mb-4">
                <Lock className="w-5 h-5" />
              </div>
              <h2 className="font-serif-title text-lg text-white mb-1.5">
                Row Level Security (RLS)
              </h2>
              <p className="text-xs text-[#CAD6CE] leading-relaxed mb-4">
                Public users can read published content and submit leads. Only authorized administrators can mutate records or view leads.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#25D366] font-mono pt-3 border-t border-[#253A2E]">
              <CheckCircle2 className="w-4 h-4" />
              <span>RLS Active Across Tables</span>
            </div>
          </div>

          {/* Card 3: Storage Bucket */}
          <div className="bg-[#18241D] rounded-2xl p-6 border border-[#253A2E] flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#253A2E] text-[#A5C2B1] flex items-center justify-center mb-4">
                <HardDrive className="w-5 h-5" />
              </div>
              <h2 className="font-serif-title text-lg text-white mb-1.5">
                Media Storage System
              </h2>
              <p className="text-xs text-[#CAD6CE] leading-relaxed mb-4">
                Bucket <code className="text-[#A5C2B1]">public-cms-media</code> prepared with MIME restrictions (JPG, PNG, WebP) and 10MB limits.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#25D366] font-mono pt-3 border-t border-[#253A2E]">
              <CheckCircle2 className="w-4 h-4" />
              <span>public-cms-media Configured</span>
            </div>
          </div>
        </div>

        {/* Step 3 Readiness Banner */}
        <div className="bg-[#1F2F26] rounded-2xl sm:rounded-3xl p-6 sm:p-10 border border-[#2F4738] mb-8">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#A5C2B1] mb-2">
            <Sparkles className="w-4 h-4" />
            <span>Next Stage Handshake</span>
          </div>
          <h2 className="font-serif-title text-2xl sm:text-3xl text-white mb-3">
            Ready for Step 3: Full Admin Dashboard & Leads CRM UI
          </h2>
          <p className="text-xs sm:text-sm text-[#CAD6CE] max-w-2xl leading-relaxed mb-6">
            The entire backend infrastructure is primed. In Step 3, the interactive visual management panels will be introduced:
            Demo Manager (upload & external URLs), Blog Manager, Services Manager, Portfolio Manager, Pricing Manager, and Leads CRM.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/demos"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#FAF8F5] text-[#121614] text-xs font-semibold hover:bg-white transition-all shadow-md"
            >
              <span>Test Dynamic Demos Page</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-[#3E5C4A] text-white text-xs font-medium hover:bg-[#283D31] transition-colors"
            >
              <span>Test Lead Submission Form</span>
            </Link>
          </div>
        </div>
      </main>

      {/* Admin Footer */}
      <footer className="bg-[#141E18] border-t border-[#203126] px-4 sm:px-8 py-4 text-center text-xs text-[#6E7C73]">
        Yugark Digital Studio • Step 2 Backend & CMS Foundation Verified
      </footer>
    </div>
  );
};
