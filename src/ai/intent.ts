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
    interest?: string;
    date?: string;
    familyFriendly?: boolean;
    query: string;
  };
}

// Extract location/place from phrases like "go to downtown", "in Dubai", "near the mall"
const LOCATION_PATTERNS = [
  /\b(?:go to|in|near|around|at)\s+([a-z\u0600-\u06FF\s]+?)(?:\s+what|\s+will|\.|$)/i,
  /\b(downtown|city\s+center|mall|beach|dubai|doha|qatar|abu\s+dhabi|yas\s+island|city\s+walk)\b/i,
  /\b(?:best\s+for\s+me|something\s+for\s+me)\s+(?:in|at|near)\s+([a-z\u0600-\u06FF\s]+)/i,
];

function extractLocationOrInterest(query: string): { location?: string; interest?: string } {
  const q = query.trim();
  const out: { location?: string; interest?: string } = {};

  for (const re of LOCATION_PATTERNS) {
    const m = q.match(re);
    if (m && m[1] != null) {
      const value = String(m[1]).trim();
      if (value.length > 1 && value.length < 50) {
        out.location = value;
        out.interest = value;
        break;
      }
    }
  }
  // Fallback: "want to go to X" or "looking for X"
  const wantMatch = q.match(/(?:want to go to|looking for|interested in|best for me)\s+([a-z\u0600-\u06FF\s]+?)(?:\s+what|\s+will|\.|$)/i);
  if (wantMatch && wantMatch[1] != null) {
    const value = String(wantMatch[1]).trim();
    if (value.length > 1) {
      out.interest = value;
      if (!out.location) out.location = value;
    }
  }

  return out;
}

export function detectIntent(query: string): Intent {
  const q = query.toLowerCase();
  const { location, interest } = extractLocationOrInterest(query);
  const entities = { query, ...(location && { location }), ...(interest && { interest }) };

  if (q.match(/^(hello|hi|hey|greetings)/)) {
    return { type: 'GREETING', entities: { query } };
  }

  if (q.includes('movie') || q.includes('cinema') || q.includes('film')) {
    return { type: 'DISCOVER_MOVIES', entities: { ...entities, query } };
  }

  if (q.includes('offer') || q.includes('deal') || q.includes('discount')) {
    return { type: 'FIND_OFFERS', entities: { ...entities, query } };
  }

  if (q.includes('venue') || q.includes('location') || q.includes('place')) {
    return { type: 'FIND_VENUES', entities: { ...entities, query } };
  }

  if (q.includes('event') || q.includes('concert') || q.includes('show') || q.includes(' do ')) {
    return { type: 'DISCOVER_EVENTS', entities: { ...entities, query } };
  }

  return { type: 'GENERAL_SEARCH', entities: { ...entities, query } };
}
