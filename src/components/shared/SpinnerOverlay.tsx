"use client";

import { motion, AnimatePresence } from "framer-motion";
import { PremiumLoader } from "./PremiumLoader";

interface SpinnerOverlayProps {
  isVisible: boolean;
  message?: string;
}

export function SpinnerOverlay({ isVisible, message }: SpinnerOverlayProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
          aria-live="polite"
          aria-label="Loading"
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background/80 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 8 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
            className="relative z-10 flex flex-col items-center gap-5"
          >
            <div className="rounded-2xl bg-card/80 p-5 shadow-xl ring-1 ring-border/50">
              <PremiumLoader size={48} />
            </div>
            {message && (
              <motion.p
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.25 }}
                className="text-sm font-medium text-muted-foreground"
              >
                {message}
              </motion.p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
