"use client";

import * as React from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DayAvailability } from "./types";

export interface DateChipItem {
  dateISO: string;
  weekday: string;   // "Thu"
  dateLabel: string; // "5 Feb"
  price: number;
  currency: string;
  soldOut?: boolean;
}

export interface DateChipsRowProps {
  items: DateChipItem[];
  selectedDateISO: string | null;
  onSelectDate: (dateISO: string) => void;
  onOpenCalendar: () => void;
  /** Optional: format weekday/date (e.g. locale) */
  className?: string;
}

export function DateChipsRow({
  items,
  selectedDateISO,
  onSelectDate,
  onOpenCalendar,
  className,
}: DateChipsRowProps) {
  return (
    <div
      className={cn(
        "flex gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-muted",
        className
      )}
      role="tablist"
      aria-label="Available dates"
    >
      {items.map((item) => {
        const selected = selectedDateISO === item.dateISO;
        const soldOut = item.soldOut;
        return (
          <button
            key={item.dateISO}
            type="button"
            role="tab"
            aria-selected={selected}
            aria-disabled={soldOut}
            onClick={() => !soldOut && onSelectDate(item.dateISO)}
            className={cn(
              "shrink-0 flex flex-col items-center text-left rounded-xl border-2 px-4 py-3 min-w-[7rem] transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              selected && !soldOut
                ? "border-primary bg-primary/10 text-foreground"
                : soldOut
                  ? "border-border bg-muted/30 opacity-70 cursor-not-allowed text-muted-foreground"
                  : "border-border bg-card hover:border-muted-foreground/40 text-foreground"
            )}
          >
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {item.weekday}
            </span>
            <span className="text-sm font-semibold mt-0.5">{item.dateLabel}</span>
            <span
              className={cn(
                "text-xs mt-1",
                soldOut
                  ? "text-orange-600 dark:text-orange-400 font-medium"
                  : "text-muted-foreground"
              )}
            >
              {soldOut ? "Sold out" : `From: ${item.price} ${item.currency}`}
            </span>
          </button>
        );
      })}
      <button
        type="button"
        onClick={onOpenCalendar}
        className={cn(
          "shrink-0 flex items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/30 hover:border-primary/50 hover:bg-muted/50 w-14 min-w-[3.5rem] transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        )}
        aria-label="Open calendar"
      >
        <CalendarIcon className="w-5 h-5 text-muted-foreground" />
      </button>
    </div>
  );
}

/** Build DateChipItem[] from DayAvailability[] (with weekday/dateLabel). */
export function availabilityToChipItems(
  availability: DayAvailability[]
): DateChipItem[] {
  return availability.map((d) => {
    const date = new Date(d.dateISO + "T12:00:00");
    const weekday = date.toLocaleDateString("en-US", { weekday: "short" });
    const dateLabel = date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
    });
    return {
      dateISO: d.dateISO,
      weekday,
      dateLabel,
      price: d.price,
      currency: d.currency,
      soldOut: d.soldOut,
    };
  });
}
