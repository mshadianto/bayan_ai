import { useState, useEffect } from 'react';
import { Header } from '../components/Layout';
import { getInvestments, updateInvestmentStatus } from '../services/supabase';
import type { Investment } from '../types';
import { format } from 'date-fns';
import {
  CheckCircle,
  XCircle,
  Eye,
  X,
} from 'lucide-react';

export function Investments() {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvestment, setSelectedInvestment] = useState<Investment | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  useEffect(() => {
    loadInvestments();
  }, []);

  async function loadInvestments() {
    try {
      setLoading(true);
      const data = await getInvestments();
      setInvestments(data);
    } catch (err) {
      console.error('Failed to load investments:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleApprove(investment: Investment) {
    try {
      await updateInvestmentStatus(investment.id, 'approved', 'CFO');
      await loadInvestments();
    } catch (err) {
      console.error('Failed to approve:', err);
    }
  }

  async function handleReject() {
    if (!selectedInvestment) return;
    try {
      await updateInvestmentStatus(
        selectedInvestment.id,
        'rejected',
        'CFO',
        rejectReason
      );
      setShowRejectModal(false);
      setRejectReason('');
      setSelectedInvestment(null);
      await loadInvestments();
    } catch (err) {
      console.error('Failed to reject:', err);
    }
  }

  const filteredInvestments = investments.filter(
    (inv) => filter === 'all' || inv.status === filter
  );

  return (
    <div>
      <Header title="Investment Analysis" subtitle="Due diligence and approval workflow" />
      <div className="p-6">
        {/* Filters */}
        <div className="flex gap-2 mb-6">
          {(['all', 'pending', 'approved', 'rejected'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl font-medium transition-all ${
                filter === f
                  ? 'bg-teal-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredInvestments.map((investment) => (
              <InvestmentCard
                key={investment.id}
                investment={investment}
                onApprove={() => handleApprove(investment)}
                onReject={() => {
                  setSelectedInvestment(investment);
                  setShowRejectModal(true);
                }}
                onView={() => setSelectedInvestment(investment)}
              />
            ))}
            {filteredInvestments.length === 0 && (
              <div className="col-span-2 bg-slate-800/50 rounded-xl border border-slate-700 p-8 text-center text-slate-400">
                No investments found
              </div>
            )}
          </div>
        )}

        {/* Investment Detail Modal */}
        {selectedInvestment && !showRejectModal && (
          <InvestmentDetailModal
            investment={selectedInvestment}
            onClose={() => setSelectedInvestment(null)}
          />
        )}

        {/* Reject Modal */}
        {showRejectModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-xl border border-slate-700 shadow-2xl p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-white mb-4">Reject Investment</h3>
              <p className="text-slate-300 mb-4">
                Please provide a reason for rejecting{' '}
                <strong className="text-white">{selectedInvestment?.company_name}</strong>
              </p>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full bg-slate-900 border border-slate-600 rounded-xl p-3 h-32 mb-4 text-white placeholder:text-slate-500 focus:border-teal-500"
                placeholder="Enter rejection reason..."
              />
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectReason('');
                    setSelectedInvestment(null);
                  }}
                  className="px-4 py-2 text-slate-300 hover:bg-slate-700 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-500 transition-colors"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface InvestmentCardProps {
  investment: Investment;
  onApprove: () => void;
  onReject: () => void;
  onView: () => void;
}

function InvestmentCard({
  investment,
  onApprove,
  onReject,
  onView,
}: InvestmentCardProps) {
  const statusColors: Record<string, string> = {
    pending: 'border-l-amber-500',
    approved: 'border-l-emerald-500',
    rejected: 'border-l-red-500',
  };

  const statusBadgeStyles: Record<string, string> = {
    pending: 'bg-amber-900/50 text-amber-300 border-amber-600',
    approved: 'bg-emerald-900/50 text-emerald-300 border-emerald-600',
    rejected: 'bg-red-900/50 text-red-300 border-red-600',
  };

  return (
    <div
      className={`bg-slate-800/50 rounded-xl border border-slate-700 border-l-4 ${
        statusColors[investment.status] || 'border-l-slate-500'
      }`}
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-white">{investment.company_name}</h3>
            <p className="text-sm text-slate-400">
              {format(new Date(investment.created_at), 'MMM d, yyyy')}
            </p>
          </div>
          <span
            className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${
              statusBadgeStyles[investment.status] || 'bg-slate-700 text-slate-300 border-slate-600'
            }`}
          >
            {investment.status}
          </span>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="text-center p-3 bg-slate-900/50 rounded-xl border border-slate-700">
            <span className="text-lg">📈</span>
            <p className="text-xs text-slate-400 mt-1">Recommendation</p>
            <p className="font-medium text-sm text-white">{investment.recommendation || '-'}</p>
          </div>
          <div className="text-center p-3 bg-slate-900/50 rounded-xl border border-slate-700">
            <span className="text-lg">⚠️</span>
            <p className="text-xs text-slate-400 mt-1">Risk Level</p>
            <p className="font-medium text-sm text-white">
              {investment.risk_assessment?.overall_rating || '-'}/10
            </p>
          </div>
          <div className="text-center p-3 bg-slate-900/50 rounded-xl border border-slate-700">
            <span className="text-lg">🕌</span>
            <p className="text-xs text-slate-400 mt-1">Shariah</p>
            <p className="font-medium text-sm text-white">
              {investment.shariah_compliance?.overall_status || '-'}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={onView}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 border border-slate-600 rounded-xl hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <Eye size={16} />
            View
          </button>
          {investment.status === 'pending' && (
            <>
              <button
                onClick={onApprove}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-500 transition-colors"
              >
                <CheckCircle size={16} />
                Approve
              </button>
              <button
                onClick={onReject}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-500 transition-colors"
              >
                <XCircle size={16} />
                Reject
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

interface InvestmentDetailModalProps {
  investment: Investment;
  onClose: () => void;
}

function InvestmentDetailModal({
  investment,
  onClose,
}: InvestmentDetailModalProps) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-xl border border-slate-700 shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-700 sticky top-0 bg-slate-800">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-white">{investment.company_name}</h2>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-2 hover:bg-slate-700 rounded-xl transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Financial Analysis */}
          {investment.financial_analysis && (
            <section>
              <h3 className="text-lg font-semibold mb-3 text-teal-400 flex items-center gap-2">
                <span>💰</span> Financial Analysis
              </h3>
              <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-slate-400">Revenue</p>
                    <p className="font-semibold text-white">
                      SAR {investment.financial_analysis.revenue?.toLocaleString() || '-'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">ROE</p>
                    <p className="font-semibold text-white">
                      {investment.financial_analysis.roe?.toFixed(2) || '-'}%
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">ROA</p>
                    <p className="font-semibold text-white">
                      {investment.financial_analysis.roa?.toFixed(2) || '-'}%
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Debt/Equity</p>
                    <p className="font-semibold text-white">
                      {investment.financial_analysis.debt_equity_ratio?.toFixed(2) || '-'}
                    </p>
                  </div>
                </div>
                {investment.financial_analysis.summary && (
                  <p className="mt-4 text-slate-300">
                    {investment.financial_analysis.summary}
                  </p>
                )}
              </div>
            </section>
          )}

          {/* Risk Assessment */}
          {investment.risk_assessment && (
            <section>
              <h3 className="text-lg font-semibold mb-3 text-teal-400 flex items-center gap-2">
                <span>⚠️</span> Risk Assessment
              </h3>
              <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { label: 'Strategic', value: investment.risk_assessment.strategic_risk },
                    { label: 'Financial', value: investment.risk_assessment.financial_risk },
                    { label: 'Operational', value: investment.risk_assessment.operational_risk },
                    { label: 'Compliance', value: investment.risk_assessment.compliance_risk },
                    { label: 'Shariah', value: investment.risk_assessment.shariah_risk },
                    { label: 'Reputational', value: investment.risk_assessment.reputational_risk },
                  ].map((risk) => (
                    <div key={risk.label}>
                      <p className="text-sm text-slate-400">{risk.label} Risk</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-slate-700 rounded-full">
                          <div
                            className={`h-2 rounded-full ${
                              (risk.value || 0) <= 3
                                ? 'bg-emerald-500'
                                : (risk.value || 0) <= 6
                                ? 'bg-amber-500'
                                : 'bg-red-500'
                            }`}
                            style={{ width: `${(risk.value || 0) * 10}%` }}
                          />
                        </div>
                        <span className="font-semibold text-sm text-white">
                          {risk.value || '-'}/10
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Shariah Compliance */}
          {investment.shariah_compliance && (
            <section>
              <h3 className="text-lg font-semibold mb-3 text-teal-400 flex items-center gap-2">
                <span>🕌</span> Shariah Compliance
              </h3>
              <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700">
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-slate-400">Halal Screening</p>
                    <p
                      className={`font-semibold ${
                        investment.shariah_compliance.halal_screening === 'pass'
                          ? 'text-emerald-400'
                          : 'text-red-400'
                      }`}
                    >
                      {investment.shariah_compliance.halal_screening || '-'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Riba Compliance</p>
                    <p
                      className={`font-semibold ${
                        investment.shariah_compliance.riba_compliance === 'compliant'
                          ? 'text-emerald-400'
                          : 'text-red-400'
                      }`}
                    >
                      {investment.shariah_compliance.riba_compliance || '-'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Overall Status</p>
                    <p
                      className={`font-semibold ${
                        investment.shariah_compliance.overall_status === 'compliant'
                          ? 'text-emerald-400'
                          : 'text-red-400'
                      }`}
                    >
                      {investment.shariah_compliance.overall_status || '-'}
                    </p>
                  </div>
                </div>
                {investment.shariah_compliance.notes && (
                  <p className="text-slate-300">{investment.shariah_compliance.notes}</p>
                )}
              </div>
            </section>
          )}

          {/* Final Memo */}
          {investment.final_memo && (
            <section>
              <h3 className="text-lg font-semibold mb-3 text-teal-400 flex items-center gap-2">
                <span>📝</span> Investment Memo
              </h3>
              <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700 whitespace-pre-wrap text-slate-300">
                {investment.final_memo}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
