export type CategorySlug =
  | "learning-science"
  | "memory"
  | "attention"
  | "learning-methods"
  | "reading"
  | "thinking"
  | "knowledge-management"
  | "lifelong-learning";

export interface NavItem {
  label: string;
  href: string;
  description?: string;
}

export interface Category {
  slug: CategorySlug;
  title: string;
  englishTitle: string;
  short: string;
  description: string;
  icon: string;
  tone: string;
  keywords: string[];
}

export type EvidenceLevel = "well-supported" | "emerging" | "debated";

export interface Article {
  slug: string;
  title: string;
  englishTitle?: string;
  description: string;
  category: CategorySlug;
  tags: string[];
  author: string;
  date: string;
  updated?: string;
  featured: boolean;
  order: number;
  evidence?: EvidenceLevel;
  diagram?: string;
  readingTime: number;
  content: string;
  toc: { depth: number; text: string; id: string }[];
}

export interface Book {
  slug: string;
  title: string;
  originalTitle?: string;
  authors: string[];
  year?: number;
  category: string;
  description: string;
  keyIdeas: string[];
  audience: string[];
  concepts: string[];
  practice: string;
  related: string[];
  link?: string;
  cover: string;
  accent: string;
}

export interface Resource {
  slug: string;
  name: string;
  url: string;
  region?: string;
  type: string;
  fields: string[];
  description: string;
  why: string;
  initials: string;
  accent: string;
}

export interface Method {
  slug: string;
  name: string;
  chineseName: string;
  tagline: string;
  principle: string;
  evidence: string;
  evidenceLevel: EvidenceLevel;
  scenarios: string[];
  steps: string[];
  example: string;
  pitfalls: string[];
  limitations: string;
  relatedArticles: string[];
  diagram?: string;
}

export interface PathStage {
  title: string;
  description: string;
  tasks: string[];
  articles: string[];
  books: string[];
}

export interface LearningPath {
  slug: string;
  title: string;
  englishTitle: string;
  description: string;
  duration: string;
  level: string;
  goal: string;
  outcome: string;
  stages: PathStage[];
  accent: string;
}

export interface SearchItem {
  type: "article" | "book" | "resource" | "method" | "path" | "tool";
  title: string;
  subtitle: string;
  href: string;
  keywords: string;
  category?: string;
  tags?: string[];
}
