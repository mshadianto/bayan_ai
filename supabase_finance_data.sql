-- =====================================================
-- BPKH Limited - Finance Dummy Data
-- Run each section separately if needed
-- =====================================================

-- =====================================================
-- 1. BANK TRANSACTIONS
-- =====================================================
DELETE FROM bank_transactions;

INSERT INTO bank_transactions (transaction_date, description, debit, credit, balance, bank_name, account_number, reference) VALUES
('2024-12-01', 'Opening Balance Desember 2024', NULL, NULL, 2500000.00, 'Al Rajhi Bank', 'SA44200000012345', 'OB-DEC-2024'),
('2024-12-02', 'Transfer masuk dari BPKH Jakarta - Dana Operasional Q4', NULL, 1500000.00, 4000000.00, 'Al Rajhi Bank', 'SA44200000012345', 'TRF-IN-2024-101'),
('2024-12-03', 'Pembayaran Gaji Karyawan Nov 2024', 780000.00, NULL, 3220000.00, 'Al Rajhi Bank', 'SA44200000012345', 'PAY-SAL-2024-011'),
('2024-12-05', 'Pembayaran Sewa Gedung Kantor Des 2024', 50000.00, NULL, 3170000.00, 'Al Rajhi Bank', 'SA44200000012345', 'PAY-RENT-2024-012'),
('2024-12-08', 'Pembayaran Al-Madinah Catering - Katering Jamaah', 185000.00, NULL, 2985000.00, 'Al Rajhi Bank', 'SA44200000012345', 'PAY-CAT-2024-089'),
('2024-12-10', 'Pembayaran Saudi Electricity Company', 28000.00, NULL, 2957000.00, 'Al Rajhi Bank', 'SA44200000012345', 'PAY-UTL-2024-045'),
('2024-12-12', 'Penerimaan layanan umrah - Group A', NULL, 320000.00, 3277000.00, 'Al Rajhi Bank', 'SA44200000012345', 'RCV-UMR-2024-201'),
('2024-12-15', 'Pembayaran Saudi Auto Service - Maintenance Bus', 42000.00, NULL, 3235000.00, 'Al Rajhi Bank', 'SA44200000012345', 'PAY-MNT-2024-033'),
('2024-12-17', 'Pembayaran IT Solutions Arabia - Lisensi Software', 15000.00, NULL, 3220000.00, 'Al Rajhi Bank', 'SA44200000012345', 'PAY-IT-2024-018'),
('2024-12-19', 'Penerimaan layanan umrah - Group B', NULL, 280000.00, 3500000.00, 'Al Rajhi Bank', 'SA44200000012345', 'RCV-UMR-2024-202'),
('2024-12-22', 'Transfer ke BPKH Jakarta - Setoran Dana Haji', 500000.00, NULL, 3000000.00, 'Al Rajhi Bank', 'SA44200000012345', 'TRF-OUT-2024-055'),
('2024-12-25', 'Pembayaran Al-Rajhi Real Estate - Sewa Asrama', 120000.00, NULL, 2880000.00, 'Al Rajhi Bank', 'SA44200000012345', 'PAY-RENT-2024-013'),
('2024-12-28', 'Pembayaran Perjalanan Dinas Jeddah', 8500.00, NULL, 2871500.00, 'Al Rajhi Bank', 'SA44200000012345', 'PAY-TRV-2024-027'),
('2024-12-30', 'Penerimaan layanan haji - Group C', NULL, 450000.00, 3321500.00, 'Al Rajhi Bank', 'SA44200000012345', 'RCV-HAJ-2024-301'),
('2024-12-31', 'Closing Balance Desember 2024', NULL, NULL, 3321500.00, 'Al Rajhi Bank', 'SA44200000012345', 'CB-DEC-2024'),
('2025-01-02', 'Opening Balance Januari 2025', NULL, NULL, 3321500.00, 'Al Rajhi Bank', 'SA44200000012345', 'OB-JAN-2025'),
('2025-01-03', 'Transfer masuk dari BPKH Jakarta - Dana Q1 2025', NULL, 2000000.00, 5321500.00, 'Al Rajhi Bank', 'SA44200000012345', 'TRF-IN-2025-001'),
('2025-01-05', 'Pembayaran Gaji Karyawan Des 2024', 795000.00, NULL, 4526500.00, 'Al Rajhi Bank', 'SA44200000012345', 'PAY-SAL-2025-001'),
('2025-01-06', 'Pembayaran GOSI Employer Des 2024', 95000.00, NULL, 4431500.00, 'Al Rajhi Bank', 'SA44200000012345', 'PAY-GOSI-2025-001'),
('2025-01-08', 'Pembayaran Sewa Gedung Kantor Jan 2025', 50000.00, NULL, 4381500.00, 'Al Rajhi Bank', 'SA44200000012345', 'PAY-RENT-2025-001'),
('2025-01-10', 'Pembayaran Al-Madinah Catering - Jan', 195000.00, NULL, 4186500.00, 'Al Rajhi Bank', 'SA44200000012345', 'PAY-CAT-2025-001'),
('2025-01-12', 'Penerimaan layanan umrah - Group D', NULL, 350000.00, 4536500.00, 'Al Rajhi Bank', 'SA44200000012345', 'RCV-UMR-2025-001'),
('2025-01-14', 'Pembayaran Saudi Electricity - Jan', 30000.00, NULL, 4506500.00, 'Al Rajhi Bank', 'SA44200000012345', 'PAY-UTL-2025-001'),
('2025-01-15', 'Pembayaran Sewa Asrama Jan 2025', 120000.00, NULL, 4386500.00, 'Al Rajhi Bank', 'SA44200000012345', 'PAY-RENT-2025-002'),
('2025-01-17', 'Pembayaran Saudi Auto Service - Jan', 38000.00, NULL, 4348500.00, 'Al Rajhi Bank', 'SA44200000012345', 'PAY-MNT-2025-001'),
('2025-01-19', 'Penerimaan layanan haji - Group E', NULL, 520000.00, 4868500.00, 'Al Rajhi Bank', 'SA44200000012345', 'RCV-HAJ-2025-001'),
('2025-01-20', 'Transfer ke BPKH Jakarta - Setoran Haji Jan', 600000.00, NULL, 4268500.00, 'Al Rajhi Bank', 'SA44200000012345', 'TRF-OUT-2025-001'),
('2025-01-22', 'Pembayaran Training Provider', 22000.00, NULL, 4246500.00, 'Al Rajhi Bank', 'SA44200000012345', 'PAY-TRN-2025-001'),
('2025-01-23', 'Pembayaran Perjalanan Dinas Madinah', 6500.00, NULL, 4240000.00, 'Al Rajhi Bank', 'SA44200000012345', 'PAY-TRV-2025-001'),
('2025-01-25', 'Penerimaan layanan umrah - Group F', NULL, 290000.00, 4530000.00, 'Al Rajhi Bank', 'SA44200000012345', 'RCV-UMR-2025-002'),
('2025-01-27', 'Pembayaran Marketing dan Promosi', 18000.00, NULL, 4512000.00, 'Al Rajhi Bank', 'SA44200000012345', 'PAY-MKT-2025-001'),
('2024-12-01', 'Opening Balance Des 2024 - SNB', NULL, NULL, 1250000.00, 'Saudi National Bank', 'SA55450000019876', 'OB-DEC-2024-SNB'),
('2024-12-15', 'Profit Deposito Syariah Nov 2024', NULL, 12500.00, 1262500.00, 'Saudi National Bank', 'SA55450000019876', 'PRF-DEP-2024-011'),
('2025-01-02', 'Opening Balance Jan 2025 - SNB', NULL, NULL, 1262500.00, 'Saudi National Bank', 'SA55450000019876', 'OB-JAN-2025-SNB'),
('2025-01-15', 'Profit Deposito Syariah Des 2024', NULL, 13200.00, 1275700.00, 'Saudi National Bank', 'SA55450000019876', 'PRF-DEP-2025-001'),
('2025-01-20', 'Penempatan Sukuk Al-Ijarah', 500000.00, NULL, 775700.00, 'Saudi National Bank', 'SA55450000019876', 'INV-SUK-2025-001');


