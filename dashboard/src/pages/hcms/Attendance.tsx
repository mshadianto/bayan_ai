import { useState, useEffect, useCallback } from 'react';
import { Header } from '../../components/Layout';
import { StatusBadge, TableSkeleton } from '../../components/common';
import { Modal, ModalButton } from '../../components/common/Modal';
import type { Attendance as AttendanceType, Employee } from '../../types';
import { format } from 'date-fns';
import {
  Calendar,
  Clock,
  MapPin,
  UserCheck,
  UserX,
  Clock3,
  Palmtree,
  Plus,
  Edit2,
  X,
  CheckCircle,
  XCircle
} from 'lucide-react';
import {
  hcmsApi,
  type ManualCheckInput,
  type UpdateAttendanceInput
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

// Manual Check-in Form Component
function ManualCheckForm({
  isOpen,
  onClose,
  onSubmit,
  employees,
  selectedDate,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (input: ManualCheckInput) => Promise<void>;
  employees: Employee[];
  selectedDate: string;
}) {
  const [formData, setFormData] = useState<ManualCheckInput>({
    employee_id: '',
    employee_name: '',
    date: selectedDate,
    check_in: '',
    check_out: '',
    status: 'present',
    notes: '',
    location: 'Office',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setFormData(prev => ({ ...prev, date: selectedDate }));
  }, [selectedDate]);

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
    if (!formData.date) {
      setError('Please select a date');
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit(formData);
      setFormData({
        employee_id: '',
        employee_name: '',
        date: selectedDate,
        check_in: '',
        check_out: '',
        status: 'present',
        notes: '',
        location: 'Office',
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to record attendance');
    } finally {
      setSubmitting(false);
    }
  };

  const STATUS_OPTIONS = [
    { value: 'present', label: 'Present', color: 'text-emerald-400' },
    { value: 'late', label: 'Late', color: 'text-amber-400' },
    { value: 'absent', label: 'Absent', color: 'text-red-400' },
    { value: 'leave', label: 'On Leave', color: 'text-blue-400' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Manual Check-in/out"
      size="lg"
      footer={
        <>
          <ModalButton variant="secondary" onClick={onClose}>
            Cancel
          </ModalButton>
          <ModalButton variant="primary" onClick={handleSubmit} disabled={submitting}>
            {submitting ? 'Recording...' : 'Record Attendance'}
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

        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-content-tertiary mb-1">
            Date <span className="text-red-400">*</span>
          </label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full bg-input border border-border-subtle rounded-xl px-4 py-2.5 text-content focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Time Range */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-content-tertiary mb-1">
              Check In
            </label>
            <input
              type="time"
              value={formData.check_in}
              onChange={(e) => setFormData({ ...formData, check_in: e.target.value })}
              className="w-full bg-input border border-border-subtle rounded-xl px-4 py-2.5 text-content focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-content-tertiary mb-1">
              Check Out
            </label>
            <input
              type="time"
              value={formData.check_out}
              onChange={(e) => setFormData({ ...formData, check_out: e.target.value })}
              className="w-full bg-input border border-border-subtle rounded-xl px-4 py-2.5 text-content focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-content-tertiary mb-2">
            Status <span className="text-red-400">*</span>
          </label>
          <div className="grid grid-cols-4 gap-2">
            {STATUS_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setFormData({ ...formData, status: option.value as ManualCheckInput['status'] })}
                className={`p-3 rounded-xl text-sm font-medium border transition-colors ${
                  formData.status === option.value
                    ? 'bg-indigo-600/50 border-indigo-500 text-white'
                    : 'bg-input border-border-subtle text-content-tertiary hover:bg-hover'
                }`}
              >
                <span className={option.color}>{option.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-content-tertiary mb-1">
            Location
          </label>
          <select
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className="w-full bg-input border border-border-subtle rounded-xl px-4 py-2.5 text-content focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="Office">Office</option>
            <option value="Remote">Remote / WFH</option>
            <option value="Client Site">Client Site</option>
            <option value="Field Work">Field Work</option>
          </select>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-content-tertiary mb-1">
            Notes
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            rows={2}
            placeholder="Optional notes..."
            className="w-full bg-input border border-border-subtle rounded-xl px-4 py-2.5 text-content placeholder-content-secondary focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          />
        </div>
      </div>
    </Modal>
  );
}

// Edit Attendance Modal Component
function EditAttendanceModal({
  isOpen,
  onClose,
  onUpdate,
  record,
}: {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (input: UpdateAttendanceInput) => Promise<void>;
  record: AttendanceType | null;
}) {
  const [formData, setFormData] = useState<UpdateAttendanceInput>({
    id: '',
    check_in: '',
    check_out: '',
    status: 'present',
    notes: '',
    reason: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (record) {
      setFormData({
        id: record.id,
        check_in: record.check_in || '',
        check_out: record.check_out || '',
        status: record.status,
        notes: record.notes || '',
        reason: '',
      });
    }
  }, [record]);

  const handleSubmit = async () => {
    if (!formData.reason?.trim()) {
      return;
    }
    setSubmitting(true);
    try {
      await onUpdate(formData);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  const STATUS_OPTIONS = [
    { value: 'present', label: 'Present' },
    { value: 'late', label: 'Late' },
    { value: 'absent', label: 'Absent' },
    { value: 'leave', label: 'On Leave' },
  ];

  if (!record) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Edit Attendance - ${record.employee_name}`}
      size="md"
      footer={
        <>
          <ModalButton variant="secondary" onClick={onClose}>
            Cancel
          </ModalButton>
          <ModalButton variant="primary" onClick={handleSubmit} disabled={submitting || !formData.reason?.trim()}>
            {submitting ? 'Updating...' : 'Update Attendance'}
          </ModalButton>
        </>
      }
    >
      <div className="space-y-4">
        <div className="p-3 bg-indigo-900/30 border border-indigo-700/50 rounded-xl">
          <p className="text-sm text-indigo-300">
            Editing record for <span className="font-medium">{format(new Date(record.date), 'MMMM d, yyyy')}</span>
          </p>
        </div>

        {/* Time Range */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-content-tertiary mb-1">
              Check In
            </label>
            <input
              type="time"
              value={formData.check_in}
              onChange={(e) => setFormData({ ...formData, check_in: e.target.value })}
              className="w-full bg-input border border-border-subtle rounded-xl px-4 py-2.5 text-content focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-content-tertiary mb-1">
              Check Out
            </label>
            <input
              type="time"
              value={formData.check_out}
              onChange={(e) => setFormData({ ...formData, check_out: e.target.value })}
              className="w-full bg-input border border-border-subtle rounded-xl px-4 py-2.5 text-content focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-content-tertiary mb-1">
            Status
          </label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as UpdateAttendanceInput['status'] })}
            className="w-full bg-input border border-border-subtle rounded-xl px-4 py-2.5 text-content focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-content-tertiary mb-1">
            Notes
          </label>
          <input
            type="text"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full bg-input border border-border-subtle rounded-xl px-4 py-2.5 text-content focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Reason for Change */}
        <div>
          <label className="block text-sm font-medium text-content-tertiary mb-1">
            Reason for Change <span className="text-red-400">*</span>
          </label>
          <textarea
            value={formData.reason}
            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
            rows={2}
            placeholder="Please provide a reason for this change..."
            className="w-full bg-input border border-border-subtle rounded-xl px-4 py-2.5 text-content placeholder-content-secondary focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          />
        </div>
      </div>
    </Modal>
  );
}

export function Attendance() {
  const [records, setRecords] = useState<AttendanceType[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Modal states
  const [showManualForm, setShowManualForm] = useState(false);
  const [editModal, setEditModal] = useState<{ isOpen: boolean; record: AttendanceType | null }>({
    isOpen: false,
    record: null,
  });

  const fetchData = useCallback(async () => {
    try {
      const [attendanceData, employeesData] = await Promise.all([
        hcmsApi.attendance.getAll(),
        hcmsApi.employees.getAll(),
      ]);
      setRecords(attendanceData);
      setEmployees(employeesData);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const weekSummary = [
    { day: 'Sun', present: 42, late: 3, absent: 2, leave: 1 },
    { day: 'Mon', present: 43, late: 2, absent: 1, leave: 2 },
    { day: 'Tue', present: 44, late: 1, absent: 2, leave: 1 },
    { day: 'Wed', present: 41, late: 4, absent: 1, leave: 2 },
    { day: 'Thu', present: 40, late: 2, absent: 3, leave: 3 },
  ];

  const todayStats = {
    present: records.filter(r => r.status === 'present').length,
    late: records.filter(r => r.status === 'late').length,
    absent: records.filter(r => r.status === 'absent').length,
    leave: records.filter(r => r.status === 'leave').length,
  };

  const handleManualCheck = async (input: ManualCheckInput) => {
    const newRecord = await hcmsApi.attendance.manualCheck(input);
    setRecords([...records, newRecord]);
    setToast({ message: `Attendance recorded for ${input.employee_name}`, type: 'success' });
  };

  const handleUpdateAttendance = async (input: UpdateAttendanceInput) => {
    try {
      const updated = await hcmsApi.attendance.update(input);
      setRecords(records.map(r => r.id === input.id ? updated : r));
      setToast({ message: 'Attendance updated successfully', type: 'success' });
    } catch (error) {
      setToast({ message: error instanceof Error ? error.message : 'Failed to update attendance', type: 'error' });
    }
  };

  const handleQuickCheckIn = async (employee: Employee) => {
    const now = new Date();
    const checkInTime = format(now, 'HH:mm');
    const isLate = now.getHours() > 8 || (now.getHours() === 8 && now.getMinutes() > 0);

    try {
      const input: ManualCheckInput = {
        employee_id: employee.employee_id,
        employee_name: `${employee.first_name} ${employee.last_name}`,
        date: selectedDate,
        check_in: checkInTime,
        status: isLate ? 'late' : 'present',
        location: 'Office',
      };
      await handleManualCheck(input);
    } catch (error) {
      setToast({ message: error instanceof Error ? error.message : 'Failed to check in', type: 'error' });
    }
  };

  const handleQuickCheckOut = async (record: AttendanceType) => {
    const now = new Date();
    const checkOutTime = format(now, 'HH:mm');

    try {
      await handleUpdateAttendance({
        id: record.id,
        check_out: checkOutTime,
      });
    } catch (error) {
      setToast({ message: error instanceof Error ? error.message : 'Failed to check out', type: 'error' });
    }
  };

  // Filter records by selected date
  const filteredRecords = records.filter(r => r.date === selectedDate || selectedDate === format(new Date(), 'yyyy-MM-dd'));

  return (
    <div className="animate-fade-in">
      <Header title="Attendance" subtitle="Daily attendance tracking and overtime" />
      <div className="p-6">
        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mb-6">
          <button
            onClick={() => setShowManualForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 transition-colors"
          >
            <Plus size={18} />
            Manual Entry
          </button>
        </div>

        {/* Today's Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 stagger-children">
          <div className="bg-emerald-900/30 rounded-xl p-4 border border-emerald-600/50 card-hover">
            <div className="flex items-center gap-2 mb-1">
              <UserCheck size={18} className="text-emerald-400" />
              <p className="text-emerald-300 text-sm">Present</p>
            </div>
            <p className="text-3xl font-bold text-white">{todayStats.present}</p>
          </div>
          <div className="bg-amber-900/30 rounded-xl p-4 border border-amber-600/50 card-hover">
            <div className="flex items-center gap-2 mb-1">
              <Clock3 size={18} className="text-amber-400" />
              <p className="text-amber-300 text-sm">Late</p>
            </div>
            <p className="text-3xl font-bold text-white">{todayStats.late}</p>
          </div>
          <div className="bg-red-900/30 rounded-xl p-4 border border-red-600/50 card-hover">
            <div className="flex items-center gap-2 mb-1">
              <UserX size={18} className="text-red-400" />
              <p className="text-red-300 text-sm">Absent</p>
            </div>
            <p className="text-3xl font-bold text-white">{todayStats.absent}</p>
          </div>
          <div className="bg-blue-900/30 rounded-xl p-4 border border-blue-600/50 card-hover">
            <div className="flex items-center gap-2 mb-1">
              <Palmtree size={18} className="text-blue-400" />
              <p className="text-blue-300 text-sm">On Leave</p>
            </div>
            <p className="text-3xl font-bold text-white">{todayStats.leave}</p>
          </div>
        </div>

        {/* Week Summary */}
        <div className="bg-card rounded-xl border border-border p-6 mb-6">
          <h3 className="text-lg font-semibold text-content mb-4 flex items-center gap-2">
            <span>This Week Summary</span>
          </h3>
          <div className="grid grid-cols-5 gap-4">
            {weekSummary.map((day) => (
              <div key={day.day} className="text-center">
                <p className="text-content-secondary text-sm mb-2">{day.day}</p>
                <div className="space-y-1">
                  <div className="bg-emerald-900/30 rounded px-2 py-1">
                    <span className="text-emerald-300 text-xs">{day.present} present</span>
                  </div>
                  <div className="bg-amber-900/30 rounded px-2 py-1">
                    <span className="text-amber-300 text-xs">{day.late} late</span>
                  </div>
                  <div className="bg-red-900/30 rounded px-2 py-1">
                    <span className="text-red-300 text-xs">{day.absent} absent</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Date Picker & Quick Actions */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-2 bg-input rounded-xl px-4 py-2 border border-border">
            <Calendar size={20} className="text-content-secondary" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent text-content border-none focus:outline-none"
            />
          </div>

          {/* Quick Check-in Dropdown */}
          <div className="relative group">
            <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600/20 text-emerald-400 rounded-xl hover:bg-emerald-600/30 border border-emerald-600/50 transition-colors">
              <UserCheck size={18} />
              Quick Check-in
            </button>
            <div className="hidden group-hover:block absolute top-full left-0 mt-2 w-64 bg-input rounded-xl border border-border shadow-xl z-20 max-h-64 overflow-y-auto">
              {employees.filter(e => e.employment_status === 'active').map((emp) => {
                const hasRecord = records.some(r => r.employee_id === emp.employee_id && r.date === selectedDate);
                return (
                  <button
                    key={emp.id}
                    onClick={() => !hasRecord && handleQuickCheckIn(emp)}
                    disabled={hasRecord}
                    className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                      hasRecord
                        ? 'text-content-muted cursor-not-allowed'
                        : 'text-content hover:bg-hover'
                    }`}
                  >
                    {emp.first_name} {emp.last_name}
                    {hasRecord && <span className="text-xs text-content-secondary ml-2">(recorded)</span>}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Attendance Table */}
        {loading ? (
          <TableSkeleton rows={7} columns={7} />
        ) : (
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <table className="w-full">
              <thead className="bg-input">
                <tr>
                  <th className="text-left p-4 text-sm font-medium text-content-secondary">Employee</th>
                  <th className="text-left p-4 text-sm font-medium text-content-secondary">Check In</th>
                  <th className="text-left p-4 text-sm font-medium text-content-secondary">Check Out</th>
                  <th className="text-left p-4 text-sm font-medium text-content-secondary">Work Hours</th>
                  <th className="text-left p-4 text-sm font-medium text-content-secondary">Status</th>
                  <th className="text-left p-4 text-sm font-medium text-content-secondary">Location</th>
                  <th className="text-left p-4 text-sm font-medium text-content-secondary">Actions</th>
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
                    <td className="p-4">
                      {record.check_in ? (
                        <div className="flex items-center gap-2 text-content-tertiary">
                          <Clock size={16} className="text-content-secondary" />
                          {record.check_in}
                          {record.late_minutes && record.late_minutes > 0 && (
                            <span className="text-xs text-amber-400">+{record.late_minutes}min</span>
                          )}
                        </div>
                      ) : (
                        <span className="text-content-muted">-</span>
                      )}
                    </td>
                    <td className="p-4">
                      {record.check_out ? (
                        <div className="flex items-center gap-2 text-content-tertiary">
                          <Clock size={16} className="text-content-secondary" />
                          {record.check_out}
                        </div>
                      ) : record.check_in ? (
                        <button
                          onClick={() => handleQuickCheckOut(record)}
                          className="text-xs px-2 py-1 bg-indigo-600/30 text-indigo-400 rounded-lg hover:bg-indigo-600/50 transition-colors"
                        >
                          Check Out
                        </button>
                      ) : (
                        <span className="text-content-muted">-</span>
                      )}
                    </td>
                    <td className="p-4">
                      {record.work_hours ? (
                        <span className="text-content-tertiary">{record.work_hours.toFixed(2)} hrs</span>
                      ) : (
                        <span className="text-content-muted">-</span>
                      )}
                    </td>
                    <td className="p-4">
                      <StatusBadge status={record.status} variant="outline" />
                    </td>
                    <td className="p-4">
                      {record.location ? (
                        <div className="flex items-center gap-2 text-content-tertiary text-sm">
                          <MapPin size={14} className="text-content-secondary" />
                          {record.location}
                        </div>
                      ) : (
                        <span className="text-content-muted">-</span>
                      )}
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => setEditModal({ isOpen: true, record })}
                        className="p-2 text-content-secondary hover:text-content hover:bg-hover rounded-lg transition-colors"
                        title="Edit attendance"
                      >
                        <Edit2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredRecords.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-content-secondary">
                      <Calendar size={48} className="mx-auto mb-3 opacity-50" />
                      <p>No attendance records found</p>
                      <button
                        onClick={() => setShowManualForm(true)}
                        className="mt-3 text-indigo-400 hover:text-indigo-300 text-sm"
                      >
                        Add manual entry
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Manual Check Form Modal */}
      <ManualCheckForm
        isOpen={showManualForm}
        onClose={() => setShowManualForm(false)}
        onSubmit={handleManualCheck}
        employees={employees}
        selectedDate={selectedDate}
      />

      {/* Edit Attendance Modal */}
      <EditAttendanceModal
        isOpen={editModal.isOpen}
        onClose={() => setEditModal({ isOpen: false, record: null })}
        onUpdate={handleUpdateAttendance}
        record={editModal.record}
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
export default Attendance;
