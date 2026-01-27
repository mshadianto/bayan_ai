import { useState, useEffect, useMemo } from 'react';
import { Header } from '../../components/Layout';
import { StatCard, StatusBadge, FilterButtons, SearchInput, Modal, CardGridSkeleton, EmptyState } from '../../components/common';
import type { Risk, RiskHeatmapCell } from '../../types';
import { AlertTriangle, Shield, TrendingDown, CheckCircle, Plus, Eye } from 'lucide-react';
import { lcrmsApi, CreateRiskInput } from '../../services/mockData/lcrms';

const RISK_FILTERS = ['all', 'critical', 'high', 'medium', 'low'] as const;
type RiskFilter = typeof RISK_FILTERS[number];

const RISK_LEVEL_COLORS: Record<Risk['level'], string> = {
  critical: 'bg-red-500',
  high: 'bg-orange-500',
  medium: 'bg-yellow-500',
  low: 'bg-emerald-500',
};

export default function RiskManagement() {
  const [risks, setRisks] = useState<Risk[]>([]);
  const [heatmap, setHeatmap] = useState<RiskHeatmapCell[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<RiskFilter>('all');
  const [search, setSearch] = useState('');
  const [selectedRisk, setSelectedRisk] = useState<Risk | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [risksData, heatmapData] = await Promise.all([
        lcrmsApi.risks.getAll(),
        lcrmsApi.risks.getHeatmap(),
      ]);
      setRisks(risksData);
      setHeatmap(heatmapData);
    } finally {
      setLoading(false);
    }
  };

  const filteredRisks = useMemo(() => {
    return risks.filter((risk) => {
      const matchesFilter = filter === 'all' || risk.level === filter;
      const matchesSearch = !search ||
        risk.name.toLowerCase().includes(search.toLowerCase()) ||
        risk.division.toLowerCase().includes(search.toLowerCase()) ||
        risk.risk_code.toLowerCase().includes(search.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [risks, filter, search]);

  const summary = useMemo(() => ({
    total: risks.length,
    critical: risks.filter(r => r.level === 'critical').length,
    high: risks.filter(r => r.level === 'high').length,
    medium: risks.filter(r => r.level === 'medium').length,
    low: risks.filter(r => r.level === 'low').length,
    mitigated: risks.filter(r => r.status === 'mitigated').length,
  }), [risks]);

  const handleAddRisk = async (data: CreateRiskInput) => {
    try {
      await lcrmsApi.risks.create(data);
      setShowAddModal(false);
      setToast({ message: 'Risk added successfully', type: 'success' });
      loadData();
    } catch {
      setToast({ message: 'Failed to add risk', type: 'error' });
    }
  };

  const getHeatmapCellColor = (impact: number, likelihood: number) => {
    const score = impact * likelihood;
    if (score >= 15) return 'bg-red-600 hover:bg-red-500';
    if (score >= 10) return 'bg-orange-600 hover:bg-orange-500';
    if (score >= 5) return 'bg-yellow-600 hover:bg-yellow-500';
    return 'bg-emerald-600 hover:bg-emerald-500';
  };

  if (loading) {
    return (
      <div className="animate-fade-in">
        <Header title="Risk Management" subtitle="Enterprise Risk Management (ERM)" />
        <div className="p-6">
          <CardGridSkeleton count={4} />
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <Header title="Risk Management" subtitle="Enterprise Risk Management (ERM)" />
      <div className="p-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <StatCard icon={<AlertTriangle size={20} />} label="Total Risks" value={summary.total} />
          <StatCard icon={<AlertTriangle size={20} />} label="Critical" value={summary.critical} variant="error" />
          <StatCard icon={<AlertTriangle size={20} />} label="High" value={summary.high} variant="warning" />
          <StatCard icon={<Shield size={20} />} label="Medium/Low" value={summary.medium + summary.low} variant="info" />
          <StatCard icon={<CheckCircle size={20} />} label="Mitigated" value={summary.mitigated} variant="success" />
        </div>

        {/* View Toggle */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setShowHeatmap(true)}
            className={`px-4 py-2 rounded-lg transition-colors ${showHeatmap ? 'bg-amber-600 text-white' : 'text-slate-400 hover:bg-slate-700'}`}
          >
            Risk Heatmap
          </button>
          <button
            onClick={() => setShowHeatmap(false)}
            className={`px-4 py-2 rounded-lg transition-colors ${!showHeatmap ? 'bg-amber-600 text-white' : 'text-slate-400 hover:bg-slate-700'}`}
          >
            Risk Register
          </button>
        </div>

        {showHeatmap ? (
          /* Risk Heatmap */
          <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6 mb-6">
            <h3 className="text-lg font-semibold text-white mb-4">Risk Heatmap (Impact x Likelihood)</h3>
            <div className="flex">
              {/* Y-axis label */}
              <div className="flex flex-col justify-between pr-4 py-2">
                <span className="text-slate-400 text-xs writing-mode-vertical transform -rotate-180" style={{ writingMode: 'vertical-rl' }}>
                  Impact
                </span>
              </div>
              <div className="flex-1">
                {/* Grid */}
                <div className="grid grid-cols-5 gap-1">
                  {[5, 4, 3, 2, 1].map((impact) =>
                    [1, 2, 3, 4, 5].map((likelihood) => {
                      const cell = heatmap.find(h => h.impact === impact && h.likelihood === likelihood);
                      return (
                        <div
                          key={`${impact}-${likelihood}`}
                          className={`aspect-square rounded-lg flex items-center justify-center text-white font-bold cursor-pointer transition-colors ${getHeatmapCellColor(impact, likelihood)}`}
                          title={cell?.risks.map(r => r.name).join('\n') || 'No risks'}
                        >
                          {cell?.count || 0}
                        </div>
                      );
                    })
                  )}
                </div>
                {/* X-axis label */}
                <div className="text-center mt-2 text-slate-400 text-xs">Likelihood</div>
                {/* Legend */}
                <div className="flex justify-center gap-4 mt-4">
                  <div className="flex items-center gap-1"><div className="w-4 h-4 rounded bg-red-600" /><span className="text-xs text-slate-400">Critical</span></div>
                  <div className="flex items-center gap-1"><div className="w-4 h-4 rounded bg-orange-600" /><span className="text-xs text-slate-400">High</span></div>
                  <div className="flex items-center gap-1"><div className="w-4 h-4 rounded bg-yellow-600" /><span className="text-xs text-slate-400">Medium</span></div>
                  <div className="flex items-center gap-1"><div className="w-4 h-4 rounded bg-emerald-600" /><span className="text-xs text-slate-400">Low</span></div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <FilterButtons options={RISK_FILTERS} value={filter} onChange={setFilter} />
                <SearchInput value={search} onChange={setSearch} placeholder="Search risks..." />
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl transition-colors"
              >
                <Plus size={18} /> Add Risk
              </button>
            </div>

            {/* Risk List */}
            {filteredRisks.length === 0 ? (
              <EmptyState
                title="No risks found"
                description={search ? "Try adjusting your search" : "Add your first risk assessment"}
                action={{ label: "Add Risk", onClick: () => setShowAddModal(true) }}
              />
            ) : (
              <div className="space-y-4">
                {filteredRisks.map((risk, index) => (
                  <div
                    key={risk.id}
                    className="bg-slate-800/50 rounded-xl border border-slate-700 p-4 hover:border-amber-600/50 transition-colors cursor-pointer animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                    onClick={() => { setSelectedRisk(risk); setShowDetailModal(true); }}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-amber-400 font-mono text-sm">{risk.risk_code}</span>
                          <div className={`w-3 h-3 rounded-full ${RISK_LEVEL_COLORS[risk.level]}`} />
                          <StatusBadge status={risk.level} />
                          <StatusBadge status={risk.category} variant="outline" />
                        </div>
                        <h3 className="text-white font-medium">{risk.name}</h3>
                        <p className="text-slate-400 text-sm">{risk.division}</p>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <p className="text-slate-400 text-xs">Score</p>
                          <p className={`text-xl font-bold ${risk.level === 'critical' ? 'text-red-400' : risk.level === 'high' ? 'text-orange-400' : risk.level === 'medium' ? 'text-yellow-400' : 'text-emerald-400'}`}>
                            {risk.risk_score}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-slate-400 text-xs">Impact</p>
                          <p className="text-white font-medium">{risk.impact_score}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-slate-400 text-xs">Likelihood</p>
                          <p className="text-white font-medium">{risk.likelihood_score}</p>
                        </div>
                        <StatusBadge status={risk.mitigation_status} variant="outline" />
                        <Eye size={18} className="text-slate-400" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Top 10 Risks */}
        <div className="mt-6 bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
          <div className="p-4 border-b border-slate-700">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <TrendingDown size={18} className="text-red-400" /> Top 10 Risks by Score
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-800">
                <tr>
                  <th className="text-left p-4 text-sm font-medium text-slate-400">#</th>
                  <th className="text-left p-4 text-sm font-medium text-slate-400">Risk</th>
                  <th className="text-left p-4 text-sm font-medium text-slate-400">Division</th>
                  <th className="text-left p-4 text-sm font-medium text-slate-400">Category</th>
                  <th className="text-left p-4 text-sm font-medium text-slate-400">Score</th>
                  <th className="text-left p-4 text-sm font-medium text-slate-400">Level</th>
                  <th className="text-left p-4 text-sm font-medium text-slate-400">Mitigation</th>
                </tr>
              </thead>
              <tbody>
                {[...risks].sort((a, b) => b.risk_score - a.risk_score).slice(0, 10).map((risk, index) => (
                  <tr key={risk.id} className="border-t border-slate-700 hover:bg-slate-800/50">
                    <td className="p-4 text-slate-400">{index + 1}</td>
                    <td className="p-4">
                      <p className="text-white font-medium">{risk.name}</p>
                      <p className="text-slate-400 text-xs">{risk.risk_code}</p>
                    </td>
                    <td className="p-4 text-slate-300">{risk.division}</td>
                    <td className="p-4"><StatusBadge status={risk.category} variant="outline" size="sm" /></td>
                    <td className="p-4 font-bold text-white">{risk.risk_score}</td>
                    <td className="p-4"><StatusBadge status={risk.level} size="sm" /></td>
                    <td className="p-4"><StatusBadge status={risk.mitigation_status} variant="outline" size="sm" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Toast */}
        {toast && (
          <div className={`fixed bottom-4 right-4 px-4 py-3 rounded-xl ${toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'} text-white shadow-lg animate-fade-in`}>
            {toast.message}
            <button onClick={() => setToast(null)} className="ml-4">×</button>
          </div>
        )}

        {/* Detail Modal */}
        <Modal isOpen={showDetailModal} onClose={() => setShowDetailModal(false)} title="Risk Details" size="lg">
          {selectedRisk && <RiskDetail risk={selectedRisk} />}
        </Modal>

        {/* Add Modal */}
        <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add New Risk" size="lg">
          <AddRiskForm onSubmit={handleAddRisk} onCancel={() => setShowAddModal(false)} />
        </Modal>
      </div>
    </div>
  );
}

function RiskDetail({ risk }: { risk: Risk }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className={`w-4 h-4 rounded-full ${RISK_LEVEL_COLORS[risk.level]}`} />
        <StatusBadge status={risk.level} />
        <StatusBadge status={risk.category} variant="outline" />
        <StatusBadge status={risk.status} variant="outline" />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-slate-800 rounded-lg p-4 text-center">
          <p className="text-slate-400 text-sm">Impact</p>
          <p className="text-2xl font-bold text-white">{risk.impact_score}</p>
        </div>
        <div className="bg-slate-800 rounded-lg p-4 text-center">
          <p className="text-slate-400 text-sm">Likelihood</p>
          <p className="text-2xl font-bold text-white">{risk.likelihood_score}</p>
        </div>
        <div className={`rounded-lg p-4 text-center ${risk.level === 'critical' ? 'bg-red-900/50' : risk.level === 'high' ? 'bg-orange-900/50' : risk.level === 'medium' ? 'bg-yellow-900/50' : 'bg-emerald-900/50'}`}>
          <p className="text-slate-400 text-sm">Risk Score</p>
          <p className="text-2xl font-bold text-white">{risk.risk_score}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-800 rounded-lg p-4">
          <p className="text-slate-400 text-sm">Division</p>
          <p className="text-white">{risk.division}</p>
        </div>
        <div className="bg-slate-800 rounded-lg p-4">
          <p className="text-slate-400 text-sm">PIC</p>
          <p className="text-white">{risk.pic_name}</p>
        </div>
      </div>

      <div className="bg-slate-800 rounded-lg p-4">
        <p className="text-slate-400 text-sm mb-2">Description</p>
        <p className="text-white">{risk.description}</p>
      </div>

      {risk.cause && (
        <div className="bg-slate-800 rounded-lg p-4">
          <p className="text-slate-400 text-sm mb-2">Root Cause</p>
          <p className="text-white">{risk.cause}</p>
        </div>
      )}

      <div className="bg-amber-900/30 border border-amber-600/50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-amber-300 font-medium">Mitigation Plan</p>
          <StatusBadge status={risk.mitigation_status} />
        </div>
        <p className="text-slate-300">{risk.mitigation_plan}</p>
      </div>
    </div>
  );
}

function AddRiskForm({ onSubmit, onCancel }: { onSubmit: (data: CreateRiskInput) => void; onCancel: () => void }) {
  const [formData, setFormData] = useState<CreateRiskInput>({
    division: '',
    category: 'operational',
    name: '',
    description: '',
    cause: '',
    impact_score: 3,
    likelihood_score: 3,
    mitigation_plan: '',
    pic_name: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="block text-sm font-medium text-slate-300 mb-1">Risk Name</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-amber-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Division</label>
          <input
            type="text"
            required
            value={formData.division}
            onChange={(e) => setFormData({ ...formData, division: e.target.value })}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-amber-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Category</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value as Risk['category'] })}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-amber-500"
          >
            <option value="strategic">Strategic</option>
            <option value="financial">Financial</option>
            <option value="operational">Operational</option>
            <option value="compliance">Compliance</option>
            <option value="legal">Legal</option>
            <option value="reputational">Reputational</option>
            <option value="shariah">Shariah</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Impact Score (1-5)</label>
          <input
            type="number"
            min={1}
            max={5}
            required
            value={formData.impact_score}
            onChange={(e) => setFormData({ ...formData, impact_score: Number(e.target.value) })}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-amber-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Likelihood Score (1-5)</label>
          <input
            type="number"
            min={1}
            max={5}
            required
            value={formData.likelihood_score}
            onChange={(e) => setFormData({ ...formData, likelihood_score: Number(e.target.value) })}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-amber-500"
          />
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
          <textarea
            required
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-amber-500"
          />
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium text-slate-300 mb-1">Mitigation Plan</label>
          <textarea
            required
            value={formData.mitigation_plan}
            onChange={(e) => setFormData({ ...formData, mitigation_plan: e.target.value })}
            rows={2}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-amber-500"
          />
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium text-slate-300 mb-1">PIC Name</label>
          <input
            type="text"
            required
            value={formData.pic_name}
            onChange={(e) => setFormData({ ...formData, pic_name: e.target.value })}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-amber-500"
          />
        </div>
      </div>
      <div className="flex gap-3 pt-4">
        <button type="button" onClick={onCancel} className="flex-1 px-4 py-2 border border-slate-600 text-slate-300 rounded-xl hover:bg-slate-700 transition-colors">Cancel</button>
        <button type="submit" className="flex-1 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl transition-colors">Add Risk</button>
      </div>
    </form>
  );
}

export { RiskManagement };
