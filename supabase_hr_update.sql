-- =====================================================
-- BPKH Limited - HR Database Update
-- Based on HR_Database_BPKH Limited 2025.xlsx
-- =====================================================

-- Clear existing sample employees
DELETE FROM hcms_disciplinary_actions;
DELETE FROM hcms_compliance_alerts;
DELETE FROM hcms_training_enrollments;
DELETE FROM hcms_kpis;
DELETE FROM hcms_performance_reviews;
DELETE FROM hcms_candidates;
DELETE FROM hcms_payroll_records;
DELETE FROM hcms_leave_requests;
DELETE FROM hcms_attendance;
DELETE FROM hcms_employees WHERE employee_id LIKE 'BPKH%' OR employee_id LIKE '2024%' OR employee_id LIKE '2025%';

-- Insert real employee data from HR Database Excel
INSERT INTO hcms_employees (employee_id, first_name, last_name, email, phone, department, position, grade, employment_status, employment_type, hire_date, salary, nationality, iqamah_number, iqamah_expiry, passport_number, passport_expiry, gender, marital_status, iban, bank_name) VALUES
('2024001', 'Sidiq', 'Haryono', 'sidiq@bpkhlimited.com', '+9660547236742', 'Executive', 'General Manager', 'E1', 'active', 'full_time', '2024-01-15', 85000, 'ID', '2565191802', '2025-10-06', NULL, NULL, 'male', 'married', 'SA9780000857608017250149', 'Al Rajhi Bank'),
('2024002', 'Iman', 'Nimatullah Muhdi', 'inikmatullah@gmail.com', '+9660562308193', 'Executive', 'General Manager', 'E1', 'active', 'full_time', '2024-01-15', 85000, 'ID', '2565190952', '2025-10-06', NULL, NULL, 'male', 'married', 'SA6680007702608015368679', 'Al Rajhi Bank'),
('2024003', 'Mujiburahman', 'Yaqub Abdurahman', 'mujibbpkhltd@gmail.com', '+9660536380746', 'Finance', 'Accountant', 'S1', 'active', 'full_time', '2024-01-15', 28000, 'ID', '2575427105', '2025-08-07', NULL, NULL, 'male', 'married', 'SA5980000991608016902596', 'Al Rajhi Bank'),
('2024004', 'Zoehelmy', 'Husen Muhammad Husen', 'zoehelmy.husen@gmail.com', '+9660580703126', 'Operations', 'Hajj and Umrah Operations Manager', 'M1', 'active', 'full_time', '2024-01-15', 45000, 'ID', '2592183145', '2026-03-04', NULL, NULL, 'male', 'married', 'SA7180000857608013935545', 'Al Rajhi Bank'),
('2024005', 'Ibrahim', 'Mohmmed Yasin Abdulghani', 'ibrahimjambi@gmail.com', '+9660555546825', 'Operations', 'Business Consulting Specialist', 'S2', 'active', 'full_time', '2024-01-15', 35000, 'ID', '2059969689', '2025-06-11', NULL, NULL, 'male', 'married', 'SA1880000345608010083651', 'Al Rajhi Bank'),
('2024006', 'Karimah', 'Abdulkhoir', 'kimoo_nst@yahoo.com', '+9660502287861', 'Operations', 'Tourism Specialist', 'S2', 'active', 'full_time', '2024-01-15', 35000, 'ID', '2139779520', '2025-07-23', NULL, NULL, 'female', 'single', 'SA4080000857608017976735', 'Al Rajhi Bank'),
('2024007', 'Nebras', 'Faishal Bin Abdul Aziz Maas', 'nebrasmass@gmail.com', '+9660545121091', 'Operations', 'Quality Controller', 'S1', 'active', 'full_time', '2024-01-15', 28000, 'SA', '1090646124', '2027-09-15', NULL, NULL, 'male', 'single', 'SA2680000857608017077021', 'Al Rajhi Bank'),
('2024008', 'Samer', 'Sholeh Bin Muhamad Thoyib Kamfar', 'samer.kamfar@gmail.com', '+9660543334004', 'Operations', 'Hajj and Umrah Services Observer', 'S1', 'active', 'full_time', '2024-01-15', 28000, 'SA', '1085564522', '2026-10-23', NULL, NULL, 'male', 'married', 'SA5480000458608010216742', 'Al Rajhi Bank'),
('2024009', 'Muhammad', 'Nabil Abdullah Jambi', 'jambi.mody@hotmail.com', '+9660555526863', 'Finance', 'Cashier', 'J1', 'active', 'full_time', '2024-01-15', 22000, 'SA', '1111411052', '2028-07-08', NULL, NULL, 'male', 'single', 'SA2880000228608010999957', 'Al Rajhi Bank'),
('2024010', 'Khawlah', 'Omar Bin Raziq Harbi', 'khawlah0omar@gmail.com', '+9660557672827', 'Marketing', 'Marketing Specialist', 'S2', 'active', 'full_time', '2024-01-15', 35000, 'SA', '1105538415', '2026-10-13', NULL, NULL, 'female', 'single', 'SA6280000246608016182028', 'Al Rajhi Bank'),
('2024011', 'Ulfah', 'Putri Nastiti', 'ulfahppp@gmail.com', '+966541897060', 'Operations', 'Project Controller', 'S1', 'active', 'full_time', '2024-01-15', 28000, 'ID', '2592214098', '2026-01-05', NULL, NULL, 'female', 'married', 'SA0880000857608014759530', 'Al Rajhi Bank'),
('2024012', 'Raditia', 'Rahman Susanto', 'raditiarahman@gmail.com', '+9660581814874', 'Operations', 'Business Manager', 'M1', 'active', 'full_time', '2024-01-15', 45000, 'ID', '2600880963', '2026-06-03', NULL, NULL, 'male', 'married', 'SA3180000858608018179189', 'Al Rajhi Bank'),
('2025016', 'Abdul', 'Gofur Mahmudin', 'abd.gofur1987@gmail.com', '+9660503547549', 'Administration', 'Kitchen Worker', 'J1', 'active', 'full_time', '2025-01-15', 22000, 'ID', '2554339131', '2025-10-26', NULL, NULL, 'male', 'single', 'SA5680000858608012440801', 'Al Rajhi Bank'),
('2025017', 'Dilal', 'Adlin Fadil', 'kang.dilal@gmail.com', '+628111087621', 'Executive', 'Division Head', 'M2', 'active', 'full_time', '2025-01-15', 40000, 'ID', NULL, NULL, 'E6215502', '2034-01-15', 'male', 'married', NULL, NULL),
('2025018', 'Effat', 'Fuad Muhammad Sholeh Minkabau', 'minkaboeffat@gmail.com', '+9660536972158', 'Administration', 'Administrative Assistant', 'J1', 'active', 'full_time', '2025-01-15', 22000, 'SA', '1129663520', '2025-05-23', NULL, NULL, 'female', 'single', 'SA90080000246608010904724', 'Al Rajhi Bank'),
('2025020', 'Myar', 'Mahdi Bin Zainab Qorut', 'PeyrMu@hotmail.com', '+9660537976079', 'Administration', 'Data Entry Clerk', 'J1', 'active', 'full_time', '2025-01-15', 22000, 'SA', '1121683625', '2028-05-20', NULL, NULL, 'female', 'single', 'SA8680000103608016076032', 'Al Rajhi Bank'),
('2025021', 'Raghad', 'Alo Husna Alotaibi', 'raghad.alotaibi2002@gmail.com', '+9660563770074', 'Finance', 'Accountant', 'S1', 'active', 'full_time', '2025-01-15', 28000, 'SA', '1119123659', '2028-05-21', NULL, NULL, 'female', 'single', 'SA7380000103608016098382', 'Al Rajhi Bank')
ON CONFLICT (employee_id) DO NOTHING;

