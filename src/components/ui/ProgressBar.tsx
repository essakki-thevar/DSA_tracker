"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number; // 0 to 100
  className?: string;
  indicatorClassName?: string;
  showLabel?: boolean;
}

export function ProgressBar({ value, className, indicatorClassName, showLabel }: ProgressBarProps) {
  return (
    <div className={cn("w-full mb-4", className)}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-foreground/80">Progress</span>
          <span className="text-sm font-medium text-primary">{Math.round(value)}%</span>
        </div>
      )}
      <div className="h-2 w-full bg-secondary/50 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.max(0, Math.min(100, value))}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={cn("h-full bg-gradient-to-r from-primary to-primary-light rounded-full", indicatorClassName)}
        />
      </div>
    </div>
  );
}
