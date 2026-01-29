export type IntentType = 
  | 'DISCOVER_EVENTS' 
  | 'DISCOVER_MOVIES' 
  | 'FIND_OFFERS' 
  | 'FIND_VENUES' 
  | 'GENERAL_SEARCH'
  | 'GREETING';

export interface Intent {
  type: IntentType;
  entities: {
    category?: string;
    location?: string;
    date?: string;
    familyFriendly?: boolean;
    query: string;
  };
}

export function detectIntent(query: string): Intent {
  const q = query.toLowerCase();
  
  // Basic heuristic detection
  if (q.includes('hello') || q.includes('hi ') || q === 'hi') {
    return { type: 'GREETING', entities: { query } };
  }

  if (q.includes('movie') || q.includes('cinema') || q.includes('film')) {
    return { type: 'DISCOVER_MOVIES', entities: { query } };
  }

  if (q.includes('offer') || q.includes('deal') || q.includes('discount')) {
    return { type: 'FIND_OFFERS', entities: { query } };
  }

  if (q.includes('venue') || q.includes('location') || q.includes('place')) {
    return { type: 'FIND_VENUES', entities: { query } };
  }

  if (q.includes('event') || q.includes('concert') || q.includes('show') || q.includes('do')) {
    return { type: 'DISCOVER_EVENTS', entities: { query } };
  }

  return { type: 'GENERAL_SEARCH', entities: { query } };
}
