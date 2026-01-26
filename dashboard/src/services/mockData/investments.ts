// Investments Mock API - Document upload and sharing functionality

// Types
export type InvestmentStatus = 'pending_analysis' | 'pending_review' | 'pending_approval' | 'approved' | 'rejected';

export interface InvestmentDocument {
  id: string;
  name: string;
  type: 'financial_statement' | 'company_profile' | 'shariah_certificate' | 'other';
  size: number;
  uploaded_at: string;
  uploaded_by: string;
  status: 'pending' | 'processed' | 'error';
}

export interface FinancialAnalysis {
  revenue: number;
  net_income: number;
  total_assets: number;
  total_equity: number;
  roe: number;
  roa: number;
  debt_equity_ratio: number;
  current_ratio: number;
  summary: string;
}

export interface RiskAssessment {
  strategic_risk: number;
  financial_risk: number;
  operational_risk: number;
  compliance_risk: number;
  shariah_risk: number;
  reputational_risk: number;
  overall_rating: number;
  summary: string;
}

export interface ShariahCompliance {
  halal_screening: 'pass' | 'fail' | 'conditional';
  riba_compliance: 'compliant' | 'non_compliant' | 'requires_purification';
  gharar_status: 'minimal' | 'acceptable' | 'excessive';
  overall_status: 'compliant' | 'non_compliant' | 'conditional';
  notes: string;
}

export interface ExtendedInvestment {
  id: string;
  company_name: string;
  sector: string;
  country: string;
  investment_amount?: number;
  currency: 'SAR' | 'IDR' | 'USD';
  status: InvestmentStatus;
  documents: InvestmentDocument[];
  financial_analysis?: FinancialAnalysis;
  risk_assessment?: RiskAssessment;
  shariah_compliance?: ShariahCompliance;
  recommendation?: 'proceed' | 'proceed_with_conditions' | 'reject' | 'more_info_needed';
  final_memo?: string;
  submitted_by: string;
  submitted_at: string;
  reviewed_by?: string;
  reviewed_at?: string;
  approved_by?: string;
  approved_at?: string;
  rejected_by?: string;
  rejected_at?: string;
  rejection_reason?: string;
  shared_to?: ShareRecord[];
  created_at: string;
  updated_at?: string;
}

export interface ShareRecord {
  id: string;
  channel: 'whatsapp' | 'email' | 'telegram';
  recipient: string;
  shared_at: string;
  shared_by: string;
}

export interface InvestmentSummary {
  total: number;
  pending_analysis: number;
  pending_review: number;
  pending_approval: number;
  approved: number;
  rejected: number;
  total_invested: number;
}

// Input types
export interface UploadDocumentInput {
  investmentId?: string;
  company_name?: string;
  sector?: string;
  country?: string;
  documents: { name: string; type: InvestmentDocument['type']; size: number }[];
  uploaded_by: string;
}

export interface ApproveInvestmentInput {
  investmentId: string;
  approverName: string;
  comments?: string;
}

export interface RejectInvestmentInput {
  investmentId: string;
  rejectorName: string;
  reason: string;
}

export interface ShareMemoInput {
  investmentId: string;
  channel: 'whatsapp' | 'email' | 'telegram';
  recipient: string;
  sharedBy: string;
}

// Sectors
export const SECTORS = [
  'Technology',
  'Healthcare',
  'Financial Services',
  'Real Estate',
  'Energy',
  'Manufacturing',
  'Consumer Goods',
  'Infrastructure',
  'Telecommunications',
  'Islamic Banking',
];

