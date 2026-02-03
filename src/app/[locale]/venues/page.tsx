"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { MobileTabbar } from "@/components/layout/mobile-tabbar";
import { VenueCard } from "@/components/cards/venue-card";
import { Button } from "@/components/ui/button";
import { ChevronDown, MapPin, ChevronLeft } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { VENUES, VENUE_TYPES } from "@/data/bqData";
import type { Venue } from "@/data/bqData";
import { TrustStrip } from "@/components/home/trust-strip";
import { cn } from "@/lib/utils";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { staggerContainer, staggerChild } from "@/lib/motion-variants";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

const VENUE_TYPE_LABELS: Record<string, string> = {
  arena: "Arenas",
  hotel: "Hotels",
  club: "Clubs",
  lounge: "Lounges",
  beach: "Beaches",
  park: "Parks",
  restaurant: "Restaurants",
};

function VenueCardWithCount({ venue }: { venue: Venue }) {
  const count = venue.upcomingEvents ?? 0;
  const label = count === 1 ? "upcoming event" : "upcoming events";
  return (
    <div className="space-y-2">
      <VenueCard venue={venue} />
      <p className="text-xs text-muted-foreground">
        {count} {label}
      </p>
    </div>
  );
}

export default function VenuesPage() {
  const params = useParams();
  const locale = (params?.locale as string) ?? "en";
  const [location, setLocation] = useState("Dubai");
  const [activeType, setActiveType] = useState<string | null>(null);
  const [showMore, setShowMore] = useState(false);
  const reduced = usePrefersReducedMotion();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  const filtered = activeType
    ? VENUES.filter((v) => v.type === activeType)
    : VENUES;

  const withUpcoming = VENUES.filter((v) => (v.upcomingEvents ?? 0) > 0);
  const byType = VENUE_TYPES.map((type) => ({
    type,
    label: VENUE_TYPE_LABELS[type] ?? type,
    venues: VENUES.filter((v) => v.type === type),
  })).filter((g) => g.venues.length > 0);

  const containerVariants = reduced ? {} : staggerContainer;
  const childVariants = reduced ? {} : staggerChild;

  const base = `/${locale}`;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container mx-auto py-6 md:py-8">
          {/* Navigation: Back | Home > Venues */}
          <nav className="text-sm mb-4 flex items-center gap-3 flex-wrap">
            <Link
              href={base}
              className="inline-flex items-center gap-1.5 text-foreground hover:text-foreground/80 transition-colors font-medium"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </Link>
            <span className="h-4 w-px bg-border shrink-0" aria-hidden />
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Link href={base} className="hover:text-foreground transition-colors">
                Home
              </Link>
              <span className="text-muted-foreground/70">&#62;</span>
              <span className="text-foreground font-medium">Venues</span>
            </div>
          </nav>

          {/* Title + Location (Venues in [Location v]) */}
          <div className="flex flex-wrap items-baseline gap-2 mb-6">
            <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight text-foreground">
              Venues in{" "}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="h-auto p-0 text-3xl md:text-4xl font-display font-bold text-primary hover:text-primary/80 hover:bg-transparent inline-flex items-center gap-1"
                  >
                    {location}
                    <ChevronDown className="w-5 h-5 md:w-6 md:h-6" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  <DropdownMenuItem onClick={() => setLocation("Dubai")}>
                    <MapPin className="mr-2 h-4 w-4" /> Dubai
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLocation("Qatar")}>
                    <MapPin className="mr-2 h-4 w-4" /> Qatar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-8 overflow-x-auto no-scrollbar pb-2">
            {VENUE_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => setActiveType(activeType === type ? null : type)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors capitalize",
                  activeType === type ? "bg-white dark:bg-card text-primary border-2 border-primary" : "bg-muted/60 text-muted-foreground hover:bg-muted border-2 border-transparent"
                )}
              >
                {VENUE_TYPE_LABELS[type] ?? type}
              </button>
            ))}
            <button
              onClick={() => setActiveType(null)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors",
                !activeType ? "bg-white dark:bg-card text-primary border-2 border-primary" : "bg-muted/60 text-muted-foreground hover:bg-muted border-2 border-transparent"
              )}
            >
              All categories
            </button>
          </div>

          {withUpcoming.length > 0 && !activeType && (
            <section className="mb-10">
              <div className="flex items-center justify-between gap-4 mb-4">
                <h2 className="text-xl md:text-2xl font-display font-bold">Venues with upcoming events</h2>
              </div>
              <motion.div
                ref={ref}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
              >
                {withUpcoming.slice(0, 6).map((venue) => (
                  <motion.div key={venue.id} variants={childVariants}>
                    <VenueCardWithCount venue={venue} />
                  </motion.div>
                ))}
              </motion.div>
            </section>
          )}

          {!activeType && byType.slice(0, showMore ? undefined : 4).map(({ type, label, venues }) => (
            <section key={type} className="mb-10">
              <div className="flex items-center justify-between gap-4 mb-4">
                <h2 className="text-xl md:text-2xl font-display font-bold">{label}</h2>
                <button onClick={() => setActiveType(type)} className="text-sm text-primary font-medium hover:underline">Show all</button>
              </div>
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
              >
                {venues.slice(0, 8).map((venue) => (
                  <motion.div key={venue.id} variants={childVariants}>
                    <VenueCardWithCount venue={venue} />
                  </motion.div>
                ))}
              </motion.div>
            </section>
          ))}

          {activeType && (
            <motion.div
              ref={ref}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
            >
              {filtered.map((venue) => (
                <motion.div key={venue.id} variants={childVariants}>
                  <VenueCardWithCount venue={venue} />
                </motion.div>
              ))}
            </motion.div>
          )}

          {!activeType && byType.length > 4 && !showMore && (
            <div className="flex justify-center pt-6">
              <Button variant="outline" className="rounded-full px-8" onClick={() => setShowMore(true)}>Show more</Button>
            </div>
          )}
        </div>
        <TrustStrip />
      </main>
      <MobileTabbar />
      <Footer />
    </div>
  );
}
