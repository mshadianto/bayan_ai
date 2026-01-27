import type {
  Contract,
  ContractObligation,
  ContractAlert,
  License,
  COIDeclaration,
  EmployeeViolation,
  Risk,
  RiskHeatmapCell,
  LitigationCase,
  ExternalCounsel,
  MeetingMinutes,
  Shareholder,
  CircularResolution,
  LegalDocument,
  LCRMSDashboardData,
  LCRMSAlert,
} from '../../types';

// ==================== CONTRACTS ====================
export const mockContracts: Contract[] = [
  {
    id: '1',
    contract_number: 'PKS-2024-001',
    name: 'Kerjasama Layanan Haji dengan Ministry of Hajj',
    type: 'pks',
    partner_name: 'Ministry of Hajj and Umrah',
    partner_contact: 'moh@gov.sa',
    description: 'Perjanjian kerjasama penyelenggaraan layanan haji',
    start_date: '2024-01-01',
    end_date: '2026-12-31',
    value: 50000000,
    currency: 'SAR',
    status: 'active',
    auto_renewal: false,
    renewal_notice_days: 90,
    document_url: '/docs/pks-001.pdf',
    obligations: [],
    versions: [{ id: '1', version_number: 1, changes_summary: 'Initial version', document_url: '/docs/pks-001-v1.pdf', created_by: 'Legal Team', created_at: '2024-01-01' }],
    created_by: 'Ahmad Legal',
    created_at: '2024-01-01',
  },
  {
    id: '2',
    contract_number: 'VND-2024-015',
    name: 'Kontrak Catering Jamaah Haji',
    type: 'vendor',
    partner_name: 'Al-Madinah Catering Co.',
    partner_contact: 'sales@almadinah.sa',
    description: 'Penyediaan layanan catering untuk jamaah haji',
    start_date: '2024-03-01',
    end_date: '2024-09-30',
    value: 8500000,
    currency: 'SAR',
    status: 'active',
    auto_renewal: true,
    renewal_notice_days: 60,
    obligations: [],
    versions: [],
    created_at: '2024-02-15',
  },
  {
    id: '3',
    contract_number: 'SEW-2023-008',
    name: 'Sewa Gedung Kantor Jeddah',
    type: 'sewa',
    partner_name: 'Jeddah Properties LLC',
    partner_contact: 'lease@jeddahprop.sa',
    description: 'Kontrak sewa gedung kantor pusat Jeddah',
    start_date: '2023-01-01',
    end_date: '2025-12-31',
    value: 2400000,
    currency: 'SAR',
    status: 'active',
    auto_renewal: true,
    renewal_notice_days: 180,
    obligations: [],
    versions: [],
    created_at: '2022-11-15',
  },
  {
    id: '4',
    contract_number: 'NDA-2024-022',
    name: 'NDA dengan IT Vendor',
    type: 'nda',
    partner_name: 'Tech Solutions Arabia',
    partner_contact: 'legal@techsol.sa',
    description: 'Non-disclosure agreement untuk proyek IT',
    start_date: '2024-02-01',
    end_date: '2025-02-01',
    status: 'expiring',
    auto_renewal: false,
    obligations: [],
    versions: [],
    created_at: '2024-02-01',
  },
  {
    id: '5',
    contract_number: 'VND-2023-042',
    name: 'Kontrak Transportasi Jamaah',
    type: 'vendor',
    partner_name: 'Saudi Transport Group',
    partner_contact: 'contracts@stg.sa',
    description: 'Layanan transportasi bus jamaah haji',
    start_date: '2023-06-01',
    end_date: '2024-02-15',
    value: 3200000,
    currency: 'SAR',
    status: 'expired',
    auto_renewal: false,
    obligations: [],
    versions: [],
    created_at: '2023-05-15',
  },
];

export const mockContractObligations: ContractObligation[] = [
  { id: '1', contract_id: '1', description: 'Penyerahan laporan bulanan penyelenggaraan', due_date: '2024-02-28', responsible_party: 'company', status: 'completed', completed_at: '2024-02-25' },
  { id: '2', contract_id: '1', description: 'Pembayaran termin Q1', due_date: '2024-03-31', responsible_party: 'partner', status: 'pending' },
  { id: '3', contract_id: '2', description: 'Sertifikasi halal catering', due_date: '2024-02-28', responsible_party: 'partner', status: 'completed', completed_at: '2024-02-20' },
  { id: '4', contract_id: '2', description: 'Laporan kualitas makanan mingguan', due_date: '2024-03-07', responsible_party: 'partner', status: 'pending' },
  { id: '5', contract_id: '3', description: 'Pembayaran sewa Q1 2024', due_date: '2024-03-01', responsible_party: 'company', status: 'overdue' },
];

export const mockContractAlerts: ContractAlert[] = [
  { id: '1', contract_id: '4', contract_name: 'NDA dengan IT Vendor', partner_name: 'Tech Solutions Arabia', alert_type: 'expiry_30', days_remaining: 28, message: 'Kontrak akan berakhir dalam 28 hari', status: 'active', created_at: '2024-01-05' },
  { id: '2', contract_id: '5', contract_name: 'Kontrak Transportasi Jamaah', partner_name: 'Saudi Transport Group', alert_type: 'expiry_30', days_remaining: 0, message: 'Kontrak telah expired', status: 'active', created_at: '2024-02-16' },
  { id: '3', contract_id: '3', contract_name: 'Sewa Gedung Kantor Jeddah', partner_name: 'Jeddah Properties LLC', alert_type: 'obligation_due', days_remaining: -5, message: 'Kewajiban pembayaran sewa overdue', status: 'active', created_at: '2024-03-06' },
  { id: '4', contract_id: '2', contract_name: 'Kontrak Catering Jamaah Haji', partner_name: 'Al-Madinah Catering Co.', alert_type: 'auto_renewal', days_remaining: 60, message: 'Auto-renewal dalam 60 hari', status: 'active', created_at: '2024-01-01' },
];

