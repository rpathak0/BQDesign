"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ChevronLeft } from "lucide-react";
import { TwoMonthCalendar } from "./TwoMonthCalendar";
import { DateChipsRow, availabilityToChipItems } from "./DateChipsRow";
import { TimeSlotList } from "./TimeSlotList";
import { ApplyButton } from "./ApplyButton";
import { cn } from "@/lib/utils";
import type {
  DayAvailability,
  TimeSlotItem,
  TicketDateTimeApplyResult,
} from "./types";

export type TicketDateTimeModalView = "date-time" | "calendar";

export interface TicketDateTimeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  availability: DayAvailability[];
  onApply: (result: TicketDateTimeApplyResult) => void;
  /** Initial selected date (dateISO) when opening */
  initialSelectedDateISO?: string | null;
  /** Desktop: 2 months in calendar; mobile: 1 */
  numberOfMonths?: 1 | 2;
}

export function TicketDateTimeModal({
  open,
  onOpenChange,
  availability,
  onApply,
  initialSelectedDateISO = null,
  numberOfMonths = 2,
}: TicketDateTimeModalProps) {
  const [view, setView] = React.useState<TicketDateTimeModalView>("date-time");
  const [selectedDateISO, setSelectedDateISO] = React.useState<string | null>(
    initialSelectedDateISO
  );
  const [selectedSlot, setSelectedSlot] = React.useState<TimeSlotItem | null>(
    null
  );

  const selectedDate = selectedDateISO
    ? new Date(selectedDateISO + "T12:00:00")
    : undefined;
  const selectedDay = availability.find((d) => d.dateISO === selectedDateISO);
  const slots = selectedDay?.slots ?? [];

  const chipItems = React.useMemo(
    () => availabilityToChipItems(availability),
    [availability]
  );

  React.useEffect(() => {
    if (open) {
      setView("date-time");
      setSelectedDateISO(initialSelectedDateISO ?? null);
      setSelectedSlot(null);
    }
  }, [open, initialSelectedDateISO]);

  const handleSelectDateFromCalendar = React.useCallback((date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    setSelectedDateISO(`${y}-${m}-${d}`);
    setSelectedSlot(null);
    setView("date-time");
  }, []);

  const handleApply = React.useCallback(() => {
    if (!selectedDateISO || !selectedSlot) return;
    onApply({
      selectedDate: selectedDateISO,
      selectedSlot,
      price: selectedSlot.price,
    });
    onOpenChange(false);
  }, [selectedDateISO, selectedSlot, onApply, onOpenChange]);

  const handleBack = React.useCallback(() => {
    if (view === "calendar") {
      setView("date-time");
    } else {
      onOpenChange(false);
    }
  }, [view, onOpenChange]);

  const canApply = Boolean(selectedDateISO && selectedSlot);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "max-w-[min(90vw,42rem)] max-h-[90vh] overflow-y-auto p-0 gap-0 rounded-2xl border border-border bg-white dark:bg-card shadow-xl",
          "[&>button]:hidden"
        )}
      >
        <DialogTitle className="sr-only">
          {view === "calendar"
            ? "Calendar – Select a date"
            : "Choose date and time"}
        </DialogTitle>
        <DialogDescription className="sr-only">
          {view === "calendar"
            ? "Select a date. Price or Sold out is shown below each date."
            : "Select a date from the chips, then a time slot. Apply to confirm."}
        </DialogDescription>

        <div className="px-4 pt-4 pb-2 md:px-6 md:pt-5 md:pb-3">
          <button
            type="button"
            onClick={handleBack}
            className={cn(
              "inline-flex items-center gap-2 px-4 py-2.5 rounded-xl",
              "bg-neutral-200/80 dark:bg-neutral-700/60 border-0 text-foreground font-medium text-sm",
              "hover:bg-neutral-300/80 dark:hover:bg-neutral-600/60 transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            )}
            aria-label={view === "calendar" ? "Back to date and time" : "Close"}
          >
            <ChevronLeft className="w-4 h-4 shrink-0" />
            Back
          </button>
        </div>

        {view === "calendar" ? (
          <div className="rounded-b-2xl overflow-hidden border-t border-border/50">
            <TwoMonthCalendar
              availability={availability}
              selectedDate={selectedDate}
              onSelectDate={handleSelectDateFromCalendar}
              numberOfMonths={numberOfMonths}
            />
          </div>
        ) : (
          <div className="px-6 pb-6 md:px-8 md:pb-8 space-y-6">
            <h2 className="text-xl md:text-2xl font-display font-bold tracking-tight text-foreground">
              Choose date and time
            </h2>

            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">
                Date
              </p>
              <DateChipsRow
                items={chipItems}
                selectedDateISO={selectedDateISO}
                onSelectDate={(dateISO) => {
                  setSelectedDateISO(dateISO);
                  setSelectedSlot(null);
                }}
                onOpenCalendar={() => setView("calendar")}
              />
            </div>

            {selectedDateISO && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  Time
                </p>
                <TimeSlotList
                  slots={slots}
                  selectedSlot={selectedSlot}
                  onSelectSlot={setSelectedSlot}
                  currency={selectedDay?.currency ?? "QAR"}
                />
              </div>
            )}

            <ApplyButton
              disabled={!canApply}
              onClick={handleApply}
              aria-label="Apply selected date and time"
            >
              Apply
            </ApplyButton>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
