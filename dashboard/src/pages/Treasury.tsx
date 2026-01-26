import { useState, useEffect } from 'react';
import { Header } from '../components/Layout';
import { getTreasuryHistory } from '../services/supabase';
import type { TreasuryHistory } from '../types';
import { format } from 'date-fns';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import { TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';

export function Treasury() {
  const [history, setHistory] = useState<TreasuryHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const data = await getTreasuryHistory();
      setHistory(data);
    } catch (err) {
      console.error('Failed to load treasury data:', err);
    } finally {
      setLoading(false);
    }
  }

  const currentBalance = history[0]?.current_balance || 0;
  const previousBalance = history[1]?.current_balance || currentBalance;
  const balanceChange = currentBalance - previousBalance;
  const percentChange = previousBalance > 0 ? (balanceChange / previousBalance) * 100 : 0;

  const chartData = [...history]
    .reverse()
    .map((item) => ({
      date: format(new Date(item.created_at), 'MMM d'),
      balance: item.current_balance,
    }));

  const isLowBalance = currentBalance < 100000;
  const isHighBalance = currentBalance > 500000;

  return (
    <div>
      <Header title="Treasury Dashboard" subtitle="Balance tracking and analysis" />
      <div className="p-6">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-xl flex items-center justify-center text-xl">
                    🏦
                  </div>
                  {isLowBalance && (
                    <span className="px-2.5 py-1 bg-red-900/50 text-red-300 text-xs rounded-lg border border-red-600">
                      Low Balance
                    </span>
                  )}
                  {isHighBalance && (
                    <span className="px-2.5 py-1 bg-blue-900/50 text-blue-300 text-xs rounded-lg border border-blue-600">
                      Surplus
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-400">Current Balance</p>
                <p className="text-3xl font-bold text-white mt-1">
                  SAR {currentBalance.toLocaleString()}
                </p>
                <div className="mt-3 flex items-center gap-1">
                  {balanceChange >= 0 ? (
                    <TrendingUp size={16} className="text-emerald-400" />
                  ) : (
                    <TrendingDown size={16} className="text-red-400" />
                  )}
                  <span
                    className={`text-sm ${
                      balanceChange >= 0 ? 'text-emerald-400' : 'text-red-400'
                    }`}
                  >
                    {balanceChange >= 0 ? '+' : ''}
                    {percentChange.toFixed(1)}% from last update
                  </span>
                </div>
              </div>

              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-xl mb-4">
                  📈
                </div>
                <p className="text-sm text-slate-400">30-Day High</p>
                <p className="text-3xl font-bold text-white mt-1">
                  SAR{' '}
                  {Math.max(...history.map((h) => h.current_balance)).toLocaleString()}
                </p>
                <p className="text-sm text-slate-500 mt-3">Maximum recorded balance</p>
              </div>

              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center text-xl mb-4">
                  📉
                </div>
                <p className="text-sm text-slate-400">30-Day Low</p>
                <p className="text-3xl font-bold text-white mt-1">
                  SAR{' '}
                  {Math.min(...history.map((h) => h.current_balance)).toLocaleString()}
                </p>
                <p className="text-sm text-slate-500 mt-3">Minimum recorded balance</p>
              </div>
            </div>

            {/* Alerts */}
            {(isLowBalance || isHighBalance) && (
              <div
                className={`mb-6 p-4 rounded-xl flex items-start gap-3 border ${
                  isLowBalance
                    ? 'bg-red-900/30 border-red-600/50'
                    : 'bg-blue-900/30 border-blue-600/50'
                }`}
              >
                <AlertCircle
                  size={20}
                  className={isLowBalance ? 'text-red-400' : 'text-blue-400'}
                />
                <div>
                  <p
                    className={`font-medium ${
                      isLowBalance ? 'text-red-300' : 'text-blue-300'
                    }`}
                  >
                    {isLowBalance
                      ? '⚠️ Liquidity Warning'
                      : '💡 Surplus Investment Opportunity'}
                  </p>
                  <p
                    className={`text-sm mt-1 ${
                      isLowBalance ? 'text-red-400' : 'text-blue-400'
                    }`}
                  >
                    {isLowBalance
                      ? 'Balance is below SAR 100,000. Consider liquidity management.'
                      : 'Balance exceeds SAR 500,000. Consider Sukuk investment for optimal returns.'}
                  </p>
                </div>
              </div>
            )}

            {/* Balance Chart */}
            <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6 mb-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <span>📊</span> Balance History
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="date" stroke="#94a3b8" />
                    <YAxis
                      stroke="#94a3b8"
                      tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                    />
                    <Tooltip
                      formatter={(value: number) => [
                        `SAR ${value.toLocaleString()}`,
                        'Balance',
                      ]}
                      contentStyle={{
                        backgroundColor: '#1e293b',
                        border: '1px solid #334155',
                        borderRadius: '12px',
                        color: '#ffffff',
                      }}
                      labelStyle={{ color: '#94a3b8' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="balance"
                      stroke="#14b8a6"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorBalance)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* History Table */}
            <div className="bg-slate-800/50 rounded-xl border border-slate-700">
              <div className="p-4 border-b border-slate-700">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <span>📜</span> Treasury Analysis History
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-800">
                    <tr>
                      <th className="text-left p-4 text-sm font-medium text-slate-400">
                        Date
                      </th>
                      <th className="text-left p-4 text-sm font-medium text-slate-400">
                        Balance
                      </th>
                      <th className="text-left p-4 text-sm font-medium text-slate-400">
                        Analysis
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((item) => (
                      <tr key={item.id} className="border-t border-slate-700 hover:bg-slate-800/50">
                        <td className="p-4 text-slate-300">
                          {format(new Date(item.created_at), 'MMM d, yyyy HH:mm')}
                        </td>
                        <td className="p-4 font-medium text-white">
                          SAR {item.current_balance.toLocaleString()}
                        </td>
                        <td className="p-4 text-sm text-slate-400">
                          {item.analysis || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
