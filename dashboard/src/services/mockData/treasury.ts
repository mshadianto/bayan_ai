// Treasury Mock API - Full CRUD operations for treasury management

// Types
export type TransactionType = 'deposit' | 'withdrawal' | 'transfer';
export type TransactionStatus = 'pending' | 'completed' | 'cancelled';

export interface BankAccount {
  id: string;
  account_number: string;
  bank_name: string;
  account_type: 'operating' | 'savings' | 'investment' | 'payroll';
  currency: 'SAR' | 'IDR' | 'USD';
  current_balance: number;
  is_active: boolean;
}

export interface TreasuryTransaction {
  id: string;
  type: TransactionType;
  amount: number;
  currency: 'SAR' | 'IDR' | 'USD';
  description: string;
  reference: string;
  from_account_id?: string;
  from_account_name?: string;
  to_account_id?: string;
  to_account_name?: string;
  status: TransactionStatus;
  created_by: string;
  approved_by?: string;
  approved_at?: string;
  completed_at?: string;
  created_at: string;
}

export interface TreasurySummary {
  total_balance: number;
  operating_balance: number;
  savings_balance: number;
  investment_balance: number;
  today_deposits: number;
  today_withdrawals: number;
  pending_transactions: number;
}

// Input types
export interface RecordTransactionInput {
  type: TransactionType;
  amount: number;
  currency: 'SAR' | 'IDR' | 'USD';
  description: string;
  reference: string;
  account_id: string;
  created_by: string;
}

export interface TransferFundsInput {
  amount: number;
  currency: 'SAR' | 'IDR' | 'USD';
  from_account_id: string;
  to_account_id: string;
  description: string;
  created_by: string;
}

export interface ApproveTransactionInput {
  transactionId: string;
  approverName: string;
}

// Mock bank accounts
const mockBankAccounts: BankAccount[] = [
  {
    id: 'ACC001',
    account_number: '****4521',
    bank_name: 'Al Rajhi Bank',
    account_type: 'operating',
    currency: 'SAR',
    current_balance: 425000,
    is_active: true,
  },
  {
    id: 'ACC002',
    account_number: '****7832',
    bank_name: 'Al Rajhi Bank',
    account_type: 'savings',
    currency: 'SAR',
    current_balance: 1250000,
    is_active: true,
  },
  {
    id: 'ACC003',
    account_number: '****2145',
    bank_name: 'Saudi National Bank',
    account_type: 'investment',
    currency: 'SAR',
    current_balance: 3500000,
    is_active: true,
  },
  {
    id: 'ACC004',
    account_number: '****9087',
    bank_name: 'Al Rajhi Bank',
    account_type: 'payroll',
    currency: 'SAR',
    current_balance: 180000,
    is_active: true,
  },
  {
    id: 'ACC005',
    account_number: '****6543',
    bank_name: 'Bank Mandiri',
    account_type: 'operating',
    currency: 'IDR',
    current_balance: 2500000000,
    is_active: true,
  },
];

