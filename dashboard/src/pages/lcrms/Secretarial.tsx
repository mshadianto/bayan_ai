import { useState, useEffect, useMemo } from 'react';
import { Header } from '../../components/Layout';
import { StatCard, StatusBadge, Modal, CardGridSkeleton, EmptyState } from '../../components/common';
import type { MeetingMinutes, Shareholder, CircularResolution } from '../../types';
import { FileText, Users, Vote, Eye, PieChart } from 'lucide-react';
import { lcrmsApi } from '../../services/mockData/lcrms';
import { PieChart as RechartsPC, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

type TabType = 'meetings' | 'shareholders' | 'resolutions';

const MEETING_TYPE_LABELS: Record<MeetingMinutes['meeting_type'], string> = {
  rups: 'RUPS',
  board_of_directors: 'Board of Directors',
  board_of_commissioners: 'Board of Commissioners',
  committee: 'Committee',
  management: 'Management',
};

const SHAREHOLDER_COLORS = ['#f59e0b', '#3b82f6', '#10b981', '#8b5cf6', '#ef4444'];

export default function Secretarial() {
  const [activeTab, setActiveTab] = useState<TabType>('meetings');
  const [meetings, setMeetings] = useState<MeetingMinutes[]>([]);
  const [shareholders, setShareholders] = useState<Shareholder[]>([]);
  const [resolutions, setResolutions] = useState<CircularResolution[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<MeetingMinutes | Shareholder | CircularResolution | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [meetingsData, shareholdersData, resolutionsData] = await Promise.all([
        lcrmsApi.secretarial.getMeetings(),
        lcrmsApi.secretarial.getShareholders(),
        lcrmsApi.secretarial.getResolutions(),
      ]);
      setMeetings(meetingsData);
      setShareholders(shareholdersData);
      setResolutions(resolutionsData);
    } finally {
      setLoading(false);
    }
  };

  const shareholderPieData = useMemo(() => {
    return shareholders.map((s, i) => ({
      name: s.name,
      value: s.percentage,
      color: SHAREHOLDER_COLORS[i % SHAREHOLDER_COLORS.length],
    }));
  }, [shareholders]);

  const summary = useMemo(() => ({
    meetings_count: meetings.length,
    shareholders_count: shareholders.length,
    total_shares: shareholders.reduce((sum, s) => sum + s.shares, 0),
    pending_resolutions: resolutions.filter(r => r.status === 'pending').length,
  }), [meetings, shareholders, resolutions]);

  if (loading) {
    return (
      <div className="animate-fade-in">
        <Header title="Corporate Secretarial" subtitle="Meetings, Shareholders & Resolutions" />
        <div className="p-6">
          <CardGridSkeleton count={4} />
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <Header title="Corporate Secretarial" subtitle="Meetings, Shareholders & Resolutions" />
      <div className="p-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard icon={<FileText size={20} />} label="Meeting Minutes" value={summary.meetings_count} />
          <StatCard icon={<Users size={20} />} label="Shareholders" value={summary.shareholders_count} variant="info" />
          <StatCard icon={<PieChart size={20} />} label="Total Shares" value={summary.total_shares.toLocaleString()} />
          <StatCard icon={<Vote size={20} />} label="Pending Resolutions" value={summary.pending_resolutions} variant="warning" />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-slate-700 pb-4">
          {[
            { id: 'meetings', label: 'Meeting Minutes', icon: <FileText size={18} /> },
            { id: 'shareholders', label: 'Shareholders', icon: <Users size={18} /> },
            { id: 'resolutions', label: 'Circular Resolutions', icon: <Vote size={18} /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === tab.id ? 'bg-amber-600 text-white' : 'text-slate-400 hover:bg-slate-700'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'meetings' && (
          <MeetingsList
            meetings={meetings}
            onView={(m) => { setSelectedItem(m); setShowDetailModal(true); }}
          />
        )}

        {activeTab === 'shareholders' && (
          <ShareholdersView
            shareholders={shareholders}
            pieData={shareholderPieData}
            onView={(s) => { setSelectedItem(s); setShowDetailModal(true); }}
          />
        )}

        {activeTab === 'resolutions' && (
          <ResolutionsList
            resolutions={resolutions}
            onView={(r) => { setSelectedItem(r); setShowDetailModal(true); }}
          />
        )}

        {/* Detail Modal */}
        <Modal
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          title={activeTab === 'meetings' ? 'Meeting Minutes' : activeTab === 'shareholders' ? 'Shareholder Details' : 'Resolution Details'}
          size="lg"
        >
          {selectedItem && activeTab === 'meetings' && (
            <MeetingDetail meeting={selectedItem as MeetingMinutes} />
          )}
          {selectedItem && activeTab === 'shareholders' && (
            <ShareholderDetail shareholder={selectedItem as Shareholder} />
          )}
          {selectedItem && activeTab === 'resolutions' && (
            <ResolutionDetail resolution={selectedItem as CircularResolution} />
          )}
        </Modal>
      </div>
    </div>
  );
}

function MeetingsList({ meetings, onView }: { meetings: MeetingMinutes[]; onView: (m: MeetingMinutes) => void }) {
  if (meetings.length === 0) {
    return <EmptyState title="No meetings found" description="Meeting minutes will appear here" />;
  }

  return (
    <div className="space-y-4">
      {meetings.map((meeting, index) => (
        <div
          key={meeting.id}
          className="bg-slate-800/50 rounded-xl border border-slate-700 p-4 hover:border-amber-600/50 transition-colors cursor-pointer animate-fade-in"
          style={{ animationDelay: `${index * 50}ms` }}
          onClick={() => onView(meeting)}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="text-amber-400 font-mono text-sm">{meeting.meeting_number}</span>
                <StatusBadge status={meeting.status} />
                <StatusBadge status={MEETING_TYPE_LABELS[meeting.meeting_type]} variant="outline" />
              </div>
              <h3 className="text-white font-medium">{meeting.title}</h3>
              <p className="text-slate-400 text-sm">{meeting.location}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-slate-400 text-xs">Date</p>
                <p className="text-white">{meeting.date}</p>
              </div>
              <div className="text-right">
                <p className="text-slate-400 text-xs">Decisions</p>
                <p className="text-white">{meeting.decisions.length}</p>
              </div>
              <Eye size={18} className="text-slate-400" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ShareholdersView({
  shareholders,
  pieData,
  onView,
}: {
  shareholders: Shareholder[];
  pieData: { name: string; value: number; color: string }[];
  onView: (s: Shareholder) => void;
}) {
  const tooltipStyle = {
    backgroundColor: '#1e293b',
    border: '1px solid #334155',
    borderRadius: '12px',
    color: '#ffffff',
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Pie Chart */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Ownership Structure</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsPC>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
                label={({ name, percent }) => `${name.substring(0, 15)}... (${(percent * 100).toFixed(0)}%)`}
                labelLine={false}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </RechartsPC>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Shareholders List */}
      <div className="space-y-3">
        {shareholders.map((shareholder, index) => (
          <div
            key={shareholder.id}
            className="bg-slate-800/50 rounded-xl border border-slate-700 p-4 hover:border-amber-600/50 transition-colors cursor-pointer animate-fade-in"
            style={{ animationDelay: `${index * 50}ms` }}
            onClick={() => onView(shareholder)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: SHAREHOLDER_COLORS[index % SHAREHOLDER_COLORS.length] }}
                />
                <div>
                  <h4 className="text-white font-medium">{shareholder.name}</h4>
                  <p className="text-slate-400 text-sm">{shareholder.type}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white font-bold">{shareholder.percentage}%</p>
                <p className="text-slate-400 text-sm">{shareholder.shares.toLocaleString()} shares</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ResolutionsList({ resolutions, onView }: { resolutions: CircularResolution[]; onView: (r: CircularResolution) => void }) {
  if (resolutions.length === 0) {
    return <EmptyState title="No resolutions found" description="Circular resolutions will appear here" />;
  }

  return (
    <div className="space-y-4">
      {resolutions.map((resolution, index) => {
        const approvedCount = resolution.approvals.filter(a => a.decision === 'approved').length;
        const totalApprovers = resolution.approvals.length;

        return (
          <div
            key={resolution.id}
            className="bg-slate-800/50 rounded-xl border border-slate-700 p-4 hover:border-amber-600/50 transition-colors cursor-pointer animate-fade-in"
            style={{ animationDelay: `${index * 50}ms` }}
            onClick={() => onView(resolution)}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-amber-400 font-mono text-sm">{resolution.resolution_number}</span>
                  <StatusBadge status={resolution.status} />
                  <StatusBadge status={resolution.resolution_type} variant="outline" />
                </div>
                <h3 className="text-white font-medium">{resolution.subject}</h3>
                <p className="text-slate-400 text-sm">Proposed by: {resolution.proposed_by}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-slate-400 text-xs">Approvals</p>
                  <p className="text-white">{approvedCount}/{totalApprovers}</p>
                </div>
                <div className="text-right">
                  <p className="text-slate-400 text-xs">Deadline</p>
                  <p className="text-white">{resolution.deadline}</p>
                </div>
                <Eye size={18} className="text-slate-400" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function MeetingDetail({ meeting }: { meeting: MeetingMinutes }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-amber-400 font-mono text-sm">{meeting.meeting_number}</p>
          <h3 className="text-xl font-semibold text-white">{meeting.title}</h3>
        </div>
        <div className="flex gap-2">
          <StatusBadge status={meeting.status} />
          <StatusBadge status={MEETING_TYPE_LABELS[meeting.meeting_type]} variant="outline" />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-800 rounded-lg p-4">
          <p className="text-slate-400 text-sm">Date</p>
          <p className="text-white">{meeting.date}</p>
        </div>
        <div className="bg-slate-800 rounded-lg p-4">
          <p className="text-slate-400 text-sm">Time</p>
          <p className="text-white">{meeting.start_time} - {meeting.end_time}</p>
        </div>
        <div className="bg-slate-800 rounded-lg p-4">
          <p className="text-slate-400 text-sm">Location</p>
          <p className="text-white">{meeting.location}</p>
        </div>
        <div className="bg-slate-800 rounded-lg p-4">
          <p className="text-slate-400 text-sm">Prepared By</p>
          <p className="text-white">{meeting.prepared_by}</p>
        </div>
      </div>

      {/* Attendees */}
      <div>
        <h4 className="text-white font-medium mb-3">Attendees</h4>
        <div className="grid grid-cols-2 gap-3">
          {meeting.attendees.map((attendee) => (
            <div key={attendee.id} className="bg-slate-800 rounded-lg p-3 flex items-center justify-between">
              <div>
                <p className="text-white">{attendee.name}</p>
                <p className="text-slate-400 text-sm">{attendee.position}</p>
              </div>
              <StatusBadge status={attendee.attendance} size="sm" />
            </div>
          ))}
        </div>
      </div>

      {/* Agenda */}
      <div>
        <h4 className="text-white font-medium mb-3">Agenda</h4>
        <ol className="list-decimal list-inside space-y-1">
          {meeting.agenda.map((item, i) => (
            <li key={i} className="text-slate-300">{item}</li>
          ))}
        </ol>
      </div>

      {/* Decisions */}
      {meeting.decisions.length > 0 && (
        <div>
          <h4 className="text-white font-medium mb-3">Decisions</h4>
          <div className="space-y-3">
            {meeting.decisions.map((decision) => (
              <div key={decision.id} className="bg-amber-900/30 border border-amber-600/50 rounded-lg p-3">
                <p className="text-amber-300 font-mono text-sm">{decision.decision_number}</p>
                <p className="text-white">{decision.description}</p>
                {decision.voting_result && <p className="text-slate-400 text-sm mt-1">Voting: {decision.voting_result}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Items */}
      {meeting.action_items.length > 0 && (
        <div>
          <h4 className="text-white font-medium mb-3">Action Items</h4>
          <div className="space-y-2">
            {meeting.action_items.map((item) => (
              <div key={item.id} className="flex items-center justify-between bg-slate-800 rounded-lg p-3">
                <div>
                  <p className="text-white">{item.description}</p>
                  <p className="text-slate-400 text-sm">Due: {item.due_date} | {item.responsible}</p>
                </div>
                <StatusBadge status={item.status} size="sm" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ShareholderDetail({ shareholder }: { shareholder: Shareholder }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <StatusBadge status={shareholder.type} variant="outline" />
        <StatusBadge status={shareholder.share_class} variant="outline" />
        <StatusBadge status={shareholder.status} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-800 rounded-lg p-4">
          <p className="text-slate-400 text-sm">Shares</p>
          <p className="text-2xl font-bold text-white">{shareholder.shares.toLocaleString()}</p>
        </div>
        <div className="bg-slate-800 rounded-lg p-4">
          <p className="text-slate-400 text-sm">Ownership</p>
          <p className="text-2xl font-bold text-amber-400">{shareholder.percentage}%</p>
        </div>
        <div className="bg-slate-800 rounded-lg p-4">
          <p className="text-slate-400 text-sm">Acquisition Date</p>
          <p className="text-white">{shareholder.acquisition_date}</p>
        </div>
        <div className="bg-slate-800 rounded-lg p-4">
          <p className="text-slate-400 text-sm">Acquisition Type</p>
          <p className="text-white capitalize">{shareholder.acquisition_type.replace('_', ' ')}</p>
        </div>
      </div>

      {shareholder.nationality && (
        <div className="bg-slate-800 rounded-lg p-4">
          <p className="text-slate-400 text-sm">Nationality</p>
          <p className="text-white">{shareholder.nationality}</p>
        </div>
      )}

      {(shareholder.contact_email || shareholder.contact_phone) && (
        <div className="grid grid-cols-2 gap-4">
          {shareholder.contact_email && (
            <div className="bg-slate-800 rounded-lg p-4">
              <p className="text-slate-400 text-sm">Email</p>
              <p className="text-white">{shareholder.contact_email}</p>
            </div>
          )}
          {shareholder.contact_phone && (
            <div className="bg-slate-800 rounded-lg p-4">
              <p className="text-slate-400 text-sm">Phone</p>
              <p className="text-white">{shareholder.contact_phone}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ResolutionDetail({ resolution }: { resolution: CircularResolution }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-amber-400 font-mono">{resolution.resolution_number}</p>
        <div className="flex gap-2">
          <StatusBadge status={resolution.status} />
          <StatusBadge status={resolution.resolution_type} variant="outline" />
        </div>
      </div>

      <h3 className="text-xl font-semibold text-white">{resolution.subject}</h3>
      <p className="text-slate-300">{resolution.description}</p>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-800 rounded-lg p-4">
          <p className="text-slate-400 text-sm">Proposed By</p>
          <p className="text-white">{resolution.proposed_by}</p>
        </div>
        <div className="bg-slate-800 rounded-lg p-4">
          <p className="text-slate-400 text-sm">Deadline</p>
          <p className="text-white">{resolution.deadline}</p>
        </div>
      </div>

      {/* Approvals */}
      <div>
        <h4 className="text-white font-medium mb-3">Approvals</h4>
        <div className="space-y-2">
          {resolution.approvals.map((approval) => (
            <div key={approval.id} className="flex items-center justify-between bg-slate-800 rounded-lg p-3">
              <div>
                <p className="text-white">{approval.approver_name}</p>
                <p className="text-slate-400 text-sm">{approval.approver_position}</p>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={approval.decision} />
                {approval.decided_at && <span className="text-slate-400 text-sm">{approval.decided_at}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {resolution.effective_date && (
        <div className="bg-emerald-900/30 border border-emerald-600/50 rounded-lg p-4">
          <p className="text-emerald-300 font-medium">Effective Date</p>
          <p className="text-white">{resolution.effective_date}</p>
        </div>
      )}
    </div>
  );
}

export { Secretarial };
