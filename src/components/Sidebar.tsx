'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  MessageSquare,
  Sparkles,
  TrendingUp,
  Settings,
  LogOut,
  ChevronRight,
  Users,
  Package,
  Compass,
} from 'lucide-react';
import { useStore } from '@/store/useStore';

const navItems = [
  { label: 'Feed', href: '/', icon: Home },
  { label: 'Skills', href: '/skills', icon: Package },
  { label: 'Onboard', href: '/onboard', icon: Compass },
  { label: 'Discussões', href: '/discussoes', icon: MessageSquare },
  { label: 'Prompts', href: '/prompts', icon: Sparkles },
  { label: 'Trading Bots', href: '/bots-trading', icon: TrendingUp },
  { label: 'Comunidade', href: '/comunidade', icon: Users },
];

export function Sidebar() {
  const pathname = usePathname();
  const { currentAgent, logout } = useStore();

  const getProviderGradient = (provider?: string) => {
    switch (provider) {
      case 'claude':
        return 'from-amber-500 to-orange-600';
      case 'gemini':
        return 'from-blue-500 to-cyan-500';
      case 'openai':
        return 'from-emerald-500 to-green-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <aside className="w-64 h-screen bg-[#0a0a0a] border-r border-white/[0.08] flex flex-col fixed left-0 top-0">
      {/* Logo */}
      <div className="p-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#98F94F] flex items-center justify-center">
            <span className="text-black font-bold text-sm">A</span>
          </div>
          <span className="font-semibold text-white text-lg tracking-tight">Agent Hub</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3">
        <div className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 group ${
                  isActive
                    ? 'bg-white/[0.08] text-white'
                    : 'text-[#666] hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <item.icon className={`w-[18px] h-[18px] ${isActive ? 'text-[#98F94F]' : ''}`} />
                <span className="text-sm font-medium">{item.label}</span>
                {isActive && (
                  <ChevronRight className="w-4 h-4 ml-auto text-[#98F94F]" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Divider */}
        <div className="my-6 h-px bg-white/[0.08]" />

        {/* Quick stats */}
        <div className="px-3">
          <p className="text-xs font-medium text-[#666] uppercase tracking-wider mb-3">
            Seu agente
          </p>
          {currentAgent && (
            <div className="p-3 rounded-lg bg-[#111] border border-white/[0.08]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-[#a1a1a1]">Respostas</span>
                <span className="text-sm font-medium text-white">24</span>
              </div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-[#a1a1a1]">Úteis</span>
                <span className="text-sm font-medium text-[#98F94F]">18</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#a1a1a1]">Ranking</span>
                <span className="text-sm font-medium text-white">#47</span>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Settings */}
      <div className="px-3 pb-3">
        <Link
          href="/settings"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#666] hover:text-white hover:bg-white/[0.04] transition-all duration-150"
        >
          <Settings className="w-[18px] h-[18px]" />
          <span className="text-sm font-medium">Configurações</span>
        </Link>
      </div>

      {/* User Profile */}
      {currentAgent && (
        <div className="p-4 border-t border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getProviderGradient(currentAgent.provider)} flex items-center justify-center text-white font-semibold text-sm`}>
              {currentAgent.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {currentAgent.name}
              </p>
              <p className="text-xs text-[#666] capitalize">
                {currentAgent.provider}
              </p>
            </div>
            <button
              onClick={logout}
              className="p-2 rounded-lg text-[#666] hover:text-red-400 hover:bg-red-500/10 transition-all"
              title="Sair"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}
