import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  MonitorPlay,
  FileText,
  Briefcase,
  Eye,
  PlusCircle,
  ArrowRight,
  ExternalLink,
  Clock,
  Sparkles,
  CheckCircle,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';
import { adminCmsApi, getPublishedDemos, getPublishedBlogPosts, getPublishedServices } from '../../lib/cms';
import { LeadRecord, WebsiteDemoRecord, BlogPostRecord } from '../../lib/supabase/types';
import { isSupabaseConfigured } from '../../lib/supabase/client';

export const OverviewDashboard: React.FC = () => {
  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [demos, setDemos] = useState<WebsiteDemoRecord[]>([]);
  const [blogs, setBlogs] = useState<BlogPostRecord[]>([]);
  const [servicesCount, setServicesCount] = useState(5);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMetrics() {
      try {
        const [leadList, demoList, blogList, services] = await Promise.all([
          adminCmsApi.listLeads(),
          adminCmsApi.listDemos(),
          adminCmsApi.listBlogPosts(),
          adminCmsApi.listServices(),
        ]);
        setLeads(leadList);
        setDemos(demoList);
        setBlogs(blogList);
        setServicesCount(services.length);
      } catch (err) {
        console.error('Failed to load overview data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadMetrics();

    // Listen for custom CMS updates
    const handleUpdate = () => loadMetrics();
    window.addEventListener('yugark-cms-updated', handleUpdate);
    return () => window.removeEventListener('yugark-cms-updated', handleUpdate);
  }, []);

  const totalLeads = leads.length;
  const newLeads = leads.filter((l) => l.status === 'new').length;
  const followUpLeads = leads.filter((l) => l.status === 'contacted' || l.status === 'in_discussion').length;
  const publishedDemos = demos.filter((d) => d.status === 'published').length;
  const publishedBlogs = blogs.filter((b) => b.status === 'published').length;

  // Calculate total tracked views from actual storage
  const totalViews = blogs.reduce((acc, b) => acc + adminCmsApi.getBlogViews(b.slug), 0);

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-[#556358]">
        <div className="w-8 h-8 border-2 border-[#2D4536] border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-xs font-mono">Aggregating Studio Metrics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-[#E3DDD1]">
        <div>
          <span className="text-[11px] font-mono tracking-widest uppercase text-[#738277] block mb-1">
            Studio Operations Overview
          </span>
          <h1 className="font-serif-title text-2xl sm:text-3xl text-[#121614] font-medium">
            Management &amp; Content Command
          </h1>
          <p className="text-xs text-[#5C6A60] mt-1">
            Real-time status of website demos, client enquiries, published editorial, and active services.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2.5">
          <Link
            to="/admin/demos"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#1B2E24] text-white text-xs font-medium hover:bg-[#253D30] transition-colors shadow-sm"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Add Demo</span>
          </Link>
          <Link
            to="/admin/blog"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#E8E1D5] text-[#121614] text-xs font-medium hover:bg-[#DED5C7] transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Write Article</span>
          </Link>
          <Link
            to="/admin/leads"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#D5CDC0] text-[#121614] text-xs font-medium hover:bg-[#FAF7F2] transition-colors"
          >
            <Users className="w-3.5 h-3.5 text-[#2D4536]" />
            <span>Leads CRM</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* Card 1: Total Leads */}
        <div className="bg-white p-4 rounded-2xl border border-[#E5DFD5] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#6D7B71] mb-2">
            <span className="text-[10px] uppercase font-mono tracking-wider font-semibold">Total Leads</span>
            <Users className="w-4 h-4 text-[#2D4536]" />
          </div>
          <div>
            <div className="font-serif-title text-2xl sm:text-3xl font-semibold text-[#121614]">
              {totalLeads}
            </div>
            <div className="text-[11px] text-[#25D366] font-medium mt-1">
              {newLeads} new awaiting review
            </div>
          </div>
        </div>

        {/* Card 2: Follow-Up Leads */}
        <div className="bg-white p-4 rounded-2xl border border-[#E5DFD5] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#6D7B71] mb-2">
            <span className="text-[10px] uppercase font-mono tracking-wider font-semibold">In Discussion</span>
            <Clock className="w-4 h-4 text-[#C5A880]" />
          </div>
          <div>
            <div className="font-serif-title text-2xl sm:text-3xl font-semibold text-[#121614]">
              {followUpLeads}
            </div>
            <div className="text-[11px] text-[#718075] mt-1">
              Active prospect scopes
            </div>
          </div>
        </div>

        {/* Card 3: Website Demos */}
        <div className="bg-white p-4 rounded-2xl border border-[#E5DFD5] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#6D7B71] mb-2">
            <span className="text-[10px] uppercase font-mono tracking-wider font-semibold">Live Demos</span>
            <MonitorPlay className="w-4 h-4 text-[#2D4536]" />
          </div>
          <div>
            <div className="font-serif-title text-2xl sm:text-3xl font-semibold text-[#121614]">
              {publishedDemos}
            </div>
            <div className="text-[11px] text-[#718075] mt-1">
              {demos.length} total in system
            </div>
          </div>
        </div>

        {/* Card 4: Published Articles */}
        <div className="bg-white p-4 rounded-2xl border border-[#E5DFD5] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#6D7B71] mb-2">
            <span className="text-[10px] uppercase font-mono tracking-wider font-semibold">Editorial</span>
            <FileText className="w-4 h-4 text-[#2D4536]" />
          </div>
          <div>
            <div className="font-serif-title text-2xl sm:text-3xl font-semibold text-[#121614]">
              {publishedBlogs}
            </div>
            <div className="text-[11px] text-[#718075] mt-1">
              Articles on /blog
            </div>
          </div>
        </div>

        {/* Card 5: Core Services */}
        <div className="bg-white p-4 rounded-2xl border border-[#E5DFD5] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#6D7B71] mb-2">
            <span className="text-[10px] uppercase font-mono tracking-wider font-semibold">Services</span>
            <Briefcase className="w-4 h-4 text-[#2D4536]" />
          </div>
          <div>
            <div className="font-serif-title text-2xl sm:text-3xl font-semibold text-[#121614]">
              {servicesCount}
            </div>
            <div className="text-[11px] text-[#718075] mt-1">
              Discipline offerings
            </div>
          </div>
        </div>

        {/* Card 6: Tracked Views */}
        <div className="bg-white p-4 rounded-2xl border border-[#E5DFD5] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#6D7B71] mb-2">
            <span className="text-[10px] uppercase font-mono tracking-wider font-semibold">Blog Views</span>
            <Eye className="w-4 h-4 text-[#2D4536]" />
          </div>
          <div>
            <div className="font-serif-title text-2xl sm:text-3xl font-semibold text-[#121614]">
              {totalViews}
            </div>
            <div className="text-[11px] text-[#718075] mt-1">
              Actual recorded reads
            </div>
          </div>
        </div>
      </div>

      {/* Main Two-Column Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Column 1: Recent Leads CRM */}
        <div className="bg-white rounded-2xl border border-[#E5DFD5] p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#F0EBE1]">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#2D4536]" />
                <h2 className="font-serif-title text-lg font-semibold text-[#121614]">
                  Recent Client Enquiries
                </h2>
              </div>
              <Link
                to="/admin/leads"
                className="text-xs font-semibold text-[#2D4536] hover:text-[#121614] flex items-center gap-1"
              >
                <span>View All ({leads.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {leads.length === 0 ? (
              <div className="py-10 text-center text-xs text-[#829186]">
                No leads recorded yet. Inquiries from the website contact form will appear here.
              </div>
            ) : (
              <div className="divide-y divide-[#F3EFE6]">
                {leads.slice(0, 4).map((lead) => (
                  <div key={lead.id} className="py-3 flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-[#121614]">{lead.name}</span>
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded uppercase font-mono font-bold ${
                            lead.status === 'new'
                              ? 'bg-emerald-100 text-emerald-800'
                              : lead.status === 'contacted'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-stone-100 text-stone-700'
                          }`}
                        >
                          {lead.status}
                        </span>
                      </div>
                      <div className="text-[11px] text-[#637267] mt-0.5">
                        {lead.service} • {lead.email}
                      </div>
                      <p className="text-[11px] text-[#7A8A7F] line-clamp-1 mt-1 italic">
                        "{lead.requirement}"
                      </p>
                    </div>
                    <span className="text-[10px] font-mono text-[#8C9C90] shrink-0">
                      {new Date(lead.created_at).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-[#F0EBE1] mt-4 flex items-center justify-between text-xs text-[#637267]">
            <span>Spam honeypot &amp; rate-limiting active</span>
            <Link to="/contact" target="_blank" className="text-[#2D4536] hover:underline flex items-center gap-1">
              <span>Test Contact Form</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Column 2: Turnkey Demos Status */}
        <div className="bg-white rounded-2xl border border-[#E5DFD5] p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#F0EBE1]">
              <div className="flex items-center gap-2">
                <MonitorPlay className="w-4 h-4 text-[#2D4536]" />
                <h2 className="font-serif-title text-lg font-semibold text-[#121614]">
                  Website Demos ({publishedDemos} Published)
                </h2>
              </div>
              <Link
                to="/admin/demos"
                className="text-xs font-semibold text-[#2D4536] hover:text-[#121614] flex items-center gap-1"
              >
                <span>Demo Manager</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {demos.slice(0, 4).map((demo) => (
                <div
                  key={demo.id}
                  className="p-3 rounded-xl border border-[#EDE7DD] bg-[#FAF8F5] flex items-center gap-3"
                >
                  <img
                    src={demo.thumbnail_url}
                    alt={demo.title}
                    className="w-14 h-10 object-cover rounded-lg shrink-0 border border-[#DDD5C7]"
                  />
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-semibold text-[#121614] truncate">{demo.title}</h4>
                    <p className="text-[10px] text-[#718075] truncate">{demo.category_name || 'Turnkey Demo'}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[9px] font-mono text-[#25D366] font-medium uppercase">
                        {demo.status}
                      </span>
                      {demo.is_featured && (
                        <span className="text-[9px] font-mono text-[#C5A880] uppercase">★ Featured</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-[#F0EBE1] mt-4 flex items-center justify-between text-xs text-[#637267]">
            <span>Connected to /demos and homepage gallery</span>
            <Link to="/demos" target="_blank" className="text-[#2D4536] hover:underline flex items-center gap-1">
              <span>View Public /demos</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
