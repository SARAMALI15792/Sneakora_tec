"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { Eye, EyeOff, Check, X, AlertCircle, Loader2 } from "lucide-react";

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

export default function SignUpPage() {
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
      { name: form.name, email: form.email, password: form.password, callbackURL: "/" },
      {
        onSuccess: () => {
          toast.success("Account created", {
            description: "Welcome to Sneakora — start exploring premium sneakers.",
          });
          setTimeout(() => router.push("/"), 600);
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

  function InputField({ field, type, label, placeholder }: { field: string; type: string; label: string; placeholder: string }) {
    const value = form[field as keyof typeof form];
    const error = errors[field];
    const isTouched = touched[field];
    const hasError = isTouched && error;

    return (
      <div>
        <label className="block text-[10px] uppercase tracking-[0.2em] font-semibold text-muted-foreground mb-1.5">
          {label}
        </label>
        <div className="relative">
          {field === "password" ? (
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder={placeholder}
                value={value}
                onChange={(e) => handleChange(field, e.target.value)}
                onBlur={() => handleBlur(field)}
                className={`w-full h-11 px-4 text-sm bg-transparent border outline-none transition-all duration-200 ${
                  hasError
                    ? "border-destructive text-destructive focus:border-destructive"
                    : isTouched && !error
                    ? "border-green-500/50 focus:border-green-500"
                    : "border-border focus:border-foreground"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          ) : (
            <input
              type={type}
              placeholder={placeholder}
              value={value}
              onChange={(e) => handleChange(field, e.target.value)}
              onBlur={() => handleBlur(field)}
              className={`w-full h-11 px-4 text-sm bg-transparent border outline-none transition-all duration-200 ${
                hasError
                  ? "border-destructive text-destructive focus:border-destructive"
                  : isTouched && !error
                  ? "border-green-500/50 focus:border-green-500"
                  : "border-border focus:border-foreground"
              }`}
            />
          )}
        </div>
        <AnimatePresence mode="wait">
          {hasError && (
            <motion.p
              initial={{ opacity: 0, y: -4, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -4, height: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-1 mt-1.5 text-xs text-destructive"
            >
              <AlertCircle className="size-3 shrink-0" />
              {error}
            </motion.p>
          )}
          {isTouched && !error && value && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-1 mt-1.5 text-xs text-green-500"
            >
              <Check className="size-3" />
              Looks good
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100dvh-4rem)] items-center justify-center px-6 py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <motion.p
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground"
          >
            Join Sneakora
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="font-heading mt-2 text-3xl font-bold tracking-tight"
          >
            Create an account
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-1.5 text-sm text-muted-foreground"
          >
            Discover premium sneakers tailored for you.
          </motion.p>
        </div>

        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <InputField field="name" type="text" label="Full Name" placeholder="John Doe" />
          <InputField field="email" type="email" label="Email" placeholder="you@example.com" />
          <InputField field="password" type="password" label="Password" placeholder="Create a strong password" />

          {/* Password strength meter */}
          {form.password && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="space-y-2"
            >
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1 rounded-full bg-border overflow-hidden">
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
                        <Check className="size-3 text-green-500" />
                      ) : (
                        <X className="size-3 text-muted-foreground/50" />
                      )}
                      <span className={`text-[11px] ${passed ? "text-green-500" : "text-muted-foreground/60"}`}>
                        {rule.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-foreground text-xs font-semibold uppercase tracking-widest text-background hover:opacity-90 transition-all duration-300 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Creating account...
              </>
            ) : (
              "Create account"
            )}
          </motion.button>
        </motion.form>

        {/* Divider */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="relative my-6"
        >
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
          </div>
        </motion.div>

        {/* OAuth */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-3"
        >
          <button
            type="button"
            onClick={() => authClient.signIn.social({ provider: "google", callbackURL: "/" })}
            className="w-full h-11 flex items-center justify-center gap-3 text-sm border border-border hover:bg-muted transition-all duration-200 active:scale-[0.98]"
          >
            <svg className="size-4 shrink-0" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Google
          </button>
          <button
            type="button"
            onClick={() => authClient.signIn.social({ provider: "github", callbackURL: "/" })}
            className="w-full h-11 flex items-center justify-center gap-3 text-sm border border-border hover:bg-muted transition-all duration-200 active:scale-[0.98]"
          >
            <svg className="size-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
            GitHub
          </button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
          className="mt-6 text-center text-xs text-muted-foreground"
        >
          Already have an account?{" "}
          <Link href="/sign-in" className="font-medium text-foreground underline underline-offset-4 hover:text-accent transition-colors">
            Sign in
          </Link>
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-center text-[10px] uppercase tracking-widest text-muted-foreground/50"
        >
          Secured by BetterAuth
        </motion.p>
      </motion.div>
    </div>
  );
}
