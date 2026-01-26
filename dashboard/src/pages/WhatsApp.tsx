import { useState, useEffect } from 'react';
import { Header } from '../components/Layout';
import { sendTextMessage, getSessionStatus, type WAHASession } from '../services/waha';
import { Send, Phone, CheckCircle, XCircle, RefreshCw } from 'lucide-react';

const QUICK_COMMANDS = [
  { label: 'Check Balance', command: '/balance' },
  { label: 'Pending Items', command: '/pending' },
  { label: 'Help', command: '/help' },
];

export function WhatsApp() {
  const [session, setSession] = useState<WAHASession | null>(null);
  const [loading, setLoading] = useState(true);
  const [chatId, setChatId] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sentMessages, setSentMessages] = useState<
    { chatId: string; message: string; timestamp: Date; success: boolean }[]
  >([]);

  useEffect(() => {
    checkSession();
  }, []);

  async function checkSession() {
    setLoading(true);
    const status = await getSessionStatus();
    setSession(status);
    setLoading(false);
  }

  async function handleSend() {
    if (!chatId || !message) return;

    setSending(true);
    const success = await sendTextMessage(chatId, message);
    setSentMessages([
      { chatId, message, timestamp: new Date(), success },
      ...sentMessages,
    ]);

    if (success) {
      setMessage('');
    }
    setSending(false);
  }

  function handleQuickCommand(command: string) {
    setMessage(command);
  }

  const isConnected = session?.status === 'WORKING';

  return (
    <div>
      <Header title="WhatsApp Integration" subtitle="Send messages and commands" />
      <div className="p-6">
        {/* Session Status */}
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div
                className={`p-3 rounded-xl ${
                  isConnected ? 'bg-emerald-900/50 border border-emerald-600/50' : 'bg-red-900/50 border border-red-600/50'
                }`}
              >
                <Phone
                  size={24}
                  className={isConnected ? 'text-emerald-400' : 'text-red-400'}
                />
              </div>
              <div>
                <h3 className="font-semibold text-white">WhatsApp Session</h3>
                <div className="flex items-center gap-2">
                  {isConnected ? (
                    <>
                      <CheckCircle size={16} className="text-emerald-400" />
                      <span className="text-emerald-400 text-sm">Connected</span>
                    </>
                  ) : (
                    <>
                      <XCircle size={16} className="text-red-400" />
                      <span className="text-red-400 text-sm">
                        {session?.status || 'Disconnected'}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={checkSession}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-slate-700 rounded-xl hover:bg-slate-600 text-slate-300 hover:text-white transition-colors"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              Refresh
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Send Message */}
          <div className="bg-slate-800/50 rounded-xl border border-slate-700">
            <div className="p-4 border-b border-slate-700">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <span>📤</span> Send Message
              </h3>
            </div>
            <div className="p-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Chat ID / Phone Number
                </label>
                <input
                  type="text"
                  value={chatId}
                  onChange={(e) => setChatId(e.target.value)}
                  placeholder="e.g., 966501234567@c.us"
                  className="w-full bg-slate-900 border border-slate-600 rounded-xl p-3 text-white placeholder:text-slate-500 focus:border-teal-500"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Format: country code + number + @c.us
                </p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Message
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Enter your message..."
                  className="w-full bg-slate-900 border border-slate-600 rounded-xl p-3 h-32 text-white placeholder:text-slate-500 focus:border-teal-500 resize-none"
                />
              </div>

              {/* Quick Commands */}
              <div className="mb-4">
                <p className="text-sm text-slate-400 mb-2">Quick Commands:</p>
                <div className="flex flex-wrap gap-2">
                  {QUICK_COMMANDS.map((cmd) => (
                    <button
                      key={cmd.command}
                      onClick={() => handleQuickCommand(cmd.command)}
                      className="px-3 py-1.5 bg-slate-700 text-sm rounded-xl hover:bg-slate-600 text-slate-300 hover:text-white transition-colors"
                    >
                      {cmd.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleSend}
                disabled={!chatId || !message || sending || !isConnected}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-500 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed transition-colors"
              >
                <Send size={18} />
                {sending ? 'Sending...' : 'Send Message'}
              </button>
            </div>
          </div>

          {/* Message History */}
          <div className="bg-slate-800/50 rounded-xl border border-slate-700">
            <div className="p-4 border-b border-slate-700">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <span>📨</span> Sent Messages
              </h3>
            </div>
            <div className="p-4 max-h-96 overflow-y-auto">
              {sentMessages.length === 0 ? (
                <p className="text-center text-slate-400 py-8">
                  No messages sent yet
                </p>
              ) : (
                <div className="space-y-3">
                  {sentMessages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl border ${
                        msg.success
                          ? 'bg-emerald-900/30 border-emerald-600/50'
                          : 'bg-red-900/30 border-red-600/50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-white">{msg.chatId}</span>
                        {msg.success ? (
                          <CheckCircle size={16} className="text-emerald-400" />
                        ) : (
                          <XCircle size={16} className="text-red-400" />
                        )}
                      </div>
                      <p className="text-sm text-slate-300">{msg.message}</p>
                      <p className="text-xs text-slate-500 mt-1">
                        {msg.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Command Reference */}
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 mt-6">
          <div className="p-4 border-b border-slate-700">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <span>📖</span> Available WhatsApp Commands
            </h3>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { command: '/approve_inv_{number}', description: 'Approve an invoice' },
                { command: '/reject_inv_{number} [reason]', description: 'Reject an invoice with reason' },
                { command: '/approve_investment_{id}', description: 'Approve an investment' },
                { command: '/reject_investment_{id} [reason]', description: 'Reject an investment' },
                { command: '/status_{id}', description: 'Check status of any item' },
                { command: '/balance', description: 'Get treasury balance' },
                { command: '/pending', description: 'List all pending items' },
                { command: '/invoices', description: 'List pending invoices' },
                { command: '/help', description: 'Show available commands' },
              ].map((cmd) => (
                <div key={cmd.command} className="p-3 bg-slate-900/50 rounded-xl border border-slate-700">
                  <code className="text-sm font-mono text-teal-400">
                    {cmd.command}
                  </code>
                  <p className="text-sm text-slate-400 mt-1">{cmd.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
