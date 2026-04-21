import { ARTISTS, EVENTS } from "@/data/bqData";

export interface ArtistProfileData {
  slug: string;
  tagline: string;
  about: string[];
  upcomingEventIds: string[];
  pastEvents: string[];
  similarArtistIds: string[];
}

const DEFAULT_ABOUT = [
  "One of the most in-demand live performers, known for high-energy shows and globally recognized collaborations.",
  "Book upcoming performances, discover similar artists, and follow new event announcements on BookingQube.",
];

export const ARTIST_PROFILES: ArtistProfileData[] = ARTISTS.map((artist, index) => ({
  slug: artist.slug ?? artist.name.toLowerCase().replace(/\s+/g, "-"),
  tagline: `${artist.genre ?? "Live"} artist with major performances across the region`,
  about: DEFAULT_ABOUT,
  upcomingEventIds: [EVENTS[index % EVENTS.length]?.id].filter(Boolean),
  pastEvents: [
    `${artist.name} Live in Dubai`,
    `${artist.name} Summer Arena Night`,
    `${artist.name} Special Guest Set`,
  ],
  similarArtistIds: ARTISTS.filter((a) => a.id !== artist.id)
    .slice(0, 3)
    .map((a) => a.id),
}));

export function getArtistProfile(slug: string) {
  return ARTIST_PROFILES.find((profile) => profile.slug === slug) ?? null;
}
