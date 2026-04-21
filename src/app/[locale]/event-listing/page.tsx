"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { MobileTabbar } from "@/components/layout/mobile-tabbar";
import { Button } from "@/components/ui/button";
import { EventCard } from "@/components/cards/event-card";
import { ArtistCircle } from "@/components/cards/artist-circle";
import { VenueCard } from "@/components/cards/venue-card";
import { ARTISTS, EVENTS, VENUES } from "@/data/bqData";
import { cn } from "@/lib/utils";

type ListingMode = "top-events" | "artists" | "venues";

export default function EventListingPage() {
  const params = useParams();
  const locale = (params?.locale as string) ?? "en";
  const base = `/${locale}`;
  const [mode, setMode] = useState<ListingMode>("top-events");

  const topEvents = useMemo(
    () => [...EVENTS].sort((a, b) => (b.status ? 1 : 0) - (a.status ? 1 : 0)),
    []
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar variant="light" />
      <main className="flex-1 pt-20 md:pt-24">
        <div className="container mx-auto py-6 md:py-8 px-4 sm:px-5 md:px-6">
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
              <span className="text-foreground font-medium">Event Listing</span>
            </div>
          </nav>

          <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight text-foreground mb-2">
            Event General Listing
          </h1>
          <p className="text-muted-foreground mb-6">
            Switch between top events, artist-wise, and venue-wise lists in one page.
          </p>

          <div className="flex flex-wrap items-center gap-2 mb-8">
            {[
              { id: "top-events", label: "Top Events" },
              { id: "artists", label: "Artist Wise" },
              { id: "venues", label: "Venue Wise" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setMode(tab.id as ListingMode)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors border-2",
                  mode === tab.id
                    ? "bg-white dark:bg-card text-primary border-primary"
                    : "bg-muted/60 text-muted-foreground hover:bg-muted border-transparent"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {mode === "top-events" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {topEvents.map((event) => (
                <EventCard key={event.id} event={event} variant="landscape" />
              ))}
            </div>
          )}

          {mode === "artists" && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8 place-items-center">
              {ARTISTS.map((artist) => (
                <div key={artist.id} className="w-full max-w-[140px] flex justify-center">
                  <ArtistCircle artist={artist} />
                </div>
              ))}
            </div>
          )}

          {mode === "venues" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {VENUES.map((venue) => (
                <VenueCard key={venue.id} venue={venue} />
              ))}
            </div>
          )}

          <div className="pt-10">
            <Link href={`${base}/events`}>
              <Button variant="outline" className="rounded-full px-6">
                Browse all event pages
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <MobileTabbar />
      <Footer />
    </div>
  );
}
