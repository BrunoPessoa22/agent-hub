'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sidebar } from '@/components/Sidebar';
import { fetchSkills, fetchCategories } from '@/lib/skills';
import { Skill } from '@/types';
import {
  Search,
  Package,
  Star,
  ChevronRight,
  Shield,
  Zap,
  Wrench,
  Loader2,
} from 'lucide-react';

const verdictColors: Record<string, string> = {
  exceptional: 'text-[#98F94F] bg-[#98F94F]/10 border-[#98F94F]/20',
  recommended: 'text-[#98F94F] bg-[#98F94F]/10 border-[#98F94F]/20',
  approved: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  'needs-work': 'text-red-400 bg-red-400/10 border-red-400/20',
  unrated: 'text-[#666] bg-[#666]/10 border-[#666]/20',
};

const categoryIcons: Record<string, typeof Package> = {
  marketing: Zap,
  media: Star,
  support: Shield,
  analytics: Search,
  sales: ChevronRight,
};

export default function SkillsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories().then(setCategories);
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchSkills({
      q: searchQuery || undefined,
      category: selectedCategory || undefined,
    }).then((data) => {
      setSkills(data);
      setLoading(false);
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Sidebar />
      <main className="ml-0 lg:ml-64 p-4 lg:p-6 pt-18 lg:pt-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Package className="w-6 h-6 text-[#98F94F]" />
            <h1 className="text-2xl font-semibold text-white">Skill Marketplace</h1>
          </div>
          <p className="text-[#a1a1a1] text-sm">
            Battle-tested skills reviewed by Culture Builder. Install and go.
          </p>
        </div>

        {/* Search + Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
          <div className="relative flex-1 sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666]" />
            <input
              type="text"
              placeholder="Search skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-10"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                !selectedCategory
                  ? 'bg-[#98F94F] text-black'
                  : 'bg-[#161616] text-[#a1a1a1] border border-white/[0.08] hover:border-white/[0.15]'
              }`}
            >
              All
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat === selectedCategory ? null : cat)}
                className={`px-3 py-2 rounded-lg text-xs font-medium capitalize transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#98F94F] text-black'
                    : 'bg-[#161616] text-[#a1a1a1] border border-white/[0.08] hover:border-white/[0.15]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 text-[#98F94F] animate-spin" />
          </div>
        )}

        {/* Skills Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {skills.map(skill => {
              const Icon = categoryIcons[skill.category] || Package;
              return (
                <Link
                  key={skill.id}
                  href={`/skills/${skill.id}`}
                  className="group p-5 rounded-xl bg-[#111] border border-white/[0.08] hover:border-[#98F94F]/30 transition-all duration-200 card-hover"
                >
                  {/* Top row */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#161616] border border-white/[0.08] flex items-center justify-center">
                        <Icon className="w-5 h-5 text-[#98F94F]" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-white group-hover:text-[#98F94F] transition-colors">
                          {skill.name}
                        </h3>
                        <p className="text-xs text-[#666]">{skill.author}</p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-white">
                      ${skill.price}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-[#a1a1a1] mb-4 line-clamp-2">
                    {skill.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {skill.tags.slice(0, 4).map(tag => (
                      <span key={tag} className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-white/[0.05] text-[#666]">
                        {tag}
                      </span>
                    ))}
                    {skill.tags.length > 4 && (
                      <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-white/[0.05] text-[#666]">
                        +{skill.tags.length - 4}
                      </span>
                    )}
                  </div>

                  {/* Scorecard bar */}
                  <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Wrench className="w-3 h-3 text-[#98F94F]" />
                        <span className="text-xs font-medium text-white">{skill.scorecard.scores.overall}/10</span>
                      </div>
                      <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full border ${verdictColors[skill.scorecard.verdict]}`}>
                        {skill.scorecard.verdict}
                      </span>
                    </div>
                    <span className="text-xs text-[#666]">v{skill.version}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {!loading && skills.length === 0 && (
          <div className="text-center py-16">
            <Package className="w-12 h-12 text-[#666] mx-auto mb-3" />
            <p className="text-[#666] text-sm">No skills found matching your search.</p>
          </div>
        )}
      </main>
    </div>
  );
}
