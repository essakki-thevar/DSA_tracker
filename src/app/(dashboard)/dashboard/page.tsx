"use client";

import { useEffect, useState } from "react";
import { useProgress } from "@/context/ProgressContext";
import { Card } from "@/components/ui/Card";
import { CircularProgress } from "@/components/ui/CircularProgress";
import { StreakFlame } from "@/components/ui/StreakFlame";
import { Problem } from "@/lib/types";
import {
  CheckCircle2, Circle, ExternalLink, Calendar, Target,
  TrendingUp, AlertCircle, Clock
} from "lucide-react";
import { format, differenceInCalendarDays, addDays } from "date-fns";
import Link from "next/link";

interface DailyData {
  daily: Problem[];
  totalDays: number;
  dayNumber: number;
  problemsPerDay: number;
  startDate: string;
  endDate: string;
}

export default function DashboardPage() {
  const { progress, toggleProblem, healthZone } = useProgress();
  const [dailyData, setDailyData] = useState<DailyData | null>(null);

  const totalProblems = 450;
  const solved = progress.completedProblems.length;
  const pct = Math.round((solved / totalProblems) * 100);

  useEffect(() => {
    fetch("/api/daily")
      .then(r => r.json())
      .then(setDailyData)
      .catch(console.error);
  }, [progress.planDurationMonths, progress.startDate]);

  const hasPlan = !!(progress.planDurationMonths && progress.startDate);
  const daysLeft = hasPlan
    ? Math.max(0, (progress.planDurationMonths * 30) - (differenceInCalendarDays(new Date(), new Date(progress.startDate)) + 1))
    : 0;

  const todaySolvedCount = (dailyData?.daily || []).filter(p => progress.completedProblems.includes(p.id)).length;
  const todayTarget = dailyData?.daily?.length || 0;
  const todayDone = todaySolvedCount >= todayTarget && todayTarget > 0;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight">Dashboard</h1>
          <p className="text-foreground/60 text-sm mt-0.5">
            {format(new Date(), 'EEEE, MMMM do yyyy')}
          </p>
        </div>
        <StreakFlame streak={progress.streak} />
      </div>

      {/* No plan banner */}
      {!hasPlan && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700">
          <AlertCircle size={20} className="text-amber-600 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-semibold text-amber-800 dark:text-amber-400 text-sm">No active plan</p>
            <p className="text-amber-700/70 text-xs mt-0.5">Set a preparation plan to see daily targets and track your progress.</p>
          </div>
          <Link href="/profile" className="px-4 py-1.5 rounded-xl bg-amber-600 text-white text-sm font-bold hover:bg-amber-700 transition-colors">
            Set Plan
          </Link>
        </div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        {/* Circular progress */}
        <Card className="col-span-2 lg:col-span-1 flex flex-col items-center justify-center gap-3 py-5">
          <CircularProgress value={pct} size={100} strokeWidth={8} />
          <div className="text-center">
            <p className="text-2xl font-extrabold">{solved}</p>
            <p className="text-xs text-foreground/50">of {totalProblems} solved</p>
          </div>
        </Card>

        <Card className="flex flex-col gap-1 justify-center">
          <div className="text-xs text-foreground/50 font-medium">Health Zone</div>
          <div className={`text-lg font-extrabold ${
            healthZone === 'Healthy' ? 'text-green-500' :
            healthZone === 'Warning' ? 'text-yellow-500' : 'text-red-500'
          }`}>{healthZone}</div>
          <div className="text-xs text-foreground/40">Based on your pace</div>
        </Card>

        <Card className="flex flex-col gap-1 justify-center">
          <div className="text-xs text-foreground/50 font-medium">🔥 Current Streak</div>
          <div className="text-lg font-extrabold">{progress.streak} days</div>
          <div className="text-xs text-foreground/40">Keep it up!</div>
        </Card>

        <Card className="flex flex-col gap-1 justify-center">
          <div className="text-xs text-foreground/50 font-medium">📅 Days Remaining</div>
          <div className="text-lg font-extrabold">{hasPlan ? daysLeft : "—"}</div>
          <div className="text-xs text-foreground/40">
            {hasPlan
              ? `Day ${dailyData?.dayNumber || 1} of ${dailyData?.totalDays || (progress.planDurationMonths! * 30)}`
              : "No plan set"
            }
          </div>
        </Card>
      </div>

      {/* Plan bar */}
      {hasPlan && (
        <Card className="py-3">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-foreground/60 flex-shrink-0">
              <Calendar size={15} />
              <span>
                {format(new Date(progress.startDate), 'MMM d')} → {format(addDays(new Date(progress.startDate), progress.planDurationMonths! * 30), 'MMM d, yyyy')}
              </span>
            </div>
            <div className="flex-1 h-2 bg-black/5 dark:bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-primary-light rounded-full"
                style={{
                  width: `${Math.min(100, ((dailyData?.dayNumber || 0) / (dailyData?.totalDays || 1)) * 100)}%`
                }}
              />
            </div>
            <span className="text-xs text-foreground/40 flex-shrink-0">
              {Math.round(((dailyData?.dayNumber || 0) / (dailyData?.totalDays || 1)) * 100)}% time elapsed
            </span>
          </div>
        </Card>
      )}

      {/* Daily Mission */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3">
          <div className="flex items-center gap-2 mb-3">
            <Target size={18} className="text-primary" />
            <h2 className="text-lg font-bold">Today&apos;s Mission</h2>
            {hasPlan && (
              <span className="text-xs font-semibold text-foreground/40">
                Day {dailyData?.dayNumber}
              </span>
            )}
            {todayDone && (
              <span className="ml-auto text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-full font-bold">
                ✓ Done!
              </span>
            )}
          </div>

          {!hasPlan ? (
            <Card className="text-center py-10 text-foreground/40">
              <Clock size={32} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">Select a plan to get daily problem targets</p>
            </Card>
          ) : !dailyData || dailyData.daily.length === 0 ? (
            <Card className="text-center py-10 text-foreground/40">
              <CheckCircle2 size={32} className="mx-auto mb-2 text-green-500 opacity-60" />
              <p className="text-sm">All caught up for today! 🎉</p>
            </Card>
          ) : (
            <Card className="p-0 overflow-hidden divide-y divide-black/5 dark:divide-white/5">
              <div className="px-4 py-2 flex items-center justify-between bg-black/2 dark:bg-white/2">
                <span className="text-xs text-foreground/50">{todaySolvedCount}/{todayTarget} done today</span>
                <div className="h-1.5 w-24 bg-black/5 dark:bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${(todaySolvedCount / todayTarget) * 100}%` }}
                  />
                </div>
              </div>
              {(dailyData?.daily ?? []).map((problem) => {
                const done = progress.completedProblems.includes(problem.id);
                return (
                  <div key={problem.id} className="flex items-center gap-3 px-4 py-3 hover:bg-black/2 dark:hover:bg-white/2 transition-colors">
                    <button onClick={() => toggleProblem(problem.id)} className="flex-shrink-0">
                      {done
                        ? <CheckCircle2 size={18} className="text-green-500" />
                        : <Circle size={18} className="text-foreground/30 hover:text-primary transition-colors" />
                      }
                    </button>
                    <span className={`flex-1 text-sm ${done ? "line-through text-foreground/40" : ""}`}>
                      {problem.title}
                    </span>
                    <span className="text-xs text-foreground/30 bg-black/5 dark:bg-white/5 px-2 py-0.5 rounded-md">{problem.topic}</span>
                    {problem.url && problem.url !== "#" && (
                      <a href={problem.url} target="_blank" rel="noopener noreferrer" className="text-foreground/30 hover:text-primary transition-colors">
                        <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                );
              })}
            </Card>
          )}

        </div>

        {/* Right stats column */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={16} className="text-primary" />
              <h3 className="font-bold text-sm">Job Readiness</h3>
            </div>
            {[
              { label: "Arrays & Strings", max: 75 },
              { label: "Trees & Graphs", max: 65 },
              { label: "DP", max: 50 },
              { label: "Misc Topics", max: 30 },
            ].map(({ label, max }) => {
              const val = Math.min(solved, max);
              const pct = Math.round((val / max) * 100);
              return (
                <div key={label} className="mb-3">
                  <div className="flex justify-between text-xs text-foreground/60 mb-1">
                    <span>{label}</span>
                    <span>{pct}%</span>
                  </div>
                  <div className="h-1.5 bg-black/5 dark:bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-primary-light rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </Card>

          <Card className="text-center">
            <p className="text-3xl font-extrabold text-primary">{Math.min(100, pct + 10)}%</p>
            <p className="text-xs text-foreground/50 mt-1">Interview Readiness Score</p>
            <Link href="/sheet" className="mt-3 block text-xs font-semibold text-primary hover:underline">
              View all problems →
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
