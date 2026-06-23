"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  XCircle,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

type ClientOrderItem = {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  product: { name: string; images: string[]; slug: string | null };
};

type ClientOrder = {
  id: string;
  status: string;
  total: number;
  cancelReason: string | null;
  cancelledAt: string | null;
  createdAt: string;
  items: ClientOrderItem[];
};

const cancelReasons = [
  "Changed my mind",
  "Found a better price",
  "Wrong size/color ordered",
  "Shipping too slow",
  "Ordered by mistake",
  "Delivery address issue",
  "Payment issue",
  "Other",
];

const statusConfig: Record<string, { label: string; icon: typeof Package; color: string; progress: number }> = {
  pending: { label: "Pending", icon: Clock, color: "text-yellow-500", progress: 10 },
  confirmed: { label: "Confirmed", icon: CheckCircle2, color: "text-blue-500", progress: 30 },
  shipped: { label: "Shipped", icon: Truck, color: "text-accent", progress: 60 },
  delivered: { label: "Delivered", icon: Package, color: "text-green-500", progress: 100 },
  cancelled: { label: "Cancelled", icon: XCircle, color: "text-destructive", progress: 0 },
};

const timelineStages = [
  { key: "confirmed", label: "Confirmed", icon: CheckCircle2, time: "Order placed" },
  { key: "preparing", label: "Preparing", icon: Package, time: "Processing" },
  { key: "shipped", label: "Shipped", icon: Truck, time: "On the way" },
  { key: "delivered", label: "Delivered", icon: Package, time: "Arrived" },
];

