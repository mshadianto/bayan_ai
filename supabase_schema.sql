-- BPKH Limited - Supabase Schema
-- Run this in Supabase SQL Editor

-- Enable pgvector extension for embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- Investment Documents (raw extracted data)
CREATE TABLE IF NOT EXISTS investment_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_name TEXT,
    company_name TEXT,
    file_url TEXT,
    extracted_text TEXT,
    financial_data JSONB,
    embedding vector(1536),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Investment Analysis (agent outputs and final memos)
CREATE TABLE IF NOT EXISTS investment_analysis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID REFERENCES investment_documents(id),
    company_name TEXT,
    recommendation TEXT CHECK (recommendation IN ('approve', 'reject', 'hold', 'pending')),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    financial_analysis JSONB,
    risk_assessment JSONB,
    shariah_compliance JSONB,
    final_memo TEXT,
    approved_by TEXT,
    approved_at TIMESTAMPTZ,
    rejected_by TEXT,
    rejected_at TIMESTAMPTZ,
    rejection_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Shariah Rulings (RAG knowledge base)
CREATE TABLE IF NOT EXISTS shariah_rulings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    category TEXT,
    ruling_text TEXT NOT NULL,
    source TEXT,
    fatwa_number TEXT,
    embedding vector(1536),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bank Transactions (parsed from statements)
CREATE TABLE IF NOT EXISTS bank_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_date DATE,
    description TEXT,
    debit DECIMAL(18,2),
    credit DECIMAL(18,2),
    balance DECIMAL(18,2),
    bank_name TEXT,
    account_number TEXT,
    reference TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Treasury Analysis (daily cashflow)
CREATE TABLE IF NOT EXISTS treasury_analysis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    analysis_date DATE DEFAULT CURRENT_DATE,
    current_balance DECIMAL(18,2),
    forecast JSONB,
    alerts JSONB,
    analysis TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Journal Entries (invoice workflow)
CREATE TABLE IF NOT EXISTS journal_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_number TEXT UNIQUE,
    vendor_name TEXT,
    amount DECIMAL(18,2),
    currency TEXT DEFAULT 'SAR',
    gl_code TEXT,
    description TEXT,
    due_date DATE,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'posted')),
    approved_by TEXT,
    approved_at TIMESTAMPTZ,
    rejected_by TEXT,
    rejected_at TIMESTAMPTZ,
    rejection_reason TEXT,
    posted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Divisional Budgets
CREATE TABLE IF NOT EXISTS divisional_budgets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    division TEXT NOT NULL,
    gl_code TEXT NOT NULL,
    period TEXT NOT NULL,
    budget_amount DECIMAL(18,2),
    actual_amount DECIMAL(18,2) DEFAULT 0,
    remaining_amount DECIMAL(18,2) GENERATED ALWAYS AS (budget_amount - actual_amount) STORED,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(division, gl_code, period)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_investment_analysis_status ON investment_analysis(status);
CREATE INDEX IF NOT EXISTS idx_investment_analysis_created ON investment_analysis(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_journal_entries_status ON journal_entries(status);
CREATE INDEX IF NOT EXISTS idx_journal_entries_invoice ON journal_entries(invoice_number);
CREATE INDEX IF NOT EXISTS idx_treasury_analysis_date ON treasury_analysis(analysis_date DESC);
CREATE INDEX IF NOT EXISTS idx_bank_transactions_date ON bank_transactions(transaction_date DESC);

-- Vector indexes for RAG
CREATE INDEX IF NOT EXISTS idx_shariah_rulings_embedding ON shariah_rulings USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
CREATE INDEX IF NOT EXISTS idx_investment_docs_embedding ON investment_documents USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- Enable Row Level Security (RLS)
ALTER TABLE investment_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE investment_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE shariah_rulings ENABLE ROW LEVEL SECURITY;
ALTER TABLE bank_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE treasury_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE divisional_budgets ENABLE ROW LEVEL SECURITY;

-- Create policies for anon access (adjust as needed for production)
CREATE POLICY "Allow anon read" ON investment_documents FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anon insert" ON investment_documents FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow anon update" ON investment_documents FOR UPDATE TO anon USING (true);

CREATE POLICY "Allow anon read" ON investment_analysis FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anon insert" ON investment_analysis FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow anon update" ON investment_analysis FOR UPDATE TO anon USING (true);

CREATE POLICY "Allow anon read" ON shariah_rulings FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anon insert" ON shariah_rulings FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow anon read" ON bank_transactions FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anon insert" ON bank_transactions FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow anon read" ON treasury_analysis FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anon insert" ON treasury_analysis FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow anon update" ON treasury_analysis FOR UPDATE TO anon USING (true);

CREATE POLICY "Allow anon read" ON journal_entries FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anon insert" ON journal_entries FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow anon update" ON journal_entries FOR UPDATE TO anon USING (true);

CREATE POLICY "Allow anon read" ON divisional_budgets FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anon insert" ON divisional_budgets FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow anon update" ON divisional_budgets FOR UPDATE TO anon USING (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_investment_documents_updated_at
    BEFORE UPDATE ON investment_documents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_investment_analysis_updated_at
    BEFORE UPDATE ON investment_analysis
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_journal_entries_updated_at
    BEFORE UPDATE ON journal_entries
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_divisional_budgets_updated_at
    BEFORE UPDATE ON divisional_budgets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
