-- =====================================================
-- SAMPLE DATA FOR BPKH LIMITED DASHBOARD
-- HCMS & LCRMS Modules
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
('BPKH010', 'Omar', 'Farooq', 'omar.farooq@bpkh.sa', '+966510123456', 'Marketing', 'Marketing Specialist', 'S1', 'active', 'full_time', '2023-06-01', 32000, 'JO', 'IQ567890123', '2025-08-20', 'D01234567', '2027-01-15', '2025-12-31');

-- Attendance (last 7 days)
INSERT INTO hcms_attendance (employee_id, employee_code, employee_name, date, check_in, check_out, status, work_hours, late_minutes, check_in_location) VALUES
-- Today
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
-- Yesterday
((SELECT id FROM hcms_employees WHERE employee_id = 'BPKH001'), 'BPKH001', 'Abdullah Al-Faisal', CURRENT_DATE - 1, '08:00', '17:00', 'present', 9, 0, 'Office'),
((SELECT id FROM hcms_employees WHERE employee_id = 'BPKH002'), 'BPKH002', 'Fatima Hassan', CURRENT_DATE - 1, '08:00', '17:00', 'present', 9, 0, 'Office'),
((SELECT id FROM hcms_employees WHERE employee_id = 'BPKH003'), 'BPKH003', 'Ahmad Al-Rashid', CURRENT_DATE - 1, '08:00', '17:00', 'present', 9, 0, 'Office'),
((SELECT id FROM hcms_employees WHERE employee_id = 'BPKH004'), 'BPKH004', 'Mohammad Khan', CURRENT_DATE - 1, '08:00', '17:00', 'present', 9, 0, 'Office'),
((SELECT id FROM hcms_employees WHERE employee_id = 'BPKH005'), 'BPKH005', 'Sarah Al-Qahtani', CURRENT_DATE - 1, '08:00', '17:00', 'present', 9, 0, 'Office');

-- Leave Balances
INSERT INTO hcms_leave_balances (employee_id, leave_type_id, year, entitled_days, used_days, pending_days, remaining_days)
SELECT
  e.id,
  lt.id,
  2025,
  COALESCE(lt.days_allowed, 0),
  CASE WHEN lt.name = 'Annual Leave' THEN floor(random() * 5)::int ELSE 0 END,
  0,
  COALESCE(lt.days_allowed, 0) - CASE WHEN lt.name = 'Annual Leave' THEN floor(random() * 5)::int ELSE 0 END
FROM hcms_employees e
CROSS JOIN hcms_leave_types lt
WHERE lt.days_allowed IS NOT NULL;

-- Leave Requests
INSERT INTO hcms_leave_requests (employee_id, leave_type_id, start_date, end_date, days, reason, status, approved_by, approved_at) VALUES
((SELECT id FROM hcms_employees WHERE employee_id = 'BPKH004'), (SELECT id FROM hcms_leave_types WHERE name = 'Annual Leave'), CURRENT_DATE, CURRENT_DATE + 2, 3, 'Family vacation', 'approved', 'Abdullah Al-Faisal', NOW() - INTERVAL '2 days'),
((SELECT id FROM hcms_employees WHERE employee_id = 'BPKH006'), (SELECT id FROM hcms_leave_types WHERE name = 'Sick Leave'), CURRENT_DATE, CURRENT_DATE, 1, 'Medical appointment', 'approved', 'Fatima Hassan', NOW() - INTERVAL '1 day'),
((SELECT id FROM hcms_employees WHERE employee_id = 'BPKH003'), (SELECT id FROM hcms_leave_types WHERE name = 'Annual Leave'), CURRENT_DATE + 7, CURRENT_DATE + 11, 5, 'Personal travel', 'pending', NULL, NULL),
((SELECT id FROM hcms_employees WHERE employee_id = 'BPKH005'), (SELECT id FROM hcms_leave_types WHERE name = 'Emergency Leave'), CURRENT_DATE + 3, CURRENT_DATE + 4, 2, 'Family emergency', 'pending', NULL, NULL),
((SELECT id FROM hcms_employees WHERE employee_id = 'BPKH008'), (SELECT id FROM hcms_leave_types WHERE name = 'Hajj Leave'), '2025-06-01', '2025-06-15', 15, 'Hajj pilgrimage', 'approved', 'Ahmad Al-Rashid', NOW() - INTERVAL '30 days');

-- Payroll Periods
INSERT INTO hcms_payroll_periods (period_name, start_date, end_date, status, processed_at) VALUES
('January 2025', '2025-01-01', '2025-01-31', 'paid', '2025-01-28'),
('December 2024', '2024-12-01', '2024-12-31', 'paid', '2024-12-28'),
('November 2024', '2024-11-01', '2024-11-30', 'paid', '2024-11-28');

-- Payroll Records (January 2025)
INSERT INTO hcms_payroll_records (employee_id, period_id, basic_salary, housing_allowance, transport_allowance, other_allowances, overtime_hours, overtime_pay, deductions, gosi_employee, gosi_employer, net_salary, currency, status, payment_date)
SELECT
  e.id,
  (SELECT id FROM hcms_payroll_periods WHERE period_name = 'January 2025'),
  e.salary,
  e.salary * 0.25,
  2000,
  1000,
  0,
  0,
  e.salary * 0.02,
  e.salary * 0.0975,
  e.salary * 0.12,
  e.salary + (e.salary * 0.25) + 2000 + 1000 - (e.salary * 0.02) - (e.salary * 0.0975),
  'SAR',
  'paid',
  '2025-01-28'
FROM hcms_employees e;

