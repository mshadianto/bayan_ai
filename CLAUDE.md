# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Enterprise dashboard and n8n workflow automation for BPKH Limited (Saudi Arabian hajj/umrah services). The system automates investment due diligence, treasury operations, and invoice processing using AI-powered multi-agent systems with WhatsApp integration. The dashboard has 22 pages across 3 module groups: Finance (6), HCMS (9), and LCRMS (7).

## Development Commands

```bash
# Dashboard (React 18 / Vite 5 / TypeScript 5) - primary development
cd dashboard
npm install
npm run dev          # Dev server on port 3000 (auto-opens browser)
npm run build        # tsc && vite build (TypeScript check + production build)
npm run lint         # ESLint (strict, max-warnings=0)
npm run preview      # Preview production build locally

# WhatsApp Handler (Express.js) - for Railway/Vercel
cd wa-handler
npm start

# Cloudflare Worker - production WhatsApp handler
cd wa-worker
wrangler deploy
```

**No test framework** is configured. There are no unit or integration tests.

**n8n Workflows**: JSON files in `workflows/` are n8n exports. Import into n8n instance to modify, then export updated JSON.

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   WhatsApp      │───→│  n8n Workflows  │───→│    Supabase     │
│   (WAHA)        │←───│  (workflows/)   │←───│   (PostgreSQL)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
        │                     ↑ ↓                     ↑
        │              ┌──────┴──────┐                │
        │              │  Dashboard  │────────────────┘
        │              │  (React)    │
        │              └─────────────┘
        │                     ↑
        └─────────────────────┘
              wa-worker (Cloudflare)
