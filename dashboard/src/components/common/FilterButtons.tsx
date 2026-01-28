interface FilterButtonsProps<T extends string> {
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
  variant?: 'default' | 'pills';
  colorMap?: Partial<Record<T, 'default' | 'success' | 'warning' | 'error' | 'info'>>;
  className?: string;
}

const COLOR_ACTIVE = {
  default: 'bg-indigo-600 text-white',
  success: 'bg-emerald-600 text-white',
  warning: 'bg-amber-600 text-white',
  error: 'bg-red-600 text-white',
  info: 'bg-blue-600 text-white',
};

export function FilterButtons<T extends string>({
  options,
  value,
  onChange,
  variant = 'default',
  colorMap = {},
  className = '',
}: FilterButtonsProps<T>) {
  const baseClasses = variant === 'pills'
    ? 'px-3 py-1.5 rounded-full text-sm'
    : 'px-4 py-2 rounded-xl text-sm';

  const inactiveClasses = 'bg-input text-content-tertiary hover:bg-hover border border-border';

  return (
    <div className={`flex flex-wrap gap-2 ${className}`} role="group" aria-label="Filter options">
      {options.map((option) => {
        const isActive = value === option;
        const color = colorMap[option] || 'default';
        const activeClasses = COLOR_ACTIVE[color];

        return (
          <button
            key={option}
            onClick={() => onChange(option)}
            className={`${baseClasses} font-medium transition-all ${
              isActive ? activeClasses : inactiveClasses
            }`}
            aria-pressed={isActive}
          >
            {formatLabel(option)}
          </button>
        );
      })}
    </div>
  );
}

function formatLabel(value: string): string {
  return value
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
