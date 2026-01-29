export interface Movie {
  id: string;
  title: string;
  genre: string[];
  rating: string;
  duration: string;
  language: string;
  poster: string;
  backdrop: string;
  tags: string[];
  status: "now_showing" | "coming_soon" | "advance_booking";
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  image: string;
  code?: string;
}

export const MOVIES: Movie[] = [
  {
    id: "1",
    title: "Cyber Odyssey",
    genre: ["Sci-Fi", "Action", "Thriller"],
    rating: "PG-13",
    duration: "2h 15m",
    language: "English",
    poster: "/assets/hero-bg.png",
    backdrop: "/assets/hero-bg.png",
    tags: ["IMAX", "4DX", "Dolby Atmos"],
    status: "now_showing",
  },
  {
    id: "2",
    title: "Velvet Night",
    genre: ["Music", "Documentary"],
    rating: "PG",
    duration: "1h 45m",
    language: "English",
    poster: "/assets/hero-bg.png",
    backdrop: "/assets/hero-bg.png",
    tags: ["Live Event", "VIP"],
    status: "now_showing",
  },
  {
    id: "3",
    title: "The Silent Void",
    genre: ["Horror", "Mystery"],
    rating: "R",
    duration: "1h 58m",
    language: "English",
    poster: "/assets/hero-bg.png",
    backdrop: "/assets/hero-bg.png",
    tags: ["2D", "Standard"],
    status: "now_showing",
  },
  {
    id: "4",
    title: "Neon Drift",
    genre: ["Action", "Crime"],
    rating: "R",
    duration: "2h 05m",
    language: "English",
    poster: "/assets/hero-bg.png",
    backdrop: "/assets/hero-bg.png",
    tags: ["IMAX", "Laser"],
    status: "coming_soon",
  },
  {
    id: "5",
    title: "Desert Winds",
    genre: ["Drama", "Adventure"],
    rating: "PG-13",
    duration: "2h 30m",
    language: "Arabic",
    poster: "/assets/hero-bg.png",
    backdrop: "/assets/hero-bg.png",
    tags: ["Standard"],
    status: "coming_soon",
  },
  {
    id: "6",
    title: "Quantum Paradox",
    genre: ["Sci-Fi", "Drama"],
    rating: "PG-13",
    duration: "2h 10m",
    language: "English",
    poster: "/assets/hero-bg.png",
    backdrop: "/assets/hero-bg.png",
    tags: ["IMAX", "3D"],
    status: "now_showing",
  }
];

export const OFFERS: Offer[] = [
  {
    id: "1",
    title: "Doha Bank Offer",
    description: "Enjoy Buy 1 Get 1 Free movie tickets on selected categories including 7-Star in Novo Cinemas with Doha Bank cards.",
    image: "/assets/hero-bg.png",
  },
  {
    id: "2",
    title: "Dukhan Bank Offer",
    description: "Elevate your movie experiences with Dukhan Bank's Visa Infinite Card!",
    image: "/assets/hero-bg.png",
  },
  {
    id: "3",
    title: "HSBC Offer",
    description: "Use your HSBC Premier Credit Card to buy a 2D Cool or 7-Star ticket and get a second one, absolutely free.",
    image: "/assets/hero-bg.png",
  },
  {
    id: "4",
    title: "Mastercard Weekends",
    description: "Get 50% off on your second ticket when you book with Mastercard on weekends.",
    image: "/assets/hero-bg.png",
  },
  {
    id: "5",
    title: "Visa Infinite Privilege",
    description: "Free upgrade to VIP experience with every standard ticket purchase.",
    image: "/assets/hero-bg.png",
  },
  {
    id: "6",
    title: "Amex BQ Exclusive",
    description: "Access to the exclusive Amex lounge and priority booking for premieres.",
    image: "/assets/hero-bg.png",
  }
];

export const FILTERS = ["Today", "Tomorrow", "This Weekend"];
export const GENRES = ["Action", "Comedy", "Drama", "Sci-Fi", "Horror", "Family"];
