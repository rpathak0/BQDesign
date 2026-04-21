import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, CreditCard, ShieldCheck, Ticket, WalletCards, MapPin } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { MobileTabbar } from "@/components/layout/mobile-tabbar";
import { SafeImage } from "@/components/shared/safe-image";
import { MapEmbed } from "@/components/events/map-embed";
import { EVENTS, VENUES } from "@/data/bqData";
import { getVenueProfile } from "@/data/venueProfiles";

interface VenueDetailPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export default async function VenueDetailPage({ params }: VenueDetailPageProps) {
  const { locale, slug } = await params;
  const base = `/${locale}`;
  const venue = VENUES.find((item) => item.slug === slug);
  const profile = getVenueProfile(slug);

  if (!venue || !profile) notFound();

  const upcomingEvents = EVENTS.filter((event) => profile.upcomingEventIds.includes(event.id));
  const nearbyEvents = EVENTS.filter((event) => profile.nearbyEventIds.includes(event.id));
  const featuredUpcoming = upcomingEvents[0];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar variant="light" />
      <main className="flex-1 pt-20 md:pt-24">
        <div className="container mx-auto py-6 md:py-8 px-4 sm:px-5 md:px-6 max-w-7xl">
          <nav className="text-sm mb-4 flex items-center gap-3 flex-wrap">
            <Link
              href={`${base}/venues`}
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
              <Link href={`${base}/venues`} className="hover:text-foreground transition-colors">
                Venues
              </Link>
              <span className="text-muted-foreground/70">&#62;</span>
              <span className="text-foreground font-medium">{venue.name}</span>
            </div>
          </nav>

          <div className="relative aspect-[16/6] overflow-hidden rounded-2xl border border-border/60 mb-5">
            <SafeImage src={venue.image} alt={venue.name} className="w-full h-full object-cover" />
          </div>

