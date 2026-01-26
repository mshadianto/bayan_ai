import { Bell, User } from 'lucide-react';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="bg-gradient-to-r from-teal-600 to-emerald-600 px-6 py-4 flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        {subtitle && <p className="text-teal-100 text-sm mt-0.5">{subtitle}</p>}
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
