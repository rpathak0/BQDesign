"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { MobileTabbar } from "@/components/layout/mobile-tabbar";
import { SectionHero, FeatureGrid, CTABlocks } from "@/components/marketing";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, Building2, Music, Compass, Calendar, BarChart3, Smartphone } from "lucide-react";
const CATEGORY_CHIPS = [
  { id: "1", label: "Corporate Events", icon: Briefcase },
  { id: "2", label: "Exhibitions & Conferences", icon: Building2 },
  { id: "3", label: "Clubs & Nights", icon: Music },
  { id: "4", label: "Concerts & Festivals", icon: Music },
  { id: "5", label: "Attractions, Tours & Excursions", icon: Compass },
];

const VENUE_FEATURES = [
  {
    id: "v1",
    title: "Venue Selection Support",
    description: "We help you find and list the right venue for your event with our network of partners.",
    icon: <Building2 className="w-6 h-6" />,
  },
  {
    id: "v2",
    title: "Comprehensive Reporting and Marketing",
    description: "Access analytics and marketing tools to grow your audience and track sales.",
    icon: <BarChart3 className="w-6 h-6" />,
  },
  {
    id: "v3",
    title: "Efficient CRM & Ticketing",
    description: "Manage attendees and tickets in one place with our integrated CRM and ticketing system.",
    icon: <Smartphone className="w-6 h-6" />,
  },
];

const ARTICLE_CARDS = [
  { id: "1", title: "How to set up your first event", snippet: "Step-by-step guide to listing and selling tickets.", image: "/assets/hero-bg.png" },
  { id: "2", title: "VAT in the UAE", snippet: "Understand tax obligations for event organisers.", image: "/assets/hero-bg.png" },
  { id: "3", title: "Printing tickets", snippet: "Options for physical and e-tickets.", image: "/assets/hero-bg.png" },
];

export default function OrganisersPage() {
  const params = useParams();
  const locale = (params?.locale as string) ?? "en";
  const base = `/${locale}`;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar variant="light" />
      <main className="flex-1 pt-20 md:pt-24">
        <SectionHero
          title="Cutting-edge ticketing solutions"
          subtitle="Sell tickets for concerts, festivals, corporate events, exhibitions, and attractions. One platform, full control, and dedicated support for organisers across the region."
        />

        <section className="py-8 md:py-12">
          <div className="container mx-auto px-4 sm:px-5 md:px-6">
            <div className="flex flex-wrap justify-center gap-3">
              {CATEGORY_CHIPS.map((chip) => (
                <Button
                  key={chip.id}
                  variant="outline"
                  className="rounded-xl gap-2"
                  asChild
                >
                  <Link href={`${base}/contact`}>
                    <chip.icon className="w-4 h-4" />
                    {chip.label}
                  </Link>
                </Button>
              ))}
            </div>
            <div className="mt-10 flex flex-wrap gap-6 justify-center items-center text-muted-foreground text-sm">
              <Button asChild>
                <Link href={`${base}/create-event`}>Create an event</Link>
              </Button>
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                All event types
              </span>
              <span className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Analytics
              </span>
              <span className="flex items-center gap-2">
                <Smartphone className="w-4 h-4" />
                Mobile-friendly
              </span>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16 border-t border-border/50">
          <div className="container mx-auto px-4 sm:px-5 md:px-6">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-center text-foreground mb-10">
              Sell tickets to your event or attraction
            </h2>
            <div className="grid md:grid-cols-2 gap-10 items-center max-w-4xl mx-auto">
              <div className="rounded-xl bg-muted/50 aspect-video flex items-center justify-center text-muted-foreground">
                [Ticket / dashboard visual]
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Attractions, Tours and Excursions</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  List your attraction or tour on BookingQube and reach millions of visitors. Flexible ticketing, timed slots, and integrated payments.
                </p>
                <Button variant="ghost" className="gap-2" asChild>
                  <Link href={`${base}/contact`}>
                    Learn more
                    <span aria-hidden>→</span>
                  </Link>
                </Button>
              </div>
            </div>
            <div className="mt-10 flex justify-center">
              <Card className="rounded-xl max-w-md">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="rounded-lg bg-primary/10 p-3 text-primary">
                    <Briefcase className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Get useful tips on how to organize an event!</p>
                    <Button variant="link" className="p-0 h-auto mt-1" asChild>
                      <Link href={`${base}/faq`}>Organiser&apos;s Guide</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-5 md:px-6">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-center text-foreground mb-10">
              Simplified Venue Selection for Effortless Event Planning
            </h2>
            <div className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto">
              {VENUE_FEATURES.map((f) => (
                <Card key={f.id} className="rounded-xl">
                  <CardContent className="p-6">
                    <div className="mb-3 text-primary">{f.icon}</div>
                    <h3 className="font-semibold text-foreground mb-2">{f.title}</h3>
                    <p className="text-sm text-muted-foreground">{f.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4 sm:px-5 md:px-6">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-center text-foreground mb-10">
              Explore our insightful articles for valuable knowledge sharing
            </h2>
            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
              {ARTICLE_CARDS.map((card) => (
                <Card key={card.id} className="rounded-xl min-w-[280px] shrink-0">
                  <CardContent className="p-0">
                    <div className="aspect-video bg-muted rounded-t-xl" />
                    <div className="p-4">
                      <h3 className="font-semibold text-foreground mb-1">{card.title}</h3>
                      <p className="text-sm text-muted-foreground">{card.snippet}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <CTABlocks
          title="More than just a ticket selling software"
          blocks={[
            {
              id: "b1",
              title: "Book a quick call",
              description: "Discuss your needs with our ticketing experts.",
              buttonLabel: "Book a Demo",
              buttonHref: `${base}/contact`,
              icon: <Building2 className="w-8 h-8" />,
            },
            {
              id: "b2",
              title: "Contact our team",
              description: "Have questions? We're here to help.",
              buttonLabel: "Reach out to us",
              buttonHref: `${base}/contact`,
              icon: <Smartphone className="w-8 h-8" />,
            },
          ]}
        />
      </main>
      <MobileTabbar />
      <Footer />
    </div>
  );
}
