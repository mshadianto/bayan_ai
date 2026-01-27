import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

const financeItems = [
  { path: '/', label: 'Dashboard', emoji: '📊' },
  { path: '/investments', label: 'Investments', emoji: '💰' },
  { path: '/treasury', label: 'Treasury', emoji: '🏦' },
  { path: '/invoices', label: 'Invoices', emoji: '📄' },
  { path: '/financial-requests', label: 'Financial Requests', emoji: '📝' },
  { path: '/whatsapp', label: 'WhatsApp', emoji: '💬' },
];

const hcmsItems = [
  { path: '/hcms', label: 'HR Dashboard', emoji: '📈' },
  { path: '/hcms/employees', label: 'Employees', emoji: '👥' },
  { path: '/hcms/attendance', label: 'Attendance', emoji: '⏰' },
  { path: '/hcms/leave', label: 'Leave Management', emoji: '🏖️' },
  { path: '/hcms/payroll', label: 'Payroll', emoji: '💵' },
  { path: '/hcms/recruitment', label: 'Recruitment', emoji: '🎯' },
  { path: '/hcms/performance', label: 'Performance', emoji: '⭐' },
  { path: '/hcms/training', label: 'Training & LMS', emoji: '📚' },
  { path: '/hcms/compliance', label: 'Compliance', emoji: '📋' },
];

const lcrmsItems = [
  { path: '/lcrms', label: 'LCRMS Dashboard', emoji: '⚖️' },
  { path: '/lcrms/contracts', label: 'Contracts', emoji: '📋' },
  { path: '/lcrms/compliance', label: 'Compliance', emoji: '✅' },
  { path: '/lcrms/knowledge', label: 'Knowledge Base', emoji: '📚' },
  { path: '/lcrms/risks', label: 'Risk Management', emoji: '⚠️' },
  { path: '/lcrms/litigation', label: 'Litigation', emoji: '⚔️' },
  { path: '/lcrms/secretarial', label: 'Secretarial', emoji: '📜' },
];

export function Sidebar() {
  const [financeOpen, setFinanceOpen] = useState(true);
  const [hcmsOpen, setHcmsOpen] = useState(true);
  const [lcrmsOpen, setLcrmsOpen] = useState(true);

  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen fixed left-0 top-0 border-r border-slate-700 overflow-y-auto">
      {/* Logo */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-xl flex items-center justify-center text-lg">
            🏛️
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">BPKH Limited</h1>
            <p className="text-xs text-slate-400">Enterprise Dashboard</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-4 px-3 pb-24">
        {/* Finance Section */}
        <button
          onClick={() => setFinanceOpen(!financeOpen)}
          className="w-full flex items-center justify-between px-4 py-2 text-slate-400 hover:text-white transition-colors"
        >
          <span className="text-xs font-semibold uppercase tracking-wider">Finance</span>
          {financeOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </button>
        {financeOpen && (
          <div className="mt-1 mb-4">
            {financeItems.map(({ path, label, emoji }) => (
              <NavLink
                key={path}
                to={path}
                end={path === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 rounded-xl mb-1 transition-all ${
                    isActive
                      ? 'bg-teal-600/20 text-teal-400 border border-teal-600/50'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                <span className="text-base">{emoji}</span>
                <span className="text-sm font-medium">{label}</span>
              </NavLink>
            ))}
          </div>
        )}

        {/* HCMS Section */}
        <button
          onClick={() => setHcmsOpen(!hcmsOpen)}
          className="w-full flex items-center justify-between px-4 py-2 text-slate-400 hover:text-white transition-colors"
        >
          <span className="text-xs font-semibold uppercase tracking-wider">Human Capital</span>
          {hcmsOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </button>
        {hcmsOpen && (
          <div className="mt-1 mb-4">
            {hcmsItems.map(({ path, label, emoji }) => (
              <NavLink
                key={path}
                to={path}
                end={path === '/hcms'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 rounded-xl mb-1 transition-all ${
                    isActive
                      ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-600/50'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                <span className="text-base">{emoji}</span>
                <span className="text-sm font-medium">{label}</span>
              </NavLink>
            ))}
          </div>
        )}

        {/* LCRMS Section */}
        <button
          onClick={() => setLcrmsOpen(!lcrmsOpen)}
          className="w-full flex items-center justify-between px-4 py-2 text-slate-400 hover:text-white transition-colors"
        >
          <span className="text-xs font-semibold uppercase tracking-wider">Legal & Compliance</span>
          {lcrmsOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </button>
        {lcrmsOpen && (
          <div className="mt-1">
            {lcrmsItems.map(({ path, label, emoji }) => (
              <NavLink
                key={path}
                to={path}
                end={path === '/lcrms'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 rounded-xl mb-1 transition-all ${
                    isActive
                      ? 'bg-amber-600/20 text-amber-400 border border-amber-600/50'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                <span className="text-base">{emoji}</span>
                <span className="text-sm font-medium">{label}</span>
              </NavLink>
            ))}
          </div>
        )}
      </nav>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 w-64 p-4 border-t border-slate-700 bg-slate-900">
        <div className="bg-slate-800/50 rounded-xl p-3">
          <p className="text-xs text-slate-400">Islamic Finance Operations</p>
          <p className="text-xs text-teal-400 mt-1">🇸🇦 Saudi Arabia</p>
        </div>
      </div>
    </aside>
  );
}
