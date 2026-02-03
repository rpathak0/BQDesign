"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { MobileTabbar } from "@/components/layout/mobile-tabbar";
import { SeatingLayout } from "@/components/events/seating-layout";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Clock, MapPin, Plus, Minus, Search, Trash2, LayoutGrid, LayoutGridIcon } from "lucide-react";
import type { EventDetail } from "@/data/events";

const SEAT_KEY = "selectedSeats";

export type SelectedSeat = {
  sectionId: string;
  row: number;
  seat: number;
  tierId: string;
  tierLabel: string;
  sectionName: string;
  rowLabel: string;
  price: number;
  currency: string;
};

interface SeatingPageClientProps {
  event: EventDetail;
}

export function SeatingPageClient({ event }: SeatingPageClientProps) {
  const params = useParams();
  const router = useRouter();
  const locale = (params?.locale as string) ?? "en";
  const slug = (params?.slug as string) ?? event.slug;

  const layout = event.seatingLayout;
  const tierMap = layout ? Object.fromEntries(layout.tiers.map((t) => [t.id, t])) : {};
  const sectionMap = layout ? Object.fromEntries(layout.sections.map((s) => [s.id, s])) : {};

  const [selectedSeats, setSelectedSeats] = useState<SelectedSeat[]>([]);
  const [zoom, setZoom] = useState(1);
  const [orderDetailsOpen, setOrderDetailsOpen] = useState(true);

  const handleSelectSeat = useCallback(
    (sectionId: string, row: number, seat: number, tierId: string, price: number) => {
      if (price < 0) {
        setSelectedSeats((prev) =>
          prev.filter(
            (s) => !(s.sectionId === sectionId && s.row === row && s.seat === seat)
          )
        );
        return;
      }
      const section = sectionMap[sectionId];
      const tier = tierMap[tierId];
      if (!section || !tier) return;
      const rowLabel = section.startRowLabel
        ? String.fromCharCode(section.startRowLabel.charCodeAt(0) + row)
        : String(row + 1);
      setSelectedSeats((prev) => {
        const exists = prev.some(
          (s) => s.sectionId === sectionId && s.row === row && s.seat === seat
        );
        if (exists) {
          return prev.filter(
            (s) => !(s.sectionId === sectionId && s.row === row && s.seat === seat)
          );
        }
        return [
          ...prev,
          {
            sectionId,
            row,
            seat,
            tierId,
            tierLabel: tier.label,
            sectionName: section.name,
            rowLabel,
            price,
            currency: tier.currency,
          },
        ];
      });
    },
    [sectionMap, tierMap]
  );

  const handleRemoveSeat = useCallback(
    (sectionId: string, row: number, seat: number) => {
      setSelectedSeats((prev) =>
        prev.filter(
          (s) => !(s.sectionId === sectionId && s.row === row && s.seat === seat)
        )
      );
    },
    []
  );

  const handleClearAll = useCallback(() => setSelectedSeats([]), []);

  const total = selectedSeats.reduce((sum, s) => sum + s.price, 0);
  const currency = layout?.tiers?.[0]?.currency ?? "AED";

  const handleContinueToCheckout = () => {
    if (selectedSeats.length === 0) return;
    const payload = JSON.stringify(
      selectedSeats.map((s) => ({
        sectionId: s.sectionId,
        row: s.row,
        seat: s.seat,
        tierId: s.tierId,
        price: s.price,
      }))
    );
    if (typeof window !== "undefined") {
      sessionStorage.setItem(SEAT_KEY, payload);
      sessionStorage.setItem(`${SEAT_KEY}_event`, event.slug);
    }
    router.push(`/${locale}/checkout?event=${event.slug}`);
  };

  const base = `/${locale}`;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col">
        {/* Event header bar - white bar with back, title, date/time, venue */}
        <div className="bg-card border-b border-border/50 shadow-sm">
          <div className="container mx-auto py-4">
            <div className="flex flex-wrap items-start gap-4">
              <Link
                href={`${base}/events/${slug}`}
                onClick={(e) => {
                  e.preventDefault();
                  if (window.history.length > 1) router.back();
                  else router.push(`${base}/events/${slug}`);
                }}
                className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-border bg-card hover:bg-muted shrink-0"
                aria-label="Back"
              >
                <ChevronLeft className="w-5 h-5" />
              </Link>
              <div className="min-w-0 flex-1">
                <h1 className="text-xl md:text-2xl font-display font-bold tracking-tight text-foreground">
                  {event.title}
                </h1>
                <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="w-4 h-4 shrink-0" />
                    {event.date}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 shrink-0" />
                    {event.location}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main: Order details (left) | Stage + Map | Zoom (right) */}
        <div className="flex-1 flex flex-col lg:flex-row container mx-auto px-4 py-4 gap-4">
          {/* Order details - left sidebar */}
          <aside
            className={orderDetailsOpen ? "w-full lg:w-80 shrink-0" : "hidden lg:block lg:w-0"}
          >
            <div className="sticky top-24 rounded-xl border border-border bg-card shadow-lg overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
                <h2 className="text-sm font-semibold text-foreground">Order details</h2>
                <button
                  type="button"
                  onClick={() => setOrderDetailsOpen(false)}
                  className="lg:hidden p-2 rounded-lg hover:bg-muted"
                  aria-label="Close"
                >
                  <span className="text-lg leading-none">×</span>
                </button>
              </div>
              <div className="p-4 max-h-[60vh] overflow-y-auto">
                {selectedSeats.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4">
                    No seats selected. Select seats on the map.
                  </p>
                ) : (
                  <ul className="space-y-4">
                    {selectedSeats.map((s) => (
                      <li
                        key={`${s.sectionId}-${s.row}-${s.seat}`}
                        className="flex items-start justify-between gap-2 pb-4 border-b border-border last:border-0 last:pb-0"
                      >
                        <div>
                          <p className="text-sm font-medium text-foreground capitalize">
                            {s.sectionName} · {s.tierLabel}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Row: {s.rowLabel} Seat: {s.seat + 1}
                          </p>
                          <p className="text-sm font-semibold text-primary mt-1">
                            {s.price.toFixed(2)} {s.currency}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveSeat(s.sectionId, s.row, s.seat)}
                          className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                          aria-label="Remove seat"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              {selectedSeats.length > 0 && (
                <div className="p-4 border-t border-border bg-muted/20">
                  <button
                    type="button"
                    onClick={handleClearAll}
                    className="w-full py-2.5 rounded-lg text-sm font-medium bg-pink-100 dark:bg-pink-950/50 text-pink-700 dark:text-pink-300 hover:bg-pink-200 dark:hover:bg-pink-950/70 transition-colors"
                  >
                    Clear all
                  </button>
                </div>
              )}
            </div>
          </aside>

          {/* Center: Stage + Seating map */}
          <div className="flex-1 min-w-0 flex flex-col">
            {/* View toggles - optional grid icons */}
            <div className="flex items-center gap-2 mb-2">
              <button
                type="button"
                className="p-2 rounded-lg border border-border bg-card text-primary hover:bg-muted"
                aria-label="Section view"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                className="p-2 rounded-lg border border-border bg-card text-muted-foreground hover:bg-muted"
                aria-label="Seat view"
              >
                <LayoutGridIcon className="w-4 h-4" />
              </button>
              {!orderDetailsOpen && (
                <button
                  type="button"
                  onClick={() => setOrderDetailsOpen(true)}
                  className="ml-auto text-sm font-medium text-primary"
                >
                  Show order details
                </button>
              )}
            </div>

            {/* Mobile zoom controls */}
            <div className="flex lg:hidden items-center gap-2 mb-2">
              <button
                type="button"
                onClick={() => setZoom((z) => Math.min(2, z + 0.2))}
                className="w-9 h-9 rounded-lg border border-border bg-card flex items-center justify-center hover:bg-muted"
                aria-label="Zoom in"
              >
                <Plus className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setZoom((z) => Math.max(0.5, z - 0.2))}
                className="w-9 h-9 rounded-lg border border-border bg-card flex items-center justify-center hover:bg-muted"
                aria-label="Zoom out"
              >
                <Minus className="w-4 h-4" />
              </button>
            </div>

            <SeatingLayout
              event={event}
              selectedSeats={selectedSeats}
              onSelectSeat={handleSelectSeat}
              zoom={zoom}
            />
          </div>

          {/* Zoom controls - right side (desktop) */}
          <div className="hidden lg:flex flex-col items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setZoom((z) => Math.min(2, z + 0.2))}
              className="w-10 h-10 rounded-xl border border-border bg-card flex items-center justify-center hover:bg-muted"
              aria-label="Zoom in"
            >
              <Plus className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(0.5, z - 0.2))}
              className="w-10 h-10 rounded-xl border border-border bg-card flex items-center justify-center hover:bg-muted"
              aria-label="Zoom out"
            >
              <Minus className="w-5 h-5" />
            </button>
            <button
              type="button"
              className="w-10 h-10 rounded-xl border border-border bg-card flex items-center justify-center hover:bg-muted"
              aria-label="Search or pan"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Bottom bar: selected count + total + Continue */}
        <div className="sticky bottom-0 left-0 right-0 border-t border-border bg-card/95 backdrop-blur py-4">
          <div className="container mx-auto flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground">
              {selectedSeats.length > 0 ? (
                <span>
                  {selectedSeats.length} seat(s) selected · {currency} {total.toFixed(2)}
                </span>
              ) : (
                <span>Select seats on the map</span>
              )}
            </div>
            <Button
              type="button"
              onClick={handleContinueToCheckout}
              disabled={selectedSeats.length === 0}
              className="rounded-xl font-semibold"
            >
              Continue to checkout
            </Button>
          </div>
        </div>
      </main>
      <MobileTabbar />
    </div>
  );
}
