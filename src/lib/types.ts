export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface Problem {
  id: string;
  title: string;
  difficulty: Difficulty;
  url: string;
  topic: string;
}

export interface UserProgress {
  completedProblems: string[];
  streak: number;
  lastActiveDate: string | null;
  planDurationMonths: 2 | 3 | 4 | 6;
  startDate: string;
}

export type TopicSection = {
  topic: string;
  problems: Problem[];
};
