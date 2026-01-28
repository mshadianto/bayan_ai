import { useState, useEffect } from 'react';
import { Header } from '../components/Layout';
import { StatusBadge, FilterButtons, SearchInput, TableSkeleton, Modal } from '../components/common';
import { StatCard } from '../components/common/StatCard';
import { invoicesApi, GL_ACCOUNTS, VENDORS } from '../services/mockData/invoices';
import type { ExtendedInvoice, InvoiceSummary, CreateInvoiceInput } from '../services/mockData/invoices';
import { format } from 'date-fns';
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  DollarSign,
  TrendingUp,
  ChevronRight,
  Plus,
  BookOpen,
  AlertCircle,
  Upload,
} from 'lucide-react';

const FILTER_OPTIONS = ['all', 'pending', 'approved', 'posted', 'rejected'] as const;
type FilterOption = typeof FILTER_OPTIONS[number];

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  pending: { label: 'Pending', color: 'bg-amber-600', icon: <Clock size={14} /> },
  approved: { label: 'Approved', color: 'bg-emerald-600', icon: <CheckCircle size={14} /> },
  posted: { label: 'Posted', color: 'bg-blue-600', icon: <BookOpen size={14} /> },
  rejected: { label: 'Rejected', color: 'bg-red-600', icon: <XCircle size={14} /> },
};

const CURRENT_USER = {
  name: 'Admin User',
  role: 'admin',
};

function formatCurrency(amount: number, currency: string = 'SAR') {
  return new Intl.NumberFormat('en-SA', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(amount);
}

// Toast component
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
      <button onClick={onClose} className="ml-2 hover:opacity-70">x</button>
    </div>
  );
}

