"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { Eye, EyeOff, Check, X, AlertCircle, Loader2, ArrowLeft } from "lucide-react";

const passwordRules = [
  { label: "At least 8 characters", test: (v: string) => v.length >= 8 },
  { label: "Contains uppercase letter", test: (v: string) => /[A-Z]/.test(v) },
  { label: "Contains lowercase letter", test: (v: string) => /[a-z]/.test(v) },
  { label: "Contains a number", test: (v: string) => /\d/.test(v) },
];

function getStrength(password: string): { label: string; color: string; width: string } {
  const score = passwordRules.filter((r) => r.test(password)).length;
  if (!password) return { label: "", color: "", width: "0%" };
  if (score <= 1) return { label: "Weak", color: "bg-destructive", width: "25%" };
  if (score === 2) return { label: "Fair", color: "bg-orange-500", width: "50%" };
  if (score === 3) return { label: "Good", color: "bg-yellow-500", width: "75%" };
  return { label: "Strong", color: "bg-green-500", width: "100%" };
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring" as const, damping: 15, stiffness: 100 },
  },
};

const buttonVariants = {
  hover: { scale: 1.02, transition: { type: "spring" as const, stiffness: 400, damping: 10 } },
  tap: { scale: 0.98, transition: { type: "spring" as const, stiffness: 500, damping: 20 } },
};

interface InputFieldProps {
  field: string;
  type: string;
  label: string;
  placeholder: string;
  value: string;
  error: string;
  isTouched: boolean;
  hasError: boolean;
  onChange: (value: string) => void;
  onBlur: () => void;
}

