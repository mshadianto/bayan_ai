import { useState, useEffect } from 'react';
import { Header } from '../../components/Layout';
import { StatusBadge, FilterButtons, CardGridSkeleton } from '../../components/common';
import type { ComplianceAlert, DisciplinaryCase } from '../../types';
import { format } from 'date-fns';
import { AlertTriangle, FileWarning, CheckCircle, Clock, Shield } from 'lucide-react';
import { hcmsApi } from '../../services/mockData/hcms';

const FILTER_OPTIONS = ['all', 'critical', 'warning', 'normal'] as const;
type FilterOption = typeof FILTER_OPTIONS[number];

export function Compliance() {
  const [alerts, setAlerts] = useState<ComplianceAlert[]>([]);
  const [cases, setCases] = useState<DisciplinaryCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterOption>('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [alertsData, casesData] = await Promise.all([
          hcmsApi.compliance.getAlerts(),
          hcmsApi.compliance.getCases(),
        ]);
        setAlerts(alertsData);
        setCases(casesData);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getAlertLevel = (days: number) => {
    if (days <= 14) return 'critical';
    if (days <= 30) return 'warning';
    return 'normal';
  };

  const filteredAlerts = alerts.filter((alert) => {
    if (filter === 'all') return true;
    return getAlertLevel(alert.days_remaining) === filter;
  });

  const alertTypeLabels: Record<string, { label: string; emoji: string }> = {
    iqamah_expiry: { label: 'Iqamah Expiry', emoji: '🪪' },
    visa_expiry: { label: 'Visa Expiry', emoji: '✈️' },
    passport_expiry: { label: 'Passport Expiry', emoji: '📘' },
    contract_expiry: { label: 'Contract Expiry', emoji: '📄' },
  };

  const criticalCount = alerts.filter(a => a.days_remaining <= 14).length;
  const warningCount = alerts.filter(a => a.days_remaining > 14 && a.days_remaining <= 30).length;

  return (
    <div className="animate-fade-in">
      <Header title="Compliance" subtitle="Document expiry and disciplinary tracking" />
      <div className="p-6">
        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 stagger-children">
          <div className="bg-red-900/30 rounded-xl p-5 border border-red-600/50 card-hover">
            <div className="flex items-center gap-3 mb-2">
              <AlertTriangle size={20} className="text-red-400" />
              <span className="text-sm text-red-300">Critical</span>
            </div>
            <p className="text-3xl font-bold text-white">{criticalCount}</p>
            <p className="text-xs text-red-400">Expiring within 14 days</p>
          </div>
          <div className="bg-amber-900/30 rounded-xl p-5 border border-amber-600/50 card-hover">
            <div className="flex items-center gap-3 mb-2">
              <Clock size={20} className="text-amber-400" />
              <span className="text-sm text-amber-300">Warning</span>
            </div>
            <p className="text-3xl font-bold text-white">{warningCount}</p>
            <p className="text-xs text-amber-400">Expiring within 30 days</p>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700 card-hover">
            <div className="flex items-center gap-3 mb-2">
              <Shield size={20} className="text-blue-400" />
              <span className="text-sm text-slate-400">Total Alerts</span>
            </div>
            <p className="text-3xl font-bold text-white">{alerts.length}</p>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700 card-hover">
            <div className="flex items-center gap-3 mb-2">
              <FileWarning size={20} className="text-purple-400" />
              <span className="text-sm text-slate-400">Open Cases</span>
            </div>
            <p className="text-3xl font-bold text-white">{cases.filter(c => c.status !== 'resolved').length}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <FilterButtons
            options={FILTER_OPTIONS}
            value={filter}
            onChange={setFilter}
            colorMap={{
              critical: 'error',
              warning: 'warning',
            }}
          />
        </div>

        {loading ? (
          <CardGridSkeleton count={2} columns={2} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Document Expiry Alerts */}
            <div className="bg-slate-800/50 rounded-xl border border-slate-700 card-hover">
              <div className="p-4 border-b border-slate-700">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <span>📋</span> Document Expiry Alerts
                </h3>
              </div>
              <div className="p-4 space-y-3 max-h-[500px] overflow-y-auto">
                {filteredAlerts.map((alert, index) => {
                  const level = getAlertLevel(alert.days_remaining);
                  return (
                    <div
                      key={alert.id}
                      className={`p-4 rounded-xl border animate-fade-in ${
                        level === 'critical' ? 'bg-red-900/30 border-red-600/50' :
                        level === 'warning' ? 'bg-amber-900/30 border-amber-600/50' :
                        'bg-slate-900/50 border-slate-700'
                      }`}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">{alertTypeLabels[alert.alert_type].emoji}</span>
                          <div>
                            <p className="text-white font-semibold">{alert.employee_name}</p>
                            <p className="text-sm text-slate-400">{alert.employee_id}</p>
                            <p className="text-sm text-slate-300 mt-1">
                              {alertTypeLabels[alert.alert_type].label}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`text-lg font-bold ${
                            level === 'critical' ? 'text-red-400' :
                            level === 'warning' ? 'text-amber-400' : 'text-emerald-400'
                          }`}>
                            {alert.days_remaining} days
                          </p>
                          <p className="text-xs text-slate-400">
                            {format(new Date(alert.expiry_date), 'MMM d, yyyy')}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {filteredAlerts.length === 0 && (
                  <p className="text-slate-400 text-center py-8">No alerts in this category</p>
                )}
              </div>
            </div>

            {/* Disciplinary Cases */}
            <div className="bg-slate-800/50 rounded-xl border border-slate-700 card-hover">
              <div className="p-4 border-b border-slate-700">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <span>⚖️</span> Disciplinary Cases
                </h3>
              </div>
              <div className="p-4 space-y-3">
                {cases.map((caseItem, index) => (
                  <div
                    key={caseItem.id}
                    className={`p-4 rounded-xl border animate-fade-in ${
                      caseItem.status === 'open' ? 'bg-red-900/30 border-red-600/50' :
                      caseItem.status === 'investigation' ? 'bg-amber-900/30 border-amber-600/50' :
                      'bg-slate-900/50 border-slate-700'
                    }`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="text-white font-semibold">{caseItem.employee_name}</p>
                        <p className="text-sm text-slate-400">{caseItem.employee_id}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusBadge status={caseItem.severity} size="sm" />
                        <StatusBadge status={caseItem.status} size="sm" />
                      </div>
                    </div>
                    <p className="text-sm text-slate-300 mb-2">{caseItem.description}</p>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <StatusBadge status={caseItem.case_type} size="sm" />
                      <span>Action: {caseItem.action_taken}</span>
                    </div>
                    <div className="mt-2 text-xs text-slate-500">
                      Created: {format(new Date(caseItem.created_at), 'MMM d, yyyy')}
                      {caseItem.resolved_at && ` | Resolved: ${format(new Date(caseItem.resolved_at), 'MMM d, yyyy')}`}
                    </div>
                  </div>
                ))}
                {cases.length === 0 && (
                  <div className="text-center py-8">
                    <CheckCircle size={48} className="mx-auto text-emerald-400 mb-3" />
                    <p className="text-slate-400">No disciplinary cases</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Named export for backward compatibility
export default Compliance;
