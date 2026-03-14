import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateCompletionPercentage(completedCount: number, totalCount: number): number {
  if (totalCount === 0) return 0;
  return Math.round((completedCount / totalCount) * 100);
}

// Function to calculate a mock job readiness score (0-100)
export function calculateJobReadiness(completedCount: number, totalCount: number, streak: number): number {
  if (totalCount === 0) return 0;
  const completionRatio = completedCount / totalCount;
  const consistencyBonus = Math.min(streak * 0.5, 15); // Max 15% bonus for consistency
  const baseScore = completionRatio * 85; // 85% weight on completion
  return Math.min(Math.round(baseScore + consistencyBonus), 100);
}

// Function to get a label for the job readiness score
export function getReadinessLabel(score: number): string {
  if (score < 30) return 'Beginner';
  if (score < 60) return 'Intermediate';
  if (score < 85) return 'Interview Ready';
  return 'FAANG Level Preparation';
}