-- Job Postings
INSERT INTO hcms_job_postings (title, department, description, requirements, employment_type, salary_min, salary_max, currency, status, posted_date, closing_date, hiring_manager) VALUES
('Senior Software Engineer', 'Information Technology', 'We are looking for an experienced software engineer to join our IT team.', 'Bachelor degree in CS, 5+ years experience, React/Node.js', 'full_time', 40000, 55000, 'SAR', 'open', CURRENT_DATE - 25, CURRENT_DATE + 5, 'Ahmad Al-Rashid'),
('Financial Analyst', 'Finance', 'Join our finance team to support investment analysis and reporting.', 'Bachelor in Finance/Accounting, CFA preferred, 3+ years experience', 'full_time', 30000, 40000, 'SAR', 'screening', CURRENT_DATE - 15, CURRENT_DATE + 15, 'Abdullah Al-Faisal'),
('HR Coordinator', 'Human Resources', 'Support HR operations including recruitment and employee relations.', 'Bachelor in HR/Business, 2+ years experience, Arabic & English fluent', 'full_time', 22000, 28000, 'SAR', 'open', CURRENT_DATE - 10, CURRENT_DATE + 20, 'Fatima Hassan'),
('Operations Specialist', 'Operations', 'Manage daily operations and process improvements.', 'Bachelor degree, 3+ years operations experience, strong analytical skills', 'full_time', 28000, 35000, 'SAR', 'offer', CURRENT_DATE - 30, CURRENT_DATE - 1, 'Mohammad Khan');

-- Candidates
INSERT INTO hcms_candidates (job_posting_id, name, email, phone, resume_url, status, rating, notes) VALUES
((SELECT id FROM hcms_job_postings WHERE title = 'Senior Software Engineer'), 'Ali Hassan', 'ali.hassan@email.com', '+966551234567', '/resumes/ali_hassan.pdf', 'interview', 4.5, 'Strong technical background, good communication'),
((SELECT id FROM hcms_job_postings WHERE title = 'Senior Software Engineer'), 'Layla Ahmed', 'layla.ahmed@email.com', '+966552345678', '/resumes/layla_ahmed.pdf', 'interview', 4.8, 'Excellent experience with React, AWS certified'),
((SELECT id FROM hcms_job_postings WHERE title = 'Senior Software Engineer'), 'Hassan Ali', 'hassan.ali@email.com', '+966553456789', '/resumes/hassan_ali.pdf', 'screening', 3.5, 'Good potential but limited experience'),
((SELECT id FROM hcms_job_postings WHERE title = 'Operations Specialist'), 'Maryam Khan', 'maryam.khan@email.com', '+966554567890', '/resumes/maryam_khan.pdf', 'offer', 4.7, 'Outstanding candidate, offer extended'),
((SELECT id FROM hcms_job_postings WHERE title = 'Financial Analyst'), 'Tariq Rahman', 'tariq.rahman@email.com', '+966555678901', '/resumes/tariq_rahman.pdf', 'screening', 4.0, 'CFA Level 2, solid experience');

-- Performance Cycles
INSERT INTO hcms_performance_cycles (name, type, start_date, end_date, status) VALUES
('2024 Annual Review', 'annual', '2024-01-01', '2024-12-31', 'completed'),
('2025 H1 Mid-Year', 'mid_year', '2025-01-01', '2025-06-30', 'active'),
('2025 Annual Review', 'annual', '2025-01-01', '2025-12-31', 'active');

-- Performance Reviews
INSERT INTO hcms_performance_reviews (employee_id, cycle_id, reviewer_id, overall_score, rating, goals_score, competency_score, status, comments, submitted_at, acknowledged_at) VALUES
((SELECT id FROM hcms_employees WHERE employee_id = 'BPKH001'), (SELECT id FROM hcms_performance_cycles WHERE name = '2024 Annual Review'), (SELECT id FROM hcms_employees WHERE employee_id = 'BPKH001'), 4.5, 'exceeds', 4.5, 4.5, 'acknowledged', 'Excellent leadership and strategic vision', NOW() - INTERVAL '15 days', NOW() - INTERVAL '10 days'),
((SELECT id FROM hcms_employees WHERE employee_id = 'BPKH002'), (SELECT id FROM hcms_performance_cycles WHERE name = '2024 Annual Review'), (SELECT id FROM hcms_employees WHERE employee_id = 'BPKH001'), 4.2, 'exceeds', 4.0, 4.4, 'acknowledged', 'Strong HR leadership, improved processes', NOW() - INTERVAL '15 days', NOW() - INTERVAL '8 days'),
((SELECT id FROM hcms_employees WHERE employee_id = 'BPKH003'), (SELECT id FROM hcms_performance_cycles WHERE name = '2024 Annual Review'), (SELECT id FROM hcms_employees WHERE employee_id = 'BPKH001'), 4.0, 'meets', 4.2, 3.8, 'submitted', 'Good technical delivery, needs leadership development', NOW() - INTERVAL '12 days', NULL),
((SELECT id FROM hcms_employees WHERE employee_id = 'BPKH005'), (SELECT id FROM hcms_performance_cycles WHERE name = '2024 Annual Review'), (SELECT id FROM hcms_employees WHERE employee_id = 'BPKH001'), 4.3, 'exceeds', 4.5, 4.1, 'draft', 'Exceptional analytical skills', NULL, NULL);

