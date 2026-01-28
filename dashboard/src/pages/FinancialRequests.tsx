import { useState, useEffect } from 'react';
import { Header } from '../components/Layout';
import { StatusBadge, FilterButtons, SearchInput, TableSkeleton, Modal } from '../components/common';
import { StatCard } from '../components/common/StatCard';
import type { FinancialRequest, FinancialRequestSummary, ApprovalStep } from '../types';
import { financeApi, GL_ACCOUNTS, UNITS } from '../services/mockData/finance';
import type { CreateRequestInput, ApprovalActionInput } from '../services/mockData/finance';
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
  Plus,
  Send,
  RotateCcw,
  Upload,
} from 'lucide-react';

const FILTER_OPTIONS = ['all', 'draft', 'pending_head', 'pending_finance_staff', 'pending_finance_head', 'pending_mudir', 'approved', 'completed', 'rejected'] as const;
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

// Simulated current user role (in real app, this would come from auth context)
const CURRENT_USER = {
  name: 'Admin User',
  role: 'admin', // can act as any role for demo
};

function formatCurrency(amount: number, currency: string = 'SAR') {
  return new Intl.NumberFormat('en-SA', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(amount);
}

// Toast notification component
function Toast({ message, type, onClose }: { message: string; type: 'success' | 'error' | 'info'; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const colors = {
    success: 'bg-emerald-600 border-emerald-500',
    error: 'bg-red-600 border-red-500',
    info: 'bg-blue-600 border-blue-500',
  };

  return (
    <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-xl border ${colors[type]} text-white shadow-lg animate-fade-in flex items-center gap-3`}>
      {type === 'success' && <CheckCircle size={20} />}
      {type === 'error' && <XCircle size={20} />}
      {type === 'info' && <AlertCircle size={20} />}
      <span>{message}</span>
      <button onClick={onClose} className="ml-2 hover:opacity-70">×</button>
    </div>
  );
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
                <p className="text-content font-medium">{APPROVAL_ROLE_LABELS[step.role]}</p>
                <StatusBadge status={step.status} size="sm" />
              </div>
              {step.approver_name && (
                <p className="text-sm text-content-secondary">{step.approver_name}</p>
              )}
              {step.action_at && (
                <p className="text-xs text-content-muted">{format(new Date(step.action_at), 'dd MMM yyyy HH:mm')}</p>
              )}
              {step.comments && (
                <p className="text-sm text-content-tertiary mt-1 bg-card p-2 rounded-lg">
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
    <div className="bg-card rounded-xl p-4 border border-border mb-6">
      <p className="text-sm text-content-secondary mb-3">Alur Approval:</p>
      <div className="flex items-center justify-between overflow-x-auto pb-2">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center">
            <div className="flex flex-col items-center min-w-[80px]">
              <div className="w-10 h-10 bg-hover rounded-full flex items-center justify-center text-lg mb-1">
                {step.icon}
              </div>
              <p className="text-xs text-content-tertiary text-center">{step.label}</p>
            </div>
            {index < steps.length - 1 && (
              <ArrowRight size={16} className="text-content-muted mx-1 flex-shrink-0" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Create Request Form
function CreateRequestForm({ onSubmit, onCancel, isSubmitting }: {
  onSubmit: (data: CreateRequestInput) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}) {
  const [formData, setFormData] = useState<CreateRequestInput>({
    type: 'payment',
    title: '',
    description: '',
    amount: 0,
    currency: 'SAR',
    requester_name: CURRENT_USER.name,
    requester_unit: UNITS[0],
    beneficiary_name: '',
    beneficiary_bank: '',
    beneficiary_account: '',
    documents: [],
  });
  const [docName, setDocName] = useState('');
  const [docType, setDocType] = useState('invoice');

  const handleAddDocument = () => {
    if (docName) {
      setFormData(prev => ({
        ...prev,
        documents: [...prev.documents, { name: docName, type: docType }],
      }));
      setDocName('');
    }
  };

  const handleRemoveDoc = (index: number) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="space-y-4">
      {/* Type */}
      <div>
        <label className="block text-sm text-content-secondary mb-1">Request Type</label>
        <div className="flex gap-2 flex-wrap">
          {(['payment', 'transfer', 'reimbursement', 'advance'] as const).map(type => (
            <button
              key={type}
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, type }))}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                formData.type === type
                  ? 'bg-teal-600 text-white'
                  : 'bg-hover text-content-tertiary hover:bg-hover'
              }`}
            >
              {TYPE_CONFIG[type].emoji} {TYPE_CONFIG[type].label}
            </button>
          ))}
        </div>
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm text-content-secondary mb-1">Title</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          className="w-full bg-input border border-border-subtle rounded-lg px-4 py-2 text-content focus:outline-none focus:border-teal-500"
          placeholder="e.g., Pembayaran Vendor ABC"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm text-content-secondary mb-1">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          className="w-full bg-input border border-border-subtle rounded-lg px-4 py-2 text-content focus:outline-none focus:border-teal-500 min-h-[80px]"
          placeholder="Detail pengajuan..."
        />
      </div>

      {/* Amount & Currency */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-content-secondary mb-1">Amount</label>
          <input
            type="number"
            value={formData.amount}
            onChange={(e) => setFormData(prev => ({ ...prev, amount: Number(e.target.value) }))}
            className="w-full bg-input border border-border-subtle rounded-lg px-4 py-2 text-content focus:outline-none focus:border-teal-500"
          />
        </div>
        <div>
          <label className="block text-sm text-content-secondary mb-1">Currency</label>
          <select
            value={formData.currency}
            onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value as 'SAR' | 'IDR' | 'USD' }))}
            className="w-full bg-input border border-border-subtle rounded-lg px-4 py-2 text-content focus:outline-none focus:border-teal-500"
          >
            <option value="SAR">SAR</option>
            <option value="IDR">IDR</option>
            <option value="USD">USD</option>
          </select>
        </div>
      </div>

      {/* Requester Unit */}
      <div>
        <label className="block text-sm text-content-secondary mb-1">Unit Pengusul</label>
        <select
          value={formData.requester_unit}
          onChange={(e) => setFormData(prev => ({ ...prev, requester_unit: e.target.value }))}
          className="w-full bg-input border border-border-subtle rounded-lg px-4 py-2 text-content focus:outline-none focus:border-teal-500"
        >
          {UNITS.map(unit => (
            <option key={unit} value={unit}>{unit}</option>
          ))}
        </select>
      </div>

      {/* Beneficiary (for payment/transfer) */}
      {(formData.type === 'payment' || formData.type === 'transfer') && (
        <div className="space-y-3 p-4 bg-card rounded-xl">
          <p className="text-sm font-medium text-content">Beneficiary Details</p>
          <input
            type="text"
            value={formData.beneficiary_name}
            onChange={(e) => setFormData(prev => ({ ...prev, beneficiary_name: e.target.value }))}
            className="w-full bg-input border border-border-subtle rounded-lg px-4 py-2 text-content focus:outline-none focus:border-teal-500"
            placeholder="Beneficiary Name"
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              value={formData.beneficiary_bank}
              onChange={(e) => setFormData(prev => ({ ...prev, beneficiary_bank: e.target.value }))}
              className="w-full bg-input border border-border-subtle rounded-lg px-4 py-2 text-content focus:outline-none focus:border-teal-500"
              placeholder="Bank Name"
            />
            <input
              type="text"
              value={formData.beneficiary_account}
              onChange={(e) => setFormData(prev => ({ ...prev, beneficiary_account: e.target.value }))}
              className="w-full bg-input border border-border-subtle rounded-lg px-4 py-2 text-content focus:outline-none focus:border-teal-500"
              placeholder="Account Number"
            />
          </div>
        </div>
      )}

      {/* Documents */}
      <div className="p-4 bg-card rounded-xl">
        <p className="text-sm font-medium text-content mb-3">Documents</p>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={docName}
            onChange={(e) => setDocName(e.target.value)}
            className="flex-1 bg-input border border-border-subtle rounded-lg px-4 py-2 text-content text-sm focus:outline-none focus:border-teal-500"
            placeholder="Document name (e.g., Invoice_001.pdf)"
          />
          <select
            value={docType}
            onChange={(e) => setDocType(e.target.value)}
            className="bg-input border border-border-subtle rounded-lg px-3 py-2 text-content text-sm focus:outline-none focus:border-teal-500"
          >
            <option value="invoice">Invoice</option>
            <option value="receipt">Receipt</option>
            <option value="contract">Contract</option>
            <option value="quotation">Quotation</option>
            <option value="other">Other</option>
          </select>
          <button
            type="button"
            onClick={handleAddDocument}
            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-500 transition-colors"
          >
            <Plus size={18} />
          </button>
        </div>
        {formData.documents.length > 0 && (
          <div className="space-y-2">
            {formData.documents.map((doc, i) => (
              <div key={i} className="flex items-center justify-between bg-hover rounded-lg px-3 py-2">
                <span className="text-sm text-content">{doc.name}</span>
                <div className="flex items-center gap-2">
                  <StatusBadge status={doc.type} size="sm" />
                  <button onClick={() => handleRemoveDoc(i)} className="text-red-400 hover:text-red-300">×</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-3 bg-hover text-content rounded-xl hover:bg-hover transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => onSubmit(formData)}
          disabled={!formData.title || !formData.amount || isSubmitting}
          className="flex-1 px-4 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? 'Creating...' : <><Plus size={18} /> Create Request</>}
        </button>
      </div>
    </div>
  );
}

// Approval Actions Component
function ApprovalActions({ request, onAction, isProcessing }: {
  request: FinancialRequest;
  onAction: (action: ApprovalActionInput['action'], role: ApprovalActionInput['role'], comments?: string, glCode?: string, glName?: string) => void;
  isProcessing: boolean;
}) {
  const [comments, setComments] = useState('');
  const [selectedGL, setSelectedGL] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectAction, setRejectAction] = useState<'reject' | 'return'>('reject');

  // Determine which role can act based on status
  const roleMap: Record<string, ApprovalActionInput['role']> = {
    pending_head: 'head_division',
    pending_finance_staff: 'finance_staff',
    pending_finance_head: 'finance_head',
    pending_mudir: 'mudir_1', // Will also show mudir_3 option
  };

  const currentRole = roleMap[request.status];
  if (!currentRole) return null;

  const isFinanceStaff = request.status === 'pending_finance_staff';
  const isMudir = request.status === 'pending_mudir';

  const handleApprove = (role: ApprovalActionInput['role']) => {
    const gl = GL_ACCOUNTS.find(g => g.code === selectedGL);
    onAction('approve', role, comments || undefined, gl?.code, gl?.name);
  };

  const handleReject = () => {
    onAction(rejectAction, currentRole, comments);
    setShowRejectModal(false);
  };

  return (
    <div className="border-t border-border pt-4 mt-4">
      <p className="text-sm font-medium text-content mb-3">Approval Actions</p>

      {/* GL Code selection for Finance Staff */}
      {isFinanceStaff && (
        <div className="mb-4">
          <label className="block text-sm text-content-secondary mb-1">Select GL Account</label>
          <select
            value={selectedGL}
            onChange={(e) => setSelectedGL(e.target.value)}
            className="w-full bg-input border border-border-subtle rounded-lg px-4 py-2 text-content focus:outline-none focus:border-teal-500"
          >
            <option value="">-- Select GL Account --</option>
            {GL_ACCOUNTS.map(gl => (
              <option key={gl.code} value={gl.code}>{gl.code} - {gl.name}</option>
            ))}
          </select>
        </div>
      )}

      {/* Comments */}
      <div className="mb-4">
        <label className="block text-sm text-content-secondary mb-1">Comments (optional)</label>
        <textarea
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          className="w-full bg-input border border-border-subtle rounded-lg px-4 py-2 text-content focus:outline-none focus:border-teal-500 min-h-[60px]"
          placeholder="Add comments..."
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        {isMudir ? (
          <>
            <button
              onClick={() => handleApprove('mudir_1')}
              disabled={isProcessing}
              className="flex-1 px-4 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-500 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <CheckCircle size={18} /> Approve (Mudir 1)
            </button>
            <button
              onClick={() => handleApprove('mudir_3')}
              disabled={isProcessing}
              className="flex-1 px-4 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-500 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <CheckCircle size={18} /> Approve (Mudir 3)
            </button>
          </>
        ) : (
          <button
            onClick={() => handleApprove(currentRole)}
            disabled={isProcessing || (isFinanceStaff && !selectedGL)}
            className="flex-1 px-4 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-500 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <CheckCircle size={18} /> Approve
          </button>
        )}
        <button
          onClick={() => { setRejectAction('return'); setShowRejectModal(true); }}
          disabled={isProcessing}
          className="px-4 py-3 bg-amber-600 text-white rounded-xl hover:bg-amber-500 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <RotateCcw size={18} /> Return
        </button>
        <button
          onClick={() => { setRejectAction('reject'); setShowRejectModal(true); }}
          disabled={isProcessing}
          className="px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-500 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <XCircle size={18} /> Reject
        </button>
      </div>

      {/* Reject/Return Confirmation Modal */}
      <Modal
        isOpen={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        title={rejectAction === 'reject' ? 'Reject Request' : 'Return to Requester'}
        size="sm"
        footer={
          <>
            <button
              onClick={() => setShowRejectModal(false)}
              className="flex-1 px-4 py-2 bg-hover text-content rounded-lg hover:bg-hover"
            >
              Cancel
            </button>
            <button
              onClick={handleReject}
              disabled={!comments}
              className={`flex-1 px-4 py-2 text-white rounded-lg disabled:opacity-50 ${
                rejectAction === 'reject' ? 'bg-red-600 hover:bg-red-500' : 'bg-amber-600 hover:bg-amber-500'
              }`}
            >
              Confirm
            </button>
          </>
        }
      >
        <p className="text-content-secondary mb-4">
          {rejectAction === 'reject'
            ? 'This will permanently reject the request.'
            : 'This will return the request to the requester for revision.'}
        </p>
        <textarea
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          className="w-full bg-input border border-border-subtle rounded-lg px-4 py-2 text-content focus:outline-none focus:border-red-500 min-h-[80px]"
          placeholder="Reason for rejection/return..."
          required
        />
      </Modal>
    </div>
  );
}

// Complete Transaction Component
function CompleteTransactionForm({ request, onComplete, isProcessing }: {
  request: FinancialRequest;
  onComplete: (reference: string, proofUrl: string) => void;
  isProcessing: boolean;
}) {
  const [reference, setReference] = useState('');
  const [proofUrl, setProofUrl] = useState('');

  if (request.status !== 'approved') return null;

  return (
    <div className="border-t border-border pt-4 mt-4">
      <p className="text-sm font-medium text-content mb-3">Complete Transaction</p>
      <div className="space-y-3">
        <input
          type="text"
          value={reference}
          onChange={(e) => setReference(e.target.value)}
          className="w-full bg-input border border-border-subtle rounded-lg px-4 py-2 text-content focus:outline-none focus:border-teal-500"
          placeholder="Transaction Reference (e.g., TRX-2025-001)"
        />
        <input
          type="text"
          value={proofUrl}
          onChange={(e) => setProofUrl(e.target.value)}
          className="w-full bg-input border border-border-subtle rounded-lg px-4 py-2 text-content focus:outline-none focus:border-teal-500"
          placeholder="Proof Document URL"
        />
        <button
          onClick={() => onComplete(reference, proofUrl)}
          disabled={!reference || !proofUrl || isProcessing}
          className="w-full px-4 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-500 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <Upload size={18} /> Complete Transaction
        </button>
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
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

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

  useEffect(() => {
    fetchData();
  }, []);

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type });
  };

  const handleCreateRequest = async (data: CreateRequestInput) => {
    setIsSubmitting(true);
    try {
      const newRequest = await financeApi.requests.create(data);
      showToast(`Request ${newRequest.request_number} created successfully!`, 'success');
      setShowCreateModal(false);
      await fetchData();
    } catch (error) {
      showToast('Failed to create request', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitDraft = async (id: string) => {
    setIsSubmitting(true);
    try {
      await financeApi.requests.submit(id);
      showToast('Request submitted for approval!', 'success');
      setSelectedRequest(null);
      await fetchData();
    } catch (error) {
      showToast('Failed to submit request', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApprovalAction = async (
    action: ApprovalActionInput['action'],
    role: ApprovalActionInput['role'],
    comments?: string,
    glCode?: string,
    glName?: string
  ) => {
    if (!selectedRequest) return;
    setIsSubmitting(true);
    try {
      await financeApi.requests.processApproval({
        requestId: selectedRequest.id,
        action,
        role,
        approverName: CURRENT_USER.name,
        comments,
        glCode,
        glName,
      });
      const actionLabel = action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : 'returned';
      showToast(`Request ${actionLabel} successfully!`, action === 'approve' ? 'success' : 'info');
      setSelectedRequest(null);
      await fetchData();
    } catch (error) {
      showToast('Failed to process approval', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCompleteTransaction = async (reference: string, proofUrl: string) => {
    if (!selectedRequest) return;
    setIsSubmitting(true);
    try {
      await financeApi.requests.completeTransaction({
        requestId: selectedRequest.id,
        transactionReference: reference,
        transactionProofUrl: proofUrl,
      });
      showToast('Transaction completed successfully!', 'success');
      setSelectedRequest(null);
      await fetchData();
    } catch (error) {
      showToast('Failed to complete transaction', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

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
        {/* Toast */}
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

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

        {/* Actions & Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-500 transition-colors flex items-center gap-2 font-medium"
          >
            <Plus size={20} /> New Request
          </button>
          <div className="flex-1">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search by title, number, or requester..."
            />
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="mb-6 overflow-x-auto">
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
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-input">
                  <tr>
                    <th className="text-left p-4 text-sm font-semibold text-content-tertiary">Request</th>
                    <th className="text-left p-4 text-sm font-semibold text-content-tertiary">Type</th>
                    <th className="text-left p-4 text-sm font-semibold text-content-tertiary">Requester</th>
                    <th className="text-right p-4 text-sm font-semibold text-content-tertiary">Amount</th>
                    <th className="text-left p-4 text-sm font-semibold text-content-tertiary">Status</th>
                    <th className="text-left p-4 text-sm font-semibold text-content-tertiary">Current Step</th>
                    <th className="text-left p-4 text-sm font-semibold text-content-tertiary"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.map((req, index) => {
                    const statusConfig = STATUS_CONFIG[req.status];
                    const typeConfig = TYPE_CONFIG[req.type];

                    return (
                      <tr
                        key={req.id}
                        className="border-t border-border hover:bg-hover/30 transition-colors cursor-pointer animate-fade-in"
                        style={{ animationDelay: `${index * 50}ms` }}
                        onClick={() => setSelectedRequest(req)}
                      >
                        <td className="p-4">
                          <p className="text-content font-medium">{req.title}</p>
                          <p className="text-xs text-content-secondary">{req.request_number}</p>
                        </td>
                        <td className="p-4">
                          <span className="inline-flex items-center gap-1.5 text-sm text-content-tertiary">
                            <span>{typeConfig.emoji}</span>
                            {typeConfig.label}
                          </span>
                        </td>
                        <td className="p-4">
                          <p className="text-sm text-content">{req.requester_name}</p>
                          <p className="text-xs text-content-secondary">{req.requester_unit}</p>
                        </td>
                        <td className="p-4 text-right">
                          <p className="text-content font-semibold">{formatCurrency(req.amount, req.currency)}</p>
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-white ${statusConfig.color}`}>
                            {statusConfig.icon}
                            {statusConfig.label}
                          </span>
                        </td>
                        <td className="p-4">
                          <p className="text-sm text-content-tertiary">{req.current_approver || '-'}</p>
                        </td>
                        <td className="p-4">
                          <ChevronRight size={16} className="text-content-secondary" />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {filteredRequests.length === 0 && (
              <div className="text-center py-12">
                <FileText size={48} className="mx-auto text-content-muted mb-3" />
                <p className="text-content-secondary">No requests found</p>
              </div>
            )}
          </div>
        )}

        {/* Create Request Modal */}
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Create Financial Request"
          size="lg"
        >
          <CreateRequestForm
            onSubmit={handleCreateRequest}
            onCancel={() => setShowCreateModal(false)}
            isSubmitting={isSubmitting}
          />
        </Modal>

        {/* Detail Modal */}
        <Modal
          isOpen={!!selectedRequest}
          onClose={() => setSelectedRequest(null)}
          title={selectedRequest?.title || ''}
          size="xl"
        >
          {selectedRequest && (
            <div className="space-y-6">
              {/* Request Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-content-secondary mb-1">Request Number</p>
                  <p className="text-content font-medium">{selectedRequest.request_number}</p>
                </div>
                <div>
                  <p className="text-xs text-content-secondary mb-1">Type</p>
                  <p className="text-content">
                    {TYPE_CONFIG[selectedRequest.type].emoji} {TYPE_CONFIG[selectedRequest.type].label}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-content-secondary mb-1">Amount</p>
                  <p className="text-content font-semibold text-lg">
                    {formatCurrency(selectedRequest.amount, selectedRequest.currency)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-content-secondary mb-1">Status</p>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-white ${STATUS_CONFIG[selectedRequest.status].color}`}>
                    {STATUS_CONFIG[selectedRequest.status].icon}
                    {STATUS_CONFIG[selectedRequest.status].label}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div>
                <p className="text-xs text-content-secondary mb-1">Description</p>
                <p className="text-content-tertiary">{selectedRequest.description}</p>
              </div>

              {/* Requester & Beneficiary */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-card rounded-xl p-4">
                  <p className="text-xs text-content-secondary mb-2">Requester</p>
                  <p className="text-content font-medium">{selectedRequest.requester_name}</p>
                  <p className="text-sm text-content-secondary">{selectedRequest.requester_unit}</p>
                </div>
                {selectedRequest.beneficiary_name && (
                  <div className="bg-card rounded-xl p-4">
                    <p className="text-xs text-content-secondary mb-2">Beneficiary</p>
                    <p className="text-content font-medium">{selectedRequest.beneficiary_name}</p>
                    {selectedRequest.beneficiary_bank && (
                      <p className="text-sm text-content-secondary">{selectedRequest.beneficiary_bank}</p>
                    )}
                  </div>
                )}
              </div>

              {/* GL Code */}
              {selectedRequest.gl_code && (
                <div className="bg-card rounded-xl p-4">
                  <p className="text-xs text-content-secondary mb-2">Ledger Account</p>
                  <p className="text-content font-medium">{selectedRequest.gl_code} - {selectedRequest.gl_name}</p>
                  {selectedRequest.cost_center && (
                    <p className="text-sm text-content-secondary">Cost Center: {selectedRequest.cost_center}</p>
                  )}
                </div>
              )}

              {/* Documents */}
              <div>
                <p className="text-xs text-content-secondary mb-2">Documents ({selectedRequest.documents.length})</p>
                <div className="space-y-2">
                  {selectedRequest.documents.map(doc => (
                    <div key={doc.id} className="flex items-center justify-between bg-card rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <FileText size={16} className="text-blue-400" />
                        <span className="text-sm text-content">{doc.name}</span>
                      </div>
                      <StatusBadge status={doc.type} size="sm" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Draft Button */}
              {selectedRequest.status === 'draft' && (
                <button
                  onClick={() => handleSubmitDraft(selectedRequest.id)}
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-500 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Send size={18} /> Submit for Approval
                </button>
              )}

              {/* Approval Timeline */}
              {selectedRequest.approvals.length > 0 && (
                <div>
                  <p className="text-xs text-content-secondary mb-3">Approval History</p>
                  <ApprovalTimeline approvals={selectedRequest.approvals} />
                </div>
              )}

              {/* Approval Actions */}
              {['pending_head', 'pending_finance_staff', 'pending_finance_head', 'pending_mudir'].includes(selectedRequest.status) && (
                <ApprovalActions
                  request={selectedRequest}
                  onAction={handleApprovalAction}
                  isProcessing={isSubmitting}
                />
              )}

              {/* Complete Transaction */}
              <CompleteTransactionForm
                request={selectedRequest}
                onComplete={handleCompleteTransaction}
                isProcessing={isSubmitting}
              />

              {/* Transaction Proof (if completed) */}
              {selectedRequest.transaction_reference && (
                <div className="bg-emerald-900/30 rounded-xl p-4 border border-emerald-600/50">
                  <p className="text-xs text-emerald-400 mb-2">Transaction Completed</p>
                  <p className="text-content font-medium">Ref: {selectedRequest.transaction_reference}</p>
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
