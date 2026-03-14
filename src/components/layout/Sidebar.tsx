"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ListTodo, Trophy, User, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useProgress } from "@/context/ProgressContext";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "DSA Sheet", href: "/sheet", icon: ListTodo },
  { name: "Leaderboard", href: "/leaderboard", icon: Trophy },
  { name: "Profile", href: "/profile", icon: User },
];

export function Sidebar() {
  const pathname = usePathname();
  const { progress } = useProgress();
  const totalSolved = progress?.completedProblems?.length || 0;
  const pct = Math.round((totalSolved / 450) * 100);

  return (
    <aside className="w-60 hidden md:flex flex-col h-screen fixed left-0 top-0 border-r border-black/5 dark:border-white/5 bg-white/60 dark:bg-black/30 backdrop-blur-xl z-40">
      <div className="px-5 py-5 border-b border-black/5 dark:border-white/5">
        <h1 className="text-xl font-bold gradient-text tracking-tight flex items-center gap-2">
          <TrendingUp size={20} className="text-primary" />
          DSA Tracker
        </h1>
        <p className="text-xs text-foreground/40 mt-0.5">Striver 450 Sheet</p>
      </div>

      <nav className="flex-1 px-3 space-y-1 mt-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-medium text-sm group",
                isActive
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "text-foreground/70 hover:bg-black/5 dark:hover:bg-white/5 hover:text-foreground"
              )}
            >
              <item.icon
                size={18}
                className={cn(
                  "transition-colors",
                  isActive ? "text-white" : "text-primary/70 group-hover:text-primary"
                )}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Progress pill */}
      <div className="p-4 border-t border-black/5 dark:border-white/5">
        <div className="bg-primary/5 rounded-xl p-3">
          <div className="flex justify-between items-center mb-2 text-xs font-semibold">
            <span className="text-foreground/60">Overall Progress</span>
            <span className="text-primary">{pct}%</span>
          </div>
          <div className="h-1.5 bg-black/5 dark:bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-primary-light rounded-full transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="text-xs text-foreground/40 mt-2 text-center">{totalSolved} / 450 solved</p>
        </div>
      </div>
    </aside>
  );
}
