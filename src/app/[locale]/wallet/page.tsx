"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { MobileTabbar } from "@/components/layout/mobile-tabbar";
import { Button } from "@/components/ui/button";
export default function WalletPage() {
  const params = useParams();
  const locale = (params?.locale as string) ?? "en";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar variant="light" />
      <main className="flex-1 container mx-auto pt-20 md:pt-24 py-8 md:py-12 max-w-3xl px-4 sm:px-5 md:px-6">
        <Link
          href={`/${locale}`}
          className="text-sm text-muted-foreground hover:text-foreground mb-6 inline-block"
        >
          ← Home
        </Link>
        <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-6">
          Wallet
        </h1>

        {/* Balance card */}
        <div className="rounded-2xl border border-border bg-card p-6 md:p-8 mb-8">
          <p className="text-2xl md:text-3xl font-bold text-foreground mb-2">Balance 0.00 USD</p>
          <p className="text-muted-foreground text-sm">
            Easily top up, pay for tickets and get instant refunds — securely and hassle-free.
          </p>
        </div>

        {/* Your Wallet, One Tap Away */}
        <section className="rounded-2xl border border-border bg-card p-6 md:p-8">
          <h2 className="text-xl font-display font-semibold text-foreground mb-2">
            Your Wallet, One Tap Away with BookingQube App
          </h2>
          <p className="text-muted-foreground text-sm mb-6">
            Scan the QR code for all stores.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="flex h-40 w-40 shrink-0 items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/50">
              <span className="text-xs text-muted-foreground">QR code</span>
            </div>
            <div className="flex flex-col gap-3">
              <Button asChild className="w-full sm:w-auto">
                <a href="https://play.google.com" target="_blank" rel="noopener noreferrer">
                  Get it on Google Play
                </a>
              </Button>
              <Button variant="outline" asChild className="w-full sm:w-auto">
                <a href="https://apple.com/app-store" target="_blank" rel="noopener noreferrer">
                  Download on the App Store
                </a>
              </Button>
              <Button variant="ghost" size="sm" asChild className="w-full sm:w-auto">
                <a href="https://appgallery.huawei.com" target="_blank" rel="noopener noreferrer">
                  Explore it on AppGallery
                </a>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <MobileTabbar />
      <Footer />
    </div>
  );
}
