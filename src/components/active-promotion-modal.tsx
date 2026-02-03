"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Percent } from "lucide-react";
import { cn } from "@/lib/utils";

export type PromotionItem = {
  id: string;
  title: string;
  subtitle: string;
  discountPercent: number;
};

const DEFAULT_PROMOTIONS: PromotionItem[] = [
  {
    id: "buy-with-discounts",
    title: "Buy with Discounts",
    subtitle: "Up to 10% Off",
    discountPercent: 10,
  },
];

export interface ActivePromotionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  promotions?: PromotionItem[];
  onSelectPromotion: (discountPercent: number) => void;
}

export function ActivePromotionModal({
  open,
  onOpenChange,
  promotions = DEFAULT_PROMOTIONS,
  onSelectPromotion,
}: ActivePromotionModalProps) {
  const handleSelect = (item: PromotionItem) => {
    onSelectPromotion(item.discountPercent);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-md w-[calc(100vw-2rem)] rounded-2xl border border-border bg-card shadow-xl p-6 md:p-8 gap-4"
      >
        <DialogTitle className="text-xl font-display font-bold text-foreground p-0">
          Active promotion
        </DialogTitle>
        <DialogDescription className="sr-only">
          Choose a promotion or discount to apply to your tickets.
        </DialogDescription>
        <p className="text-sm text-muted-foreground">
          Here you will find all the promotions and discounts along with their
          terms.
        </p>
        <div className="space-y-3">
          {promotions.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleSelect(item)}
              className={cn(
                "w-full flex items-center gap-4 rounded-xl border border-border bg-muted/30 hover:bg-muted/50 p-4 text-left transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              )}
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Percent className="w-6 h-6 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-primary">{item.title}</p>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {item.subtitle}
                </p>
              </div>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
