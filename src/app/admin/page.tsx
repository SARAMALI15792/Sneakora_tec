import { DollarSign, ShoppingBag, Package, Users } from "lucide-react";
import prisma from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OverviewCharts } from "@/components/admin/OverviewCharts";

async function getStats() {
  const [productCount, orderCount, userCount, totalRevenue] =
    await Promise.all([
      prisma.product.count(),
      prisma.order.count(),
      prisma.user.count(),
      prisma.order.aggregate({ _sum: { total: true } }),
    ]);

  return {
    productCount,
    orderCount,
    userCount,
    totalRevenue: totalRevenue._sum.total ?? 0,
  };
}

export default async function AdminDashboard() {
  const stats = await getStats();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Overview of your store
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value={`$${Number(stats.totalRevenue).toLocaleString()}`}
          icon={DollarSign}
          description="All time revenue"
        />
        <StatCard
          title="Orders"
          value={stats.orderCount.toLocaleString()}
          icon={ShoppingBag}
          description="Total orders placed"
        />
        <StatCard
          title="Products"
          value={stats.productCount.toLocaleString()}
          icon={Package}
          description="Active products"
        />
        <StatCard
          title="Users"
          value={stats.userCount.toLocaleString()}
          icon={Users}
          description="Registered users"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="revenue">
            <TabsList>
              <TabsTrigger value="revenue">Revenue</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
            </TabsList>
            <TabsContent value="revenue" className="pt-4">
              <OverviewCharts type="revenue" />
            </TabsContent>
            <TabsContent value="orders" className="pt-4">
              <OverviewCharts type="orders" />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
  description,
}: {
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="size-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </CardContent>
    </Card>
  );
}
