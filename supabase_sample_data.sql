-- =====================================================
-- SAMPLE DATA FOR BPKH LIMITED DASHBOARD
-- HCMS & LCRMS Modules (Fixed to match actual schema)
-- =====================================================

-- =====================================================
-- HCMS SAMPLE DATA
-- =====================================================

-- Employees
INSERT INTO hcms_employees (employee_id, first_name, last_name, email, phone, department, position, grade, employment_status, employment_type, hire_date, salary, nationality, iqamah_number, iqamah_expiry, passport_number, passport_expiry, visa_expiry) VALUES
('BPKH001', 'Abdullah', 'Al-Faisal', 'abdullah.faisal@bpkh.sa', '+966501234567', 'Executive', 'Chief Executive Officer', 'E1', 'active', 'full_time', '2020-01-15', 85000, 'SA', NULL, NULL, 'A12345678', '2028-03-15', NULL),
('BPKH002', 'Fatima', 'Hassan', 'fatima.hassan@bpkh.sa', '+966502345678', 'Human Resources', 'HR Manager', 'M1', 'active', 'full_time', '2020-03-01', 45000, 'SA', NULL, NULL, 'A23456789', '2027-11-20', NULL),
('BPKH003', 'Ahmad', 'Al-Rashid', 'ahmad.rashid@bpkh.sa', '+966503456789', 'Information Technology', 'IT Director', 'D1', 'active', 'full_time', '2020-02-10', 55000, 'ID', 'IQ123456789', '2025-06-15', 'B34567890', '2026-09-10', '2025-06-30'),
('BPKH004', 'Mohammad', 'Khan', 'mohammad.khan@bpkh.sa', '+966504567890', 'Operations', 'Operations Manager', 'M1', 'active', 'full_time', '2021-06-15', 42000, 'PK', 'IQ234567890', '2025-03-10', 'C45678901', '2027-05-22', '2025-09-30'),
('BPKH005', 'Sarah', 'Al-Qahtani', 'sarah.qahtani@bpkh.sa', '+966505678901', 'Finance', 'Financial Analyst', 'S2', 'active', 'full_time', '2022-01-10', 35000, 'SA', NULL, NULL, 'A56789012', '2028-08-05', NULL),
('BPKH006', 'Khalid', 'Bin Salman', 'khalid.salman@bpkh.sa', '+966506789012', 'Finance', 'Accountant', 'S1', 'probation', 'full_time', '2024-11-01', 28000, 'SA', NULL, NULL, 'A67890123', '2029-02-18', NULL),
('BPKH007', 'Noor', 'Ahmad', 'noor.ahmad@bpkh.sa', '+966507890123', 'Human Resources', 'HR Coordinator', 'J2', 'active', 'full_time', '2022-07-15', 25000, 'ID', 'IQ345678901', '2025-02-28', 'B78901234', '2026-12-01', '2025-08-31'),
('BPKH008', 'Yusuf', 'Ibrahim', 'yusuf.ibrahim@bpkh.sa', '+966508901234', 'Information Technology', 'Software Developer', 'S2', 'active', 'full_time', '2021-09-01', 38000, 'EG', 'IQ456789012', '2025-04-15', 'C89012345', '2027-07-25', '2025-10-31'),
('BPKH009', 'Aisha', 'Rahman', 'aisha.rahman@bpkh.sa', '+966509012345', 'Legal', 'Legal Counsel', 'S3', 'active', 'full_time', '2021-03-01', 48000, 'SA', NULL, NULL, 'A90123456', '2028-04-10', NULL),
('BPKH010', 'Omar', 'Farooq', 'omar.farooq@bpkh.sa', '+966510123456', 'Marketing', 'Marketing Specialist', 'S1', 'active', 'full_time', '2023-06-01', 32000, 'JO', 'IQ567890123', '2025-08-20', 'D01234567', '2027-01-15', '2025-12-31')
ON CONFLICT (employee_id) DO NOTHING;

