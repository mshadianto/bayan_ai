import { useState, useEffect, useCallback } from 'react';
import { Header } from '../../components/Layout';
import { StatCard, StatusBadge, CardGridSkeleton, Modal, ModalButton } from '../../components/common';
import type { Recruitment as RecruitmentType, Candidate } from '../../types';
import { format } from 'date-fns';
import { Plus, Users, UserCheck, Clock, Briefcase, ChevronRight, CheckCircle, XCircle } from 'lucide-react';
import { hcmsApi, CreateRequisitionInput, MoveCandidateStageInput } from '../../services/mockData/hcms';

// Toast Component
function Toast({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed bottom-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg animate-fade-in ${
      type === 'success' ? 'bg-emerald-600' : 'bg-red-600'
    } text-white`}>
      {type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
      {message}
    </div>
  );
}

// Create Requisition Modal
function CreateRequisitionModal({
  onClose,
  onSubmit,
  isSubmitting
}: {
  onClose: () => void;
  onSubmit: (data: CreateRequisitionInput) => void;
  isSubmitting: boolean;
}) {
  const [form, setForm] = useState<CreateRequisitionInput>({
    position: '',
    department: '',
    hiring_manager: '',
    closing_date: '',
    description: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  const departments = ['Executive', 'Finance', 'IT', 'HR', 'Operations', 'Legal', 'Marketing'];

  return (
    <Modal isOpen={true} title="Create New Requisition" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Position Title *</label>
          <input
            type="text"
            required
            value={form.position}
            onChange={e => setForm({ ...form, position: e.target.value })}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="e.g., Senior Software Engineer"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Department *</label>
          <select
            required
            value={form.department}
            onChange={e => setForm({ ...form, department: e.target.value })}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="">Select Department</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Hiring Manager *</label>
          <input
            type="text"
            required
            value={form.hiring_manager}
            onChange={e => setForm({ ...form, hiring_manager: e.target.value })}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="e.g., Ahmed Al-Rashid"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Closing Date *</label>
          <input
            type="date"
            required
            value={form.closing_date}
            onChange={e => setForm({ ...form, closing_date: e.target.value })}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Job Description</label>
          <textarea
            rows={3}
            value={form.description || ''}
            onChange={e => setForm({ ...form, description: e.target.value })}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
            placeholder="Enter job description and requirements..."
          />
        </div>

        <div className="flex gap-3 pt-4">
          <ModalButton variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </ModalButton>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Creating...' : 'Create Requisition'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

// Candidate Stage Pipeline
const CANDIDATE_STAGES: { value: Candidate['status']; label: string; color: string }[] = [
  { value: 'applied', label: 'Applied', color: 'bg-slate-500' },
  { value: 'screening', label: 'Screening', color: 'bg-blue-500' },
  { value: 'interview', label: 'Interview', color: 'bg-amber-500' },
  { value: 'offer', label: 'Offer', color: 'bg-purple-500' },
  { value: 'hired', label: 'Hired', color: 'bg-emerald-500' },
];

// Move Candidate Modal
function MoveCandidateModal({
  candidate,
  onClose,
  onSubmit,
  isSubmitting
}: {
  candidate: Candidate;
  onClose: () => void;
  onSubmit: (data: MoveCandidateStageInput) => void;
  isSubmitting: boolean;
}) {
  const [newStatus, setNewStatus] = useState<Candidate['status']>(candidate.status);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ id: candidate.id, status: newStatus });
  };

  const currentIndex = CANDIDATE_STAGES.findIndex(s => s.value === candidate.status);

  return (
    <Modal isOpen={true} title={`Move Candidate: ${candidate.name}`} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="text-center p-4 bg-slate-700/50 rounded-xl">
          <p className="text-white font-semibold text-lg">{candidate.name}</p>
          <p className="text-slate-400 text-sm">{candidate.email}</p>
          {candidate.score && (
            <p className="text-indigo-400 font-bold mt-2">Score: {candidate.score}%</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-3">Move to Stage</label>
          <div className="space-y-2">
            {CANDIDATE_STAGES.map((stage, idx) => (
              <label
                key={stage.value}
                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                  newStatus === stage.value
                    ? 'border-indigo-500 bg-indigo-500/20'
                    : 'border-slate-600 hover:border-slate-500'
                }`}
              >
                <input
                  type="radio"
                  name="status"
                  value={stage.value}
                  checked={newStatus === stage.value}
                  onChange={e => setNewStatus(e.target.value as Candidate['status'])}
                  className="sr-only"
                />
                <span className={`w-3 h-3 rounded-full ${stage.color}`} />
                <span className="text-white flex-1">{stage.label}</span>
                {idx === currentIndex && (
                  <span className="text-xs bg-slate-600 px-2 py-0.5 rounded text-slate-300">Current</span>
                )}
              </label>
            ))}
            <label
              className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                newStatus === 'rejected'
                  ? 'border-red-500 bg-red-500/20'
                  : 'border-slate-600 hover:border-slate-500'
              }`}
            >
              <input
                type="radio"
                name="status"
                value="rejected"
                checked={newStatus === 'rejected'}
                onChange={e => setNewStatus(e.target.value as Candidate['status'])}
                className="sr-only"
              />
              <span className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-white flex-1">Rejected</span>
            </label>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <ModalButton variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </ModalButton>
          <button
            type="submit"
            disabled={isSubmitting || newStatus === candidate.status}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              newStatus === 'rejected' ? 'bg-red-600 text-white hover:bg-red-500' : 'bg-indigo-600 text-white hover:bg-indigo-500'
            }`}
          >
            {isSubmitting ? 'Moving...' : `Move to ${CANDIDATE_STAGES.find(s => s.value === newStatus)?.label || 'Rejected'}`}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export function Recruitment() {
  const [recruitments, setRecruitments] = useState<RecruitmentType[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecruitment, setSelectedRecruitment] = useState<string | null>(null);

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Toast state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const [recruitmentsData, candidatesData] = await Promise.all([
        hcmsApi.recruitment.getAll(),
        hcmsApi.recruitment.getCandidates(),
      ]);
      setRecruitments(recruitmentsData);
      setCandidates(candidatesData);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreateRequisition = async (data: CreateRequisitionInput) => {
    setIsSubmitting(true);
    try {
      const newReq = await hcmsApi.recruitment.createRequisition(data);
      setRecruitments(prev => [...prev, newReq]);
      setShowCreateModal(false);
      setToast({ message: `Requisition for ${newReq.position} created successfully`, type: 'success' });
    } catch (err) {
      setToast({ message: 'Failed to create requisition', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMoveCandidate = async (data: MoveCandidateStageInput) => {
    setIsSubmitting(true);
    try {
      const updated = await hcmsApi.recruitment.moveCandidate(data);
      setCandidates(prev => prev.map(c => c.id === updated.id ? updated : c));
      setSelectedCandidate(null);
      setToast({ message: `${updated.name} moved to ${updated.status}`, type: 'success' });
    } catch (err) {
      setToast({ message: 'Failed to move candidate', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalOpenPositions = recruitments.filter(r => r.status !== 'closed').length;
  const totalApplicants = recruitments.reduce((sum, r) => sum + r.applicants, 0);
  const totalShortlisted = recruitments.reduce((s, r) => s + r.shortlisted, 0);
  const inInterviewCount = recruitments.filter(r => r.status === 'interviewing').length;

  const stats = [
    { icon: <Briefcase size={20} />, label: 'Open Positions', value: totalOpenPositions, variant: 'info' as const },
    { icon: <Users size={20} />, label: 'Total Applicants', value: totalApplicants },
    { icon: <UserCheck size={20} />, label: 'Shortlisted', value: totalShortlisted, variant: 'success' as const },
    { icon: <Clock size={20} />, label: 'In Interview', value: inInterviewCount, variant: 'warning' as const },
  ];

  return (
    <div className="animate-fade-in">
      <Header title="Recruitment" subtitle="Talent acquisition and applicant tracking" />
      <div className="p-6">
        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 stagger-children">
          {stats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>

        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-white">Open Requisitions</h3>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 transition-colors"
          >
            <Plus size={20} />
            New Requisition
          </button>
        </div>

        {loading ? (
          <CardGridSkeleton count={4} columns={2} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 stagger-children">
            {recruitments.map((req, index) => (
              <div
                key={req.id}
                className={`bg-slate-800/50 rounded-xl border border-slate-700 p-5 cursor-pointer hover:border-slate-600 transition-all card-hover animate-fade-in ${
                  selectedRecruitment === req.id ? 'ring-2 ring-indigo-500' : ''
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={() => setSelectedRecruitment(selectedRecruitment === req.id ? null : req.id)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-white font-semibold text-lg">{req.position}</h4>
                    <p className="text-sm text-slate-400">{req.department}</p>
                  </div>
                  <StatusBadge status={req.status} variant="outline" />
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-3 bg-slate-900/50 rounded-xl">
                    <p className="text-2xl font-bold text-white">{req.applicants}</p>
                    <p className="text-xs text-slate-400">Applicants</p>
                  </div>
                  <div className="text-center p-3 bg-slate-900/50 rounded-xl">
                    <p className="text-2xl font-bold text-emerald-400">{req.shortlisted}</p>
                    <p className="text-xs text-slate-400">Shortlisted</p>
                  </div>
                  <div className="text-center p-3 bg-slate-900/50 rounded-xl">
                    <p className="text-lg font-bold text-white">{req.closing_date ? format(new Date(req.closing_date), 'MMM d') : '-'}</p>
                    <p className="text-xs text-slate-400">Closing</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Hiring Manager: <span className="text-white">{req.hiring_manager}</span></span>
                  <span className="text-slate-500">Posted {format(new Date(req.posted_date), 'MMM d, yyyy')}</span>
                </div>

                {/* Candidates for selected recruitment */}
                {selectedRecruitment === req.id && (
                  <div className="mt-4 pt-4 border-t border-slate-700 animate-fade-in">
                    <h5 className="text-sm font-semibold text-slate-300 mb-3">Candidates Pipeline</h5>
                    <div className="space-y-2">
                      {candidates
                        .filter(c => c.recruitment_id === req.id)
                        .map((candidate) => (
                          <div
                            key={candidate.id}
                            className="flex items-center justify-between p-3 bg-slate-900/50 rounded-xl hover:bg-slate-900/80 transition-colors"
                            onClick={e => e.stopPropagation()}
                          >
                            <div>
                              <p className="text-white font-medium">{candidate.name}</p>
                              <p className="text-xs text-slate-400">{candidate.email}</p>
                            </div>
                            <div className="flex items-center gap-3">
                              {candidate.score && (
                                <span className="text-sm font-bold text-indigo-400">{candidate.score}%</span>
                              )}
                              <StatusBadge status={candidate.status} size="sm" />
                              <button
                                onClick={() => setSelectedCandidate(candidate)}
                                className="p-1 hover:bg-slate-700 rounded-lg transition-colors"
                                title="Move candidate"
                              >
                                <ChevronRight size={16} className="text-slate-400" />
                              </button>
                            </div>
                          </div>
                        ))}
                      {candidates.filter(c => c.recruitment_id === req.id).length === 0 && (
                        <p className="text-slate-500 text-sm text-center py-4">No candidates yet</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {showCreateModal && (
        <CreateRequisitionModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateRequisition}
          isSubmitting={isSubmitting}
        />
      )}

      {selectedCandidate && (
        <MoveCandidateModal
          candidate={selectedCandidate}
          onClose={() => setSelectedCandidate(null)}
          onSubmit={handleMoveCandidate}
          isSubmitting={isSubmitting}
        />
      )}

      {/* Toast */}
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  );
}

// Named export for backward compatibility
export default Recruitment;
