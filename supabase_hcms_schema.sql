-- BPKH Limited - HCMS (Human Capital Management System) Schema
-- Run this in Supabase SQL Editor

-- ==================== DEPARTMENTS ====================
CREATE TABLE IF NOT EXISTS hcms_departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    name_ar TEXT,
    parent_id UUID REFERENCES hcms_departments(id),
    head_employee_id UUID,
    budget DECIMAL(18,2),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== EMPLOYEES ====================
CREATE TABLE IF NOT EXISTS hcms_employees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id TEXT UNIQUE NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    first_name_ar TEXT,
    last_name_ar TEXT,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    personal_email TEXT,
    date_of_birth DATE,
    gender TEXT CHECK (gender IN ('male', 'female')),
    nationality TEXT,
    marital_status TEXT CHECK (marital_status IN ('single', 'married', 'divorced', 'widowed')),

    -- Employment info
    department_id UUID REFERENCES hcms_departments(id),
    department TEXT,
    position TEXT NOT NULL,
    grade TEXT,
    employment_type TEXT DEFAULT 'full_time' CHECK (employment_type IN ('full_time', 'part_time', 'contract', 'intern')),
    employment_status TEXT DEFAULT 'active' CHECK (employment_status IN ('active', 'probation', 'notice', 'terminated', 'resigned', 'suspended')),
    hire_date DATE NOT NULL,
    confirmation_date DATE,
    termination_date DATE,
    termination_reason TEXT,

    -- Compensation
    salary DECIMAL(18,2),
    currency TEXT DEFAULT 'SAR',
    bank_name TEXT,
    bank_account TEXT,
    iban TEXT,

    -- Documents (Saudi specific)
    iqamah_number TEXT,
    iqamah_expiry DATE,
    visa_number TEXT,
    visa_expiry DATE,
    passport_number TEXT,
    passport_expiry DATE,
    work_permit_number TEXT,
    work_permit_expiry DATE,

    -- Manager
    reports_to UUID REFERENCES hcms_employees(id),

    -- Metadata
    photo_url TEXT,
    address TEXT,
    emergency_contact_name TEXT,
    emergency_contact_phone TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== ATTENDANCE ====================
CREATE TABLE IF NOT EXISTS hcms_attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID REFERENCES hcms_employees(id) ON DELETE CASCADE,
    employee_code TEXT NOT NULL,
    employee_name TEXT,
    date DATE NOT NULL,
    check_in TIME,
    check_out TIME,
    check_in_location TEXT,
    check_out_location TEXT,
    work_hours DECIMAL(4,2),
    overtime_hours DECIMAL(4,2) DEFAULT 0,
    status TEXT DEFAULT 'present' CHECK (status IN ('present', 'absent', 'late', 'half_day', 'leave', 'holiday', 'weekend')),
    late_minutes INTEGER DEFAULT 0,
    early_leave_minutes INTEGER DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(employee_id, date)
);

-- ==================== LEAVE MANAGEMENT ====================
CREATE TABLE IF NOT EXISTS hcms_leave_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    name_ar TEXT,
    days_allowed INTEGER,
    is_paid BOOLEAN DEFAULT true,
    requires_approval BOOLEAN DEFAULT true,
    requires_document BOOLEAN DEFAULT false,
    applicable_gender TEXT CHECK (applicable_gender IN ('all', 'male', 'female')),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS hcms_leave_balances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID REFERENCES hcms_employees(id) ON DELETE CASCADE,
    leave_type_id UUID REFERENCES hcms_leave_types(id),
    leave_type TEXT NOT NULL,
    year INTEGER NOT NULL,
    entitled_days DECIMAL(5,2) NOT NULL,
    used_days DECIMAL(5,2) DEFAULT 0,
    pending_days DECIMAL(5,2) DEFAULT 0,
    carried_forward DECIMAL(5,2) DEFAULT 0,
    remaining_days DECIMAL(5,2) GENERATED ALWAYS AS (entitled_days + carried_forward - used_days - pending_days) STORED,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(employee_id, leave_type, year)
);

CREATE TABLE IF NOT EXISTS hcms_leave_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID REFERENCES hcms_employees(id) ON DELETE CASCADE,
    employee_code TEXT NOT NULL,
    employee_name TEXT NOT NULL,
    leave_type_id UUID REFERENCES hcms_leave_types(id),
    leave_type TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    days DECIMAL(5,2) NOT NULL,
    reason TEXT,
    document_url TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled')),
    approved_by TEXT,
    approved_by_id UUID REFERENCES hcms_employees(id),
    approved_at TIMESTAMPTZ,
    rejected_by TEXT,
    rejected_at TIMESTAMPTZ,
    rejection_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== PAYROLL ====================
