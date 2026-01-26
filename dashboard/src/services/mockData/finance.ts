import type { FinancialRequest, FinancialRequestSummary } from '../../types';

// Simulated API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const mockFinancialRequests: FinancialRequest[] = [
  {
    id: 'FR001',
    request_number: 'REQ-2025-001',
    type: 'payment',
    title: 'Pembayaran Sewa Gedung Kantor Q1',
    description: 'Pembayaran sewa gedung kantor untuk periode Januari-Maret 2025',
    amount: 150000,
    currency: 'SAR',
    requester_id: 'EMP001',
    requester_name: 'Ahmad Fauzi',
    requester_unit: 'General Affairs',
    gl_code: '6100',
    gl_name: 'Beban Sewa',
    cost_center: 'CC001',
    beneficiary_name: 'Al-Rajhi Real Estate',
    beneficiary_bank: 'Al Rajhi Bank',
    beneficiary_account: '1234567890',
    documents: [
      { id: 'DOC001', name: 'Invoice_Sewa_Q1.pdf', type: 'invoice', url: '#', uploaded_at: '2025-01-15T10:00:00Z' },
      { id: 'DOC002', name: 'Kontrak_Sewa_2025.pdf', type: 'contract', url: '#', uploaded_at: '2025-01-15T10:05:00Z' },
    ],
    status: 'pending_mudir',
    current_approver: 'Mudir 1 & Mudir 3',
    approvals: [
      { id: 'APR001', step: 1, role: 'head_division', approver_id: 'EMP010', approver_name: 'Hasan Abdullah', status: 'approved', action_at: '2025-01-16T09:00:00Z' },
      { id: 'APR002', step: 2, role: 'finance_staff', approver_id: 'EMP020', approver_name: 'Fatimah Zahra', status: 'approved', comments: 'Dokumen lengkap, GL code sesuai', action_at: '2025-01-16T14:00:00Z' },
      { id: 'APR003', step: 3, role: 'finance_head', approver_id: 'EMP030', approver_name: 'Muhammad Rizki', status: 'approved', action_at: '2025-01-17T10:00:00Z' },
      { id: 'APR004', step: 4, role: 'mudir_1', status: 'pending' },
      { id: 'APR005', step: 4, role: 'mudir_3', status: 'pending' },
    ],
    created_at: '2025-01-15T09:30:00Z',
    updated_at: '2025-01-17T10:00:00Z',
  },
  {
    id: 'FR002',
    request_number: 'REQ-2025-002',
    type: 'transfer',
    title: 'Transfer Dana Operasional Madinah',
    description: 'Transfer dana operasional untuk kantor cabang Madinah bulan Januari',
    amount: 75000,
    currency: 'SAR',
    requester_id: 'EMP002',
    requester_name: 'Siti Aminah',
    requester_unit: 'Operations',
    gl_code: '5200',
    gl_name: 'Beban Operasional',
    cost_center: 'CC002',
    beneficiary_name: 'BPKH Limited - Madinah Branch',
    beneficiary_bank: 'Saudi National Bank',
    beneficiary_account: '9876543210',
    documents: [
      { id: 'DOC003', name: 'Rincian_Kebutuhan_Operasional.xlsx', type: 'other', url: '#', uploaded_at: '2025-01-18T08:00:00Z' },
    ],
    status: 'pending_finance_staff',
    current_approver: 'Finance Staff',
    approvals: [
      { id: 'APR006', step: 1, role: 'head_division', approver_id: 'EMP011', approver_name: 'Umar Hakim', status: 'approved', action_at: '2025-01-18T11:00:00Z' },
      { id: 'APR007', step: 2, role: 'finance_staff', status: 'pending' },
    ],
    created_at: '2025-01-18T07:30:00Z',
    updated_at: '2025-01-18T11:00:00Z',
  },
  {
    id: 'FR003',
    request_number: 'REQ-2025-003',
    type: 'reimbursement',
    title: 'Reimbursement Perjalanan Dinas Jeddah',
    description: 'Penggantian biaya perjalanan dinas ke Jeddah untuk meeting dengan vendor',
    amount: 5500,
    currency: 'SAR',
    requester_id: 'EMP003',
    requester_name: 'Budi Santoso',
    requester_unit: 'Procurement',
    gl_code: '6300',
    gl_name: 'Beban Perjalanan Dinas',
    cost_center: 'CC003',
    documents: [
      { id: 'DOC004', name: 'Tiket_Pesawat.pdf', type: 'receipt', url: '#', uploaded_at: '2025-01-19T10:00:00Z' },
      { id: 'DOC005', name: 'Invoice_Hotel.pdf', type: 'invoice', url: '#', uploaded_at: '2025-01-19T10:05:00Z' },
      { id: 'DOC006', name: 'Kwitansi_Transport.pdf', type: 'receipt', url: '#', uploaded_at: '2025-01-19T10:10:00Z' },
    ],
    status: 'completed',
    approvals: [
      { id: 'APR008', step: 1, role: 'head_division', approver_id: 'EMP012', approver_name: 'Khalid Rahman', status: 'approved', action_at: '2025-01-19T14:00:00Z' },
      { id: 'APR009', step: 2, role: 'finance_staff', approver_id: 'EMP020', approver_name: 'Fatimah Zahra', status: 'approved', action_at: '2025-01-20T09:00:00Z' },
      { id: 'APR010', step: 3, role: 'finance_head', approver_id: 'EMP030', approver_name: 'Muhammad Rizki', status: 'approved', action_at: '2025-01-20T11:00:00Z' },
      { id: 'APR011', step: 4, role: 'mudir_1', approver_id: 'EMP040', approver_name: 'Dr. Abdullah Saleh', status: 'approved', action_at: '2025-01-20T14:00:00Z' },
      { id: 'APR012', step: 4, role: 'mudir_3', approver_id: 'EMP041', approver_name: 'Dr. Ibrahim Hassan', status: 'approved', action_at: '2025-01-20T15:00:00Z' },
    ],
    created_at: '2025-01-19T09:00:00Z',
    updated_at: '2025-01-21T10:00:00Z',
    completed_at: '2025-01-21T10:00:00Z',
    transaction_reference: 'TRX-2025-0123',
    transaction_date: '2025-01-21T10:00:00Z',
    transaction_proof_url: '#',
  },
  {
    id: 'FR004',
    request_number: 'REQ-2025-004',
    type: 'advance',
    title: 'Cash Advance Kegiatan Training',
    description: 'Uang muka untuk pelaksanaan training karyawan',
    amount: 25000,
    currency: 'SAR',
    requester_id: 'EMP004',
    requester_name: 'Dewi Kartika',
    requester_unit: 'Human Resources',
    gl_code: '1500',
    gl_name: 'Uang Muka',
    cost_center: 'CC004',
    documents: [
      { id: 'DOC007', name: 'Proposal_Training.pdf', type: 'other', url: '#', uploaded_at: '2025-01-20T08:00:00Z' },
      { id: 'DOC008', name: 'Quotation_Venue.pdf', type: 'quotation', url: '#', uploaded_at: '2025-01-20T08:05:00Z' },
    ],
    status: 'pending_head',
    current_approver: 'Head Division HR',
    approvals: [
      { id: 'APR013', step: 1, role: 'head_division', status: 'pending' },
    ],
    created_at: '2025-01-20T07:30:00Z',
  },
  {
    id: 'FR005',
    request_number: 'REQ-2025-005',
    type: 'payment',
    title: 'Pembayaran Vendor Catering',
    description: 'Pembayaran tagihan catering untuk jamaah bulan Desember 2024',
    amount: 280000,
    currency: 'SAR',
    requester_id: 'EMP005',
    requester_name: 'Rahmat Hidayat',
    requester_unit: 'Food & Beverage',
    gl_code: '5100',
    gl_name: 'Beban Catering',
    cost_center: 'CC005',
    beneficiary_name: 'Al-Madinah Catering Co.',
    beneficiary_bank: 'Alinma Bank',
    beneficiary_account: '5555666677',
    documents: [
      { id: 'DOC009', name: 'Invoice_Catering_Des2024.pdf', type: 'invoice', url: '#', uploaded_at: '2025-01-21T09:00:00Z' },
      { id: 'DOC010', name: 'Delivery_Receipt.pdf', type: 'receipt', url: '#', uploaded_at: '2025-01-21T09:05:00Z' },
    ],
    status: 'pending_finance_head',
    current_approver: 'Head Division Finance',
    approvals: [
      { id: 'APR014', step: 1, role: 'head_division', approver_id: 'EMP013', approver_name: 'Yusuf Ismail', status: 'approved', action_at: '2025-01-21T11:00:00Z' },
      { id: 'APR015', step: 2, role: 'finance_staff', approver_id: 'EMP021', approver_name: 'Aisyah Putri', status: 'approved', comments: 'Verified with PO-2024-089', action_at: '2025-01-21T14:00:00Z' },
      { id: 'APR016', step: 3, role: 'finance_head', status: 'pending' },
    ],
    created_at: '2025-01-21T08:30:00Z',
    updated_at: '2025-01-21T14:00:00Z',
  },
  {
    id: 'FR006',
    request_number: 'REQ-2025-006',
    type: 'payment',
    title: 'Pembayaran Maintenance Bus',
    description: 'Biaya perawatan dan servis berkala armada bus',
    amount: 45000,
    currency: 'SAR',
    requester_id: 'EMP006',
    requester_name: 'Agus Wijaya',
    requester_unit: 'Transportation',
    gl_code: '6200',
    gl_name: 'Beban Pemeliharaan',
    cost_center: 'CC006',
    beneficiary_name: 'Saudi Auto Service',
    beneficiary_bank: 'Riyad Bank',
    beneficiary_account: '7777888899',
    documents: [
      { id: 'DOC011', name: 'Invoice_Service.pdf', type: 'invoice', url: '#', uploaded_at: '2025-01-22T08:00:00Z' },
    ],
    status: 'rejected',
    approvals: [
      { id: 'APR017', step: 1, role: 'head_division', approver_id: 'EMP014', approver_name: 'Salim Mansur', status: 'approved', action_at: '2025-01-22T10:00:00Z' },
      { id: 'APR018', step: 2, role: 'finance_staff', approver_id: 'EMP020', approver_name: 'Fatimah Zahra', status: 'returned', comments: 'Dokumen quotation pembanding tidak lengkap, mohon dilengkapi min. 2 vendor', action_at: '2025-01-22T15:00:00Z' },
    ],
    created_at: '2025-01-22T07:30:00Z',
    updated_at: '2025-01-22T15:00:00Z',
  },
  {
    id: 'FR007',
    request_number: 'REQ-2025-007',
    type: 'transfer',
    title: 'Transfer Gaji Karyawan Januari',
    description: 'Transfer pembayaran gaji karyawan periode Januari 2025',
    amount: 850000,
    currency: 'SAR',
    requester_id: 'EMP007',
    requester_name: 'Nurul Hidayah',
    requester_unit: 'Human Resources',
    gl_code: '5000',
    gl_name: 'Beban Gaji',
    cost_center: 'CC007',
    beneficiary_name: 'Multiple Employees',
    documents: [
      { id: 'DOC012', name: 'Payroll_Summary_Jan2025.xlsx', type: 'other', url: '#', uploaded_at: '2025-01-25T08:00:00Z' },
      { id: 'DOC013', name: 'Approval_Payroll.pdf', type: 'other', url: '#', uploaded_at: '2025-01-25T08:05:00Z' },
    ],
    status: 'approved',
    approvals: [
      { id: 'APR019', step: 1, role: 'head_division', approver_id: 'EMP015', approver_name: 'Dr. Hana Safitri', status: 'approved', action_at: '2025-01-25T09:00:00Z' },
      { id: 'APR020', step: 2, role: 'finance_staff', approver_id: 'EMP020', approver_name: 'Fatimah Zahra', status: 'approved', action_at: '2025-01-25T10:00:00Z' },
      { id: 'APR021', step: 3, role: 'finance_head', approver_id: 'EMP030', approver_name: 'Muhammad Rizki', status: 'approved', action_at: '2025-01-25T11:00:00Z' },
      { id: 'APR022', step: 4, role: 'mudir_1', approver_id: 'EMP040', approver_name: 'Dr. Abdullah Saleh', status: 'approved', action_at: '2025-01-25T14:00:00Z' },
      { id: 'APR023', step: 4, role: 'mudir_3', approver_id: 'EMP041', approver_name: 'Dr. Ibrahim Hassan', status: 'approved', action_at: '2025-01-25T14:30:00Z' },
    ],
    created_at: '2025-01-25T07:30:00Z',
    updated_at: '2025-01-25T14:30:00Z',
  },
  {
    id: 'FR008',
    request_number: 'REQ-2025-008',
    type: 'payment',
    title: 'Pembayaran Listrik & Utilities',
    description: 'Tagihan listrik, air, dan internet kantor pusat',
    amount: 32000,
    currency: 'SAR',
    requester_id: 'EMP008',
    requester_name: 'Eko Prasetyo',
    requester_unit: 'General Affairs',
    gl_code: '6150',
    gl_name: 'Beban Utilities',
    cost_center: 'CC001',
    beneficiary_name: 'Saudi Electricity Company',
    documents: [
      { id: 'DOC014', name: 'Bill_Electricity_Jan.pdf', type: 'invoice', url: '#', uploaded_at: '2025-01-23T08:00:00Z' },
      { id: 'DOC015', name: 'Bill_Water_Jan.pdf', type: 'invoice', url: '#', uploaded_at: '2025-01-23T08:05:00Z' },
      { id: 'DOC016', name: 'Bill_Internet_Jan.pdf', type: 'invoice', url: '#', uploaded_at: '2025-01-23T08:10:00Z' },
    ],
    status: 'draft',
    approvals: [],
    created_at: '2025-01-23T07:30:00Z',
  },
];

