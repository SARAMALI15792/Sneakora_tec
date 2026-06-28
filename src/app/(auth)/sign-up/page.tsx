"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import {
  Eye, EyeOff, AlertCircle, ArrowLeft, Check, X, Sparkles,
  Gift, Award, Users, TrendingUp,
} from "lucide-react";
import { SpinnerOverlay } from "@/components/shared/SpinnerOverlay";

const passwordRules = [
  { label: "At least 8 characters", test: (v: string) => v.length >= 8 },
  { label: "Contains uppercase letter", test: (v: string) => /[A-Z]/.test(v) },
  { label: "Contains lowercase letter", test: (v: string) => /[a-z]/.test(v) },
  { label: "Contains a number", test: (v: string) => /\d/.test(v) },
];

function getStrength(password: string): { label: string; color: string; width: string } {
  const score = passwordRules.filter((r) => r.test(password)).length;
  if (!password) return { label: "", color: "", width: "0%" };
  if (score <= 1) return { label: "Weak", color: "bg-red-500", width: "25%" };
  if (score === 2) return { label: "Fair", color: "bg-orange-500", width: "50%" };
  if (score === 3) return { label: "Good", color: "bg-yellow-500", width: "75%" };
  return { label: "Strong", color: "bg-green-500", width: "100%" };
}

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 18, filter: "blur(4px)" },
  visible: {
    opacity: 1, y: 0, filter: "blur(0px)",
    transition: { duration: 0.7, ease: [0.32, 0.72, 0, 1] as const },
  },
};

const membershipPerks = [
  { icon: Gift, label: "Early Access", desc: "First in line for limited releases and exclusive collaborations" },
  { icon: Award, label: "Reward Points", desc: "Earn with every purchase. Redeem on future orders and exclusive gear" },
  { icon: Users, label: "Collector Network", desc: "Join a global community of sneaker enthusiasts and serious collectors" },
  { icon: TrendingUp, label: "Smart Alerts", desc: "Get notified the moment prices drop on your most-wanted pairs" },
];

function EyebrowTag({ text }: { text: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.04] px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-white/30 ring-1 ring-white/[0.06]">
      <span className="size-1 rounded-full bg-violet-400/60" />
      {text}
    </span>
  );
}

/* ─────────────── DoubleBezel ─────────────── */
function DoubleBezel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`p-[1.5px] rounded-[1.75rem] sm:rounded-[2rem] bg-gradient-to-b from-white/[0.08] to-white/[0.02] ${className}`}>
      <div className="rounded-[calc(1.75rem-1.5px)] sm:rounded-[calc(2rem-1.5px)] bg-[#0a0a0a] shadow-[inset_0_1px_1px_rgba(255,255,255,0.06)] p-6 sm:p-10">
        {children}
      </div>
    </div>
  );
}

/* ─────────────── Brand Side ─────────────── */
function BrandSide() {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={stagger}
      className="flex flex-col justify-center h-full px-6 sm:px-10 lg:px-16 xl:px-20 py-16 lg:py-0"
    >
      <motion.div variants={fadeUp}>
        <EyebrowTag text="Join the Community" />
      </motion.div>

      <motion.h1 variants={fadeUp} className="mt-8 text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-[0.92]">
        <span className="text-white/90">Beyond</span>
        <br />
        <span className="bg-gradient-to-r from-violet-300 via-indigo-300 to-violet-200 bg-clip-text text-transparent">
          The Hype
        </span>
        <br />
        <span className="text-white/90">Join Now</span>
      </motion.h1>

      <motion.p variants={fadeUp} className="mt-6 text-sm sm:text-base text-white/30 leading-relaxed max-w-md font-light">
        Create your account to access exclusive releases, connect with serious collectors, and stay ahead of every drop.
      </motion.p>

      {/* Stats */}
      <motion.div variants={fadeUp} className="mt-10 flex flex-wrap gap-x-10 gap-y-4">
        {[
          { value: "10K+", label: "Products" },
          { value: "200+", label: "Brands" },
          { value: "98%", label: "Satisfaction" },
        ].map((s) => (
          <div key={s.label}>
            <div className="text-xl sm:text-2xl font-bold text-white/80 tracking-tight">{s.value}</div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-white/20 mt-0.5">{s.label}</div>
          </div>
        ))}
      </motion.div>

      {/* Membership Perks */}
      <motion.div variants={fadeUp} className="mt-12 space-y-5">
        {membershipPerks.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="group flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.04] ring-1 ring-white/[0.06] group-hover:ring-violet-500/30 group-hover:bg-violet-500/10 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]">
                <Icon className="h-4 w-4 text-white/40 group-hover:text-violet-400 transition-colors duration-500" />
              </div>
              <div>
                <div className="text-sm font-medium text-white/70">{item.label}</div>
                <div className="text-xs text-white/25 mt-0.5">{item.desc}</div>
              </div>
            </div>
          );
        })}
      </motion.div>

      {/* Testimonial */}
      <motion.div variants={fadeUp} className="mt-12 pt-8 border-t border-white/[0.06]">
        <div className="flex gap-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <svg key={i} className="h-3.5 w-3.5 text-amber-400/60" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
        <p className="text-sm text-white/30 italic leading-relaxed max-w-xs">
          &ldquo;The early access alone makes it worth it. I&rsquo;ve secured three limited releases I would&rsquo;ve missed otherwise.&rdquo;
        </p>
        <div className="mt-3 flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald-500/30 to-cyan-500/30 ring-1 ring-white/[0.08] flex items-center justify-center text-[10px] font-bold text-white/60">
            SR
          </div>
          <div>
            <div className="text-xs font-medium text-white/60">Sarah R.</div>
            <div className="text-[10px] text-white/20">Member since 2024</div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─────────────── Form Side ─────────────── */
