import { useState, useRef, useEffect } from 'react';
import { Bell, ChevronDown, Check, Sun, Moon } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useUser, ROLE_CONFIG, UserRole } from '../../contexts/UserContext';
import { useTheme } from '../../contexts/ThemeContext';

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
  lcrms: {
    label: 'Legal & Compliance',
    emoji: '⚖️',
    gradient: 'from-amber-600 to-orange-600',
    badgeBg: 'bg-amber-500/30',
    badgeText: 'text-amber-100',
  },
} as const;

const ROLE_EMOJI: Record<UserRole, string> = {
  ceo: '👔',
  cfo: '💼',
  hr_manager: '👥',
  legal_counsel: '⚖️',
  staff: '👤',
};

export function Header({ title, subtitle }: HeaderProps) {
  const location = useLocation();
  const { user, setRole } = useUser();
  const { theme, toggleTheme } = useTheme();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isHCMS = location.pathname.startsWith('/hcms');
  const isLCRMS = location.pathname.startsWith('/lcrms');
  const module = isLCRMS ? MODULE_CONFIG.lcrms : isHCMS ? MODULE_CONFIG.hcms : MODULE_CONFIG.finance;

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRoleChange = (role: UserRole) => {
    setRole(role);
    setShowDropdown(false);
  };

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
        <button
          onClick={toggleTheme}
          className="p-2 hover:bg-white/10 rounded-xl transition-colors"
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? (
            <Sun size={20} className="text-white" />
          ) : (
            <Moon size={20} className="text-white" />
          )}
        </button>

        <button className="p-2 hover:bg-white/10 rounded-xl relative transition-colors">
          <Bell size={20} className="text-white" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-400 rounded-full animate-pulse"></span>
        </button>

        {/* User Role Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 rounded-xl px-3 py-2 transition-colors"
          >
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <span className="text-sm">{ROLE_EMOJI[user.role]}</span>
            </div>
            <div className="text-left">
              <div className="text-sm text-white font-medium">{user.name}</div>
              <div className="text-xs text-white/60">{user.roleLabel}</div>
            </div>
            <ChevronDown size={16} className={`text-white/70 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          {showDropdown && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-100 dark:border-slate-700 py-2 z-50">
              <div className="px-3 py-2 border-b border-gray-100 dark:border-slate-700">
                <p className="text-xs font-medium text-gray-400 dark:text-slate-400 uppercase tracking-wider">Switch Role (Demo)</p>
              </div>
              {(Object.keys(ROLE_CONFIG) as UserRole[]).map((role) => (
                <button
                  key={role}
                  onClick={() => handleRoleChange(role)}
                  className={`w-full px-3 py-2 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors ${
                    user.role === role ? 'bg-green-50 dark:bg-green-900/30' : ''
                  }`}
                >
                  <span className="w-8 h-8 bg-gray-100 dark:bg-slate-700 rounded-lg flex items-center justify-center text-sm">
                    {ROLE_EMOJI[role]}
                  </span>
                  <div className="flex-1 text-left">
                    <div className="text-sm font-medium text-gray-800 dark:text-slate-100">{ROLE_CONFIG[role].name}</div>
                    <div className="text-xs text-gray-500 dark:text-slate-400">{ROLE_CONFIG[role].label}</div>
                  </div>
                  {user.role === role && (
                    <Check size={16} className="text-green-600 dark:text-green-400" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
