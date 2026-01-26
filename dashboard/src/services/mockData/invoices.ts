import type { Invoice } from '../../types';

// Simulated API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Extended Invoice type for full workflow
export interface InvoiceDocument {
  id: string;
  name: string;
  type: 'invoice' | 'receipt' | 'po' | 'contract' | 'other';
  url: string;
  uploaded_at: string;
}

export interface InvoiceApproval {
  id: string;
  role: 'requester' | 'manager' | 'finance' | 'cfo';
  approver_name?: string;
  status: 'pending' | 'approved' | 'rejected';
  comments?: string;
  action_at?: string;
}

export interface ExtendedInvoice extends Invoice {
  vendor_tax_id?: string;
  gl_name?: string;
  documents: InvoiceDocument[];
  approvals: InvoiceApproval[];
  requester_name?: string;
  requester_unit?: string;
  posted_at?: string;
  journal_entry_id?: string;
}

// GL Accounts for invoice categorization
export const GL_ACCOUNTS = [
  { code: '5000', name: 'Beban Gaji' },
  { code: '5100', name: 'Beban Catering' },
  { code: '5200', name: 'Beban Operasional' },
  { code: '6100', name: 'Beban Sewa' },
  { code: '6150', name: 'Beban Utilities' },
  { code: '6200', name: 'Beban Pemeliharaan' },
  { code: '6300', name: 'Beban Perjalanan Dinas' },
  { code: '6400', name: 'Beban Marketing' },
  { code: '6500', name: 'Beban Profesional' },
  { code: '7000', name: 'Beban Administrasi' },
];

// Vendor list
export const VENDORS = [
  { id: 'V001', name: 'Al-Madinah Catering Co.', tax_id: '123456789' },
  { id: 'V002', name: 'Saudi Electricity Company', tax_id: '234567890' },
  { id: 'V003', name: 'Al-Rajhi Real Estate', tax_id: '345678901' },
  { id: 'V004', name: 'Saudi Auto Service', tax_id: '456789012' },
  { id: 'V005', name: 'IT Solutions Arabia', tax_id: '567890123' },
];

