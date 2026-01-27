import { useState, useEffect } from 'react';
import { Header } from '../../components/Layout';
import { StatCard, StatusBadge, CardGridSkeleton } from '../../components/common';
import type { HCMSDashboard as HCMSDashboardData, ComplianceAlert } from '../../types';
import { Users, UserCheck, BarChart3, Calendar, AlertTriangle } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import { hcmsApi } from '../../services/supabaseHcms';

// Chart tooltip style
const tooltipStyle = {
  backgroundColor: '#1e293b',
  border: '1px solid #334155',
  borderRadius: '12px',
  color: '#ffffff',
};

export default function HCMSDashboard() {
  const [data, setData] = useState<HCMSDashboardData | null>(null);
  const [alerts, setAlerts] = useState<ComplianceAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashboardData, alertsData] = await Promise.all([
          hcmsApi.dashboard.getSummary(),
          hcmsApi.compliance.getAlerts(),
        ]);
        setData(dashboardData);
        setAlerts(alertsData.slice(0, 3)); // Show top 3 alerts
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="animate-fade-in">
        <Header title="HR Dashboard" subtitle="Human Capital Management Overview" />
        <div className="p-6">
          <CardGridSkeleton count={6} />
        </div>
      </div>
    );
  }

  const stats = [
    { label: 'Total Employees', value: data?.total_employees || 0, icon: <Users size={20} /> },
    { label: 'Active', value: data?.active_employees || 0, icon: <UserCheck size={20} />, variant: 'success' as const },
    { label: 'Pending Leaves', value: data?.pending_leaves || 0, icon: <Calendar size={20} />, variant: 'warning' as const },
    { label: 'Upcoming Trainings', value: data?.upcoming_trainings || 0, icon: <BarChart3 size={20} />, variant: 'info' as const },
    { label: 'Compliance Alerts', value: data?.compliance_alerts || 0, icon: <AlertTriangle size={20} />, variant: 'error' as const },
  ];

  return (
    <div className="animate-fade-in">
      <Header title="HR Dashboard" subtitle="Human Capital Management Overview" />
      <div className="p-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6 stagger-children">
          {stats.map((stat) => (
            <StatCard
              key={stat.label}
              icon={stat.icon}
              label={stat.label}
              value={stat.value}
              variant={stat.variant}
            />
          ))}
        </div>

        {/* Attendance Today */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 stagger-children">
          <div className="bg-emerald-900/30 rounded-xl p-4 border border-emerald-600/50 card-hover">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-300 text-sm">Present Today</p>
                <p className="text-2xl font-bold text-white">{data?.attendance_today?.present || 0}</p>
              </div>
              <span className="text-3xl">✅</span>
            </div>
          </div>
          <div className="bg-red-900/30 rounded-xl p-4 border border-red-600/50 card-hover">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-300 text-sm">Absent</p>
                <p className="text-2xl font-bold text-white">{data?.attendance_today?.absent || 0}</p>
              </div>
              <span className="text-3xl">❌</span>
            </div>
          </div>
          <div className="bg-amber-900/30 rounded-xl p-4 border border-amber-600/50 card-hover">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-300 text-sm">Late</p>
                <p className="text-2xl font-bold text-white">{data?.attendance_today?.late || 0}</p>
              </div>
              <span className="text-3xl">⏰</span>
            </div>
          </div>
          <div className="bg-blue-900/30 rounded-xl p-4 border border-blue-600/50 card-hover">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-300 text-sm">On Leave</p>
                <p className="text-2xl font-bold text-white">{data?.attendance_today?.leave || 0}</p>
              </div>
              <span className="text-3xl">🏖️</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Department Distribution */}
          <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6 card-hover">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span>🏢</span> Department Distribution
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data?.departments} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis type="number" stroke="#94a3b8" />
                  <YAxis dataKey="name" type="category" stroke="#94a3b8" width={80} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="count" fill="#6366f1" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Headcount Trend */}
          <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6 card-hover">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span>📈</span> Headcount Trend
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data?.headcount_trend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="month" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#14b8a6"
                    strokeWidth={2}
                    dot={{ fill: '#14b8a6' }}
                    name="Employees"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Compliance Alerts */}
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
          <div className="p-4 border-b border-slate-700">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <span>⚠️</span> Compliance Alerts - Document Expiry
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-800">
                <tr>
                  <th className="text-left p-4 text-sm font-medium text-slate-400">Employee</th>
                  <th className="text-left p-4 text-sm font-medium text-slate-400">Alert Type</th>
                  <th className="text-left p-4 text-sm font-medium text-slate-400">Expiry Date</th>
                  <th className="text-left p-4 text-sm font-medium text-slate-400">Days Remaining</th>
                  <th className="text-left p-4 text-sm font-medium text-slate-400">Status</th>
                </tr>
              </thead>
              <tbody>
                {alerts.map((alert, index) => (
                  <tr
                    key={alert.id}
                    className="border-t border-slate-700 hover:bg-slate-800/50 animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <td className="p-4">
                      <div>
                        <p className="text-white font-medium">{alert.employee_name}</p>
                        <p className="text-sm text-slate-400">{alert.employee_id}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <StatusBadge status={alert.alert_type.replace('_expiry', '')} variant="outline">
                        {alert.alert_type.replace('_', ' ').toUpperCase()}
                      </StatusBadge>
                    </td>
                    <td className="p-4 text-slate-300">{alert.expiry_date}</td>
                    <td className="p-4">
                      <span
                        className={`font-semibold ${
                          alert.days_remaining <= 14
                            ? 'text-red-400'
                            : alert.days_remaining <= 30
                            ? 'text-amber-400'
                            : 'text-emerald-400'
                        }`}
                      >
                        {alert.days_remaining} days
                      </span>
                    </td>
                    <td className="p-4">
                      <StatusBadge
                        status={alert.days_remaining <= 14 ? 'critical' : alert.days_remaining <= 30 ? 'warning' : 'normal'}
                        variant="dot"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// Named export for backward compatibility
export { HCMSDashboard };
