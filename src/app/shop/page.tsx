"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Filter, X, Search, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { RecentlyViewed } from "@/components/product/RecentlyViewed";

const categories = [
  { name: "Men", value: "men" },
  { name: "Women", value: "women" },
  { name: "Running", value: "running" },
  { name: "Basketball", value: "basketball" },
  { name: "Casual", value: "casual" },
  { name: "Training", value: "training" },
  { name: "Kids", value: "kids" },
  { name: "Lifestyle", value: "lifestyle" },
];

const sizes = [
  { name: "US 6", value: "6" },
  { name: "US 7", value: "7" },
  { name: "US 8", value: "8" },
  { name: "US 9", value: "9" },
  { name: "US 10", value: "10" },
  { name: "US 11", value: "11" },
  { name: "US 12", value: "12" },
];

const colors = [
  { name: "Black", value: "black" },
  { name: "White", value: "white" },
  { name: "Navy", value: "navy" },
  { name: "Grey", value: "grey" },
  { name: "Red", value: "red" },
  { name: "Blue", value: "blue" },
  { name: "Green", value: "green" },
  { name: "Orange", value: "orange" },
];

const sortOptions = [
  { name: "Newest", value: "newest" },
  { name: "Price: Low to High", value: "price-asc" },
  { name: "Price: High to Low", value: "price-desc" },
  { name: "Name", value: "name" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring" as const,
      damping: 15,
      stiffness: 100,
    },
  },
};

const buttonVariants = {
  hover: {
    scale: 1.02,
    transition: {
      type: "spring" as const,
      stiffness: 400,
      damping: 10,
    },
  },
  tap: {
    scale: 0.98,
    transition: {
      type: "spring" as const,
      stiffness: 500,
      damping: 20,
    },
  },
};

