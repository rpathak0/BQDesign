import { detectIntent, Intent } from "./intent";
import { searchAssistant, SearchFilters } from "./retrieval";
import { SearchResult } from "./types";

export async function processQuery(query: string): Promise<{ intent: Intent, results: SearchResult[] }> {
  const intent = detectIntent(query);
  
  const filters: SearchFilters = {};
  
  switch (intent.type) {
    case 'DISCOVER_EVENTS':
      filters.type = 'event';
      break;
    case 'DISCOVER_MOVIES':
      filters.type = 'movie';
      break;
    case 'FIND_OFFERS':
      filters.type = 'offer';
      break;
    case 'FIND_VENUES':
      filters.type = 'venue';
      break;
  }

  if (query.toLowerCase().includes('kids') || query.toLowerCase().includes('family')) {
    filters.familyFriendly = true;
  }

  const results = await searchAssistant(query, filters);
  
  return { intent, results };
}

export async function getGreetings() {
  return {
    message: "Hello! I'm your BookingQube assistant. I can help you find events, movies, offers, and venues. What are you looking for today?",
    suggestions: ["Best movies this week", "Family events", "Offers in Dubai"]
  };
}
