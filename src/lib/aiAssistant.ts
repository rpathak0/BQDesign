import { processQuery } from "@/ai/tools";
import { getGreetings } from "@/ai/tools";
import { getCuratedSuggestions } from "@/ai/retrieval";

export interface AiResponse {
  answer: string;
  recommendations: Array<{
    id: string;
    title: string;
    image: string;
    reason: string;
    location?: string;
    category?: string;
  }>;
  /** For client to persist: updated location/interest from this turn */
  memoryUpdate?: { location?: string; interest?: string };
}

export type AiContext = {
  language: "en" | "ar";
  memory?: { location?: string; interest?: string };
};

export async function getAiAnswer(prompt: string, context: AiContext): Promise<AiResponse> {
  const { memory } = context;

  if (prompt.toLowerCase().match(/^(hi|hello|hey|greetings)/)) {
    const greeting = await getGreetings();
    return { answer: greeting.message, recommendations: [] };
  }

  const { intent, results } = await processQuery(prompt);

  // Build memory update from this turn (so client can persist)
  const memoryUpdate: AiResponse["memoryUpdate"] = {};
  if (intent.entities.location) memoryUpdate.location = intent.entities.location;
  if (intent.entities.interest) memoryUpdate.interest = intent.entities.interest;

  const interest = memoryUpdate.interest ?? memory?.interest ?? intent.entities.interest;
  const location = memoryUpdate.location ?? memory?.location ?? intent.entities.location;
  const remembered = interest || location;

  let answerText: string;
  let sourceResults = results;

  if (results.length === 0) {
    sourceResults = await getCuratedSuggestions(5);
    if (remembered) {
      answerText = `I've noted you're interested in ${interest || location}. Here are some popular options we think you'll like—events, movies, and offers you can explore.`;
    } else {
      answerText = "Here are some recommendations we think you'll like. You can also ask for 'events', 'movies', or 'offers' in a specific area.";
    }
  } else {
    const topMatch = results[0];
    const count = results.length;
    const title = "title" in topMatch.item ? topMatch.item.title : (topMatch.item as { name: string }).name;

    switch (intent.type) {
      case "DISCOVER_MOVIES":
        answerText = `I found ${count} movies matching your search. "${title}" seems like a great choice based on "${topMatch.whyMatched[0]}".`;
        break;
      case "DISCOVER_EVENTS":
        answerText = `There are ${count} events coming up. I recommend checking out "${title}"!`;
        break;
      case "FIND_OFFERS":
        answerText = `I found some great offers for you. Have a look at "${title}"!`;
        break;
      default:
        answerText = `Here are the top results I found for you from our ${topMatch.item.type}s.`;
    }
  }

  const recommendations = sourceResults.map((r) => ({
    id: r.item.id,
    title: "title" in r.item ? r.item.title : (r.item as { name: string }).name,
    image: r.item.image,
    reason: r.whyMatched[0] || "Recommended for you",
    location: "location" in r.item ? r.item.location : undefined,
    category: "category" in r.item ? r.item.category : undefined,
  }));

  return {
    answer: answerText,
    recommendations,
    ...(Object.keys(memoryUpdate).length > 0 ? { memoryUpdate } : {}),
  };
}
