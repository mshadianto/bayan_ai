import { useState, useEffect, useCallback } from 'react';
import { Header } from '../components/Layout';
import { Modal, ModalButton } from '../components/common/Modal';
import {
  investmentsApi,
  type ExtendedInvestment,
  type InvestmentSummary,
  type InvestmentDocument,
} from '../services/mockData/investments';
import { format } from 'date-fns';
import {
  CheckCircle,
  XCircle,
  Eye,
  X,
  Upload,
  FileText,
  Share2,
  Download,
  MessageCircle,
  Mail,
  Send,
  Clock,
  AlertTriangle,
  TrendingUp,
  Building2,
  Globe,
  Plus,
} from 'lucide-react';

// Toast Component
function Toast({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed bottom-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border ${
      type === 'success'
        ? 'bg-emerald-900/90 border-emerald-600 text-emerald-100'
        : 'bg-red-900/90 border-red-600 text-red-100'
    }`}>
      {type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
      <span className="font-medium">{message}</span>
      <button onClick={onClose} className="ml-2 hover:opacity-70">
        <X size={16} />
      </button>
    </div>
  );
}

// Status Badge Component
function StatusBadge({ status }: { status: ExtendedInvestment['status'] }) {
  const config = {
    pending_analysis: { bg: 'bg-slate-900/50', text: 'text-slate-300', border: 'border-slate-600', label: 'Pending Analysis', icon: Clock },
    pending_review: { bg: 'bg-blue-900/50', text: 'text-blue-300', border: 'border-blue-600', label: 'Pending Review', icon: Eye },
    pending_approval: { bg: 'bg-amber-900/50', text: 'text-amber-300', border: 'border-amber-600', label: 'Pending Approval', icon: AlertTriangle },
    approved: { bg: 'bg-emerald-900/50', text: 'text-emerald-300', border: 'border-emerald-600', label: 'Approved', icon: CheckCircle },
    rejected: { bg: 'bg-red-900/50', text: 'text-red-300', border: 'border-red-600', label: 'Rejected', icon: XCircle },
  };
  const { bg, text, border, label, icon: Icon } = config[status];

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 ${bg} ${text} text-xs rounded-lg border ${border}`}>
      <Icon size={12} />
      {label}
    </span>
  );
}

// Recommendation Badge
function RecommendationBadge({ recommendation }: { recommendation?: ExtendedInvestment['recommendation'] }) {
  if (!recommendation) return null;

  const config = {
    proceed: { bg: 'bg-emerald-900/50', text: 'text-emerald-300', label: 'Proceed' },
    proceed_with_conditions: { bg: 'bg-amber-900/50', text: 'text-amber-300', label: 'Proceed with Conditions' },
    reject: { bg: 'bg-red-900/50', text: 'text-red-300', label: 'Reject' },
    more_info_needed: { bg: 'bg-blue-900/50', text: 'text-blue-300', label: 'More Info Needed' },
  };
  const { bg, text, label } = config[recommendation];

  return (
    <span className={`inline-flex items-center px-2.5 py-1 ${bg} ${text} text-xs rounded-lg`}>
      {label}
    </span>
  );
}

// Document List Component
function DocumentList({ documents }: { documents: InvestmentDocument[] }) {
  return (
    <div className="space-y-2">
      {documents.map(doc => (
        <div key={doc.id} className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg">
          <FileText size={20} className="text-teal-400" />
          <div className="flex-1 min-w-0">
            <p className="text-sm text-white truncate">{doc.name}</p>
            <p className="text-xs text-slate-400">
              {(doc.size / 1024 / 1024).toFixed(2)} MB - {format(new Date(doc.uploaded_at), 'MMM d, yyyy')}
            </p>
          </div>
          <span className={`px-2 py-0.5 text-xs rounded ${
            doc.status === 'processed' ? 'bg-emerald-900/50 text-emerald-300' :
            doc.status === 'error' ? 'bg-red-900/50 text-red-300' :
            'bg-amber-900/50 text-amber-300'
          }`}>
            {doc.status}
          </span>
        </div>
      ))}
    </div>
  );
}

