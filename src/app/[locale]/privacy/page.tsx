"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { MobileTabbar } from "@/components/layout/mobile-tabbar";
import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

export default function PrivacyPage() {
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
            Privacy Policy
          </h1>
          <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground space-y-4">
            <p>
              We collect information you provide when booking (name, email, phone) and
              usage data to improve our service. We do not sell your personal data to
              third parties for marketing.
            </p>
            <p>
              Your data is used to process bookings, send confirmations and reminders,
              and to comply with legal obligations. We may share necessary details with
              event organizers to fulfill your booking.
            </p>
            <p>
              We use cookies and similar technologies for session management and analytics.
              You can control cookie preferences in your browser. We retain booking data
              as required for legal and operational purposes.
            </p>
            <p>
              You may request access, correction, or deletion of your data by contacting us.
              For full details or to exercise your rights, please use our Contact page.
            </p>
          </div>
        </motion.div>
      </main>
      <MobileTabbar />
      <Footer />
    </div>
  );
}
