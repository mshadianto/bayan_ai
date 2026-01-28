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

// ============================================
// LCRMS Types (Legal, Compliance & Risk Management)
// ============================================

// --- Contract Lifecycle Management (CLM) ---

export type ContractType = 'pks' | 'vendor' | 'sewa' | 'nda' | 'service' | 'other';
export type ContractStatus = 'draft' | 'active' | 'expiring' | 'expired' | 'terminated';

export interface Contract {
  id: string;
  contract_number: string;
  name: string;
  type: ContractType;
  partner_name: string;
  partner_contact?: string;
  description?: string;
  start_date: string;
  end_date: string;
  value?: number;
  currency?: 'SAR' | 'IDR' | 'USD';
  status: ContractStatus;
  auto_renewal: boolean;
  renewal_notice_days?: number;
  document_url?: string;
  obligations: ContractObligation[];
  versions: ContractVersion[];
  created_by?: string;
  created_at: string;
  updated_at?: string;
}

export interface ContractObligation {
  id: string;
  contract_id: string;
  description: string;
  due_date: string;
  responsible_party: 'company' | 'partner';
  status: 'pending' | 'completed' | 'overdue';
  completed_at?: string;
  notes?: string;
}

export interface ContractVersion {
  id: string;
  version_number: number;
  changes_summary: string;
  document_url: string;
  created_by: string;
  created_at: string;
}

export interface ContractAlert {
  id: string;
  contract_id: string;
  contract_name: string;
  partner_name: string;
  alert_type: 'expiry_90' | 'expiry_60' | 'expiry_30' | 'obligation_due' | 'auto_renewal';
  days_remaining: number;
  message: string;
  status: 'active' | 'acknowledged' | 'resolved';
  created_at: string;
}

// --- Regulatory Compliance & Governance ---

export type LicenseType = 'nib' | 'commercial_registration' | 'operational_permit' | 'tax_registration' | 'other';
export type LicenseStatus = 'valid' | 'expiring' | 'expired' | 'pending_renewal';

export interface License {
  id: string;
  name: string;
  type: LicenseType;
  license_number: string;
  issuer: string;
  country: 'ID' | 'SA';
  issue_date: string;
  expiry_date: string;
  status: LicenseStatus;
  document_url?: string;
  renewal_notes?: string;
  created_at: string;
  updated_at?: string;
}

export interface COIDeclaration {
  id: string;
  employee_id: string;
  employee_name: string;
  department: string;
  position: string;
  year: number;
  has_conflict: boolean;
  conflict_details?: string;
  related_parties?: string[];
  mitigation_plan?: string;
  status: 'pending' | 'submitted' | 'reviewed' | 'approved';
  reviewed_by?: string;
  reviewed_at?: string;
  submitted_at: string;
  created_at: string;
}

export interface EmployeeViolation {
  id: string;
  employee_id: string;
  employee_name: string;
  department: string;
  violation_type: 'code_of_ethics' | 'fraud' | 'discipline' | 'policy_breach' | 'other';
  severity: 'minor' | 'moderate' | 'major' | 'critical';
  description: string;
  incident_date: string;
  reported_by: string;
  investigation_status: 'reported' | 'investigating' | 'concluded';
  action_taken?: string;
  resolution?: string;
  resolved_at?: string;
  created_at: string;
}

// --- Enterprise Risk Management (ERM) ---

export type RiskCategory = 'strategic' | 'financial' | 'operational' | 'compliance' | 'legal' | 'reputational' | 'shariah';
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';
export type MitigationStatus = 'identified' | 'in_progress' | 'implemented' | 'monitoring';

export interface Risk {
  id: string;
  risk_code: string;
  division: string;
  category: RiskCategory;
  name: string;
  description: string;
  cause?: string;
  impact_description?: string;
  impact_score: number; // 1-5
  likelihood_score: number; // 1-5
  risk_score: number; // impact x likelihood
  level: RiskLevel;
  mitigation_plan: string;
  mitigation_status: MitigationStatus;
  pic_name: string;
  pic_id?: string;
  target_date?: string;
  review_date?: string;
  status: 'open' | 'mitigated' | 'accepted' | 'closed';
  created_at: string;
  updated_at?: string;
}

export interface RiskHeatmapCell {
  impact: number;
  likelihood: number;
  count: number;
  risks: { id: string; name: string; division: string }[];
}

// --- Litigation & Case Management ---

export type CaseType = 'litigation' | 'non_litigation' | 'arbitration' | 'mediation';
export type CaseStatus = 'open' | 'discovery' | 'trial' | 'appeal' | 'settled' | 'won' | 'lost' | 'closed';

export interface LitigationCase {
  id: string;
  case_number: string;
  title: string;
  type: CaseType;
  court_name?: string;
  jurisdiction?: string;
  plaintiff: string;
  defendant: string;
  subject_matter: string;
  claim_amount?: number;
  currency?: 'SAR' | 'IDR' | 'USD';
  status: CaseStatus;
  priority: 'low' | 'medium' | 'high' | 'critical';
  external_counsel_id?: string;
  external_counsel_name?: string;
  timeline: CaseTimelineEvent[];
  documents: CaseDocument[];
  costs: CaseCost[];
  outcome?: string;
  settlement_amount?: number;
  opened_at: string;
  closed_at?: string;
  created_at: string;
  updated_at?: string;
}

export interface CaseTimelineEvent {
  id: string;
  case_id: string;
  event_type: 'filing' | 'hearing' | 'submission' | 'decision' | 'appeal' | 'settlement' | 'other';
  title: string;
  description?: string;
  date: string;
  location?: string;
  created_at: string;
}

