import { useState, useEffect, useCallback } from 'react';
import { Header } from '../../components/Layout';
import { StatusBadge, SearchInput, TableSkeleton } from '../../components/common';
import { Modal, ModalButton } from '../../components/common/Modal';
import type { PayrollRecord } from '../../types';
import {
  Download,
  Eye,
  Play,
  CheckCircle,
  XCircle,
  X,
  DollarSign,
  Clock,
  CreditCard,
  Users,
  TrendingUp,
  Edit2
} from 'lucide-react';
import {
  hcmsApi,
  type ProcessPayrollInput,
  type AdjustSalaryInput
} from '../../services/supabaseHcms';

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

// Payroll Summary Interface
interface PayrollSummary {
  total_records: number;
  pending: number;
  processing: number;
  paid: number;
  total_gross: number;
  total_deductions: number;
  total_net: number;
  total_gosi: number;
}

// Run Payroll Modal Component
function RunPayrollModal({
  isOpen,
  onClose,
  onRun,
  period,
  records,
}: {
  isOpen: boolean;
  onClose: () => void;
  onRun: () => Promise<void>;
  period: string;
  records: PayrollRecord[];
}) {
  const [running, setRunning] = useState(false);

  const totalGross = records.reduce((sum, r) => sum + r.basic_salary + (r.allowances || 0), 0);
  const totalDeductions = records.reduce((sum, r) => sum + r.deductions, 0);
  const totalNet = records.reduce((sum, r) => sum + r.net_salary, 0);

  const handleRun = async () => {
    setRunning(true);
    try {
      await onRun();
      onClose();
    } finally {
      setRunning(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Run Payroll"
      size="lg"
      footer={
        <>
          <ModalButton variant="secondary" onClick={onClose}>
            Cancel
          </ModalButton>
          <ModalButton variant="primary" onClick={handleRun} disabled={running}>
            {running ? 'Processing...' : 'Initiate Payroll'}
          </ModalButton>
        </>
      }
    >
      <div className="space-y-4">
        <div className="p-4 bg-indigo-900/30 border border-indigo-700/50 rounded-xl">
          <p className="text-sm text-indigo-300">
            You are about to initiate payroll processing for <span className="font-medium text-content">{period}</span>
          </p>
        </div>

        {/* Preview Summary */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-hover rounded-xl p-4">
            <p className="text-sm text-content-secondary">Employees</p>
            <p className="text-2xl font-bold text-content">{records.length}</p>
          </div>
          <div className="bg-hover rounded-xl p-4">
            <p className="text-sm text-content-secondary">Total Gross</p>
            <p className="text-2xl font-bold text-content">SAR {totalGross.toLocaleString()}</p>
          </div>
          <div className="bg-hover rounded-xl p-4">
            <p className="text-sm text-content-secondary">Total Deductions</p>
            <p className="text-2xl font-bold text-red-400">-SAR {totalDeductions.toLocaleString()}</p>
          </div>
          <div className="bg-hover rounded-xl p-4">
            <p className="text-sm text-content-secondary">Total Net Payable</p>
            <p className="text-2xl font-bold text-emerald-400">SAR {totalNet.toLocaleString()}</p>
          </div>
        </div>

        <div className="p-3 bg-amber-900/30 border border-amber-700/50 rounded-xl">
          <p className="text-sm text-amber-300">
            This will set all records to "pending" status for approval.
          </p>
        </div>
      </div>
    </Modal>
  );
}

// Process Payroll Modal Component
function ProcessPayrollModal({
  isOpen,
  onClose,
  onProcess,
  record,
}: {
  isOpen: boolean;
  onClose: () => void;
  onProcess: (input: ProcessPayrollInput) => Promise<void>;
  record: PayrollRecord | null;
}) {
  const [bankReference, setBankReference] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleProcess = async () => {
    if (!bankReference.trim() || !record) return;
    setProcessing(true);
    try {
      await onProcess({
        id: record.id,
        bank_reference: bankReference,
        processed_by: 'Finance Manager',
      });
      setBankReference('');
      onClose();
    } finally {
      setProcessing(false);
    }
  };

  if (!record) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Process Payment - ${record.employee_name}`}
      size="md"
      footer={
        <>
          <ModalButton variant="secondary" onClick={onClose}>
            Cancel
          </ModalButton>
          <ModalButton variant="primary" onClick={handleProcess} disabled={processing || !bankReference.trim()}>
            {processing ? 'Processing...' : 'Mark as Paid'}
          </ModalButton>
        </>
      }
    >
      <div className="space-y-4">
        <div className="p-4 bg-hover rounded-xl">
          <div className="flex justify-between items-center">
            <span className="text-content-secondary">Net Salary</span>
            <span className="text-2xl font-bold text-content">SAR {record.net_salary.toLocaleString()}</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-content-tertiary mb-1">
            Bank Reference Number <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={bankReference}
            onChange={(e) => setBankReference(e.target.value)}
            placeholder="e.g., TRX-2024-001234"
            className="w-full bg-input border border-border-subtle rounded-xl px-4 py-2.5 text-content placeholder-content-secondary focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>
    </Modal>
  );
}

// Salary Adjustment Modal Component
function AdjustSalaryModal({
  isOpen,
  onClose,
  onAdjust,
  record,
}: {
  isOpen: boolean;
  onClose: () => void;
  onAdjust: (input: AdjustSalaryInput) => Promise<void>;
  record: PayrollRecord | null;
}) {
  const [adjustmentType, setAdjustmentType] = useState<AdjustSalaryInput['adjustment_type']>('bonus');
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!record || !amount || !reason.trim()) return;
    setSubmitting(true);
    try {
      await onAdjust({
        id: record.id,
        adjustment_type: adjustmentType,
        amount: parseFloat(amount),
        reason,
      });
      setAmount('');
      setReason('');
      setAdjustmentType('bonus');
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  if (!record) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Adjust Salary - ${record.employee_name}`}
      size="md"
      footer={
        <>
          <ModalButton variant="secondary" onClick={onClose}>
            Cancel
          </ModalButton>
          <ModalButton variant="primary" onClick={handleSubmit} disabled={submitting || !amount || !reason.trim()}>
            {submitting ? 'Saving...' : 'Apply Adjustment'}
          </ModalButton>
        </>
      }
    >
      <div className="space-y-4">
        <div className="p-4 bg-hover rounded-xl">
          <div className="flex justify-between items-center">
            <span className="text-content-secondary">Current Net Salary</span>
            <span className="text-xl font-bold text-content">SAR {record.net_salary.toLocaleString()}</span>
          </div>
        </div>

        {/* Adjustment Type */}
        <div>
          <label className="block text-sm font-medium text-content-tertiary mb-2">
            Adjustment Type <span className="text-red-400">*</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { value: 'bonus', label: 'Bonus', color: 'emerald' },
              { value: 'overtime', label: 'Overtime', color: 'blue' },
              { value: 'deduction', label: 'Deduction', color: 'red' },
            ].map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => setAdjustmentType(type.value as AdjustSalaryInput['adjustment_type'])}
                className={`p-3 rounded-xl text-sm font-medium border transition-colors ${
                  adjustmentType === type.value
                    ? `bg-${type.color}-600/50 border-${type.color}-500 text-content`
                    : 'bg-input border-border-subtle text-content-tertiary hover:bg-hover'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm font-medium text-content-tertiary mb-1">
            Amount (SAR) <span className="text-red-400">*</span>
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            min="0"
            step="100"
            className="w-full bg-input border border-border-subtle rounded-xl px-4 py-2.5 text-content placeholder-content-secondary focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Reason */}
        <div>
          <label className="block text-sm font-medium text-content-tertiary mb-1">
            Reason <span className="text-red-400">*</span>
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={2}
            placeholder="Reason for adjustment..."
            className="w-full bg-input border border-border-subtle rounded-xl px-4 py-2.5 text-content placeholder-content-secondary focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          />
        </div>

        {/* Preview */}
        {amount && (
          <div className={`p-3 rounded-xl border ${
            adjustmentType === 'deduction'
              ? 'bg-red-900/30 border-red-700/50'
              : 'bg-emerald-900/30 border-emerald-700/50'
          }`}>
            <p className="text-sm">
              <span className="text-content-tertiary">New Net Salary: </span>
              <span className={`font-bold ${adjustmentType === 'deduction' ? 'text-red-300' : 'text-emerald-300'}`}>
                SAR {(record.net_salary + (adjustmentType === 'deduction' ? -parseFloat(amount || '0') : parseFloat(amount || '0'))).toLocaleString()}
              </span>
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
}

// Payroll Detail Modal
function PayrollDetailModal({
  isOpen,
  onClose,
  record,
}: {
  isOpen: boolean;
  onClose: () => void;
  record: PayrollRecord | null;
}) {
  if (!record) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Payslip - ${record.employee_name}`}
      size="lg"
      footer={
        <ModalButton variant="secondary" onClick={onClose}>
          Close
        </ModalButton>
      }
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-4 pb-4 border-b border-border">
          <div className="w-14 h-14 bg-indigo-600/30 rounded-full flex items-center justify-center text-indigo-300 font-semibold text-xl">
            {record.employee_name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-content">{record.employee_name}</h3>
            <p className="text-sm text-content-secondary">{record.employee_id} | Period: {record.period}</p>
          </div>
          <div className="ml-auto">
            <StatusBadge status={record.status} variant="outline" />
          </div>
        </div>

        {/* Earnings */}
        <div>
          <h4 className="text-sm font-medium text-content-secondary mb-2">Earnings</h4>
          <div className="bg-hover rounded-xl divide-y divide-border-subtle">
            <div className="flex justify-between p-3">
              <span className="text-content-tertiary">Basic Salary</span>
              <span className="text-content font-medium">SAR {record.basic_salary.toLocaleString()}</span>
            </div>
            <div className="flex justify-between p-3">
              <span className="text-content-tertiary">Housing Allowance</span>
              <span className="text-content font-medium">SAR {(record.housing_allowance || 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between p-3">
              <span className="text-content-tertiary">Transport Allowance</span>
              <span className="text-content font-medium">SAR {(record.transport_allowance || 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between p-3">
              <span className="text-content-tertiary">Other Allowances</span>
              <span className="text-content font-medium">SAR {(record.other_allowances || 0).toLocaleString()}</span>
            </div>
            {record.overtime_pay && record.overtime_pay > 0 && (
              <div className="flex justify-between p-3">
                <span className="text-content-tertiary">Overtime Pay</span>
                <span className="text-emerald-400 font-medium">SAR {record.overtime_pay.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between p-3 bg-hover">
              <span className="text-content font-medium">Total Earnings</span>
              <span className="text-content font-bold">SAR {(record.basic_salary + (record.allowances || 0) + (record.overtime_pay || 0)).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Deductions */}
        <div>
          <h4 className="text-sm font-medium text-content-secondary mb-2">Deductions</h4>
          <div className="bg-hover rounded-xl divide-y divide-border-subtle">
            <div className="flex justify-between p-3">
              <span className="text-content-tertiary">GOSI (Employee)</span>
              <span className="text-red-400 font-medium">-SAR {(record.gosi_employee || 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between p-3">
              <span className="text-content-tertiary">Other Deductions</span>
              <span className="text-red-400 font-medium">-SAR {record.deductions.toLocaleString()}</span>
            </div>
            <div className="flex justify-between p-3 bg-hover">
              <span className="text-content font-medium">Total Deductions</span>
              <span className="text-red-400 font-bold">-SAR {(record.deductions + (record.gosi_employee || 0)).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Net Pay */}
        <div className="bg-indigo-900/30 border border-indigo-700/50 rounded-xl p-4">
          <div className="flex justify-between items-center">
            <span className="text-lg text-indigo-300">Net Salary</span>
            <span className="text-2xl font-bold text-white">SAR {record.net_salary.toLocaleString()}</span>
          </div>
        </div>

        {/* Payment Info */}
        {record.payment_date && (
          <div className="p-3 bg-emerald-900/30 border border-emerald-700/50 rounded-xl text-sm text-emerald-300">
            Paid on {record.payment_date}
          </div>
        )}
      </div>
    </Modal>
  );
}

export function Payroll() {
  const [records, setRecords] = useState<PayrollRecord[]>([]);
  const [summary, setSummary] = useState<PayrollSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('2024-01');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Modal states
  const [showRunModal, setShowRunModal] = useState(false);
  const [processModal, setProcessModal] = useState<{ isOpen: boolean; record: PayrollRecord | null }>({
    isOpen: false,
    record: null,
  });
  const [adjustModal, setAdjustModal] = useState<{ isOpen: boolean; record: PayrollRecord | null }>({
    isOpen: false,
    record: null,
  });
  const [detailModal, setDetailModal] = useState<{ isOpen: boolean; record: PayrollRecord | null }>({
    isOpen: false,
    record: null,
  });
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const [payrollData, summaryData] = await Promise.all([
        hcmsApi.payroll.getAll(),
        hcmsApi.payroll.getSummary(selectedPeriod),
      ]);
      setRecords(payrollData);
      setSummary(summaryData);
    } finally {
      setLoading(false);
    }
  }, [selectedPeriod]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredRecords = records.filter((record) =>
    record.employee_name.toLowerCase().includes(search.toLowerCase()) ||
    record.employee_id.toLowerCase().includes(search.toLowerCase())
  );

  const handleRunPayroll = async () => {
    try {
      await hcmsApi.payroll.initiate({ period: selectedPeriod });
      setRecords(records.map(r => r.period === selectedPeriod ? { ...r, status: 'draft' as const } : r));
      setToast({ message: `Payroll initiated for ${selectedPeriod}`, type: 'success' });
    } catch (error) {
      setToast({ message: error instanceof Error ? error.message : 'Failed to initiate payroll', type: 'error' });
    }
  };

  const handleApprove = async (record: PayrollRecord) => {
    setProcessingId(record.id);
    try {
      await hcmsApi.payroll.approve({ id: record.id, approved_by: 'Finance Manager' });
      setRecords(records.map(r => r.id === record.id ? { ...r, status: 'processing' } : r));
      setToast({ message: `Payroll for ${record.employee_name} approved`, type: 'success' });
    } catch (error) {
      setToast({ message: error instanceof Error ? error.message : 'Failed to approve', type: 'error' });
    } finally {
      setProcessingId(null);
    }
  };

  const handleProcess = async (input: ProcessPayrollInput) => {
    try {
      await hcmsApi.payroll.process(input);
      setRecords(records.map(r => r.id === input.id ? { ...r, status: 'paid', payment_date: new Date().toISOString().split('T')[0] } : r));
      setToast({ message: 'Payment processed successfully', type: 'success' });
    } catch (error) {
      setToast({ message: error instanceof Error ? error.message : 'Failed to process payment', type: 'error' });
    }
  };

  const handleAdjust = async (input: AdjustSalaryInput) => {
    try {
      const updated = await hcmsApi.payroll.adjustSalary(input);
      setRecords(records.map(r => r.id === input.id ? updated : r));
      setToast({ message: 'Salary adjustment applied', type: 'success' });
    } catch (error) {
      setToast({ message: error instanceof Error ? error.message : 'Failed to adjust salary', type: 'error' });
    }
  };

  const totalPayroll = filteredRecords.reduce((sum, r) => sum + r.net_salary, 0);
  const totalGOSI = filteredRecords.reduce((sum, r) => sum + (r.gosi || 0), 0);

  return (
    <div className="animate-fade-in">
      <Header title="Payroll" subtitle="Salary processing and compensation management" />
      <div className="p-6">
        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mb-6">
          <button
            onClick={() => setShowRunModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 transition-colors"
          >
            <Play size={18} />
            Run Payroll
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 stagger-children">
          <div className="bg-card rounded-xl p-5 border border-border card-hover">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-600/20 rounded-lg">
                <DollarSign size={20} className="text-emerald-400" />
              </div>
              <div>
                <p className="text-sm text-content-secondary">Total Net Payable</p>
                <p className="text-2xl font-bold text-content">SAR {totalPayroll.toLocaleString()}</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-xl p-5 border border-border card-hover">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-600/20 rounded-lg">
                <TrendingUp size={20} className="text-amber-400" />
              </div>
              <div>
                <p className="text-sm text-content-secondary">GOSI Total</p>
                <p className="text-2xl font-bold text-content">SAR {totalGOSI.toLocaleString()}</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-xl p-5 border border-border card-hover">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-600/20 rounded-lg">
                <Users size={20} className="text-indigo-400" />
              </div>
              <div>
                <p className="text-sm text-content-secondary">Employees</p>
                <p className="text-2xl font-bold text-content">{filteredRecords.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-xl p-5 border border-border card-hover">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600/20 rounded-lg">
                <Clock size={20} className="text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-content-secondary">Pending</p>
                <p className="text-2xl font-bold text-content">{summary?.pending || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search employee..."
            />
          </div>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="bg-input border border-border-subtle rounded-xl px-4 py-3 text-content focus:border-indigo-500"
          >
            <option value="2024-01">January 2024</option>
            <option value="2023-12">December 2023</option>
            <option value="2023-11">November 2023</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 bg-hover text-content rounded-xl hover:bg-hover transition-colors">
            <Download size={20} />
            Export
          </button>
        </div>

        {/* Payroll Table */}
        {loading ? (
          <TableSkeleton rows={7} columns={11} />
        ) : (
          <div className="bg-card rounded-xl border border-border overflow-x-auto">
            <table className="w-full min-w-[1100px]">
              <thead className="bg-input">
                <tr>
                  <th className="text-left p-4 text-sm font-medium text-content-secondary">Employee</th>
                  <th className="text-right p-4 text-sm font-medium text-content-secondary">Basic</th>
                  <th className="text-right p-4 text-sm font-medium text-content-secondary">Allowances</th>
                  <th className="text-right p-4 text-sm font-medium text-content-secondary">OT</th>
                  <th className="text-right p-4 text-sm font-medium text-content-secondary">Deductions</th>
                  <th className="text-right p-4 text-sm font-medium text-content-secondary">GOSI</th>
                  <th className="text-right p-4 text-sm font-medium text-content-secondary">Net Salary</th>
                  <th className="text-center p-4 text-sm font-medium text-content-secondary">Status</th>
                  <th className="text-center p-4 text-sm font-medium text-content-secondary">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((record, index) => (
                  <tr
                    key={record.id}
                    className="border-t border-border hover:bg-card animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <td className="p-4">
                      <div>
                        <p className="text-content font-medium">{record.employee_name}</p>
                        <p className="text-sm text-content-secondary">{record.employee_id}</p>
                      </div>
                    </td>
                    <td className="p-4 text-right text-content-tertiary">{record.basic_salary.toLocaleString()}</td>
                    <td className="p-4 text-right text-content-tertiary">{(record.allowances || 0).toLocaleString()}</td>
                    <td className="p-4 text-right text-emerald-400">{(record.overtime_pay || 0).toLocaleString()}</td>
                    <td className="p-4 text-right text-red-400">-{record.deductions.toLocaleString()}</td>
                    <td className="p-4 text-right text-amber-400">-{(record.gosi || 0).toLocaleString()}</td>
                    <td className="p-4 text-right text-content font-bold">{record.net_salary.toLocaleString()}</td>
                    <td className="p-4 text-center">
                      <StatusBadge status={record.status} variant="outline" />
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => setDetailModal({ isOpen: true, record })}
                          className="p-2 bg-hover text-content-tertiary rounded-lg hover:bg-hover transition-colors"
                          title="View details"
                        >
                          <Eye size={16} />
                        </button>
                        {(record.status === 'draft' || record.status === 'pending') && (
                          <>
                            <button
                              onClick={() => handleApprove(record)}
                              disabled={processingId === record.id}
                              className="p-2 bg-emerald-900/50 text-emerald-400 rounded-lg hover:bg-emerald-800/50 transition-colors disabled:opacity-50"
                              title="Approve"
                            >
                              <CheckCircle size={16} />
                            </button>
                            <button
                              onClick={() => setAdjustModal({ isOpen: true, record })}
                              className="p-2 bg-indigo-900/50 text-indigo-400 rounded-lg hover:bg-indigo-800/50 transition-colors"
                              title="Adjust salary"
                            >
                              <Edit2 size={16} />
                            </button>
                          </>
                        )}
                        {record.status === 'processing' && (
                          <button
                            onClick={() => setProcessModal({ isOpen: true, record })}
                            className="p-2 bg-blue-900/50 text-blue-400 rounded-lg hover:bg-blue-800/50 transition-colors"
                            title="Process payment"
                          >
                            <CreditCard size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-input border-t border-border-subtle">
                <tr>
                  <td className="p-4 text-content font-bold">Total</td>
                  <td className="p-4 text-right text-content font-bold">{filteredRecords.reduce((s, r) => s + r.basic_salary, 0).toLocaleString()}</td>
                  <td className="p-4 text-right text-content font-bold">{filteredRecords.reduce((s, r) => s + (r.allowances || 0), 0).toLocaleString()}</td>
                  <td className="p-4 text-right text-emerald-400 font-bold">{filteredRecords.reduce((s, r) => s + (r.overtime_pay || 0), 0).toLocaleString()}</td>
                  <td className="p-4 text-right text-red-400 font-bold">-{filteredRecords.reduce((s, r) => s + r.deductions, 0).toLocaleString()}</td>
                  <td className="p-4 text-right text-amber-400 font-bold">-{filteredRecords.reduce((s, r) => s + (r.gosi || 0), 0).toLocaleString()}</td>
                  <td className="p-4 text-right text-content font-bold">{totalPayroll.toLocaleString()}</td>
                  <td colSpan={2}></td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>

      {/* Run Payroll Modal */}
      <RunPayrollModal
        isOpen={showRunModal}
        onClose={() => setShowRunModal(false)}
        onRun={handleRunPayroll}
        period={selectedPeriod}
        records={filteredRecords}
      />

      {/* Process Payroll Modal */}
      <ProcessPayrollModal
        isOpen={processModal.isOpen}
        onClose={() => setProcessModal({ isOpen: false, record: null })}
        onProcess={handleProcess}
        record={processModal.record}
      />

      {/* Adjust Salary Modal */}
      <AdjustSalaryModal
        isOpen={adjustModal.isOpen}
        onClose={() => setAdjustModal({ isOpen: false, record: null })}
        onAdjust={handleAdjust}
        record={adjustModal.record}
      />

      {/* Payroll Detail Modal */}
      <PayrollDetailModal
        isOpen={detailModal.isOpen}
        onClose={() => setDetailModal({ isOpen: false, record: null })}
        record={detailModal.record}
      />

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
export default Payroll;