CREATE TABLE IF NOT EXISTS hcms_payroll_periods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    period_code TEXT UNIQUE NOT NULL,
    year INTEGER NOT NULL,
    month INTEGER NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'processing', 'approved', 'paid', 'closed')),
    processed_by TEXT,
    processed_at TIMESTAMPTZ,
    approved_by TEXT,
    approved_at TIMESTAMPTZ,
    paid_at TIMESTAMPTZ,
    total_gross DECIMAL(18,2),
    total_deductions DECIMAL(18,2),
    total_net DECIMAL(18,2),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS hcms_payroll_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    period_id UUID REFERENCES hcms_payroll_periods(id),
    employee_id UUID REFERENCES hcms_employees(id) ON DELETE CASCADE,
    employee_code TEXT NOT NULL,
    employee_name TEXT NOT NULL,
    period TEXT NOT NULL,

    -- Earnings
    basic_salary DECIMAL(18,2) NOT NULL,
    housing_allowance DECIMAL(18,2) DEFAULT 0,
    transport_allowance DECIMAL(18,2) DEFAULT 0,
    food_allowance DECIMAL(18,2) DEFAULT 0,
    other_allowances DECIMAL(18,2) DEFAULT 0,
    overtime_pay DECIMAL(18,2) DEFAULT 0,
    bonus DECIMAL(18,2) DEFAULT 0,
    gross_salary DECIMAL(18,2) GENERATED ALWAYS AS (
        basic_salary + housing_allowance + transport_allowance + food_allowance +
        other_allowances + overtime_pay + bonus
    ) STORED,

    -- Deductions
    gosi_employee DECIMAL(18,2) DEFAULT 0,
    gosi_employer DECIMAL(18,2) DEFAULT 0,
    tax DECIMAL(18,2) DEFAULT 0,
    loan_deduction DECIMAL(18,2) DEFAULT 0,
    other_deductions DECIMAL(18,2) DEFAULT 0,
    total_deductions DECIMAL(18,2) GENERATED ALWAYS AS (
        gosi_employee + tax + loan_deduction + other_deductions
    ) STORED,

    -- Net
    net_salary DECIMAL(18,2),

    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'processing', 'approved', 'paid')),
    payment_date DATE,
    payment_reference TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(period_id, employee_id)
);

-- Legacy support column (if pages use 'allowances' and 'deductions')
ALTER TABLE hcms_payroll_records ADD COLUMN IF NOT EXISTS allowances DECIMAL(18,2) DEFAULT 0;
ALTER TABLE hcms_payroll_records ADD COLUMN IF NOT EXISTS deductions DECIMAL(18,2) DEFAULT 0;
ALTER TABLE hcms_payroll_records ADD COLUMN IF NOT EXISTS gosi DECIMAL(18,2) DEFAULT 0;

-- ==================== RECRUITMENT ====================
CREATE TABLE IF NOT EXISTS hcms_job_postings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_code TEXT UNIQUE,
    position TEXT NOT NULL,
    department_id UUID REFERENCES hcms_departments(id),
    department TEXT,
    description TEXT,
    requirements TEXT,
    employment_type TEXT DEFAULT 'full_time',
    experience_years INTEGER,
    education_level TEXT,
    salary_min DECIMAL(18,2),
    salary_max DECIMAL(18,2),
    currency TEXT DEFAULT 'SAR',
    location TEXT,
    vacancies INTEGER DEFAULT 1,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'open', 'screening', 'interviewing', 'offer', 'filled', 'closed', 'cancelled')),
    posted_date DATE,
    closing_date DATE,
    hiring_manager_id UUID REFERENCES hcms_employees(id),
    hiring_manager TEXT,
    applicants INTEGER DEFAULT 0,
    shortlisted INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS hcms_candidates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_posting_id UUID REFERENCES hcms_job_postings(id) ON DELETE CASCADE,
    recruitment_id TEXT,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    name TEXT GENERATED ALWAYS AS (first_name || ' ' || last_name) STORED,
    email TEXT NOT NULL,
    phone TEXT,
    nationality TEXT,
    current_company TEXT,
    current_position TEXT,
    experience_years INTEGER,
    expected_salary DECIMAL(18,2),
    resume_url TEXT,
    cover_letter TEXT,
    source TEXT,
    status TEXT DEFAULT 'applied' CHECK (status IN ('applied', 'screening', 'interview', 'assessment', 'offer', 'hired', 'rejected', 'withdrawn')),
    score INTEGER,
    interview_date TIMESTAMPTZ,
    interviewer_id UUID REFERENCES hcms_employees(id),
    interview_notes TEXT,
    offer_salary DECIMAL(18,2),
    offer_date DATE,
    offer_status TEXT CHECK (offer_status IN ('pending', 'accepted', 'rejected', 'negotiating')),
    rejection_reason TEXT,
    applied_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== PERFORMANCE ====================
