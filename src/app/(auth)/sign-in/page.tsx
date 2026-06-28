"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { Eye, EyeOff, AlertCircle, ArrowRight, Shield, Zap, Truck, Star } from "lucide-react";

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

const pageVariants = {
  hidden: { opacity: 0, scale: 0.98, filter: "blur(6px)" },
  visible: {
    opacity: 1, scale: 1, filter: "blur(0px)",
    transition: { duration: 0.8, ease: [0.32, 0.72, 0, 1] as const },
  },
  exit: {
    opacity: 0, scale: 0.98, filter: "blur(6px)",
    transition: { duration: 0.5, ease: [0.32, 0.72, 0, 1] as const },
  },
};

const perkList = [
  { icon: Zap, label: "Curated Collections", desc: "Drops curated from the world's most sought-after sneaker brands" },
  { icon: Shield, label: "Authenticity Guaranteed", desc: "Every pair independently verified before it reaches your doorstep" },
  { icon: Truck, label: "Free Shipping", desc: "On all orders over $150. Express delivery available at checkout" },
  { icon: Star, label: "Loyalty Program", desc: "Earn points on every purchase and unlock members-only access" },
];

function EyebrowTag({ text }: { text: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.04] px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-white/30 ring-1 ring-white/[0.06]">
      <span className="size-1 rounded-full bg-violet-400/60" />
      {text}
    </span>
  );
}

