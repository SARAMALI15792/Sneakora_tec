"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Search, Eye } from "lucide-react";
import Link from "next/link";

interface Order {
  id: string;
  status: string;
  total: number;
  userName: string;
  userEmail: string;
  items: { product: { name: string } }[];
  createdAt: string;
}

const statusColors: Record<string, string> = {
  pending: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  confirmed: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  shipped: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  delivered: "bg-green-500/10 text-green-500 border-green-500/20",
  cancelled: "bg-red-500/10 text-red-500 border-red-500/20",
};

export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const params = new URLSearchParams({ page: String(page), limit: "20" });
    if (statusFilter) params.set("status", statusFilter);
    if (search) params.set("search", search);
    fetch(`/api/admin/orders?${params}`)
      .then((r) => r.json())
      .then((data) => {
        setOrders(data.orders);
        setTotalPages(data.pagination.totalPages);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [page, statusFilter, search]);

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
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage customer orders.</p>
      </motion.div>

      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            type="text" placeholder="Search by order ID, customer name, or email..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full h-10 pl-10 pr-4 text-sm bg-transparent border border-border rounded-lg outline-none focus:border-foreground transition-colors"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {["", "pending", "confirmed", "shipped", "delivered", "cancelled"].map((s) => (
            <button
              key={s}
              onClick={() => { setStatusFilter(s); setPage(1); }}
              className={`h-10 px-3 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                statusFilter === s
                  ? "bg-foreground text-background"
                  : "border border-border hover:bg-muted"
              }`}
            >
              {s ? s.charAt(0).toUpperCase() + s.slice(1) : "All"}
            </button>
          ))}
        </div>
      </motion.div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="size-8 rounded-full border-2 border-foreground/20 border-t-foreground animate-spin" />
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">No orders found.</div>
      ) : (
        <>
          <motion.div variants={itemVariants} className="rounded-xl border border-border/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50 bg-muted/30">
                    <th className="text-left px-4 py-3 text-xs uppercase tracking-widest text-muted-foreground font-medium">Order ID</th>
                    <th className="text-left px-4 py-3 text-xs uppercase tracking-widest text-muted-foreground font-medium">Customer</th>
                    <th className="text-left px-4 py-3 text-xs uppercase tracking-widest text-muted-foreground font-medium">Items</th>
                    <th className="text-right px-4 py-3 text-xs uppercase tracking-widest text-muted-foreground font-medium">Total</th>
                    <th className="text-center px-4 py-3 text-xs uppercase tracking-widest text-muted-foreground font-medium">Status</th>
                    <th className="text-right px-4 py-3 text-xs uppercase tracking-widest text-muted-foreground font-medium">Date</th>
                    <th className="text-right px-4 py-3 text-xs uppercase tracking-widest text-muted-foreground font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, i) => (
                    <motion.tr
                      key={order.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="border-b border-border/30 hover:bg-muted/20 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs">{order.id.slice(0, 8)}...</span>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium">{order.userName || "—"}</p>
                        <p className="text-xs text-muted-foreground">{order.userEmail}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-muted-foreground">{order.items.length} item(s)</span>
                      </td>
                      <td className="px-4 py-3 text-right font-medium">${order.total.toFixed(2)}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-semibold border ${statusColors[order.status] || ""}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-xs text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs border border-border hover:bg-muted transition-all"
                        >
                          <Eye className="size-3.5" />
                          View
                        </Link>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {totalPages > 1 && (
            <motion.div variants={itemVariants} className="flex items-center justify-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`size-8 rounded-lg text-xs font-medium transition-all ${
                    page === i + 1 ? "bg-foreground text-background" : "border border-border hover:bg-muted"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </motion.div>
          )}
        </>
      )}
    </motion.div>
  );
}