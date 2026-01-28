import { ReactNode } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  subtext?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  className?: string;
}

const VARIANT_STYLES = {
  default: {
    bg: 'bg-card',
    border: 'border-border',
    icon: 'text-content-secondary',
  },
  success: {
    bg: 'bg-emerald-900/30',
    border: 'border-emerald-600/50',
    icon: 'text-emerald-400',
  },
  warning: {
    bg: 'bg-amber-900/30',
    border: 'border-amber-600/50',
    icon: 'text-amber-400',
  },
  error: {
    bg: 'bg-red-900/30',
    border: 'border-red-600/50',
    icon: 'text-red-400',
  },
  info: {
    bg: 'bg-blue-900/30',
    border: 'border-blue-600/50',
    icon: 'text-blue-400',
  },
};

export function StatCard({
  icon,
  label,
  value,
  subtext,
  trend,
  variant = 'default',
  className = '',
}: StatCardProps) {
  const styles = VARIANT_STYLES[variant];

  return (
    <div
      className={`${styles.bg} rounded-xl p-5 border ${styles.border} card-hover ${className}`}
    >
      <div className="flex items-center gap-3 mb-2">
        <div className={styles.icon}>{icon}</div>
        <span className="text-sm text-content-secondary">{label}</span>
      </div>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-2xl font-bold text-content">{value}</p>
          {subtext && <p className="text-xs text-content-muted mt-1">{subtext}</p>}
        </div>
        {trend && (
          <div
            className={`flex items-center gap-1 text-sm ${
              trend.isPositive ? 'text-emerald-400' : 'text-red-400'
            }`}
          >
            {trend.isPositive ? (
              <TrendingUp size={16} />
            ) : (
              <TrendingDown size={16} />
            )}
            <span>{Math.abs(trend.value)}%</span>
          </div>
        )}
      </div>
    </div>
  );
}

// Skeleton variant
export function StatCardSkeleton() {
  return (
    <div className="bg-card rounded-xl p-5 border border-border">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-5 h-5 rounded skeleton" />
        <div className="h-4 w-24 rounded skeleton" />
      </div>
      <div className="h-8 w-16 rounded skeleton mt-2" />
    </div>
  );
}
