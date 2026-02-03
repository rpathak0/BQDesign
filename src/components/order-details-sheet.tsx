"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2, MapPin, Calendar, Clock } from "lucide-react";

export type OrderDetailsSheetItem = {
  id: string;
  name: string;
  originalPrice?: number;
  price: number;
  currency: string;
  qty: number;
  discountPercent?: number;
};

export type OrderDetailsSheetEventInfo = {
  title: string;
  location: string;
  date?: string;
  time?: string;
};

export interface OrderDetailsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: OrderDetailsSheetItem[];
  total: number;
  currency: string;
  onRemove?: (id: string) => void;
  onClearAll?: () => void;
  eventInfo?: OrderDetailsSheetEventInfo | null;
}

/**
 * Order details popup: small card that slides up from the bottom (not full-width).
 * Matches design: header (Order details + X), ticket rows (name, strikethrough/discount, trash), Clear all, total.
 * Used on both ticket and checkout pages.
 */
export function OrderDetailsSheet({
  open,
  onOpenChange,
  items,
  total,
  currency,
  onRemove,
  onClearAll,
  eventInfo,
}: OrderDetailsSheetProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="!fixed left-4 bottom-24 top-auto w-full max-w-[22rem] max-h-[70vh] flex flex-col p-0 gap-0 overflow-hidden rounded-2xl border border-border bg-card shadow-xl translate-x-0 translate-y-0 grid-rows-[auto_1fr_auto] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom duration-200 [&>button]:absolute [&>button]:right-4 [&>button]:top-4"
      >
        <DialogHeader className="p-4 pb-3 border-b border-border shrink-0 flex flex-row items-center justify-between space-y-0 pr-12">
          <DialogTitle className="text-left text-lg font-display font-bold">
            Order details
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
          {eventInfo && (
            <div className="space-y-1.5 text-sm">
              <p className="font-display font-bold text-foreground">{eventInfo.title}</p>
              <p className="text-muted-foreground flex items-center gap-1.5">
                <MapPin className="w-4 h-4 shrink-0" />
                {eventInfo.location}
              </p>
              {(eventInfo.date || eventInfo.time) && (
                <div className="flex flex-wrap items-center gap-3 text-muted-foreground">
                  {eventInfo.date && (
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 shrink-0" />
                      {eventInfo.date}
                    </span>
                  )}
                  {eventInfo.time && (
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 shrink-0" />
                      {eventInfo.time}
                    </span>
                  )}
                </div>
              )}
            </div>
          )}

          {items.length === 0 ? (
            <p className="text-sm text-muted-foreground py-2">
              No tickets selected.
            </p>
          ) : (
            <ul className="space-y-3">
              {items.map((item) => {
                const lineTotal = item.qty * item.price;
                const hasDiscount = item.discountPercent != null && item.discountPercent > 0;
                const originalTotal = item.originalPrice != null
                  ? item.qty * item.originalPrice
                  : lineTotal;
                return (
                  <li
                    key={item.id}
                    className="flex items-start justify-between gap-3 py-3 border-b border-border last:border-0"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-foreground text-sm">
                        {item.name}, General admission
                      </p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        {hasDiscount && item.originalPrice != null && (
                          <span className="text-sm text-muted-foreground line-through tabular-nums">
                            {originalTotal.toFixed(2)}
                          </span>
                        )}
                        <span className="text-sm font-semibold text-foreground tabular-nums">
                          {item.price.toFixed(2)} {item.currency}
                        </span>
                        {hasDiscount && item.discountPercent != null && (
                          <span className="inline-flex items-center rounded bg-green-500/15 px-1.5 py-0.5 text-xs font-medium text-green-700 dark:text-green-400">
                            -{item.discountPercent}%
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-semibold text-foreground tabular-nums text-sm">
                        {(lineTotal).toFixed(2)} {item.currency}
                      </span>
                      {onRemove && (
                        <button
                          type="button"
                          onClick={() => onRemove(item.id)}
                          className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-muted transition-colors"
                          aria-label={`Remove ${item.name}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          {items.length > 0 && onClearAll && (
            <Button
              type="button"
              variant="outline"
              className="w-full rounded-xl border-2 border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 bg-white dark:bg-card"
              onClick={() => {
                onClearAll();
                onOpenChange(false);
              }}
            >
              Clear all
            </Button>
          )}
        </div>

        <div className="border-t border-border p-4 shrink-0">
          <div className="flex items-center justify-between text-base font-display font-bold">
            <span className="text-foreground">Total</span>
            <span className="text-foreground tabular-nums">
              {total.toFixed(2)} {currency}
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
