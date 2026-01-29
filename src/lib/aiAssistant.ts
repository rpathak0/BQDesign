import { processQuery } from "@/ai/tools";
import { getGreetings } from "@/ai/tools";

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
}

export async function getAiAnswer(
  prompt: string, 
  context: { withKids?: boolean; location?: string; language: "en" | "ar" }
): Promise<AiResponse> {
  
  // Greeting check
  if (prompt.toLowerCase().match(/^(hi|hello|hey|greetings)/)) {
     const greeting = await getGreetings();
     return {
        answer: greeting.message,
        recommendations: []
     };
  }

  const { intent, results } = await processQuery(prompt);

  // Construct answer text
  let answerText = "";
  if (results.length === 0) {
    answerText = "I couldn't find anything matching that. Try searching for 'events', 'movies', or 'offers'.";
  } else {
    const topMatch = results[0];
    const count = results.length;
    const title = 'title' in topMatch.item ? topMatch.item.title : topMatch.item.name;
    
    switch (intent.type) {
        case 'DISCOVER_MOVIES':
            answerText = `I found ${count} movies matching your search. "${title}" seems like a great choice based on "${topMatch.whyMatched[0]}".`;
            break;
        case 'DISCOVER_EVENTS':
            answerText = `There are ${count} events coming up. I recommend checking out "${title}"!`;
            break;
        case 'FIND_OFFERS':
             answerText = `I found some great offers for you. Have a look at "${title}"!`;
             break;
        default:
            answerText = `Here are the top results I found for you from our ${topMatch.item.type}s.`;
    }
  }

  // Map to UI format
  const recommendations = results.map(r => ({
    id: r.item.id,
    title: ('title' in r.item ? r.item.title : (r.item as any).name),
    image: r.item.image,
    reason: r.whyMatched[0] || "Best match",
    location: 'location' in r.item ? r.item.location : undefined,
    category: 'category' in r.item ? r.item.category : undefined
  }));

  return {
    answer: answerText,
    recommendations
  };
}
