import { useState, useEffect } from 'react';
import { Header } from '../../components/Layout';
import { StatCard, StatusBadge, TableSkeleton } from '../../components/common';
import type { PerformanceReview, KPI } from '../../types';
import { format } from 'date-fns';
import { Star, TrendingUp, Target, Award } from 'lucide-react';
import { hcmsApi } from '../../services/mockData/hcms';

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reviewsData, kpisData] = await Promise.all([
          hcmsApi.performance.getReviews(),
          hcmsApi.performance.getKPIs(),
        ]);
        setReviews(reviewsData);
        setKpis(kpisData);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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
                : 'text-slate-600'
            }`}
          />
        ))}
        <span className="ml-2 text-white font-semibold">{score.toFixed(1)}</span>
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Rating Distribution */}
          <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-5">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span>📊</span> Rating Distribution
            </h3>
            <div className="space-y-3">
              {ratingDistribution.map((item) => (
                <div key={item.rating}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-300">{item.rating}</span>
                    <span className="text-slate-400">{item.count} ({item.percentage}%)</span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
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
          <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-5 lg:col-span-2">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span>🎯</span> Sample KPIs - Abdullah Al-Faisal
            </h3>
            <div className="space-y-3">
              {kpis.map((kpi) => (
                <div key={kpi.id} className="bg-slate-900/50 rounded-xl p-4 border border-slate-700">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-white font-medium">{kpi.kpi_name}</p>
                      <p className="text-xs text-slate-400">Weight: {kpi.weight}%</p>
                    </div>
                    <span className={`text-lg font-bold ${kpi.score >= 100 ? 'text-emerald-400' : kpi.score >= 80 ? 'text-blue-400' : 'text-amber-400'}`}>
                      {kpi.score}%
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-slate-400">Target: {kpi.target}%</span>
                    <span className="text-slate-400">Actual: {kpi.actual}%</span>
                  </div>
                  <div className="mt-2 h-2 bg-slate-700 rounded-full overflow-hidden">
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
          <div className="bg-slate-800/50 rounded-xl border border-slate-700">
            <div className="p-4 border-b border-slate-700">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <span>⭐</span> 2023 Annual Reviews
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-800">
                  <tr>
                    <th className="text-left p-4 text-sm font-medium text-slate-400">Employee</th>
                    <th className="text-left p-4 text-sm font-medium text-slate-400">Score</th>
                    <th className="text-left p-4 text-sm font-medium text-slate-400">Rating</th>
                    <th className="text-left p-4 text-sm font-medium text-slate-400">Reviewer</th>
                    <th className="text-left p-4 text-sm font-medium text-slate-400">Status</th>
                    <th className="text-left p-4 text-sm font-medium text-slate-400">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {reviews.map((review, index) => (
                    <tr
                      key={review.id}
                      className="border-t border-slate-700 hover:bg-slate-800/50 animate-fade-in"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <td className="p-4">
                        <div>
                          <p className="text-white font-medium">{review.employee_name}</p>
                          <p className="text-sm text-slate-400">{review.employee_id}</p>
                        </div>
                      </td>
                      <td className="p-4">{renderStars(review.overall_score)}</td>
                      <td className="p-4">
                        <StatusBadge status={review.rating} variant="outline" />
                      </td>
                      <td className="p-4 text-slate-300">{review.reviewer_name}</td>
                      <td className="p-4">
                        <StatusBadge status={review.status} />
                      </td>
                      <td className="p-4 text-sm text-slate-400">
                        {format(new Date(review.created_at), 'MMM d, yyyy')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Named export for backward compatibility
export default Performance;
