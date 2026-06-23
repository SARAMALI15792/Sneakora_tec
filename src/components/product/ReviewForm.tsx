"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

export function ReviewForm({ productId, onReviewAdded }: { productId: string; onReviewAdded?: () => void }) {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const { data: session } = await authClient.getSession();
    if (!session) {
      router.push("/sign-in");
      return;
    }

    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, rating, title: title || undefined, content: content || undefined }),
      });

      if (res.ok) {
        toast.success("Review submitted");
        setRating(0);
        setTitle("");
        setContent("");
        onReviewAdded?.();
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to submit review");
      }
    } catch {
      toast.error("Something went wrong");
    }
    setSubmitting(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-semibold mb-2">
          Rating
        </p>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="text-muted-foreground hover:text-accent transition-colors"
            >
              <Star
                className={`size-5 ${
                  star <= (hoverRating || rating)
                    ? "fill-accent text-accent"
                    : ""
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <div>
        <input
          type="text"
          placeholder="Review title (optional)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-border bg-transparent px-4 py-2.5 text-sm outline-none focus:border-foreground transition-colors"
          maxLength={100}
        />
      </div>

      <div>
        <textarea
          placeholder="Write your review..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full border border-border bg-transparent px-4 py-2.5 text-sm outline-none focus:border-foreground transition-colors resize-none"
          rows={3}
          maxLength={1000}
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex h-10 items-center px-5 text-[10px] font-semibold uppercase tracking-widest bg-foreground text-background hover:opacity-90 transition-all disabled:opacity-50"
      >
        {submitting ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}