-- Attendance (last 2 days)
INSERT INTO hcms_attendance (employee_id, employee_code, employee_name, date, check_in, check_out, status, work_hours, late_minutes, check_in_location) VALUES
((SELECT id FROM hcms_employees WHERE employee_id = 'BPKH001'), 'BPKH001', 'Abdullah Al-Faisal', CURRENT_DATE, '08:00', '17:00', 'present', 9, 0, 'Office'),
((SELECT id FROM hcms_employees WHERE employee_id = 'BPKH002'), 'BPKH002', 'Fatima Hassan', CURRENT_DATE, '08:15', '17:30', 'present', 9.25, 15, 'Office'),
((SELECT id FROM hcms_employees WHERE employee_id = 'BPKH003'), 'BPKH003', 'Ahmad Al-Rashid', CURRENT_DATE, '09:10', '18:00', 'late', 8.83, 70, 'Office'),
((SELECT id FROM hcms_employees WHERE employee_id = 'BPKH004'), 'BPKH004', 'Mohammad Khan', CURRENT_DATE, NULL, NULL, 'absent', NULL, NULL, NULL),
((SELECT id FROM hcms_employees WHERE employee_id = 'BPKH005'), 'BPKH005', 'Sarah Al-Qahtani', CURRENT_DATE, '08:05', '17:15', 'present', 9.17, 5, 'Office'),
((SELECT id FROM hcms_employees WHERE employee_id = 'BPKH006'), 'BPKH006', 'Khalid Bin Salman', CURRENT_DATE, NULL, NULL, 'leave', NULL, NULL, NULL),
((SELECT id FROM hcms_employees WHERE employee_id = 'BPKH007'), 'BPKH007', 'Noor Ahmad', CURRENT_DATE, '08:30', '17:45', 'late', 9.25, 30, 'Office'),
((SELECT id FROM hcms_employees WHERE employee_id = 'BPKH008'), 'BPKH008', 'Yusuf Ibrahim', CURRENT_DATE, '07:55', '17:00', 'present', 9.08, 0, 'Office'),
((SELECT id FROM hcms_employees WHERE employee_id = 'BPKH009'), 'BPKH009', 'Aisha Rahman', CURRENT_DATE, '08:00', '17:30', 'present', 9.5, 0, 'Office'),
((SELECT id FROM hcms_employees WHERE employee_id = 'BPKH010'), 'BPKH010', 'Omar Farooq', CURRENT_DATE, '08:20', '17:00', 'late', 8.67, 20, 'Office'),
((SELECT id FROM hcms_employees WHERE employee_id = 'BPKH001'), 'BPKH001', 'Abdullah Al-Faisal', CURRENT_DATE - 1, '08:00', '17:00', 'present', 9, 0, 'Office'),
((SELECT id FROM hcms_employees WHERE employee_id = 'BPKH002'), 'BPKH002', 'Fatima Hassan', CURRENT_DATE - 1, '08:00', '17:00', 'present', 9, 0, 'Office'),
((SELECT id FROM hcms_employees WHERE employee_id = 'BPKH003'), 'BPKH003', 'Ahmad Al-Rashid', CURRENT_DATE - 1, '08:00', '17:00', 'present', 9, 0, 'Office'),
((SELECT id FROM hcms_employees WHERE employee_id = 'BPKH004'), 'BPKH004', 'Mohammad Khan', CURRENT_DATE - 1, '08:00', '17:00', 'present', 9, 0, 'Office'),
((SELECT id FROM hcms_employees WHERE employee_id = 'BPKH005'), 'BPKH005', 'Sarah Al-Qahtani', CURRENT_DATE - 1, '08:00', '17:00', 'present', 9, 0, 'Office')
ON CONFLICT (employee_id, date) DO NOTHING;

-- Leave Requests
INSERT INTO hcms_leave_requests (employee_id, leave_type_id, start_date, end_date, days, reason, status, approved_by, approved_at) VALUES
((SELECT id FROM hcms_employees WHERE employee_id = 'BPKH004'), (SELECT id FROM hcms_leave_types WHERE name = 'Annual Leave'), CURRENT_DATE, CURRENT_DATE + 2, 3, 'Family vacation', 'approved', 'Abdullah Al-Faisal', NOW() - INTERVAL '2 days'),
((SELECT id FROM hcms_employees WHERE employee_id = 'BPKH006'), (SELECT id FROM hcms_leave_types WHERE name = 'Sick Leave'), CURRENT_DATE, CURRENT_DATE, 1, 'Medical appointment', 'approved', 'Fatima Hassan', NOW() - INTERVAL '1 day'),
((SELECT id FROM hcms_employees WHERE employee_id = 'BPKH003'), (SELECT id FROM hcms_leave_types WHERE name = 'Annual Leave'), CURRENT_DATE + 7, CURRENT_DATE + 11, 5, 'Personal travel', 'pending', NULL, NULL),
((SELECT id FROM hcms_employees WHERE employee_id = 'BPKH005'), (SELECT id FROM hcms_leave_types WHERE name = 'Emergency Leave'), CURRENT_DATE + 3, CURRENT_DATE + 4, 2, 'Family emergency', 'pending', NULL, NULL),
((SELECT id FROM hcms_employees WHERE employee_id = 'BPKH008'), (SELECT id FROM hcms_leave_types WHERE name = 'Hajj Leave'), '2025-06-01', '2025-06-15', 15, 'Hajj pilgrimage', 'approved', 'Ahmad Al-Rashid', NOW() - INTERVAL '30 days');

-- Payroll Periods
INSERT INTO hcms_payroll_periods (period_code, year, month, start_date, end_date, status, paid_at) VALUES
('2025-01', 2025, 1, '2025-01-01', '2025-01-31', 'paid', '2025-01-28'),
('2024-12', 2024, 12, '2024-12-01', '2024-12-31', 'paid', '2024-12-28'),
('2024-11', 2024, 11, '2024-11-01', '2024-11-30', 'paid', '2024-11-28')
ON CONFLICT (period_code) DO NOTHING;

-- Payroll Records (January 2025)
INSERT INTO hcms_payroll_records (employee_id, employee_code, employee_name, period_id, period, basic_salary, housing_allowance, transport_allowance, other_allowances, overtime_hours, overtime_pay, deductions, gosi_employee, gosi_employer, currency, status, payment_date)
SELECT
  e.id,
  e.employee_id,
  e.first_name || ' ' || e.last_name,
  (SELECT id FROM hcms_payroll_periods WHERE period_code = '2025-01'),
  'January 2025',
  e.salary,
  e.salary * 0.25,
  2000,
  1000,
  0,
  0,
  e.salary * 0.02,
  e.salary * 0.0975,
  e.salary * 0.12,
  'SAR',
  'paid',
  '2025-01-28'
FROM hcms_employees e
WHERE e.employee_id LIKE 'BPKH%';

