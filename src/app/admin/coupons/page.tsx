import { CouponsTable } from "@/components/admin/CouponsTable";
import { CouponDialog } from "@/components/admin/CouponDialog";

export default function AdminCouponsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Coupons</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage discount coupons
          </p>
        </div>
        <CouponDialog mode="create" />
      </div>
      <CouponsTable />
    </div>
  );
}
