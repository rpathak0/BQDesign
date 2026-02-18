"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { MobileTabbar } from "@/components/layout/mobile-tabbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function ForgotPasswordPage() {
  const params = useParams();
  const locale = (params?.locale as string) ?? "en";
  const reduced = usePrefersReducedMotion();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 800));
      toast({ title: "Email sent", description: "If an account exists, we've sent a reset link to your email." });
      setEmail("");
    } catch {
      toast({ title: "Error", description: "Failed to send reset link.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar variant="light" />
      <main className="flex-1 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-primary/5 pointer-events-none" />
        <div className="relative container mx-auto py-10 md:py-16 max-w-md px-4 sm:px-5 md:px-6">
          <Link
            href={`/${locale}/login`}
            className="text-sm text-muted-foreground hover:text-foreground mb-6 inline-block font-medium"
          >
            ← Back to Login
          </Link>
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="rounded-3xl border border-border/50 bg-card/80 dark:bg-card/90 backdrop-blur-sm shadow-xl shadow-primary/5 p-6 md:p-8"
          >
            <div className="mb-6">
              <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight text-foreground">
                Forgot password
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                Enter your email and we&apos;ll send you a link to reset your password.
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground font-medium">Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="rounded-xl border-2 border-border focus:border-primary h-11"
                />
              </div>
              <Button
                type="submit"
                className={cn(
                  "w-full h-12 rounded-xl font-bold text-base",
                  "bg-[#ffdd00] dark:bg-[#ffdd00] text-black dark:text-black",
                  "hover:bg-[#ffdd00]/90 dark:hover:bg-[#ffdd00]/90",
                  "border-2 border-[#ffdd00] dark:border-[#ffdd00]"
                )}
                disabled={loading}
              >
                {loading ? "Sending..." : "Send reset link"}
              </Button>
            </form>
          </motion.div>
        </div>
      </main>
      <MobileTabbar />
    </div>
  );
}