-- KPIs
INSERT INTO hcms_kpis (employee_id, cycle_id, kpi_name, description, target_value, actual_value, weight, unit, category) VALUES
((SELECT id FROM hcms_employees WHERE employee_id = 'BPKH001'), (SELECT id FROM hcms_performance_cycles WHERE name = '2025 Annual Review'), 'Revenue Growth', 'Achieve annual revenue growth target', 15, 18, 30, 'percentage', 'financial'),
((SELECT id FROM hcms_employees WHERE employee_id = 'BPKH001'), (SELECT id FROM hcms_performance_cycles WHERE name = '2025 Annual Review'), 'Cost Reduction', 'Reduce operational costs', 10, 8, 20, 'percentage', 'financial'),
((SELECT id FROM hcms_employees WHERE employee_id = 'BPKH001'), (SELECT id FROM hcms_performance_cycles WHERE name = '2025 Annual Review'), 'Team Development', 'Develop leadership pipeline', 100, 95, 25, 'percentage', 'people'),
((SELECT id FROM hcms_employees WHERE employee_id = 'BPKH001'), (SELECT id FROM hcms_performance_cycles WHERE name = '2025 Annual Review'), 'Compliance Score', 'Maintain regulatory compliance', 100, 100, 25, 'percentage', 'compliance'),
((SELECT id FROM hcms_employees WHERE employee_id = 'BPKH003'), (SELECT id FROM hcms_performance_cycles WHERE name = '2025 Annual Review'), 'System Uptime', 'Maintain 99.9% system availability', 99.9, 99.7, 40, 'percentage', 'operational'),
((SELECT id FROM hcms_employees WHERE employee_id = 'BPKH003'), (SELECT id FROM hcms_performance_cycles WHERE name = '2025 Annual Review'), 'Project Delivery', 'Complete projects on time', 90, 85, 30, 'percentage', 'operational'),
((SELECT id FROM hcms_employees WHERE employee_id = 'BPKH005'), (SELECT id FROM hcms_performance_cycles WHERE name = '2025 Annual Review'), 'Report Accuracy', 'Financial report accuracy rate', 99, 99.5, 40, 'percentage', 'quality'),
((SELECT id FROM hcms_employees WHERE employee_id = 'BPKH005'), (SELECT id FROM hcms_performance_cycles WHERE name = '2025 Annual Review'), 'Analysis Turnaround', 'Complete analysis within SLA', 95, 92, 30, 'percentage', 'operational');

-- Training Courses
INSERT INTO hcms_training_courses (title, description, type, category, provider, start_date, end_date, duration_hours, location, max_participants, enrolled, status) VALUES
('Islamic Finance Fundamentals', 'Comprehensive training on Islamic finance principles and Shariah compliance', 'internal', 'mandatory', 'BPKH Academy', CURRENT_DATE + 5, CURRENT_DATE + 6, 16, 'Training Room A', 30, 25, 'upcoming'),
('Advanced Excel for Finance', 'Excel advanced functions, pivot tables, and financial modeling', 'external', 'technical', 'Microsoft', CURRENT_DATE + 12, CURRENT_DATE + 12, 8, 'Online', 20, 18, 'upcoming'),
('Leadership Development Program', 'Leadership skills for managers and future leaders', 'internal', 'leadership', 'BPKH Academy', CURRENT_DATE - 15, CURRENT_DATE + 75, 40, 'Training Room B', 15, 12, 'ongoing'),
('Cybersecurity Awareness', 'Security best practices and threat awareness', 'online', 'mandatory', 'KnowBe4', CURRENT_DATE - 10, CURRENT_DATE - 10, 4, 'Online', 50, 45, 'completed'),
('Project Management Professional', 'PMP certification preparation course', 'external', 'technical', 'PMI', CURRENT_DATE + 30, CURRENT_DATE + 34, 35, 'Riyadh Training Center', 10, 8, 'upcoming');

-- Training Enrollments
INSERT INTO hcms_training_enrollments (course_id, employee_id, status, enrolled_at, completed_at, score, certificate_url) VALUES
((SELECT id FROM hcms_training_courses WHERE title = 'Cybersecurity Awareness'), (SELECT id FROM hcms_employees WHERE employee_id = 'BPKH001'), 'completed', NOW() - INTERVAL '15 days', NOW() - INTERVAL '10 days', 95, '/certificates/cyber_BPKH001.pdf'),
((SELECT id FROM hcms_training_courses WHERE title = 'Cybersecurity Awareness'), (SELECT id FROM hcms_employees WHERE employee_id = 'BPKH002'), 'completed', NOW() - INTERVAL '15 days', NOW() - INTERVAL '10 days', 92, '/certificates/cyber_BPKH002.pdf'),
((SELECT id FROM hcms_training_courses WHERE title = 'Cybersecurity Awareness'), (SELECT id FROM hcms_employees WHERE employee_id = 'BPKH003'), 'completed', NOW() - INTERVAL '15 days', NOW() - INTERVAL '10 days', 88, '/certificates/cyber_BPKH003.pdf'),
((SELECT id FROM hcms_training_courses WHERE title = 'Leadership Development Program'), (SELECT id FROM hcms_employees WHERE employee_id = 'BPKH002'), 'enrolled', NOW() - INTERVAL '15 days', NULL, NULL, NULL),
((SELECT id FROM hcms_training_courses WHERE title = 'Leadership Development Program'), (SELECT id FROM hcms_employees WHERE employee_id = 'BPKH003'), 'enrolled', NOW() - INTERVAL '15 days', NULL, NULL, NULL),
((SELECT id FROM hcms_training_courses WHERE title = 'Islamic Finance Fundamentals'), (SELECT id FROM hcms_employees WHERE employee_id = 'BPKH005'), 'enrolled', NOW() - INTERVAL '3 days', NULL, NULL, NULL),
((SELECT id FROM hcms_training_courses WHERE title = 'Islamic Finance Fundamentals'), (SELECT id FROM hcms_employees WHERE employee_id = 'BPKH006'), 'enrolled', NOW() - INTERVAL '3 days', NULL, NULL, NULL);

