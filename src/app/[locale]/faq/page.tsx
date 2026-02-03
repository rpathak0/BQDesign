"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { MobileTabbar } from "@/components/layout/mobile-tabbar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

const FAQ_ITEMS = [
  {
    q: "How do I book tickets?",
    a: "Select your event, choose date and quantity, then complete checkout. You'll receive a confirmation email with your e-ticket.",
  },
  {
    q: "Can I cancel or get a refund?",
    a: "Refund and cancellation rules depend on the event. Check the event page for the specific policy. Many events allow free cancellation up to 24 hours before.",
  },
  {
    q: "How do I get my tickets?",
    a: "After booking you'll receive an email with your e-ticket and a link to add it to your wallet. You can also access tickets from your account.",
  },
  {
    q: "What if an event is cancelled?",
    a: "If an event is cancelled by the organizer, you'll be notified and refunded automatically according to the event's terms.",
  },
];

export default function FAQPage() {
  const params = useParams();
  const locale = (params?.locale as string) ?? "en";
  const reduced = usePrefersReducedMotion();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto py-8 md:py-12 max-w-2xl">
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
          <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-2">
            FAQ
          </h1>
          <p className="text-muted-foreground text-sm mb-8">
            Frequently asked questions about booking and tickets.
          </p>
          <Accordion type="single" collapsible className="w-full">
            {FAQ_ITEMS.map((item, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger>{item.q}</AccordionTrigger>
                <AccordionContent>{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </main>
      <MobileTabbar />
      <Footer />
    </div>
  );
}
