"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Star, SlidersHorizontal, ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { staggerContainer, staggerChild } from "@/lib/motion-variants";

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  text: string;
}

interface ReviewListProps {
  reviews: Review[];
  overallRating?: number;
  ratingCount?: number;
  eventTitle?: string;
  className?: string;
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-hidden>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={cn("w-4 h-4", i <= rating ? "fill-primary text-primary" : "fill-muted text-muted")}
        />
      ))}
    </div>
  );
}

function getRatingLabel(rating: number) {
  if (rating >= 4.5) return "Excellent";
  if (rating >= 4) return "Very Good";
  if (rating >= 3.5) return "Good";
  if (rating >= 3) return "Average";
  return "Fair";
}

export function ReviewList({
  reviews,
  overallRating = 0,
  ratingCount = 0,
  eventTitle,
  className,
}: ReviewListProps) {
  const reduced = usePrefersReducedMotion();
  const [sortBy, setSortBy] = useState<"recent" | "rating">("recent");
  const containerVariants = reduced ? {} : staggerContainer;
  const childVariants = reduced ? {} : staggerChild;

  const distribution = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => r.rating === star).length;
    const pct = reviews.length ? Math.round((count / reviews.length) * 100) : 0;
    return { star, count, pct };
  });

  const sortedReviews = [...reviews].sort((a, b) =>
    sortBy === "rating" ? b.rating - a.rating : 0
  );

  if (!reviews.length) {
    return (
      <div className={className}>
        <p className="text-sm text-muted-foreground">
          No reviews yet. Be the first to share your experience.
        </p>
      </div>
    );
  }

  const rating = overallRating || reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
  const count = ratingCount || reviews.length;

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-display font-semibold text-lg">
          {eventTitle ? `${eventTitle} Reviews` : "Reviews"}
        </h3>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground px-2 py-1 rounded-md border border-transparent hover:border-border"
            onClick={() => setSortBy(sortBy === "recent" ? "rating" : "recent")}
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            Sort By
          </button>
          <button
            type="button"
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground px-2 py-1 rounded-md border border-transparent hover:border-border"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Filter
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 p-4 rounded-xl bg-muted/40 border border-border/50">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-display font-bold">{rating.toFixed(1)}</span>
          <Stars rating={Math.round(rating)} />
        </div>
        <span className="text-sm font-medium text-foreground">{getRatingLabel(rating)}</span>
        <span className="text-sm text-muted-foreground">{count} Reviews</span>
      </div>

      <div className="flex flex-col gap-1 mb-4">
        {distribution.map(({ star, pct }) => (
          <div key={star} className="flex items-center gap-2 text-sm">
            <span className="w-16 shrink-0">{star} Star</span>
            <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-300"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="w-10 text-right text-muted-foreground">{pct}%</span>
          </div>
        ))}
      </div>

      <motion.ul
        className="space-y-4 list-none p-0 m-0"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-40px" }}
      >
        {sortedReviews.map((review) => (
          <motion.li
            key={review.id}
            variants={childVariants}
            className="border-b border-border/50 pb-4 last:border-0 last:pb-0"
          >
            <div className="flex items-center gap-2 mb-1">
              <Stars rating={review.rating} />
              <span className="text-sm font-medium">{review.author}</span>
              <span className="text-xs text-muted-foreground">{review.date}</span>
            </div>
            <p className="text-sm text-foreground/90">{review.text}</p>
          </motion.li>
        ))}
      </motion.ul>
    </div>
  );
}