-- Compliance Documents
INSERT INTO hcms_compliance_documents (employee_id, document_type, document_number, issue_date, expiry_date, issuing_authority, document_url, status) VALUES
((SELECT id FROM hcms_employees WHERE employee_id = 'BPKH003'), 'iqama', 'IQ123456789', '2023-06-15', '2025-06-15', 'MOI Saudi Arabia', '/docs/iqama_BPKH003.pdf', 'expiring'),
((SELECT id FROM hcms_employees WHERE employee_id = 'BPKH004'), 'iqama', 'IQ234567890', '2023-03-10', '2025-03-10', 'MOI Saudi Arabia', '/docs/iqama_BPKH004.pdf', 'expiring'),
((SELECT id FROM hcms_employees WHERE employee_id = 'BPKH007'), 'iqama', 'IQ345678901', '2023-02-28', '2025-02-28', 'MOI Saudi Arabia', '/docs/iqama_BPKH007.pdf', 'expiring'),
((SELECT id FROM hcms_employees WHERE employee_id = 'BPKH003'), 'work_permit', 'WP123456', '2023-06-15', '2025-06-30', 'MOHR Saudi Arabia', '/docs/wp_BPKH003.pdf', 'valid'),
((SELECT id FROM hcms_employees WHERE employee_id = 'BPKH008'), 'iqama', 'IQ456789012', '2023-04-15', '2025-04-15', 'MOI Saudi Arabia', '/docs/iqama_BPKH008.pdf', 'valid');

-- Compliance Alerts
INSERT INTO hcms_compliance_alerts (employee_id, alert_type, document_type, expiry_date, days_remaining, status, notes) VALUES
((SELECT id FROM hcms_employees WHERE employee_id = 'BPKH007'), 'document_expiry', 'iqama', '2025-02-28', 32, 'active', 'Iqama expiring soon - initiate renewal'),
((SELECT id FROM hcms_employees WHERE employee_id = 'BPKH004'), 'document_expiry', 'iqama', '2025-03-10', 42, 'active', 'Iqama expiring - schedule renewal'),
((SELECT id FROM hcms_employees WHERE employee_id = 'BPKH008'), 'document_expiry', 'iqama', '2025-04-15', 78, 'active', 'Iqama renewal needed Q1'),
((SELECT id FROM hcms_employees WHERE employee_id = 'BPKH003'), 'document_expiry', 'iqama', '2025-06-15', 139, 'active', 'Plan iqama renewal'),
((SELECT id FROM hcms_employees WHERE employee_id = 'BPKH006'), 'probation_ending', 'contract', '2025-02-01', 5, 'active', 'Probation period ending - prepare evaluation');

-- Disciplinary Actions
INSERT INTO hcms_disciplinary_actions (employee_id, action_type, severity, description, incident_date, reported_by, action_taken, status, resolved_at) VALUES
((SELECT id FROM hcms_employees WHERE employee_id = 'BPKH008'), 'warning', 'minor', 'Repeated tardiness - 5 late arrivals in December', '2024-12-15', 'Fatima Hassan', 'Verbal warning issued, improvement plan created', 'resolved', '2024-12-20'),
((SELECT id FROM hcms_employees WHERE employee_id = 'BPKH010'), 'warning', 'moderate', 'Unauthorized access attempt to restricted system', '2025-01-10', 'Ahmad Al-Rashid', 'Written warning (SP1), security training required', 'resolved', '2025-01-15');


-- =====================================================
-- LCRMS SAMPLE DATA
-- =====================================================

-- Contracts
INSERT INTO lcrms_contracts (contract_number, name, type, partner_name, partner_contact, description, start_date, end_date, value, currency, status, auto_renewal, renewal_notice_days, created_by) VALUES
('CON-2024-001', 'IT Infrastructure Support', 'service', 'Saudi Tech Solutions', 'support@sauditech.sa', 'Annual IT infrastructure maintenance and support', '2024-01-01', '2025-06-30', 450000, 'SAR', 'active', true, 90, 'Ahmad Al-Rashid'),
('CON-2024-002', 'Office Space Lease - Riyadh HQ', 'sewa', 'Al-Faisaliah Properties', 'leasing@faisaliah.sa', 'Main office lease agreement - 2 floors', '2023-01-01', '2025-12-31', 1200000, 'SAR', 'active', false, 180, 'Abdullah Al-Faisal'),
('CON-2024-003', 'Legal Services Retainer', 'service', 'Al-Rajhi Law Firm', 'legal@alrajhi-law.sa', 'Monthly legal advisory services retainer', '2024-06-01', '2025-05-31', 180000, 'SAR', 'active', true, 60, 'Aisha Rahman'),
('CON-2024-004', 'Investment Advisory MoU', 'pks', 'Gulf Investment Partners', 'partners@gip.sa', 'Joint investment evaluation partnership', '2024-03-01', '2025-02-28', 0, 'SAR', 'expiring', false, 30, 'Abdullah Al-Faisal'),
('CON-2024-005', 'Confidentiality Agreement - Project Alpha', 'nda', 'Aramco Ventures', 'legal@aramco.sa', 'NDA for potential joint venture discussions', '2024-09-01', '2026-08-31', 0, 'SAR', 'active', false, 0, 'Aisha Rahman'),
('CON-2023-010', 'Cleaning Services Contract', 'vendor', 'Clean Arabia Co.', 'contracts@cleanarabia.sa', 'Daily office cleaning and maintenance', '2023-06-01', '2025-01-31', 72000, 'SAR', 'expiring', true, 30, 'Mohammad Khan'),
('CON-2022-005', 'Insurance Policy - Property', 'service', 'Tawuniya Insurance', 'corporate@tawuniya.sa', 'Property and assets insurance coverage', '2022-01-01', '2025-01-01', 85000, 'SAR', 'expired', false, 90, 'Sarah Al-Qahtani');

