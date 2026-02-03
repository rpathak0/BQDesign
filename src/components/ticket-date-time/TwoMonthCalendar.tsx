"use client";

import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import type { DayAvailability } from "./types";

function toDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export interface TwoMonthCalendarProps {
  /** Available days with price/soldOut; dates not in this list are disabled */
  availability: DayAvailability[];
  selectedDate: Date | undefined;
  onSelectDate: (date: Date) => void;
  /** Default month when no selection (e.g. first available) */
  defaultMonth?: Date;
  /** Desktop: 2 months; mobile: 1. Set via useEffect in parent or pass 1/2 */
  numberOfMonths?: 1 | 2;
  className?: string;
}

export function TwoMonthCalendar({
  availability,
  selectedDate,
  onSelectDate,
  defaultMonth,
  numberOfMonths = 2,
  className,
}: TwoMonthCalendarProps) {
  const dateInfoMap = React.useMemo(() => {
    const map = new Map<
      string,
      { price: number; currency: string; soldOut: boolean }
    >();
    for (const d of availability) {
      map.set(d.dateISO, {
        price: d.price,
        currency: d.currency,
        soldOut: d.soldOut,
      });
    }
    return map;
  }, [availability]);

  const isDateDisabled = React.useCallback(
    (date: Date) => {
      const key = toDateKey(date);
      return !dateInfoMap.has(key);
    },
    [dateInfoMap]
  );

  const handleSelect = React.useCallback(
    (date: Date | undefined) => {
      if (!date) return;
      const key = toDateKey(date);
      const info = dateInfoMap.get(key);
      if (info && !info.soldOut) onSelectDate(date);
    },
    [dateInfoMap, onSelectDate]
  );

  const firstAvailable = availability[0];
  const defaultMonthResolved =
    defaultMonth ??
    (firstAvailable
      ? (() => {
          const [y, m] = firstAvailable.dateISO.split("-").map(Number);
          return new Date(y, m - 1, 1);
        })()
      : undefined);

  const DayButton = React.useCallback(
    function CustomDayButton({
      day,
      modifiers,
      ...props
    }: {
      day: { date: Date };
      modifiers: {
        selected?: boolean;
        disabled?: boolean;
        outside?: boolean;
        range_start?: boolean;
        range_end?: boolean;
        range_middle?: boolean;
      };
      [key: string]: unknown;
    }) {
      const key = toDateKey(day.date);
      const info = dateInfoMap.get(key);
      const sub =
        info &&
        (info.soldOut
          ? "Sold out"
          : `${info.price} ${info.currency}`);
      const selected = Boolean(
        modifiers.selected &&
          !modifiers.range_start &&
          !modifiers.range_end &&
          !modifiers.range_middle
      );
      const soldOut = info?.soldOut ?? false;
      const outside = Boolean(modifiers.outside);
      const unavailable = modifiers.disabled || outside;

      return (
        <button
          type="button"
          data-day={day.date.toLocaleDateString()}
          data-selected-single={selected}
          data-sold-out={soldOut}
          className={cn(
            "flex flex-col items-center justify-center gap-0.5 w-full min-w-[var(--cell-size)] h-[var(--cell-size)] font-normal rounded-md cursor-pointer transition-colors py-1.5 px-0",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            soldOut && "cursor-not-allowed",
            selected &&
              !soldOut &&
              "rounded-md border border-foreground bg-transparent hover:bg-transparent shadow-none ring-0",
            !selected &&
              !unavailable &&
              !soldOut &&
              "hover:bg-neutral-100 dark:hover:bg-muted/50 border border-transparent",
            outside &&
              "opacity-60 cursor-not-allowed text-muted-foreground border-0 hover:bg-transparent",
            soldOut && "text-orange-500 dark:text-orange-400",
            !outside && !selected && !soldOut && "text-foreground"
          )}
          disabled={modifiers.disabled || soldOut}
          {...props}
        >
          <span
            className={cn(
              "block text-[15px] font-normal leading-tight shrink-0",
              outside && "text-muted-foreground font-normal",
              soldOut && "text-orange-500 dark:text-orange-400",
              selected && !soldOut && "text-foreground font-normal"
            )}
          >
            {day.date.getDate()}
          </span>
          {sub ? (
            <span
              className={cn(
                "block text-[11px] leading-tight font-normal text-center whitespace-nowrap overflow-hidden max-w-full",
                soldOut && "text-orange-500 dark:text-orange-400",
                !soldOut && !outside && "text-foreground",
                outside && "text-muted-foreground"
              )}
            >
              {sub}
            </span>
          ) : outside ? (
            <span className="block text-[11px] leading-tight h-4" />
          ) : null}
        </button>
      );
    },
    [dateInfoMap]
  );

  return (
    <div className={cn("flex flex-col bg-white dark:bg-card overflow-hidden", className)}>
      <div className="px-4 pt-2 pb-1 md:px-6 [--cell-size:4rem]">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleSelect}
          disabled={isDateDisabled}
          weekStartsOn={1}
          numberOfMonths={numberOfMonths}
          defaultMonth={defaultMonthResolved}
          formatters={{
            formatCaption: (date) =>
              date.toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              }),
            formatWeekdayName: (date) =>
              date.toLocaleDateString("en-US", { weekday: "short" }),
          }}
          components={{ DayButton }}
          classNames={{
            caption_label: "text-[15px] font-bold text-foreground",
            month_caption: "flex h-9 w-full items-center justify-center",
            weekday:
              "text-foreground text-[12px] font-normal min-w-[var(--cell-size)] w-[var(--cell-size)] text-center py-2",
            button_previous:
              "text-foreground hover:bg-neutral-100 dark:hover:bg-muted hover:text-foreground size-9 rounded-md",
            button_next:
              "text-foreground hover:bg-neutral-100 dark:hover:bg-muted hover:text-foreground size-9 rounded-md",
          }}
          className="[&_.rdp-months]:flex [&_.rdp-months]:gap-8 [&_.rdp-month]:min-w-[13rem] [&_td]:!aspect-auto [&_td]:h-[var(--cell-size)] [&_td]:align-top [&_td]:p-0 [&_.rdp-weekday]:py-2 [&_.rdp-weekday]:text-center"
        />
      </div>
      <div
        className="w-full px-4 py-3 flex items-center gap-2.5 bg-[#fff4e6] dark:bg-amber-950/40 rounded-b-2xl border-t border-amber-200/70 dark:border-amber-800/50"
        role="note"
      >
        <span
          className="size-5 rounded-full bg-amber-300/80 dark:bg-amber-700/60 flex items-center justify-center text-[10px] font-bold shrink-0 text-foreground"
          aria-hidden
        >
          i
        </span>
        <span className="text-[13px] font-normal text-foreground">
          Prices mentioned on the page may differ.
        </span>
      </div>
    </div>
  );
}
