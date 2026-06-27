import { type NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/db";

export async function GET(request: NextRequest) {
  const session = await getSession(request.headers);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [totalProducts, totalOrders, totalUsers, totalRevenue, recentOrders, ordersByStatus, revenueByDay, topProducts, ordersByCategory] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.user.count(),
    prisma.order.aggregate({ _sum: { total: true }, where: { status: { notIn: ["cancelled"] } } }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true, email: true } },
        items: { include: { product: { select: { name: true } } } },
      },
    }),
    prisma.order.groupBy({ by: ["status"], _count: true }),
    prisma.$queryRaw`
      SELECT DATE(created_at) as date, SUM(total) as revenue
      FROM "Order"
      WHERE created_at >= NOW() - INTERVAL '30 days'
        AND status != 'cancelled'
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `,
    prisma.product.findMany({
      take: 5,
      orderBy: { orderItems: { _count: "desc" } },
      include: { _count: { select: { orderItems: true } } },
    }),
    prisma.orderItem.findMany({
      include: { product: { select: { category: true, name: true } } },
    }),
  ]);

  const categorySales: Record<string, number> = {};
  for (const item of ordersByCategory) {
    const cat = item.product.category;
    categorySales[cat] = (categorySales[cat] || 0) + 1;
  }

  return NextResponse.json({
    stats: {
      totalProducts,
      totalOrders,
      totalUsers,
      totalRevenue: Number(totalRevenue._sum.total || 0),
    },
    ordersByStatus: ordersByStatus.map((o) => ({ status: o.status, count: o._count })),
    recentOrders: recentOrders.map((o) => ({
      id: o.id,
      status: o.status,
      total: Number(o.total),
      userName: o.user.name,
      userEmail: o.user.email,
      items: o.items.length,
      createdAt: o.createdAt,
    })),
    revenueByDay: (revenueByDay as Array<{ date: string; revenue: number }>).map((r) => ({
      date: r.date,
      revenue: Number(r.revenue),
    })),
    topProducts: topProducts.map((p) => ({
      id: p.id,
      name: p.name,
      orders: p._count.orderItems,
    })),
    categorySales: Object.entries(categorySales).map(([category, count]) => ({
      category,
      count,
    })),
  });
}