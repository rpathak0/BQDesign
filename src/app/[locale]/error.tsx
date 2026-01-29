"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";

const orbVariants = {
  initial: { scale: 0, opacity: 0 },
  animate: (i: number) => ({
    scale: 1,
    opacity: 1,
    transition: { delay: i * 0.08, duration: 0.5 },
  }),
  pulse: {
    scale: [1, 1.05, 1],
    opacity: [0.2, 0.35, 0.2],
    transition: { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
  },
};

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const params = useParams();
  const locale = (params?.locale as string) ?? "en";
  const base = `/${locale}`;

  useEffect(() => {
    console.error("Runtime error:", error);
  }, [error]);

  return (
    <div
      className={cn(
        "min-h-screen w-full flex items-center justify-center overflow-hidden relative",
        "bg-gradient-to-br from-primary/[0.07] via-background to-destructive/5",
        "dark:from-[#0F0F1A] dark:via-[#0a0a12] dark:to-[#09090b]"
      )}
    >
      {/* Animated background orbs - purple + subtle destructive */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            className={cn(
              "absolute rounded-full blur-3xl",
              i <= 2 ? "bg-primary/20 dark:bg-primary/15" : "bg-destructive/20 dark:bg-destructive/15",
              i === 1 && "w-72 h-72 -top-20 -right-20",
              i === 2 && "w-48 h-48 bottom-1/3 -left-16",
              i === 3 && "w-40 h-40 top-1/2 right-1/4",
              i === 4 && "w-32 h-32 bottom-24 left-1/3"
            )}
            variants={orbVariants}
            initial="initial"
            animate={["animate", "pulse"]}
            custom={i}
          />
        ))}
      </div>

      <motion.div
        className="relative z-10 w-full max-w-lg mx-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
      >
        <div
          className={cn(
            "rounded-2xl p-8 sm:p-10 text-center",
            "bg-card/95 dark:bg-[#0F0F1A]/95 backdrop-blur-xl",
            "border border-border dark:border-white/10",
            "shadow-2xl dark:shadow-[0_0_50px_rgba(124,58,237,0.18)] dark:ring-2 dark:ring-primary/20"
          )}
        >
          <motion.div
            className="mb-6 inline-flex relative"
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 180, damping: 18, delay: 0.25 }}
          >
            <div className="absolute inset-0 bg-destructive/30 dark:bg-destructive/20 blur-2xl rounded-2xl" />
            <div
              className={cn(
                "relative w-20 h-20 rounded-2xl flex items-center justify-center",
                "bg-destructive/10 dark:bg-white/5 border border-destructive/20 dark:border-white/10"
              )}
            >
              <AlertTriangle className="w-10 h-10 text-destructive dark:text-red-400" />
            </div>
          </motion.div>

          <motion.h1
            className="font-display text-2xl sm:text-3xl font-bold text-foreground dark:text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
          >
            Something went wrong
          </motion.h1>
          <motion.p
            className="mt-3 text-sm text-muted-foreground dark:text-white/60 max-w-md mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
          >
            We hit an unexpected error. You can try again or head back home.
          </motion.p>

          <motion.div
            className="mt-10 flex flex-wrap items-center justify-center gap-3"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
          >
            <Button
              size="lg"
              className="rounded-xl shadow-lg shadow-primary/25 dark:bg-primary dark:hover:bg-primary/90 gap-2"
              onClick={reset}
            >
              <RefreshCw className="w-4 h-4" />
              Try again
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-xl gap-2 border-border dark:border-white/20 dark:bg-white/5 dark:hover:bg-white/10 dark:text-white"
            >
              <Link href={base}>
                <Home className="w-4 h-4" />
                Go home
              </Link>
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