/* ─────────────── Floating Particles ─────────────── */
function Particles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    let animId: number;
    const particles: { x: number; y: number; size: number; speedX: number; speedY: number; opacity: number }[] = [];

    function resize() {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * canvas!.width,
        y: Math.random() * canvas!.height,
        size: Math.random() * 2 + 0.5,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.5 + 0.1,
      });
    }

    function animate() {
      context!.clearRect(0, 0, canvas!.width, canvas!.height);
      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        if (p.x < 0) p.x = canvas!.width;
        if (p.x > canvas!.width) p.x = 0;
        if (p.y < 0) p.y = canvas!.height;
        if (p.y > canvas!.height) p.y = 0;
        context!.beginPath();
        context!.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        context!.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
        context!.fill();
      });
      animId = requestAnimationFrame(animate);
    }
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-[5]" />;
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
        <EyebrowTag text="Welcome Back" />
      </motion.div>

      <motion.h1 variants={fadeUp} className="mt-8 text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-[0.92]">
        <span className="text-white/90">Your</span>
        <br />
        <span className="bg-gradient-to-r from-violet-300 via-indigo-300 to-violet-200 bg-clip-text text-transparent">
          Sneaker Archive
        </span>
        <br />
        <span className="text-white/90">Awaits</span>
      </motion.h1>

      <motion.p variants={fadeUp} className="mt-6 text-sm sm:text-base text-white/30 leading-relaxed max-w-md font-light">
        Sign in to manage your orders, save your favorites, and stay informed on every release that matters to you.
      </motion.p>

      <motion.div variants={fadeUp} className="mt-10 flex flex-wrap gap-x-10 gap-y-4">
        {[
          { value: "10K+", label: "Products" },
          { value: "50K+", label: "Happy Customers" },
          { value: "200+", label: "Brands" },
        ].map((s) => (
          <div key={s.label}>
            <div className="text-xl sm:text-2xl font-bold text-white/80 tracking-tight">{s.value}</div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-white/20 mt-0.5">{s.label}</div>
          </div>
        ))}
      </motion.div>

      <motion.div variants={fadeUp} className="mt-12 space-y-5">
        {perkList.map((item) => {
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

      <motion.div variants={fadeUp} className="mt-12 pt-8 border-t border-white/[0.06]">
        <div className="flex gap-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <svg key={i} className="h-3.5 w-3.5 text-amber-400/60" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
        <p className="text-sm text-white/30 italic leading-relaxed max-w-xs">
          &ldquo;The verification process gives me total peace of mind. I wouldn&rsquo;t shop anywhere else.&rdquo;
        </p>
        <div className="mt-3 flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-violet-500/30 to-indigo-500/30 ring-1 ring-white/[0.08] flex items-center justify-center text-[10px] font-bold text-white/60">
            JM
          </div>
          <div>
            <div className="text-xs font-medium text-white/60">Jake M.</div>
            <div className="text-[10px] text-white/20">Verified Buyer</div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─────────────── Form Side ─────────────── */
function FormSide() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  function validate(): boolean {
    const newErrors: Record<string, string> = {};
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = "Enter a valid email address";
    if (!password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    const { error: err } = await authClient.signIn.email(
      { email, password, callbackURL: "/" },
      {
        onSuccess: () => {
          document.cookie = "sneakora_recently_viewed=; path=/; max-age=0";
          toast.success("Welcome back");
        },
        onError: (ctx) => {
          const msg = ctx.error.message ?? "Something went wrong";
          toast.error("Sign in failed", { description: msg });
          if (msg.toLowerCase().includes("email")) setErrors((p) => ({ ...p, email: msg }));
          else setErrors((p) => ({ ...p, password: msg }));
        },
      }
    );
    if (err) setErrors((p) => ({ ...p, password: err.message ?? "Something went wrong" }));
    setLoading(false);
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={stagger}
      className="flex flex-col justify-center h-full px-6 sm:px-10 lg:px-12 xl:px-16 py-16 lg:py-0"
    >
      <motion.div variants={fadeUp}>
        <EyebrowTag text="Sign In" />
      </motion.div>

      <motion.h2 variants={fadeUp} className="mt-6 text-2xl sm:text-3xl font-bold tracking-tight text-white leading-[1.1]">
        Access your account
      </motion.h2>
      <motion.p variants={fadeUp} className="mt-2 text-sm text-white/30">
        Welcome back to Sneakora.
      </motion.p>

      {/* Form */}
      <motion.form variants={fadeUp} onSubmit={handleSubmit} className="mt-8 space-y-5">
        {/* Email */}
        <div className="group relative">
          <label className="block text-[10px] uppercase tracking-[0.2em] font-medium text-white/20 mb-2.5">Email</label>
          <div className="relative">
            <input
              type="email" placeholder="you@example.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors((p) => ({ ...p, email: "" })); }}
              onBlur={() => {
                if (!email.trim()) setErrors((p) => ({ ...p, email: "Email is required" }));
                else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) setErrors((p) => ({ ...p, email: "Enter a valid email address" }));
              }}
              className={`w-full h-12 px-5 text-sm bg-white/[0.02] border-b outline-none transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] text-white/80 placeholder-white/15 ${
                errors.email ? "border-red-400/40" : "border-white/[0.08] focus:border-violet-400/40"
              }`}
            />
            <motion.div
              initial={false}
              animate={{ scaleX: email ? 1 : 0, opacity: email ? 1 : 0 }}
              transition={{ ease: [0.32, 0.72, 0, 1], duration: 0.4 }}
              className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-violet-500 to-indigo-500 origin-left"
            />
          </div>
          <AnimatePresence mode="wait">
            {errors.email && (
              <motion.p key="e-err" initial={{ opacity: 0, y: -4, height: 0 }} animate={{ opacity: 1, y: 0, height: "auto" }} exit={{ opacity: 0, y: -4, height: 0 }} transition={{ duration: 0.2 }} className="flex items-center gap-1.5 mt-1.5 text-xs text-red-400">
                <AlertCircle className="size-3.5 shrink-0" />{errors.email}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Password */}
        <div className="group relative">
          <label className="block text-[10px] uppercase tracking-[0.2em] font-medium text-white/20 mb-2.5">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"} placeholder="Enter your password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); if (errors.password) setErrors((p) => ({ ...p, password: "" })); }}
              className={`w-full h-12 px-5 pr-12 text-sm bg-white/[0.02] border-b outline-none transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] text-white/80 placeholder-white/15 ${
                errors.password ? "border-red-400/40" : "border-white/[0.08] focus:border-violet-400/40"
              }`}
            />
            <motion.div
              initial={false}
              animate={{ scaleX: password ? 1 : 0, opacity: password ? 1 : 0 }}
              transition={{ ease: [0.32, 0.72, 0, 1], duration: 0.4 }}
              className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-violet-500 to-indigo-500 origin-left"
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors duration-500">
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          <AnimatePresence mode="wait">
            {errors.password && (
              <motion.p key="p-err" initial={{ opacity: 0, y: -4, height: 0 }} animate={{ opacity: 1, y: 0, height: "auto" }} exit={{ opacity: 0, y: -4, height: 0 }} transition={{ duration: 0.2 }} className="flex items-center gap-1.5 mt-1.5 text-xs text-red-400">
                <AlertCircle className="size-3.5 shrink-0" />{errors.password}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Submit */}
        <motion.button
          type="submit" disabled={loading}
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          className="group relative w-full h-12 rounded-full bg-white text-black text-xs font-semibold uppercase tracking-widest transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:opacity-90 active:scale-[0.97] disabled:opacity-40 overflow-hidden"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-[cubic-bezier(0.32,0.72,0,1)]" />
          <span className="relative z-10 flex items-center justify-center gap-2.5">
            <ArrowRight className="size-3.5" />
            Sign in
          </span>
        </motion.button>
      </motion.form>

      {/* Divider */}
      <motion.div variants={fadeUp} className="mt-8 relative">
        <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/[0.06]" /></div>
        <div className="relative flex justify-center text-[10px] uppercase tracking-widest"><span className="bg-[#050505] px-3 text-white/20">Or continue with</span></div>
      </motion.div>

      {/* Social */}
      <motion.div variants={fadeUp} className="mt-6 space-y-3">
        <button type="button" onClick={() => authClient.signIn.social({ provider: "google", callbackURL: "/" })}
          className="group w-full h-11 flex items-center justify-center gap-3 text-sm rounded-full bg-white/[0.03] ring-1 ring-white/[0.08] text-white/60 hover:text-white hover:bg-white/[0.06] hover:ring-white/[0.15] transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98]"
        >
          <svg className="size-4 shrink-0" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
          Google
        </button>
        <button type="button" onClick={() => authClient.signIn.social({ provider: "github", callbackURL: "/" })}
          className="group w-full h-11 flex items-center justify-center gap-3 text-sm rounded-full bg-white/[0.03] ring-1 ring-white/[0.08] text-white/60 hover:text-white hover:bg-white/[0.06] hover:ring-white/[0.15] transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98]"
        >
          <svg className="size-4 shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" /></svg>
          GitHub
        </button>
      </motion.div>

      {/* Footer */}
      <motion.p variants={fadeUp} className="mt-8 text-center text-xs text-white/25">
        Don&apos;t have an account?{" "}
        <Link href="/sign-up" className="ml-1 font-medium text-white/60 hover:text-white transition-colors duration-500">Sign up</Link>
      </motion.p>

      <motion.div variants={fadeUp} className="mt-6 flex items-center justify-center gap-3">
        <span className="h-px w-6 bg-white/[0.06]" />
        <span className="text-[9px] uppercase tracking-[0.2em] text-white/[0.1] font-medium">
          Powered by Better Auth
        </span>
        <span className="h-px w-6 bg-white/[0.06]" />
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════ PAGE ═══════════════ */
export default function SignInPage() {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="signin-page"
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
              className="absolute top-[40%] left-[50%] w-[350px] h-[350px] rounded-full bg-fuchsia-500/4 blur-[120px]" />
          </div>

          {/* Floating Particles */}
          <Particles />

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

            {/* ── Form (right) — glass panel ── */}
            <div className="lg:w-1/2 lg:min-h-[100dvh] flex items-center justify-center relative">
              <div className="absolute inset-0 bg-gradient-to-l from-violet-500/3 to-transparent pointer-events-none" />
              <div className="w-full max-w-lg mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative rounded-[2rem] bg-white/[0.02] backdrop-blur-2xl ring-1 ring-white/[0.06] shadow-[0_8px_32px_rgba(0,0,0,0.4)] p-6 sm:p-10">
                  <div className="absolute -inset-[1px] rounded-[2rem] bg-gradient-to-b from-white/[0.08] to-transparent pointer-events-none -z-10" />
                  <FormSide />
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
