'use client';

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/Sidebar';
import { fetchSkillBySlug, installSkill, rateSkill } from '@/lib/skills';
import { Skill } from '@/types';
import {
  ArrowLeft,
  Package,
  Shield,
  Gauge,
  Coins,
  Wrench,
  Star,
  Check,
  Download,
  User,
  Calendar,
  Tag,
  Loader2,
  CheckCircle,
  MessageSquare,
} from 'lucide-react';

const scoreLabels: Record<string, { label: string; icon: typeof Shield }> = {
  security: { label: 'Security', icon: Shield },
  reliability: { label: 'Reliability', icon: Gauge },
  token_efficiency: { label: 'Token Efficiency', icon: Coins },
  ease_of_install: { label: 'Ease of Install', icon: Download },
  output_quality: { label: 'Output Quality', icon: Star },
};

function ScoreBar({ score, label, icon: Icon }: { score: number; label: string; icon: typeof Shield }) {
  const percentage = (score / 10) * 100;
  const color = score >= 8 ? '#98F94F' : score >= 6 ? '#F59E0B' : '#EF4444';

  return (
    <div className="flex items-center gap-3">
      <Icon className="w-4 h-4 text-[#666] flex-shrink-0" />
      <span className="text-sm text-[#a1a1a1] w-32 flex-shrink-0">{label}</span>
      <div className="flex-1 h-2 bg-white/[0.06] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${percentage}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-sm font-medium text-white w-10 text-right">{score}/10</span>
    </div>
  );
}

