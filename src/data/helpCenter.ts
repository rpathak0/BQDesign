/**
 * Help center mock data: collections, categories, articles.
 * Used by Help Center listing, category page, and article detail.
 */

export interface HelpCollection {
  id: string;
  slug: string;
  title: string;
  description?: string;
  articleCount: number;
  icon?: string;
}

export interface HelpCategory {
  id: string;
  slug: string;
  collectionId: string;
  title: string;
  articleIds: string[];
}

export interface HelpArticle {
  id: string;
  slug: string;
  collectionId: string;
  categoryId?: string;
  title: string;
  updatedAt: string; // ISO date
  content: string; // Markdown or HTML
  headings: { id: string; text: string }[];
  relatedArticleIds: string[];
}

export const HELP_COLLECTIONS: HelpCollection[] = [
  { id: "c1", slug: "faq", title: "FAQ", description: "BookingQube 'How to?' Guide", articleCount: 69, icon: "help-circle" },
  { id: "c2", slug: "event-goer", title: "Event Goer's Guide", articleCount: 2, icon: "ticket" },
  { id: "c3", slug: "organiser", title: "Organiser's Guide", description: "Essential tutorials for Organisers: setting up an event, VAT in the UAE, Printing Tickets, Using the dashboard...", articleCount: 12, icon: "clipboard" },
  { id: "c4", slug: "best-practices", title: "Best Practices, Tips and Tricks: How To Sell Your Product Like a Pro", articleCount: 2, icon: "trending-up" },
];

export const HELP_CATEGORIES: HelpCategory[] = [
  { id: "cat1", slug: "getting-started", collectionId: "c1", title: "Getting Started", articleIds: ["a1", "a2"] },
  { id: "cat2", slug: "event-discovery", collectionId: "c1", title: "Event Discovery & Ticket Purchase", articleIds: ["a3", "a4"] },
  { id: "cat3", slug: "payments", collectionId: "c1", title: "Payments & Refunds", articleIds: ["a5"] },
  { id: "cat4", slug: "ticket-delivery", collectionId: "c1", title: "Ticket Delivery & E-Tickets", articleIds: ["a6"] },
  { id: "cat5", slug: "uploading-events", collectionId: "c1", title: "Uploading & Managing Events", articleIds: ["a7"] },
  { id: "cat6", slug: "others", collectionId: "c1", title: "Others", articleIds: ["a8"] },
];

