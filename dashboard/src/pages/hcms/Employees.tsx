import { useState, useEffect, useMemo, useCallback } from 'react';
import { Header } from '../../components/Layout';
import {
  StatCard,
  StatusBadge,
  FilterButtons,
  SearchInput,
  Modal,
  ModalButton,
  CardGridSkeleton,
  EmptyState
} from '../../components/common';
import type { Employee } from '../../types';
import { Users, UserCheck, UserMinus, Clock, Mail, Phone, Building, Calendar, Eye, Edit, Plus, X, CheckCircle, XCircle, UserX } from 'lucide-react';
import { format } from 'date-fns';
import { hcmsApi, type CreateEmployeeInput, type UpdateEmployeeInput } from '../../services/supabaseHcms';

const FILTER_OPTIONS = ['all', 'active', 'probation', 'resigned'] as const;
type FilterType = typeof FILTER_OPTIONS[number];

const DEPARTMENTS = ['Executive', 'Finance', 'IT', 'HR', 'Operations', 'Legal', 'Marketing'];

// Toast Component
function Toast({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed bottom-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border ${
      type === 'success'
        ? 'bg-emerald-900/90 border-emerald-600 text-emerald-100'
        : 'bg-red-900/90 border-red-600 text-red-100'
    }`}>
      {type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
      <span className="font-medium">{message}</span>
      <button onClick={onClose} className="ml-2 hover:opacity-70">
        <X size={16} />
      </button>
    </div>
  );
}

// Add Employee Form
function AddEmployeeForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (data: CreateEmployeeInput) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    department: '',
    position: '',
    salary: '',
    hire_date: format(new Date(), 'yyyy-MM-dd'),
    iqamah_expiry: '',
    visa_expiry: '',
    passport_expiry: '',
  });

  const handleSubmit = () => {
    if (!formData.first_name || !formData.last_name || !formData.email || !formData.department || !formData.position) return;
    onSubmit({
      ...formData,
      salary: parseFloat(formData.salary) || 0,
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-content-tertiary mb-2">First Name *</label>
          <input
            type="text"
            value={formData.first_name}
            onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
            className="w-full px-3 py-2 bg-input border border-border-subtle rounded-lg text-content placeholder-content-secondary focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-content-tertiary mb-2">Last Name *</label>
          <input
            type="text"
            value={formData.last_name}
            onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
            className="w-full px-3 py-2 bg-input border border-border-subtle rounded-lg text-content placeholder-content-secondary focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-content-tertiary mb-2">Email *</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-3 py-2 bg-input border border-border-subtle rounded-lg text-content placeholder-content-secondary focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-content-tertiary mb-2">Phone</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+966..."
            className="w-full px-3 py-2 bg-input border border-border-subtle rounded-lg text-content placeholder-content-secondary focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-content-tertiary mb-2">Department *</label>
          <select
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            className="w-full px-3 py-2 bg-input border border-border-subtle rounded-lg text-content focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="">Select Department</option>
            {DEPARTMENTS.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-content-tertiary mb-2">Position *</label>
          <input
            type="text"
            value={formData.position}
            onChange={(e) => setFormData({ ...formData, position: e.target.value })}
            className="w-full px-3 py-2 bg-input border border-border-subtle rounded-lg text-content placeholder-content-secondary focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-content-tertiary mb-2">Monthly Salary (SAR)</label>
          <input
            type="number"
            value={formData.salary}
            onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
            className="w-full px-3 py-2 bg-input border border-border-subtle rounded-lg text-content placeholder-content-secondary focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-content-tertiary mb-2">Hire Date</label>
          <input
            type="date"
            value={formData.hire_date}
            onChange={(e) => setFormData({ ...formData, hire_date: e.target.value })}
            className="w-full px-3 py-2 bg-input border border-border-subtle rounded-lg text-content focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="border-t border-border pt-4">
        <h4 className="text-sm font-medium text-content-tertiary mb-3">Document Expiry Dates (Optional)</h4>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-xs text-content-secondary mb-1">Iqamah</label>
            <input
              type="date"
              value={formData.iqamah_expiry}
              onChange={(e) => setFormData({ ...formData, iqamah_expiry: e.target.value })}
              className="w-full px-3 py-2 bg-input border border-border-subtle rounded-lg text-content text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-xs text-content-secondary mb-1">Visa</label>
            <input
              type="date"
              value={formData.visa_expiry}
              onChange={(e) => setFormData({ ...formData, visa_expiry: e.target.value })}
              className="w-full px-3 py-2 bg-input border border-border-subtle rounded-lg text-content text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-xs text-content-secondary mb-1">Passport</label>
            <input
              type="date"
              value={formData.passport_expiry}
              onChange={(e) => setFormData({ ...formData, passport_expiry: e.target.value })}
              className="w-full px-3 py-2 bg-input border border-border-subtle rounded-lg text-content text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          onClick={onCancel}
          className="flex-1 px-4 py-2 bg-hover text-content-tertiary rounded-xl text-sm font-medium hover:bg-hover transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={!formData.first_name || !formData.last_name || !formData.email || !formData.department || !formData.position}
          className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add Employee
        </button>
      </div>
    </div>
  );
}

// Edit Employee Form
function EditEmployeeForm({
  employee,
  onSubmit,
  onCancel,
}: {
  employee: Employee;
  onSubmit: (data: UpdateEmployeeInput) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    first_name: employee.first_name,
    last_name: employee.last_name,
    email: employee.email,
    phone: employee.phone || '',
    department: employee.department,
    position: employee.position,
    salary: employee.salary?.toString() || '',
    iqamah_expiry: employee.iqamah_expiry || '',
    visa_expiry: employee.visa_expiry || '',
    passport_expiry: employee.passport_expiry || '',
  });

  const handleSubmit = () => {
    onSubmit({
      id: employee.id,
      ...formData,
      salary: parseFloat(formData.salary) || undefined,
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-content-tertiary mb-2">First Name</label>
          <input
            type="text"
            value={formData.first_name}
            onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
            className="w-full px-3 py-2 bg-input border border-border-subtle rounded-lg text-content focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-content-tertiary mb-2">Last Name</label>
          <input
            type="text"
            value={formData.last_name}
            onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
            className="w-full px-3 py-2 bg-input border border-border-subtle rounded-lg text-content focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-content-tertiary mb-2">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-3 py-2 bg-input border border-border-subtle rounded-lg text-content focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-content-tertiary mb-2">Phone</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full px-3 py-2 bg-input border border-border-subtle rounded-lg text-content focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-content-tertiary mb-2">Department</label>
          <select
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            className="w-full px-3 py-2 bg-input border border-border-subtle rounded-lg text-content focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            {DEPARTMENTS.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-content-tertiary mb-2">Position</label>
          <input
            type="text"
            value={formData.position}
            onChange={(e) => setFormData({ ...formData, position: e.target.value })}
            className="w-full px-3 py-2 bg-input border border-border-subtle rounded-lg text-content focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-content-tertiary mb-2">Monthly Salary (SAR)</label>
        <input
          type="number"
          value={formData.salary}
          onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
          className="w-full px-3 py-2 bg-input border border-border-subtle rounded-lg text-content focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>

      <div className="border-t border-border pt-4">
        <h4 className="text-sm font-medium text-content-tertiary mb-3">Document Expiry Dates</h4>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-xs text-content-secondary mb-1">Iqamah</label>
            <input
              type="date"
              value={formData.iqamah_expiry}
              onChange={(e) => setFormData({ ...formData, iqamah_expiry: e.target.value })}
              className="w-full px-3 py-2 bg-input border border-border-subtle rounded-lg text-content text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-xs text-content-secondary mb-1">Visa</label>
            <input
              type="date"
              value={formData.visa_expiry}
              onChange={(e) => setFormData({ ...formData, visa_expiry: e.target.value })}
              className="w-full px-3 py-2 bg-input border border-border-subtle rounded-lg text-content text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-xs text-content-secondary mb-1">Passport</label>
            <input
              type="date"
              value={formData.passport_expiry}
              onChange={(e) => setFormData({ ...formData, passport_expiry: e.target.value })}
              className="w-full px-3 py-2 bg-input border border-border-subtle rounded-lg text-content text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          onClick={onCancel}
          className="flex-1 px-4 py-2 bg-hover text-content-tertiary rounded-xl text-sm font-medium hover:bg-hover transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-500 transition-colors"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}

// Terminate Employee Form
function TerminateEmployeeForm({
  employee,
  onSubmit,
  onCancel,
}: {
  employee: Employee;
  onSubmit: (reason: string, date: string) => void;
  onCancel: () => void;
}) {
  const [reason, setReason] = useState('');
  const [effectiveDate, setEffectiveDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  return (
    <div className="space-y-4">
      <div className="bg-red-900/30 border border-red-600/50 rounded-lg p-4">
        <p className="text-red-300 font-medium">Warning: This action cannot be undone</p>
        <p className="text-sm text-red-400 mt-1">
          You are about to terminate {employee.first_name} {employee.last_name} ({employee.employee_id})
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-content-tertiary mb-2">Effective Date</label>
        <input
          type="date"
          value={effectiveDate}
          onChange={(e) => setEffectiveDate(e.target.value)}
          className="w-full px-3 py-2 bg-input border border-border-subtle rounded-lg text-content focus:ring-2 focus:ring-red-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-content-tertiary mb-2">Reason for Termination</label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={3}
          placeholder="Enter reason for termination..."
          className="w-full px-3 py-2 bg-input border border-border-subtle rounded-lg text-content placeholder-content-secondary focus:ring-2 focus:ring-red-500 focus:border-transparent"
        />
      </div>

      <div className="flex gap-3 pt-4">
        <button
          onClick={onCancel}
          className="flex-1 px-4 py-2 bg-hover text-content-tertiary rounded-xl text-sm font-medium hover:bg-hover transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={() => onSubmit(reason, effectiveDate)}
          disabled={!reason}
          className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Terminate Employee
        </button>
      </div>
    </div>
  );
}

export default function Employees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('all');
  const [search, setSearch] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showTerminateModal, setShowTerminateModal] = useState(false);
  const [employeeToEdit, setEmployeeToEdit] = useState<Employee | null>(null);
  const [employeeToTerminate, setEmployeeToTerminate] = useState<Employee | null>(null);

  // Toast state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await hcmsApi.employees.getAll();
      setEmployees(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAddEmployee = async (data: CreateEmployeeInput) => {
    try {
      await hcmsApi.employees.create(data);
      setShowAddModal(false);
      setToast({ message: 'Employee added successfully', type: 'success' });
      loadData();
    } catch {
      setToast({ message: 'Failed to add employee', type: 'error' });
    }
  };

  const handleUpdateEmployee = async (data: UpdateEmployeeInput) => {
    try {
      await hcmsApi.employees.update(data);
      setShowEditModal(false);
      setEmployeeToEdit(null);
      setToast({ message: 'Employee updated successfully', type: 'success' });
      loadData();
    } catch {
      setToast({ message: 'Failed to update employee', type: 'error' });
    }
  };

  const handleTerminateEmployee = async (reason: string, effectiveDate: string) => {
    if (!employeeToTerminate) return;
    try {
      await hcmsApi.employees.terminate({
        id: employeeToTerminate.id,
        reason,
        effective_date: effectiveDate,
      });
      setShowTerminateModal(false);
      setEmployeeToTerminate(null);
      setToast({ message: 'Employee terminated', type: 'success' });
      loadData();
    } catch {
      setToast({ message: 'Failed to terminate employee', type: 'error' });
    }
  };

  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const matchesFilter = filter === 'all' || emp.employment_status === filter;
      const matchesSearch =
        !search ||
        emp.first_name.toLowerCase().includes(search.toLowerCase()) ||
        emp.last_name.toLowerCase().includes(search.toLowerCase()) ||
        emp.employee_id.toLowerCase().includes(search.toLowerCase()) ||
        emp.department.toLowerCase().includes(search.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [employees, filter, search]);

  const stats = useMemo(() => ({
    total: employees.length,
    active: employees.filter((e) => e.employment_status === 'active').length,
    probation: employees.filter((e) => e.employment_status === 'probation').length,
    resigned: employees.filter((e) => e.employment_status === 'resigned').length,
  }), [employees]);

  if (loading) {
    return (
      <div className="animate-fade-in">
        <Header title="Employees" subtitle="Employee directory and management" />
        <div className="p-6">
          <CardGridSkeleton count={4} />
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <Header title="Employees" subtitle="Employee directory and management" />
      <div className="p-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 stagger-children">
          <StatCard icon={<Users size={20} />} label="Total Employees" value={stats.total} />
          <StatCard icon={<UserCheck size={20} />} label="Active" value={stats.active} variant="success" />
          <StatCard icon={<Clock size={20} />} label="Probation" value={stats.probation} variant="warning" />
          <StatCard icon={<UserMinus size={20} />} label="Resigned" value={stats.resigned} />
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search by name, ID, department..."
            className="flex-1"
          />
          <FilterButtons
            options={FILTER_OPTIONS}
            value={filter}
            onChange={setFilter}
            colorMap={{ active: 'success', probation: 'warning' }}
          />
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 transition-colors whitespace-nowrap"
          >
            <Plus size={20} />
            Add Employee
          </button>
        </div>

        {/* Employee Table */}
        {filteredEmployees.length === 0 ? (
          <EmptyState
            title="No employees found"
            description="Try adjusting your search or filter criteria"
          />
        ) : (
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-input">
                  <tr>
                    <th className="text-left p-4 text-sm font-medium text-content-secondary">Employee</th>
                    <th className="text-left p-4 text-sm font-medium text-content-secondary">ID</th>
                    <th className="text-left p-4 text-sm font-medium text-content-secondary">Department</th>
                    <th className="text-left p-4 text-sm font-medium text-content-secondary">Position</th>
                    <th className="text-left p-4 text-sm font-medium text-content-secondary">Status</th>
                    <th className="text-left p-4 text-sm font-medium text-content-secondary">Hire Date</th>
                    <th className="text-left p-4 text-sm font-medium text-content-secondary">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.map((emp, index) => (
                    <tr
                      key={emp.id}
                      className="border-t border-border hover:bg-card transition-colors animate-fade-in"
                      style={{ animationDelay: `${index * 30}ms` }}
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-semibold">
                            {emp.first_name[0]}{emp.last_name[0]}
                          </div>
                          <div>
                            <p className="text-content font-medium">{emp.first_name} {emp.last_name}</p>
                            <p className="text-sm text-content-secondary">{emp.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-mono text-sm text-content-tertiary">{emp.employee_id}</td>
                      <td className="p-4 text-content-tertiary">{emp.department}</td>
                      <td className="p-4 text-content-tertiary">{emp.position}</td>
                      <td className="p-4">
                        <StatusBadge status={emp.employment_status} variant="dot" />
                      </td>
                      <td className="p-4 text-sm text-content-secondary">
                        {format(new Date(emp.hire_date), 'MMM d, yyyy')}
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => setSelectedEmployee(emp)}
                            className="p-2 bg-hover text-content-tertiary rounded-lg hover:bg-hover transition-colors"
                            aria-label="View details"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => {
                              setEmployeeToEdit(emp);
                              setShowEditModal(true);
                            }}
                            className="p-2 bg-indigo-900/50 text-indigo-400 rounded-lg hover:bg-indigo-800/50 transition-colors"
                            aria-label="Edit"
                          >
                            <Edit size={16} />
                          </button>
                          {emp.employment_status !== 'resigned' && (
                            <button
                              onClick={() => {
                                setEmployeeToTerminate(emp);
                                setShowTerminateModal(true);
                              }}
                              className="p-2 bg-red-900/50 text-red-400 rounded-lg hover:bg-red-800/50 transition-colors"
                              aria-label="Terminate"
                            >
                              <UserX size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-3 border-t border-border text-sm text-content-muted">
              Showing {filteredEmployees.length} of {employees.length} employees
            </div>
          </div>
        )}

        {/* Employee Detail Modal */}
        <Modal
          isOpen={!!selectedEmployee}
          onClose={() => setSelectedEmployee(null)}
          title="Employee Details"
          size="lg"
          footer={
            <ModalButton variant="secondary" onClick={() => setSelectedEmployee(null)}>
              Close
            </ModalButton>
          }
        >
          {selectedEmployee && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl">
                  {selectedEmployee.first_name[0]}{selectedEmployee.last_name[0]}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-content">
                    {selectedEmployee.first_name} {selectedEmployee.last_name}
                  </h3>
                  <p className="text-content-secondary">{selectedEmployee.position}</p>
                  <StatusBadge status={selectedEmployee.employment_status} variant="dot" size="md" />
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-4">
                <InfoItem icon={<Building size={16} />} label="Department" value={selectedEmployee.department} />
                <InfoItem icon={<Calendar size={16} />} label="Hire Date" value={format(new Date(selectedEmployee.hire_date), 'MMM d, yyyy')} />
                <InfoItem icon={<Mail size={16} />} label="Email" value={selectedEmployee.email} />
                <InfoItem icon={<Phone size={16} />} label="Phone" value={selectedEmployee.phone || '-'} />
              </div>

              {/* Document Expiry */}
              {(selectedEmployee.iqamah_expiry || selectedEmployee.visa_expiry || selectedEmployee.passport_expiry) && (
                <div>
                  <h4 className="text-sm font-semibold text-content-secondary mb-3">Document Expiry</h4>
                  <div className="grid grid-cols-3 gap-3">
                    {selectedEmployee.iqamah_expiry && (
                      <ExpiryCard label="Iqamah" date={selectedEmployee.iqamah_expiry} />
                    )}
                    {selectedEmployee.visa_expiry && (
                      <ExpiryCard label="Visa" date={selectedEmployee.visa_expiry} />
                    )}
                    {selectedEmployee.passport_expiry && (
                      <ExpiryCard label="Passport" date={selectedEmployee.passport_expiry} />
                    )}
                  </div>
                </div>
              )}

              {/* Salary */}
              {selectedEmployee.salary && (
                <div className="bg-app rounded-xl p-4">
                  <p className="text-sm text-content-secondary mb-1">Monthly Salary</p>
                  <p className="text-2xl font-bold text-emerald-400">
                    SAR {selectedEmployee.salary.toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          )}
        </Modal>

        {/* Add Employee Modal */}
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="Add New Employee"
          size="lg"
        >
          <AddEmployeeForm
            onSubmit={handleAddEmployee}
            onCancel={() => setShowAddModal(false)}
          />
        </Modal>

        {/* Edit Employee Modal */}
        <Modal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setEmployeeToEdit(null);
          }}
          title="Edit Employee"
          size="lg"
        >
          {employeeToEdit && (
            <EditEmployeeForm
              employee={employeeToEdit}
              onSubmit={handleUpdateEmployee}
              onCancel={() => {
                setShowEditModal(false);
                setEmployeeToEdit(null);
              }}
            />
          )}
        </Modal>

        {/* Terminate Employee Modal */}
        <Modal
          isOpen={showTerminateModal}
          onClose={() => {
            setShowTerminateModal(false);
            setEmployeeToTerminate(null);
          }}
          title="Terminate Employee"
          size="md"
        >
          {employeeToTerminate && (
            <TerminateEmployeeForm
              employee={employeeToTerminate}
              onSubmit={handleTerminateEmployee}
              onCancel={() => {
                setShowTerminateModal(false);
                setEmployeeToTerminate(null);
              }}
            />
          )}
        </Modal>
      </div>

      {/* Toast Notification */}
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  );
}

// Helper components
function InfoItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-app rounded-xl p-3">
      <div className="flex items-center gap-2 text-content-secondary mb-1">
        {icon}
        <span className="text-xs">{label}</span>
      </div>
      <p className="text-content text-sm font-medium truncate">{value}</p>
    </div>
  );
}

function ExpiryCard({ label, date }: { label: string; date: string }) {
  const expiryDate = new Date(date);
  const daysRemaining = Math.ceil((expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  const isExpiringSoon = daysRemaining <= 30;
  const isExpired = daysRemaining <= 0;

  return (
    <div className={`rounded-xl p-3 border ${
      isExpired ? 'bg-red-900/30 border-red-600/50' :
      isExpiringSoon ? 'bg-amber-900/30 border-amber-600/50' :
      'bg-app border-border'
    }`}>
      <p className="text-xs text-content-secondary mb-1">{label}</p>
      <p className="text-sm text-content font-medium">{format(expiryDate, 'MMM d, yyyy')}</p>
      <p className={`text-xs mt-1 ${
        isExpired ? 'text-red-400' :
        isExpiringSoon ? 'text-amber-400' :
        'text-emerald-400'
      }`}>
        {isExpired ? 'Expired' : `${daysRemaining} days`}
      </p>
    </div>
  );
}

// Named export for backward compatibility
export { Employees };