-- Attendance Records (Today)
INSERT INTO hcms_attendance (employee_id, employee_code, employee_name, date, check_in, check_out, status, work_hours, late_minutes, check_in_location) VALUES
((SELECT id FROM hcms_employees WHERE employee_id = '2024001'), '2024001', 'Sidiq Haryono', CURRENT_DATE, '08:00', '17:00', 'present', 9, 0, 'Office'),
((SELECT id FROM hcms_employees WHERE employee_id = '2024002'), '2024002', 'Iman Nimatullah Muhdi', CURRENT_DATE, '08:10', '17:30', 'present', 9.33, 10, 'Office'),
((SELECT id FROM hcms_employees WHERE employee_id = '2024003'), '2024003', 'Mujiburahman Yaqub Abdurahman', CURRENT_DATE, '08:00', '17:00', 'present', 9, 0, 'Office'),
((SELECT id FROM hcms_employees WHERE employee_id = '2024004'), '2024004', 'Zoehelmy Husen Muhammad Husen', CURRENT_DATE, '07:55', '17:15', 'present', 9.33, 0, 'Office'),
((SELECT id FROM hcms_employees WHERE employee_id = '2024005'), '2024005', 'Ibrahim Mohmmed Yasin Abdulghani', CURRENT_DATE, '09:15', '18:00', 'late', 8.75, 75, 'Office'),
((SELECT id FROM hcms_employees WHERE employee_id = '2024006'), '2024006', 'Karimah Abdulkhoir', CURRENT_DATE, '08:05', '17:00', 'present', 8.92, 5, 'Office'),
((SELECT id FROM hcms_employees WHERE employee_id = '2024007'), '2024007', 'Nebras Faishal Bin Abdul Aziz Maas', CURRENT_DATE, '08:00', '17:00', 'present', 9, 0, 'Office'),
((SELECT id FROM hcms_employees WHERE employee_id = '2024008'), '2024008', 'Samer Sholeh Bin Muhamad Thoyib Kamfar', CURRENT_DATE, NULL, NULL, 'leave', NULL, NULL, NULL),
((SELECT id FROM hcms_employees WHERE employee_id = '2024009'), '2024009', 'Muhammad Nabil Abdullah Jambi', CURRENT_DATE, '08:00', '17:00', 'present', 9, 0, 'Office'),
((SELECT id FROM hcms_employees WHERE employee_id = '2024010'), '2024010', 'Khawlah Omar Bin Raziq Harbi', CURRENT_DATE, '08:20', '17:30', 'late', 9.17, 20, 'Office'),
((SELECT id FROM hcms_employees WHERE employee_id = '2024011'), '2024011', 'Ulfah Putri Nastiti', CURRENT_DATE, '08:00', '17:00', 'present', 9, 0, 'Office'),
((SELECT id FROM hcms_employees WHERE employee_id = '2024012'), '2024012', 'Raditia Rahman Susanto', CURRENT_DATE, '08:00', '17:00', 'present', 9, 0, 'Office'),
((SELECT id FROM hcms_employees WHERE employee_id = '2025016'), '2025016', 'Abdul Gofur Mahmudin', CURRENT_DATE, '06:00', '14:00', 'present', 8, 0, 'Kitchen'),
((SELECT id FROM hcms_employees WHERE employee_id = '2025017'), '2025017', 'Dilal Adlin Fadil', CURRENT_DATE, NULL, NULL, 'absent', NULL, NULL, NULL),
((SELECT id FROM hcms_employees WHERE employee_id = '2025018'), '2025018', 'Effat Fuad Muhammad Sholeh Minkabau', CURRENT_DATE, '08:00', '17:00', 'present', 9, 0, 'Office'),
((SELECT id FROM hcms_employees WHERE employee_id = '2025020'), '2025020', 'Myar Mahdi Bin Zainab Qorut', CURRENT_DATE, '08:00', '17:00', 'present', 9, 0, 'Office'),
((SELECT id FROM hcms_employees WHERE employee_id = '2025021'), '2025021', 'Raghad Alo Husna Alotaibi', CURRENT_DATE, '08:00', '17:00', 'present', 9, 0, 'Office')
ON CONFLICT (employee_id, date) DO NOTHING;