export interface CaseDocument {
  id: string;
  case_id: string;
  name: string;
  document_type: 'pleading' | 'evidence' | 'correspondence' | 'court_order' | 'contract' | 'other';
  document_url: string;
  uploaded_by: string;
  uploaded_at: string;
}

export interface CaseCost {
  id: string;
  case_id: string;
  description: string;
  category: 'legal_fees' | 'court_fees' | 'expert_witness' | 'travel' | 'other';
  amount: number;
  currency: 'SAR' | 'IDR' | 'USD';
  date: string;
  invoice_number?: string;
  paid: boolean;
}

export interface ExternalCounsel {
  id: string;
  firm_name: string;
  contact_person: string;
  email: string;
  phone: string;
  address?: string;
  specialization: string[];
  jurisdiction: string[];
  hourly_rate?: number;
  currency?: 'SAR' | 'IDR' | 'USD';
  cases_handled: number;
  cases_won: number;
  performance_rating: number; // 1-5
  contract_start?: string;
  contract_end?: string;
  status: 'active' | 'inactive';
  notes?: string;
  created_at: string;
}

// --- Corporate Secretarial ---

export type MeetingType = 'rups' | 'board_of_directors' | 'board_of_commissioners' | 'committee' | 'management';

export interface MeetingMinutes {
  id: string;
  meeting_number: string;
  meeting_type: MeetingType;
  title: string;
  date: string;
  start_time: string;
  end_time: string;
  location: string;
  attendees: MeetingAttendee[];
  agenda: string[];
  decisions: MeetingDecision[];
  action_items: MeetingActionItem[];
  document_url?: string;
  status: 'draft' | 'finalized' | 'signed';
  prepared_by: string;
  approved_by?: string;
  created_at: string;
  updated_at?: string;
}

export interface MeetingAttendee {
  id: string;
  name: string;
  position: string;
  attendance: 'present' | 'absent' | 'proxy';
  proxy_name?: string;
}

export interface MeetingDecision {
  id: string;
  decision_number: string;
  description: string;
  voting_result?: string;
  effective_date?: string;
}

export interface MeetingActionItem {
  id: string;
  description: string;
  responsible: string;
  due_date: string;
  status: 'pending' | 'in_progress' | 'completed';
}

export interface Shareholder {
  id: string;
  name: string;
  type: 'individual' | 'corporate' | 'government';
  nationality?: string;
  shares: number;
  percentage: number;
  share_class: 'common' | 'preferred';
  acquisition_date: string;
  acquisition_type: 'founding' | 'purchase' | 'transfer' | 'rights_issue';
  status: 'active' | 'transferred';
  contact_email?: string;
  contact_phone?: string;
  notes?: string;
  created_at: string;
  updated_at?: string;
}

export interface ShareholderChange {
  id: string;
  shareholder_id: string;
  change_type: 'acquisition' | 'disposal' | 'transfer';
  shares_before: number;
  shares_after: number;
  transaction_date: string;
  counterparty?: string;
  price_per_share?: number;
  total_value?: number;
  document_url?: string;
  created_at: string;
}

export interface CircularResolution {
  id: string;
  resolution_number: string;
  resolution_type: 'board' | 'shareholders';
  subject: string;
  description: string;
  proposed_by: string;
  proposed_date: string;
  deadline: string;
  approvals: CircularApproval[];
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  document_url?: string;
  effective_date?: string;
  created_at: string;
}

export interface CircularApproval {
  id: string;
  resolution_id: string;
  approver_name: string;
  approver_position: string;
  decision: 'pending' | 'approved' | 'rejected' | 'abstain';
  comments?: string;
  decided_at?: string;
}

// --- Legal Knowledge Management ---

export interface LegalDocument {
  id: string;
  title: string;
  document_type: 'sk_direksi' | 'surat_edaran' | 'peraturan_perusahaan' | 'peraturan_syarikah' | 'peraturan_mudir' | 'uu' | 'peraturan_pemerintah' | 'fatwa' | 'other';
  document_number?: string;
  category: string;
  issuer: string;
  issue_date: string;
  effective_date?: string;
  summary?: string;
  keywords: string[];
  document_url: string;
  status: 'active' | 'amended' | 'revoked';
  superseded_by?: string;
  created_at: string;
  updated_at?: string;
}

export interface KnowledgeQuery {
  id: string;
  query: string;
  response: string;
  sources: string[];
  user_id?: string;
  helpful?: boolean;
  created_at: string;
}

// --- LCRMS Dashboard ---

export interface LCRMSDashboardData {
  compliance_score: number; // 0-100
  compliance_trend: { month: string; score: number }[];

  contracts_summary: {
    total: number;
    active: number;
    expiring_30: number;
    expiring_60: number;
    expiring_90: number;
    expired: number;
  };

  risks_summary: {
    total: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
    mitigated: number;
  };

  cases_summary: {
    total: number;
    open: number;
    settled: number;
    won: number;
    lost: number;
    total_exposure: number;
  };

  licenses_summary: {
    total: number;
    valid: number;
    expiring: number;
    expired: number;
  };

  coi_summary: {
    total_required: number;
    submitted: number;
    pending: number;
    with_conflicts: number;
  };

  alerts: LCRMSAlert[];

  recent_activities: LCRMSActivity[];
}

export interface LCRMSAlert {
  id: string;
  type: 'contract_expiry' | 'license_expiry' | 'risk_escalation' | 'case_hearing' | 'coi_deadline' | 'obligation_due';
  severity: 'info' | 'warning' | 'critical';
  title: string;
  message: string;
  reference_id?: string;
  reference_type?: string;
  due_date?: string;
  created_at: string;
}

export interface LCRMSActivity {
  id: string;
  activity_type: string;
  description: string;
  user_name: string;
  reference_id?: string;
  reference_type?: string;
  created_at: string;
}
