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

const FACEBOOK_ICON = (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const GOOGLE_ICON = (
  <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden>
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

const APPLE_ICON = (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
  </svg>
);

export default function LoginPage() {
  const params = useParams();
  const router = useRouter();
  const locale = (params?.locale as string) ?? "en";
  const reduced = usePrefersReducedMotion();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 800));
      if (typeof window !== "undefined") {
        localStorage.setItem("bq_logged_in", "true");
        localStorage.setItem("bq_user_email", form.email);
        if (!localStorage.getItem("bq_user_name") && form.email) {
          const nameFromEmail = form.email.split("@")[0].replace(/[._]/g, " ");
          localStorage.setItem("bq_user_name", nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1));
        }
      }
      toast({ title: "Welcome back", description: "You are now logged in." });
      router.push(`/${locale}?logged_in=1`);
    } catch {
      toast({ title: "Error", description: "Login failed. Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    toast({ title: "Coming soon", description: `${provider} login will be available soon.` });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar variant="light" />
      {/* Theme-aligned background: subtle gradient like hero sections */}
      <main className="flex-1 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-primary/5 pointer-events-none" />
        <div className="relative container mx-auto py-10 md:py-16 max-w-md px-4 sm:px-5 md:px-6">
          <Link
            href={`/${locale}`}
            className="text-sm text-muted-foreground hover:text-foreground mb-6 inline-block font-medium"
          >
            ← Home
          </Link>
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="rounded-3xl border border-border/50 bg-card/80 dark:bg-card/90 backdrop-blur-sm shadow-xl shadow-primary/5 p-6 md:p-8"
          >
            <div className="mb-6">
              <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight text-foreground">
                Login
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                Sign in to manage bookings and preferences.
              </p>
            </div>

            {/* Social login – theme accent */}
            <div className="space-y-3 mb-6">
              <Button
                type="button"
                variant="outline"
                className="w-full h-12 rounded-xl border-2 border-border hover:bg-primary/10 hover:border-primary/30 hover:text-primary font-semibold gap-3 bg-[#1877F2] border-[#1877F2] hover:bg-[#1877F2]/90 text-white hover:text-white dark:bg-[#1877F2] dark:border-[#1877F2]"
                onClick={() => handleSocialLogin("Facebook")}
              >
                {FACEBOOK_ICON}
                Continue with Facebook
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full h-12 rounded-xl border-2 border-border hover:bg-primary/10 hover:border-primary/30 hover:text-primary font-semibold gap-3 bg-background dark:bg-card"
                onClick={() => handleSocialLogin("Google")}
              >
                {GOOGLE_ICON}
                Continue with Google
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full h-12 rounded-xl border-2 border-foreground bg-foreground text-background hover:bg-foreground/90 hover:text-background font-semibold gap-3 dark:bg-foreground dark:text-background"
                onClick={() => handleSocialLogin("Apple")}
              >
                {APPLE_ICON}
                Continue with Apple
              </Button>
            </div>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase tracking-wider">
                <span className="bg-card px-3 text-muted-foreground dark:bg-card/90">or continue with email</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
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
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-foreground font-medium">Password</Label>
                  <Link
                    href={`/${locale}/login/forgot-password`}
                    className="text-xs text-primary hover:underline font-medium"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  autoComplete="current-password"
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
                  "border-2 border-[#ffdd00] dark:border-[#ffdd00]",
                  "shadow-[0_0_20px_rgba(255,221,0,0.25)]"
                )}
                disabled={loading}
              >
                {loading ? "Signing in..." : "Login"}
              </Button>
              <p className="text-center text-sm text-muted-foreground pt-1">
                Don&apos;t have an account?{" "}
                <Link href={`/${locale}/login/register`} className="text-primary font-semibold hover:underline">
                  Register
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