-- Leave Requests
INSERT INTO hcms_leave_requests (employee_id, employee_code, employee_name, leave_type_id, leave_type, start_date, end_date, days, reason, status, approved_by, approved_at) VALUES
((SELECT id FROM hcms_employees WHERE employee_id = '2024008'), '2024008', 'Samer Sholeh Bin Muhamad Thoyib Kamfar', (SELECT id FROM hcms_leave_types WHERE name = 'Annual Leave'), 'Annual Leave', CURRENT_DATE, CURRENT_DATE + 3, 4, 'Family visit', 'approved', 'Sidiq Haryono', NOW() - INTERVAL '3 days'),
((SELECT id FROM hcms_employees WHERE employee_id = '2024006'), '2024006', 'Karimah Abdulkhoir', (SELECT id FROM hcms_leave_types WHERE name = 'Annual Leave'), 'Annual Leave', CURRENT_DATE + 14, CURRENT_DATE + 18, 5, 'Personal travel', 'pending', NULL, NULL),
((SELECT id FROM hcms_employees WHERE employee_id = '2024003'), '2024003', 'Mujiburahman Yaqub Abdurahman', (SELECT id FROM hcms_leave_types WHERE name = 'Sick Leave'), 'Sick Leave', CURRENT_DATE - 5, CURRENT_DATE - 4, 2, 'Medical treatment', 'approved', 'Sidiq Haryono', NOW() - INTERVAL '6 days'),
((SELECT id FROM hcms_employees WHERE employee_id = '2024004'), '2024004', 'Zoehelmy Husen Muhammad Husen', (SELECT id FROM hcms_leave_types WHERE name = 'Hajj Leave'), 'Hajj Leave', '2025-06-01', '2025-06-15', 15, 'Hajj pilgrimage', 'approved', 'Sidiq Haryono', NOW() - INTERVAL '30 days');

