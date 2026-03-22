import { Skill } from '@/types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://api.brunopessoa.com';

// --- API Client ---

export async function fetchSkills(params?: {
  q?: string;
  category?: string;
}): Promise<Skill[]> {
  const url = new URL(`${API_BASE}/api/skills`);
  if (params?.q) url.searchParams.set('q', params.q);
  if (params?.category) url.searchParams.set('category', params.category);
  const res = await fetch(url.toString());
  if (!res.ok) return [];
  const data = await res.json();
  return data.map(normalizeSkill);
}

export async function fetchSkillBySlug(slug: string): Promise<Skill | null> {
  const res = await fetch(`${API_BASE}/api/skills/${slug}`);
  if (!res.ok) return null;
  const data = await res.json();
  return normalizeSkill(data);
}

export async function fetchCategories(): Promise<string[]> {
  const res = await fetch(`${API_BASE}/api/skills/categories`);
  if (!res.ok) return [];
  return res.json();
}

export async function installSkill(slug: string, opts?: { agentId?: number; workspaceId?: string }): Promise<boolean> {
  const res = await fetch(`${API_BASE}/api/skills/${slug}/install`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      agent_id: opts?.agentId ?? null,
      workspace_id: opts?.workspaceId ?? null,
    }),
  });
  return res.ok;
}

export async function rateSkill(slug: string, score: number, feedback: string): Promise<boolean> {
  const res = await fetch(`${API_BASE}/api/skills/${slug}/rate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ score, feedback }),
  });
  return res.ok;
}

// --- Normalize API response to match Skill type ---

function normalizeSkill(raw: Record<string, unknown>): Skill {
  const scorecard = raw.scorecard as Record<string, unknown> | null;
  return {
    id: (raw.slug ?? raw.id) as string,
    name: raw.name as string,
    author: raw.author as string,
    version: raw.version as string,
    price: Number(raw.price_usd ?? raw.price ?? 0),
    license: raw.license as string,
    category: raw.category as string,
    description: raw.description as string,
    tags: (raw.tags ?? []) as string[],
    capabilities: (raw.capabilities ?? []) as string[],
    requires: (raw.requires ?? { tools: [], min_tokens: '0' }) as { tools: string[]; min_tokens: string },
    readme: (raw.readme ?? '') as string,
    scorecard: scorecard
      ? {
          reviewed_by: (scorecard.reviewed_by ?? '') as string,
          reviewed_at: (scorecard.reviewed_at ?? '') as string,
          version_reviewed: (scorecard.version_reviewed ?? '') as string,
          scores: (scorecard.scores ?? {
            security: 0, reliability: 0, token_efficiency: 0,
            ease_of_install: 0, output_quality: 0, overall: 0,
          }) as Skill['scorecard']['scores'],
          verdict: (scorecard.verdict ?? 'unrated') as Skill['scorecard']['verdict'],
          notes: (scorecard.notes ?? '') as string,
        }
      : {
          reviewed_by: '', reviewed_at: '', version_reviewed: '',
          scores: { security: 0, reliability: 0, token_efficiency: 0, ease_of_install: 0, output_quality: 0, overall: 0 },
          verdict: 'unrated' as const,
          notes: '',
        },
  };
}

// --- Onboarding (stays client-side) ---

export const onboardingQuestions = [
  { id: 'business_name', label: 'What\'s your business/project name?', hint: '' },
  { id: 'industry', label: 'What industry are you in?', hint: 'e.g., sports, media, e-commerce, finance, education, health' },
  { id: 'team_size', label: 'How big is your team?', hint: 'e.g., solo, 2-5, 5-20, 20+' },
  { id: 'top_tasks', label: 'What 3 tasks waste the most human hours today?', hint: 'e.g., video editing, social media posting, customer support, data entry' },
  { id: 'current_tools', label: 'What tools/platforms do you already use?', hint: 'e.g., Slack, Instagram, YouTube, Shopify, HubSpot' },
  { id: 'budget', label: 'Monthly budget for agent operations (USD)?', hint: 'This affects which models and how many tokens we allocate' },
  { id: 'tech_level', label: 'How technical is your team? (1-5)', hint: '1 = no coding, 3 = can follow tutorials, 5 = full dev team' },
  { id: 'success_criteria', label: 'What does success look like in 30 days?', hint: 'Be specific - e.g., "agent handles 50% of support tickets"' },
  { id: 'communication', label: 'Where does your team communicate?', hint: 'e.g., WhatsApp, Slack, Telegram, Discord' },
];

export async function matchSkills(answers: Record<string, string>): Promise<Skill[]> {
  const allSkills = await fetchSkills();
  const combined = Object.values(answers).join(' ').toLowerCase();
  const scored = allSkills.map(skill => {
    const skillText = [skill.category, skill.description, ...skill.tags, ...skill.capabilities].join(' ').toLowerCase();
    let score = 0;
    for (const word of combined.split(/\s+/)) {
      if (word.length > 3 && skillText.includes(word)) score++;
    }
    return { skill, score };
  });
  return scored.filter(s => s.score > 0).sort((a, b) => b.score - a.score).map(s => s.skill);
}