function InputField({ field, type, label, placeholder, value, error, isTouched, hasError, onChange, onBlur }: InputFieldProps) {
  const [pwdVisible, setPwdVisible] = useState(false);

  return (
    <motion.div variants={itemVariants} className="space-y-2">
      <label className="block text-[10px] uppercase tracking-[0.2em] font-semibold text-muted-foreground mb-1.5">
        {label}
      </label>
      <div className="relative">
        {field === "password" ? (
          <div className="relative">
            <input
              type={pwdVisible ? "text" : "password"}
              placeholder={placeholder}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onBlur={onBlur}
              autoComplete={field === "password" ? "new-password" : field === "email" ? "email" : "name"}
              className={`w-full h-12 px-4 pr-12 text-sm bg-background/50 border rounded-full outline-none transition-all duration-300 ${
                hasError
                  ? "border-destructive text-destructive"
                  : isTouched && !error
                  ? "border-green-500/50"
                  : "border-border/50 focus:border-accent/50"
              }`}
            />
            <button
              type="button"
              onClick={() => setPwdVisible(!pwdVisible)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {pwdVisible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        ) : (
          <input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            autoComplete={field === "email" ? "email" : field === "name" ? "name" : undefined}
            className={`w-full h-12 px-4 text-sm bg-background/50 border rounded-full outline-none transition-all duration-300 ${
              hasError
                ? "border-destructive text-destructive"
                : isTouched && !error
                ? "border-green-500/50"
                : "border-border/50 focus:border-accent/50"
            }`}
          />
        )}
      </div>
      <AnimatePresence mode="wait">
        {hasError && (
          <motion.p
            key={`${field}-error`}
            initial={{ opacity: 0, y: -4, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -4, height: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-1.5 mt-1.5 text-xs text-destructive"
          >
            <AlertCircle className="size-3.5 shrink-0" />
            {error}
          </motion.p>
        )}
        {isTouched && !error && value && (
          <motion.p
            key={`${field}-ok`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-1.5 mt-1.5 text-xs text-green-500"
          >
            <Check className="size-3.5" />
            Looks good
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function SignUpPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);

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
    if (touched[field]) {
      setErrors((prev) => ({ ...prev, [field]: validate(field, value) }));
    }
  }

  function handleBlur(field: string) {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors((prev) => ({ ...prev, [field]: validate(field, form[field as keyof typeof form]) }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    Object.keys(form).forEach((key) => {
      newErrors[key] = validate(key, form[key as keyof typeof form]);
    });
    setErrors(newErrors);
    setTouched({ name: true, email: true, password: true });

    if (Object.values(newErrors).some(Boolean)) return;

    setLoading(true);
    await authClient.signUp.email(
      { name: form.name, email: form.email, password: form.password },
      {
        onRequest: () => { setLoading(true); },
        onSuccess: () => {
          toast.success("Account created", {
            description: "Setting up your profile...",
          });
          router.push("/onboarding");
        },
        onError: (ctx) => {
          const msg = ctx.error.message ?? "Something went wrong";
          toast.error("Sign up failed", { description: msg });
          if (ctx.error.code === "USER_ALREADY_EXISTS") {
            setErrors((prev) => ({ ...prev, email: "An account with this email already exists" }));
          }
        },
      }
    );
    setLoading(false);
  }

  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-gradient-to-br from-background to-muted/20">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full max-w-md px-6 py-12"
      >
        <Link
          href="/sign-in"
          className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-3" />
          Back to sign in
        </Link>

        <motion.h1 variants={itemVariants} className="font-heading mt-8 text-4xl font-bold tracking-tight">
          Create Account
        </motion.h1>

        <motion.p variants={itemVariants} className="mt-2 text-sm text-muted-foreground">
          Join Sneakora and start your sneaker journey.
        </motion.p>

        <motion.form onSubmit={handleSubmit} className="mt-10 space-y-6">
          <InputField
            field="name"
            type="text"
            label="Full Name"
            placeholder="John Doe"
            value={form.name}
            error={errors.name}
            isTouched={touched.name}
            hasError={!!touched.name && !!errors.name}
            onChange={(v) => handleChange("name", v)}
            onBlur={() => handleBlur("name")}
          />
          <InputField
            field="email"
            type="email"
            label="Email"
            placeholder="you@example.com"
            value={form.email}
            error={errors.email}
            isTouched={touched.email}
            hasError={!!touched.email && !!errors.email}
            onChange={(v) => handleChange("email", v)}
            onBlur={() => handleBlur("email")}
          />
          <InputField
            field="password"
            type="password"
            label="Password"
            placeholder="Create a strong password"
            value={form.password}
            error={errors.password}
            isTouched={touched.password}
            hasError={!!touched.password && !!errors.password}
            onChange={(v) => handleChange("password", v)}
            onBlur={() => handleBlur("password")}
          />

          {form.password && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 rounded-full bg-border overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: strength.width }}
                    transition={{ duration: 0.3 }}
                    className={`h-full rounded-full ${strength.color}`}
                  />
                </div>
                <span className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground">
                  {strength.label}
                </span>
              </div>
              <div className="space-y-1">
                {passwordRules.map((rule) => {
                  const passed = rule.test(form.password);
                  return (
                    <div key={rule.label} className="flex items-center gap-1.5">
                      {passed ? (
                        <Check className="size-3.5 text-green-500" />
                      ) : (
                        <X className="size-3.5 text-muted-foreground/50" />
                      )}
                      <span className={`text-xs ${passed ? "text-green-500" : "text-muted-foreground/60"}`}>
                        {rule.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          <motion.div variants={itemVariants}>
            <motion.button
              whileHover="hover"
              whileTap="tap"
              variants={buttonVariants}
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-full flex items-center justify-center gap-2 bg-foreground text-background transition-all duration-300 hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </motion.button>
          </motion.div>
        </motion.form>

        <motion.div
          variants={itemVariants}
          className="mt-10 pt-6 border-t border-border/50 text-center text-sm text-muted-foreground"
        >
          Already have an account?{" "}
          <Link href="/sign-in" className="ml-1.5 font-medium text-foreground hover:underline">
            Sign in
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}