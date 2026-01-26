import type {
  Employee,
  Attendance,
  LeaveRequest,
  PayrollRecord,
  Recruitment,
  Candidate,
  PerformanceReview,
  KPI,
  Training,
  TrainingEnrollment,
  ComplianceAlert,
  DisciplinaryCase,
  HCMSDashboard,
} from '../../types';

// ==================== EMPLOYEES ====================
export const mockEmployees: Employee[] = [
  { id: '1', employee_id: 'BPKH001', first_name: 'Abdullah', last_name: 'Al-Faisal', email: 'abdullah@bpkh.sa', phone: '+966501234567', department: 'Executive', position: 'CEO', employment_status: 'active', hire_date: '2020-01-15', salary: 85000, iqamah_expiry: '2025-06-30', visa_expiry: '2025-12-31', passport_expiry: '2028-03-15' },
  { id: '2', employee_id: 'BPKH002', first_name: 'Fatima', last_name: 'Hassan', email: 'fatima@bpkh.sa', phone: '+966502345678', department: 'HR', position: 'HR Manager', employment_status: 'active', hire_date: '2020-03-01', salary: 45000, iqamah_expiry: '2025-08-15', visa_expiry: '2025-12-31', passport_expiry: '2027-11-20' },
  { id: '3', employee_id: 'BPKH003', first_name: 'Ahmed', last_name: 'Al-Rashid', email: 'ahmed@bpkh.sa', phone: '+966503456789', department: 'IT', position: 'IT Director', employment_status: 'active', hire_date: '2020-02-10', salary: 55000, iqamah_expiry: '2024-02-15', visa_expiry: '2024-06-30', passport_expiry: '2026-09-10' },
  { id: '4', employee_id: 'BPKH004', first_name: 'Mohammad', last_name: 'Khan', email: 'mohammad@bpkh.sa', phone: '+966504567890', department: 'Operations', position: 'Operations Manager', employment_status: 'active', hire_date: '2021-06-15', salary: 42000, iqamah_expiry: '2024-03-10', visa_expiry: '2024-09-30', passport_expiry: '2027-05-22' },
  { id: '5', employee_id: 'BPKH005', first_name: 'Sarah', last_name: 'Al-Qahtani', email: 'sarah@bpkh.sa', phone: '+966505678901', department: 'Finance', position: 'Financial Analyst', employment_status: 'active', hire_date: '2022-01-10', salary: 35000, iqamah_expiry: '2025-01-20', visa_expiry: '2025-07-31', passport_expiry: '2028-08-05' },
  { id: '6', employee_id: 'BPKH006', first_name: 'Khalid', last_name: 'Bin Salman', email: 'khalid@bpkh.sa', phone: '+966506789012', department: 'Finance', position: 'Accountant', employment_status: 'probation', hire_date: '2023-11-01', salary: 28000, iqamah_expiry: '2024-03-31', visa_expiry: '2024-12-31', passport_expiry: '2029-02-18' },
  { id: '7', employee_id: 'BPKH007', first_name: 'Noor', last_name: 'Ahmad', email: 'noor@bpkh.sa', phone: '+966507890123', department: 'HR', position: 'HR Coordinator', employment_status: 'active', hire_date: '2022-07-15', salary: 25000, iqamah_expiry: '2024-02-28', visa_expiry: '2024-08-31', passport_expiry: '2026-12-01' },
  { id: '8', employee_id: 'BPKH008', first_name: 'Yusuf', last_name: 'Ibrahim', email: 'yusuf@bpkh.sa', phone: '+966508901234', department: 'IT', position: 'Software Developer', employment_status: 'active', hire_date: '2021-09-01', salary: 38000, iqamah_expiry: '2025-04-15', visa_expiry: '2025-10-31', passport_expiry: '2027-07-25' },
];

