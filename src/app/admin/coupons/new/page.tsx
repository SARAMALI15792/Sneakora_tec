"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

export default function NewCouponPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    code: "",
    discount: "",
    type: "percentage",
    maxUses: "",
    expiresAt: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/admin/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: form.code,
          discount: parseFloat(form.discount),
          type: form.type,
          maxUses: form.maxUses ? parseInt(form.maxUses) : undefined,
          expiresAt: form.expiresAt || undefined,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create coupon");
      }

      toast.success("Coupon created");
      router.push("/admin/coupons");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create coupon");
    } finally {
      setLoading(false);
    }
  }

  const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring" as const, damping: 20, stiffness: 100 } },
  };

  return (
    <motion.div
      initial="hidden" animate="visible"
      variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.06 } } }}
      className="max-w-lg"
    >
      <motion.div variants={itemVariants} className="mb-6">
        <Link href="/admin/coupons"
          className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors mb-4">
          <ArrowLeft className="size-3" /> Back to coupons
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">New Coupon</h1>
        <p className="text-sm text-muted-foreground mt-1">Create a discount coupon for customers.</p>
      </motion.div>

      <motion.form variants={itemVariants} onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1.5">
          <label className="text-xs uppercase tracking-widest font-medium text-muted-foreground">Code *</label>
          <input required value={form.code}
            onChange={(e) => setForm((p) => ({ ...p, code: e.target.value.toUpperCase() }))}
            placeholder="SUMMER20"
            className="w-full h-10 px-3 text-sm bg-transparent border border-border rounded-lg outline-none focus:border-foreground transition-colors uppercase tracking-wider" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs uppercase tracking-widest font-medium text-muted-foreground">Discount *</label>
            <div className="relative">
              <input required type="number" step="0.01" min="0" value={form.discount}
                onChange={(e) => setForm((p) => ({ ...p, discount: e.target.value }))}
                className="w-full h-10 px-3 text-sm bg-transparent border border-border rounded-lg outline-none focus:border-foreground transition-colors" />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs uppercase tracking-widest font-medium text-muted-foreground">Type *</label>
            <select value={form.type} onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}
              className="w-full h-10 px-3 text-sm bg-transparent border border-border rounded-lg outline-none focus:border-foreground transition-colors">
              <option value="percentage">Percentage (%)</option>
              <option value="flat">Flat ($)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs uppercase tracking-widest font-medium text-muted-foreground">Max Uses</label>
            <input type="number" min="1" value={form.maxUses}
              onChange={(e) => setForm((p) => ({ ...p, maxUses: e.target.value }))}
              placeholder="Unlimited"
              className="w-full h-10 px-3 text-sm bg-transparent border border-border rounded-lg outline-none focus:border-foreground transition-colors" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs uppercase tracking-widest font-medium text-muted-foreground">Expires At</label>
            <input type="date" value={form.expiresAt}
              onChange={(e) => setForm((p) => ({ ...p, expiresAt: e.target.value }))}
              className="w-full h-10 px-3 text-sm bg-transparent border border-border rounded-lg outline-none focus:border-foreground transition-colors" />
          </div>
        </div>

        <div className="flex items-center gap-3 pt-4">
          <button type="submit" disabled={loading}
            className="h-10 px-6 rounded-lg bg-foreground text-background text-xs font-semibold uppercase tracking-widest hover:opacity-90 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center gap-2">
            {loading ? <><Loader2 className="size-4 animate-spin" /> Creating...</> : "Create Coupon"}
          </button>
          <Link href="/admin/coupons"
            className="h-10 px-6 rounded-lg border border-border text-xs font-semibold uppercase tracking-widest hover:bg-muted transition-all flex items-center">
            Cancel
          </Link>
        </div>
      </motion.form>
    </motion.div>
  );
}