CREATE TABLE IF NOT EXISTS hcms_performance_cycles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    year INTEGER NOT NULL,
    type TEXT CHECK (type IN ('annual', 'mid_year', 'quarterly', 'probation')),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'review', 'completed', 'closed')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS hcms_performance_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cycle_id UUID REFERENCES hcms_performance_cycles(id),
    employee_id UUID REFERENCES hcms_employees(id) ON DELETE CASCADE,
    employee_code TEXT,
    employee_name TEXT NOT NULL,
    period TEXT NOT NULL,
    review_type TEXT DEFAULT 'annual' CHECK (review_type IN ('annual', 'mid_year', 'quarterly', 'probation')),

    -- Scores
    overall_score DECIMAL(3,2),
    self_score DECIMAL(3,2),
    manager_score DECIMAL(3,2),
    rating TEXT CHECK (rating IN ('exceptional', 'exceeds', 'meets', 'below', 'unsatisfactory')),

    -- Reviewer
    reviewer_id UUID REFERENCES hcms_employees(id),
    reviewer_name TEXT,

    -- Content
    achievements TEXT,
    areas_for_improvement TEXT,
    goals_next_period TEXT,
    comments TEXT,
    employee_comments TEXT,

    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'self_review', 'manager_review', 'submitted', 'acknowledged', 'completed')),
    submitted_at TIMESTAMPTZ,
    acknowledged_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS hcms_kpis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    review_id UUID REFERENCES hcms_performance_reviews(id) ON DELETE CASCADE,
    employee_id UUID REFERENCES hcms_employees(id) ON DELETE CASCADE,
    employee_name TEXT,
    period TEXT,
    kpi_name TEXT NOT NULL,
    description TEXT,
    category TEXT CHECK (category IN ('quantitative', 'qualitative', 'behavioral')),
    target DECIMAL(10,2),
    actual DECIMAL(10,2),
    unit TEXT,
    weight DECIMAL(5,2) DEFAULT 0,
    score DECIMAL(5,2),
    comments TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== TRAINING ====================
CREATE TABLE IF NOT EXISTS hcms_training_courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE,
    title TEXT NOT NULL,
    description TEXT,
    type TEXT CHECK (type IN ('internal', 'external', 'online', 'workshop', 'certification')),
    category TEXT CHECK (category IN ('mandatory', 'technical', 'soft_skills', 'leadership', 'compliance', 'other')),
    provider TEXT,
    instructor TEXT,
    location TEXT,
    is_virtual BOOLEAN DEFAULT false,
    virtual_link TEXT,
    start_date DATE,
    end_date DATE,
    duration_hours DECIMAL(6,2),
    max_participants INTEGER,
    enrolled INTEGER DEFAULT 0,
    cost_per_person DECIMAL(18,2),
    currency TEXT DEFAULT 'SAR',
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'upcoming', 'ongoing', 'completed', 'cancelled')),
    materials_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS hcms_training_enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES hcms_training_courses(id) ON DELETE CASCADE,
    training_id TEXT,
    employee_id UUID REFERENCES hcms_employees(id) ON DELETE CASCADE,
    employee_code TEXT,
    employee_name TEXT NOT NULL,
    status TEXT DEFAULT 'enrolled' CHECK (status IN ('enrolled', 'attended', 'completed', 'failed', 'cancelled', 'no_show')),
    attendance_percentage DECIMAL(5,2),
    score DECIMAL(5,2),
    grade TEXT,
    certificate_url TEXT,
    feedback TEXT,
    enrolled_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(course_id, employee_id)
);