-- Job Postings
INSERT INTO hcms_job_postings (job_code, position, department, description, requirements, employment_type, salary_min, salary_max, currency, status, posted_date, closing_date, hiring_manager) VALUES
('JOB-2025-001', 'Senior Software Engineer', 'Information Technology', 'We are looking for an experienced software engineer to join our IT team.', 'Bachelor degree in CS, 5+ years experience, React/Node.js', 'full_time', 40000, 55000, 'SAR', 'open', CURRENT_DATE - 25, CURRENT_DATE + 5, 'Ahmad Al-Rashid'),
('JOB-2025-002', 'Financial Analyst', 'Finance', 'Join our finance team to support investment analysis and reporting.', 'Bachelor in Finance/Accounting, CFA preferred, 3+ years experience', 'full_time', 30000, 40000, 'SAR', 'screening', CURRENT_DATE - 15, CURRENT_DATE + 15, 'Abdullah Al-Faisal'),
('JOB-2025-003', 'HR Coordinator', 'Human Resources', 'Support HR operations including recruitment and employee relations.', 'Bachelor in HR/Business, 2+ years experience, Arabic & English fluent', 'full_time', 22000, 28000, 'SAR', 'open', CURRENT_DATE - 10, CURRENT_DATE + 20, 'Fatima Hassan'),
('JOB-2025-004', 'Operations Specialist', 'Operations', 'Manage daily operations and process improvements.', 'Bachelor degree, 3+ years operations experience, strong analytical skills', 'full_time', 28000, 35000, 'SAR', 'offer', CURRENT_DATE - 30, CURRENT_DATE - 1, 'Mohammad Khan')
ON CONFLICT (job_code) DO NOTHING;

-- Candidates
INSERT INTO hcms_candidates (job_posting_id, first_name, last_name, email, phone, resume_url, status, score, interview_notes) VALUES
((SELECT id FROM hcms_job_postings WHERE job_code = 'JOB-2025-001'), 'Ali', 'Hassan', 'ali.hassan@email.com', '+966551234567', '/resumes/ali_hassan.pdf', 'interview', 85, 'Strong technical background'),
((SELECT id FROM hcms_job_postings WHERE job_code = 'JOB-2025-001'), 'Layla', 'Ahmed', 'layla.ahmed@email.com', '+966552345678', '/resumes/layla_ahmed.pdf', 'interview', 92, 'Excellent React experience'),
((SELECT id FROM hcms_job_postings WHERE job_code = 'JOB-2025-004'), 'Maryam', 'Khan', 'maryam.khan@email.com', '+966554567890', '/resumes/maryam_khan.pdf', 'offer', 90, 'Outstanding candidate'),
((SELECT id FROM hcms_job_postings WHERE job_code = 'JOB-2025-002'), 'Tariq', 'Rahman', 'tariq.rahman@email.com', '+966555678901', '/resumes/tariq_rahman.pdf', 'screening', 78, 'CFA Level 2');

-- Performance Cycles
INSERT INTO hcms_performance_cycles (name, year, type, start_date, end_date, status) VALUES
('2024 Annual Review', 2024, 'annual', '2024-01-01', '2024-12-31', 'completed'),
('2025 H1 Mid-Year', 2025, 'mid_year', '2025-01-01', '2025-06-30', 'active'),
('2025 Annual Review', 2025, 'annual', '2025-01-01', '2025-12-31', 'active');

-- Performance Reviews
INSERT INTO hcms_performance_reviews (employee_id, employee_name, period, cycle_id, reviewer_id, reviewer_name, overall_score, rating, status, achievements, submitted_at, acknowledged_at) VALUES
((SELECT id FROM hcms_employees WHERE employee_id = 'BPKH002'), 'Fatima Hassan', '2024', (SELECT id FROM hcms_performance_cycles WHERE name = '2024 Annual Review'), (SELECT id FROM hcms_employees WHERE employee_id = 'BPKH001'), 'Abdullah Al-Faisal', 4.2, 'exceeds', 'acknowledged', 'Strong HR leadership', NOW() - INTERVAL '15 days', NOW() - INTERVAL '8 days'),
((SELECT id FROM hcms_employees WHERE employee_id = 'BPKH003'), 'Ahmad Al-Rashid', '2024', (SELECT id FROM hcms_performance_cycles WHERE name = '2024 Annual Review'), (SELECT id FROM hcms_employees WHERE employee_id = 'BPKH001'), 'Abdullah Al-Faisal', 4.0, 'meets', 'submitted', 'Good technical delivery', NOW() - INTERVAL '12 days', NULL),
((SELECT id FROM hcms_employees WHERE employee_id = 'BPKH005'), 'Sarah Al-Qahtani', '2024', (SELECT id FROM hcms_performance_cycles WHERE name = '2024 Annual Review'), (SELECT id FROM hcms_employees WHERE employee_id = 'BPKH001'), 'Abdullah Al-Faisal', 4.3, 'exceeds', 'draft', 'Exceptional analytical skills', NULL, NULL);

-- KPIs (references review_id, not cycle_id)
INSERT INTO hcms_kpis (employee_id, employee_name, period, kpi_name, description, target, actual, weight, unit, category) VALUES
((SELECT id FROM hcms_employees WHERE employee_id = 'BPKH001'), 'Abdullah Al-Faisal', '2025', 'Revenue Growth', 'Achieve annual revenue growth target', 15, 18, 30, 'percentage', 'quantitative'),
((SELECT id FROM hcms_employees WHERE employee_id = 'BPKH001'), 'Abdullah Al-Faisal', '2025', 'Cost Reduction', 'Reduce operational costs', 10, 8, 20, 'percentage', 'quantitative'),
((SELECT id FROM hcms_employees WHERE employee_id = 'BPKH003'), 'Ahmad Al-Rashid', '2025', 'System Uptime', 'Maintain 99.9% system availability', 99.9, 99.7, 40, 'percentage', 'quantitative'),
((SELECT id FROM hcms_employees WHERE employee_id = 'BPKH005'), 'Sarah Al-Qahtani', '2025', 'Report Accuracy', 'Financial report accuracy rate', 99, 99.5, 40, 'percentage', 'quantitative');

