"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { MobileTabbar } from "@/components/layout/mobile-tabbar";
import { Button } from "@/components/ui/button";
import { Ticket, ChevronDown, ChevronUp, MapPin, Calendar } from "lucide-react";

type StoredTicket = {
  id: string;
  bookingRef: string;
  eventSlug: string;
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  eventImage: string;
  items: { name: string; qty: number; price: number; currency: string }[];
  dateLabel: string | null;
  dateTime: { start?: string; end?: string; label?: string } | null;
  total: number;
  currency: string;
  purchasedAt: string;
};

export default function MyBookingsPage() {
  const params = useParams();
  const locale = (params?.locale as string) ?? "en";
  const [tickets, setTickets] = useState<StoredTicket[]>([]);
  const [showTickets, setShowTickets] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem("bq_my_tickets");
      const list = raw ? (JSON.parse(raw) as StoredTicket[]) : [];
      setTickets(Array.isArray(list) ? list : []);
    } catch {
      setTickets([]);
    }
  }, []);

  const hasTickets = tickets.length > 0;

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
          My tickets
        </h1>
        <p className="text-muted-foreground text-sm mb-8">
          View and manage your event tickets and bookings.
        </p>

        {hasTickets && (
          <div className="mb-8">
            <div className="rounded-xl border border-border bg-card p-4 flex items-center justify-between gap-4">
              <p className="font-medium text-foreground">
                You have {tickets.length} purchased ticket{tickets.length !== 1 ? "s" : ""}
              </p>
              <Button
                variant={showTickets ? "secondary" : "default"}
                size="sm"
                onClick={() => setShowTickets((v) => !v)}
                className="gap-2"
              >
                {showTickets ? (
                  <>
                    Hide tickets <ChevronUp className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    View my tickets <ChevronDown className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>

            {showTickets && (
              <div className="mt-4 space-y-4">
                {tickets.map((t) => (
                  <div
                    key={t.id}
                    className="rounded-xl border border-border bg-card overflow-hidden"
                  >
                    <div className="flex flex-col sm:flex-row">
                      <div className="relative aspect-video sm:aspect-square sm:w-40 shrink-0 bg-muted">
                        {t.eventImage ? (
                          <Image
                            src={t.eventImage}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 100vw, 10rem"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Ticket className="w-10 h-10 text-muted-foreground/50" />
                          </div>
                        )}
                      </div>
                      <div className="p-4 flex-1 min-w-0">
                        <h2 className="font-semibold text-foreground line-clamp-2">{t.eventTitle}</h2>
                        <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 shrink-0" />
                          {t.dateLabel ?? t.eventDate}
                          {t.dateTime?.start && t.dateTime?.end && (
                            <span> · {t.dateTime.start}–{t.dateTime.end}</span>
                          )}
                        </p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">{t.eventLocation}</span>
                        </p>
                        <p className="text-xs font-mono text-primary mt-2">Ref: {t.bookingRef}</p>
                        <p className="text-sm font-medium text-foreground mt-1">
                          {t.total.toFixed(2)} {t.currency} · {t.items.reduce((s, i) => s + i.qty, 0)} ticket{t.items.reduce((s, i) => s + i.qty, 0) !== 1 ? "s" : ""}
                        </p>
                        <Button variant="outline" size="sm" className="mt-3" asChild>
                          <Link href={`/${locale}/events/${t.eventSlug}`}>
                            View event
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {!hasTickets && (
          <div className="rounded-2xl border border-border bg-card p-8 md:p-12 text-center">
            <div className="mx-auto mb-6 flex h-32 w-40 items-center justify-center rounded-xl bg-muted/50">
              <Ticket className="h-16 w-16 text-muted-foreground/50" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">No tickets found</h2>
            <p className="text-muted-foreground text-sm mb-6 max-w-sm mx-auto">
              Looks like you have not purchased tickets yet. Once you do, your tickets will appear here.
            </p>
            <Button asChild>
              <Link href={`/${locale}/events`}>Browse events</Link>
            </Button>
          </div>
        )}

        {hasTickets && (
          <div className="mt-6">
            <Button variant="outline" asChild>
              <Link href={`/${locale}/events`}>Browse more events</Link>
            </Button>
          </div>
        )}
      </main>
      <MobileTabbar />
      <Footer />
    </div>
  );
}
