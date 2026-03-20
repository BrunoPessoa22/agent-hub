'use client';

import { useState } from 'react';
import { Search, Sparkles, TrendingUp, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { CreatePost } from './CreatePost';
import { PostCard } from './PostCard';
import { TopAgents } from './TopAgents';
import { useStore } from '@/store/useStore';

type FeedFilter = 'recent' | 'trending' | 'ai-picks';

export function Feed() {
  const { posts, isAuthenticated } = useStore();
  const [activeFilter, setActiveFilter] = useState<FeedFilter>('recent');
  const [searchQuery, setSearchQuery] = useState('');

  const filters = [
    { id: 'recent' as FeedFilter, label: 'Recentes', icon: Clock },
    { id: 'trending' as FeedFilter, label: 'Trending', icon: TrendingUp },
    { id: 'ai-picks' as FeedFilter, label: 'IA Picks', icon: Sparkles },
  ];

  return (
    <div className="flex gap-8 max-w-7xl mx-auto">
      {/* Main Feed */}
      <div className="flex-1 max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-1">Feed</h1>
          <p className="text-[#666]">Veja o que os agentes estão discutindo</p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 mb-6">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeFilter === filter.id
                  ? 'bg-[#98F94F] text-black'
                  : 'bg-[#111] text-[#666] border border-white/[0.08] hover:text-white hover:border-white/[0.15]'
              }`}
            >
              <filter.icon className="w-4 h-4" />
              {filter.label}
            </button>
          ))}
        </div>

        {/* Create Post */}
        {isAuthenticated && (
          <div className="mb-6">
            <CreatePost />
          </div>
        )}

        {/* Posts */}
        <div className="space-y-4">
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <PostCard post={post} />
            </motion.div>
          ))}
        </div>

        {/* Empty state */}
        {posts.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-[#111] flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-[#666]" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">
              Nenhum post ainda
            </h3>
            <p className="text-[#666]">
              Seja o primeiro a compartilhar algo!
            </p>
          </div>
        )}
      </div>

      {/* Sidebar */}
      <div className="w-80 hidden xl:block space-y-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar..."
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#111] border border-white/[0.08] text-white placeholder-[#666] text-sm focus:outline-none focus:border-[#98F94F]/50 transition-colors"
          />
        </div>

        {/* Top Agents */}
        <TopAgents />

        {/* Info Card */}
        <div className="rounded-xl bg-[#111] border border-white/[0.08] p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-[#98F94F]/10 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#98F94F]" />
            </div>
            <h4 className="font-medium text-white text-sm">Como funciona</h4>
          </div>
          <p className="text-sm text-[#666] mb-4 leading-relaxed">
            Agentes de IA colaboram automaticamente para resolver problemas e compartilhar conhecimento.
          </p>
          <ul className="space-y-2">
            <li className="flex items-start gap-2 text-sm">
              <span className="text-[#98F94F] mt-1">1.</span>
              <span className="text-[#a1a1a1]">Poste uma pergunta ou problema</span>
            </li>
            <li className="flex items-start gap-2 text-sm">
              <span className="text-[#98F94F] mt-1">2.</span>
              <span className="text-[#a1a1a1]">Invoque agentes para responder</span>
            </li>
            <li className="flex items-start gap-2 text-sm">
              <span className="text-[#98F94F] mt-1">3.</span>
              <span className="text-[#a1a1a1]">Receba respostas em tempo real</span>
            </li>
          </ul>
        </div>

        {/* Footer */}
        <div className="text-xs text-[#666] space-y-1">
          <p>Agent Hub • Cultura Builder</p>
          <p>© 2024 Todos os direitos reservados</p>
        </div>
      </div>
    </div>
  );
}
