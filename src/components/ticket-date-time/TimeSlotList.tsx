"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import type { TimeSlotItem } from "./types";

export interface TimeSlotListProps {
  slots: TimeSlotItem[];
  selectedSlot: TimeSlotItem | null;
  onSelectSlot: (slot: TimeSlotItem) => void;
  currency: string;
  className?: string;
}

export function TimeSlotList({
  slots,
  selectedSlot,
  onSelectSlot,
  currency,
  className,
}: TimeSlotListProps) {
  const isSelected = (slot: TimeSlotItem) =>
    selectedSlot === slot ||
    (selectedSlot &&
      slot.start === selectedSlot.start &&
      slot.end === selectedSlot.end);

  return (
    <ul
      className={cn(
        "border border-border rounded-xl overflow-hidden bg-card divide-y divide-border",
        className
      )}
      role="listbox"
      aria-label="Time slots"
    >
      {slots.map((slot, index) => {
        const available = slot.available;
        const selected = isSelected(slot);
        const slotId = slot.id ?? `slot-${index}`;
        return (
          <li key={slotId} role="option" aria-selected={selected}>
            <button
              type="button"
              disabled={!available}
              onClick={() => available && onSelectSlot(slot)}
              className={cn(
                "w-full flex items-center justify-between gap-2 px-4 py-3 text-left transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
                selected && "bg-primary/15 border-l-2 border-l-primary",
                !selected && available && "hover:bg-muted/50",
                !available && "opacity-60 cursor-not-allowed"
              )}
            >
              <span
                className={cn(
                  "font-medium tabular-nums shrink-0",
                  available ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {slot.start}–{slot.end}
              </span>
              <span className="flex items-center gap-2 min-w-0 justify-end">
                {available ? (
                  <>
                    {slot.fastSelling && (
                      <span className="shrink-0 text-xs font-semibold text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/40 px-2 py-0.5 rounded">
                        Fast selling
                      </span>
                    )}
                    <span className="text-sm font-semibold text-primary shrink-0">
                      {slot.price} {currency}
                    </span>
                  </>
                ) : (
                  <span className="text-sm font-semibold text-orange-600 dark:text-orange-400 shrink-0">
                    Sold out
                  </span>
                )}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
