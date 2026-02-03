"use client";

import { useCallback } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { EventDetail, SeatingTier, SeatingSection } from "@/data/events";

interface SelectedSeatBase {
  sectionId: string;
  row: number;
  seat: number;
  tierId: string;
  price: number;
}

interface SeatingLayoutProps {
  event: EventDetail;
  selectedSeats: SelectedSeatBase[];
  onSelectSeat: (sectionId: string, row: number, seat: number, tierId: string, price: number) => void;
  zoom?: number;
  onZoomChange?: (zoom: number) => void;
  className?: string;
}

export function SeatingLayout({
  event,
  selectedSeats,
  onSelectSeat,
  zoom: controlledZoom,
  onZoomChange,
  className,
}: SeatingLayoutProps) {
  const layout = event.seatingLayout;
  const zoom = controlledZoom ?? 1;

  if (!layout) return null;

  const { tiers, sections } = layout;
  const tierMap = Object.fromEntries(tiers.map((t) => [t.id, t]));

  const isSelected = useCallback(
    (sectionId: string, row: number, seat: number) =>
      selectedSeats.some(
        (s) => s.sectionId === sectionId && s.row === row && s.seat === seat
      ),
    [selectedSeats]
  );

  return (
    <div className={cn("space-y-4", className)}>
      {/* Stage - large grey bar */}
      <div className="w-full py-4 px-6 rounded-lg bg-muted border border-border text-center">
        <span className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          Stage
        </span>
      </div>

      {/* Seating map - scrollable, scaled by zoom */}
      <div className="relative overflow-auto rounded-xl border border-border bg-card/30 p-4 min-h-[320px]">
        <div
          className="inline-block min-w-full origin-top"
          style={{ transform: `scale(${zoom})` }}
        >
          <div className="space-y-8">
            {sections.map((section: SeatingSection) => {
              const tier = tierMap[section.tierId];
              if (!tier) return null;
              return (
                <div key={section.id}>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    {section.name}
                  </p>
                  <div className="flex flex-col gap-1.5">
                    {Array.from({ length: section.rows }, (_, rowIndex) => (
                      <div key={rowIndex} className="flex items-center justify-center gap-1">
                        <span className="w-6 text-[10px] text-muted-foreground text-right shrink-0">
                          {section.startRowLabel
                            ? String.fromCharCode(
                                section.startRowLabel.charCodeAt(0) + rowIndex
                              )
                            : rowIndex + 1}
                        </span>
                        <div className="flex gap-0.5">
                          {Array.from(
                            { length: section.seatsPerRow },
                            (_, seatIndex) => {
                              const selected = isSelected(
                                section.id,
                                rowIndex,
                                seatIndex
                              );
                              return (
                                <button
                                  key={seatIndex}
                                  type="button"
                                  onClick={() => {
                                    if (
                                      isSelected(
                                        section.id,
                                        rowIndex,
                                        seatIndex
                                      )
                                    ) {
                                      onSelectSeat(
                                        section.id,
                                        rowIndex,
                                        seatIndex,
                                        tier.id,
                                        -tier.price
                                      );
                                    } else {
                                      onSelectSeat(
                                        section.id,
                                        rowIndex,
                                        seatIndex,
                                        tier.id,
                                        tier.price
                                      );
                                    }
                                  }}
                                  className={cn(
                                    "w-5 h-5 sm:w-6 sm:h-6 rounded-sm border transition-colors flex items-center justify-center shrink-0",
                                    selected
                                      ? "bg-white dark:bg-card border-2 border-primary text-primary"
                                      : `${tier.color} border-transparent hover:ring-2 hover:ring-primary/50 hover:ring-offset-1`
                                  )}
                                  aria-label={`Row ${section.startRowLabel ? String.fromCharCode(section.startRowLabel.charCodeAt(0) + rowIndex) : rowIndex + 1} Seat ${seatIndex + 1} ${tier.label}`}
                                >
                                  {selected ? (
                                    <Check className="w-3 h-3" />
                                  ) : null}
                                </button>
                              );
                            }
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Legend - price with colored circles */}
      <div className="flex flex-wrap items-center justify-center gap-6 py-4 px-4 rounded-xl bg-muted/30 border border-border">
        {tiers.map((tier: SeatingTier) => (
          <div key={tier.id} className="flex items-center gap-2">
            <div
              className={cn(
                "w-4 h-4 rounded-full border border-border/50 shrink-0",
                tier.color
              )}
              aria-hidden
            />
            <span className="text-sm font-medium text-foreground">
              {tier.price} {tier.currency}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
