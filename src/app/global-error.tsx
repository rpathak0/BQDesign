"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { AlertOctagon, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Root error boundary. Renders when an error occurs in the root layout.
 * Must define its own <html> and <body> (replaces the root layout).
 * Styled to match cinema theme: deep dark, purple glow, glass card.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <html lang="en" className="dark">
      <body className="min-h-screen w-full flex items-center justify-center overflow-hidden relative antialiased bg-[#09090b] text-[#fafafa]">
        {/* Background gradient + orbs - cinema theme */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F0F1A] via-[#0a0a12] to-[#09090b]" />
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            className="absolute w-96 h-96 rounded-full bg-purple-600/20 blur-[80px] -top-32 -left-32"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
          />
          <motion.div
            className="absolute w-64 h-64 rounded-full bg-purple-500/15 blur-[60px] bottom-1/4 -right-24"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.15 }}
          />
          <motion.div
            className="absolute w-48 h-48 rounded-full bg-red-500/10 blur-[50px] top-1/2 right-1/3"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.25 }}
          />
        </div>

        <motion.div
          className="relative z-10 w-full max-w-md mx-4"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Glass card - matches locale error pages */}
          <div
            className={cn(
              "rounded-2xl p-8 sm:p-10 text-center",
              "bg-[#0F0F1A]/95 backdrop-blur-xl",
              "border border-white/10",
              "shadow-[0_0_50px_rgba(124,58,237,0.18)] ring-2 ring-primary/20"
            )}
          >
            <motion.div
              className="mb-6 inline-flex relative"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.3 }}
            >
              <div className="absolute inset-0 bg-red-500/20 blur-2xl rounded-2xl" />
              <div className="relative w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                <AlertOctagon className="w-10 h-10 text-red-400" />
              </div>
            </motion.div>

            <motion.h1
              className="text-2xl font-bold text-white font-[family-name:var(--font-display)]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Something went wrong
            </motion.h1>
            <motion.p
              className="mt-3 text-sm text-white/60 max-w-sm mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              A critical error occurred. Please try refreshing the page.
            </motion.p>

            <motion.button
              type="button"
              onClick={reset}
              className={cn(
                "mt-10 inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 font-medium text-sm",
                "bg-[#7c3aed] text-white",
                "hover:bg-[#6d28d9] active:scale-[0.98] transition-all",
                "shadow-lg shadow-purple-500/25 hover:shadow-purple-500/30"
              )}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <RefreshCw className="w-4 h-4" />
              Try again
            </motion.button>
          </div>
        </motion.div>
      </body>
    </html>
  );
}