-- Training Courses
INSERT INTO hcms_training_courses (code, title, description, type, category, provider, start_date, end_date, duration_hours, location, max_participants, enrolled, status) VALUES
('TRN-2025-001', 'Islamic Finance Fundamentals', 'Comprehensive training on Islamic finance principles', 'internal', 'mandatory', 'BPKH Academy', CURRENT_DATE + 5, CURRENT_DATE + 6, 16, 'Training Room A', 30, 25, 'upcoming'),
('TRN-2025-002', 'Advanced Excel for Finance', 'Excel advanced functions and financial modeling', 'external', 'technical', 'Microsoft', CURRENT_DATE + 12, CURRENT_DATE + 12, 8, 'Online', 20, 18, 'upcoming'),
('TRN-2025-003', 'Leadership Development Program', 'Leadership skills for managers', 'internal', 'leadership', 'BPKH Academy', CURRENT_DATE - 15, CURRENT_DATE + 75, 40, 'Training Room B', 15, 12, 'ongoing'),
('TRN-2024-010', 'Cybersecurity Awareness', 'Security best practices', 'online', 'mandatory', 'KnowBe4', CURRENT_DATE - 10, CURRENT_DATE - 10, 4, 'Online', 50, 45, 'completed')
ON CONFLICT (code) DO NOTHING;

-- Training Enrollments
INSERT INTO hcms_training_enrollments (course_id, employee_id, employee_name, status, enrolled_at, completed_at, score, certificate_url) VALUES
((SELECT id FROM hcms_training_courses WHERE title = 'Cybersecurity Awareness'), (SELECT id FROM hcms_employees WHERE employee_id = 'BPKH001'), 'Abdullah Al-Faisal', 'completed', NOW() - INTERVAL '15 days', NOW() - INTERVAL '10 days', 95, '/certificates/cyber_BPKH001.pdf'),
((SELECT id FROM hcms_training_courses WHERE title = 'Cybersecurity Awareness'), (SELECT id FROM hcms_employees WHERE employee_id = 'BPKH002'), 'Fatima Hassan', 'completed', NOW() - INTERVAL '15 days', NOW() - INTERVAL '10 days', 92, '/certificates/cyber_BPKH002.pdf'),
((SELECT id FROM hcms_training_courses WHERE title = 'Leadership Development Program'), (SELECT id FROM hcms_employees WHERE employee_id = 'BPKH002'), 'Fatima Hassan', 'enrolled', NOW() - INTERVAL '15 days', NULL, NULL, NULL),
((SELECT id FROM hcms_training_courses WHERE title = 'Islamic Finance Fundamentals'), (SELECT id FROM hcms_employees WHERE employee_id = 'BPKH005'), 'Sarah Al-Qahtani', 'enrolled', NOW() - INTERVAL '3 days', NULL, NULL, NULL);

-- Compliance Alerts
INSERT INTO hcms_compliance_alerts (employee_id, employee_name, alert_type, expiry_date, days_remaining, severity, status, notes) VALUES
((SELECT id FROM hcms_employees WHERE employee_id = 'BPKH007'), 'Noor Ahmad', 'iqamah_expiry', '2025-02-28', 32, 'warning', 'active', 'Iqama expiring soon'),
((SELECT id FROM hcms_employees WHERE employee_id = 'BPKH004'), 'Mohammad Khan', 'iqamah_expiry', '2025-03-10', 42, 'warning', 'active', 'Iqama expiring'),
((SELECT id FROM hcms_employees WHERE employee_id = 'BPKH008'), 'Yusuf Ibrahim', 'iqamah_expiry', '2025-04-15', 78, 'info', 'active', 'Iqama renewal needed'),
((SELECT id FROM hcms_employees WHERE employee_id = 'BPKH003'), 'Ahmad Al-Rashid', 'iqamah_expiry', '2025-06-15', 139, 'info', 'active', 'Plan iqama renewal'),
((SELECT id FROM hcms_employees WHERE employee_id = 'BPKH006'), 'Khalid Bin Salman', 'probation_end', '2025-02-01', 5, 'critical', 'active', 'Probation ending');

-- Disciplinary Actions
INSERT INTO hcms_disciplinary_actions (employee_id, employee_name, case_type, severity, description, incident_date, reported_by, action_taken, action_date, status) VALUES
((SELECT id FROM hcms_employees WHERE employee_id = 'BPKH008'), 'Yusuf Ibrahim', 'verbal_warning', 'minor', 'Repeated tardiness - 5 late arrivals in December', '2024-12-15', 'Fatima Hassan', 'Verbal warning issued', '2024-12-20', 'closed');


-- =====================================================
-- LCRMS SAMPLE DATA (Fixed to match actual schema)
-- =====================================================

