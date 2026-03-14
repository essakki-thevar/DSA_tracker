"use client";

import { motion } from "framer-motion";
import { Flame } from "lucide-react";

export function StreakFlame({ streak }: { streak: number }) {
  const isHot = streak > 0;

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/60 dark:bg-black/40 border border-primary/20 shadow-sm backdrop-blur-md">
      <motion.div
        animate={isHot ? {
          scale: [1, 1.1, 1],
        } : {}}
        transition={{
          repeat: Infinity,
          duration: 1.5,
          ease: "easeInOut"
        }}
      >
        <Flame
          size={20}
          className={isHot ? "text-orange-500 fill-orange-500" : "text-gray-400"}
        />
      </motion.div>
      <span className="font-semibold text-sm md:text-base">
        {streak} <span className="hidden md:inline-block text-foreground/70 font-medium">Day{streak !== 1 && 's'}</span>
      </span>
    </div>
  );
}