-- =====================================================
-- 2. TREASURY ANALYSIS
-- =====================================================
DELETE FROM treasury_analysis;

INSERT INTO treasury_analysis (analysis_date, current_balance, forecast, alerts, analysis) VALUES
('2025-01-27', 5287700.00,
 '[{"date":"2025-01-28","projected_balance":5257700,"inflows":0,"outflows":30000},{"date":"2025-01-29","projected_balance":5207700,"inflows":0,"outflows":50000},{"date":"2025-01-30","projected_balance":5607700,"inflows":450000,"outflows":50000},{"date":"2025-01-31","projected_balance":5557700,"inflows":0,"outflows":50000},{"date":"2025-02-01","projected_balance":5507700,"inflows":0,"outflows":50000},{"date":"2025-02-02","projected_balance":4712700,"inflows":0,"outflows":795000},{"date":"2025-02-03","projected_balance":6212700,"inflows":1500000,"outflows":0}]',
 '[{"type":"success","message":"Saldo kas cukup untuk operasional 30 hari ke depan","timestamp":"2025-01-27T08:00:00Z"},{"type":"info","message":"Pembayaran gaji Januari dijadwalkan 2 Feb 2025 (SAR 795,000)","timestamp":"2025-01-27T08:00:00Z"},{"type":"info","message":"Transfer dana operasional Q1 dari BPKH Jakarta sudah diterima","timestamp":"2025-01-27T08:00:00Z"},{"type":"warning","message":"Invoice Al-Madinah Catering SAR 280,000 jatuh tempo 30 Jan 2025","timestamp":"2025-01-27T08:00:00Z"},{"type":"success","message":"Penempatan Sukuk Al-Ijarah SAR 500,000 sudah dieksekusi","timestamp":"2025-01-20T10:00:00Z"}]',
 'Posisi kas BPKH Limited per 27 Januari 2025 sebesar SAR 5,287,700. Likuiditas sehat dengan coverage ratio 6.6x terhadap beban operasional bulanan.'),

