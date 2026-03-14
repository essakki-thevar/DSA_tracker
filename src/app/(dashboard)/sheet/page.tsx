"use client";

import { useState, useEffect } from "react";
import { useProgress } from "@/context/ProgressContext";
import { groupedProblems, topicsList } from "@/data/dsaSheet";
import {
  X, ExternalLink, CheckCircle2, Circle,
  Code2, BookOpen, Network, GitBranch, Layers, Search,
  BarChart2, Binary, Cpu, Zap, Box, List, TreePine, Database
} from "lucide-react";
import { cn } from "@/lib/utils";

const topicIcons: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  "Array": BarChart2,
  "Matrix": Layers,
  "String": BookOpen,
  "Searching & Sorting": Search,
  "LinkedList": List,
  "Binary Trees": TreePine,
  "Binary Search Trees": Database,
  "Greedy": Zap,
  "BackTracking": GitBranch,
  "Stacks & Queues": Box,
  "Heap": Binary,
  "Graph": Network,
  "Trie": Code2,
  "Dynamic Programming": Cpu,
  "Bit Manipulation": Code2,
};

const topicColors: Record<string, string> = {
  "Array": "from-blue-500 to-blue-600",
  "Matrix": "from-violet-500 to-violet-600",
  "String": "from-pink-500 to-pink-600",
  "Searching & Sorting": "from-amber-500 to-amber-600",
  "LinkedList": "from-cyan-500 to-cyan-600",
  "Binary Trees": "from-green-500 to-green-600",
  "Binary Search Trees": "from-emerald-500 to-emerald-600",
  "Greedy": "from-yellow-500 to-yellow-600",
  "BackTracking": "from-orange-500 to-orange-600",
  "Stacks & Queues": "from-indigo-500 to-indigo-600",
  "Heap": "from-red-500 to-red-600",
  "Graph": "from-teal-500 to-teal-600",
  "Trie": "from-purple-500 to-purple-600",
  "Dynamic Programming": "from-fuchsia-500 to-fuchsia-600",
  "Bit Manipulation": "from-slate-500 to-slate-600",
};