// Mock data
const mockInvoices: ExtendedInvoice[] = [
  {
    id: 'INV001',
    invoice_number: 'INV-2025-001',
    vendor_name: 'Al-Madinah Catering Co.',
    vendor_tax_id: '123456789',
    amount: 150000,
    currency: 'SAR',
    gl_code: '5100',
    gl_name: 'Beban Catering',
    description: 'Catering services for January 2025',
    status: 'pending',
    due_date: '2025-02-15',
    created_at: '2025-01-20T10:00:00Z',
    requester_name: 'Ahmad Fauzi',
    requester_unit: 'Food & Beverage',
    documents: [
      { id: 'DOC001', name: 'Invoice_Catering_Jan.pdf', type: 'invoice', url: '#', uploaded_at: '2025-01-20T10:00:00Z' },
    ],
    approvals: [
      { id: 'APP001', role: 'manager', approver_name: 'Yusuf Ismail', status: 'approved', action_at: '2025-01-21T09:00:00Z' },
      { id: 'APP002', role: 'finance', status: 'pending' },
    ],
  },
  {
    id: 'INV002',
    invoice_number: 'INV-2025-002',
    vendor_name: 'Saudi Electricity Company',
    vendor_tax_id: '234567890',
    amount: 32000,
    currency: 'SAR',
    gl_code: '6150',
    gl_name: 'Beban Utilities',
    description: 'Electricity bill for January 2025',
    status: 'approved',
    due_date: '2025-02-10',
    created_at: '2025-01-18T08:00:00Z',
    approved_by: 'Muhammad Rizki',
    approved_at: '2025-01-19T14:00:00Z',
    requester_name: 'Eko Prasetyo',
    requester_unit: 'General Affairs',
    documents: [
      { id: 'DOC002', name: 'SEC_Bill_Jan.pdf', type: 'invoice', url: '#', uploaded_at: '2025-01-18T08:00:00Z' },
    ],
    approvals: [
      { id: 'APP003', role: 'manager', approver_name: 'Hasan Abdullah', status: 'approved', action_at: '2025-01-18T11:00:00Z' },
      { id: 'APP004', role: 'finance', approver_name: 'Muhammad Rizki', status: 'approved', action_at: '2025-01-19T14:00:00Z' },
    ],
  },
  {
    id: 'INV003',
    invoice_number: 'INV-2025-003',
    vendor_name: 'Al-Rajhi Real Estate',
    vendor_tax_id: '345678901',
    amount: 250000,
    currency: 'SAR',
    gl_code: '6100',
    gl_name: 'Beban Sewa',
    description: 'Office rent Q1 2025',
    status: 'pending',
    due_date: '2025-02-01',
    created_at: '2025-01-15T09:00:00Z',
    requester_name: 'Siti Aminah',
    requester_unit: 'General Affairs',
    documents: [
      { id: 'DOC003', name: 'Rent_Invoice_Q1.pdf', type: 'invoice', url: '#', uploaded_at: '2025-01-15T09:00:00Z' },
      { id: 'DOC004', name: 'Lease_Agreement.pdf', type: 'contract', url: '#', uploaded_at: '2025-01-15T09:05:00Z' },
    ],
    approvals: [
      { id: 'APP005', role: 'manager', approver_name: 'Hasan Abdullah', status: 'approved', action_at: '2025-01-15T11:00:00Z' },
      { id: 'APP006', role: 'finance', approver_name: 'Fatimah Zahra', status: 'approved', action_at: '2025-01-16T10:00:00Z' },
      { id: 'APP007', role: 'cfo', status: 'pending' },
    ],
  },
  {
    id: 'INV004',
    invoice_number: 'INV-2025-004',
    vendor_name: 'Saudi Auto Service',
    vendor_tax_id: '456789012',
    amount: 45000,
    currency: 'SAR',
    gl_code: '6200',
    gl_name: 'Beban Pemeliharaan',
    description: 'Vehicle maintenance services',
    status: 'rejected',
    due_date: '2025-02-20',
    created_at: '2025-01-22T08:00:00Z',
    rejected_by: 'Fatimah Zahra',
    rejected_at: '2025-01-22T15:00:00Z',
    rejection_reason: 'Missing quotation comparison documents',
    requester_name: 'Agus Wijaya',
    requester_unit: 'Transportation',
    documents: [
      { id: 'DOC005', name: 'Service_Invoice.pdf', type: 'invoice', url: '#', uploaded_at: '2025-01-22T08:00:00Z' },
    ],
    approvals: [
      { id: 'APP008', role: 'manager', approver_name: 'Salim Mansur', status: 'approved', action_at: '2025-01-22T10:00:00Z' },
      { id: 'APP009', role: 'finance', approver_name: 'Fatimah Zahra', status: 'rejected', comments: 'Missing quotation comparison', action_at: '2025-01-22T15:00:00Z' },
    ],
  },
  {
    id: 'INV005',
    invoice_number: 'INV-2025-005',
    vendor_name: 'IT Solutions Arabia',
    vendor_tax_id: '567890123',
    amount: 85000,
    currency: 'SAR',
    gl_code: '6500',
    gl_name: 'Beban Profesional',
    description: 'IT consulting services December 2024',
    status: 'posted',
    due_date: '2025-01-30',
    created_at: '2025-01-10T09:00:00Z',
    approved_by: 'Muhammad Rizki',
    approved_at: '2025-01-12T14:00:00Z',
    posted_at: '2025-01-13T10:00:00Z',
    journal_entry_id: 'JE-2025-001',
    requester_name: 'Budi Santoso',
    requester_unit: 'IT',
    documents: [
      { id: 'DOC006', name: 'IT_Services_Invoice.pdf', type: 'invoice', url: '#', uploaded_at: '2025-01-10T09:00:00Z' },
      { id: 'DOC007', name: 'Service_Report.pdf', type: 'other', url: '#', uploaded_at: '2025-01-10T09:05:00Z' },
    ],
    approvals: [
      { id: 'APP010', role: 'manager', approver_name: 'Khalid Rahman', status: 'approved', action_at: '2025-01-10T14:00:00Z' },
      { id: 'APP011', role: 'finance', approver_name: 'Muhammad Rizki', status: 'approved', action_at: '2025-01-12T14:00:00Z' },
    ],
  },
];