function FormSide() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const strength = useMemo(() => getStrength(form.password), [form.password]);

  function validate(field: string, value: string): string {
    switch (field) {
      case "name":
        if (!value.trim()) return "Name is required";
        if (value.trim().length < 2) return "Name must be at least 2 characters";
        return "";
      case "email":
        if (!value.trim()) return "Email is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Enter a valid email address";
        return "";
      case "password":
        if (!value) return "Password is required";
        const failed = passwordRules.filter((r) => !r.test(value));
        if (failed.length > 0) return `Password needs: ${failed.map((r) => r.label.toLowerCase()).join(", ")}`;
        return "";
      default:
        return "";
    }
  }

  function handleChange(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (touched[field]) setErrors((prev) => ({ ...prev, [field]: validate(field, value) }));
  }

  function handleBlur(field: string) {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors((prev) => ({ ...prev, [field]: validate(field, form[field as keyof typeof form]) }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    Object.keys(form).forEach((key) => { newErrors[key] = validate(key, form[key as keyof typeof form]); });
    setErrors(newErrors);
    setTouched({ name: true, email: true, password: true });
    if (Object.values(newErrors).some(Boolean)) return;

    setLoading(true);
    await authClient.signUp.email(
      { name: form.name, email: form.email, password: form.password },
      {
        onRequest: () => setLoading(true),
        onSuccess: () => {
          document.cookie = "sneakora_recently_viewed=; path=/; max-age=0";
          toast.success("Account created", { description: "Setting up your profile..." });
          router.push("/onboarding");
        },
        onError: (ctx) => {
          const msg = ctx.error.message ?? "Something went wrong";
          toast.error("Sign up failed", { description: msg });
          if (ctx.error.code === "USER_ALREADY_EXISTS") setErrors((p) => ({ ...p, email: "An account with this email already exists" }));
        },
      }
    );
    setLoading(false);
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={stagger}
      className="flex flex-col justify-center h-full px-6 sm:px-10 lg:px-12 xl:px-16 py-16 lg:py-0"
    >
      {/* Header */}
      <motion.div variants={fadeUp}>
        <EyebrowTag text="Create Account" />
      </motion.div>

      <motion.h2 variants={fadeUp} className="mt-6 text-2xl sm:text-3xl font-bold tracking-tight text-white leading-[1.1]">
        Get started free
      </motion.h2>
      <motion.p variants={fadeUp} className="mt-2 text-sm text-white/30">
        Join thousands of sneaker enthusiasts.
      </motion.p>

      {/* Form */}
      <motion.form variants={fadeUp} onSubmit={handleSubmit} className="mt-8 space-y-5">
        {/* Name */}
        <div className="group relative">
          <label className="block text-[10px] uppercase tracking-[0.2em] font-medium text-white/20 mb-2.5">Full Name</label>
          <div className="relative">
            <input type="text" placeholder="John Doe" value={form.name}
              onChange={(e) => handleChange("name", e.target.value)} onBlur={() => handleBlur("name")} autoComplete="name"
              className={`w-full h-12 px-5 text-sm bg-white/[0.02] border-b outline-none transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] text-white/80 placeholder-white/15 ${
                touched.name && errors.name ? "border-red-400/40" : touched.name && !errors.name && form.name ? "border-green-500/40" : "border-white/[0.08] focus:border-violet-400/40"
              }`}
            />
            <motion.div initial={false} animate={{ scaleX: form.name ? 1 : 0, opacity: form.name ? 1 : 0 }}
              transition={{ ease: [0.32, 0.72, 0, 1], duration: 0.4 }}
              className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-violet-500 to-indigo-500 origin-left"
            />
          </div>
          <AnimatePresence mode="wait">
            {touched.name && errors.name && (
              <motion.p key="n-err" initial={{ opacity: 0, y: -4, height: 0 }} animate={{ opacity: 1, y: 0, height: "auto" }} exit={{ opacity: 0, y: -4, height: 0 }} transition={{ duration: 0.2 }} className="flex items-center gap-1.5 mt-1.5 text-xs text-red-400">
                <AlertCircle className="size-3.5 shrink-0" />{errors.name}
              </motion.p>
            )}
            {touched.name && !errors.name && form.name && (
              <motion.p key="n-ok" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-1.5 mt-1.5 text-xs text-green-400">
                <Check className="size-3.5" />Looks good
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Email */}
        <div className="group relative">
          <label className="block text-[10px] uppercase tracking-[0.2em] font-medium text-white/20 mb-2.5">Email</label>
          <div className="relative">
            <input type="email" placeholder="you@example.com" value={form.email}
              onChange={(e) => handleChange("email", e.target.value)} onBlur={() => handleBlur("email")} autoComplete="email"
              className={`w-full h-12 px-5 text-sm bg-white/[0.02] border-b outline-none transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] text-white/80 placeholder-white/15 ${
                touched.email && errors.email ? "border-red-400/40" : touched.email && !errors.email && form.email ? "border-green-500/40" : "border-white/[0.08] focus:border-violet-400/40"
              }`}
            />
            <motion.div initial={false} animate={{ scaleX: form.email ? 1 : 0, opacity: form.email ? 1 : 0 }}
              transition={{ ease: [0.32, 0.72, 0, 1], duration: 0.4 }}
              className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-violet-500 to-indigo-500 origin-left"
            />
          </div>
          <AnimatePresence mode="wait">
            {touched.email && errors.email && (
              <motion.p key="e-err" initial={{ opacity: 0, y: -4, height: 0 }} animate={{ opacity: 1, y: 0, height: "auto" }} exit={{ opacity: 0, y: -4, height: 0 }} transition={{ duration: 0.2 }} className="flex items-center gap-1.5 mt-1.5 text-xs text-red-400">
                <AlertCircle className="size-3.5 shrink-0" />{errors.email}
              </motion.p>
            )}
            {touched.email && !errors.email && form.email && (
              <motion.p key="e-ok" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-1.5 mt-1.5 text-xs text-green-400">
                <Check className="size-3.5" />Looks good
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Password */}
        <div className="group relative">
          <label className="block text-[10px] uppercase tracking-[0.2em] font-medium text-white/20 mb-2.5">Password</label>
          <div className="relative">
            <input type={showPassword ? "text" : "password"} placeholder="Create a strong password" value={form.password}
              onChange={(e) => handleChange("password", e.target.value)} onBlur={() => handleBlur("password")} autoComplete="new-password"
              className={`w-full h-12 px-5 pr-12 text-sm bg-white/[0.02] border-b outline-none transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] text-white/80 placeholder-white/15 ${
                touched.password && errors.password ? "border-red-400/40" : touched.password && !errors.password && form.password ? "border-green-500/40" : "border-white/[0.08] focus:border-violet-400/40"
              }`}
            />
            <motion.div initial={false} animate={{ scaleX: form.password ? 1 : 0, opacity: form.password ? 1 : 0 }}
              transition={{ ease: [0.32, 0.72, 0, 1], duration: 0.4 }}
              className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-violet-500 to-indigo-500 origin-left"
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors duration-500">
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          <AnimatePresence mode="wait">
            {touched.password && errors.password && (
              <motion.p key="p-err" initial={{ opacity: 0, y: -4, height: 0 }} animate={{ opacity: 1, y: 0, height: "auto" }} exit={{ opacity: 0, y: -4, height: 0 }} transition={{ duration: 0.2 }} className="flex items-center gap-1.5 mt-1.5 text-xs text-red-400">
                <AlertCircle className="size-3.5 shrink-0" />{errors.password}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Password Strength */}
        {form.password && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }} className="space-y-3 -mt-1">
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: strength.width }} transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }} className={`h-full rounded-full ${strength.color}`} />
              </div>
              {strength.label && <span className="text-[10px] uppercase tracking-widest font-semibold text-white/40">{strength.label}</span>}
            </div>
            <div className="space-y-1.5">
              {passwordRules.map((rule) => {
                const passed = rule.test(form.password);
                return (
                  <div key={rule.label} className="flex items-center gap-2">
                    <div className={`size-4 rounded-full flex items-center justify-center transition-all duration-500 ${passed ? "bg-green-500/20" : "bg-white/[0.04]"}`}>
                      {passed ? <Check className="size-2.5 text-green-400" /> : <X className="size-2.5 text-white/20" />}
                    </div>
                    <span className={`text-[11px] ${passed ? "text-green-400/80" : "text-white/25"}`}>{rule.label}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Submit */}
        <motion.button
          type="submit" disabled={loading}
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          className="group relative w-full h-12 rounded-full bg-white text-black text-xs font-semibold uppercase tracking-widest transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:opacity-90 active:scale-[0.97] disabled:opacity-40 overflow-hidden"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-[cubic-bezier(0.32,0.72,0,1)]" />
          <span className="relative z-10 flex items-center justify-center gap-2.5">
            <Sparkles className="size-3.5" />
            Create Account
          </span>
        </motion.button>
      </motion.form>

      {/* Footer */}
      <motion.p variants={fadeUp} className="mt-8 text-center text-xs text-white/25">
        Already have an account?{" "}
        <Link href="/sign-in" className="ml-1 font-medium text-white/60 hover:text-white transition-colors duration-500">Sign in</Link>
      </motion.p>
    </motion.div>
  );
}

/* ═══════════════ PAGE ═══════════════ */
const pageVariants = {
  hidden: { opacity: 0, x: 60, filter: "blur(8px)" },
  visible: {
    opacity: 1, x: 0, filter: "blur(0px)",
    transition: { duration: 0.8, ease: [0.32, 0.72, 0, 1] as const },
  },
  exit: {
    opacity: 0, x: -60, filter: "blur(8px)",
    transition: { duration: 0.5, ease: [0.32, 0.72, 0, 1] as const },
  },
};

export default function SignUpPage() {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="signup-page"
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={pageVariants}
      >
        <div className="min-h-[100dvh] bg-[#050505] text-white relative overflow-hidden">
          {/* Ambient Orbs */}
          <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden>
            <motion.div animate={{ x: [0, 30, 0], y: [0, -20, 0] }} transition={{ duration: 20, repeat: Infinity, ease: [0.32, 0.72, 0, 1] }}
              className="absolute top-[5%] -left-[8%] w-[700px] h-[700px] rounded-full bg-violet-500/10 blur-[180px]" />
            <motion.div animate={{ x: [0, -25, 0], y: [0, 25, 0] }} transition={{ duration: 22, repeat: Infinity, ease: [0.32, 0.72, 0, 1], delay: 4 }}
              className="absolute bottom-[10%] -right-[8%] w-[500px] h-[500px] rounded-full bg-cyan-400/6 blur-[150px]" />
            <motion.div animate={{ x: [0, 15, 0], y: [0, -15, 0] }} transition={{ duration: 18, repeat: Infinity, ease: [0.32, 0.72, 0, 1], delay: 2 }}
              className="absolute top-[40%] left-[50%] w-[350px] h-[350px] rounded-full bg-emerald-500/4 blur-[120px]" />
          </div>

          {/* Grain Overlay */}
          <div className="fixed inset-0 pointer-events-none z-[60] opacity-[0.025]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
              backgroundSize: "180px 180px",
            }}
          />

          {/* ══ Split Layout ══ */}
          <div className="relative z-10 min-h-[100dvh] flex flex-col lg:flex-row">
            {/* ── Brand Content (left) — hidden on mobile ── */}
            <div className="hidden lg:flex lg:w-1/2 lg:min-h-[100dvh] items-center overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-500/4 to-transparent pointer-events-none" />
              <BrandSide />
            </div>

            {/* ── Form (right) ── */}
            <div className="lg:w-1/2 lg:min-h-[100dvh] flex items-center bg-white/[0.01] relative">
              <div className="absolute inset-0 bg-gradient-to-l from-violet-500/3 to-transparent pointer-events-none" />
              <div className="w-full max-w-lg mx-auto">
                <DoubleBezel>
                  <FormSide />
                </DoubleBezel>
              </div>
            </div>
          </div>

          {/* Back link - floating */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="fixed top-8 left-8 z-20 hidden lg:block"
          >
            <Link href="/sign-in" className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-white/30 hover:text-white/60 transition-colors duration-500">
              <ArrowLeft className="size-3" />
              Back to sign in
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