export const HELP_ARTICLES: HelpArticle[] = [
  {
    id: "a1",
    slug: "who-we-are",
    collectionId: "c1",
    categoryId: "cat1",
    title: "Who We Are - BookingQube",
    updatedAt: "2024-08-01T12:00:00Z",
    headings: [
      { id: "welcome", text: "Welcome to BookingQube - Your Gateway to the Region's Best Experiences" },
      { id: "what-you-find", text: "What You'll Find on BookingQube:" },
    ],
    content: `## Welcome to BookingQube - Your Gateway to the Region's Best Experiences

BookingQube is your premium gateway to movies, events, and experiences. We partner with leading venues and promoters to bring you the best tickets and offers in one place.

Our mission is to make booking simple, secure, and enjoyable—whether you're planning a night out at the cinema or a once-in-a-lifetime event.

### What You'll Find on BookingQube:

- **Entertainment & Culture** – Concerts, theatre, and cultural events
- **Attractions & Experiences** – Tours, family activities, and more
- **Sports & Fitness** – Matches, races, and fitness events
- **Business & Networking** – Conferences and corporate events

For support or questions, please contact us via the Contact page.`,
    relatedArticleIds: ["a2", "a3", "a6"],
  },
  {
    id: "a2",
    slug: "how-to-download-app",
    collectionId: "c1",
    categoryId: "cat1",
    title: "How to download the BookingQube App?",
    updatedAt: "2024-09-15T10:00:00Z",
    headings: [],
    content: "You can download the BookingQube app from the App Store (iOS) or Google Play (Android). Search for 'BookingQube' or use the links in our website footer.",
    relatedArticleIds: ["a1", "a6"],
  },
  {
    id: "a3",
    slug: "how-to-create-account",
    collectionId: "c1",
    categoryId: "cat1",
    title: "How to create an account?",
    updatedAt: "2024-07-20T09:00:00Z",
    headings: [],
    content: "Click Login or Register on the website or app. Enter your email and create a password. You'll receive a confirmation email to verify your account.",
    relatedArticleIds: ["a2", "a4"],
  },
  {
    id: "a4",
    slug: "how-to-reset-password",
    collectionId: "c1",
    categoryId: "cat1",
    title: "How to reset your password?",
    updatedAt: "2024-07-20T09:00:00Z",
    headings: [],
    content: "On the login page, click 'Forgot password?' and enter your email. We'll send you a link to reset your password.",
    relatedArticleIds: ["a3"],
  },
  {
    id: "a5",
    slug: "refund-policy",
    collectionId: "c1",
    categoryId: "cat3",
    title: "Refund and cancellation policy",
    updatedAt: "2024-08-10T14:00:00Z",
    headings: [],
    content: "Refund and cancellation rules depend on the event. Check the event page for the specific policy. Many events allow free cancellation up to 24 hours before.",
    relatedArticleIds: ["a6"],
  },
  {
    id: "a6",
    slug: "what-is-ticket-resale",
    collectionId: "c1",
    categoryId: "cat4",
    title: "What is ticket resale on BookingQube?",
    updatedAt: "2024-09-01T11:00:00Z",
    headings: [],
    content: "Ticket resale allows you to list your tickets for sale if you can't attend. Terms vary by event; check the event page for resale availability.",
    relatedArticleIds: ["a5", "a2"],
  },
  {
    id: "a7",
    slug: "organiser-getting-started",
    collectionId: "c3",
    categoryId: "cat5",
    title: "Getting started as an organiser",
    updatedAt: "2024-08-25T16:00:00Z",
    headings: [],
    content: "Register as an organiser, complete verification, and use the dashboard to create events, set tickets, and manage sales.",
    relatedArticleIds: ["a1"],
  },
  {
    id: "a8",
    slug: "contact-support",
    collectionId: "c1",
    categoryId: "cat6",
    title: "Contact support",
    updatedAt: "2024-06-01T08:00:00Z",
    headings: [],
    content: "Visit our Contact page or use the chat widget for quick help. For account or payment issues, include your order reference.",
    relatedArticleIds: ["a1", "a5"],
  },
];

export function getCollectionBySlug(slug: string): HelpCollection | undefined {
  return HELP_COLLECTIONS.find((c) => c.slug === slug);
}

export function getCategoriesByCollectionId(collectionId: string): HelpCategory[] {
  return HELP_CATEGORIES.filter((c) => c.collectionId === collectionId);
}

export function getArticleById(id: string): HelpArticle | undefined {
  return HELP_ARTICLES.find((a) => a.id === id);
}

export function getArticleBySlug(slug: string): HelpArticle | undefined {
  return HELP_ARTICLES.find((a) => a.slug === slug);
}

export function getRelatedArticles(ids: string[]): HelpArticle[] {
  return ids.map((id) => getArticleById(id)).filter((a): a is HelpArticle => !!a);
}

export function searchCollectionsAndArticles(query: string): {
  collections: HelpCollection[];
  articles: HelpArticle[];
} {
  const q = query.toLowerCase().trim();
  if (!q) {
    return { collections: HELP_COLLECTIONS, articles: HELP_ARTICLES };
  }
  const collections = HELP_COLLECTIONS.filter(
    (c) => c.title.toLowerCase().includes(q) || (c.description?.toLowerCase().includes(q))
  );
  const articles = HELP_ARTICLES.filter(
    (a) => a.title.toLowerCase().includes(q) || a.content.toLowerCase().includes(q)
  );
  return { collections, articles };
}

export function getArticlesForCategory(categoryId: string): HelpArticle[] {
  const cat = HELP_CATEGORIES.find((c) => c.id === categoryId);
  if (!cat) return [];
  return cat.articleIds.map((id) => getArticleById(id)).filter((a): a is HelpArticle => !!a);
}
