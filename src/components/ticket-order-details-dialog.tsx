"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export type OrderDetailsItem = {
  categoryId: string;
  name: string;
  originalPrice: number;
  discountedPrice: number;
  currency: string;
  qty: number;
  discountPercent?: number;
};

export interface OrderDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: OrderDetailsItem[];
  onRemove: (categoryId: string) => void;
  onClearAll: () => void;
}

export function OrderDetailsDialog({
  open,
  onOpenChange,
  items,
  onRemove,
  onClearAll,
}: OrderDetailsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-md w-[calc(100vw-2rem)] rounded-2xl border border-border bg-card shadow-xl p-0 gap-0 overflow-hidden [&>button]:absolute [&>button]:right-4 [&>button]:top-4"
      >
        <DialogTitle className="text-lg font-display font-bold px-5 pt-5 pb-3 border-b border-border">
          Order details
        </DialogTitle>
        <DialogDescription className="sr-only">
          List of selected tickets and prices. You can remove items or clear all.
        </DialogDescription>
        <div className="px-5 py-4 max-h-[60vh] overflow-y-auto">
          {items.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4">
              No tickets selected.
            </p>
          ) : (
            <ul className="space-y-3">
              {items.map((item) => (
                <li
                  key={item.categoryId}
                  className="flex gap-3 items-start rounded-xl border border-border bg-background p-4 shadow-sm"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground text-sm">
                      {item.name}, General admission
                    </p>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      {item.discountPercent != null && item.discountPercent > 0 ? (
                        <>
                          <span className="text-sm text-muted-foreground line-through">
                            {item.originalPrice.toFixed(2)}
                          </span>
                          <span className="text-sm font-semibold text-primary">
                            {item.discountedPrice.toFixed(2)} {item.currency}
                          </span>
                          <span className="rounded-full bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 text-xs font-medium px-2 py-0.5">
                            -{item.discountPercent}%
                          </span>
                        </>
                      ) : (
                        <span className="text-sm font-semibold text-primary">
                          {item.originalPrice.toFixed(2)} {item.currency}
                        </span>
                      )}
                      {item.qty > 1 && (
                        <span className="text-xs text-muted-foreground">
                          × {item.qty}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onRemove(item.categoryId)}
                    className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-muted transition-colors shrink-0"
                    aria-label={`Remove ${item.name}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        {items.length > 0 && (
          <div className="px-5 pb-5 pt-2 border-t border-border">
            <Button
              type="button"
              variant="outline"
              className="w-full rounded-xl border-2 border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50"
              onClick={() => {
                onClearAll();
                onOpenChange(false);
              }}
            >
              Clear all
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
