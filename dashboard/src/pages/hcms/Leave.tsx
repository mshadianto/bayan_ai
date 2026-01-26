import { useState, useEffect } from 'react';
import { Header } from '../../components/Layout';
import { StatusBadge, FilterButtons, CardGridSkeleton } from '../../components/common';
import type { LeaveRequest } from '../../types';
import { format } from 'date-fns';
import { CheckCircle, XCircle, Calendar } from 'lucide-react';
import { hcmsApi } from '../../services/mockData/hcms';

const leaveBalances = [
  { type: 'Annual Leave', total: 21, used: 5, remaining: 16, emoji: '🏖️' },
  { type: 'Sick Leave', total: 10, used: 2, remaining: 8, emoji: '🏥' },
  { type: 'Emergency', total: 5, used: 1, remaining: 4, emoji: '🚨' },
];

const FILTER_OPTIONS = ['all', 'pending', 'approved', 'rejected'] as const;
type FilterOption = typeof FILTER_OPTIONS[number];

export function Leave() {
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterOption>('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await hcmsApi.leave.getAll();
        setLeaves(data);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredLeaves = leaves.filter(
    (leave) => filter === 'all' || leave.status === filter
  );

  const handleApprove = (id: string) => {
    setLeaves(leaves.map(l =>
      l.id === id ? { ...l, status: 'approved', approved_by: 'CFO', approved_at: new Date().toISOString() } : l
    ));
  };

  const handleReject = (id: string) => {
    setLeaves(leaves.map(l =>
      l.id === id ? { ...l, status: 'rejected' } : l
    ));
  };

  const leaveTypeStyles: Record<string, string> = {
    annual: 'bg-blue-900/50 text-blue-300',
    sick: 'bg-red-900/50 text-red-300',
    emergency: 'bg-orange-900/50 text-orange-300',
    unpaid: 'bg-slate-700 text-slate-300',
    maternity: 'bg-pink-900/50 text-pink-300',
    paternity: 'bg-cyan-900/50 text-cyan-300',
  };

  const pendingCount = leaves.filter(l => l.status === 'pending').length;

  return (
    <div className="animate-fade-in">
      <Header title="Leave Management" subtitle="Leave requests and balance tracking" />
      <div className="p-6">
        {/* Leave Balance Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 stagger-children">
          {leaveBalances.map((balance) => (
            <div key={balance.type} className="bg-slate-800/50 rounded-xl p-5 border border-slate-700 card-hover">
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">{balance.emoji}</span>
                <span className="text-xs text-slate-400">{balance.type}</span>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-3xl font-bold text-white">{balance.remaining}</p>
                  <p className="text-xs text-slate-400">days remaining</p>
                </div>
                <div className="text-right text-sm">
                  <p className="text-slate-400">Used: {balance.used}</p>
                  <p className="text-slate-400">Total: {balance.total}</p>
                </div>
              </div>
              <div className="mt-3 h-2 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                  style={{ width: `${(balance.remaining / balance.total) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="mb-6">
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
            <span className="ml-3 text-sm text-amber-400">
              {pendingCount} pending request{pendingCount > 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* Leave Requests */}
        {loading ? (
          <CardGridSkeleton count={3} />
        ) : (
          <div className="space-y-4 stagger-children">
            {filteredLeaves.map((leave, index) => (
              <div
                key={leave.id}
                className="bg-slate-800/50 rounded-xl border border-slate-700 p-5 card-hover animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-indigo-600/30 rounded-full flex items-center justify-center text-indigo-300 font-semibold">
                      {leave.employee_name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">{leave.employee_name}</h3>
                      <p className="text-sm text-slate-400">{leave.employee_id}</p>
                      <div className="flex items-center gap-3 mt-2 flex-wrap">
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${leaveTypeStyles[leave.leave_type]}`}>
                          {leave.leave_type.replace('_', ' ')}
                        </span>
                        <div className="flex items-center gap-1 text-sm text-slate-300">
                          <Calendar size={14} />
                          {format(new Date(leave.start_date), 'MMM d')} - {format(new Date(leave.end_date), 'MMM d, yyyy')}
                        </div>
                        <span className="text-sm text-slate-400">({leave.days} days)</span>
                      </div>
                      <p className="text-sm text-slate-400 mt-2">{leave.reason}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={leave.status} variant="outline" />
                    {leave.status === 'pending' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprove(leave.id)}
                          className="p-2 bg-emerald-900/50 text-emerald-400 rounded-xl hover:bg-emerald-800/50 border border-emerald-600/50 transition-colors"
                          title="Approve"
                          aria-label="Approve leave request"
                        >
                          <CheckCircle size={18} />
                        </button>
                        <button
                          onClick={() => handleReject(leave.id)}
                          className="p-2 bg-red-900/50 text-red-400 rounded-xl hover:bg-red-800/50 border border-red-600/50 transition-colors"
                          title="Reject"
                          aria-label="Reject leave request"
                        >
                          <XCircle size={18} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                {leave.approved_by && (
                  <div className="mt-3 pt-3 border-t border-slate-700">
                    <p className="text-xs text-slate-400">
                      Approved by {leave.approved_by} on {format(new Date(leave.approved_at!), 'MMM d, yyyy')}
                    </p>
                  </div>
                )}
              </div>
            ))}
            {filteredLeaves.length === 0 && (
              <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-8 text-center text-slate-400">
                No leave requests found
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Named export for backward compatibility
export default Leave;
