"use client";

import { motion } from "framer-motion";

export function PremiumLoader({ size = 48 }: { size?: number }) {
  const outerSize = size;
  const midSize = size * 0.72;
  const innerSize = size * 0.35;

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: outerSize, height: outerSize }}
      aria-label="Loading"
      role="status"
    >
      {/* Outer ring */}
      <motion.div
        className="absolute rounded-full border-2 border-transparent"
        style={{
          width: outerSize,
          height: outerSize,
          borderTopColor: "hsl(262, 83%, 65%)",
          borderRightColor: "hsl(262, 83%, 65%)",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 1.2, ease: "linear", repeat: Infinity }}
      />

      {/* Middle ring (counter-rotating) */}
      <motion.div
        className="absolute rounded-full border-2 border-transparent"
        style={{
          width: midSize,
          height: midSize,
          borderBottomColor: "hsl(190, 95%, 50%)",
          borderLeftColor: "hsl(190, 95%, 50%)",
        }}
        animate={{ rotate: -360 }}
        transition={{ duration: 0.9, ease: "linear", repeat: Infinity }}
      />

      {/* Center dot with pulse */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: innerSize,
          height: innerSize,
          background: "linear-gradient(135deg, hsl(262, 83%, 65%), hsl(190, 95%, 50%))",
        }}
        animate={{ scale: [1, 1.3, 1], opacity: [0.8, 1, 0.8] }}
        transition={{ duration: 1.5, ease: "easeInOut", repeat: Infinity }}
      />
    </div>
  );
}
