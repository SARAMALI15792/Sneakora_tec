"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";

const STEPS = [
  { id: "cart", label: "Cart validated" },
  { id: "inventory", label: "Checking inventory" },
  { id: "redirect", label: "Redirecting to payment" },
  { id: "order", label: "Confirming order" },
  { id: "email", label: "Sending confirmation" },
] as const;

type StepId = (typeof STEPS)[number]["id"];

interface StatusLoaderProps {
  currentStep: StepId;
  completedSteps?: StepId[];
}

function getStepIndex(step: StepId): number {
  return STEPS.findIndex((s) => s.id === step);
}

export function StatusLoader({ currentStep, completedSteps = [] }: StatusLoaderProps) {
  const currentIndex = getStepIndex(currentStep);

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-3">
        {STEPS.map((step, index) => {
          const isCompleted = completedSteps.includes(step.id) || index < currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08, duration: 0.3 }}
              className="flex items-center gap-3"
            >
              <div className="relative flex size-6 shrink-0 items-center justify-center">
                <AnimatePresence mode="wait">
                  {isCompleted ? (
                    <motion.div
                      key="check"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 400, damping: 20 }}
                      className="flex size-5 items-center justify-center rounded-full bg-emerald-500"
                    >
                      <Check className="size-3 text-white" strokeWidth={3} />
                    </motion.div>
                  ) : isCurrent ? (
                    <motion.div
                      key="spinner"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      className="flex size-5 items-center justify-center"
                    >
                      <motion.div
                        className="size-5 rounded-full border-2 border-violet-500/30 border-t-violet-500"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.8, ease: "linear", repeat: Infinity }}
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="pending"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="size-5 rounded-full border border-border/40"
                    />
                  )}
                </AnimatePresence>
              </div>

              <span
                className={`text-sm transition-colors duration-300 ${
                  isCompleted
                    ? "text-foreground"
                    : isCurrent
                    ? "text-foreground font-medium"
                    : "text-muted-foreground/60"
                }`}
              >
                {step.label}
              </span>
            </motion.div>
          );
        })}
      </div>

      <div className="relative h-1 w-full overflow-hidden rounded-full bg-muted/50">
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-500 via-violet-400 to-cyan-400"
          initial={{ width: "0%" }}
          animate={{
            width: `${((currentIndex + 1) / STEPS.length) * 100}%`,
          }}
          transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
        />
        <motion.div
          className="absolute inset-0 w-1/3 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
          animate={{ x: ["-100%", "400%"] }}
          transition={{ duration: 1.5, ease: "easeInOut", repeat: Infinity }}
        />
      </div>
    </div>
  );
}
