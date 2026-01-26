const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

// WAHA Configuration
const WAHA_URL = 'https://waha-qikiufjwa2nh.cgk-max.sumopod.my.id';
const WAHA_API_KEY = '5rMMXHU07G5F0cqj5QBcVjFeLCIdSWLI';
const WAHA_SESSION = 'bayan-ai';

// Send WhatsApp message via WAHA
async function sendWhatsApp(chatId, message) {
  try {
    await axios.post(`${WAHA_URL}/api/sendText`, {
      chatId,
      text: message,
      session: WAHA_SESSION
    }, {
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': WAHA_API_KEY
      }
    });
    return true;
  } catch (error) {
    console.error('Send error:', error.message);
    return false;
  }
}

// Process message and generate response
function processMessage(payload) {
  // Skip if from bot itself or group
  if (payload.fromMe || payload.from?.includes('@g.us')) {
    return null;
  }

  const message = payload.body || payload.message?.body || payload.text || '';
  const chatId = payload.chatId || payload.from || '';
  const senderName = payload.pushName || payload.notifyName || 'User';

  // Skip empty messages
  if (!message || !chatId) {
    return null;
  }

  const msgLower = message.toLowerCase().trim();
  let response = '';

  // ============ HELP COMMAND ============
  if (msgLower === '/help' || msgLower === 'help' || msgLower === '?') {
    response = `*BPKH Limited - WhatsApp Assistant*\n\n` +
      `*Available Commands:*\n\n` +
      `*Invoice Management:*\n` +
      `/approve_inv_{number} - Approve invoice\n` +
      `/reject_inv_{number} [reason] - Reject invoice\n\n` +
      `*Investment Management:*\n` +
      `/approve_investment_{id} - Approve investment\n` +
      `/reject_investment_{id} [reason] - Reject investment\n\n` +
      `*Information:*\n` +
      `/balance - Treasury balance\n` +
      `/status_{id} - Check status\n` +
      `/report - Daily summary\n` +
      `/pending - Show pending approvals\n\n` +
      `*Examples:*\n` +
      `_/approve_inv_INV2024001_\n` +
      `_/reject_inv_INV2024002 Budget exceeded_\n` +
      `_/status_INV2024001_`;
  }

  // ============ BALANCE COMMAND ============
  else if (msgLower === '/balance' || msgLower === 'balance' || msgLower === 'saldo') {
    const currentDate = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    response = `*Treasury Balance Report*\n\n` +
      `Current Balance: *SAR 2,450,000*\n\n` +
      `Account Details:\n` +
      `- Operating Account: SAR 1,200,000\n` +
      `- Investment Account: SAR 950,000\n` +
      `- Reserve Fund: SAR 300,000\n\n` +
      `Status: Normal\n` +
      `Last Updated: ${currentDate}`;
  }

  // ============ REPORT COMMAND ============
  else if (msgLower === '/report' || msgLower === 'report' || msgLower === 'laporan') {
    const today = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: '2-digit', month: 'short', year: 'numeric' });
    response = `*Daily Summary Report*\n` +
      `${today}\n\n` +
      `*Pending Approvals:*\n` +
      `- Invoices: 3 pending\n` +
      `- Investments: 2 pending\n\n` +
      `*Today's Activity:*\n` +
      `- Processed: 5 invoices\n` +
      `- Approved: 4\n` +
      `- Rejected: 1\n\n` +
      `*Treasury Movement:*\n` +
      `- Inflow: SAR 150,000\n` +
      `- Outflow: SAR 85,000\n` +
      `- Net: +SAR 65,000`;
  }

  // ============ PENDING COMMAND ============
  else if (msgLower === '/pending' || msgLower === 'pending') {
    response = `*Pending Approvals*\n\n` +
      `*Invoices Awaiting Approval:*\n` +
      `1. INV2024015 - SAR 75,000\n` +
      `   Vendor: Al-Rajhi Construction\n` +
      `2. INV2024016 - SAR 45,000\n` +
      `   Vendor: Saudi Tech Solutions\n` +
      `3. INV2024017 - SAR 120,000\n` +
      `   Vendor: Gulf Trading Co.\n\n` +
      `*Investments Awaiting Approval:*\n` +
      `1. INVEST-2024-008\n` +
      `   Type: Sukuk | Amount: SAR 500,000\n` +
      `2. INVEST-2024-009\n` +
      `   Type: Real Estate | Amount: SAR 1,200,000\n\n` +
      `Reply with /approve_inv_{number} or /reject_inv_{number} [reason]`;
  }

  // ============ APPROVE INVOICE ============
  else if (msgLower.match(/^\/approve_inv_([\w-]+)$/i)) {
    const match = msgLower.match(/^\/approve_inv_([\w-]+)$/i);
    const invNumber = match[1].toUpperCase();
    response = `*Invoice Approved*\n\n` +
      `Invoice: *${invNumber}*\n` +
      `Status: APPROVED\n` +
      `Approved by: ${senderName}\n` +
      `Timestamp: ${new Date().toISOString()}\n\n` +
      `_Journal entry will be posted automatically._`;
  }

  // ============ REJECT INVOICE ============
  else if (msgLower.match(/^\/reject_inv_([\w-]+)(\s+.+)?$/i)) {
    const match = message.match(/^\/reject_inv_([\w-]+)(\s+.+)?$/i);
    const invNumber = match[1].toUpperCase();
    const reason = match[2] ? match[2].trim() : 'No reason provided';
    response = `*Invoice Rejected*\n\n` +
      `Invoice: *${invNumber}*\n` +
      `Status: REJECTED\n` +
      `Rejected by: ${senderName}\n` +
      `Reason: ${reason}\n` +
      `Timestamp: ${new Date().toISOString()}\n\n` +
      `_Vendor will be notified of rejection._`;
  }

  // ============ APPROVE INVESTMENT ============
  else if (msgLower.match(/^\/approve_investment_([\w-]+)$/i)) {
    const match = msgLower.match(/^\/approve_investment_([\w-]+)$/i);
    const investId = match[1].toUpperCase();
    response = `*Investment Approved*\n\n` +
      `Investment ID: *${investId}*\n` +
      `Status: APPROVED\n` +
      `Approved by: ${senderName}\n` +
      `Timestamp: ${new Date().toISOString()}\n\n` +
      `_Deal will proceed to execution phase._`;
  }

  // ============ REJECT INVESTMENT ============
  else if (msgLower.match(/^\/reject_investment_([\w-]+)(\s+.+)?$/i)) {
    const match = message.match(/^\/reject_investment_([\w-]+)(\s+.+)?$/i);
    const investId = match[1].toUpperCase();
    const reason = match[2] ? match[2].trim() : 'No reason provided';
    response = `*Investment Rejected*\n\n` +
      `Investment ID: *${investId}*\n` +
      `Status: REJECTED\n` +
      `Rejected by: ${senderName}\n` +
      `Reason: ${reason}\n` +
      `Timestamp: ${new Date().toISOString()}\n\n` +
      `_Investment committee will be notified._`;
  }

  // ============ STATUS CHECK ============
  else if (msgLower.match(/^\/status_([\w-]+)$/i)) {
    const match = msgLower.match(/^\/status_([\w-]+)$/i);
    const id = match[1].toUpperCase();

    if (id.startsWith('INV')) {
      response = `*Invoice Status*\n\n` +
        `Invoice: *${id}*\n` +
        `Status: Pending Approval\n` +
        `Amount: SAR 75,000\n` +
        `Vendor: Al-Rajhi Construction\n` +
        `Submitted: 2 days ago\n` +
        `Due Date: 15 Jan 2026\n\n` +
        `_Reply /approve_inv_${id} to approve_`;
    } else if (id.startsWith('INVEST')) {
      response = `*Investment Status*\n\n` +
        `ID: *${id}*\n` +
        `Status: Under Review\n` +
        `Type: Sukuk\n` +
        `Amount: SAR 500,000\n` +
        `Risk Score: 3/10 (Low)\n` +
        `Shariah: Compliant\n\n` +
        `_Reply /approve_investment_${id} to approve_`;
    } else {
      response = `*Status Check*\n\n` +
        `ID: *${id}*\n` +
        `Status: Not Found\n\n` +
        `_Please check the ID and try again._`;
    }
  }

  // ============ GREETINGS ============
  else if (msgLower.match(/^(halo|hai|hi|hello|hey|assalamualaikum|salam|good morning|good afternoon|good evening|selamat pagi|selamat siang|selamat sore|selamat malam)/i)) {
    const hour = new Date().getHours();
    let timeGreeting = 'Hello';
    if (hour < 12) timeGreeting = 'Good morning';
    else if (hour < 17) timeGreeting = 'Good afternoon';
    else timeGreeting = 'Good evening';

    response = `${timeGreeting}, ${senderName}!\n\n` +
      `Welcome to *BPKH Limited* WhatsApp Assistant.\n\n` +
      `I can help you with:\n` +
      `- Invoice approvals\n` +
      `- Investment approvals\n` +
      `- Treasury balance\n` +
      `- Status checks\n\n` +
      `Type */help* for all available commands.`;
  }

  // ============ THANK YOU ============
  else if (msgLower.match(/^(terima kasih|thanks|thank you|thx|makasih|syukran)/i)) {
    response = `You're welcome, ${senderName}!\n\n` +
      `Feel free to reach out if you need any assistance.\n` +
      `Type */help* for available commands.`;
  }

  return response ? { chatId, message: response } : null;
}

// Webhook endpoint
app.post('/webhook/whatsapp', async (req, res) => {
  try {
    const body = req.body;
    const payload = body.payload || body;

    console.log('Received:', JSON.stringify(payload).substring(0, 200));

    const result = processMessage(payload);

    if (result) {
      await sendWhatsApp(result.chatId, result.message);
      console.log('Sent response to:', result.chatId);
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Root
app.get('/', (req, res) => {
  res.json({
    name: 'BPKH WhatsApp Handler',
    status: 'running',
    endpoints: {
      webhook: '/webhook/whatsapp',
      health: '/health'
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`BPKH WhatsApp Handler running on port ${PORT}`);
});
