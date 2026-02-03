"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { SafeImage } from "@/components/shared/safe-image";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

interface EventGalleryProps {
  images: string[];
  title: string;
  className?: string;
}

export function EventGallery({ images, title, className }: EventGalleryProps) {
  const [index, setIndex] = useState(0);
  const reduced = usePrefersReducedMotion();
  const list = images.length ? images : ["/assets/hero-bg.png"];

  const go = (dir: number) => {
    setIndex((i) => (i + dir + list.length) % list.length);
  };

  return (
    <div className={cn("relative overflow-hidden rounded-xl bg-muted", className)}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={index}
          initial={reduced ? false : { opacity: 0.6 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0.6 }}
          transition={{ duration: 0.2 }}
          className="relative aspect-[21/9] md:aspect-[3/1] w-full"
        >
          <SafeImage
            src={list[index]}
            alt={`${title} – image ${index + 1}`}
            className="w-full h-full object-cover"
            loading={index === 0 ? "eager" : "lazy"}
          />
        </motion.div>
      </AnimatePresence>
      {list.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => go(-1)}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Next image"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
            {list.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                className={cn(
                  "w-2 h-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-transparent",
                  i === index ? "bg-primary" : "bg-white/60 hover:bg-white/80"
                )}
                aria-label={`Go to image ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