// ==================== LICENSES ====================
export const mockLicenses: License[] = [
  { id: '1', name: 'Nomor Induk Berusaha (NIB)', type: 'nib', license_number: 'NIB-1234567890123', issuer: 'OSS Indonesia', country: 'ID', issue_date: '2022-01-15', expiry_date: '2027-01-15', status: 'valid', created_at: '2022-01-15' },
  { id: '2', name: 'Saudi Commercial Registration', type: 'commercial_registration', license_number: 'CR-1010123456', issuer: 'Ministry of Commerce KSA', country: 'SA', issue_date: '2023-03-01', expiry_date: '2024-03-01', status: 'expiring', created_at: '2023-03-01' },
  { id: '3', name: 'Izin Operasional PPIU', type: 'operational_permit', license_number: 'PPIU-2023-0045', issuer: 'Kemenag RI', country: 'ID', issue_date: '2023-06-01', expiry_date: '2028-06-01', status: 'valid', created_at: '2023-06-01' },
  { id: '4', name: 'Tax Registration Certificate', type: 'tax_registration', license_number: 'VAT-123456789', issuer: 'ZATCA Saudi Arabia', country: 'SA', issue_date: '2022-01-01', expiry_date: '2024-01-01', status: 'expired', renewal_notes: 'Menunggu dokumen perpanjangan', created_at: '2022-01-01' },
];

// ==================== COI DECLARATIONS ====================
export const mockCOIDeclarations: COIDeclaration[] = [
  { id: '1', employee_id: 'BPKH001', employee_name: 'Abdullah Al-Faisal', department: 'Executive', position: 'CEO', year: 2024, has_conflict: false, status: 'approved', submitted_at: '2024-01-10', reviewed_by: 'Board of Directors', reviewed_at: '2024-01-15', created_at: '2024-01-10' },
  { id: '2', employee_id: 'BPKH002', employee_name: 'Fatima Hassan', department: 'HR', position: 'HR Manager', year: 2024, has_conflict: false, status: 'approved', submitted_at: '2024-01-12', reviewed_by: 'Abdullah Al-Faisal', reviewed_at: '2024-01-14', created_at: '2024-01-12' },
  { id: '3', employee_id: 'BPKH003', employee_name: 'Ahmed Al-Rashid', department: 'IT', position: 'IT Director', year: 2024, has_conflict: true, conflict_details: 'Memiliki saham di perusahaan IT vendor', related_parties: ['Tech Solutions Arabia'], mitigation_plan: 'Tidak terlibat dalam pengadaan IT', status: 'reviewed', submitted_at: '2024-01-15', reviewed_by: 'Legal Team', reviewed_at: '2024-01-20', created_at: '2024-01-15' },
  { id: '4', employee_id: 'BPKH004', employee_name: 'Mohammad Khan', department: 'Operations', position: 'Operations Manager', year: 2024, has_conflict: false, status: 'submitted', submitted_at: '2024-01-18', created_at: '2024-01-18' },
  { id: '5', employee_id: 'BPKH005', employee_name: 'Sarah Al-Qahtani', department: 'Finance', position: 'Financial Analyst', year: 2024, has_conflict: false, status: 'pending', submitted_at: '2024-01-25', created_at: '2024-01-20' },
];

// ==================== EMPLOYEE VIOLATIONS ====================
export const mockViolations: EmployeeViolation[] = [
  { id: '1', employee_id: 'BPKH009', employee_name: 'Ali Hassan', department: 'Operations', violation_type: 'policy_breach', severity: 'moderate', description: 'Unauthorized access to restricted system', incident_date: '2023-12-01', reported_by: 'IT Security', investigation_status: 'concluded', action_taken: 'Written warning (SP1)', resolution: 'Employee acknowledged and completed security training', resolved_at: '2023-12-15', created_at: '2023-12-01' },
  { id: '2', employee_id: 'BPKH010', employee_name: 'Zahra Ibrahim', department: 'Finance', violation_type: 'code_of_ethics', severity: 'minor', description: 'Late submission of expense reports multiple times', incident_date: '2024-01-10', reported_by: 'Finance Manager', investigation_status: 'concluded', action_taken: 'Verbal warning', resolved_at: '2024-01-15', created_at: '2024-01-10' },
  { id: '3', employee_id: 'BPKH011', employee_name: 'Omar Farooq', department: 'Procurement', violation_type: 'fraud', severity: 'critical', description: 'Suspected kickback from vendor', incident_date: '2024-02-01', reported_by: 'Internal Audit', investigation_status: 'investigating', created_at: '2024-02-01' },
];

