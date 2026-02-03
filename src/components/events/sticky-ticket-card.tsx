"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Clock, CheckCircle, Shield, HeadphonesIcon, Ticket } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { scaleIn } from "@/lib/motion-variants";

interface StickyTicketCardProps {
  title?: string;
  price: string;
  priceFrom?: number;
  priceSuffix?: string;
  openingHours?: string;
  confirmationNote?: string;
  ctaLabel?: string;
  onCtaClick?: () => void;
  discountLabel?: string;
  discountSavings?: string;
  promocodeLabel?: string;
  durationLabel?: string;
  durationValue?: string;
  className?: string;
}

const WHY_BUY = [
  { icon: Shield, label: "Secure Checkout" },
  { icon: CheckCircle, label: "Instant Confirmation" },
  { icon: Ticket, label: "Show Ticket Seller" },
  { icon: HeadphonesIcon, label: "24/7 Customer Service" },
];

export function StickyTicketCard({
  title,
  price,
  priceFrom,
  priceSuffix = "Per Person",
  openingHours,
  confirmationNote = "Instant Confirmation",
  ctaLabel = "Select Tickets",
  onCtaClick,
  discountLabel,
  discountSavings,
  promocodeLabel,
  durationLabel = "Timing and schedule",
  durationValue,
  className,
}: StickyTicketCardProps) {
  const reduced = usePrefersReducedMotion();

  return (
    <motion.div
      variants={reduced ? undefined : scaleIn}
      initial="hidden"
      animate="visible"
      className={cn("sticky top-24", className)}
    >
      <Card className="border-border/50 shadow-lg overflow-hidden rounded-2xl">
        <CardHeader className="pb-4">
          {title && (
            <h3 className="font-display font-bold text-base text-muted-foreground line-clamp-1 mb-2">
              {title}
            </h3>
          )}
          {/* Top row: Price (left) + Select tickets button (right) */}
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-sm text-muted-foreground">
                {priceFrom != null ? "Price from:" : "Price:"}
              </p>
              <p className="text-3xl font-display font-bold text-foreground tracking-tight mt-0.5">
                {price}
              </p>
              {priceSuffix && (
                <p className="text-xs text-muted-foreground mt-1">{priceSuffix}</p>
              )}
            </div>
            <Button
              className="shrink-0 rounded-xl font-semibold h-12 px-6 bg-foreground dark:bg-foreground text-background dark:text-background hover:bg-foreground/90 dark:hover:bg-foreground/90 border-0"
              size="lg"
              onClick={onCtaClick}
            >
              {ctaLabel}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Instant confirmation – purple accent icon + text */}
          <div className="flex items-center gap-2.5 rounded-lg bg-violet-50 dark:bg-violet-950/30 border border-violet-200/60 dark:border-violet-800/40 px-3 py-2.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-500 text-white">
              <CheckCircle className="w-4 h-4" />
            </span>
            <span className="text-sm font-medium text-foreground">{confirmationNote}</span>
          </div>

          {promocodeLabel && (
            <p className="text-sm text-muted-foreground">{promocodeLabel}</p>
          )}

          {(durationValue || openingHours) && (
            <div className="pt-3 border-t border-border/50">
              <h4 className="text-sm font-display font-semibold mb-1">{durationLabel}</h4>
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4 shrink-0 mt-0.5 text-primary" />
                <span>{durationValue ?? openingHours}</span>
              </div>
            </div>
          )}

          <div className="pt-3 border-t border-border/50">
            <h4 className="text-sm font-display font-semibold mb-2">Why buy with us?</h4>
            <ul className="space-y-2">
              {WHY_BUY.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Icon className="w-4 h-4 shrink-0 text-primary" />
                  {label}
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-3 border-t border-border/50">
            <h4 className="text-sm font-display font-semibold mb-2">Flexible Payment Options</h4>
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-xs font-semibold text-muted-foreground border border-border rounded px-2 py-1">VISA</span>
              <span className="text-xs font-semibold text-muted-foreground border border-border rounded px-2 py-1">Mastercard</span>
              <span className="text-xs font-semibold text-muted-foreground border border-border rounded px-2 py-1">Apple Pay</span>
              <span className="text-xs font-semibold text-muted-foreground border border-border rounded px-2 py-1">Google Pay</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
