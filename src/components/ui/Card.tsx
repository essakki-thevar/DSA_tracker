import { cn } from "@/lib/utils";
import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Card({ className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "glass-card p-6 overflow-hidden relative transition-all duration-300 hover:shadow-xl hover:-translate-y-1",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