// ==================== ATTENDANCE ====================
export const mockAttendance: Attendance[] = [
  { id: '1', employee_id: 'BPKH001', employee_name: 'Abdullah Al-Faisal', date: '2024-02-03', check_in: '08:00', check_out: '17:00', status: 'present', work_hours: 9 },
  { id: '2', employee_id: 'BPKH002', employee_name: 'Fatima Hassan', date: '2024-02-03', check_in: '08:15', check_out: '17:30', status: 'present', work_hours: 9.25 },
  { id: '3', employee_id: 'BPKH003', employee_name: 'Ahmed Al-Rashid', date: '2024-02-03', check_in: '09:10', check_out: '18:00', status: 'late', work_hours: 8.83, late_minutes: 70 },
  { id: '4', employee_id: 'BPKH004', employee_name: 'Mohammad Khan', date: '2024-02-03', status: 'absent' },
  { id: '5', employee_id: 'BPKH005', employee_name: 'Sarah Al-Qahtani', date: '2024-02-03', check_in: '08:05', check_out: '17:15', status: 'present', work_hours: 9.17 },
  { id: '6', employee_id: 'BPKH006', employee_name: 'Khalid Bin Salman', date: '2024-02-03', status: 'leave' },
  { id: '7', employee_id: 'BPKH007', employee_name: 'Noor Ahmad', date: '2024-02-03', check_in: '08:30', check_out: '17:45', status: 'late', work_hours: 9.25, late_minutes: 30 },
  { id: '8', employee_id: 'BPKH008', employee_name: 'Yusuf Ibrahim', date: '2024-02-03', check_in: '07:55', check_out: '17:00', status: 'present', work_hours: 9.08 },
];

// ==================== LEAVE ====================
export const mockLeaveRequests: LeaveRequest[] = [
  { id: '1', employee_id: 'BPKH004', employee_name: 'Mohammad Khan', leave_type: 'annual', start_date: '2024-02-03', end_date: '2024-02-05', days: 3, status: 'approved', reason: 'Family vacation', approved_by: 'Abdullah Al-Faisal' },
  { id: '2', employee_id: 'BPKH006', employee_name: 'Khalid Bin Salman', leave_type: 'sick', start_date: '2024-02-03', end_date: '2024-02-03', days: 1, status: 'approved', reason: 'Medical appointment', approved_by: 'Fatima Hassan' },
  { id: '3', employee_id: 'BPKH003', employee_name: 'Ahmed Al-Rashid', leave_type: 'annual', start_date: '2024-02-10', end_date: '2024-02-14', days: 5, status: 'pending', reason: 'Personal travel' },
  { id: '4', employee_id: 'BPKH005', employee_name: 'Sarah Al-Qahtani', leave_type: 'emergency', start_date: '2024-02-06', end_date: '2024-02-07', days: 2, status: 'pending', reason: 'Family emergency' },
  { id: '5', employee_id: 'BPKH008', employee_name: 'Yusuf Ibrahim', leave_type: 'annual', start_date: '2024-01-20', end_date: '2024-01-25', days: 6, status: 'approved', reason: 'Hajj preparation', approved_by: 'Ahmed Al-Rashid' },
];

// ==================== PAYROLL ====================
export const mockPayroll: PayrollRecord[] = [
  { id: '1', employee_id: 'BPKH001', employee_name: 'Abdullah Al-Faisal', period: '2024-01', basic_salary: 85000, allowances: 15000, deductions: 8500, gosi: 1700, net_salary: 89800, status: 'paid', payment_date: '2024-01-28' },
  { id: '2', employee_id: 'BPKH002', employee_name: 'Fatima Hassan', period: '2024-01', basic_salary: 45000, allowances: 8000, deductions: 4500, gosi: 900, net_salary: 47600, status: 'paid', payment_date: '2024-01-28' },
  { id: '3', employee_id: 'BPKH003', employee_name: 'Ahmed Al-Rashid', period: '2024-01', basic_salary: 55000, allowances: 10000, deductions: 5500, gosi: 1100, net_salary: 58400, status: 'paid', payment_date: '2024-01-28' },
  { id: '4', employee_id: 'BPKH004', employee_name: 'Mohammad Khan', period: '2024-01', basic_salary: 42000, allowances: 7000, deductions: 4200, gosi: 840, net_salary: 43960, status: 'paid', payment_date: '2024-01-28' },
  { id: '5', employee_id: 'BPKH005', employee_name: 'Sarah Al-Qahtani', period: '2024-01', basic_salary: 35000, allowances: 5000, deductions: 3500, gosi: 700, net_salary: 35800, status: 'paid', payment_date: '2024-01-28' },
  { id: '6', employee_id: 'BPKH006', employee_name: 'Khalid Bin Salman', period: '2024-01', basic_salary: 28000, allowances: 4000, deductions: 2800, gosi: 560, net_salary: 28640, status: 'processing' },
  { id: '7', employee_id: 'BPKH007', employee_name: 'Noor Ahmad', period: '2024-01', basic_salary: 25000, allowances: 3500, deductions: 2500, gosi: 500, net_salary: 25500, status: 'paid', payment_date: '2024-01-28' },
  { id: '8', employee_id: 'BPKH008', employee_name: 'Yusuf Ibrahim', period: '2024-01', basic_salary: 38000, allowances: 6000, deductions: 3800, gosi: 760, net_salary: 39440, status: 'paid', payment_date: '2024-01-28' },
];