// Approval Timeline
function ApprovalTimeline({ approvals }: { approvals: ExtendedInvoice['approvals'] }) {
  const roleLabels: Record<string, string> = {
    requester: 'Requester',
    manager: 'Manager',
    finance: 'Finance',
    cfo: 'CFO',
  };

  return (
    <div className="space-y-3">
      {approvals.map((step, index) => {
        const isLast = index === approvals.length - 1;
        const statusColors = {
          pending: 'bg-slate-600 border-slate-500',
          approved: 'bg-emerald-600 border-emerald-500',
          rejected: 'bg-red-600 border-red-500',
        };

        return (
          <div key={step.id} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${statusColors[step.status]}`}>
                {step.status === 'approved' && <CheckCircle size={16} className="text-white" />}
                {step.status === 'rejected' && <XCircle size={16} className="text-white" />}
                {step.status === 'pending' && <Clock size={16} className="text-white" />}
              </div>
              {!isLast && <div className="w-0.5 h-8 bg-slate-600 mt-1" />}
            </div>
            <div className="flex-1 pb-2">
              <div className="flex items-center justify-between">
                <p className="text-content font-medium">{roleLabels[step.role]}</p>
                <StatusBadge status={step.status} size="sm" />
              </div>
              {step.approver_name && (
                <p className="text-sm text-content-secondary">{step.approver_name}</p>
              )}
              {step.action_at && (
                <p className="text-xs text-content-muted">{format(new Date(step.action_at), 'dd MMM yyyy HH:mm')}</p>
              )}
              {step.comments && (
                <p className="text-sm text-content-tertiary mt-1 bg-card p-2 rounded-lg">"{step.comments}"</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Create Invoice Form
function CreateInvoiceForm({ onSubmit, onCancel, isSubmitting }: {
  onSubmit: (data: CreateInvoiceInput) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}) {
  const [formData, setFormData] = useState<CreateInvoiceInput>({
    vendor_name: '',
    vendor_tax_id: '',
    amount: 0,
    currency: 'SAR',
    gl_code: '',
    gl_name: '',
    description: '',
    due_date: '',
    requester_name: CURRENT_USER.name,
    requester_unit: 'General Affairs',
    documents: [],
  });
  const [docName, setDocName] = useState('');
  const [docType, setDocType] = useState('invoice');

  const handleVendorSelect = (vendorName: string) => {
    const vendor = VENDORS.find(v => v.name === vendorName);
    setFormData(prev => ({
      ...prev,
      vendor_name: vendorName,
      vendor_tax_id: vendor?.tax_id || '',
    }));
  };

  const handleGLSelect = (glCode: string) => {
    const gl = GL_ACCOUNTS.find(g => g.code === glCode);
    setFormData(prev => ({
      ...prev,
      gl_code: glCode,
      gl_name: gl?.name || '',
    }));
  };

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
      {/* Vendor */}
      <div>
        <label className="block text-sm text-content-secondary mb-1">Vendor</label>
        <select
          value={formData.vendor_name}
          onChange={(e) => handleVendorSelect(e.target.value)}
          className="w-full bg-input border border-border-subtle rounded-lg px-4 py-2 text-content focus:outline-none focus:border-teal-500"
        >
          <option value="">-- Select Vendor --</option>
          {VENDORS.map(vendor => (
            <option key={vendor.id} value={vendor.name}>{vendor.name}</option>
          ))}
        </select>
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

      {/* GL Code */}
      <div>
        <label className="block text-sm text-content-secondary mb-1">GL Account</label>
        <select
          value={formData.gl_code}
          onChange={(e) => handleGLSelect(e.target.value)}
          className="w-full bg-input border border-border-subtle rounded-lg px-4 py-2 text-content focus:outline-none focus:border-teal-500"
        >
          <option value="">-- Select GL Account --</option>
          {GL_ACCOUNTS.map(gl => (
            <option key={gl.code} value={gl.code}>{gl.code} - {gl.name}</option>
          ))}
        </select>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm text-content-secondary mb-1">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          className="w-full bg-input border border-border-subtle rounded-lg px-4 py-2 text-content focus:outline-none focus:border-teal-500 min-h-[80px]"
          placeholder="Invoice description..."
        />
      </div>

      {/* Due Date */}
      <div>
        <label className="block text-sm text-content-secondary mb-1">Due Date</label>
        <input
          type="date"
          value={formData.due_date}
          onChange={(e) => setFormData(prev => ({ ...prev, due_date: e.target.value }))}
          className="w-full bg-input border border-border-subtle rounded-lg px-4 py-2 text-content focus:outline-none focus:border-teal-500"
        />
      </div>

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
            <option value="po">PO</option>
            <option value="contract">Contract</option>
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
                  <button onClick={() => handleRemoveDoc(i)} className="text-red-400 hover:text-red-300">x</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CFO Warning */}
      {formData.amount > 100000 && (
        <div className="p-3 bg-amber-900/30 border border-amber-600/50 rounded-xl">
          <p className="text-amber-300 text-sm flex items-center gap-2">
            <AlertCircle size={16} />
            Amount exceeds SAR 100,000. CFO approval will be required.
          </p>
        </div>
      )}

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
          disabled={!formData.vendor_name || !formData.amount || !formData.gl_code || isSubmitting}
          className="flex-1 px-4 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? 'Creating...' : <><Plus size={18} /> Create Invoice</>}
        </button>
      </div>
    </div>
  );
}

// Approval Actions
function ApprovalActions({ invoice, onApprove, onReject, isProcessing }: {
  invoice: ExtendedInvoice;
  onApprove: (role: 'manager' | 'finance' | 'cfo', comments?: string) => void;
  onReject: (role: 'manager' | 'finance' | 'cfo', reason: string) => void;
  isProcessing: boolean;
}) {
  const [comments, setComments] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  // Find pending approval role
  const pendingApproval = invoice.approvals.find(a => a.status === 'pending');
  if (!pendingApproval || invoice.status !== 'pending') return null;

  const role = pendingApproval.role as 'manager' | 'finance' | 'cfo';

  const handleReject = () => {
    onReject(role, rejectReason);
    setShowRejectModal(false);
    setRejectReason('');
  };

  return (
    <div className="border-t border-border pt-4 mt-4">
      <p className="text-sm font-medium text-content mb-3">
        Approval Actions (as {role.charAt(0).toUpperCase() + role.slice(1)})
      </p>

      <div className="mb-4">
        <label className="block text-sm text-content-secondary mb-1">Comments (optional)</label>
        <textarea
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          className="w-full bg-input border border-border-subtle rounded-lg px-4 py-2 text-content focus:outline-none focus:border-teal-500 min-h-[60px]"
          placeholder="Add approval comments..."
        />
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => onApprove(role, comments)}
          disabled={isProcessing}
          className="flex-1 px-4 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-500 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <CheckCircle size={18} /> Approve
        </button>
        <button
          onClick={() => setShowRejectModal(true)}
          disabled={isProcessing}
          className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-500 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <XCircle size={18} /> Reject
        </button>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-input rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-content mb-4">Reject Invoice</h3>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full bg-input border border-border-subtle rounded-lg px-4 py-2 text-content focus:outline-none focus:border-red-500 min-h-[80px] mb-4"
              placeholder="Reason for rejection..."
              required
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowRejectModal(false)}
                className="flex-1 px-4 py-2 bg-hover text-content rounded-lg hover:bg-hover"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={!rejectReason}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 disabled:opacity-50"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Post to GL Action
function PostToGLAction({ invoice, onPost, isProcessing }: {
  invoice: ExtendedInvoice;
  onPost: () => void;
  isProcessing: boolean;
}) {
  if (invoice.status !== 'approved') return null;

  return (
    <div className="border-t border-border pt-4 mt-4">
      <p className="text-sm font-medium text-content mb-3">Post to General Ledger</p>
      <button
        onClick={onPost}
        disabled={isProcessing}
        className="w-full px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
      >
        <BookOpen size={18} /> Post to GL
      </button>
    </div>
  );
}

export function Invoices() {
  const [invoices, setInvoices] = useState<ExtendedInvoice[]>([]);
  const [summary, setSummary] = useState<InvoiceSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterOption>('all');
  const [search, setSearch] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<ExtendedInvoice | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const fetchData = async () => {
    try {
      const [invoicesData, summaryData] = await Promise.all([
        invoicesApi.invoices.getAll(),
        invoicesApi.invoices.getSummary(),
      ]);
      setInvoices(invoicesData);
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

  const handleCreateInvoice = async (data: CreateInvoiceInput) => {
    setIsSubmitting(true);
    try {
      const newInvoice = await invoicesApi.invoices.create(data);
      showToast(`Invoice ${newInvoice.invoice_number} created successfully!`, 'success');
      setShowCreateModal(false);
      await fetchData();
    } catch {
      showToast('Failed to create invoice', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApprove = async (role: 'manager' | 'finance' | 'cfo', comments?: string) => {
    if (!selectedInvoice) return;
    setIsSubmitting(true);
    try {
      await invoicesApi.invoices.approve({
        invoiceId: selectedInvoice.id,
        approverName: CURRENT_USER.name,
        role,
        comments,
      });
      showToast('Invoice approved successfully!', 'success');
      setSelectedInvoice(null);
      await fetchData();
    } catch {
      showToast('Failed to approve invoice', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async (role: 'manager' | 'finance' | 'cfo', reason: string) => {
    if (!selectedInvoice) return;
    setIsSubmitting(true);
    try {
      await invoicesApi.invoices.reject({
        invoiceId: selectedInvoice.id,
        approverName: CURRENT_USER.name,
        role,
        reason,
      });
      showToast('Invoice rejected', 'info');
      setSelectedInvoice(null);
      await fetchData();
    } catch {
      showToast('Failed to reject invoice', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePostToGL = async () => {
    if (!selectedInvoice) return;
    setIsSubmitting(true);
    try {
      await invoicesApi.invoices.postToGL({
        invoiceId: selectedInvoice.id,
        postedBy: CURRENT_USER.name,
      });
      showToast('Invoice posted to General Ledger!', 'success');
      setSelectedInvoice(null);
      await fetchData();
    } catch {
      showToast('Failed to post invoice', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredInvoices = invoices.filter(inv => {
    const matchesFilter = filter === 'all' || inv.status === filter;
    const matchesSearch = search === '' ||
      inv.invoice_number.toLowerCase().includes(search.toLowerCase()) ||
      inv.vendor_name?.toLowerCase().includes(search.toLowerCase()) ||
      inv.description?.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="animate-fade-in">
      <Header title="Invoice Management" subtitle="Approval workflow and GL posting" />
      <div className="p-6">
        {/* Toast */}
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 stagger-children">
          <StatCard
            icon={<FileText className="text-blue-400" />}
            label="Total Invoices"
            value={summary?.total_invoices || 0}
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
            label="Posted to GL"
            value={summary?.posted_count || 0}
            variant="success"
          />
        </div>

        {/* Actions & Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-500 transition-colors flex items-center gap-2 font-medium"
          >
            <Plus size={20} /> New Invoice
          </button>
          <div className="flex-1">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search by invoice number, vendor..."
            />
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="mb-6">
          <FilterButtons
            options={FILTER_OPTIONS}
            value={filter}
            onChange={setFilter}
          />
        </div>

        {/* Invoices Table */}
        {loading ? (
          <TableSkeleton rows={5} columns={7} />
        ) : (
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-input">
                  <tr>
                    <th className="text-left p-4 text-sm font-semibold text-content-tertiary">Invoice</th>
                    <th className="text-left p-4 text-sm font-semibold text-content-tertiary">Vendor</th>
                    <th className="text-right p-4 text-sm font-semibold text-content-tertiary">Amount</th>
                    <th className="text-left p-4 text-sm font-semibold text-content-tertiary">GL Code</th>
                    <th className="text-left p-4 text-sm font-semibold text-content-tertiary">Due Date</th>
                    <th className="text-left p-4 text-sm font-semibold text-content-tertiary">Status</th>
                    <th className="text-left p-4 text-sm font-semibold text-content-tertiary"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvoices.map((inv, index) => {
                    const statusConfig = STATUS_CONFIG[inv.status];
                    const isHighValue = inv.amount > 100000;

                    return (
                      <tr
                        key={inv.id}
                        className="border-t border-border hover:bg-hover/30 transition-colors cursor-pointer animate-fade-in"
                        style={{ animationDelay: `${index * 50}ms` }}
                        onClick={() => setSelectedInvoice(inv)}
                      >
                        <td className="p-4">
                          <p className="text-content font-medium">{inv.invoice_number}</p>
                          <p className="text-xs text-content-secondary">{inv.description?.substring(0, 30)}...</p>
                        </td>
                        <td className="p-4 text-content-tertiary">{inv.vendor_name}</td>
                        <td className="p-4 text-right">
                          <p className={`font-semibold ${isHighValue ? 'text-red-400' : 'text-content'}`}>
                            {formatCurrency(inv.amount, inv.currency)}
                          </p>
                          {isHighValue && (
                            <span className="text-xs bg-red-900/50 text-red-300 px-2 py-0.5 rounded-lg">
                              CFO Required
                            </span>
                          )}
                        </td>
                        <td className="p-4">
                          <p className="text-content font-mono text-sm">{inv.gl_code}</p>
                          <p className="text-xs text-content-secondary">{inv.gl_name}</p>
                        </td>
                        <td className="p-4 text-sm text-content-tertiary">
                          {inv.due_date ? format(new Date(inv.due_date), 'dd MMM yyyy') : '-'}
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-white ${statusConfig.color}`}>
                            {statusConfig.icon}
                            {statusConfig.label}
                          </span>
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
            {filteredInvoices.length === 0 && (
              <div className="text-center py-12">
                <FileText size={48} className="mx-auto text-content-muted mb-3" />
                <p className="text-content-secondary">No invoices found</p>
              </div>
            )}
          </div>
        )}

        {/* Create Invoice Modal */}
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Create Invoice"
          size="lg"
        >
          <CreateInvoiceForm
            onSubmit={handleCreateInvoice}
            onCancel={() => setShowCreateModal(false)}
            isSubmitting={isSubmitting}
          />
        </Modal>

        {/* Detail Modal */}
        <Modal
          isOpen={!!selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
          title={selectedInvoice?.invoice_number || ''}
          size="xl"
        >
          {selectedInvoice && (
            <div className="space-y-6">
              {/* Invoice Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-content-secondary mb-1">Vendor</p>
                  <p className="text-content font-medium">{selectedInvoice.vendor_name}</p>
                  {selectedInvoice.vendor_tax_id && (
                    <p className="text-xs text-content-secondary">Tax ID: {selectedInvoice.vendor_tax_id}</p>
                  )}
                </div>
                <div>
                  <p className="text-xs text-content-secondary mb-1">Amount</p>
                  <p className="text-content font-semibold text-lg">
                    {formatCurrency(selectedInvoice.amount, selectedInvoice.currency)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-content-secondary mb-1">GL Account</p>
                  <p className="text-content font-mono">{selectedInvoice.gl_code}</p>
                  <p className="text-xs text-content-secondary">{selectedInvoice.gl_name}</p>
                </div>
                <div>
                  <p className="text-xs text-content-secondary mb-1">Status</p>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-white ${STATUS_CONFIG[selectedInvoice.status].color}`}>
                    {STATUS_CONFIG[selectedInvoice.status].icon}
                    {STATUS_CONFIG[selectedInvoice.status].label}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div>
                <p className="text-xs text-content-secondary mb-1">Description</p>
                <p className="text-content-tertiary">{selectedInvoice.description}</p>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-card rounded-xl p-4">
                  <p className="text-xs text-content-secondary mb-1">Created</p>
                  <p className="text-content">{format(new Date(selectedInvoice.created_at), 'dd MMM yyyy')}</p>
                </div>
                <div className="bg-card rounded-xl p-4">
                  <p className="text-xs text-content-secondary mb-1">Due Date</p>
                  <p className="text-content">
                    {selectedInvoice.due_date ? format(new Date(selectedInvoice.due_date), 'dd MMM yyyy') : '-'}
                  </p>
                </div>
              </div>

              {/* Documents */}
              {selectedInvoice.documents.length > 0 && (
                <div>
                  <p className="text-xs text-content-secondary mb-2">Documents ({selectedInvoice.documents.length})</p>
                  <div className="space-y-2">
                    {selectedInvoice.documents.map(doc => (
                      <div key={doc.id} className="flex items-center justify-between bg-card rounded-lg p-3">
                        <div className="flex items-center gap-2">
                          <Upload size={16} className="text-blue-400" />
                          <span className="text-sm text-content">{doc.name}</span>
                        </div>
                        <StatusBadge status={doc.type} size="sm" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Approval Timeline */}
              {selectedInvoice.approvals.length > 0 && (
                <div>
                  <p className="text-xs text-content-secondary mb-3">Approval History</p>
                  <ApprovalTimeline approvals={selectedInvoice.approvals} />
                </div>
              )}

              {/* Journal Entry Info */}
              {selectedInvoice.status === 'posted' && selectedInvoice.journal_entry_id && (
                <div className="bg-blue-900/30 rounded-xl p-4 border border-blue-600/50">
                  <p className="text-xs text-blue-400 mb-1">Posted to General Ledger</p>
                  <p className="text-content font-medium">Journal Entry: {selectedInvoice.journal_entry_id}</p>
                  {selectedInvoice.posted_at && (
                    <p className="text-sm text-blue-300">
                      {format(new Date(selectedInvoice.posted_at), 'dd MMM yyyy HH:mm')}
                    </p>
                  )}
                </div>
              )}

              {/* Rejection Reason */}
              {selectedInvoice.status === 'rejected' && selectedInvoice.rejection_reason && (
                <div className="bg-red-900/30 rounded-xl p-4 border border-red-600/50">
                  <p className="text-xs text-red-400 mb-1">Rejection Reason</p>
                  <p className="text-content">{selectedInvoice.rejection_reason}</p>
                </div>
              )}

              {/* Approval Actions */}
              <ApprovalActions
                invoice={selectedInvoice}
                onApprove={handleApprove}
                onReject={handleReject}
                isProcessing={isSubmitting}
              />

              {/* Post to GL */}
              <PostToGLAction
                invoice={selectedInvoice}
                onPost={handlePostToGL}
                isProcessing={isSubmitting}
              />
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
}

export default Invoices;
