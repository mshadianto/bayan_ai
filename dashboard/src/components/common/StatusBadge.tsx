import { ReactNode } from 'react';

interface StatusBadgeProps {
  status: string;
  variant?: 'default' | 'dot' | 'outline';
  size?: 'sm' | 'md';
  children?: ReactNode;
}

const STATUS_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
  // Success states
  active: { bg: 'bg-emerald-900/50', text: 'text-emerald-300', dot: 'bg-emerald-400' },
  approved: { bg: 'bg-emerald-900/50', text: 'text-emerald-300', dot: 'bg-emerald-400' },
  completed: { bg: 'bg-emerald-900/50', text: 'text-emerald-300', dot: 'bg-emerald-400' },
  paid: { bg: 'bg-emerald-900/50', text: 'text-emerald-300', dot: 'bg-emerald-400' },
  resolved: { bg: 'bg-emerald-900/50', text: 'text-emerald-300', dot: 'bg-emerald-400' },
  acknowledged: { bg: 'bg-emerald-900/50', text: 'text-emerald-300', dot: 'bg-emerald-400' },
  present: { bg: 'bg-emerald-900/50', text: 'text-emerald-300', dot: 'bg-emerald-400' },
  hired: { bg: 'bg-emerald-900/50', text: 'text-emerald-300', dot: 'bg-emerald-400' },
  exceeds: { bg: 'bg-emerald-900/50', text: 'text-emerald-300', dot: 'bg-emerald-400' },
  exceptional: { bg: 'bg-purple-900/50', text: 'text-purple-300', dot: 'bg-purple-400' },
  success: { bg: 'bg-emerald-900/50', text: 'text-emerald-300', dot: 'bg-emerald-400' },

  // Warning states
  pending: { bg: 'bg-amber-900/50', text: 'text-amber-300', dot: 'bg-amber-400' },
  processing: { bg: 'bg-amber-900/50', text: 'text-amber-300', dot: 'bg-amber-400' },
  screening: { bg: 'bg-amber-900/50', text: 'text-amber-300', dot: 'bg-amber-400' },
  investigation: { bg: 'bg-amber-900/50', text: 'text-amber-300', dot: 'bg-amber-400' },
  submitted: { bg: 'bg-amber-900/50', text: 'text-amber-300', dot: 'bg-amber-400' },
  late: { bg: 'bg-amber-900/50', text: 'text-amber-300', dot: 'bg-amber-400' },
  probation: { bg: 'bg-amber-900/50', text: 'text-amber-300', dot: 'bg-amber-400' },
  warning: { bg: 'bg-amber-900/50', text: 'text-amber-300', dot: 'bg-amber-400' },
  below: { bg: 'bg-amber-900/50', text: 'text-amber-300', dot: 'bg-amber-400' },
  ongoing: { bg: 'bg-amber-900/50', text: 'text-amber-300', dot: 'bg-amber-400' },

  // Info/Blue states
  open: { bg: 'bg-blue-900/50', text: 'text-blue-300', dot: 'bg-blue-400' },
  enrolled: { bg: 'bg-blue-900/50', text: 'text-blue-300', dot: 'bg-blue-400' },
  upcoming: { bg: 'bg-blue-900/50', text: 'text-blue-300', dot: 'bg-blue-400' },
  meets: { bg: 'bg-blue-900/50', text: 'text-blue-300', dot: 'bg-blue-400' },
  info: { bg: 'bg-blue-900/50', text: 'text-blue-300', dot: 'bg-blue-400' },
  leave: { bg: 'bg-blue-900/50', text: 'text-blue-300', dot: 'bg-blue-400' },

  // Purple states
  interviewing: { bg: 'bg-purple-900/50', text: 'text-purple-300', dot: 'bg-purple-400' },
  interview: { bg: 'bg-purple-900/50', text: 'text-purple-300', dot: 'bg-purple-400' },
  offer: { bg: 'bg-purple-900/50', text: 'text-purple-300', dot: 'bg-purple-400' },
  leadership: { bg: 'bg-purple-900/50', text: 'text-purple-300', dot: 'bg-purple-400' },

  // Error/Red states
  rejected: { bg: 'bg-red-900/50', text: 'text-red-300', dot: 'bg-red-400' },
  absent: { bg: 'bg-red-900/50', text: 'text-red-300', dot: 'bg-red-400' },
  critical: { bg: 'bg-red-900/50', text: 'text-red-300', dot: 'bg-red-400' },
  unsatisfactory: { bg: 'bg-red-900/50', text: 'text-red-300', dot: 'bg-red-400' },
  error: { bg: 'bg-red-900/50', text: 'text-red-300', dot: 'bg-red-400' },
  mandatory: { bg: 'bg-red-900/50', text: 'text-red-300', dot: 'bg-red-400' },

  // Neutral states
  inactive: { bg: 'bg-slate-700', text: 'text-slate-300', dot: 'bg-slate-400' },
  draft: { bg: 'bg-slate-700', text: 'text-slate-300', dot: 'bg-slate-400' },
  closed: { bg: 'bg-slate-700', text: 'text-slate-300', dot: 'bg-slate-400' },
  resigned: { bg: 'bg-slate-700', text: 'text-slate-300', dot: 'bg-slate-400' },
  normal: { bg: 'bg-slate-700', text: 'text-slate-300', dot: 'bg-slate-400' },
  technical: { bg: 'bg-slate-700', text: 'text-slate-300', dot: 'bg-slate-400' },
};

const DEFAULT_STYLE = { bg: 'bg-slate-700', text: 'text-slate-300', dot: 'bg-slate-400' };

export function StatusBadge({ status, variant = 'default', size = 'sm', children }: StatusBadgeProps) {
  const normalizedStatus = status.toLowerCase().replace(/[_\s-]/g, '');
  const style = STATUS_STYLES[normalizedStatus] || DEFAULT_STYLE;

  const sizeClasses = size === 'sm'
    ? 'px-2 py-0.5 text-xs'
    : 'px-2.5 py-1 text-sm';

  const displayText = children || status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, ' ');

  if (variant === 'dot') {
    return (
      <span className={`inline-flex items-center gap-1.5 ${sizeClasses} ${style.bg} ${style.text} rounded-full font-medium`}>
        <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
        {displayText}
      </span>
    );
  }

  if (variant === 'outline') {
    return (
      <span className={`inline-flex items-center ${sizeClasses} border ${style.bg} ${style.text} border-current/30 rounded-lg font-medium`}>
        {displayText}
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center ${sizeClasses} ${style.bg} ${style.text} rounded-lg font-medium`}>
      {displayText}
    </span>
  );
}
