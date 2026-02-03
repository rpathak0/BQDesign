/**
 * Event detail type and data access. Swap to API later without changing components.
 */

export interface EventReview {
  id: string;
  author: string;
  rating: number;
  date: string;
  text: string;
}

/** Price tier for seating layout (e.g. 195 QAR, 295 QAR). */
export interface SeatingTier {
  id: string;
  label: string;
  price: number;
  currency: string;
  color: string; // Tailwind class or hex, e.g. "bg-cyan-400", "#22d3ee"
}

/** Section of seats (e.g. LOWER TIER). */
export interface SeatingSection {
  id: string;
  name: string;
  tierId: string;
  rows: number;
  seatsPerRow: number;
  /** Optional: start row label, e.g. "A" */
  startRowLabel?: string;
}

export interface SeatingLayout {
  tiers: SeatingTier[];
  sections: SeatingSection[];
}

/** Ticket category for non-seating events (e.g. Category 1 All ages 195 QAR). */
export interface TicketCategory {
  id: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  minQty?: number;
  maxQty?: number;
  sellingFast?: boolean;
  fromFans?: boolean;
}

/** Time slot for a date (e.g. 15:00-19:00 310 QAR Afternoon Tour). */
export interface TimeSlot {
  id: string;
  start: string;
  end: string;
  label?: string;
  price: number;
  currency: string;
  soldOut?: boolean;
  fastSelling?: boolean;
}

/** Date option with time slots. */
export interface DateOption {
  date: string; // ISO or "Mon 2 Feb" display
  dateKey: string; // YYYY-MM-DD for storage
  fromPrice?: number;
  timeSlots: TimeSlot[];
}

export interface EventDetail {
  id: string;
  slug: string;
  title: string;
  date: string;
  location: string;
  image: string;
  price: string;
  priceFrom: number;
  category: string;
  tags?: string[];
  status?: "fast-selling" | "limited-slots" | "best-seller" | "new";
  rating: number;
  ratingCount: number;
  description: string;
  highlights: string[];
  inclusions: string[];
  exclusions: string[];
  importantNotes?: string;
  cancellationPolicy?: string;
  openingHours: string;
  lat: number;
  lng: number;
  images: string[];
  reviews: EventReview[];
  /** When true, event has a seating map; user goes to seating selection before checkout. */
  hasSeatingLayout?: boolean;
  seatingLayout?: SeatingLayout;
  /** Ticket categories for events without seating (quantity selection). */
  ticketCategories?: TicketCategory[];
  /** Date and time options for booking (used after ticket/seat selection). */
  dateTimeOptions?: DateOption[];
}

// Lazy load JSON so it can be replaced by API
let _events: EventDetail[] | null = null;

async function loadEvents(): Promise<EventDetail[]> {
  if (_events) return _events;
  const data = await import("./events.json");
  _events = data.default as EventDetail[];
  return _events;
}

/** All events (for listing). Replace with fetch("/api/events") later. */
export async function getEvents(): Promise<EventDetail[]> {
  return loadEvents();
}

/** Single event by slug. Replace with fetch(`/api/events/${slug}`) later. */
export async function getEventBySlug(slug: string): Promise<EventDetail | null> {
  const events = await loadEvents();
  return events.find((e) => e.slug === slug) ?? null;
}

/** For compatibility with bqData Event (listing cards). */
export function eventDetailToCardEvent(e: EventDetail) {
  return {
    id: e.id,
    title: e.title,
    date: e.date,
    location: e.location,
    image: e.image,
    price: e.price,
    category: e.category,
    tags: e.tags,
    status: e.status,
  };
}