export const financeApi = {
  requests: {
    getAll: async (): Promise<FinancialRequest[]> => {
      await delay(400);
      return mockFinancialRequests;
    },

    getById: async (id: string): Promise<FinancialRequest | undefined> => {
      await delay(200);
      return mockFinancialRequests.find(r => r.id === id);
    },

    getByStatus: async (status: string): Promise<FinancialRequest[]> => {
      await delay(300);
      if (status === 'all') return mockFinancialRequests;
      return mockFinancialRequests.filter(r => r.status === status);
    },

    getSummary: async (): Promise<FinancialRequestSummary> => {
      await delay(200);
      const pending = mockFinancialRequests.filter(r =>
        ['pending_head', 'pending_finance_staff', 'pending_finance_head', 'pending_mudir'].includes(r.status)
      );
      const approved = mockFinancialRequests.filter(r =>
        ['approved', 'completed'].includes(r.status)
      );

      const byStatus = [
        { status: 'draft' as const, count: mockFinancialRequests.filter(r => r.status === 'draft').length },
        { status: 'pending_head' as const, count: mockFinancialRequests.filter(r => r.status === 'pending_head').length },
        { status: 'pending_finance_staff' as const, count: mockFinancialRequests.filter(r => r.status === 'pending_finance_staff').length },
        { status: 'pending_finance_head' as const, count: mockFinancialRequests.filter(r => r.status === 'pending_finance_head').length },
        { status: 'pending_mudir' as const, count: mockFinancialRequests.filter(r => r.status === 'pending_mudir').length },
        { status: 'approved' as const, count: mockFinancialRequests.filter(r => r.status === 'approved').length },
        { status: 'completed' as const, count: mockFinancialRequests.filter(r => r.status === 'completed').length },
        { status: 'rejected' as const, count: mockFinancialRequests.filter(r => r.status === 'rejected').length },
      ];

      const byType = ['payment', 'transfer', 'reimbursement', 'advance'].map(type => ({
        type,
        count: mockFinancialRequests.filter(r => r.type === type).length,
        amount: mockFinancialRequests.filter(r => r.type === type).reduce((sum, r) => sum + r.amount, 0),
      }));

      return {
        total_requests: mockFinancialRequests.length,
        pending_approval: pending.length,
        approved_this_month: approved.length,
        total_amount_pending: pending.reduce((sum, r) => sum + r.amount, 0),
        total_amount_approved: approved.reduce((sum, r) => sum + r.amount, 0),
        by_status: byStatus,
        by_type: byType,
      };
    },
  },
};
