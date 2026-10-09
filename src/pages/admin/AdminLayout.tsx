import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  MonitorPlay,
  FileText,
  Briefcase,
  DollarSign,
  Image as ImageIcon,
  Users,
  BarChart3,
  Globe,
  Settings,
  Layers,
  Sparkles,
  ExternalLink,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  AlertCircle,
  ChevronRight,
  Database,
  CloudOff,
  CloudCheck,
} from 'lucide-react';
import { isSupabaseConfigured } from '../../lib/supabase/client';
import { getCurrentAdminRole, signOutAdmin } from '../../lib/supabase/auth';
import { AdminRoleRecord } from '../../lib/supabase/types';

export const AdminLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [adminRole, setAdminRole] = useState<AdminRoleRecord | null>(null);

  useEffect(() => {
    async function loadRole() {
      const role = await getCurrentAdminRole();
      setAdminRole(role);
    }
    loadRole();
  }, []);

  const handleLogout = async () => {
    await signOutAdmin();
    navigate('/admin/login');
  };

  const navItems = [
    { label: 'Overview', path: '/admin', icon: LayoutDashboard },
    { label: 'Website Demos', path: '/admin/demos', icon: MonitorPlay, badge: 'High Priority' },
    { label: 'Blog & Insights', path: '/admin/blog', icon: FileText },
    { label: 'Services', path: '/admin/services', icon: Briefcase },
    { label: 'Pricing Packages', path: '/admin/pricing', icon: DollarSign },
    { label: 'Portfolio Work', path: '/admin/portfolio', icon: Layers },
    { label: 'Page Content', path: '/admin/pages', icon: Globe },
    { label: 'Media Library', path: '/admin/media', icon: ImageIcon },
    { label: 'Leads CRM', path: '/admin/leads', icon: Users, badge: 'Live' },
    { label: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
    { label: 'SEO Manager', path: '/admin/seo', icon: Sparkles },
    { label: 'Website Settings', path: '/admin/settings', icon: Settings },
  ];

  // Helper for active state
  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin' || location.pathname === '/admin/';
    }
    return location.pathname.startsWith(path);
  };

  // Current page title
  const currentNav = navItems.find((item) => isActive(item.path)) || navItems[0];

  return (
    <div className="min-h-screen bg-[#F5F2EB] text-[#121614] flex flex-col lg:flex-row antialiased">
      {/* ==================================================================== */}
      {/* DESKTOP SIDEBAR                                                      */}
      {/* ==================================================================== */}
      <aside className="hidden lg:flex w-64 bg-[#111A15] border-r border-[#1F2E25] flex-col justify-between shrink-0 sticky top-0 h-screen overflow-y-auto">
        <div>
          {/* Studio Brand Header */}
          <div className="p-6 border-b border-[#1F2E25]">
            <Link to="/" target="_blank" className="flex items-center gap-2 group">
              <span className="font-serif-title text-xl font-bold tracking-[0.2em] text-[#FAF8F5] uppercase">
                YUGARK
              </span>
              <span className="text-[10px] tracking-widest text-[#A5C2B1] font-mono uppercase bg-[#1D2B22] px-2 py-0.5 rounded border border-[#2B3E32]">
                CMS v2
              </span>
            </Link>
            <p className="text-[11px] text-[#7C8B82] mt-1 font-mono tracking-wider uppercase">
              Admin &amp; Leads Portal
            </p>
          </div>

          {/* Database Connection Status Badge */}
          <div className="px-4 py-3 border-b border-[#1F2E25] bg-[#16221B]">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-[#8FA195] font-medium flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-[#A5C2B1]" />
                <span>Backend Engine:</span>
              </span>
              {isSupabaseConfigured ? (
                <span className="inline-flex items-center gap-1 text-[#4ADE80] font-mono text-[10px] bg-[#163824] px-2 py-0.5 rounded-full border border-[#235836]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4ADE80] animate-pulse" />
                  Supabase Live
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[#FBBF24] font-mono text-[10px] bg-[#362B16] px-2 py-0.5 rounded-full border border-[#59441D]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FBBF24]" />
                  Sandbox (Local)
                </span>
              )}
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const active = isActive(item.path);
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    active
                      ? 'bg-[#213529] text-[#FAF8F5] font-semibold shadow-sm border border-[#304B3B]'
                      : 'text-[#9CB0A2] hover:text-[#FAF8F5] hover:bg-[#18261E]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${active ? 'text-[#FAF8F5]' : 'text-[#7D9183]'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded uppercase font-mono ${
                        item.badge === 'High Priority'
                          ? 'bg-[#43231B] text-[#FCA5A5] border border-[#642D22]'
                          : 'bg-[#1C3826] text-[#86EFAC] border border-[#265538]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer: User & Quick Links */}
        <div className="p-4 border-t border-[#1F2E25] bg-[#141F19] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 truncate">
              <div className="w-8 h-8 rounded-full bg-[#273B2F] border border-[#3A5443] flex items-center justify-center text-[#FAF8F5] font-serif font-bold text-xs shrink-0">
                YD
              </div>
              <div className="truncate">
                <div className="text-xs font-medium text-[#FAF8F5] truncate">
                  {adminRole?.full_name || 'Studio Admin'}
                </div>
                <div className="text-[10px] text-[#7E8F83] font-mono uppercase tracking-wider truncate">
                  {adminRole?.role || 'super_admin'}
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-1.5 rounded-lg text-[#8FA195] hover:text-[#FAF8F5] hover:bg-[#203126] transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-lg bg-[#1B2921] hover:bg-[#25392E] text-[#A5C2B1] hover:text-[#FAF8F5] text-[11px] font-medium transition-colors border border-[#283C2F]"
          >
            <span>View Public Website</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </aside>

      {/* ==================================================================== */}
      {/* MOBILE / TABLET HEADER                                               */}
      {/* ==================================================================== */}
      <header className="lg:hidden bg-[#111A15] border-b border-[#1F2E25] px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-[#FAF8F5] bg-[#1F2E25] hover:bg-[#2A3E32]"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex flex-col">
            <span className="font-serif-title text-base font-bold text-[#FAF8F5] uppercase tracking-wider">
              YUGARK CMS
            </span>
            <span className="text-[10px] text-[#A5C2B1] font-mono">{currentNav.label}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isSupabaseConfigured ? (
            <span className="inline-flex items-center gap-1 text-[#4ADE80] font-mono text-[10px] bg-[#163824] px-2 py-0.5 rounded-full border border-[#235836]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4ADE80]" />
              Live
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[#FBBF24] font-mono text-[10px] bg-[#362B16] px-2 py-0.5 rounded-full border border-[#59441D]">
              Sandbox
            </span>
          )}
          <Link
            to="/"
            target="_blank"
            className="p-2 rounded-lg text-[#A5C2B1] hover:text-white bg-[#1F2E25]"
            title="Public Website"
          >
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* MOBILE DRAWER */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex">
          <div className="w-72 bg-[#111A15] h-full flex flex-col justify-between p-4 overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#1F2E25] mb-4">
                <span className="font-serif-title text-lg font-bold text-[#FAF8F5] uppercase tracking-wider">
                  Navigation
                </span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg text-[#8FA195] hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="space-y-1">
                {navItems.map((item) => {
                  const active = isActive(item.path);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium ${
                        active
                          ? 'bg-[#213529] text-[#FAF8F5] font-semibold border border-[#304B3B]'
                          : 'text-[#9CB0A2] hover:text-[#FAF8F5] hover:bg-[#18261E]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded font-mono uppercase bg-[#1C3826] text-[#86EFAC]">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="pt-4 border-t border-[#1F2E25]">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#23352A] text-red-300 text-xs font-medium"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}

      {/* ==================================================================== */}
      {/* MAIN WORKSPACE AREA                                                  */}
      {/* ==================================================================== */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar for Desktop */}
        <div className="hidden lg:flex bg-[#EDE8DE] border-b border-[#DFD8CC] px-8 py-3.5 items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-[#5D6B62]">
            <span className="font-mono uppercase tracking-wider text-[11px] text-[#7A8C80]">Admin</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#A5B3A9]" />
            <span className="font-semibold text-[#121614]">{currentNav.label}</span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            {!isSupabaseConfigured && (
              <div className="flex items-center gap-2 bg-[#FDF4DC] border border-[#F3DE9A] text-[#8C6B14] px-3 py-1.5 rounded-lg text-[11px]">
                <AlertCircle className="w-3.5 h-3.5 shrink-0 text-[#C9971E]" />
                <span>
                  <strong>Sandbox Mode Active:</strong> Data changes persist locally. Configure{' '}
                  <code className="bg-[#FAF0CE] px-1 rounded font-mono">VITE_SUPABASE_URL</code> to enable cloud sync.
                </span>
              </div>
            )}
            <div className="text-[11px] font-mono text-[#6A786E]">
              Protected by RLS Policies
            </div>
          </div>
        </div>

        {/* Content View Workspace */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
