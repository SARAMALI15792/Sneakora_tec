"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { ArrowLeft, Plus, X, Loader2 } from "lucide-react";
import Link from "next/link";

const categories = [
  "men", "women", "kids", "sports", "casual",
  "running", "basketball", "training", "lifestyle",
];

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
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

  function addField(field: "images" | "sizes" | "colors") {
    setForm((prev) => ({ ...prev, [field]: [...prev[field], ""] }));
  }

  function removeField(field: "images" | "sizes" | "colors", index: number) {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  }

  function updateField(
    field: "images" | "sizes" | "colors",
    index: number,
    value: string
  ) {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].map((v, i) => (i === index ? value : v)),
    }));
  }

  function generateSlug(name: string) {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const body = {
      name: form.name,
      slug: form.slug || generateSlug(form.name),
      description: form.description || undefined,
      price: parseFloat(form.price),
      compareAt: form.compareAt ? parseFloat(form.compareAt) : undefined,
      category: form.category,
      stock: parseInt(form.stock),
      featured: form.featured,
      images: form.images.filter(Boolean),
      sizes: form.sizes.filter(Boolean),
      colors: form.colors.filter(Boolean),
    };

    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create product");
      }

      toast.success("Product created");
      router.push("/admin/products");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create product");
    } finally {
      setLoading(false);
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.06 },
    },
  };

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
      variants={containerVariants}
      initial="hidden"
      animate="visible"
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
        <h1 className="text-2xl font-bold tracking-tight">New Product</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Add a new product to your catalog.
        </p>
      </motion.div>

      <motion.form
        variants={itemVariants}
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        {/* Name & Slug */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs uppercase tracking-widest font-medium text-muted-foreground">
              Name *
            </label>
            <input
              required
              value={form.name}
              onChange={(e) => {
                setForm((prev) => ({ ...prev, name: e.target.value }));
                if (!form.slug) setForm((prev) => ({ ...prev, slug: generateSlug(e.target.value) }));
              }}
              className="w-full h-10 px-3 text-sm bg-transparent border border-border rounded-lg outline-none focus:border-foreground transition-colors"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs uppercase tracking-widest font-medium text-muted-foreground">
              Slug
            </label>
            <input
              value={form.slug}
              onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))}
              className="w-full h-10 px-3 text-sm bg-transparent border border-border rounded-lg outline-none focus:border-foreground transition-colors"
            />
          </div>
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <label className="text-xs uppercase tracking-widest font-medium text-muted-foreground">
            Description
          </label>
          <textarea
            rows={3}
            value={form.description}
            onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
            className="w-full px-3 py-2 text-sm bg-transparent border border-border rounded-lg outline-none focus:border-foreground transition-colors resize-none"
          />
        </div>

        {/* Price & Compare At */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs uppercase tracking-widest font-medium text-muted-foreground">
              Price * ($)
            </label>
            <input
              required
              type="number"
              step="0.01"
              min="0"
              value={form.price}
              onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))}
              className="w-full h-10 px-3 text-sm bg-transparent border border-border rounded-lg outline-none focus:border-foreground transition-colors"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs uppercase tracking-widest font-medium text-muted-foreground">
              Compare At ($)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={form.compareAt}
              onChange={(e) => setForm((prev) => ({ ...prev, compareAt: e.target.value }))}
              className="w-full h-10 px-3 text-sm bg-transparent border border-border rounded-lg outline-none focus:border-foreground transition-colors"
            />
          </div>
        </div>

        {/* Category & Stock */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs uppercase tracking-widest font-medium text-muted-foreground">
              Category *
            </label>
            <select
              required
              value={form.category}
              onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
              className="w-full h-10 px-3 text-sm bg-transparent border border-border rounded-lg outline-none focus:border-foreground transition-colors"
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs uppercase tracking-widest font-medium text-muted-foreground">
              Stock
            </label>
            <input
              type="number"
              min="0"
              value={form.stock}
              onChange={(e) => setForm((prev) => ({ ...prev, stock: e.target.value }))}
              className="w-full h-10 px-3 text-sm bg-transparent border border-border rounded-lg outline-none focus:border-foreground transition-colors"
            />
          </div>
        </div>

        {/* Featured */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="featured"
            checked={form.featured}
            onChange={(e) => setForm((prev) => ({ ...prev, featured: e.target.checked }))}
            className="size-4 rounded border-border"
          />
          <label htmlFor="featured" className="text-sm">
            Featured product
          </label>
        </div>

        {/* Images */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs uppercase tracking-widest font-medium text-muted-foreground">
              Image URLs
            </label>
            <button
              type="button"
              onClick={() => addField("images")}
              className="text-xs text-accent hover:underline"
            >
              + Add image
            </button>
          </div>
          {form.images.map((url, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                value={url}
                onChange={(e) => updateField("images", i, e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="flex-1 h-10 px-3 text-sm bg-transparent border border-border rounded-lg outline-none focus:border-foreground transition-colors"
              />
              <button
                type="button"
                onClick={() => removeField("images", i)}
                className="size-8 rounded-lg hover:bg-muted transition-colors flex items-center justify-center"
              >
                <X className="size-4 text-muted-foreground" />
              </button>
            </div>
          ))}
        </div>

        {/* Sizes */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs uppercase tracking-widest font-medium text-muted-foreground">
              Sizes
            </label>
            <button
              type="button"
              onClick={() => addField("sizes")}
              className="text-xs text-accent hover:underline"
            >
              + Add size
            </button>
          </div>
          {form.sizes.map((size, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                value={size}
                onChange={(e) => updateField("sizes", i, e.target.value)}
                placeholder="e.g., US 9, M, 42"
                className="flex-1 h-10 px-3 text-sm bg-transparent border border-border rounded-lg outline-none focus:border-foreground transition-colors"
              />
              <button
                type="button"
                onClick={() => removeField("sizes", i)}
                className="size-8 rounded-lg hover:bg-muted transition-colors flex items-center justify-center"
              >
                <X className="size-4 text-muted-foreground" />
              </button>
            </div>
          ))}
        </div>

        {/* Colors */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs uppercase tracking-widest font-medium text-muted-foreground">
              Colors
            </label>
            <button
              type="button"
              onClick={() => addField("colors")}
              className="text-xs text-accent hover:underline"
            >
              + Add color
            </button>
          </div>
          {form.colors.map((color, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                value={color}
                onChange={(e) => updateField("colors", i, e.target.value)}
                placeholder="e.g., Black, White, Navy"
                className="flex-1 h-10 px-3 text-sm bg-transparent border border-border rounded-lg outline-none focus:border-foreground transition-colors"
              />
              <button
                type="button"
                onClick={() => removeField("colors", i)}
                className="size-8 rounded-lg hover:bg-muted transition-colors flex items-center justify-center"
              >
                <X className="size-4 text-muted-foreground" />
              </button>
            </div>
          ))}
        </div>

        {/* Submit */}
        <div className="flex items-center gap-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="h-10 px-6 rounded-lg bg-foreground text-background text-xs font-semibold uppercase tracking-widest hover:opacity-90 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Product"
            )}
          </button>
          <Link
            href="/admin/products"
            className="h-10 px-6 rounded-lg border border-border text-xs font-semibold uppercase tracking-widest hover:bg-muted transition-all flex items-center"
          >
            Cancel
          </Link>
        </div>
      </motion.form>
    </motion.div>
  );
}