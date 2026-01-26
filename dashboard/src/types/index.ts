export interface Investment {
  id: string;
  company_name: string;
  document_name?: string;
  recommendation: 'approve' | 'reject' | 'hold' | 'pending';
  status: 'pending' | 'approved' | 'rejected';
  financial_analysis?: FinancialAnalysis;
  risk_assessment?: RiskAssessment;
  shariah_compliance?: ShariahCompliance;
  final_memo?: string;
  created_at: string;
  approved_by?: string;
  approved_at?: string;
  rejected_by?: string;
  rejected_at?: string;
  rejection_reason?: string;
}

export interface FinancialAnalysis {
  revenue?: number;
  profitability?: number;
  roe?: number;
  roa?: number;
  debt_equity_ratio?: number;
  summary?: string;
}

export interface RiskAssessment {
  strategic_risk?: number;
  financial_risk?: number;
  operational_risk?: number;
  compliance_risk?: number;
  shariah_risk?: number;
  reputational_risk?: number;
  overall_rating?: number;
  summary?: string;
}

export interface ShariahCompliance {
  halal_screening?: 'pass' | 'fail' | 'conditional';
  riba_compliance?: 'compliant' | 'non_compliant' | 'review';
  gharar_assessment?: string;
  overall_status?: 'compliant' | 'non_compliant' | 'requires_review';
  notes?: string;
}

export interface TreasuryData {
  current_balance: number;
  last_updated: string;
  forecast: CashflowForecast[];
  alerts: TreasuryAlert[];
  history: TreasuryHistory[];
}

export interface CashflowForecast {
  date: string;
  projected_balance: number;
  inflows: number;
  outflows: number;
}

export interface TreasuryAlert {
  type: 'warning' | 'info' | 'success';
  message: string;
  timestamp: string;
}

export interface TreasuryHistory {
  id: string;
  current_balance: number;
  analysis?: string;
  created_at: string;
}

export interface Invoice {
  id: string;
  invoice_number: string;
  vendor_name?: string;
  amount: number;
  currency: string;
  gl_code?: string;
  description?: string;
  status: 'pending' | 'approved' | 'rejected' | 'posted';
  due_date?: string;
  created_at: string;
  approved_by?: string;
  approved_at?: string;
  rejected_by?: string;
  rejected_at?: string;
  rejection_reason?: string;
}

export interface WhatsAppMessage {
  id: string;
  chatId: string;
  from: string;
  text: string;
  timestamp: string;
  direction: 'incoming' | 'outgoing';
}

export interface DashboardSummary {
  pending_investments: number;
  approved_investments: number;
  pending_invoices: number;
  total_invoice_value: number;
}