-- Contracts (type must be: pks, vendor, sewa, nda, mou, other)
INSERT INTO lcrms_contracts (contract_number, name, type, partner_name, partner_contact, description, start_date, end_date, value, currency, status, auto_renewal, renewal_notice_days, created_by) VALUES
('CON-2024-001', 'IT Infrastructure Support', 'vendor', 'Saudi Tech Solutions', 'support@sauditech.sa', 'Annual IT infrastructure maintenance and support', '2024-01-01', '2025-06-30', 450000, 'SAR', 'active', true, 90, 'Ahmad Al-Rashid'),
('CON-2024-002', 'Office Space Lease - Riyadh HQ', 'sewa', 'Al-Faisaliah Properties', 'leasing@faisaliah.sa', 'Main office lease agreement - 2 floors', '2023-01-01', '2025-12-31', 1200000, 'SAR', 'active', false, 180, 'Abdullah Al-Faisal'),
('CON-2024-003', 'Legal Services Retainer', 'vendor', 'Al-Rajhi Law Firm', 'legal@alrajhi-law.sa', 'Monthly legal advisory services retainer', '2024-06-01', '2025-05-31', 180000, 'SAR', 'active', true, 60, 'Aisha Rahman'),
('CON-2024-004', 'Investment Advisory MoU', 'mou', 'Gulf Investment Partners', 'partners@gip.sa', 'Joint investment evaluation partnership', '2024-03-01', '2025-02-28', 0, 'SAR', 'expiring', false, 30, 'Abdullah Al-Faisal'),
('CON-2024-005', 'Confidentiality Agreement - Project Alpha', 'nda', 'Aramco Ventures', 'legal@aramco.sa', 'NDA for potential joint venture discussions', '2024-09-01', '2026-08-31', 0, 'SAR', 'active', false, 0, 'Aisha Rahman'),
('CON-2023-010', 'Cleaning Services Contract', 'vendor', 'Clean Arabia Co.', 'contracts@cleanarabia.sa', 'Daily office cleaning and maintenance', '2023-06-01', '2025-01-31', 72000, 'SAR', 'expiring', true, 30, 'Mohammad Khan'),
('CON-2022-005', 'Insurance Policy - Property', 'other', 'Tawuniya Insurance', 'corporate@tawuniya.sa', 'Property and assets insurance coverage', '2022-01-01', '2025-01-01', 85000, 'SAR', 'expired', false, 90, 'Sarah Al-Qahtani')
ON CONFLICT (contract_number) DO NOTHING;

-- Contract Obligations (responsible_party: internal, partner)
INSERT INTO lcrms_contract_obligations (contract_id, description, due_date, responsible_party, status, notes) VALUES
((SELECT id FROM lcrms_contracts WHERE contract_number = 'CON-2024-001'), 'Quarterly system health check report', '2025-03-31', 'partner', 'pending', 'Q1 2025 report due'),
((SELECT id FROM lcrms_contracts WHERE contract_number = 'CON-2024-001'), 'Annual security audit', '2025-06-15', 'partner', 'pending', 'Schedule with IT team'),
((SELECT id FROM lcrms_contracts WHERE contract_number = 'CON-2024-002'), 'Monthly rent payment', '2025-02-01', 'internal', 'pending', 'SAR 100,000 monthly'),
((SELECT id FROM lcrms_contracts WHERE contract_number = 'CON-2024-003'), 'Monthly legal hours report', '2025-02-05', 'partner', 'pending', 'January 2025 hours'),
((SELECT id FROM lcrms_contracts WHERE contract_number = 'CON-2024-004'), 'Investment pipeline review meeting', '2025-02-15', 'internal', 'pending', 'Quarterly review due'),
((SELECT id FROM lcrms_contracts WHERE contract_number = 'CON-2023-010'), 'Service quality assessment', '2025-01-20', 'internal', 'completed', 'Assessment completed');

-- Licenses (type: business, operational, tax, import_export, professional, other)
INSERT INTO lcrms_licenses (name, type, license_number, issuer, issue_date, expiry_date, status, document_url, renewal_notes) VALUES
('Commercial Registration', 'business', 'CR-1234567890', 'Ministry of Commerce', '2023-01-15', '2026-01-14', 'valid', '/licenses/cr_sa.pdf', 'Renew 90 days before expiry'),
('Investment License (SAGIA)', 'operational', 'SAGIA-2023-4567', 'SAGIA', '2023-03-01', '2025-02-28', 'expiring', '/licenses/sagia.pdf', 'Renewal application submitted'),
('NIB - Indonesia Office', 'business', 'NIB-1234567890123', 'OSS Indonesia', '2024-01-10', '2029-01-09', 'valid', '/licenses/nib_id.pdf', 'Valid for 5 years'),
('Tax Registration (ZATCA)', 'tax', 'TAX-SA-987654', 'ZATCA', '2020-06-01', '2030-05-31', 'valid', '/licenses/tax_sa.pdf', 'No renewal needed'),
('Financial Services License', 'professional', 'CMA-FSL-2024-001', 'Capital Market Authority', '2024-06-01', '2025-05-31', 'valid', '/licenses/cma_fsl.pdf', 'Annual renewal required');

