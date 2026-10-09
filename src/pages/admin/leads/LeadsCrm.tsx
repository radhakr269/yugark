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
} from 'lucide-react';
import { adminCmsApi } from '../../../lib/cms';
import { LeadRecord } from '../../../lib/supabase/types';

export const LeadsCrm: React.FC = () => {
  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  // Selected Lead Drawer State
  const [selectedLead, setSelectedLead] = useState<LeadRecord | null>(null);
  const [drawerRemarks, setDrawerRemarks] = useState('');
  const [drawerStatus, setDrawerStatus] = useState<LeadRecord['status']>('new');
  const [drawerPriority, setDrawerPriority] = useState<LeadRecord['priority']>('normal');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    loadLeads();
  }, []);

  async function loadLeads() {
    setLoading(true);
    try {
      const list = await adminCmsApi.listLeads();
      setLeads(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleSelectLead = (lead: LeadRecord) => {
    setSelectedLead(lead);
    setDrawerRemarks(lead.remarks || '');
    setDrawerStatus(lead.status);
    setDrawerPriority(lead.priority);
  };

  const handleSaveLeadDrawer = async () => {
    if (!selectedLead) return;
    setIsUpdating(true);
    try {
      const updated = await adminCmsApi.updateLeadStatus(
        selectedLead.id,
        drawerStatus,
        drawerRemarks
      );
      await adminCmsApi.updateLeadPriority(selectedLead.id, drawerPriority);
      setSelectedLead({ ...selectedLead, status: drawerStatus, priority: drawerPriority, remarks: drawerRemarks });
      await loadLeads();
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  // Export Leads to CSV
  const handleExportCsv = () => {
    if (leads.length === 0) return;
    const headers = ['Ref ID', 'Name', 'Email', 'Phone', 'Service', 'Timeline', 'Status', 'Priority', 'Requirement', 'Date'];
    const rows = leads.map((l) => [
      `"${l.id}"`,
      `"${l.name}"`,
      `"${l.email}"`,
      `"${l.phone || ''}"`,
      `"${l.service || ''}"`,
      `"${l.timeline || ''}"`,
      `"${l.status}"`,
      `"${l.priority}"`,
      `"${(l.requirement || '').replace(/"/g, '""')}"`,
      `"${new Date(l.created_at).toISOString()}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `yugark-leads-export-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredLeads = leads.filter((l) => {
    const matchesSearch =
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.email.toLowerCase().includes(search.toLowerCase()) ||
      (l.phone && l.phone.includes(search)) ||
      l.requirement.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || l.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || l.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
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

        <button
          onClick={handleExportCsv}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-[#DDD5C7] text-[#121614] text-xs font-semibold hover:bg-[#FAF8F5] transition-colors shadow-xs self-start sm:self-auto cursor-pointer"
        >
          <Download className="w-4 h-4 text-[#2D4536]" />
          <span>Export CSV</span>
        </button>
      </div>

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
                      <div className="font-semibold text-xs text-[#121614]">{lead.name}</div>
                      <div className="text-[11px] text-[#637267] font-mono">{lead.email}</div>
                      {lead.phone && (
                        <div className="text-[10px] text-[#86968B] font-mono">{lead.phone}</div>
                      )}
                    </td>

                    <td className="py-3 px-4 text-[#556358] font-medium">
                      {lead.service || 'General Inquiry'}
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
