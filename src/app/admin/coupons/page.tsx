"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Plus, Trash2, Edit, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Coupon {
  id: string;
  code: string;
  discount: number;
  type: string;
  maxUses: number | null;
  usedCount: number;
  expiresAt: string | null;
  createdAt: string;
}

export default function AdminCouponsPage() {
  const router = useRouter();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/coupons")
      .then((r) => r.json())
      .then((data) => { setCoupons(data.coupons); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  async function handleDelete(id: string, code: string) {
    if (!confirm(`Delete coupon "${code}"?`)) return;
    try {
      const res = await fetch(`/api/admin/coupons/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setCoupons((prev) => prev.filter((c) => c.id !== id));
      toast.success("Coupon deleted");
    } catch {
      toast.error("Failed to delete coupon");
    }
  }

  function isExpired(coupon: Coupon): boolean {
    if (!coupon.expiresAt) return false;
    return new Date(coupon.expiresAt) < new Date();
  }

  function isExhausted(coupon: Coupon): boolean {
    if (!coupon.maxUses) return false;
    return coupon.usedCount >= coupon.maxUses;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };

  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring" as const, damping: 20, stiffness: 100 } },
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Coupons</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage discount coupons and promo codes.</p>
        </div>
        <Link href="/admin/coupons/new"
          className="inline-flex items-center gap-2 h-10 px-4 rounded-lg bg-foreground text-background text-xs font-semibold uppercase tracking-widest hover:opacity-90 transition-all active:scale-[0.98]">
          <Plus className="size-4" /> New Coupon
        </Link>
      </motion.div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="size-8 rounded-full border-2 border-foreground/20 border-t-foreground animate-spin" />
        </div>
      ) : coupons.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground">No coupons yet.</p>
          <Link href="/admin/coupons/new"
            className="inline-flex items-center gap-2 mt-4 text-sm text-foreground underline underline-offset-4">
            Create your first coupon
          </Link>
        </div>
      ) : (
        <motion.div variants={itemVariants} className="rounded-xl border border-border/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50 bg-muted/30">
                  <th className="text-left px-4 py-3 text-xs uppercase tracking-widest text-muted-foreground font-medium">Code</th>
                  <th className="text-left px-4 py-3 text-xs uppercase tracking-widest text-muted-foreground font-medium">Discount</th>
                  <th className="text-center px-4 py-3 text-xs uppercase tracking-widest text-muted-foreground font-medium">Usage</th>
                  <th className="text-center px-4 py-3 text-xs uppercase tracking-widest text-muted-foreground font-medium">Status</th>
                  <th className="text-right px-4 py-3 text-xs uppercase tracking-widest text-muted-foreground font-medium">Expires</th>
                  <th className="text-right px-4 py-3 text-xs uppercase tracking-widest text-muted-foreground font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((coupon, i) => {
                  const expired = isExpired(coupon);
                  const exhausted = isExhausted(coupon);
                  const active = !expired && !exhausted;
                  return (
                    <motion.tr
                      key={coupon.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="border-b border-border/30 hover:bg-muted/20 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <code className="text-sm font-mono font-semibold bg-muted/50 px-2 py-0.5 rounded">{coupon.code}</code>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-medium">
                          {coupon.type === "percentage" ? `${coupon.discount}%` : `$${coupon.discount.toFixed(2)}`}
                        </span>
                        <span className="text-xs text-muted-foreground ml-1 capitalize">({coupon.type})</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-xs">
                          {coupon.usedCount}{coupon.maxUses ? ` / ${coupon.maxUses}` : ""}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-semibold ${
                          active ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                        }`}>
                          {active ? "Active" : expired ? "Expired" : "Exhausted"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-xs text-muted-foreground">
                        {coupon.expiresAt ? new Date(coupon.expiresAt).toLocaleDateString() : "—"}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger>
                            <button className="size-8 rounded-lg hover:bg-muted transition-colors flex items-center justify-center">
                              <MoreHorizontal className="size-4" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-32">
                            <DropdownMenuItem onClick={() => router.push(`/admin/coupons/${coupon.id}`)}>
                              <Edit className="size-3.5" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(coupon.id, coupon.code)}>
                              <Trash2 className="size-3.5" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}