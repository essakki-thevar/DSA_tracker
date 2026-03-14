"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { UserProgress } from '@/lib/types';
import { differenceInDays } from 'date-fns';

interface ProgressContextType {
  progress: UserProgress;
  loading: boolean;
  toggleProblem: (id: string) => void;
  updatePlan: (months: 2 | 3 | 4 | 6) => void;
  resetProgress: () => void;
  healthZone: 'Healthy' | 'Warning' | 'Danger';
}

const defaultProgress: UserProgress = {
  completedProblems: [],
  streak: 0,
  lastActiveDate: null,
  planDurationMonths: null as unknown as 6,
  startDate: null as unknown as string,
};

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState<UserProgress>(defaultProgress);
  const [loading, setLoading] = useState(true);

  // Fetch user data from API on mount
  const fetchProgress = useCallback(async () => {
    try {
      const res = await fetch('/api/user');
      const data = await res.json();
      setProgress(data);
    } catch (e) {
      console.error('Failed to fetch progress', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  const toggleProblem = useCallback(async (id: string) => {
    // Optimistic update
    setProgress(prev => {
      const completed = prev?.completedProblems || [];
      const isCompleted = completed.includes(id);
      return {
        ...prev,
        completedProblems: isCompleted
          ? completed.filter(p => p !== id)
          : [...completed, id],
      };
    });

    try {
      const res = await fetch('/api/problems/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ problemId: id }),
      });
      const updated = await res.json();
      setProgress(prev => ({ ...prev, ...updated }));
    } catch (e) {
      console.error('Failed to toggle problem', e);
      fetchProgress(); // revert on error
    }
  }, [fetchProgress]);

  const updatePlan = useCallback(async (months: 2 | 3 | 4 | 6) => {
    const startDate = new Date().toISOString();
    const body = { planDurationMonths: months, startDate };

    // Optimistic update
    setProgress(prev => ({ ...prev, ...body }));

    try {
      const res = await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const updated = await res.json();
      setProgress(updated);
    } catch (e) {
      console.error('Failed to update plan', e);
    }
  }, []);

  const resetProgress = useCallback(async () => {
    const reset = {
      completedProblems: [],
      streak: 0,
      lastActiveDate: null,
      planDurationMonths: null,
      startDate: null,
    };
    setProgress(reset as unknown as UserProgress);
    try {
      await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reset),
      });
    } catch (e) {
      console.error('Failed to reset progress', e);
    }
  }, []);

  const calculateHealthZone = (): 'Healthy' | 'Warning' | 'Danger' => {
    if (!progress.startDate || !progress.planDurationMonths) return 'Healthy';
    const totalProblems = 450;
    const totalDays = progress.planDurationMonths * 30;
    const ratePerDay = totalProblems / totalDays;
    const daysSinceStart = Math.max(0, differenceInDays(new Date(), new Date(progress.startDate)));
    const expected = Math.floor(ratePerDay * daysSinceStart);
    const actual = progress?.completedProblems?.length || 0;
    const deficit = expected - actual;
    if (deficit > ratePerDay * 3) return 'Danger';
    if (deficit > ratePerDay * 1) return 'Warning';
    return 'Healthy';
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <ProgressContext.Provider value={{
      progress,
      loading,
      toggleProblem,
      updatePlan,
      resetProgress,
      healthZone: calculateHealthZone()
    }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
}
