# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This repository contains n8n workflow automation configurations and a React dashboard for BPKH Limited, a Saudi Arabian Islamic finance company. The workflows automate investment due diligence and financial operations using AI-powered multi-agent systems.

## Development Commands

### Dashboard (React/Vite/TypeScript)

```bash
cd dashboard
npm install          # Install dependencies
npm run dev          # Start dev server (port 3000)
npm run build        # TypeScript check + production build
npm run lint         # ESLint
npm run preview      # Preview production build
```

### WhatsApp Handler (Node.js/Express)

```bash
cd wa-handler
npm install          # Install dependencies
npm start            # Start server (default port 3000)
```

### Cloudflare Worker

```bash
cd wa-worker
wrangler deploy      # Deploy to Cloudflare Workers
```

### n8n Workflows

These JSON files are n8n workflow exports. To modify:
1. Import into n8n instance
2. Make changes via n8n editor
3. Export and commit updated JSON

## Architecture

### System Components

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   WhatsApp      │───→│  n8n Workflows  │───→│    Supabase     │
│   (WAHA)        │←───│                 │←───│   (PostgreSQL)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
        │                     ↑ ↓                     ↑
        │              ┌──────┴──────┐                │
        │              │  Dashboard  │                │
        │              │  (React)    │                │
        │              └─────────────┘                │
        │                                             │
        └──────────┬──────────────────────────────────┘
                   ↓
         ┌─────────────────┐
         │  wa-handler OR  │  (WhatsApp webhook processors)
         │  wa-worker      │
         └─────────────────┘