export default function SkillDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [skill, setSkill] = useState<Skill | null>(null);
  const [loading, setLoading] = useState(true);
  const [installing, setInstalling] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [ratingScore, setRatingScore] = useState(8);
  const [ratingFeedback, setRatingFeedback] = useState('');
  const [ratingSubmitted, setRatingSubmitted] = useState(false);

  useEffect(() => {
    fetchSkillBySlug(id).then((data) => {
      setSkill(data);
      setLoading(false);
    });
  }, [id]);

  const handleInstall = async () => {
    if (!skill) return;
    setInstalling(true);
    const ok = await installSkill(skill.id);
    setInstalling(false);
    if (ok) setInstalled(true);
  };

  const handleRate = async () => {
    if (!skill) return;
    const ok = await rateSkill(skill.id, ratingScore, ratingFeedback);
    if (ok) setRatingSubmitted(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a]">
        <Sidebar />
        <main className="ml-0 lg:ml-64 p-4 lg:p-6 pt-18 lg:pt-6 flex items-center justify-center">
          <Loader2 className="w-6 h-6 text-[#98F94F] animate-spin" />
        </main>
      </div>
    );
  }

  if (!skill) {
    return (
      <div className="min-h-screen bg-[#0a0a0a]">
        <Sidebar />
        <main className="ml-0 lg:ml-64 p-4 lg:p-6 pt-18 lg:pt-6 flex items-center justify-center">
          <div className="text-center">
            <Package className="w-12 h-12 text-[#666] mx-auto mb-3" />
            <p className="text-[#666]">Skill not found</p>
            <Link href="/skills" className="text-[#98F94F] text-sm mt-2 inline-block hover:underline">
              Back to marketplace
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const verdictColors: Record<string, string> = {
    exceptional: 'text-[#98F94F] bg-[#98F94F]/10',
    recommended: 'text-[#98F94F] bg-[#98F94F]/10',
    approved: 'text-amber-400 bg-amber-400/10',
    'needs-work': 'text-red-400 bg-red-400/10',
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Sidebar />
      <main className="ml-0 lg:ml-64 p-4 lg:p-6 pt-18 lg:pt-6">
        {/* Back */}
        <button
          onClick={() => router.push('/skills')}
          className="flex items-center gap-2 text-[#666] hover:text-white transition-colors mb-6 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to marketplace
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Card */}
            <div className="p-6 rounded-xl bg-[#111] border border-white/[0.08]">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-[#161616] border border-white/[0.08] flex items-center justify-center">
                    <Package className="w-7 h-7 text-[#98F94F]" />
                  </div>
                  <div>
                    <h1 className="text-xl font-semibold text-white">{skill.name}</h1>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="flex items-center gap-1 text-xs text-[#666]">
                        <User className="w-3 h-3" />
                        {skill.author}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-[#666]">
                        <Tag className="w-3 h-3" />
                        v{skill.version}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-[#666]">
                        <Calendar className="w-3 h-3" />
                        {skill.scorecard.reviewed_at}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-white">${skill.price}</p>
                  <p className="text-xs text-[#666]">one-time</p>
                </div>
              </div>

              <p className="text-sm text-[#a1a1a1] mb-4">{skill.description}</p>

              <div className="flex flex-wrap gap-1.5">
                {skill.tags.map(tag => (
                  <span key={tag} className="px-2.5 py-1 text-xs font-medium rounded-full bg-white/[0.05] text-[#666]">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Capabilities */}
            <div className="p-6 rounded-xl bg-[#111] border border-white/[0.08]">
              <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <Check className="w-4 h-4 text-[#98F94F]" />
                Capabilities
              </h2>
              <div className="space-y-2.5">
                {skill.capabilities.map((cap, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#98F94F]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-[#98F94F]" />
                    </div>
                    <span className="text-sm text-[#a1a1a1]">{cap}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* About */}
            <div className="p-6 rounded-xl bg-[#111] border border-white/[0.08]">
              <h2 className="text-sm font-semibold text-white mb-4">About this skill</h2>
              <div className="text-sm text-[#a1a1a1] leading-relaxed whitespace-pre-line">
                {skill.readme}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Install Button */}
            <div className="p-5 rounded-xl bg-[#111] border border-white/[0.08]">
              <button
                onClick={handleInstall}
                disabled={installing || installed}
                className={`w-full py-3 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 mb-3 transition-all ${
                  installed
                    ? 'bg-[#98F94F]/20 text-[#98F94F] cursor-default'
                    : 'btn-primary'
                }`}
              >
                {installing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : installed ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                {installed ? 'Installed' : installing ? 'Installing...' : 'Install Skill'}
              </button>
              <p className="text-[10px] text-[#666] text-center">
                Installs to your OpenClaw agent workspace
              </p>
            </div>

            {/* Scorecard */}
            <div className="p-5 rounded-xl bg-[#111] border border-white/[0.08]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-[#98F94F]" />
                  Scorecard
                </h3>
                <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${verdictColors[skill.scorecard.verdict] || ''}`}>
                  {skill.scorecard.verdict}
                </span>
              </div>

              {/* Overall score */}
              <div className="text-center mb-5 pb-5 border-b border-white/[0.06]">
                <p className="text-4xl font-bold text-white">{skill.scorecard.scores.overall}</p>
                <p className="text-xs text-[#666]">out of 10</p>
              </div>

              {/* Individual scores */}
              <div className="space-y-3">
                {Object.entries(skill.scorecard.scores).map(([key, value]) => {
                  if (key === 'overall') return null;
                  const meta = scoreLabels[key];
                  if (!meta) return null;
                  return (
                    <ScoreBar
                      key={key}
                      score={value}
                      label={meta.label}
                      icon={meta.icon}
                    />
                  );
                })}
              </div>

              {/* Notes */}
              {skill.scorecard.notes && (
                <div className="mt-4 pt-4 border-t border-white/[0.06]">
                  <p className="text-xs text-[#666] italic">&ldquo;{skill.scorecard.notes}&rdquo;</p>
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-white/[0.06] flex items-center justify-between">
                <span className="text-[10px] text-[#666]">Reviewed by {skill.scorecard.reviewed_by}</span>
                <span className="text-[10px] text-[#666]">{skill.scorecard.reviewed_at}</span>
              </div>
            </div>

            {/* Requirements */}
            <div className="p-5 rounded-xl bg-[#111] border border-white/[0.08]">
              <h3 className="text-sm font-semibold text-white mb-3">Requirements</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#666]">Tools</span>
                  <span className="text-xs text-[#a1a1a1]">{skill.requires.tools.join(', ')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#666]">Min tokens</span>
                  <span className="text-xs text-[#a1a1a1]">{skill.requires.min_tokens}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#666]">License</span>
                  <span className="text-xs text-[#a1a1a1] capitalize">{skill.license}</span>
                </div>
              </div>
            </div>

            {/* Rating */}
            <div className="p-5 rounded-xl bg-[#111] border border-white/[0.08]">
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#98F94F]" />
                Rate this skill
              </h3>
              {ratingSubmitted ? (
                <div className="text-center py-3">
                  <CheckCircle className="w-6 h-6 text-[#98F94F] mx-auto mb-2" />
                  <p className="text-xs text-[#a1a1a1]">Thanks for your feedback</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-[#666] mb-1 block">Score: {ratingScore}/10</label>
                    <input
                      type="range"
                      min={1}
                      max={10}
                      value={ratingScore}
                      onChange={(e) => setRatingScore(Number(e.target.value))}
                      className="w-full accent-[#98F94F]"
                    />
                  </div>
                  <textarea
                    placeholder="Optional feedback..."
                    value={ratingFeedback}
                    onChange={(e) => setRatingFeedback(e.target.value)}
                    rows={2}
                    className="input text-xs w-full resize-none"
                  />
                  <button
                    onClick={handleRate}
                    className="w-full py-2 rounded-lg text-xs font-medium bg-[#161616] text-[#a1a1a1] border border-white/[0.08] hover:border-[#98F94F]/30 hover:text-white transition-all"
                  >
                    Submit Rating
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
