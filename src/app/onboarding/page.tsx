"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { authClient, useSession } from "@/lib/auth-client";
import { toast } from "sonner";
import {
  Check, ChevronRight, Loader2, ArrowLeft, RefreshCw,
  Sparkles, Shirt, Ruler, Bell, Zap, Heart, Truck,
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
  { icon: Zap, label: "Lightning Deals", desc: "Exclusive drops" },
  { icon: Heart, label: "Wishlist Sync", desc: "Save favorites" },
  { icon: Truck, label: "Free Shipping", desc: "Orders $100+" },
];

function generateAvatarUrl(seed: string) {
  return `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(seed)}&backgroundColor=0f0f23`;
}

const springTransition = {
  type: "spring" as const,
  stiffness: 280,
  damping: 24,
  mass: 0.8,
};

const springFast = {
  type: "spring" as const,
  stiffness: 400,
  damping: 30,
};

const easeOut = [0.32, 0.72, 0, 1];

const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 48 : -48,
    opacity: 0,
    scale: 0.98,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: springTransition,
  },
  exit: (dir: number) => ({
    x: dir > 0 ? -48 : 48,
    opacity: 0,
    scale: 0.98,
    transition: { duration: 0.18, ease: easeOut as unknown as undefined },
  }),
};

const fadeUp = {
  hidden: { y: 20, opacity: 0 },
  visible: (i: number) => ({
    y: 0,
    opacity: 1,
    transition: { delay: i * 0.06, type: "spring" as const, stiffness: 400, damping: 30 },
  }),
};