-- Contract Obligations
INSERT INTO lcrms_contract_obligations (contract_id, description, due_date, responsible_party, status, notes) VALUES
((SELECT id FROM lcrms_contracts WHERE contract_number = 'CON-2024-001'), 'Quarterly system health check report', '2025-03-31', 'partner', 'pending', 'Q1 2025 report due'),
((SELECT id FROM lcrms_contracts WHERE contract_number = 'CON-2024-001'), 'Annual security audit', '2025-06-15', 'partner', 'pending', 'Schedule with IT team'),
((SELECT id FROM lcrms_contracts WHERE contract_number = 'CON-2024-002'), 'Monthly rent payment', '2025-02-01', 'company', 'pending', 'SAR 100,000 monthly'),
((SELECT id FROM lcrms_contracts WHERE contract_number = 'CON-2024-003'), 'Monthly legal hours report', '2025-02-05', 'partner', 'pending', 'January 2025 hours'),
((SELECT id FROM lcrms_contracts WHERE contract_number = 'CON-2024-004'), 'Investment pipeline review meeting', '2025-02-15', 'company', 'pending', 'Quarterly review due'),
((SELECT id FROM lcrms_contracts WHERE contract_number = 'CON-2023-010'), 'Service quality assessment', '2025-01-20', 'company', 'completed', 'Assessment completed, satisfactory');

-- Licenses
INSERT INTO lcrms_licenses (name, type, license_number, issuer, country, issue_date, expiry_date, status, document_url, renewal_notes) VALUES
('Commercial Registration', 'commercial_registration', 'CR-1234567890', 'Ministry of Commerce', 'SA', '2023-01-15', '2026-01-14', 'valid', '/licenses/cr_sa.pdf', 'Renew 90 days before expiry'),
('Investment License', 'operational_permit', 'SAGIA-2023-4567', 'SAGIA', 'SA', '2023-03-01', '2025-02-28', 'expiring', '/licenses/sagia.pdf', 'Renewal application submitted'),
('NIB - Indonesia Office', 'nib', 'NIB-1234567890123', 'OSS Indonesia', 'ID', '2024-01-10', '2029-01-09', 'valid', '/licenses/nib_id.pdf', 'Valid for 5 years'),
('Tax Registration', 'tax_registration', 'TAX-SA-987654', 'ZATCA', 'SA', '2020-06-01', '2030-05-31', 'valid', '/licenses/tax_sa.pdf', 'No renewal needed'),
('Financial Services License', 'operational_permit', 'CMA-FSL-2024-001', 'Capital Market Authority', 'SA', '2024-06-01', '2025-05-31', 'valid', '/licenses/cma_fsl.pdf', 'Annual renewal required');

-- COI Declarations
INSERT INTO lcrms_coi_declarations (employee_id, employee_name, department, position, year, has_conflict, conflict_details, related_parties, mitigation_plan, status, reviewed_by, reviewed_at, submitted_at) VALUES
('BPKH001', 'Abdullah Al-Faisal', 'Executive', 'CEO', 2025, true, 'Board member of Al-Faisal Holdings which may have business dealings with BPKH partners', ARRAY['Al-Faisal Holdings', 'Al-Faisal Foundation'], 'Recuse from decisions involving Al-Faisal entities', 'approved', 'Board Chairman', NOW() - INTERVAL '10 days', NOW() - INTERVAL '20 days'),
('BPKH002', 'Fatima Hassan', 'HR', 'HR Manager', 2025, false, NULL, NULL, NULL, 'approved', 'Abdullah Al-Faisal', NOW() - INTERVAL '15 days', NOW() - INTERVAL '18 days'),
('BPKH003', 'Ahmad Al-Rashid', 'IT', 'IT Director', 2025, false, NULL, NULL, NULL, 'submitted', NULL, NULL, NOW() - INTERVAL '5 days'),
('BPKH005', 'Sarah Al-Qahtani', 'Finance', 'Financial Analyst', 2025, false, NULL, NULL, NULL, 'pending', NULL, NULL, NOW() - INTERVAL '2 days'),
('BPKH009', 'Aisha Rahman', 'Legal', 'Legal Counsel', 2025, true, 'Spouse works at Al-Rajhi Law Firm (BPKH vendor)', ARRAY['Al-Rajhi Law Firm'], 'Not involved in vendor selection or contract negotiations with Al-Rajhi', 'approved', 'Abdullah Al-Faisal', NOW() - INTERVAL '12 days', NOW() - INTERVAL '15 days');

-- Employee Violations
INSERT INTO lcrms_employee_violations (employee_id, employee_name, department, violation_type, severity, description, incident_date, reported_by, investigation_status, action_taken, resolution, resolved_at) VALUES
('BPKH008', 'Yusuf Ibrahim', 'IT', 'policy_breach', 'minor', 'Used personal USB drive to transfer work files without authorization', '2024-11-15', 'Ahmad Al-Rashid', 'concluded', 'Verbal warning and security awareness training', 'Employee completed training, no repeat incidents', '2024-11-25'),
('EX-001', 'Former Employee', 'Finance', 'fraud', 'critical', 'Attempted unauthorized fund transfer detected and blocked', '2024-08-10', 'Sarah Al-Qahtani', 'concluded', 'Immediate termination and legal action initiated', 'Case referred to authorities, civil suit filed', '2024-08-20');