-- COI Declarations
INSERT INTO lcrms_coi_declarations (employee_id, employee_name, department, year, has_conflict, conflict_details, declaration_data, status, reviewed_by, reviewed_at, submitted_at) VALUES
('BPKH001', 'Abdullah Al-Faisal', 'Executive', 2025, true, 'Board member of Al-Faisal Holdings', '{"related_parties": ["Al-Faisal Holdings"], "mitigation": "Recuse from decisions"}', 'approved', 'Board Chairman', NOW() - INTERVAL '10 days', NOW() - INTERVAL '20 days'),
('BPKH002', 'Fatima Hassan', 'HR', 2025, false, NULL, NULL, 'approved', 'Abdullah Al-Faisal', NOW() - INTERVAL '15 days', NOW() - INTERVAL '18 days'),
('BPKH003', 'Ahmad Al-Rashid', 'IT', 2025, false, NULL, NULL, 'submitted', NULL, NULL, NOW() - INTERVAL '5 days'),
('BPKH005', 'Sarah Al-Qahtani', 'Finance', 2025, false, NULL, NULL, 'pending', NULL, NULL, NOW() - INTERVAL '2 days'),
('BPKH009', 'Aisha Rahman', 'Legal', 2025, true, 'Spouse works at Al-Rajhi Law Firm (BPKH vendor)', '{"related_parties": ["Al-Rajhi Law Firm"], "mitigation": "Not involved in vendor selection"}', 'approved', 'Abdullah Al-Faisal', NOW() - INTERVAL '12 days', NOW() - INTERVAL '15 days')
ON CONFLICT (employee_id, year) DO NOTHING;

-- Employee Violations (violation_type: attendance, ethics, policy, performance, safety, other)
INSERT INTO lcrms_employee_violations (employee_id, employee_name, department, violation_type, description, severity, incident_date, reported_by, action_taken, action_date, status, notes) VALUES
('BPKH008', 'Yusuf Ibrahim', 'IT', 'policy', 'Used personal USB drive to transfer work files without authorization', 'minor', '2024-11-15', 'Ahmad Al-Rashid', 'Verbal warning and security awareness training', '2024-11-25', 'closed', 'Employee completed training'),
('EX-001', 'Former Employee', 'Finance', 'ethics', 'Attempted unauthorized fund transfer detected and blocked', 'critical', '2024-08-10', 'Sarah Al-Qahtani', 'Immediate termination and legal action initiated', '2024-08-20', 'closed', 'Case referred to authorities');

-- Risks (category: operational, financial, legal, compliance, strategic, reputational, technology)
-- Note: risk_level is auto-generated, don't insert it
INSERT INTO lcrms_risks (risk_code, division, category, description, impact, likelihood, mitigation_plan, pic_name, pic_email, target_date, status) VALUES
('RSK-2025-001', 'Finance', 'financial', 'Exposure to SAR/IDR exchange rate volatility affecting Indonesia operations', 4, 3, 'Implement natural hedging and forward contracts for large transactions', 'Sarah Al-Qahtani', 'sarah.qahtani@bpkh.sa', '2025-03-31', 'mitigating'),
('RSK-2025-002', 'IT', 'technology', 'Risk of data breach or ransomware attack on critical systems', 5, 3, 'Enhanced SOC monitoring, regular penetration testing, employee training', 'Ahmad Al-Rashid', 'ahmad.rashid@bpkh.sa', '2025-02-28', 'monitoring'),
('RSK-2025-003', 'Legal', 'compliance', 'New CMA regulations may require operational changes', 3, 4, 'Dedicated regulatory monitoring, proactive compliance assessment', 'Aisha Rahman', 'aisha.rahman@bpkh.sa', '2025-06-30', 'mitigating'),
('RSK-2025-004', 'Operations', 'operational', 'Critical knowledge concentrated in few individuals - key person dependency', 4, 3, 'Knowledge transfer program, process documentation, succession planning', 'Mohammad Khan', 'mohammad.khan@bpkh.sa', '2025-04-30', 'identified'),
('RSK-2025-005', 'Executive', 'strategic', 'Increasing competition in Islamic investment management sector', 3, 3, 'Differentiation through service quality and Shariah expertise', 'Abdullah Al-Faisal', 'abdullah.faisal@bpkh.sa', '2025-12-31', 'monitoring'),
('RSK-2024-010', 'Finance', 'compliance', 'Investment screening may miss non-compliant elements - Shariah risk', 4, 2, 'Enhanced screening process, Shariah board quarterly review', 'Abdullah Al-Faisal', 'abdullah.faisal@bpkh.sa', '2024-12-31', 'closed');

-- Litigation Cases
INSERT INTO lcrms_litigation_cases (case_number, title, case_type, court_name, parties_involved, description, filing_date, status, priority, estimated_exposure, internal_pic) VALUES
('LIT-2024-001', 'Contract Dispute - Alpha Investments', 'litigation', 'Commercial Court Riyadh', '{"plaintiff": "BPKH Limited", "defendant": "Alpha Investments LLC"}', 'Breach of investment agreement terms', '2024-06-15', 'in_progress', 'high', 2500000, 'Aisha Rahman'),
('LIT-2024-002', 'Employment Dispute - Ex-Employee', 'litigation', 'Labor Court Riyadh', '{"plaintiff": "Ahmed Mohammed", "defendant": "BPKH Limited"}', 'Wrongful termination claim', '2024-03-01', 'settled', 'medium', 180000, 'Aisha Rahman'),
('LIT-2023-005', 'Vendor Payment Dispute', 'mediation', NULL, '{"plaintiff": "Tech Solutions Co.", "defendant": "BPKH Limited"}', 'Disputed invoice for incomplete services', '2023-09-15', 'closed', 'low', 75000, 'Aisha Rahman')
ON CONFLICT (case_number) DO NOTHING;

