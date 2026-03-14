"use client";

import { useProgress } from "@/context/ProgressContext";
import { Card } from "@/components/ui/Card";
import { Trophy, Medal, Flame } from "lucide-react";
import { calculateCompletionPercentage } from "@/lib/utils";
import { striverProblems } from "@/data/dsaSheet";

const mockLeaderboard = [
  { rank: 1, name: "Alex Chen", solved: 172, streak: 45 },
  { rank: 2, name: "Priya Patel", solved: 156, streak: 30 },
  { rank: 3, name: "David Kim", solved: 140, streak: 21 },
  { rank: 4, name: "Sarah Johnson", solved: 125, streak: 15 },
  { rank: 5, name: "You", solved: 0, streak: 0, isCurrent: true }, // Will be updated
  { rank: 6, name: "Michael Chang", solved: 95, streak: 8 },
  { rank: 7, name: "Emma Wilson", solved: 82, streak: 12 },
  { rank: 8, name: "James Lee", solved: 70, streak: 5 },
  { rank: 9, name: "Olivia Smith", solved: 45, streak: 3 },
  { rank: 10, name: "Daniel Davis", solved: 20, streak: 2 },
];

export default function LeaderboardPage() {
  const { progress } = useProgress();
  const totalProblems = striverProblems.length;
  const completed = progress.completedProblems.length;

  // Insert current user into leaderboard dynamically for mockup
  const leaderboard = [...mockLeaderboard].map(user => {
    if (user.isCurrent) {
      return { ...user, solved: completed, streak: progress.streak };
    }
    return user;
  }).sort((a, b) => b.solved - a.solved).map((user, idx) => ({ ...user, rank: idx + 1 }));

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4">
        <div className="p-4 bg-yellow-500/10 rounded-2xl">
          <Trophy className="w-8 h-8 text-yellow-500" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Global Leaderboard</h1>
          <p className="text-foreground/60 mt-2 text-lg">Compare your progress with other learners.</p>
        </div>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/5 dark:bg-white/5 text-foreground/60 text-sm tracking-wider uppercase">
                <th className="p-4 font-semibold">Rank</th>
                <th className="p-4 font-semibold">Student</th>
                <th className="p-4 font-semibold text-center">Problems Solved</th>
                <th className="p-4 font-semibold text-center">Current Streak</th>
                <th className="p-4 font-semibold text-right">Completion</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 dark:divide-white/5">
              {leaderboard.map((user) => (
                <tr 
                  key={user.name} 
                  className={`transition-colors hover:bg-black/5 dark:hover:bg-white/5 ${user.isCurrent ? 'bg-primary/5 dark:bg-primary/10' : ''}`}
                >
                  <td className="p-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full font-bold
                      ${user.rank === 1 ? 'bg-yellow-500/20 text-yellow-600' :
                        user.rank === 2 ? 'bg-slate-300/50 text-slate-600' :
                        user.rank === 3 ? 'bg-amber-700/20 text-amber-700' : 'text-foreground/60'}">
                      {user.rank <= 3 ? <Medal size={18} /> : user.rank}
                    </div>
                  </td>
                  <td className="p-4 font-medium flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-primary-light flex items-center justify-center text-white font-bold">
                      {user.name.charAt(0)}
                    </div>
                    {user.name} {user.isCurrent && <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded ml-2">You</span>}
                  </td>
                  <td className="p-4 text-center font-bold text-foreground/80">
                    {user.solved} <span className="text-xs font-normal text-foreground/50">/ {totalProblems}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-1">
                      <Flame size={16} className={user.streak > 0 ? "text-orange-500" : "text-gray-400"} />
                      <span className="font-medium text-foreground/80">{user.streak}</span>
                    </div>
                  </td>
                  <td className="p-4 text-right pr-6">
                    <div className="flex items-center justify-end gap-3">
                      <div className="w-24 h-2 bg-black/5 dark:bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-primary to-primary-light rounded-full"
                          style={{ width: `${calculateCompletionPercentage(user.solved, totalProblems)}%` }}
                        />
                      </div>
                      <span className="font-bold text-sm w-10">{calculateCompletionPercentage(user.solved, totalProblems)}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
