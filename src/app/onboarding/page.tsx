"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { authClient, useSession } from "@/lib/auth-client";
import { toast } from "sonner";
import {
  Check, ChevronRight, Loader2, ArrowLeft, RefreshCw,
  Sparkles, Bell, Zap, Heart, Truck,
  User, Palette, Ruler,
} from "lucide-react";

const styleCategories = [
  { id: "men", label: "Men", emoji: "👟", desc: "Bold & Urban" },
  { id: "women", label: "Women", emoji: "✨", desc: "Chic & Fresh" },
  { id: "kids", label: "Kids", emoji: "🧒", desc: "Fun & Playful" },
  { id: "sports", label: "Sports", emoji: "⚡", desc: "Performance Ready" },
  { id: "casual", label: "Casual", emoji: "🌊", desc: "Easy & Relaxed" },
];

const sizeData: Record<string, string[]> = {
  men: ["6", "7", "8", "9", "10", "11", "12", "13"],
  women: ["5", "6", "7", "8", "9", "10", "11"],
  sports: ["6", "7", "8", "9", "10", "11", "12", "13"],
  casual: ["5", "6", "7", "8", "9", "10", "11", "12"],
};

const welcomeHighlights = [
  { icon: Zap, label: "Lightning Deals", desc: "Exclusive drops on new arrivals" },
  { icon: Heart, label: "Wishlist Sync", desc: "Save & track your favorites" },
  { icon: Truck, label: "Free Shipping", desc: "On all orders over $100" },
];

function generateAvatarUrl(seed: string) {
  return `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(seed)}&backgroundColor=0f0f23`;
}

const steps = [
  { id: "profile", label: "Profile", short: "You", icon: User },
  { id: "style", label: "Style", short: "Vibe", icon: Palette },
  { id: "sizes", label: "Sizes", short: "Fit", icon: Ruler },
  { id: "notifications", label: "Notifications", short: "Alerts", icon: Bell },
];

const springNav = { type: "spring" as const, stiffness: 400, damping: 28, mass: 0.6 };
const springBouncy = { type: "spring" as const, stiffness: 350, damping: 20, mass: 0.7 };
const springGentle = { type: "spring" as const, stiffness: 280, damping: 30, mass: 0.9 };
const bezierSmooth = { duration: 0.7, ease: [0.32, 0.72, 0, 1] as const };

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18, filter: "blur(4px)" },
  visible: {
    opacity: 1, y: 0, filter: "blur(0px)",
    transition: { duration: 0.7, ease: [0.32, 0.72, 0, 1] as const },
  },
};

const pageVariants = {
  initial: { opacity: 0, y: 24, filter: "blur(6px)" },
  animate: {
    opacity: 1, y: 0, filter: "blur(0px)",
    transition: { duration: 0.7, ease: [0.32, 0.72, 0, 1] as const },
  },
  exit: {
    opacity: 0, y: -24, filter: "blur(6px)",
    transition: { duration: 0.4, ease: [0.32, 0.72, 0, 1] as const },
  },
};

function EyebrowTag({ text }: { text: string }) {
  return (
    <motion.span
      variants={itemVariants}
      className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.04] px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-white/30 ring-1 ring-white/[0.06]"
    >
      <span className="size-1 rounded-full bg-violet-400/60" />
      {text}
    </motion.span>
  );
}

function DoubleBezel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`p-[1.5px] rounded-[1.75rem] sm:rounded-[2rem] bg-gradient-to-b from-white/[0.08] to-white/[0.02] ${className}`}>
      <div className="rounded-[calc(1.75rem-1.5px)] sm:rounded-[calc(2rem-1.5px)] bg-[#0a0a0a] shadow-[inset_0_1px_1px_rgba(255,255,255,0.06)] p-6 sm:p-10">
        {children}
      </div>
    </div>
  );
}

