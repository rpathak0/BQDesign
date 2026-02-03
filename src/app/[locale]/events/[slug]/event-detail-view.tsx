"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { MobileTabbar } from "@/components/layout/mobile-tabbar";
import { EventGallery } from "@/components/events/event-gallery";
import { StickyTicketCard } from "@/components/events/sticky-ticket-card";
import { ReviewList } from "@/components/events/review-list";
import { MapEmbed } from "@/components/events/map-embed";
import { EventCard } from "@/components/cards/event-card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Star, MapPin, Share2, Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { getEvents, eventDetailToCardEvent } from "@/data/events";
import type { EventDetail } from "@/data/events";
import { SafeImage } from "@/components/shared/safe-image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const DESCRIPTION_PREVIEW_LEN = 180;

export function EventDetailView({ event }: { event: EventDetail }) {
  const params = useParams();
  const locale = (params?.locale as string) ?? "en";
  const reduced = usePrefersReducedMotion();
  const [readMore, setReadMore] = useState(false);
  const [otherEvents, setOtherEvents] = useState<EventDetail[]>([]);
  const alsoLikeScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getEvents().then((list) => {
      setOtherEvents(list.filter((e) => e.slug !== event.slug).slice(0, 6));
    });
  }, [event.slug]);

  const handleBook = () => {
    if (event.hasSeatingLayout) {
      window.location.href = `/${locale}/events/${event.slug}/seating`;
    } else if (event.ticketCategories?.length) {
      window.location.href = `/${locale}/events/${event.slug}/tickets`;
    } else {
      window.location.href = `/${locale}/checkout?event=${event.slug}`;
    }
  };

  const description = event.description;
  const showReadMore = description.length > DESCRIPTION_PREVIEW_LEN;
  const descriptionText = readMore ? description : description.slice(0, DESCRIPTION_PREVIEW_LEN);
  const images = event.images?.length ? event.images : [event.image];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 w-full container mx-auto pt-20 md:pt-24 pb-6 md:pb-8 px-4">
        {/* Breadcrumb + actions: above poster so they don’t bind with the header */}
        <motion.div
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-4 md:mb-6 flex flex-wrap items-center justify-between gap-3"
        >
          <nav className="text-sm text-muted-foreground flex flex-wrap items-center gap-x-1 gap-y-1 min-w-0" aria-label="Breadcrumb">
            <Link href={`/${locale}`} className="hover:text-foreground">
              Home
            </Link>
            <span>/</span>
            <Link href={`/${locale}/events`} className="hover:text-foreground">
              Events
            </Link>
            {event.category && (
              <>
                <span>/</span>
                <Link href={`/${locale}/categories?q=${encodeURIComponent(event.category)}`} className="hover:text-foreground">
                  {event.category}
                </Link>
              </>
            )}
            <span>/</span>
            <span className="text-foreground line-clamp-1">{event.title}</span>
          </nav>
          <div className="flex items-center gap-3 shrink-0 text-sm text-foreground">
            <button
              type="button"
              className="flex items-center gap-1.5 hover:text-primary transition-colors"
              aria-label="Share event"
            >
              <Share2 className="w-4 h-4" />
              Share event
            </button>
            <button
              type="button"
              className="flex items-center gap-1.5 hover:text-primary transition-colors"
              aria-label="Add to favourites"
            >
              <Heart className="w-4 h-4" />
              Add to favourites
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Left column - wider (9/12) for banner and content */}
          <div className="lg:col-span-9 min-w-0 space-y-0 overflow-x-hidden">
            {/* Hero gallery */}
            <motion.div
              initial={reduced ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="mb-6"
            >
              <EventGallery images={images} title={event.title} className="rounded-2xl" />
            </motion.div>

            {/* Title + subtitle + by organizer */}
            <motion.div
              initial={reduced ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.05 }}
              className="mb-4"
            >
              <h1 className="text-2xl md:text-3xl font-display font-bold tracking-tight mb-1">
                {event.title}
              </h1>
              {description.length > 0 && (
                <p className="text-muted-foreground text-base mb-2">
                  {description.split(/[.!?]/)[0].trim()}
                  {/[.!?]/.test(description) ? "." : ""}
                </p>
              )}
              <Link
                href={`/${locale}/venues`}
                className="text-sm text-primary hover:underline"
              >
                By {event.location}
              </Link>
            </motion.div>

            {/* Rating + Reviews link + Location + Share */}
            <motion.div
              initial={reduced ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.08 }}
              className="flex flex-wrap items-center gap-4 md:gap-6 mb-4"
            >
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 fill-primary text-primary" />
                <span className="font-display font-bold text-lg">{event.rating.toFixed(1)}</span>
                <span className="text-sm text-muted-foreground">
                  {event.rating >= 4.5 ? "Excellent" : event.rating >= 4 ? "Very Good" : "Good"}
                </span>
              </div>
              <Link
                href="#reviews"
                className="text-sm text-primary hover:underline"
              >
                {event.ratingCount} Reviews
              </Link>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 shrink-0 text-primary" />
                <span>{event.location}</span>
              </div>
              <button
                type="button"
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
                aria-label="Share"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </motion.div>

            {/* Short description + Read More */}
            <motion.div
              initial={reduced ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="mb-8"
            >
              <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                {descriptionText}
                {showReadMore && !readMore && "…"}
              </p>
              {showReadMore && (
                <button
                  type="button"
                  onClick={() => setReadMore(true)}
                  className={cn(
                    "mt-2 text-sm font-medium text-primary hover:underline",
                    readMore && "hidden"
                  )}
                >
                  Read More
                </button>
              )}
            </motion.div>

            {/* Accordion: Highlights, Inclusions, Exclusions, Important notes, Cancellation, How to get there */}
            <motion.div
              initial={reduced ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.12 }}
              className="border-y border-border/50"
            >
              <Accordion type="multiple" className="w-full" defaultValue={["highlights", "inclusions", "exclusions"]}>
                {event.highlights.length > 0 && (
                  <AccordionItem value="highlights">
                    <AccordionTrigger className="text-left font-display font-semibold">
                      Highlights
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground text-sm">
                        {event.highlights.map((h, i) => (
                          <li key={i}>{h}</li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                )}
                <AccordionItem value="inclusions">
                  <AccordionTrigger className="text-left font-display font-semibold">
                    Inclusions
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground text-sm">
                      {event.inclusions.map((x, i) => (
                        <li key={i}>{x}</li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="exclusions">
                  <AccordionTrigger className="text-left font-display font-semibold">
                    Exclusions
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground text-sm">
                      {event.exclusions.map((x, i) => (
                        <li key={i}>{x}</li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                {event.importantNotes && (
                  <AccordionItem value="notes">
                    <AccordionTrigger className="text-left font-display font-semibold">
                      Know before you go
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-sm whitespace-pre-line">
                      {event.importantNotes}
                    </AccordionContent>
                  </AccordionItem>
                )}
                {event.cancellationPolicy && (
                  <AccordionItem value="cancellation">
                    <AccordionTrigger className="text-left font-display font-semibold">
                      Cancellation policy
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-sm">
                      {event.cancellationPolicy}
                    </AccordionContent>
                  </AccordionItem>
                )}
                <AccordionItem value="how-to-get-there">
                  <AccordionTrigger className="text-left font-display font-semibold">
                    How to get there
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      Use the map below for directions. Address: {event.location}.
                    </p>
                    <MapEmbed lat={event.lat} lng={event.lng} title="" className="mt-2" />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </motion.div>

            {/* Gallery - horizontal thumbnails + View All */}
            <motion.section
              initial={reduced ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.14 }}
              className="py-8"
            >
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-display font-semibold text-lg">Gallery</h2>
                <span className="text-sm text-primary font-medium cursor-pointer hover:underline">Show more</span>
              </div>
              <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                {images.map((src, i) => (
                  <div
                    key={i}
                    className="shrink-0 w-32 h-24 md:w-40 md:h-28 rounded-lg overflow-hidden border border-border/50 bg-muted"
                  >
                    <SafeImage
                      src={src}
                      alt={`${event.title} ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </motion.section>

            {/* Location section - address + View on map + map */}
            <motion.section
              id="location"
              initial={reduced ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.16 }}
              className="pb-8"
            >
              <h2 className="font-display font-semibold text-lg mb-3">Location</h2>
              <p className="text-sm text-muted-foreground mb-1">{event.location}</p>
              <a href="#location" className="text-sm text-primary font-medium hover:underline">
                View on map
              </a>
              <div className="mt-4 rounded-xl overflow-hidden border border-border/50">
                <MapEmbed lat={event.lat} lng={event.lng} title="" />
              </div>
            </motion.section>

            {/* Ticket prices section */}
            <motion.section
              initial={reduced ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.17 }}
              className="pb-8"
            >
              <h2 className="font-display font-semibold text-lg mb-4">
                {event.title} Ticket prices
              </h2>
              {event.ticketCategories && event.ticketCategories.length > 0 ? (
                <div className="space-y-3">
                  {event.ticketCategories.map((cat) => (
                    <div
                      key={cat.id}
                      className="flex items-center justify-between rounded-xl border border-border/50 bg-muted/30 px-4 py-3"
                    >
                      <span className="font-medium text-sm">{cat.name}</span>
                      <span className="font-display font-semibold">
                        {typeof cat.price === "number" ? `${cat.price} ${cat.currency ?? "QAR"}` : cat.price}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-between rounded-xl border border-border/50 bg-muted/30 px-4 py-3">
                  <span className="font-medium text-sm">General admission</span>
                  <span className="font-display font-semibold">{event.price}</span>
                </div>
              )}
            </motion.section>

            {/* Reviews */}
            <motion.section
              id="reviews"
              initial={reduced ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.18 }}
              className="pb-8"
            >
              <ReviewList
                reviews={event.reviews}
                overallRating={event.rating}
                ratingCount={event.ratingCount}
                eventTitle={event.title}
              />
            </motion.section>

            {/* You might also like */}
            {otherEvents.length > 0 && (
              <motion.section
                initial={reduced ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="pb-12"
              >
                <div className="flex items-center justify-between gap-4 mb-4">
                  <h2 className="font-display font-semibold text-lg">You might also like</h2>
                  <div className="flex gap-2 shrink-0">
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full w-9 h-9 border-border/50 hover:bg-primary hover:text-white hover:border-primary transition-colors"
                      onClick={() => {
                        alsoLikeScrollRef.current?.scrollBy({ left: -340, behavior: "smooth" });
                      }}
                      aria-label="Scroll left"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full w-9 h-9 border-border/50 hover:bg-primary hover:text-white hover:border-primary transition-colors"
                      onClick={() => {
                        alsoLikeScrollRef.current?.scrollBy({ left: 340, behavior: "smooth" });
                      }}
                      aria-label="Scroll right"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="relative -mx-4 px-4 lg:mx-0 lg:px-0">
                  <div
                    ref={alsoLikeScrollRef}
                    className="flex gap-4 overflow-x-auto no-scrollbar pb-2 snap-x snap-mandatory pr-4"
                  >
                    {otherEvents.map((e) => (
                      <div
                        key={e.id}
                        className="shrink-0 w-[280px] md:w-[320px] min-w-[280px] md:min-w-[320px] snap-start"
                      >
                        <EventCard
                          event={{ ...eventDetailToCardEvent(e), slug: e.slug }}
                          variant="landscape"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </motion.section>
            )}
          </div>

          {/* Right column - sticky booking card (wider 5/12) */}
          <aside className="lg:col-span-3">
            <StickyTicketCard
              price={event.price}
              priceFrom={event.priceFrom}
              priceSuffix="Per Person"
              openingHours={event.openingHours}
              confirmationNote="Instant Confirmation"
              ctaLabel="Select Tickets"
              onCtaClick={handleBook}
              discountLabel="Buy with Discount"
              discountSavings="Save 5–10% Off"
              promocodeLabel="Have a promocode?"
              durationLabel="Timing and schedule"
              durationValue={event.openingHours || "1 hour"}
            />
          </aside>
        </div>
      </main>
      <MobileTabbar />
      <Footer />
    </div>
  );
}
