import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Filter,
  Download,
  Mail,
  Phone,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle,
  X,
  ExternalLink,
  Save,
  Calendar,
  RefreshCw,
} from 'lucide-react';
import { adminCmsApi } from '../../../lib/cms';
import { LeadRecord } from '../../../lib/supabase/types';

export const LeadsCrm: React.FC = () => {
  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [serviceFilter, setServiceFilter] = useState('all');

  // Selected Lead Drawer State
  const [selectedLead, setSelectedLead] = useState<LeadRecord | null>(null);
  const [drawerRemarks, setDrawerRemarks] = useState('');
  const [drawerStatus, setDrawerStatus] = useState<LeadRecord['status']>('new');
  const [drawerPriority, setDrawerPriority] = useState<LeadRecord['priority']>('normal');
  const [isUpdating, setIsUpdating] = useState(false);
  const [drawerError, setDrawerError] = useState<string | null>(null);

  useEffect(() => {
    loadLeads();
  }, []);

  async function loadLeads() {
    setLoading(true);
    setFetchError(null);
    try {
      const list = await adminCmsApi.listLeads();
      setLeads(list);
    } catch (err: any) {
      console.error('[Leads CRM] Error fetching leads:', err);
      setFetchError(
        err.message || 'Unable to retrieve leads from the Supabase database. Please check authorization.'
      );
    } finally {
      setLoading(false);
    }
  }

  const handleSelectLead = (lead: LeadRecord) => {
    setSelectedLead(lead);
    setDrawerRemarks(lead.remarks || '');
    setDrawerStatus(lead.status || 'new');
    setDrawerPriority(lead.priority || 'normal');
    setDrawerError(null);
  };

  const handleSaveLeadDrawer = async () => {
    if (!selectedLead) return;
    setIsUpdating(true);
    setDrawerError(null);
    try {
      const updated = await adminCmsApi.updateLeadStatus(
        selectedLead.id,
        drawerStatus,
        drawerRemarks
      );
      await adminCmsApi.updateLeadPriority(selectedLead.id, drawerPriority);
      setSelectedLead({
        ...selectedLead,
        status: drawerStatus,
        priority: drawerPriority,
        remarks: drawerRemarks,
      });
      await loadLeads();
    } catch (err: any) {
      console.error('[Leads CRM] Error updating lead:', err);
      setDrawerError(err.message || 'Failed to update lead record in the database.');
    } finally {
      setIsUpdating(false);
    }
  };

  // Export Leads to CSV
  const handleExportCsv = () => {
    if (leads.length === 0) return;
    const headers = [
      'Ref ID',
      'Name',
      'Email',
      'Phone',
      'Business',
      'Service',
      'Timeline',
      'Status',
      'Priority',
      'Requirement',
      'Date',
    ];
    const rows = leads.map((l) => [
      `"${l.id}"`,
      `"${(l.name || 'Anonymous').replace(/"/g, '""')}"`,
      `"${(l.email || '').replace(/"/g, '""')}"`,
      `"${(l.phone || '').replace(/"/g, '""')}"`,
      `"${(l.business_name || '').replace(/"/g, '""')}"`,
      `"${(l.service || 'General Inquiry').replace(/"/g, '""')}"`,
      `"${(l.timeline || 'Standard').replace(/"/g, '""')}"`,
      `"${l.status || 'new'}"`,
      `"${l.priority || 'normal'}"`,
      `"${(l.requirement || '').replace(/"/g, '""')}"`,
      `"${new Date(l.created_at || Date.now()).toISOString()}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `yugark-leads-export-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredLeads = leads.filter((l) => {
    const nameStr = (l.name || '').toLowerCase();
    const emailStr = (l.email || '').toLowerCase();
    const phoneStr = (l.phone || '');
    const reqStr = (l.requirement || '').toLowerCase();
    const bizStr = (l.business_name || '').toLowerCase();
    const searchLower = search.toLowerCase().trim();

    const matchesSearch =
      !searchLower ||
      nameStr.includes(searchLower) ||
      emailStr.includes(searchLower) ||
      phoneStr.includes(searchLower) ||
      bizStr.includes(searchLower) ||
      reqStr.includes(searchLower);

    const matchesStatus = statusFilter === 'all' || (l.status || '').toLowerCase() === statusFilter.toLowerCase();
    const matchesPriority =
      priorityFilter === 'all' || (l.priority || '').toLowerCase() === priorityFilter.toLowerCase();
    const matchesService = serviceFilter === 'all' || (l.service || '') === serviceFilter;

    return matchesSearch && matchesStatus && matchesPriority && matchesService;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-[#E3DDD1]">
        <div>
          <span className="text-[11px] font-mono tracking-widest uppercase text-[#738277]">
            Lead Ingestion &amp; Dispatch
          </span>
          <h1 className="font-serif-title text-2xl sm:text-3xl text-[#121614] font-medium mt-1">
            Leads CRM &amp; Project Inquiries
          </h1>
          <p className="text-xs text-[#5C6A60] mt-1">
            Manage prospect briefs submitted through website contact forms and direct WhatsApp entry points.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={loadLeads}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-[#DDD5C7] text-[#121614] text-xs font-semibold hover:bg-[#FAF8F5] transition-colors shadow-xs cursor-pointer disabled:opacity-60"
            title="Reload leads from database"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#2D4536] ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={handleExportCsv}
            disabled={leads.length === 0}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#DDD5C7] text-[#121614] text-xs font-semibold hover:bg-[#FAF8F5] transition-colors shadow-xs cursor-pointer disabled:opacity-50"
          >
            <Download className="w-4 h-4 text-[#2D4536]" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* CRM Database Error Notification (Visible rather than silently showing empty list) */}
      {fetchError && (
        <div className="bg-red-50/90 border border-red-300 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-red-100 text-red-700 shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-red-900 uppercase font-mono tracking-wider">
                Database Synchronization Alert
              </h3>
              <p className="text-xs text-red-700 mt-1 leading-relaxed max-w-2xl">
                {fetchError}
              </p>
              <p className="text-[11px] text-red-600 mt-1 font-mono">
                Ensure your administrator user is authenticated and present in <code className="bg-red-100 px-1 rounded">public.admin_roles</code>.
              </p>
            </div>
          </div>
          <button
            onClick={loadLeads}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-red-700 text-white text-xs font-semibold hover:bg-red-800 transition-colors shadow-xs shrink-0 cursor-pointer self-start sm:self-auto"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry Query</span>
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E5DFD5] shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search leads by name, email, or message..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#FAF8F5] border border-[#DDD5C7] text-xs focus:outline-none"
          />
          <Search className="w-4 h-4 text-[#8C988F] absolute left-3 top-2.5" />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#FAF8F5] border border-[#DDD5C7] rounded-lg px-2.5 py-1.5 text-xs text-[#121614] focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="in_discussion">In Discussion</option>
            <option value="proposal_sent">Proposal Sent</option>
            <option value="closed_won">Closed Won</option>
            <option value="closed_lost">Closed Lost</option>
          </select>

          <select
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
            className="bg-[#FAF8F5] border border-[#DDD5C7] rounded-lg px-2.5 py-1.5 text-xs text-[#121614] focus:outline-none"
          >
            <option value="all">All Services</option>
            <option value="Free Website Demo">Free Website Demo ✨</option>
            <option value="Website Development">Website Development</option>
            <option value="Social Media">Social Media</option>
            <option value="Ads">Ads</option>
            <option value="AI Creative">AI Creative</option>
            <option value="Branding">Branding</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-[#FAF8F5] border border-[#DDD5C7] rounded-lg px-2.5 py-1.5 text-xs text-[#121614] focus:outline-none"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="normal">Normal</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-2xl border border-[#E5DFD5] shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-[#6A786E]">Loading client leads...</div>
        ) : filteredLeads.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#718075]">No leads found matching criteria.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8F6F1] border-b border-[#E5DFD5] text-[11px] font-mono uppercase text-[#6C7B71]">
                <tr>
                  <th className="py-3 px-4">Ref / Lead</th>
                  <th className="py-3 px-4">Discipline</th>
                  <th className="py-3 px-4">Timeline</th>
                  <th className="py-3 px-4 text-center">Priority</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Received</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0EBE1]">
                {filteredLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    onClick={() => handleSelectLead(lead)}
                    className="hover:bg-[#FAF8F5] transition-colors cursor-pointer"
                  >
                    <td className="py-3 px-4">
                      <div className="font-semibold text-xs text-[#121614] flex items-center gap-1.5">
                        <span>{lead.name}</span>
                        {lead.business_name && (
                          <span className="text-[10px] font-normal text-[#606D63] bg-[#EBE4D8] px-1.5 py-0.2 rounded">
                            {lead.business_name}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-[#637267] font-mono">{lead.email}</div>
                      {lead.phone && (
                        <div className="text-[10px] text-[#86968B] font-mono">{lead.phone}</div>
                      )}
                    </td>

                    <td className="py-3 px-4 text-[#556358] font-medium">
                      {lead.service === 'Free Website Demo' ? (
                        <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-md font-semibold bg-[#E4EEE7] text-[#1B4028] border border-[#BACFC1]">
                          <span>Free Demo</span>
                          <span className="text-amber-600">✨</span>
                        </span>
                      ) : (
                        lead.service || 'General Inquiry'
                      )}
                    </td>

                    <td className="py-3 px-4 text-[#75847A]">
                      {lead.timeline || 'Standard'}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span
                        className={`text-[9px] px-2 py-0.5 rounded font-mono uppercase font-bold ${
                          lead.priority === 'urgent'
                            ? 'bg-red-100 text-red-800'
                            : lead.priority === 'high'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-stone-100 text-stone-700'
                        }`}
                      >
                        {lead.priority}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span
                        className={`text-[9px] px-2 py-0.5 rounded font-mono uppercase font-bold ${
                          lead.status === 'new'
                            ? 'bg-emerald-100 text-emerald-800'
                            : lead.status === 'contacted'
                            ? 'bg-blue-100 text-blue-800'
                            : lead.status === 'in_discussion'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-stone-200 text-stone-800'
                        }`}
                      >
                        {lead.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right font-mono text-[11px] text-[#8C9C90]">
                      {new Date(lead.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ==================================================================== */}
      {/* LEAD DETAILS SLIDE-OUT DRAWER                                        */}
      {/* ==================================================================== */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-lg bg-[#FAF8F5] h-full shadow-2xl border-l border-[#DDD5C7] flex flex-col justify-between overflow-y-auto p-6 space-y-6">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#E8E1D5]">
                <div>
                  <span className="text-[10px] font-mono text-[#79887E] uppercase block">
                    Inquiry Ref: {selectedLead.id}
                  </span>
                  <h3 className="font-serif-title text-xl font-medium text-[#121614]">
                    {selectedLead.name}
                  </h3>
                  {selectedLead.business_name && (
                    <p className="text-xs text-[#2D4536] font-semibold mt-0.5">
                      {selectedLead.business_name}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => setSelectedLead(null)}
                  className="p-1.5 rounded-lg text-[#79887E] hover:text-[#121614]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Direct Actions: WhatsApp / Email */}
              <div className="flex items-center gap-2 py-4">
                {selectedLead.phone && (
                  <a
                    href={`https://wa.me/${selectedLead.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                      `Hello ${selectedLead.name}, this is Yugark Digital Studio following up on your project inquiry for ${selectedLead.service}.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#25D366] text-white text-xs font-semibold hover:bg-[#20BA5A] transition-colors shadow-xs"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp Client</span>
                  </a>
                )}
                <a
                  href={`mailto:${selectedLead.email}?subject=Yugark%20Digital%20Studio%20—%20${encodeURIComponent(
                    selectedLead.service || 'Project Inquiry'
                  )}`}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#1B2E24] text-white text-xs font-semibold hover:bg-[#284434] transition-colors shadow-xs"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Send Email</span>
                </a>
              </div>

              {/* Scope & Requirement */}
              <div className="bg-white p-4 rounded-2xl border border-[#E5DFD5] space-y-3 mb-5">
                <span className="text-[10px] font-semibold uppercase text-[#738277] block font-mono">
                  Project Requirement
                </span>
                <p className="text-xs text-[#121614] leading-relaxed whitespace-pre-wrap">
                  {selectedLead.requirement}
                </p>

                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#F0EBE1] text-[11px]">
                  <div>
                    <span className="text-[#88988D] block">Requested Service:</span>
                    <span className="font-medium text-[#121614]">{selectedLead.service}</span>
                  </div>
                  <div>
                    <span className="text-[#88988D] block">Timeline Target:</span>
                    <span className="font-medium text-[#121614]">{selectedLead.timeline}</span>
                  </div>
                </div>
              </div>

              {/* Status and Priority Controls */}
              <div className="bg-white p-4 rounded-2xl border border-[#E5DFD5] space-y-4">
                <span className="text-[10px] font-semibold uppercase text-[#738277] block font-mono">
                  CRM Governance
                </span>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase font-semibold text-[#637267] mb-1">
                      Lead Status
                    </label>
                    <select
                      value={drawerStatus}
                      onChange={(e) => setDrawerStatus(e.target.value as any)}
                      className="w-full px-2.5 py-1.5 rounded-xl bg-[#FAF8F5] border border-[#DDD5C7] text-xs"
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="in_discussion">In Discussion</option>
                      <option value="proposal_sent">Proposal Sent</option>
                      <option value="closed_won">Closed Won</option>
                      <option value="closed_lost">Closed Lost</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-semibold text-[#637267] mb-1">
                      Priority
                    </label>
                    <select
                      value={drawerPriority}
                      onChange={(e) => setDrawerPriority(e.target.value as any)}
                      className="w-full px-2.5 py-1.5 rounded-xl bg-[#FAF8F5] border border-[#DDD5C7] text-xs"
                    >
                      <option value="urgent">Urgent</option>
                      <option value="high">High</option>
                      <option value="normal">Normal</option>
                      <option value="low">Low</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-semibold text-[#637267] mb-1">
                    Internal Studio Remarks / Notes
                  </label>
                  <textarea
                    rows={3}
                    value={drawerRemarks}
                    onChange={(e) => setDrawerRemarks(e.target.value)}
                    placeholder="Log client discussions, milestones, quote numbers, or WhatsApp notes..."
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#DDD5C7] text-xs leading-relaxed"
                  />
                </div>
              </div>
            </div>

            {/* Drawer Error Notice */}
            {drawerError && (
              <div className="p-3 my-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{drawerError}</span>
              </div>
            )}

            {/* Save Button */}
            <div className="pt-4 border-t border-[#E8E1D5]">
              <button
                onClick={handleSaveLeadDrawer}
                disabled={isUpdating}
                className="w-full py-3 rounded-xl bg-[#1B2E24] text-white text-xs font-semibold hover:bg-[#284434] transition-colors shadow-sm cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isUpdating ? 'Saving...' : 'Update Lead in CRM'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
