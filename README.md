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
│   │   │   └── common/     # StatusBadge, StatCard, Modal, etc.
│   │   ├── contexts/       # React Context (UserContext - RBAC, ThemeContext - Dark/Light)
│   │   ├── pages/          # Route pages
│   │   │   ├── hcms/       # Human Capital Management (9 modules)
│   │   │   ├── lcrms/      # Legal, Compliance & Risk Mgmt (7 modules)
│   │   │   └── *.tsx       # Finance pages (6 modules)
│   │   ├── services/       # API clients & mock data
│   │   │   ├── mockData/   # Mock data (hcms.ts, lcrms.ts)
│   │   │   ├── supabaseHcms.ts
│   │   │   ├── supabaseLcrms.ts
│   │   │   └── api.ts      # n8n webhook client
│   │   ├── hooks/          # Custom React hooks
│   │   └── types/          # TypeScript definitions
│   └── public/_redirects   # Netlify SPA routing
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
├── supabase_schema.sql     # Finance database schema
├── supabase_hcms_schema.sql # HCMS database schema
├── supabase_lcrms_schema.sql # LCRMS database schema
├── supabase_hr_update.sql  # HR real data (17 employees)
├── netlify.toml            # Netlify build config
├── CLAUDE.md               # AI assistant instructions
└── README.md
```

---

## Modules (22 Pages)

### Finance (6 modules)

| Module | Description | Route |
|--------|-------------|-------|
| **Finance Dashboard** | Financial overview, revenue trends, expense breakdown | `/` |
| **Investments** | Due diligence analysis, approve/reject workflow | `/investments` |
| **Treasury** | Balance history, cashflow forecasting, account breakdown | `/treasury` |
| **Invoices** | Invoice approval workflow (threshold-based routing) | `/invoices` |
| **Financial Requests** | Financial approval request tracking | `/financial-requests` |
| **WhatsApp** | Send messages via WAHA API | `/whatsapp` |

### HCMS - Human Capital Management (9 modules)

| Module | Description | Route |
|--------|-------------|-------|
| **HR Dashboard** | Employee metrics, department breakdown, attendance summary | `/hcms` |
| **Employees** | Employee directory with CRUD, filters by department/status | `/hcms/employees` |
| **Attendance** | Check-in/out tracking, manual entry, overtime, location | `/hcms/attendance` |
| **Leave** | Leave requests, approval workflow, balance tracking | `/hcms/leave` |
| **Payroll** | Salary processing, GOSI, allowances, payment tracking | `/hcms/payroll` |
| **Recruitment** | Job postings, ATS pipeline (Applied > Interview > Hired) | `/hcms/recruitment` |
| **Performance** | KPI tracking, annual/quarterly reviews, ratings | `/hcms/performance` |
| **Training** | LMS, course enrollment, certificate tracking | `/hcms/training` |
| **Compliance** | Document expiry alerts, disciplinary case management | `/hcms/compliance` |

### LCRMS - Legal, Compliance & Risk Management (7 modules)

| Module | Description | Route |
|--------|-------------|-------|
| **LCRMS Dashboard** | Compliance score, risk heatmap, alerts timeline | `/lcrms` |
| **Contracts** | Contract lifecycle management, expiry alerts (H-90/60/30) | `/lcrms/contracts` |
| **Compliance** | License monitoring, COI declarations, violation tracking | `/lcrms/compliance` |
| **Knowledge Base** | AI chatbot (Kamus Syarikah), legal document search | `/lcrms/knowledge` |
| **Risk Management** | Enterprise risk register, heatmap (Impact x Likelihood) | `/lcrms/risks` |
| **Litigation** | Case management, external counsel, cost tracking | `/lcrms/litigation` |
| **Secretarial** | Meeting minutes (RUPS), shareholders, circular resolutions | `/lcrms/secretarial` |

---

## Role-Based Access Control (RBAC)

The dashboard includes a demo role switcher with 5 predefined roles:

| Role | Name | Access |
|------|------|--------|
| **General Manager** | Sidiq Haryono | Finance + HCMS + LCRMS (full access) |
| **Accountant** | Mujiburahman Yaqub | Finance + LCRMS |
| **Admin Assistant** | Effat Fuad Minkabau | HCMS only |
| **Operations Manager** | Zoehelmy Husen | LCRMS only |
| **Data Entry Clerk** | Myar Mahdi Qorut | HCMS (limited) |

Locked modules show a lock icon in the sidebar. Role can be switched via the dropdown in the header.

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
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, Recharts |
| **Backend** | n8n workflows, Cloudflare Workers |
| **Database** | Supabase (PostgreSQL + pgvector) |
| **AI/LLM** | Groq API (Llama 3.3 70B) - Knowledge Base RAG |
| **WhatsApp** | WAHA API |
| **Deployment** | Netlify, Cloudflare Workers |

---

## UI Theme

### Dark / Light Mode

The dashboard supports dark and light mode with a toggle button (sun/moon icon) in the header. Theme preference is persisted in `localStorage` and respects the system `prefers-color-scheme` on first visit. Defaults to dark mode.

Theming is implemented via CSS custom properties defined in `index.css` (`:root` for light, `.dark` for dark) and Tailwind's `darkMode: 'class'` strategy. Semantic color tokens (`bg-card`, `text-content`, `border-border`, etc.) are used across all components and pages.

### Module Color Scheme

| Module | Color Scheme | Gradient |
|--------|-------------|----------|
| **Finance** | Teal / Emerald | `from-teal-600 to-emerald-600` |
| **HCMS** | Indigo / Purple | `from-indigo-600 to-purple-600` |
| **LCRMS** | Amber / Orange | `from-amber-600 to-orange-600` |

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

**PROPRIETARY LICENSE** © 2026 BPKH Limited. All Rights Reserved.

---

<p align="center">
  <b>بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم</b><br>
  <i>Transformasi Digital Layanan Jamaah Haji & Umrah</i>
</p>