// ==================== RISKS ====================
export const mockRisks: Risk[] = [
  { id: '1', risk_code: 'RSK-2024-001', division: 'Operations', category: 'operational', name: 'Keterlambatan visa jamaah', description: 'Risiko keterlambatan penerbitan visa jamaah haji yang berdampak pada jadwal keberangkatan', cause: 'Proses birokrasi dan volume tinggi', impact_description: 'Penundaan keberangkatan, komplain jamaah', impact_score: 4, likelihood_score: 3, risk_score: 12, level: 'high', mitigation_plan: 'Pengajuan visa lebih awal, koordinasi intensif dengan kedutaan', mitigation_status: 'in_progress', pic_name: 'Mohammad Khan', status: 'open', created_at: '2024-01-15' },
  { id: '2', risk_code: 'RSK-2024-002', division: 'Finance', category: 'financial', name: 'Fluktuasi nilai tukar SAR/IDR', description: 'Risiko kerugian akibat perubahan nilai tukar mata uang', cause: 'Volatilitas pasar valuta asing', impact_description: 'Kerugian selisih kurs', impact_score: 3, likelihood_score: 4, risk_score: 12, level: 'high', mitigation_plan: 'Hedging, natural hedge melalui pendapatan SAR', mitigation_status: 'implemented', pic_name: 'Sarah Al-Qahtani', status: 'mitigated', created_at: '2024-01-10' },
  { id: '3', risk_code: 'RSK-2024-003', division: 'Legal', category: 'compliance', name: 'Ketidakpatuhan regulasi PPIU', description: 'Risiko pencabutan izin operasional akibat pelanggaran regulasi', cause: 'Kurangnya pemahaman peraturan terbaru', impact_description: 'Pencabutan izin, denda, reputasi', impact_score: 5, likelihood_score: 2, risk_score: 10, level: 'medium', mitigation_plan: 'Training reguler, konsultasi dengan regulator', mitigation_status: 'monitoring', pic_name: 'Legal Team', status: 'open', created_at: '2024-01-20' },
  { id: '4', risk_code: 'RSK-2024-004', division: 'IT', category: 'operational', name: 'Serangan siber', description: 'Risiko kebocoran data atau gangguan sistem akibat serangan siber', cause: 'Kerentanan sistem, social engineering', impact_description: 'Kebocoran data, downtime sistem', impact_score: 5, likelihood_score: 3, risk_score: 15, level: 'critical', mitigation_plan: 'Penetration testing, employee awareness, backup system', mitigation_status: 'in_progress', pic_name: 'Ahmed Al-Rashid', status: 'open', created_at: '2024-02-01' },
  { id: '5', risk_code: 'RSK-2024-005', division: 'Operations', category: 'shariah', name: 'Ketidakpatuhan Syariah pada layanan', description: 'Risiko layanan tidak sesuai prinsip syariah', cause: 'Kurangnya pengawasan syariah', impact_description: 'Reputasi, kepercayaan jamaah', impact_score: 4, likelihood_score: 2, risk_score: 8, level: 'medium', mitigation_plan: 'Audit syariah berkala, DPS review', mitigation_status: 'monitoring', pic_name: 'Shariah Board', status: 'open', created_at: '2024-01-25' },
  { id: '6', risk_code: 'RSK-2024-006', division: 'HR', category: 'reputational', name: 'Turnover karyawan kunci', description: 'Risiko kehilangan talenta kunci yang berdampak pada operasional', cause: 'Kompensasi tidak kompetitif, career path', impact_description: 'Gangguan operasional, biaya rekrutmen', impact_score: 3, likelihood_score: 3, risk_score: 9, level: 'medium', mitigation_plan: 'Retention program, succession planning', mitigation_status: 'identified', pic_name: 'Fatima Hassan', status: 'open', created_at: '2024-02-05' },
];

// ==================== LITIGATION ====================
export const mockCases: LitigationCase[] = [
  {
    id: '1',
    case_number: 'LIT-2023-005',
    title: 'Sengketa Kontrak dengan Vendor Transportasi',
    type: 'litigation',
    court_name: 'Pengadilan Niaga Jakarta',
    jurisdiction: 'Indonesia',
    plaintiff: 'BPKH Limited',
    defendant: 'PT Transport Nusantara',
    subject_matter: 'Wanprestasi kontrak layanan transportasi',
    claim_amount: 2500000000,
    currency: 'IDR',
    status: 'trial',
    priority: 'high',
    external_counsel_id: '1',
    external_counsel_name: 'Law Firm Hakim & Partners',
    timeline: [
      { id: '1', case_id: '1', event_type: 'filing', title: 'Pendaftaran Gugatan', date: '2023-08-15', created_at: '2023-08-15' },
      { id: '2', case_id: '1', event_type: 'hearing', title: 'Sidang Pertama', date: '2023-09-20', location: 'Ruang 5 PN Jakarta', created_at: '2023-09-20' },
      { id: '3', case_id: '1', event_type: 'submission', title: 'Penyerahan Bukti', date: '2023-10-15', created_at: '2023-10-15' },
      { id: '4', case_id: '1', event_type: 'hearing', title: 'Sidang Pembuktian', date: '2024-02-28', location: 'Ruang 5 PN Jakarta', created_at: '2024-01-15' },
    ],
    documents: [
      { id: '1', case_id: '1', name: 'Surat Gugatan', document_type: 'pleading', document_url: '/docs/lit-001-gugatan.pdf', uploaded_by: 'Legal Team', uploaded_at: '2023-08-15' },
      { id: '2', case_id: '1', name: 'Kontrak Asli', document_type: 'evidence', document_url: '/docs/lit-001-kontrak.pdf', uploaded_by: 'Legal Team', uploaded_at: '2023-08-15' },
    ],
    costs: [
      { id: '1', case_id: '1', description: 'Biaya Pendaftaran', category: 'court_fees', amount: 5000000, currency: 'IDR', date: '2023-08-15', paid: true },
      { id: '2', case_id: '1', description: 'Legal Fee Q3 2023', category: 'legal_fees', amount: 150000000, currency: 'IDR', date: '2023-09-30', invoice_number: 'INV-HP-2023-089', paid: true },
      { id: '3', case_id: '1', description: 'Legal Fee Q4 2023', category: 'legal_fees', amount: 175000000, currency: 'IDR', date: '2023-12-31', invoice_number: 'INV-HP-2023-142', paid: false },
    ],
    opened_at: '2023-08-15',
    created_at: '2023-08-15',
  },
  {
    id: '2',
    case_number: 'ARB-2024-001',
    title: 'Arbitrase Klaim Asuransi',
    type: 'arbitration',
    jurisdiction: 'Saudi Arabia',
    plaintiff: 'BPKH Limited',
    defendant: 'Saudi Insurance Co.',
    subject_matter: 'Penolakan klaim asuransi perjalanan jamaah',
    claim_amount: 850000,
    currency: 'SAR',
    status: 'discovery',
    priority: 'medium',
    timeline: [
      { id: '5', case_id: '2', event_type: 'filing', title: 'Filing Arbitration Request', date: '2024-01-10', created_at: '2024-01-10' },
    ],
    documents: [],
    costs: [
      { id: '4', case_id: '2', description: 'Arbitration Fee', category: 'court_fees', amount: 25000, currency: 'SAR', date: '2024-01-10', paid: true },
    ],
    opened_at: '2024-01-10',
    created_at: '2024-01-10',
  },
  {
    id: '3',
    case_number: 'MED-2023-012',
    title: 'Mediasi Komplain Jamaah',
    type: 'mediation',
    jurisdiction: 'Indonesia',
    plaintiff: 'Kelompok Jamaah Haji 2023',
    defendant: 'BPKH Limited',
    subject_matter: 'Komplain kualitas layanan akomodasi',
    claim_amount: 500000000,
    currency: 'IDR',
    status: 'settled',
    priority: 'low',
    timeline: [],
    documents: [],
    costs: [],
    outcome: 'Settled - Refund partial dan kompensasi',
    settlement_amount: 150000000,
    opened_at: '2023-11-01',
    closed_at: '2024-01-15',
    created_at: '2023-11-01',
  },
];

