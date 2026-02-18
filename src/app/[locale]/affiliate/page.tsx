"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { MobileTabbar } from "@/components/layout/mobile-tabbar";
import { SectionHero, FeatureGrid, StepsSection, CTABlocks } from "@/components/marketing";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AFFILIATE_PARTNER_LOGOS,
  AFFILIATE_WHY_US,
  AFFILIATE_STEPS,
  AFFILIATE_EXTRA_FEATURES,
} from "@/data/affiliate";
import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { staggerContainer, staggerChild } from "@/lib/motion-variants";
import {
  Percent,
  LayoutDashboard,
  Headphones,
  Gift,
  Clock,
  UserPlus,
  Ticket,
  BarChart3,
  Wallet,
  Globe,
  Zap,
  CreditCard,
  Linkedin,
} from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  percent: Percent,
  "layout-dashboard": LayoutDashboard,
  headphones: Headphones,
  gift: Gift,
  clock: Clock,
  "user-plus": UserPlus,
  ticket: Ticket,
  "bar-chart": BarChart3,
  wallet: Wallet,
  globe: Globe,
  zap: Zap,
  "credit-card": CreditCard,
};

export default function AffiliatePage() {
  const params = useParams();
  const locale = (params?.locale as string) ?? "en";
  const base = `/${locale}`;
  const reduced = usePrefersReducedMotion();

  const whyUsItems = AFFILIATE_WHY_US.map((f) => ({
    id: f.id,
    title: f.title,
    description: f.description,
    icon: f.icon ? (() => {
      const Icon = iconMap[f.icon as keyof typeof iconMap];
      return Icon ? <Icon className="w-6 h-6" /> : null;
    })() : null,
  }));

  const steps = AFFILIATE_STEPS.map((s, i) => ({
    id: s.id,
    title: s.title,
    description: s.description,
    icon: s.icon ? (() => {
      const Icon = iconMap[s.icon as keyof typeof iconMap];
      return Icon ? <Icon className="w-6 h-6" /> : null;
    })() : <span className="font-display font-bold">{i + 1}</span>,
  }));

  const extraItems = AFFILIATE_EXTRA_FEATURES.map((f) => ({
    id: f.id,
    title: f.title,
    description: f.description,
    icon: f.icon ? (() => {
      const Icon = iconMap[f.icon as keyof typeof iconMap];
      return Icon ? <Icon className="w-6 h-6" /> : null;
    })() : null,
  }));

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar variant="light" />
      <main className="flex-1">
        <SectionHero
          title="The Best Ticketing Affiliate Program of The Gulf Region"
          subtitle="Join BookingQube's affiliate program and earn commissions by promoting the region's best events, attractions, and experiences. One dashboard, flexible payouts, and dedicated support."
          primaryCta={{ label: "Get Started", href: `${base}/contact` }}
          secondaryCta={{ label: "Watch Video" }}
        />

        <FeatureGrid title="Why partners choose us" items={whyUsItems} columns={3} />

        <StepsSection title="Easy to start" steps={steps} />

        <section className="py-12 md:py-16 border-t border-border/50">
          <div className="container mx-auto px-4 sm:px-5 md:px-6">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-center text-foreground mb-10">
              Our partners
            </h2>
            <div className="flex flex-wrap justify-center gap-8 items-center">
              {AFFILIATE_PARTNER_LOGOS.map((p) => (
                <div
                  key={p.id}
                  className="h-12 w-32 rounded-lg bg-muted flex items-center justify-center text-muted-foreground text-sm font-medium"
                >
                  {p.name}
                </div>
              ))}
            </div>
            <p className="text-center text-muted-foreground mt-6">Would you like to be here?</p>
            <div className="flex justify-center mt-3">
              <Button asChild>
                <Link href={`${base}/contact`}>Register</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-5 md:px-6 max-w-3xl text-center">
            <p className="text-lg text-foreground">
              BookingQube is the market leader in MENA region and has a diversifying offering that
              includes concerts, as well as sport and other attractions.
            </p>
            <Link href={`${base}/about`} className="inline-block mt-4 text-primary font-medium hover:underline">
              Find out more
            </Link>
          </div>
        </section>

        <FeatureGrid items={extraItems} columns={4} />

        <section className="py-12 md:py-16 border-t border-border/50">
          <div className="container mx-auto px-4 sm:px-5 md:px-6 max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-center text-foreground mb-10">
              Let&apos;s get you started!
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="rounded-xl">
                <CardContent className="p-6 text-center">
                  <div className="mb-3 flex justify-center text-primary">
                    <LayoutDashboard className="w-8 h-8" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Register now</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Create your affiliate account and get your unique links.
                  </p>
                  <Button asChild>
                    <Link href={`${base}/contact`}>Get Started</Link>
                  </Button>
                </CardContent>
              </Card>
              <Card className="rounded-xl">
                <CardContent className="p-6 text-center">
                  <div className="mb-3 flex justify-center text-primary">
                    <Headphones className="w-8 h-8" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Chat with us</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Have questions? We&apos;re here to help.
                  </p>
                  <Button variant="outline" asChild>
                    <Link href={`${base}/contact`}>Connect now</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <MobileTabbar />
      <Footer />
    </div>
  );
}
