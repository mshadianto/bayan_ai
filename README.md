# BPKH Limited - Enterprise AI Platform

![BPKH Limited](https://img.shields.io/badge/BPKH-Limited-teal?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![n8n](https://img.shields.io/badge/n8n-Workflows-orange?style=for-the-badge)

> Enterprise dashboard & AI automation platform for hajj/umrah services in Saudi Arabia.

## Live Demo

| Platform | URL |
|----------|-----|
| **Dashboard** | [bpkh-limited-dashboard.netlify.app](https://bpkh-limited-dashboard.netlify.app) |
| **Landing** | [mshadianto.github.io/bayan_ai](https://mshadianto.github.io/bayan_ai/) |

---

## Project Structure

```
bayan_ai/
├── dashboard/              # React SPA (Vite + TypeScript + Tailwind)
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── Layout/     # Header, Sidebar, Layout
│   │   │   └── common/     # StatusBadge, StatCard, DataTable, etc.
│   │   ├── pages/          # Route pages
│   │   │   ├── hcms/       # Human Capital Management (9 modules)
│   │   │   └── *.tsx       # Finance pages
│   │   ├── services/       # API clients & mock data
│   │   ├── hooks/          # Custom React hooks
│   │   └── types/          # TypeScript definitions
│   └── netlify.toml
│
├── workflows/              # n8n workflow automations
│   ├── Dashboard API Endpoints.json
│   ├── Financial Automation.json
│   ├── Investment Due Diligence Automation.json
│   ├── WhatsApp Command Handler.json
│   └── alternatives/       # Alternative workflow versions
│
├── wa-handler/             # Express.js WhatsApp webhook server
├── wa-worker/              # Cloudflare Workers (serverless)
│
├── docs/
│   ├── demo/               # Demo & presentation files
│   └── guides/             # Technical documentation
│
├── supabase_schema.sql     # Database schema
├── CLAUDE.md               # AI assistant instructions
└── README.md
```

---

## Modules

### Dashboard (React)

| Module | Description | Route |
|--------|-------------|-------|
| **Finance Dashboard** | Financial overview & analytics | `/` |
| **Investments** | Due diligence & approval workflow | `/investments` |
| **Treasury** | Balance tracking & forecasts | `/treasury` |
| **Invoices** | Invoice approval workflow | `/invoices` |
| **WhatsApp** | Send messages & commands | `/whatsapp` |

### HCMS (Human Capital Management)

| Module | Description | Route |
|--------|-------------|-------|
| **HR Dashboard** | HR metrics overview | `/hcms` |
| **Employees** | Employee directory | `/hcms/employees` |
| **Attendance** | Time & overtime tracking | `/hcms/attendance` |
| **Leave** | Leave requests & balances | `/hcms/leave` |
| **Payroll** | Salary processing | `/hcms/payroll` |
| **Recruitment** | Hiring pipeline & ATS | `/hcms/recruitment` |
| **Performance** | KPIs & appraisals | `/hcms/performance` |
| **Training** | LMS & certifications | `/hcms/training` |
| **Compliance** | Document expiry & disciplinary | `/hcms/compliance` |

---

## Quick Start

### Dashboard

```bash
cd dashboard
npm install
npm run dev          # Start dev server (port 3000)
npm run build        # Production build
```

### WhatsApp Handler

```bash
# Express.js (Railway/Vercel)
cd wa-handler
npm install && npm start

# Cloudflare Workers
cd wa-worker
wrangler deploy
```

### n8n Workflows

1. Import JSON files from `workflows/` into n8n
2. Configure credentials (Supabase, WAHA, Groq)
3. Activate workflows

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS |
| **Backend** | n8n workflows, Cloudflare Workers |
| **Database** | Supabase (PostgreSQL + pgvector) |
| **AI/LLM** | Groq API (Llama 3.3 70B) |
| **WhatsApp** | WAHA API |
| **Deployment** | Netlify, Cloudflare Workers |

---

## Environment Variables

```env
# Dashboard (.env)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_N8N_BASE_URL=https://your-n8n-instance.example.com
VITE_WAHA_URL=https://your-waha-instance.example.com
VITE_WAHA_API_KEY=your-waha-api-key
VITE_WAHA_SESSION=default
```

---

## Credits

- **Developer**: MS Hadianto | Audit Committee BPKH
- **AI Assistant**: Claude Opus 4.5 (Anthropic)

---

## License

**PROPRIETARY LICENSE** © 2025 BPKH Limited. All Rights Reserved.

---

<p align="center">
  <b>بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم</b><br>
  <i>Transformasi Digital Layanan Jamaah Haji & Umrah</i>
</p>
