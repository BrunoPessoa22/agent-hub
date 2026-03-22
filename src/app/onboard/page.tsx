'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Sidebar } from '@/components/Sidebar';
import { onboardingQuestions, matchSkills, fetchSkills } from '@/lib/skills';
import { Skill } from '@/types';
import {
  Compass,
  ArrowRight,
  ArrowLeft,
  Check,
  Package,
  Wrench,
  Download,
  RotateCcw,
} from 'lucide-react';

type Step = 'questions' | 'results';

export default function OnboardPage() {
  const [step, setStep] = useState<Step>('questions');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [results, setResults] = useState<Skill[]>([]);

  const question = onboardingQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / onboardingQuestions.length) * 100;

  const handleAnswer = (value: string) => {
    setAnswers(prev => ({ ...prev, [question.id]: value }));
  };

  const handleNext = async () => {
    if (currentQuestion < onboardingQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      // Run matching
      const matched = await matchSkills(answers);
      if (matched.length > 0) {
        setResults(matched);
      } else {
        const all = await fetchSkills();
        setResults(all.slice(0, 3));
      }
      setStep('results');
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleReset = () => {
    setStep('questions');
    setCurrentQuestion(0);
    setAnswers({});
    setResults([]);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Sidebar />
      <main className="ml-64 p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Compass className="w-6 h-6 text-[#98F94F]" />
            <h1 className="text-2xl font-semibold text-white">Agent Onboarding</h1>
          </div>
          <p className="text-[#a1a1a1] text-sm">
            Tell us about your business. We&apos;ll match you with the right skills so your agent is productive from day one.
          </p>
        </div>

        {step === 'questions' && (
          <div className="max-w-2xl">
            {/* Progress bar */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-[#666]">
                  Question {currentQuestion + 1} of {onboardingQuestions.length}
                </span>
                <span className="text-xs text-[#666]">
                  {Math.round(progress)}%
                </span>
              </div>
              <div className="h-1 bg-white/[0.06] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#98F94F] rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Question Card */}
            <div className="p-8 rounded-xl bg-[#111] border border-white/[0.08] animate-fade-in">
              <h2 className="text-lg font-semibold text-white mb-2">
                {question.label}
              </h2>
              {question.hint && (
                <p className="text-sm text-[#666] mb-6">{question.hint}</p>
              )}
              <textarea
                value={answers[question.id] || ''}
                onChange={(e) => handleAnswer(e.target.value)}
                placeholder="Type your answer..."
                className="input min-h-[120px] resize-none"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey && answers[question.id]?.trim()) {
                    e.preventDefault();
                    handleNext();
                  }
                }}
              />

              {/* Navigation */}
              <div className="flex items-center justify-between mt-6">
                <button
                  onClick={handleBack}
                  disabled={currentQuestion === 0}
                  className="btn-ghost flex items-center gap-2 text-sm disabled:opacity-30"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
                <button
                  onClick={handleNext}
                  disabled={!answers[question.id]?.trim()}
                  className="btn-primary flex items-center gap-2 text-sm disabled:opacity-30"
                >
                  {currentQuestion === onboardingQuestions.length - 1 ? (
                    <>
                      Get Recommendations
                      <Check className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      Next
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Answered questions summary */}
            {currentQuestion > 0 && (
              <div className="mt-6 space-y-2">
                {onboardingQuestions.slice(0, currentQuestion).map((q, i) => (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQuestion(i)}
                    className="w-full text-left p-3 rounded-lg bg-[#111]/50 border border-white/[0.04] hover:border-white/[0.08] transition-colors"
                  >
                    <p className="text-xs text-[#666] mb-0.5">{q.label}</p>
                    <p className="text-sm text-[#a1a1a1] truncate">{answers[q.id]}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {step === 'results' && (
          <div className="max-w-3xl animate-fade-in">
            {/* Results Header */}
            <div className="p-6 rounded-xl bg-[#111] border border-[#98F94F]/20 mb-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#98F94F]/10 flex items-center justify-center">
                  <Wrench className="w-5 h-5 text-[#98F94F]" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">
                    {results.length} skill{results.length !== 1 ? 's' : ''} recommended
                  </h2>
                  <p className="text-sm text-[#a1a1a1]">
                    Based on your answers, here&apos;s what your agent needs
                  </p>
                </div>
              </div>
            </div>

            {/* Recommended Skills */}
            <div className="space-y-4 mb-6">
              {results.map((skill, i) => (
                <div
                  key={skill.id}
                  className="p-5 rounded-xl bg-[#111] border border-white/[0.08] hover:border-[#98F94F]/20 transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#98F94F]/10 flex items-center justify-center text-sm font-bold text-[#98F94F]">
                        {i + 1}
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-white">{skill.name}</h3>
                        <p className="text-xs text-[#666]">{skill.author} &middot; v{skill.version}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-white">${skill.price}</p>
                      <p className="text-xs text-[#98F94F]">{skill.scorecard.scores.overall}/10</p>
                    </div>
                  </div>
                  <p className="text-sm text-[#a1a1a1] mb-3">{skill.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1.5">
                      {skill.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="px-2 py-0.5 text-[10px] rounded-full bg-white/[0.05] text-[#666]">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <Link
                      href={`/skills/${skill.id}`}
                      className="text-xs text-[#98F94F] hover:underline flex items-center gap-1"
                    >
                      View details
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button className="btn-primary flex items-center gap-2">
                <Download className="w-4 h-4" />
                Install All ({results.length} skills)
              </button>
              <button onClick={handleReset} className="btn-secondary flex items-center gap-2">
                <RotateCcw className="w-4 h-4" />
                Start Over
              </button>
              <Link href="/skills" className="btn-ghost flex items-center gap-2">
                <Package className="w-4 h-4" />
                Browse All Skills
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
