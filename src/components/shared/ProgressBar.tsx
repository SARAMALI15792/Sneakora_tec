"use client";

import { motion } from "framer-motion";

interface ProgressBarProps {
  value: number;
  max?: number;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
}

export function ProgressBar({
  value,
  max = 100,
  showLabel = true,
  size = "md",
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const isComplete = percentage >= 100;

  const heights = {
    sm: "h-1",
    md: "h-1.5",
    lg: "h-2.5",
  };

  return (
    <div className="w-full">
      <div
        className={`relative w-full overflow-hidden rounded-full bg-muted/50 ${heights[size]}`}
      >
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-violet-500 via-purple-400 to-cyan-400"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
        />

        {!isComplete && (
          <motion.div
            className="absolute inset-y-0 w-1/4 rounded-full bg-gradient-to-r from-transparent via-white/25 to-transparent"
            animate={{ x: ["-100%", "500%"] }}
            transition={{ duration: 1.2, ease: "easeInOut", repeat: Infinity }}
          />
        )}

        {isComplete && (
          <motion.div
            className="absolute right-0 top-1/2 -translate-y-1/2 size-2 rounded-full bg-cyan-400 shadow-[0_0_6px_2px] shadow-cyan-400/50"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.3 }}
          />
        )}
      </div>

      {showLabel && (
        <div className="mt-1.5 flex justify-between">
          <span className="text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
            {isComplete ? "Complete" : "Processing"}
          </span>
          <span className="text-[11px] font-semibold tabular-nums text-foreground">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
    </div>
  );
}