function NestedButton({
  children,
  onClick,
  variant = "primary",
  disabled = false,
  loading = false,
  icon,
}: {
  children: React.ReactNode;
  onClick: () => void;
  variant?: "primary" | "ghost";
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
}) {
  const base = variant === "primary"
    ? "bg-white text-black hover:bg-white/90"
    : "bg-white/[0.04] text-white/60 hover:text-white hover:bg-white/[0.08] ring-1 ring-white/[0.06] hover:ring-white/[0.12]";

  return (
    <motion.button
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      disabled={disabled || loading}
      className={`group relative inline-flex h-11 items-center gap-3 rounded-full px-6 text-xs font-semibold uppercase tracking-[0.12em] transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] disabled:opacity-40 ${base}`}
    >
      {loading && (
        <Loader2 className="size-3.5 animate-spin" />
      )}
      <span className="relative">{children}</span>
      <span className="inline-flex size-7 items-center justify-center rounded-full bg-black/[0.06] transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:bg-black/[0.1]">
        {icon || <ChevronRight className="size-3.5" />}
      </span>
    </motion.button>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="group inline-flex h-11 items-center gap-2 rounded-full bg-white/[0.03] px-5 text-xs font-medium text-white/40 ring-1 ring-white/[0.06] transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:text-white hover:bg-white/[0.06] hover:ring-white/[0.12]"
    >
      <ArrowLeft className="size-3.5 transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:-translate-x-0.5" />
      Back
    </motion.button>
  );
}

