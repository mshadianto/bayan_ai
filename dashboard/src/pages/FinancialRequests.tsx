import { useState, useEffect } from 'react';
import { Header } from '../components/Layout';
import { StatusBadge, FilterButtons, SearchInput, TableSkeleton, Modal } from '../components/common';
import { StatCard } from '../components/common/StatCard';
import type { FinancialRequest, FinancialRequestSummary, ApprovalStep } from '../types';
import { financeApi } from '../services/mockData/finance';
import { format } from 'date-fns';
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  DollarSign,
  TrendingUp,
  ChevronRight,
  FileCheck,
  ArrowRight,
} from 'lucide-react';

const FILTER_OPTIONS = ['all', 'pending_head', 'pending_finance_staff', 'pending_finance_head', 'pending_mudir', 'approved', 'completed', 'rejected'] as const;
type FilterOption = typeof FILTER_OPTIONS[number];

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  draft: { label: 'Draft', color: 'bg-slate-600', icon: <FileText size={14} /> },
  pending_head: { label: 'Pending Head', color: 'bg-amber-600', icon: <Clock size={14} /> },
  pending_finance_staff: { label: 'Pending Finance', color: 'bg-blue-600', icon: <Clock size={14} /> },
  pending_finance_head: { label: 'Pending Finance Head', color: 'bg-purple-600', icon: <Clock size={14} /> },
  pending_mudir: { label: 'Pending Mudir', color: 'bg-orange-600', icon: <Clock size={14} /> },
  approved: { label: 'Approved', color: 'bg-emerald-600', icon: <CheckCircle size={14} /> },
  completed: { label: 'Completed', color: 'bg-teal-600', icon: <FileCheck size={14} /> },
  rejected: { label: 'Rejected', color: 'bg-red-600', icon: <XCircle size={14} /> },
};

const TYPE_CONFIG: Record<string, { label: string; emoji: string }> = {
  payment: { label: 'Payment', emoji: '💳' },
  transfer: { label: 'Transfer', emoji: '🔄' },
  reimbursement: { label: 'Reimbursement', emoji: '💵' },
  advance: { label: 'Cash Advance', emoji: '💰' },
};

const APPROVAL_ROLE_LABELS: Record<string, string> = {
  head_division: 'Head Division',
  finance_staff: 'Finance Staff',
  finance_head: 'Finance Head',
  mudir_1: 'Mudir 1',
  mudir_3: 'Mudir 3',
};

