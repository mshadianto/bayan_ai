import { useState, useEffect, useCallback } from 'react';
import { Header } from '../components/Layout';
import { Modal, ModalButton } from '../components/common/Modal';
import {
  treasuryApi,
  type BankAccount,
  type TreasuryTransaction,
  type TreasurySummary,
} from '../services/mockData/treasury';
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
import {
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Plus,
  ArrowRightLeft,
  CheckCircle,
  XCircle,
  Clock,
  Building2,
  Wallet,
  PiggyBank,
  LineChart,
  X,
} from 'lucide-react';

// Toast Component
function Toast({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed bottom-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border ${
      type === 'success'
        ? 'bg-emerald-900/90 border-emerald-600 text-emerald-100'
        : 'bg-red-900/90 border-red-600 text-red-100'
    }`}>
      {type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
      <span className="font-medium">{message}</span>
      <button onClick={onClose} className="ml-2 hover:opacity-70">
        <X size={16} />
      </button>
    </div>
  );
}

// Status Badge Component
function StatusBadge({ status }: { status: TreasuryTransaction['status'] }) {
  const config = {
    pending: { bg: 'bg-amber-900/50', text: 'text-amber-300', border: 'border-amber-600', icon: Clock },
    completed: { bg: 'bg-emerald-900/50', text: 'text-emerald-300', border: 'border-emerald-600', icon: CheckCircle },
    cancelled: { bg: 'bg-red-900/50', text: 'text-red-300', border: 'border-red-600', icon: XCircle },
  };
  const { bg, text, border, icon: Icon } = config[status];

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 ${bg} ${text} text-xs rounded-lg border ${border}`}>
      <Icon size={12} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

// Transaction Type Badge
function TypeBadge({ type }: { type: TreasuryTransaction['type'] }) {
  const config = {
    deposit: { bg: 'bg-emerald-900/50', text: 'text-emerald-300', border: 'border-emerald-600', label: 'Deposit' },
    withdrawal: { bg: 'bg-red-900/50', text: 'text-red-300', border: 'border-red-600', label: 'Withdrawal' },
    transfer: { bg: 'bg-blue-900/50', text: 'text-blue-300', border: 'border-blue-600', label: 'Transfer' },
  };
  const { bg, text, border, label } = config[type];

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 ${bg} ${text} text-xs rounded-lg border ${border}`}>
      {label}
    </span>
  );
}

// Account Card Component
function AccountCard({ account, onClick }: { account: BankAccount; onClick?: () => void }) {
  const icons = {
    operating: Building2,
    savings: PiggyBank,
    investment: LineChart,
    payroll: Wallet,
  };
  const Icon = icons[account.account_type];

  const colors = {
    operating: 'from-teal-500 to-emerald-600',
    savings: 'from-blue-500 to-indigo-600',
    investment: 'from-purple-500 to-pink-600',
    payroll: 'from-amber-500 to-orange-600',
  };

  return (
    <div
      className={`bg-card rounded-xl p-4 border border-border ${onClick ? 'cursor-pointer hover:bg-card/70 transition-colors' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 bg-gradient-to-br ${colors[account.account_type]} rounded-lg flex items-center justify-center`}>
          <Icon size={20} className="text-white" />
        </div>
        <div>
          <p className="text-sm font-medium text-content">{account.bank_name}</p>
          <p className="text-xs text-content-secondary">{account.account_number} - {account.account_type}</p>
        </div>
      </div>
      <p className="text-xl font-bold text-content">
        {account.currency} {account.current_balance.toLocaleString()}
      </p>
    </div>
  );
}

// Record Transaction Form
function RecordTransactionForm({
  accounts,
  onSubmit,
  onCancel
}: {
  accounts: BankAccount[];
  onSubmit: (data: { type: 'deposit' | 'withdrawal'; amount: number; account_id: string; description: string; reference: string }) => void;
  onCancel: () => void;
}) {
  const [type, setType] = useState<'deposit' | 'withdrawal'>('deposit');
  const [amount, setAmount] = useState('');
  const [accountId, setAccountId] = useState('');
  const [description, setDescription] = useState('');
  const [reference, setReference] = useState('');

  const handleSubmit = () => {
    if (!amount || !accountId || !description) return;
    onSubmit({
      type,
      amount: parseFloat(amount),
      account_id: accountId,
      description,
      reference: reference || `${type.toUpperCase()}-${Date.now()}`,
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-content-tertiary mb-2">Transaction Type</label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setType('deposit')}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
              type === 'deposit'
                ? 'bg-emerald-600 text-white'
                : 'bg-hover text-content-tertiary hover:bg-hover'
            }`}
          >
            Deposit
          </button>
          <button
            type="button"
            onClick={() => setType('withdrawal')}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
              type === 'withdrawal'
                ? 'bg-red-600 text-white'
                : 'bg-hover text-content-tertiary hover:bg-hover'
            }`}
          >
            Withdrawal
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-content-tertiary mb-2">Account</label>
        <select
          value={accountId}
          onChange={(e) => setAccountId(e.target.value)}
          className="w-full px-3 py-2 bg-input border border-border-subtle rounded-lg text-content focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        >
          <option value="">Select Account</option>
          {accounts.map(acc => (
            <option key={acc.id} value={acc.id}>
              {acc.bank_name} - {acc.account_type} ({acc.currency} {acc.current_balance.toLocaleString()})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-content-tertiary mb-2">Amount</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          className="w-full px-3 py-2 bg-input border border-border-subtle rounded-lg text-content placeholder-content-secondary focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-content-tertiary mb-2">Description</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter description"
          className="w-full px-3 py-2 bg-input border border-border-subtle rounded-lg text-content placeholder-content-secondary focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-content-tertiary mb-2">Reference (Optional)</label>
        <input
          type="text"
          value={reference}
          onChange={(e) => setReference(e.target.value)}
          placeholder="e.g., INV-2024-001"
          className="w-full px-3 py-2 bg-input border border-border-subtle rounded-lg text-content placeholder-content-secondary focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        />
      </div>

      <div className="flex gap-3 pt-4">
        <button
          onClick={onCancel}
          className="flex-1 px-4 py-2 bg-hover text-content-tertiary rounded-xl text-sm font-medium hover:bg-hover transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={!amount || !accountId || !description}
          className={`flex-1 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
            type === 'deposit'
              ? 'bg-emerald-600 text-white hover:bg-emerald-500'
              : 'bg-red-600 text-white hover:bg-red-500'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          Record {type === 'deposit' ? 'Deposit' : 'Withdrawal'}
        </button>
      </div>
    </div>
  );
}