// Upload Document Form
function UploadDocumentForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (data: { company_name: string; sector: string; country: string; documents: { name: string; type: InvestmentDocument['type']; size: number }[] }) => void;
  onCancel: () => void;
}) {
  const [companyName, setCompanyName] = useState('');
  const [sector, setSector] = useState('');
  const [country, setCountry] = useState('Saudi Arabia');
  const [files, setFiles] = useState<{ name: string; type: InvestmentDocument['type']; size: number }[]>([]);

  const sectors = investmentsApi.getSectors();

  const handleAddFile = () => {
    setFiles([...files, { name: '', type: 'financial_statement', size: 0 }]);
  };

  const handleFileChange = (index: number, field: string, value: string | number) => {
    const updated = [...files];
    updated[index] = { ...updated[index], [field]: value };
    setFiles(updated);
  };

  const handleRemoveFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!companyName || !sector || files.length === 0) return;
    const validFiles = files.filter(f => f.name);
    if (validFiles.length === 0) return;

    onSubmit({
      company_name: companyName,
      sector,
      country,
      documents: validFiles.map(f => ({ ...f, size: f.size || 1000000 })),
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Company Name</label>
        <input
          type="text"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          placeholder="Enter company name"
          className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Sector</label>
          <select
            value={sector}
            onChange={(e) => setSector(e.target.value)}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          >
            <option value="">Select Sector</option>
            {sectors.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Country</label>
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-slate-300">Documents</label>
          <button
            type="button"
            onClick={handleAddFile}
            className="flex items-center gap-1 text-sm text-teal-400 hover:text-teal-300"
          >
            <Plus size={16} />
            Add Document
          </button>
        </div>
        <div className="space-y-3">
          {files.map((file, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={file.name}
                onChange={(e) => handleFileChange(index, 'name', e.target.value)}
                placeholder="Document name (e.g., Financial Statement 2024.pdf)"
                className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
              <select
                value={file.type}
                onChange={(e) => handleFileChange(index, 'type', e.target.value)}
                className="w-40 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="financial_statement">Financial Statement</option>
                <option value="company_profile">Company Profile</option>
                <option value="shariah_certificate">Shariah Certificate</option>
                <option value="other">Other</option>
              </select>
              <button
                type="button"
                onClick={() => handleRemoveFile(index)}
                className="p-2 text-slate-400 hover:text-red-400"
              >
                <X size={18} />
              </button>
            </div>
          ))}
          {files.length === 0 && (
            <div className="text-center py-6 border-2 border-dashed border-slate-600 rounded-lg">
              <Upload size={32} className="mx-auto text-slate-500 mb-2" />
              <p className="text-sm text-slate-400">Click "Add Document" to upload files</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          onClick={onCancel}
          className="flex-1 px-4 py-2 bg-slate-700 text-slate-300 rounded-xl text-sm font-medium hover:bg-slate-600 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={!companyName || !sector || files.length === 0 || files.every(f => !f.name)}
          className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-xl text-sm font-medium hover:bg-teal-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Submit for Analysis
        </button>
      </div>
    </div>
  );
}

// Share Memo Form
function ShareMemoForm({
  investment,
  onSubmit,
  onCancel,
}: {
  investment: ExtendedInvestment;
  onSubmit: (data: { channel: 'whatsapp' | 'email' | 'telegram'; recipient: string }) => void;
  onCancel: () => void;
}) {
  const [channel, setChannel] = useState<'whatsapp' | 'email' | 'telegram'>('whatsapp');
  const [recipient, setRecipient] = useState('');

  const handleSubmit = () => {
    if (!recipient) return;
    onSubmit({ channel, recipient });
  };

  return (
    <div className="space-y-4">
      <div className="bg-slate-700/50 rounded-lg p-4">
        <p className="text-sm text-slate-400 mb-1">Sharing memo for</p>
        <p className="text-white font-medium">{investment.company_name}</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Channel</label>
        <div className="flex gap-2">
          {[
            { value: 'whatsapp', label: 'WhatsApp', icon: MessageCircle },
            { value: 'email', label: 'Email', icon: Mail },
            { value: 'telegram', label: 'Telegram', icon: Send },
          ].map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              type="button"
              onClick={() => setChannel(value as 'whatsapp' | 'email' | 'telegram')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                channel === value
                  ? 'bg-teal-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          {channel === 'email' ? 'Email Address' : 'Phone Number'}
        </label>
        <input
          type={channel === 'email' ? 'email' : 'tel'}
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          placeholder={channel === 'email' ? 'example@company.com' : '+966501234567'}
          className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        />
      </div>

      {investment.shared_to && investment.shared_to.length > 0 && (
        <div>
          <p className="text-sm text-slate-400 mb-2">Previously shared to:</p>
          <div className="space-y-1">
            {investment.shared_to.map(share => (
              <div key={share.id} className="flex items-center gap-2 text-sm text-slate-300">
                {share.channel === 'whatsapp' && <MessageCircle size={14} />}
                {share.channel === 'email' && <Mail size={14} />}
                {share.channel === 'telegram' && <Send size={14} />}
                <span>{share.recipient}</span>
                <span className="text-slate-500">- {format(new Date(share.shared_at), 'MMM d, HH:mm')}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-3 pt-4">
        <button
          onClick={onCancel}
          className="flex-1 px-4 py-2 bg-slate-700 text-slate-300 rounded-xl text-sm font-medium hover:bg-slate-600 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={!recipient}
          className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-xl text-sm font-medium hover:bg-teal-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Share Memo
        </button>
      </div>
    </div>
  );
}

// Investment Detail Modal
function InvestmentDetailModal({
  investment,
  onApprove,
  onReject,
  onShare,
  onExport,
}: {
  investment: ExtendedInvestment;
  onApprove: () => void;
  onReject: () => void;
  onShare: () => void;
  onExport: () => void;
}) {
  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <StatusBadge status={investment.status} />
            <RecommendationBadge recommendation={investment.recommendation} />
          </div>
          <div className="flex items-center gap-4 text-sm text-slate-400">
            <span className="flex items-center gap-1">
              <Building2 size={14} />
              {investment.sector}
            </span>
            <span className="flex items-center gap-1">
              <Globe size={14} />
              {investment.country}
            </span>
          </div>
        </div>
        {investment.investment_amount && (
          <div className="text-right">
            <p className="text-sm text-slate-400">Investment Amount</p>
            <p className="text-xl font-bold text-white">
              {investment.currency} {investment.investment_amount.toLocaleString()}
            </p>
          </div>
        )}
      </div>

      {/* Documents */}
      <section>
        <h4 className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
          <FileText size={16} className="text-teal-400" />
          Documents ({investment.documents.length})
        </h4>
        <DocumentList documents={investment.documents} />
      </section>

      {/* Financial Analysis */}
      {investment.financial_analysis && (
        <section>
          <h4 className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
            <TrendingUp size={16} className="text-teal-400" />
            Financial Analysis
          </h4>
          <div className="bg-slate-700/50 rounded-lg p-4">
            <div className="grid grid-cols-4 gap-4 mb-4">
              <div>
                <p className="text-xs text-slate-400">Revenue</p>
                <p className="text-white font-medium">SAR {investment.financial_analysis.revenue.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">ROE</p>
                <p className="text-white font-medium">{investment.financial_analysis.roe.toFixed(2)}%</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">ROA</p>
                <p className="text-white font-medium">{investment.financial_analysis.roa.toFixed(2)}%</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Debt/Equity</p>
                <p className="text-white font-medium">{investment.financial_analysis.debt_equity_ratio.toFixed(2)}</p>
              </div>
            </div>
            <p className="text-sm text-slate-300">{investment.financial_analysis.summary}</p>
          </div>
        </section>
      )}

      {/* Risk Assessment */}
      {investment.risk_assessment && (
        <section>
          <h4 className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
            <AlertTriangle size={16} className="text-teal-400" />
            Risk Assessment (Overall: {investment.risk_assessment.overall_rating}/10)
          </h4>
          <div className="bg-slate-700/50 rounded-lg p-4">
            <div className="grid grid-cols-3 gap-4 mb-4">
              {[
                { label: 'Strategic', value: investment.risk_assessment.strategic_risk },
                { label: 'Financial', value: investment.risk_assessment.financial_risk },
                { label: 'Operational', value: investment.risk_assessment.operational_risk },
                { label: 'Compliance', value: investment.risk_assessment.compliance_risk },
                { label: 'Shariah', value: investment.risk_assessment.shariah_risk },
                { label: 'Reputational', value: investment.risk_assessment.reputational_risk },
              ].map((risk) => (
                <div key={risk.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">{risk.label}</span>
                    <span className="text-white">{risk.value}/10</span>
                  </div>
                  <div className="h-2 bg-slate-600 rounded-full">
                    <div
                      className={`h-2 rounded-full ${
                        risk.value <= 3 ? 'bg-emerald-500' :
                        risk.value <= 6 ? 'bg-amber-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${risk.value * 10}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <p className="text-sm text-slate-300">{investment.risk_assessment.summary}</p>
          </div>
        </section>
      )}

      {/* Shariah Compliance */}
      {investment.shariah_compliance && (
        <section>
          <h4 className="text-sm font-medium text-slate-300 mb-3">Shariah Compliance</h4>
          <div className="bg-slate-700/50 rounded-lg p-4">
            <div className="grid grid-cols-4 gap-4 mb-4">
              <div>
                <p className="text-xs text-slate-400">Halal Screening</p>
                <p className={`font-medium ${
                  investment.shariah_compliance.halal_screening === 'pass' ? 'text-emerald-400' :
                  investment.shariah_compliance.halal_screening === 'fail' ? 'text-red-400' : 'text-amber-400'
                }`}>
                  {investment.shariah_compliance.halal_screening}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Riba Compliance</p>
                <p className={`font-medium ${
                  investment.shariah_compliance.riba_compliance === 'compliant' ? 'text-emerald-400' :
                  investment.shariah_compliance.riba_compliance === 'non_compliant' ? 'text-red-400' : 'text-amber-400'
                }`}>
                  {investment.shariah_compliance.riba_compliance.replace('_', ' ')}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Gharar Status</p>
                <p className={`font-medium ${
                  investment.shariah_compliance.gharar_status === 'minimal' ? 'text-emerald-400' :
                  investment.shariah_compliance.gharar_status === 'acceptable' ? 'text-amber-400' : 'text-red-400'
                }`}>
                  {investment.shariah_compliance.gharar_status}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Overall Status</p>
                <p className={`font-medium ${
                  investment.shariah_compliance.overall_status === 'compliant' ? 'text-emerald-400' :
                  investment.shariah_compliance.overall_status === 'non_compliant' ? 'text-red-400' : 'text-amber-400'
                }`}>
                  {investment.shariah_compliance.overall_status}
                </p>
              </div>
            </div>
            <p className="text-sm text-slate-300">{investment.shariah_compliance.notes}</p>
          </div>
        </section>
      )}

      {/* Final Memo */}
      {investment.final_memo && (
        <section>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-slate-300">Investment Memo</h4>
            <div className="flex gap-2">
              <button
                onClick={onExport}
                className="flex items-center gap-1 px-3 py-1.5 text-xs bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600"
              >
                <Download size={14} />
                Export PDF
              </button>
              <button
                onClick={onShare}
                className="flex items-center gap-1 px-3 py-1.5 text-xs bg-teal-600 text-white rounded-lg hover:bg-teal-500"
              >
                <Share2 size={14} />
                Share
              </button>
            </div>
          </div>
          <div className="bg-slate-700/50 rounded-lg p-4 max-h-64 overflow-y-auto">
            <pre className="text-sm text-slate-300 whitespace-pre-wrap font-sans">{investment.final_memo}</pre>
          </div>
        </section>
      )}

      {/* Actions */}
      {investment.status === 'pending_approval' && (
        <div className="flex gap-3 pt-4 border-t border-slate-700">
          <button
            onClick={onReject}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-500 transition-colors"
          >
            <XCircle size={18} />
            Reject
          </button>
          <button
            onClick={onApprove}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-500 transition-colors"
          >
            <CheckCircle size={18} />
            Approve
          </button>
        </div>
      )}

      {/* Approval/Rejection Info */}
      {investment.approved_by && (
        <div className="bg-emerald-900/30 border border-emerald-600/50 rounded-lg p-4">
          <p className="text-emerald-300 font-medium">Approved</p>
          <p className="text-sm text-emerald-400">
            By {investment.approved_by} on {format(new Date(investment.approved_at!), 'MMM d, yyyy HH:mm')}
          </p>
        </div>
      )}
      {investment.rejected_by && (
        <div className="bg-red-900/30 border border-red-600/50 rounded-lg p-4">
          <p className="text-red-300 font-medium">Rejected</p>
          <p className="text-sm text-red-400">
            By {investment.rejected_by} on {format(new Date(investment.rejected_at!), 'MMM d, yyyy HH:mm')}
          </p>
          {investment.rejection_reason && (
            <p className="text-sm text-red-300 mt-2">Reason: {investment.rejection_reason}</p>
          )}
        </div>
      )}
    </div>
  );
}

// Investment Card Component
function InvestmentCard({
  investment,
  onClick,
}: {
  investment: ExtendedInvestment;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="bg-slate-800/50 rounded-xl border border-slate-700 p-5 cursor-pointer hover:bg-slate-800/70 transition-colors"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white">{investment.company_name}</h3>
          <p className="text-sm text-slate-400">
            {investment.sector} - {investment.country}
          </p>
        </div>
        <StatusBadge status={investment.status} />
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="text-center p-3 bg-slate-900/50 rounded-xl">
          <TrendingUp size={20} className="mx-auto text-teal-400 mb-1" />
          <p className="text-xs text-slate-400">ROE</p>
          <p className="font-medium text-white">
            {investment.financial_analysis?.roe?.toFixed(1) || '-'}%
          </p>
        </div>
        <div className="text-center p-3 bg-slate-900/50 rounded-xl">
          <AlertTriangle size={20} className="mx-auto text-amber-400 mb-1" />
          <p className="text-xs text-slate-400">Risk</p>
          <p className="font-medium text-white">
            {investment.risk_assessment?.overall_rating || '-'}/10
          </p>
        </div>
        <div className="text-center p-3 bg-slate-900/50 rounded-xl">
          <CheckCircle size={20} className={`mx-auto mb-1 ${
            investment.shariah_compliance?.overall_status === 'compliant' ? 'text-emerald-400' :
            investment.shariah_compliance?.overall_status === 'conditional' ? 'text-amber-400' : 'text-red-400'
          }`} />
          <p className="text-xs text-slate-400">Shariah</p>
          <p className="font-medium text-white">
            {investment.shariah_compliance?.overall_status || '-'}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-400">
          {investment.documents.length} document{investment.documents.length !== 1 ? 's' : ''}
        </span>
        <span className="text-slate-400">
          {format(new Date(investment.created_at), 'MMM d, yyyy')}
        </span>
      </div>
    </div>
  );
}

export function Investments() {
  const [investments, setInvestments] = useState<ExtendedInvestment[]>([]);
  const [summary, setSummary] = useState<InvestmentSummary | null>(null);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedInvestment, setSelectedInvestment] = useState<ExtendedInvestment | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  // Filter state
  const [filter, setFilter] = useState<'all' | ExtendedInvestment['status']>('all');

  // Toast state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [investmentsData, summaryData] = await Promise.all([
        investmentsApi.investments.getAll(),
        investmentsApi.investments.getSummary(),
      ]);
      setInvestments(investmentsData);
      setSummary(summaryData);
    } catch (err) {
      console.error('Failed to load investments:', err);
      setToast({ message: 'Failed to load investments', type: 'error' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleUploadDocuments = async (data: { company_name: string; sector: string; country: string; documents: { name: string; type: InvestmentDocument['type']; size: number }[] }) => {
    try {
      await investmentsApi.investments.uploadDocuments({
        ...data,
        uploaded_by: 'Current User',
      });
      setShowUploadModal(false);
      setToast({ message: 'Investment submitted for analysis', type: 'success' });
      loadData();
    } catch (err) {
      setToast({ message: 'Failed to submit investment', type: 'error' });
    }
  };

  const handleApprove = async () => {
    if (!selectedInvestment) return;
    try {
      await investmentsApi.investments.approve({
        investmentId: selectedInvestment.id,
        approverName: 'CFO',
      });
      setSelectedInvestment(null);
      setToast({ message: 'Investment approved', type: 'success' });
      loadData();
    } catch (err) {
      setToast({ message: 'Failed to approve investment', type: 'error' });
    }
  };

  const handleReject = async () => {
    if (!selectedInvestment || !rejectReason) return;
    try {
      await investmentsApi.investments.reject({
        investmentId: selectedInvestment.id,
        rejectorName: 'CFO',
        reason: rejectReason,
      });
      setShowRejectModal(false);
      setSelectedInvestment(null);
      setRejectReason('');
      setToast({ message: 'Investment rejected', type: 'success' });
      loadData();
    } catch (err) {
      setToast({ message: 'Failed to reject investment', type: 'error' });
    }
  };

  const handleShare = async (data: { channel: 'whatsapp' | 'email' | 'telegram'; recipient: string }) => {
    if (!selectedInvestment) return;
    try {
      await investmentsApi.investments.shareMemo({
        investmentId: selectedInvestment.id,
        ...data,
        sharedBy: 'Current User',
      });
      setShowShareModal(false);
      setToast({ message: `Memo shared via ${data.channel}`, type: 'success' });
      loadData();
    } catch (err) {
      setToast({ message: 'Failed to share memo', type: 'error' });
    }
  };

  const handleExport = async () => {
    if (!selectedInvestment) return;
    try {
      const url = await investmentsApi.investments.exportMemo(selectedInvestment.id);
      setToast({ message: 'Memo exported successfully', type: 'success' });
      console.log('PDF URL:', url);
    } catch (err) {
      setToast({ message: 'Failed to export memo', type: 'error' });
    }
  };

  const filteredInvestments = investments.filter(inv =>
    filter === 'all' || inv.status === filter
  );

  return (
    <div>
      <Header title="Investment Analysis" subtitle="Due diligence and approval workflow" />

      <div className="p-6">
        {/* Action Button */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-xl text-sm font-medium hover:bg-teal-500 transition-colors"
          >
            <Upload size={18} />
            Submit New Investment
          </button>
        </div>

        {/* Summary Stats */}
        {summary && (
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
              <p className="text-sm text-slate-400">Total</p>
              <p className="text-2xl font-bold text-white">{summary.total}</p>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
              <p className="text-sm text-slate-400">Pending Analysis</p>
              <p className="text-2xl font-bold text-slate-300">{summary.pending_analysis}</p>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
              <p className="text-sm text-slate-400">Pending Review</p>
              <p className="text-2xl font-bold text-blue-400">{summary.pending_review}</p>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
              <p className="text-sm text-slate-400">Pending Approval</p>
              <p className="text-2xl font-bold text-amber-400">{summary.pending_approval}</p>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
              <p className="text-sm text-slate-400">Approved</p>
              <p className="text-2xl font-bold text-emerald-400">{summary.approved}</p>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
              <p className="text-sm text-slate-400">Rejected</p>
              <p className="text-2xl font-bold text-red-400">{summary.rejected}</p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {(['all', 'pending_analysis', 'pending_review', 'pending_approval', 'approved', 'rejected'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                filter === f
                  ? 'bg-teal-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
              }`}
            >
              {f === 'all' ? 'All' : f.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredInvestments.map((investment) => (
              <InvestmentCard
                key={investment.id}
                investment={investment}
                onClick={() => setSelectedInvestment(investment)}
              />
            ))}
            {filteredInvestments.length === 0 && (
              <div className="col-span-2 bg-slate-800/50 rounded-xl border border-slate-700 p-8 text-center text-slate-400">
                No investments found
              </div>
            )}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      <Modal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        title="Submit New Investment"
        size="lg"
      >
        <UploadDocumentForm
          onSubmit={handleUploadDocuments}
          onCancel={() => setShowUploadModal(false)}
        />
      </Modal>

      {/* Investment Detail Modal */}
      <Modal
        isOpen={!!selectedInvestment && !showShareModal && !showRejectModal}
        onClose={() => setSelectedInvestment(null)}
        title={selectedInvestment?.company_name || ''}
        size="xl"
        footer={
          selectedInvestment?.status !== 'pending_approval' ? (
            <ModalButton onClick={() => setSelectedInvestment(null)} variant="secondary">
              Close
            </ModalButton>
          ) : undefined
        }
      >
        {selectedInvestment && (
          <InvestmentDetailModal
            investment={selectedInvestment}
            onApprove={handleApprove}
            onReject={() => setShowRejectModal(true)}
            onShare={() => setShowShareModal(true)}
            onExport={handleExport}
          />
        )}
      </Modal>

      {/* Share Modal */}
      <Modal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        title="Share Investment Memo"
        size="md"
      >
        {selectedInvestment && (
          <ShareMemoForm
            investment={selectedInvestment}
            onSubmit={handleShare}
            onCancel={() => setShowShareModal(false)}
          />
        )}
      </Modal>

      {/* Reject Modal */}
      <Modal
        isOpen={showRejectModal}
        onClose={() => {
          setShowRejectModal(false);
          setRejectReason('');
        }}
        title="Reject Investment"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-slate-300">
            Please provide a reason for rejecting{' '}
            <strong className="text-white">{selectedInvestment?.company_name}</strong>
          </p>
          <textarea
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            className="w-full bg-slate-700 border border-slate-600 rounded-xl p-3 h-32 text-white placeholder:text-slate-500 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
            placeholder="Enter rejection reason..."
          />
          <div className="flex gap-3">
            <button
              onClick={() => {
                setShowRejectModal(false);
                setRejectReason('');
              }}
              className="flex-1 px-4 py-2 bg-slate-700 text-slate-300 rounded-xl text-sm font-medium hover:bg-slate-600 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleReject}
              disabled={!rejectReason}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Reject Investment
            </button>
          </div>
        </div>
      </Modal>

      {/* Toast Notification */}
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  );
}
