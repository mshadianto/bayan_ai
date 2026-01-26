import { useState, useEffect, useCallback } from 'react';
import { Header } from '../../components/Layout';
import { StatCard, StatusBadge, CardGridSkeleton, Modal, ModalButton } from '../../components/common';
import type { Training as TrainingType, TrainingEnrollment, Employee } from '../../types';
import { format } from 'date-fns';
import { BookOpen, Users, Clock, Award, Calendar, Plus, UserPlus, CheckCircle, XCircle } from 'lucide-react';
import { hcmsApi, CreateTrainingInput, EnrollEmployeeInput } from '../../services/mockData/hcms';

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

// Create Training Program Modal
function CreateProgramModal({
  onClose,
  onSubmit,
  isSubmitting
}: {
  onClose: () => void;
  onSubmit: (data: CreateTrainingInput) => void;
  isSubmitting: boolean;
}) {
  const [form, setForm] = useState<CreateTrainingInput>({
    title: '',
    type: 'internal',
    category: 'mandatory',
    start_date: '',
    end_date: '',
    duration_hours: 8,
    max_participants: 20,
    provider: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <Modal isOpen={true} title="Create Training Program" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Program Title *</label>
          <input
            type="text"
            required
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="e.g., Leadership Development Program"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Type *</label>
            <select
              required
              value={form.type}
              onChange={e => setForm({ ...form, type: e.target.value as CreateTrainingInput['type'] })}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="internal">Internal</option>
              <option value="external">External</option>
              <option value="online">Online</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Category *</label>
            <select
              required
              value={form.category}
              onChange={e => setForm({ ...form, category: e.target.value as CreateTrainingInput['category'] })}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="mandatory">Mandatory</option>
              <option value="technical">Technical</option>
              <option value="soft_skill">Soft Skills</option>
              <option value="leadership">Leadership</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Start Date *</label>
            <input
              type="date"
              required
              value={form.start_date}
              onChange={e => setForm({ ...form, start_date: e.target.value })}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">End Date *</label>
            <input
              type="date"
              required
              value={form.end_date}
              onChange={e => setForm({ ...form, end_date: e.target.value })}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Duration (Hours) *</label>
            <input
              type="number"
              required
              min={1}
              value={form.duration_hours}
              onChange={e => setForm({ ...form, duration_hours: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Max Participants *</label>
            <input
              type="number"
              required
              min={1}
              value={form.max_participants}
              onChange={e => setForm({ ...form, max_participants: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>

        {form.type !== 'internal' && (
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Provider</label>
            <input
              type="text"
              value={form.provider || ''}
              onChange={e => setForm({ ...form, provider: e.target.value })}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="e.g., Coursera, Microsoft"
            />
          </div>
        )}

        <div className="flex gap-3 pt-4">
          <ModalButton variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </ModalButton>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Creating...' : 'Create Program'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

// Enroll Employee Modal
function EnrollEmployeeModal({
  training,
  employees,
  enrolledIds,
  onClose,
  onSubmit,
  isSubmitting
}: {
  training: TrainingType;
  employees: Employee[];
  enrolledIds: Set<string>;
  onClose: () => void;
  onSubmit: (data: EnrollEmployeeInput) => void;
  isSubmitting: boolean;
}) {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const availableEmployees = employees.filter(e =>
    e.employment_status === 'active' && !enrolledIds.has(e.employee_id)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmployee) return;
    onSubmit({
      training_id: training.id,
      employee_id: selectedEmployee.employee_id,
      employee_name: `${selectedEmployee.first_name} ${selectedEmployee.last_name}`,
    });
  };

  const isFull = training.enrolled >= training.max_participants;

  return (
    <Modal isOpen={true} title={`Enroll in: ${training.title}`} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {isFull ? (
          <div className="p-4 bg-amber-900/30 border border-amber-700 rounded-xl text-amber-300 text-center">
            This training program is at full capacity ({training.max_participants}/{training.max_participants})
          </div>
        ) : (
          <>
            <div className="p-4 bg-slate-700/50 rounded-xl">
              <p className="text-white font-semibold">{training.title}</p>
              <p className="text-sm text-slate-400">
                {format(new Date(training.start_date), 'MMM d, yyyy')} - {format(new Date(training.end_date), 'MMM d, yyyy')}
              </p>
              <p className="text-sm text-slate-400 mt-1">
                Capacity: {training.enrolled}/{training.max_participants}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Select Employee *</label>
              {availableEmployees.length === 0 ? (
                <p className="text-slate-400 text-sm text-center py-4">All employees are already enrolled</p>
              ) : (
                <div className="max-h-60 overflow-y-auto space-y-2">
                  {availableEmployees.map(emp => (
                    <label
                      key={emp.id}
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                        selectedEmployee?.id === emp.id
                          ? 'border-indigo-500 bg-indigo-500/20'
                          : 'border-slate-600 hover:border-slate-500'
                      }`}
                    >
                      <input
                        type="radio"
                        name="employee"
                        checked={selectedEmployee?.id === emp.id}
                        onChange={() => setSelectedEmployee(emp)}
                        className="sr-only"
                      />
                      <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold text-sm">
                        {emp.first_name[0]}{emp.last_name[0]}
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium">{emp.first_name} {emp.last_name}</p>
                        <p className="text-xs text-slate-400">{emp.department} - {emp.position}</p>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <ModalButton variant="secondary" onClick={onClose} disabled={isSubmitting}>
                Cancel
              </ModalButton>
              <button
                type="submit"
                disabled={isSubmitting || !selectedEmployee || availableEmployees.length === 0}
                className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Enrolling...' : 'Enroll Employee'}
              </button>
            </div>
          </>
        )}
      </form>
    </Modal>
  );
}

export function Training() {
  const [trainings, setTrainings] = useState<TrainingType[]>([]);
  const [enrollments, setEnrollments] = useState<TrainingEnrollment[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTraining, setSelectedTraining] = useState<TrainingType | null>(null);

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [enrollingTraining, setEnrollingTraining] = useState<TrainingType | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Toast state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const [trainingsData, enrollmentsData, employeesData] = await Promise.all([
        hcmsApi.training.getAll(),
        hcmsApi.training.getEnrollments(),
        hcmsApi.employees.getAll(),
      ]);
      setTrainings(trainingsData);
      setEnrollments(enrollmentsData);
      setEmployees(employeesData);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreateProgram = async (data: CreateTrainingInput) => {
    setIsSubmitting(true);
    try {
      const newProgram = await hcmsApi.training.createProgram(data);
      setTrainings(prev => [...prev, newProgram]);
      setShowCreateModal(false);
      setToast({ message: `Training "${newProgram.title}" created successfully`, type: 'success' });
    } catch (err) {
      setToast({ message: 'Failed to create training program', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEnrollEmployee = async (data: EnrollEmployeeInput) => {
    setIsSubmitting(true);
    try {
      const enrollment = await hcmsApi.training.enrollEmployee(data);
      setEnrollments(prev => [...prev, enrollment]);
      // Update training enrolled count
      setTrainings(prev => prev.map(t =>
        t.id === data.training_id ? { ...t, enrolled: t.enrolled + 1 } : t
      ));
      setEnrollingTraining(null);
      setToast({ message: `${data.employee_name} enrolled successfully`, type: 'success' });
    } catch (err: any) {
      setToast({ message: err.message || 'Failed to enroll employee', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getEnrolledEmployeeIds = (trainingId: string): Set<string> => {
    return new Set(
      enrollments
        .filter(e => e.training_id === trainingId)
        .map(e => e.employee_id)
    );
  };

  const categoryStyles: Record<string, string> = {
    mandatory: 'bg-red-900/50 text-red-300',
    technical: 'bg-blue-900/50 text-blue-300',
    soft_skill: 'bg-purple-900/50 text-purple-300',
    leadership: 'bg-amber-900/50 text-amber-300',
  };

  const typeEmoji: Record<string, string> = {
    internal: '',
    external: '',
    online: '',
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

        {/* Action Button */}
        <div className="flex justify-end mb-6">
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 transition-colors"
          >
            <Plus size={20} />
            New Program
          </button>
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
                    <div className="flex justify-between items-center mb-3">
                      <h5 className="text-sm font-semibold text-slate-300">Participants</h5>
                      {training.status !== 'completed' && training.enrolled < training.max_participants && (
                        <button
                          onClick={(e) => { e.stopPropagation(); setEnrollingTraining(training); }}
                          className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                        >
                          <UserPlus size={14} />
                          Enroll
                        </button>
                      )}
                    </div>
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
                        <p className="text-slate-400 text-sm text-center py-2">No participants yet</p>
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
        <CreateProgramModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateProgram}
          isSubmitting={isSubmitting}
        />
      )}

      {enrollingTraining && (
        <EnrollEmployeeModal
          training={enrollingTraining}
          employees={employees}
          enrolledIds={getEnrolledEmployeeIds(enrollingTraining.id)}
          onClose={() => setEnrollingTraining(null)}
          onSubmit={handleEnrollEmployee}
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
export default Training;