// ==================== RECRUITMENT ====================
export const mockRecruitments: Recruitment[] = [
  { id: '1', position: 'Senior Software Engineer', department: 'IT', status: 'interviewing', applicants: 45, shortlisted: 8, posted_date: '2024-01-05', closing_date: '2024-02-05', hiring_manager: 'Ahmed Al-Rashid' },
  { id: '2', position: 'Financial Analyst', department: 'Finance', status: 'screening', applicants: 32, shortlisted: 5, posted_date: '2024-01-15', closing_date: '2024-02-15', hiring_manager: 'Abdullah Al-Faisal' },
  { id: '3', position: 'HR Coordinator', department: 'HR', status: 'open', applicants: 18, shortlisted: 0, posted_date: '2024-01-20', closing_date: '2024-02-20', hiring_manager: 'Fatima Hassan' },
  { id: '4', position: 'Operations Specialist', department: 'Operations', status: 'offer', applicants: 28, shortlisted: 3, posted_date: '2024-01-01', closing_date: '2024-01-31', hiring_manager: 'Mohammad Khan' },
];

export const mockCandidates: Candidate[] = [
  { id: '1', recruitment_id: '1', name: 'Omar Farooq', email: 'omar@email.com', phone: '+966501234567', status: 'interview', score: 85, applied_at: '2024-01-10' },
  { id: '2', recruitment_id: '1', name: 'Layla Ahmed', email: 'layla@email.com', phone: '+966502345678', status: 'interview', score: 92, applied_at: '2024-01-08' },
  { id: '3', recruitment_id: '1', name: 'Hassan Ali', email: 'hassan@email.com', phone: '+966503456789', status: 'screening', score: 78, applied_at: '2024-01-12' },
  { id: '4', recruitment_id: '4', name: 'Maryam Khan', email: 'maryam@email.com', phone: '+966504567890', status: 'offer', score: 88, applied_at: '2024-01-05' },
];

// ==================== PERFORMANCE ====================
export const mockReviews: PerformanceReview[] = [
  { id: '1', employee_id: 'BPKH001', employee_name: 'Abdullah Al-Faisal', period: '2023', review_type: 'annual', overall_score: 4.5, rating: 'exceeds', reviewer_id: 'BPKH000', reviewer_name: 'Board', status: 'acknowledged', comments: 'Excellent leadership and strategic vision', created_at: '2024-01-15' },
  { id: '2', employee_id: 'BPKH002', employee_name: 'Fatima Hassan', period: '2023', review_type: 'annual', overall_score: 4.2, rating: 'exceeds', reviewer_id: 'BPKH001', reviewer_name: 'Abdullah Al-Faisal', status: 'acknowledged', created_at: '2024-01-15' },
  { id: '3', employee_id: 'BPKH003', employee_name: 'Ahmed Al-Rashid', period: '2023', review_type: 'annual', overall_score: 4.0, rating: 'meets', reviewer_id: 'BPKH001', reviewer_name: 'Abdullah Al-Faisal', status: 'submitted', created_at: '2024-01-18' },
  { id: '4', employee_id: 'BPKH004', employee_name: 'Mohammad Khan', period: '2023', review_type: 'annual', overall_score: 3.8, rating: 'meets', reviewer_id: 'BPKH001', reviewer_name: 'Abdullah Al-Faisal', status: 'submitted', created_at: '2024-01-18' },
  { id: '5', employee_id: 'BPKH005', employee_name: 'Sarah Al-Qahtani', period: '2023', review_type: 'annual', overall_score: 4.3, rating: 'exceeds', reviewer_id: 'BPKH001', reviewer_name: 'Abdullah Al-Faisal', status: 'draft', created_at: '2024-01-20' },
];

