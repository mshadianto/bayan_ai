const axios = require('axios');

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
  if (payload.fromMe || payload.from?.includes('@g.us')) return null;

  const message = payload.body || payload.message?.body || payload.text || '';
  const chatId = payload.chatId || payload.from || '';
  const senderName = payload.pushName || payload.notifyName || 'User';

  if (!message || !chatId) return null;

  const msgLower = message.toLowerCase().trim();
  let response = '';

  // HELP
  if (msgLower === '/help' || msgLower === 'help' || msgLower === '?') {
    response = `*BPKH Limited - WhatsApp Assistant*\n\n*Available Commands:*\n\n*Invoice Management:*\n/approve_inv_{number} - Approve invoice\n/reject_inv_{number} [reason] - Reject invoice\n\n*Investment Management:*\n/approve_investment_{id} - Approve investment\n/reject_investment_{id} [reason] - Reject investment\n\n*Information:*\n/balance - Treasury balance\n/status_{id} - Check status\n/report - Daily summary\n/pending - Show pending approvals\n\n*Examples:*\n_/approve_inv_INV2024001_\n_/reject_inv_INV2024002 Budget exceeded_\n_/status_INV2024001_`;
  }
  // BALANCE
  else if (msgLower === '/balance' || msgLower === 'balance' || msgLower === 'saldo') {
    const currentDate = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    response = `*Treasury Balance Report*\n\nCurrent Balance: *SAR 2,450,000*\n\nAccount Details:\n- Operating Account: SAR 1,200,000\n- Investment Account: SAR 950,000\n- Reserve Fund: SAR 300,000\n\nStatus: Normal\nLast Updated: ${currentDate}`;
  }
  // REPORT
  else if (msgLower === '/report' || msgLower === 'report' || msgLower === 'laporan') {
    const today = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: '2-digit', month: 'short', year: 'numeric' });
    response = `*Daily Summary Report*\n${today}\n\n*Pending Approvals:*\n- Invoices: 3 pending\n- Investments: 2 pending\n\n*Today's Activity:*\n- Processed: 5 invoices\n- Approved: 4\n- Rejected: 1\n\n*Treasury Movement:*\n- Inflow: SAR 150,000\n- Outflow: SAR 85,000\n- Net: +SAR 65,000`;
  }
  // PENDING
  else if (msgLower === '/pending' || msgLower === 'pending') {
    response = `*Pending Approvals*\n\n*Invoices Awaiting Approval:*\n1. INV2024015 - SAR 75,000\n   Vendor: Al-Rajhi Construction\n2. INV2024016 - SAR 45,000\n   Vendor: Saudi Tech Solutions\n3. INV2024017 - SAR 120,000\n   Vendor: Gulf Trading Co.\n\n*Investments Awaiting Approval:*\n1. INVEST-2024-008\n   Type: Sukuk | Amount: SAR 500,000\n2. INVEST-2024-009\n   Type: Real Estate | Amount: SAR 1,200,000\n\nReply with /approve_inv_{number} or /reject_inv_{number} [reason]`;
  }
  // APPROVE INVOICE
  else if (msgLower.match(/^\/approve_inv_([\w-]+)$/i)) {
    const match = msgLower.match(/^\/approve_inv_([\w-]+)$/i);
    const invNumber = match[1].toUpperCase();
    response = `*Invoice Approved*\n\nInvoice: *${invNumber}*\nStatus: APPROVED\nApproved by: ${senderName}\nTimestamp: ${new Date().toISOString()}\n\n_Journal entry will be posted automatically._`;
  }
  // REJECT INVOICE
  else if (msgLower.match(/^\/reject_inv_([\w-]+)(\s+.+)?$/i)) {
    const match = message.match(/^\/reject_inv_([\w-]+)(\s+.+)?$/i);
    const invNumber = match[1].toUpperCase();
    const reason = match[2] ? match[2].trim() : 'No reason provided';
    response = `*Invoice Rejected*\n\nInvoice: *${invNumber}*\nStatus: REJECTED\nRejected by: ${senderName}\nReason: ${reason}\nTimestamp: ${new Date().toISOString()}\n\n_Vendor will be notified of rejection._`;
  }
  // APPROVE INVESTMENT
  else if (msgLower.match(/^\/approve_investment_([\w-]+)$/i)) {
    const match = msgLower.match(/^\/approve_investment_([\w-]+)$/i);
    const investId = match[1].toUpperCase();
    response = `*Investment Approved*\n\nInvestment ID: *${investId}*\nStatus: APPROVED\nApproved by: ${senderName}\nTimestamp: ${new Date().toISOString()}\n\n_Deal will proceed to execution phase._`;
  }
  // REJECT INVESTMENT
  else if (msgLower.match(/^\/reject_investment_([\w-]+)(\s+.+)?$/i)) {
    const match = message.match(/^\/reject_investment_([\w-]+)(\s+.+)?$/i);
    const investId = match[1].toUpperCase();
    const reason = match[2] ? match[2].trim() : 'No reason provided';
    response = `*Investment Rejected*\n\nInvestment ID: *${investId}*\nStatus: REJECTED\nRejected by: ${senderName}\nReason: ${reason}\nTimestamp: ${new Date().toISOString()}\n\n_Investment committee will be notified._`;
  }
  // STATUS
  else if (msgLower.match(/^\/status_([\w-]+)$/i)) {
    const match = msgLower.match(/^\/status_([\w-]+)$/i);
    const id = match[1].toUpperCase();
    if (id.startsWith('INV')) {
      response = `*Invoice Status*\n\nInvoice: *${id}*\nStatus: Pending Approval\nAmount: SAR 75,000\nVendor: Al-Rajhi Construction\nSubmitted: 2 days ago\nDue Date: 15 Jan 2026\n\n_Reply /approve_inv_${id} to approve_`;
    } else if (id.startsWith('INVEST')) {
      response = `*Investment Status*\n\nID: *${id}*\nStatus: Under Review\nType: Sukuk\nAmount: SAR 500,000\nRisk Score: 3/10 (Low)\nShariah: Compliant\n\n_Reply /approve_investment_${id} to approve_`;
    } else {
      response = `*Status Check*\n\nID: *${id}*\nStatus: Not Found\n\n_Please check the ID and try again._`;
    }
  }
  // GREETINGS
  else if (msgLower.match(/^(halo|hai|hi|hello|hey|assalamualaikum|salam|good morning|good afternoon|good evening|selamat pagi|selamat siang|selamat sore|selamat malam)/i)) {
    const hour = new Date().getHours();
    let timeGreeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
    response = `${timeGreeting}, ${senderName}!\n\nWelcome to *BPKH Limited* WhatsApp Assistant.\n\nI can help you with:\n- Invoice approvals\n- Investment approvals\n- Treasury balance\n- Status checks\n\nType */help* for all available commands.`;
  }
  // THANK YOU
  else if (msgLower.match(/^(terima kasih|thanks|thank you|thx|makasih|syukran)/i)) {
    response = `You're welcome, ${senderName}!\n\nFeel free to reach out if you need any assistance.\nType */help* for available commands.`;
  }

  return response ? { chatId, message: response } : null;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(200).json({ status: 'ok', endpoint: '/api/whatsapp' });
  }

  try {
    const body = req.body;
    const payload = body.payload || body;

    console.log('Received:', JSON.stringify(payload).substring(0, 200));

    const result = processMessage(payload);

    if (result) {
      await sendWhatsApp(result.chatId, result.message);
      console.log('Sent response to:', result.chatId);
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: error.message });
  }
};
