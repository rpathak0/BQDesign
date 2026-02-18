/**
 * Careers page mock data: jobs, offices, values, perks.
 */

export interface JobListing {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  experience: string;
  subtitle?: string;
}

export interface Office {
  id: string;
  name: string;
  country: string;
  officeCount: number;
  imageUrl?: string;
}

export interface ValueOrPerk {
  id: string;
  title: string;
  description: string;
  icon?: string;
}

export const CAREERS_JOBS: JobListing[] = [
  { id: "j1", title: "Sr. Front-End Developer", department: "Engineering", location: "UAE", type: "Full Time", experience: "5+ years", subtitle: "Full Time" },
  { id: "j2", title: "Product Designer", department: "Design", location: "UAE", type: "Full Time", experience: "3+ years", subtitle: "Full Time" },
  { id: "j3", title: "Customer Support Lead", department: "Support", location: "KSA", type: "Full Time", experience: "2+ years", subtitle: "Full Time" },
  { id: "j4", title: "Marketing Manager", department: "Marketing", location: "UAE", type: "Full Time", experience: "4+ years", subtitle: "Full Time" },
  { id: "j5", title: "Backend Engineer", department: "Engineering", location: "Remote", type: "Full Time", experience: "4+ years", subtitle: "Full Time" },
];

export const CAREERS_OFFICES: Office[] = [
  { id: "o1", name: "UAE", country: "UAE", officeCount: 3 },
  { id: "o2", name: "KSA", country: "KSA", officeCount: 2 },
  { id: "o3", name: "Bahrain", country: "Bahrain", officeCount: 1 },
  { id: "o4", name: "Qatar", country: "Qatar", officeCount: 1 },
  { id: "o5", name: "Oman", country: "Oman", officeCount: 1 },
];

export const CAREERS_VALUES: ValueOrPerk[] = [
  { id: "v1", title: "Growth Opportunities", description: "We invest in your development with learning budgets and clear progression paths.", icon: "trending-up" },
  { id: "v2", title: "Work-Life Balance", description: "Flexible hours and remote-friendly culture so you can perform at your best.", icon: "scale" },
  { id: "v3", title: "Team Collaboration", description: "Cross-functional teams and a flat structure where every voice matters.", icon: "users" },
  { id: "v4", title: "Innovation", description: "We encourage experimentation and new ideas to shape the future of ticketing.", icon: "lightbulb" },
  { id: "v5", title: "Integrity", description: "Transparency and honesty in how we work with colleagues and partners.", icon: "shield" },
];

export const CAREERS_PERKS: ValueOrPerk[] = [
  { id: "p1", title: "Clear Career Path", description: "Structured levels and regular reviews to help you grow.", icon: "arrow-up" },
  { id: "p2", title: "Training and Development", description: "Access to courses, conferences, and mentorship.", icon: "graduation-cap" },
  { id: "p3", title: "Exclusive Benefits", description: "Discounts on events and partner perks.", icon: "star" },
  { id: "p4", title: "Health & Wellness", description: "Medical coverage and wellness programs.", icon: "heart" },
  { id: "p5", title: "Team Events", description: "Regular team outings and company retreats.", icon: "calendar" },
];

export const CAREERS_DEPARTMENTS = ["All", "Engineering", "Design", "Support", "Marketing"];
export const CAREERS_LOCATIONS = ["All", "UAE", "KSA", "Remote", "Bahrain", "Qatar", "Oman"];
export const CAREERS_TYPES = ["All", "Full Time", "Part Time", "Contract"];
