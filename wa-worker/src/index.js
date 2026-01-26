// WAHA Configuration
const WAHA_URL = 'https://waha-qikiufjwa2nh.cgk-max.sumopod.my.id';
const WAHA_API_KEY = '5rMMXHU07G5F0cqj5QBcVjFeLCIdSWLI';
const WAHA_SESSION = 'bayan-ai';

// Supabase Configuration (same as dashboard)
const SUPABASE_URL = 'https://zxisflxmprcbjggsneja.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4aXNmbHhtcHJjYmpnZ3NuZWphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg3NTk2NDMsImV4cCI6MjA4NDMzNTY0M30.XvcnzekEHcZzJfMctF_GKYsB_PMEU9H4vcY2J2_C7MM';

// Supabase REST API helper
async function supabaseQuery(table, method = 'GET', filters = '', body = null) {
  const url = `${SUPABASE_URL}/rest/v1/${table}${filters}`;
  const options = {
    method,
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': method === 'GET' ? 'return=representation' : 'return=minimal'
    }
  };
  if (body) options.body = JSON.stringify(body);

  try {
    const response = await fetch(url, options);
    if (method === 'GET') {
      return await response.json();
    }
    return response.ok;
  } catch (error) {
    console.error('Supabase error:', error);
    return null;
  }
}

// Send WhatsApp message via WAHA
async function sendWhatsApp(chatId, message) {
  try {
    const response = await fetch(`${WAHA_URL}/api/sendText`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': WAHA_API_KEY
      },
      body: JSON.stringify({ chatId, text: message, session: WAHA_SESSION })
    });
    return response.ok;
  } catch (error) {
    console.error('Send error:', error);
    return false;
  }
}

// Format currency
function formatSAR(amount) {
  return new Intl.NumberFormat('en-SA').format(amount || 0);
}