// Mock transactions
const mockTransactions: TreasuryTransaction[] = [
  {
    id: 'TRX001',
    type: 'deposit',
    amount: 150000,
    currency: 'SAR',
    description: 'Client payment - PT Mitra Sukses',
    reference: 'INV-2024-0089',
    to_account_id: 'ACC001',
    to_account_name: 'Al Rajhi - Operating',
    status: 'completed',
    created_by: 'Ahmad Fahri',
    approved_by: 'Finance Manager',
    approved_at: '2024-01-20T09:30:00Z',
    completed_at: '2024-01-20T10:00:00Z',
    created_at: '2024-01-20T09:00:00Z',
  },
  {
    id: 'TRX002',
    type: 'withdrawal',
    amount: 75000,
    currency: 'SAR',
    description: 'Vendor payment - Office supplies',
    reference: 'PO-2024-0156',
    from_account_id: 'ACC001',
    from_account_name: 'Al Rajhi - Operating',
    status: 'completed',
    created_by: 'Siti Aminah',
    approved_by: 'Finance Manager',
    approved_at: '2024-01-19T14:00:00Z',
    completed_at: '2024-01-19T15:30:00Z',
    created_at: '2024-01-19T13:30:00Z',
  },
  {
    id: 'TRX003',
    type: 'transfer',
    amount: 500000,
    currency: 'SAR',
    description: 'Monthly investment allocation',
    reference: 'INT-TRF-2024-01',
    from_account_id: 'ACC002',
    from_account_name: 'Al Rajhi - Savings',
    to_account_id: 'ACC003',
    to_account_name: 'SNB - Investment',
    status: 'completed',
    created_by: 'Treasury Team',
    approved_by: 'CFO',
    approved_at: '2024-01-18T11:00:00Z',
    completed_at: '2024-01-18T12:00:00Z',
    created_at: '2024-01-18T10:00:00Z',
  },
  {
    id: 'TRX004',
    type: 'transfer',
    amount: 200000,
    currency: 'SAR',
    description: 'Payroll funding for January',
    reference: 'PAY-TRF-2024-01',
    from_account_id: 'ACC001',
    from_account_name: 'Al Rajhi - Operating',
    to_account_id: 'ACC004',
    to_account_name: 'Al Rajhi - Payroll',
    status: 'pending',
    created_by: 'HR Finance',
    created_at: '2024-01-21T08:00:00Z',
  },
  {
    id: 'TRX005',
    type: 'deposit',
    amount: 250000,
    currency: 'SAR',
    description: 'Investment return - Sukuk maturity',
    reference: 'SUK-RET-2024-Q1',
    to_account_id: 'ACC002',
    to_account_name: 'Al Rajhi - Savings',
    status: 'pending',
    created_by: 'Investment Team',
    created_at: '2024-01-21T09:00:00Z',
  },
];

