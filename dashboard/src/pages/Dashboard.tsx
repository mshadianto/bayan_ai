import { useState, useEffect } from 'react';
import { Header } from '../components/Layout';
import { fetchDashboardData } from '../services/api';
import type { DashboardData } from '../types';
import { AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

export function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const dashboardData = await fetchDashboardData();
      setData(dashboardData);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div>
        <Header title="Dashboard" subtitle="Financial overview and analytics" />
        <div className="p-6 flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Header title="Dashboard" subtitle="Financial overview and analytics" />
        <div className="p-6">
          <div className="bg-red-900/50 text-red-300 p-4 rounded-xl border border-red-600">{error}</div>
        </div>
      </div>
    );
  }

  const stats = [
    {
      label: 'Treasury Balance',
      value: `SAR ${(data?.treasury?.current_balance || 0).toLocaleString()}`,
      emoji: '🏦',
      gradient: 'from-teal-600 to-emerald-600',
    },
    {
      label: 'Pending Investments',
      value: data?.summary?.pending_investments || 0,
      emoji: '📊',
      gradient: 'from-blue-600 to-indigo-600',
    },
    {
      label: 'Pending Invoices',
      value: data?.summary?.pending_invoices || 0,
      emoji: '📄',
      gradient: 'from-amber-500 to-orange-600',
    },
    {
      label: 'Approved Investments',
      value: data?.summary?.approved_investments || 0,
      emoji: '✅',
      gradient: 'from-emerald-500 to-green-600',
    },
  ];

  return (
    <div>
      <Header title="Dashboard" subtitle="Financial overview and analytics" />
      <div className="p-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-slate-800/50 rounded-xl p-5 border border-slate-700 hover:border-slate-600 transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center text-lg`}>
                  {stat.emoji}
                </div>
                <p className="text-sm text-slate-400">{stat.label}</p>
              </div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Investments */}
          <div className="bg-slate-800/50 rounded-xl border border-slate-700">
            <div className="p-4 border-b border-slate-700">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <span>💰</span> Recent Investments
              </h3>
            </div>
            <div className="p-4">
              {data?.investments?.slice(0, 5).map((inv) => (
                <div
                  key={inv.id}
                  className="flex items-center justify-between py-3 border-b border-slate-700 last:border-0"
                >
                  <div>
                    <p className="font-medium text-white">{inv.company_name}</p>
                    <p className="text-sm text-slate-400">
                      {format(new Date(inv.created_at), 'MMM d, yyyy')}
                    </p>
                  </div>
                  <StatusBadge status={inv.status} />
                </div>
              ))}
              {(!data?.investments || data?.investments?.length === 0) && (
                <p className="text-slate-400 text-center py-4">No investments yet</p>
              )}
            </div>
          </div>

          {/* Treasury Alerts */}
          <div className="bg-slate-800/50 rounded-xl border border-slate-700">
            <div className="p-4 border-b border-slate-700">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <span>🔔</span> Treasury Alerts
              </h3>
            </div>
            <div className="p-4">
              {data?.treasury?.alerts?.map((alert, idx) => (
                <div
                  key={idx}
                  className={`flex items-start gap-3 p-3 rounded-xl mb-2 border ${
                    alert.type === 'warning'
                      ? 'bg-amber-900/30 border-amber-600/50'
                      : alert.type === 'success'
                      ? 'bg-emerald-900/30 border-emerald-600/50'
                      : 'bg-blue-900/30 border-blue-600/50'
                  }`}
                >
                  <AlertCircle
                    size={20}
                    className={
                      alert.type === 'warning'
                        ? 'text-amber-400'
                        : alert.type === 'success'
                        ? 'text-emerald-400'
                        : 'text-blue-400'
                    }
                  />
                  <div>
                    <p className="text-sm text-slate-300">{alert.message}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      {format(new Date(alert.timestamp), 'MMM d, HH:mm')}
                    </p>
                  </div>
                </div>
              ))}
              {(!data?.treasury?.alerts || data?.treasury?.alerts?.length === 0) && (
                <p className="text-slate-400 text-center py-4">No alerts</p>
              )}
            </div>
          </div>

          {/* Recent Invoices */}
          <div className="bg-slate-800/50 rounded-xl border border-slate-700 lg:col-span-2">
            <div className="p-4 border-b border-slate-700">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <span>📋</span> Recent Invoices
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-800">
                  <tr>
                    <th className="text-left p-4 text-sm font-medium text-slate-400">
                      Invoice #
                    </th>
                    <th className="text-left p-4 text-sm font-medium text-slate-400">
                      Vendor
                    </th>
                    <th className="text-left p-4 text-sm font-medium text-slate-400">
                      Amount
                    </th>
                    <th className="text-left p-4 text-sm font-medium text-slate-400">
                      Status
                    </th>
                    <th className="text-left p-4 text-sm font-medium text-slate-400">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data?.invoices?.slice(0, 5).map((inv) => (
                    <tr key={inv.id} className="border-t border-slate-700 hover:bg-slate-800/50">
                      <td className="p-4 font-medium text-white">{inv.invoice_number}</td>
                      <td className="p-4 text-slate-300">{inv.vendor_name || '-'}</td>
                      <td className="p-4 text-slate-300">
                        {inv.currency} {inv.amount.toLocaleString()}
                      </td>
                      <td className="p-4">
                        <StatusBadge status={inv.status} />
                      </td>
                      <td className="p-4 text-sm text-slate-400">
                        {format(new Date(inv.created_at), 'MMM d, yyyy')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {(!data?.invoices || data?.invoices?.length === 0) && (
                <p className="text-slate-400 text-center py-8">No invoices yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: 'bg-amber-900/50 text-amber-300 border-amber-600',
    approved: 'bg-emerald-900/50 text-emerald-300 border-emerald-600',
    rejected: 'bg-red-900/50 text-red-300 border-red-600',
    posted: 'bg-blue-900/50 text-blue-300 border-blue-600',
  };

  return (
    <span
      className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${
        styles[status] || 'bg-slate-700 text-slate-300 border-slate-600'
      }`}
    >
      {status}
    </span>
  );
}

export default Dashboard;
