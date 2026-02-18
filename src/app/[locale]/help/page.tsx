"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { MobileTabbar } from "@/components/layout/mobile-tabbar";
import { Input } from "@/components/ui/input";
import { HELP_COLLECTIONS, searchCollectionsAndArticles } from "@/data/helpCenter";
import { HelpCircle, Ticket, ClipboardList, TrendingUp, Search } from "lucide-react";

const COLLECTION_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  "help-circle": HelpCircle,
  ticket: Ticket,
  clipboard: ClipboardList,
  "trending-up": TrendingUp,
};

export default function HelpPage() {
  const params = useParams();
  const locale = (params?.locale as string) ?? "en";
  const [searchQuery, setSearchQuery] = useState("");

  const { collections } = searchCollectionsAndArticles(searchQuery);
  const displayCollections = searchQuery.trim() ? collections : HELP_COLLECTIONS;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar variant="light" />
      <main className="flex-1 pt-20 md:pt-24">
        {/* Hero */}
        <section className="bg-gradient-to-b from-primary/15 via-primary/5 to-background py-12 md:py-16">
          <div className="container mx-auto px-4 sm:px-5 md:px-6 text-center">
            <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight text-foreground mb-4">
              We&apos;re here to help!
            </h1>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Find quick answers or reach out to our team anytime.
            </p>
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search for articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 rounded-xl bg-background border-border"
              />
            </div>
          </div>
        </section>

        {/* Category cards */}
        <section className="container mx-auto px-4 sm:px-5 md:px-6 py-12 max-w-3xl">
          <div className="space-y-4">
            {displayCollections.map((col) => {
              const Icon = col.icon ? COLLECTION_ICONS[col.icon] : HelpCircle;
              return (
                <Link
                  key={col.id}
                  href={`/${locale}/help/${col.slug}`}
                  className="flex items-start gap-4 p-4 rounded-xl border border-border bg-card hover:border-primary/30 hover:bg-primary/5 transition-colors"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <Icon className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="font-semibold text-foreground">{col.title}</h2>
                    {col.description && (
                      <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">{col.description}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-2">{col.articleCount} articles</p>
                  </div>
                </Link>
              );
            })}
          </div>
          {displayCollections.length === 0 && (
            <p className="text-center text-muted-foreground py-8">No articles match your search.</p>
          )}
        </section>
      </main>
      <MobileTabbar />
      <Footer />
    </div>
  );
}
