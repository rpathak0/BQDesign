"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { MobileTabbar } from "@/components/layout/mobile-tabbar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { Calendar } from "@/components/ui/calendar";
import { ChevronLeft, Calendar as CalendarIcon, Check } from "lucide-react";
import type { EventDetail, DateOption, TimeSlot } from "@/data/events";
import { cn } from "@/lib/utils";

const DATE_TIME_KEY = "selectedDateTime";

function toDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

const currencyFallback = (event: EventDetail) =>
  event.seatingLayout?.tiers?.[0]?.currency ??
  event.ticketCategories?.[0]?.currency ??
  "AED";

interface DateTimeSelectionClientProps {
  event: EventDetail;
}

export function DateTimeSelectionClient({ event }: DateTimeSelectionClientProps) {
  const params = useParams();
  const router = useRouter();
  const locale = (params?.locale as string) ?? "en";
  const slug = (params?.slug as string) ?? event.slug;
  const options = event.dateTimeOptions ?? [];

  const firstDate = options[0];
  const firstAvailableSlot = firstDate?.timeSlots.find((t) => !t.soldOut);
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(
    firstDate?.dateKey ?? null
  );
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(
    firstAvailableSlot?.id ?? null
  );
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [numberOfMonths, setNumberOfMonths] = useState(2);

  useEffect(() => {
    const m = window.matchMedia("(min-width: 640px)");
    setNumberOfMonths(m.matches ? 2 : 1);
    const handler = () => setNumberOfMonths(m.matches ? 2 : 1);
    m.addEventListener("change", handler);
    return () => m.removeEventListener("change", handler);
  }, []);

  const selectedDateOption = options.find((d) => d.dateKey === selectedDateKey);
  const timeSlots = selectedDateOption?.timeSlots ?? [];
  const selectedSlot = timeSlots.find((t) => t.id === selectedSlotId);

  const dateInfoMap = useMemo(() => {
    const map = new Map<
      string,
      { fromPrice?: number; currency: string; allSoldOut: boolean }
    >();
    for (const o of options) {
      map.set(o.dateKey, {
        fromPrice: o.fromPrice,
        currency: currencyFallback(event),
        allSoldOut: o.timeSlots.length > 0 && o.timeSlots.every((t) => t.soldOut),
      });
    }
    return map;
  }, [options, event]);

  const calendarDate = useMemo(() => {
    if (!selectedDateKey) return undefined;
    const [y, m, d] = selectedDateKey.split("-").map(Number);
    return new Date(y, m - 1, d);
  }, [selectedDateKey]);

  const DateTimeDayButton = useCallback(
    function DateTimeDayButton({
      day,
      modifiers,
      ...props
    }: {
      day: { date: Date };
      modifiers: { selected?: boolean; disabled?: boolean; range_start?: boolean; range_end?: boolean; range_middle?: boolean };
      [key: string]: unknown;
    }) {
      const key = toDateKey(day.date);
      const info = dateInfoMap.get(key);
      const sub =
        info &&
        (info.allSoldOut
          ? "Sold out"
          : info.fromPrice != null
            ? `${info.fromPrice} ${info.currency}`
            : null);
      const selected =
        Boolean(
          modifiers.selected &&
            !modifiers.range_start &&
            !modifiers.range_end &&
            !modifiers.range_middle
        );
      const soldOut = info?.allSoldOut ?? false;
      return (
        <button
          type="button"
          data-day={day.date.toLocaleDateString()}
          data-selected-single={selected}
          data-sold-out={soldOut}
          className={cn(
            "flex flex-col items-center justify-center gap-1 w-full min-w-[var(--cell-size)] min-h-[var(--cell-size)] font-normal rounded-lg cursor-pointer",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            soldOut && "border-2 border-orange-500 bg-orange-50 dark:bg-orange-950/40 cursor-not-allowed",
            selected && !soldOut && "bg-white dark:bg-card text-primary border-2 border-primary",
            !selected && !modifiers.disabled && !soldOut && "border-0 hover:bg-accent hover:text-accent-foreground",
            modifiers.disabled && !soldOut && "opacity-50 cursor-not-allowed text-muted-foreground border-0",
            !modifiers.disabled && !selected && !soldOut && "text-foreground"
          )}
          disabled={modifiers.disabled}
          {...props}
        >
          {/* Bigger date number - large, bold */}
          <span className={cn(
            "text-lg sm:text-xl font-bold leading-none shrink-0",
            soldOut && "text-orange-700 dark:text-orange-400"
          )}>
            {day.date.getDate()}
          </span>
          {/* Amount / Sold out clearly under the date */}
          {sub && (
            <span
              className={cn(
                "text-[10px] sm:text-xs leading-tight font-normal truncate max-w-full text-center px-0.5 mt-0.5",
                soldOut && "text-orange-600 dark:text-orange-400",
                selected && !soldOut && "text-primary/90",
                !selected && !soldOut && "text-muted-foreground"
              )}
            >
              {sub}
            </span>
          )}
        </button>
      );
    },
    [dateInfoMap]
  );

  const handleCalendarSelect = (date: Date | undefined) => {
    if (!date) return;
    const key = toDateKey(date);
    const option = options.find((o) => o.dateKey === key);
    const info = dateInfoMap.get(key);
    if (option && info && !info.allSoldOut) {
      setSelectedDateKey(key);
      const first = option.timeSlots.find((t) => !t.soldOut);
      setSelectedSlotId(first?.id ?? null);
      setCalendarOpen(false);
    }
  };

  const isDateDisabled = useCallback(
    (date: Date) => {
      const key = toDateKey(date);
      const info = dateInfoMap.get(key);
      if (!info) return true;
      return info.allSoldOut;
    },
    [dateInfoMap]
  );

  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push(`/${locale}/events/${slug}`);
    }
  };

  const handleApply = () => {
    if (!selectedDateKey || !selectedSlot) return;
    if (typeof window !== "undefined") {
      sessionStorage.setItem(
        DATE_TIME_KEY,
        JSON.stringify({
          dateKey: selectedDateKey,
          dateLabel: selectedDateOption?.date,
          slotId: selectedSlot.id,
          start: selectedSlot.start,
          end: selectedSlot.end,
          label: selectedSlot.label,
          price: selectedSlot.price,
          currency: selectedSlot.currency,
        })
      );
      sessionStorage.setItem(`${DATE_TIME_KEY}_event`, event.slug);
    }
    router.push(`/${locale}/checkout?event=${event.slug}`);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto py-6 md:py-8 max-w-2xl px-4">
        <Link
          href={`/${locale}/events/${slug}`}
          onClick={handleBack}
          className="text-sm text-foreground hover:bg-muted/80 mb-6 inline-flex items-center gap-1.5 w-fit px-4 py-2.5 rounded-xl bg-muted/50 border border-border transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </Link>

        <div className="rounded-2xl border border-border/50 bg-card shadow-lg p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-display font-bold tracking-tight mb-6">
            Choose date and time
          </h2>

          {/* Date row – selected: solid purple + checkmark; unselected: white + grey border */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 mb-6">
            {options.map((d: DateOption) => {
              const isSelected = selectedDateKey === d.dateKey;
              return (
                <button
                  key={d.dateKey}
                  type="button"
                  onClick={() => {
                    setSelectedDateKey(d.dateKey);
                    const first = d.timeSlots.find((t) => !t.soldOut);
                    setSelectedSlotId(first?.id ?? null);
                  }}
                  className={cn(
                    "shrink-0 rounded-xl border-2 px-4 py-3 text-left transition-colors flex items-start gap-2 min-w-[7rem]",
                    isSelected
                      ? "border-2 border-primary bg-white dark:bg-card text-primary"
                      : "border-2 border-border bg-card hover:border-primary/40 text-foreground"
                  )}
                >
                  {isSelected && <Check className="w-5 h-5 shrink-0 mt-0.5 text-primary-foreground" />}
                  <span className="flex-1 min-w-0">
                    <span className="block font-medium text-sm">{d.date}</span>
                    {d.fromPrice != null && (
                      <span className={cn(
                        "block text-xs mt-0.5",
                        isSelected ? "text-primary/80" : "text-muted-foreground"
                      )}>
                        From: {d.fromPrice} {event.seatingLayout?.tiers?.[0]?.currency ?? event.ticketCategories?.[0]?.currency ?? "AED"}
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
            <Dialog open={calendarOpen} onOpenChange={setCalendarOpen}>
              <button
                type="button"
                onClick={() => setCalendarOpen(true)}
                className="shrink-0 w-12 h-14 rounded-xl border border-border bg-card flex items-center justify-center hover:bg-muted/50 transition-colors"
                aria-label="Open calendar to pick a date"
              >
                <CalendarIcon className="w-5 h-5 text-muted-foreground" />
              </button>
              <DialogContent
                className="max-w-[min(90vw,42rem)] p-0 gap-0 rounded-2xl border border-border bg-card shadow-xl overflow-hidden [&>button]:hidden"
                aria-describedby="calendar-desc"
              >
                <DialogTitle>
                  <VisuallyHidden.Root>Choose date</VisuallyHidden.Root>
                </DialogTitle>
                <DialogDescription id="calendar-desc">
                  <VisuallyHidden.Root>
                    Select a date with available slots. Price or Sold out is shown below each date.
                  </VisuallyHidden.Root>
                </DialogDescription>
                {/* Back button on top - pill-shaped inside calendar modal */}
                <div className="px-4 pt-4 pb-2">
                  <button
                    type="button"
                    onClick={() => setCalendarOpen(false)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-card border border-border shadow-sm text-foreground font-medium text-sm hover:bg-muted transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Back
                  </button>
                </div>
                <div className="p-4 pt-0 [--cell-size:4.5rem]">
                  <Calendar
                    mode="single"
                    selected={calendarDate}
                    onSelect={handleCalendarSelect}
                    disabled={isDateDisabled}
                    weekStartsOn={1}
                    numberOfMonths={numberOfMonths}
                    defaultMonth={calendarDate ?? (options[0] ? (() => {
                      const [y, m] = options[0].dateKey.split("-").map(Number);
                      return new Date(y, m - 1, 1);
                    })() : undefined)}
                    formatters={{
                      formatCaption: (date) =>
                        date.toLocaleDateString("en-US", {
                          month: "long",
                          year: "numeric",
                        }),
                    }}
                    components={{ DayButton: DateTimeDayButton }}
                    className="[&_.rdp-months]:flex [&_.rdp-month]:min-w-[14rem] [&_td]:!aspect-auto [&_td]:min-h-[var(--cell-size)] [&_td]:align-top"
                  />
                </div>
                <div
                  className="px-4 py-3 flex items-center gap-2 border-t border-border rounded-b-xl bg-orange-50 dark:bg-orange-950/30 text-muted-foreground text-xs"
                  role="note"
                >
                  <span
                    className="size-5 rounded-full border border-current flex items-center justify-center text-[10px] font-bold shrink-0"
                    aria-hidden
                  >
                    i
                  </span>
                  <span>Prices mentioned on the page may differ.</span>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Time slots */}
          <div className="space-y-2 mb-8">
            {timeSlots.map((slot: TimeSlot) => (
              <button
                key={slot.id}
                type="button"
                disabled={slot.soldOut}
                onClick={() => !slot.soldOut && setSelectedSlotId(slot.id)}
                className={cn(
                  "w-full rounded-xl border-2 px-4 py-3 flex items-center justify-between text-left transition-colors",
                  slot.soldOut && "opacity-60 cursor-not-allowed",
                  selectedSlotId === slot.id
                    ? "border-primary bg-primary/10"
                    : !slot.soldOut && "border-border hover:border-primary/50"
                )}
              >
                <span className="flex items-center gap-2">
                  {selectedSlotId === slot.id && (
                    <Check className="w-5 h-5 text-primary shrink-0" />
                  )}
                  <span>
                    {slot.start}-{slot.end}
                    {slot.soldOut && (
                      <span className="ml-2 text-orange-600 dark:text-orange-400 text-sm">
                        Sold out
                      </span>
                    )}
                    {!slot.soldOut && slot.label && (
                      <span className="ml-2 text-muted-foreground text-sm">{slot.label}</span>
                    )}
                  </span>
                </span>
                {!slot.soldOut && (
                  <span className="font-semibold text-primary">
                    {slot.price} {slot.currency}
                  </span>
                )}
              </button>
            ))}
          </div>

          <Button
            type="button"
            className="w-full h-12 rounded-xl font-semibold"
            disabled={!selectedSlotId || !!selectedSlot?.soldOut}
            onClick={handleApply}
          >
            Apply
          </Button>
        </div>
      </main>
      <MobileTabbar />
      <Footer />
    </div>
  );
}
