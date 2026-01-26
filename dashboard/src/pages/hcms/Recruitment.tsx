import { useState, useEffect } from 'react';
import { Header } from '../../components/Layout';
import { StatCard, StatusBadge, CardGridSkeleton } from '../../components/common';
import type { Recruitment as RecruitmentType, Candidate } from '../../types';
import { format } from 'date-fns';
import { Plus, Users, UserCheck, Clock, Briefcase } from 'lucide-react';
import { hcmsApi } from '../../services/mockData/hcms';

export function Recruitment() {
  const [recruitments, setRecruitments] = useState<RecruitmentType[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecruitment, setSelectedRecruitment] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
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
    };
    fetchData();
  }, []);

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
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 transition-colors">
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
                    <p className="text-lg font-bold text-white">{format(new Date(req.closing_date!), 'MMM d')}</p>
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
                    <h5 className="text-sm font-semibold text-slate-300 mb-3">Top Candidates</h5>
                    <div className="space-y-2">
                      {candidates
                        .filter(c => c.recruitment_id === req.id)
                        .map((candidate) => (
                          <div key={candidate.id} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-xl">
                            <div>
                              <p className="text-white font-medium">{candidate.name}</p>
                              <p className="text-xs text-slate-400">{candidate.email}</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-sm font-bold text-indigo-400">{candidate.score}%</span>
                              <StatusBadge status={candidate.status} size="sm" />
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Named export for backward compatibility
export default Recruitment;
