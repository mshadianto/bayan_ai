-- BPKH Limited - LCRMS (Legal, Compliance & Risk Management System) Schema
-- Run this in Supabase SQL Editor after the main schema

-- ==================== CONTRACTS ====================
CREATE TABLE IF NOT EXISTS lcrms_contracts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contract_number TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    type TEXT CHECK (type IN ('pks', 'vendor', 'sewa', 'nda', 'mou', 'other')) NOT NULL,
    partner_name TEXT NOT NULL,
    partner_contact TEXT,
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    value DECIMAL(18,2),
    currency TEXT DEFAULT 'SAR',
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'expiring', 'expired', 'terminated')),
    auto_renewal BOOLEAN DEFAULT false,
    renewal_notice_days INTEGER DEFAULT 30,
    document_url TEXT,
    created_by TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS lcrms_contract_obligations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contract_id UUID REFERENCES lcrms_contracts(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    due_date DATE NOT NULL,
    responsible_party TEXT CHECK (responsible_party IN ('internal', 'partner')) DEFAULT 'internal',
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'overdue')),
    completed_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS lcrms_contract_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contract_id UUID REFERENCES lcrms_contracts(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL,
    changes_summary TEXT,
    document_url TEXT,
    created_by TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== COMPLIANCE ====================
CREATE TABLE IF NOT EXISTS lcrms_licenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    license_number TEXT UNIQUE,
    type TEXT CHECK (type IN ('business', 'operational', 'tax', 'import_export', 'professional', 'other')),
    issuer TEXT NOT NULL,
    issue_date DATE NOT NULL,
    expiry_date DATE NOT NULL,
    status TEXT DEFAULT 'valid' CHECK (status IN ('valid', 'expiring', 'expired', 'renewal_pending')),
    document_url TEXT,
    renewal_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS lcrms_coi_declarations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id TEXT NOT NULL,
    employee_name TEXT NOT NULL,
    department TEXT,
    year INTEGER NOT NULL,
    has_conflict BOOLEAN DEFAULT false,
    conflict_details TEXT,
    declaration_data JSONB,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'submitted', 'approved', 'requires_review')),
    submitted_at TIMESTAMPTZ,
    reviewed_by TEXT,
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(employee_id, year)
);

CREATE TABLE IF NOT EXISTS lcrms_employee_violations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id TEXT NOT NULL,
    employee_name TEXT NOT NULL,
    department TEXT,
    violation_type TEXT CHECK (violation_type IN ('attendance', 'ethics', 'policy', 'performance', 'safety', 'other')),
    description TEXT NOT NULL,
    severity TEXT CHECK (severity IN ('minor', 'moderate', 'major', 'critical')),
    incident_date DATE NOT NULL,
    reported_by TEXT,
    action_taken TEXT,
    action_date DATE,
    status TEXT DEFAULT 'reported' CHECK (status IN ('reported', 'investigating', 'action_taken', 'closed', 'appealed')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== RISK MANAGEMENT ====================
CREATE TABLE IF NOT EXISTS lcrms_risks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    risk_code TEXT UNIQUE,
    division TEXT NOT NULL,
    category TEXT CHECK (category IN ('operational', 'financial', 'legal', 'compliance', 'strategic', 'reputational', 'technology')),
    description TEXT NOT NULL,
    impact INTEGER CHECK (impact BETWEEN 1 AND 5),
    likelihood INTEGER CHECK (likelihood BETWEEN 1 AND 5),
    risk_level TEXT GENERATED ALWAYS AS (
        CASE
            WHEN impact * likelihood >= 15 THEN 'critical'
            WHEN impact * likelihood >= 10 THEN 'high'
            WHEN impact * likelihood >= 5 THEN 'medium'
            ELSE 'low'
        END
    ) STORED,
    mitigation_plan TEXT,
    pic_name TEXT,
    pic_email TEXT,
    target_date DATE,
    status TEXT DEFAULT 'identified' CHECK (status IN ('identified', 'mitigating', 'monitoring', 'closed')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== LITIGATION ====================
CREATE TABLE IF NOT EXISTS lcrms_litigation_cases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_number TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    case_type TEXT CHECK (case_type IN ('litigation', 'arbitration', 'mediation', 'administrative', 'internal')),
    parties_involved JSONB,
    description TEXT,
    court_name TEXT,
    judge_name TEXT,
    filing_date DATE,
    status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'settled', 'won', 'lost', 'appealed', 'closed')),
    priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    estimated_exposure DECIMAL(18,2),
    actual_outcome_amount DECIMAL(18,2),
    external_counsel_id UUID,
    internal_pic TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS lcrms_case_timeline (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id UUID REFERENCES lcrms_litigation_cases(id) ON DELETE CASCADE,
    event_date DATE NOT NULL,
    event_type TEXT CHECK (event_type IN ('filing', 'hearing', 'submission', 'decision', 'appeal', 'settlement', 'other')),
    title TEXT NOT NULL,
    description TEXT,
    outcome TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS lcrms_case_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id UUID REFERENCES lcrms_litigation_cases(id) ON DELETE CASCADE,
    document_name TEXT NOT NULL,
    document_type TEXT,
    document_url TEXT,
    uploaded_by TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS lcrms_case_costs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id UUID REFERENCES lcrms_litigation_cases(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    amount DECIMAL(18,2) NOT NULL,
    currency TEXT DEFAULT 'SAR',
    cost_type TEXT CHECK (cost_type IN ('legal_fee', 'court_fee', 'expert_fee', 'travel', 'settlement', 'other')),
    paid_date DATE,
    paid_to TEXT,
    invoice_number TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS lcrms_external_counsels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    firm_name TEXT NOT NULL,
    contact_person TEXT,
    email TEXT,
    phone TEXT,
    specialization TEXT[],
    hourly_rate DECIMAL(10,2),
    currency TEXT DEFAULT 'SAR',
    rating INTEGER CHECK (rating BETWEEN 1 AND 5),
    total_cases INTEGER DEFAULT 0,
    won_cases INTEGER DEFAULT 0,
    notes TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'blacklisted')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== CORPORATE SECRETARIAL ====================
CREATE TABLE IF NOT EXISTS lcrms_meetings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    meeting_type TEXT CHECK (meeting_type IN ('rups', 'board', 'committee', 'management', 'other')) NOT NULL,
    title TEXT NOT NULL,
    meeting_date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    location TEXT,
    is_virtual BOOLEAN DEFAULT false,
    virtual_link TEXT,
    status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'ongoing', 'completed', 'cancelled')),
    minutes_url TEXT,
    created_by TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS lcrms_meeting_attendees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    meeting_id UUID REFERENCES lcrms_meetings(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    role TEXT,
    attendance_status TEXT CHECK (attendance_status IN ('invited', 'confirmed', 'attended', 'absent', 'excused')),
    notes TEXT
);