function NotificationSwitch({
  enabled,
  onToggle,
}: {
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      onClick={(e) => { e.stopPropagation(); onToggle(); }}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${
        enabled ? "bg-violet-500" : "bg-white/[0.08]"
      }`}
    >
      <motion.div
        animate={{ x: enabled ? 20 : 2 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="absolute top-[3px] left-0 size-[18px] rounded-full bg-white shadow-sm"
      />
    </button>
  );
}

export default function OnboardingPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [step, setStep] = useState(0);
  const [avatarSeed, setAvatarSeed] = useState(() => Math.random().toString(36).substring(2));
  const [name, setName] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});
  const [notifications, setNotifications] = useState({ email: true, sms: false, push: true });
  const [isLoading, setIsLoading] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/sign-in");
    }
  }, [session, isPending, router]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isPending) router.push("/sign-in");
    }, 10000);
    return () => clearTimeout(timer);
  }, [isPending, router]);

  const goNext = useCallback(() => {
    setStep((p) => Math.min(p + 1, 4));
    mainRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const goBack = useCallback(() => {
    setStep((p) => Math.max(p - 1, 0));
    mainRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleComplete = async () => {
    setIsLoading(true);
    try {
      if (session?.user) {
        await authClient.updateUser({
          name: name.trim() || session.user.name || "Sneakora Fan",
          image: generateAvatarUrl(avatarSeed),
        });
      }
      await new Promise((resolve) => setTimeout(resolve, 800));
      toast.success("You're all set!", { description: "Welcome to Sneakora." });
      router.push("/shop");
    } catch {
      toast.error("Something went wrong. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isPending) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-[#050505]">
        <div className="flex flex-col items-center gap-6">
          <div className="flex gap-1.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <motion.div
                key={i}
                animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.8, 0.3] }}
                transition={{ repeat: Infinity, duration: 1.4, delay: i * 0.12, ease: [0.32, 0.72, 0, 1] as const }}
                className="size-2 rounded-full bg-violet-500/60"
              />
            ))}
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className="size-12 rounded-2xl bg-white/[0.03] ring-1 ring-white/[0.06] animate-pulse" />
            <div className="h-5 w-40 rounded-lg bg-white/[0.03] ring-1 ring-white/[0.06] animate-pulse" />
            <div className="h-3 w-24 rounded-lg bg-white/[0.02] ring-1 ring-white/[0.06] animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-[#050505] relative overflow-hidden">
      {/* ── Ambient Orbs ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden>
        <motion.div
          animate={shouldReduceMotion ? {} : { x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: [0.32, 0.72, 0, 1] as const }}
          className="absolute top-[15%] -left-[10%] w-[600px] h-[600px] rounded-full bg-violet-500/12 blur-[160px]"
        />
        <motion.div
          animate={shouldReduceMotion ? {} : { x: [0, -25, 0], y: [0, 25, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: [0.32, 0.72, 0, 1], delay: 5 }}
          className="absolute bottom-[20%] -right-[10%] w-[500px] h-[500px] rounded-full bg-cyan-400/8 blur-[140px]"
        />
        <motion.div
          animate={shouldReduceMotion ? {} : { x: [0, 15, 0], y: [0, -30, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: [0.32, 0.72, 0, 1], delay: 2 }}
          className="absolute top-[55%] left-[30%] w-[400px] h-[400px] rounded-full bg-fuchsia-500/6 blur-[120px]"
        />
      </div>

      {/* ── Grain Overlay ── */}
      <div
        className="fixed inset-0 pointer-events-none z-[60] opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundSize: "180px 180px",
        }}
      />

      {/* ── Fluid Island Nav ── */}
      <nav className="fixed top-5 left-1/2 -translate-x-1/2 z-50">
        <div className="p-1 rounded-full bg-black/75 backdrop-blur-2xl border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-0.5">
            {steps.map((s, i) => {
              const active = step === i;
              const done = step > i;
              return (
                <div key={s.id} className="relative px-3 py-1.5 sm:px-4 sm:py-2">
                  {active && (
                    <motion.div
                      layoutId="nav-active-pill"
                      className="absolute inset-0 rounded-full bg-white/[0.08]"
                      transition={springNav}
                    />
                  )}
                  <div className="relative z-10 flex items-center gap-2.5">
                    <div
                      className={`size-1.5 rounded-full transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                        done ? "bg-violet-400 shadow-[0_0_8px_rgba(139,92,246,0.4)]" : active ? "bg-white" : "bg-white/[0.15]"
                      }`}
                    />
                    <span
                      className={`text-[10px] sm:text-[11px] font-medium tracking-wider transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                        active ? "text-white" : done ? "text-white/50" : "text-white/20"
                      }`}
                    >
                      <span className="hidden sm:inline">{s.short}</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </nav>

      {/* ── Page progress (subtle bottom bar) ── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 h-0.5 bg-white/[0.03]">
        <motion.div
          animate={{ width: `${(step / (steps.length - 1)) * 100}%` }}
          transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] as const }}
          className="h-full bg-gradient-to-r from-violet-500 to-cyan-400"
        />
      </div>

      {/* ── Main content ── */}
      <div
        ref={mainRef}
        className="relative z-10 flex flex-col min-h-[100dvh] overflow-y-auto"
        style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.08) transparent" }}
      >
        <div className="flex-1 flex items-center justify-center py-28 sm:py-32 px-4">
          <div className="w-full max-w-[580px]">
            <AnimatePresence mode="wait">
              {/* ════════════════════ STEP 0: PROFILE ════════════════════ */}
              {step === 0 && (
                <motion.div
                  key="step-0"
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <DoubleBezel>
                    <motion.div
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                      className="space-y-8"
                    >
                      <div className="space-y-4">
                        <EyebrowTag text="Step 01" />
                        <motion.h2
                          variants={itemVariants}
                          className="text-3xl sm:text-4xl font-bold tracking-tight text-white leading-[1.08]"
                        >
                          Create your<br />profile
                        </motion.h2>
                        <motion.p
                          variants={itemVariants}
                          className="text-sm text-white/30 leading-relaxed max-w-sm"
                        >
                          Pick your identity — you can always change this later.
                        </motion.p>
                      </div>

                      <motion.div variants={itemVariants} className="flex flex-col items-center gap-6">
                        <div className="group relative">
                          <div className="p-[1.5px] rounded-2xl bg-gradient-to-b from-white/[0.12] to-white/[0.04]">
                            <motion.img
                              key={avatarSeed}
                              initial={{ scale: 0.9, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={springGentle}
                              src={generateAvatarUrl(avatarSeed)}
                              alt="Avatar"
                              className="size-24 rounded-[calc(1rem-1.5px)] bg-[#050505]"
                            />
                          </div>
                          <motion.button
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 400, damping: 15, delay: 0.3 }}
                            whileHover={{ scale: 1.1, rotate: 90 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setAvatarSeed(Math.random().toString(36).substring(2))}
                            className="absolute -bottom-1.5 -right-1.5 size-8 rounded-full bg-violet-500 flex items-center justify-center shadow-lg shadow-violet-500/30 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:shadow-violet-500/50"
                          >
                            <RefreshCw className="size-3.5 text-white" />
                          </motion.button>
                        </div>

                        <div className="w-full p-[1px] rounded-xl bg-white/[0.06] transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] focus-within:bg-violet-500/30">
                          <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="What should we call you?"
                            className="w-full rounded-[calc(0.75rem-1px)] bg-[#0a0a0a] px-4 py-3 text-sm text-white placeholder:text-white/[0.15] outline-none transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] focus:bg-[#0d0d0d]"
                          />
                        </div>
                      </motion.div>

                      <motion.div variants={itemVariants} className="flex justify-end">
                        <NestedButton onClick={goNext}>
                          Continue
                        </NestedButton>
                      </motion.div>

                      <motion.p
                        variants={itemVariants}
                        className="text-center text-[10px] text-white/[0.12] tracking-wider"
                      >
                        ALL STEPS OPTIONAL — EDIT ANYTIME IN PROFILE
                      </motion.p>
                    </motion.div>
                  </DoubleBezel>
                </motion.div>
              )}

              {/* ════════════════════ STEP 1: STYLE ════════════════════ */}
              {step === 1 && (
                <motion.div
                  key="step-1"
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <DoubleBezel>
                    <motion.div
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                      className="space-y-8"
                    >
                      <div className="space-y-4">
                        <EyebrowTag text="Step 02" />
                        <motion.h2
                          variants={itemVariants}
                          className="text-3xl sm:text-4xl font-bold tracking-tight text-white leading-[1.08]"
                        >
                          What&apos;s your vibe?
                        </motion.h2>
                        <motion.p
                          variants={itemVariants}
                          className="text-sm text-white/30 leading-relaxed"
                        >
                          Select all that fit your style — we&apos;ll tailor your feed.
                        </motion.p>
                      </div>

                      <motion.div
                        variants={itemVariants}
                        className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                      >
                        {styleCategories.map((cat, i) => {
                          const selected = selectedCategories.includes(cat.id);
                          const isLarge = i === 0;
                          return (
                            <motion.button
                              key={cat.id}
                              variants={itemVariants}
                              whileHover={{ scale: 1.01 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() =>
                                setSelectedCategories((prev) =>
                                  prev.includes(cat.id) ? prev.filter((c) => c !== cat.id) : [...prev, cat.id]
                                )
                              }
                              className={`group relative text-left transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                                isLarge ? "sm:col-span-2" : ""
                              }`}
                            >
                              <div className={`p-[1px] rounded-2xl transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                                selected
                                  ? "bg-violet-500/50"
                                  : "bg-white/[0.06] hover:bg-white/[0.1]"
                              }`}>
                                <div className={`rounded-[calc(1rem-1px)] transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                                  selected
                                    ? "bg-violet-500/10"
                                    : "bg-[#0a0a0a] group-hover:bg-white/[0.02]"
                                }`}>
                                  <div className="flex items-center gap-4 p-4 sm:p-5">
                                    <span className="text-2xl">{cat.emoji}</span>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-semibold text-white">
                                        {cat.label}
                                      </p>
                                      <p className="text-[10px] text-white/25 mt-0.5">
                                        {cat.desc}
                                      </p>
                                    </div>
                                    <motion.div
                                      animate={{
                                        scale: selected ? 1 : 0,
                                        opacity: selected ? 1 : 0,
                                      }}
                                      transition={springBouncy}
                                      className="size-6 rounded-full bg-violet-500 flex items-center justify-center shrink-0"
                                    >
                                      <Check className="size-3 text-white" />
                                    </motion.div>
                                  </div>
                                </div>
                              </div>
                            </motion.button>
                          );
                        })}
                      </motion.div>

                      <motion.div variants={itemVariants} className="flex items-center justify-between pt-2">
                        <BackButton onClick={goBack} />
                        <NestedButton onClick={goNext}>
                          Next
                        </NestedButton>
                      </motion.div>
                    </motion.div>
                  </DoubleBezel>
                </motion.div>
              )}

              {/* ════════════════════ STEP 2: SIZES ════════════════════ */}
              {step === 2 && (
                <motion.div
                  key="step-2"
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <DoubleBezel>
                    <motion.div
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                      className="space-y-8"
                    >
                      <div className="space-y-4">
                        <EyebrowTag text="Step 03" />
                        <motion.h2
                          variants={itemVariants}
                          className="text-3xl sm:text-4xl font-bold tracking-tight text-white leading-[1.08]"
                        >
                          Your perfect fit
                        </motion.h2>
                        <motion.p
                          variants={itemVariants}
                          className="text-sm text-white/30 leading-relaxed"
                        >
                          Pick your size for each category.
                        </motion.p>
                      </div>

                      <motion.div
                        variants={itemVariants}
                        className="space-y-5 max-h-[360px] overflow-y-auto pr-1"
                        style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.06) transparent" }}
                      >
                        {["men", "women", "sports", "casual"].map((catId, idx) => {
                          const cat = styleCategories.find((c) => c.id === catId);
                          const sizes = sizeData[catId];
                          if (!cat || !sizes) return null;
                          return (
                            <motion.div
                              key={catId}
                              initial={{ opacity: 0, y: 12 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: idx * 0.08, ...bezierSmooth }}
                            >
                              <div className="p-[1px] rounded-xl bg-white/[0.04]">
                                <div className="rounded-[calc(0.75rem-1px)] bg-[#0a0a0a] p-4 sm:p-5">
                                  <div className="flex items-center gap-2 mb-3.5">
                                    <span className="text-base">{cat.emoji}</span>
                                    <p className="text-[10px] font-medium uppercase tracking-[0.15em] text-white/25">
                                      {cat.label}
                                      {selectedSizes[catId] && (
                                        <span className="ml-2 text-violet-400/80">— US {selectedSizes[catId]}</span>
                                      )}
                                    </p>
                                  </div>
                                  <div className="flex gap-2 flex-wrap">
                                    {sizes.map((size) => {
                                      const active = selectedSizes[catId] === size;
                                      return (
                                        <button
                                          key={size}
                                          onClick={() =>
                                            setSelectedSizes((prev) => ({
                                              ...prev,
                                              [catId]: prev[catId] === size ? "" : size,
                                            }))
                                          }
                                          className={`relative px-3.5 py-2 rounded-lg text-[11px] font-medium transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-95 ${
                                            active
                                              ? "bg-violet-500 text-white shadow-md shadow-violet-500/20"
                                              : "bg-white/[0.03] text-white/40 ring-1 ring-white/[0.06] hover:bg-white/[0.06] hover:text-white/60 hover:ring-white/[0.12]"
                                          }`}
                                        >
                                          US {size}
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </motion.div>

                      <motion.div variants={itemVariants} className="flex items-center justify-between pt-2">
                        <BackButton onClick={goBack} />
                        <NestedButton onClick={goNext}>
                          Next
                        </NestedButton>
                      </motion.div>
                    </motion.div>
                  </DoubleBezel>
                </motion.div>
              )}

              {/* ════════════════════ STEP 3: NOTIFICATIONS ════════════════════ */}
              {step === 3 && (
                <motion.div
                  key="step-3"
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <DoubleBezel>
                    <motion.div
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                      className="space-y-8"
                    >
                      <div className="space-y-4">
                        <EyebrowTag text="Step 04" />
                        <motion.h2
                          variants={itemVariants}
                          className="text-3xl sm:text-4xl font-bold tracking-tight text-white leading-[1.08]"
                        >
                          Stay in the loop
                        </motion.h2>
                        <motion.p
                          variants={itemVariants}
                          className="text-sm text-white/30 leading-relaxed"
                        >
                          Choose how you want to hear from us — we&apos;ll keep it worthwhile.
                        </motion.p>
                      </div>

                      <motion.div variants={itemVariants} className="space-y-3">
                        {[
                          { key: "email" as const, label: "Email Updates", desc: "Order confirmations, drops & exclusive offers" },
                          { key: "sms" as const, label: "SMS Alerts", desc: "Flash sales & order updates on the go" },
                          { key: "push" as const, label: "Push Notifications", desc: "Real-time wishlist alerts & new drops" },
                        ].map(({ key, label, desc }, idx) => {
                          const enabled = notifications[key];
                          return (
                            <motion.div
                              key={key}
                              initial={{ opacity: 0, y: 12 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: idx * 0.08, ...bezierSmooth }}
                              whileHover={{ scale: 1.003 }}
                              whileTap={{ scale: 0.997 }}
                              onClick={() =>
                                setNotifications((prev) => ({ ...prev, [key]: !prev[key] }))
                              }
                              className="cursor-pointer"
                            >
                              <div className={`p-[1px] rounded-2xl transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                                enabled
                                  ? "bg-violet-500/40"
                                  : "bg-white/[0.04] hover:bg-white/[0.08]"
                              }`}>
                                <div className={`rounded-[calc(1rem-1px)] transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                                  enabled
                                    ? "bg-violet-500/8"
                                    : "bg-[#0a0a0a]"
                                }`}>
                                  <div className="flex items-center gap-4 p-4 sm:p-5">
                                    <div className={`size-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                                      enabled ? "bg-violet-500/20" : "bg-white/[0.04]"
                                    }`}>
                                      <Bell className={`size-4 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                                        enabled ? "text-violet-400" : "text-white/20"
                                      }`} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-semibold text-white">{label}</p>
                                      <p className="text-[10px] text-white/25 mt-0.5">{desc}</p>
                                    </div>
                                    <NotificationSwitch
                                      enabled={enabled}
                                      onToggle={() =>
                                        setNotifications((prev) => ({ ...prev, [key]: !prev[key] }))
                                      }
                                    />
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </motion.div>

                      <motion.div variants={itemVariants} className="flex items-center justify-between pt-2">
                        <BackButton onClick={goBack} />
                        <NestedButton
                          onClick={handleComplete}
                          loading={isLoading}
                          icon={isLoading ? undefined : <Check className="size-3.5" />}
                        >
                          {isLoading ? "Setting up..." : "Complete Setup"}
                        </NestedButton>
                      </motion.div>
                    </motion.div>
                  </DoubleBezel>
                </motion.div>
              )}

              {/* ════════════════════ STEP 4: WELCOME ════════════════════ */}
              {step === 4 && (
                <motion.div
                  key="step-4"
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <div className="text-center">
                    <div className="p-[1.5px] rounded-[2rem] bg-gradient-to-b from-white/[0.08] to-white/[0.02]">
                      <div className="rounded-[calc(2rem-1.5px)] bg-[#0a0a0a] shadow-[inset_0_1px_1px_rgba(255,255,255,0.06)] p-8 sm:p-12">
                        <motion.div
                          variants={containerVariants}
                          initial="hidden"
                          animate="visible"
                          className="space-y-8"
                        >
                          <motion.div variants={itemVariants} className="space-y-5">
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.2 }}
                              className="inline-flex items-center justify-center"
                            >
                              <div className="size-16 rounded-2xl bg-gradient-to-br from-violet-500/30 to-cyan-500/10 ring-1 ring-white/[0.08] flex items-center justify-center">
                                <Sparkles className="size-7 text-violet-400" />
                              </div>
                            </motion.div>
                            <motion.h2
                              variants={itemVariants}
                              className="text-3xl sm:text-4xl font-bold tracking-tight text-white leading-[1.08]"
                            >
                              Welcome{name ? `, ${name}` : ""}!
                            </motion.h2>
                            <motion.p
                              variants={itemVariants}
                              className="text-sm text-white/30 leading-relaxed max-w-sm mx-auto"
                            >
                              Your profile is ready. Let&apos;s find your perfect pair.
                            </motion.p>
                          </motion.div>

                          <motion.div
                            variants={itemVariants}
                            className="grid grid-cols-1 sm:grid-cols-3 gap-3"
                          >
                            {welcomeHighlights.map(({ icon: Icon, label, desc }, i) => (
                              <motion.div
                                key={label}
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 + i * 0.1, ...bezierSmooth }}
                                className={`p-[1px] rounded-xl bg-white/[0.04] ${i === 0 ? "sm:col-span-3" : ""}`}
                              >
                                <div className="rounded-[calc(0.75rem-1px)] bg-[#0a0a0a] p-4 sm:p-5 text-center">
                                  <Icon className="size-5 text-violet-400 mx-auto" />
                                  <p className="text-xs font-semibold text-white mt-2">{label}</p>
                                  <p className="text-[10px] text-white/25 mt-0.5">{desc}</p>
                                </div>
                              </motion.div>
                            ))}
                          </motion.div>

                          <motion.div variants={itemVariants}>
                            <NestedButton onClick={() => router.push("/shop")} icon={<Sparkles className="size-3.5" />}>
                              Start Shopping
                            </NestedButton>
                          </motion.div>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
