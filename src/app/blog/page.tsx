"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Calendar } from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  image: string | null;
  createdAt: string;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/blog")
      .then((r) => r.json())
      .then((data) => { setPosts(data.posts); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring" as const, damping: 20, stiffness: 100 } },
  };

  return (
    <div className="min-h-dvh px-6 py-24">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto"
      >
        <motion.div variants={itemVariants} className="text-center mb-16">
          <span className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground font-medium">
            Journal
          </span>
          <h1 className="mt-4 text-4xl font-bold tracking-tight">The Sneakora Blog</h1>
          <p className="mt-4 text-muted-foreground max-w-md mx-auto">
            Stories, style guides, and the latest from the world of sneakers.
          </p>
        </motion.div>

        {loading ? (
          <div className="grid gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse rounded-xl border border-border/50 bg-card overflow-hidden flex flex-col sm:flex-row"
              >
                <div className="sm:w-48 h-48 sm:h-auto shrink-0 bg-muted/30" />
                <div className="flex-1 p-6 space-y-3">
                  <div className="h-3 bg-muted/30 rounded w-32" />
                  <div className="h-6 bg-muted/40 rounded w-3/4" />
                  <div className="h-4 bg-muted/30 rounded w-full" />
                  <div className="h-4 bg-muted/30 rounded w-5/6" />
                  <div className="h-3 bg-muted/30 rounded w-20" />
                </div>
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground">No posts yet.</p>
            <p className="text-xs text-muted-foreground mt-2">Check back soon for new content.</p>
          </div>
        ) : (
          <div className="grid gap-8">
            {posts.map((post, i) => (
              <motion.article
                key={post.id}
                variants={itemVariants}
                className="group rounded-xl border border-border/50 bg-card overflow-hidden hover:shadow-md transition-all"
              >
                <Link href={`/blog/${post.slug}`} className="flex flex-col sm:flex-row">
                  {post.image && (
                    <div className="sm:w-48 h-48 sm:h-auto shrink-0">
                      <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex-1 p-6 flex flex-col justify-center">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="size-3" />
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h2 className="text-lg font-semibold group-hover:text-accent transition-colors">
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
                    )}
                    <div className="mt-4 flex items-center gap-1.5 text-xs font-medium text-accent">
                      Read More <ArrowRight className="size-3" />
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}