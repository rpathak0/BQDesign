"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { MobileTabbar } from "@/components/layout/mobile-tabbar";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

export default function FavouritesPage() {
  const params = useParams();
  const locale = (params?.locale as string) ?? "en";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar variant="light" />
      <main className="flex-1 container mx-auto pt-20 md:pt-24 py-8 md:py-12 max-w-2xl px-4 sm:px-5 md:px-6">
        <Link
          href={`/${locale}`}
          className="text-sm text-muted-foreground hover:text-foreground mb-6 inline-block"
        >
          ← Home
        </Link>
        <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-2">
          My favourites
        </h1>
        <p className="text-muted-foreground text-sm mb-8">
          Events and experiences you&apos;ve saved for later.
        </p>

        <div className="rounded-2xl border border-border bg-card p-8 md:p-12 text-center">
          <div className="mx-auto mb-6 flex h-28 w-28 items-center justify-center rounded-xl bg-primary/5">
            <Heart className="h-14 w-14 text-primary/50" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">You have no favourites yet</h2>
          <p className="text-muted-foreground text-sm mb-6 max-w-sm mx-auto">
            To add a favourite, simply tap the heart on any item.
          </p>
          <Button asChild>
            <Link href={`/${locale}/events`}>Browse events</Link>
          </Button>
        </div>
      </main>
      <MobileTabbar />
      <Footer />
    </div>
  );
}