CREATE TABLE IF NOT EXISTS lcrms_meeting_agenda (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    meeting_id UUID REFERENCES lcrms_meetings(id) ON DELETE CASCADE,
    order_number INTEGER,
    topic TEXT NOT NULL,
    presenter TEXT,
    duration_minutes INTEGER,
    notes TEXT
);

CREATE TABLE IF NOT EXISTS lcrms_meeting_decisions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    meeting_id UUID REFERENCES lcrms_meetings(id) ON DELETE CASCADE,
    decision_number TEXT,
    description TEXT NOT NULL,
    decision_type TEXT CHECK (decision_type IN ('resolution', 'action_item', 'information', 'deferral')),
    assigned_to TEXT,
    due_date DATE,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled'))
);

CREATE TABLE IF NOT EXISTS lcrms_shareholders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    shareholder_type TEXT CHECK (shareholder_type IN ('individual', 'institution', 'government', 'other')),
    id_number TEXT,
    address TEXT,
    shares BIGINT NOT NULL,
    percentage DECIMAL(5,2),
    share_class TEXT DEFAULT 'common',
    acquisition_date DATE,
    notes TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS lcrms_circular_resolutions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resolution_number TEXT UNIQUE NOT NULL,
    subject TEXT NOT NULL,
    description TEXT,
    proposed_by TEXT,
    proposed_date DATE NOT NULL,
    deadline_date DATE,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'circulating', 'approved', 'rejected', 'expired')),
    required_approvers INTEGER,
    current_approvers INTEGER DEFAULT 0,
    document_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS lcrms_circular_approvals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resolution_id UUID REFERENCES lcrms_circular_resolutions(id) ON DELETE CASCADE,
    approver_name TEXT NOT NULL,
    approver_role TEXT,
    decision TEXT CHECK (decision IN ('approved', 'rejected', 'abstain')),
    comments TEXT,
    decided_at TIMESTAMPTZ,
    UNIQUE(resolution_id, approver_name)
);

