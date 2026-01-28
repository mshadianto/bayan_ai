import { useState, useEffect, useCallback } from 'react';
import { Header } from '../../components/Layout';
import { StatCard, StatusBadge, TableSkeleton, Modal, ModalButton } from '../../components/common';
import type { PerformanceReview, KPI, Employee } from '../../types';
import { format } from 'date-fns';
import { Star, TrendingUp, Target, Award, Plus, Edit, Eye, CheckCircle, XCircle } from 'lucide-react';
import { hcmsApi, CreateReviewInput, SubmitReviewInput } from '../../services/supabaseHcms';

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

// Create Review Modal
function CreateReviewModal({
  employees,
  onClose,
  onSubmit,
  isSubmitting
}: {
  employees: Employee[];
  onClose: () => void;
  onSubmit: (data: CreateReviewInput) => void;
  isSubmitting: boolean;
}) {
  const [form, setForm] = useState<CreateReviewInput>({
    employee_id: '',
    employee_name: '',
    period: new Date().getFullYear().toString(),
    review_type: 'annual',
    reviewer_id: 'BPKH001',
    reviewer_name: 'Abdullah Al-Faisal',
  });

  const handleEmployeeChange = (employeeId: string) => {
    const emp = employees.find(e => e.employee_id === employeeId);
    if (emp) {
      setForm({
        ...form,
        employee_id: emp.employee_id,
        employee_name: `${emp.first_name} ${emp.last_name}`,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  const activeEmployees = employees.filter(e => e.employment_status === 'active');

  return (
    <Modal isOpen={true} title="Initiate Performance Review" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-content-tertiary mb-1">Employee *</label>
          <select
            required
            value={form.employee_id}
            onChange={e => handleEmployeeChange(e.target.value)}
            className="w-full px-3 py-2 bg-input border border-border-subtle rounded-lg text-content focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="">Select Employee</option>
            {activeEmployees.map(emp => (
              <option key={emp.employee_id} value={emp.employee_id}>
                {emp.first_name} {emp.last_name} - {emp.department}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-content-tertiary mb-1">Review Period *</label>
            <input
              type="text"
              required
              value={form.period}
              onChange={e => setForm({ ...form, period: e.target.value })}
              className="w-full px-3 py-2 bg-input border border-border-subtle rounded-lg text-content focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="e.g., 2024"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-content-tertiary mb-1">Review Type *</label>
            <select
              required
              value={form.review_type}
              onChange={e => setForm({ ...form, review_type: e.target.value as CreateReviewInput['review_type'] })}
              className="w-full px-3 py-2 bg-input border border-border-subtle rounded-lg text-content focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="annual">Annual</option>
              <option value="mid_year">Mid-Year</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-content-tertiary mb-1">Reviewer</label>
          <input
            type="text"
            value={form.reviewer_name}
            onChange={e => setForm({ ...form, reviewer_name: e.target.value })}
            className="w-full px-3 py-2 bg-input border border-border-subtle rounded-lg text-content focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <ModalButton variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </ModalButton>
          <button
            type="submit"
            disabled={isSubmitting || !form.employee_id}
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Creating...' : 'Initiate Review'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

// Submit Review Modal
function SubmitReviewModal({
  review,
  onClose,
  onSubmit,
  isSubmitting
}: {
  review: PerformanceReview;
  onClose: () => void;
  onSubmit: (data: SubmitReviewInput) => void;
  isSubmitting: boolean;
}) {
  const [form, setForm] = useState<SubmitReviewInput>({
    id: review.id,
    overall_score: review.overall_score || 3,
    rating: review.rating || 'meets',
    comments: review.comments || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  const ratings: { value: SubmitReviewInput['rating']; label: string; color: string }[] = [
    { value: 'exceptional', label: 'Exceptional', color: 'bg-purple-500' },
    { value: 'exceeds', label: 'Exceeds Expectations', color: 'bg-emerald-500' },
    { value: 'meets', label: 'Meets Expectations', color: 'bg-blue-500' },
    { value: 'below', label: 'Below Expectations', color: 'bg-amber-500' },
    { value: 'unsatisfactory', label: 'Unsatisfactory', color: 'bg-red-500' },
  ];

  return (
    <Modal isOpen={true} title={`Submit Review: ${review.employee_name}`} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="p-4 bg-hover rounded-xl">
          <p className="text-content font-semibold">{review.employee_name}</p>
          <p className="text-sm text-content-secondary">{review.period} {review.review_type.replace('_', '-')} Review</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-content-tertiary mb-2">Overall Score (1-5) *</label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min={1}
              max={5}
              step={0.1}
              value={form.overall_score}
              onChange={e => setForm({ ...form, overall_score: parseFloat(e.target.value) })}
              className="flex-1 h-2 bg-hover rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <div className="flex items-center gap-1 min-w-[100px]">
              {[1, 2, 3, 4, 5].map(star => (
                <Star
                  key={star}
                  size={20}
                  className={`${star <= Math.round(form.overall_score) ? 'text-amber-400 fill-amber-400' : 'text-content-muted'}`}
                  onClick={() => setForm({ ...form, overall_score: star })}
                />
              ))}
            </div>
            <span className="text-content font-bold text-lg w-12">{form.overall_score.toFixed(1)}</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-content-tertiary mb-2">Rating *</label>
          <div className="space-y-2">
            {ratings.map(rating => (
              <label
                key={rating.value}
                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                  form.rating === rating.value
                    ? 'border-indigo-500 bg-indigo-500/20'
                    : 'border-border-subtle hover:border-border'
                }`}
              >
                <input
                  type="radio"
                  name="rating"
                  value={rating.value}
                  checked={form.rating === rating.value}
                  onChange={e => setForm({ ...form, rating: e.target.value as SubmitReviewInput['rating'] })}
                  className="sr-only"
                />
                <span className={`w-3 h-3 rounded-full ${rating.color}`} />
                <span className="text-content">{rating.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-content-tertiary mb-1">Comments</label>
          <textarea
            rows={3}
            value={form.comments}
            onChange={e => setForm({ ...form, comments: e.target.value })}
            className="w-full px-3 py-2 bg-input border border-border-subtle rounded-lg text-content focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
            placeholder="Enter feedback and development areas..."
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
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

// Review Detail Modal
function ReviewDetailModal({
  review,
  onClose
}: {
  review: PerformanceReview;
  onClose: () => void;
}) {
  const renderStars = (score: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map(star => (
          <Star
            key={star}
            size={24}
            className={`${star <= Math.round(score) ? 'text-amber-400 fill-amber-400' : 'text-content-muted'}`}
          />
        ))}
        <span className="ml-2 text-content font-bold text-xl">{score.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <Modal isOpen={true} title="Performance Review Details" onClose={onClose}>
      <div className="space-y-4">
        <div className="text-center p-6 bg-hover rounded-xl">
          <p className="text-content font-semibold text-xl">{review.employee_name}</p>
          <p className="text-content-secondary">{review.employee_id}</p>
          <div className="mt-4 flex justify-center">
            {renderStars(review.overall_score)}
          </div>
          <div className="mt-3">
            <StatusBadge status={review.rating} variant="outline" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-input rounded-xl">
            <p className="text-sm text-content-secondary">Review Period</p>
            <p className="text-content font-medium">{review.period}</p>
          </div>
          <div className="p-4 bg-input rounded-xl">
            <p className="text-sm text-content-secondary">Review Type</p>
            <p className="text-content font-medium capitalize">{review.review_type.replace('_', ' ')}</p>
          </div>
          <div className="p-4 bg-input rounded-xl">
            <p className="text-sm text-content-secondary">Reviewer</p>
            <p className="text-content font-medium">{review.reviewer_name}</p>
          </div>
          <div className="p-4 bg-input rounded-xl">
            <p className="text-sm text-content-secondary">Status</p>
            <StatusBadge status={review.status} />
          </div>
        </div>

        {review.comments && (
          <div className="p-4 bg-input rounded-xl">
            <p className="text-sm text-content-secondary mb-2">Comments</p>
            <p className="text-content">{review.comments}</p>
          </div>
        )}

        <div className="text-center text-sm text-content-secondary">
          Created: {format(new Date(review.created_at), 'MMMM d, yyyy')}
        </div>

        <div className="flex gap-3 pt-4">
          <ModalButton variant="secondary" onClick={onClose}>
            Close
          </ModalButton>
        </div>
      </div>
    </Modal>
  );
}

const ratingDistribution = [
  { rating: 'Exceptional', count: 2, percentage: 4 },
  { rating: 'Exceeds', count: 15, percentage: 31 },
  { rating: 'Meets', count: 25, percentage: 52 },
  { rating: 'Below', count: 5, percentage: 10 },
  { rating: 'Unsatisfactory', count: 1, percentage: 2 },
];

export function Performance() {
  const [reviews, setReviews] = useState<PerformanceReview[]>([]);
  const [kpis, setKpis] = useState<KPI[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingReview, setEditingReview] = useState<PerformanceReview | null>(null);
  const [viewingReview, setViewingReview] = useState<PerformanceReview | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Toast state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const [reviewsData, kpisData, employeesData] = await Promise.all([
        hcmsApi.performance.getReviews(),
        hcmsApi.performance.getKPIs(),
        hcmsApi.employees.getAll(),
      ]);
      setReviews(reviewsData);
      setKpis(kpisData);
      setEmployees(employeesData);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreateReview = async (data: CreateReviewInput) => {
    setIsSubmitting(true);
    try {
      const newReview = await hcmsApi.performance.createReview(data);
      setReviews(prev => [...prev, newReview]);
      setShowCreateModal(false);
      setToast({ message: `Review initiated for ${newReview.employee_name}`, type: 'success' });
    } catch (err) {
      setToast({ message: 'Failed to create review', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitReview = async (data: SubmitReviewInput) => {
    setIsSubmitting(true);
    try {
      const updated = await hcmsApi.performance.submitReview(data);
      setReviews(prev => prev.map(r => r.id === updated.id ? updated : r));
      setEditingReview(null);
      setToast({ message: `Review submitted for ${updated.employee_name}`, type: 'success' });
    } catch (err) {
      setToast({ message: 'Failed to submit review', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (score: number) => {
    const fullStars = Math.floor(score);
    const hasHalf = score % 1 >= 0.5;
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={16}
            className={`${
              i < fullStars
                ? 'text-amber-400 fill-amber-400'
                : i === fullStars && hasHalf
                ? 'text-amber-400 fill-amber-400/50'
                : 'text-content-muted'
            }`}
          />
        ))}
        <span className="ml-2 text-content font-semibold">{score.toFixed(1)}</span>
      </div>
    );
  };

  const completedCount = reviews.filter(r => r.status === 'acknowledged').length;
  const avgScore = reviews.length > 0 ? (reviews.reduce((s, r) => s + r.overall_score, 0) / reviews.length).toFixed(1) : '0';
  const topPerformers = reviews.filter(r => r.rating === 'exceeds' || r.rating === 'exceptional').length;
  const pendingCount = reviews.filter(r => r.status !== 'acknowledged').length;

  const stats = [
    { icon: <Target size={20} />, label: 'Reviews Completed', value: `${completedCount}/${reviews.length}`, variant: 'info' as const },
    { icon: <TrendingUp size={20} />, label: 'Avg Score', value: avgScore, variant: 'success' as const },
    { icon: <Award size={20} />, label: 'Top Performers', value: topPerformers },
    { icon: <Star size={20} />, label: 'Pending Reviews', value: pendingCount, variant: 'warning' as const },
  ];

  return (
    <div className="animate-fade-in">
      <Header title="Performance Management" subtitle="KPI tracking and appraisals" />
      <div className="p-6">
        {/* Summary Cards */}
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
            New Review
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Rating Distribution */}
          <div className="bg-card rounded-xl border border-border p-5">
            <h3 className="text-lg font-semibold text-content mb-4 flex items-center gap-2">
              Rating Distribution
            </h3>
            <div className="space-y-3">
              {ratingDistribution.map((item) => (
                <div key={item.rating}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-content-tertiary">{item.rating}</span>
                    <span className="text-content-secondary">{item.count} ({item.percentage}%)</span>
                  </div>
                  <div className="h-2 bg-hover rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        item.rating === 'Exceptional' ? 'bg-purple-500' :
                        item.rating === 'Exceeds' ? 'bg-emerald-500' :
                        item.rating === 'Meets' ? 'bg-blue-500' :
                        item.rating === 'Below' ? 'bg-amber-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* KPI Overview */}
          <div className="bg-card rounded-xl border border-border p-5 lg:col-span-2">
            <h3 className="text-lg font-semibold text-content mb-4 flex items-gap-2">
              Sample KPIs - Abdullah Al-Faisal
            </h3>
            <div className="space-y-3">
              {kpis.map((kpi) => (
                <div key={kpi.id} className="bg-app rounded-xl p-4 border border-border">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-content font-medium">{kpi.kpi_name}</p>
                      <p className="text-xs text-content-secondary">Weight: {kpi.weight}%</p>
                    </div>
                    <span className={`text-lg font-bold ${kpi.score >= 100 ? 'text-emerald-400' : kpi.score >= 80 ? 'text-blue-400' : 'text-amber-400'}`}>
                      {kpi.score}%
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-content-secondary">Target: {kpi.target}%</span>
                    <span className="text-content-secondary">Actual: {kpi.actual}%</span>
                  </div>
                  <div className="mt-2 h-2 bg-hover rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${kpi.score >= 100 ? 'bg-emerald-500' : kpi.score >= 80 ? 'bg-blue-500' : 'bg-amber-500'}`}
                      style={{ width: `${Math.min(kpi.score, 120)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Performance Reviews */}
        {loading ? (
          <TableSkeleton rows={5} columns={6} />
        ) : (
          <div className="bg-card rounded-xl border border-border">
            <div className="p-4 border-b border-border">
              <h3 className="font-semibold text-content flex items-center gap-2">
                Performance Reviews
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-input">
                  <tr>
                    <th className="text-left p-4 text-sm font-medium text-content-secondary">Employee</th>
                    <th className="text-left p-4 text-sm font-medium text-content-secondary">Score</th>
                    <th className="text-left p-4 text-sm font-medium text-content-secondary">Rating</th>
                    <th className="text-left p-4 text-sm font-medium text-content-secondary">Reviewer</th>
                    <th className="text-left p-4 text-sm font-medium text-content-secondary">Status</th>
                    <th className="text-left p-4 text-sm font-medium text-content-secondary">Date</th>
                    <th className="text-right p-4 text-sm font-medium text-content-secondary">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reviews.map((review, index) => (
                    <tr
                      key={review.id}
                      className="border-t border-border hover:bg-card animate-fade-in"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <td className="p-4">
                        <div>
                          <p className="text-content font-medium">{review.employee_name}</p>
                          <p className="text-sm text-content-secondary">{review.employee_id}</p>
                        </div>
                      </td>
                      <td className="p-4">{renderStars(review.overall_score)}</td>
                      <td className="p-4">
                        <StatusBadge status={review.rating} variant="outline" />
                      </td>
                      <td className="p-4 text-content-tertiary">{review.reviewer_name}</td>
                      <td className="p-4">
                        <StatusBadge status={review.status} />
                      </td>
                      <td className="p-4 text-sm text-content-secondary">
                        {format(new Date(review.created_at), 'MMM d, yyyy')}
                      </td>
                      <td className="p-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setViewingReview(review)}
                            className="p-2 hover:bg-hover rounded-lg transition-colors"
                            title="View details"
                          >
                            <Eye size={16} className="text-content-secondary" />
                          </button>
                          {review.status === 'draft' && (
                            <button
                              onClick={() => setEditingReview(review)}
                              className="p-2 hover:bg-hover rounded-lg transition-colors"
                              title="Submit review"
                            >
                              <Edit size={16} className="text-indigo-400" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showCreateModal && (
        <CreateReviewModal
          employees={employees}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateReview}
          isSubmitting={isSubmitting}
        />
      )}

      {editingReview && (
        <SubmitReviewModal
          review={editingReview}
          onClose={() => setEditingReview(null)}
          onSubmit={handleSubmitReview}
          isSubmitting={isSubmitting}
        />
      )}

      {viewingReview && (
        <ReviewDetailModal
          review={viewingReview}
          onClose={() => setViewingReview(null)}
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
export default Performance;