function getStageIndex(status: string): number {
  if (status === "cancelled") return -1;
  const map: Record<string, number> = { pending: -1, confirmed: 0, shipped: 2, delivered: 3 };
  return map[status] ?? -1;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function OrderDetailClient({ order: initialOrder }: { order: ClientOrder }) {
  const router = useRouter();
  const [order, setOrder] = useState(initialOrder);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelling, setCancelling] = useState(false);
  const [customReason, setCustomReason] = useState("");

  const status = statusConfig[order.status] || statusConfig.pending;
  const StatusIcon = status.icon;
  const stageIndex = getStageIndex(order.status);
  const canCancel = ["pending", "confirmed"].includes(order.status);

  async function handleCancel() {
    const reason = cancelReason === "Other" ? customReason : cancelReason;
    if (!reason?.trim()) {
      toast.error("Please select or enter a cancellation reason");
      return;
    }

    setCancelling(true);
    try {
      const res = await fetch(`/api/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: reason.trim() }),
      });

      if (res.ok) {
        toast.success("Order cancelled successfully");
        setCancelDialogOpen(false);
        setOrder((prev) => ({
          ...prev,
          status: "cancelled",
          cancelReason: reason.trim(),
          cancelledAt: new Date().toISOString(),
        }));
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to cancel order");
      }
    } catch {
      toast.error("Something went wrong");
    }
    setCancelling(false);
  }

  return (
    <div className="pt-20">
      <div className="mx-auto max-w-4xl px-6 py-10">
        {/* Back link */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
        >
          <Link
            href="/profile/orders"
            className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.3em] text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-3" />
            All Orders
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.32, 0.72, 0, 1] }}
          className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"
        >
          <div>
            <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
              Order Details
            </p>
            <h1 className="font-heading mt-2 text-3xl font-bold tracking-tight">
              #{order.id.slice(0, 8)}
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Placed {formatDate(order.createdAt)}
            </p>
          </div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3, ease: [0.32, 0.72, 0, 1] }}
            className="flex items-center gap-3"
          >
            <span className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-widest border ${status.color.replace("text-", "border-").replace("500", "500/30")} ${status.color.replace("text-", "bg-").replace("500", "500/10")} ${status.color}`}>
              <StatusIcon className="size-4" />
              {status.label}
            </span>
          </motion.div>
        </motion.div>

        {order.status === "cancelled" && order.cancelReason && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mt-4 flex items-start gap-2 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3"
          >
            <AlertTriangle className="mt-0.5 size-4 shrink-0 text-destructive" />
            <div>
              <p className="text-xs font-semibold text-destructive uppercase tracking-widest">Cancelled</p>
              <p className="text-sm text-muted-foreground mt-0.5">
                Reason: {order.cancelReason}
              </p>
              {order.cancelledAt && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  {formatDate(order.cancelledAt)}
                </p>
              )}
            </div>
          </motion.div>
        )}

        {/* Delivery Timeline */}
        {order.status !== "cancelled" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.32, 0.72, 0, 1] }}
            className="mt-10"
          >
            <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground mb-5">
              Delivery Progress
            </p>
            <div className="relative">
              <div className="absolute left-[19px] top-0 bottom-0 w-px bg-border" />
              <div
                className="absolute left-[19px] top-0 w-px bg-accent transition-all duration-1000 ease-[cubic-bezier(0.32,0.72,0,1)]"
                style={{ height: stageIndex >= 0 ? `${((stageIndex + 1) / timelineStages.length) * 100}%` : "0%" }}
              />
              <div className="relative space-y-8">
                {timelineStages.map((stage, i) => {
                  const isActive = stageIndex >= i;
                  const isCurrent = stageIndex === i;
                  const StageIcon = stage.icon;
                  return (
                    <motion.div
                      key={stage.key}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 + i * 0.1, ease: [0.32, 0.72, 0, 1] }}
                      className="flex gap-4"
                    >
                      <div className={`relative flex size-10 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-500 ${
                        isActive
                          ? "border-accent bg-accent text-accent-foreground shadow-[0_0_12px_-2px] shadow-accent/30"
                          : "border-border bg-muted text-muted-foreground"
                      } ${isCurrent ? "ring-2 ring-accent/20 ring-offset-2 ring-offset-background" : ""}`}>
                        {isActive && stageIndex > i ? (
                          <CheckCircle2 className="size-5" />
                        ) : (
                          <StageIcon className={`size-4 ${isCurrent ? "animate-pulse" : ""}`} />
                        )}
                      </div>
                      <div className="flex-1 pb-2">
                        <p className={`text-sm font-semibold ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                          {stage.label}
                        </p>
                        <p className={`text-xs ${isActive ? "text-muted-foreground" : "text-muted-foreground/50"}`}>
                          {stage.time}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* Order Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: [0.32, 0.72, 0, 1] }}
          className="mt-12"
        >
          <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground mb-4">
            Items ({order.items.length})
          </p>
          <div className="overflow-hidden rounded-2xl border border-border/60 bg-card/50 backdrop-blur-sm">
            <div className="divide-y divide-border/60">
              {order.items.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 + i * 0.08, ease: [0.32, 0.72, 0, 1] }}
                  className="flex items-center gap-4 px-5 py-4"
                >
                  <Link
                    href={`/shop/${item.product.slug || item.productId}`}
                    className="size-16 shrink-0 overflow-hidden rounded-xl bg-muted ring-1 ring-border/50"
                  >
                    {item.product.images[0] ? (
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-2xl opacity-10">👟</div>
                    )}
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/shop/${item.product.slug || item.productId}`}
                      className="text-sm font-semibold hover:underline"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-xs text-muted-foreground mt-0.5">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-semibold shrink-0">
                    ${Number(item.price).toFixed(2)}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="border-t border-border/60 px-5 py-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Subtotal</span>
                <span className="text-sm">${order.total.toFixed(2)}</span>
              </div>
              <div className="mt-1.5 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Shipping</span>
                <span className="text-xs text-green-500 font-medium">Free</span>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-border/60 pt-3">
                <span className="text-sm font-semibold">Total</span>
                <motion.span
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.7 + order.items.length * 0.08 }}
                  className="text-lg font-bold"
                >
                  ${order.total.toFixed(2)}
                </motion.span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7, ease: [0.32, 0.72, 0, 1] }}
          className="mt-10 flex flex-wrap gap-3"
        >
          <Link
            href="/profile/orders"
            className="inline-flex h-11 items-center gap-2 px-5 text-xs font-semibold uppercase tracking-widest border border-border hover:bg-muted transition-all duration-300 active:scale-[0.98]"
          >
            <ArrowLeft className="size-3" />
            Back to Orders
          </Link>
          <Link
            href="/shop"
            className="inline-flex h-11 items-center gap-2 px-5 text-xs font-semibold uppercase tracking-widest bg-foreground text-background hover:opacity-90 transition-all duration-300 active:scale-[0.98]"
          >
            Continue Shopping
            <ChevronRight className="size-3" />
          </Link>

          {canCancel && (
            <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
              <DialogTrigger render={<button className="inline-flex h-11 items-center gap-2 px-5 text-xs font-semibold uppercase tracking-widest border border-destructive/40 text-destructive hover:bg-destructive/10 transition-all duration-300 active:scale-[0.98]">
                  <XCircle className="size-4" />
                  Cancel Order
                </button>} />
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Cancel Order</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to cancel order #{order.id.slice(0, 8)}?
                    This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-2">
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Why are you cancelling?
                  </p>
                  <div className="space-y-1.5">
                    {cancelReasons.map((reason) => (
                      <button
                        key={reason}
                        type="button"
                        onClick={() => {
                          setCancelReason(reason);
                          if (reason !== "Other") setCustomReason("");
                        }}
                        className={`w-full text-left px-4 py-2.5 text-sm rounded-lg border transition-all ${
                          cancelReason === reason
                            ? "border-accent bg-accent/10 text-foreground font-medium"
                            : "border-border hover:border-accent/50 text-muted-foreground"
                        }`}
                      >
                        {reason}
                      </button>
                    ))}
                  </div>

                  {cancelReason === "Other" && (
                    <textarea
                      placeholder="Tell us why you're cancelling..."
                      value={customReason}
                      onChange={(e) => setCustomReason(e.target.value)}
                      className="w-full border border-border bg-transparent px-4 py-2.5 text-sm outline-none focus:border-foreground transition-colors resize-none rounded-lg"
                      rows={2}
                      maxLength={500}
                    />
                  )}
                </div>

                <DialogFooter className="gap-2">
                  <button
                    onClick={() => setCancelDialogOpen(false)}
                    className="inline-flex h-10 items-center px-4 text-xs font-semibold uppercase tracking-widest border border-border hover:bg-muted transition-all"
                  >
                    Keep Order
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={cancelling || !cancelReason}
                    className="inline-flex h-10 items-center px-4 text-xs font-semibold uppercase tracking-widest bg-destructive text-destructive-foreground hover:opacity-90 transition-all disabled:opacity-50"
                  >
                    {cancelling ? "Cancelling..." : "Yes, Cancel"}
                  </button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </motion.div>
      </div>
    </div>
  );
}