('2025-01-20', 5044200.00,
 '[{"date":"2025-01-21","projected_balance":5022200,"inflows":0,"outflows":22000},{"date":"2025-01-22","projected_balance":5015700,"inflows":0,"outflows":6500},{"date":"2025-01-23","projected_balance":5305700,"inflows":290000,"outflows":0},{"date":"2025-01-25","projected_balance":5287700,"inflows":0,"outflows":18000}]',
 '[{"type":"success","message":"Penerimaan layanan haji Group E SAR 520,000 sudah masuk","timestamp":"2025-01-19T14:00:00Z"},{"type":"info","message":"Transfer ke BPKH Jakarta SAR 600,000 berhasil diproses","timestamp":"2025-01-20T09:00:00Z"},{"type":"warning","message":"Pembayaran catering Des 2024 belum dibayar (SAR 280,000)","timestamp":"2025-01-20T08:00:00Z"}]',
 'Posisi kas per 20 Januari 2025 sebesar SAR 5,044,200. Transfer setoran dana haji ke BPKH Jakarta SAR 600,000 telah dieksekusi.'),

('2025-01-13', 4536500.00,
 '[{"date":"2025-01-14","projected_balance":4506500,"inflows":0,"outflows":30000},{"date":"2025-01-15","projected_balance":4386500,"inflows":0,"outflows":120000},{"date":"2025-01-17","projected_balance":4348500,"inflows":0,"outflows":38000},{"date":"2025-01-19","projected_balance":4868500,"inflows":520000,"outflows":0}]',
 '[{"type":"success","message":"Penerimaan layanan umrah Group D SAR 350,000 sudah masuk","timestamp":"2025-01-12T14:00:00Z"},{"type":"info","message":"Pembayaran sewa asrama SAR 120,000 dijadwalkan 15 Jan","timestamp":"2025-01-13T08:00:00Z"}]',
 'Posisi kas per 13 Januari 2025 sebesar SAR 4,536,500. Dana operasional Q1 sudah diterima.'),

('2025-01-06', 4431500.00,
 '[{"date":"2025-01-08","projected_balance":4381500,"inflows":0,"outflows":50000},{"date":"2025-01-10","projected_balance":4186500,"inflows":0,"outflows":195000},{"date":"2025-01-12","projected_balance":4536500,"inflows":350000,"outflows":0}]',
 '[{"type":"success","message":"Dana operasional Q1 2025 SAR 2,000,000 dari BPKH Jakarta diterima","timestamp":"2025-01-03T10:00:00Z"},{"type":"info","message":"Pembayaran gaji Des 2024 SAR 795,000 + GOSI SAR 95,000 sudah diproses","timestamp":"2025-01-06T09:00:00Z"},{"type":"warning","message":"Tagihan catering Jan jatuh tempo SAR 195,000","timestamp":"2025-01-06T08:00:00Z"}]',
 'Awal Januari 2025 - posisi kas kuat setelah menerima transfer dana operasional Q1 sebesar SAR 2,000,000.'),