export default function OnboardingPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [avatarSeed, setAvatarSeed] = useState(() => Math.random().toString(36).substring(2));
  const [name, setName] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});
  const [notifications, setNotifications] = useState({ email: true, sms: false, push: true });
  const [isLoading, setIsLoading] = useState(false);
  const shouldReduceMotion = useReducedMotion();

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
    setDirection(1);
    setStep((p) => Math.min(p + 1, 4));
  }, []);

  const goBack = useCallback(() => {
    setDirection(-1);
    setStep((p) => Math.max(p - 1, 0));
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
      <div className="min-h-[100dvh] flex items-center justify-center bg-[#050507]">
        <div className="w-full max-w-md px-6">
          <div className="flex justify-center mb-12">
            {Array.from({ length: 5 }).map((_, i) => (
              <motion.div
                key={i}
                animate={{ scale: 1, backgroundColor: "hsl(262 83% 58%)", opacity: 0.6 }}
                transition={{ delay: i * 0.05, ...springFast }}
                className="size-2.5 rounded-full mx-1"
              />
            ))}
          </div>
          <div className="space-y-6 animate-pulse">
            <div className="flex justify-center">
              <div className="size-16 rounded-2xl bg-white/5" />
            </div>
            <div className="h-8 bg-white/5 rounded-xl w-2/3 mx-auto" />
            <div className="h-4 bg-white/5 rounded-xl w-1/2 mx-auto" />
            <div className="h-48 bg-white/5 rounded-2xl mt-8" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-[#050507] overflow-hidden relative">
      {/* Ambient background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ x: shouldReduceMotion ? 0 : [0, 30, 0], y: shouldReduceMotion ? 0 : [0, -20, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[#8b5cf6]/10 blur-[100px]"
        />
        <motion.div
          animate={{ x: shouldReduceMotion ? 0 : [0, -30, 0], y: shouldReduceMotion ? 0 : [0, 25, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-[#06b6d4]/8 blur-[80px]"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
        className="relative z-10 w-full max-w-md px-6 py-10"
      >
        {/* Glass card */}
        <div className="relative">
          {/* Outer ring glow */}
          <div className="absolute -inset-px rounded-[2rem] bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
          {/* Inner glass card */}
          <div className="relative rounded-[2rem] bg-black/40 backdrop-blur-2xl border border-white/[0.06] shadow-2xl shadow-black/50 overflow-hidden">
            <div className="px-8 py-8">
              {/* Step dot indicator */}
              <div className="flex items-center justify-center mb-10">
                {Array.from({ length: 5 }).map((_, i) => {
                  const isActive = step === i;
                  const isDone = step > i;
                  return (
                    <div key={i} className="flex items-center">
                      <motion.div
                        animate={{
                          scale: isActive ? 1.35 : 1,
                          backgroundColor: isDone || isActive ? "hsl(262 83% 58%)" : "hsl(0 0 50% / 0.15)",
                          boxShadow: isActive
                            ? "0 0 16px 2px hsl(262 83% 58% / 0.3)"
                            : "0 0 0px 0px transparent",
                        }}
                        transition={springFast}
                        className="size-2.5 rounded-full"
                      />
                      {i < 4 && (
                        <motion.div
                          animate={{
                            backgroundColor: step > i ? "hsl(262 83% 58%)" : "hsl(0 0 50% / 0.15)",
                            opacity: step > i ? 1 : 0.4,
                          }}
                          transition={{ duration: 0.3 }}
                          className="w-8 h-px mx-1"
                        />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Step content */}
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={step}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                >
                  {/* Step 0: Profile */}
                  {step === 0 && (
                    <div className="space-y-6">
                      <div className="text-center space-y-1">
                        <p className="text-[10px] uppercase tracking-[0.25em] text-white/30 font-medium">
                          Step 1 of 4
                        </p>
                        <motion.h2
                          variants={fadeUp}
                          custom={0}
                          initial="hidden"
                          animate="visible"
                          className="text-2xl font-bold tracking-tight text-white"
                        >
                          Create your profile
                        </motion.h2>
                        <motion.p
                          variants={fadeUp}
                          custom={1}
                          initial="hidden"
                          animate="visible"
                          className="text-sm text-white/40"
                        >
                          Pick your style identity
                        </motion.p>
                      </div>

                      <motion.div
                        variants={fadeUp}
                        custom={2}
                        initial="hidden"
                        animate="visible"
                        className="flex flex-col items-center gap-3"
                      >
                        {/* Avatar */}
                        <div className="relative group">
                          <motion.img
                            key={avatarSeed}
                            initial={{ scale: 0.85, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={springFast}
                            src={generateAvatarUrl(avatarSeed)}
                            alt="Avatar"
                            className="size-20 rounded-2xl ring-1 ring-white/10"
                          />
                          <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.92 }}
                            onClick={() => setAvatarSeed(Math.random().toString(36).substring(2))}
                            className="absolute -bottom-1.5 -right-1.5 size-7 rounded-full bg-[#8b5cf6] flex items-center justify-center shadow-lg shadow-purple-500/30"
                          >
                            <RefreshCw className="size-3 text-white" />
                          </motion.button>
                        </div>

                        {/* Name input */}
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="What should we call you?"
                          className="w-full h-11 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder:text-white/20 text-center outline-none transition-all duration-300
                            focus:border-[#8b5cf6]/50 focus:bg-white/[0.06] focus:shadow-[0_0_0_3px_rgba(139,92,246,0.12)]"
                        />
                      </motion.div>

                      <motion.div
                        variants={fadeUp}
                        custom={3}
                        initial="hidden"
                        animate="visible"
                        className="flex justify-center"
                      >
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.96 }}
                          onClick={goNext}
                          className="inline-flex h-11 items-center gap-2.5 bg-white text-black rounded-full px-8 text-xs font-semibold tracking-widest transition-all hover:bg-white/90 active:scale-95"
                        >
                          Get Started <ChevronRight className="size-4" />
                        </motion.button>
                      </motion.div>

                      <motion.p
                        variants={fadeUp}
                        custom={4}
                        initial="hidden"
                        animate="visible"
                        className="text-center text-[10px] text-white/20"
                      >
                        All steps optional — edit anytime in profile
                      </motion.p>
                    </div>
                  )}

                  {/* Step 1: Style */}
                  {step === 1 && (
                    <div className="space-y-6">
                      <div className="text-center space-y-1">
                        <p className="text-[10px] uppercase tracking-[0.25em] text-white/30 font-medium">
                          Step 2 of 4
                        </p>
                        <motion.h2
                          variants={fadeUp}
                          custom={0}
                          initial="hidden"
                          animate="visible"
                          className="text-2xl font-bold tracking-tight text-white"
                        >
                          What&apos;s your vibe?
                        </motion.h2>
                        <motion.p
                          variants={fadeUp}
                          custom={1}
                          initial="hidden"
                          animate="visible"
                          className="text-sm text-white/40"
                        >
                          Select all that fit your style
                        </motion.p>
                      </div>

                      <motion.div
                        variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
                        initial="hidden"
                        animate="visible"
                        className="space-y-2"
                      >
                        {styleCategories.map((cat) => {
                          const selected = selectedCategories.includes(cat.id);
                          return (
                            <motion.button
                              key={cat.id}
                              variants={fadeUp}
                              custom={2}
                              whileHover={{ scale: 1.01 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() =>
                                setSelectedCategories((prev) =>
                                  prev.includes(cat.id) ? prev.filter((c) => c !== cat.id) : [...prev, cat.id]
                                )
                              }
                              className={`w-full flex items-center gap-4 p-4 rounded-2xl border text-left transition-all duration-200 ${
                                selected
                                  ? "border-[#8b5cf6]/50 bg-[#8b5cf6]/10"
                                  : "border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12]"
                              }`}
                            >
                              <span className="text-xl">{cat.emoji}</span>
                              <div className="flex-1">
                                <p className="text-sm font-semibold text-white">{cat.label}</p>
                                <p className="text-[10px] text-white/30">{cat.desc}</p>
                              </div>
                              <motion.div
                                animate={{
                                  scale: selected ? 1 : 0,
                                  opacity: selected ? 1 : 0,
                                }}
                                transition={springFast}
                                className="size-5 rounded-full bg-[#8b5cf6] flex items-center justify-center shrink-0"
                              >
                                <Check className="size-3 text-white" />
                              </motion.div>
                            </motion.button>
                          );
                        })}
                      </motion.div>

                      <motion.div
                        variants={fadeUp}
                        custom={3}
                        initial="hidden"
                        animate="visible"
                        className="flex justify-between pt-2"
                      >
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.96 }}
                          onClick={goBack}
                          className="inline-flex h-11 items-center gap-2 border border-white/[0.1] rounded-full px-5 text-xs font-semibold text-white/50 hover:text-white hover:border-white/[0.2] transition-all"
                        >
                          <ArrowLeft className="size-3.5" /> Back
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.96 }}
                          onClick={goNext}
                          className="inline-flex h-11 items-center gap-2 bg-white text-black rounded-full px-6 text-xs font-semibold tracking-widest hover:bg-white/90 transition-all"
                        >
                          Next <ChevronRight className="size-4" />
                        </motion.button>
                      </motion.div>
                    </div>
                  )}

                  {/* Step 2: Sizes */}
                  {step === 2 && (
                    <div className="space-y-6">
                      <div className="text-center space-y-1">
                        <p className="text-[10px] uppercase tracking-[0.25em] text-white/30 font-medium">
                          Step 3 of 4
                        </p>
                        <motion.h2
                          variants={fadeUp}
                          custom={0}
                          initial="hidden"
                          animate="visible"
                          className="text-2xl font-bold tracking-tight text-white"
                        >
                          Your perfect fit
                        </motion.h2>
                        <motion.p
                          variants={fadeUp}
                          custom={1}
                          initial="hidden"
                          animate="visible"
                          className="text-sm text-white/40"
                        >
                          Pick your size for each category
                        </motion.p>
                      </div>

                      <motion.div
                        variants={{ visible: { transition: { staggerChildren: 0.04 } } }}
                        initial="hidden"
                        animate="visible"
                        className="space-y-4 max-h-[280px] overflow-y-auto pr-1 scrollbar-hide"
                      >
                        {["men", "women", "sports", "casual"].map((catId) => {
                          const cat = styleCategories.find((c) => c.id === catId);
                          const sizes = sizeData[catId];
                          return (
                            <div key={catId} className="space-y-2">
                              <div className="flex items-center gap-1.5">
                                <span className="text-sm">{cat?.emoji}</span>
                                <p className="text-[10px] uppercase tracking-widest text-white/30 font-medium">
                                  {cat?.label}
                                  {selectedSizes[catId] && (
                                    <span className="ml-1.5 text-[#8b5cf6]">— US {selectedSizes[catId]}</span>
                                  )}
                                </p>
                              </div>
                              <div className="flex gap-1.5 flex-wrap">
                                {sizes.map((size) => (
                                  <button
                                    key={size}
                                    onClick={() =>
                                      setSelectedSizes((prev) => ({
                                        ...prev,
                                        [catId]: prev[catId] === size ? "" : size,
                                      }))
                                    }
                                    className={`h-8 rounded-lg border text-[11px] font-medium px-2.5 transition-all active:scale-95 ${
                                      selectedSizes[catId] === size
                                        ? "bg-[#8b5cf6] border-[#8b5cf6] text-white shadow-md shadow-purple-500/20"
                                        : "border-white/[0.08] text-white/50 hover:border-white/[0.2] hover:text-white/70"
                                    }`}
                                  >
                                    US {size}
                                  </button>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </motion.div>

                      <motion.div
                        variants={fadeUp}
                        custom={3}
                        initial="hidden"
                        animate="visible"
                        className="flex justify-between pt-2"
                      >
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.96 }}
                          onClick={goBack}
                          className="inline-flex h-11 items-center gap-2 border border-white/[0.1] rounded-full px-5 text-xs font-semibold text-white/50 hover:text-white hover:border-white/[0.2] transition-all"
                        >
                          <ArrowLeft className="size-3.5" /> Back
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.96 }}
                          onClick={goNext}
                          className="inline-flex h-11 items-center gap-2 bg-white text-black rounded-full px-6 text-xs font-semibold tracking-widest hover:bg-white/90 transition-all"
                        >
                          Next <ChevronRight className="size-4" />
                        </motion.button>
                      </motion.div>
                    </div>
                  )}

                  {/* Step 3: Notifications */}
                  {step === 3 && (
                    <div className="space-y-6">
                      <div className="text-center space-y-1">
                        <p className="text-[10px] uppercase tracking-[0.25em] text-white/30 font-medium">
                          Step 4 of 4
                        </p>
                        <motion.h2
                          variants={fadeUp}
                          custom={0}
                          initial="hidden"
                          animate="visible"
                          className="text-2xl font-bold tracking-tight text-white"
                        >
                          Stay in the loop
                        </motion.h2>
                        <motion.p
                          variants={fadeUp}
                          custom={1}
                          initial="hidden"
                          animate="visible"
                          className="text-sm text-white/40"
                        >
                          Choose how you want to hear from us
                        </motion.p>
                      </div>

                      <motion.div
                        variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
                        initial="hidden"
                        animate="visible"
                        className="space-y-3"
                      >
                        {[
                          { key: "email", label: "Email Updates", desc: "Order confirmations, drops & exclusive offers" },
                          { key: "sms", label: "SMS Alerts", desc: "Flash sales & order updates" },
                          { key: "push", label: "Push Notifications", desc: "Real-time wishlist alerts & new drops" },
                        ].map(({ key, label, desc }) => {
                          const enabled = notifications[key as keyof typeof notifications];
                          return (
                            <motion.div
                              key={key}
                              variants={fadeUp}
                              custom={2}
                              whileHover={{ scale: 1.01 }}
                              whileTap={{ scale: 0.99 }}
                              onClick={() =>
                                setNotifications((prev) => ({ ...prev, [key]: !prev[key as keyof typeof prev] }))
                              }
                              className={`w-full flex items-center gap-4 p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer ${
                                enabled
                                  ? "border-[#8b5cf6]/40 bg-[#8b5cf6]/8"
                                  : "border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12]"
                              }`}
                            >
                              <div className={`size-9 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-200 ${
                                enabled ? "bg-[#8b5cf6]/20" : "bg-white/[0.05]"
                              }`}>
                                <Bell className={`size-4 ${enabled ? "text-[#8b5cf6]" : "text-white/30"}`} />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-semibold text-white">{label}</p>
                                <p className="text-[10px] text-white/30">{desc}</p>
                              </div>
                              <div
                                role="switch"
                                aria-checked={enabled}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setNotifications((prev) => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
                                }}
                                className="relative shrink-0 cursor-pointer"
                              >
                                <motion.div
                                  animate={{
                                    backgroundColor: enabled ? "hsl(262 83% 58%)" : "hsl(0 0 0% / 0.3)",
                                  }}
                                  transition={springFast}
                                  className="size-9 rounded-full flex items-center justify-center"
                                >
                                  <motion.div
                                    animate={{ x: enabled ? 0 : -16 }}
                                    transition={springFast}
                                    className="absolute size-4 rounded-full bg-white shadow-sm"
                                  />
                                </motion.div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </motion.div>

                      <motion.div
                        variants={fadeUp}
                        custom={3}
                        initial="hidden"
                        animate="visible"
                        className="flex justify-between pt-2"
                      >
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.96 }}
                          onClick={goBack}
                          className="inline-flex h-11 items-center gap-2 border border-white/[0.1] rounded-full px-5 text-xs font-semibold text-white/50 hover:text-white hover:border-white/[0.2] transition-all"
                        >
                          <ArrowLeft className="size-3.5" /> Back
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.96 }}
                          onClick={handleComplete}
                          disabled={isLoading}
                          className="inline-flex h-11 items-center gap-2 bg-white text-black rounded-full px-6 text-xs font-semibold tracking-widest hover:bg-white/90 transition-all disabled:opacity-50"
                        >
                          {isLoading ? (
                            <><Loader2 className="size-4 animate-spin" /> Setting up...</>
                          ) : (
                            <><Check className="size-4" /> Complete Setup</>
                          )}
                        </motion.button>
                      </motion.div>
                    </div>
                  )}

                  {/* Step 4: Welcome */}
                  {step === 4 && (
                    <div className="text-center space-y-6 py-4">
                      <motion.div variants={fadeUp} custom={0} initial="hidden" animate="visible">
                        <div className="inline-flex items-center justify-center size-16 rounded-2xl bg-gradient-to-br from-[#8b5cf6]/30 to-[#06b6d4]/10 ring-1 ring-white/10 mb-4">
                          <Sparkles className="size-8 text-[#8b5cf6]" />
                        </div>
                        <h2 className="text-2xl font-bold tracking-tight text-white">
                          Welcome{name ? `, ${name}` : ""}!
                        </h2>
                        <p className="text-sm text-white/40 mt-1">
                          Your profile is ready. Let&apos;s find your perfect pair.
                        </p>
                      </motion.div>

                      <motion.div
                        variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-3 gap-3"
                      >
                        {welcomeHighlights.map(({ icon: Icon, label, desc }, i) => (
                          <motion.div
                            key={label}
                            variants={fadeUp}
                            custom={i + 1}
                            className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] text-center"
                          >
                            <Icon className="size-5 text-[#8b5cf6] mx-auto" />
                            <p className="text-xs font-semibold text-white mt-2">{label}</p>
                            <p className="text-[10px] text-white/25 mt-0.5">{desc}</p>
                          </motion.div>
                        ))}
                      </motion.div>

                      <motion.div variants={fadeUp} custom={4} initial="hidden" animate="visible">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.96 }}
                          onClick={() => router.push("/shop")}
                          className="inline-flex h-12 items-center gap-2.5 bg-white text-black rounded-full px-8 text-xs font-semibold uppercase tracking-widest transition-all hover:bg-white/90"
                        >
                          Start Shopping <ChevronRight className="size-4" />
                        </motion.button>
                      </motion.div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}