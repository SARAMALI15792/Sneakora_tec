"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from "recharts";
import {
  Package,
  ShoppingBag,
  Users,
  DollarSign,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

interface Stats {
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  totalRevenue: number;
}

interface OrderStatus {
  status: string;
  count: number;
}

interface RecentOrder {
  id: string;
  status: string;
  total: number;
  userName: string | null;
  userEmail: string;
  items: number;
  createdAt: string;
}

interface RevenueDay {
  date: string;
  revenue: number;
}

interface TopProduct {
  id: string;
  name: string;
  orders: number;
}

interface CategorySale {
  category: string;
  count: number;
}

interface DashboardData {
  stats: Stats;
  ordersByStatus: OrderStatus[];
  recentOrders: RecentOrder[];
  revenueByDay: RevenueDay[];
  topProducts: TopProduct[];
  categorySales: CategorySale[];
}

const statusColors: Record<string, string> = {
  pending: "#f59e0b",
  confirmed: "#3b82f6",
  shipped: "#8b5cf6",
  delivered: "#22c55e",
  cancelled: "#ef4444",
};

const CHART_COLORS = ["#8b5cf6", "#3b82f6", "#22c55e", "#f59e0b", "#ef4444", "#ec4899"];

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="size-8 rounded-full border-2 border-foreground/20 border-t-foreground animate-spin" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        Failed to load dashboard data.
      </div>
    );
  }

  const revenueChange = data.revenueByDay.length > 1
    ? ((data.revenueByDay[data.revenueByDay.length - 1].revenue - data.revenueByDay[0].revenue) / data.revenueByDay[0].revenue * 100).toFixed(1)
    : "0";

  const statCards = [
    {
      label: "Total Revenue",
      value: `$${data.stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      trend: revenueChange,
      trendUp: Number(revenueChange) >= 0,
    },
    {
      label: "Total Orders",
      value: data.stats.totalOrders.toLocaleString(),
      icon: ShoppingBag,
    },
    {
      label: "Total Products",
      value: data.stats.totalProducts.toLocaleString(),
      icon: Package,
    },
    {
      label: "Total Users",
      value: data.stats.totalUsers.toLocaleString(),
      icon: Users,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring" as const, damping: 20, stiffness: 100 },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Overview of your store performance.
        </p>
      </motion.div>

      {/* Stat Cards */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {statCards.map((card) => (
          <div
            key={card.label}
            className="rounded-xl border border-border/50 bg-card p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs uppercase tracking-widest text-muted-foreground font-medium">
                {card.label}
              </span>
              <div className="size-8 rounded-lg bg-foreground/5 flex items-center justify-center">
                <card.icon className="size-4 text-foreground/70" />
              </div>
            </div>
            <div className="text-2xl font-bold">{card.value}</div>
            {card.trend !== undefined && (
              <div className={`flex items-center gap-1 mt-1 text-xs ${card.trendUp ? "text-green-500" : "text-red-500"}`}>
                {card.trendUp ? (
                  <TrendingUp className="size-3" />
                ) : (
                  <TrendingDown className="size-3" />
                )}
                <span>{Math.abs(Number(card.trend))}% vs last period</span>
              </div>
            )}
          </div>
        ))}
      </motion.div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <motion.div
          variants={itemVariants}
          className="rounded-xl border border-border/50 bg-card p-5"
        >
          <h3 className="text-sm font-semibold mb-4">Revenue (30 days)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.revenueByDay}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => new Date(v).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                  stroke="var(--muted-foreground)"
                  opacity={0.5}
                />
                <YAxis
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `$${v}`}
                  stroke="var(--muted-foreground)"
                  opacity={0.5}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                  formatter={(v) => [`$${Number(v ?? 0).toFixed(2)}`, "Revenue"]}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  fill="url(#revenueGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Orders by Status */}
        <motion.div
          variants={itemVariants}
          className="rounded-xl border border-border/50 bg-card p-5"
        >
          <h3 className="text-sm font-semibold mb-4">Orders by Status</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.ordersByStatus}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="count"
                  nameKey="status"
                >
                  {data.ordersByStatus.map((entry) => (
                    <Cell
                      key={entry.status}
                      fill={statusColors[entry.status] || "#8b5cf6"}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-3 mt-2">
            {data.ordersByStatus.map((entry) => (
              <div key={entry.status} className="flex items-center gap-1.5 text-xs">
                <div
                  className="size-2.5 rounded-full"
                  style={{ backgroundColor: statusColors[entry.status] || "#8b5cf6" }}
                />
                <span className="capitalize text-muted-foreground">{entry.status}</span>
                <span className="font-medium">{entry.count}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <motion.div
          variants={itemVariants}
          className="rounded-xl border border-border/50 bg-card p-5"
        >
          <h3 className="text-sm font-semibold mb-4">Top Products</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.topProducts} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} />
                <XAxis type="number" tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" opacity={0.5} />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fontSize: 11 }}
                  width={120}
                  stroke="var(--muted-foreground)"
                  opacity={0.5}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="orders" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Recent Orders */}
        <motion.div
          variants={itemVariants}
          className="rounded-xl border border-border/50 bg-card p-5"
        >
          <h3 className="text-sm font-semibold mb-4">Recent Orders</h3>
          <div className="space-y-3">
            {data.recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between py-2 border-b border-border/30 last:border-0"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">
                    {order.userName || order.userEmail}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {order.items} item(s) · {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold">${order.total.toFixed(2)}</span>
                  <span
                    className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-medium"
                    style={{
                      backgroundColor: `${statusColors[order.status]}20`,
                      color: statusColors[order.status],
                    }}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}