-- External Counsels
INSERT INTO lcrms_external_counsels (firm_name, contact_person, email, phone, specialization, hourly_rate, currency, rating, total_cases, won_cases, status, notes) VALUES
('Al-Rajhi Law Firm', 'Dr. Khalid Al-Rajhi', 'khalid@alrajhi-law.sa', '+966112345678', ARRAY['Corporate Law', 'Commercial Disputes'], 2500, 'SAR', 5, 5, 4, 'active', 'Primary legal counsel'),
('Baker McKenzie (Riyadh)', 'Sarah Williams', 'sarah.williams@bakermckenzie.com', '+966113456789', ARRAY['International Transactions', 'M&A'], 4500, 'SAR', 5, 2, 2, 'active', 'International specialist'),
('Indonesian Law Partners', 'Budi Santoso', 'budi@ilp.co.id', '+622112345678', ARRAY['Indonesian Corporate Law'], 1400, 'SAR', 4, 3, 3, 'active', 'Indonesia operations support');

-- Meetings (meeting_type: rups, board, committee, management, other)
INSERT INTO lcrms_meetings (meeting_type, title, meeting_date, start_time, end_time, location, status, minutes_url, created_by) VALUES
('board', 'Q4 2024 Board Meeting', '2025-01-15', '10:00', '13:00', 'Board Room, Riyadh HQ', 'completed', '/minutes/MOM-2025-001.pdf', 'Aisha Rahman'),
('management', 'Monthly Management Meeting - January', '2025-01-20', '14:00', '16:00', 'Meeting Room A', 'scheduled', NULL, 'Fatima Hassan'),
('rups', 'Annual General Meeting 2024', '2024-12-10', '09:00', '12:00', 'Grand Ballroom, Four Seasons Riyadh', 'completed', '/minutes/AGM-2024.pdf', 'Aisha Rahman');

-- Meeting Attendees
INSERT INTO lcrms_meeting_attendees (meeting_id, name, role, attendance_status, notes) VALUES
((SELECT id FROM lcrms_meetings WHERE title = 'Q4 2024 Board Meeting'), 'Abdullah Al-Faisal', 'CEO', 'attended', NULL),
((SELECT id FROM lcrms_meetings WHERE title = 'Q4 2024 Board Meeting'), 'Dr. Mohammed Al-Sheikh', 'Chairman', 'attended', NULL),
((SELECT id FROM lcrms_meetings WHERE title = 'Q4 2024 Board Meeting'), 'Eng. Fahad Al-Turki', 'Board Member', 'attended', NULL),
((SELECT id FROM lcrms_meetings WHERE title = 'Q4 2024 Board Meeting'), 'Dr. Nora Al-Saud', 'Board Member', 'excused', 'Proxy to Abdullah'),
((SELECT id FROM lcrms_meetings WHERE title = 'Q4 2024 Board Meeting'), 'Aisha Rahman', 'Secretary', 'attended', NULL);

-- Meeting Agenda
INSERT INTO lcrms_meeting_agenda (meeting_id, order_number, topic, presenter, duration_minutes) VALUES
((SELECT id FROM lcrms_meetings WHERE title = 'Q4 2024 Board Meeting'), 1, 'Q4 2024 Financial Results', 'Sarah Al-Qahtani', 30),
((SELECT id FROM lcrms_meetings WHERE title = 'Q4 2024 Board Meeting'), 2, 'Investment Portfolio Review', 'Abdullah Al-Faisal', 45),
((SELECT id FROM lcrms_meetings WHERE title = 'Q4 2024 Board Meeting'), 3, '2025 Budget Approval', 'Sarah Al-Qahtani', 30),
((SELECT id FROM lcrms_meetings WHERE title = 'Q4 2024 Board Meeting'), 4, 'Risk Management Update', 'Aisha Rahman', 20);

-- Meeting Decisions
INSERT INTO lcrms_meeting_decisions (meeting_id, decision_number, description, decision_type, assigned_to, due_date, status) VALUES
((SELECT id FROM lcrms_meetings WHERE title = 'Q4 2024 Board Meeting'), 'DEC-2025-001', 'Approved 2025 operating budget of SAR 15 million', 'resolution', NULL, NULL, 'completed'),
((SELECT id FROM lcrms_meetings WHERE title = 'Q4 2024 Board Meeting'), 'DEC-2025-002', 'Approved Q4 2024 dividend distribution of SAR 2 per share', 'resolution', 'Finance Team', '2025-02-01', 'pending'),
((SELECT id FROM lcrms_meetings WHERE title = 'Annual General Meeting 2024'), 'DEC-2024-050', 'Approved total annual dividend of SAR 8 per share for 2024', 'resolution', 'Finance Team', '2024-12-15', 'completed');

-- Shareholders (shareholder_type: individual, institution, government, other)
INSERT INTO lcrms_shareholders (name, shareholder_type, shares, percentage, share_class, acquisition_date, status, notes) VALUES
('Ministry of Religious Affairs - Indonesia', 'government', 5000000, 50.00, 'common', '2020-01-01', 'active', 'Founding shareholder - Republic of Indonesia'),
('Public Investment Fund', 'government', 3000000, 30.00, 'common', '2020-01-01', 'active', 'Founding shareholder - Kingdom of Saudi Arabia'),
('Islamic Development Bank', 'institution', 1500000, 15.00, 'common', '2021-06-15', 'active', 'Strategic investor'),
('Private Investors Pool', 'institution', 500000, 5.00, 'preferred', '2022-03-01', 'active', 'Preferred shares with priority dividend');

