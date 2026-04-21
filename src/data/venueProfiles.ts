import { EVENTS, VENUES } from "@/data/bqData";

export interface VenueProfileData {
  slug: string;
  address: string;
  gallery: string[];
  upcomingEventIds: string[];
  nearbyEventIds: string[];
  pastEvents: string[];
}

export const VENUE_PROFILES: VenueProfileData[] = VENUES.map((venue, index) => ({
  slug: venue.slug ?? venue.name.toLowerCase().replace(/\s+/g, "-"),
  address: `${venue.name}, ${venue.location}, UAE`,
  gallery: [venue.image, "/assets/hero-bg.png", "/assets/hero-bg.png", "/assets/hero-bg.png"],
  upcomingEventIds: [EVENTS[index % EVENTS.length]?.id].filter(Boolean),
  nearbyEventIds: EVENTS.slice(0, 2).map((event) => event.id),
  pastEvents: [
    `Live at ${venue.name} - Winter Session`,
    `Family Entertainment Night at ${venue.name}`,
    `Headline Performance at ${venue.name}`,
  ],
}));

export function getVenueProfile(slug: string) {
  return VENUE_PROFILES.find((profile) => profile.slug === slug) ?? null;
}
