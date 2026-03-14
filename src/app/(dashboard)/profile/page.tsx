"use client";

import { useProgress } from "@/context/ProgressContext";
import { Card } from "@/components/ui/Card";
import { Calendar, UserCircle, Target, RefreshCw, CheckCircle2 } from "lucide-react";
import { format, addDays } from "date-fns";

export default function ProfilePage() {
  const { progress, updatePlan, resetProgress } = useProgress();

  const handlePlanChange = async (months: 2 | 3 | 4 | 6) => {
    await updatePlan(months);
  };

  const handleReset = () => {
    if (confirm("Are you sure you want to reset all your progress? This cannot be undone.")) {
      resetProgress();
    }
  };

  const plans: { months: 2 | 3 | 4 | 6; label: string; desc: string; color: string }[] = [
    { months: 2, label: "2 Months", desc: "~7 problems/day · Intensive", color: "border-red-300 bg-red-50 dark:bg-red-900/20" },
    { months: 3, label: "3 Months", desc: "~5 problems/day · Fast", color: "border-orange-300 bg-orange-50 dark:bg-orange-900/20" },
    { months: 4, label: "4 Months", desc: "~4 problems/day · Steady", color: "border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20" },
    { months: 6, label: "6 Months", desc: "~2.5 problems/day · Relaxed", color: "border-green-300 bg-green-50 dark:bg-green-900/20" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl mx-auto">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Your Profile</h1>
        <p className="text-foreground/60 mt-2 text-lg">Manage your preparation plan and settings.</p>
      </div>

      <Card className="flex flex-col sm:flex-row items-center gap-6 p-8">
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-primary to-primary-light flex items-center justify-center text-white shadow-lg">
          <UserCircle size={52} />
        </div>
        <div className="text-center sm:text-left">
          <h2 className="text-2xl font-bold">Developer</h2>
          {progress.startDate ? (
            <p className="text-foreground/60 flex items-center justify-center sm:justify-start gap-2 mt-1">
              <Calendar size={16} />
              Plan started: {format(new Date(progress.startDate), 'MMMM do, yyyy')}
            </p>
          ) : (
            <p className="text-orange-500 mt-1 text-sm font-medium">⚠️ No active plan — select one below</p>
          )}
          {progress.planDurationMonths && progress.startDate && (
            <p className="text-foreground/50 text-sm mt-1">
              📅 Ends: {format(addDays(new Date(progress.startDate), progress.planDurationMonths * 30), 'MMMM do, yyyy')}
            </p>
          )}
        </div>
      </Card>

      <div>
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Target size={20} className="text-primary" />
          Choose Preparation Plan
        </h3>
        <p className="text-foreground/60 text-sm mb-6">
          Selecting a plan sets your daily problem target starting from <strong>today</strong>. Your progress is saved to the server.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {plans.map((plan) => {
            const isActive = Number(progress.planDurationMonths) === plan.months;
            return (
              <button
                key={plan.months}
                onClick={() => handlePlanChange(plan.months)}
                className={`p-5 rounded-2xl border-2 text-left transition-all hover:scale-[1.02] ${
                  isActive
                    ? "border-primary bg-primary text-white shadow-lg shadow-primary/25"
                    : `${plan.color} border hover:border-primary/50`
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-lg font-bold">{plan.label}</div>
                    <div className={`text-sm mt-0.5 ${isActive ? "text-white/80" : "text-foreground/60"}`}>{plan.desc}</div>
                  </div>
                  {isActive && <CheckCircle2 size={24} className="text-white" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <Card className="border-red-200 bg-red-50 dark:bg-red-900/10">
        <h3 className="text-xl font-bold mb-3 flex items-center gap-2 text-red-600">
          <RefreshCw size={20} />
          Danger Zone
        </h3>
        <p className="text-foreground/70 text-sm mb-4">
          Resetting progress clears all completed problems, streak, and plan. This is irreversible.
        </p>
        <button
          onClick={handleReset}
          className="py-3 px-6 rounded-xl bg-red-100 text-red-600 font-bold hover:bg-red-600 hover:text-white transition-colors"
        >
          Reset All Progress
        </button>
      </Card>
    </div>
  );
}
