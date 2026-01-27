import { useState, useEffect } from 'react';
import { Header } from '../../components/Layout';
import { StatCard, StatusBadge, CardGridSkeleton } from '../../components/common';
import type { LCRMSDashboardData, LCRMSAlert } from '../../types';
import { FileText, Shield, AlertTriangle, Scale, CheckCircle, TrendingUp } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { lcrmsApi } from '../../services/mockData/lcrms';

const tooltipStyle = {
  backgroundColor: '#1e293b',
  border: '1px solid #334155',
  borderRadius: '12px',
  color: '#ffffff',
};

const RISK_COLORS = {
  critical: '#ef4444',
  high: '#f97316',
  medium: '#eab308',
  low: '#22c55e',
};

export default function LCRMSDashboard() {
  const [data, setData] = useState<LCRMSDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dashboardData = await lcrmsApi.dashboard.getSummary();
        setData(dashboardData);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="animate-fade-in">
        <Header title="LCRMS Dashboard" subtitle="Legal, Compliance & Risk Management" />
        <div className="p-6">
          <CardGridSkeleton count={6} />
        </div>
      </div>
    );
  }

  const riskPieData = data ? [
    { name: 'Critical', value: data.risks_summary.critical, color: RISK_COLORS.critical },
    { name: 'High', value: data.risks_summary.high, color: RISK_COLORS.high },
    { name: 'Medium', value: data.risks_summary.medium, color: RISK_COLORS.medium },
    { name: 'Low', value: data.risks_summary.low, color: RISK_COLORS.low },
  ].filter(item => item.value > 0) : [];

  const stats = [
    {
      label: 'Compliance Score',
      value: `${data?.compliance_score || 0}%`,
      icon: <Shield size={20} />,
      variant: (data?.compliance_score || 0) >= 80 ? 'success' as const : (data?.compliance_score || 0) >= 60 ? 'warning' as const : 'error' as const
    },
    { label: 'Active Contracts', value: data?.contracts_summary.active || 0, icon: <FileText size={20} /> },
    { label: 'Open Risks', value: (data?.risks_summary.total || 0) - (data?.risks_summary.mitigated || 0), icon: <AlertTriangle size={20} />, variant: 'warning' as const },
    { label: 'Open Cases', value: data?.cases_summary.open || 0, icon: <Scale size={20} />, variant: 'info' as const },
    { label: 'Valid Licenses', value: data?.licenses_summary.valid || 0, icon: <CheckCircle size={20} />, variant: 'success' as const },
  ];

  const getAlertSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-400 bg-red-900/30 border-red-600/50';
      case 'warning': return 'text-amber-400 bg-amber-900/30 border-amber-600/50';
      default: return 'text-blue-400 bg-blue-900/30 border-blue-600/50';
    }
  };

  const getAlertIcon = (type: LCRMSAlert['type']) => {
    switch (type) {
      case 'contract_expiry': return '📋';
      case 'license_expiry': return '📜';
      case 'risk_escalation': return '⚠️';
      case 'case_hearing': return '⚖️';
      case 'coi_deadline': return '📝';
      case 'obligation_due': return '📅';
      default: return '🔔';
    }
  };

  return (
    <div className="animate-fade-in">
      <Header title="LCRMS Dashboard" subtitle="Legal, Compliance & Risk Management System" />
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

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 stagger-children">
          <div className="bg-amber-900/30 rounded-xl p-4 border border-amber-600/50 card-hover">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-300 text-sm">Contracts Expiring (30d)</p>
                <p className="text-2xl font-bold text-white">{data?.contracts_summary.expiring_30 || 0}</p>
              </div>
              <span className="text-3xl">📋</span>
            </div>
          </div>
          <div className="bg-red-900/30 rounded-xl p-4 border border-red-600/50 card-hover">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-300 text-sm">Licenses Expired</p>
                <p className="text-2xl font-bold text-white">{data?.licenses_summary.expired || 0}</p>
              </div>
              <span className="text-3xl">🚨</span>
            </div>
          </div>
          <div className="bg-purple-900/30 rounded-xl p-4 border border-purple-600/50 card-hover">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-300 text-sm">COI Pending</p>
                <p className="text-2xl font-bold text-white">{data?.coi_summary.pending || 0}</p>
              </div>
              <span className="text-3xl">📝</span>
            </div>
          </div>
          <div className="bg-emerald-900/30 rounded-xl p-4 border border-emerald-600/50 card-hover">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-300 text-sm">Risks Mitigated</p>
                <p className="text-2xl font-bold text-white">{data?.risks_summary.mitigated || 0}</p>
              </div>
              <span className="text-3xl">✅</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Compliance Score Trend */}
          <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6 card-hover">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <TrendingUp size={20} className="text-amber-400" />
              Compliance Score Trend
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data?.compliance_trend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="month" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" domain={[0, 100]} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="#f59e0b"
                    fill="#f59e0b"
                    fillOpacity={0.3}
                    strokeWidth={2}
                    name="Score"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Risk Distribution */}
          <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6 card-hover">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <AlertTriangle size={20} className="text-amber-400" />
              Risk Distribution
            </h3>
            <div className="h-64 flex items-center">
              <div className="w-1/2 h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={riskPieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {riskPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="w-1/2 space-y-2">
                {[
                  { label: 'Critical', value: data?.risks_summary.critical || 0, color: 'bg-red-500' },
                  { label: 'High', value: data?.risks_summary.high || 0, color: 'bg-orange-500' },
                  { label: 'Medium', value: data?.risks_summary.medium || 0, color: 'bg-yellow-500' },
                  { label: 'Low', value: data?.risks_summary.low || 0, color: 'bg-emerald-500' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${item.color}`} />
                    <span className="text-slate-300 text-sm">{item.label}</span>
                    <span className="text-white font-semibold ml-auto">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Litigation Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4 card-hover">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-900/50 rounded-lg">
                <Scale size={24} className="text-blue-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Total Cases</p>
                <p className="text-xl font-bold text-white">{data?.cases_summary.total || 0}</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4 card-hover">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-900/50 rounded-lg">
                <CheckCircle size={24} className="text-emerald-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Settled/Won</p>
                <p className="text-xl font-bold text-white">
                  {(data?.cases_summary.settled || 0) + (data?.cases_summary.won || 0)}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4 card-hover">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-900/50 rounded-lg">
                <AlertTriangle size={24} className="text-amber-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Total Exposure</p>
                <p className="text-xl font-bold text-white">
                  {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(data?.cases_summary.total_exposure || 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Alerts */}
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
          <div className="p-4 border-b border-slate-700">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <span>🔔</span> Active Alerts
            </h3>
          </div>
          <div className="divide-y divide-slate-700">
            {data?.alerts.map((alert, index) => (
              <div
                key={alert.id}
                className={`p-4 flex items-start gap-4 hover:bg-slate-800/50 animate-fade-in ${getAlertSeverityColor(alert.severity)}`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <span className="text-2xl">{getAlertIcon(alert.type)}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-white">{alert.title}</span>
                    <StatusBadge status={alert.severity} size="sm" />
                  </div>
                  <p className="text-sm text-slate-300">{alert.message}</p>
                  {alert.due_date && (
                    <p className="text-xs text-slate-400 mt-1">Due: {alert.due_date}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="mt-6 bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
          <div className="p-4 border-b border-slate-700">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <span>📊</span> Recent Activities
            </h3>
          </div>
          <div className="divide-y divide-slate-700">
            {data?.recent_activities.map((activity, index) => (
              <div
                key={activity.id}
                className="p-4 flex items-center gap-4 hover:bg-slate-800/50 animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="w-2 h-2 rounded-full bg-amber-400" />
                <div className="flex-1">
                  <p className="text-white">{activity.description}</p>
                  <p className="text-sm text-slate-400">
                    by {activity.user_name} - {new Date(activity.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export { LCRMSDashboard };
