import { useState, useEffect, useMemo } from 'react';
import { Header } from '../../components/Layout';
import { StatCard, StatusBadge, FilterButtons, SearchInput, Modal, CardGridSkeleton, EmptyState } from '../../components/common';
import type { LitigationCase, ExternalCounsel } from '../../types';
import { Scale, DollarSign, Users, AlertTriangle, Plus, Eye, Calendar, FileText } from 'lucide-react';
import { lcrmsApi, CreateCaseInput } from '../../services/supabaseLcrms';

const CASE_FILTERS = ['all', 'open', 'trial', 'settled', 'won', 'lost'] as const;
type CaseFilter = typeof CASE_FILTERS[number];

export default function Litigation() {
  const [cases, setCases] = useState<LitigationCase[]>([]);
  const [counsels, setCounsels] = useState<ExternalCounsel[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<CaseFilter>('all');
  const [search, setSearch] = useState('');
  const [selectedCase, setSelectedCase] = useState<LitigationCase | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCounselsModal, setShowCounselsModal] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [casesData, counselsData] = await Promise.all([
        lcrmsApi.litigation.getCases(),
        lcrmsApi.litigation.getCounsels(),
      ]);
      setCases(casesData);
      setCounsels(counselsData);
    } finally {
      setLoading(false);
    }
  };

  const filteredCases = useMemo(() => {
    return cases.filter((c) => {
      const matchesFilter = filter === 'all' || c.status === filter;
      const matchesSearch = !search ||
        (c.title ?? '').toLowerCase().includes(search.toLowerCase()) ||
        (c.case_number ?? '').toLowerCase().includes(search.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [cases, filter, search]);

  const summary = useMemo(() => {
    const totalCosts = cases.reduce((sum, c) => sum + (c.costs ?? []).reduce((cs, cost) => cs + cost.amount, 0), 0);
    const totalExposure = cases.filter(c => ['open', 'trial', 'discovery', 'appeal'].includes(c.status))
      .reduce((sum, c) => sum + (c.claim_amount || 0), 0);
    return {
      total: cases.length,
      open: cases.filter(c => ['open', 'trial', 'discovery', 'appeal'].includes(c.status)).length,
      settled: cases.filter(c => c.status === 'settled').length,
      wonLost: cases.filter(c => c.status === 'won').length - cases.filter(c => c.status === 'lost').length,
      totalCosts,
      totalExposure,
    };
  }, [cases]);

  const handleAddCase = async (data: CreateCaseInput) => {
    try {
      await lcrmsApi.litigation.createCase(data);
      setShowAddModal(false);
      setToast({ message: 'Case created successfully', type: 'success' });
      loadData();
    } catch {
      setToast({ message: 'Failed to create case', type: 'error' });
    }
  };

  if (loading) {
    return (
      <div className="animate-fade-in">
        <Header title="Litigation Management" subtitle="Case & Legal Affairs Tracking" />
        <div className="p-6">
          <CardGridSkeleton count={4} />
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <Header title="Litigation Management" subtitle="Case & Legal Affairs Tracking" />
      <div className="p-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard icon={<Scale size={20} />} label="Total Cases" value={summary.total} />
          <StatCard icon={<AlertTriangle size={20} />} label="Open Cases" value={summary.open} variant="warning" />
          <StatCard icon={<DollarSign size={20} />} label="Total Exposure" value={new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', notation: 'compact' }).format(summary.totalExposure)} variant="error" />
          <StatCard icon={<Users size={20} />} label="External Counsels" value={counsels.length} variant="info" />
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <FilterButtons options={CASE_FILTERS} value={filter} onChange={setFilter} />
            <SearchInput value={search} onChange={setSearch} placeholder="Search cases..." />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowCounselsModal(true)}
              className="flex items-center gap-2 px-4 py-2 border border-slate-600 text-slate-300 hover:bg-slate-700 rounded-xl transition-colors"
            >
              <Users size={18} /> Counsels
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl transition-colors"
            >
              <Plus size={18} /> New Case
            </button>
          </div>
        </div>

        {/* Cases List */}
        {filteredCases.length === 0 ? (
          <EmptyState
            title="No cases found"
            description={search ? "Try adjusting your search" : "No litigation cases to display"}
            action={{ label: "Add Case", onClick: () => setShowAddModal(true) }}
          />
        ) : (
          <div className="space-y-4">
            {filteredCases.map((caseItem, index) => (
              <div
                key={caseItem.id}
                className="bg-slate-800/50 rounded-xl border border-slate-700 p-4 hover:border-amber-600/50 transition-colors cursor-pointer animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={() => { setSelectedCase(caseItem); setShowDetailModal(true); }}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-amber-400 font-mono text-sm">{caseItem.case_number}</span>
                      <StatusBadge status={caseItem.status} />
                      <StatusBadge status={caseItem.type} variant="outline" />
                      <StatusBadge status={caseItem.priority} variant="dot" />
                    </div>
                    <h3 className="text-white font-medium">{caseItem.title}</h3>
                    <p className="text-slate-400 text-sm">{caseItem.plaintiff} vs {caseItem.defendant}</p>
                  </div>
                  <div className="flex items-center gap-6">
                    {caseItem.claim_amount && (
                      <div className="text-right">
                        <p className="text-slate-400 text-xs">Claim Amount</p>
                        <p className="text-white font-medium">
                          {new Intl.NumberFormat('id-ID', { style: 'currency', currency: caseItem.currency || 'IDR', notation: 'compact' }).format(caseItem.claim_amount)}
                        </p>
                      </div>
                    )}
                    <div className="text-right">
                      <p className="text-slate-400 text-xs">Opened</p>
                      <p className="text-slate-300">{caseItem.opened_at}</p>
                    </div>
                    <Eye size={18} className="text-slate-400" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Toast */}
        {toast && (
          <div className={`fixed bottom-4 right-4 px-4 py-3 rounded-xl ${toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'} text-white shadow-lg animate-fade-in`}>
            {toast.message}
            <button onClick={() => setToast(null)} className="ml-4">×</button>
          </div>
        )}

        {/* Case Detail Modal */}
        <Modal isOpen={showDetailModal} onClose={() => setShowDetailModal(false)} title="Case Details" size="xl">
          {selectedCase && <CaseDetail caseItem={selectedCase} />}
        </Modal>

        {/* Add Case Modal */}
        <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="New Case" size="lg">
          <AddCaseForm onSubmit={handleAddCase} onCancel={() => setShowAddModal(false)} />
        </Modal>

        {/* Counsels Modal */}
        <Modal isOpen={showCounselsModal} onClose={() => setShowCounselsModal(false)} title="External Counsels" size="lg">
          <CounselsList counsels={counsels} />
        </Modal>
      </div>
    </div>
  );
}

function CaseDetail({ caseItem }: { caseItem: LitigationCase }) {
  const totalCosts = (caseItem.costs ?? []).reduce((sum, c) => sum + c.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-amber-400 font-mono text-sm mb-1">{caseItem.case_number}</p>
          <h3 className="text-xl font-semibold text-white">{caseItem.title}</h3>
        </div>
        <div className="flex gap-2">
          <StatusBadge status={caseItem.status} />
          <StatusBadge status={caseItem.type} variant="outline" />
          <StatusBadge status={caseItem.priority} variant="dot" />
        </div>
      </div>

      {/* Parties */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-800 rounded-lg p-4">
          <p className="text-slate-400 text-sm">Plaintiff</p>
          <p className="text-white font-medium">{caseItem.plaintiff}</p>
        </div>
        <div className="bg-slate-800 rounded-lg p-4">
          <p className="text-slate-400 text-sm">Defendant</p>
          <p className="text-white font-medium">{caseItem.defendant}</p>
        </div>
      </div>

      {/* Details */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {caseItem.court_name && (
          <div className="bg-slate-800 rounded-lg p-4">
            <p className="text-slate-400 text-sm">Court</p>
            <p className="text-white">{caseItem.court_name}</p>
          </div>
        )}
        <div className="bg-slate-800 rounded-lg p-4">
          <p className="text-slate-400 text-sm">Jurisdiction</p>
          <p className="text-white">{caseItem.jurisdiction || '-'}</p>
        </div>
        {caseItem.claim_amount && (
          <div className="bg-slate-800 rounded-lg p-4">
            <p className="text-slate-400 text-sm">Claim Amount</p>
            <p className="text-white font-medium">
              {new Intl.NumberFormat('id-ID', { style: 'currency', currency: caseItem.currency || 'IDR' }).format(caseItem.claim_amount)}
            </p>
          </div>
        )}
        {caseItem.external_counsel_name && (
          <div className="bg-slate-800 rounded-lg p-4">
            <p className="text-slate-400 text-sm">External Counsel</p>
            <p className="text-white">{caseItem.external_counsel_name}</p>
          </div>
        )}
      </div>

      {/* Subject Matter */}
      <div className="bg-slate-800 rounded-lg p-4">
        <p className="text-slate-400 text-sm mb-2">Subject Matter</p>
        <p className="text-white">{caseItem.subject_matter}</p>
      </div>

      {/* Timeline */}
      {(caseItem.timeline?.length ?? 0) > 0 && (
        <div>
          <h4 className="text-white font-medium mb-3 flex items-center gap-2">
            <Calendar size={18} /> Timeline
          </h4>
          <div className="space-y-3">
            {caseItem.timeline.map((event) => (
              <div key={event.id} className="flex items-start gap-4">
                <div className="w-2 h-2 mt-2 rounded-full bg-amber-400" />
                <div className="flex-1 bg-slate-800 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white font-medium">{event.title}</span>
                    <span className="text-slate-400 text-sm">{event.date}</span>
                  </div>
                  {event.description && <p className="text-slate-300 text-sm">{event.description}</p>}
                  {event.location && <p className="text-slate-400 text-xs mt-1">{event.location}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Documents */}
      {(caseItem.documents?.length ?? 0) > 0 && (
        <div>
          <h4 className="text-white font-medium mb-3 flex items-center gap-2">
            <FileText size={18} /> Documents
          </h4>
          <div className="grid grid-cols-2 gap-3">
            {caseItem.documents.map((doc) => (
              <div key={doc.id} className="bg-slate-800 rounded-lg p-3 flex items-center gap-3">
                <FileText size={18} className="text-amber-400" />
                <div>
                  <p className="text-white text-sm">{doc.name}</p>
                  <p className="text-slate-400 text-xs">{doc.document_type}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Costs */}
      {(caseItem.costs?.length ?? 0) > 0 && (
        <div>
          <h4 className="text-white font-medium mb-3 flex items-center gap-2">
            <DollarSign size={18} /> Costs
            <span className="text-amber-400 ml-auto">
              Total: {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(totalCosts)}
            </span>
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-800">
                <tr>
                  <th className="text-left p-3 text-sm font-medium text-slate-400">Description</th>
                  <th className="text-left p-3 text-sm font-medium text-slate-400">Category</th>
                  <th className="text-left p-3 text-sm font-medium text-slate-400">Amount</th>
                  <th className="text-left p-3 text-sm font-medium text-slate-400">Status</th>
                </tr>
              </thead>
              <tbody>
                {caseItem.costs.map((cost) => (
                  <tr key={cost.id} className="border-t border-slate-700">
                    <td className="p-3 text-white">{cost.description}</td>
                    <td className="p-3"><StatusBadge status={cost.category.replace('_', ' ')} variant="outline" size="sm" /></td>
                    <td className="p-3 text-white">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: cost.currency }).format(cost.amount)}</td>
                    <td className="p-3"><StatusBadge status={cost.paid ? 'paid' : 'pending'} size="sm" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Outcome */}
      {caseItem.outcome && (
        <div className="bg-emerald-900/30 border border-emerald-600/50 rounded-lg p-4">
          <p className="text-emerald-300 font-medium">Outcome</p>
          <p className="text-white">{caseItem.outcome}</p>
          {caseItem.settlement_amount && (
            <p className="text-slate-300 mt-2">
              Settlement: {new Intl.NumberFormat('id-ID', { style: 'currency', currency: caseItem.currency || 'IDR' }).format(caseItem.settlement_amount)}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function CounselsList({ counsels }: { counsels: ExternalCounsel[] }) {
  return (
    <div className="space-y-4">
      {counsels.map((counsel) => (
        <div key={counsel.id} className="bg-slate-800 rounded-lg p-4">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h4 className="text-white font-medium">{counsel.firm_name}</h4>
              <p className="text-slate-400 text-sm">{counsel.contact_person}</p>
            </div>
            <StatusBadge status={counsel.status} />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-slate-400">Email</p>
              <p className="text-white">{counsel.email}</p>
            </div>
            <div>
              <p className="text-slate-400">Phone</p>
              <p className="text-white">{counsel.phone}</p>
            </div>
            <div>
              <p className="text-slate-400">Cases Handled</p>
              <p className="text-white">{counsel.cases_handled} ({counsel.cases_won} won)</p>
            </div>
            <div>
              <p className="text-slate-400">Rating</p>
              <p className="text-amber-400">{'★'.repeat(Math.round(counsel.performance_rating))}</p>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {counsel.specialization.map((spec) => (
              <span key={spec} className="px-2 py-1 bg-slate-700 rounded text-xs text-slate-300">{spec}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function AddCaseForm({ onSubmit, onCancel }: { onSubmit: (data: CreateCaseInput) => void; onCancel: () => void }) {
  const [formData, setFormData] = useState<CreateCaseInput>({
    title: '',
    type: 'litigation',
    court_name: '',
    jurisdiction: '',
    plaintiff: '',
    defendant: '',
    subject_matter: '',
    claim_amount: undefined,
    currency: 'IDR',
    priority: 'medium',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="block text-sm font-medium text-slate-300 mb-1">Case Title</label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-amber-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Case Type</label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as LitigationCase['type'] })}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-amber-500"
          >
            <option value="litigation">Litigation</option>
            <option value="non_litigation">Non-Litigation</option>
            <option value="arbitration">Arbitration</option>
            <option value="mediation">Mediation</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Priority</label>
          <select
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value as LitigationCase['priority'] })}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-amber-500"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Plaintiff</label>
          <input
            type="text"
            required
            value={formData.plaintiff}
            onChange={(e) => setFormData({ ...formData, plaintiff: e.target.value })}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-amber-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Defendant</label>
          <input
            type="text"
            required
            value={formData.defendant}
            onChange={(e) => setFormData({ ...formData, defendant: e.target.value })}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-amber-500"
          />
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium text-slate-300 mb-1">Subject Matter</label>
          <textarea
            required
            value={formData.subject_matter}
            onChange={(e) => setFormData({ ...formData, subject_matter: e.target.value })}
            rows={2}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-amber-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Claim Amount</label>
          <input
            type="number"
            value={formData.claim_amount || ''}
            onChange={(e) => setFormData({ ...formData, claim_amount: e.target.value ? Number(e.target.value) : undefined })}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-amber-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Currency</label>
          <select
            value={formData.currency}
            onChange={(e) => setFormData({ ...formData, currency: e.target.value as 'SAR' | 'IDR' | 'USD' })}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-amber-500"
          >
            <option value="IDR">IDR</option>
            <option value="SAR">SAR</option>
            <option value="USD">USD</option>
          </select>
        </div>
      </div>
      <div className="flex gap-3 pt-4">
        <button type="button" onClick={onCancel} className="flex-1 px-4 py-2 border border-slate-600 text-slate-300 rounded-xl hover:bg-slate-700 transition-colors">Cancel</button>
        <button type="submit" className="flex-1 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl transition-colors">Create Case</button>
      </div>
    </form>
  );
}

export { Litigation };
