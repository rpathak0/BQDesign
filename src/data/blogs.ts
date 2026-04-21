export interface BlogPost {
  id: number;
  slug: string;
  tag: string;
  category: string;
  title: string;
  meta: string;
  views: number;
  excerpt: string;
  image: string;
  content: string[];
}

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 1,
    slug: "premium-cinema-experiences-dubai-qatar",
    tag: "Cinema Guides",
    category: "Things To Do",
    title: "Premium cinema experiences in Dubai & Qatar",
    meta: "January 2026 • 5 min read",
    views: 12234,
    excerpt: "Explore premium screens, VIP lounges, and top cinema experiences in Dubai and Qatar.",
    image: "/assets/hero-bg.png",
    content: [
      "Dubai and Qatar continue to elevate cinema nights with luxury lounges, immersive sound systems, and curated dining inside premium auditoriums.",
      "If you are planning a premium movie outing, focus on showtimes with lower occupancy and compare available seat maps before booking.",
      "BookingQube helps you quickly compare ticket categories, spot bundled offers, and secure preferred seats before they sell out.",
    ],
  },
  {
    id: 2,
    slug: "top-weekend-events-you-cant-miss",
    tag: "City Picks",
    category: "City Events",
    title: "Top weekend events you can't miss this week",
    meta: "Curated by BookingQube editors",
    views: 9540,
    excerpt: "Your quick roundup of the biggest weekend events, attractions, and live experiences.",
    image: "/assets/hero-bg.png",
    content: [
      "The weekend lineup includes family attractions, live shows, and late-night experiences across top venues in the city.",
      "Start with high-demand events first, then use venue and artist filters to build a full weekend plan without scheduling clashes.",
      "You can bookmark favorites, compare prices, and complete booking in one flow from BookingQube event pages.",
    ],
  },
  {
    id: 3,
    slug: "how-to-get-best-seats-blockbuster-premieres",
    tag: "Insider Tips",
    category: "Local News",
    title: "How to get the best seats for blockbuster premieres",
    meta: "Seat selection • Rewards",
    views: 7862,
    excerpt: "Use smart timing and booking tricks to lock the best seats before they sell out.",
    image: "/assets/hero-bg.png",
    content: [
      "For premieres, seat quality changes quickly. Front-center sections and premium rows are often taken first in the opening hours.",
      "Turn on reminders, keep payment details ready, and monitor nearby rows as alternatives when your ideal block is unavailable.",
      "With BookingQube, you can move quickly from event details to ticket selection and lock your seats before checkout windows expire.",
    ],
  },
];