-- Payroll Periods (keep existing)
INSERT INTO hcms_payroll_periods (period_code, year, month, start_date, end_date, status, paid_at) VALUES
('2025-01', 2025, 1, '2025-01-01', '2025-01-31', 'paid', '2025-01-28'),
('2024-12', 2024, 12, '2024-12-01', '2024-12-31', 'paid', '2024-12-28'),
('2024-11', 2024, 11, '2024-11-01', '2024-11-30', 'paid', '2024-11-28')
ON CONFLICT (period_code) DO NOTHING;

-- Payroll Records (January 2025)
INSERT INTO hcms_payroll_records (employee_id, employee_code, employee_name, period_id, period, basic_salary, housing_allowance, transport_allowance, other_allowances, overtime_pay, gosi_employee, gosi_employer, net_salary, status, payment_date)
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
  e.salary * 0.0975,
  e.salary * 0.12,
  e.salary + (e.salary * 0.25) + 2000 + 1000 - (e.salary * 0.0975),
  'paid',
  '2025-01-28'
FROM hcms_employees e
WHERE e.employee_id LIKE '2024%' OR e.employee_id LIKE '2025%';

-- Job Postings
INSERT INTO hcms_job_postings (job_code, position, department, description, requirements, employment_type, salary_min, salary_max, currency, status, posted_date, closing_date, hiring_manager) VALUES
('JOB-2025-001', 'IT Support Specialist', 'Information Technology', 'Provide technical support for office systems and infrastructure.', 'Bachelor in IT/CS, 2+ years experience, Arabic & English', 'full_time', 25000, 35000, 'SAR', 'open', CURRENT_DATE - 10, CURRENT_DATE + 20, 'Sidiq Haryono'),
('JOB-2025-002', 'Hajj Operations Coordinator', 'Operations', 'Coordinate Hajj and Umrah operations and pilgrim services.', 'Bachelor degree, 3+ years Hajj/Umrah experience, fluent Arabic', 'full_time', 30000, 40000, 'SAR', 'open', CURRENT_DATE - 5, CURRENT_DATE + 25, 'Zoehelmy Husen Muhammad Husen'),
('JOB-2025-003', 'Junior Accountant', 'Finance', 'Support accounting operations and financial reporting.', 'Bachelor in Accounting, fresh graduate welcome, SOCPA preferred', 'full_time', 18000, 25000, 'SAR', 'screening', CURRENT_DATE - 15, CURRENT_DATE + 15, 'Mujiburahman Yaqub Abdurahman')
ON CONFLICT (job_code) DO NOTHING;