export const mockKPIs: KPI[] = [
  { id: '1', employee_id: 'BPKH001', employee_name: 'Abdullah Al-Faisal', period: '2024-Q1', kpi_name: 'Revenue Growth', target: 15, actual: 18, weight: 30, score: 120, category: 'quantitative' },
  { id: '2', employee_id: 'BPKH001', employee_name: 'Abdullah Al-Faisal', period: '2024-Q1', kpi_name: 'Cost Reduction', target: 10, actual: 8, weight: 20, score: 80, category: 'quantitative' },
  { id: '3', employee_id: 'BPKH001', employee_name: 'Abdullah Al-Faisal', period: '2024-Q1', kpi_name: 'Team Development', target: 100, actual: 95, weight: 25, score: 95, category: 'qualitative' },
  { id: '4', employee_id: 'BPKH001', employee_name: 'Abdullah Al-Faisal', period: '2024-Q1', kpi_name: 'Compliance Score', target: 100, actual: 100, weight: 25, score: 100, category: 'quantitative' },
];

export const ratingDistribution = [
  { rating: 'Exceptional', count: 2, percentage: 4 },
  { rating: 'Exceeds', count: 15, percentage: 31 },
  { rating: 'Meets', count: 25, percentage: 52 },
  { rating: 'Below', count: 5, percentage: 10 },
  { rating: 'Unsatisfactory', count: 1, percentage: 2 },
];

// ==================== TRAINING ====================
export const mockTrainings: Training[] = [
  { id: '1', title: 'Islamic Finance Fundamentals', type: 'internal', category: 'mandatory', start_date: '2024-02-01', end_date: '2024-02-02', duration_hours: 16, max_participants: 30, enrolled: 25, status: 'upcoming' },
  { id: '2', title: 'Advanced Excel for Finance', type: 'external', category: 'technical', start_date: '2024-02-10', end_date: '2024-02-10', duration_hours: 8, provider: 'Microsoft', max_participants: 20, enrolled: 18, status: 'upcoming' },
  { id: '3', title: 'Leadership Development Program', type: 'internal', category: 'leadership', start_date: '2024-01-15', end_date: '2024-03-15', duration_hours: 40, max_participants: 15, enrolled: 12, status: 'ongoing' },
  { id: '4', title: 'Cybersecurity Awareness', type: 'online', category: 'mandatory', start_date: '2024-01-20', end_date: '2024-01-20', duration_hours: 4, max_participants: 50, enrolled: 45, status: 'completed' },
  { id: '5', title: 'Project Management Professional', type: 'external', category: 'technical', start_date: '2024-03-01', end_date: '2024-03-05', duration_hours: 35, provider: 'PMI', max_participants: 10, enrolled: 8, status: 'upcoming' },
];

export const mockEnrollments: TrainingEnrollment[] = [
  { id: '1', training_id: '4', employee_id: 'BPKH001', employee_name: 'Abdullah Al-Faisal', status: 'completed', score: 95, certificate_url: '/certs/cyber-001.pdf' },
  { id: '2', training_id: '4', employee_id: 'BPKH002', employee_name: 'Fatima Hassan', status: 'completed', score: 92 },
  { id: '3', training_id: '3', employee_id: 'BPKH003', employee_name: 'Ahmed Al-Rashid', status: 'enrolled' },
  { id: '4', training_id: '1', employee_id: 'BPKH005', employee_name: 'Sarah Al-Qahtani', status: 'enrolled' },
];

// ==================== COMPLIANCE ====================
export const mockComplianceAlerts: ComplianceAlert[] = [
  { id: '1', employee_id: 'BPKH003', employee_name: 'Ahmed Al-Rashid', alert_type: 'iqamah_expiry', expiry_date: '2024-02-15', days_remaining: 12, status: 'active' },
  { id: '2', employee_id: 'BPKH007', employee_name: 'Noor Ahmad', alert_type: 'iqamah_expiry', expiry_date: '2024-02-28', days_remaining: 25, status: 'active' },
  { id: '3', employee_id: 'BPKH004', employee_name: 'Mohammad Khan', alert_type: 'visa_expiry', expiry_date: '2024-03-10', days_remaining: 36, status: 'active' },
  { id: '4', employee_id: 'BPKH003', employee_name: 'Ahmed Al-Rashid', alert_type: 'passport_expiry', expiry_date: '2024-06-15', days_remaining: 132, status: 'active' },
  { id: '5', employee_id: 'BPKH006', employee_name: 'Khalid Bin Salman', alert_type: 'contract_expiry', expiry_date: '2024-03-31', days_remaining: 57, status: 'active' },
];

