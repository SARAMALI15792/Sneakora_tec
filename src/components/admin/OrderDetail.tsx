"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Separator,
} from "@/components/ui/separator";
import { Loader2, Package, Truck, CheckCircle, XCircle, Clock } from "lucide-react";
import { toast } from "sonner";

const statusConfig: Record<string, { label: string; color: string; icon: React.ComponentType<{ className?: string }> }> = {
  pending: { label: "Pending", color: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20", icon: Clock },
  confirmed: { label: "Confirmed", color: "bg-blue-500/10 text-blue-600 border-blue-500/20", icon: Package },
  shipped: { label: "Shipped", color: "bg-purple-500/10 text-purple-600 border-purple-500/20", icon: Truck },
  delivered: { label: "Delivered", color: "bg-green-500/10 text-green-600 border-green-500/20", icon: CheckCircle },
  cancelled: { label: "Cancelled", color: "bg-red-500/10 text-red-600 border-red-500/20", icon: XCircle },
};

const statusFlow = ["pending", "confirmed", "shipped", "delivered"];

type OrderItem = {
  id: string;
  quantity: number;
  price: number;
  product: { name: string; images: string[]; price: number };
};

type Order = {
  id: string;
  total: number;
  status: string;
  createdAt: string;
  cancelledAt: string | null;
  cancelReason: string | null;
  user: { name: string; email: string };
  items: OrderItem[];
};

export function OrderDetail({ order }: { order: Order }) {
  const router = useRouter();
  const [updating, setUpdating] = React.useState(false);
  const [currentStatus, setCurrentStatus] = React.useState(order.status);

  const updateStatus = async (newStatus: string) => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setCurrentStatus(newStatus);
        toast.success(`Order marked as ${newStatus}`);
        router.refresh();
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to update status");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setUpdating(false);
    }
  };

  const cfg = statusConfig[currentStatus] || statusConfig.pending;
  const StatusIcon = cfg.icon;

  const currentStep = statusFlow.indexOf(currentStatus);

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Order Items</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 py-2 border-b last:border-0"
              >
                <div className="size-16 rounded-md bg-muted overflow-hidden flex-shrink-0">
                  {item.product.images?.[0] && (
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="size-full object-cover"
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {item.product.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Qty: {item.quantity} × ${Number(item.price).toFixed(2)}
                  </p>
                </div>
                <div className="text-sm font-medium">
                  ${(item.quantity * Number(item.price)).toFixed(2)}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {statusFlow.map((step, i) => {
                const stepCfg = statusConfig[step];
                const StepIcon = stepCfg.icon;
                const isActive = i <= currentStep && currentStatus !== "cancelled";
                const isCurrent = i === currentStep && currentStatus !== "cancelled";

                return (
                  <div key={step} className="flex items-start gap-3">
                    <div
                      className={`flex items-center justify-center size-8 rounded-full shrink-0 ${
                        isActive
                          ? "bg-accent text-accent-foreground"
                          : "bg-muted text-muted-foreground"
                      } ${isCurrent ? "ring-2 ring-accent ring-offset-2 ring-offset-background" : ""}`}
                    >
                      <StepIcon className="size-4" />
                    </div>
                    <div className="pt-1">
                      <p
                        className={`text-sm font-medium ${
                          isActive ? "text-foreground" : "text-muted-foreground"
                        }`}
                      >
                        {stepCfg.label}
                      </p>
                    </div>
                  </div>
                );
              })}
              {currentStatus === "cancelled" && (
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center size-8 rounded-full shrink-0 bg-red-500/10 text-red-600 ring-2 ring-red-500 ring-offset-2 ring-offset-background">
                    <XCircle className="size-4" />
                  </div>
                  <div className="pt-1">
                    <p className="text-sm font-medium text-red-600">
                      Cancelled
                    </p>
                    {order.cancelReason && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Reason: {order.cancelReason}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Status</span>
              <Badge variant="outline" className={cfg.color}>
                <StatusIcon className="size-3 mr-1" />
                {cfg.label}
              </Badge>
            </div>
            <Separator />
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Total</span>
              <span className="font-bold text-lg">
                ${Number(order.total).toFixed(2)}
              </span>
            </div>
            <Separator />
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Customer</span>
              <span className="text-right text-sm">{order.user.name}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Email</span>
              <span className="text-right text-sm text-muted-foreground">
                {order.user.email}
              </span>
            </div>
            <Separator />
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Date</span>
              <span className="text-sm">
                {new Date(order.createdAt).toLocaleDateString()}
              </span>
            </div>
          </CardContent>
        </Card>

        {currentStatus !== "cancelled" && currentStatus !== "delivered" && (
          <Card>
            <CardHeader>
              <CardTitle>Update Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Select
                value={currentStatus}
                onValueChange={(v) => v && setCurrentStatus(v)}
                disabled={updating}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusFlow.map((s) => {
                    const idx = statusFlow.indexOf(s);
                    if (idx <= currentStep + 1 && idx >= currentStep) {
                      return (
                        <SelectItem key={s} value={s} className="capitalize">
                          {statusConfig[s].label}
                        </SelectItem>
                      );
                    }
                    return null;
                  })}
                  <SelectItem value="cancelled" className="text-destructive">
                    Cancel Order
                  </SelectItem>
                </SelectContent>
              </Select>
              <Button
                className="w-full"
                onClick={() => updateStatus(currentStatus)}
                disabled={updating || currentStatus === order.status}
              >
                {updating && <Loader2 className="size-4 animate-spin mr-2" />}
                Update
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
