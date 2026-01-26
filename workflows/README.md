# n8n Workflows

This directory contains n8n workflow automation configurations.

## Main Workflows

| File | Purpose | Trigger |
|------|---------|---------|
| `Dashboard API Endpoints.json` | REST API for dashboard data | HTTP webhooks |
| `Financial Automation.json` | Treasury, invoice processing, monthly close | Schedule/Webhook |
| `Investment Due Diligence Automation.json` | Document analysis pipeline with 3-agent system | WhatsApp upload |
| `WhatsApp Command Handler.json` | Process approval commands via WhatsApp | WAHA webhook |

## Alternative Workflows

Located in `alternatives/` folder:
- `WhatsApp Enhanced Handler.json` - Extended WhatsApp handler with more commands
- `WhatsApp Simple Handler.json` - Simplified WhatsApp handler

## Usage

1. Import into n8n instance
2. Configure credentials (Supabase, WAHA, Groq, etc.)
3. Activate workflows
4. Export and commit updated JSON after changes