// ID generator
let invoiceCounter = mockInvoices.length + 1;
const generateId = () => `INV${String(invoiceCounter++).padStart(3, '0')}`;
const generateInvoiceNumber = () => `INV-2025-${String(invoiceCounter).padStart(3, '0')}`;

// Input types
export interface CreateInvoiceInput {
  vendor_name: string;
  vendor_tax_id?: string;
  amount: number;
  currency: 'SAR' | 'IDR' | 'USD';
  gl_code: string;
  gl_name: string;
  description: string;
  due_date: string;
  requester_name: string;
  requester_unit: string;
  documents: { name: string; type: string }[];
}

export interface ApproveInvoiceInput {
  invoiceId: string;
  approverName: string;
  role: 'manager' | 'finance' | 'cfo';
  comments?: string;
}

export interface RejectInvoiceInput {
  invoiceId: string;
  approverName: string;
  role: 'manager' | 'finance' | 'cfo';
  reason: string;
}

export interface PostToGLInput {
  invoiceId: string;
  postedBy: string;
}

// Summary type
export interface InvoiceSummary {
  total_invoices: number;
  pending_approval: number;
  approved_unpaid: number;
  posted_count: number;
  rejected_count: number;
  total_amount_pending: number;
  total_amount_approved: number;
  by_status: { status: string; count: number; amount: number }[];
  by_gl_code: { gl_code: string; gl_name: string; count: number; amount: number }[];
}