('2024-12-30', 3321500.00,
 '[{"date":"2025-01-02","projected_balance":3321500,"inflows":0,"outflows":0},{"date":"2025-01-03","projected_balance":5321500,"inflows":2000000,"outflows":0},{"date":"2025-01-05","projected_balance":4526500,"inflows":0,"outflows":795000}]',
 '[{"type":"success","message":"Penerimaan layanan haji Group C SAR 450,000 masuk","timestamp":"2024-12-30T11:00:00Z"},{"type":"info","message":"Closing year 2024 - saldo akhir SAR 3,321,500","timestamp":"2024-12-30T16:00:00Z"}]',
 'Penutupan tahun 2024 dengan saldo SAR 3,321,500. Posisi likuiditas sehat.');


-- =====================================================
-- 3. JOURNAL ENTRIES (Invoices)
-- =====================================================
DELETE FROM journal_entries;

INSERT INTO journal_entries (invoice_number, vendor_name, amount, currency, gl_code, description, due_date, status, approved_by, approved_at, rejected_by, rejected_at, rejection_reason, posted_at) VALUES
('INV-2024-089', 'Al-Madinah Catering Co.', 185000.00, 'SAR', '5100', 'Katering jamaah haji bulan November 2024', '2024-12-08', 'posted', 'Mujiburahman Yaqub', '2024-12-06T10:00:00Z', NULL, NULL, NULL, '2024-12-08T09:00:00Z'),
('INV-2024-090', 'Saudi Electricity Company', 28000.00, 'SAR', '6150', 'Tagihan listrik kantor dan asrama Nov 2024', '2024-12-10', 'posted', 'Mujiburahman Yaqub', '2024-12-09T11:00:00Z', NULL, NULL, NULL, '2024-12-10T09:00:00Z'),
('INV-2024-091', 'Al-Rajhi Real Estate', 50000.00, 'SAR', '6100', 'Sewa gedung kantor Desember 2024', '2024-12-05', 'posted', 'Sidiq Haryono', '2024-12-04T14:00:00Z', NULL, NULL, NULL, '2024-12-05T09:00:00Z'),
('INV-2024-092', 'Saudi Auto Service', 42000.00, 'SAR', '6200', 'Service berkala 5 unit bus jamaah', '2024-12-15', 'posted', 'Mujiburahman Yaqub', '2024-12-14T10:00:00Z', NULL, NULL, NULL, '2024-12-15T09:00:00Z'),
('INV-2024-093', 'IT Solutions Arabia', 15000.00, 'SAR', '6500', 'Lisensi software ERP tahunan 2025', '2024-12-17', 'posted', 'Mujiburahman Yaqub', '2024-12-16T15:00:00Z', NULL, NULL, NULL, '2024-12-17T09:00:00Z'),
('INV-2024-094', 'Al-Rajhi Real Estate', 120000.00, 'SAR', '6100', 'Sewa asrama jamaah Des 2024', '2024-12-25', 'posted', 'Sidiq Haryono', '2024-12-23T10:00:00Z', NULL, NULL, NULL, '2024-12-25T09:00:00Z'),
('INV-2025-001', 'Al-Madinah Catering Co.', 195000.00, 'SAR', '5100', 'Katering jamaah Januari 2025', '2025-01-10', 'approved', 'Mujiburahman Yaqub', '2025-01-09T10:00:00Z', NULL, NULL, NULL, NULL),
('INV-2025-002', 'Saudi Electricity Company', 30000.00, 'SAR', '6150', 'Tagihan listrik Jan 2025', '2025-01-14', 'approved', 'Mujiburahman Yaqub', '2025-01-13T11:00:00Z', NULL, NULL, NULL, NULL),
('INV-2025-003', 'Al-Rajhi Real Estate', 50000.00, 'SAR', '6100', 'Sewa gedung kantor Januari 2025', '2025-01-08', 'posted', 'Sidiq Haryono', '2025-01-07T14:00:00Z', NULL, NULL, NULL, '2025-01-08T09:00:00Z'),
('INV-2025-004', 'Al-Rajhi Real Estate', 120000.00, 'SAR', '6100', 'Sewa asrama jamaah Jan 2025', '2025-01-15', 'posted', 'Sidiq Haryono', '2025-01-14T10:00:00Z', NULL, NULL, NULL, '2025-01-15T09:00:00Z'),
('INV-2025-005', 'Saudi Auto Service', 38000.00, 'SAR', '6200', 'Service bus jamaah Januari 2025', '2025-01-17', 'approved', 'Mujiburahman Yaqub', '2025-01-16T10:00:00Z', NULL, NULL, NULL, NULL),
('INV-2025-006', 'Al-Madinah Catering Co.', 280000.00, 'SAR', '5100', 'Katering Des 2024 (tagihan susulan)', '2025-01-30', 'pending', NULL, NULL, NULL, NULL, NULL, NULL),
('INV-2025-007', 'Makkah Transport Co.', 65000.00, 'SAR', '6300', 'Sewa bus tambahan musim haji 2025', '2025-02-01', 'pending', NULL, NULL, NULL, NULL, NULL, NULL),
('INV-2025-008', 'Al-Haramain Laundry', 18500.00, 'SAR', '5200', 'Jasa laundry asrama Jan 2025', '2025-02-05', 'pending', NULL, NULL, NULL, NULL, NULL, NULL),
('INV-2025-009', 'Dar Al-Salam Printing', 8500.00, 'SAR', '6400', 'Cetak brosur promosi umrah 2025', '2025-02-10', 'pending', NULL, NULL, NULL, NULL, NULL, NULL),
('INV-2025-010', 'ProTech Security Saudi', 22000.00, 'SAR', '5200', 'Jasa keamanan asrama Jan-Feb 2025', '2025-02-15', 'pending', NULL, NULL, NULL, NULL, NULL, NULL),
('INV-2025-011', 'Golden Sand Hotel', 95000.00, 'SAR', '6100', 'Sewa hotel tambahan overflow jamaah', '2025-01-20', 'rejected', NULL, NULL, 'Mujiburahman Yaqub', '2025-01-19T14:00:00Z', 'Budget sewa melebihi alokasi Q1', NULL),
('INV-2025-012', 'Premium Office Supplies', 12000.00, 'SAR', '7000', 'Pengadaan furniture kantor baru', '2025-01-25', 'rejected', NULL, NULL, 'Zoehelmy Husen', '2025-01-24T11:00:00Z', 'Quotation pembanding tidak lengkap', NULL);


