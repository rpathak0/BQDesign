"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { MobileTabbar } from "@/components/layout/mobile-tabbar";
import { Button } from "@/components/ui/button";
import {
  TicketDateTimeModal,
  dateTimeOptionsToAvailability,
} from "@/components/ticket-date-time";
import {
  ChevronLeft,
  ChevronDown,
  Minus,
  Plus,
  Info,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Percent,
  Ticket,
} from "lucide-react";
import { OrderDetailsSheet } from "@/components/order-details-sheet";
import type { OrderDetailsSheetItem } from "@/components/order-details-sheet";
import { TicketDetailsModal } from "@/components/ticket-details-modal";
import { ActivePromotionModal } from "@/components/active-promotion-modal";
import type { EventDetail, TicketCategory } from "@/data/events";
import type { TicketDateTimeApplyResult } from "@/components/ticket-date-time";
import { cn } from "@/lib/utils";

const TICKET_ORDER_KEY = "ticketOrder";
const RESERVE_MINUTES = 15;

export type TicketQuantity = {
  categoryId: string;
  name: string;
  price: number;
  currency: string;
  qty: number;
};

interface TicketSelectionClientProps {
  event: EventDetail;
}

export function TicketSelectionClient({ event }: TicketSelectionClientProps) {
  const params = useParams();
  const router = useRouter();
  const locale = (params?.locale as string) ?? "en";
  const slug = (params?.slug as string) ?? event.slug;
  const categories = event.ticketCategories ?? [];
  const options = event.dateTimeOptions ?? [];

  const hasDateOptions = options.length > 0;
  const firstDate = options[0];
  const [step, setStep] = useState<1 | 2>(hasDateOptions ? 1 : 2);
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(
    firstDate?.dateKey ?? null
  );
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [numberOfMonths, setNumberOfMonths] = useState(2);
  const [selectedSlotLabel, setSelectedSlotLabel] = useState<string | null>(null);

  const availability = useMemo(
    () => dateTimeOptionsToAvailability(options),
    [options]
  );

  const [quantities, setQuantities] = useState<Record<string, number>>(() =>
    Object.fromEntries(categories.map((c) => [c.id, 0]))
  );
  const [timeLeft, setTimeLeft] = useState(RESERVE_MINUTES * 60);
  const [orderDetailsOpen, setOrderDetailsOpen] = useState(false);
  const [discountModalOpen, setDiscountModalOpen] = useState(false);
  const [moreInfoModalOpen, setMoreInfoModalOpen] = useState(false);
  const [discountPercent, setDiscountPercent] = useState(0);
  const hasOpenedDateTimeModalRef = useRef(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setTimeLeft((prev) => Math.max(0, prev - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const m = window.matchMedia("(min-width: 640px)");
    setNumberOfMonths(m.matches ? 2 : 1);
    const handler = () => setNumberOfMonths(m.matches ? 2 : 1);
    m.addEventListener("change", handler);
    return () => m.removeEventListener("change", handler);
  }, []);

  // Show "Choose date and time" modal first on page load when event has date options; tickets show after Apply
  useEffect(() => {
    if (hasDateOptions && availability.length > 0 && step === 1 && !hasOpenedDateTimeModalRef.current) {
      hasOpenedDateTimeModalRef.current = true;
      setCalendarOpen(true);
    }
  }, [hasDateOptions, availability.length, step]);

  const currency = event.ticketCategories?.[0]?.currency ?? "AED";
  const selectedDateOption = options.find((d) => d.dateKey === selectedDateKey);
  const dateLabel = selectedDateOption?.date ?? event.date;

  const handleDateTimeApply = useCallback(
    (result: TicketDateTimeApplyResult) => {
      setSelectedDateKey(result.selectedDate);
      setSelectedSlotLabel(
        result.selectedSlot
          ? `${result.selectedSlot.start}–${result.selectedSlot.end}`
          : null
      );
      setCalendarOpen(false);
      if (typeof window !== "undefined") {
        const option = options.find((o) => o.dateKey === result.selectedDate);
        const dateLabelToSave = option?.date ?? event.date;
        sessionStorage.setItem("ticketSelectedDateKey", result.selectedDate);
        sessionStorage.setItem("ticketSelectedDateLabel", dateLabelToSave);
      }
      setStep(2);
    },
    [options, event.date]
  );

  const handleContinueFromDate = () => {
    if (hasDateOptions && !selectedDateKey) return;
    if (typeof window !== "undefined" && selectedDateKey) {
      sessionStorage.setItem("ticketSelectedDateKey", selectedDateKey);
      sessionStorage.setItem("ticketSelectedDateLabel", dateLabel);
    }
    setStep(2);
  };

  const totalQty = Object.values(quantities).reduce((a, b) => a + b, 0);
  const effectivePrice = (price: number) =>
    discountPercent > 0 ? price * (1 - discountPercent / 100) : price;
  const totalPrice = categories.reduce(
    (sum, c) => sum + (quantities[c.id] ?? 0) * effectivePrice(c.price),
    0
  );

  const orderDetailsSheetItems: OrderDetailsSheetItem[] = categories
    .filter((c) => (quantities[c.id] ?? 0) > 0)
    .map((c) => ({
      id: c.id,
      name: c.name,
      originalPrice: discountPercent > 0 ? c.price : undefined,
      price: effectivePrice(c.price),
      currency: c.currency,
      qty: quantities[c.id] ?? 0,
      discountPercent: discountPercent > 0 ? discountPercent : undefined,
    }));

  const handleRemoveFromOrder = useCallback((id: string) => {
    setQuantities((q) => ({ ...q, [id]: 0 }));
  }, []);

  const handleClearAllOrder = useCallback(() => {
    setQuantities((q) =>
      Object.fromEntries(Object.keys(q).map((id) => [id, 0]))
    );
  }, []);

  const handleIncrement = (cat: TicketCategory) => {
    const max = cat.maxQty ?? 10;
    setQuantities((q) => ({ ...q, [cat.id]: Math.min(max, (q[cat.id] ?? 0) + 1) }));
  };

  const handleDecrement = (cat: TicketCategory) => {
    setQuantities((q) => ({ ...q, [cat.id]: Math.max(0, (q[cat.id] ?? 0) - 1) }));
  };

  const handleCheckout = () => {
    const order: TicketQuantity[] = categories
      .filter((c) => (quantities[c.id] ?? 0) > 0)
      .map((c) => ({
        categoryId: c.id,
        name: c.name,
        price: effectivePrice(c.price),
        currency: c.currency,
        qty: quantities[c.id] ?? 0,
      }));
    if (order.length === 0) return;
    if (typeof window !== "undefined") {
      sessionStorage.setItem(TICKET_ORDER_KEY, JSON.stringify(order));
      sessionStorage.setItem(`${TICKET_ORDER_KEY}_event`, event.slug);
    }
    router.push(`/${locale}/checkout?event=${event.slug}`);
  };

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const timeStr = `${mins}:${secs.toString().padStart(2, "0")}`;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 w-full container mx-auto pt-20 md:pt-24 pb-28 md:pb-24 px-4">
        <button
          type="button"
          onClick={() => (step === 2 ? setStep(1) : router.back())}
          className="text-sm text-muted-foreground hover:text-foreground mb-4 inline-flex items-center gap-1"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>
        <div className="mb-6">
          <h1 className="text-xl md:text-2xl font-display font-bold tracking-tight">
            {event.title}
          </h1>
          {step === 2 && selectedDateKey ? (
            <>
              <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2 flex-wrap">
                <Clock className="w-4 h-4 shrink-0" />
                <span>
                  {dateLabel}
                  {selectedSlotLabel && (
                    <span className="text-foreground font-medium">
                      , {selectedSlotLabel}
                    </span>
                  )}
                </span>
              </p>
              <p className="text-sm text-muted-foreground mt-0.5 flex items-center gap-2">
                <MapPin className="w-4 h-4 shrink-0" />
                {event.location}
              </p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
              <span>{event.date}</span>
              <span>·</span>
              <span>{event.location}</span>
            </p>
          )}
        </div>

        {step === 1 ? (
          /* Step 1: Show only the date/time modal on first load; no "Select date" card until modal is closed */
          hasDateOptions && calendarOpen ? (
            <div className="min-h-[200px]" aria-hidden="true" />
          ) : (
            <div className="space-y-6">
              {hasDateOptions ? (
                <>
                  <div className="rounded-2xl border border-border/50 bg-card shadow-lg p-6 md:p-8">
                    <p className="text-sm font-medium text-muted-foreground mb-3">
                      Select date
                    </p>
                    <button
                      type="button"
                      onClick={() => setCalendarOpen(true)}
                      className="w-full flex items-center gap-3 rounded-xl border-2 border-border bg-card hover:border-primary/40 px-4 py-4 text-left transition-colors"
                    >
                      <div className="w-12 h-12 rounded-lg bg-muted/50 flex items-center justify-center shrink-0">
                        <CalendarIcon className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="block font-semibold text-foreground">
                          {dateLabel}
                        </span>
                        {selectedDateOption?.fromPrice != null && (
                          <span className="block text-xs text-muted-foreground mt-0.5">
                            From {selectedDateOption.fromPrice} {currency}
                          </span>
                        )}
                      </div>
                      <ChevronDown className="w-5 h-5 text-muted-foreground shrink-0" />
                    </button>
                    <p className="text-xs text-muted-foreground mt-4">
                      Tap to choose date and time. Pick a date from the chips or calendar, then select a time slot and Apply.
                    </p>
                  </div>
                  <Button
                    type="button"
                    onClick={handleContinueFromDate}
                    disabled={!selectedDateKey}
                    className="w-full rounded-xl font-semibold"
                  >
                    Continue
                  </Button>
                </>
              ) : (
                <Button
                  type="button"
                  onClick={handleContinueFromDate}
                  className="w-full rounded-xl font-semibold"
                >
                  Continue
                </Button>
              )}
            </div>
          )
        ) : (
          /* Step 2: Date/time selector, discounts, ticket categories (reference layout) */
          <div className="space-y-5">
            {/* Date & time selector pill - click opens calendar modal */}
            <button
              type="button"
              onClick={() => setCalendarOpen(true)}
              className="w-full flex items-center gap-3 rounded-xl border-2 border-border bg-card hover:border-primary/40 px-4 py-4 text-left transition-colors"
            >
              <div className="w-12 h-12 rounded-lg bg-muted/50 flex items-center justify-center shrink-0">
                <CalendarIcon className="w-6 h-6 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="block font-semibold text-foreground">
                  {dateLabel}
                  {selectedSlotLabel && `, ${selectedSlotLabel}`}
                </span>
                {selectedDateOption?.fromPrice != null && (
                  <span className="block text-xs text-muted-foreground mt-0.5">
                    From {selectedDateOption.fromPrice} {currency}
                  </span>
                )}
              </div>
              <ChevronDown className="w-5 h-5 text-muted-foreground shrink-0" />
            </button>

            {/* Choose your Discounts */}
            <button
              type="button"
              onClick={() => setDiscountModalOpen(true)}
              className="w-full flex items-center justify-center gap-3 rounded-2xl border border-primary/20 bg-primary/5 hover:bg-primary/10 py-4 px-5 transition-colors shadow-sm"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Percent className="w-5 h-5 text-primary" />
              </div>
              <span className="font-semibold text-foreground">
                Choose your Discounts
              </span>
            </button>

            {/* Ticket categories — with optional event title, cut price, discounted price, discount % and amount */}
            {categories.map((cat) => {
              const price = effectivePrice(cat.price);
              const hasDiscount = discountPercent > 0;
              const discountAmount = hasDiscount ? cat.price - price : 0;
              return (
                <div
                  key={cat.id}
                  className="rounded-2xl border border-border/50 bg-card p-4 md:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground font-medium">
                      {event.title}
                    </p>
                    <p className="font-display font-semibold text-foreground text-sm md:text-base mt-0.5">
                      {cat.name}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      {hasDiscount ? (
                        <>
                          <span className="text-sm text-muted-foreground line-through tabular-nums">
                            {cat.price.toFixed(2)}
                          </span>
                          <span className="text-foreground font-semibold tabular-nums">
                            {price.toFixed(2)} {cat.currency}
                          </span>
                          <span className="inline-flex items-center rounded bg-green-500/15 px-2 py-0.5 text-xs font-medium text-green-700 dark:text-green-400">
                            -{discountPercent}%
                          </span>
                          {discountAmount > 0 && (
                            <span className="text-xs text-muted-foreground">
                              (Save {discountAmount.toFixed(2)} {cat.currency})
                            </span>
                          )}
                        </>
                      ) : (
                        <span className="text-foreground font-semibold tabular-nums">
                          {cat.price.toFixed(2)} {cat.currency}
                        </span>
                      )}
                    </div>
                    {cat.sellingFast && (
                      <p className="text-xs text-primary mt-1">Selling fast</p>
                    )}
                    {cat.fromFans && (
                      <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                        Tickets from fans? <Info className="w-3 h-3" />
                      </p>
                    )}
                    {cat.minQty != null && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        At least {cat.minQty} tickets
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      type="button"
                      onClick={() => setMoreInfoModalOpen(true)}
                      className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                    >
                      <Info className="w-3.5 h-3.5" />
                      More info
                    </button>
                    <div className="flex items-center rounded-lg border-2 border-green-500/50 bg-background">
                      <button
                        type="button"
                        onClick={() => handleDecrement(cat)}
                        disabled={(quantities[cat.id] ?? 0) === 0}
                        className="w-10 h-10 flex items-center justify-center rounded-l-md hover:bg-muted disabled:opacity-50 text-foreground"
                        aria-label="Decrease"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-10 text-center text-sm font-medium tabular-nums">
                        {quantities[cat.id] ?? 0}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleIncrement(cat)}
                        disabled={
                          (quantities[cat.id] ?? 0) >= (cat.maxQty ?? 10)
                        }
                        className="w-10 h-10 flex items-center justify-center rounded-r-md hover:bg-muted disabled:opacity-50 text-green-600 dark:text-green-400"
                        aria-label="Increase"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Sticky footer: Order details (opens sheet from bottom), Time remaining, total, Checkout — same design as assigned */}
      {step === 2 && (
        <div
          className={cn(
            "fixed left-0 right-0 z-40 bottom-20 md:bottom-0 w-full",
            "bg-card dark:bg-card/95 backdrop-blur-md border-t border-border",
            "py-4 rounded-t-2xl md:rounded-t-none shadow-[0_-4px_20px_rgba(0,0,0,0.08)]"
          )}
        >
          <div className="w-full container mx-auto px-4 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => setOrderDetailsOpen(true)}
              className={cn(
                "flex items-center gap-2 min-w-0 text-left transition-colors rounded-lg px-3 py-2",
                orderDetailsOpen
                  ? "bg-primary/10 text-primary"
                  : "hover:bg-muted text-foreground"
              )}
              aria-label="Order details"
            >
              <div className="relative shrink-0">
                <Ticket className="w-6 h-6 text-muted-foreground" />
                <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground px-1">
                  {totalQty}
                </span>
              </div>
              <span className="text-sm font-medium truncate">Order details</span>
            </button>
            <div className="flex items-center gap-2 shrink-0 text-sm text-muted-foreground">
              <span>Time Remaining</span>
              <span
                className={cn(
                  "font-mono font-semibold tabular-nums",
                  timeLeft <= 60 ? "text-destructive" : "text-green-600 dark:text-green-400"
                )}
              >
                {timeStr}
              </span>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-base font-display font-bold text-foreground">
                {totalPrice.toFixed(2)} {currency}
              </span>
              <Button
                type="button"
                onClick={handleCheckout}
                disabled={totalQty === 0}
                className="rounded-xl font-semibold bg-primary text-primary-foreground hover:bg-primary/90 border-2 border-primary"
              >
                Checkout
              </Button>
            </div>
          </div>
        </div>
      )}

      {mounted && (
        <>
          <OrderDetailsSheet
            open={orderDetailsOpen}
            onOpenChange={setOrderDetailsOpen}
            items={orderDetailsSheetItems}
            total={totalPrice}
            currency={currency}
            onRemove={handleRemoveFromOrder}
            onClearAll={handleClearAllOrder}
            eventInfo={{
              title: event.title,
              location: event.location,
              date: dateLabel,
              time: selectedSlotLabel ?? undefined,
            }}
          />
          <ActivePromotionModal
            open={discountModalOpen}
            onOpenChange={setDiscountModalOpen}
            onSelectPromotion={(percent) => setDiscountPercent(percent)}
          />
          <TicketDetailsModal
            open={moreInfoModalOpen}
            onOpenChange={setMoreInfoModalOpen}
            title={event.title}
            inclusions={event.inclusions ?? []}
            exclusions={event.exclusions ?? []}
          />
          {hasDateOptions && availability.length > 0 && (
            <TicketDateTimeModal
              open={calendarOpen}
              onOpenChange={setCalendarOpen}
              availability={availability}
              initialSelectedDateISO={selectedDateKey}
              numberOfMonths={numberOfMonths}
              onApply={handleDateTimeApply}
            />
          )}
        </>
      )}

      <MobileTabbar />
    </div>
  );
}