-- ==================== COMPLIANCE ====================
CREATE TABLE IF NOT EXISTS hcms_compliance_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID REFERENCES hcms_employees(id) ON DELETE CASCADE,
    employee_name TEXT,
    document_type TEXT CHECK (document_type IN ('iqamah', 'visa', 'passport', 'work_permit', 'medical', 'contract', 'nda', 'other')),
    document_number TEXT,
    issue_date DATE,
    expiry_date DATE,
    issuing_authority TEXT,
    document_url TEXT,
    status TEXT DEFAULT 'valid' CHECK (status IN ('valid', 'expiring', 'expired', 'pending_renewal')),
    renewal_status TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS hcms_compliance_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID REFERENCES hcms_employees(id) ON DELETE CASCADE,
    employee_code TEXT,
    employee_name TEXT NOT NULL,
    alert_type TEXT CHECK (alert_type IN ('iqamah_expiry', 'visa_expiry', 'passport_expiry', 'work_permit_expiry', 'contract_expiry', 'medical_expiry', 'probation_end', 'other')),
    document_id UUID REFERENCES hcms_compliance_documents(id),
    expiry_date DATE NOT NULL,
    days_remaining INTEGER,
    severity TEXT CHECK (severity IN ('info', 'warning', 'critical')),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'acknowledged', 'resolved', 'dismissed')),
    resolved_by TEXT,
    resolved_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS hcms_disciplinary_actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID REFERENCES hcms_employees(id) ON DELETE CASCADE,
    employee_code TEXT,
    employee_name TEXT NOT NULL,
    case_type TEXT CHECK (case_type IN ('verbal_warning', 'written_warning', 'final_warning', 'suspension', 'termination', 'other')),
    severity TEXT CHECK (severity IN ('minor', 'moderate', 'major', 'gross')),
    category TEXT,
    description TEXT NOT NULL,
    incident_date DATE,
    reported_by TEXT,
    reported_by_id UUID REFERENCES hcms_employees(id),
    investigated_by TEXT,
    action_taken TEXT,
    action_date DATE,
    appeal_deadline DATE,
    appeal_status TEXT CHECK (appeal_status IN ('none', 'pending', 'upheld', 'overturned')),
    status TEXT DEFAULT 'reported' CHECK (status IN ('reported', 'investigating', 'pending_action', 'action_taken', 'appealed', 'resolved', 'closed')),
    resolution TEXT,
    resolved_at TIMESTAMPTZ,
    documents_url TEXT[],
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== INDEXES ====================
CREATE INDEX IF NOT EXISTS idx_hcms_employees_department ON hcms_employees(department);
CREATE INDEX IF NOT EXISTS idx_hcms_employees_status ON hcms_employees(employment_status);
CREATE INDEX IF NOT EXISTS idx_hcms_employees_iqamah_expiry ON hcms_employees(iqamah_expiry);
CREATE INDEX IF NOT EXISTS idx_hcms_employees_visa_expiry ON hcms_employees(visa_expiry);

CREATE INDEX IF NOT EXISTS idx_hcms_attendance_date ON hcms_attendance(date);
CREATE INDEX IF NOT EXISTS idx_hcms_attendance_employee ON hcms_attendance(employee_id, date);
CREATE INDEX IF NOT EXISTS idx_hcms_attendance_status ON hcms_attendance(status);

CREATE INDEX IF NOT EXISTS idx_hcms_leave_requests_status ON hcms_leave_requests(status);
CREATE INDEX IF NOT EXISTS idx_hcms_leave_requests_employee ON hcms_leave_requests(employee_id);
CREATE INDEX IF NOT EXISTS idx_hcms_leave_requests_dates ON hcms_leave_requests(start_date, end_date);

CREATE INDEX IF NOT EXISTS idx_hcms_payroll_period ON hcms_payroll_records(period);
CREATE INDEX IF NOT EXISTS idx_hcms_payroll_status ON hcms_payroll_records(status);

CREATE INDEX IF NOT EXISTS idx_hcms_jobs_status ON hcms_job_postings(status);
CREATE INDEX IF NOT EXISTS idx_hcms_candidates_status ON hcms_candidates(status);
CREATE INDEX IF NOT EXISTS idx_hcms_candidates_job ON hcms_candidates(job_posting_id);

CREATE INDEX IF NOT EXISTS idx_hcms_reviews_employee ON hcms_performance_reviews(employee_id);
CREATE INDEX IF NOT EXISTS idx_hcms_reviews_period ON hcms_performance_reviews(period);
CREATE INDEX IF NOT EXISTS idx_hcms_kpis_employee ON hcms_kpis(employee_id);

CREATE INDEX IF NOT EXISTS idx_hcms_training_status ON hcms_training_courses(status);
CREATE INDEX IF NOT EXISTS idx_hcms_enrollments_employee ON hcms_training_enrollments(employee_id);