export const invoicesApi = {
  invoices: {
    getAll: async (): Promise<ExtendedInvoice[]> => {
      await delay(400);
      return [...mockInvoices].sort((a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    },

    getById: async (id: string): Promise<ExtendedInvoice | undefined> => {
      await delay(200);
      return mockInvoices.find(inv => inv.id === id);
    },

    getByStatus: async (status: string): Promise<ExtendedInvoice[]> => {
      await delay(300);
      if (status === 'all') return mockInvoices;
      return mockInvoices.filter(inv => inv.status === status);
    },

    getSummary: async (): Promise<InvoiceSummary> => {
      await delay(200);
      const pending = mockInvoices.filter(inv => inv.status === 'pending');
      const approved = mockInvoices.filter(inv => inv.status === 'approved');
      const posted = mockInvoices.filter(inv => inv.status === 'posted');
      const rejected = mockInvoices.filter(inv => inv.status === 'rejected');

      const byStatus = ['pending', 'approved', 'posted', 'rejected'].map(status => ({
        status,
        count: mockInvoices.filter(inv => inv.status === status).length,
        amount: mockInvoices.filter(inv => inv.status === status).reduce((sum, inv) => sum + inv.amount, 0),
      }));

      const glCounts = mockInvoices.reduce((acc, inv) => {
        const key = inv.gl_code || 'unknown';
        if (!acc[key]) {
          acc[key] = { gl_code: inv.gl_code || '', gl_name: inv.gl_name || '', count: 0, amount: 0 };
        }
        acc[key].count++;
        acc[key].amount += inv.amount;
        return acc;
      }, {} as Record<string, { gl_code: string; gl_name: string; count: number; amount: number }>);

      return {
        total_invoices: mockInvoices.length,
        pending_approval: pending.length,
        approved_unpaid: approved.length,
        posted_count: posted.length,
        rejected_count: rejected.length,
        total_amount_pending: pending.reduce((sum, inv) => sum + inv.amount, 0),
        total_amount_approved: [...approved, ...posted].reduce((sum, inv) => sum + inv.amount, 0),
        by_status: byStatus,
        by_gl_code: Object.values(glCounts),
      };
    },

    create: async (input: CreateInvoiceInput): Promise<ExtendedInvoice> => {
      await delay(500);
      const now = new Date().toISOString();
      const newInvoice: ExtendedInvoice = {
        id: generateId(),
        invoice_number: generateInvoiceNumber(),
        vendor_name: input.vendor_name,
        vendor_tax_id: input.vendor_tax_id,
        amount: input.amount,
        currency: input.currency,
        gl_code: input.gl_code,
        gl_name: input.gl_name,
        description: input.description,
        due_date: input.due_date,
        status: 'pending',
        created_at: now,
        requester_name: input.requester_name,
        requester_unit: input.requester_unit,
        documents: input.documents.map((doc, i) => ({
          id: `DOC${Date.now()}${i}`,
          name: doc.name,
          type: doc.type as 'invoice' | 'receipt' | 'po' | 'contract' | 'other',
          url: '#',
          uploaded_at: now,
        })),
        approvals: [
          { id: `APP${Date.now()}`, role: 'manager', status: 'pending' },
        ],
      };
      mockInvoices.unshift(newInvoice);
      return newInvoice;
    },

    approve: async (input: ApproveInvoiceInput): Promise<ExtendedInvoice> => {
      await delay(400);
      const invoice = mockInvoices.find(inv => inv.id === input.invoiceId);
      if (!invoice) throw new Error('Invoice not found');

      const now = new Date().toISOString();
      const currentApproval = invoice.approvals.find(
        a => a.role === input.role && a.status === 'pending'
      );

      if (currentApproval) {
        currentApproval.status = 'approved';
        currentApproval.approver_name = input.approverName;
        currentApproval.comments = input.comments;
        currentApproval.action_at = now;
      }

      // Check if needs CFO approval (amount > 100k)
      const needsCFO = invoice.amount > 100000;

      if (input.role === 'manager') {
        // Add finance approval step
        invoice.approvals.push({ id: `APP${Date.now()}`, role: 'finance', status: 'pending' });
      } else if (input.role === 'finance' && needsCFO) {
        // Add CFO approval step for large invoices
        invoice.approvals.push({ id: `APP${Date.now()}`, role: 'cfo', status: 'pending' });
      } else if ((input.role === 'finance' && !needsCFO) || (input.role === 'cfo')) {
        // Final approval
        invoice.status = 'approved';
        invoice.approved_by = input.approverName;
        invoice.approved_at = now;
      }

      return invoice;
    },

    reject: async (input: RejectInvoiceInput): Promise<ExtendedInvoice> => {
      await delay(400);
      const invoice = mockInvoices.find(inv => inv.id === input.invoiceId);
      if (!invoice) throw new Error('Invoice not found');

      const now = new Date().toISOString();
      const currentApproval = invoice.approvals.find(
        a => a.role === input.role && a.status === 'pending'
      );

      if (currentApproval) {
        currentApproval.status = 'rejected';
        currentApproval.approver_name = input.approverName;
        currentApproval.comments = input.reason;
        currentApproval.action_at = now;
      }

      invoice.status = 'rejected';
      invoice.rejected_by = input.approverName;
      invoice.rejected_at = now;
      invoice.rejection_reason = input.reason;

      return invoice;
    },

    postToGL: async (input: PostToGLInput): Promise<ExtendedInvoice> => {
      await delay(500);
      const invoice = mockInvoices.find(inv => inv.id === input.invoiceId);
      if (!invoice) throw new Error('Invoice not found');
      if (invoice.status !== 'approved') throw new Error('Only approved invoices can be posted');

      const now = new Date().toISOString();
      invoice.status = 'posted';
      invoice.posted_at = now;
      invoice.journal_entry_id = `JE-2025-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;

      return invoice;
    },

    delete: async (id: string): Promise<void> => {
      await delay(300);
      const index = mockInvoices.findIndex(inv => inv.id === id);
      if (index !== -1) {
        mockInvoices.splice(index, 1);
      }
    },
  },

  getGLAccounts: () => GL_ACCOUNTS,
  getVendors: () => VENDORS,
};