export const mockCounsels: ExternalCounsel[] = [
  { id: '1', firm_name: 'Law Firm Hakim & Partners', contact_person: 'Dr. Hakim Wijaya, SH, MH', email: 'hakim@hakimpartners.co.id', phone: '+6221-5551234', address: 'Menara BCA Lt. 35, Jakarta', specialization: ['Corporate Law', 'Commercial Litigation', 'Arbitration'], jurisdiction: ['Indonesia'], hourly_rate: 5000000, currency: 'IDR', cases_handled: 5, cases_won: 4, performance_rating: 4.5, contract_start: '2022-01-01', contract_end: '2024-12-31', status: 'active', created_at: '2022-01-01' },
  { id: '2', firm_name: 'Al-Rashid Law Firm', contact_person: 'Adv. Mohammed Al-Rashid', email: 'mohammed@alrashidlaw.sa', phone: '+966-11-4567890', address: 'King Fahd Road, Riyadh', specialization: ['Saudi Commercial Law', 'Islamic Finance', 'Arbitration'], jurisdiction: ['Saudi Arabia', 'GCC'], hourly_rate: 2500, currency: 'SAR', cases_handled: 3, cases_won: 2, performance_rating: 4.0, contract_start: '2023-06-01', status: 'active', created_at: '2023-06-01' },
];

// ==================== SECRETARIAL ====================
export const mockMeetings: MeetingMinutes[] = [
  {
    id: '1',
    meeting_number: 'MoM-BOD-2024-001',
    meeting_type: 'board_of_directors',
    title: 'Rapat Direksi Januari 2024',
    date: '2024-01-15',
    start_time: '09:00',
    end_time: '12:00',
    location: 'Ruang Rapat Utama, Kantor Jakarta',
    attendees: [
      { id: '1', name: 'Abdullah Al-Faisal', position: 'Direktur Utama', attendance: 'present' },
      { id: '2', name: 'Ahmad Surya', position: 'Direktur Operasional', attendance: 'present' },
      { id: '3', name: 'Fatimah Zahra', position: 'Direktur Keuangan', attendance: 'proxy', proxy_name: 'Sarah Al-Qahtani' },
    ],
    agenda: ['Laporan Kinerja Q4 2023', 'Rencana Kerja 2024', 'Pembahasan Budget', 'Lain-lain'],
    decisions: [
      { id: '1', decision_number: 'KEP-001/BOD/I/2024', description: 'Menyetujui Laporan Kinerja Q4 2023', voting_result: 'Unanimous', effective_date: '2024-01-15' },
      { id: '2', decision_number: 'KEP-002/BOD/I/2024', description: 'Menyetujui Budget Operasional 2024 sebesar SAR 120 juta', voting_result: '2-1' },
    ],
    action_items: [
      { id: '1', description: 'Finalisasi dokumen budget', responsible: 'Finance Team', due_date: '2024-01-31', status: 'completed' },
      { id: '2', description: 'Sosialisasi target 2024 ke seluruh karyawan', responsible: 'HR Team', due_date: '2024-02-15', status: 'in_progress' },
    ],
    document_url: '/docs/mom-bod-2024-001.pdf',
    status: 'signed',
    prepared_by: 'Corporate Secretary',
    approved_by: 'Abdullah Al-Faisal',
    created_at: '2024-01-15',
  },
  {
    id: '2',
    meeting_number: 'MoM-RUPS-2024-001',
    meeting_type: 'rups',
    title: 'RUPS Tahunan 2024',
    date: '2024-02-20',
    start_time: '10:00',
    end_time: '14:00',
    location: 'Ballroom Hotel Grand Hyatt Jakarta',
    attendees: [
      { id: '4', name: 'BPKH RI', position: 'Pemegang Saham Mayoritas', attendance: 'present' },
      { id: '5', name: 'PT Investasi Haji', position: 'Pemegang Saham', attendance: 'present' },
    ],
    agenda: ['Pengesahan Laporan Tahunan 2023', 'Pengesahan Laporan Keuangan 2023', 'Penetapan Penggunaan Laba', 'Penunjukan Auditor'],
    decisions: [
      { id: '3', decision_number: 'KEP-RUPS-001/2024', description: 'Mengesahkan Laporan Tahunan dan Keuangan 2023', voting_result: 'Unanimous' },
      { id: '4', decision_number: 'KEP-RUPS-002/2024', description: 'Menetapkan 30% laba ditahan untuk ekspansi', voting_result: 'Unanimous' },
    ],
    action_items: [],
    status: 'finalized',
    prepared_by: 'Corporate Secretary',
    created_at: '2024-02-20',
  },
];

