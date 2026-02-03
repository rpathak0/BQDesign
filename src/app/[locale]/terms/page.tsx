"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { MobileTabbar } from "@/components/layout/mobile-tabbar";
import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

export default function TermsPage() {
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
            Terms & Conditions
          </h1>
          <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground space-y-4">
            <p>
              By using BookingQube you agree to these terms. We act as a booking platform
              connecting you with event organizers. Your contract for the ticket is with
              the organizer; we are not responsible for the event itself.
            </p>
            <p>
              Bookings are subject to the specific event&apos;s cancellation and refund policy.
              Please read the event page before purchasing. We do not guarantee availability
              until payment is confirmed.
            </p>
            <p>
              You must provide accurate contact details. E-tickets and confirmations will be
              sent to the email you provide. It is your responsibility to keep your account
              and contact information up to date.
            </p>
            <p>
              For support or disputes, please contact us via the Contact page. These terms
              are governed by the laws of the jurisdiction in which we operate.
            </p>
          </div>
        </motion.div>
      </main>
      <MobileTabbar />
      <Footer />
    </div>
  );
}
