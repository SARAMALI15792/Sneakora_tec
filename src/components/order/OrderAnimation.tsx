"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

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

const routeDots = [
  { label: "Warehouse", cx: "50%", cy: "100%" },
  { label: "Sorting Hub", cx: "50%", cy: "70%" },
  { label: "Local Facility", cx: "50%", cy: "40%" },
  { label: "Your Address", cx: "50%", cy: "10%" },
];

const springEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

function TruckSVG({ stage }: { stage: number }) {
  const isMoving = stage >= 2;
  return (
    <motion.svg
      viewBox="0 0 200 120"
      fill="none"
      className="w-full max-w-[200px]"
      initial={{ x: -80, opacity: 0 }}
      animate={{ x: isMoving ? 12 : 0, opacity: 1 }}
      transition={{ duration: 1.2, delay: isMoving ? 1.8 : 0.2, ease: springEase }}
    >
      {/* Shadow */}
      <motion.ellipse
        cx="100" cy="105" rx="70" ry="6"
        fill="black" fillOpacity="0.08"
        initial={{ scaleX: 0.4 }}
        animate={{ scaleX: 0.8 + (isMoving ? 0.05 : 0) }}
        transition={{ duration: 0.6, delay: 0.5 }}
      />

      {/* Cargo Box */}
      <motion.rect
        x="18" y="28" width="110" height="65" rx="4"
        className="stroke-foreground/15"
        strokeWidth="1.5"
        fill="currentColor" fillOpacity="0.04"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      />
      {/* Cargo lines */}
      <line x1="30" y1="48" x2="60" y2="48" className="stroke-foreground/10" strokeWidth="1" strokeDasharray="3 3" />
      <line x1="30" y1="58" x2="55" y2="58" className="stroke-foreground/10" strokeWidth="1" strokeDasharray="3 3" />
      <line x1="30" y1="68" x2="65" y2="68" className="stroke-foreground/10" strokeWidth="1" strokeDasharray="3 3" />

      {/* Package in cargo */}
      <motion.g
        initial={{ y: 0 }}
        animate={{ y: stage >= 1 ? [0, -3, 0] : 0 }}
        transition={{ duration: 1.2, repeat: stage >= 1 ? Infinity : 0, ease: "easeInOut", repeatDelay: 0.4 }}
      >
        <rect x="65" y="48" width="22" height="20" rx="2" className="fill-accent/20 stroke-accent/40" strokeWidth="1" />
        <line x1="69" y1="52" x2="69" y2="64" className="stroke-accent/30" strokeWidth="1" />
        <line x1="82" y1="52" x2="82" y2="64" className="stroke-accent/30" strokeWidth="1" />
        <line x1="71" y1="58" x2="80" y2="58" className="stroke-accent/30" strokeWidth="1" />
        {/* Tape */}
        <line x1="76" y1="48" x2="76" y2="68" className="stroke-accent/50" strokeWidth="1.5" />
      </motion.g>

      {/* Cabin */}
      <motion.path
        d="M128 28 L128 60 L148 60 L155 52 L155 28 Z"
        className="fill-foreground/[0.03] stroke-foreground/15"
        strokeWidth="1.5"
      />
      {/* Cabin window */}
      <motion.rect
        x="134" y="32" width="14" height="14" rx="2"
        className="fill-accent/10 stroke-accent/30"
        strokeWidth="1"
      />
      {/* Cabin divider */}
      <line x1="128" y1="28" x2="128" y2="60" className="stroke-foreground/20" strokeWidth="1.5" />
      {/* Headlight */}
      <motion.circle
        cx="154" cy="48" r="2.5"
        className="fill-accent/60"
        animate={{ opacity: isMoving ? [0.3, 1, 0.3] : 0.6 }}
        transition={{ duration: 0.8, repeat: isMoving ? Infinity : 0 }}
      />

      {/* Chassis line */}
      <line x1="18" y1="82" x2="148" y2="82" className="stroke-foreground/20" strokeWidth="1.5" />

      {/* Rear Wheel */}
      <motion.g
        animate={isMoving ? { rotate: 360 } : { rotate: 0 }}
        transition={{ duration: 0.8, repeat: isMoving ? Infinity : 0, ease: "linear" }}
        style={{ transformOrigin: "42px 92px" }}
      >
        <circle cx="42" cy="92" r="11" className="stroke-foreground/30" strokeWidth="2" fill="currentColor" fillOpacity="0.04" />
        <circle cx="42" cy="92" r="3" className="fill-foreground/20" />
        <line x1="42" y1="83" x2="42" y2="101" className="stroke-foreground/20" strokeWidth="1" />
        <line x1="33" y1="92" x2="51" y2="92" className="stroke-foreground/20" strokeWidth="1" />
      </motion.g>

      {/* Front Wheel */}
      <motion.g
        animate={isMoving ? { rotate: 360 } : { rotate: 0 }}
        transition={{ duration: 0.8, repeat: isMoving ? Infinity : 0, ease: "linear" }}
        style={{ transformOrigin: "120px 92px" }}
      >
        <circle cx="120" cy="92" r="11" className="stroke-foreground/30" strokeWidth="2" fill="currentColor" fillOpacity="0.04" />
        <circle cx="120" cy="92" r="3" className="fill-foreground/20" />
        <line x1="120" y1="83" x2="120" y2="101" className="stroke-foreground/20" strokeWidth="1" />
        <line x1="111" y1="92" x2="129" y2="92" className="stroke-foreground/20" strokeWidth="1" />
      </motion.g>

      {/* Exhaust puffs */}
      <AnimatePresence>
        {isMoving && (
          <motion.circle
            key="exhaust"
            cx="10" cy="78" r="4"
            className="fill-foreground/8"
            initial={{ opacity: 0.5, scale: 0.5, x: 0 }}
            animate={{ opacity: 0, scale: 2.5, x: -20 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut" }}
          />
        )}
      </AnimatePresence>
    </motion.svg>
  );
}

function RouteMap() {
  const [visibleDots, setVisibleDots] = useState(0);
  useEffect(() => {
    const t1 = setTimeout(() => setVisibleDots(1), 900);
    const t2 = setTimeout(() => setVisibleDots(2), 1900);
    const t3 = setTimeout(() => setVisibleDots(3), 3000);
    const t4 = setTimeout(() => setVisibleDots(4), 4000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, []);

  return (
    <div className="hidden lg:flex flex-col items-center gap-0 absolute left-8 top-1/2 -translate-y-1/2 select-none pointer-events-none">
      {/* Vertical dashed route line */}
      <svg width="2" height="280" className="mb-2">
        <line x1="1" y1="0" x2="1" y2="280" className="stroke-border/50" strokeWidth="1" strokeDasharray="4 4" />
      </svg>
      <div className="flex flex-col gap-14">
        {routeDots.map((dot, i) => (
          <div key={dot.label} className="flex items-center gap-3">
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={visibleDots > i ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 16 }}
              className={`relative flex size-4 items-center justify-center rounded-full ${
                visibleDots > i
                  ? "bg-accent shadow-[0_0_10px_-1px] shadow-accent/50"
                  : "bg-border/30"
              }`}
            >
              {visibleDots > i && (
                <svg viewBox="0 0 20 20" fill="currentColor" className="size-2.5 text-accent-foreground">
                  <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                </svg>
              )}
            </motion.div>
            <motion.span
              initial={{ opacity: 0, x: -8 }}
              animate={visibleDots > i ? { opacity: 1, x: 0 } : { opacity: 0, x: -8 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="text-[9px] uppercase tracking-[0.25em] font-medium text-muted-foreground"
            >
              {dot.label}
            </motion.span>
          </div>
        ))}
      </div>
    </div>
  );
}

function FloatingParcels() {
  return (
    <div className="hidden lg:flex flex-col items-end gap-8 absolute right-8 top-1/2 -translate-y-1/2 select-none pointer-events-none">
      {/* Tracking number */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.2, duration: 0.6, ease: springEase }}
        className="text-right"
      >
        <p className="text-[8px] uppercase tracking-[0.3em] text-muted-foreground/40">Tracking</p>
        <div className="mt-1 flex gap-1">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 + i * 0.08, duration: 0.3 }}
              className="block size-2.5 rounded-[2px] bg-foreground/10"
            />
          ))}
        </div>
      </motion.div>

      {/* Parcel icon 1 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1, rotate: [0, 4, -2, 0] }}
        transition={{ delay: 1.8, duration: 0.6, ease: springEase }}
      >
        <svg viewBox="0 0 32 32" className="size-10 text-foreground/8" fill="none" stroke="currentColor" strokeWidth="1.2">
          <rect x="3" y="6" width="26" height="22" rx="2" />
          <line x1="16" y1="6" x2="16" y2="28" />
          <line x1="3" y1="15" x2="29" y2="15" />
          <path d="M3 22 Q16 26 29 22" />
        </svg>
      </motion.div>

      {/* Parcel icon 2 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1, rotate: [0, -3, 2, 0] }}
        transition={{ delay: 2.2, duration: 0.6, ease: springEase }}
      >
        <svg viewBox="0 0 32 32" className="size-8 text-foreground/6" fill="none" stroke="currentColor" strokeWidth="1.2">
          <rect x="5" y="8" width="22" height="18" rx="2" />
          <line x1="16" y1="8" x2="16" y2="26" />
          <path d="M5 14 L16 18 L27 14" />
        </svg>
      </motion.div>

      {/* Barcode */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.6, duration: 0.6 }}
        className="flex gap-[3px]"
      >
        {[10, 4, 8, 3, 12, 5, 7, 4, 9, 3, 6, 8].map((h, i) => (
          <motion.div
            key={i}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: 2.8 + i * 0.03, duration: 0.2 }}
            style={{ height: h, transformOrigin: "bottom" }}
            className="w-[2px] bg-foreground/10 rounded-full"
          />
        ))}
      </motion.div>
    </div>
  );
}