export default function ShopPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchProducts();
  }, [searchTerm, selectedCategories, selectedSizes, selectedColors, priceRange, sortBy, page]);

  async function fetchProducts() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.set("search", searchTerm);
      if (selectedCategories.length > 0) params.set("category", selectedCategories.join(","));
      if (selectedSizes.length > 0) params.set("sizes", selectedSizes.join(","));
      if (selectedColors.length > 0) params.set("colors", selectedColors.join(","));
      if (priceRange[0] > 0) params.set("minPrice", priceRange[0].toString());
      if (priceRange[1] < 500) params.set("maxPrice", priceRange[1].toString());
      params.set("sort", sortBy);
      params.set("page", page.toString());

      const res = await fetch(`/api/products?${params.toString()}`);
      const data = await res.json();
      setProducts(data.products);
      setTotalPages(data.pagination.totalPages);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  }

  function toggleCategory(category: string) {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  }

  function toggleSize(size: string) {
    setSelectedSizes((prev) =>
      prev.includes(size)
        ? prev.filter((s) => s !== size)
        : [...prev, size]
    );
  }

  function toggleColor(color: string) {
    setSelectedColors((prev) =>
      prev.includes(color)
        ? prev.filter((c) => c !== color)
        : [...prev, color]
    );
  }

  function handlePriceChange(value: number | readonly number[]) {
    if (Array.isArray(value)) {
      setPriceRange([value[0], value[1]]);
    }
  }

  function clearFilters() {
    setSearchTerm("");
    setSelectedCategories([]);
    setSelectedSizes([]);
    setSelectedColors([]);
    setPriceRange([0, 500]);
    setSortBy("newest");
    setPage(1);
  }

  return (
    <div className="pt-20">
      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* Recently Viewed */}
        <RecentlyViewed />

        {/* Header */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mt-16 flex flex-col md:flex-row md:items-center md:justify-between"
        >
          <motion.div variants={itemVariants}>
            <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
              Shop
            </p>
            <h1 className="font-heading mt-2 text-4xl font-bold tracking-tight">
              Premium Sneakers
            </h1>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="mt-6 md:mt-0 flex items-center gap-4"
          >
            <div className="relative flex-1 md:flex-none md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search sneakers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 h-10 bg-background/50 border-border/50 focus:border-accent/50 transition-all duration-300"
              />
            </div>

            <motion.button
              whileHover="hover"
              whileTap="tap"
              variants={buttonVariants}
              onClick={() => setFiltersOpen(!filtersOpen)}
              className={`inline-flex h-10 items-center gap-2 px-4 text-xs font-semibold uppercase tracking-widest transition-all duration-300 ${filtersOpen ? "bg-accent text-accent-foreground" : "bg-foreground text-background hover:opacity-90"}`}
            >
              <Filter className="size-4" />
              {filtersOpen ? "Hide Filters" : "Filters"}
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Filters */}
        <AnimatePresence>
          {filtersOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-8 overflow-hidden rounded-xl border border-border/50 bg-background/50 p-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Categories */}
                <div>
                  <Label className="text-sm font-medium">Categories</Label>
                  <div className="mt-3 space-y-2">
                    {categories.map((category) => (
                      <div key={category.value} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={`category-${category.value}`}
                          checked={selectedCategories.includes(category.value)}
                          onChange={() => toggleCategory(category.value)}
                          className="size-4 rounded border-border text-accent focus:ring-accent"
                        />
                        <Label htmlFor={`category-${category.value}`} className="text-sm">
                          {category.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sizes */}
                <div>
                  <Label className="text-sm font-medium">Sizes</Label>
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {sizes.map((size) => (
                      <button
                        key={size.value}
                        type="button"
                        onClick={() => toggleSize(size.value)}
                        className={`h-10 rounded-full border text-xs font-medium transition-all duration-200 ${selectedSizes.includes(size.value)
                          ? "bg-accent text-accent-foreground border-accent/50"
                          : "border-border hover:bg-muted"
                        }`}
                      >
                        {size.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Colors */}
                <div>
                  <Label className="text-sm font-medium">Colors</Label>
                  <div className="mt-3 grid grid-cols-4 gap-2">
                    {colors.map((color) => (
                      <button
                        key={color.value}
                        type="button"
                        onClick={() => toggleColor(color.value)}
                        className={`h-10 rounded-full border text-xs font-medium transition-all duration-200 ${selectedColors.includes(color.value)
                          ? "ring-2 ring-accent ring-offset-2"
                          : "border-border hover:bg-muted"
                        }`}
                        style={{ backgroundColor: color.value }}
                      />
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <Label className="text-sm font-medium">Price Range</Label>
                  <div className="mt-3 space-y-4">
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium">
                        ${priceRange[0]}
                      </span>
                      <Slider
                        min={0}
                        max={500}
                        step={10}
                        value={priceRange}
                        onValueChange={handlePriceChange}
                        className="flex-1"
                      />
                      <span className="text-sm font-medium">
                        ${priceRange[1]}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>$0</span>
                      <span>$500+</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <motion.button
                  whileHover="hover"
                  whileTap="tap"
                  variants={buttonVariants}
                  onClick={clearFilters}
                  className="inline-flex h-9 items-center gap-2 px-4 text-xs font-semibold uppercase tracking-widest border border-border hover:bg-muted transition-all duration-300 active:scale-[0.98]"
                >
                  Clear All
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sort and Results */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mt-10 flex flex-col md:flex-row md:items-center md:justify-between"
        >
          <motion.div variants={itemVariants} className="text-sm text-muted-foreground">
            Showing {products.length} products
          </motion.div>

          <motion.div variants={itemVariants} className="mt-4 md:mt-0 flex items-center gap-4">
            <Label htmlFor="sort" className="text-sm font-medium">
              Sort by:
            </Label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-9 rounded-md border border-border bg-background px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-accent"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.name}
                </option>
              ))}
            </select>
          </motion.div>
        </motion.div>

        {/* Products Grid */}
        {loading ? (
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="animate-pulse rounded-xl border border-border/50 bg-card overflow-hidden">
                <div className="aspect-square bg-muted/30" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-muted/40 rounded w-3/4" />
                  <div className="h-3 bg-muted/30 rounded w-1/2" />
                  <div className="flex items-center justify-between pt-2">
                    <div className="h-5 bg-muted/40 rounded w-20" />
                    <div className="h-4 bg-muted/30 rounded w-12" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {products.map((product) => (
              <motion.div key={product.id} variants={itemVariants}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-16 text-center py-16"
          >
            <p className="text-lg text-muted-foreground">No products found matching your criteria.</p>
            <motion.button
              whileHover="hover"
              whileTap="tap"
              variants={buttonVariants}
              onClick={clearFilters}
              className="mt-6 inline-flex h-10 items-center gap-2 px-4 text-xs font-semibold uppercase tracking-widest bg-foreground text-background hover:opacity-90 transition-all duration-300 active:scale-[0.98]"
            >
              Clear Filters
            </motion.button>
          </motion.div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mt-16 flex items-center justify-center gap-2"
          >
            <motion.button
              whileHover="hover"
              whileTap="tap"
              variants={buttonVariants}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className={`inline-flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold uppercase tracking-widest transition-all duration-300 ${page === 1 ? "bg-muted text-muted-foreground" : "bg-foreground text-background hover:opacity-90"}`}
            >
              <ArrowLeft className="size-4" />
            </motion.button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <motion.button
                key={p}
                whileHover="hover"
                whileTap="tap"
                variants={buttonVariants}
                onClick={() => setPage(p)}
                className={`inline-flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold uppercase tracking-widest transition-all duration-300 ${p === page ? "bg-accent text-accent-foreground" : "bg-foreground text-background hover:opacity-90"}`}
              >
                {p}
              </motion.button>
            ))}

            <motion.button
              whileHover="hover"
              whileTap="tap"
              variants={buttonVariants}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className={`inline-flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold uppercase tracking-widest transition-all duration-300 ${page === totalPages ? "bg-muted text-muted-foreground" : "bg-foreground text-background hover:opacity-90"}`}
            >
              <ArrowRight className="size-4" />
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
