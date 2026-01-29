import { AssistantItem } from "./types";

export interface AssistantResponse {
  answerText: string;
  suggestedCards: AssistantItem[];
  citations: string[];
  followUps: string[];
}

export const EMPTY_RESPONSE: AssistantResponse = {
  answerText: "I couldn't find anything matching that. Try searching for 'events', 'movies', or 'offers'.",
  suggestedCards: [],
  citations: [],
  followUps: ["Show me movies", "Events this weekend"]
};
