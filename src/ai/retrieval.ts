import { getEvents, getMovies, getOffers, getVenues } from "./dataSources";
import { AssistantItem, SearchResult } from "./types";

// Simple scoring system
function calculateScore(item: AssistantItem, query: string): { score: number; whyMatched: string[] } {
  const q = query.toLowerCase();
  let score = 0;
  const matches: string[] = [];

  // Title match (High weight)
  if ('title' in item && item.title.toLowerCase().includes(q)) {
    score += 10;
    matches.push(`Title matches "${q}"`);
  } else if ('name' in item && item.name.toLowerCase().includes(q)) {
    score += 10;
    matches.push(`Name matches "${q}"`);
  }

  // Description/Location match (Medium weight)
  if ('description' in item && item.description?.toLowerCase().includes(q)) {
    score += 5;
    matches.push(`Description mentions "${q}"`);
  }
  if ('location' in item && item.location.toLowerCase().includes(q)) {
    score += 5;
    matches.push(`Location matches "${q}"`);
  }

  // Tags/Genre/Category match (Medium weight)
  if ('tags' in item && item.tags.some(t => t.toLowerCase().includes(q))) {
    score += 5;
    matches.push(`Tag matches "${q}"`);
  }
  if ('genre' in item && item.genre.some(g => g.toLowerCase().includes(q))) {
    score += 5;
    matches.push(`Genre matches "${q}"`);
  }
  if ('category' in item && item.category?.toLowerCase().includes(q)) {
    score += 5;
    matches.push(`Category matches "${q}"`);
  }

  // Intent-based boosting
  if (q.includes('family') || q.includes('kids')) {
    if ('familyFriendly' in item && item.familyFriendly) {
      score += 3;
      matches.push("Family friendly");
    }
    if ('rating' in item && (item.rating === 'PG' || item.rating === 'G')) {
      score += 3;
      matches.push("Kid friendly rating");
    }
  }

  if (q.includes('offer') || q.includes('deal') || q.includes('discount')) {
    if (item.type === 'offer') {
      score += 5;
      matches.push("Is an offer");
    }
  }

  // Type matching (if searching for "events", "movies", etc.)
  if (q.includes(item.type) || q.includes(item.type + 's')) {
     score += 5;
     matches.push(`Matches type "${item.type}"`);
  }

  return { score, whyMatched: matches };
}

export interface SearchFilters {
  type?: 'event' | 'movie' | 'offer' | 'venue';
  category?: string;
  familyFriendly?: boolean;
}

export async function searchAssistant(query: string, filters?: SearchFilters): Promise<SearchResult[]> {
  const [events, movies, offers, venues] = await Promise.all([
    getEvents(),
    getMovies(),
    getOffers(),
    getVenues()
  ]);

  let allItems: AssistantItem[] = [...events, ...movies, ...offers, ...venues];

  // Apply Hard Filters
  if (filters?.type) {
    allItems = allItems.filter(item => item.type === filters.type);
  }

  if (filters?.familyFriendly) {
    allItems = allItems.filter(item => 
      'familyFriendly' in item && item.familyFriendly || 
      ('rating' in item && ['G', 'PG'].includes((item as any).rating))
    );
  }
  
  const results: SearchResult[] = allItems
    .map(item => {
      const { score, whyMatched } = calculateScore(item, query);
      return { item, score, whyMatched };
    })
    .filter(result => result.score > 0)
    .sort((a, b) => b.score - a.score);

  return results.slice(0, 5); // Return top 5
}
