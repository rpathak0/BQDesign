/**
 * Dump module: log all AI assistant prompts and responses for training.
 * Stored in localStorage so data persists across sessions.
 */

const STORAGE_KEY = "bq-ai-training-dump";
const MAX_ENTRIES = 500;

export interface DumpEntry {
  id: string;
  timestamp: string;
  sessionId: string;
  prompt: string;
  response: string;
  memoryBefore?: { location?: string; interest?: string };
  memoryAfter?: { location?: string; interest?: string };
  language: string;
}

function getStoredDump(): DumpEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as DumpEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveDump(entries: DumpEntry[]) {
  if (typeof window === "undefined") return;
  try {
    const trimmed = entries.slice(-MAX_ENTRIES);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch (e) {
    console.warn("aiPromptDump: save failed", e);
  }
}

/** Log one user–AI exchange for training dump */
export function logExchange(params: {
  prompt: string;
  response: string;
  sessionId: string;
  language: string;
  memoryBefore?: { location?: string; interest?: string };
  memoryAfter?: { location?: string; interest?: string };
}): void {
  const entries = getStoredDump();
  const entry: DumpEntry = {
    id: `bq-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    timestamp: new Date().toISOString(),
    sessionId: params.sessionId,
    prompt: params.prompt,
    response: params.response,
    language: params.language,
    ...(params.memoryBefore && Object.keys(params.memoryBefore).length > 0 && { memoryBefore: params.memoryBefore }),
    ...(params.memoryAfter && Object.keys(params.memoryAfter).length > 0 && { memoryAfter: params.memoryAfter }),
  };
  entries.push(entry);
  saveDump(entries);
}

/** Get all logged entries (for export) */
export function getDump(): DumpEntry[] {
  return getStoredDump();
}

/** Return dump as JSON string for download */
export function exportDumpAsJson(): string {
  const entries = getStoredDump();
  return JSON.stringify(entries, null, 2);
}

/** Return dump as plain text (prompt per line, for simple training) */
export function exportDumpAsText(): string {
  const entries = getStoredDump();
  return entries
    .map((e) => `PROMPT: ${e.prompt}\nRESPONSE: ${e.response}\n---`)
    .join("\n");
}

/** Clear all stored dump entries */
export function clearDump(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.warn("aiPromptDump: clear failed", e);
  }
}

/** Get or create a persistent session ID for this visitor (localStorage) */
export function getOrCreateSessionId(): string {
  const KEY = "bq-ai-session-id";
  if (typeof window === "undefined") return "unknown";
  try {
    let id = localStorage.getItem(KEY);
    if (!id) {
      id = `sess-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
      localStorage.setItem(KEY, id);
    }
    return id;
  } catch {
    return "unknown";
  }
}
