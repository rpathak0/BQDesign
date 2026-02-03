import { Movie } from "./mockContent";

export interface Event {
  id: string;
  slug?: string;
  title: string;
  date: string;
  location: string;
  image: string;
  price: string;
  category: string;
  tags?: string[];
  status?: "fast-selling" | "limited-slots" | "best-seller" | "new";
}

export interface Category {
  id: string;
  name: string;
  image: string;
}

export interface Artist {
  id: string;
  name: string;
  image: string;
  genre?: string;
}

export interface Venue {
  id: string;
  name: string;
  location: string;
  image: string;
  type?: "arena" | "hotel" | "club" | "lounge" | "beach" | "park" | "restaurant";
  upcomingEvents?: number;
}

// Re-export existing Movie interface and data
export * from "./mockContent";

export const EVENTS: Event[] = [
  {
    id: "e1",
    slug: "lusail-winter-wonderland",
    title: "Lusail Winter Wonderland",
    date: "Open Daily",
    location: "Al Maha Island",
    image: "/assets/hero-bg.png",
    price: "From AED 150",
    category: "Attraction",
    tags: ["Family", "Outdoor"],
    status: "best-seller"
  },
  {
    id: "e2",
    slug: "disney-on-ice",
    title: "Disney on Ice",
    date: "Jan 25 - Feb 5",
    location: "Etihad Arena",
    image: "/assets/hero-bg.png",
    price: "From AED 200",
    category: "Show",
    tags: ["Kids", "Performance"],
    status: "fast-selling"
  },
  {
    id: "e3",
    slug: "formula-1-grand-prix",
    title: "Formula 1 Grand Prix",
    date: "Nov 24-26",
    location: "Yas Marina Circuit",
    image: "/assets/hero-bg.png",
    price: "From AED 999",
    category: "Sports",
    tags: ["Racing", "Live"],
    status: "limited-slots"
  },
  {
    id: "e4",
    slug: "desert-safari-adventure",
    title: "Desert Safari Adventure",
    date: "Daily",
    location: "Red Dunes",
    image: "/assets/hero-bg.png",
    price: "From AED 150",
    category: "Adventure",
    tags: ["Tourism"],
    status: "new"
  },
  {
    id: "e5",
    slug: "museum-of-the-future",
    title: "Museum of the Future",
    date: "Daily Slots",
    location: "Sheikh Zayed Road",
    image: "/assets/hero-bg.png",
    price: "AED 145",
    category: "Attraction",
    tags: ["Culture", "Tech"],
    status: "best-seller"
  }
];

export const CATEGORIES: Category[] = [
  { id: "c1", name: "Concerts", image: "/assets/hero-bg.png" },
  { id: "c2", name: "Nightlife", image: "/assets/hero-bg.png" },
  { id: "c3", name: "Outdoor", image: "/assets/hero-bg.png" },
  { id: "c4", name: "Comedy", image: "/assets/hero-bg.png" },
  { id: "c5", name: "Festivals", image: "/assets/hero-bg.png" },
  { id: "c6", name: "Arabic", image: "/assets/hero-bg.png" },
  { id: "c7", name: "Desert", image: "/assets/hero-bg.png" },
];

export const ARTIST_GENRES = ["EDM", "House", "Pop", "Comedy", "Arabic", "All"] as const;

export const ARTISTS: Artist[] = [
  { id: "a1", name: "Calvin Harris", image: "/assets/hero-bg.png", genre: "EDM" },
  { id: "a2", name: "Ben Böhmer", image: "/assets/hero-bg.png", genre: "House" },
  { id: "a3", name: "Alesso", image: "/assets/hero-bg.png", genre: "EDM" },
  { id: "a4", name: "Afrojack", image: "/assets/hero-bg.png", genre: "EDM" },
  { id: "a5", name: "KYGO", image: "/assets/hero-bg.png", genre: "EDM" },
  { id: "a6", name: "Solomun", image: "/assets/hero-bg.png", genre: "House" },
];

export const VENUE_TYPES = ["arena", "hotel", "club", "lounge", "beach", "park", "restaurant"] as const;

export const VENUES: Venue[] = [
  { id: "v1", name: "Etihad Arena", location: "Yas Island", image: "/assets/hero-bg.png", type: "arena", upcomingEvents: 12 },
  { id: "v2", name: "Coca-Cola Arena", location: "City Walk", image: "/assets/hero-bg.png", type: "arena", upcomingEvents: 8 },
  { id: "v3", name: "Dubai Opera", location: "Downtown Dubai", image: "/assets/hero-bg.png", type: "arena", upcomingEvents: 5 },
  { id: "v4", name: "White Dubai", location: "Meydan", image: "/assets/hero-bg.png", type: "club", upcomingEvents: 3 },
  { id: "v5", name: "Atlantis The Palm", location: "Palm Jumeirah", image: "/assets/hero-bg.png", type: "hotel", upcomingEvents: 2 },
  { id: "v6", name: "Zero Gravity", location: "Dubai Marina", image: "/assets/hero-bg.png", type: "beach", upcomingEvents: 4 },
];