```

### Directory Structure

```
bayan_AI/
├── dashboard/           # React SPA (Vite + TypeScript + Tailwind)
│   ├── src/
│   │   ├── components/  # Layout, ErrorBoundary, common components
│   │   ├── pages/       # Dashboard, Investments, Treasury, Invoices, WhatsApp, HCMS
│   │   ├── services/    # api.ts, supabase.ts, waha.ts, mockData/
│   │   ├── hooks/       # Custom React hooks
│   │   └── types/       # TypeScript interfaces
│   └── netlify.toml     # Netlify deployment config
├── wa-handler/          # Express.js WhatsApp webhook server
│   └── index.js         # Message processing + command handling
├── wa-worker/           # Cloudflare Workers alternative
│   └── src/index.js     # Serverless WhatsApp handler
├── supabase_schema.sql  # Database schema with triggers
└── *.json               # n8n workflow exports
```

### Workflow Files

| File | Purpose | Trigger |
|------|---------|---------|
| `Investment Due Diligence Automation.json` | Document analysis pipeline with 3-agent system | WhatsApp upload |
| `Financial Automation.json` | Treasury, invoice processing, monthly close | Schedule/Webhook |
| `WhatsApp Command Handler.json` | Process approval commands via WhatsApp | WAHA webhook |
| `WhatsApp Enhanced Handler.json` | Extended WhatsApp handler with more commands | WAHA webhook |
| `Dashboard API Endpoints.json` | REST API for dashboard data | HTTP webhooks |

Note: `temp*.json` and `wf_*.json` files are work-in-progress workflow exports.

### Investment Due Diligence Pipeline

Flow: WhatsApp Upload → Cloudflare R2 → Unstructured.io OCR → Supabase (raw + embeddings) → Multi-Agent Analysis → Final Memo → WhatsApp

**Multi-Agent System (Groq `llama-3.3-70b-versatile`):**
1. **Financial Analysis**: Revenue, profitability, ROE/ROA/Debt-Equity ratios
2. **Risk Assessment**: Strategic, financial, operational, compliance, Shariah risks (1-10 scale)
3. **Shariah Compliance**: RAG against `shariah_rulings` for halal/riba/gharar screening

Output is bilingual (Arabic/Indonesian).

### Financial Operations Autopilot

1. **Daily Treasury** (9 AM Saudi): Gmail → Parse → Supabase → AI forecast → Telegram alerts
2. **Invoice Processing** (Webhook): OCR → AI extraction → Budget validation → Approval routing → Journal entries
3. **Monthly Close** (1st): Trial balance → IFRS/Saudi GAAP statements → Telegram

### Dashboard Application

React SPA in `dashboard/` that consumes n8n webhook APIs.

**Routes:**
- `/` - Dashboard overview with summary metrics
- `/investments` - Investment analysis list with approve/reject
- `/treasury` - Balance history and cashflow forecasts
- `/invoices` - Invoice approval workflow
- `/whatsapp` - Send WhatsApp messages
- `/hcms/*` - Human Capital Management System (9 modules)

**HCMS Modules:**
- Dashboard - HR overview metrics
- Employees - Employee directory
- Attendance - Time tracking
- Leave - Leave management
- Payroll - Salary processing
- Recruitment - Hiring pipeline
- Performance - Reviews & KPIs
- Training - Learning management
- Compliance - Document expiry & disciplinary

**Key Services:**
- `src/services/api.ts` - n8n webhook API client (falls back to mockData)
- `src/services/supabase.ts` - Direct Supabase client
- `src/services/waha.ts` - WAHA WhatsApp API
- `src/services/mockData/hcms.ts` - HCMS mock data service

**n8n Webhook API Endpoints (consumed by dashboard):**
- `GET /webhook/dashboard-data` - Fetch all dashboard data
- `POST /webhook/approve-invoice` - Approve invoice `{id, approved_by}`
- `POST /webhook/reject-invoice` - Reject invoice `{id, rejected_by, reason}`
- `POST /webhook/approve-investment` - Approve investment `{id, approved_by}`
- `POST /webhook/reject-investment` - Reject investment `{id, rejected_by, reason}`
- `POST /webhook/send-whatsapp` - Send WhatsApp message `{chatId, message}`

### WhatsApp Handlers

Two alternative implementations for processing WhatsApp webhooks:

**wa-handler** (Express.js) - For Railway/Vercel deployment
- Endpoints: `POST /webhook/whatsapp`, `GET /health`, `GET /`
- Uses axios for WAHA API calls
- Returns mock/static responses (simpler implementation)
- Deploy: `railway.json` or `vercel.json` configs included

**wa-worker** (Cloudflare Workers) - Production implementation
- Direct Supabase REST API integration for live data
- Queries `treasury_analysis`, `journal_entries`, `investment_analysis` tables
- Updates approval status directly in Supabase
- More comprehensive command set with Arabic/Indonesian bilingual responses
- Deploy: `wrangler deploy`

### WhatsApp Commands

```
# Approval Commands
/approve_inv_{number}           - Approve invoice
/reject_inv_{number} [reason]   - Reject invoice
/approve_investment_{id}        - Approve investment
/reject_investment_{id} [reason]- Reject investment

# Query Commands
/status_{id}                    - Check invoice/investment status
/balance                        - Treasury balance (live from Supabase)
/invoices                       - List pending invoices
/investments                    - List investments
/pending                        - All pending approvals
/portfolio                      - Portfolio overview

# Reports
/report                         - Executive summary
/cashflow                       - Cashflow analysis
/risk                           - Risk assessment
/shariah                        - Shariah compliance status

# Other
/help or /menu                  - Show all commands
/fx                             - Exchange rates
```

## Database Tables (Supabase)

- `investment_documents`: Raw extracted text, financial data, embeddings (vector 1536)
- `investment_analysis`: Final memos, recommendations, agent outputs
- `shariah_rulings`: RAG knowledge base for Shariah compliance (vector-enabled)
- `bank_transactions`: Parsed bank statement transactions
- `treasury_analysis`: Daily cashflow analysis logs
- `journal_entries`: General ledger entries (invoice workflow)
- `divisional_budgets`: Budget tracking by GL code and period

Schema includes RLS policies, IVFFlat vector indexes, and updated_at triggers.

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

### wa-handler
```
WAHA_URL=
WAHA_API_KEY=
WAHA_SESSION=
PORT=3000
```

### n8n Workflows
- `WAHA_URL`: WhatsApp API endpoint
- `WAHA_API_KEY`: API authentication
- `WAHA_SESSION`: WhatsApp session identifier

## Approval Thresholds

| Condition | Action |
|-----------|--------|
| Invoice > 100,000 SAR | CFO approval required |
| Invoice > 50,000 SAR | Finance Manager approval |
| Balance < 100,000 SAR | Liquidity warning alert |
| Balance > 500,000 SAR | Sukuk investment recommendation |

## External Services

| Service | Purpose |
|---------|---------|
| Supabase | PostgreSQL + pgvector for embeddings |
| Groq API | LLM inference (`llama-3.3-70b-versatile`) |
| Cloudflare R2 | S3-compatible document storage |
| Unstructured.io | PDF/document OCR |
| WAHA | WhatsApp API gateway |
| Telegram Bot | CFO/Finance notifications |
| Gmail OAuth | Bank statement retrieval |

## Styling

Dashboard uses Tailwind CSS with custom Islamic-themed colors:
- `islamic-green`: #0d6e3d
- `islamic-gold`: #c5a54e
- Primary color scale extends green (50-900)

## Data Flow

1. **Dashboard → n8n**: API calls to webhook endpoints for actions (approve/reject)
2. **Dashboard → Supabase**: Direct reads via `@supabase/supabase-js` client
3. **WhatsApp → wa-worker → Supabase**: Approval commands update database directly
4. **n8n → Supabase**: Workflows write analysis results, process documents
5. **Fallback**: Dashboard uses `mockData.ts` when API unavailable
