"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Loader2, Trash2, Edit } from "lucide-react";
import { toast } from "sonner";
import { CouponDialog } from "./CouponDialog";

type Coupon = {
  id: string;
  code: string;
  discount: number;
  type: string;
  maxUses: number | null;
  usedCount: number;
  expiresAt: string | null;
  createdAt: string;
};

export function CouponsTable() {
  const [data, setData] = React.useState<Coupon[]>([]);
  const [loading, setLoading] = React.useState(true);

  const fetchCoupons = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/coupons");
      const json = await res.json();
      setData(json);
    } catch {
      toast.error("Failed to load coupons");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  const deleteCoupon = async (id: string) => {
    const res = await fetch(`/api/admin/coupons/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      toast.success("Coupon deleted");
      fetchCoupons();
    } else {
      toast.error("Failed to delete coupon");
    }
  };

  const isExpired = (expiresAt: string | null) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Code</TableHead>
            <TableHead>Discount</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Usage</TableHead>
            <TableHead>Expires</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                <Loader2 className="size-5 animate-spin mx-auto text-muted-foreground" />
              </TableCell>
            </TableRow>
          ) : data.length ? (
            data.map((coupon) => (
              <TableRow key={coupon.id}>
                <TableCell className="font-mono font-medium">
                  {coupon.code}
                </TableCell>
                <TableCell>
                  {coupon.type === "percentage"
                    ? `${Number(coupon.discount)}%`
                    : `$${Number(coupon.discount).toFixed(2)}`}
                </TableCell>
                <TableCell className="capitalize">{coupon.type}</TableCell>
                <TableCell>
                  {coupon.usedCount}
                  {coupon.maxUses ? ` / ${coupon.maxUses}` : ""}
                </TableCell>
                <TableCell>
                  {coupon.expiresAt ? (
                    <Badge
                      variant="outline"
                      className={
                        isExpired(coupon.expiresAt)
                          ? "bg-red-500/10 text-red-600 border-red-500/20"
                          : "bg-green-500/10 text-green-600 border-green-500/20"
                      }
                    >
                      {isExpired(coupon.expiresAt) ? "Expired" : "Active"}
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground text-sm">
                      No expiry
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center gap-1 justify-end">
                    <CouponDialog mode="edit" coupon={coupon} />
                    <AlertDialog>
                      <AlertDialogTrigger render={<Button variant="ghost" size="icon" />}>
                        <Trash2 className="size-4 text-destructive" />
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Coupon</AlertDialogTitle>
                          <AlertDialogDescription>
                            Delete coupon &ldquo;{coupon.code}&rdquo;? This
                            cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteCoupon(coupon.id)}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={6}
                className="h-24 text-center text-muted-foreground"
              >
                No coupons yet.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