-- Risks
INSERT INTO lcrms_risks (risk_code, division, category, name, description, cause, impact_description, impact_score, likelihood_score, risk_score, level, mitigation_plan, mitigation_status, pic_name, pic_id, target_date, review_date, status) VALUES
('RSK-2025-001', 'Finance', 'financial', 'Currency Fluctuation Risk', 'Exposure to SAR/IDR exchange rate volatility affecting Indonesia operations', 'Multi-currency operations between SA and ID', 'Potential 5-10% variance in reported profits', 4, 3, 12, 'high', 'Implement natural hedging and forward contracts for large transactions', 'in_progress', 'Sarah Al-Qahtani', 'BPKH005', '2025-03-31', '2025-04-15', 'open'),
('RSK-2025-002', 'IT', 'operational', 'Cybersecurity Threat', 'Risk of data breach or ransomware attack', 'Increasing sophistication of cyber attacks in financial sector', 'Operational disruption, data loss, reputational damage', 5, 3, 15, 'critical', 'Enhanced SOC monitoring, regular penetration testing, employee training', 'implemented', 'Ahmad Al-Rashid', 'BPKH003', '2025-02-28', '2025-03-15', 'open'),
('RSK-2025-003', 'Legal', 'compliance', 'Regulatory Change Risk', 'New CMA regulations may require operational changes', 'Evolving Saudi financial sector regulations', 'Potential non-compliance penalties, license issues', 3, 4, 12, 'high', 'Dedicated regulatory monitoring, proactive compliance assessment', 'in_progress', 'Aisha Rahman', 'BPKH009', '2025-06-30', '2025-07-15', 'open'),
('RSK-2025-004', 'Operations', 'operational', 'Key Person Dependency', 'Critical knowledge concentrated in few individuals', 'Limited cross-training and documentation', 'Business continuity risk if key staff unavailable', 4, 3, 12, 'high', 'Knowledge transfer program, process documentation, succession planning', 'identified', 'Mohammad Khan', 'BPKH004', '2025-04-30', '2025-05-15', 'open'),
('RSK-2025-005', 'Executive', 'strategic', 'Market Competition Risk', 'Increasing competition in Islamic investment management', 'New market entrants with aggressive pricing', 'Potential market share erosion', 3, 3, 9, 'medium', 'Differentiation through service quality and Shariah expertise', 'monitoring', 'Abdullah Al-Faisal', 'BPKH001', '2025-12-31', '2025-06-30', 'open'),
('RSK-2024-010', 'Finance', 'shariah', 'Shariah Non-Compliance Risk', 'Investment screening may miss non-compliant elements', 'Complex investment structures, evolving Shariah standards', 'Reputational damage, investor withdrawal', 4, 2, 8, 'medium', 'Enhanced screening process, Shariah board quarterly review', 'implemented', 'Abdullah Al-Faisal', 'BPKH001', '2024-12-31', '2025-03-31', 'mitigated');

-- Litigation Cases
INSERT INTO lcrms_litigation_cases (case_number, title, type, court_name, jurisdiction, plaintiff, defendant, subject_matter, claim_amount, currency, status, priority, external_counsel_id, outcome, opened_at) VALUES
('LIT-2024-001', 'Contract Dispute - Alpha Investments', 'litigation', 'Commercial Court Riyadh', 'Saudi Arabia', 'BPKH Limited', 'Alpha Investments LLC', 'Breach of investment agreement terms', 2500000, 'SAR', 'discovery', 'high', NULL, NULL, '2024-06-15'),
('LIT-2024-002', 'Employment Dispute - Ex-Employee', 'litigation', 'Labor Court Riyadh', 'Saudi Arabia', 'Ahmed Mohammed (Ex-Employee)', 'BPKH Limited', 'Wrongful termination claim', 180000, 'SAR', 'settled', 'medium', NULL, 'Settled out of court for SAR 50,000', '2024-03-01'),
('LIT-2023-005', 'Vendor Payment Dispute', 'non_litigation', NULL, 'Saudi Arabia', 'Tech Solutions Co.', 'BPKH Limited', 'Disputed invoice for incomplete services', 75000, 'SAR', 'closed', 'low', NULL, 'Negotiated settlement - 60% payment', '2023-09-15');

-- External Counsels
INSERT INTO lcrms_external_counsels (firm_name, contact_person, email, phone, address, specialization, jurisdiction, hourly_rate, currency, cases_handled, cases_won, performance_rating, contract_start, contract_end, status, notes) VALUES
('Al-Rajhi Law Firm', 'Dr. Khalid Al-Rajhi', 'khalid@alrajhi-law.sa', '+966112345678', 'King Fahd Road, Riyadh', ARRAY['Corporate Law', 'Commercial Disputes', 'Islamic Finance'], ARRAY['Saudi Arabia', 'GCC'], 2500, 'SAR', 5, 4, 4.5, '2024-06-01', '2025-05-31', 'active', 'Primary legal counsel for corporate matters'),
('Baker McKenzie (Riyadh)', 'Sarah Williams', 'sarah.williams@bakermckenzie.com', '+966113456789', 'KAFD, Riyadh', ARRAY['International Transactions', 'M&A', 'Regulatory'], ARRAY['Saudi Arabia', 'International'], 4500, 'SAR', 2, 2, 4.8, '2024-01-01', '2024-12-31', 'active', 'International transaction specialist'),
('Indonesian Law Partners', 'Budi Santoso', 'budi@ilp.co.id', '+622112345678', 'Jakarta, Indonesia', ARRAY['Indonesian Corporate Law', 'Investment Law'], ARRAY['Indonesia'], 350, 'USD', 3, 3, 4.2, '2023-01-01', '2025-12-31', 'active', 'Indonesia operations legal support');

