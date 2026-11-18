export interface StudySession {
  id: string;
  date: string;
  topic: string;
  minutes: number;
  content: string;
  feeling: string;
  outcome: string;
}

export interface ReviewItem {
  id: string;
  item: string;
  note: string;
  topic: string;
  firstDate: string;
  interval: number;
  nextDate: string;
  mastery: number;
  history: { date: string; result: "again" | "good" | "easy" }[];
}

export interface RecallItem {
  id: string;
  question: string;
  answer: string;
  topic: string;
  history: { date: string; rating: number }[];
}

export interface ReadingBook {
  id: string;
  title: string;
  author: string;
  totalPages: number;
  currentPage: number;
  minutes: number;
  notes: string;
  favorite: boolean;
  addedAt: string;
  progressLog: { date: string; pages: number }[];
}

export interface LearningGoal {
  id: string;
  title: string;
  description: string;
  deadline: string;
  createdAt: string;
  stages: { id: string; title: string; done: boolean }[];
  reviews: { date: string; note: string }[];
}

export interface KnowledgeCard {
  id: string;
  title: string;
  body: string;
  tags: string[];
  category: string;
  linkedTopic: string;
  favorite: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FocusSession {
  id: string;
  date: string;
  minutes: number;
  mode: string;
  completed: boolean;
}

export interface WeeklyReview {
  id: string;
  weekStart: string;
  minutes: number;
  goalsCompleted: string;
  newKnowledge: string;
  bestMethod: string;
  difficulties: string;
  nextPlan: string;
}

export function sumMinutes(sessions: StudySession[], days: number): number {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  return sessions
    .filter((s) => new Date(s.date) >= cutoff)
    .reduce((sum, s) => sum + Number(s.minutes || 0), 0);
}

export function streakDays(dates: string[]): number {
  const unique = [...new Set(dates.map((d) => d.slice(0, 10)))].sort().reverse();
  if (!unique.length) return 0;
  const dayMs = 86400000;
  const today = new Date().toISOString().slice(0, 10);
  let cursor = unique[0] === today || unique[0] > today ? new Date(unique[0]) : new Date();
  let count = 0;
  for (;;) {
    const key = cursor.toISOString().slice(0, 10);
    if (!unique.includes(key)) break;
    count += 1;
    cursor = new Date(cursor.getTime() - dayMs);
  }
  return count;
}