function formatCurrency(amount: number, currency: string = 'SAR') {
  return new Intl.NumberFormat('en-SA', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(amount);
}

function ApprovalTimeline({ approvals }: { approvals: ApprovalStep[] }) {
  const sortedApprovals = [...approvals].sort((a, b) => a.step - b.step);

  return (
    <div className="space-y-3">
      {sortedApprovals.map((step, index) => {
        const isLast = index === sortedApprovals.length - 1;
        const statusColors = {
          pending: 'bg-slate-600 border-slate-500',
          approved: 'bg-emerald-600 border-emerald-500',
          rejected: 'bg-red-600 border-red-500',
          returned: 'bg-amber-600 border-amber-500',
        };

        return (
          <div key={step.id} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${statusColors[step.status]}`}>
                {step.status === 'approved' && <CheckCircle size={16} className="text-white" />}
                {step.status === 'rejected' && <XCircle size={16} className="text-white" />}
                {step.status === 'returned' && <AlertCircle size={16} className="text-white" />}
                {step.status === 'pending' && <Clock size={16} className="text-white" />}
              </div>
              {!isLast && <div className="w-0.5 h-8 bg-slate-600 mt-1" />}
            </div>
            <div className="flex-1 pb-2">
              <div className="flex items-center justify-between">
                <p className="text-white font-medium">{APPROVAL_ROLE_LABELS[step.role]}</p>
                <StatusBadge status={step.status} size="sm" />
              </div>
              {step.approver_name && (
                <p className="text-sm text-slate-400">{step.approver_name}</p>
              )}
              {step.action_at && (
                <p className="text-xs text-slate-500">{format(new Date(step.action_at), 'dd MMM yyyy HH:mm')}</p>
              )}
              {step.comments && (
                <p className="text-sm text-slate-300 mt-1 bg-slate-800/50 p-2 rounded-lg">
                  "{step.comments}"
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function WorkflowDiagram() {
  const steps = [
    { label: 'Unit Pengusul', icon: '📝' },
    { label: 'Head Division', icon: '👔' },
    { label: 'Finance Staff', icon: '📊' },
    { label: 'Finance Head', icon: '💼' },
    { label: 'Mudir 1 & 3', icon: '👥' },
    { label: 'Transaksi', icon: '✅' },
  ];

  return (
    <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 mb-6">
      <p className="text-sm text-slate-400 mb-3">Alur Approval:</p>
      <div className="flex items-center justify-between overflow-x-auto pb-2">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center">
            <div className="flex flex-col items-center min-w-[80px]">
              <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center text-lg mb-1">
                {step.icon}
              </div>
              <p className="text-xs text-slate-300 text-center">{step.label}</p>
            </div>
            {index < steps.length - 1 && (
              <ArrowRight size={16} className="text-slate-500 mx-1 flex-shrink-0" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function FinancialRequests() {
  const [requests, setRequests] = useState<FinancialRequest[]>([]);
  const [summary, setSummary] = useState<FinancialRequestSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterOption>('all');
  const [search, setSearch] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<FinancialRequest | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [requestsData, summaryData] = await Promise.all([
          financeApi.requests.getAll(),
          financeApi.requests.getSummary(),
        ]);
        setRequests(requestsData);
        setSummary(summaryData);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredRequests = requests.filter(req => {
    const matchesFilter = filter === 'all' || req.status === filter;
    const matchesSearch = search === '' ||
      req.title.toLowerCase().includes(search.toLowerCase()) ||
      req.request_number.toLowerCase().includes(search.toLowerCase()) ||
      req.requester_name.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="animate-fade-in">
      <Header title="Financial Requests" subtitle="Payment & transfer approval workflow" />
      <div className="p-6">
        {/* Workflow Diagram */}
        <WorkflowDiagram />

        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 stagger-children">
          <StatCard
            icon={<FileText className="text-blue-400" />}
            label="Total Requests"
            value={summary?.total_requests || 0}
            variant="default"
          />
          <StatCard
            icon={<Clock className="text-amber-400" />}
            label="Pending Approval"
            value={summary?.pending_approval || 0}
            variant="warning"
          />
          <StatCard
            icon={<DollarSign className="text-emerald-400" />}
            label="Amount Pending"
            value={formatCurrency(summary?.total_amount_pending || 0)}
            variant="default"
          />
          <StatCard
            icon={<TrendingUp className="text-teal-400" />}
            label="Approved (Month)"
            value={formatCurrency(summary?.total_amount_approved || 0)}
            variant="success"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search by title, number, or requester..."
            />
          </div>
          <FilterButtons
            options={FILTER_OPTIONS}
            value={filter}
            onChange={setFilter}
          />
        </div>

        {/* Requests Table */}
        {loading ? (
          <TableSkeleton rows={5} columns={6} />
        ) : (
          <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-800">
                  <tr>
                    <th className="text-left p-4 text-sm font-semibold text-slate-300">Request</th>
                    <th className="text-left p-4 text-sm font-semibold text-slate-300">Type</th>
                    <th className="text-left p-4 text-sm font-semibold text-slate-300">Requester</th>
                    <th className="text-right p-4 text-sm font-semibold text-slate-300">Amount</th>
                    <th className="text-left p-4 text-sm font-semibold text-slate-300">Status</th>
                    <th className="text-left p-4 text-sm font-semibold text-slate-300">Current Step</th>
                    <th className="text-left p-4 text-sm font-semibold text-slate-300"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.map((req, index) => {
                    const statusConfig = STATUS_CONFIG[req.status];
                    const typeConfig = TYPE_CONFIG[req.type];

                    return (
                      <tr
                        key={req.id}
                        className="border-t border-slate-700 hover:bg-slate-700/30 transition-colors cursor-pointer animate-fade-in"
                        style={{ animationDelay: `${index * 50}ms` }}
                        onClick={() => setSelectedRequest(req)}
                      >
                        <td className="p-4">
                          <p className="text-white font-medium">{req.title}</p>
                          <p className="text-xs text-slate-400">{req.request_number}</p>
                        </td>
                        <td className="p-4">
                          <span className="inline-flex items-center gap-1.5 text-sm text-slate-300">
                            <span>{typeConfig.emoji}</span>
                            {typeConfig.label}
                          </span>
                        </td>
                        <td className="p-4">
                          <p className="text-sm text-white">{req.requester_name}</p>
                          <p className="text-xs text-slate-400">{req.requester_unit}</p>
                        </td>
                        <td className="p-4 text-right">
                          <p className="text-white font-semibold">{formatCurrency(req.amount, req.currency)}</p>
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-white ${statusConfig.color}`}>
                            {statusConfig.icon}
                            {statusConfig.label}
                          </span>
                        </td>
                        <td className="p-4">
                          <p className="text-sm text-slate-300">{req.current_approver || '-'}</p>
                        </td>
                        <td className="p-4">
                          <ChevronRight size={16} className="text-slate-400" />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {filteredRequests.length === 0 && (
              <div className="text-center py-12">
                <FileText size={48} className="mx-auto text-slate-600 mb-3" />
                <p className="text-slate-400">No requests found</p>
              </div>
            )}
          </div>
        )}

        {/* Detail Modal */}
        <Modal
          isOpen={!!selectedRequest}
          onClose={() => setSelectedRequest(null)}
          title={selectedRequest?.title || ''}
          size="lg"
        >
          {selectedRequest && (
            <div className="space-y-6">
              {/* Request Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-400 mb-1">Request Number</p>
                  <p className="text-white font-medium">{selectedRequest.request_number}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1">Type</p>
                  <p className="text-white">
                    {TYPE_CONFIG[selectedRequest.type].emoji} {TYPE_CONFIG[selectedRequest.type].label}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1">Amount</p>
                  <p className="text-white font-semibold text-lg">
                    {formatCurrency(selectedRequest.amount, selectedRequest.currency)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1">Status</p>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-white ${STATUS_CONFIG[selectedRequest.status].color}`}>
                    {STATUS_CONFIG[selectedRequest.status].icon}
                    {STATUS_CONFIG[selectedRequest.status].label}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div>
                <p className="text-xs text-slate-400 mb-1">Description</p>
                <p className="text-slate-300">{selectedRequest.description}</p>
              </div>

              {/* Requester & Beneficiary */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-800/50 rounded-xl p-4">
                  <p className="text-xs text-slate-400 mb-2">Requester</p>
                  <p className="text-white font-medium">{selectedRequest.requester_name}</p>
                  <p className="text-sm text-slate-400">{selectedRequest.requester_unit}</p>
                </div>
                {selectedRequest.beneficiary_name && (
                  <div className="bg-slate-800/50 rounded-xl p-4">
                    <p className="text-xs text-slate-400 mb-2">Beneficiary</p>
                    <p className="text-white font-medium">{selectedRequest.beneficiary_name}</p>
                    {selectedRequest.beneficiary_bank && (
                      <p className="text-sm text-slate-400">{selectedRequest.beneficiary_bank}</p>
                    )}
                  </div>
                )}
              </div>

              {/* GL Code */}
              {selectedRequest.gl_code && (
                <div className="bg-slate-800/50 rounded-xl p-4">
                  <p className="text-xs text-slate-400 mb-2">Ledger Account</p>
                  <p className="text-white font-medium">{selectedRequest.gl_code} - {selectedRequest.gl_name}</p>
                  {selectedRequest.cost_center && (
                    <p className="text-sm text-slate-400">Cost Center: {selectedRequest.cost_center}</p>
                  )}
                </div>
              )}

              {/* Documents */}
              <div>
                <p className="text-xs text-slate-400 mb-2">Documents ({selectedRequest.documents.length})</p>
                <div className="space-y-2">
                  {selectedRequest.documents.map(doc => (
                    <div key={doc.id} className="flex items-center justify-between bg-slate-800/50 rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <FileText size={16} className="text-blue-400" />
                        <span className="text-sm text-white">{doc.name}</span>
                      </div>
                      <StatusBadge status={doc.type} size="sm" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Approval Timeline */}
              <div>
                <p className="text-xs text-slate-400 mb-3">Approval History</p>
                <ApprovalTimeline approvals={selectedRequest.approvals} />
              </div>

              {/* Transaction Proof (if completed) */}
              {selectedRequest.transaction_reference && (
                <div className="bg-emerald-900/30 rounded-xl p-4 border border-emerald-600/50">
                  <p className="text-xs text-emerald-400 mb-2">Transaction Completed</p>
                  <p className="text-white font-medium">Ref: {selectedRequest.transaction_reference}</p>
                  {selectedRequest.transaction_date && (
                    <p className="text-sm text-emerald-300">
                      {format(new Date(selectedRequest.transaction_date), 'dd MMM yyyy HH:mm')}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
}

export default FinancialRequests;