-- ==================== LEGAL KNOWLEDGE BASE ====================
CREATE TABLE IF NOT EXISTS lcrms_legal_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    document_type TEXT CHECK (document_type IN ('sk_direksi', 'surat_edaran', 'peraturan_perusahaan', 'uu', 'peraturan_pemerintah', 'fatwa', 'other')),
    document_number TEXT,
    category TEXT,
    issuer TEXT,
    issue_date DATE,
    effective_date DATE,
    summary TEXT,
    content TEXT,
    keywords TEXT[],
    document_url TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'amended', 'revoked')),
    superseded_by UUID REFERENCES lcrms_legal_documents(id),
    embedding vector(1536),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== INDEXES ====================
CREATE INDEX IF NOT EXISTS idx_lcrms_contracts_status ON lcrms_contracts(status);
CREATE INDEX IF NOT EXISTS idx_lcrms_contracts_end_date ON lcrms_contracts(end_date);
CREATE INDEX IF NOT EXISTS idx_lcrms_contracts_type ON lcrms_contracts(type);

CREATE INDEX IF NOT EXISTS idx_lcrms_licenses_expiry ON lcrms_licenses(expiry_date);
CREATE INDEX IF NOT EXISTS idx_lcrms_licenses_status ON lcrms_licenses(status);

CREATE INDEX IF NOT EXISTS idx_lcrms_coi_year ON lcrms_coi_declarations(year);
CREATE INDEX IF NOT EXISTS idx_lcrms_coi_status ON lcrms_coi_declarations(status);

CREATE INDEX IF NOT EXISTS idx_lcrms_risks_level ON lcrms_risks(risk_level);
CREATE INDEX IF NOT EXISTS idx_lcrms_risks_division ON lcrms_risks(division);

CREATE INDEX IF NOT EXISTS idx_lcrms_cases_status ON lcrms_litigation_cases(status);
CREATE INDEX IF NOT EXISTS idx_lcrms_cases_type ON lcrms_litigation_cases(case_type);

CREATE INDEX IF NOT EXISTS idx_lcrms_meetings_date ON lcrms_meetings(meeting_date);
CREATE INDEX IF NOT EXISTS idx_lcrms_meetings_type ON lcrms_meetings(meeting_type);

CREATE INDEX IF NOT EXISTS idx_lcrms_legal_docs_type ON lcrms_legal_documents(document_type);
CREATE INDEX IF NOT EXISTS idx_lcrms_legal_docs_category ON lcrms_legal_documents(category);
CREATE INDEX IF NOT EXISTS idx_lcrms_legal_docs_embedding ON lcrms_legal_documents USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- ==================== ROW LEVEL SECURITY ====================
ALTER TABLE lcrms_contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE lcrms_contract_obligations ENABLE ROW LEVEL SECURITY;
ALTER TABLE lcrms_contract_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE lcrms_licenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE lcrms_coi_declarations ENABLE ROW LEVEL SECURITY;
ALTER TABLE lcrms_employee_violations ENABLE ROW LEVEL SECURITY;
ALTER TABLE lcrms_risks ENABLE ROW LEVEL SECURITY;
ALTER TABLE lcrms_litigation_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE lcrms_case_timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE lcrms_case_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE lcrms_case_costs ENABLE ROW LEVEL SECURITY;
ALTER TABLE lcrms_external_counsels ENABLE ROW LEVEL SECURITY;
ALTER TABLE lcrms_meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE lcrms_meeting_attendees ENABLE ROW LEVEL SECURITY;
ALTER TABLE lcrms_meeting_agenda ENABLE ROW LEVEL SECURITY;
ALTER TABLE lcrms_meeting_decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE lcrms_shareholders ENABLE ROW LEVEL SECURITY;
ALTER TABLE lcrms_circular_resolutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE lcrms_circular_approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE lcrms_legal_documents ENABLE ROW LEVEL SECURITY;

-- ==================== RLS POLICIES (anon access for demo) ====================
-- Contracts
CREATE POLICY "anon_read_contracts" ON lcrms_contracts FOR SELECT TO anon USING (true);
CREATE POLICY "anon_insert_contracts" ON lcrms_contracts FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon_update_contracts" ON lcrms_contracts FOR UPDATE TO anon USING (true);
CREATE POLICY "anon_delete_contracts" ON lcrms_contracts FOR DELETE TO anon USING (true);

CREATE POLICY "anon_all_contract_obligations" ON lcrms_contract_obligations FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all_contract_versions" ON lcrms_contract_versions FOR ALL TO anon USING (true) WITH CHECK (true);

-- Compliance
CREATE POLICY "anon_all_licenses" ON lcrms_licenses FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all_coi" ON lcrms_coi_declarations FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all_violations" ON lcrms_employee_violations FOR ALL TO anon USING (true) WITH CHECK (true);

-- Risk Management
CREATE POLICY "anon_all_risks" ON lcrms_risks FOR ALL TO anon USING (true) WITH CHECK (true);

