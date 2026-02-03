"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { MobileTabbar } from "@/components/layout/mobile-tabbar";
import { EventCard } from "@/components/cards/event-card";
import { CategoryCircle } from "@/components/cards/category-circle";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronDown, MapPin, ChevronLeft } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CATEGORIES, EVENTS } from "@/data/bqData";
import { TrustStrip } from "@/components/home/trust-strip";
import { cn } from "@/lib/utils";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { staggerContainer, staggerChild } from "@/lib/motion-variants";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

export default function CategoriesPage() {
  const params = useParams();
  const locale = (params?.locale as string) ?? "en";
  const searchParams = useSearchParams();
  const [location, setLocation] = useState("Dubai");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showMore, setShowMore] = useState(false);
  const reduced = usePrefersReducedMotion();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  useEffect(() => {
    const q = searchParams.get("category");
    if (q) setActiveCategory(q);
  }, [searchParams]);

  const filteredEvents = activeCategory
    ? EVENTS.filter((e) => e.category.toLowerCase() === activeCategory.toLowerCase())
    : EVENTS;

  const eventsByCategory = CATEGORIES.map((cat) => ({
    category: cat,
    events: EVENTS.filter((e) => e.category.toLowerCase() === cat.name.toLowerCase()),
  })).filter((g) => g.events.length > 0);

  const eventsByEventCategory = [...new Set(EVENTS.map((e) => e.category))].map((name) => ({
    category: { id: name.toLowerCase(), name, image: "/assets/hero-bg.png" },
    events: EVENTS.filter((e) => e.category === name),
  }));
  const sectionsToShow = eventsByCategory.length > 0 ? eventsByCategory : eventsByEventCategory;

  const containerVariants = reduced ? {} : staggerContainer;
  const childVariants = reduced ? {} : staggerChild;

  const base = `/${locale}`;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container mx-auto py-6 md:py-8">
          {/* Navigation: Back | Home > Categories */}
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
              <span className="text-foreground font-medium">Categories</span>
            </div>
          </nav>

          {/* Title + Location (Events in [Location v]) */}
          <div className="flex flex-wrap items-baseline gap-2 mb-6">
            <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight text-foreground">
              Events in{" "}
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

          {/* Category filter tabs */}
          <div className="flex flex-wrap items-center gap-2 mb-8 overflow-x-auto no-scrollbar pb-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(activeCategory === cat.name ? null : cat.name)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors",
                  activeCategory === cat.name
                    ? "bg-white dark:bg-card text-primary border-2 border-primary"
                    : "bg-muted/60 text-muted-foreground hover:bg-muted border-2 border-transparent"
                )}
              >
                {cat.name}
              </button>
            ))}
            <button
              onClick={() => setActiveCategory(null)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors",
                !activeCategory ? "bg-white dark:bg-card text-primary border-2 border-primary" : "bg-muted/60 text-muted-foreground hover:bg-muted border-2 border-transparent"
              )}
            >
              All categories
            </button>
          </div>

          {/* Categories grid (when no filter) */}
          {!activeCategory && (
            <section className="mb-12">
              <div className="flex flex-wrap gap-6 justify-center mb-10">
                {CATEGORIES.map((c) => (
                  <Link key={c.id} href={`${base}/categories?category=${encodeURIComponent(c.name)}`}>
                    <div className="w-[120px] md:w-[140px] flex justify-center">
                      <CategoryCircle category={c} />
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Events by category sections */}
          {sectionsToShow
            .filter((g) => !activeCategory || g.category.name === activeCategory)
            .slice(0, showMore ? undefined : 3)
            .map(({ category, events }) => (
              <section key={category.id} className="mb-10">
                <div className="flex items-center justify-between gap-4 mb-4">
                  <Link
                    href={`${base}/events?category=${encodeURIComponent(category.name)}`}
                    className="text-xl md:text-2xl font-display font-bold hover:text-primary transition-colors flex items-center gap-1"
                  >
                    {category.name}
                    <ChevronRight className="w-5 h-5" />
                  </Link>
                  <Link
                    href={`${base}/events?category=${encodeURIComponent(category.name)}`}
                    className="text-sm text-primary font-medium hover:underline"
                  >
                    Show all
                  </Link>
                </div>
                <motion.div
                  ref={ref}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  variants={containerVariants}
                  initial="hidden"
                  animate={inView ? "visible" : "hidden"}
                >
                  {events.slice(0, 8).map((event) => (
                    <motion.div key={event.id} variants={childVariants}>
                      <EventCard event={event} variant="landscape" />
                    </motion.div>
                  ))}
                </motion.div>
              </section>
            ))}

          {/* Single filter view: flat list */}
          {activeCategory && (
            <motion.div
              ref={ref}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
            >
              {filteredEvents.map((event) => (
                <motion.div key={event.id} variants={childVariants}>
                  <EventCard event={event} variant="landscape" />
                </motion.div>
              ))}
            </motion.div>
          )}

          {!showMore && sectionsToShow.length > 3 && !activeCategory && (
            <div className="flex justify-center pt-6">
              <Button
                variant="outline"
                className="rounded-full px-8"
                onClick={() => setShowMore(true)}
              >
                Show more
              </Button>
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
