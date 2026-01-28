import { useState, useEffect, useCallback } from 'react';
import { Header } from '../../components/Layout';
import { StatusBadge, FilterButtons, CardGridSkeleton } from '../../components/common';
import { Modal, ModalButton } from '../../components/common/Modal';
import type { LeaveRequest, Employee } from '../../types';
import { format } from 'date-fns';
import {
  CheckCircle,
  XCircle,
  Calendar,
  Plus,
  X,
  Clock,
  Users,
  FileText,
  TrendingUp
} from 'lucide-react';
import { hcmsApi, type CreateLeaveInput } from '../../services/supabaseHcms';

// Toast Component
function Toast({
  message,
  type,
  onClose
}: {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed bottom-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg animate-fade-in ${
      type === 'success' ? 'bg-emerald-900/90 text-emerald-100 border border-emerald-700' : 'bg-red-900/90 text-red-100 border border-red-700'
    }`}>
      {type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} className="ml-2 hover:opacity-70">
        <X size={16} />
      </button>
    </div>
  );
}

// Leave Summary Interface
interface LeaveSummary {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

// Leave Balances (would come from API in production)
const defaultLeaveBalances = [
  { type: 'Annual Leave', total: 21, used: 5, remaining: 16, emoji: '🏖️', key: 'annual' },
  { type: 'Sick Leave', total: 10, used: 2, remaining: 8, emoji: '🏥', key: 'sick' },
  { type: 'Emergency', total: 5, used: 1, remaining: 4, emoji: '🚨', key: 'emergency' },
  { type: 'Unpaid Leave', total: 30, used: 0, remaining: 30, emoji: '📝', key: 'unpaid' },
];

const FILTER_OPTIONS = ['all', 'pending', 'approved', 'rejected'] as const;
type FilterOption = typeof FILTER_OPTIONS[number];

const LEAVE_TYPES = [
  { value: 'annual', label: 'Annual Leave' },
  { value: 'sick', label: 'Sick Leave' },
  { value: 'emergency', label: 'Emergency Leave' },
  { value: 'unpaid', label: 'Unpaid Leave' },
  { value: 'maternity', label: 'Maternity Leave' },
  { value: 'paternity', label: 'Paternity Leave' },
] as const;

// Submit Leave Form Component
function SubmitLeaveForm({
  isOpen,
  onClose,
  onSubmit,
  employees,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (input: CreateLeaveInput) => Promise<void>;
  employees: Employee[];
}) {
  const [formData, setFormData] = useState<CreateLeaveInput>({
    employee_id: '',
    employee_name: '',
    leave_type: 'annual',
    start_date: '',
    end_date: '',
    reason: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEmployeeChange = (employeeId: string) => {
    const employee = employees.find(e => e.employee_id === employeeId);
    setFormData({
      ...formData,
      employee_id: employeeId,
      employee_name: employee ? `${employee.first_name} ${employee.last_name}` : '',
    });
  };

  const handleSubmit = async () => {
    setError(null);

    if (!formData.employee_id) {
      setError('Please select an employee');
      return;
    }
    if (!formData.start_date || !formData.end_date) {
      setError('Please select both start and end dates');
      return;
    }
    if (new Date(formData.end_date) < new Date(formData.start_date)) {
      setError('End date cannot be before start date');
      return;
    }
    if (!formData.reason.trim()) {
      setError('Please provide a reason for the leave');
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit(formData);
      setFormData({
        employee_id: '',
        employee_name: '',
        leave_type: 'annual',
        start_date: '',
        end_date: '',
        reason: '',
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit leave request');
    } finally {
      setSubmitting(false);
    }
  };

  const calculateDays = () => {
    if (!formData.start_date || !formData.end_date) return 0;
    const start = new Date(formData.start_date);
    const end = new Date(formData.end_date);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Submit Leave Request"
      size="lg"
      footer={
        <>
          <ModalButton variant="secondary" onClick={onClose}>
            Cancel
          </ModalButton>
          <ModalButton variant="primary" onClick={handleSubmit} disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit Request'}
          </ModalButton>
        </>
      }
    >
      <div className="space-y-4">
        {error && (
          <div className="p-3 bg-red-900/50 border border-red-700 rounded-xl text-red-300 text-sm">
            {error}
          </div>
        )}

        {/* Employee Selection */}
        <div>
          <label className="block text-sm font-medium text-content-tertiary mb-1">
            Employee <span className="text-red-400">*</span>
          </label>
          <select
            value={formData.employee_id}
            onChange={(e) => handleEmployeeChange(e.target.value)}
            className="w-full bg-input border border-border-subtle rounded-xl px-4 py-2.5 text-content focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select employee</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.employee_id}>
                {emp.first_name} {emp.last_name} ({emp.employee_id})
              </option>
            ))}
          </select>
        </div>

        {/* Leave Type */}
        <div>
          <label className="block text-sm font-medium text-content-tertiary mb-1">
            Leave Type <span className="text-red-400">*</span>
          </label>
          <select
            value={formData.leave_type}
            onChange={(e) => setFormData({ ...formData, leave_type: e.target.value as CreateLeaveInput['leave_type'] })}
            className="w-full bg-input border border-border-subtle rounded-xl px-4 py-2.5 text-content focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {LEAVE_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Date Range */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-content-tertiary mb-1">
              Start Date <span className="text-red-400">*</span>
            </label>
            <input
              type="date"
              value={formData.start_date}
              onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
              className="w-full bg-input border border-border-subtle rounded-xl px-4 py-2.5 text-content focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-content-tertiary mb-1">
              End Date <span className="text-red-400">*</span>
            </label>
            <input
              type="date"
              value={formData.end_date}
              min={formData.start_date}
              onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
              className="w-full bg-input border border-border-subtle rounded-xl px-4 py-2.5 text-content focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Days Preview */}
        {formData.start_date && formData.end_date && (
          <div className="p-3 bg-indigo-900/30 border border-indigo-700/50 rounded-xl">
            <p className="text-sm text-indigo-300">
              <span className="font-medium">{calculateDays()} day{calculateDays() !== 1 ? 's' : ''}</span> of leave requested
            </p>
          </div>
        )}

        {/* Reason */}
        <div>
          <label className="block text-sm font-medium text-content-tertiary mb-1">
            Reason <span className="text-red-400">*</span>
          </label>
          <textarea
            value={formData.reason}
            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
            rows={3}
            placeholder="Please provide the reason for your leave request..."
            className="w-full bg-input border border-border-subtle rounded-xl px-4 py-2.5 text-content placeholder-content-secondary focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          />
        </div>
      </div>
    </Modal>
  );
}

// Reject Leave Modal Component
function RejectLeaveModal({
  isOpen,
  onClose,
  onReject,
  leaveName,
}: {
  isOpen: boolean;
  onClose: () => void;
  onReject: (reason: string) => Promise<void>;
  leaveName: string;
}) {
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleReject = async () => {
    if (!reason.trim()) return;
    setSubmitting(true);
    try {
      await onReject(reason);
      setReason('');
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Reject Leave Request"
      size="md"
      footer={
        <>
          <ModalButton variant="secondary" onClick={onClose}>
            Cancel
          </ModalButton>
          <ModalButton variant="danger" onClick={handleReject} disabled={submitting || !reason.trim()}>
            {submitting ? 'Rejecting...' : 'Reject Request'}
          </ModalButton>
        </>
      }
    >
      <div className="space-y-4">
        <p className="text-content-tertiary">
          You are about to reject the leave request from <span className="font-medium text-content">{leaveName}</span>.
        </p>
        <div>
          <label className="block text-sm font-medium text-content-tertiary mb-1">
            Rejection Reason <span className="text-red-400">*</span>
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            placeholder="Please provide a reason for rejection..."
            className="w-full bg-input border border-border-subtle rounded-xl px-4 py-2.5 text-content placeholder-content-secondary focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
          />
        </div>
      </div>
    </Modal>
  );
}

export function Leave() {
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [summary, setSummary] = useState<LeaveSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterOption>('all');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Modal states
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [rejectModal, setRejectModal] = useState<{ isOpen: boolean; leave: LeaveRequest | null }>({
    isOpen: false,
    leave: null,
  });
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const [leavesData, employeesData, summaryData] = await Promise.all([
        hcmsApi.leave.getAll(),
        hcmsApi.employees.getAll(),
        hcmsApi.leave.getSummary(),
      ]);
      setLeaves(leavesData);
      setEmployees(employeesData);
      setSummary(summaryData);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredLeaves = leaves.filter(
    (leave) => filter === 'all' || leave.status === filter
  );

  const handleSubmitLeave = async (input: CreateLeaveInput) => {
    const newLeave = await hcmsApi.leave.create(input);
    setLeaves([newLeave, ...leaves]);
    if (summary) {
      setSummary({ ...summary, total: summary.total + 1, pending: summary.pending + 1 });
    }
    setToast({ message: 'Leave request submitted successfully', type: 'success' });
  };

  const handleApprove = async (leave: LeaveRequest) => {
    setProcessingId(leave.id);
    try {
      await hcmsApi.leave.approve({
        id: leave.id,
        approved_by: 'HR Manager',
      });
      setLeaves(leaves.map(l =>
        l.id === leave.id ? { ...l, status: 'approved', approved_by: 'HR Manager', approved_at: new Date().toISOString() } : l
      ));
      if (summary) {
        setSummary({ ...summary, pending: summary.pending - 1, approved: summary.approved + 1 });
      }
      setToast({ message: `Leave request for ${leave.employee_name} approved`, type: 'success' });
    } catch (error) {
      setToast({ message: 'Failed to approve leave request', type: 'error' });
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (leave: LeaveRequest, reason: string) => {
    setProcessingId(leave.id);
    try {
      await hcmsApi.leave.reject({
        id: leave.id,
        rejected_by: 'HR Manager',
        reason,
      });
      setLeaves(leaves.map(l =>
        l.id === leave.id ? { ...l, status: 'rejected' } : l
      ));
      if (summary) {
        setSummary({ ...summary, pending: summary.pending - 1, rejected: summary.rejected + 1 });
      }
      setToast({ message: `Leave request for ${leave.employee_name} rejected`, type: 'success' });
    } catch (error) {
      setToast({ message: 'Failed to reject leave request', type: 'error' });
    } finally {
      setProcessingId(null);
    }
  };

  const handleCancelLeave = async (leave: LeaveRequest) => {
    setProcessingId(leave.id);
    try {
      await hcmsApi.leave.cancel(leave.id);
      setLeaves(leaves.map(l =>
        l.id === leave.id ? { ...l, status: 'rejected' } : l
      ));
      if (summary) {
        setSummary({ ...summary, pending: summary.pending - 1, rejected: summary.rejected + 1 });
      }
      setToast({ message: 'Leave request cancelled', type: 'success' });
    } catch (error) {
      setToast({ message: error instanceof Error ? error.message : 'Failed to cancel leave request', type: 'error' });
    } finally {
      setProcessingId(null);
    }
  };

  const leaveTypeStyles: Record<string, string> = {
    annual: 'bg-blue-900/50 text-blue-300',
    sick: 'bg-red-900/50 text-red-300',
    emergency: 'bg-orange-900/50 text-orange-300',
    unpaid: 'bg-hover text-content-tertiary',
    maternity: 'bg-pink-900/50 text-pink-300',
    paternity: 'bg-cyan-900/50 text-cyan-300',
  };

  const pendingCount = leaves.filter(l => l.status === 'pending').length;

  return (
    <div className="animate-fade-in">
      <Header title="Leave Management" subtitle="Leave requests and balance tracking" />
      <div className="p-6">
        {/* Action Button */}
        <div className="flex justify-end mb-6">
          <button
            onClick={() => setShowSubmitForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 transition-colors"
          >
            <Plus size={18} />
            Submit Leave Request
          </button>
        </div>
        {/* Summary Stats */}
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-card rounded-xl p-4 border border-border">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-600/20 rounded-lg">
                  <FileText size={20} className="text-indigo-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-content">{summary.total}</p>
                  <p className="text-xs text-content-secondary">Total Requests</p>
                </div>
              </div>
            </div>
            <div className="bg-card rounded-xl p-4 border border-border">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-600/20 rounded-lg">
                  <Clock size={20} className="text-amber-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-content">{summary.pending}</p>
                  <p className="text-xs text-content-secondary">Pending</p>
                </div>
              </div>
            </div>
            <div className="bg-card rounded-xl p-4 border border-border">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-600/20 rounded-lg">
                  <TrendingUp size={20} className="text-emerald-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-content">{summary.approved}</p>
                  <p className="text-xs text-content-secondary">Approved</p>
                </div>
              </div>
            </div>
            <div className="bg-card rounded-xl p-4 border border-border">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-600/20 rounded-lg">
                  <Users size={20} className="text-red-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-content">{summary.rejected}</p>
                  <p className="text-xs text-content-secondary">Rejected</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Leave Balance Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 stagger-children">
          {defaultLeaveBalances.map((balance) => (
            <div key={balance.type} className="bg-card rounded-xl p-5 border border-border card-hover">
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">{balance.emoji}</span>
                <span className="text-xs text-content-secondary">{balance.type}</span>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-3xl font-bold text-content">{balance.remaining}</p>
                  <p className="text-xs text-content-secondary">days remaining</p>
                </div>
                <div className="text-right text-sm">
                  <p className="text-content-secondary">Used: {balance.used}</p>
                  <p className="text-content-secondary">Total: {balance.total}</p>
                </div>
              </div>
              <div className="mt-3 h-2 bg-hover rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                  style={{ width: `${(balance.remaining / balance.total) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FilterButtons
              options={FILTER_OPTIONS}
              value={filter}
              onChange={setFilter}
              colorMap={{
                pending: 'warning',
                approved: 'success',
                rejected: 'error',
              }}
            />
            {pendingCount > 0 && (
              <span className="text-sm text-amber-400">
                {pendingCount} pending request{pendingCount > 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>

        {/* Leave Requests */}
        {loading ? (
          <CardGridSkeleton count={3} />
        ) : (
          <div className="space-y-4 stagger-children">
            {filteredLeaves.map((leave, index) => (
              <div
                key={leave.id}
                className="bg-card rounded-xl border border-border p-5 card-hover animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-indigo-600/30 rounded-full flex items-center justify-center text-indigo-300 font-semibold">
                      {leave.employee_name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="text-content font-semibold">{leave.employee_name}</h3>
                      <p className="text-sm text-content-secondary">{leave.employee_id}</p>
                      <div className="flex items-center gap-3 mt-2 flex-wrap">
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${leaveTypeStyles[leave.leave_type]}`}>
                          {leave.leave_type.replace('_', ' ')}
                        </span>
                        <div className="flex items-center gap-1 text-sm text-content-tertiary">
                          <Calendar size={14} />
                          {leave.start_date && leave.end_date ? (
                            <>{format(new Date(leave.start_date), 'MMM d')} - {format(new Date(leave.end_date), 'MMM d, yyyy')}</>
                          ) : 'Date not specified'}
                        </div>
                        <span className="text-sm text-content-secondary">({leave.days} day{leave.days !== 1 ? 's' : ''})</span>
                      </div>
                      <p className="text-sm text-content-secondary mt-2">{leave.reason}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={leave.status} variant="outline" />
                    {leave.status === 'pending' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprove(leave)}
                          disabled={processingId === leave.id}
                          className="p-2 bg-emerald-900/50 text-emerald-400 rounded-xl hover:bg-emerald-800/50 border border-emerald-600/50 transition-colors disabled:opacity-50"
                          title="Approve"
                          aria-label="Approve leave request"
                        >
                          <CheckCircle size={18} />
                        </button>
                        <button
                          onClick={() => setRejectModal({ isOpen: true, leave })}
                          disabled={processingId === leave.id}
                          className="p-2 bg-red-900/50 text-red-400 rounded-xl hover:bg-red-800/50 border border-red-600/50 transition-colors disabled:opacity-50"
                          title="Reject"
                          aria-label="Reject leave request"
                        >
                          <XCircle size={18} />
                        </button>
                        <button
                          onClick={() => handleCancelLeave(leave)}
                          disabled={processingId === leave.id}
                          className="p-2 bg-hover text-content-secondary rounded-xl hover:bg-hover border border-border-subtle transition-colors disabled:opacity-50"
                          title="Cancel Request"
                          aria-label="Cancel leave request"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                {leave.approved_by && leave.approved_at && (
                  <div className="mt-3 pt-3 border-t border-border">
                    <p className="text-xs text-content-secondary">
                      Approved by {leave.approved_by} on {format(new Date(leave.approved_at), 'MMM d, yyyy')}
                    </p>
                  </div>
                )}
              </div>
            ))}
            {filteredLeaves.length === 0 && (
              <div className="bg-card rounded-xl border border-border p-8 text-center text-content-secondary">
                <Calendar size={48} className="mx-auto mb-3 opacity-50" />
                <p>No leave requests found</p>
                <button
                  onClick={() => setShowSubmitForm(true)}
                  className="mt-3 text-indigo-400 hover:text-indigo-300 text-sm"
                >
                  Submit a new leave request
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Submit Leave Form Modal */}
      <SubmitLeaveForm
        isOpen={showSubmitForm}
        onClose={() => setShowSubmitForm(false)}
        onSubmit={handleSubmitLeave}
        employees={employees}
      />

      {/* Reject Leave Modal */}
      {rejectModal.leave && (
        <RejectLeaveModal
          isOpen={rejectModal.isOpen}
          onClose={() => setRejectModal({ isOpen: false, leave: null })}
          onReject={(reason) => handleReject(rejectModal.leave!, reason)}
          leaveName={rejectModal.leave.employee_name}
        />
      )}

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

// Named export for backward compatibility
export default Leave;
