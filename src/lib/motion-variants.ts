"use client";

import { Variants } from "framer-motion";
import { MOTION_DURATION, MOTION_EASING, REDUCED_TRANSITION } from "./motion";

/** Use when motion is disabled to avoid any transform/opacity animation */
const noMotionVariants: Variants = {
  hidden: {},
  visible: {},
  exit: {},
};


/** Fade up with optional stagger for children. Use with reduced-motion check in component. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: MOTION_DURATION.normal,
      ease: MOTION_EASING.easeOut,
      delay: i * 0.05,
    },
  }),
  exit: { opacity: 0, y: 8, transition: { duration: MOTION_DURATION.fast } },
};

/** Stagger container: use with staggerChildren on parent. */
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.05,
    },
  },
};

/** Stagger child: use inside staggerContainer. */
export const staggerChild: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: MOTION_DURATION.normal, ease: MOTION_EASING.easeOut } },
};

/** Scale in (for modals/cards). */
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: MOTION_DURATION.normal, ease: MOTION_EASING.easeOut },
  },
  exit: { opacity: 0, scale: 0.98, transition: { duration: MOTION_DURATION.fast } },
};

/** Fade only (for overlays / page transitions). */
export const fade: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: MOTION_DURATION.normal } },
  exit: { opacity: 0, transition: { duration: MOTION_DURATION.fast } },
};

/** Get variants that respect prefers-reduced-motion. Call from component with useReducedMotion(). */
export function getVariantsRespectingReducedMotion<T extends Variants>(variants: T, reduced: boolean): T {
  if (reduced) return noMotionVariants as T;
  return variants;
}

/** Use usePrefersReducedMotion from @/hooks/use-prefers-reduced-motion in components. */
