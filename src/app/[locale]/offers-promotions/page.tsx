"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { ChevronLeft, Search } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { MobileTabbar } from "@/components/layout/mobile-tabbar";
import { SafeImage } from "@/components/shared/safe-image";
import { OFFER_PROMOTIONS } from "@/data/offersPromotions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ContentRail } from "@/components/home/content-rail";

export default function OffersPromotionsPage() {
  const params = useParams();
  const locale = (params?.locale as string) ?? "en";
  const base = `/${locale}`;
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const filters = ["All", "Novo Offers & Promotions", "Bank Offers & Promotions", "Collectibles"];
  const offerPool = useMemo(() => OFFER_PROMOTIONS, []);

  const filteredOffers = offerPool.filter((offer) => {
    const matchesFilter = activeFilter === "All" || offer.tag === activeFilter;
    const q = query.trim().toLowerCase();
    const matchesQuery =
      q.length === 0 ||
      offer.title.toLowerCase().includes(q) ||
      offer.description.toLowerCase().includes(q);
    return matchesFilter && matchesQuery;
  });

  const featured = filteredOffers[0] ?? offerPool[0];
  const featuredSlides = useMemo(() => {
    const slides = filteredOffers.slice(0, Math.min(5, filteredOffers.length));
    return slides.length > 0 ? slides : [filteredOffers[0] ?? offerPool[0]];
  }, [filteredOffers, offerPool]);
  const bankOffers = useMemo(() => {
    const banks = offerPool.filter((offer) => offer.tag === "Bank Offers & Promotions");
    if (banks.length === 0) return [];
    return Array.from({ length: 10 }, (_, i) => ({
      ...banks[i % banks.length],
      id: `${banks[i % banks.length].id}-rail-${i}`,
    }));
  }, [offerPool]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar variant="light" />
      <main className="flex-1 pt-20 md:pt-24 bg-background">
        <div className="w-full bg-gradient-to-r from-[#2a1138] to-[#1d0f2e] border-y border-white/10 min-h-[130px] flex items-center">
          <div className="container mx-auto px-4 sm:px-5 md:px-6 py-8 md:py-10">
            <h1 className="text-4xl md:text-5xl font-display font-black tracking-tight text-white">
              Offers & Promotions
            </h1>
            <p className="text-white/70 mt-2 max-w-2xl">
              Discover the latest combos, bank deals, collectibles, and limited-time cinema promotions.
            </p>
          </div>
        </div>

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
              <span className="text-foreground font-medium">Offers & Promotions</span>
            </div>
          </nav>

          <section className="rounded-2xl border border-border/60 bg-card p-3 md:p-4 mb-8">
            <div className="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
              <div className="flex flex-wrap items-center gap-2">
                {filters.map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setActiveFilter(filter)}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-xs md:text-sm transition-colors border",
                      activeFilter === filter
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background text-foreground border-border hover:border-primary/40"
                    )}
                  >
                    {filter}
                  </button>
                ))}
              </div>

              <div className="relative w-full lg:w-[360px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="search for offers & promotions"
                  className="h-10 w-full rounded-full bg-background border border-border pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
                />
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 mb-10">
            {filteredOffers.map((offer) => (
              <article
                key={offer.id}
                className="rounded-xl overflow-hidden border border-border/60 bg-card hover:border-primary/50 transition-colors"
              >
                <Link href={`${base}/offers-promotions/${offer.slug}`} className="group block">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <SafeImage
                      src={offer.image}
                      alt={offer.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-display font-bold text-foreground line-clamp-2 uppercase">{offer.title}</h3>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[11px] text-muted-foreground line-clamp-1">{offer.tag}</span>
                      <Button size="sm" className="h-7 rounded-full px-3 text-xs pointer-events-none">
                        Learn More
                      </Button>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </section>

          <div className="mb-10">
            <ContentRail
              title={featured.title}
              action={
                <div className="hidden md:flex items-center gap-2">
                  <Button size="sm" variant="secondary" className="rounded-full h-8 px-3 text-xs">
                    Avail this offer
                  </Button>
                  <Link href={`${base}/offers-promotions/${featured.slug}`}>
                    <Button size="sm" className="rounded-full h-8 px-3 text-xs">
                      Learn More
                    </Button>
                  </Link>
                </div>
              }
            >
              {featuredSlides.map((slide) => (
                <div key={slide.slug} className="shrink-0 snap-start w-[min(100vw-2rem,1100px)]">
                  <Link
                    href={`${base}/offers-promotions/${slide.slug}`}
                    className="group block rounded-2xl overflow-hidden border border-border/60 bg-card"
                  >
                    <div className="relative aspect-[16/7] overflow-hidden">
                      <SafeImage
                        src={slide.image}
                        alt={slide.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  </Link>
                </div>
              ))}
            </ContentRail>
            <p className="text-muted-foreground text-sm mt-2 px-4 sm:px-5 md:px-6">Ready to power-up</p>
          </div>

          <div className="rounded-2xl border border-border/60 bg-card p-4 md:p-5 mb-6">
            <ContentRail title="Popular Bank Offers">
              {bankOffers.map((offer) => (
                <article
                  key={offer.id}
                  className="shrink-0 snap-start w-[220px] rounded-xl overflow-hidden border border-border/60 bg-background"
                >
                  <Link href={`${base}/offers-promotions/${offer.slug}`} className="group block">
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <SafeImage
                        src={offer.image}
                        alt={offer.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-2.5">
                      <h3 className="text-xs font-bold text-foreground line-clamp-2">{offer.title}</h3>
                      <Button size="sm" className="h-6 rounded-full px-2.5 text-[11px] mt-2 pointer-events-none">
                        View
                      </Button>
                    </div>
                  </Link>
                </article>
              ))}
            </ContentRail>
          </div>
        </div>
      </main>
      <MobileTabbar />
      <Footer />
    </div>
  );
}
