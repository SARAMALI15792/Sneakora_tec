"use client";

import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Search, Clock, ArrowRight, Calendar, X, Tag, Loader2, FileText, AlertCircle } from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  image: string | null;
  createdAt: string;
}



const CATEGORY_KEYWORDS: [RegExp, string][] = [
  [/guide|how to|tips|101|choosing|breaking/i, "Guides & Tips"],
  [/trends|history|culture|season/i, "Culture & Trends"],
  [/top|best|picks|review/i, "Reviews & Picks"],
  [/care|maintenance|clean|wash|dry/i, "Care & Maintenance"],
  [/sustainable|eco|green|environment/i, "Sustainability"],
  [/style|outfit|fashion|wear/i, "Style & Fashion"],
];

function inferCategory(title: string): string {
  for (const [pattern, category] of CATEGORY_KEYWORDS) {
    if (pattern.test(title)) return category;
  }
  return "Stories";
}

function getCategories(posts: BlogPost[]): string[] {
  const cats = new Set(posts.map((p) => inferCategory(p.title)));
  return Array.from(cats).sort();
}

function getReadingTime(content: string | null, excerpt: string | null): number {
  const text = content || excerpt || "";
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const shimmer = `absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent`;

function SkeletonCard() {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border/20 bg-card/40">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted/30">
        <div className={shimmer} />
      </div>
      <div className="p-5 space-y-3">
        <div className="flex gap-3">
          <div className="h-3 w-20 rounded-full bg-muted/30 relative overflow-hidden">
            <div className={shimmer} />
          </div>
          <div className="h-3 w-16 rounded-full bg-muted/20 relative overflow-hidden">
            <div className={shimmer} />
          </div>
        </div>
        <div className="h-5 w-3/4 rounded-lg bg-muted/30 relative overflow-hidden">
          <div className={shimmer} />
        </div>
        <div className="space-y-2">
          <div className="h-3 w-full rounded bg-muted/20 relative overflow-hidden">
            <div className={shimmer} />
          </div>
          <div className="h-3 w-2/3 rounded bg-muted/20 relative overflow-hidden">
            <div className={shimmer} />
          </div>
        </div>
      </div>
    </div>
  );
}

function HeroSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-muted/20 border border-border/20">
      <div className="aspect-[2/1] md:aspect-[3/1] relative overflow-hidden bg-muted/30">
        <div className={shimmer} />
      </div>
      <div className="p-6 md:p-8 space-y-4">
        <div className="h-3 w-32 rounded-full bg-muted/30 relative overflow-hidden">
          <div className={shimmer} />
        </div>
        <div className="h-8 w-3/4 rounded-lg bg-muted/30 relative overflow-hidden">
          <div className={shimmer} />
        </div>
        <div className="h-4 w-1/2 rounded bg-muted/20 relative overflow-hidden">
          <div className={shimmer} />
        </div>
      </div>
    </div>
  );
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { y: 30, opacity: 0, scale: 0.96 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: { type: "spring" as const, damping: 25, stiffness: 120 },
  },
};

