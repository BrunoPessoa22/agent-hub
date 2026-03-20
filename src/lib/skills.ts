import { Skill } from '@/types';

export const skills: Skill[] = [
  {
    id: 'social-media-manager',
    name: 'Social Media Manager',
    author: '@cultura-builder',
    version: '1.0.0',
    price: 30,
    license: 'commercial',
    category: 'marketing',
    description: 'Manages social media content calendar, drafts posts, suggests hashtags, and schedules across platforms',
    tags: ['social media', 'content', 'marketing', 'instagram', 'twitter', 'tiktok', 'scheduling'],
    capabilities: [
      'Draft platform-specific posts (Instagram, Twitter/X, TikTok, LinkedIn)',
      'Generate hashtag strategies based on niche and trending topics',
      'Create weekly content calendars',
      'Adapt tone and format per platform',
      'Suggest optimal posting times based on audience',
      'Repurpose long-form content into social snippets',
    ],
    requires: { tools: ['web-browser', 'calendar'], min_tokens: '30k' },
    scorecard: {
      reviewed_by: 'culture-builder',
      reviewed_at: '2026-03-20',
      version_reviewed: '1.0.0',
      scores: { security: 9, reliability: 8, token_efficiency: 7, ease_of_install: 9, output_quality: 8, overall: 8.2 },
      verdict: 'recommended',
      notes: 'Strong across all platforms. Hashtag suggestions are data-driven. Occasionally over-formats for LinkedIn when targeting casual audiences.',
    },
    readme: `Automates your social media workflow from content ideation to post drafting.

**What it does:**
- Creates a weekly content calendar based on your brand, niche, and goals
- Drafts ready-to-post content for Instagram, Twitter/X, TikTok, and LinkedIn
- Generates platform-specific hashtag strategies
- Repurposes long-form content into social snippets
- Suggests optimal posting times based on your audience timezone

**Best for:** Sports clubs, small businesses, content creators, marketing teams`,
  },
  {
    id: 'video-editing',
    name: 'Video Editing Assistant',
    author: '@maria_openclaw',
    version: '2.1.0',
    price: 50,
    license: 'commercial',
    category: 'media',
    description: 'Assists with video editing workflows - scripting, shot lists, caption generation, and editing instructions',
    tags: ['video', 'editing', 'media', 'youtube', 'tiktok', 'reels', 'captions', 'content creation'],
    capabilities: [
      'Generate shot lists from scripts or briefs',
      'Create subtitle/caption files from transcripts',
      'Write video scripts with hook-body-CTA structure',
      'Suggest transitions, cuts, and pacing for short-form content',
      'Create thumbnail concepts and title variations',
      'Provide editing instructions for CapCut, DaVinci, Premiere',
    ],
    requires: { tools: ['file-system', 'web-browser'], min_tokens: '50k' },
    scorecard: {
      reviewed_by: 'culture-builder',
      reviewed_at: '2026-03-20',
      version_reviewed: '2.1.0',
      scores: { security: 8, reliability: 7, token_efficiency: 9, ease_of_install: 8, output_quality: 7, overall: 7.8 },
      verdict: 'recommended',
      notes: 'Strong on captions and scripting. Shot list quality depends heavily on brief detail. Occasionally misses transitions on vertical video.',
    },
    readme: `Your AI co-editor for video content production.

**What it does:**
- Writes video scripts optimized for retention (hook in first 3 seconds)
- Generates shot lists from briefs or scripts
- Creates SRT/VTT caption files from transcripts
- Step-by-step editing instructions for CapCut, DaVinci Resolve, or Premiere
- Suggests b-roll, transitions, and pacing for short-form content

**Best for:** Content creators, marketing teams, small businesses creating first video content`,
  },
  {
    id: 'customer-support',
    name: 'Customer Support Agent',
    author: '@cultura-builder',
    version: '1.0.0',
    price: 40,
    license: 'commercial',
    category: 'support',
    description: 'Handles customer support tickets - categorizes, drafts responses, escalates complex issues, and maintains a knowledge base',
    tags: ['support', 'customer service', 'tickets', 'helpdesk', 'onboarding', 'FAQ', 'communication'],
    capabilities: [
      'Categorize and prioritize incoming support tickets',
      'Draft responses using knowledge base and context',
      'Escalate complex issues with summary for human agents',
      'Generate FAQ entries from recurring questions',
      'Provide multilingual support (PT, EN, ES)',
      'Track customer sentiment and flag at-risk accounts',
    ],
    requires: { tools: ['messaging', 'file-system'], min_tokens: '40k' },
    scorecard: {
      reviewed_by: 'culture-builder',
      reviewed_at: '2026-03-20',
      version_reviewed: '1.0.0',
      scores: { security: 9, reliability: 8, token_efficiency: 8, ease_of_install: 7, output_quality: 8, overall: 8.0 },
      verdict: 'recommended',
      notes: 'Excellent categorization and draft quality. Multilingual solid for PT/EN, ES needs more testing. Initial KB setup adds install friction.',
    },
    readme: `Automates first-line customer support with smart categorization and intelligent escalation.

**What it does:**
- Reads incoming tickets/messages and categorizes by type and urgency
- Drafts responses based on your knowledge base
- Escalates complex issues to humans with pre-written summary
- Generates FAQ entries from recurring question patterns
- Supports Portuguese, English, and Spanish

**Best for:** Companies scaling support volume, teams with repetitive questions, multilingual businesses`,
  },
  {
    id: 'data-analysis',
    name: 'Data Analysis Pro',
    author: '@luis_neural',
    version: '1.2.0',
    price: 45,
    license: 'commercial',
    category: 'analytics',
    description: 'Analyzes datasets, generates insights, creates visualizations, and automates reporting workflows',
    tags: ['data', 'analytics', 'reporting', 'visualization', 'spreadsheets', 'SQL', 'dashboards'],
    capabilities: [
      'Analyze CSV/Excel datasets and generate insights',
      'Create data visualizations and chart recommendations',
      'Write SQL queries from natural language descriptions',
      'Automate weekly/monthly reporting workflows',
      'Detect anomalies and trends in time-series data',
      'Generate executive summaries from raw data',
    ],
    requires: { tools: ['file-system', 'web-browser'], min_tokens: '60k' },
    scorecard: {
      reviewed_by: 'culture-builder',
      reviewed_at: '2026-03-20',
      version_reviewed: '1.2.0',
      scores: { security: 8, reliability: 9, token_efficiency: 6, ease_of_install: 8, output_quality: 9, overall: 8.0 },
      verdict: 'recommended',
      notes: 'Excellent at finding insights humans miss. SQL generation is reliable. Token-heavy on large datasets - recommend chunking.',
    },
    readme: `Turn raw data into actionable insights without writing code.

**What it does:**
- Ingests CSV/Excel files and provides instant analysis
- Generates chart recommendations based on data shape
- Writes SQL queries from plain language
- Automates recurring reports with customizable templates
- Detects anomalies and trends automatically

**Best for:** Businesses drowning in spreadsheets, teams that need weekly reports, anyone who wants data insights without hiring an analyst`,
  },
  {
    id: 'sales-outreach',
    name: 'Sales Outreach Assistant',
    author: '@anderson_gpt',
    version: '1.0.0',
    price: 35,
    license: 'commercial',
    category: 'sales',
    description: 'Crafts personalized sales emails, follow-ups, and outreach sequences based on prospect research',
    tags: ['sales', 'outreach', 'email', 'cold email', 'follow-up', 'prospecting', 'CRM'],
    capabilities: [
      'Research prospects and personalize outreach messages',
      'Create multi-step email sequences (cold -> follow-up -> break-up)',
      'Write LinkedIn connection requests and messages',
      'Generate objection handling scripts',
      'Summarize CRM notes for call preparation',
      'A/B test subject lines and opening hooks',
    ],
    requires: { tools: ['web-browser', 'messaging'], min_tokens: '25k' },
    scorecard: {
      reviewed_by: 'culture-builder',
      reviewed_at: '2026-03-20',
      version_reviewed: '1.0.0',
      scores: { security: 9, reliability: 7, token_efficiency: 9, ease_of_install: 9, output_quality: 7, overall: 8.2 },
      verdict: 'recommended',
      notes: 'Great at personalization. Follow-up sequences are well-paced. Objection scripts could be more industry-specific.',
    },
    readme: `Never send a generic cold email again.

**What it does:**
- Researches prospects and crafts personalized outreach
- Creates full email sequences (5-7 touch points)
- Writes LinkedIn messages that get responses
- Prepares you for calls with CRM summary notes
- Tests subject lines and hooks

**Best for:** B2B sales teams, founders doing outbound, agencies prospecting new clients`,
  },
];

export function getSkillById(id: string): Skill | undefined {
  return skills.find(s => s.id === id);
}

export function searchSkills(query: string): Skill[] {
  const q = query.toLowerCase();
  return skills.filter(s => {
    const searchable = [s.name, s.description, s.category, ...s.tags, ...s.capabilities, s.author].join(' ').toLowerCase();
    return searchable.includes(q);
  });
}

export function getSkillsByCategory(category: string): Skill[] {
  return skills.filter(s => s.category === category);
}

export const categories = [...new Set(skills.map(s => s.category))];

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

export function matchSkills(answers: Record<string, string>): Skill[] {
  const combined = Object.values(answers).join(' ').toLowerCase();
  const scored = skills.map(skill => {
    const skillText = [skill.category, skill.description, ...skill.tags, ...skill.capabilities].join(' ').toLowerCase();
    let score = 0;
    for (const word of combined.split(/\s+/)) {
      if (word.length > 3 && skillText.includes(word)) score++;
    }
    return { skill, score };
  });
  return scored.filter(s => s.score > 0).sort((a, b) => b.score - a.score).map(s => s.skill);
}