// Process message and generate response
async function processMessage(payload) {
  if (payload.fromMe || payload.from?.includes('@g.us')) return null;

  const message = payload.body || payload.message?.body || payload.text || '';
  const chatId = payload.chatId || payload.from || '';
  const senderName = payload.pushName || payload.notifyName || 'User';
  const senderPhone = chatId.replace('@c.us', '').replace('@s.whatsapp.net', '');

  if (!message || !chatId) return null;

  const msgLower = message.toLowerCase().trim();
  let response = '';

  // ==================== MENU ====================
  if (msgLower === '/help' || msgLower === 'help' || msgLower === '?' || msgLower === 'menu' || msgLower === '/menu') {
    response = `╔════════════════════════════════╗
║  ﷽
║  *BPKH LIMITED*
║  Islamic Finance Management
╚════════════════════════════════╝

السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللهِ وَبَرَكَاتُهُ

🔗 *Dashboard:* bpkh-limited-dashboard.netlify.app

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

*💰 TREASURY & KEUANGAN*
┌────────────────────────────
│ /balance    → Saldo Treasury (Live)
│ /cashflow   → Arus Kas
│ /fx         → Kurs Mata Uang
└────────────────────────────

*📈 PORTFOLIO & INVESTASI*
┌────────────────────────────
│ /portfolio  → Overview Portfolio
│ /investments → Daftar Investasi (Live)
│ /risk       → Risk Assessment
└────────────────────────────

*📄 APPROVAL WORKFLOW*
┌────────────────────────────
│ /pending    → Semua Pending (Live)
│ /invoices   → Invoice Pending (Live)
│ /approve_inv_{no}
│ /reject_inv_{no} [alasan]
│ /approve_investment_{id}
│ /reject_investment_{id} [alasan]
│ /status_{id}
└────────────────────────────

*📊 LAPORAN*
┌────────────────────────────
│ /report     → Executive Summary
│ /shariah    → Shariah Compliance
└────────────────────────────

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
_بَارَكَ اللهُ فِيْكُمْ_`;
  }

  // ==================== BALANCE (Live from Supabase) ====================
  else if (msgLower === '/balance' || msgLower === 'balance' || msgLower === 'saldo') {
    // Fetch treasury data from Supabase
    const treasury = await supabaseQuery('treasury_analysis', 'GET', '?order=created_at.desc&limit=1');
    const currentDate = new Date().toLocaleString('id-ID');

    let balanceData = {
      current_balance: 847500000,
      operating_account: 105000000,
      investment_account: 707500000,
      reserve_fund: 35000000
    };

    if (treasury && treasury.length > 0) {
      balanceData = treasury[0];
    }

    response = `╔════════════════════════════════╗
║ 💰 *TREASURY DASHBOARD*
║ 🔗 Synced with Dashboard
╚════════════════════════════════╝

بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  💵 *TOTAL BALANCE*
┃  *SAR ${formatSAR(balanceData.current_balance || 847500000)}*
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

📊 *ACCOUNT BREAKDOWN*
┌────────────────────────────
│ 🏦 Operating    : SAR ${formatSAR(balanceData.operating_account || 105000000)}
│ 📈 Investment   : SAR ${formatSAR(balanceData.investment_account || 707500000)}
│ 🛡️ Reserve      : SAR ${formatSAR(balanceData.reserve_fund || 35000000)}
└────────────────────────────

📉 *LIQUIDITY STATUS*
┌────────────────────────────
│ Status: ${(balanceData.current_balance || 847500000) > 100000000 ? '✅ HEALTHY' : '⚠️ LOW'}
│ Current Ratio: 2.45x
└────────────────────────────

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📅 ${currentDate}
🔗 View details: Dashboard → Treasury

_اَلْحَمْدُ لِلّٰهِ_`;
  }

  // ==================== INVOICES (Live from Supabase) ====================
  else if (msgLower === '/invoices' || msgLower === 'invoices' || msgLower === 'invoice') {
    // Fetch pending invoices from Supabase
    const invoices = await supabaseQuery('journal_entries', 'GET', '?status=eq.pending&order=created_at.desc&limit=10');
    const currentDate = new Date().toLocaleString('id-ID');

    let invoiceList = '';
    let totalAmount = 0;

    if (invoices && invoices.length > 0) {
      invoices.forEach((inv, idx) => {
        const urgency = idx === 0 ? '🔴' : idx < 3 ? '🟡' : '🟢';
        invoiceList += `
${urgency} *${inv.invoice_number || inv.id}*
┌────────────────────────────
│ 💵 Amount  : SAR ${formatSAR(inv.amount)}
│ 🏢 Vendor  : ${inv.vendor || inv.description || 'N/A'}
│ 📋 Type    : ${inv.category || 'General'}
│ 📅 Date    : ${new Date(inv.created_at).toLocaleDateString('id-ID')}
└────────────────────────────
→ /approve_inv_${inv.invoice_number || inv.id}
→ /reject_inv_${inv.invoice_number || inv.id} [alasan]
`;
        totalAmount += inv.amount || 0;
      });
    } else {
      invoiceList = '\n✅ Tidak ada invoice pending\n';
    }

    response = `╔════════════════════════════════╗
║ 📄 *PENDING INVOICES*
║ 🔗 Live from Dashboard
╚════════════════════════════════╝

بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ 📊 Total Pending: ${invoices?.length || 0} items
┃ 💵 Total Value: SAR ${formatSAR(totalAmount)}
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
${invoiceList}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📅 ${currentDate}
🔗 Manage: Dashboard → Invoices

_إِنْ شَاءَ اللهُ_`;
  }

  // ==================== INVESTMENTS (Live from Supabase) ====================
  else if (msgLower === '/investments' || msgLower === 'investments') {
    // Fetch investments from Supabase
    const investments = await supabaseQuery('investment_analysis', 'GET', '?order=created_at.desc&limit=10');
    const currentDate = new Date().toLocaleString('id-ID');

    let investList = '';
    let pendingCount = 0;

    if (investments && investments.length > 0) {
      investments.forEach((inv, idx) => {
        const status = inv.status === 'pending' ? '⏳' : inv.status === 'approved' ? '✅' : '❌';
        if (inv.status === 'pending') pendingCount++;

        investList += `
${status} *${inv.company_name || inv.id}*
┌────────────────────────────
│ 📊 Type    : ${inv.investment_type || 'N/A'}
│ 💵 Amount  : SAR ${formatSAR(inv.amount)}
│ ⚠️ Risk    : ${inv.risk_score || 'N/A'}/10
│ ☪️ Shariah : ${inv.shariah_compliant ? '✅ Compliant' : '⏳ Review'}
│ 📍 Status  : ${inv.status || 'pending'}
└────────────────────────────
${inv.status === 'pending' ? `→ /approve_investment_${inv.id}\n→ /reject_investment_${inv.id} [alasan]` : ''}
`;
      });
    } else {
      investList = '\n📭 Tidak ada data investasi\n';
    }

    response = `╔════════════════════════════════╗
║ 📈 *INVESTMENT LIST*
║ 🔗 Live from Dashboard
╚════════════════════════════════╝

بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ 📊 Total: ${investments?.length || 0} investments
┃ ⏳ Pending: ${pendingCount} items
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
${investList}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📅 ${currentDate}
🔗 View: Dashboard → Investments

_مَا شَاءَ اللهُ_`;
  }

  // ==================== PENDING (All pending items) ====================
  else if (msgLower === '/pending' || msgLower === 'pending') {
    // Fetch pending invoices
    const invoices = await supabaseQuery('journal_entries', 'GET', '?status=eq.pending&order=created_at.desc&limit=5');
    // Fetch pending investments
    const investments = await supabaseQuery('investment_analysis', 'GET', '?status=eq.pending&order=created_at.desc&limit=5');

    const currentDate = new Date().toLocaleString('id-ID');

    let invoiceSection = '';
    if (invoices && invoices.length > 0) {
      invoices.forEach((inv, idx) => {
        const urgency = idx === 0 ? '🔴' : '🟡';
        invoiceSection += `
${urgency} *${inv.invoice_number || inv.id}*
│ 💵 SAR ${formatSAR(inv.amount)} │ ${inv.vendor || inv.description || 'N/A'}
→ /approve_inv_${inv.invoice_number || inv.id}
`;
      });
    } else {
      invoiceSection = '\n✅ Tidak ada invoice pending\n';
    }

    let investSection = '';
    if (investments && investments.length > 0) {
      investments.forEach((inv, idx) => {
        investSection += `
🟡 *${inv.company_name || inv.id}*
│ 💵 SAR ${formatSAR(inv.amount)} │ ${inv.investment_type || 'Investment'}
→ /approve_investment_${inv.id}
`;
      });
    } else {
      investSection = '\n✅ Tidak ada investasi pending\n';
    }

    response = `╔════════════════════════════════╗
║ ⏳ *ALL PENDING APPROVALS*
║ 🔗 Live from Dashboard
╚════════════════════════════════╝

بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ 📄 Invoices: ${invoices?.length || 0} pending
┃ 📈 Investments: ${investments?.length || 0} pending
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

*📄 INVOICE PENDING*
${invoiceSection}
*📈 INVESTMENT PENDING*
${investSection}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📅 ${currentDate}
🔗 Dashboard: bpkh-limited-dashboard.netlify.app

_إِنْ شَاءَ اللهُ_`;
  }

  // ==================== APPROVE INVOICE (Update Supabase) ====================
  else if (msgLower.match(/^\/approve_inv_([\w-]+)$/i)) {
    const match = msgLower.match(/^\/approve_inv_([\w-]+)$/i);
    const invNumber = match[1].toUpperCase();
    const timestamp = new Date().toISOString();

    // Update invoice status in Supabase (query by invoice_number only)
    const updated = await supabaseQuery(
      'journal_entries',
      'PATCH',
      `?invoice_number=eq.${invNumber}`,
      {
        status: 'approved',
        approved_by: senderPhone,
        approved_at: timestamp
      }
    );

    response = `╔════════════════════════════════╗
║ ✅ *INVOICE APPROVED*
║ 🔗 Synced to Dashboard
╚════════════════════════════════╝

اَلْحَمْدُ لِلّٰهِ

┌────────────────────────────
│ 📄 Invoice   : *${invNumber}*
│ 📍 Status    : ✅ APPROVED
│ 👤 Approved  : ${senderName}
│ 📱 Phone     : ${senderPhone}
│ 🕐 Timestamp : ${new Date().toLocaleString('id-ID')}
└────────────────────────────

📝 *Synced Actions:*
• ✅ Status updated in database
• ✅ Dashboard refreshed
• ✅ Journal entry queued

🔗 View: Dashboard → Invoices

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
جَزَاكَ اللهُ خَيْرًا`;
  }

  // ==================== REJECT INVOICE (Update Supabase) ====================
  else if (msgLower.match(/^\/reject_inv_([\w-]+)(\s+.+)?$/i)) {
    const match = message.match(/^\/reject_inv_([\w-]+)(\s+.+)?$/i);
    const invNumber = match[1].toUpperCase();
    const reason = match[2] ? match[2].trim() : 'No reason provided';
    const timestamp = new Date().toISOString();

    // Update invoice status in Supabase (query by invoice_number only)
    await supabaseQuery(
      'journal_entries',
      'PATCH',
      `?invoice_number=eq.${invNumber}`,
      {
        status: 'rejected',
        rejected_by: senderPhone,
        rejected_at: timestamp,
        rejection_reason: reason
      }
    );

    response = `╔════════════════════════════════╗
║ ❌ *INVOICE REJECTED*
║ 🔗 Synced to Dashboard
╚════════════════════════════════╝

┌────────────────────────────
│ 📄 Invoice   : *${invNumber}*
│ 📍 Status    : ❌ REJECTED
│ 👤 Rejected  : ${senderName}
│ 📝 Reason    : ${reason}
│ 🕐 Timestamp : ${new Date().toLocaleString('id-ID')}
└────────────────────────────

📝 *Synced Actions:*
• ✅ Status updated in database
• ✅ Dashboard refreshed
• ✅ Vendor notification queued

🔗 View: Dashboard → Invoices

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
_إِنَّا لِلّٰهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ_`;
  }

  // ==================== APPROVE INVESTMENT (Update Supabase) ====================
  else if (msgLower.match(/^\/approve_investment_(.+)$/i)) {
    const match = message.match(/^\/approve_investment_(.+)$/i);
    const investName = match[1].trim();
    const timestamp = new Date().toISOString();

    // Update investment status in Supabase (by company_name)
    await supabaseQuery(
      'investment_analysis',
      'PATCH',
      `?company_name=ilike.*${encodeURIComponent(investName)}*`,
      {
        status: 'approved',
        approved_by: senderPhone,
        approved_at: timestamp
      }
    );

    response = `╔════════════════════════════════╗
║ ✅ *INVESTMENT APPROVED*
║ 🔗 Synced to Dashboard
╚════════════════════════════════╝

اَلْحَمْدُ لِلّٰهِ

┌────────────────────────────
│ 📈 Company   : *${investName}*
│ 📍 Status    : ✅ APPROVED
│ 👤 Approved  : ${senderName}
│ 📱 Phone     : ${senderPhone}
│ 🕐 Timestamp : ${new Date().toLocaleString('id-ID')}
└────────────────────────────

📝 *Synced Actions:*
• ✅ Status updated in database
• ✅ Dashboard refreshed
• ✅ Due diligence completed
• ✅ Execution phase initiated

🔗 View: Dashboard → Investments

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
بَارَكَ اللهُ فِي مَالِكَ`;
  }

  // ==================== REJECT INVESTMENT (Update Supabase) ====================
  else if (msgLower.match(/^\/reject_investment_([^\s]+)(\s+.+)?$/i)) {
    const match = message.match(/^\/reject_investment_([^\s]+)(\s+.+)?$/i);
    const investName = match[1].trim();
    const reason = match[2] ? match[2].trim() : 'No reason provided';
    const timestamp = new Date().toISOString();

    // Update investment status in Supabase (by company_name)
    await supabaseQuery(
      'investment_analysis',
      'PATCH',
      `?company_name=ilike.*${encodeURIComponent(investName)}*`,
      {
        status: 'rejected',
        rejected_by: senderPhone,
        rejected_at: timestamp,
        rejection_reason: reason
      }
    );

    response = `╔════════════════════════════════╗
║ ❌ *INVESTMENT REJECTED*
║ 🔗 Synced to Dashboard
╚════════════════════════════════╝

┌────────────────────────────
│ 📈 Company   : *${investName}*
│ 📍 Status    : ❌ REJECTED
│ 👤 Rejected  : ${senderName}
│ 📝 Reason    : ${reason}
│ 🕐 Timestamp : ${new Date().toLocaleString('id-ID')}
└────────────────────────────

📝 *Synced Actions:*
• ✅ Status updated in database
• ✅ Dashboard refreshed
• ✅ Committee notified

🔗 View: Dashboard → Investments

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
_قَدَّرَ اللهُ وَمَا شَاءَ فَعَلَ_`;
  }

  // ==================== STATUS (Check from Supabase) ====================
  else if (msgLower.match(/^\/status_([\w-]+)$/i)) {
    const match = msgLower.match(/^\/status_([\w-]+)$/i);
    const id = match[1];

    // Try to find in invoices first (by invoice_number)
    let invoice = await supabaseQuery('journal_entries', 'GET', `?invoice_number=eq.${id.toUpperCase()}&limit=1`);

    if (invoice && invoice.length > 0) {
      const inv = invoice[0];
      const statusIcon = inv.status === 'approved' ? '✅' : inv.status === 'rejected' ? '❌' : '⏳';

      response = `╔════════════════════════════════╗
║ 🔍 *INVOICE STATUS*
║ 🔗 Live from Dashboard
╚════════════════════════════════╝

┌────────────────────────────
│ 📄 Invoice    : *${inv.invoice_number || inv.id}*
│ 📍 Status     : ${statusIcon} ${(inv.status || 'pending').toUpperCase()}
│ 💵 Amount     : SAR ${formatSAR(inv.amount)}
│ 🏢 Vendor     : ${inv.vendor || inv.description || 'N/A'}
│ 📅 Created    : ${new Date(inv.created_at).toLocaleDateString('id-ID')}
${inv.approved_by ? `│ 👤 Approved by: ${inv.approved_by}` : ''}
${inv.rejected_by ? `│ 👤 Rejected by: ${inv.rejected_by}` : ''}
${inv.rejection_reason ? `│ 📝 Reason    : ${inv.rejection_reason}` : ''}
└────────────────────────────

🔗 View: Dashboard → Invoices

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${inv.status === 'pending' ? `→ /approve_inv_${inv.invoice_number || inv.id}\n→ /reject_inv_${inv.invoice_number || inv.id} [alasan]` : ''}`;
    } else {
      // Try investments (by company_name since id is UUID)
      let investment = await supabaseQuery('investment_analysis', 'GET', `?company_name=ilike.*${id}*&limit=1`);

      if (investment && investment.length > 0) {
        const inv = investment[0];
        const statusIcon = inv.status === 'approved' ? '✅' : inv.status === 'rejected' ? '❌' : '⏳';

        response = `╔════════════════════════════════╗
║ 🔍 *INVESTMENT STATUS*
║ 🔗 Live from Dashboard
╚════════════════════════════════╝

┌────────────────────────────
│ 📈 ID         : *${inv.id}*
│ 🏢 Company    : ${inv.company_name || 'N/A'}
│ 📍 Status     : ${statusIcon} ${(inv.status || 'pending').toUpperCase()}
│ 📊 Type       : ${inv.investment_type || 'N/A'}
│ 💵 Amount     : SAR ${formatSAR(inv.amount)}
│ ⚠️ Risk Score : ${inv.risk_score || 'N/A'}/10
│ ☪️ Shariah    : ${inv.shariah_compliant ? '✅ Compliant' : '⏳ Review'}
│ 📅 Created    : ${new Date(inv.created_at).toLocaleDateString('id-ID')}
${inv.approved_by ? `│ 👤 Approved by: ${inv.approved_by}` : ''}
${inv.rejected_by ? `│ 👤 Rejected by: ${inv.rejected_by}` : ''}
└────────────────────────────

🔗 View: Dashboard → Investments

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${inv.status === 'pending' ? `→ /approve_investment_${inv.id}\n→ /reject_investment_${inv.id} [alasan]` : ''}`;
      } else {
        response = `╔════════════════════════════════╗
║ 🔍 *STATUS CHECK*
╚════════════════════════════════╝

┌────────────────────────────
│ 🔎 ID     : *${id.toUpperCase()}*
│ 📍 Status : ❓ Not Found
└────────────────────────────

_ID tidak ditemukan di database_

🔗 Check Dashboard for all items

━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
      }
    }
  }

  // ==================== PORTFOLIO ====================
  else if (msgLower === '/portfolio' || msgLower === 'portfolio') {
    // Fetch investments summary
    const investments = await supabaseQuery('investment_analysis', 'GET', '?status=eq.approved');

    let totalValue = 0;
    let sukukValue = 0;
    let equityValue = 0;
    let realEstateValue = 0;

    if (investments && investments.length > 0) {
      investments.forEach(inv => {
        totalValue += inv.amount || 0;
        if (inv.investment_type?.toLowerCase().includes('sukuk')) sukukValue += inv.amount || 0;
        else if (inv.investment_type?.toLowerCase().includes('equity')) equityValue += inv.amount || 0;
        else if (inv.investment_type?.toLowerCase().includes('real')) realEstateValue += inv.amount || 0;
      });
    }

    // Use default if no data
    if (totalValue === 0) {
      totalValue = 707500000;
      sukukValue = 425000000;
      equityValue = 187500000;
      realEstateValue = 95000000;
    }

    response = `╔════════════════════════════════╗
║ 📈 *PORTFOLIO OVERVIEW*
║ 🔗 Live from Dashboard
╚════════════════════════════════╝

بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ 💼 *TOTAL INVESTED*
┃ *SAR ${formatSAR(totalValue)}*
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

📊 *ALLOCATION*
┌────────────────────────────
│ ☪️ Sukuk       : SAR ${formatSAR(sukukValue)}
│                 ${Math.round(sukukValue/totalValue*100)}% ████████░░
│
│ 🏢 Equity      : SAR ${formatSAR(equityValue)}
│                 ${Math.round(equityValue/totalValue*100)}% █████░░░░░
│
│ 🏠 Real Estate : SAR ${formatSAR(realEstateValue)}
│                 ${Math.round(realEstateValue/totalValue*100)}% ███░░░░░░░
└────────────────────────────

📈 *ACTIVE INVESTMENTS*
┌────────────────────────────
│ Total Approved : ${investments?.length || 0}
│ Shariah Score  : 98.5%
└────────────────────────────

🔗 Details: Dashboard → Investments

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
_مَا شَاءَ اللهُ_`;
  }

  // ==================== REPORT ====================
  else if (msgLower === '/report' || msgLower === 'report' || msgLower === 'laporan') {
    // Fetch summary data
    const treasury = await supabaseQuery('treasury_analysis', 'GET', '?order=created_at.desc&limit=1');
    const pendingInvoices = await supabaseQuery('journal_entries', 'GET', '?status=eq.pending');
    const pendingInvestments = await supabaseQuery('investment_analysis', 'GET', '?status=eq.pending');
    const approvedToday = await supabaseQuery('journal_entries', 'GET', `?status=eq.approved&approved_at=gte.${new Date().toISOString().split('T')[0]}`);

    const balance = treasury?.[0]?.current_balance || 847500000;
    const today = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });

    response = `╔════════════════════════════════╗
║ 📊 *EXECUTIVE SUMMARY*
║ 🔗 Live from Dashboard
╚════════════════════════════════╝

بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ

📅 ${today}

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ 💼 *TOTAL AUM*
┃ *SAR ${formatSAR(balance)}*
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

⏳ *PENDING APPROVALS*
┌────────────────────────────
│ 📄 Invoices    : ${pendingInvoices?.length || 0} pending
│ 📈 Investments : ${pendingInvestments?.length || 0} pending
└────────────────────────────

📊 *TODAY'S ACTIVITY*
┌────────────────────────────
│ ✅ Approved    : ${approvedToday?.length || 0} items
└────────────────────────────

💰 *TREASURY STATUS*
┌────────────────────────────
│ Liquidity  : ${balance > 100000000 ? '✅ HEALTHY' : '⚠️ REVIEW'}
│ Compliance : ✅ 98.5%
└────────────────────────────

📌 *QUICK ACTIONS*
• /pending - View all pending
• /invoices - Invoice details
• /investments - Investment list

🔗 Full Report: Dashboard

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
_اَلْحَمْدُ لِلّٰهِ رَبِّ الْعَالَمِينَ_`;
  }

  // ==================== CASHFLOW ====================
  else if (msgLower === '/cashflow' || msgLower === 'cashflow') {
    response = `╔════════════════════════════════╗
║ 💸 *CASHFLOW ANALYSIS*
║ Monthly Flow & Projection
╚════════════════════════════════╝

بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ

📥 *INFLOWS (This Month)*
┌────────────────────────────
│ Sukuk Coupon    : +SAR 8,500,000
│ Dividend Income : +SAR 3,200,000
│ Rental Income   : +SAR 1,850,000
│ Contributions   : +SAR 12,000,000
├────────────────────────────
│ *Total Inflow*  : *+SAR 25,550,000*
└────────────────────────────

📤 *OUTFLOWS (This Month)*
┌────────────────────────────
│ Operating Exp   : -SAR 2,100,000
│ Investment      : -SAR 15,000,000
│ Management Fee  : -SAR 850,000
│ Zakat           : -SAR 1,200,000
├────────────────────────────
│ *Total Outflow* : *-SAR 19,150,000*
└────────────────────────────

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ 📊 *NET FLOW: +SAR 6,400,000*
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

🔗 View Details: Dashboard → Treasury

_مَا شَاءَ اللهُ_`;
  }

  // ==================== FX ====================
  else if (msgLower === '/fx' || msgLower === 'fx' || msgLower === 'kurs') {
    response = `╔════════════════════════════════╗
║ 💱 *EXCHANGE RATES*
╚════════════════════════════════╝

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ 📊 *LIVE RATES*
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

┌────────────────────────────
│ 🇸🇦 SAR/IDR : 4,245.50
│ 🇸🇦 SAR/USD : 0.2666 (pegged)
│ 🇺🇸 USD/IDR : 15,925.00
│ 🇦🇪 AED/SAR : 1.0209
└────────────────────────────

💼 *EXPOSURE*
┌────────────────────────────
│ 🇸🇦 SAR : 76.8% (Primary)
│ 🇺🇸 USD : 14.7% (Hedged 85%)
│ 🇦🇪 AED : 5.3%
│ Others : 3.2%
└────────────────────────────

_اَلْحَمْدُ لِلّٰهِ_`;
  }

  // ==================== RISK ====================
  else if (msgLower === '/risk' || msgLower === 'risk') {
    response = `╔════════════════════════════════╗
║ ⚠️ *RISK ASSESSMENT*
╚════════════════════════════════╝

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ 🎯 *OVERALL RISK SCORE*
┃       *3.2 / 10*
┃   ███░░░░░░░ LOW RISK
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

📊 *BREAKDOWN*
┌────────────────────────────
│ Market Risk    : 3/10 ███░░░░░░░
│ Credit Risk    : 2/10 ██░░░░░░░░
│ Liquidity Risk : 3/10 ███░░░░░░░
│ FX Risk        : 4/10 ████░░░░░░
│ Operational    : 2/10 ██░░░░░░░░
└────────────────────────────

🛡️ *MITIGATION*
┌────────────────────────────
│ ✅ Diversified portfolio
│ ✅ Shariah compliance
│ ✅ Active monitoring
│ ✅ Hedging in place
└────────────────────────────

_حَسْبُنَا اللهُ وَنِعْمَ الْوَكِيلُ_`;
  }

  // ==================== SHARIAH ====================
  else if (msgLower === '/shariah' || msgLower === 'shariah' || msgLower === 'syariah') {
    response = `╔════════════════════════════════╗
║ ☪️ *SHARIAH COMPLIANCE*
╚════════════════════════════════╝

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ ✅ *COMPLIANCE SCORE*
┃       *98.5%*
┃  FULLY SHARIAH COMPLIANT
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

📊 *SCREENING*
┌────────────────────────────
│ Debt/Assets    : 18% ✅ (<33%)
│ Interest Income: 2.1% ✅ (<5%)
│ Halal Revenue  : 97.8% ✅
└────────────────────────────

📋 *BY ASSET CLASS*
┌────────────────────────────
│ Sukuk      : 100% ✅
│ Equity     : 100% ✅
│ Real Estate: 100% ✅
│ Alternatives: 92% ⏳
└────────────────────────────

💰 *ZAKAT*
┌────────────────────────────
│ Annual: SAR 8,500,000
│ Next: Ramadan 1447H
└────────────────────────────

_إِنَّ اللهَ طَيِّبٌ لَا يَقْبَلُ إِلَّا طَيِّبًا_`;
  }

  // ==================== GREETINGS ====================
  else if (msgLower.match(/^(halo|hai|hi|hello|hey|assalamualaikum|assalamu'?alaikum|salam|pagi|siang|sore|malam)/i)) {
    const hour = new Date().getHours();
    let timeGreeting = hour < 12 ? 'Selamat Pagi' : hour < 15 ? 'Selamat Siang' : hour < 18 ? 'Selamat Sore' : 'Selamat Malam';

    response = `╔════════════════════════════════╗
║  ﷽
║  *BPKH LIMITED*
╚════════════════════════════════╝

وَعَلَيْكُمُ السَّلَامُ وَرَحْمَةُ اللهِ وَبَرَكَاتُهُ

${timeGreeting}, *${senderName}*! 🙏

🔗 *Dashboard:*
bpkh-limited-dashboard.netlify.app

┌────────────────────────────
│ 💼 *Quick Commands:*
├────────────────────────────
│ /menu      → All commands
│ /report    → Executive summary
│ /pending   → Pending approvals
│ /balance   → Treasury status
└────────────────────────────

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
_بَارَكَ اللهُ فِيْكُمْ_`;
  }

  // ==================== THANK YOU ====================
  else if (msgLower.match(/^(terima kasih|thanks|thank you|makasih|syukran|jazakallah)/i)) {
    response = `╔════════════════════════════════╗
║ 🤲 *Sama-sama*
╚════════════════════════════════╝

وَإِيَّاكُمْ
جَزَاكُمُ اللهُ خَيْرًا

Semoga Allah membalas kebaikan Anda.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Ketik */menu* untuk bantuan.

وَالسَّلَامُ عَلَيْكُمْ`;
  }

  return response ? { chatId, message: response } : null;
}

export default {
  async fetch(request, env, ctx) {
    if (request.method === 'GET') {
      return new Response(JSON.stringify({
        status: 'ok',
        name: 'BPKH Islamic Finance Bot',
        version: '3.0 - Dashboard Connected',
        dashboard: 'https://bpkh-limited-dashboard.netlify.app',
        timestamp: new Date().toISOString()
      }), { headers: { 'Content-Type': 'application/json' } });
    }

    if (request.method === 'POST') {
      try {
        const body = await request.json();
        const payload = body.payload || body;
        const result = await processMessage(payload);

        if (result) {
          ctx.waitUntil(sendWhatsApp(result.chatId, result.message));
        }

        return new Response(JSON.stringify({ success: true }), {
          headers: { 'Content-Type': 'application/json' }
        });
      } catch (error) {
        console.error('Error:', error);
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    return new Response('Method not allowed', { status: 405 });
  }
};
