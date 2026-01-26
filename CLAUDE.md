# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Enterprise dashboard and n8n workflow automation for BPKH Limited (Saudi Arabian hajj/umrah services). The system automates investment due diligence, treasury operations, and invoice processing using AI-powered multi-agent systems with WhatsApp integration.

## Development Commands

```bash
# Dashboard (React/Vite/TypeScript) - primary development
cd dashboard
npm install
npm run dev          # Dev server on port 3000
npm run build        # TypeScript check + production build
npm run lint         # ESLint

# WhatsApp Handler (Express.js) - for Railway/Vercel
cd wa-handler
npm start

# Cloudflare Worker - production WhatsApp handler
cd wa-worker
wrangler deploy
```

**n8n Workflows**: JSON files in root are n8n exports. Import into n8n instance to modify, then export updated JSON.

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   WhatsApp      │───→│  n8n Workflows  │───→│    Supabase     │
│   (WAHA)        │←───│                 │←───│   (PostgreSQL)  │
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

### Key Directories

- `dashboard/` - React SPA (Vite + TypeScript + Tailwind), deployed to Netlify
- `wa-handler/` - Express.js WhatsApp webhook (simpler, mock responses)
- `wa-worker/` - Cloudflare Worker WhatsApp webhook (production, live Supabase data)
- `*.json` (root) - n8n workflow exports (`temp*.json` and `wf_*.json` are WIP)

### Dashboard Services Layer

- `api.ts` - n8n webhook client with automatic fallback to mock data when API unavailable
- `supabase.ts` - Direct Supabase client for reads
- `waha.ts` - WAHA WhatsApp API client
- `mockData/` - Demo data for offline development (HCMS, finance, treasury, investments)

### Dashboard Routes

- `/` - Finance dashboard overview
- `/investments` - Due diligence approval workflow
- `/treasury` - Balance tracking and forecasts
- `/invoices` - Invoice approval workflow
- `/whatsapp` - WhatsApp messaging interface
- `/hcms/*` - 9 HR modules (employees, attendance, leave, payroll, recruitment, performance, training, compliance)

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

Core tables with pgvector embeddings:
- `investment_documents` - Raw OCR text, financial data, embeddings (vector 1536)
- `investment_analysis` - Agent outputs, final memos, approval status
- `shariah_rulings` - RAG knowledge base for Shariah compliance
- `journal_entries` - Invoice workflow entries
- `treasury_analysis` - Daily cashflow analysis
- `bank_transactions` - Parsed statement data
- `divisional_budgets` - Budget tracking by GL code

Full schema in `supabase_schema.sql` (includes RLS policies, IVFFlat indexes, triggers).

## AI Multi-Agent Pipeline

Investment due diligence uses 3 Groq agents (`llama-3.3-70b-versatile`):
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