```

**Deployment targets**: Netlify (dashboard), Railway/Vercel (wa-handler), Cloudflare Workers (wa-worker).

### Key Directories

- `dashboard/` - React SPA (Vite + TypeScript + Tailwind), deployed to Netlify
- `wa-handler/` - Express.js WhatsApp webhook (simpler, mock responses)
- `wa-worker/` - Cloudflare Worker WhatsApp webhook (production, live Supabase data)
- `workflows/` - n8n workflow JSON exports (with `alternatives/` subfolder)
- `docs/` - Demos (Excel, HTML, Jupyter), deployment & security guides
- `supabase_*.sql` - Database schemas (finance, HCMS, LCRMS, HR seed data)

### Dashboard Source Layout

```
dashboard/src/
├── App.tsx              # Router with lazy loading via lazyWithRetry()
├── pages/               # 22 route pages
│   ├── *.tsx            # Finance pages (Dashboard, Investments, Treasury, Invoices, etc.)
│   ├── hcms/            # 9 HR modules
│   └── lcrms/           # 7 Legal/Compliance modules
├── components/
│   ├── Layout/          # Layout, Header (role switcher), Sidebar (3-section nav with RBAC)
│   └── common/          # StatusBadge, DataTable, Modal, StatCard, SearchInput, etc.
├── contexts/            # UserContext.tsx (RBAC with 5 roles)
├── services/            # API clients with mock data fallback
│   ├── api.ts           # n8n webhook client (axios, 10s timeout)
│   ├── supabase.ts      # Finance Supabase queries
│   ├── supabaseHcms.ts  # HCMS Supabase service layer
│   ├── supabaseLcrms.ts # LCRMS Supabase service layer
│   ├── waha.ts          # WAHA WhatsApp API client
│   └── mockData/        # Fallback demo data (finance, hcms, lcrms)
├── hooks/               # useHCMSData, useDebounce, useLocalStorage
└── types/               # TypeScript definitions (index.ts)
```

### Dashboard Routes

**Finance (6 routes)**:
- `/` - Dashboard overview
- `/investments` - Due diligence approval workflow
- `/treasury` - Balance tracking and forecasts
- `/invoices` - Invoice approval workflow
- `/financial-requests` - Financial request tracking
- `/whatsapp` - WhatsApp messaging interface

**HCMS (9 routes)** — `/hcms`, `/hcms/employees`, `/hcms/attendance`, `/hcms/leave`, `/hcms/payroll`, `/hcms/recruitment`, `/hcms/performance`, `/hcms/training`, `/hcms/compliance`

**LCRMS (7 routes)** — `/lcrms`, `/lcrms/contracts`, `/lcrms/compliance`, `/lcrms/knowledge`, `/lcrms/risks`, `/lcrms/litigation`, `/lcrms/secretarial`

### Key Architectural Patterns

**Lazy loading with self-healing**: `App.tsx` uses `lazyWithRetry()` which auto-reloads the page once on chunk load failure (handles stale chunks after deploy), using `sessionStorage` to prevent reload loops.

**Graceful degradation to mock data**: Every service function (`supabase.ts`, `supabaseHcms.ts`, `supabaseLcrms.ts`, `api.ts`) catches errors and returns mock data from `services/mockData/`. This means the dashboard works fully offline with demo data. Pattern:
```typescript
try {
  const { data, error } = await supabase.from('table').select('*');
  if (error || !data?.length) return mockData;
  return data;
} catch { return mockData; }
```

**RBAC via React Context**: `UserContext.tsx` provides `useUser()` hook with `canAccess(module)`. Five demo roles control access to `'finance'`, `'hcms'`, and `'lcrms'` module groups. The Sidebar renders lock icons for inaccessible modules. Role switching is via a Header dropdown.

**Null-safe status handling**: `StatusBadge.tsx` normalizes any status string (handles null, undefined, underscores, mixed case) and maps 40+ status values to color variants. Use `StatusBadge` for all status displays.

### Service Layer

Each module group has its own Supabase service file with CRUD operations:

| Service | Tables | Operations |
|---------|--------|------------|
| `supabase.ts` | `investment_analysis`, `journal_entries`, `treasury_analysis` | get*, update*Status |
| `supabaseHcms.ts` | `hcms_employees`, `hcms_attendance`, `hcms_leave_requests`, `hcms_payroll_records`, `hcms_recruitment`, `hcms_candidates`, `hcms_performance_reviews`, `hcms_training`, `hcms_training_enrollment`, `hcms_compliance_alerts`, `hcms_disciplinary_cases` | Full CRUD per entity |
| `supabaseLcrms.ts` | `lcrms_contracts`, `lcrms_licenses`, `lcrms_coi_declarations`, `lcrms_violations`, `lcrms_risks`, `lcrms_litigation_cases`, `lcrms_meeting_minutes` | Full CRUD per entity |
| `api.ts` | n8n webhooks | approve/reject invoice & investment, send WhatsApp |
| `waha.ts` | WAHA API | getChats, getChatMessages, sendTextMessage |

### n8n Webhook Endpoints

```
GET  /webhook/dashboard-data     - All dashboard data
POST /webhook/approve-invoice    - {id, approved_by}
POST /webhook/reject-invoice     - {id, rejected_by, reason}
POST /webhook/approve-investment - {id, approved_by}
POST /webhook/reject-investment  - {id, rejected_by, reason}
POST /webhook/send-whatsapp      - {chatId, message}
```

## Database (Supabase)

Three schema files define the database. All tables use UUID primary keys, have `created_at`/`updated_at` timestamps, and RLS enabled with anon access policies.

**Finance** (`supabase_schema.sql`):
- `investment_documents` - Raw OCR text, financial data, embeddings (vector 1536)
- `investment_analysis` - Agent outputs, final memos, approval status
- `shariah_rulings` - RAG knowledge base for Shariah compliance
- `journal_entries` - Invoice workflow entries
- `treasury_analysis` - Daily cashflow analysis
- `bank_transactions` - Parsed statement data
- `divisional_budgets` - Budget tracking by GL code

**HCMS** (`supabase_hcms_schema.sql`):
- `hcms_departments`, `hcms_employees` (with Saudi-specific fields: iqamah, visa, passport, work_permit with expiry dates)
- `hcms_attendance`, `hcms_leave_requests`, `hcms_payroll_records`
- `hcms_recruitment`, `hcms_candidates` (ATS pipeline stages)
- `hcms_performance_reviews` (KPIs stored as JSONB)
- `hcms_training`, `hcms_training_enrollment`
- `hcms_compliance_alerts`, `hcms_disciplinary_cases`

**LCRMS** (`supabase_lcrms_schema.sql`):
- `lcrms_contracts`, `lcrms_contract_obligations`, `lcrms_contract_versions`
- `lcrms_licenses`, `lcrms_coi_declarations`, `lcrms_violations`
- `lcrms_risks` (impact/likelihood 1-5 scoring)
- `lcrms_litigation_cases`, `lcrms_external_counsel`
- `lcrms_meeting_minutes`, `lcrms_shareholders`, `lcrms_circular_resolutions`

**Seed data**: `supabase_hr_update.sql` and `supabase_sample_data.sql` contain real employee data (17 employees).

## AI Multi-Agent Pipeline

Investment due diligence uses 3 Groq agents (`llama-3.3-70b-versatile`) orchestrated via n8n:
1. **Financial Analysis** - Revenue, profitability, ROE/ROA/Debt-Equity
2. **Risk Assessment** - Strategic/financial/operational/compliance/Shariah risks (1-10)
3. **Shariah Compliance** - RAG against `shariah_rulings` for halal/riba/gharar screening

Output is bilingual (Arabic/Indonesian).

## Environment Variables

### Dashboard (`dashboard/.env`)
```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_N8N_BASE_URL=
VITE_WAHA_URL=
VITE_WAHA_API_KEY=
VITE_WAHA_SESSION=default
```

### wa-handler / wa-worker
```
WAHA_URL=
WAHA_API_KEY=
WAHA_SESSION=
SUPABASE_URL=      # wa-worker only
SUPABASE_KEY=      # wa-worker only
```

If env vars are missing, the dashboard degrades gracefully to mock data.

## Business Rules

| Condition | Action |
|-----------|--------|
| Invoice > 100,000 SAR | CFO approval required |
| Invoice > 50,000 SAR | Finance Manager approval |
| Balance < 100,000 SAR | Liquidity warning alert |
| Balance > 500,000 SAR | Sukuk investment recommendation |

## Styling

Tailwind CSS with Islamic-themed colors defined in `dashboard/tailwind.config.js`:
- `islamic-green`: #0d6e3d
- `islamic-gold`: #c5a54e
- `primary-*`: Green scale (50-900)

Module color themes (used in gradients, stat cards, sidebar indicators):
- **Finance**: Teal → Emerald (`from-teal-600 to-emerald-600`)
- **HCMS**: Indigo → Purple (`from-indigo-600 to-purple-600`)
- **LCRMS**: Amber → Orange (`from-amber-600 to-orange-600`)
