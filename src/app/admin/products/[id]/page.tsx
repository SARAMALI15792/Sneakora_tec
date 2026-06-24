"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { ArrowLeft, X, Loader2 } from "lucide-react";
import Link from "next/link";

const categories = [
  "men", "women", "kids", "sports", "casual",
  "running", "basketball", "training", "lifestyle",
];

interface ProductForm {
  name: string;
  slug: string;
  description: string;
  price: string;
  compareAt: string;
  category: string;
  stock: string;
  featured: boolean;
  images: string[];
  sizes: string[];
  colors: string[];
}

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [form, setForm] = useState<ProductForm>({
    name: "",
    slug: "",
    description: "",
    price: "",
    compareAt: "",
    category: "",
    stock: "0",
    featured: false,
    images: [""],
    sizes: [""],
    colors: [""],
  });

  useEffect(() => {
    fetch(`/api/admin/products/${params.id}`)
      .then((r) => r.json())
      .then((data) => {
        setForm({
          name: data.name,
          slug: data.slug,
          description: data.description || "",
          price: String(data.price),
          compareAt: data.compareAt ? String(data.compareAt) : "",
          category: data.category,
          stock: String(data.stock),
          featured: data.featured,
          images: data.images.length > 0 ? data.images : [""],
          sizes: data.sizes.length > 0 ? data.sizes : [""],
          colors: data.colors.length > 0 ? data.colors : [""],
        });
        setFetching(false);
      })
      .catch(() => {
        toast.error("Failed to load product");
        setFetching(false);
      });
  }, [params.id]);

  function addField(field: "images" | "sizes" | "colors") {
    setForm((prev) => ({ ...prev, [field]: [...prev[field], ""] }));
  }

  function removeField(field: "images" | "sizes" | "colors", index: number) {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  }

  function updateField(field: "images" | "sizes" | "colors", index: number, value: string) {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].map((v, i) => (i === index ? value : v)),
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const body = {
      name: form.name,
      slug: form.slug,
      description: form.description || undefined,
      price: parseFloat(form.price),
      compareAt: form.compareAt ? parseFloat(form.compareAt) : null,
      category: form.category,
      stock: parseInt(form.stock),
      featured: form.featured,
      images: form.images.filter(Boolean),
      sizes: form.sizes.filter(Boolean),
      colors: form.colors.filter(Boolean),
    };

    try {
      const res = await fetch(`/api/admin/products/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to update product");
      }

      toast.success("Product updated");
      router.push("/admin/products");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update product");
    } finally {
      setLoading(false);
    }
  }

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="size-8 rounded-full border-2 border-foreground/20 border-t-foreground animate-spin" />
      </div>
    );
  }

  const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring" as const, damping: 20, stiffness: 100 },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.06 } } }}
      className="max-w-2xl"
    >
      <motion.div variants={itemVariants} className="mb-6">
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="size-3" />
          Back to products
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">Edit Product</h1>
        <p className="text-sm text-muted-foreground mt-1">{form.name}</p>
      </motion.div>

      <motion.form variants={itemVariants} onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs uppercase tracking-widest font-medium text-muted-foreground">Name *</label>
            <input required value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              className="w-full h-10 px-3 text-sm bg-transparent border border-border rounded-lg outline-none focus:border-foreground transition-colors" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs uppercase tracking-widest font-medium text-muted-foreground">Slug</label>
            <input value={form.slug} onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
              className="w-full h-10 px-3 text-sm bg-transparent border border-border rounded-lg outline-none focus:border-foreground transition-colors" />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs uppercase tracking-widest font-medium text-muted-foreground">Description</label>
          <textarea rows={3} value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
            className="w-full px-3 py-2 text-sm bg-transparent border border-border rounded-lg outline-none focus:border-foreground transition-colors resize-none" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs uppercase tracking-widest font-medium text-muted-foreground">Price * ($)</label>
            <input required type="number" step="0.01" min="0" value={form.price}
              onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
              className="w-full h-10 px-3 text-sm bg-transparent border border-border rounded-lg outline-none focus:border-foreground transition-colors" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs uppercase tracking-widest font-medium text-muted-foreground">Compare At ($)</label>
            <input type="number" step="0.01" min="0" value={form.compareAt}
              onChange={(e) => setForm((p) => ({ ...p, compareAt: e.target.value }))}
              className="w-full h-10 px-3 text-sm bg-transparent border border-border rounded-lg outline-none focus:border-foreground transition-colors" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs uppercase tracking-widest font-medium text-muted-foreground">Category *</label>
            <select required value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
              className="w-full h-10 px-3 text-sm bg-transparent border border-border rounded-lg outline-none focus:border-foreground transition-colors">
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs uppercase tracking-widest font-medium text-muted-foreground">Stock</label>
            <input type="number" min="0" value={form.stock} onChange={(e) => setForm((p) => ({ ...p, stock: e.target.value }))}
              className="w-full h-10 px-3 text-sm bg-transparent border border-border rounded-lg outline-none focus:border-foreground transition-colors" />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <input type="checkbox" id="featured" checked={form.featured}
            onChange={(e) => setForm((p) => ({ ...p, featured: e.target.checked }))}
            className="size-4 rounded border-border" />
          <label htmlFor="featured" className="text-sm">Featured product</label>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs uppercase tracking-widest font-medium text-muted-foreground">Image URLs</label>
            <button type="button" onClick={() => addField("images")} className="text-xs text-accent hover:underline">+ Add image</button>
          </div>
          {form.images.map((url, i) => (
            <div key={i} className="flex items-center gap-2">
              <input value={url} onChange={(e) => updateField("images", i, e.target.value)} placeholder="https://example.com/image.jpg"
                className="flex-1 h-10 px-3 text-sm bg-transparent border border-border rounded-lg outline-none focus:border-foreground transition-colors" />
              <button type="button" onClick={() => removeField("images", i)}
                className="size-8 rounded-lg hover:bg-muted transition-colors flex items-center justify-center">
                <X className="size-4 text-muted-foreground" />
              </button>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs uppercase tracking-widest font-medium text-muted-foreground">Sizes</label>
            <button type="button" onClick={() => addField("sizes")} className="text-xs text-accent hover:underline">+ Add size</button>
          </div>
          {form.sizes.map((size, i) => (
            <div key={i} className="flex items-center gap-2">
              <input value={size} onChange={(e) => updateField("sizes", i, e.target.value)} placeholder="e.g., US 9, M, 42"
                className="flex-1 h-10 px-3 text-sm bg-transparent border border-border rounded-lg outline-none focus:border-foreground transition-colors" />
              <button type="button" onClick={() => removeField("sizes", i)}
                className="size-8 rounded-lg hover:bg-muted transition-colors flex items-center justify-center">
                <X className="size-4 text-muted-foreground" />
              </button>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs uppercase tracking-widest font-medium text-muted-foreground">Colors</label>
            <button type="button" onClick={() => addField("colors")} className="text-xs text-accent hover:underline">+ Add color</button>
          </div>
          {form.colors.map((color, i) => (
            <div key={i} className="flex items-center gap-2">
              <input value={color} onChange={(e) => updateField("colors", i, e.target.value)} placeholder="e.g., Black, White, Navy"
                className="flex-1 h-10 px-3 text-sm bg-transparent border border-border rounded-lg outline-none focus:border-foreground transition-colors" />
              <button type="button" onClick={() => removeField("colors", i)}
                className="size-8 rounded-lg hover:bg-muted transition-colors flex items-center justify-center">
                <X className="size-4 text-muted-foreground" />
              </button>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3 pt-4">
          <button type="submit" disabled={loading}
            className="h-10 px-6 rounded-lg bg-foreground text-background text-xs font-semibold uppercase tracking-widest hover:opacity-90 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center gap-2">
            {loading ? <><Loader2 className="size-4 animate-spin" /> Saving...</> : "Save Changes"}
          </button>
          <Link href="/admin/products"
            className="h-10 px-6 rounded-lg border border-border text-xs font-semibold uppercase tracking-widest hover:bg-muted transition-all flex items-center">
            Cancel
          </Link>
        </div>
      </motion.form>
    </motion.div>
  );
}