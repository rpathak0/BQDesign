"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { MobileTabbar } from "@/components/layout/mobile-tabbar";
import { EventCard } from "@/components/cards/event-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, SlidersHorizontal } from "lucide-react";
import { getEvents, eventDetailToCardEvent } from "@/data/events";
import type { EventDetail } from "@/data/events";
import { motion, useInView } from "framer-motion";
import { useParams } from "next/navigation";
import { useRef } from "react";
import { staggerContainer, staggerChild } from "@/lib/motion-variants";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";

export default function EventsPage() {
  const params = useParams();
  const locale = (params?.locale as string) ?? "en";
  const [events, setEvents] = useState<EventDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const reduced = usePrefersReducedMotion();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  useEffect(() => {
    getEvents().then((data) => {
      setEvents(data);
      setLoading(false);
    });
  }, []);

  const filtered = events.filter(
    (e) =>
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.location.toLowerCase().includes(search.toLowerCase())
  );

  const containerVariants = reduced ? {} : staggerContainer;
  const childVariants = reduced ? {} : staggerChild;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto py-8 md:py-12">
        <motion.header
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-2">
            Events
          </h1>
          <p className="text-muted-foreground text-sm md:text-base mb-6">
            Discover and book events, attractions, and experiences.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search events or location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-muted/50 border-border"
              />
            </div>
            <Button
              variant="outline"
              className="sm:w-auto"
              onClick={() => setFilterOpen((o) => !o)}
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
        </motion.header>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="rounded-xl border border-border/50 bg-card h-[320px] animate-pulse" />
            ))}
          </div>
        ) : (
          <motion.div
            ref={ref}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
          >
            {filtered.map((event, i) => (
              <motion.div key={event.id} variants={childVariants}>
                <EventCard
                  event={{
                    ...eventDetailToCardEvent(event),
                    slug: event.slug,
                  }}
                  variant="landscape"
                />
              </motion.div>
            ))}
          </motion.div>
        )}

        {!loading && filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-12">
            No events match your search. Try a different term.
          </p>
        )}
      </main>
      <MobileTabbar />
      <Footer />
    </div>
  );
}