-- =====================================================
-- 4. INVESTMENT DOCUMENTS & ANALYSIS
-- =====================================================
DELETE FROM investment_analysis;
DELETE FROM investment_documents;

INSERT INTO investment_documents (id, document_name, company_name, file_url, extracted_text, financial_data) VALUES
('a1000001-0000-0000-0000-000000000001', 'Prospektus_Sukuk_Ijarah_2025.pdf', 'PT Sukuk Indonesia Syariah', '#', 'Prospektus Sukuk Ijarah 2025. Nilai emisi SAR 10M. Tenor 5 tahun. Yield 6.5% pa. Rating idAAA.', '{"revenue":125000000,"net_income":18750000,"total_assets":450000000,"total_equity":180000000,"total_debt":270000000,"roe":10.42,"roa":4.17,"debt_equity_ratio":1.5}'),
('a1000001-0000-0000-0000-000000000002', 'Annual_Report_Halal_Food.pdf', 'Halal Food Corporation', '#', 'Annual Report 2024. Revenue SAR 85M (+12% YoY). EBITDA margin 18%. Net profit SAR 10.2M.', '{"revenue":85000000,"net_income":10200000,"total_assets":210000000,"total_equity":120000000,"total_debt":90000000,"roe":8.5,"roa":4.86,"debt_equity_ratio":0.75}'),
('a1000001-0000-0000-0000-000000000003', 'Feasibility_Digital_Hajj.pdf', 'Saudi Digital Hajj Solutions', '#', 'Studi Kelayakan - startup digitalisasi layanan haji. Proyeksi revenue tahun ke-3: SAR 15M. Burn rate SAR 500K/bulan.', '{"revenue":2500000,"net_income":-4500000,"total_assets":18000000,"total_equity":12000000,"total_debt":6000000,"roe":-37.5,"roa":-25.0,"debt_equity_ratio":0.5}'),
('a1000001-0000-0000-0000-000000000004', 'Investment_Memo_Islamic_Bank.pdf', 'Saudi Islamic Cooperative Bank', '#', 'Investment Memorandum. Total assets SAR 45B. NPL ratio 1.2%. ROE 14.5%. CAR 18.2%. Fully shariah-compliant.', '{"revenue":3200000000,"net_income":680000000,"total_assets":45000000000,"total_equity":4700000000,"total_debt":40300000000,"roe":14.47,"roa":1.51,"debt_equity_ratio":8.57}'),
('a1000001-0000-0000-0000-000000000005', 'Proposal_Waqf_Property.pdf', 'Al-Madinah Waqf Development', '#', 'Proposal Investasi Properti Wakaf di Madinah. Nilai investasi SAR 25M. Proyeksi yield 7.2% pa.', '{"revenue":8500000,"net_income":2800000,"total_assets":65000000,"total_equity":40000000,"total_debt":25000000,"roe":7.0,"roa":4.31,"debt_equity_ratio":0.625}');

