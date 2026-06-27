"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { Plus, Search, Edit, Trash2, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAt: number | null;
  category: string;
  images: string[];
  stock: number;
  featured: boolean;
  createdAt: string;
}

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const params = new URLSearchParams({ page: String(page), limit: "20" });
    if (search) params.set("search", search);
    fetch(`/api/admin/products?${params}`)
      .then((r) => r.json())
      .then((data) => {
        setProducts(data.products);
        setTotalPages(data.pagination.totalPages);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [page, search]);

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast.success("Product deleted");
    } catch {
      toast.error("Failed to delete product");
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
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
      <motion.div
        variants={itemVariants}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Products</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your product catalog.
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 h-10 px-4 rounded-lg bg-foreground text-background text-xs font-semibold uppercase tracking-widest hover:opacity-90 transition-all active:scale-[0.98]"
        >
          <Plus className="size-4" />
          New Product
        </Link>
      </motion.div>

      <motion.div variants={itemVariants} className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="w-full h-10 pl-10 pr-4 text-sm bg-transparent border border-border rounded-lg outline-none focus:border-foreground transition-colors"
        />
      </motion.div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="size-8 rounded-full border-2 border-foreground/20 border-t-foreground animate-spin" />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground">No products found.</p>
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 mt-4 text-sm text-foreground underline underline-offset-4"
          >
            Create your first product
          </Link>
        </div>
      ) : (
        <>
          <motion.div
            variants={itemVariants}
            className="rounded-xl border border-border/50 overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50 bg-muted/30">
                    <th className="text-left px-4 py-3 text-xs uppercase tracking-widest text-muted-foreground font-medium">
                      Product
                    </th>
                    <th className="text-left px-4 py-3 text-xs uppercase tracking-widest text-muted-foreground font-medium">
                      Category
                    </th>
                    <th className="text-right px-4 py-3 text-xs uppercase tracking-widest text-muted-foreground font-medium">
                      Price
                    </th>
                    <th className="text-center px-4 py-3 text-xs uppercase tracking-widest text-muted-foreground font-medium">
                      Stock
                    </th>
                    <th className="text-center px-4 py-3 text-xs uppercase tracking-widest text-muted-foreground font-medium">
                      Status
                    </th>
                    <th className="text-right px-4 py-3 text-xs uppercase tracking-widest text-muted-foreground font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, index) => (
                    <motion.tr
                      key={product.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="border-b border-border/30 hover:bg-muted/20 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="size-10 rounded-lg bg-foreground/5 flex items-center justify-center overflow-hidden shrink-0 relative">
                            {product.images[0] ? (
                              <Image
                                src={product.images[0]}
                                alt={product.name}
                                fill
                                sizes="40px"
                                className="object-cover"
                              />
                            ) : (
                              <span className="text-xs text-muted-foreground">—</span>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium truncate max-w-[200px]">
                              {product.name}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {product.slug}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs capitalize text-muted-foreground">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="space-y-0.5">
                          <span className="font-medium">
                            ${Number(product.price).toFixed(2)}
                          </span>
                          {product.compareAt && (
                            <div className="text-xs text-muted-foreground line-through">
                              ${Number(product.compareAt).toFixed(2)}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`text-xs font-medium ${
                            product.stock > 0 ? "text-green-500" : "text-red-500"
                          }`}
                        >
                          {product.stock}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {product.featured && (
                            <Badge variant="secondary" className="text-[10px]">
                              Featured
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger>
                            <button className="size-8 rounded-lg hover:bg-muted transition-colors flex items-center justify-center">
                              <MoreHorizontal className="size-4" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-32">
                            <DropdownMenuItem onClick={() => router.push(`/admin/products/${product.id}`)}>
                              <Edit className="size-3.5" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => handleDelete(product.id, product.name)}
                            >
                              <Trash2 className="size-3.5" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {totalPages > 1 && (
            <motion.div
              variants={itemVariants}
              className="flex items-center justify-center gap-2"
            >
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`size-8 rounded-lg text-xs font-medium transition-all ${
                    page === i + 1
                      ? "bg-foreground text-background"
                      : "border border-border hover:bg-muted"
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