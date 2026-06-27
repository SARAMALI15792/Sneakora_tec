"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface DirectionalTransitionProps {
  children: ReactNode;
  direction?: "left" | "right" | "up" | "down";
}

const variants = {
  left: { initial: { x: 20, opacity: 0 }, animate: { x: 0, opacity: 1 } },
  right: { initial: { x: -20, opacity: 0 }, animate: { x: 0, opacity: 1 } },
  up: { initial: { y: 20, opacity: 0 }, animate: { y: 0, opacity: 1 } },
  down: { initial: { y: -20, opacity: 0 }, animate: { y: 0, opacity: 1 } },
};

export function DirectionalTransition({
  children,
  direction = "up",
}: DirectionalTransitionProps) {
  const v = variants[direction];
  return (
    <motion.div
      initial={v.initial}
      animate={v.animate}
      transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
    >
      {children}
    </motion.div>
  );
}