INSERT INTO investment_analysis (document_id, company_name, recommendation, status, financial_analysis, risk_assessment, shariah_compliance, final_memo, approved_by, approved_at, rejected_by, rejected_at, rejection_reason) VALUES
('a1000001-0000-0000-0000-000000000001', 'PT Sukuk Indonesia Syariah', 'approve', 'approved',
 '{"revenue":125000000,"profitability":15.0,"roe":10.42,"roa":4.17,"debt_equity_ratio":1.5,"summary":"Kinerja keuangan solid. ROE 10.42%. Rating idAAA."}',
 '{"strategic_risk":3,"financial_risk":2,"operational_risk":3,"compliance_risk":2,"shariah_risk":1,"reputational_risk":2,"overall_rating":2,"summary":"Risiko rendah. Sukuk Ijarah dengan underlying asset riil."}',
 '{"halal_screening":"pass","riba_compliance":"compliant","gharar_assessment":"Minimal gharar","overall_status":"compliant","notes":"Sesuai prinsip syariah."}',
 'REKOMENDASI: APPROVE - Sukuk Ijarah SAR 500,000, tenor 5 tahun, yield 6.5% pa. Risiko rendah dan sesuai syariah.',
 'Sidiq Haryono', '2025-01-18T14:00:00Z', NULL, NULL, NULL),

('a1000001-0000-0000-0000-000000000002', 'Halal Food Corporation', 'approve', 'approved',
 '{"revenue":85000000,"profitability":12.0,"roe":8.5,"roa":4.86,"debt_equity_ratio":0.75,"summary":"Revenue +12% YoY. DER konservatif 0.75x. EBITDA margin 18%."}',
 '{"strategic_risk":4,"financial_risk":3,"operational_risk":4,"compliance_risk":3,"shariah_risk":2,"reputational_risk":3,"overall_rating":3,"summary":"Risiko moderat. Sektor F&B halal prospek baik."}',
 '{"halal_screening":"pass","riba_compliance":"compliant","gharar_assessment":"Tidak ada gharar","overall_status":"compliant","notes":"Sertifikasi ESMA dan JAKIM valid."}',
 'REKOMENDASI: APPROVE - Investasi ekuitas Halal Food Corporation. Fundamental solid dan sesuai syariah.',
 'Sidiq Haryono', '2025-01-15T10:00:00Z', NULL, NULL, NULL),

('a1000001-0000-0000-0000-000000000003', 'Saudi Digital Hajj Solutions', 'reject', 'rejected',
 '{"revenue":2500000,"profitability":-180.0,"roe":-37.5,"roa":-25.0,"debt_equity_ratio":0.5,"summary":"Pre-revenue. Burn rate tinggi SAR 500K/bulan. ROE negatif."}',
 '{"strategic_risk":8,"financial_risk":9,"operational_risk":7,"compliance_risk":5,"shariah_risk":3,"reputational_risk":6,"overall_rating":7,"summary":"Risiko tinggi. Startup pre-profit dengan ketidakpastian pasar."}',
 '{"halal_screening":"pass","riba_compliance":"compliant","gharar_assessment":"Gharar sedang - model bisnis belum terbukti","overall_status":"requires_review","notes":"Unsur gharar dari ketidakpastian startup cukup signifikan."}',
 'REKOMENDASI: REJECT - Profil risiko terlalu tinggi. Belum profitable dan burn rate tinggi.',
 NULL, NULL, 'Sidiq Haryono', '2025-01-20T16:00:00Z', 'Profil risiko tidak sesuai investment policy BPKH.'),

