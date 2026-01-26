import { useState, useEffect, useCallback } from 'react';
import { Header } from '../../components/Layout';
import { StatusBadge, FilterButtons, CardGridSkeleton, Modal, ModalButton } from '../../components/common';
import type { ComplianceAlert, DisciplinaryCase, Employee } from '../../types';
import { format } from 'date-fns';
import { AlertTriangle, FileWarning, CheckCircle as CheckCircleIcon, Clock, Shield, Plus, Edit, Eye, XCircle } from 'lucide-react';
import { hcmsApi, LogCaseInput, UpdateCaseStatusInput } from '../../services/mockData/hcms';

const FILTER_OPTIONS = ['all', 'critical', 'warning', 'normal'] as const;
type FilterOption = typeof FILTER_OPTIONS[number];

// Toast Component
function Toast({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed bottom-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg animate-fade-in ${
      type === 'success' ? 'bg-emerald-600' : 'bg-red-600'
    } text-white`}>
      {type === 'success' ? <CheckCircleIcon size={20} /> : <XCircle size={20} />}
      {message}
    </div>
  );
}

// Log Case Modal
function LogCaseModal({
  employees,
  onClose,
  onSubmit,
  isSubmitting
}: {
  employees: Employee[];
  onClose: () => void;
  onSubmit: (data: LogCaseInput) => void;
  isSubmitting: boolean;
}) {
  const [form, setForm] = useState<LogCaseInput>({
    employee_id: '',
    employee_name: '',
    case_type: 'warning',
    severity: 'minor',
    description: '',
  });

  const handleEmployeeChange = (employeeId: string) => {
    const emp = employees.find(e => e.employee_id === employeeId);
    if (emp) {
      setForm({
        ...form,
        employee_id: emp.employee_id,
        employee_name: `${emp.first_name} ${emp.last_name}`,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  const activeEmployees = employees.filter(e => e.employment_status === 'active');

  return (
    <Modal isOpen={true} title="Log Disciplinary Case" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Employee *</label>
          <select
            required
            value={form.employee_id}
            onChange={e => handleEmployeeChange(e.target.value)}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="">Select Employee</option>
            {activeEmployees.map(emp => (
              <option key={emp.employee_id} value={emp.employee_id}>
                {emp.first_name} {emp.last_name} - {emp.department}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Case Type *</label>
            <select
              required
              value={form.case_type}
              onChange={e => setForm({ ...form, case_type: e.target.value as LogCaseInput['case_type'] })}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="warning">Warning</option>
              <option value="suspension">Suspension</option>
              <option value="termination">Termination</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Severity *</label>
            <select
              required
              value={form.severity}
              onChange={e => setForm({ ...form, severity: e.target.value as LogCaseInput['severity'] })}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="minor">Minor</option>
              <option value="major">Major</option>
              <option value="gross">Gross Misconduct</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Description *</label>
          <textarea
            required
            rows={3}
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
            placeholder="Describe the incident or violation..."
          />
        </div>

        <div className="flex gap-3 pt-4">
          <ModalButton variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </ModalButton>
          <button
            type="submit"
            disabled={isSubmitting || !form.employee_id}
            className="px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Logging...' : 'Log Case'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

// Update Case Status Modal
function UpdateCaseStatusModal({
  caseItem,
  onClose,
  onSubmit,
  isSubmitting
}: {
  caseItem: DisciplinaryCase;
  onClose: () => void;
  onSubmit: (data: UpdateCaseStatusInput) => void;
  isSubmitting: boolean;
}) {
  const [form, setForm] = useState<UpdateCaseStatusInput>({
    id: caseItem.id,
    status: caseItem.status,
    action_taken: caseItem.action_taken || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  const statuses: { value: UpdateCaseStatusInput['status']; label: string; color: string }[] = [
    { value: 'open', label: 'Open', color: 'bg-red-500' },
    { value: 'investigation', label: 'Under Investigation', color: 'bg-amber-500' },
    { value: 'resolved', label: 'Resolved', color: 'bg-emerald-500' },
  ];

  return (
    <Modal isOpen={true} title={`Update Case: ${caseItem.employee_name}`} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="p-4 bg-slate-700/50 rounded-xl">
          <p className="text-white font-semibold">{caseItem.employee_name}</p>
          <p className="text-sm text-slate-400">{caseItem.employee_id}</p>
          <div className="flex items-center gap-2 mt-2">
            <StatusBadge status={caseItem.case_type} size="sm" />
            <StatusBadge status={caseItem.severity} size="sm" />
          </div>
          <p className="text-sm text-slate-300 mt-2">{caseItem.description}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Status *</label>
          <div className="space-y-2">
            {statuses.map(status => (
              <label
                key={status.value}
                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                  form.status === status.value
                    ? 'border-indigo-500 bg-indigo-500/20'
                    : 'border-slate-600 hover:border-slate-500'
                }`}
              >
                <input
                  type="radio"
                  name="status"
                  value={status.value}
                  checked={form.status === status.value}
                  onChange={e => setForm({ ...form, status: e.target.value as UpdateCaseStatusInput['status'] })}
                  className="sr-only"
                />
                <span className={`w-3 h-3 rounded-full ${status.color}`} />
                <span className="text-white">{status.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Action Taken</label>
          <textarea
            rows={2}
            value={form.action_taken || ''}
            onChange={e => setForm({ ...form, action_taken: e.target.value })}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
            placeholder="Describe the action taken or resolution..."
          />
        </div>

        <div className="flex gap-3 pt-4">
          <ModalButton variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </ModalButton>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              form.status === 'resolved' ? 'bg-emerald-600 text-white hover:bg-emerald-500' : 'bg-indigo-600 text-white hover:bg-indigo-500'
            }`}
          >
            {isSubmitting ? 'Updating...' : 'Update Case'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

// Case Detail Modal
function CaseDetailModal({
  caseItem,
  onClose
}: {
  caseItem: DisciplinaryCase;
  onClose: () => void;
}) {
  return (
    <Modal isOpen={true} title="Case Details" onClose={onClose}>
      <div className="space-y-4">
        <div className="text-center p-6 bg-slate-700/50 rounded-xl">
          <p className="text-white font-semibold text-xl">{caseItem.employee_name}</p>
          <p className="text-slate-400">{caseItem.employee_id}</p>
          <div className="flex justify-center gap-2 mt-3">
            <StatusBadge status={caseItem.case_type} />
            <StatusBadge status={caseItem.severity} />
            <StatusBadge status={caseItem.status} />
          </div>
        </div>

        <div className="p-4 bg-slate-800 rounded-xl">
          <p className="text-sm text-slate-400 mb-2">Description</p>
          <p className="text-white">{caseItem.description}</p>
        </div>

        <div className="p-4 bg-slate-800 rounded-xl">
          <p className="text-sm text-slate-400 mb-2">Action Taken</p>
          <p className="text-white">{caseItem.action_taken || 'No action recorded yet'}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-slate-800 rounded-xl">
            <p className="text-sm text-slate-400">Created</p>
            <p className="text-white">{format(new Date(caseItem.created_at), 'MMM d, yyyy')}</p>
          </div>
          <div className="p-4 bg-slate-800 rounded-xl">
            <p className="text-sm text-slate-400">Resolved</p>
            <p className="text-white">{caseItem.resolved_at ? format(new Date(caseItem.resolved_at), 'MMM d, yyyy') : '-'}</p>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <ModalButton variant="secondary" onClick={onClose}>
            Close
          </ModalButton>
        </div>
      </div>
    </Modal>
  );
}

export function Compliance() {
  const [alerts, setAlerts] = useState<ComplianceAlert[]>([]);
  const [cases, setCases] = useState<DisciplinaryCase[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterOption>('all');

  // Modal states
  const [showLogModal, setShowLogModal] = useState(false);
  const [editingCase, setEditingCase] = useState<DisciplinaryCase | null>(null);
  const [viewingCase, setViewingCase] = useState<DisciplinaryCase | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Toast state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const [alertsData, casesData, employeesData] = await Promise.all([
        hcmsApi.compliance.getAlerts(),
        hcmsApi.compliance.getCases(),
        hcmsApi.employees.getAll(),
      ]);
      setAlerts(alertsData);
      setCases(casesData);
      setEmployees(employeesData);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleLogCase = async (data: LogCaseInput) => {
    setIsSubmitting(true);
    try {
      const newCase = await hcmsApi.compliance.logCase(data);
      setCases(prev => [...prev, newCase]);
      setShowLogModal(false);
      setToast({ message: `Case logged for ${newCase.employee_name}`, type: 'success' });
    } catch (err) {
      setToast({ message: 'Failed to log case', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateCase = async (data: UpdateCaseStatusInput) => {
    setIsSubmitting(true);
    try {
      const updated = await hcmsApi.compliance.updateCaseStatus(data);
      setCases(prev => prev.map(c => c.id === updated.id ? updated : c));
      setEditingCase(null);
      setToast({ message: `Case updated to ${updated.status}`, type: 'success' });
    } catch (err) {
      setToast({ message: 'Failed to update case', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getAlertLevel = (days: number) => {
    if (days <= 14) return 'critical';
    if (days <= 30) return 'warning';
    return 'normal';
  };

  const filteredAlerts = alerts.filter((alert) => {
    if (filter === 'all') return true;
    return getAlertLevel(alert.days_remaining) === filter;
  });

  const alertTypeLabels: Record<string, { label: string; emoji: string }> = {
    iqamah_expiry: { label: 'Iqamah Expiry', emoji: '' },
    visa_expiry: { label: 'Visa Expiry', emoji: '' },
    passport_expiry: { label: 'Passport Expiry', emoji: '' },
    contract_expiry: { label: 'Contract Expiry', emoji: '' },
  };

  const criticalCount = alerts.filter(a => a.days_remaining <= 14).length;
  const warningCount = alerts.filter(a => a.days_remaining > 14 && a.days_remaining <= 30).length;

  return (
    <div className="animate-fade-in">
      <Header title="Compliance" subtitle="Document expiry and disciplinary tracking" />
      <div className="p-6">
        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 stagger-children">
          <div className="bg-red-900/30 rounded-xl p-5 border border-red-600/50 card-hover">
            <div className="flex items-center gap-3 mb-2">
              <AlertTriangle size={20} className="text-red-400" />
              <span className="text-sm text-red-300">Critical</span>
            </div>
            <p className="text-3xl font-bold text-white">{criticalCount}</p>
            <p className="text-xs text-red-400">Expiring within 14 days</p>
          </div>
          <div className="bg-amber-900/30 rounded-xl p-5 border border-amber-600/50 card-hover">
            <div className="flex items-center gap-3 mb-2">
              <Clock size={20} className="text-amber-400" />
              <span className="text-sm text-amber-300">Warning</span>
            </div>
            <p className="text-3xl font-bold text-white">{warningCount}</p>
            <p className="text-xs text-amber-400">Expiring within 30 days</p>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700 card-hover">
            <div className="flex items-center gap-3 mb-2">
              <Shield size={20} className="text-blue-400" />
              <span className="text-sm text-slate-400">Total Alerts</span>
            </div>
            <p className="text-3xl font-bold text-white">{alerts.length}</p>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700 card-hover">
            <div className="flex items-center gap-3 mb-2">
              <FileWarning size={20} className="text-purple-400" />
              <span className="text-sm text-slate-400">Open Cases</span>
            </div>
            <p className="text-3xl font-bold text-white">{cases.filter(c => c.status !== 'resolved').length}</p>
          </div>
        </div>

        {/* Filters and Action Button */}
        <div className="flex justify-between items-center mb-6">
          <FilterButtons
            options={FILTER_OPTIONS}
            value={filter}
            onChange={setFilter}
            colorMap={{
              critical: 'error',
              warning: 'warning',
            }}
          />
          <button
            onClick={() => setShowLogModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-500 transition-colors"
          >
            <Plus size={20} />
            Log Case
          </button>
        </div>

        {loading ? (
          <CardGridSkeleton count={2} columns={2} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Document Expiry Alerts */}
            <div className="bg-slate-800/50 rounded-xl border border-slate-700 card-hover">
              <div className="p-4 border-b border-slate-700">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  Document Expiry Alerts
                </h3>
              </div>
              <div className="p-4 space-y-3 max-h-[500px] overflow-y-auto">
                {filteredAlerts.map((alert, index) => {
                  const level = getAlertLevel(alert.days_remaining);
                  return (
                    <div
                      key={alert.id}
                      className={`p-4 rounded-xl border animate-fade-in ${
                        level === 'critical' ? 'bg-red-900/30 border-red-600/50' :
                        level === 'warning' ? 'bg-amber-900/30 border-amber-600/50' :
                        'bg-slate-900/50 border-slate-700'
                      }`}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">{alertTypeLabels[alert.alert_type].emoji}</span>
                          <div>
                            <p className="text-white font-semibold">{alert.employee_name}</p>
                            <p className="text-sm text-slate-400">{alert.employee_id}</p>
                            <p className="text-sm text-slate-300 mt-1">
                              {alertTypeLabels[alert.alert_type].label}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`text-lg font-bold ${
                            level === 'critical' ? 'text-red-400' :
                            level === 'warning' ? 'text-amber-400' : 'text-emerald-400'
                          }`}>
                            {alert.days_remaining} days
                          </p>
                          <p className="text-xs text-slate-400">
                            {format(new Date(alert.expiry_date), 'MMM d, yyyy')}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {filteredAlerts.length === 0 && (
                  <p className="text-slate-400 text-center py-8">No alerts in this category</p>
                )}
              </div>
            </div>

            {/* Disciplinary Cases */}
            <div className="bg-slate-800/50 rounded-xl border border-slate-700 card-hover">
              <div className="p-4 border-b border-slate-700">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  Disciplinary Cases
                </h3>
              </div>
              <div className="p-4 space-y-3 max-h-[500px] overflow-y-auto">
                {cases.map((caseItem, index) => (
                  <div
                    key={caseItem.id}
                    className={`p-4 rounded-xl border animate-fade-in ${
                      caseItem.status === 'open' ? 'bg-red-900/30 border-red-600/50' :
                      caseItem.status === 'investigation' ? 'bg-amber-900/30 border-amber-600/50' :
                      'bg-slate-900/50 border-slate-700'
                    }`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="text-white font-semibold">{caseItem.employee_name}</p>
                        <p className="text-sm text-slate-400">{caseItem.employee_id}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusBadge status={caseItem.severity} size="sm" />
                        <StatusBadge status={caseItem.status} size="sm" />
                      </div>
                    </div>
                    <p className="text-sm text-slate-300 mb-2 line-clamp-2">{caseItem.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <StatusBadge status={caseItem.case_type} size="sm" />
                        <span>{format(new Date(caseItem.created_at), 'MMM d, yyyy')}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setViewingCase(caseItem)}
                          className="p-1.5 hover:bg-slate-700 rounded-lg transition-colors"
                          title="View details"
                        >
                          <Eye size={14} className="text-slate-400" />
                        </button>
                        {caseItem.status !== 'resolved' && (
                          <button
                            onClick={() => setEditingCase(caseItem)}
                            className="p-1.5 hover:bg-slate-700 rounded-lg transition-colors"
                            title="Update case"
                          >
                            <Edit size={14} className="text-indigo-400" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {cases.length === 0 && (
                  <div className="text-center py-8">
                    <CheckCircleIcon size={48} className="mx-auto text-emerald-400 mb-3" />
                    <p className="text-slate-400">No disciplinary cases</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showLogModal && (
        <LogCaseModal
          employees={employees}
          onClose={() => setShowLogModal(false)}
          onSubmit={handleLogCase}
          isSubmitting={isSubmitting}
        />
      )}

      {editingCase && (
        <UpdateCaseStatusModal
          caseItem={editingCase}
          onClose={() => setEditingCase(null)}
          onSubmit={handleUpdateCase}
          isSubmitting={isSubmitting}
        />
      )}

      {viewingCase && (
        <CaseDetailModal
          caseItem={viewingCase}
          onClose={() => setViewingCase(null)}
        />
      )}

      {/* Toast */}
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  );
}

// Named export for backward compatibility
export default Compliance;
