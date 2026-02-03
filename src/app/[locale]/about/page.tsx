"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { MobileTabbar } from "@/components/layout/mobile-tabbar";
import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

export default function AboutPage() {
  const params = useParams();
  const locale = (params?.locale as string) ?? "en";
  const reduced = usePrefersReducedMotion();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto py-8 md:py-12 max-w-3xl">
        <Link
          href={`/${locale}`}
          className="text-sm text-muted-foreground hover:text-foreground mb-6 inline-block"
        >
          ← Home
        </Link>
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-4">
            About Us
          </h1>
          <p className="text-muted-foreground leading-relaxed mb-6">
            BookingQube is your premium gateway to movies, events, and experiences.
            We partner with leading venues and promoters to bring you the best
            tickets and offers in one place.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Our mission is to make booking simple, secure, and enjoyable—
            whether you&apos;re planning a night out at the cinema or a once-in-a-lifetime
            event.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            For support or partnerships, please{" "}
            <Link href={`/${locale}/contact`} className="text-primary hover:underline">
              contact us
            </Link>
            .
          </p>
        </motion.div>
      </main>
      <MobileTabbar />
      <Footer />
    </div>
  );
}