          <section className="mb-10 rounded-2xl border border-border/60 bg-card p-4 md:p-5">
            <div className="flex items-start justify-between gap-4 mb-2">
              <div className="min-w-0">
                <h1 className="text-2xl md:text-3xl font-display font-bold tracking-tight text-foreground">
                  {venue.name}
                </h1>
                <p className="text-muted-foreground mt-1">{venue.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground mt-4">
              <MapPin className="w-4 h-4 text-primary" />
              <span>{profile.address}</span>
            </div>
          </section>

          {featuredUpcoming && (
            <section className="mb-10">
              <h2 className="text-3xl md:text-4xl font-display font-black mb-4">Upcoming Events</h2>
              <Link
                href={`${base}/events/${featuredUpcoming.slug ?? ""}`}
                className="grid grid-cols-1 md:grid-cols-[360px_1fr] gap-5 rounded-2xl border border-border/60 bg-card p-4 hover:border-primary/50 transition-colors"
              >
                <div className="relative aspect-[16/10] md:aspect-auto md:h-[220px] rounded-xl overflow-hidden">
                  <SafeImage src={featuredUpcoming.image} alt={featuredUpcoming.title} className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xl md:text-2xl font-display font-bold line-clamp-2">{featuredUpcoming.title}</h3>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2">
                    <span className="text-2xl font-display font-bold">{featuredUpcoming.price.replace("From ", "")}</span>
                    <span className="text-lg font-semibold text-primary">Best seats available</span>
                  </div>
                  <p className="text-xl mt-1">{featuredUpcoming.date}</p>
                  <p className="text-muted-foreground mt-3 line-clamp-3">
                    {`Discover events hosted at ${venue.name} and nearby venues in ${venue.location}.`}
                  </p>
                </div>
              </Link>
            </section>
          )}

          {upcomingEvents.length > 1 && (
            <section className="mb-10">
              <h2 className="text-xl font-display font-bold mb-4">More upcoming events</h2>
              <div className="space-y-3">
                {upcomingEvents.slice(1).map((event) => (
                  <Link
                    key={event.id}
                    href={`${base}/events/${event.slug ?? ""}`}
                    className="flex gap-3 rounded-xl border border-border/60 bg-card p-3 hover:border-primary/50 transition-colors"
                  >
                    <div className="relative w-24 h-16 rounded-md overflow-hidden shrink-0">
                      <SafeImage src={event.image} alt={event.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-foreground line-clamp-1">{event.title}</p>
                      <p className="text-xs text-muted-foreground">{event.date}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1">{event.location}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          <section className="mb-10">
            <h2 className="text-xl font-display font-bold mb-4">Gallery</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {profile.gallery.map((image, index) => (
                <div
                  key={`${image}-${index}`}
                  className="relative aspect-[4/3] rounded-lg overflow-hidden border border-border/60"
                >
                  <SafeImage src={image} alt={`${venue.name} gallery ${index + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-display font-bold mb-4">About</h2>
            <div className="space-y-3 text-sm md:text-base text-muted-foreground leading-relaxed">
              <p>{`${venue.name} is one of the most popular ${venue.type ?? "event"} venues in ${venue.location}, hosting concerts, family shows, and seasonal experiences.`}</p>
              <p>{`Browse upcoming schedules, compare events nearby, and book your preferred experience quickly on BookingQube.`}</p>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-display font-bold mb-4">Location</h2>
            <div className="rounded-xl border border-border/60 bg-card p-4 mb-3">
              <div className="flex items-start gap-2 text-sm">
                <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-foreground">{venue.name}</p>
                  <p className="text-muted-foreground">{profile.address}</p>
                </div>
              </div>
            </div>
            <MapEmbed
              lat={venue.lat ?? 25.2048}
              lng={venue.lng ?? 55.2708}
              title=""
              className="rounded-xl overflow-hidden"
            />
          </section>

          {nearbyEvents.length > 0 && (
            <section className="mb-10">
              <h2 className="text-xl font-display font-bold mb-4">Events in the venues nearby</h2>
              <div className="space-y-3">
                {nearbyEvents.map((event) => (
                  <Link
                    key={event.id}
                    href={`${base}/events/${event.slug ?? ""}`}
                    className="flex gap-3 rounded-xl border border-border/60 bg-card p-3 hover:border-primary/50 transition-colors"
                  >
                    <div className="relative w-24 h-16 rounded-md overflow-hidden shrink-0">
                      <SafeImage src={event.image} alt={event.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-foreground line-clamp-1">{event.title}</p>
                      <p className="text-xs text-muted-foreground">{event.date}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1">{event.location}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          <section className="mb-10">
            <h2 className="text-xl font-display font-bold mb-4">Past events</h2>
            <div className="space-y-0 border-y border-border/60">
              {profile.pastEvents.map((entry) => (
                <div key={entry} className="px-2 py-3 text-sm border-b border-border/60 last:border-b-0">
                  {entry}
                </div>
              ))}
            </div>
            <button type="button" className="mt-3 text-sm font-medium text-primary hover:underline">
              Load more
            </button>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-display font-bold mb-4">Why buy with BookingQube?</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="rounded-lg border border-border/60 bg-card p-3 text-sm flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-primary" />
                Secure checkout
              </div>
              <div className="rounded-lg border border-border/60 bg-card p-3 text-sm flex items-center gap-2">
                <Ticket className="w-4 h-4 text-primary" />
                Verified tickets
              </div>
              <div className="rounded-lg border border-border/60 bg-card p-3 text-sm flex items-center gap-2">
                <WalletCards className="w-4 h-4 text-primary" />
                Flexible refunds
              </div>
              <div className="rounded-lg border border-border/60 bg-card p-3 text-sm flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-primary" />
                Multiple payments
              </div>
            </div>
          </section>

          <section className="mb-2">
            <h3 className="text-base font-semibold mb-2">You choose how to pay</h3>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span className="rounded-md border border-border px-2 py-1">VISA</span>
              <span className="rounded-md border border-border px-2 py-1">Mastercard</span>
              <span className="rounded-md border border-border px-2 py-1">Apple Pay</span>
            </div>
          </section>
        </div>
      </main>
      <MobileTabbar />
      <Footer />
    </div>
  );
}
