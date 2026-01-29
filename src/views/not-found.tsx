"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, ArrowLeft, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";

const orbVariants = {
  initial: { scale: 0, opacity: 0 },
  animate: (i: number) => ({
    scale: 1,
    opacity: 1,
    transition: { delay: i * 0.1, duration: 0.6 },
  }),
  float: (i: number) => ({
    y: [0, -16, 0],
    x: [0, i % 2 === 0 ? 10 : -10, 0],
    transition: { duration: 4 + i * 0.4, repeat: Infinity, ease: "easeInOut" },
  }),
};

export default function NotFound() {
  const params = useParams();
  const locale = (params?.locale as string) ?? "en";
  const base = `/${locale}`;

  return (
    <div
      className={cn(
        "min-h-screen w-full flex items-center justify-center overflow-hidden relative",
        "bg-gradient-to-br from-primary/[0.07] via-background to-accent/10",
        "dark:from-[#0F0F1A] dark:via-[#0a0a12] dark:to-[#09090b]"
      )}
    >
      {/* Animated background orbs - theme purple/accent */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[1, 2, 3, 4, 5].map((i) => (
          <motion.div
            key={i}
            className={cn(
              "absolute rounded-full blur-3xl",
              "bg-primary/30 dark:bg-primary/25",
              i === 1 && "w-80 h-80 -top-24 -left-24",
              i === 2 && "w-56 h-56 top-1/4 -right-20",
              i === 3 && "w-48 h-48 bottom-1/3 -left-16",
              i === 4 && "w-40 h-40 bottom-20 right-1/4",
              i === 5 && "w-32 h-32 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-accent/20 dark:bg-accent/15"
            )}
            variants={orbVariants}
            initial="initial"
            animate={["animate", "float"]}
            custom={i}
          />
        ))}
      </div>

      <motion.div
        className="relative z-10 w-full max-w-lg mx-4"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {/* Glass content card - matches AI panel / cinema theme */}
        <div
          className={cn(
            "rounded-2xl p-8 sm:p-10 text-center",
            "bg-card/95 dark:bg-[#0F0F1A]/95 backdrop-blur-xl",
            "border border-border dark:border-white/10",
            "shadow-2xl dark:shadow-[0_0_50px_rgba(124,58,237,0.18)] dark:ring-2 dark:ring-primary/20"
          )}
        >
          {/* Icon */}
          <motion.div
            className="mb-6 inline-flex relative"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.3 }}
          >
            <div className="absolute inset-0 bg-primary/40 dark:bg-primary/30 blur-2xl rounded-2xl" />
            <div
              className={cn(
                "relative w-20 h-20 rounded-2xl flex items-center justify-center",
                "bg-primary/10 dark:bg-white/5 border border-primary/20 dark:border-white/10"
              )}
            >
              <SearchX className="w-10 h-10 text-primary dark:text-[#a78bfa]" />
            </div>
          </motion.div>

          {/* 404 number - gradient to match brand */}
          <motion.h1
            className="font-display text-8xl sm:text-9xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-primary via-purple-500 to-accent dark:from-primary dark:via-purple-400 dark:to-accent"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            404
          </motion.h1>

          <motion.p
            className="mt-4 text-lg sm:text-xl font-display font-semibold text-foreground dark:text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Page not found
          </motion.p>
          <motion.p
            className="mt-2 text-sm text-muted-foreground dark:text-white/60 max-w-sm mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            The page you&apos;re looking for doesn&apos;t exist or has been moved. Let&apos;s get you back on track.
          </motion.p>

          {/* Actions - themed buttons */}
          <motion.div
            className="mt-10 flex flex-wrap items-center justify-center gap-3"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Button
              asChild
              size="lg"
              className="rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/30 dark:bg-primary dark:hover:bg-primary/90 gap-2"
            >
              <Link href={base}>
                <Home className="w-4 h-4" />
                Go home
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="rounded-xl gap-2 border-border dark:border-white/20 dark:bg-white/5 dark:hover:bg-white/10 dark:text-white"
              onClick={() => typeof window !== "undefined" && window.history.back()}
            >
              <ArrowLeft className="w-4 h-4" />
              Go back
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
