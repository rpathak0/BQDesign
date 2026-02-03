"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { MobileTabbar } from "@/components/layout/mobile-tabbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { OrderDetailsSheet } from "@/components/order-details-sheet";
import type { OrderDetailsSheetItem } from "@/components/order-details-sheet";
import { getEventBySlug } from "@/data/events";
import type { EventDetail } from "@/data/events";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/layout/navbar";
import { ChevronRight, ChevronLeft, ChevronDown, Check, X, Sparkles, Calendar, Clock, MapPin, Ticket, Download, Mail, CalendarPlus } from "lucide-react";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: "welcome", label: "Welcome" },
  { id: "quick_order", label: "Quick order" },
  { id: "checkout", label: "Check out" },
  { id: "confirmed", label: "Ticket confirmed" },
] as const;

const RESERVE_MINUTES = 15;

type PaymentOption = "apple_pay" | "g_pay" | "visa_mastercard" | "naps" | "add_card";

export default function CheckoutPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const locale = (params?.locale as string) ?? "en";
  const eventSlug = searchParams.get("event");
  const stepParam = searchParams.get("step");
  const [step, setStep] = useState(() =>
    stepParam === "2" || stepParam === "checkout" ? 2 : 0
  );
  const [event, setEvent] = useState<EventDetail | null>(null);
  const [loading, setLoading] = useState(!!eventSlug);
  const [form, setForm] = useState({
    email: "",
    name: "",
    phone: "",
  });
  const [orderTotal, setOrderTotal] = useState<number | null>(null);
  const [orderCount, setOrderCount] = useState(1);
  const [orderItems, setOrderItems] = useState<{ name: string; qty: number; price: number; currency: string }[]>([]);
  const [selectedDateLabel, setSelectedDateLabel] = useState<string | null>(null);
  const [selectedDateTime, setSelectedDateTime] = useState<{ dateLabel?: string; start?: string; end?: string; label?: string } | null>(null);
  const [timeLeft, setTimeLeft] = useState(RESERVE_MINUTES * 60); // seconds
  const [cardNumber, setCardNumber] = useState("");
  const [expiryMonth, setExpiryMonth] = useState("");
  const [expiryYear, setExpiryYear] = useState("");
  const [cvc, setCvc] = useState("");
  const [saveCard, setSaveCard] = useState(true);
  const [whatsappFee, setWhatsappFee] = useState(true);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [waiverSigned, setWaiverSigned] = useState(false);
  const [cardError, setCardError] = useState<string | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<PaymentOption | null>(null);
  const bookingRef = useRef<string | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(true);
  const [yourInfoOpen, setYourInfoOpen] = useState(true);
  const [editingEmail, setEditingEmail] = useState(false);
  const [orderSummaryOpen, setOrderSummaryOpen] = useState(true);
  const [ticketOrderDetailsOpen, setTicketOrderDetailsOpen] = useState(false);
  const reduced = usePrefersReducedMotion();

  // Generate booking reference when reaching confirmed step (stable for session)
  if (step === 3 && bookingRef.current == null && typeof window !== "undefined") {
    bookingRef.current = `BQ-${Date.now().toString(36).toUpperCase().slice(-8)}`;
  }

  const WHATSAPP_FEE = 2;
  const DISCOUNT = 0; // optional: load from storage if applied on ticket page
  const VAT_PERCENT = 5;

  useEffect(() => {
    if (!eventSlug) {
      setLoading(false);
      return;
    }
    getEventBySlug(eventSlug).then((e) => {
      setEvent(e ?? null);
      setLoading(false);
    });
  }, [eventSlug]);

  // Restore waiver signed state when returning from waiver page
  useEffect(() => {
    if (typeof window === "undefined") return;
    const signed = sessionStorage.getItem("waiverSigned");
    if (signed === "true") setWaiverSigned(true);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const seatsJson = sessionStorage.getItem("selectedSeats");
    const seatsEvent = sessionStorage.getItem("selectedSeats_event");
    const ticketOrderJson = sessionStorage.getItem("ticketOrder");
    const ticketOrderEvent = sessionStorage.getItem("ticketOrder_event");
    if (seatsJson && seatsEvent === eventSlug) {
      try {
        const seats = JSON.parse(seatsJson) as { price: number }[];
        const total = seats.reduce((s, x) => s + x.price, 0);
        setOrderTotal(total);
        setOrderCount(seats.length);
      } catch {
        setOrderTotal(null);
        setOrderCount(1);
      }
    } else if (ticketOrderJson && ticketOrderEvent === eventSlug) {
      try {
        const order = JSON.parse(ticketOrderJson) as { name?: string; price: number; qty: number; currency?: string }[];
        const total = order.reduce((s, x) => s + x.price * x.qty, 0);
        const count = order.reduce((s, x) => s + x.qty, 0);
        setOrderTotal(total);
        setOrderCount(count);
        setOrderItems(
          order.map((x) => ({
            name: x.name ?? "Ticket",
            qty: x.qty,
            price: x.price,
            currency: x.currency ?? "AED",
          }))
        );
      } catch {
        setOrderTotal(null);
        setOrderCount(1);
        setOrderItems([]);
      }
    } else {
      setOrderTotal(null);
      setOrderCount(1);
      setOrderItems([]);
    }
    const dateLabel = sessionStorage.getItem("ticketSelectedDateLabel");
    if (dateLabel) setSelectedDateLabel(dateLabel);
    const dtJson = sessionStorage.getItem("selectedDateTime");
    const dtEvent = sessionStorage.getItem("selectedDateTime_event");
    if (dtJson && dtEvent === eventSlug) {
      try {
        const dt = JSON.parse(dtJson) as { dateLabel?: string; start?: string; end?: string; label?: string };
        setSelectedDateTime(dt);
      } catch {
        setSelectedDateTime(null);
      }
    } else {
      setSelectedDateTime(null);
    }
  }, [eventSlug]);

  useEffect(() => {
    const t = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const stepId = STEPS[step].id;
  const canPayCheckout =
    termsAccepted &&
    waiverSigned &&
    selectedPayment != null &&
    (selectedPayment !== "add_card" && selectedPayment !== "visa_mastercard" || !!cardNumber.trim());
  const canNext =
    stepId === "welcome" ? true :
    stepId === "quick_order" ? !!form.email :
    stepId === "checkout" ? canPayCheckout : true;
  const canPrev = step > 0;

  const handleNext = () => {
    if (step < STEPS.length - 1 && (stepId !== "attendee" && stepId !== "quick_order" || canNext))
      setStep((s) => s + 1);
  };
  const handlePrev = () => {
    if (step > 0) setStep((s) => s - 1);
  };

  const handleRemoveOrderItem = (id: string) => {
    const idx = parseInt(id, 10);
    if (Number.isNaN(idx) || idx < 0 || idx >= orderItems.length) return;
    const next = orderItems.filter((_, i) => i !== idx);
    setOrderItems(next);
    const newTotal = next.reduce((s, i) => s + i.price * i.qty, 0);
    const newCount = next.reduce((s, i) => s + i.qty, 0);
    setOrderTotal(next.length ? newTotal : null);
    setOrderCount(next.length ? newCount : 1);
    if (typeof window !== "undefined" && eventSlug) {
      if (next.length) {
        sessionStorage.setItem(
          "ticketOrder",
          JSON.stringify(next.map((x) => ({ name: x.name, price: x.price, qty: x.qty, currency: x.currency })))
        );
        sessionStorage.setItem("ticketOrder_event", eventSlug);
      } else {
        sessionStorage.removeItem("ticketOrder");
        sessionStorage.removeItem("ticketOrder_event");
      }
    }
  };

  const handleClearAllOrder = () => {
    setOrderItems([]);
    setOrderTotal(null);
    setOrderCount(1);
    setTicketOrderDetailsOpen(false);
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("ticketOrder");
      sessionStorage.removeItem("ticketOrder_event");
    }
  };

  const displayTotal =
    orderTotal != null
      ? `${orderTotal.toFixed(2)} ${event?.seatingLayout?.tiers?.[0]?.currency ?? event?.ticketCategories?.[0]?.currency ?? "AED"}`
      : event?.price ?? "—";
  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const timeStr = `${mins}:${secs.toString().padStart(2, "0")}`;

  const ticketsSubtotal = orderTotal ?? 0;
  const discountAmount = DISCOUNT;
  const subtotalAfterDiscount = ticketsSubtotal - discountAmount;
  const whatsappAmount = whatsappFee ? WHATSAPP_FEE : 0;
  const totalBeforeVat = subtotalAfterDiscount + whatsappAmount;
  const vatIncluded = totalBeforeVat * (VAT_PERCENT / (100 + VAT_PERCENT));
  const displayTotalAmount = orderTotal != null ? totalBeforeVat : 0;
  const currency = event?.ticketCategories?.[0]?.currency ?? event?.seatingLayout?.tiers?.[0]?.currency ?? "QAR";

  const orderDetailsSheetItems: OrderDetailsSheetItem[] = orderItems.map((item, idx) => {
    const hasDiscount = discountAmount > 0 && orderCount > 0 && ticketsSubtotal > 0;
    const discountPercent = hasDiscount && ticketsSubtotal > 0 ? Math.round((discountAmount / ticketsSubtotal) * 100) : undefined;
    const originalUnit = hasDiscount ? item.price + discountAmount / orderCount : item.price;
    return {
      id: String(idx),
      name: item.name,
      originalPrice: hasDiscount ? originalUnit : undefined,
      price: item.price,
      currency: item.currency,
      qty: item.qty,
      discountPercent: discountPercent ?? undefined,
    };
  });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className={cn(
        "flex-1 w-full flex flex-col min-h-0 py-4 md:py-6 pb-36 md:pb-32",
        stepId === "checkout" ? "pt-14 md:pt-16 container mx-auto px-4 min-h-[calc(100vh-8rem)]" : stepId === "confirmed" ? "pt-14 md:pt-16 max-w-none px-0 md:px-0" : "pt-20 md:pt-24 max-w-lg mx-auto px-4"
      )}>
        {stepId === "checkout" && (
          <button
            type="button"
            onClick={() => {
              if (step > 0) setStep((s) => s - 1);
              else if (typeof window !== "undefined" && window.history.length > 1) router.back();
              else router.push(eventSlug ? `/${locale}/events/${eventSlug}` : `/${locale}/events`);
            }}
            className="pl-0 text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mb-4"
          >
            <ChevronLeft className="w-4 h-4" />
            Check out
          </button>
        )}

        {loading ? (
          <div className="rounded-2xl border border-border/50 bg-card p-8 animate-pulse h-64" />
        ) : (
          <AnimatePresence mode="wait">
            {stepId === "welcome" && (
              <motion.div
                key="welcome"
                initial={reduced ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="rounded-2xl border border-border/50 bg-card shadow-lg px-6 pt-8 pb-6 md:px-8 md:pt-10 md:pb-8"
              >
                <div className="flex items-center justify-between mb-6">
                  <button type="button" onClick={handlePrev} className="p-1 -m-1 rounded-lg hover:bg-muted">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => router.push(`/${locale}/events${eventSlug ? `/${eventSlug}` : ""}`)}
                    className="p-1 -m-1 rounded-lg hover:bg-muted"
                    aria-label="Close"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <h2 className="text-xl md:text-2xl font-display font-bold tracking-tight mb-1">
                  Welcome
                </h2>
                <p className="text-muted-foreground text-sm mb-6">
                  Log in or sign up in seconds
                </p>
                <Button
                  type="button"
                  className="w-full h-12 rounded-xl font-semibold mb-3"
                  onClick={() => setStep(1)}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Quick order
                </Button>
                <p className="text-center text-xs text-muted-foreground my-3">or</p>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-12 rounded-xl border-border"
                  onClick={() => setStep(2)}
                >
                  Continue with Google
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-12 rounded-xl border-border mt-2"
                  onClick={() => setStep(2)}
                >
                  Continue with Email
                </Button>
                <p className="text-xs text-muted-foreground mt-6 text-center">
                  By signing up you accept our{" "}
                  <Link href={`/${locale}/terms`} className="text-primary hover:underline">Terms of use</Link>
                  {" "}and{" "}
                  <Link href={`/${locale}/privacy`} className="text-primary hover:underline">Privacy policy</Link>.
                </p>
              </motion.div>
            )}
            {stepId === "quick_order" && (
              <motion.div
                key="quick_order"
                initial={reduced ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="rounded-2xl border border-border/50 bg-card shadow-lg px-6 pt-8 pb-6 md:px-8 md:pt-10 md:pb-8"
              >
                <div className="flex items-center justify-between mb-6">
                  <button type="button" onClick={handlePrev} className="p-1 -m-1 rounded-lg hover:bg-muted">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button type="button" onClick={handlePrev} className="p-1 -m-1 rounded-lg hover:bg-muted" aria-label="Close">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <h2 className="text-xl md:text-2xl font-display font-bold tracking-tight mb-1">
                  Quick order
                </h2>
                <p className="text-muted-foreground text-sm mb-6">
                  Please enter your email to login. If it&apos;s your first time we&apos;ll help you register.
                </p>
                <div className="space-y-2 mb-6">
                  <Label htmlFor="quick-email">Email</Label>
                  <Input
                    id="quick-email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    placeholder="you@example.com"
                    className="rounded-xl"
                  />
                </div>
                <Button
                  type="button"
                  className="w-full h-12 rounded-xl font-semibold"
                  disabled={!form.email}
                  onClick={() => setStep(2)}
                >
                  Continue
                </Button>
                <p className="text-xs text-muted-foreground mt-6 text-center">
                  By signing up you accept our{" "}
                  <Link href={`/${locale}/terms`} className="text-primary hover:underline">Terms of use</Link>
                  {" "}and{" "}
                  <Link href={`/${locale}/privacy`} className="text-primary hover:underline">Privacy policy</Link>.
                </p>
              </motion.div>
            )}
            {stepId === "checkout" && event && (
              <motion.div
                key="checkout"
                initial={reduced ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-[1.25fr_0.75fr] gap-4 lg:gap-6 items-stretch overflow-hidden"
              >
                {/* Left: Order summary - poster and details aligned, fill column */}
                <div className="flex flex-col gap-4 min-w-0 w-full flex-1 min-h-0">
                  <h2 className="text-base font-display font-bold shrink-0">Order summary</h2>
                  {/* Event card (poster) - larger to fill space */}
                  <Card className="rounded-xl border border-border/50 overflow-hidden shadow-sm w-full shrink-0">
                    <div className="aspect-[2/1] min-h-[140px] sm:min-h-[180px] bg-muted relative overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={event.image}
                        alt=""
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <CardContent className="p-3 md:p-4">
                      <p className="font-display font-bold text-foreground text-base">{event.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                        {event.location}
                      </p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 shrink-0" />
                          {selectedDateLabel ?? selectedDateTime?.dateLabel ?? event.date}
                        </span>
                        {(selectedDateTime?.start ?? selectedDateTime?.end) && (
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 shrink-0" />
                            {selectedDateTime?.start ?? ""}
                            {selectedDateTime?.end ? `–${selectedDateTime.end}` : ""}
                          </span>
                        )}
                      </div>
                      {orderItems.length > 0 && (
                        <div className="flex items-start gap-2 text-sm mt-2">
                          <Ticket className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                          <p className="text-foreground">
                            {orderItems.map((i) => `${i.name}, General admission (${i.qty})`).join(" · ")}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  {/* Ticket delivery + agreements card - full width like right card */}
                  <Card className="rounded-xl border border-border/50 shadow-sm p-4 md:p-5 w-full">
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-semibold text-foreground mb-1">Ticket delivery method</p>
                        <p className="text-sm text-muted-foreground">
                          After purchasing, your tickets will be sent to:{" "}
                          {editingEmail ? (
                            <span className="inline-flex flex-wrap items-center gap-2 mt-1">
                              <Input
                                type="email"
                                value={form.email}
                                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                                placeholder="you@example.com"
                                className="h-8 w-full max-w-[240px] rounded-lg text-sm"
                                onBlur={() => setEditingEmail(false)}
                                onKeyDown={(e) => e.key === "Enter" && setEditingEmail(false)}
                                autoFocus
                              />
                              <button
                                type="button"
                                onClick={() => setEditingEmail(false)}
                                className="text-sm font-medium text-primary"
                              >
                                Done
                              </button>
                            </span>
                          ) : (
                            <>
                              <span className="font-medium text-foreground">{form.email || "—"}</span>
                              <button
                                type="button"
                                onClick={() => setEditingEmail(true)}
                                className="text-sm text-primary hover:underline mt-1 ml-1 border-b border-dashed border-primary"
                              >
                                Edit
                              </button>
                            </>
                          )}
                        </p>
                      </div>
                      {/* Terms */}
                      <div className="flex items-start gap-3">
                        <Checkbox
                          id="terms"
                          checked={termsAccepted}
                          onCheckedChange={(v) => setTermsAccepted(v === true)}
                          className="mt-0.5"
                        />
                        <label htmlFor="terms" className="text-sm text-muted-foreground cursor-pointer">
                          I agree to the{" "}
                          <Link href={`/${locale}/terms`} className="text-primary hover:underline">Rules and Regulations</Link>
                          {" "}of the venue of event for customers.
                        </label>
                      </div>
                      {/* Waiver form — clicking checkbox or label opens waiver page; checked when user has signed (sessionStorage on return) */}
                      <div className="flex items-start gap-3">
                        <Checkbox
                          id="waiver"
                          checked={waiverSigned}
                          onCheckedChange={(v) => setWaiverSigned(v === true)}
                          onClick={(e) => {
                            e.preventDefault();
                            const returnTo = `/${locale}/checkout${eventSlug ? `?event=${eventSlug}&step=2` : "?step=2"}`;
                            const url = `/${locale}/waiver?returnTo=${encodeURIComponent(returnTo)}${eventSlug ? `&event=${eventSlug}` : ""}`;
                            window.location.href = url;
                          }}
                          className="mt-0.5 cursor-pointer"
                        />
                        <label
                          htmlFor="waiver"
                          className="text-sm text-muted-foreground cursor-pointer flex-1"
                          onClick={(e) => {
                            e.preventDefault();
                            const returnTo = `/${locale}/checkout${eventSlug ? `?event=${eventSlug}&step=2` : "?step=2"}`;
                            const url = `/${locale}/waiver?returnTo=${encodeURIComponent(returnTo)}${eventSlug ? `&event=${eventSlug}` : ""}`;
                            window.location.href = url;
                          }}
                        >
                          I have read and agree to the{" "}
                          <span className="text-primary hover:underline">
                            waiver and terms of participation
                          </span>
                          {" "}for this event.
                        </label>
                      </div>
                    </div>
                  </Card>
                </div>
                {/* Right: Payment + Order summary card (pink screen) */}
                <div className="space-y-4">
                  <Card className="rounded-xl border border-rose-200/60 dark:border-rose-900/40 shadow-sm p-4 md:p-5 bg-rose-50/50 dark:bg-rose-950/20">
                    <CardHeader className="p-0 mb-3">
                      <CardTitle className="text-base font-display font-bold">Select a payment method</CardTitle>
                    </CardHeader>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                      <button
                        type="button"
                        onClick={() => setSelectedPayment("apple_pay")}
                        className={cn(
                          "flex flex-col items-center justify-center gap-1 rounded-xl border-2 py-4 px-3 text-sm font-medium transition-colors",
                          selectedPayment === "apple_pay"
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border bg-white dark:bg-card hover:border-rose-300 dark:hover:border-rose-700"
                        )}
                      >
                        <span className="text-lg font-semibold">Apple</span>
                        <span>Pay</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedPayment("g_pay")}
                        className={cn(
                          "flex flex-col items-center justify-center gap-1 rounded-xl border-2 py-4 px-3 text-sm font-medium transition-colors",
                          selectedPayment === "g_pay"
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border bg-white dark:bg-card hover:border-rose-300 dark:hover:border-rose-700"
                        )}
                      >
                        <span className="text-lg font-semibold text-[#5F6368] dark:text-[#9AA0A6]">G</span>
                        <span className="text-[#4285F4] dark:text-[#8AB4F8]">Pay</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedPayment("visa_mastercard")}
                        className={cn(
                          "flex flex-col items-center justify-center gap-1 rounded-xl border-2 py-4 px-3 text-sm font-medium transition-colors",
                          selectedPayment === "visa_mastercard"
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border bg-white dark:bg-card hover:border-rose-300 dark:hover:border-rose-700"
                        )}
                      >
                        <span className="text-xs font-semibold text-muted-foreground">Visa</span>
                        <span className="text-xs font-semibold text-muted-foreground">Mastercard</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedPayment("naps")}
                        className={cn(
                          "flex flex-col items-center justify-center gap-0.5 rounded-xl border-2 py-4 px-3 text-sm font-medium transition-colors",
                          selectedPayment === "naps"
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border bg-white dark:bg-card hover:border-rose-300 dark:hover:border-rose-700"
                        )}
                      >
                        <span className="font-bold">NAPS</span>
                        <span className="text-xs text-muted-foreground">Debit card</span>
                      </button>
                    </div>
                    <div className="flex items-center gap-3 my-3">
                      <span className="flex-1 border-t border-dashed border-rose-300 dark:border-rose-800" />
                      <span className="text-sm font-medium text-rose-700 dark:text-rose-400">OR</span>
                      <span className="flex-1 border-t border-dashed border-rose-300 dark:border-rose-800" />
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedPayment("add_card")}
                      className={cn(
                        "w-full rounded-xl py-3 font-semibold bg-white dark:bg-card border-2 transition-colors",
                        selectedPayment === "add_card"
                          ? "border-primary text-primary"
                          : "border-border text-foreground hover:border-primary hover:text-primary"
                      )}
                    >
                      Add Card
                    </button>
                    {selectedPayment === "visa_mastercard" && (
                      <div className="space-y-3 pt-4 mt-4 border-t border-rose-200/60 dark:border-rose-800">
                        <div>
                          <Label htmlFor="card-number-alt" className="text-sm">Card number</Label>
                          <Input
                            id="card-number-alt"
                            placeholder="XXXX XXXX XXXX XXXX"
                            value={cardNumber}
                            onChange={(e) => { setCardNumber(e.target.value); setCardError(null); }}
                            className="rounded-xl mt-1"
                          />
                          {cardError && <p className="text-xs text-destructive mt-1">{cardError}</p>}
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <Label htmlFor="exp-month-alt" className="text-sm">Expiry month</Label>
                            <Input id="exp-month-alt" placeholder="MM" value={expiryMonth} onChange={(e) => setExpiryMonth(e.target.value)} className="rounded-xl mt-1" />
                          </div>
                          <div>
                            <Label htmlFor="exp-year-alt" className="text-sm">Expiry year</Label>
                            <Input id="exp-year-alt" placeholder="YY" value={expiryYear} onChange={(e) => setExpiryYear(e.target.value)} className="rounded-xl mt-1" />
                          </div>
                          <div>
                            <Label htmlFor="cvc-alt" className="text-sm">CVC</Label>
                            <Input id="cvc-alt" placeholder="XXX" value={cvc} onChange={(e) => setCvc(e.target.value)} className="rounded-xl mt-1" />
                          </div>
                        </div>
                        <div className="flex items-center gap-3 pt-2">
                          <Checkbox id="save-card-alt" checked={saveCard} onCheckedChange={(v) => setSaveCard(v === true)} />
                          <label htmlFor="save-card-alt" className="text-sm cursor-pointer">Save my card details</label>
                        </div>
                      </div>
                    )}
                    {selectedPayment === "add_card" && (
                      <div className="space-y-3 pt-4 mt-4 border-t border-rose-200/60 dark:border-rose-800">
                        <div>
                          <Label htmlFor="card-number" className="text-sm">Card number</Label>
                          <Input
                            id="card-number"
                            placeholder="XXXX XXXX XXXX XXXX"
                            value={cardNumber}
                            onChange={(e) => { setCardNumber(e.target.value); setCardError(null); }}
                            className="rounded-xl mt-1"
                          />
                          {cardError && <p className="text-xs text-destructive mt-1">{cardError}</p>}
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <Label htmlFor="exp-month" className="text-sm">Expiry month</Label>
                            <Input id="exp-month" placeholder="MM" value={expiryMonth} onChange={(e) => setExpiryMonth(e.target.value)} className="rounded-xl mt-1" />
                          </div>
                          <div>
                            <Label htmlFor="exp-year" className="text-sm">Expiry year</Label>
                            <Input id="exp-year" placeholder="YY" value={expiryYear} onChange={(e) => setExpiryYear(e.target.value)} className="rounded-xl mt-1" />
                          </div>
                          <div>
                            <Label htmlFor="cvc" className="text-sm">CVC</Label>
                            <Input id="cvc" placeholder="XXX" value={cvc} onChange={(e) => setCvc(e.target.value)} className="rounded-xl mt-1" />
                          </div>
                        </div>
                        <div className="flex items-center gap-3 pt-2">
                          <Checkbox id="save-card" checked={saveCard} onCheckedChange={(v) => setSaveCard(v === true)} />
                          <label htmlFor="save-card" className="text-sm cursor-pointer">Save my card details</label>
                        </div>
                      </div>
                    )}
                  </Card>
                  <div>
                    <p className="text-sm font-semibold text-foreground mb-2">Additional services</p>
                    <div className="flex items-center gap-3">
                      <Checkbox id="whatsapp" checked={whatsappFee} onCheckedChange={(v) => setWhatsappFee(v === true)} />
                      <label htmlFor="whatsapp" className="text-sm cursor-pointer flex items-center gap-2">
                        Send me ticket via WhatsApp
                      </label>
                    </div>
                  </div>
                  {/* Order summary breakdown - collapsible */}
                  <Card className="rounded-xl border border-border/50 shadow-sm p-4 md:p-5">
                    <div className="w-full flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => setOrderSummaryOpen((o) => !o)}
                        className="flex-1 flex items-center justify-between p-0 mb-0 text-left min-w-0"
                      >
                        <CardTitle className="text-base font-display font-bold">Order summary</CardTitle>
                        <ChevronDown className={cn("w-4 h-4 shrink-0 transition-transform", orderSummaryOpen && "rotate-180")} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setTicketOrderDetailsOpen(true)}
                        className="text-sm text-primary hover:underline shrink-0"
                      >
                        Order details
                      </button>
                    </div>
                    {orderSummaryOpen && (
                    <>
                      <div className="space-y-2 text-sm mt-3">
                        {orderTotal != null && (
                          <>
                            <div className="flex justify-between">
                              <span>Tickets • {orderCount}</span>
                              <span>{ticketsSubtotal.toFixed(2)} {currency}</span>
                            </div>
                            {discountAmount > 0 && (
                              <div className="flex justify-between text-green-600 dark:text-green-400">
                                <span>Discount</span>
                                <span>-{discountAmount.toFixed(2)} {currency}</span>
                              </div>
                            )}
                            <div className="flex justify-between font-medium">
                              <span>Subtotal • {orderCount} items</span>
                              <span>{subtotalAfterDiscount.toFixed(2)} {currency}</span>
                            </div>
                            {whatsappFee && (
                              <div className="flex justify-between">
                                <span>Send me ticket via WhatsApp</span>
                                <span>{WHATSAPP_FEE.toFixed(2)} {currency}</span>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                      <div className="mt-3 pt-3 border-t border-border">
                        <div className="flex justify-between items-baseline font-display font-bold text-base">
                          <span>Total</span>
                          <span>{displayTotalAmount.toFixed(2)} {currency}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">VAT {VAT_PERCENT}% included</p>
                      </div>
                    </>
                    )}
                  </Card>
                </div>
              </motion.div>
            )}
            {stepId === "confirmed" && event && (
              <motion.div
                key="confirmed"
                id="ticket-confirmed-print-area"
                initial={reduced ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full min-h-[100vh] flex flex-col bg-muted/30"
              >
                <style dangerouslySetInnerHTML={{ __html: `
                  @media print {
                    body * { visibility: hidden; }
                    #ticket-confirmed-print-area, #ticket-confirmed-print-area * { visibility: visible; }
                    #ticket-confirmed-print-area { position: absolute; left: 0; top: 0; width: 100%; }
                    nav, [data-slot="mobile-tabbar"], button { display: none !important; }
                    #ticket-confirmed-print-area button { display: none !important; }
                  }
                `}} />
                <div className="flex-1 w-full container mx-auto py-6 md:py-8 flex flex-col lg:flex-row gap-6 lg:gap-8">
                  {/* Left: Event summary card (like reference sidebar) */}
                  <aside className="w-full lg:w-[320px] shrink-0">
                    <Card className="rounded-2xl border-border shadow-lg overflow-hidden sticky top-4">
                      <div className="aspect-video bg-muted relative overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={event.image} alt="" className="object-cover w-full h-full" />
                      </div>
                      <CardContent className="p-4 space-y-3">
                        <p className="font-display font-bold text-lg">{event.title}</p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                          <MapPin className="w-4 h-4 shrink-0" />
                          {event.location}
                        </p>
                        <p className="font-mono text-sm font-semibold text-primary">
                          {orderTotal != null ? `${displayTotalAmount.toFixed(2)} ${currency}` : event.price}
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                          <Ticket className="w-3.5 h-3.5" />
                          Ref: {bookingRef.current ?? "—"}
                        </p>
                      </CardContent>
                    </Card>
                  </aside>

                  {/* Right: Confirmation content */}
                  <div className="flex-1 min-w-0 space-y-6">
                    {/* Confirmation header with checkmark balloon */}
                    <div className="rounded-2xl border border-border bg-card shadow-sm p-6 md:p-8 ticket-for-print" id="ticket-for-download">
                      <div className="flex flex-col items-center text-center mb-6">
                        <motion.span
                          initial={reduced ? false : { scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
                          className="flex h-16 w-16 md:h-20 md:w-20 items-center justify-center rounded-full bg-primary/15 text-primary border-2 border-primary/30 shadow-lg shadow-primary/10"
                        >
                          <Check className="h-8 w-8 md:h-10 md:w-10 stroke-[2.5]" />
                        </motion.span>
                        <motion.h1
                          initial={reduced ? false : { opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2, duration: 0.3 }}
                          className="text-xl md:text-2xl font-display font-bold mt-4"
                        >
                          Ticket confirmed
                        </motion.h1>
                        <motion.p
                          initial={reduced ? false : { opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3, duration: 0.3 }}
                          className="text-lg md:text-2xl font-semibold text-foreground mt-2"
                        >
                          {selectedDateLabel ?? selectedDateTime?.dateLabel ?? event.date}
                          {selectedDateTime?.start && selectedDateTime?.end && (
                            <span className="text-muted-foreground font-normal"> · {selectedDateTime.start}–{selectedDateTime.end}</span>
                          )}
                        </motion.p>
                      </div>

                      {/* Action buttons */}
                      <div className="flex flex-wrap gap-3 justify-center mb-6">
                        <Button
                          type="button"
                          className="rounded-xl font-semibold h-11 px-5"
                          onClick={() => window.print()}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download ticket
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          className="rounded-xl font-semibold h-11 px-5"
                          onClick={() => {
                            const start = selectedDateTime?.start ?? "19:00";
                            const end = selectedDateTime?.end ?? "22:00";
                            const dateStr = selectedDateLabel ?? event.date ?? "";
                            const title = encodeURIComponent(event.title);
                            const details = encodeURIComponent(`${event.location}\nRef: ${bookingRef.current ?? ""}`);
                            window.open(`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&dates=20250101T000000Z/20250101T000000Z`, "_blank");
                          }}
                        >
                          <CalendarPlus className="w-4 h-4 mr-2" />
                          Add to calendar
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          className="rounded-xl font-semibold h-11 px-5"
                          onClick={() => {
                            if (typeof window !== "undefined") {
                              sessionStorage.removeItem("selectedSeats");
                              sessionStorage.removeItem("selectedSeats_event");
                              sessionStorage.removeItem("ticketOrder");
                              sessionStorage.removeItem("ticketOrder_event");
                              sessionStorage.removeItem("selectedDateTime");
                              sessionStorage.removeItem("selectedDateTime_event");
                              sessionStorage.removeItem("ticketSelectedDateKey");
                              sessionStorage.removeItem("ticketSelectedDateLabel");
                            }
                            window.location.href = `/${locale}/events${eventSlug ? `/${eventSlug}` : ""}`;
                          }}
                        >
                          View event
                        </Button>
                      </div>

                      {/* Event details (collapsible) */}
                      <div className="border-t border-border pt-4">
                        <button
                          type="button"
                          onClick={() => setDetailsOpen((o) => !o)}
                          className="w-full flex items-center justify-between py-2 text-left font-semibold text-sm"
                        >
                          Event details
                          <ChevronDown className={cn("w-4 h-4 transition-transform", !detailsOpen && "-rotate-90")} />
                        </button>
                        {detailsOpen && (
                          <motion.div
                            initial={false}
                            animate={{ height: "auto", opacity: 1 }}
                            className="space-y-3 pt-2"
                          >
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                              <MapPin className="w-4 h-4 shrink-0 text-primary/80" />
                              <span>{event.location}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                              <Calendar className="w-4 h-4 shrink-0 text-primary/80" />
                              <span>{selectedDateLabel ?? selectedDateTime?.dateLabel ?? event.date}</span>
                            </div>
                            {selectedDateTime?.start && selectedDateTime?.end && (
                              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                <Clock className="w-4 h-4 shrink-0 text-primary/80" />
                                <span>{selectedDateTime.start} – {selectedDateTime.end}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                              <Ticket className="w-4 h-4 shrink-0 text-primary/80" />
                              <span>{orderCount} ticket(s) · {displayTotalAmount.toFixed(2)} {currency}</span>
                            </div>
                          </motion.div>
                        )}
                      </div>

                      {/* Your information (collapsible) + QR */}
                      <div className="border-t border-border pt-4 mt-4">
                        <button
                          type="button"
                          onClick={() => setYourInfoOpen((o) => !o)}
                          className="w-full flex items-center justify-between py-2 text-left font-semibold text-sm"
                        >
                          Your information
                          <ChevronDown className={cn("w-4 h-4 transition-transform", !yourInfoOpen && "-rotate-90")} />
                        </button>
                        {yourInfoOpen && (
                          <motion.div
                            initial={false}
                            animate={{ height: "auto", opacity: 1 }}
                            className="pt-4 flex flex-col sm:flex-row gap-6 items-start"
                          >
                            <div className="space-y-3 flex-1">
                              <div className="flex items-center gap-3 text-sm">
                                <Mail className="w-4 h-4 shrink-0 text-primary/80" />
                                <span className="font-medium text-foreground">{form.email || "—"}</span>
                              </div>
                              <p className="text-xs text-muted-foreground pl-7">
                                Tickets will be sent to your email.
                              </p>
                              <div className="flex items-center gap-3 text-sm pt-1">
                                <span className="font-mono text-xs font-medium text-muted-foreground">Booking ref</span>
                                <span className="font-mono font-semibold">{bookingRef.current ?? "—"}</span>
                              </div>
                            </div>
                            {bookingRef.current && (
                              <div className="flex flex-col items-center rounded-xl bg-muted/50 p-4 border border-border">
                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Scan at venue</p>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(JSON.stringify({ ref: bookingRef.current, event: eventSlug, email: form.email, qty: orderCount }))}`}
                                  alt="Ticket QR code"
                                  className="w-40 h-40 rounded-lg border border-border bg-white"
                                  width={160}
                                  height={160}
                                />
                                <p className="font-mono text-xs mt-2 text-muted-foreground">{bookingRef.current}</p>
                              </div>
                            )}
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {!loading && stepId !== "welcome" && stepId !== "quick_order" && stepId !== "checkout" && stepId !== "confirmed" && (
          <div className="flex justify-between mt-8">
            <Button type="button" variant="outline" onClick={handlePrev} disabled={!canPrev} className="rounded-xl">
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>
            <Button type="button" onClick={handleNext} disabled={!canNext} className="rounded-xl">
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        )}
      </main>

      {/* Ticket-selected footer: welcome/quick_order — Order details (opens sheet), Time remaining, total, Checkout — same design as ticket page */}
      {!loading && event && (stepId === "welcome" || stepId === "quick_order") && (orderTotal != null || orderItems.length > 0) && (
        <div
          className={cn(
            "fixed left-0 right-0 z-40 bottom-20 md:bottom-0 w-full",
            "bg-card dark:bg-card/95 backdrop-blur-md border-t border-border",
            "shadow-[0_-4px_20px_rgba(0,0,0,0.08)] rounded-t-2xl"
          )}
        >
          <div className="w-full container mx-auto px-4 py-4 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => setTicketOrderDetailsOpen(true)}
              className={cn(
                "flex items-center gap-2 min-w-0 text-left transition-colors rounded-lg px-3 py-2",
                ticketOrderDetailsOpen ? "bg-primary/10 text-primary" : "hover:bg-muted"
              )}
            >
              <div className="relative shrink-0">
                <Ticket className="w-6 h-6 text-muted-foreground" />
                <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground px-1">
                  {orderCount}
                </span>
              </div>
              <span className="text-sm font-medium text-foreground truncate">Order details</span>
            </button>
            <div className="flex items-center gap-2 shrink-0 text-sm text-muted-foreground">
              <span>Time Remaining</span>
              <span className={cn(
                "font-mono font-semibold tabular-nums",
                timeLeft <= 60 ? "text-destructive" : "text-green-600 dark:text-green-400"
              )}>
                {timeStr}
              </span>
            </div>
            <div className="shrink-0">
              <span className="text-base font-display font-bold text-foreground">
                {orderTotal != null ? totalBeforeVat.toFixed(2) : orderItems.reduce((s, i) => s + i.price * i.qty, 0).toFixed(2)} {currency}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Order details sheet: slides up from bottom when user clicks "Order details" (same on every page where it’s used) */}
      <OrderDetailsSheet
        open={ticketOrderDetailsOpen}
        onOpenChange={setTicketOrderDetailsOpen}
        items={orderDetailsSheetItems}
        total={orderTotal != null ? totalBeforeVat : orderItems.reduce((s, i) => s + i.price * i.qty, 0)}
        currency={currency}
        onRemove={handleRemoveOrderItem}
        onClearAll={handleClearAllOrder}
        eventInfo={event ? {
          title: event.title,
          location: event.location,
          date: selectedDateLabel ?? selectedDateTime?.dateLabel ?? event.date,
          time: selectedDateTime?.start && selectedDateTime?.end ? `${selectedDateTime.start}–${selectedDateTime.end}` : selectedDateTime?.start ?? undefined,
        } : null}
      />

      {/* Sticky footer - checkout step: Time remaining, total, VAT, Pay */}
      {!loading && event && stepId === "checkout" && (
        <div
          className={cn(
            "fixed left-0 right-0 z-40 bottom-20 md:bottom-0 w-full",
            "bg-muted/80 dark:bg-muted/50 backdrop-blur-md border-t border-border",
            "py-4 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]"
          )}
        >
          <div className="w-full container mx-auto flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Time Remaining</span>
              <span className={cn("font-mono font-semibold rounded-full px-2 py-0.5", timeLeft <= 60 ? "text-destructive bg-destructive/10" : "text-green-600 dark:text-green-400 bg-green-500/10")}>
                {timeStr}
              </span>
            </div>
            <div className="flex items-center justify-between sm:justify-end gap-4">
              <div className="text-right">
                <p className="text-lg font-display font-bold text-foreground">
                  {displayTotalAmount.toFixed(2)} {currency}
                </p>
                <p className="text-xs text-muted-foreground">VAT {VAT_PERCENT}% included</p>
              </div>
              <Button
                type="button"
                onClick={() => {
                  if ((selectedPayment === "add_card" || selectedPayment === "visa_mastercard") && !cardNumber.trim()) {
                    setCardError("Field is empty. Please fill in the field");
                    return;
                  }
                  setCardError(null);
                  setStep(3); // Go directly to ticket confirmed (no intermediate Confirm page)
                }}
                disabled={!canPayCheckout}
                className={cn(
                  "rounded-xl font-semibold min-w-[120px]",
                  canPayCheckout
                    ? "bg-white dark:bg-card text-primary border-2 border-primary"
                    : "bg-muted text-muted-foreground cursor-not-allowed border-2 border-transparent"
                )}
              >
                Pay
              </Button>
            </div>
          </div>
        </div>
      )}

      <MobileTabbar />
    </div>
  );
}
