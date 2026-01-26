import { useState, useEffect } from 'react';
import { Header } from '../../components/Layout';
import { StatCard, StatusBadge, CardGridSkeleton } from '../../components/common';
import type { Training as TrainingType, TrainingEnrollment } from '../../types';
import { format } from 'date-fns';
import { BookOpen, Users, Clock, Award, Calendar } from 'lucide-react';
import { hcmsApi } from '../../services/mockData/hcms';

export function Training() {
  const [trainings, setTrainings] = useState<TrainingType[]>([]);
  const [enrollments, setEnrollments] = useState<TrainingEnrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTraining, setSelectedTraining] = useState<TrainingType | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [trainingsData, enrollmentsData] = await Promise.all([
          hcmsApi.training.getAll(),
          hcmsApi.training.getEnrollments(),
        ]);
        setTrainings(trainingsData);
        setEnrollments(enrollmentsData);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const categoryStyles: Record<string, string> = {
    mandatory: 'bg-red-900/50 text-red-300',
    technical: 'bg-blue-900/50 text-blue-300',
    soft_skill: 'bg-purple-900/50 text-purple-300',
    leadership: 'bg-amber-900/50 text-amber-300',
  };

  const typeEmoji: Record<string, string> = {
    internal: '🏢',
    external: '🌐',
    online: '💻',
  };

  const totalHours = trainings.reduce((s, t) => s + t.duration_hours, 0);
  const totalEnrolled = trainings.reduce((s, t) => s + t.enrolled, 0);
  const completedTrainings = trainings.filter(t => t.status === 'completed').length;

  const stats = [
    { icon: <BookOpen size={20} />, label: 'Total Programs', value: trainings.length, variant: 'info' as const },
    { icon: <Clock size={20} />, label: 'Total Hours', value: totalHours },
    { icon: <Users size={20} />, label: 'Total Enrolled', value: totalEnrolled, variant: 'success' as const },
    { icon: <Award size={20} />, label: 'Completed', value: completedTrainings, variant: 'warning' as const },
  ];

  return (
    <div className="animate-fade-in">
      <Header title="Training & LMS" subtitle="Learning and development programs" />
      <div className="p-6">
        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 stagger-children">
          {stats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>

        {/* Training Cards */}
        {loading ? (
          <CardGridSkeleton count={4} columns={2} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 stagger-children">
            {trainings.map((training, index) => (
              <div
                key={training.id}
                className="bg-slate-800/50 rounded-xl border border-slate-700 p-5 hover:border-slate-600 transition-all cursor-pointer card-hover animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={() => setSelectedTraining(selectedTraining?.id === training.id ? null : training)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{typeEmoji[training.type]}</span>
                    <div>
                      <h4 className="text-white font-semibold">{training.title}</h4>
                      {training.provider && (
                        <p className="text-sm text-slate-400">by {training.provider}</p>
                      )}
                    </div>
                  </div>
                  <StatusBadge status={training.status} variant="outline" />
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <span className={`px-2 py-0.5 rounded text-xs ${categoryStyles[training.category]}`}>
                    {training.category.replace('_', ' ')}
                  </span>
                  <span className="px-2 py-0.5 rounded text-xs bg-slate-700 text-slate-300">
                    {training.type}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-2 bg-slate-900/50 rounded-lg">
                    <Calendar size={16} className="mx-auto text-slate-400 mb-1" />
                    <p className="text-xs text-slate-400">Date</p>
                    <p className="text-sm text-white">{format(new Date(training.start_date), 'MMM d')}</p>
                  </div>
                  <div className="text-center p-2 bg-slate-900/50 rounded-lg">
                    <Clock size={16} className="mx-auto text-slate-400 mb-1" />
                    <p className="text-xs text-slate-400">Duration</p>
                    <p className="text-sm text-white">{training.duration_hours}h</p>
                  </div>
                  <div className="text-center p-2 bg-slate-900/50 rounded-lg">
                    <Users size={16} className="mx-auto text-slate-400 mb-1" />
                    <p className="text-xs text-slate-400">Enrolled</p>
                    <p className="text-sm text-white">{training.enrolled}/{training.max_participants}</p>
                  </div>
                </div>

                {/* Capacity Bar */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">Capacity</span>
                    <span className="text-slate-400">{Math.round((training.enrolled / training.max_participants) * 100)}%</span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        training.enrolled >= training.max_participants ? 'bg-red-500' :
                        training.enrolled >= training.max_participants * 0.8 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${(training.enrolled / training.max_participants) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Enrollments for selected training */}
                {selectedTraining?.id === training.id && (
                  <div className="mt-4 pt-4 border-t border-slate-700 animate-fade-in">
                    <h5 className="text-sm font-semibold text-slate-300 mb-3">Participants</h5>
                    <div className="space-y-2">
                      {enrollments
                        .filter(e => e.training_id === training.id)
                        .map((enrollment) => (
                          <div key={enrollment.id} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-xl">
                            <div>
                              <p className="text-white font-medium">{enrollment.employee_name}</p>
                              <p className="text-xs text-slate-400">{enrollment.employee_id}</p>
                            </div>
                            <div className="flex items-center gap-3">
                              {enrollment.score && (
                                <span className="text-sm font-bold text-emerald-400">{enrollment.score}%</span>
                              )}
                              <StatusBadge status={enrollment.status} size="sm" />
                            </div>
                          </div>
                        ))}
                      {enrollments.filter(e => e.training_id === training.id).length === 0 && (
                        <p className="text-slate-400 text-sm text-center py-2">No participants data</p>
                      )}
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
export default Training;