export interface DashboardData {
  investments: Investment[];
  treasury: TreasuryData;
  invoices: Invoice[];
  summary: DashboardSummary;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// ============================================
// HCMS Types
// ============================================

export interface Employee {
  id: string;
  employee_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  department: string;
  position: string;
  grade?: string;
  job_family?: string;
  employment_status: 'active' | 'probation' | 'resigned' | 'terminated';
  employment_type?: 'full_time' | 'part_time' | 'contract';
  hire_date: string;
  join_date?: string;
  end_date?: string;
  manager_id?: string;
  photo_url?: string;
  nationality?: string;
  salary?: number;
  iqamah_number?: string;
  iqamah_expiry?: string;
  passport_number?: string;
  passport_expiry?: string;
  visa_expiry?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  parent_id?: string;
  head_id?: string;
  headcount: number;
}

export interface Attendance {
  id: string;
  employee_id: string;
  employee_name: string;
  date: string;
  check_in?: string;
  check_out?: string;
  status: 'present' | 'absent' | 'late' | 'leave' | 'holiday';
  work_hours?: number;
  overtime_hours?: number;
  late_minutes?: number;
  location?: string;
  notes?: string;
}

export interface LeaveRequest {
  id: string;
  employee_id: string;
  employee_name: string;
  leave_type: 'annual' | 'sick' | 'emergency' | 'unpaid' | 'maternity' | 'paternity';
  start_date: string;
  end_date: string;
  days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  approved_by?: string;
  approved_at?: string;
  created_at?: string;
}

export interface LeaveBalance {
  employee_id: string;
  annual: number;
  annual_used: number;
  sick: number;
  sick_used: number;
  emergency: number;
  emergency_used: number;
}

export interface PayrollRecord {
  id: string;
  employee_id: string;
  employee_name: string;
  period: string;
  basic_salary: number;
  allowances?: number;
  housing_allowance?: number;
  transport_allowance?: number;
  other_allowances?: number;
  overtime_pay?: number;
  deductions: number;
  gosi?: number;
  gosi_employee?: number;
  gosi_employer?: number;
  net_salary: number;
  currency?: 'SAR' | 'IDR';
  status: 'draft' | 'pending' | 'processing' | 'processed' | 'paid';
  payment_date?: string;
  paid_at?: string;
}

export interface Recruitment {
  id: string;
  position: string;
  department: string;
  status: 'open' | 'screening' | 'interviewing' | 'offer' | 'closed';
  applicants: number;
  shortlisted: number;
  posted_date: string;
  closing_date?: string;
  hiring_manager: string;
}

export interface Candidate {
  id: string;
  recruitment_id: string;
  name: string;
  email: string;
  phone?: string;
  status: 'applied' | 'screening' | 'interview' | 'offer' | 'hired' | 'rejected';
  score?: number;
  applied_at: string;
}

export interface KPI {
  id: string;
  employee_id: string;
  employee_name: string;
  period: string;
  kpi_name: string;
  target: number;
  actual: number;
  weight: number;
  score: number;
  category: 'quantitative' | 'qualitative';
}

export interface PerformanceReview {
  id: string;
  employee_id: string;
  employee_name: string;
  period: string;
  review_type: 'mid_year' | 'annual';
  overall_score: number;
  rating: 'exceptional' | 'exceeds' | 'meets' | 'below' | 'unsatisfactory';
  reviewer_id: string;
  reviewer_name: string;
  status: 'draft' | 'submitted' | 'acknowledged';
  comments?: string;
  created_at: string;
}

export interface Training {
  id: string;
  title: string;
  type: 'internal' | 'external' | 'online';
  category: 'mandatory' | 'technical' | 'soft_skill' | 'leadership';
  start_date: string;
  end_date: string;
  duration_hours: number;
  provider?: string;
  max_participants: number;
  enrolled: number;
  status: 'upcoming' | 'ongoing' | 'completed';
}

export interface TrainingEnrollment {
  id: string;
  training_id: string;
  employee_id: string;
  employee_name: string;
  status: 'enrolled' | 'completed' | 'cancelled';
  score?: number;
  certificate_url?: string;
}

export interface DisciplinaryCase {
  id: string;
  employee_id: string;
  employee_name: string;
  case_type: 'warning' | 'suspension' | 'termination';
  severity: 'minor' | 'major' | 'gross';
  description: string;
  action_taken: string;
  status: 'open' | 'investigation' | 'resolved';
  created_at: string;
  resolved_at?: string;
}

export interface ComplianceAlert {
  id: string;
  employee_id: string;
  employee_name: string;
  alert_type: 'iqamah_expiry' | 'visa_expiry' | 'passport_expiry' | 'contract_expiry';
  expiry_date: string;
  days_remaining: number;
  status: 'active' | 'resolved';
}

// ============================================
// Financial Request Workflow Types
// ============================================

export type FinancialRequestStatus =
  | 'draft'
  | 'pending_head'
  | 'pending_finance_staff'
  | 'pending_finance_head'
  | 'pending_mudir'
  | 'approved'
  | 'rejected'
  | 'completed';

export interface FinancialRequest {
  id: string;
  request_number: string;
  type: 'payment' | 'transfer' | 'reimbursement' | 'advance';
  title: string;
  description: string;
  amount: number;
  currency: 'SAR' | 'IDR' | 'USD';

  // Requester info
  requester_id: string;
  requester_name: string;
  requester_unit: string;

  // Ledger/categorization
  gl_code?: string;
  gl_name?: string;
  cost_center?: string;
  budget_code?: string;

  // Vendor/beneficiary
  beneficiary_name?: string;
  beneficiary_bank?: string;
  beneficiary_account?: string;

  // Documents
  documents: FinancialDocument[];

  // Status & workflow
  status: FinancialRequestStatus;
  current_approver?: string;

  // Approval trail
  approvals: ApprovalStep[];

  // Timestamps
  created_at: string;
  updated_at?: string;
  completed_at?: string;

  // Transaction proof
  transaction_proof_url?: string;
  transaction_date?: string;
  transaction_reference?: string;
}

export interface FinancialDocument {
  id: string;
  name: string;
  type: 'invoice' | 'receipt' | 'contract' | 'quotation' | 'other';
  url: string;
  uploaded_at: string;
}

export interface ApprovalStep {
  id: string;
  step: number;
  role: 'head_division' | 'finance_staff' | 'finance_head' | 'mudir_1' | 'mudir_3';
  approver_id?: string;
  approver_name?: string;
  status: 'pending' | 'approved' | 'rejected' | 'returned';
  comments?: string;
  action_at?: string;
}

export interface FinancialRequestSummary {
  total_requests: number;
  pending_approval: number;
  approved_this_month: number;
  total_amount_pending: number;
  total_amount_approved: number;
  by_status: { status: FinancialRequestStatus; count: number }[];
  by_type: { type: string; count: number; amount: number }[];
}

export interface HCMSDashboard {
  total_employees: number;
  active_employees: number;
  new_hires_month?: number;
  resignations_month?: number;
  turnover_rate?: number;
  attendance_rate?: number;
  pending_leaves: number;
  pending_approvals?: number;
  open_positions?: number;
  compliance_alerts: number;
  upcoming_trainings: number;
  departments: { name: string; count: number; percentage: number }[];
  attendance_today: { present: number; absent: number; late: number; leave: number };
  headcount_trend: { month: string; count: number }[];
  headcount_by_department?: { department: string; count: number }[];
  attendance_trend?: { date: string; present: number; absent: number }[];
}