export const mockShareholders: Shareholder[] = [
  { id: '1', name: 'Badan Pengelola Keuangan Haji (BPKH) RI', type: 'government', nationality: 'Indonesia', shares: 7000000, percentage: 70, share_class: 'common', acquisition_date: '2020-01-01', acquisition_type: 'founding', status: 'active', created_at: '2020-01-01' },
  { id: '2', name: 'PT Investasi Haji Indonesia', type: 'corporate', nationality: 'Indonesia', shares: 2000000, percentage: 20, share_class: 'common', acquisition_date: '2020-01-01', acquisition_type: 'founding', status: 'active', created_at: '2020-01-01' },
  { id: '3', name: 'Saudi Hajj Investment Co.', type: 'corporate', nationality: 'Saudi Arabia', shares: 1000000, percentage: 10, share_class: 'common', acquisition_date: '2022-06-15', acquisition_type: 'purchase', status: 'active', contact_email: 'invest@saudihajj.sa', created_at: '2022-06-15' },
];

export const mockResolutions: CircularResolution[] = [
  {
    id: '1',
    resolution_number: 'CR-BOD-2024-001',
    resolution_type: 'board',
    subject: 'Persetujuan Penandatanganan MoU dengan Travel Agent',
    description: 'Persetujuan untuk menandatangani MoU kerjasama dengan 5 travel agent baru untuk musim haji 2024',
    proposed_by: 'Direktur Operasional',
    proposed_date: '2024-02-01',
    deadline: '2024-02-10',
    approvals: [
      { id: '1', resolution_id: '1', approver_name: 'Abdullah Al-Faisal', approver_position: 'Direktur Utama', decision: 'approved', decided_at: '2024-02-02' },
      { id: '2', resolution_id: '1', approver_name: 'Ahmad Surya', approver_position: 'Direktur Operasional', decision: 'approved', decided_at: '2024-02-03' },
      { id: '3', resolution_id: '1', approver_name: 'Fatimah Zahra', approver_position: 'Direktur Keuangan', decision: 'approved', comments: 'Dengan catatan budget tidak melebihi alokasi', decided_at: '2024-02-05' },
    ],
    status: 'approved',
    effective_date: '2024-02-05',
    created_at: '2024-02-01',
  },
  {
    id: '2',
    resolution_number: 'CR-BOD-2024-002',
    resolution_type: 'board',
    subject: 'Pembukaan Rekening Bank Baru',
    description: 'Persetujuan pembukaan rekening operasional di Bank Al-Rajhi',
    proposed_by: 'Direktur Keuangan',
    proposed_date: '2024-02-15',
    deadline: '2024-02-25',
    approvals: [
      { id: '4', resolution_id: '2', approver_name: 'Abdullah Al-Faisal', approver_position: 'Direktur Utama', decision: 'approved', decided_at: '2024-02-16' },
      { id: '5', resolution_id: '2', approver_name: 'Ahmad Surya', approver_position: 'Direktur Operasional', decision: 'pending' },
      { id: '6', resolution_id: '2', approver_name: 'Fatimah Zahra', approver_position: 'Direktur Keuangan', decision: 'approved', decided_at: '2024-02-15' },
    ],
    status: 'pending',
    created_at: '2024-02-15',
  },
];

// ==================== LEGAL DOCUMENTS ====================
export const mockLegalDocuments: LegalDocument[] = [
  { id: '1', title: 'SK Direksi tentang Kebijakan Pengadaan', document_type: 'sk_direksi', document_number: 'SK-001/DIR/2024', category: 'Procurement', issuer: 'Direksi', issue_date: '2024-01-10', effective_date: '2024-01-15', summary: 'Kebijakan pengadaan barang dan jasa di lingkungan perusahaan', keywords: ['pengadaan', 'procurement', 'tender', 'vendor'], document_url: '/docs/sk-001-2024.pdf', status: 'active', created_at: '2024-01-10' },
  { id: '2', title: 'Surat Edaran tentang Cuti Tahunan', document_type: 'surat_edaran', document_number: 'SE-005/HR/2024', category: 'HR', issuer: 'HR Department', issue_date: '2024-01-05', effective_date: '2024-01-05', summary: 'Ketentuan pengajuan dan persetujuan cuti tahunan', keywords: ['cuti', 'leave', 'annual leave', 'HR'], document_url: '/docs/se-005-2024.pdf', status: 'active', created_at: '2024-01-05' },
  { id: '3', title: 'Peraturan Perusahaan BPKH Limited', document_type: 'peraturan_perusahaan', document_number: 'PP-001/2023', category: 'General', issuer: 'Direksi', issue_date: '2023-01-01', effective_date: '2023-01-15', summary: 'Peraturan perusahaan yang mengatur hak dan kewajiban karyawan', keywords: ['peraturan', 'karyawan', 'employee', 'rules'], document_url: '/docs/pp-001-2023.pdf', status: 'active', created_at: '2023-01-01' },
  { id: '4', title: 'UU No. 8 Tahun 2019 tentang Penyelenggaraan Ibadah Haji', document_type: 'uu', document_number: 'UU 8/2019', category: 'Hajj Regulation', issuer: 'DPR RI', issue_date: '2019-10-14', effective_date: '2019-10-14', summary: 'Undang-undang yang mengatur penyelenggaraan ibadah haji', keywords: ['haji', 'hajj', 'penyelenggaraan', 'regulasi'], document_url: '/docs/uu-8-2019.pdf', status: 'active', created_at: '2020-01-01' },
  { id: '5', title: 'Saudi Hajj Regulations 2023', document_type: 'other', document_number: 'Royal Decree A/123', category: 'Hajj Regulation', issuer: 'Ministry of Hajj KSA', issue_date: '2023-03-01', summary: 'Regulations governing Hajj operations in Saudi Arabia', keywords: ['hajj', 'saudi', 'regulation', 'permit'], document_url: '/docs/saudi-hajj-reg-2023.pdf', status: 'active', created_at: '2023-03-01' },
];

