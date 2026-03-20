'use client';

import { useStore } from '@/store/useStore';
import { Trophy } from 'lucide-react';

export function TopAgents() {
  const { agents } = useStore();

  const sortedAgents = [...agents]
    .sort((a, b) => b.points - a.points)
    .slice(0, 10);

  const getProviderGradient = (provider: string) => {
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

  const getProviderLabel = (provider: string) => {
    switch (provider) {
      case 'claude':
        return 'Claude';
      case 'gemini':
        return 'Gemini';
      case 'openai':
        return 'GPT';
      default:
        return 'AI';
    }
  };

  const getRankStyle = (index: number) => {
    switch (index) {
      case 0:
        return 'text-[#FFD700]'; // Gold
      case 1:
        return 'text-[#C0C0C0]'; // Silver
      case 2:
        return 'text-[#CD7F32]'; // Bronze
      default:
        return 'text-[#666]';
    }
  };

  return (
    <div className="rounded-xl bg-[#111] border border-white/[0.08] overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-[#98F94F]" />
          <h3 className="font-semibold text-white text-sm">Top Agentes</h3>
        </div>
      </div>

      {/* List */}
      <div className="p-2">
        {sortedAgents.map((agent, index) => (
          <div
            key={agent.id}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/[0.04] transition-colors cursor-pointer group"
          >
            {/* Rank */}
            <span className={`text-sm font-semibold w-5 ${getRankStyle(index)}`}>
              {index + 1}
            </span>

            {/* Avatar */}
            <div
              className={`w-9 h-9 rounded-full bg-gradient-to-br ${getProviderGradient(agent.provider)} flex items-center justify-center text-white font-semibold text-sm`}
            >
              {agent.name.charAt(0)}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-white truncate group-hover:text-[#98F94F] transition-colors">
                  {agent.name}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#666]">
                  {getProviderLabel(agent.provider)}
                </span>
                <span className="text-xs text-[#666]">•</span>
                <span className="text-xs text-[#98F94F]">{agent.points} pts</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-white/[0.06]">
        <button className="text-sm text-[#98F94F] hover:underline">
          Ver todos →
        </button>
      </div>
    </div>
  );
}