// Mock investments data
const mockInvestments: ExtendedInvestment[] = [
  {
    id: 'INV001',
    company_name: 'PT Sukuk Indonesia',
    sector: 'Islamic Banking',
    country: 'Indonesia',
    investment_amount: 5000000,
    currency: 'SAR',
    status: 'pending_approval',
    documents: [
      { id: 'DOC001', name: 'Financial Statement 2023.pdf', type: 'financial_statement', size: 2500000, uploaded_at: '2024-01-15T10:00:00Z', uploaded_by: 'Ahmad Fahri', status: 'processed' },
      { id: 'DOC002', name: 'Company Profile.pdf', type: 'company_profile', size: 1500000, uploaded_at: '2024-01-15T10:05:00Z', uploaded_by: 'Ahmad Fahri', status: 'processed' },
      { id: 'DOC003', name: 'Shariah Certificate.pdf', type: 'shariah_certificate', size: 500000, uploaded_at: '2024-01-15T10:10:00Z', uploaded_by: 'Ahmad Fahri', status: 'processed' },
    ],
    financial_analysis: {
      revenue: 125000000,
      net_income: 18750000,
      total_assets: 450000000,
      total_equity: 180000000,
      roe: 10.42,
      roa: 4.17,
      debt_equity_ratio: 1.5,
      current_ratio: 1.8,
      summary: 'Solid financial performance with consistent revenue growth. Healthy profit margins and manageable debt levels. Strong liquidity position.',
    },
    risk_assessment: {
      strategic_risk: 4,
      financial_risk: 3,
      operational_risk: 4,
      compliance_risk: 2,
      shariah_risk: 2,
      reputational_risk: 3,
      overall_rating: 3,
      summary: 'Low to moderate risk profile. Well-established market position with experienced management team.',
    },
    shariah_compliance: {
      halal_screening: 'pass',
      riba_compliance: 'compliant',
      gharar_status: 'minimal',
      overall_status: 'compliant',
      notes: 'Company operates in full compliance with Islamic finance principles. No prohibited business activities detected.',
    },
    recommendation: 'proceed',
    final_memo: `INVESTMENT MEMO - PT Sukuk Indonesia

RECOMMENDATION: PROCEED

Executive Summary:
PT Sukuk Indonesia represents a compelling investment opportunity in the Indonesian Islamic banking sector. The company demonstrates strong financial fundamentals with ROE of 10.42% and maintains full Shariah compliance.

Key Investment Highlights:
1. Strong market position in Indonesian Islamic finance sector
2. Consistent revenue growth and healthy profit margins
3. Low risk profile across all assessment categories
4. Full Shariah compliance with established certificate

Financial Analysis:
- Revenue: SAR 125,000,000
- Net Income: SAR 18,750,000
- ROE: 10.42% (above industry average)
- Debt/Equity: 1.5 (manageable level)

Risk Assessment:
Overall risk rating: 3/10 (Low risk)
- Strategic: 4/10
- Financial: 3/10
- Shariah: 2/10

Recommended Terms:
- Investment Amount: SAR 5,000,000
- Structure: Musharakah arrangement
- Expected Return: 8-10% annually

Prepared by: Investment Analysis Team
Date: January 2024`,
    submitted_by: 'Ahmad Fahri',
    submitted_at: '2024-01-15T10:00:00Z',
    reviewed_by: 'Investment Team',
    reviewed_at: '2024-01-18T14:00:00Z',
    shared_to: [],
    created_at: '2024-01-15T10:00:00Z',
  },
  {
    id: 'INV002',
    company_name: 'Al Madinah Healthcare',
    sector: 'Healthcare',
    country: 'Saudi Arabia',
    investment_amount: 3500000,
    currency: 'SAR',
    status: 'pending_review',
    documents: [
      { id: 'DOC004', name: 'Annual Report 2023.pdf', type: 'financial_statement', size: 3200000, uploaded_at: '2024-01-20T09:00:00Z', uploaded_by: 'Siti Aminah', status: 'processed' },
      { id: 'DOC005', name: 'Business Plan.pdf', type: 'company_profile', size: 2100000, uploaded_at: '2024-01-20T09:15:00Z', uploaded_by: 'Siti Aminah', status: 'processed' },
    ],
    financial_analysis: {
      revenue: 85000000,
      net_income: 12750000,
      total_assets: 280000000,
      total_equity: 140000000,
      roe: 9.11,
      roa: 4.55,
      debt_equity_ratio: 1.0,
      current_ratio: 2.1,
      summary: 'Strong healthcare company with growing market share. Good financial health with room for expansion.',
    },
    risk_assessment: {
      strategic_risk: 5,
      financial_risk: 4,
      operational_risk: 5,
      compliance_risk: 3,
      shariah_risk: 3,
      reputational_risk: 4,
      overall_rating: 4,
      summary: 'Moderate risk profile. Healthcare sector exposure provides stability but regulatory changes present some risk.',
    },
    shariah_compliance: {
      halal_screening: 'pass',
      riba_compliance: 'compliant',
      gharar_status: 'minimal',
      overall_status: 'compliant',
      notes: 'Healthcare services comply with Shariah principles. No interest-bearing financing identified.',
    },
    recommendation: 'proceed_with_conditions',
    submitted_by: 'Siti Aminah',
    submitted_at: '2024-01-20T09:00:00Z',
    shared_to: [],
    created_at: '2024-01-20T09:00:00Z',
  },
  {
    id: 'INV003',
    company_name: 'TechVentures Global',
    sector: 'Technology',
    country: 'UAE',
    investment_amount: 2000000,
    currency: 'USD',
    status: 'pending_analysis',
    documents: [
      { id: 'DOC006', name: 'Pitch Deck.pdf', type: 'company_profile', size: 5000000, uploaded_at: '2024-01-22T11:00:00Z', uploaded_by: 'Investment Team', status: 'pending' },
    ],
    submitted_by: 'Investment Team',
    submitted_at: '2024-01-22T11:00:00Z',
    shared_to: [],
    created_at: '2024-01-22T11:00:00Z',
  },
  {
    id: 'INV004',
    company_name: 'Green Energy Saudi',
    sector: 'Energy',
    country: 'Saudi Arabia',
    investment_amount: 8000000,
    currency: 'SAR',
    status: 'approved',
    documents: [
      { id: 'DOC007', name: 'Financial Report.pdf', type: 'financial_statement', size: 2800000, uploaded_at: '2024-01-05T08:00:00Z', uploaded_by: 'Ahmad Fahri', status: 'processed' },
      { id: 'DOC008', name: 'Shariah Certificate.pdf', type: 'shariah_certificate', size: 450000, uploaded_at: '2024-01-05T08:15:00Z', uploaded_by: 'Ahmad Fahri', status: 'processed' },
    ],
    financial_analysis: {
      revenue: 200000000,
      net_income: 30000000,
      total_assets: 750000000,
      total_equity: 350000000,
      roe: 8.57,
      roa: 4.0,
      debt_equity_ratio: 1.14,
      current_ratio: 1.9,
      summary: 'Leading renewable energy company with strong government backing. Excellent growth prospects aligned with Vision 2030.',
    },
    risk_assessment: {
      strategic_risk: 3,
      financial_risk: 3,
      operational_risk: 4,
      compliance_risk: 2,
      shariah_risk: 2,
      reputational_risk: 2,
      overall_rating: 3,
      summary: 'Low risk profile with strong government support and growing market demand.',
    },
    shariah_compliance: {
      halal_screening: 'pass',
      riba_compliance: 'compliant',
      gharar_status: 'minimal',
      overall_status: 'compliant',
      notes: 'Renewable energy operations are fully Shariah compliant.',
    },
    recommendation: 'proceed',
    final_memo: 'Investment approved based on strong fundamentals and strategic alignment with Vision 2030 renewable energy goals.',
    submitted_by: 'Ahmad Fahri',
    submitted_at: '2024-01-05T08:00:00Z',
    reviewed_by: 'Investment Team',
    reviewed_at: '2024-01-08T10:00:00Z',
    approved_by: 'CFO',
    approved_at: '2024-01-10T14:00:00Z',
    shared_to: [
      { id: 'SHR001', channel: 'whatsapp', recipient: '+966501234567', shared_at: '2024-01-10T15:00:00Z', shared_by: 'Finance Manager' },
    ],
    created_at: '2024-01-05T08:00:00Z',
  },
  {
    id: 'INV005',
    company_name: 'Risky Ventures Ltd',
    sector: 'Financial Services',
    country: 'Bahrain',
    investment_amount: 1500000,
    currency: 'USD',
    status: 'rejected',
    documents: [
      { id: 'DOC009', name: 'Annual Report.pdf', type: 'financial_statement', size: 1900000, uploaded_at: '2024-01-10T13:00:00Z', uploaded_by: 'Siti Aminah', status: 'processed' },
    ],
    financial_analysis: {
      revenue: 45000000,
      net_income: -5000000,
      total_assets: 120000000,
      total_equity: 30000000,
      roe: -16.67,
      roa: -4.17,
      debt_equity_ratio: 3.0,
      current_ratio: 0.8,
      summary: 'Company shows concerning financial indicators with negative profitability and high leverage.',
    },
    risk_assessment: {
      strategic_risk: 8,
      financial_risk: 9,
      operational_risk: 7,
      compliance_risk: 6,
      shariah_risk: 5,
      reputational_risk: 7,
      overall_rating: 7,
      summary: 'High risk profile with significant financial distress indicators.',
    },
    shariah_compliance: {
      halal_screening: 'conditional',
      riba_compliance: 'requires_purification',
      gharar_status: 'acceptable',
      overall_status: 'conditional',
      notes: 'Some conventional financing elements require purification. Conditional approval subject to restructuring.',
    },
    recommendation: 'reject',
    submitted_by: 'Siti Aminah',
    submitted_at: '2024-01-10T13:00:00Z',
    reviewed_by: 'Investment Team',
    reviewed_at: '2024-01-12T09:00:00Z',
    rejected_by: 'CFO',
    rejected_at: '2024-01-12T16:00:00Z',
    rejection_reason: 'High financial risk with negative profitability and excessive leverage. Does not meet investment criteria.',
    shared_to: [],
    created_at: '2024-01-10T13:00:00Z',
  },
];