CREATE INDEX IF NOT EXISTS idx_hcms_compliance_expiry ON hcms_compliance_documents(expiry_date);
CREATE INDEX IF NOT EXISTS idx_hcms_alerts_status ON hcms_compliance_alerts(status);
CREATE INDEX IF NOT EXISTS idx_hcms_disciplinary_status ON hcms_disciplinary_actions(status);

-- ==================== ROW LEVEL SECURITY ====================
ALTER TABLE hcms_departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE hcms_employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE hcms_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE hcms_leave_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE hcms_leave_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE hcms_leave_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE hcms_payroll_periods ENABLE ROW LEVEL SECURITY;
ALTER TABLE hcms_payroll_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE hcms_job_postings ENABLE ROW LEVEL SECURITY;
ALTER TABLE hcms_candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE hcms_performance_cycles ENABLE ROW LEVEL SECURITY;
ALTER TABLE hcms_performance_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE hcms_kpis ENABLE ROW LEVEL SECURITY;
ALTER TABLE hcms_training_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE hcms_training_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE hcms_compliance_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE hcms_compliance_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE hcms_disciplinary_actions ENABLE ROW LEVEL SECURITY;

-- ==================== RLS POLICIES (anon access for demo) ====================
CREATE POLICY "anon_all_departments" ON hcms_departments FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all_employees" ON hcms_employees FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all_attendance" ON hcms_attendance FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all_leave_types" ON hcms_leave_types FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all_leave_balances" ON hcms_leave_balances FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all_leave_requests" ON hcms_leave_requests FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all_payroll_periods" ON hcms_payroll_periods FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all_payroll_records" ON hcms_payroll_records FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all_job_postings" ON hcms_job_postings FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all_candidates" ON hcms_candidates FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all_perf_cycles" ON hcms_performance_cycles FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all_perf_reviews" ON hcms_performance_reviews FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all_kpis" ON hcms_kpis FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all_training_courses" ON hcms_training_courses FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all_enrollments" ON hcms_training_enrollments FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all_compliance_docs" ON hcms_compliance_documents FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all_compliance_alerts" ON hcms_compliance_alerts FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all_disciplinary" ON hcms_disciplinary_actions FOR ALL TO anon USING (true) WITH CHECK (true);

-- ==================== TRIGGERS ====================
CREATE TRIGGER update_hcms_departments_updated_at
    BEFORE UPDATE ON hcms_departments FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_hcms_employees_updated_at
    BEFORE UPDATE ON hcms_employees FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_hcms_leave_balances_updated_at
    BEFORE UPDATE ON hcms_leave_balances FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_hcms_leave_requests_updated_at
    BEFORE UPDATE ON hcms_leave_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_hcms_payroll_records_updated_at
    BEFORE UPDATE ON hcms_payroll_records FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_hcms_job_postings_updated_at
    BEFORE UPDATE ON hcms_job_postings FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_hcms_candidates_updated_at
    BEFORE UPDATE ON hcms_candidates FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_hcms_performance_reviews_updated_at
    BEFORE UPDATE ON hcms_performance_reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_hcms_training_courses_updated_at
    BEFORE UPDATE ON hcms_training_courses FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_hcms_compliance_documents_updated_at
    BEFORE UPDATE ON hcms_compliance_documents FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_hcms_disciplinary_actions_updated_at
    BEFORE UPDATE ON hcms_disciplinary_actions FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ==================== HELPER FUNCTIONS ====================

-- Function to get employee headcount by department
CREATE OR REPLACE FUNCTION get_headcount_by_department()
RETURNS TABLE (
    department TEXT,
    count BIGINT,
    percentage DECIMAL(5,2)
) AS $$
DECLARE
    total_count BIGINT;
BEGIN
    SELECT COUNT(*) INTO total_count FROM hcms_employees WHERE employment_status = 'active';

    RETURN QUERY
    SELECT
        e.department,
        COUNT(*)::BIGINT as count,
        ROUND((COUNT(*)::DECIMAL / NULLIF(total_count, 0) * 100), 2) as percentage
    FROM hcms_employees e
    WHERE e.employment_status = 'active'
    GROUP BY e.department
    ORDER BY count DESC;
END;
$$ LANGUAGE plpgsql;

