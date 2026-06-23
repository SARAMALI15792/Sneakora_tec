"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Loader2, Edit } from "lucide-react";
import { toast } from "sonner";

type Coupon = {
  id: string;
  code: string;
  discount: number;
  type: string;
  maxUses: number | null;
  expiresAt: string | null;
};

export function CouponDialog({
  mode,
  coupon,
}: {
  mode: "create" | "edit";
  coupon?: Coupon;
}) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [code, setCode] = React.useState(coupon?.code ?? "");
  const [discount, setDiscount] = React.useState(
    String(coupon?.discount ?? "")
  );
  const [type, setType] = React.useState(coupon?.type ?? "percentage");
  const [maxUses, setMaxUses] = React.useState(
    String(coupon?.maxUses ?? "")
  );
  const [expiresAt, setExpiresAt] = React.useState(
    coupon?.expiresAt
      ? new Date(coupon.expiresAt).toISOString().split("T")[0]
      : ""
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const body = {
        code,
        discount: Number(discount),
        type,
        maxUses: maxUses ? Number(maxUses) : null,
        expiresAt: expiresAt || null,
      };

      const res =
        mode === "create"
          ? await fetch("/api/admin/coupons", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(body),
            })
          : await fetch(`/api/admin/coupons/${coupon!.id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(body),
            });

      if (!res.ok) {
        const err = await res.json();
        toast.error(err.error || "Failed to save coupon");
        return;
      }

      toast.success(
        mode === "create" ? "Coupon created" : "Coupon updated"
      );
      setOpen(false);
      window.location.reload();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {mode === "create" ? (
        <DialogTrigger render={<Button><Plus /> Add Coupon</Button>} />
      ) : (
        <DialogTrigger render={<Button variant="ghost" size="icon"><Edit className="size-4" /></Button>} />
      )}
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {mode === "create" ? "Add Coupon" : "Edit Coupon"}
            </DialogTitle>
            <DialogDescription>
              {mode === "create"
                ? "Create a new discount coupon"
                : "Update coupon details"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="code">Code</Label>
              <Input
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="SUMMER20"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="discount">Discount</Label>
                <Input
                  id="discount"
                  type="number"
                  step="0.01"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select value={type} onValueChange={(v) => v && setType(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="flat">Flat Amount</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="maxUses">Max Uses (optional)</Label>
                <Input
                  id="maxUses"
                  type="number"
                  value={maxUses}
                  onChange={(e) => setMaxUses(e.target.value)}
                  placeholder="Unlimited"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expiresAt">Expires (optional)</Label>
                <Input
                  id="expiresAt"
                  type="date"
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="size-4 animate-spin mr-2" />}
              {mode === "create" ? "Create" : "Update"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
