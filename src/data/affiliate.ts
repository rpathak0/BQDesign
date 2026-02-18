/**
 * Affiliate program page mock data: partners logos, features, steps.
 */

export interface AffiliateFeature {
  id: string;
  title: string;
  description: string;
  icon?: string;
}

export interface AffiliateStep {
  id: string;
  title: string;
  description: string;
  icon?: string;
}

export const AFFILIATE_PARTNER_LOGOS: { id: string; name: string; logoUrl?: string }[] = [
  { id: "pl1", name: "Partner One" },
  { id: "pl2", name: "Partner Two" },
  { id: "pl3", name: "Partner Three" },
];

export const AFFILIATE_WHY_US: AffiliateFeature[] = [
  { id: "f1", title: "Up to 12% commission", description: "Earn competitive commissions on every sale you refer.", icon: "percent" },
  { id: "f2", title: "All-in-one place", description: "Track links, sales, and payouts in a single dashboard.", icon: "layout-dashboard" },
  { id: "f3", title: "Dedicated support", description: "Your own account manager to help you succeed.", icon: "headphones" },
  { id: "f4", title: "Marketing toolkit", description: "Banners, links, and assets ready to use.", icon: "gift" },
  { id: "f5", title: "24/7 online access", description: "Manage your affiliate account anytime.", icon: "clock" },
];

export const AFFILIATE_STEPS: AffiliateStep[] = [
  { id: "s1", title: "Register & Login", description: "Sign up and get your unique affiliate link.", icon: "user-plus" },
  { id: "s2", title: "Promote & Earn", description: "Share events and start earning commissions.", icon: "ticket" },
  { id: "s3", title: "Track & Analyze", description: "Monitor clicks and conversions in real time.", icon: "bar-chart" },
  { id: "s4", title: "Withdraw Payouts", description: "Request payouts when you reach the threshold.", icon: "wallet" },
];

export const AFFILIATE_EXTRA_FEATURES: AffiliateFeature[] = [
  { id: "e1", title: "Wide event network", description: "Promote concerts, sports, attractions, and more.", icon: "globe" },
  { id: "e2", title: "Instant payouts", description: "Fast processing for approved payout requests.", icon: "zap" },
  { id: "e3", title: "Smart payment", description: "Multiple payment methods supported.", icon: "credit-card" },
  { id: "e4", title: "Marketing perks", description: "Co-marketing opportunities for top partners.", icon: "gift" },
];
