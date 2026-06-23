"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

type OrderItem = {
  id: string;
  quantity: number;
  price: number;
  product: { name: string; images: string[] };
};

type Order = {
  id: string;
  userId: string;
  total: number;
  items: OrderItem[];
};

const stages = [
  { key: "confirmed", label: "Confirmed" },
  { key: "preparing", label: "Preparing" },
  { key: "shipping", label: "Shipping" },
  { key: "delivered", label: "Delivered" },
];

export function OrderAnimation({ order }: { order: Order }) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 700);
    const t2 = setTimeout(() => setStage(2), 1800);
    const t3 = setTimeout(() => setStage(3), 3000);
    const t4 = setTimeout(() => setStage(4), 4200);
    return () => {
      clearTimeout(t1); clearTimeout(t2);
      clearTimeout(t3); clearTimeout(t4);
    };
  }, []);

  const progress = stage / (stages.length - 1);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center overflow-hidden pt-20">
      <div className="mx-auto w-full max-w-lg px-6 py-10">
        {/* Phase 1: Entrance */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.2 }}
            className="mx-auto flex size-20 items-center justify-center rounded-full bg-accent/15"
          >
            <svg viewBox="0 0 48 48" fill="none" className="size-10 text-accent" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <motion.path
                d="M6 30h4l4-16h20l4 8h4a4 4 0 0 1 4 4v4a4 4 0 0 1-4 4h-2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.6, delay: 0.4, ease: [0.32, 0.72, 0, 1] }}
              />
              <circle cx="14" cy="36" r="4" />
              <circle cx="36" cy="36" r="4" />
            </svg>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-5 text-[10px] uppercase tracking-[0.4em] text-muted-foreground"
          >
            Order Placed
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="font-heading mt-2 text-3xl font-bold tracking-tight"
          >
            Thank you!
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-2 text-sm text-muted-foreground"
          >
            Your order #{order.id.slice(0, 8)} is on its way
          </motion.p>
        </motion.div>

        {/* Phase 2: Delivery Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6, ease: [0.32, 0.72, 0, 1] }}
          className="mt-14"
        >
          <div className="relative">
            {/* Progress bar track */}
            <div className="absolute left-0 right-0 top-[11px] h-[2px] bg-border" />
            {/* Animated fill */}
            <motion.div
              className="absolute left-0 top-[11px] h-[2px] bg-accent"
              initial={{ width: "0%" }}
              animate={{ width: `${progress * 100}%` }}
              transition={{ duration: 1.2, ease: [0.32, 0.72, 0, 1] }}
            />
            {/* Stage dots and labels */}
            <div className="relative flex justify-between">
              {stages.map((s, i) => (
                <div key={s.key} className="flex flex-col items-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: stage >= i ? 1 : 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 18, delay: 0.7 + i * 0.25 }}
                    className={`relative flex size-6 items-center justify-center rounded-full ${
                      stage >= i
                        ? "bg-accent text-accent-foreground shadow-[0_0_12px_-2px] shadow-accent/40"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {stage > i ? (
                      <svg viewBox="0 0 20 20" fill="currentColor" className="size-3">
                        <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                      </svg>
                    ) : (
                      <span className={`size-2 rounded-full bg-current ${stage === i ? "animate-pulse" : ""}`} />
                    )}
                  </motion.div>
                  <motion.span
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: stage >= i ? 1 : 0, y: stage >= i ? 0 : 5 }}
                    transition={{ duration: 0.3, delay: 0.8 + i * 0.25 }}
                    className={`mt-2 text-[9px] uppercase tracking-[0.2em] font-medium ${
                      stage >= i ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {s.label}
                  </motion.span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Phase 3: Order Items */}
        <AnimatePresence>
          {stage >= 2 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
              className="mt-14"
            >
              <div className="divide-y divide-border/60 overflow-hidden rounded-xl border border-border/60 bg-card/50 backdrop-blur-sm">
                {order.items.map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 * i }}
                    className="flex items-center gap-4 px-5 py-4"
                  >
                    {item.product.images[0] ? (
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="size-14 rounded-lg object-cover bg-muted"
                      />
                    ) : (
                      <div className="flex size-14 items-center justify-center rounded-lg bg-muted text-2xl opacity-10">👟</div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{item.product.name}</p>
                      <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 + 0.1 * i }}
                      className="text-sm font-semibold shrink-0"
                    >
                      ${Number(item.price).toFixed(2)}
                    </motion.p>
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.3 + 0.1 * order.items.length }}
                  className="flex items-center justify-between px-5 py-4"
                >
                  <span className="text-sm font-semibold">Total</span>
                  <motion.span
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.5 + 0.1 * order.items.length }}
                    className="text-lg font-bold text-accent"
                  >
                    ${Number(order.total).toFixed(2)}
                  </motion.span>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Phase 4: Actions */}
        <AnimatePresence>
          {stage >= 3 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3, ease: [0.32, 0.72, 0, 1] }}
              className="mt-8 flex justify-center gap-4"
            >
              <Link
                href="/orders"
                className="inline-flex h-11 items-center px-6 text-xs font-semibold uppercase tracking-widest border border-border hover:bg-muted transition-all duration-300 active:scale-[0.98]"
              >
                View Orders
              </Link>
              <Link
                href="/shop"
                className="inline-flex h-11 items-center px-6 text-xs font-semibold uppercase tracking-widest bg-foreground text-background hover:opacity-90 transition-all duration-300 active:scale-[0.98]"
              >
                Continue Shopping
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading dots while animating */}
        {stage < 4 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-10 flex items-center justify-center gap-2"
          >
            <span className="size-1.5 rounded-full bg-accent/50 animate-bounce" style={{ animationDelay: "0ms" }} />
            <span className="size-1.5 rounded-full bg-accent/50 animate-bounce" style={{ animationDelay: "150ms" }} />
            <span className="size-1.5 rounded-full bg-accent/50 animate-bounce" style={{ animationDelay: "300ms" }} />
          </motion.div>
        )}
      </div>
    </div>
  );
}