('a1000001-0000-0000-0000-000000000004', 'Saudi Islamic Cooperative Bank', 'approve', 'pending',
 '{"revenue":3200000000,"profitability":21.25,"roe":14.47,"roa":1.51,"debt_equity_ratio":8.57,"summary":"Bank syariah besar. ROE 14.47%. NPL 1.2%. CAR 18.2%."}',
 '{"strategic_risk":3,"financial_risk":3,"operational_risk":3,"compliance_risk":2,"shariah_risk":1,"reputational_risk":2,"overall_rating":2,"summary":"Risiko rendah. Bank established dengan track record panjang."}',
 '{"halal_screening":"pass","riba_compliance":"compliant","gharar_assessment":"Minimal gharar","overall_status":"compliant","notes":"Bank syariah penuh, diawasi DPS. Standar AAOIFI."}',
 'REKOMENDASI: APPROVE - Deposito mudharabah. Bank syariah terkemuka, fundamental kuat.',
 NULL, NULL, NULL, NULL, NULL),

('a1000001-0000-0000-0000-000000000005', 'Al-Madinah Waqf Development', 'hold', 'pending',
 '{"revenue":8500000,"profitability":32.94,"roe":7.0,"roa":4.31,"debt_equity_ratio":0.625,"summary":"Proyeksi yield 7.2% menarik. DER rendah 0.625x."}',
 '{"strategic_risk":5,"financial_risk":5,"operational_risk":6,"compliance_risk":4,"shariah_risk":2,"reputational_risk":3,"overall_rating":4,"summary":"Risiko moderat-tinggi. Risiko konstruksi dan keterlambatan."}',
 '{"halal_screening":"pass","riba_compliance":"compliant","gharar_assessment":"Gharar moderat - proyek dalam tahap pembangunan","overall_status":"requires_review","notes":"Konsep wakaf sesuai syariah. Perlu klarifikasi struktur akad."}',
 'REKOMENDASI: HOLD - Menunggu klarifikasi struktur akad dan progress pembangunan.',
 NULL, NULL, NULL, NULL, NULL);


-- =====================================================
-- 5. DIVISIONAL BUDGETS (Q1 2025)
-- =====================================================
DELETE FROM divisional_budgets;

INSERT INTO divisional_budgets (division, gl_code, period, budget_amount, actual_amount) VALUES
('General Affairs', '6100', '2025-01', 170000.00, 170000.00),
('General Affairs', '6150', '2025-01', 35000.00, 30000.00),
('General Affairs', '7000', '2025-01', 15000.00, 8500.00),
('General Affairs', '6100', '2025-02', 170000.00, 0.00),
('General Affairs', '6150', '2025-02', 35000.00, 0.00),
('General Affairs', '7000', '2025-02', 15000.00, 0.00),
('General Affairs', '6100', '2025-03', 170000.00, 0.00),
('General Affairs', '6150', '2025-03', 35000.00, 0.00),
('General Affairs', '7000', '2025-03', 15000.00, 0.00),
('Operations', '5200', '2025-01', 250000.00, 195000.00),
('Operations', '6200', '2025-01', 50000.00, 38000.00),
('Operations', '5200', '2025-02', 250000.00, 0.00),
('Operations', '6200', '2025-02', 50000.00, 0.00),
('Operations', '5200', '2025-03', 250000.00, 0.00),
('Operations', '6200', '2025-03', 50000.00, 0.00),
('Human Resources', '5000', '2025-01', 850000.00, 795000.00),
('Human Resources', '5000', '2025-02', 850000.00, 0.00),
('Human Resources', '5000', '2025-03', 850000.00, 0.00),
('Food & Beverage', '5100', '2025-01', 200000.00, 195000.00),
('Food & Beverage', '5100', '2025-02', 200000.00, 0.00),
('Food & Beverage', '5100', '2025-03', 200000.00, 0.00),
('Transportation', '6200', '2025-01', 45000.00, 38000.00),
('Transportation', '6300', '2025-01', 15000.00, 6500.00),
('Transportation', '6200', '2025-02', 45000.00, 0.00),
('Transportation', '6300', '2025-02', 15000.00, 0.00),
('Transportation', '6200', '2025-03', 45000.00, 0.00),
('Transportation', '6300', '2025-03', 15000.00, 0.00),
('IT', '6500', '2025-01', 20000.00, 0.00),
('IT', '6500', '2025-02', 20000.00, 0.00),
('IT', '6500', '2025-03', 20000.00, 0.00),
('Marketing', '6400', '2025-01', 25000.00, 18000.00),
('Marketing', '6400', '2025-02', 25000.00, 0.00),
('Marketing', '6400', '2025-03', 25000.00, 0.00),
('Finance', '7000', '2025-01', 10000.00, 0.00),
('Finance', '6500', '2025-01', 15000.00, 0.00),
('Finance', '7000', '2025-02', 10000.00, 0.00),
('Finance', '6500', '2025-02', 15000.00, 0.00),
('Finance', '7000', '2025-03', 10000.00, 0.00),
('Finance', '6500', '2025-03', 15000.00, 0.00);


