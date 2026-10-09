import React, { useState, useEffect } from 'react';
import { BarChart3, Eye, Users, FileText, CheckCircle, TrendingUp, ShieldCheck } from 'lucide-react';
import { adminCmsApi } from '../../../lib/cms';
import { BlogPostRecord, LeadRecord } from '../../../lib/supabase/types';

export const AnalyticsPage: React.FC = () => {
  const [blogs, setBlogs] = useState<BlogPostRecord[]>([]);
  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [blogList, leadList] = await Promise.all([
        adminCmsApi.listBlogPosts(),
        adminCmsApi.listLeads(),
      ]);
      setBlogs(blogList);
      setLeads(leadList);
      setLoading(false);
    }
    load();
  }, []);

  const totalViews = blogs.reduce((sum, b) => sum + adminCmsApi.getBlogViews(b.slug), 0);

  // Leads by source breakdown
  const sourceBreakdown: Record<string, number> = {};
  leads.forEach((l) => {
    const src = l.page_source || 'website_contact';
    sourceBreakdown[src] = (sourceBreakdown[src] || 0) + 1;
  });

  // Leads by status breakdown
  const statusBreakdown: Record<string, number> = {};
  leads.forEach((l) => {
    statusBreakdown[l.status] = (statusBreakdown[l.status] || 0) + 1;
  });

  return (
    <div className="space-y-6">
      <div className="pb-5 border-b border-[#E3DDD1]">
        <span className="text-[11px] font-mono tracking-widest uppercase text-[#738277]">
          Privacy-First Telemetry
        </span>
        <h1 className="font-serif-title text-2xl sm:text-3xl text-[#121614] font-medium mt-1">
          Analytics &amp; Engagement
        </h1>
        <p className="text-xs text-[#5C6A60] mt-1">
          Honest metrics derived directly from server view logs and verified client submissions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-[#E5DFD5] shadow-xs">
          <span className="text-[10px] font-mono uppercase text-[#738277] block mb-1">Total Blog Reads</span>
          <div className="font-serif-title text-3xl font-bold text-[#1B2E24]">{totalViews}</div>
          <p className="text-[11px] text-[#637267] mt-1">Recorded across published articles</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E5DFD5] shadow-xs">
          <span className="text-[10px] font-mono uppercase text-[#738277] block mb-1">Total Inquiries</span>
          <div className="font-serif-title text-3xl font-bold text-[#1B2E24]">{leads.length}</div>
          <p className="text-[11px] text-[#637267] mt-1">Verified lead brief transmissions</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E5DFD5] shadow-xs">
          <span className="text-[10px] font-mono uppercase text-[#738277] block mb-1">Conversion Status</span>
          <div className="font-serif-title text-3xl font-bold text-[#1B2E24]">
            {leads.filter((l) => l.status === 'closed_won').length} Won
          </div>
          <p className="text-[11px] text-[#25D366] font-medium mt-1">High-intent project agreements</p>
        </div>
      </div>

      {/* Two-Column Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Article Reads Table */}
        <div className="bg-white p-6 rounded-2xl border border-[#E5DFD5] shadow-xs">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#F0EBE1]">
            <FileText className="w-4 h-4 text-[#2D4536]" />
            <h3 className="font-serif-title text-base font-semibold text-[#121614]">
              Article Readership Breakdown
            </h3>
          </div>

          <div className="divide-y divide-[#F0EBE1]">
            {blogs.map((b) => {
              const views = adminCmsApi.getBlogViews(b.slug);
              return (
                <div key={b.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="min-w-0 pr-4">
                    <span className="font-medium text-[#121614] block truncate">{b.title}</span>
                    <span className="text-[10px] text-[#76857A] font-mono">/{b.slug}</span>
                  </div>
                  <span className="font-mono font-bold text-xs bg-[#F2EDE4] px-2.5 py-1 rounded-full text-[#1B2E24]">
                    {views} reads
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Lead Sources & Status */}
        <div className="bg-white p-6 rounded-2xl border border-[#E5DFD5] shadow-xs space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#F0EBE1]">
              <Users className="w-4 h-4 text-[#2D4536]" />
              <h3 className="font-serif-title text-base font-semibold text-[#121614]">
                Inquiry Entry Points
              </h3>
            </div>

            <div className="space-y-2 text-xs">
              {Object.entries(sourceBreakdown).map(([source, count]) => (
                <div key={source} className="flex items-center justify-between py-1 border-b border-[#F5F1E9]">
                  <span className="font-mono text-[11px] text-[#556358]">{source}</span>
                  <span className="font-bold text-[#121614]">{count} inquiries</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#F0EBE1]">
              <CheckCircle className="w-4 h-4 text-[#2D4536]" />
              <h3 className="font-serif-title text-base font-semibold text-[#121614]">
                Lead Pipeline Stages
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              {Object.entries(statusBreakdown).map(([status, count]) => (
                <div key={status} className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E8E2D7]">
                  <span className="text-[10px] font-mono uppercase text-[#738277] block">{status}</span>
                  <span className="font-bold text-sm text-[#121614]">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
