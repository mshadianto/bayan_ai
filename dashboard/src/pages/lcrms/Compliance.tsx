import { useState, useEffect, useMemo } from 'react';
import { Header } from '../../components/Layout';
import { StatCard, StatusBadge, SearchInput, Modal, CardGridSkeleton, EmptyState } from '../../components/common';
import type { License, COIDeclaration, EmployeeViolation } from '../../types';
import { Shield, FileCheck, AlertTriangle, Users, Eye, CheckCircle } from 'lucide-react';
import { lcrmsApi } from '../../services/mockData/lcrms';

type TabType = 'licenses' | 'coi' | 'violations';

export default function Compliance() {
  const [activeTab, setActiveTab] = useState<TabType>('licenses');
  const [licenses, setLicenses] = useState<License[]>([]);
  const [coiDeclarations, setCOIDeclarations] = useState<COIDeclaration[]>([]);
  const [violations, setViolations] = useState<EmployeeViolation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState<License | COIDeclaration | EmployeeViolation | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [licensesData, coiData, violationsData] = await Promise.all([
        lcrmsApi.compliance.getLicenses(),
        lcrmsApi.compliance.getCOIDeclarations(),
        lcrmsApi.compliance.getViolations(),
      ]);
      setLicenses(licensesData);
      setCOIDeclarations(coiData);
      setViolations(violationsData);
    } finally {
      setLoading(false);
    }
  };

  const summary = useMemo(() => ({
    licenses_valid: licenses.filter(l => l.status === 'valid').length,
    licenses_expiring: licenses.filter(l => l.status === 'expiring').length,
    licenses_expired: licenses.filter(l => l.status === 'expired').length,
    coi_submitted: coiDeclarations.filter(c => c.status !== 'pending').length,
    coi_pending: coiDeclarations.filter(c => c.status === 'pending').length,
    coi_with_conflict: coiDeclarations.filter(c => c.has_conflict).length,
    violations_open: violations.filter(v => v.investigation_status !== 'concluded').length,
  }), [licenses, coiDeclarations, violations]);

  const filteredLicenses = useMemo(() => {
    if (!search) return licenses;
    return licenses.filter(l =>
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.license_number.toLowerCase().includes(search.toLowerCase())
    );
  }, [licenses, search]);

  const filteredCOI = useMemo(() => {
    if (!search) return coiDeclarations;
    return coiDeclarations.filter(c =>
      c.employee_name.toLowerCase().includes(search.toLowerCase()) ||
      c.department.toLowerCase().includes(search.toLowerCase())
    );
  }, [coiDeclarations, search]);

  const filteredViolations = useMemo(() => {
    if (!search) return violations;
    return violations.filter(v =>
      v.employee_name.toLowerCase().includes(search.toLowerCase()) ||
      v.description.toLowerCase().includes(search.toLowerCase())
    );
  }, [violations, search]);

  const handleApproveCOI = async (id: string) => {
    try {
      await lcrmsApi.compliance.approveCOI(id, 'Admin');
      setToast({ message: 'COI Declaration approved', type: 'success' });
      loadData();
      setShowDetailModal(false);
    } catch {
      setToast({ message: 'Failed to approve COI', type: 'error' });
    }
  };

  if (loading) {
    return (
      <div className="animate-fade-in">
        <Header title="Regulatory Compliance" subtitle="Licenses, COI & Governance" />
        <div className="p-6">
          <CardGridSkeleton count={4} />
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <Header title="Regulatory Compliance" subtitle="Licenses, COI & Governance" />
      <div className="p-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard icon={<Shield size={20} />} label="Valid Licenses" value={summary.licenses_valid} variant="success" />
          <StatCard icon={<AlertTriangle size={20} />} label="Licenses Expiring/Expired" value={summary.licenses_expiring + summary.licenses_expired} variant="warning" />
          <StatCard icon={<FileCheck size={20} />} label="COI Submitted" value={summary.coi_submitted} variant="info" />
          <StatCard icon={<Users size={20} />} label="Open Violations" value={summary.violations_open} variant="error" />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-slate-700 pb-4">
          {[
            { id: 'licenses', label: 'Licenses', icon: <Shield size={18} /> },
            { id: 'coi', label: 'COI Declarations', icon: <FileCheck size={18} /> },
            { id: 'violations', label: 'Violations', icon: <AlertTriangle size={18} /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-amber-600 text-white'
                  : 'text-slate-400 hover:bg-slate-700'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="mb-6">
          <SearchInput value={search} onChange={setSearch} placeholder="Search..." />
        </div>

        {/* Content */}
        {activeTab === 'licenses' && (
          <LicensesList
            licenses={filteredLicenses}
            onView={(license) => { setSelectedItem(license); setShowDetailModal(true); }}
          />
        )}

        {activeTab === 'coi' && (
          <COIList
            declarations={filteredCOI}
            onView={(coi) => { setSelectedItem(coi); setShowDetailModal(true); }}
          />
        )}

        {activeTab === 'violations' && (
          <ViolationsList
            violations={filteredViolations}
            onView={(violation) => { setSelectedItem(violation); setShowDetailModal(true); }}
          />
        )}

        {/* Toast */}
        {toast && (
          <div className={`fixed bottom-4 right-4 px-4 py-3 rounded-xl ${toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'} text-white shadow-lg animate-fade-in`}>
            {toast.message}
            <button onClick={() => setToast(null)} className="ml-4">×</button>
          </div>
        )}

        {/* Detail Modal */}
        <Modal
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          title={activeTab === 'licenses' ? 'License Details' : activeTab === 'coi' ? 'COI Declaration' : 'Violation Details'}
          size="lg"
        >
          {selectedItem && activeTab === 'licenses' && (
            <LicenseDetail license={selectedItem as License} />
          )}
          {selectedItem && activeTab === 'coi' && (
            <COIDetail
              coi={selectedItem as COIDeclaration}
              onApprove={() => handleApproveCOI((selectedItem as COIDeclaration).id)}
            />
          )}
          {selectedItem && activeTab === 'violations' && (
            <ViolationDetail violation={selectedItem as EmployeeViolation} />
          )}
        </Modal>
      </div>
    </div>
  );
}

function LicensesList({ licenses, onView }: { licenses: License[]; onView: (l: License) => void }) {
  if (licenses.length === 0) {
    return <EmptyState title="No licenses found" description="Add company licenses to track" />;
  }

  return (
    <div className="space-y-3">
      {licenses.map((license, index) => (
        <div
          key={license.id}
          className="bg-slate-800/50 rounded-xl border border-slate-700 p-4 hover:border-amber-600/50 transition-colors cursor-pointer animate-fade-in"
          style={{ animationDelay: `${index * 50}ms` }}
          onClick={() => onView(license)}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-white font-medium">{license.name}</h3>
                <StatusBadge status={license.status} />
              </div>
              <p className="text-slate-400 text-sm">{license.license_number} - {license.issuer}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-slate-400 text-xs">Expiry Date</p>
                <p className="text-white">{license.expiry_date}</p>
              </div>
              <StatusBadge status={license.country} variant="outline" />
              <Eye size={18} className="text-slate-400" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function COIList({ declarations, onView }: { declarations: COIDeclaration[]; onView: (c: COIDeclaration) => void }) {
  if (declarations.length === 0) {
    return <EmptyState title="No COI declarations found" description="COI declarations will appear here" />;
  }

  return (
    <div className="space-y-3">
      {declarations.map((coi, index) => (
        <div
          key={coi.id}
          className="bg-slate-800/50 rounded-xl border border-slate-700 p-4 hover:border-amber-600/50 transition-colors cursor-pointer animate-fade-in"
          style={{ animationDelay: `${index * 50}ms` }}
          onClick={() => onView(coi)}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-white font-medium">{coi.employee_name}</h3>
                <StatusBadge status={coi.status} />
                {coi.has_conflict && <StatusBadge status="conflict" variant="dot" />}
              </div>
              <p className="text-slate-400 text-sm">{coi.position} - {coi.department}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-slate-400 text-xs">Year</p>
                <p className="text-white">{coi.year}</p>
              </div>
              <Eye size={18} className="text-slate-400" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ViolationsList({ violations, onView }: { violations: EmployeeViolation[]; onView: (v: EmployeeViolation) => void }) {
  if (violations.length === 0) {
    return <EmptyState title="No violations found" description="Employee violations will appear here" />;
  }

  return (
    <div className="space-y-3">
      {violations.map((violation, index) => (
        <div
          key={violation.id}
          className="bg-slate-800/50 rounded-xl border border-slate-700 p-4 hover:border-amber-600/50 transition-colors cursor-pointer animate-fade-in"
          style={{ animationDelay: `${index * 50}ms` }}
          onClick={() => onView(violation)}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-white font-medium">{violation.employee_name}</h3>
                <StatusBadge status={violation.severity} />
                <StatusBadge status={violation.investigation_status} variant="outline" />
              </div>
              <p className="text-slate-400 text-sm">{violation.description.substring(0, 60)}...</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-slate-400 text-xs">Incident Date</p>
                <p className="text-white">{violation.incident_date}</p>
              </div>
              <Eye size={18} className="text-slate-400" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function LicenseDetail({ license }: { license: License }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <StatusBadge status={license.status} />
        <StatusBadge status={license.country} variant="outline" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-800 rounded-lg p-4">
          <p className="text-slate-400 text-sm">License Number</p>
          <p className="text-white font-mono">{license.license_number}</p>
        </div>
        <div className="bg-slate-800 rounded-lg p-4">
          <p className="text-slate-400 text-sm">Issuer</p>
          <p className="text-white">{license.issuer}</p>
        </div>
        <div className="bg-slate-800 rounded-lg p-4">
          <p className="text-slate-400 text-sm">Issue Date</p>
          <p className="text-white">{license.issue_date}</p>
        </div>
        <div className="bg-slate-800 rounded-lg p-4">
          <p className="text-slate-400 text-sm">Expiry Date</p>
          <p className="text-white">{license.expiry_date}</p>
        </div>
      </div>
      {license.renewal_notes && (
        <div className="bg-amber-900/30 border border-amber-600/50 rounded-lg p-4">
          <p className="text-amber-300 text-sm font-medium">Renewal Notes</p>
          <p className="text-slate-300">{license.renewal_notes}</p>
        </div>
      )}
    </div>
  );
}

function COIDetail({ coi, onApprove }: { coi: COIDeclaration; onApprove: () => void }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <StatusBadge status={coi.status} />
          {coi.has_conflict && <StatusBadge status="Has Conflict" variant="dot" />}
        </div>
        {coi.status === 'submitted' && (
          <button
            onClick={onApprove}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
          >
            <CheckCircle size={18} /> Approve
          </button>
        )}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-800 rounded-lg p-4">
          <p className="text-slate-400 text-sm">Employee</p>
          <p className="text-white font-medium">{coi.employee_name}</p>
          <p className="text-slate-400 text-sm">{coi.position}</p>
        </div>
        <div className="bg-slate-800 rounded-lg p-4">
          <p className="text-slate-400 text-sm">Department</p>
          <p className="text-white">{coi.department}</p>
        </div>
        <div className="bg-slate-800 rounded-lg p-4">
          <p className="text-slate-400 text-sm">Year</p>
          <p className="text-white">{coi.year}</p>
        </div>
        <div className="bg-slate-800 rounded-lg p-4">
          <p className="text-slate-400 text-sm">Submitted At</p>
          <p className="text-white">{coi.submitted_at}</p>
        </div>
      </div>
      {coi.has_conflict && (
        <div className="bg-red-900/30 border border-red-600/50 rounded-lg p-4">
          <p className="text-red-300 font-medium mb-2">Conflict of Interest Declared</p>
          <p className="text-slate-300 mb-2">{coi.conflict_details}</p>
          {coi.related_parties && (
            <p className="text-slate-400 text-sm">Related Parties: {coi.related_parties.join(', ')}</p>
          )}
          {coi.mitigation_plan && (
            <div className="mt-3 pt-3 border-t border-red-600/30">
              <p className="text-slate-400 text-sm">Mitigation Plan:</p>
              <p className="text-slate-300">{coi.mitigation_plan}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ViolationDetail({ violation }: { violation: EmployeeViolation }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <StatusBadge status={violation.severity} />
        <StatusBadge status={violation.investigation_status} variant="outline" />
        <StatusBadge status={violation.violation_type.replace('_', ' ')} variant="outline" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-800 rounded-lg p-4">
          <p className="text-slate-400 text-sm">Employee</p>
          <p className="text-white font-medium">{violation.employee_name}</p>
          <p className="text-slate-400 text-sm">{violation.department}</p>
        </div>
        <div className="bg-slate-800 rounded-lg p-4">
          <p className="text-slate-400 text-sm">Incident Date</p>
          <p className="text-white">{violation.incident_date}</p>
        </div>
        <div className="bg-slate-800 rounded-lg p-4">
          <p className="text-slate-400 text-sm">Reported By</p>
          <p className="text-white">{violation.reported_by}</p>
        </div>
        <div className="bg-slate-800 rounded-lg p-4">
          <p className="text-slate-400 text-sm">Status</p>
          <p className="text-white capitalize">{violation.investigation_status}</p>
        </div>
      </div>
      <div className="bg-slate-800 rounded-lg p-4">
        <p className="text-slate-400 text-sm mb-2">Description</p>
        <p className="text-white">{violation.description}</p>
      </div>
      {violation.action_taken && (
        <div className="bg-amber-900/30 border border-amber-600/50 rounded-lg p-4">
          <p className="text-amber-300 text-sm font-medium">Action Taken</p>
          <p className="text-slate-300">{violation.action_taken}</p>
        </div>
      )}
      {violation.resolution && (
        <div className="bg-emerald-900/30 border border-emerald-600/50 rounded-lg p-4">
          <p className="text-emerald-300 text-sm font-medium">Resolution</p>
          <p className="text-slate-300">{violation.resolution}</p>
        </div>
      )}
    </div>
  );
}

export { Compliance };
