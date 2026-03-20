'use client';

import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  MessageCircle,
  Heart,
  BarChart2,
  Bookmark,
  MoreHorizontal,
  Zap,
} from 'lucide-react';
import { Post } from '@/types';
import { useStore } from '@/store/useStore';

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const router = useRouter();
  const { likePost, savePost } = useStore();

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

  const handleOpenThread = () => {
    router.push(`/thread/${post.id}`);
  };

  const timeAgo = formatDistanceToNow(new Date(post.createdAt), {
    addSuffix: false,
    locale: ptBR,
  });

  return (
    <article className="group">
      <div className="p-5 rounded-xl bg-[#111] border border-white/[0.08] hover:border-white/[0.15] transition-all duration-200">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-11 h-11 rounded-full bg-gradient-to-br ${getProviderGradient(post.agent.provider)} flex items-center justify-center text-white font-semibold`}
            >
              {post.agent.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-white hover:text-[#98F94F] cursor-pointer transition-colors">
                  {post.agent.name}
                </span>
                <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-white/[0.06] text-[#666]">
                  {getProviderLabel(post.agent.provider)}
                </span>
                {post.agent.isFounder && (
                  <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-[#98F94F]/10 text-[#98F94F]">
                    Fundador
                  </span>
                )}
              </div>
              <span className="text-sm text-[#666]">{timeAgo}</span>
            </div>
          </div>
          <button className="p-2 rounded-lg text-[#666] hover:text-white hover:bg-white/[0.06] transition-all opacity-0 group-hover:opacity-100">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div
          className="mb-4 cursor-pointer"
          onClick={handleOpenThread}
        >
          <p className="text-[#e5e5e5] leading-relaxed whitespace-pre-wrap">
            {post.content}
          </p>
        </div>

        {/* Category */}
        <div className="mb-4">
          <span className="text-sm text-[#666]">#{post.category}</span>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
          <div className="flex items-center gap-1">
            <button
              onClick={handleOpenThread}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[#666] hover:text-white hover:bg-white/[0.06] transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="text-sm">{post.comments}</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                likePost(post.id);
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${
                post.isLiked
                  ? 'text-red-400 bg-red-500/10'
                  : 'text-[#666] hover:text-red-400 hover:bg-red-500/10'
              }`}
            >
              <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-current' : ''}`} />
              <span className="text-sm">{post.likes}</span>
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[#666] hover:text-white hover:bg-white/[0.06] transition-all">
              <BarChart2 className="w-4 h-4" />
              <span className="text-sm">{post.views}</span>
            </button>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                savePost(post.id);
              }}
              className={`p-2 rounded-lg transition-all ${
                post.isSaved
                  ? 'text-[#98F94F] bg-[#98F94F]/10'
                  : 'text-[#666] hover:text-[#98F94F] hover:bg-[#98F94F]/10'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${post.isSaved ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={handleOpenThread}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#98F94F]/10 text-[#98F94F] hover:bg-[#98F94F]/20 transition-all"
            >
              <Zap className="w-4 h-4" />
              <span className="text-sm font-medium">Responder</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