// Helper function to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Treasury API
export const treasuryApi = {
  accounts: {
    getAll: async (): Promise<BankAccount[]> => {
      await delay(300);
      return mockBankAccounts.filter(acc => acc.is_active);
    },

    getById: async (id: string): Promise<BankAccount | undefined> => {
      await delay(200);
      return mockBankAccounts.find(acc => acc.id === id);
    },

    getByType: async (type: BankAccount['account_type']): Promise<BankAccount[]> => {
      await delay(200);
      return mockBankAccounts.filter(acc => acc.account_type === type && acc.is_active);
    },
  },

  transactions: {
    getAll: async (): Promise<TreasuryTransaction[]> => {
      await delay(400);
      return [...mockTransactions].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    },

    getById: async (id: string): Promise<TreasuryTransaction | undefined> => {
      await delay(200);
      return mockTransactions.find(trx => trx.id === id);
    },

    getByStatus: async (status: TransactionStatus): Promise<TreasuryTransaction[]> => {
      await delay(300);
      return mockTransactions.filter(trx => trx.status === status);
    },

    getPending: async (): Promise<TreasuryTransaction[]> => {
      await delay(300);
      return mockTransactions.filter(trx => trx.status === 'pending');
    },

    getSummary: async (): Promise<TreasurySummary> => {
      await delay(300);
      const today = new Date().toISOString().split('T')[0];
      const todayTransactions = mockTransactions.filter(
        trx => trx.created_at.startsWith(today) && trx.status === 'completed'
      );

      return {
        total_balance: mockBankAccounts.reduce((sum, acc) => sum + acc.current_balance, 0),
        operating_balance: mockBankAccounts
          .filter(acc => acc.account_type === 'operating')
          .reduce((sum, acc) => sum + acc.current_balance, 0),
        savings_balance: mockBankAccounts
          .filter(acc => acc.account_type === 'savings')
          .reduce((sum, acc) => sum + acc.current_balance, 0),
        investment_balance: mockBankAccounts
          .filter(acc => acc.account_type === 'investment')
          .reduce((sum, acc) => sum + acc.current_balance, 0),
        today_deposits: todayTransactions
          .filter(trx => trx.type === 'deposit')
          .reduce((sum, trx) => sum + trx.amount, 0),
        today_withdrawals: todayTransactions
          .filter(trx => trx.type === 'withdrawal')
          .reduce((sum, trx) => sum + trx.amount, 0),
        pending_transactions: mockTransactions.filter(trx => trx.status === 'pending').length,
      };
    },

    record: async (input: RecordTransactionInput): Promise<TreasuryTransaction> => {
      await delay(500);
      const account = mockBankAccounts.find(acc => acc.id === input.account_id);
      if (!account) throw new Error('Account not found');

      const newTransaction: TreasuryTransaction = {
        id: `TRX${String(mockTransactions.length + 1).padStart(3, '0')}`,
        type: input.type,
        amount: input.amount,
        currency: input.currency,
        description: input.description,
        reference: input.reference,
        status: 'pending',
        created_by: input.created_by,
        created_at: new Date().toISOString(),
      };

      if (input.type === 'deposit') {
        newTransaction.to_account_id = account.id;
        newTransaction.to_account_name = `${account.bank_name} - ${account.account_type}`;
      } else {
        newTransaction.from_account_id = account.id;
        newTransaction.from_account_name = `${account.bank_name} - ${account.account_type}`;
      }

      mockTransactions.unshift(newTransaction);
      return newTransaction;
    },

    transfer: async (input: TransferFundsInput): Promise<TreasuryTransaction> => {
      await delay(500);
      const fromAccount = mockBankAccounts.find(acc => acc.id === input.from_account_id);
      const toAccount = mockBankAccounts.find(acc => acc.id === input.to_account_id);

      if (!fromAccount || !toAccount) throw new Error('Account not found');
      if (fromAccount.current_balance < input.amount) {
        throw new Error('Insufficient balance');
      }

      const newTransaction: TreasuryTransaction = {
        id: `TRX${String(mockTransactions.length + 1).padStart(3, '0')}`,
        type: 'transfer',
        amount: input.amount,
        currency: input.currency,
        description: input.description,
        reference: `TRF-${Date.now()}`,
        from_account_id: fromAccount.id,
        from_account_name: `${fromAccount.bank_name} - ${fromAccount.account_type}`,
        to_account_id: toAccount.id,
        to_account_name: `${toAccount.bank_name} - ${toAccount.account_type}`,
        status: 'pending',
        created_by: input.created_by,
        created_at: new Date().toISOString(),
      };

      mockTransactions.unshift(newTransaction);
      return newTransaction;
    },

    approve: async (input: ApproveTransactionInput): Promise<TreasuryTransaction> => {
      await delay(400);
      const transaction = mockTransactions.find(trx => trx.id === input.transactionId);
      if (!transaction) throw new Error('Transaction not found');

      const now = new Date().toISOString();
      transaction.status = 'completed';
      transaction.approved_by = input.approverName;
      transaction.approved_at = now;
      transaction.completed_at = now;

      // Update account balances
      if (transaction.type === 'deposit' && transaction.to_account_id) {
        const account = mockBankAccounts.find(acc => acc.id === transaction.to_account_id);
        if (account) account.current_balance += transaction.amount;
      } else if (transaction.type === 'withdrawal' && transaction.from_account_id) {
        const account = mockBankAccounts.find(acc => acc.id === transaction.from_account_id);
        if (account) account.current_balance -= transaction.amount;
      } else if (transaction.type === 'transfer') {
        const fromAccount = mockBankAccounts.find(acc => acc.id === transaction.from_account_id);
        const toAccount = mockBankAccounts.find(acc => acc.id === transaction.to_account_id);
        if (fromAccount) fromAccount.current_balance -= transaction.amount;
        if (toAccount) toAccount.current_balance += transaction.amount;
      }

      return transaction;
    },

    cancel: async (transactionId: string): Promise<TreasuryTransaction> => {
      await delay(300);
      const transaction = mockTransactions.find(trx => trx.id === transactionId);
      if (!transaction) throw new Error('Transaction not found');
      if (transaction.status !== 'pending') {
        throw new Error('Only pending transactions can be cancelled');
      }

      transaction.status = 'cancelled';
      return transaction;
    },
  },
};