-- Meetings
INSERT INTO lcrms_meetings (meeting_number, meeting_type, title, meeting_date, start_time, end_time, location, agenda, status, prepared_by, approved_by) VALUES
('MOM-2025-001', 'board_of_directors', 'Q4 2024 Board Meeting', '2025-01-15', '10:00', '13:00', 'Board Room, Riyadh HQ', ARRAY['Q4 2024 Financial Results', 'Investment Portfolio Review', '2025 Budget Approval', 'Risk Management Update'], 'finalized', 'Aisha Rahman', 'Abdullah Al-Faisal'),
('MOM-2025-002', 'management', 'Monthly Management Meeting - January', '2025-01-20', '14:00', '16:00', 'Meeting Room A', ARRAY['Operational KPIs Review', 'HR Updates', 'IT Projects Status', 'Compliance Matters'], 'draft', 'Fatima Hassan', NULL),
('MOM-2024-012', 'rups', 'Annual General Meeting 2024', '2024-12-10', '09:00', '12:00', 'Grand Ballroom, Four Seasons Riyadh', ARRAY['2024 Annual Report', 'Dividend Declaration', 'Board Elections', 'Auditor Appointment'], 'signed', 'Aisha Rahman', 'Board Chairman');

-- Meeting Attendees
INSERT INTO lcrms_meeting_attendees (meeting_id, name, position, role, attendance, proxy_name) VALUES
((SELECT id FROM lcrms_meetings WHERE meeting_number = 'MOM-2025-001'), 'Abdullah Al-Faisal', 'CEO', 'member', 'present', NULL),
((SELECT id FROM lcrms_meetings WHERE meeting_number = 'MOM-2025-001'), 'Dr. Mohammed Al-Sheikh', 'Chairman', 'chairman', 'present', NULL),
((SELECT id FROM lcrms_meetings WHERE meeting_number = 'MOM-2025-001'), 'Eng. Fahad Al-Turki', 'Board Member', 'member', 'present', NULL),
((SELECT id FROM lcrms_meetings WHERE meeting_number = 'MOM-2025-001'), 'Dr. Nora Al-Saud', 'Board Member', 'member', 'proxy', 'Abdullah Al-Faisal'),
((SELECT id FROM lcrms_meetings WHERE meeting_number = 'MOM-2025-001'), 'Aisha Rahman', 'Legal Counsel', 'secretary', 'present', NULL);

-- Meeting Agenda Items
INSERT INTO lcrms_meeting_agenda (meeting_id, item_number, title, description, presenter, duration_minutes) VALUES
((SELECT id FROM lcrms_meetings WHERE meeting_number = 'MOM-2025-001'), 1, 'Q4 2024 Financial Results', 'Review of Q4 financial performance and full year results', 'Sarah Al-Qahtani', 30),
((SELECT id FROM lcrms_meetings WHERE meeting_number = 'MOM-2025-001'), 2, 'Investment Portfolio Review', 'Performance review of current investments', 'Abdullah Al-Faisal', 45),
((SELECT id FROM lcrms_meetings WHERE meeting_number = 'MOM-2025-001'), 3, '2025 Budget Approval', 'Presentation and approval of 2025 operating budget', 'Sarah Al-Qahtani', 30),
((SELECT id FROM lcrms_meetings WHERE meeting_number = 'MOM-2025-001'), 4, 'Risk Management Update', 'Quarterly risk assessment report', 'Aisha Rahman', 20);

-- Meeting Decisions
INSERT INTO lcrms_meeting_decisions (meeting_id, decision_number, title, description, voting_result, effective_date) VALUES
((SELECT id FROM lcrms_meetings WHERE meeting_number = 'MOM-2025-001'), 'DEC-2025-001', '2025 Budget Approval', 'The Board approves the 2025 operating budget of SAR 15 million', 'Unanimous', '2025-01-01'),
((SELECT id FROM lcrms_meetings WHERE meeting_number = 'MOM-2025-001'), 'DEC-2025-002', 'Q4 Dividend', 'Approved Q4 2024 dividend distribution of SAR 2 per share', '4-0 (1 abstain)', '2025-02-01'),
((SELECT id FROM lcrms_meetings WHERE meeting_number = 'MOM-2024-012'), 'DEC-2024-050', 'Annual Dividend 2024', 'Approved total annual dividend of SAR 8 per share for 2024', 'Unanimous', '2024-12-15');

-- Shareholders
INSERT INTO lcrms_shareholders (name, type, nationality, shares, percentage, share_class, acquisition_date, acquisition_type, status, contact_email, contact_phone, notes) VALUES
('Ministry of Religious Affairs - Indonesia', 'government', 'ID', 5000000, 50.00, 'common', '2020-01-01', 'founding', 'active', 'legal@kemenag.go.id', '+622134567890', 'Founding shareholder - Republic of Indonesia'),
('Public Investment Fund', 'government', 'SA', 3000000, 30.00, 'common', '2020-01-01', 'founding', 'active', 'investments@pif.gov.sa', '+966112345678', 'Founding shareholder - Kingdom of Saudi Arabia'),
('Islamic Development Bank', 'corporate', 'SA', 1500000, 15.00, 'common', '2021-06-15', 'rights_issue', 'active', 'legal@isdb.org', '+966126466476', 'Strategic investor'),
('Private Investors Pool', 'corporate', 'SA', 500000, 5.00, 'preferred', '2022-03-01', 'purchase', 'active', 'investors@privatepool.sa', '+966113456789', 'Preferred shares with priority dividend');

-- Circular Resolutions
INSERT INTO lcrms_circular_resolutions (resolution_number, resolution_type, subject, description, proposed_by, proposed_date, deadline, status, document_url, effective_date) VALUES
('CR-2025-001', 'board', 'Emergency IT Security Investment', 'Approval for SAR 500,000 emergency cybersecurity upgrade', 'Ahmad Al-Rashid', '2025-01-10', '2025-01-17', 'approved', '/resolutions/CR-2025-001.pdf', '2025-01-18'),
('CR-2025-002', 'board', 'New Office Lease Extension', 'Approval to extend Riyadh HQ lease for additional 2 years', 'Mohammad Khan', '2025-01-20', '2025-01-27', 'pending', '/resolutions/CR-2025-002.pdf', NULL),
('CR-2024-015', 'shareholders', 'Amendment to Articles of Association', 'Update to Article 15 regarding board composition', 'Aisha Rahman', '2024-11-01', '2024-11-15', 'approved', '/resolutions/CR-2024-015.pdf', '2024-11-20');

