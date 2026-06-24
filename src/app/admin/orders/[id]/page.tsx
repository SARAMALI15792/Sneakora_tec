"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: { name: string; images: string[]; slug: string; price: number };
}

interface Order {
  id: string;
  status: string;
  total: number;
  cancelReason: string | null;
  cancelledAt: string | null;
  createdAt: string;
  user: { name: string; email: string; image: string | null };
  items: OrderItem[];
}

const statuses = ["pending", "confirmed", "shipped", "delivered", "cancelled"];
const statusColors: Record<string, string> = {
  pending: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  confirmed: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  shipped: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  delivered: "bg-green-500/10 text-green-500 border-green-500/20",
  cancelled: "bg-red-500/10 text-red-500 border-red-500/20",
};

export default function AdminOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/orders/${params.id}`)
      .then((r) => r.json())
      .then((data) => { setOrder(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [params.id]);

  async function updateStatus(status: string) {
    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/orders/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error();
      setOrder((prev) => prev ? { ...prev, status } : prev);
      toast.success(`Order ${status}`);
    } catch {
      toast.error("Failed to update status");
    } finally {
      setUpdating(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="size-8 rounded-full border-2 border-foreground/20 border-t-foreground animate-spin" />
      </div>
    );
  }

  if (!order) {
    return <div className="text-center py-16 text-muted-foreground">Order not found.</div>;
  }

  const nextStatuses = statuses.slice(0, statuses.indexOf(order.status) + 1);

  const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring" as const, damping: 20, stiffness: 100 } },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.06 } } }}
      className="max-w-3xl"
    >
      <motion.div variants={itemVariants} className="mb-6">
        <Link href="/admin/orders"
          className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors mb-4">
          <ArrowLeft className="size-3" /> Back to orders
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">Order {order.id.slice(0, 8)}</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {new Date(order.createdAt).toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
          {/* Items */}
          <div className="rounded-xl border border-border/50 bg-card p-5">
            <h3 className="text-sm font-semibold mb-4">Items ({order.items.length})</h3>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 py-2 border-b border-border/30 last:border-0">
                  <div className="size-12 rounded-lg bg-foreground/5 flex items-center justify-center overflow-hidden shrink-0">
                    {item.product.images[0] ? (
                      <img src={item.product.images[0]} alt="" className="size-full object-cover" />
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.product.name}</p>
                    <p className="text-xs text-muted-foreground">Qty: {item.quantity} × ${Number(item.price).toFixed(2)}</p>
                  </div>
                  <span className="text-sm font-semibold">${(item.quantity * Number(item.price)).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center pt-3 mt-2 border-t border-border/50">
              <span className="text-sm font-semibold">Total</span>
              <span className="text-lg font-bold">${order.total.toFixed(2)}</span>
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-6">
          {/* Customer */}
          <div className="rounded-xl border border-border/50 bg-card p-5">
            <h3 className="text-sm font-semibold mb-3">Customer</h3>
            <p className="text-sm font-medium">{order.user.name || "—"}</p>
            <p className="text-xs text-muted-foreground">{order.user.email}</p>
          </div>

          {/* Status */}
          <div className="rounded-xl border border-border/50 bg-card p-5">
            <h3 className="text-sm font-semibold mb-3">Status</h3>
            <div className="space-y-2">
              {statuses.map((s) => {
                const isCurrent = order.status === s;
                const isPast = statuses.indexOf(order.status) >= statuses.indexOf(s);
                const isCancelled = order.status === "cancelled";
                return (
                  <button
                    key={s}
                    disabled={updating || (isCancelled && s !== "cancelled")}
                    onClick={() => updateStatus(s)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      isCurrent
                        ? "bg-foreground text-background"
                        : isPast && !isCancelled
                        ? "bg-muted/50 text-muted-foreground"
                        : "hover:bg-muted/30 text-muted-foreground/60"
                    } ${updating ? "opacity-50" : ""}`}
                  >
                    <div className={`size-2 rounded-full ${isCurrent ? "bg-background" : isPast ? "bg-muted-foreground/30" : "bg-muted-foreground/10"}`} />
                    <span className="capitalize">{s}</span>
                  </button>
                );
              })}
            </div>
            {order.cancelReason && (
              <div className="mt-3 p-3 rounded-lg bg-red-500/5 border border-red-500/10">
                <p className="text-xs font-medium text-red-500">Cancellation reason</p>
                <p className="text-xs text-muted-foreground mt-1">{order.cancelReason}</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}