export default function BlogPage() {
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchInput), 350);
    searchRef.current?.focus();
    return () => clearTimeout(timer);
  }, [searchInput]);

  const fetchPosts = useCallback(
    async (pageNum: number, searchTerm: string, append: boolean) => {
      if (pageNum === 1) { setLoading(true); setError(""); }
      else setLoadingMore(true);
      try {
        const params = new URLSearchParams({ page: String(pageNum), limit: "6" });
        if (searchTerm) params.set("search", searchTerm);
        const res = await fetch(`/api/blog?${params}`);
        if (!res.ok) throw new Error(`Server returned ${res.status}`);
        const data = await res.json();
        if (append) {
          setAllPosts((prev) => [...prev, ...data.posts]);
        } else {
          setAllPosts(data.posts);
        }
        setHasMore(data.pagination.page < data.pagination.totalPages);
        setPage(pageNum);
      } catch (err) {
        console.error("[Blog] Failed to fetch posts:", err);
        setError(err instanceof Error ? err.message : "Failed to load posts");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    []
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchPosts(1, search, false);
  }, [search, fetchPosts]);

  const posts = useMemo(() => {
    if (!activeCategory) return allPosts;
    return allPosts.filter((p) => inferCategory(p.title) === activeCategory);
  }, [allPosts, activeCategory]);

  const categories = useMemo(() => getCategories(allPosts), [allPosts]);

  const featuredPost = useMemo(() => (posts.length > 0 ? posts[0] : null), [posts]);

  const remainingPosts = useMemo(() => {
    if (!featuredPost) return posts;
    return posts.filter((p) => p.id !== featuredPost.id);
  }, [posts, featuredPost]);

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      fetchPosts(page + 1, search, true);
    }
  };

  const handleCategoryClick = (cat: string) => {
    setActiveCategory((prev) => (prev === cat ? "" : cat));
  };

  const clearSearch = () => {
    setSearchInput("");
    setSearch("");
  };

  return (
    <div className="min-h-dvh px-4 sm:px-6 py-24 sm:py-28">
      <div className="mx-auto max-w-6xl">
        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
          className="text-center mb-12"
        >
          <span className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground font-medium">
            Journal
          </span>
          <h1 className="mt-4 text-4xl sm:text-5xl font-bold tracking-tight">
            The Sneakora Blog
          </h1>
          <p className="mt-4 text-muted-foreground max-w-lg mx-auto text-sm sm:text-base">
            Stories, style guides, and the latest from the world of sneakers.
          </p>
        </motion.div>

        {/* ── Search + Filters ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.32, 0.72, 0, 1] }}
          className="mb-10 space-y-4"
        >
          {/* Search */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
            <input
              ref={searchRef}
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search articles..."
              className="w-full h-11 pl-11 pr-10 rounded-xl border border-border/40 bg-card/50 text-sm text-foreground placeholder:text-muted-foreground/50 backdrop-blur-sm focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all"
            />
            {searchInput && (
              <button onClick={clearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                <X className="size-4" />
              </button>
            )}
          </div>

          {/* Categories */}
          {categories.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryClick(cat)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-medium uppercase tracking-wider transition-all duration-300 ${
                    activeCategory === cat
                      ? "bg-accent text-accent-foreground shadow-lg shadow-accent/20"
                      : "bg-card/50 border border-border/30 text-muted-foreground hover:border-accent/30 hover:text-foreground"
                  }`}
                >
                  <Tag className="size-3" />
                  {cat}
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* ── Loading State ── */}
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            <HeroSkeleton />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          </motion.div>
        ) : error ? (
          /* ── Error State ── */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-24"
          >
            <div className="mx-auto size-16 rounded-2xl bg-destructive/10 flex items-center justify-center mb-6 ring-1 ring-destructive/20">
              <AlertCircle className="size-6 text-destructive" />
            </div>
            <h2 className="text-xl font-semibold">Failed to load posts</h2>
            <p className="text-sm text-muted-foreground mt-2 max-w-xs mx-auto">{error}</p>
            <button
              onClick={() => fetchPosts(1, search, false)}
              className="mt-6 inline-flex h-10 items-center gap-2 rounded-full border border-border/40 bg-card/50 px-6 text-xs font-semibold uppercase tracking-widest backdrop-blur-sm transition-all hover:border-accent/30 hover:bg-card/60"
            >
              <Loader2 className="size-3" />
              Retry
            </button>
          </motion.div>
        ) : posts.length === 0 ? (
          /* ── Empty State ── */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-24"
          >
            <div className="mx-auto size-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-6 ring-1 ring-border/20">
              <Search className="size-6 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold">No articles found</h2>
            <p className="text-sm text-muted-foreground mt-2 max-w-xs mx-auto">
              {search
                ? `No results for "${search}". Try a different search term.`
                : "No posts yet. Check back soon for new content."}
            </p>
            {search && (
              <button
                onClick={clearSearch}
                className="mt-4 text-xs font-semibold uppercase tracking-widest text-accent hover:underline"
              >
                Clear search
              </button>
            )}
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-10"
          >
            {/* ── Featured Hero ── */}
            {featuredPost && (
              <motion.div variants={itemVariants}>
                <Link
                  href={`/blog/${featuredPost.slug}`}
                  className="group relative block overflow-hidden rounded-2xl border border-border/20 bg-card/40 backdrop-blur-sm hover:border-accent/20 transition-all duration-500"
                >
                  <div className="grid md:grid-cols-5">
                    <div className="relative md:col-span-3 aspect-[4/3] md:aspect-auto md:min-h-[320px] overflow-hidden bg-muted/30">
                      {featuredPost.image ? (
                        <>
                          <Image
                            src={featuredPost.image}
                            alt={featuredPost.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 60vw"
                            priority
                            loading="eager"
                            className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/10 to-transparent md:bg-gradient-to-r md:from-background/90 md:via-background/40 md:to-transparent" />
                        </>
                      ) : (
                          <div className="flex h-full items-center justify-center">
                            <FileText className="size-12 text-foreground/10" />
                          </div>
                      )}
                    </div>
                    <div className="relative md:col-span-2 p-6 md:p-8 flex flex-col justify-center">
                      <div className="space-y-1 mb-3 flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-accent/15 text-[10px] font-semibold uppercase tracking-wider text-accent">
                          Featured
                        </span>
                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                          {inferCategory(featuredPost.title)}
                        </span>
                      </div>
                      <h2 className="text-xl md:text-2xl font-bold leading-tight group-hover:text-accent transition-colors duration-300">
                        {featuredPost.title}
                      </h2>
                      {featuredPost.excerpt && (
                        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                          {featuredPost.excerpt}
                        </p>
                      )}
                      <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="size-3" />
                          {formatDate(featuredPost.createdAt)}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="size-3" />
                          {getReadingTime(featuredPost.content, featuredPost.excerpt)} min read
                        </span>
                      </div>
                      <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-accent group-hover:gap-2.5 transition-all">
                        Read Article <ArrowRight className="size-3" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )}

            {/* ── Post Grid ── */}
            {remainingPosts.length > 0 && (
              <>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {remainingPosts.map((post) => (
                    <motion.article key={post.id} variants={itemVariants}>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/20 bg-card/40 backdrop-blur-sm hover:bg-card/60 hover:border-accent/20 hover:shadow-lg hover:shadow-accent/5 transition-all duration-500"
                      >
                        {/* Image */}
                        <div className="relative aspect-[4/3] overflow-hidden bg-muted/30">
                          {post.image ? (
                            <Image
                              src={post.image}
                              alt={post.title}
                              fill
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                              className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center">
                              <FileText className="size-10 text-foreground/10" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        </div>

                        {/* Content */}
                        <div className="flex flex-1 flex-col p-5">
                          <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
                            <span className="text-accent font-semibold">
                              {inferCategory(post.title)}
                            </span>
                            <span className="opacity-30">·</span>
                            <span className="flex items-center gap-1">
                              <Clock className="size-3" />
                              {getReadingTime(post.content, post.excerpt)} min
                            </span>
                          </div>

                          <h2 className="text-base font-bold leading-snug group-hover:text-accent transition-colors duration-300 line-clamp-2">
                            {post.title}
                          </h2>

                          {post.excerpt && (
                            <p className="mt-2 text-xs text-muted-foreground leading-relaxed line-clamp-2 flex-1">
                              {post.excerpt}
                            </p>
                          )}

                          <div className="mt-4 flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">
                              {formatDate(post.createdAt)}
                            </span>
                            <span className="flex items-center gap-1 text-accent font-medium opacity-0 translate-x-[-4px] group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                              Read <ArrowRight className="size-3" />
                            </span>
                          </div>
                        </div>
                      </Link>
                    </motion.article>
                  ))}
                </div>

                {/* ── Load More ── */}
                {hasMore && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex justify-center pt-4"
                  >
                    <button
                      onClick={handleLoadMore}
                      disabled={loadingMore}
                      className="group inline-flex h-11 items-center gap-2 rounded-full border border-border/40 bg-card/30 px-8 text-xs font-semibold uppercase tracking-widest backdrop-blur-sm transition-all hover:border-accent/30 hover:bg-card/60 hover:shadow-lg hover:shadow-accent/5 active:scale-[0.98] disabled:opacity-50"
                    >
                      {loadingMore ? (
                        <>
                          <Loader2 className="size-3.5 animate-spin" />
                          Loading...
                        </>
                      ) : (
                        <>
                          Load More
                          <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
                        </>
                      )}
                    </button>
                  </motion.div>
                )}
              </>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
