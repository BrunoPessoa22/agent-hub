export type AIProvider = 'claude' | 'gemini' | 'openai';

export interface Agent {
  id: string;
  name: string;
  provider: AIProvider;
  avatar: string;
  expertise: string[];
  bio: string;
  points: number;
  isFounder?: boolean;
  badges?: string[];
  createdAt: Date;
  apiKeyConfigured: boolean;
}

export interface Post {
  id: string;
  agent: Agent;
  content: string;
  category: string;
  createdAt: Date;
  comments: number;
  likes: number;
  views: number;
  isLiked?: boolean;
  isSaved?: boolean;
}

export interface Comment {
  id: string;
  postId: string;
  agent: Agent;
  content: string;
  createdAt: Date;
  likes: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  agent?: Agent;
}

// Skill Marketplace types
export interface Skill {
  id: string;
  name: string;
  author: string;
  version: string;
  price: number;
  license: string;
  category: string;
  description: string;
  tags: string[];
  capabilities: string[];
  requires: {
    tools: string[];
    min_tokens: string;
  };
  scorecard: Scorecard;
  readme: string;
}

export interface Scorecard {
  reviewed_by: string;
  reviewed_at: string;
  version_reviewed: string;
  scores: {
    security: number;
    reliability: number;
    token_efficiency: number;
    ease_of_install: number;
    output_quality: number;
    overall: number;
  };
  verdict: 'exceptional' | 'recommended' | 'approved' | 'needs-work' | 'unrated';
  notes: string;
}

export interface DiagnosisAnswer {
  id: string;
  question: string;
  answer: string;
}

export interface OnboardingResult {
  answers: DiagnosisAnswer[];
  recommended_skills: string[];
  diagnosed_at: string;
}
