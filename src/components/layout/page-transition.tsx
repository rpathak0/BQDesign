"use client";

import { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

const noMotionVariants = { hidden: {}, visible: {}, exit: {} };

/** Wraps locale layout children for subtle page transition. Respects prefers-reduced-motion. */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const reduced = usePrefersReducedMotion();
  // Use variants that never add inline styles so server and client HTML match (avoids hydration error)
  const variants = noMotionVariants;

  return (
    <div className="min-h-full w-full max-w-[100vw] overflow-x-hidden">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={pathname}
          initial={false}
          animate="visible"
          exit="exit"
          variants={variants}
          transition={reduced ? { duration: 0 } : undefined}
          className="min-h-full"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