-- Function to get attendance summary for a date
CREATE OR REPLACE FUNCTION get_attendance_summary(check_date DATE DEFAULT CURRENT_DATE)
RETURNS TABLE (
    present BIGINT,
    absent BIGINT,
    late BIGINT,
    on_leave BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        COUNT(*) FILTER (WHERE status = 'present')::BIGINT as present,
        COUNT(*) FILTER (WHERE status = 'absent')::BIGINT as absent,
        COUNT(*) FILTER (WHERE status = 'late')::BIGINT as late,
        COUNT(*) FILTER (WHERE status = 'leave')::BIGINT as on_leave
    FROM hcms_attendance
    WHERE date = check_date;
END;
$$ LANGUAGE plpgsql;

-- Function to get expiring documents
CREATE OR REPLACE FUNCTION get_expiring_documents(days_ahead INTEGER DEFAULT 30)
RETURNS TABLE (
    employee_id UUID,
    employee_name TEXT,
    document_type TEXT,
    expiry_date DATE,
    days_remaining INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        e.id,
        e.first_name || ' ' || e.last_name,
        'iqamah'::TEXT,
        e.iqamah_expiry,
        (e.iqamah_expiry - CURRENT_DATE)::INTEGER
    FROM hcms_employees e
    WHERE e.employment_status = 'active'
      AND e.iqamah_expiry IS NOT NULL
      AND e.iqamah_expiry <= CURRENT_DATE + days_ahead

    UNION ALL

    SELECT
        e.id,
        e.first_name || ' ' || e.last_name,
        'visa'::TEXT,
        e.visa_expiry,
        (e.visa_expiry - CURRENT_DATE)::INTEGER
    FROM hcms_employees e
    WHERE e.employment_status = 'active'
      AND e.visa_expiry IS NOT NULL
      AND e.visa_expiry <= CURRENT_DATE + days_ahead

    UNION ALL

    SELECT
        e.id,
        e.first_name || ' ' || e.last_name,
        'passport'::TEXT,
        e.passport_expiry,
        (e.passport_expiry - CURRENT_DATE)::INTEGER
    FROM hcms_employees e
    WHERE e.employment_status = 'active'
      AND e.passport_expiry IS NOT NULL
      AND e.passport_expiry <= CURRENT_DATE + days_ahead

    ORDER BY days_remaining ASC;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate total payroll for a period
CREATE OR REPLACE FUNCTION get_payroll_summary(period_code TEXT)
RETURNS TABLE (
    total_employees BIGINT,
    total_gross DECIMAL(18,2),
    total_deductions DECIMAL(18,2),
    total_net DECIMAL(18,2),
    total_gosi DECIMAL(18,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        COUNT(*)::BIGINT,
        SUM(gross_salary),
        SUM(total_deductions),
        SUM(net_salary),
        SUM(gosi_employee + gosi_employer)
    FROM hcms_payroll_records
    WHERE period = period_code;
END;
$$ LANGUAGE plpgsql;

-- ==================== INSERT DEFAULT DATA ====================

-- Insert default leave types
INSERT INTO hcms_leave_types (code, name, name_ar, days_allowed, is_paid, requires_document, applicable_gender) VALUES
('annual', 'Annual Leave', 'إجازة سنوية', 21, true, false, 'all'),
('sick', 'Sick Leave', 'إجازة مرضية', 30, true, true, 'all'),
('emergency', 'Emergency Leave', 'إجازة طارئة', 5, true, false, 'all'),
('unpaid', 'Unpaid Leave', 'إجازة بدون راتب', NULL, false, false, 'all'),
('maternity', 'Maternity Leave', 'إجازة أمومة', 70, true, true, 'female'),
('paternity', 'Paternity Leave', 'إجازة أبوة', 3, true, true, 'male'),
('hajj', 'Hajj Leave', 'إجازة حج', 15, true, false, 'all'),
('marriage', 'Marriage Leave', 'إجازة زواج', 5, true, true, 'all'),
('bereavement', 'Bereavement Leave', 'إجازة وفاة', 5, true, false, 'all')
ON CONFLICT (code) DO NOTHING;

-- Insert default departments
INSERT INTO hcms_departments (code, name, name_ar) VALUES
('EXEC', 'Executive', 'التنفيذي'),
('FIN', 'Finance', 'المالية'),
('HR', 'Human Resources', 'الموارد البشرية'),
('IT', 'Information Technology', 'تقنية المعلومات'),
('OPS', 'Operations', 'العمليات'),
('LEGAL', 'Legal', 'الشؤون القانونية'),
('MKT', 'Marketing', 'التسويق'),
('ADMIN', 'Administration', 'الإدارة')
ON CONFLICT (code) DO NOTHING;
