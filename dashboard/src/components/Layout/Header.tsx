import { Bell, User } from 'lucide-react';
import { useLocation } from 'react-router-dom';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

const MODULE_CONFIG = {
  finance: {
    label: 'Finance',
    emoji: '💰',
    gradient: 'from-teal-600 to-emerald-600',
    badgeBg: 'bg-teal-500/30',
    badgeText: 'text-teal-100',
  },
  hcms: {
    label: 'Human Capital',
    emoji: '👥',
    gradient: 'from-indigo-600 to-purple-600',
    badgeBg: 'bg-indigo-500/30',
    badgeText: 'text-indigo-100',
  },
} as const;

export function Header({ title, subtitle }: HeaderProps) {
  const location = useLocation();
  const isHCMS = location.pathname.startsWith('/hcms');
  const module = isHCMS ? MODULE_CONFIG.hcms : MODULE_CONFIG.finance;

  return (
    <header className={`bg-gradient-to-r ${module.gradient} px-6 py-4 flex items-center justify-between`}>
      <div>
        <div className="flex items-center gap-3 mb-1">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${module.badgeBg} ${module.badgeText}`}>
            <span>{module.emoji}</span>
            {module.label}
          </span>
        </div>
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        {subtitle && <p className="text-white/70 text-sm mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-white/10 rounded-xl relative transition-colors">
          <Bell size={20} className="text-white" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-400 rounded-full animate-pulse"></span>
        </button>

        <div className="flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
            <User size={16} className="text-white" />
          </div>
          <span className="text-sm text-white font-medium">CFO</span>
        </div>
      </div>
    </header>
  );
}