-- Candidates
INSERT INTO hcms_candidates (job_posting_id, first_name, last_name, email, phone, resume_url, status, score, interview_notes) VALUES
((SELECT id FROM hcms_job_postings WHERE job_code = 'JOB-2025-001'), 'Ahmed', 'Al-Mutairi', 'ahmed.mutairi@email.com', '+966551234567', '/resumes/ahmed_mutairi.pdf', 'interview', 82, 'Strong technical skills'),
((SELECT id FROM hcms_job_postings WHERE job_code = 'JOB-2025-002'), 'Fatimah', 'Al-Dosari', 'fatimah.dosari@email.com', '+966552345678', '/resumes/fatimah_dosari.pdf', 'screening', 75, 'Good Hajj experience'),
((SELECT id FROM hcms_job_postings WHERE job_code = 'JOB-2025-003'), 'Omar', 'Baswedan', 'omar.baswedan@email.com', '+966553456789', '/resumes/omar_baswedan.pdf', 'interview', 88, 'SOCPA certified');

-- Performance Cycles
INSERT INTO hcms_performance_cycles (name, year, type, start_date, end_date, status) VALUES
('2024 Annual Review', 2024, 'annual', '2024-01-01', '2024-12-31', 'completed'),
('2025 Annual Review', 2025, 'annual', '2025-01-01', '2025-12-31', 'active')
ON CONFLICT DO NOTHING;

-- Performance Reviews
INSERT INTO hcms_performance_reviews (employee_id, employee_name, period, cycle_id, reviewer_id, reviewer_name, overall_score, rating, status, achievements, submitted_at, acknowledged_at) VALUES
((SELECT id FROM hcms_employees WHERE employee_id = '2024003'), 'Mujiburahman Yaqub Abdurahman', '2024', (SELECT id FROM hcms_performance_cycles WHERE name = '2024 Annual Review'), (SELECT id FROM hcms_employees WHERE employee_id = '2024001'), 'Sidiq Haryono', 4.2, 'exceeds', 'acknowledged', 'Excellent financial reporting accuracy', NOW() - INTERVAL '15 days', NOW() - INTERVAL '8 days'),
((SELECT id FROM hcms_employees WHERE employee_id = '2024004'), 'Zoehelmy Husen Muhammad Husen', '2024', (SELECT id FROM hcms_performance_cycles WHERE name = '2024 Annual Review'), (SELECT id FROM hcms_employees WHERE employee_id = '2024001'), 'Sidiq Haryono', 4.5, 'exceeds', 'acknowledged', 'Outstanding Hajj operations management', NOW() - INTERVAL '12 days', NOW() - INTERVAL '5 days'),
((SELECT id FROM hcms_employees WHERE employee_id = '2024010'), 'Khawlah Omar Bin Raziq Harbi', '2024', (SELECT id FROM hcms_performance_cycles WHERE name = '2024 Annual Review'), (SELECT id FROM hcms_employees WHERE employee_id = '2024001'), 'Sidiq Haryono', 4.0, 'meets', 'submitted', 'Good marketing campaign results', NOW() - INTERVAL '10 days', NULL);

-- KPIs
INSERT INTO hcms_kpis (employee_id, employee_name, period, kpi_name, description, target, actual, weight, unit, category) VALUES
((SELECT id FROM hcms_employees WHERE employee_id = '2024001'), 'Sidiq Haryono', '2025', 'Revenue Growth', 'Achieve annual revenue target', 20, 22, 30, 'percentage', 'quantitative'),
((SELECT id FROM hcms_employees WHERE employee_id = '2024001'), 'Sidiq Haryono', '2025', 'Cost Efficiency', 'Maintain operational cost within budget', 95, 97, 20, 'percentage', 'quantitative'),
((SELECT id FROM hcms_employees WHERE employee_id = '2024004'), 'Zoehelmy Husen Muhammad Husen', '2025', 'Pilgrim Satisfaction', 'Customer satisfaction score', 90, 92, 40, 'percentage', 'quantitative'),
((SELECT id FROM hcms_employees WHERE employee_id = '2024003'), 'Mujiburahman Yaqub Abdurahman', '2025', 'Report Accuracy', 'Financial report accuracy rate', 99, 99.5, 40, 'percentage', 'quantitative');

