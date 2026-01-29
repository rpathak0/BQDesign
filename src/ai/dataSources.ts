import { MOVIES, OFFERS } from "@/data/mockContent";
import { EVENTS, VENUES } from "@/data/bqData";
import { AssistantEvent, AssistantMovie, AssistantOffer, AssistantVenue } from "./types";

// Simulate async API calls
const DELAY_MS = 300;
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function getEvents(): Promise<AssistantEvent[]> {
  await sleep(DELAY_MS);
  return EVENTS.map(e => ({
    id: e.id,
    type: 'event',
    title: e.title,
    description: `Join us for ${e.title} at ${e.location}. Category: ${e.category}.`,
    category: e.category,
    tags: e.tags || [],
    location: e.location,
    date: e.date,
    price: e.price,
    image: e.image,
    familyFriendly: e.tags?.some(t => ['Family', 'Kids'].includes(t)) || false,
    status: e.status
  }));
}

export async function getMovies(): Promise<AssistantMovie[]> {
  await sleep(DELAY_MS);
  return MOVIES.map(m => ({
    id: m.id,
    type: 'movie',
    title: m.title,
    description: `Watch ${m.title}, a ${m.genre.join(', ')} movie rated ${m.rating}. Duration: ${m.duration}.`,
    genre: m.genre,
    duration: m.duration,
    rating: m.rating,
    image: m.poster,
    backdrop: m.backdrop,
    status: m.status
  }));
}

export async function getOffers(): Promise<AssistantOffer[]> {
  await sleep(DELAY_MS);
  return OFFERS.map(o => ({
    id: o.id,
    type: 'offer',
    title: o.title,
    description: o.description,
    image: o.image,
    discount: o.title.includes('50%') ? '50%' : 'Special'
  }));
}

export async function getVenues(): Promise<AssistantVenue[]> {
  await sleep(DELAY_MS);
  return VENUES.map(v => ({
    id: v.id,
    type: 'venue',
    name: v.name,
    location: v.location,
    image: v.image
  }));
}
