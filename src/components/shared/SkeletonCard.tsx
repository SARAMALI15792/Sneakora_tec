"use client";

import { motion } from "framer-motion";

interface SkeletonCardProps {
  variant?: "product" | "list" | "detail";
}

function ShimmerOverlay() {
  return (
    <motion.div
      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/8 to-transparent"
      animate={{ x: ["-100%", "200%"] }}
      transition={{
        duration: 1.2,
        ease: "easeInOut",
        repeat: Infinity,
        repeatDelay: 0.2,
      }}
    />
  );
}

function ShimmerBlock({ className }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-md bg-muted/60 ${className}`}>
      <ShimmerOverlay />
    </div>
  );
}

export function SkeletonCard({ variant = "product" }: SkeletonCardProps) {
  if (variant === "product") {
    return (
      <div className="group">
        <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-muted/40">
          <ShimmerOverlay />
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
            <ShimmerBlock className="h-8 w-20 rounded-lg" />
            <ShimmerBlock className="size-8 rounded-full" />
          </div>
        </div>
        <div className="mt-3.5 space-y-2.5 px-1">
          <ShimmerBlock className="h-2.5 w-1/4" />
          <ShimmerBlock className="h-4 w-3/4" />
          <div className="flex items-center justify-between pt-0.5">
            <ShimmerBlock className="h-4 w-1/3" />
            <ShimmerBlock className="h-3 w-12" />
          </div>
        </div>
      </div>
    );
  }

  if (variant === "list") {
    return (
      <div className="flex items-center gap-4 rounded-xl border border-border/40 p-4">
        <ShimmerBlock className="size-16 shrink-0 rounded-lg" />
        <div className="flex-1 space-y-2.5">
          <ShimmerBlock className="h-3 w-1/3" />
          <ShimmerBlock className="h-4 w-2/3" />
          <ShimmerBlock className="h-3 w-1/4" />
        </div>
        <ShimmerBlock className="h-6 w-16 rounded-md" />
      </div>
    );
  }

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted/40">
        <ShimmerOverlay />
      </div>
      <div className="flex flex-col justify-center space-y-4 py-4">
        <ShimmerBlock className="h-3 w-24" />
        <ShimmerBlock className="h-8 w-3/4" />
        <ShimmerBlock className="h-7 w-1/4" />
        <div className="space-y-2.5 pt-4">
          <ShimmerBlock className="h-3.5 w-full" />
          <ShimmerBlock className="h-3.5 w-5/6" />
          <ShimmerBlock className="h-3.5 w-2/3" />
          <ShimmerBlock className="h-3.5 w-4/6" />
        </div>
        <div className="pt-4 flex gap-3">
          <ShimmerBlock className="h-11 flex-1 rounded-xl" />
          <ShimmerBlock className="size-11 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
