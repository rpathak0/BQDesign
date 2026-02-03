"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { MobileTabbar } from "@/components/layout/mobile-tabbar";
import { ArtistCircle } from "@/components/cards/artist-circle";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronDown, MapPin, ChevronLeft } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ARTISTS, ARTIST_GENRES } from "@/data/bqData";
import type { Artist } from "@/data/bqData";
import { TrustStrip } from "@/components/home/trust-strip";
import { cn } from "@/lib/utils";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { staggerContainer, staggerChild } from "@/lib/motion-variants";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

export default function ArtistsPage() {
  const params = useParams();
  const locale = (params?.locale as string) ?? "en";
  const [location, setLocation] = useState("Dubai");
  const [activeGenre, setActiveGenre] = useState<string | null>(null);
  const [showMore, setShowMore] = useState(false);
  const reduced = usePrefersReducedMotion();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  const filtered = activeGenre && activeGenre !== "All"
    ? ARTISTS.filter((a) => (a.genre ?? "").toLowerCase() === activeGenre.toLowerCase())
    : ARTISTS;

  const byGenre = ARTIST_GENRES.filter((g) => g !== "All").map((genre) => ({
    genre,
    artists: ARTISTS.filter((a) => (a.genre ?? "").toLowerCase() === genre.toLowerCase()),
  })).filter((g) => g.artists.length > 0);

  const containerVariants = reduced ? {} : staggerContainer;
  const childVariants = reduced ? {} : staggerChild;

  const base = `/${locale}`;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container mx-auto py-6 md:py-8">
          {/* Navigation: Back | Home > Artists */}
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
              <span className="text-foreground font-medium">Artists</span>
            </div>
          </nav>

          {/* Title + Location (Artists in [Doha v]) */}
          <div className="flex flex-wrap items-baseline gap-2 mb-6">
            <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight text-foreground">
              Artists in{" "}
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

          {/* Genre filter tabs */}
          <div className="flex flex-wrap items-center gap-2 mb-8 overflow-x-auto no-scrollbar pb-2">
            {ARTIST_GENRES.map((genre) => (
              <button
                key={genre}
                onClick={() => setActiveGenre(activeGenre === genre ? null : genre)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors",
                  activeGenre === genre
                    ? "bg-white dark:bg-card text-primary border-2 border-primary"
                    : "bg-muted/60 text-muted-foreground hover:bg-muted"
                )}
              >
                {genre === "All" ? "All categories" : `${genre} artists`}
              </button>
            ))}
          </div>

          {/* Artists with upcoming events (featured) */}
          {!activeGenre && ARTISTS.length > 0 && (
            <section className="mb-12">
              <div className="flex items-center justify-between gap-4 mb-4">
                <h2 className="text-xl md:text-2xl font-display font-bold">
                  Artists with upcoming events
                </h2>
              </div>
              <motion.div
                ref={ref}
                className="flex flex-wrap gap-8 md:gap-10 justify-center md:justify-start"
                variants={containerVariants}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
              >
                {ARTISTS.slice(0, 4).map((artist) => (
                  <motion.div
                    key={artist.id}
                    variants={childVariants}
                    className="w-[140px] md:w-[160px] flex justify-center"
                  >
                    <ArtistCircle artist={artist} />
                  </motion.div>
                ))}
              </motion.div>
            </section>
          )}

          {/* By genre sections */}
          {!activeGenre &&
            byGenre.slice(0, showMore ? undefined : 3).map(({ genre, artists }) => (
              <section key={genre} className="mb-12">
                <div className="flex items-center justify-between gap-4 mb-4">
                  <h2 className="text-xl md:text-2xl font-display font-bold">
                    {genre} artists
                  </h2>
                  <button
                    onClick={() => setActiveGenre(genre)}
                    className="text-sm text-primary font-medium hover:underline"
                  >
                    Show all
                  </button>
                </div>
                <motion.div
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8 place-items-center"
                  variants={containerVariants}
                  initial="hidden"
                  animate={inView ? "visible" : "hidden"}
                >
                  {artists.slice(0, 12).map((artist) => (
                    <motion.div
                      key={artist.id}
                      variants={childVariants}
                      className="w-full max-w-[140px] flex justify-center"
                    >
                      <ArtistCircle artist={artist} />
                    </motion.div>
                  ))}
                </motion.div>
              </section>
            ))}

          {/* Single genre / all view */}
          {(activeGenre || (activeGenre === null && byGenre.length === 0)) && (
            <motion.div
              ref={ref}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8 place-items-center"
              variants={containerVariants}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
            >
              {filtered.map((artist) => (
                <motion.div
                  key={artist.id}
                  variants={childVariants}
                  className="w-full max-w-[140px] flex justify-center"
                >
                  <ArtistCircle artist={artist} />
                </motion.div>
              ))}
            </motion.div>
          )}

          {!activeGenre && byGenre.length > 3 && !showMore && (
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
