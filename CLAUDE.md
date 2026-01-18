# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **standalone React specification/blueprint** for BPKH Limited's Enterprise AI Solution - a RAG (Retrieval-Augmented Generation) Agentic AI platform designed for hajj/umrah travel services in Saudi Arabia. **This is a design document, not a runnable application** - there is no package.json, build system, or test suite.

## Repository Structure

```
bpkh-limited-rag-solution.jsx  # Main React component (standalone, requires external React/Tailwind)
Transformasi_Digital_BPKH-Limited.html  # Training curriculum (static HTML)
013. Undangan Menjadi Pemateri.pdf  # Speaker invitation document
```

## Working with the Code

**No build commands** - The JSX file is a standalone component meant to be imported into a React 18+ environment with Tailwind CSS configured. To preview:
1. Copy the component into an existing React project with Tailwind
2. Or use an online playground (CodeSandbox, StackBlitz) with React + Tailwind template

**Component structure** - Single file with 6 render functions for each module, controlled by `activeModule` state.

## Proposed Architecture (Design Spec)

```
Data Sources (ERP, CRM, HRIS, Documents)
    ↓
RAG Core Engine (Vector Store, Document Processor, Hybrid Search)
    ↓
Agentic AI Layer (Orchestrator + Specialized Agents)
    ↓
Output Interfaces (WhatsApp Bot, Dashboard, Web Portal, Mobile App, API)
```

**Six Modules** (each with dedicated render function):
1. `renderOverview()` - Executive summary with SVG architecture diagram
2. `renderCustomerService()` - Bilingual WhatsApp bot spec (AR-ID)
3. `renderCorporatePlanning()` - Budget dashboard with IDR-SAR conversion
4. `renderPerformanceMonitoring()` - KPI framework
5. `renderDocumentIntelligence()` - Bilingual OCR processing
6. `renderImplementation()` - 6-month phased deployment roadmap

## Technology Stack (Specified in Design)

**Zero/Low-cost focus (~$55/month total)**:
- **LLM**: Groq API (Llama 3.3 70B free tier) or Gemini 1.5 Flash
- **Vector DB**: Supabase pgvector (500MB free)
- **Compute**: Cloudflare Workers (100K req/day free)
- **Orchestration**: n8n self-hosted, CrewAI
- **Messaging**: Meta WABA/Twilio for WhatsApp

## Domain Context

**BPKH Limited** - Hajj/umrah travel services in Saudi Arabia:
- Hotel accommodations (Mecca & Medina)
- Bus transportation
- Haramain Railway tickets
- Catering services

**Critical requirements**:
- Bilingual Arabic + Indonesian support
- Real-time SAR-IDR currency conversion (JISDOR BI rates)
- Arabic document OCR with 98.5% accuracy target
- ~2,000 annual transactions scale
