"use client";

import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { HeroCarousel } from "@/components/home/hero-carousel";
import { QuickBookTab } from "@/components/layout/quick-book-tab";
import { QuickFilters } from "@/components/home/quick-filters";
import { ContentRail } from "@/components/home/content-rail";
import { EventCard } from "@/components/cards/event-card";
import { CategoryCircle } from "@/components/cards/category-circle";
import { ArtistCircle } from "@/components/cards/artist-circle";
import { VenueCard } from "@/components/cards/venue-card";
import { AppDownloadBanner } from "@/components/home/app-download-banner";
import { AutoScrollOffers } from "@/components/home/auto-scroll-offers";
import { Top10Module } from "@/components/home/top-10-module";
import { BlogsSection } from "@/components/home/blogs-section";
import { TrustStrip } from "@/components/home/trust-strip";
import { AISearchStub } from "@/components/home/ai-search-stub";
import { MOVIES, OFFERS } from "@/data/mockContent";
import { EVENTS, CATEGORIES, ARTISTS, VENUES } from "@/data/bqData";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronRight, ChevronDown, MapPin } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { ListingCard } from "@/components/cards/listing-card";
import { FloatingControls } from "@/components/layout/floating-controls";
import { MobileTabbar } from "@/components/layout/mobile-tabbar";
import { PosterCard } from "@/components/cards/poster-card";
import { useTranslations } from "next-intl";
import { LoyaltyBanner } from "@/components/home/loyalty-banner";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { staggerContainer, staggerChild } from "@/lib/motion-variants";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