-- =====================================================
-- 6. SHARIAH RULINGS (Knowledge Base)
-- =====================================================
DELETE FROM shariah_rulings;

INSERT INTO shariah_rulings (title, category, ruling_text, source, fatwa_number) VALUES
('Hukum Sukuk Ijarah', 'sukuk', 'Sukuk Ijarah adalah surat berharga syariah berdasarkan akad Ijarah (sewa-menyewa). Pemegang sukuk berhak atas ujrah (sewa) periodik. Underlying asset harus riil dan halal. Diperbolehkan menurut DSN-MUI dan AAOIFI.', 'Fatwa DSN-MUI No. 137/DSN-MUI/IX/2020', 'DSN-137/2020'),
('Larangan Riba dalam Investasi', 'riba', 'Riba dilarang dalam Al-Quran (QS Al-Baqarah: 275-279). Meliputi riba al-fadl dan riba al-nasiah. Deposito konvensional dan obligasi bunga tetap tidak diperbolehkan.', 'Fatwa DSN-MUI No. 1/DSN-MUI/IV/2000', 'DSN-1/2000'),
('Hukum Gharar dalam Transaksi', 'gharar', 'Gharar berlebihan dilarang dalam muamalah Islam. Gharar Fahisy (berat) haram, Gharar Yasir (ringan) dimaafkan. Investasi startup pre-revenue perlu evaluasi case-by-case.', 'Fatwa DSN-MUI No. 21/DSN-MUI/X/2001', 'DSN-21/2001'),
('Akad Mudharabah untuk Deposito', 'mudharabah', 'Mudharabah adalah kerja sama antara shahibul maal dan mudharib. Nisbah bagi hasil disepakati di awal. Kerugian ditanggung shahibul maal kecuali kelalaian mudharib. Deposito mudharabah halal selama dana dikelola pada sektor halal.', 'Fatwa DSN-MUI No. 3/DSN-MUI/IV/2000', 'DSN-3/2000'),
('Ketentuan Investasi Properti Wakaf', 'wakaf', 'Investasi properti wakaf diperbolehkan dengan ketentuan: niat wakaf jelas dan permanen, aset tidak boleh dijual, hasil disalurkan sesuai tujuan wakaf, pengelolaan oleh nazhir kompeten.', 'Fatwa DSN-MUI No. 73/DSN-MUI/XI/2008', 'DSN-73/2008'),
('Screening Saham Syariah', 'saham', 'Kriteria: bisnis utama halal, rasio utang berbasis bunga max 45% dari total aset, pendapatan non-halal max 10%. Saham lolos masuk Daftar Efek Syariah (DES).', 'Fatwa DSN-MUI No. 80/DSN-MUI/III/2011', 'DSN-80/2011'),
('Hukum Takaful', 'takaful', 'Takaful beroperasi berdasarkan prinsip taawun (tolong-menolong) dan tabarru (sumbangan sukarela). Dana dikelola secara syariah. Surplus underwriting dikembalikan ke peserta.', 'Fatwa DSN-MUI No. 21/DSN-MUI/X/2001', 'DSN-21/2001'),
('Pengelolaan Dana Haji', 'haji', 'Pengelolaan dana haji BPKH harus prudential, diversifikasi investasi, likuiditas cukup, seluruh instrumen sesuai syariah. Alokasi: min 30% likuid, max 50% properti, sisanya surat berharga syariah.', 'UU No. 34/2014 tentang Pengelolaan Keuangan Haji', 'UU-34/2014');