// ==================== DASHBOARD ====================
export const mockLCRMSDashboard: LCRMSDashboardData = {
  compliance_score: 78,
  compliance_trend: [
    { month: 'Sep', score: 72 },
    { month: 'Oct', score: 74 },
    { month: 'Nov', score: 75 },
    { month: 'Dec', score: 76 },
    { month: 'Jan', score: 78 },
    { month: 'Feb', score: 78 },
  ],
  contracts_summary: {
    total: 5,
    active: 3,
    expiring_30: 1,
    expiring_60: 0,
    expiring_90: 0,
    expired: 1,
  },
  risks_summary: {
    total: 6,
    critical: 1,
    high: 2,
    medium: 3,
    low: 0,
    mitigated: 1,
  },
  cases_summary: {
    total: 3,
    open: 2,
    settled: 1,
    won: 0,
    lost: 0,
    total_exposure: 3350000000,
  },
  licenses_summary: {
    total: 4,
    valid: 2,
    expiring: 1,
    expired: 1,
  },
  coi_summary: {
    total_required: 48,
    submitted: 42,
    pending: 6,
    with_conflicts: 1,
  },
  alerts: [
    { id: '1', type: 'contract_expiry', severity: 'warning', title: 'Kontrak akan expired', message: 'NDA dengan IT Vendor akan berakhir dalam 28 hari', reference_id: '4', reference_type: 'contract', due_date: '2025-02-01', created_at: '2024-01-05' },
    { id: '2', type: 'license_expiry', severity: 'critical', title: 'Izin expired', message: 'Tax Registration Certificate telah expired', reference_id: '4', reference_type: 'license', created_at: '2024-01-02' },
    { id: '3', type: 'risk_escalation', severity: 'critical', title: 'Risiko kritikal', message: 'Risiko serangan siber memerlukan perhatian segera', reference_id: '4', reference_type: 'risk', created_at: '2024-02-01' },
    { id: '4', type: 'case_hearing', severity: 'warning', title: 'Jadwal sidang', message: 'Sidang Pembuktian LIT-2023-005 pada 28 Feb 2024', reference_id: '1', reference_type: 'case', due_date: '2024-02-28', created_at: '2024-01-15' },
    { id: '5', type: 'coi_deadline', severity: 'info', title: 'COI belum submit', message: '6 karyawan belum submit COI Declaration 2024', created_at: '2024-01-20' },
  ],
  recent_activities: [
    { id: '1', activity_type: 'contract_signed', description: 'Kontrak PKS-2024-001 ditandatangani', user_name: 'Legal Team', reference_id: '1', reference_type: 'contract', created_at: '2024-01-01' },
    { id: '2', activity_type: 'risk_mitigated', description: 'Risiko RSK-2024-002 status diupdate ke Mitigated', user_name: 'Sarah Al-Qahtani', reference_id: '2', reference_type: 'risk', created_at: '2024-01-28' },
    { id: '3', activity_type: 'case_update', description: 'Dokumen bukti baru diupload untuk LIT-2023-005', user_name: 'Legal Team', reference_id: '1', reference_type: 'case', created_at: '2024-02-01' },
    { id: '4', activity_type: 'coi_approved', description: 'COI Declaration Abdullah Al-Faisal disetujui', user_name: 'Board of Directors', reference_id: '1', reference_type: 'coi', created_at: '2024-01-15' },
  ],
};

// ==================== INPUT TYPES ====================
export interface CreateContractInput {
  name: string;
  type: Contract['type'];
  partner_name: string;
  partner_contact?: string;
  description?: string;
  start_date: string;
  end_date: string;
  value?: number;
  currency?: 'SAR' | 'IDR' | 'USD';
  auto_renewal: boolean;
  renewal_notice_days?: number;
}

export interface CreateRiskInput {
  division: string;
  category: Risk['category'];
  name: string;
  description: string;
  cause?: string;
  impact_score: number;
  likelihood_score: number;
  mitigation_plan: string;
  pic_name: string;
}

export interface CreateCaseInput {
  title: string;
  type: LitigationCase['type'];
  court_name?: string;
  jurisdiction?: string;
  plaintiff: string;
  defendant: string;
  subject_matter: string;
  claim_amount?: number;
  currency?: 'SAR' | 'IDR' | 'USD';
  priority: LitigationCase['priority'];
}