function CategoriesStagger({ categories, reduced, base }: { categories: typeof CATEGORIES; reduced: boolean; base: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const containerVariants = reduced ? {} : staggerContainer;
  const childVariants = reduced ? {} : staggerChild;
  return (
    <>
      <div className="md:hidden -mx-4 px-4 overflow-x-auto no-scrollbar">
        <div className="flex gap-6">
          {categories.map((category) => (
            <Link key={category.id} href={`${base}/categories${category.name ? `?category=${encodeURIComponent(category.name)}` : ""}`} className="shrink-0 w-[120px] flex justify-center" data-testid={`card-category-${category.id}`}>
              <CategoryCircle category={category} />
            </Link>
          ))}
        </div>
      </div>
      <motion.div
        ref={ref}
        className="hidden md:grid grid-cols-4 lg:grid-cols-7 gap-8 md:gap-10 place-items-center"
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      >
        {categories.map((category) => (
          <Link key={category.id} href={`${base}/categories${category.name ? `?category=${encodeURIComponent(category.name)}` : ""}`} className="w-full flex justify-center">
            <motion.div
              variants={childVariants}
              className="w-full flex justify-center transform hover:-translate-y-2 transition-transform duration-300"
              data-testid={`card-category-${category.id}`}
            >
              <CategoryCircle category={category} />
            </motion.div>
          </Link>
        ))}
      </motion.div>
    </>
  );
}

export default function Home() {
  const t = useTranslations('Home');
  const reduced = usePrefersReducedMotion();
  const params = useParams();
  const locale = (params?.locale as string) ?? "en";
  const base = `/${locale}`;
  const showLoyalty = process.env.NEXT_PUBLIC_FEATURE_LOYALTY === 'true' || true; // Force true for demo

  const nowShowing = MOVIES.filter((m) => m.status === "now_showing");
  const comingSoon = MOVIES.filter((m) => m.status === "coming_soon");
  const advanceBooking = MOVIES.filter((m) => m.status === "advance_booking");

  const [selectedLocation, setSelectedLocation] = useState("Dubai");
  const [showExplore, setShowExplore] = useState(false);
  const [activeNowTab, setActiveNowTab] = useState<"now_showing" | "coming_soon" | "advance_booking">("now_showing");
  const [personalizedEvents, setPersonalizedEvents] = useState(EVENTS);
  const [isAiOpen, setIsAiOpen] = useState(false);

  // Personalization Stub (Point 15)
  useEffect(() => {
    const withKids = localStorage.getItem("withKids") === "true";
    if (withKids) {
      // Move family/kids events to top
      const familyEvents = EVENTS.filter(e => e.tags?.includes("Family") || e.tags?.includes("Kids"));
      const otherEvents = EVENTS.filter(e => !e.tags?.includes("Family") && !e.tags?.includes("Kids"));
      setPersonalizedEvents([...familyEvents, ...otherEvents]);
    }
  }, []);

  const filteredNowMovies =
    activeNowTab === "now_showing"
      ? nowShowing
      : activeNowTab === "coming_soon"
        ? comingSoon
        : advanceBooking;

  // Ensure Now Showing grid always feels full (at least 4 rows on desktop)
  const MIN_NOW_ROWS = 4;
  const NOW_COLS_DESKTOP = 4;
  const targetNowCount = MIN_NOW_ROWS * NOW_COLS_DESKTOP;

  const paddedNowMovies =
    filteredNowMovies.length === 0
      ? []
      : filteredNowMovies.length >= targetNowCount
        ? filteredNowMovies
        : Array.from({ length: targetNowCount }, (_, i) =>
            filteredNowMovies[i % filteredNowMovies.length]
          );
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar onAiClick={() => setIsAiOpen(true)} />
      <div className="hidden md:block">
        <QuickBookTab />
      </div>
      
      <main className="flex-1">
        <HeroCarousel movies={MOVIES} />
        
        {/* AI Search Stub Removed from here as requested */}
        
        <FloatingControls isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} onOpen={() => setIsAiOpen(true)} />
        
        {/* Things to do header + Filters */}
        <div className="container mx-auto mt-12 md:mt-16 mb-8">

            <div className="flex flex-col gap-3 border-b border-border/20 pb-4">
              <div className="flex items-end justify-between gap-4">
                <div className="shrink-0 min-w-0">
                  <div className="flex flex-row items-baseline gap-2 mb-1 flex-wrap">
                      <h2 className="text-2xl sm:text-3xl md:text-5xl font-display font-black tracking-tight whitespace-nowrap">
                          {t('thingsToDo')}
                      </h2>
                      
                      {/* Location Dropdown */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            className="h-auto p-0 text-2xl sm:text-3xl md:text-5xl font-display font-black text-primary hover:text-primary/80 hover:bg-transparent flex items-baseline gap-1 whitespace-nowrap"
                          >
                            {selectedLocation}
                            <ChevronDown className="w-5 h-5 md:w-8 md:h-8 stroke-[3]" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-56">
                          <DropdownMenuItem onClick={() => setSelectedLocation("Dubai")}>
                            <MapPin className="mr-2 h-4 w-4" /> Dubai
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setSelectedLocation("Qatar")}>
                            <MapPin className="mr-2 h-4 w-4" /> Qatar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                  </div>
                  <p className="text-muted-foreground text-sm sm:text-base md:text-lg">{t('curated')}</p>
                </div>

                <div className="shrink-0 flex justify-end items-center">
                  <QuickFilters />
                </div>
              </div>
            </div>
        </div>

        {/* Categories - stagger on scroll */}
        <section className="container mx-auto mb-16 md:mb-20">
          <CategoriesStagger categories={CATEGORIES} reduced={reduced} base={base} />
        </section>

        {/* Gradient Container 1: Top Events & Attractions */}
        <div className="relative py-12 md:py-16">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent blur-3xl" />
            
            {/* Top Events */}
            <ContentRail 
              title={t('topEvents')}
              rows={2}
              action={<Button variant="link" className="text-primary text-xs md:text-sm">{t('viewAll')}</Button>}
            >
              {personalizedEvents.map(event => (
                <div key={event.id} className="snap-start shrink-0">
                  <EventCard event={event} variant="landscape" />
                </div>
              ))}
            </ContentRail>

            {/* Top Attractions */}
            <ContentRail 
              title={t('topAttractions')}
              rows={2}
              action={<Button variant="link" className="text-primary text-xs md:text-sm">{t('viewAll')}</Button>}
            >
              {personalizedEvents.slice().reverse().map(event => (
                <div key={`attr-${event.id}`} className="snap-start shrink-0">
                  <EventCard event={event} variant="landscape" />
                </div>
              ))}
            </ContentRail>
        </div>

        {/* Popular Artists */}
        <section className="container mx-auto py-8 bg-secondary/10 rounded-3xl mb-8">
          <div className="flex items-center justify-between gap-3 mb-6">
             <h2 className="text-2xl md:text-3xl font-display font-bold whitespace-nowrap">
               {t('popularArtists')}
             </h2>
             <Link href={`${base}/artists`}>
               <Button
                 variant="link"
                 className="text-primary text-xs md:text-sm px-0"
                 data-testid="button-view-all-artists"
               >
                 {t('viewAll')}
               </Button>
             </Link>
          </div>
          <div className="md:hidden -mx-4 px-4 overflow-x-auto no-scrollbar">
            <div className="flex gap-6">
              {ARTISTS.map((artist) => (
                <div
                  key={artist.id}
                  className="shrink-0 w-[120px] flex justify-center"
                  data-testid={`card-artist-${artist.id}`}
                >
                  <ArtistCircle artist={artist} />
                </div>
              ))}
            </div>
          </div>
          <div className="hidden md:grid grid-cols-3 lg:grid-cols-6 gap-10 place-items-center">
             {ARTISTS.map(artist => (
                <div key={artist.id} className="w-full flex justify-center" data-testid={`card-artist-${artist.id}`}>
                   <ArtistCircle artist={artist} />
                </div>
             ))}
          </div>
        </section>

        {/* Venues */}
        <div className="relative mb-8">
          <ContentRail
            title={t('venues')}
            action={
              <Link href={`${base}/venues`}>
                <Button
                  variant="link"
                  className="text-primary text-xs md:text-sm"
                >
                  {t('viewAll')} <ChevronRight className="w-3 h-3 ml-1" />
                </Button>
              </Link>
            }
          >
            {VENUES.map((venue) => (
              <div key={venue.id} className="snap-start shrink-0">
                <VenueCard venue={venue} />
              </div>
            ))}
          </ContentRail>
        </div>

        {/* Gradient Container 2: Events Today to Arabic Events */}
        <div className="relative pt-8 pb-0">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent blur-3xl" />
            
            {/* Events Today */}
            <div className="mb-8">
                <ContentRail title={t('eventsToday')}>
                  {EVENTS.slice(0, 3).map(event => (
                    <div key={`today-${event.id}`} className="snap-start shrink-0">
                      <EventCard event={event} variant="landscape" />
                    </div>
                  ))}
                </ContentRail>
            </div>

            {/* Festivals */}
            <div className="mb-8">
                <ContentRail title={t('festivals')} action={<Button variant="link" className="text-primary text-xs md:text-sm">{t('viewAll')} <ChevronRight className="w-3 h-3 ml-1"/></Button>}>
                  {EVENTS.filter((_, i) => i % 2 === 0).map(event => (
                     <div key={`fest-${event.id}`} className="snap-start shrink-0">
                      <EventCard event={event} variant="landscape" />
                    </div>
                  ))}
                </ContentRail>
            </div>

            {/* Nightlife */}
            <div className="bg-black/20 py-4 mb-2 backdrop-blur-sm border-y border-border/20">
              <ContentRail
                title={t('nightlife')}
                action={
                  <Button
                    variant="link"
                    className="text-primary text-xs md:text-sm font-bold"
                  >
                    {t('viewAll')} <ChevronRight className="w-3 h-3 ml-1" />
                  </Button>
                }
              >
                {EVENTS.map((event) => (
                  <div key={`night-${event.id}`} className="snap-start shrink-0">
                    <EventCard event={event} variant="landscape" />
                  </div>
                ))}
              </ContentRail>
            </div>

            {/* Expanded Content Section */}
            <div className={cn(
                "transition-all duration-700 ease-in-out overflow-hidden",
                showExplore ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
            )}>
                {/* Comedy Events */}
                <div className="mb-8 mt-6">
                    <ContentRail 
                        title={t('comedy')} 
                        action={<Button variant="link" className="text-primary text-xs md:text-sm">{t('viewAll')}</Button>}
                    >
                        {[...EVENTS, ...EVENTS].map((event, i) => (
                            <div key={`comedy-${i}`} className="snap-start shrink-0">
                                <ListingCard event={{...event, tags: i % 2 === 0 ? ["New"] : []}} />
                            </div>
                        ))}
                    </ContentRail>
                </div>

                {/* Arabic Events */}
                <div className="mb-8">
                    <ContentRail 
                        title={t('arabic')}
                        action={<Button variant="link" className="text-primary text-xs md:text-sm">{t('viewAll')}</Button>}
                    >
                        {[...EVENTS].reverse().map((event, i) => (
                            <div key={`arabic-${i}`} className="snap-start shrink-0">
                                <ListingCard event={event} />
                            </div>
                        ))}
                    </ContentRail>
                </div>
            </div>
        </div>

        {/* Explore More Trigger */}
        <div className="relative pt-2 pb-8 flex justify-center items-center">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent blur-3xl" />
            
            <Button 
                variant="outline" 
                className="relative z-10 rounded-full px-10 py-7 border-gray-300 bg-white dark:border-white/20 dark:bg-black/40 backdrop-blur-md text-black hover:text-gray-600 hover:bg-gray-100 dark:text-white dark:hover:bg-white/10 dark:hover:border-white/40 transition-all duration-300 group"
                onClick={() => setShowExplore(!showExplore)}
            >
                <span className="text-lg font-display">{t('exploreMore')}</span>
                <ChevronDown className={cn("ml-2 w-5 h-5 transition-transform duration-300", showExplore && "rotate-180")} />
            </Button>
        </div>

        {/* Movies Section */}
        <section className="relative py-12 md:py-16">

          <div className="absolute inset-0 bg-gradient-to-b from-[#020617] via-[#020617] to-[#020617]" />
          <div className="relative container mx-auto space-y-8">
            {/* Movies heading */}
            <div className="flex items-baseline justify-between gap-3">
              <div className="min-w-0">
                <h2 className="text-2xl md:text-3xl font-display font-bold tracking-tight text-white">
                  {t('movies')}
                </h2>
                <div className="h-1 w-16 md:w-20 bg-primary mt-2 rounded-full" />
              </div>
            </div>

            {/* Tabs + Filters row */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-8">
              {/* Tabs */}
              <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs md:text-sm">
                {([
                  { key: "now_showing", label: t('nowShowing'), count: nowShowing.length },
                  { key: "coming_soon", label: t('comingSoon'), count: MOVIES.filter((m) => m.status === "coming_soon").length },
                  { key: "advance_booking", label: t('advanceBooking'), count: MOVIES.filter((m) => m.status === "advance_booking").length },
                ] as const).map((tab) => (
                  <button
                    key={tab.key}
                    className={cn(
                      "px-4 py-2 rounded-full border text-[11px] md:text-xs font-semibold flex items-center gap-2 bg-white/5 hover:bg-white/10 transition-colors",
                      activeNowTab === tab.key
                        ? "border-[#ffdd00] bg-[#ffdd00]/10 text-white"
                        : "border-white/10 text-white/70"
                    )}
                    onClick={() => setActiveNowTab(tab.key)}
                    data-testid={`tab-now-${tab.key}`}
                  >
                    <span>{tab.label}</span>
                    <span className="inline-flex items-center justify-center min-w-[1.75rem] h-5 rounded-full bg-black/60 text-[10px] font-bold">
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>

              {/* Filter row */}
              <div className="flex flex-wrap items-center gap-2 md:gap-3 text-[11px] md:text-xs">
                {[
                  { key: "cinema", label: "Cinema" },
                  { key: "experience", label: "Experience" },
                  { key: "language", label: "Language" },
                  { key: "genre", label: "Genre" },
                ].map((filter) => (
                  <button
                    key={filter.key}
                    className="px-3 md:px-4 py-2 rounded-full border border-white/10 bg-white/5 text-white/80 flex items-center gap-2 hover:bg-white/10 transition-colors"
                    data-testid={`button-filter-${filter.key}`}
                  >
                    <span>{filter.label}</span>
                    <ChevronDown className="w-3 h-3" />
                  </button>
                ))}
              </div>
            </div>

            {/* Movies grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
              {paddedNowMovies.map((movie, index) => (
                <div
                  key={`${movie.id}-${index}`}
                  className="group rounded-3xl bg-gradient-to-b from-white/5 via-white/5 to-black/40 p-[3px] shadow-xl shadow-black/60 hover:shadow-[0_18px_45px_rgba(0,0,0,0.9)] transition-shadow"
                  data-testid={`card-now-${movie.id}-${index}`}
                >
                  <div className="rounded-[1.25rem] overflow-hidden bg-black">
                    <PosterCard movie={movie} />
                  </div>
                </div>
              ))}
            </div>

            {/* Explore more within now showing - black default, gray hover in light mode */}
            <div className="flex justify-center pt-4 md:pt-8">
              <Button
                variant="outline"
                className="relative z-10 rounded-full px-8 py-6 border-gray-300 bg-white dark:border-white/20 dark:bg-black/40 backdrop-blur-md text-black hover:text-gray-600 hover:bg-gray-100 dark:text-white dark:hover:bg-white/10 dark:hover:border-white/40 transition-all duration-300 group text-sm md:text-base"
                data-testid="button-now-explore-more"
              >
                <span className="font-display">{t('exploreMore')}</span>
                <ChevronDown className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-y-0.5" />
              </Button>
            </div>
          </div>
        </section>

        <AutoScrollOffers offers={OFFERS} />
        <Top10Module />
        <AppDownloadBanner />
        
        {/* Loyalty Program Stub (Point 12) */}
        {showLoyalty && <LoyaltyBanner />}

        <BlogsSection />
        <TrustStrip />
      </main>
      <MobileTabbar />
      <Footer />
    </div>
  );
}

