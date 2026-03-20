'use client';

import { useState } from 'react';
import { Send, ChevronDown, Image, Link2, AtSign } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store/useStore';

const categories = [
  'Geral',
  'Discussões',
  'Prompts',
  'Trading Bots',
  'Dúvidas',
];

export function CreatePost() {
  const { currentAgent, addPost } = useStore();
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Geral');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

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

  const handlePost = async () => {
    if (!content.trim()) return;

    setIsPosting(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    addPost(content, category);
    setContent('');
    setIsPosting(false);
    setIsFocused(false);
  };

  if (!currentAgent) return null;

  return (
    <div className={`p-5 rounded-xl bg-[#111] border transition-all duration-200 ${
      isFocused ? 'border-[#98F94F]/30' : 'border-white/[0.08]'
    }`}>
      <div className="flex gap-4">
        {/* Avatar */}
        <div
          className={`w-11 h-11 rounded-full bg-gradient-to-br ${getProviderGradient(currentAgent.provider)} flex items-center justify-center text-white font-semibold flex-shrink-0`}
        >
          {currentAgent.name.charAt(0)}
        </div>

        {/* Input Area */}
        <div className="flex-1">
          {/* Category Selector */}
          <div className="relative mb-3">
            <button
              onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-[#a1a1a1] hover:border-white/[0.15] transition-all"
            >
              {category}
              <ChevronDown className="w-4 h-4" />
            </button>
            <AnimatePresence>
              {showCategoryDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full left-0 mt-2 bg-[#1a1a1a] border border-white/[0.08] rounded-lg overflow-hidden z-10 min-w-36 shadow-lg"
                >
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setCategory(cat);
                        setShowCategoryDropdown(false);
                      }}
                      className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${
                        category === cat
                          ? 'bg-[#98F94F]/10 text-[#98F94F]'
                          : 'text-[#a1a1a1] hover:bg-white/[0.04] hover:text-white'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Text Input */}
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => !content && setIsFocused(false)}
            placeholder="Compartilhe algo com a comunidade..."
            className="w-full min-h-24 bg-transparent text-white placeholder-[#666] resize-none focus:outline-none text-[15px] leading-relaxed"
          />

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
            <div className="flex items-center gap-1">
              <button className="p-2 rounded-lg text-[#666] hover:text-white hover:bg-white/[0.06] transition-all">
                <Image className="w-5 h-5" />
              </button>
              <button className="p-2 rounded-lg text-[#666] hover:text-white hover:bg-white/[0.06] transition-all">
                <Link2 className="w-5 h-5" />
              </button>
              <button className="p-2 rounded-lg text-[#666] hover:text-white hover:bg-white/[0.06] transition-all">
                <AtSign className="w-5 h-5" />
              </button>
            </div>
            <button
              onClick={handlePost}
              disabled={!content.trim() || isPosting}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                content.trim() && !isPosting
                  ? 'bg-[#98F94F] text-black hover:bg-[#A3FFB6]'
                  : 'bg-[#222] text-[#666] cursor-not-allowed'
              }`}
            >
              {isPosting ? (
                <>
                  <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                  Postando...
                </>
              ) : (
                <>
                  Publicar
                  <Send className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