function BackgroundDecorations() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
      {/* Route map dots grid */}
      <svg className="absolute inset-0 size-full opacity-[0.03]">
        <defs>
          <pattern id="route-grid" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
            <circle cx="40" cy="40" r="1.5" fill="currentColor" className="text-foreground" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#route-grid)" />
      </svg>

      {/* Orb glow bottom-left */}
      <motion.div
        className="absolute -bottom-32 -left-32 size-96 rounded-full bg-accent/3 blur-[120px]"
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Orb glow top-right */}
      <motion.div
        className="absolute -top-40 -right-40 size-80 rounded-full bg-accent/2 blur-[100px]"
        animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      {/* Floating route dots */}
      {(
        [
          { top: "15%", left: "5%", size: "size-2", delay: 0 },
          { top: "35%", left: "3%", size: "size-1.5", delay: 2 },
          { top: "55%", right: "4%", size: "size-2", delay: 1 },
          { top: "75%", left: "7%", size: "size-1", delay: 3 },
          { top: "20%", right: "6%", size: "size-1.5", delay: 1.5 },
          { top: "60%", left: "2%", size: "size-1", delay: 2.5 },
        ] as Array<{ top: string; left?: string; right?: string; size: string; delay: number }>
      ).map((dot) => (
        <motion.div
          key={`${dot.top}-${dot.left ?? dot.right}`}
          className={`absolute ${dot.size} rounded-full bg-accent/10`}
          style={{
            top: dot.top,
            left: dot.left,
            right: dot.right,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 0.6, 0], scale: [0, 1, 0], y: [0, -20] }}
          transition={{ duration: 3, delay: dot.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      {/* Horizontal route lines */}
      <motion.div
        className="absolute left-0 right-0 top-1/3 h-px bg-gradient-to-r from-transparent via-accent/5 to-transparent"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.5, delay: 0.5 }}
        style={{ transformOrigin: "left" }}
      />
      <motion.div
        className="absolute left-0 right-0 top-2/3 h-px bg-gradient-to-r from-transparent via-accent/3 to-transparent"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.5, delay: 0.8 }}
        style={{ transformOrigin: "right" }}
      />
    </div>
  );
}

