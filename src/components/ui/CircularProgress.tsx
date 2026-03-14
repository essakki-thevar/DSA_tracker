"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CircularProgressProps {
  value: number; // 0 to 100
  size?: number;
  strokeWidth?: number;
  className?: string;
  label?: string;
  showPercentage?: boolean;
}

export function CircularProgress({
  value,
  size = 120,
  strokeWidth = 12,
  className,
  label,
  showPercentage = true,
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (Math.max(0, Math.min(100, value)) / 100) * circumference;

  return (
    <div className={cn("relative flex flex-col items-center justify-center", className)}>
      <div className="relative" style={{ width: size, height: size }}>
        {/* Background Circle */}
        <svg fill="none" className="w-full h-full text-secondary/50" viewBox={`0 0 ${size} ${size}`}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            className="stroke-current"
          />
        </svg>

        {/* Foreground Circle */}
        <svg
          fill="none"
          className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none"
          viewBox={`0 0 ${size} ${size}`}
        >
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="stroke-primary"
            strokeLinecap="round"
          />
        </svg>

        {/* Center Text */}
        {showPercentage && (
          <div className="absolute inset-0 flex items-center justify-center font-bold text-xl md:text-2xl text-foreground">
            {Math.round(value)}%
          </div>
        )}
      </div>
      {label && <span className="mt-4 text-sm font-medium text-foreground/70 text-center">{label}</span>}
    </div>
  );
}
