import { useState, useEffect, useMemo } from 'react';
import { Header } from '../../components/Layout';
import { StatCard, StatusBadge, FilterButtons, SearchInput, Modal, CardGridSkeleton, EmptyState } from '../../components/common';
import type { Contract, ContractAlert } from '../../types';
import { FileText, AlertTriangle, Clock, CheckCircle, Plus, Eye, Calendar } from 'lucide-react';
import { lcrmsApi, CreateContractInput } from '../../services/mockData/lcrms';

const CONTRACT_FILTERS = ['all', 'active', 'expiring', 'expired', 'draft'] as const;
type ContractFilter = typeof CONTRACT_FILTERS[number];

const CONTRACT_TYPE_LABELS: Record<Contract['type'], string> = {
  pks: 'PKS',
  vendor: 'Vendor',
  sewa: 'Sewa',
  nda: 'NDA',
  service: 'Service',
  other: 'Other',
};

export default function Contracts() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [alerts, setAlerts] = useState<ContractAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<ContractFilter>('all');
  const [search, setSearch] = useState('');
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [contractsData, alertsData] = await Promise.all([
        lcrmsApi.contracts.getAll(),
        lcrmsApi.contracts.getAlerts(),
      ]);
      setContracts(contractsData);
      setAlerts(alertsData);
    } finally {
      setLoading(false);
    }
  };

  const filteredContracts = useMemo(() => {
    return contracts.filter((contract) => {
      const matchesFilter = filter === 'all' || contract.status === filter;
      const matchesSearch = !search ||
        contract.name.toLowerCase().includes(search.toLowerCase()) ||
        contract.partner_name.toLowerCase().includes(search.toLowerCase()) ||
        contract.contract_number.toLowerCase().includes(search.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [contracts, filter, search]);

  const summary = useMemo(() => ({
    total: contracts.length,
    active: contracts.filter(c => c.status === 'active').length,
    expiring: contracts.filter(c => c.status === 'expiring').length,
    expired: contracts.filter(c => c.status === 'expired').length,
  }), [contracts]);

  const handleViewContract = (contract: Contract) => {
    setSelectedContract(contract);
    setShowDetailModal(true);
  };

  const handleAddContract = async (data: CreateContractInput) => {
    try {
      await lcrmsApi.contracts.create(data);
      setShowAddModal(false);
      setToast({ message: 'Contract created successfully', type: 'success' });
      loadData();
    } catch {
      setToast({ message: 'Failed to create contract', type: 'error' });
    }
  };

  const getDaysUntilExpiry = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  if (loading) {
    return (
      <div className="animate-fade-in">
        <Header title="Contract Management" subtitle="Contract Lifecycle Management (CLM)" />
        <div className="p-6">
          <CardGridSkeleton count={4} />
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <Header title="Contract Management" subtitle="Contract Lifecycle Management (CLM)" />
      <div className="p-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard icon={<FileText size={20} />} label="Total Contracts" value={summary.total} />
          <StatCard icon={<CheckCircle size={20} />} label="Active" value={summary.active} variant="success" />
          <StatCard icon={<Clock size={20} />} label="Expiring Soon" value={summary.expiring} variant="warning" />
          <StatCard icon={<AlertTriangle size={20} />} label="Expired" value={summary.expired} variant="error" />
        </div>

        {/* Alerts Banner */}
        {alerts.filter(a => a.status === 'active').length > 0 && (
          <div className="bg-amber-900/30 border border-amber-600/50 rounded-xl p-4 mb-6">
            <h4 className="text-amber-300 font-medium mb-2 flex items-center gap-2">
              <AlertTriangle size={18} /> Contract Alerts
            </h4>
            <div className="space-y-2">
              {alerts.filter(a => a.status === 'active').slice(0, 3).map(alert => (
                <div key={alert.id} className="text-sm text-slate-300">
                  <span className="font-medium text-white">{alert.contract_name}</span> - {alert.message}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <FilterButtons
              options={CONTRACT_FILTERS}
              value={filter}
              onChange={setFilter}
            />
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search contracts..."
            />
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl transition-colors"
          >
            <Plus size={18} /> New Contract
          </button>
        </div>

        {/* Contracts List */}
        {filteredContracts.length === 0 ? (
          <EmptyState
            title="No contracts found"
            description={search ? "Try adjusting your search" : "Create your first contract"}
            action={{ label: "Add Contract", onClick: () => setShowAddModal(true) }}
          />
        ) : (
          <div className="space-y-4">
            {filteredContracts.map((contract, index) => {
              const daysUntilExpiry = getDaysUntilExpiry(contract.end_date);
              return (
                <div
                  key={contract.id}
                  className="bg-slate-800/50 rounded-xl border border-slate-700 p-4 hover:border-amber-600/50 transition-colors cursor-pointer animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                  onClick={() => handleViewContract(contract)}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-amber-400 font-mono text-sm">{contract.contract_number}</span>
                        <StatusBadge status={contract.status} />
                        <StatusBadge status={contract.type} variant="outline">
                          {CONTRACT_TYPE_LABELS[contract.type]}
                        </StatusBadge>
                      </div>
                      <h3 className="text-white font-medium">{contract.name}</h3>
                      <p className="text-slate-400 text-sm">{contract.partner_name}</p>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-slate-400 text-xs">Period</p>
                        <p className="text-slate-300 text-sm">
                          {contract.start_date} - {contract.end_date}
                        </p>
                      </div>
                      {contract.value && (
                        <div className="text-right">
                          <p className="text-slate-400 text-xs">Value</p>
                          <p className="text-white font-medium">
                            {new Intl.NumberFormat('en-SA', { style: 'currency', currency: contract.currency || 'SAR' }).format(contract.value)}
                          </p>
                        </div>
                      )}
                      <div className="text-right">
                        <p className="text-slate-400 text-xs">Days Left</p>
                        <p className={`font-medium ${daysUntilExpiry <= 0 ? 'text-red-400' : daysUntilExpiry <= 30 ? 'text-amber-400' : 'text-emerald-400'}`}>
                          {daysUntilExpiry <= 0 ? 'Expired' : `${daysUntilExpiry} days`}
                        </p>
                      </div>
                      <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                        <Eye size={18} className="text-slate-400" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
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
          title="Contract Details"
          size="lg"
        >
          {selectedContract && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-amber-400 font-mono text-sm mb-1">{selectedContract.contract_number}</p>
                  <h3 className="text-xl font-semibold text-white">{selectedContract.name}</h3>
                  <p className="text-slate-400">{selectedContract.partner_name}</p>
                </div>
                <div className="flex gap-2">
                  <StatusBadge status={selectedContract.status} />
                  <StatusBadge status={selectedContract.type} variant="outline">
                    {CONTRACT_TYPE_LABELS[selectedContract.type]}
                  </StatusBadge>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-800 rounded-lg p-4">
                  <p className="text-slate-400 text-sm">Contract Period</p>
                  <p className="text-white flex items-center gap-2">
                    <Calendar size={16} />
                    {selectedContract.start_date} - {selectedContract.end_date}
                  </p>
                </div>
                {selectedContract.value && (
                  <div className="bg-slate-800 rounded-lg p-4">
                    <p className="text-slate-400 text-sm">Contract Value</p>
                    <p className="text-white font-medium">
                      {new Intl.NumberFormat('en-SA', { style: 'currency', currency: selectedContract.currency || 'SAR' }).format(selectedContract.value)}
                    </p>
                  </div>
                )}
                <div className="bg-slate-800 rounded-lg p-4">
                  <p className="text-slate-400 text-sm">Auto Renewal</p>
                  <p className="text-white">{selectedContract.auto_renewal ? 'Yes' : 'No'}</p>
                </div>
                <div className="bg-slate-800 rounded-lg p-4">
                  <p className="text-slate-400 text-sm">Days Until Expiry</p>
                  <p className={`font-medium ${getDaysUntilExpiry(selectedContract.end_date) <= 30 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {getDaysUntilExpiry(selectedContract.end_date)} days
                  </p>
                </div>
              </div>

              {/* Description */}
              {selectedContract.description && (
                <div>
                  <h4 className="text-white font-medium mb-2">Description</h4>
                  <p className="text-slate-300">{selectedContract.description}</p>
                </div>
              )}

              {/* Obligations */}
              {selectedContract.obligations.length > 0 && (
                <div>
                  <h4 className="text-white font-medium mb-2">Obligations</h4>
                  <div className="space-y-2">
                    {selectedContract.obligations.map((ob) => (
                      <div key={ob.id} className="flex items-center justify-between bg-slate-800 rounded-lg p-3">
                        <div>
                          <p className="text-white">{ob.description}</p>
                          <p className="text-slate-400 text-sm">Due: {ob.due_date}</p>
                        </div>
                        <StatusBadge status={ob.status} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </Modal>

        {/* Add Contract Modal */}
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="New Contract"
          size="lg"
        >
          <AddContractForm onSubmit={handleAddContract} onCancel={() => setShowAddModal(false)} />
        </Modal>
      </div>
    </div>
  );
}

function AddContractForm({ onSubmit, onCancel }: { onSubmit: (data: CreateContractInput) => void; onCancel: () => void }) {
  const [formData, setFormData] = useState<CreateContractInput>({
    name: '',
    type: 'vendor',
    partner_name: '',
    partner_contact: '',
    description: '',
    start_date: '',
    end_date: '',
    value: undefined,
    currency: 'SAR',
    auto_renewal: false,
    renewal_notice_days: 30,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="block text-sm font-medium text-slate-300 mb-1">Contract Name</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Contract Type</label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as Contract['type'] })}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          >
            <option value="pks">PKS</option>
            <option value="vendor">Vendor</option>
            <option value="sewa">Sewa</option>
            <option value="nda">NDA</option>
            <option value="service">Service</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Partner Name</label>
          <input
            type="text"
            required
            value={formData.partner_name}
            onChange={(e) => setFormData({ ...formData, partner_name: e.target.value })}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Start Date</label>
          <input
            type="date"
            required
            value={formData.start_date}
            onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">End Date</label>
          <input
            type="date"
            required
            value={formData.end_date}
            onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Contract Value</label>
          <input
            type="number"
            value={formData.value || ''}
            onChange={(e) => setFormData({ ...formData, value: e.target.value ? Number(e.target.value) : undefined })}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Currency</label>
          <select
            value={formData.currency}
            onChange={(e) => setFormData({ ...formData, currency: e.target.value as 'SAR' | 'IDR' | 'USD' })}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          >
            <option value="SAR">SAR</option>
            <option value="IDR">IDR</option>
            <option value="USD">USD</option>
          </select>
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
        </div>
        <div className="col-span-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.auto_renewal}
              onChange={(e) => setFormData({ ...formData, auto_renewal: e.target.checked })}
              className="rounded border-slate-600 bg-slate-700 text-amber-500 focus:ring-amber-500"
            />
            <span className="text-sm text-slate-300">Auto Renewal</span>
          </label>
        </div>
      </div>
      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 border border-slate-600 text-slate-300 rounded-xl hover:bg-slate-700 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl transition-colors"
        >
          Create Contract
        </button>
      </div>
    </form>
  );
}

export { Contracts };
