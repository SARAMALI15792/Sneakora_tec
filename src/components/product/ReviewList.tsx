"use client";

import { motion } from "framer-motion";
import { Star, ThumbsUp } from "lucide-react";
import Link from "next/link";

type Review = {
  id: string;
  rating: number;
  title: string | null;
  content: string | null;
  createdAt: Date | string;
  user: {
    name: string | null;
    image: string | null;
  };
};

type ReviewListProps = {
  reviews: Review[];
  stats?: {
    total: number;
    average: number;
    distribution: Record<number, number>;
  };
  showStats?: boolean;
};

function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function StarRating({ rating, size = "sm" }: { rating: number; size?: "sm" | "lg" }) {
  const starSize = size === "lg" ? "size-5" : "size-3.5";
  return (
    <span className={`flex gap-0.5 ${size === "lg" ? "text-lg" : "text-xs"}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${starSize} ${
            star <= rating ? "fill-accent text-accent" : "text-muted-foreground/30"
          }`}
        />
      ))}
    </span>
  );
}

export function ReviewList({ reviews, stats, showStats = false }: ReviewListProps) {
  if (reviews.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground text-sm">No reviews yet. Be the first to review this product.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {showStats && stats && (
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-10">
          <div className="text-center sm:text-left">
            <div className="text-5xl font-bold font-heading">{stats.average.toFixed(1)}</div>
            <StarRating rating={Math.round(stats.average)} size="lg" />
            <p className="mt-1 text-sm text-muted-foreground">{stats.total} review{stats.total !== 1 ? "s" : ""}</p>
          </div>

          <div className="flex-1 space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = stats.distribution[rating] || 0;
              const pct = stats.total > 0 ? (count / stats.total) * 100 : 0;
              return (
                <div key={rating} className="flex items-center gap-3 text-xs">
                  <span className="w-3 text-muted-foreground">{rating}</span>
                  <Star className="size-3 text-accent fill-accent" />
                  <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-accent rounded-full transition-all duration-700"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-8 text-right text-muted-foreground">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="space-y-6">
        {reviews.map((review, index) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.4 }}
            className="border-b border-border/50 pb-6 last:border-0"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-xs font-bold uppercase">
                  {review.user.name?.[0] || "A"}
                </div>
                <div>
                  <p className="text-sm font-semibold">{review.user.name || "Anonymous"}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(review.createdAt)}</p>
                </div>
              </div>
              <StarRating rating={review.rating} />
            </div>

            {review.title && (
              <p className="mt-3 font-heading text-base font-bold">{review.title}</p>
            )}
            {review.content && (
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {review.content}
              </p>
            )}

            <div className="mt-3 flex items-center gap-4">
              <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                <ThumbsUp className="size-3" />
                Helpful
              </button>
              <Link
                href={`/shop/${review.id}`}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Report
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}