-- Circular Approvals
INSERT INTO lcrms_circular_approvals (resolution_id, approver_name, approver_position, decision, comments, decided_at) VALUES
((SELECT id FROM lcrms_circular_resolutions WHERE resolution_number = 'CR-2025-001'), 'Dr. Mohammed Al-Sheikh', 'Chairman', 'approved', 'Approved - security is priority', '2025-01-12'),
((SELECT id FROM lcrms_circular_resolutions WHERE resolution_number = 'CR-2025-001'), 'Abdullah Al-Faisal', 'CEO', 'approved', 'Recommend immediate implementation', '2025-01-11'),
((SELECT id FROM lcrms_circular_resolutions WHERE resolution_number = 'CR-2025-001'), 'Eng. Fahad Al-Turki', 'Board Member', 'approved', NULL, '2025-01-13'),
((SELECT id FROM lcrms_circular_resolutions WHERE resolution_number = 'CR-2025-002'), 'Abdullah Al-Faisal', 'CEO', 'approved', 'Good terms negotiated', '2025-01-22'),
((SELECT id FROM lcrms_circular_resolutions WHERE resolution_number = 'CR-2025-002'), 'Dr. Mohammed Al-Sheikh', 'Chairman', 'pending', NULL, NULL);

-- Legal Documents (Knowledge Base)
INSERT INTO lcrms_legal_documents (title, document_type, document_number, category, issuer, issue_date, effective_date, summary, keywords, document_url, status) VALUES
('Company Code of Ethics', 'peraturan_perusahaan', 'PP-001/2024', 'Corporate Governance', 'Board of Directors', '2024-01-01', '2024-01-15', 'Comprehensive code of ethics governing employee conduct, conflicts of interest, and business ethics standards', ARRAY['ethics', 'conduct', 'compliance', 'governance'], '/legal/code_of_ethics.pdf', 'active'),
('Investment Policy Guidelines', 'sk_direksi', 'SK-DIR-015/2024', 'Investment', 'CEO', '2024-03-01', '2024-03-15', 'Guidelines for investment evaluation, approval thresholds, and risk management in investment decisions', ARRAY['investment', 'policy', 'risk', 'approval'], '/legal/investment_policy.pdf', 'active'),
('Shariah Compliance Framework', 'peraturan_perusahaan', 'PP-005/2023', 'Shariah', 'Shariah Board', '2023-06-01', '2023-07-01', 'Framework for ensuring all business activities comply with Islamic Shariah principles', ARRAY['shariah', 'compliance', 'islamic', 'halal'], '/legal/shariah_framework.pdf', 'active'),
('Anti-Money Laundering Policy', 'sk_direksi', 'SK-DIR-020/2024', 'Compliance', 'CEO', '2024-05-01', '2024-05-15', 'AML policy in compliance with SAMA and international regulations', ARRAY['aml', 'compliance', 'kyc', 'sanctions'], '/legal/aml_policy.pdf', 'active'),
('Data Protection Policy', 'sk_direksi', 'SK-DIR-025/2024', 'IT & Data', 'CEO', '2024-08-01', '2024-08-15', 'Policy governing personal data protection in line with Saudi PDPL', ARRAY['data', 'privacy', 'pdpl', 'protection'], '/legal/data_protection.pdf', 'active'),
('Saudi Capital Market Law', 'uu', 'Royal Decree M/30', 'Regulatory', 'CMA Saudi Arabia', '2003-07-31', '2003-07-31', 'Primary legislation governing capital markets in Saudi Arabia', ARRAY['cma', 'capital market', 'securities', 'regulation'], '/legal/cma_law.pdf', 'active'),
('ZATCA VAT Regulations', 'peraturan_pemerintah', 'VAT-REG-2024', 'Tax', 'ZATCA', '2024-01-01', '2024-01-01', 'Updated VAT regulations and compliance requirements', ARRAY['vat', 'tax', 'zatca', 'compliance'], '/legal/vat_regulations.pdf', 'active');

-- Update contract external_counsel_id
UPDATE lcrms_litigation_cases
SET external_counsel_id = (SELECT id FROM lcrms_external_counsels WHERE firm_name = 'Al-Rajhi Law Firm'),
    external_counsel_name = 'Al-Rajhi Law Firm'
WHERE case_number = 'LIT-2024-001';

-- =====================================================
-- VERIFICATION QUERIES (optional - run to check data)
-- =====================================================
-- SELECT 'hcms_employees' as table_name, count(*) FROM hcms_employees
-- UNION ALL SELECT 'hcms_attendance', count(*) FROM hcms_attendance
-- UNION ALL SELECT 'hcms_leave_requests', count(*) FROM hcms_leave_requests
-- UNION ALL SELECT 'hcms_payroll_records', count(*) FROM hcms_payroll_records
-- UNION ALL SELECT 'hcms_job_postings', count(*) FROM hcms_job_postings
-- UNION ALL SELECT 'hcms_training_courses', count(*) FROM hcms_training_courses
-- UNION ALL SELECT 'lcrms_contracts', count(*) FROM lcrms_contracts
-- UNION ALL SELECT 'lcrms_risks', count(*) FROM lcrms_risks
-- UNION ALL SELECT 'lcrms_litigation_cases', count(*) FROM lcrms_litigation_cases
-- UNION ALL SELECT 'lcrms_shareholders', count(*) FROM lcrms_shareholders;