export const mockDisciplinaryCases: DisciplinaryCase[] = [
  { id: '1', employee_id: 'BPKH008', employee_name: 'Yusuf Ibrahim', case_type: 'warning', severity: 'minor', description: 'Repeated tardiness', action_taken: 'Verbal warning issued', status: 'resolved', created_at: '2023-11-15', resolved_at: '2023-11-20' },
  { id: '2', employee_id: 'BPKH009', employee_name: 'Ali Hassan', case_type: 'warning', severity: 'major', description: 'Policy violation - unauthorized access', action_taken: 'Written warning (SP1)', status: 'resolved', created_at: '2023-12-01', resolved_at: '2023-12-10' },
];

// ==================== DASHBOARD ====================
export const mockHCMSDashboard: HCMSDashboard = {
  total_employees: 48,
  active_employees: 45,
  departments: [
    { name: 'Executive', count: 2, percentage: 4 },
    { name: 'Finance', count: 12, percentage: 25 },
    { name: 'IT', count: 8, percentage: 17 },
    { name: 'HR', count: 6, percentage: 12 },
    { name: 'Operations', count: 15, percentage: 31 },
    { name: 'Legal', count: 5, percentage: 11 },
  ],
  attendance_today: { present: 40, absent: 3, late: 2, leave: 3 },
  pending_leaves: 5,
  upcoming_trainings: 3,
  compliance_alerts: 5,
  headcount_trend: [
    { month: 'Aug', count: 42 },
    { month: 'Sep', count: 44 },
    { month: 'Oct', count: 45 },
    { month: 'Nov', count: 46 },
    { month: 'Dec', count: 47 },
    { month: 'Jan', count: 48 },
  ],
};

// ==================== FETCHER FUNCTIONS ====================
// These simulate API calls with a small delay

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const hcmsApi = {
  employees: {
    getAll: async () => { await delay(300); return mockEmployees; },
    getById: async (id: string) => { await delay(200); return mockEmployees.find(e => e.id === id); },
  },
  attendance: {
    getAll: async () => { await delay(300); return mockAttendance; },
    getByDate: async (date: string) => { await delay(200); return mockAttendance.filter(a => a.date === date); },
  },
  leave: {
    getAll: async () => { await delay(300); return mockLeaveRequests; },
    getPending: async () => { await delay(200); return mockLeaveRequests.filter(l => l.status === 'pending'); },
  },
  payroll: {
    getAll: async () => { await delay(300); return mockPayroll; },
    getByPeriod: async (period: string) => { await delay(200); return mockPayroll.filter(p => p.period === period); },
  },
  recruitment: {
    getAll: async () => { await delay(300); return mockRecruitments; },
    getCandidates: async (recruitmentId?: string) => {
      await delay(200);
      return recruitmentId ? mockCandidates.filter(c => c.recruitment_id === recruitmentId) : mockCandidates;
    },
  },
  performance: {
    getReviews: async () => { await delay(300); return mockReviews; },
    getKPIs: async (employeeId?: string) => {
      await delay(200);
      return employeeId ? mockKPIs.filter(k => k.employee_id === employeeId) : mockKPIs;
    },
  },
  training: {
    getAll: async () => { await delay(300); return mockTrainings; },
    getEnrollments: async (trainingId?: string) => {
      await delay(200);
      return trainingId ? mockEnrollments.filter(e => e.training_id === trainingId) : mockEnrollments;
    },
  },
  compliance: {
    getAlerts: async () => { await delay(300); return mockComplianceAlerts; },
    getCases: async () => { await delay(300); return mockDisciplinaryCases; },
  },
  dashboard: {
    getSummary: async () => { await delay(400); return mockHCMSDashboard; },
  },
};
