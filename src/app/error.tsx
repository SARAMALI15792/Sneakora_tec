"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { AlertTriangle, ArrowRight, RefreshCw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-[60dvh] flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
        className="text-center max-w-md"
      >
        <div className="mx-auto flex size-20 items-center justify-center rounded-[2rem] bg-destructive/10 ring-1 ring-destructive/20">
          <AlertTriangle className="size-9 text-destructive" />
        </div>

        <p className="mt-6 text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
          Something went wrong
        </p>
        <h1 className="font-heading mt-3 text-3xl font-bold tracking-tight">
          Oops! An error occurred
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          We encountered an unexpected issue. Please try again or return to the homepage.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={reset}
            className="group inline-flex h-12 items-center gap-3 rounded-full bg-foreground px-8 text-xs font-semibold uppercase tracking-[0.15em] text-background transition-all duration-500 hover:opacity-90 active:scale-[0.97]"
          >
            <RefreshCw className="size-4" />
            Try Again
          </button>
          <Link
            href="/"
            className="group inline-flex h-12 items-center gap-3 rounded-full border border-border px-8 text-xs font-semibold uppercase tracking-[0.15em] transition-all duration-500 hover:bg-muted active:scale-[0.97]"
          >
            Go Home
            <span className="flex size-6 items-center justify-center rounded-full bg-muted transition-transform duration-300 group-hover:translate-x-0.5">
              <ArrowRight className="size-3" />
            </span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}