export default function SheetPage() {
  const { progress, toggleProblem } = useProgress();
  const [activeTopic, setActiveTopic] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "done" | "todo">("all");

  // Close drawer on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveTopic(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const totalSolved = progress.completedProblems.length;
  const totalProblems = topicsList.reduce((acc, t) => acc + groupedProblems[t].length, 0);

  const drawerProblems = activeTopic
    ? (groupedProblems[activeTopic] || []).filter(p => {
        if (filter === "done") return progress.completedProblems.includes(p.id);
        if (filter === "todo") return !progress.completedProblems.includes(p.id);
        return true;
      })
    : [];

  const drawerTotal = activeTopic ? groupedProblems[activeTopic]?.length || 0 : 0;
  const drawerSolved = activeTopic
    ? groupedProblems[activeTopic]?.filter(p => progress.completedProblems.includes(p.id)).length || 0
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight">DSA Sheet</h1>
          <p className="text-foreground/60 mt-1 text-sm lg:text-base">
            {totalSolved} of {totalProblems} problems solved · Click a topic to open its problems
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 text-primary font-bold text-sm px-4 py-2 rounded-xl">
            {Math.round((totalSolved / totalProblems) * 100)}% Complete
          </div>
        </div>
      </div>

      {/* Overall progress bar */}
      <div className="w-full h-3 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary to-primary-light rounded-full transition-all duration-1000"
          style={{ width: `${(totalSolved / totalProblems) * 100}%` }}
        />
      </div>

      {/* Topic Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 lg:gap-4">
        {topicsList.map((topic) => {
          const problems = groupedProblems[topic] || [];
          const solved = problems.filter(p => progress.completedProblems.includes(p.id)).length;
          const pct = Math.round((solved / problems.length) * 100);
          const Icon = topicIcons[topic] || Code2;
          const gradient = topicColors[topic] || "from-gray-500 to-gray-600";
          const isActive = activeTopic === topic;

          return (
            <button
              key={topic}
              onClick={() => setActiveTopic(isActive ? null : topic)}
              className={cn(
                "group relative flex flex-col items-start p-4 rounded-2xl border-2 transition-all duration-200 text-left hover:scale-[1.02] hover:shadow-lg",
                isActive
                  ? "border-primary shadow-lg shadow-primary/20 bg-primary/5"
                  : "border-black/5 dark:border-white/10 bg-white dark:bg-white/5 hover:border-primary/40"
              )}
            >
              {/* Icon */}
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-3 shadow-md`}>
                <Icon size={20} className="text-white" />
              </div>

              {/* Topic name */}
              <div className="text-sm font-bold leading-tight mb-2 line-clamp-2">{topic}</div>

              {/* Stats */}
              <div className="text-xs text-foreground/50 mb-2">{solved}/{problems.length}</div>

              {/* Mini progress bar */}
              <div className="w-full h-1.5 bg-black/5 dark:bg-white/10 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${gradient} rounded-full transition-all`}
                  style={{ width: `${pct}%` }}
                />
              </div>

              {/* Solved badge */}
              {solved === problems.length && (
                <div className="absolute top-2 right-2">
                  <CheckCircle2 size={16} className="text-green-500" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Drawer Overlay */}
      {activeTopic && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm z-40"
            onClick={() => setActiveTopic(null)}
          />

          {/* Drawer */}
          <div className="fixed right-0 top-0 h-full w-full max-w-lg bg-white dark:bg-[#111] shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300">
            {/* Drawer header */}
            <div className={`p-5 bg-gradient-to-r ${topicColors[activeTopic] || "from-primary to-primary-light"} text-white`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  {(() => {
                    const Icon = topicIcons[activeTopic] || Code2;
                    return <Icon size={24} className="text-white" />;
                  })()}
                  <h2 className="text-xl font-bold">{activeTopic}</h2>
                </div>
                <button
                  onClick={() => setActiveTopic(null)}
                  className="p-2 rounded-xl hover:bg-white/20 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Progress in drawer */}
              <div className="flex items-center gap-4 text-sm text-white/90">
                <span>{drawerSolved} / {drawerTotal} solved</span>
                <span>·</span>
                <span>{Math.round((drawerSolved / drawerTotal) * 100)}% done</span>
              </div>
              <div className="mt-2 h-2 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all"
                  style={{ width: `${(drawerSolved / drawerTotal) * 100}%` }}
                />
              </div>
            </div>

            {/* Filter tabs */}
            <div className="flex border-b border-black/5 dark:border-white/10 px-4 pt-3 gap-1">
              {(["all", "todo", "done"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={cn(
                    "px-4 py-2 text-sm font-semibold rounded-t-lg capitalize transition-colors",
                    filter === f
                      ? "bg-primary text-white"
                      : "text-foreground/60 hover:text-foreground"
                  )}
                >
                  {f} {f === "all" ? `(${drawerTotal})` : f === "done" ? `(${drawerSolved})` : `(${drawerTotal - drawerSolved})`}
                </button>
              ))}
            </div>

            {/* Problem list */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {drawerProblems.length === 0 && (
                <div className="text-center text-foreground/40 mt-16 text-sm">No problems match this filter.</div>
              )}
              {drawerProblems.map((problem) => {
                const solved = progress.completedProblems.includes(problem.id);
                return (
                  <div
                    key={problem.id}
                    className={cn(
                      "flex items-start gap-3 p-3 rounded-xl border transition-all group",
                      solved
                        ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700"
                        : "bg-white dark:bg-white/5 border-black/5 dark:border-white/10 hover:border-primary/30"
                    )}
                  >
                    <button
                      onClick={() => toggleProblem(problem.id)}
                      className="mt-0.5 flex-shrink-0 transition-transform hover:scale-110"
                    >
                      {solved
                        ? <CheckCircle2 size={20} className="text-green-500" />
                        : <Circle size={20} className="text-foreground/30 hover:text-primary" />
                      }
                    </button>

                    <div className="flex-1 min-w-0">
                      <p className={cn("text-sm font-medium leading-snug", solved && "line-through text-foreground/50")}>
                        {problem.title}
                      </p>
                    </div>

                    {problem.url && problem.url !== "#" && (
                      <a
                        href={problem.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-shrink-0 p-1.5 rounded-lg text-foreground/30 hover:text-primary hover:bg-primary/10 transition-all"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink size={15} />
                      </a>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Quick action */}
            <div className="p-4 border-t border-black/5 dark:border-white/10">
              <button
                onClick={() => setActiveTopic(null)}
                className="w-full py-2.5 rounded-xl border border-black/10 dark:border-white/10 text-sm font-semibold text-foreground/70 hover:bg-black/5 transition-colors"
              >
                Close (Esc)
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
