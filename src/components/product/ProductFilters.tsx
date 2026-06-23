"use client";

const categories = [
  { value: "", label: "All" },
  { value: "men", label: "Men" },
  { value: "women", label: "Women" },
  { value: "kids", label: "Kids" },
  { value: "sports", label: "Sports" },
  { value: "casual", label: "Casual" },
  { value: "running", label: "Running" },
  { value: "basketball", label: "Basketball" },
  { value: "training", label: "Training" },
  { value: "lifestyle", label: "Lifestyle" },
];

const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low → High" },
  { value: "price-desc", label: "Price: High → Low" },
  { value: "name", label: "Name A→Z" },
];

function buildUrl(overrides: Record<string, string>, current: string): string {
  const params = new URLSearchParams(current);
  for (const [k, v] of Object.entries(overrides)) {
    if (v) params.set(k, v);
    else params.delete(k);
  }
  params.set("page", "1");
  const qs = params.toString();
  return qs ? `/shop?${qs}` : "/shop";
}

export function ProductFilters({
  searchParams: sp,
}: {
  searchParams: Record<string, string | undefined>;
}) {
  const currentCategory = sp.category || "";
  const currentSort = sp.sort || "newest";
  const currentSearch = sp.search || "";
  const qs = new URLSearchParams(
    Object.entries(sp).filter((e): e is [string, string] => e[1] !== undefined)
  ).toString();

  const hasFilters = currentCategory || currentSort !== "newest" || currentSearch;

  return (
    <div className="space-y-8">
      {/* Category */}
      <div>
        <h3 className="mb-3 text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-semibold">
          Category
        </h3>
        <div className="space-y-px">
          {categories.map((cat) => {
            const href = buildUrl({ category: cat.value }, qs);
            const active = currentCategory === cat.value;
            return (
              <a
                key={cat.value}
                href={href}
                className={`block py-1.5 text-sm transition-colors duration-200 ${
                  active
                    ? "font-semibold text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat.label}
              </a>
            );
          })}
        </div>
      </div>

      {/* Sort */}
      <div>
        <h3 className="mb-3 text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-semibold">
          Sort By
        </h3>
        <div className="space-y-px">
          {sortOptions.map((opt) => {
            const href = buildUrl({ sort: opt.value }, qs);
            const active = currentSort === opt.value;
            return (
              <a
                key={opt.value}
                href={href}
                className={`block py-1.5 text-sm transition-colors duration-200 ${
                  active
                    ? "font-semibold text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {opt.label}
              </a>
            );
          })}
        </div>
      </div>

      {/* Clear */}
      {hasFilters && (
        <a
          href="/shop"
          className="inline-block text-[10px] uppercase tracking-[0.3em] text-muted-foreground underline underline-offset-4 hover:text-foreground transition-colors"
        >
          Clear Filters
        </a>
      )}
    </div>
  );
}
