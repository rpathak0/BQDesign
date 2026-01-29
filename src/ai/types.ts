export interface AssistantEvent {
  id: string;
  type: 'event';
  title: string;
  description?: string;
  category: string;
  tags: string[];
  location: string;
  date: string;
  price: string;
  image: string;
  familyFriendly: boolean;
  bookingUrl?: string;
  status?: string;
}

export interface AssistantMovie {
  id: string;
  type: 'movie';
  title: string;
  description?: string;
  genre: string[];
  duration: string;
  rating: string;
  image: string;
  backdrop: string;
  status: string;
}

export interface AssistantOffer {
  id: string;
  type: 'offer';
  title: string;
  description: string;
  bank?: string;
  discount: string;
  image: string;
  category?: string;
}

export interface AssistantVenue {
  id: string;
  type: 'venue';
  name: string;
  location: string;
  image: string;
}

export type AssistantItem = AssistantEvent | AssistantMovie | AssistantOffer | AssistantVenue;

export interface SearchResult {
  item: AssistantItem;
  score: number;
  whyMatched: string[];
}
