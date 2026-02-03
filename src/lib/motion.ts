/**
 * Shared animation config: durations, easing, springs.
 * Respect prefers-reduced-motion by using these values only when motion is allowed.
 */

export const MOTION_DURATION = {
  fast: 0.15,
  normal: 0.25,
  slow: 0.4,
} as const;

export const MOTION_EASING = {
  easeOut: [0.16, 1, 0.3, 1],
  easeInOut: [0.65, 0, 0.35, 1],
  easeOutExpo: [0.19, 1, 0.22, 1],
} as const;

export const MOTION_SPRING = {
  gentle: { type: "spring" as const, stiffness: 300, damping: 30 },
  snappy: { type: "spring" as const, stiffness: 400, damping: 28 },
  bouncy: { type: "spring" as const, stiffness: 260, damping: 20 },
} as const;

/** Use when prefers-reduced-motion: reduce — no or minimal motion */
export const REDUCED_TRANSITION = {
  duration: 0,
  delay: 0,
} as const;

export function getReducedMotionTransition() {
  if (typeof window === "undefined") return REDUCED_TRANSITION;
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  return prefersReduced ? REDUCED_TRANSITION : undefined;
}
