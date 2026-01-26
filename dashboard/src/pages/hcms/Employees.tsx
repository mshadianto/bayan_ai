import { useState, useEffect, useMemo } from 'react';
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
import { Users, UserCheck, UserMinus, Clock, Mail, Phone, Building, Calendar, Eye, Edit, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { hcmsApi } from '../../services/mockData/hcms';

const FILTER_OPTIONS = ['all', 'active', 'probation', 'resigned'] as const;
type FilterType = typeof FILTER_OPTIONS[number];

export default function Employees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('all');
  const [search, setSearch] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await hcmsApi.employees.getAll();
        setEmployees(data);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 transition-colors whitespace-nowrap">
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
          <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-800">
                  <tr>
                    <th className="text-left p-4 text-sm font-medium text-slate-400">Employee</th>
                    <th className="text-left p-4 text-sm font-medium text-slate-400">ID</th>
                    <th className="text-left p-4 text-sm font-medium text-slate-400">Department</th>
                    <th className="text-left p-4 text-sm font-medium text-slate-400">Position</th>
                    <th className="text-left p-4 text-sm font-medium text-slate-400">Status</th>
                    <th className="text-left p-4 text-sm font-medium text-slate-400">Hire Date</th>
                    <th className="text-left p-4 text-sm font-medium text-slate-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.map((emp, index) => (
                    <tr
                      key={emp.id}
                      className="border-t border-slate-700 hover:bg-slate-800/50 transition-colors animate-fade-in"
                      style={{ animationDelay: `${index * 30}ms` }}
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-semibold">
                            {emp.first_name[0]}{emp.last_name[0]}
                          </div>
                          <div>
                            <p className="text-white font-medium">{emp.first_name} {emp.last_name}</p>
                            <p className="text-sm text-slate-400">{emp.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-mono text-sm text-slate-300">{emp.employee_id}</td>
                      <td className="p-4 text-slate-300">{emp.department}</td>
                      <td className="p-4 text-slate-300">{emp.position}</td>
                      <td className="p-4">
                        <StatusBadge status={emp.employment_status} variant="dot" />
                      </td>
                      <td className="p-4 text-sm text-slate-400">
                        {format(new Date(emp.hire_date), 'MMM d, yyyy')}
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => setSelectedEmployee(emp)}
                            className="p-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors"
                            aria-label="View details"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            className="p-2 bg-indigo-900/50 text-indigo-400 rounded-lg hover:bg-indigo-800/50 transition-colors"
                            aria-label="Edit"
                          >
                            <Edit size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-3 border-t border-slate-700 text-sm text-slate-500">
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
                  <h3 className="text-xl font-semibold text-white">
                    {selectedEmployee.first_name} {selectedEmployee.last_name}
                  </h3>
                  <p className="text-slate-400">{selectedEmployee.position}</p>
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
                  <h4 className="text-sm font-semibold text-slate-400 mb-3">Document Expiry</h4>
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
                <div className="bg-slate-900/50 rounded-xl p-4">
                  <p className="text-sm text-slate-400 mb-1">Monthly Salary</p>
                  <p className="text-2xl font-bold text-emerald-400">
                    SAR {selectedEmployee.salary.toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
}

// Helper components
function InfoItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-slate-900/50 rounded-xl p-3">
      <div className="flex items-center gap-2 text-slate-400 mb-1">
        {icon}
        <span className="text-xs">{label}</span>
      </div>
      <p className="text-white text-sm font-medium truncate">{value}</p>
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
      'bg-slate-900/50 border-slate-700'
    }`}>
      <p className="text-xs text-slate-400 mb-1">{label}</p>
      <p className="text-sm text-white font-medium">{format(expiryDate, 'MMM d, yyyy')}</p>
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
