"use client";

import { useProgress } from "@/context/ProgressContext";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "next-themes";
import { StreakFlame } from "@/components/ui/StreakFlame";
import { Bell, Menu, Sun, Moon, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function Topbar() {
  const { progress, healthZone } = useProgress();
  const { logout, user } = useAuth();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push("/login"); // Fixed: directly push to login
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-background/80 backdrop-blur-md border-b border-black/5 dark:border-white/5 md:justify-end">
      {/* Mobile Menu Button - Left */}
      <button className="md:hidden p-2 text-foreground/70 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors">
        <Menu size={24} />
      </button>

      {/* Mobile Logo */}
      <h1 className="md:hidden text-lg font-bold gradient-text">DSA Tracker</h1>

      {/* Right Side Stats & Actions */}
      <div className="flex items-center gap-2 sm:gap-4">
        {user && (
          <div className="hidden sm:flex items-center mx-2 text-sm font-semibold text-foreground/80">
            Hi, {user.username} 👋
          </div>
        )}

        <div className="hidden sm:flex items-center gap-2 cursor-default">
          <span className="text-xs font-semibold uppercase tracking-wider text-foreground/50">Status:</span>
          <span className={`text-xs font-bold px-2 py-1 rounded-full ${
            healthZone === 'Healthy' ? 'bg-success/10 text-success' :
            healthZone === 'Warning' ? 'bg-warning/10 text-warning' :
            'bg-danger/10 text-danger'
          }`}>
            {healthZone}
          </span>
        </div>
        
        <StreakFlame streak={progress.streak} />

        {mounted && (
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 text-foreground/70 hover:bg-black/5 dark:hover:bg-white/5 hover:text-primary rounded-full transition-colors"
            title="Toggle theme"
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        )}

        <button className="relative p-2 text-foreground/70 hover:bg-black/5 dark:hover:bg-white/5 hover:text-primary rounded-full transition-colors">
          <Bell size={20} />
          {healthZone !== 'Healthy' && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-danger rounded-full animate-pulse-slow" />
          )}
        </button>

        <button
          onClick={handleLogout}
          className="p-2 text-danger hover:bg-danger/10 rounded-full transition-colors ml-1"
          title="Logout"
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
}

