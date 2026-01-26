import { useState, useEffect } from 'react';
import { Header } from '../components/Layout';
import { getInvoices, updateInvoiceStatus } from '../services/supabase';
import type { Invoice } from '../types';
import { format } from 'date-fns';
import { CheckCircle, XCircle } from 'lucide-react';

export function Invoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);

  useEffect(() => {
    loadInvoices();
  }, []);

  async function loadInvoices() {
    try {
      setLoading(true);
      const data = await getInvoices();
      setInvoices(data);
    } catch (err) {
      console.error('Failed to load invoices:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleApprove(invoice: Invoice) {
    try {
      await updateInvoiceStatus(invoice.id, 'approved', 'CFO');
      await loadInvoices();
    } catch (err) {
      console.error('Failed to approve invoice:', err);
    }
  }

  async function handleReject() {
    if (!selectedInvoice) return;
    try {
      await updateInvoiceStatus(selectedInvoice.id, 'rejected', 'CFO', rejectReason);
      setShowRejectModal(false);
      setRejectReason('');
      setSelectedInvoice(null);
      await loadInvoices();
    } catch (err) {
      console.error('Failed to reject invoice:', err);
    }
  }

  const filteredInvoices = invoices.filter(
    (inv) => filter === 'all' || inv.status === filter
  );

  const statusStyles: Record<string, string> = {
    pending: 'bg-amber-900/50 text-amber-300 border-amber-600',
    approved: 'bg-emerald-900/50 text-emerald-300 border-emerald-600',
    rejected: 'bg-red-900/50 text-red-300 border-red-600',
    posted: 'bg-blue-900/50 text-blue-300 border-blue-600',
  };

  return (
    <div>
      <Header title="Invoice Management" subtitle="Approval workflow and tracking" />
      <div className="p-6">
        {/* Filters */}
        <div className="flex gap-2 mb-6">
          {(['all', 'pending', 'approved', 'rejected'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl font-medium transition-all ${
                filter === f
                  ? 'bg-teal-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
          </div>
        ) : (
          <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-800">
                <tr>
                  <th className="text-left p-4 text-sm font-medium text-slate-400">
                    Invoice #
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-slate-400">
                    Vendor
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-slate-400">
                    Amount
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-slate-400">
                    GL Code
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-slate-400">
                    Status
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-slate-400">
                    Date
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-slate-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className="border-t border-slate-700 hover:bg-slate-800/50">
                    <td className="p-4 font-medium text-white">{invoice.invoice_number}</td>
                    <td className="p-4 text-slate-300">{invoice.vendor_name || '-'}</td>
                    <td className="p-4">
                      <span
                        className={
                          invoice.amount > 100000 ? 'text-red-400 font-semibold' : 'text-slate-300'
                        }
                      >
                        {invoice.currency} {invoice.amount.toLocaleString()}
                      </span>
                      {invoice.amount > 100000 && (
                        <span className="ml-2 text-xs bg-red-900/50 text-red-300 px-2 py-0.5 rounded-lg border border-red-600">
                          CFO Required
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-slate-400 font-mono text-sm">
                      {invoice.gl_code || '-'}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${
                          statusStyles[invoice.status] || 'bg-slate-700 text-slate-300 border-slate-600'
                        }`}
                      >
                        {invoice.status}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-slate-400">
                      {format(new Date(invoice.created_at), 'MMM d, yyyy')}
                    </td>
                    <td className="p-4">
                      {invoice.status === 'pending' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApprove(invoice)}
                            className="p-2 bg-emerald-900/50 text-emerald-400 rounded-xl hover:bg-emerald-800/50 border border-emerald-600/50 transition-colors"
                            title="Approve"
                          >
                            <CheckCircle size={16} />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedInvoice(invoice);
                              setShowRejectModal(true);
                            }}
                            className="p-2 bg-red-900/50 text-red-400 rounded-xl hover:bg-red-800/50 border border-red-600/50 transition-colors"
                            title="Reject"
                          >
                            <XCircle size={16} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
                {filteredInvoices.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-400">
                      No invoices found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Reject Modal */}
        {showRejectModal && selectedInvoice && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-xl border border-slate-700 shadow-2xl p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-white mb-4">Reject Invoice</h3>
              <p className="text-slate-300 mb-2">
                Invoice: <strong className="text-white">{selectedInvoice.invoice_number}</strong>
              </p>
              <p className="text-slate-300 mb-4">
                Amount:{' '}
                <strong className="text-white">
                  {selectedInvoice.currency} {selectedInvoice.amount.toLocaleString()}
                </strong>
              </p>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full bg-slate-900 border border-slate-600 rounded-xl p-3 h-32 mb-4 text-white placeholder:text-slate-500 focus:border-teal-500"
                placeholder="Enter rejection reason..."
              />
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectReason('');
                    setSelectedInvoice(null);
                  }}
                  className="px-4 py-2 text-slate-300 hover:bg-slate-700 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-500 transition-colors"
                >
                  Reject Invoice
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