export interface CreateMeetingInput {
  meeting_type: MeetingMinutes['meeting_type'];
  title: string;
  date: string;
  start_time: string;
  end_time: string;
  location: string;
  agenda: string[];
}

// ==================== API FUNCTIONS ====================
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

function calculateRiskLevel(impact: number, likelihood: number): Risk['level'] {
  const score = impact * likelihood;
  if (score >= 15) return 'critical';
  if (score >= 10) return 'high';
  if (score >= 5) return 'medium';
  return 'low';
}

export const lcrmsApi = {
  contracts: {
    getAll: async () => { await delay(300); return mockContracts; },
    getById: async (id: string) => { await delay(200); return mockContracts.find(c => c.id === id); },
    getExpiring: async (days: number) => {
      await delay(200);
      const now = new Date();
      const futureDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
      return mockContracts.filter(c => {
        const endDate = new Date(c.end_date);
        return endDate <= futureDate && endDate >= now;
      });
    },
    getObligations: async (contractId?: string) => {
      await delay(200);
      return contractId ? mockContractObligations.filter(o => o.contract_id === contractId) : mockContractObligations;
    },
    getAlerts: async () => { await delay(200); return mockContractAlerts; },
    create: async (input: CreateContractInput): Promise<Contract> => {
      await delay(400);
      const newContract: Contract = {
        id: String(mockContracts.length + 1),
        contract_number: `CNT-2024-${String(mockContracts.length + 1).padStart(3, '0')}`,
        ...input,
        status: 'draft',
        obligations: [],
        versions: [],
        created_at: new Date().toISOString(),
      };
      mockContracts.push(newContract);
      return newContract;
    },
    update: async (id: string, updates: Partial<Contract>): Promise<Contract> => {
      await delay(400);
      const contract = mockContracts.find(c => c.id === id);
      if (!contract) throw new Error('Contract not found');
      Object.assign(contract, updates, { updated_at: new Date().toISOString() });
      return contract;
    },
    getSummary: async () => {
      await delay(200);
      return mockLCRMSDashboard.contracts_summary;
    },
  },

  compliance: {
    getLicenses: async () => { await delay(300); return mockLicenses; },
    getCOIDeclarations: async (year?: number) => {
      await delay(300);
      return year ? mockCOIDeclarations.filter(c => c.year === year) : mockCOIDeclarations;
    },
    getViolations: async () => { await delay(300); return mockViolations; },
    submitCOI: async (id: string): Promise<COIDeclaration> => {
      await delay(400);
      const coi = mockCOIDeclarations.find(c => c.id === id);
      if (!coi) throw new Error('COI Declaration not found');
      coi.status = 'submitted';
      coi.submitted_at = new Date().toISOString();
      return coi;
    },
    approveCOI: async (id: string, reviewer: string): Promise<COIDeclaration> => {
      await delay(400);
      const coi = mockCOIDeclarations.find(c => c.id === id);
      if (!coi) throw new Error('COI Declaration not found');
      coi.status = 'approved';
      coi.reviewed_by = reviewer;
      coi.reviewed_at = new Date().toISOString();
      return coi;
    },
    getSummary: async () => {
      await delay(200);
      return {
        licenses: mockLCRMSDashboard.licenses_summary,
        coi: mockLCRMSDashboard.coi_summary,
      };
    },
  },

  risks: {
    getAll: async () => { await delay(300); return mockRisks; },
    getById: async (id: string) => { await delay(200); return mockRisks.find(r => r.id === id); },
    getHeatmap: async (): Promise<RiskHeatmapCell[]> => {
      await delay(300);
      const heatmap: RiskHeatmapCell[] = [];
      for (let impact = 1; impact <= 5; impact++) {
        for (let likelihood = 1; likelihood <= 5; likelihood++) {
          const risksInCell = mockRisks.filter(r => r.impact_score === impact && r.likelihood_score === likelihood);
          heatmap.push({
            impact,
            likelihood,
            count: risksInCell.length,
            risks: risksInCell.map(r => ({ id: r.id, name: r.name, division: r.division })),
          });
        }
      }
      return heatmap;
    },
    getTop10: async () => {
      await delay(200);
      return [...mockRisks].sort((a, b) => b.risk_score - a.risk_score).slice(0, 10);
    },
    create: async (input: CreateRiskInput): Promise<Risk> => {
      await delay(400);
      const risk_score = input.impact_score * input.likelihood_score;
      const newRisk: Risk = {
        id: String(mockRisks.length + 1),
        risk_code: `RSK-2024-${String(mockRisks.length + 1).padStart(3, '0')}`,
        ...input,
        risk_score,
        level: calculateRiskLevel(input.impact_score, input.likelihood_score),
        mitigation_status: 'identified',
        status: 'open',
        created_at: new Date().toISOString(),
      };
      mockRisks.push(newRisk);
      return newRisk;
    },
    update: async (id: string, updates: Partial<Risk>): Promise<Risk> => {
      await delay(400);
      const risk = mockRisks.find(r => r.id === id);
      if (!risk) throw new Error('Risk not found');
      Object.assign(risk, updates, { updated_at: new Date().toISOString() });
      if (updates.impact_score || updates.likelihood_score) {
        risk.risk_score = risk.impact_score * risk.likelihood_score;
        risk.level = calculateRiskLevel(risk.impact_score, risk.likelihood_score);
      }
      return risk;
    },
    getSummary: async () => {
      await delay(200);
      return mockLCRMSDashboard.risks_summary;
    },
  },

  litigation: {
    getCases: async () => { await delay(300); return mockCases; },
    getCaseById: async (id: string) => { await delay(200); return mockCases.find(c => c.id === id); },
    getCounsels: async () => { await delay(300); return mockCounsels; },
    createCase: async (input: CreateCaseInput): Promise<LitigationCase> => {
      await delay(400);
      const newCase: LitigationCase = {
        id: String(mockCases.length + 1),
        case_number: `CASE-2024-${String(mockCases.length + 1).padStart(3, '0')}`,
        ...input,
        status: 'open',
        timeline: [],
        documents: [],
        costs: [],
        opened_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
      };
      mockCases.push(newCase);
      return newCase;
    },
    updateCase: async (id: string, updates: Partial<LitigationCase>): Promise<LitigationCase> => {
      await delay(400);
      const caseItem = mockCases.find(c => c.id === id);
      if (!caseItem) throw new Error('Case not found');
      Object.assign(caseItem, updates, { updated_at: new Date().toISOString() });
      return caseItem;
    },
    getSummary: async () => {
      await delay(200);
      return mockLCRMSDashboard.cases_summary;
    },
  },

  secretarial: {
    getMeetings: async () => { await delay(300); return mockMeetings; },
    getMeetingById: async (id: string) => { await delay(200); return mockMeetings.find(m => m.id === id); },
    getShareholders: async () => { await delay(300); return mockShareholders; },
    getResolutions: async () => { await delay(300); return mockResolutions; },
    createMeeting: async (input: CreateMeetingInput): Promise<MeetingMinutes> => {
      await delay(400);
      const typePrefix = input.meeting_type === 'rups' ? 'RUPS' : 'BOD';
      const newMeeting: MeetingMinutes = {
        id: String(mockMeetings.length + 1),
        meeting_number: `MoM-${typePrefix}-2024-${String(mockMeetings.length + 1).padStart(3, '0')}`,
        ...input,
        attendees: [],
        decisions: [],
        action_items: [],
        status: 'draft',
        prepared_by: 'Corporate Secretary',
        created_at: new Date().toISOString(),
      };
      mockMeetings.push(newMeeting);
      return newMeeting;
    },
    approveResolution: async (id: string, approverId: string, decision: 'approved' | 'rejected', comments?: string) => {
      await delay(400);
      const resolution = mockResolutions.find(r => r.id === id);
      if (!resolution) throw new Error('Resolution not found');
      const approval = resolution.approvals.find(a => a.id === approverId);
      if (approval) {
        approval.decision = decision;
        approval.comments = comments;
        approval.decided_at = new Date().toISOString();
      }
      // Check if all approved
      const allDecided = resolution.approvals.every(a => a.decision !== 'pending');
      const allApproved = resolution.approvals.every(a => a.decision === 'approved');
      if (allDecided) {
        resolution.status = allApproved ? 'approved' : 'rejected';
        if (allApproved) resolution.effective_date = new Date().toISOString();
      }
      return resolution;
    },
  },

  knowledge: {
    getDocuments: async () => { await delay(300); return mockLegalDocuments; },
    search: async (query: string) => {
      await delay(400);
      const lowerQuery = query.toLowerCase();
      return mockLegalDocuments.filter(doc =>
        doc.title.toLowerCase().includes(lowerQuery) ||
        doc.summary?.toLowerCase().includes(lowerQuery) ||
        doc.keywords.some(k => k.toLowerCase().includes(lowerQuery))
      );
    },
    askQuestion: async (question: string): Promise<{ answer: string; sources: string[] }> => {
      await delay(800);
      // Simulate AI response based on keywords
      const lowerQ = question.toLowerCase();
      if (lowerQ.includes('pengadaan') || lowerQ.includes('procurement')) {
        return {
          answer: 'Berdasarkan SK Direksi No. SK-001/DIR/2024, pengadaan barang dan jasa di lingkungan perusahaan harus melalui proses tender untuk nilai di atas SAR 100,000. Untuk nilai di bawah itu, dapat menggunakan penunjukan langsung dengan minimal 3 pembanding harga.',
          sources: ['SK-001/DIR/2024 - Kebijakan Pengadaan'],
        };
      }
      if (lowerQ.includes('cuti') || lowerQ.includes('leave')) {
        return {
          answer: 'Sesuai SE-005/HR/2024, karyawan berhak atas cuti tahunan 21 hari kerja. Pengajuan cuti minimal 3 hari sebelumnya untuk cuti biasa, dan dapat diajukan mendadak untuk cuti sakit dengan melampirkan surat dokter.',
          sources: ['SE-005/HR/2024 - Cuti Tahunan', 'PP-001/2023 - Peraturan Perusahaan'],
        };
      }
      if (lowerQ.includes('haji') || lowerQ.includes('hajj')) {
        return {
          answer: 'Penyelenggaraan ibadah haji diatur dalam UU No. 8 Tahun 2019. BPKH Limited sebagai PPIU wajib memenuhi ketentuan izin operasional dari Kemenag RI dan regulasi Ministry of Hajj KSA.',
          sources: ['UU 8/2019 - Penyelenggaraan Ibadah Haji', 'Saudi Hajj Regulations 2023'],
        };
      }
      return {
        answer: 'Maaf, saya tidak menemukan informasi spesifik terkait pertanyaan Anda. Silakan hubungi tim Legal untuk konsultasi lebih lanjut.',
        sources: [],
      };
    },
  },

  dashboard: {
    getSummary: async () => { await delay(400); return mockLCRMSDashboard; },
    getComplianceScore: async () => { await delay(200); return mockLCRMSDashboard.compliance_score; },
    getAlerts: async (): Promise<LCRMSAlert[]> => { await delay(200); return mockLCRMSDashboard.alerts; },
  },
};