// Helper function to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Investments API
export const investmentsApi = {
  investments: {
    getAll: async (): Promise<ExtendedInvestment[]> => {
      await delay(400);
      return [...mockInvestments].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    },

    getById: async (id: string): Promise<ExtendedInvestment | undefined> => {
      await delay(200);
      return mockInvestments.find(inv => inv.id === id);
    },

    getByStatus: async (status: InvestmentStatus): Promise<ExtendedInvestment[]> => {
      await delay(300);
      return mockInvestments.filter(inv => inv.status === status);
    },

    getSummary: async (): Promise<InvestmentSummary> => {
      await delay(300);
      return {
        total: mockInvestments.length,
        pending_analysis: mockInvestments.filter(i => i.status === 'pending_analysis').length,
        pending_review: mockInvestments.filter(i => i.status === 'pending_review').length,
        pending_approval: mockInvestments.filter(i => i.status === 'pending_approval').length,
        approved: mockInvestments.filter(i => i.status === 'approved').length,
        rejected: mockInvestments.filter(i => i.status === 'rejected').length,
        total_invested: mockInvestments
          .filter(i => i.status === 'approved' && i.investment_amount)
          .reduce((sum, i) => sum + (i.investment_amount || 0), 0),
      };
    },

    uploadDocuments: async (input: UploadDocumentInput): Promise<ExtendedInvestment> => {
      await delay(800);

      const documents: InvestmentDocument[] = input.documents.map((doc, index) => ({
        id: `DOC${Date.now()}${index}`,
        name: doc.name,
        type: doc.type,
        size: doc.size,
        uploaded_at: new Date().toISOString(),
        uploaded_by: input.uploaded_by,
        status: 'pending' as const,
      }));

      if (input.investmentId) {
        // Add to existing investment
        const investment = mockInvestments.find(inv => inv.id === input.investmentId);
        if (!investment) throw new Error('Investment not found');
        investment.documents.push(...documents);
        investment.updated_at = new Date().toISOString();
        return investment;
      } else {
        // Create new investment
        const newInvestment: ExtendedInvestment = {
          id: `INV${String(mockInvestments.length + 1).padStart(3, '0')}`,
          company_name: input.company_name || 'New Investment',
          sector: input.sector || 'Other',
          country: input.country || 'Saudi Arabia',
          currency: 'SAR',
          status: 'pending_analysis',
          documents,
          submitted_by: input.uploaded_by,
          submitted_at: new Date().toISOString(),
          shared_to: [],
          created_at: new Date().toISOString(),
        };
        mockInvestments.unshift(newInvestment);
        return newInvestment;
      }
    },

    approve: async (input: ApproveInvestmentInput): Promise<ExtendedInvestment> => {
      await delay(400);
      const investment = mockInvestments.find(inv => inv.id === input.investmentId);
      if (!investment) throw new Error('Investment not found');

      investment.status = 'approved';
      investment.approved_by = input.approverName;
      investment.approved_at = new Date().toISOString();
      investment.updated_at = new Date().toISOString();

      return investment;
    },

    reject: async (input: RejectInvestmentInput): Promise<ExtendedInvestment> => {
      await delay(400);
      const investment = mockInvestments.find(inv => inv.id === input.investmentId);
      if (!investment) throw new Error('Investment not found');

      investment.status = 'rejected';
      investment.rejected_by = input.rejectorName;
      investment.rejected_at = new Date().toISOString();
      investment.rejection_reason = input.reason;
      investment.updated_at = new Date().toISOString();

      return investment;
    },

    shareMemo: async (input: ShareMemoInput): Promise<ExtendedInvestment> => {
      await delay(500);
      const investment = mockInvestments.find(inv => inv.id === input.investmentId);
      if (!investment) throw new Error('Investment not found');
      if (!investment.final_memo) throw new Error('No memo to share');

      const shareRecord: ShareRecord = {
        id: `SHR${Date.now()}`,
        channel: input.channel,
        recipient: input.recipient,
        shared_at: new Date().toISOString(),
        shared_by: input.sharedBy,
      };

      investment.shared_to = investment.shared_to || [];
      investment.shared_to.push(shareRecord);
      investment.updated_at = new Date().toISOString();

      return investment;
    },

    exportMemo: async (investmentId: string): Promise<string> => {
      await delay(600);
      const investment = mockInvestments.find(inv => inv.id === investmentId);
      if (!investment) throw new Error('Investment not found');
      if (!investment.final_memo) throw new Error('No memo to export');

      // Return mock PDF URL
      return `https://storage.example.com/memos/${investmentId}_memo.pdf`;
    },
  },

  getSectors: () => SECTORS,
};