function RoadAnimation({ stage }: { stage: number }) {
  return (
    <div className="relative w-full max-w-[240px] mx-auto mt-2">
      {/* Road surface */}
      <div className="h-[3px] w-full rounded-full bg-border/30 overflow-hidden relative">
        {/* Moving dashes */}
        <motion.div
          className="absolute inset-y-0 left-0 w-[200%] flex"
          animate={stage >= 2 ? { x: [0, -100] } : { x: 0 }}
          transition={{ duration: 0.8, repeat: stage >= 2 ? Infinity : 0, ease: "linear" }}
        >
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="h-full w-[10px] mx-[7px] rounded-full bg-accent/50" />
          ))}
        </motion.div>
      </div>
    </div>
  );
}

export function OrderAnimation({ order }: { order: Order }) {
  const [stage, setStage] = useState(0);
  const progress = stage / (stages.length - 1);

  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 700);
    const t2 = setTimeout(() => setStage(2), 1800);
    const t3 = setTimeout(() => setStage(3), 3000);
    const t4 = setTimeout(() => setStage(4), 4200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, []);

  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden pt-20">
      <BackgroundDecorations />
      <RouteMap />
      <FloatingParcels />

      <div className="relative mx-auto w-full max-w-lg px-6 py-10">
        {/* Phase 1: Entrance */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: springEase }}
          className="text-center"
        >
          {/* Animated truck */}
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 180, damping: 14, delay: 0.1 }}
            className="mx-auto flex items-center justify-center"
          >
            <TruckSVG stage={stage} />
          </motion.div>

          <RoadAnimation stage={stage} />

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
          transition={{ duration: 0.6, delay: 0.6, ease: springEase }}
          className="mt-14"
        >
          <div className="relative">
            <div className="absolute left-0 right-0 top-[11px] h-[2px] bg-border" />
            <motion.div
              className="absolute left-0 top-[11px] h-[2px] bg-accent"
              initial={{ width: "0%" }}
              animate={{ width: `${progress * 100}%` }}
              transition={{ duration: 1.2, ease: springEase }}
            />
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
              transition={{ duration: 0.6, ease: springEase }}
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
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        width={56}
                        height={56}
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
              transition={{ duration: 0.5, delay: 0.3, ease: springEase }}
              className="mt-8 flex justify-center gap-4"
            >
              <Link
                href="/profile/orders"
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

        {/* Loading dots */}
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
