"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
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

export default function RegisterPage() {
  const params = useParams();
  const router = useRouter();
  const locale = (params?.locale as string) ?? "en";
  const reduced = usePrefersReducedMotion();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 800));
      if (typeof window !== "undefined") {
        localStorage.setItem("bq_logged_in", "true");
        localStorage.setItem("bq_user_email", form.email);
        if (form.name?.trim()) localStorage.setItem("bq_user_name", form.name.trim());
      }
      toast({ title: "Account created", description: "Welcome! You are now logged in." });
      router.push(`/${locale}?logged_in=1`);
    } catch {
      toast({ title: "Error", description: "Registration failed. Please try again.", variant: "destructive" });
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
                Register
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                Create an account to book tickets and manage preferences.
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-foreground font-medium">Name</Label>
                <Input
                  id="name"
                  required
                  autoComplete="name"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Your name"
                  className="rounded-xl border-2 border-border focus:border-primary h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground font-medium">Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="you@example.com"
                  className="rounded-xl border-2 border-border focus:border-primary h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground font-medium">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  autoComplete="new-password"
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  placeholder="••••••••"
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
                {loading ? "Creating account..." : "Register"}
              </Button>
              <p className="text-center text-sm text-muted-foreground pt-1">
                Already have an account?{" "}
                <Link href={`/${locale}/login`} className="text-primary font-semibold hover:underline">
                  Login
                </Link>
              </p>
            </form>
          </motion.div>
        </div>
      </main>
      <MobileTabbar />
    </div>
  );
}