-- Litigation
CREATE POLICY "anon_all_cases" ON lcrms_litigation_cases FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all_timeline" ON lcrms_case_timeline FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all_case_docs" ON lcrms_case_documents FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all_case_costs" ON lcrms_case_costs FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all_counsels" ON lcrms_external_counsels FOR ALL TO anon USING (true) WITH CHECK (true);

-- Secretarial
CREATE POLICY "anon_all_meetings" ON lcrms_meetings FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all_attendees" ON lcrms_meeting_attendees FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all_agenda" ON lcrms_meeting_agenda FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all_decisions" ON lcrms_meeting_decisions FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all_shareholders" ON lcrms_shareholders FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all_resolutions" ON lcrms_circular_resolutions FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all_approvals" ON lcrms_circular_approvals FOR ALL TO anon USING (true) WITH CHECK (true);

-- Legal Documents
CREATE POLICY "anon_all_legal_docs" ON lcrms_legal_documents FOR ALL TO anon USING (true) WITH CHECK (true);

-- ==================== TRIGGERS ====================
CREATE TRIGGER update_lcrms_contracts_updated_at
    BEFORE UPDATE ON lcrms_contracts FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_lcrms_licenses_updated_at
    BEFORE UPDATE ON lcrms_licenses FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_lcrms_violations_updated_at
    BEFORE UPDATE ON lcrms_employee_violations FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_lcrms_risks_updated_at
    BEFORE UPDATE ON lcrms_risks FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_lcrms_cases_updated_at
    BEFORE UPDATE ON lcrms_litigation_cases FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_lcrms_counsels_updated_at
    BEFORE UPDATE ON lcrms_external_counsels FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_lcrms_meetings_updated_at
    BEFORE UPDATE ON lcrms_meetings FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_lcrms_shareholders_updated_at
    BEFORE UPDATE ON lcrms_shareholders FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_lcrms_resolutions_updated_at
    BEFORE UPDATE ON lcrms_circular_resolutions FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_lcrms_legal_docs_updated_at
    BEFORE UPDATE ON lcrms_legal_documents FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ==================== HELPER FUNCTIONS ====================

-- Function to get expiring contracts
CREATE OR REPLACE FUNCTION get_expiring_contracts(days_ahead INTEGER DEFAULT 90)
RETURNS TABLE (
    id UUID,
    contract_number TEXT,
    name TEXT,
    end_date DATE,
    days_remaining INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        c.id,
        c.contract_number,
        c.name,
        c.end_date,
        (c.end_date - CURRENT_DATE)::INTEGER as days_remaining
    FROM lcrms_contracts c
    WHERE c.status = 'active'
      AND c.end_date <= CURRENT_DATE + days_ahead
    ORDER BY c.end_date ASC;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate risk heatmap
CREATE OR REPLACE FUNCTION get_risk_heatmap()
RETURNS TABLE (
    impact INTEGER,
    likelihood INTEGER,
    count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        r.impact,
        r.likelihood,
        COUNT(*)::BIGINT as count
    FROM lcrms_risks r
    WHERE r.status != 'closed'
    GROUP BY r.impact, r.likelihood;
END;
$$ LANGUAGE plpgsql;

-- Function to get compliance score
CREATE OR REPLACE FUNCTION get_compliance_score()
RETURNS INTEGER AS $$
DECLARE
    license_score INTEGER;
    coi_score INTEGER;
    violation_penalty INTEGER;
    total_score INTEGER;
BEGIN
    -- License compliance (40 points max)
    SELECT COALESCE(
        (COUNT(*) FILTER (WHERE status = 'valid') * 100 / NULLIF(COUNT(*), 0)),
        100
    ) * 0.4 INTO license_score
    FROM lcrms_licenses;

    -- COI compliance (40 points max)
    SELECT COALESCE(
        (COUNT(*) FILTER (WHERE status IN ('submitted', 'approved')) * 100 / NULLIF(COUNT(*), 0)),
        100
    ) * 0.4 INTO coi_score
    FROM lcrms_coi_declarations
    WHERE year = EXTRACT(YEAR FROM CURRENT_DATE);

    -- Violation penalty (up to -20 points)
    SELECT COALESCE(
        LEAST(COUNT(*) FILTER (WHERE status NOT IN ('closed') AND severity IN ('major', 'critical')) * 5, 20),
        0
    ) INTO violation_penalty
    FROM lcrms_employee_violations;

    total_score := GREATEST(license_score + coi_score - violation_penalty, 0);

    RETURN total_score;
END;
$$ LANGUAGE plpgsql;