-- Circular Resolutions (status: draft, circulating, approved, rejected, expired)
INSERT INTO lcrms_circular_resolutions (resolution_number, subject, description, proposed_by, proposed_date, deadline_date, status, required_approvers, current_approvers, document_url) VALUES
('CR-2025-001', 'Emergency IT Security Investment', 'Approval for SAR 500,000 emergency cybersecurity upgrade', 'Ahmad Al-Rashid', '2025-01-10', '2025-01-17', 'approved', 3, 3, '/resolutions/CR-2025-001.pdf'),
('CR-2025-002', 'New Office Lease Extension', 'Approval to extend Riyadh HQ lease for additional 2 years', 'Mohammad Khan', '2025-01-20', '2025-01-27', 'circulating', 3, 1, '/resolutions/CR-2025-002.pdf'),
('CR-2024-015', 'Amendment to Articles of Association', 'Update to Article 15 regarding board composition', 'Aisha Rahman', '2024-11-01', '2024-11-15', 'approved', 5, 5, '/resolutions/CR-2024-015.pdf')
ON CONFLICT (resolution_number) DO NOTHING;

-- Circular Approvals
INSERT INTO lcrms_circular_approvals (resolution_id, approver_name, approver_role, decision, comments, decided_at) VALUES
((SELECT id FROM lcrms_circular_resolutions WHERE resolution_number = 'CR-2025-001'), 'Dr. Mohammed Al-Sheikh', 'Chairman', 'approved', 'Security is priority', '2025-01-12'),
((SELECT id FROM lcrms_circular_resolutions WHERE resolution_number = 'CR-2025-001'), 'Abdullah Al-Faisal', 'CEO', 'approved', 'Recommend immediate implementation', '2025-01-11'),
((SELECT id FROM lcrms_circular_resolutions WHERE resolution_number = 'CR-2025-001'), 'Eng. Fahad Al-Turki', 'Board Member', 'approved', NULL, '2025-01-13'),
((SELECT id FROM lcrms_circular_resolutions WHERE resolution_number = 'CR-2025-002'), 'Abdullah Al-Faisal', 'CEO', 'approved', 'Good terms negotiated', '2025-01-22');

-- Legal Documents (document_type: sk_direksi, surat_edaran, peraturan_perusahaan, uu, peraturan_pemerintah, fatwa, other)
INSERT INTO lcrms_legal_documents (title, document_type, document_number, category, issuer, issue_date, effective_date, summary, keywords, document_url, status) VALUES
('Company Code of Ethics', 'peraturan_perusahaan', 'PP-001/2024', 'Corporate Governance', 'Board of Directors', '2024-01-01', '2024-01-15', 'Comprehensive code of ethics governing employee conduct and business ethics', ARRAY['ethics', 'conduct', 'compliance'], '/legal/code_of_ethics.pdf', 'active'),
('Investment Policy Guidelines', 'sk_direksi', 'SK-DIR-015/2024', 'Investment', 'CEO', '2024-03-01', '2024-03-15', 'Guidelines for investment evaluation and risk management', ARRAY['investment', 'policy', 'risk'], '/legal/investment_policy.pdf', 'active'),
('Shariah Compliance Framework', 'peraturan_perusahaan', 'PP-005/2023', 'Shariah', 'Shariah Board', '2023-06-01', '2023-07-01', 'Framework for ensuring Shariah compliance in all activities', ARRAY['shariah', 'compliance', 'islamic'], '/legal/shariah_framework.pdf', 'active'),
('Anti-Money Laundering Policy', 'sk_direksi', 'SK-DIR-020/2024', 'Compliance', 'CEO', '2024-05-01', '2024-05-15', 'AML policy in compliance with SAMA regulations', ARRAY['aml', 'compliance', 'kyc'], '/legal/aml_policy.pdf', 'active'),
('Data Protection Policy', 'sk_direksi', 'SK-DIR-025/2024', 'IT & Data', 'CEO', '2024-08-01', '2024-08-15', 'Policy governing personal data protection per Saudi PDPL', ARRAY['data', 'privacy', 'pdpl'], '/legal/data_protection.pdf', 'active'),
('Saudi Capital Market Law', 'uu', 'Royal Decree M/30', 'Regulatory', 'CMA Saudi Arabia', '2003-07-31', '2003-07-31', 'Primary legislation governing capital markets in Saudi Arabia', ARRAY['cma', 'capital market', 'securities'], '/legal/cma_law.pdf', 'active'),
('ZATCA VAT Regulations', 'peraturan_pemerintah', 'VAT-REG-2024', 'Tax', 'ZATCA', '2024-01-01', '2024-01-01', 'Updated VAT regulations and compliance requirements', ARRAY['vat', 'tax', 'zatca'], '/legal/vat_regulations.pdf', 'active');

-- =====================================================
-- VERIFICATION - Run this to check data counts
-- =====================================================
-- SELECT 'hcms_employees' as tbl, count(*) as cnt FROM hcms_employees
-- UNION ALL SELECT 'hcms_attendance', count(*) FROM hcms_attendance
-- UNION ALL SELECT 'hcms_leave_requests', count(*) FROM hcms_leave_requests
-- UNION ALL SELECT 'hcms_job_postings', count(*) FROM hcms_job_postings
-- UNION ALL SELECT 'hcms_training_courses', count(*) FROM hcms_training_courses
-- UNION ALL SELECT 'lcrms_contracts', count(*) FROM lcrms_contracts
-- UNION ALL SELECT 'lcrms_risks', count(*) FROM lcrms_risks
-- UNION ALL SELECT 'lcrms_shareholders', count(*) FROM lcrms_shareholders
-- UNION ALL SELECT 'lcrms_legal_documents', count(*) FROM lcrms_legal_documents;