-- Training Courses
INSERT INTO hcms_training_courses (code, title, description, type, category, provider, start_date, end_date, duration_hours, location, max_participants, enrolled, status) VALUES
('TRN-2025-001', 'Hajj Operations Excellence', 'Advanced training for Hajj and Umrah operations', 'internal', 'mandatory', 'BPKH Academy', CURRENT_DATE + 14, CURRENT_DATE + 16, 24, 'Training Room A', 20, 15, 'upcoming'),
('TRN-2025-002', 'Islamic Finance Principles', 'Fundamentals of Islamic banking and finance', 'internal', 'mandatory', 'BPKH Academy', CURRENT_DATE + 7, CURRENT_DATE + 8, 16, 'Training Room B', 25, 17, 'upcoming'),
('TRN-2025-003', 'Arabic Business Communication', 'Professional Arabic for business', 'external', 'soft_skills', 'Saudi Language Institute', CURRENT_DATE - 5, CURRENT_DATE + 25, 30, 'Online', 15, 12, 'ongoing')
ON CONFLICT (code) DO NOTHING;

-- Training Enrollments
INSERT INTO hcms_training_enrollments (course_id, employee_id, employee_name, status, enrolled_at, completed_at, score, certificate_url) VALUES
((SELECT id FROM hcms_training_courses WHERE code = 'TRN-2025-002'), (SELECT id FROM hcms_employees WHERE employee_id = '2024003'), 'Mujiburahman Yaqub Abdurahman', 'enrolled', NOW() - INTERVAL '5 days', NULL, NULL, NULL),
((SELECT id FROM hcms_training_courses WHERE code = 'TRN-2025-002'), (SELECT id FROM hcms_employees WHERE employee_id = '2025021'), 'Raghad Alo Husna Alotaibi', 'enrolled', NOW() - INTERVAL '5 days', NULL, NULL, NULL),
((SELECT id FROM hcms_training_courses WHERE code = 'TRN-2025-003'), (SELECT id FROM hcms_employees WHERE employee_id = '2024006'), 'Karimah Abdulkhoir', 'enrolled', NOW() - INTERVAL '10 days', NULL, NULL, NULL),
((SELECT id FROM hcms_training_courses WHERE code = 'TRN-2025-001'), (SELECT id FROM hcms_employees WHERE employee_id = '2024004'), 'Zoehelmy Husen Muhammad Husen', 'enrolled', NOW() - INTERVAL '3 days', NULL, NULL, NULL);

-- Compliance Alerts (based on actual ID expiry dates)
INSERT INTO hcms_compliance_alerts (employee_id, employee_name, alert_type, expiry_date, days_remaining, severity, status, notes) VALUES
((SELECT id FROM hcms_employees WHERE employee_id = '2025018'), 'Effat Fuad Muhammad Sholeh Minkabau', 'iqamah_expiry', '2025-05-23', 116, 'warning', 'active', 'National ID expiring in 4 months'),
((SELECT id FROM hcms_employees WHERE employee_id = '2024005'), 'Ibrahim Mohmmed Yasin Abdulghani', 'iqamah_expiry', '2025-06-11', 135, 'info', 'active', 'Iqama renewal needed'),
((SELECT id FROM hcms_employees WHERE employee_id = '2024006'), 'Karimah Abdulkhoir', 'iqamah_expiry', '2025-07-23', 177, 'info', 'active', 'Plan iqama renewal'),
((SELECT id FROM hcms_employees WHERE employee_id = '2024003'), 'Mujiburahman Yaqub Abdurahman', 'iqamah_expiry', '2025-08-07', 192, 'info', 'active', 'Iqama renewal planning'),
((SELECT id FROM hcms_employees WHERE employee_id = '2024001'), 'Sidiq Haryono', 'iqamah_expiry', '2025-10-06', 252, 'info', 'active', 'GM iqama renewal due'),
((SELECT id FROM hcms_employees WHERE employee_id = '2024002'), 'Iman Nimatullah Muhdi', 'iqamah_expiry', '2025-10-06', 252, 'info', 'active', 'GM iqama renewal due'),
((SELECT id FROM hcms_employees WHERE employee_id = '2025016'), 'Abdul Gofur Mahmudin', 'iqamah_expiry', '2025-10-26', 272, 'info', 'active', 'Iqama renewal planning');

-- Update UserContext with real employee names
-- Note: Run this after inserting employees to update the role dropdown