// Transfer Funds Form
function TransferFundsForm({
  accounts,
  onSubmit,
  onCancel,
}: {
  accounts: BankAccount[];
  onSubmit: (data: { from_account_id: string; to_account_id: string; amount: number; description: string }) => void;
  onCancel: () => void;
}) {
  const [fromAccountId, setFromAccountId] = useState('');
  const [toAccountId, setToAccountId] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  const fromAccount = accounts.find(acc => acc.id === fromAccountId);
  const availableToAccounts = accounts.filter(acc => acc.id !== fromAccountId);

  const handleSubmit = () => {
    if (!fromAccountId || !toAccountId || !amount || !description) return;
    onSubmit({
      from_account_id: fromAccountId,
      to_account_id: toAccountId,
      amount: parseFloat(amount),
      description,
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-content-tertiary mb-2">From Account</label>
        <select
          value={fromAccountId}
          onChange={(e) => {
            setFromAccountId(e.target.value);
            if (toAccountId === e.target.value) setToAccountId('');
          }}
          className="w-full px-3 py-2 bg-input border border-border-subtle rounded-lg text-content focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        >
          <option value="">Select Source Account</option>
          {accounts.map(acc => (
            <option key={acc.id} value={acc.id}>
              {acc.bank_name} - {acc.account_type} ({acc.currency} {acc.current_balance.toLocaleString()})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-content-tertiary mb-2">To Account</label>
        <select
          value={toAccountId}
          onChange={(e) => setToAccountId(e.target.value)}
          disabled={!fromAccountId}
          className="w-full px-3 py-2 bg-input border border-border-subtle rounded-lg text-content focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:opacity-50"
        >
          <option value="">Select Destination Account</option>
          {availableToAccounts.map(acc => (
            <option key={acc.id} value={acc.id}>
              {acc.bank_name} - {acc.account_type} ({acc.currency} {acc.current_balance.toLocaleString()})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-content-tertiary mb-2">Amount</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter transfer amount"
          max={fromAccount?.current_balance}
          className="w-full px-3 py-2 bg-input border border-border-subtle rounded-lg text-content placeholder-content-secondary focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        />
        {fromAccount && (
          <p className="text-xs text-content-secondary mt-1">
            Available: {fromAccount.currency} {fromAccount.current_balance.toLocaleString()}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-content-tertiary mb-2">Description</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g., Monthly investment allocation"
          className="w-full px-3 py-2 bg-input border border-border-subtle rounded-lg text-content placeholder-content-secondary focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        />
      </div>

      <div className="flex gap-3 pt-4">
        <button
          onClick={onCancel}
          className="flex-1 px-4 py-2 bg-hover text-content-tertiary rounded-xl text-sm font-medium hover:bg-hover transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={!fromAccountId || !toAccountId || !amount || !description || (fromAccount && parseFloat(amount) > fromAccount.current_balance)}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Transfer Funds
        </button>
      </div>
    </div>
  );
}

// Transaction Detail Modal Content
function TransactionDetail({
  transaction,
  onApprove,
  onCancel,
}: {
  transaction: TreasuryTransaction;
  onApprove: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <TypeBadge type={transaction.type} />
        <StatusBadge status={transaction.status} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-content-secondary">Amount</p>
          <p className={`text-xl font-bold ${
            transaction.type === 'deposit' ? 'text-emerald-400' :
            transaction.type === 'withdrawal' ? 'text-red-400' : 'text-blue-400'
          }`}>
            {transaction.type === 'withdrawal' ? '-' : '+'}{transaction.currency} {transaction.amount.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-sm text-content-secondary">Reference</p>
          <p className="text-content font-medium">{transaction.reference}</p>
        </div>
      </div>

      <div>
        <p className="text-sm text-content-secondary">Description</p>
        <p className="text-content">{transaction.description}</p>
      </div>

      {transaction.type === 'transfer' && (
        <div className="bg-hover/50 rounded-lg p-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <p className="text-xs text-content-secondary">From</p>
              <p className="text-content text-sm">{transaction.from_account_name}</p>
            </div>
            <ArrowRightLeft size={20} className="text-content-secondary" />
            <div className="flex-1 text-right">
              <p className="text-xs text-content-secondary">To</p>
              <p className="text-content text-sm">{transaction.to_account_name}</p>
            </div>
          </div>
        </div>
      )}

      {(transaction.type === 'deposit' || transaction.type === 'withdrawal') && (
        <div>
          <p className="text-sm text-content-secondary">Account</p>
          <p className="text-content">
            {transaction.type === 'deposit' ? transaction.to_account_name : transaction.from_account_name}
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-content-secondary">Created By</p>
          <p className="text-content">{transaction.created_by}</p>
        </div>
        <div>
          <p className="text-sm text-content-secondary">Created At</p>
          <p className="text-content">{format(new Date(transaction.created_at), 'MMM d, yyyy HH:mm')}</p>
        </div>
      </div>

      {transaction.approved_by && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-content-secondary">Approved By</p>
            <p className="text-content">{transaction.approved_by}</p>
          </div>
          <div>
            <p className="text-sm text-content-secondary">Approved At</p>
            <p className="text-content">{transaction.approved_at ? format(new Date(transaction.approved_at), 'MMM d, yyyy HH:mm') : '-'}</p>
          </div>
        </div>
      )}

      {transaction.status === 'pending' && (
        <div className="flex gap-3 pt-4 border-t border-border">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 bg-hover text-content-tertiary rounded-xl text-sm font-medium hover:bg-hover transition-colors"
          >
            Cancel Transaction
          </button>
          <button
            onClick={onApprove}
            className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-500 transition-colors"
          >
            Approve & Complete
          </button>
        </div>
      )}
    </div>
  );
}

export function Treasury() {
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [transactions, setTransactions] = useState<TreasuryTransaction[]>([]);
  const [summary, setSummary] = useState<TreasurySummary | null>(null);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<TreasuryTransaction | null>(null);

  // Filter states
  const [statusFilter, setStatusFilter] = useState<'all' | TreasuryTransaction['status']>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | TreasuryTransaction['type']>('all');

  // Toast state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [accountsData, transactionsData, summaryData] = await Promise.all([
        treasuryApi.accounts.getAll(),
        treasuryApi.transactions.getAll(),
        treasuryApi.transactions.getSummary(),
      ]);
      setAccounts(accountsData);
      setTransactions(transactionsData);
      setSummary(summaryData);
    } catch (err) {
      console.error('Failed to load treasury data:', err);
      setToast({ message: 'Failed to load treasury data', type: 'error' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRecordTransaction = async (data: { type: 'deposit' | 'withdrawal'; amount: number; account_id: string; description: string; reference: string }) => {
    try {
      await treasuryApi.transactions.record({
        ...data,
        currency: 'SAR',
        created_by: 'Current User',
      });
      setShowRecordModal(false);
      setToast({ message: `${data.type === 'deposit' ? 'Deposit' : 'Withdrawal'} recorded successfully`, type: 'success' });
      loadData();
    } catch (err) {
      setToast({ message: 'Failed to record transaction', type: 'error' });
    }
  };

  const handleTransferFunds = async (data: { from_account_id: string; to_account_id: string; amount: number; description: string }) => {
    try {
      await treasuryApi.transactions.transfer({
        ...data,
        currency: 'SAR',
        created_by: 'Current User',
      });
      setShowTransferModal(false);
      setToast({ message: 'Transfer initiated successfully', type: 'success' });
      loadData();
    } catch (err) {
      setToast({ message: err instanceof Error ? err.message : 'Failed to transfer funds', type: 'error' });
    }
  };

  const handleApproveTransaction = async () => {
    if (!selectedTransaction) return;
    try {
      await treasuryApi.transactions.approve({
        transactionId: selectedTransaction.id,
        approverName: 'Finance Manager',
      });
      setSelectedTransaction(null);
      setToast({ message: 'Transaction approved and completed', type: 'success' });
      loadData();
    } catch (err) {
      setToast({ message: 'Failed to approve transaction', type: 'error' });
    }
  };

  const handleCancelTransaction = async () => {
    if (!selectedTransaction) return;
    try {
      await treasuryApi.transactions.cancel(selectedTransaction.id);
      setSelectedTransaction(null);
      setToast({ message: 'Transaction cancelled', type: 'success' });
      loadData();
    } catch (err) {
      setToast({ message: 'Failed to cancel transaction', type: 'error' });
    }
  };

  const filteredTransactions = transactions.filter(trx => {
    if (statusFilter !== 'all' && trx.status !== statusFilter) return false;
    if (typeFilter !== 'all' && trx.type !== typeFilter) return false;
    return true;
  });

  // Prepare chart data
  const chartData = transactions
    .filter(trx => trx.status === 'completed')
    .slice(0, 10)
    .reverse()
    .map((trx, index) => ({
      date: format(new Date(trx.created_at), 'MMM d'),
      balance: summary?.total_balance ? summary.total_balance - (index * 50000) : 0,
    }));

  const totalBalance = summary?.total_balance || 0;
  const isLowBalance = summary ? summary.operating_balance < 100000 : false;
  const isHighBalance = summary ? summary.savings_balance > 1000000 : false;

  return (
    <div>
      <Header title="Treasury Dashboard" subtitle="Balance tracking and transaction management" />

      <div className="p-6">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
          </div>
        ) : (
          <>
            {/* Action Buttons */}
            <div className="flex gap-3 mb-6">
              <button
                onClick={() => setShowRecordModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-xl text-sm font-medium hover:bg-teal-500 transition-colors"
              >
                <Plus size={18} />
                Record Transaction
              </button>
              <button
                onClick={() => setShowTransferModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-500 transition-colors"
              >
                <ArrowRightLeft size={18} />
                Transfer Funds
              </button>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-card rounded-xl p-6 border border-border">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-xl flex items-center justify-center">
                    <Wallet size={24} className="text-white" />
                  </div>
                  {isLowBalance && (
                    <span className="px-2.5 py-1 bg-red-900/50 text-red-300 text-xs rounded-lg border border-red-600">
                      Low
                    </span>
                  )}
                </div>
                <p className="text-sm text-content-secondary">Total Balance</p>
                <p className="text-2xl font-bold text-content mt-1">
                  SAR {totalBalance.toLocaleString()}
                </p>
              </div>

              <div className="bg-card rounded-xl p-6 border border-border">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center mb-4">
                  <TrendingUp size={24} className="text-white" />
                </div>
                <p className="text-sm text-content-secondary">Today's Deposits</p>
                <p className="text-2xl font-bold text-emerald-400 mt-1">
                  +SAR {(summary?.today_deposits || 0).toLocaleString()}
                </p>
              </div>

              <div className="bg-card rounded-xl p-6 border border-border">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center mb-4">
                  <TrendingDown size={24} className="text-white" />
                </div>
                <p className="text-sm text-content-secondary">Today's Withdrawals</p>
                <p className="text-2xl font-bold text-red-400 mt-1">
                  -SAR {(summary?.today_withdrawals || 0).toLocaleString()}
                </p>
              </div>

              <div className="bg-card rounded-xl p-6 border border-border">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center mb-4">
                  <Clock size={24} className="text-white" />
                </div>
                <p className="text-sm text-content-secondary">Pending Transactions</p>
                <p className="text-2xl font-bold text-amber-400 mt-1">
                  {summary?.pending_transactions || 0}
                </p>
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
                <AlertCircle size={20} className={isLowBalance ? 'text-red-400' : 'text-blue-400'} />
                <div>
                  <p className={`font-medium ${isLowBalance ? 'text-red-300' : 'text-blue-300'}`}>
                    {isLowBalance ? 'Liquidity Warning' : 'Surplus Investment Opportunity'}
                  </p>
                  <p className={`text-sm mt-1 ${isLowBalance ? 'text-red-400' : 'text-blue-400'}`}>
                    {isLowBalance
                      ? 'Operating balance is below SAR 100,000. Consider liquidity management.'
                      : 'Savings balance exceeds SAR 1,000,000. Consider Sukuk investment for optimal returns.'}
                  </p>
                </div>
              </div>
            )}

            {/* Bank Accounts */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-content mb-4">Bank Accounts</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {accounts.map(account => (
                  <AccountCard key={account.id} account={account} />
                ))}
              </div>
            </div>

            {/* Balance Chart */}
            <div className="bg-card rounded-xl border border-border p-6 mb-6">
              <h3 className="text-lg font-semibold text-content mb-4">Balance Trend</h3>
              <div className="h-64">
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
                      tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                    />
                    <Tooltip
                      formatter={(value: number) => [`SAR ${value.toLocaleString()}`, 'Balance']}
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

            {/* Transactions List */}
            <div className="bg-card rounded-xl border border-border">
              <div className="p-4 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h3 className="font-semibold text-content">Recent Transactions</h3>
                <div className="flex gap-2">
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value as 'all' | TreasuryTransaction['type'])}
                    className="px-3 py-1.5 bg-input border border-border-subtle rounded-lg text-sm text-content"
                  >
                    <option value="all">All Types</option>
                    <option value="deposit">Deposits</option>
                    <option value="withdrawal">Withdrawals</option>
                    <option value="transfer">Transfers</option>
                  </select>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as 'all' | TreasuryTransaction['status'])}
                    className="px-3 py-1.5 bg-input border border-border-subtle rounded-lg text-sm text-content"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-input">
                    <tr>
                      <th className="text-left p-4 text-sm font-medium text-content-secondary">Date</th>
                      <th className="text-left p-4 text-sm font-medium text-content-secondary">Type</th>
                      <th className="text-left p-4 text-sm font-medium text-content-secondary">Description</th>
                      <th className="text-left p-4 text-sm font-medium text-content-secondary">Reference</th>
                      <th className="text-right p-4 text-sm font-medium text-content-secondary">Amount</th>
                      <th className="text-left p-4 text-sm font-medium text-content-secondary">Status</th>
                      <th className="text-left p-4 text-sm font-medium text-content-secondary">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.map((trx) => (
                      <tr key={trx.id} className="border-t border-border hover:bg-card">
                        <td className="p-4 text-content-tertiary">
                          {format(new Date(trx.created_at), 'MMM d, yyyy')}
                        </td>
                        <td className="p-4">
                          <TypeBadge type={trx.type} />
                        </td>
                        <td className="p-4 text-content max-w-xs truncate">
                          {trx.description}
                        </td>
                        <td className="p-4 text-content-secondary text-sm">
                          {trx.reference}
                        </td>
                        <td className={`p-4 text-right font-medium ${
                          trx.type === 'deposit' ? 'text-emerald-400' :
                          trx.type === 'withdrawal' ? 'text-red-400' : 'text-blue-400'
                        }`}>
                          {trx.type === 'withdrawal' ? '-' : '+'}{trx.currency} {trx.amount.toLocaleString()}
                        </td>
                        <td className="p-4">
                          <StatusBadge status={trx.status} />
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => setSelectedTransaction(trx)}
                            className="text-teal-400 hover:text-teal-300 text-sm font-medium"
                          >
                            View
                          </button>
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

      {/* Record Transaction Modal */}
      <Modal
        isOpen={showRecordModal}
        onClose={() => setShowRecordModal(false)}
        title="Record Transaction"
        size="md"
      >
        <RecordTransactionForm
          accounts={accounts}
          onSubmit={handleRecordTransaction}
          onCancel={() => setShowRecordModal(false)}
        />
      </Modal>

      {/* Transfer Funds Modal */}
      <Modal
        isOpen={showTransferModal}
        onClose={() => setShowTransferModal(false)}
        title="Transfer Funds"
        size="md"
      >
        <TransferFundsForm
          accounts={accounts}
          onSubmit={handleTransferFunds}
          onCancel={() => setShowTransferModal(false)}
        />
      </Modal>

      {/* Transaction Detail Modal */}
      <Modal
        isOpen={!!selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
        title={`Transaction ${selectedTransaction?.id}`}
        size="md"
        footer={selectedTransaction?.status !== 'pending' ? (
          <ModalButton onClick={() => setSelectedTransaction(null)} variant="secondary">
            Close
          </ModalButton>
        ) : undefined}
      >
        {selectedTransaction && (
          <TransactionDetail
            transaction={selectedTransaction}
            onApprove={handleApproveTransaction}
            onCancel={handleCancelTransaction}
          />
        )}
      </Modal>

      {/* Toast Notification */}
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  );
}

export default Treasury;
