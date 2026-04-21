export interface OfferPromotion {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  tag: "Novo Offers & Promotions" | "Bank Offers & Promotions" | "Collectibles";
  validTill: string;
}

export const OFFER_PROMOTIONS: OfferPromotion[] = [
  {
    id: "op-1",
    slug: "gamers-popcorn-combo",
    title: "Gamer's Popcorn Combo",
    subtitle: "Ready for a power-up",
    description:
      "Ready for a power-up? NovoCinemas brings you the perfect combo with regular popcorn, medium cola, and a chocolate bar. Watch your favorite releases on the big screen.",
    image: "/assets/hero-bg.png",
    tag: "Novo Offers & Promotions",
    validTill: "2026-05-31",
  },
  {
    id: "op-2",
    slug: "movie-magic-combo",
    title: "Movie Magic",
    subtitle: "Snack and sip combo",
    description: "Get a special snack and drink bundle curated for movie lovers.",
    image: "/assets/hero-bg.png",
    tag: "Novo Offers & Promotions",
    validTill: "2026-06-15",
  },
  {
    id: "op-3",
    slug: "earn-avios-with-novo",
    title: "Earn Avios with Novo Cinemas",
    subtitle: "Collect points while you watch",
    description: "Earn Avios points on selected transactions and redeem across partners.",
    image: "/assets/hero-bg.png",
    tag: "Bank Offers & Promotions",
    validTill: "2026-07-30",
  },
  {
    id: "op-4",
    slug: "avatar-collectables-blue",
    title: "Avatar Collectables - Blue",
    subtitle: "Limited edition combo",
    description: "Exclusive themed collectible cup and popcorn tub for Avatar fans.",
    image: "/assets/hero-bg.png",
    tag: "Collectibles",
    validTill: "2026-08-20",
  },
  {
    id: "op-5",
    slug: "avatar-collectables-red",
    title: "Avatar Collectables - Red",
    subtitle: "Special edition",
    description: "Own the red variant collectible set while stocks last.",
    image: "/assets/hero-bg.png",
    tag: "Collectibles",
    validTill: "2026-08-20",
  },
  {
    id: "op-6",
    slug: "iron-ares-combo",
    title: "Iron Ares Collectable Combo",
    subtitle: "Special promo",
    description: "Grab this hero combo with movie ticket and themed merch.",
    image: "/assets/hero-bg.png",
    tag: "Collectibles",
    validTill: "2026-06-30",
  },
  {
    id: "op-7",
    slug: "qib-offer",
    title: "QIB Offer",
    subtitle: "Buy 1 ticket get 1",
    description: "Use eligible QIB cards to unlock ticket promotions on selected titles.",
    image: "/assets/hero-bg.png",
    tag: "Bank Offers & Promotions",
    validTill: "2026-12-31",
  },
  {
    id: "op-8",
    slug: "doha-bank-offer",
    title: "Doha Bank Offer",
    subtitle: "Buy 1 get 1 free",
    description: "Enjoy Buy 1 Get 1 Free tickets with eligible Doha Bank cards.",
    image: "/assets/hero-bg.png",
    tag: "Bank Offers & Promotions",
    validTill: "2026-11-30",
  },
  {
    id: "op-9",
    slug: "dukhan-bank-offer",
    title: "Dukhan Bank Offer",
    subtitle: "Exclusive cinema perks",
    description: "Save more and enjoy premium benefits with Dukhan Bank cards.",
    image: "/assets/hero-bg.png",
    tag: "Bank Offers & Promotions",
    validTill: "2026-10-30",
  },
  {
    id: "op-10",
    slug: "hsbc-offer",
    title: "HSBC Offer",
    subtitle: "Double the fun",
    description: "Use HSBC cards to receive special ticket and combo offers.",
    image: "/assets/hero-bg.png",
    tag: "Bank Offers & Promotions",
    validTill: "2026-09-30",
  },
  {
    id: "op-11",
    slug: "qib-promo-offer",
    title: "QIB Offer",
    subtitle: "Offer valid on selected cards",
    description: "Another QIB partner offer for high-demand premieres and weekends.",
    image: "/assets/hero-bg.png",
    tag: "Bank Offers & Promotions",
    validTill: "2026-12-31",
  },
  {
    id: "op-12",
    slug: "turn-points-into-movie-moments",
    title: "Turn your points into movie moments",
    subtitle: "Redeem vouchers",
    description: "Redeem loyalty points for food vouchers and movie experiences.",
    image: "/assets/hero-bg.png",
    tag: "Novo Offers & Promotions",
    validTill: "2026-08-31",
  },
];

export function getOfferPromotionBySlug(slug: string) {
  return OFFER_PROMOTIONS.find((offer) => offer.slug === slug) ?? null;
}
