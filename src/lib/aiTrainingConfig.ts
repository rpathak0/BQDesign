/**
 * AI Training integration config: provider, API key, webhook, auto-dump.
 * Stored in localStorage (for production, consider server-side env).
 */

const STORAGE_KEY = "bq-ai-training-config";

export type TrainingProvider = "openai" | "webhook" | "google_vertex";

export interface AiTrainingConfig {
  provider: TrainingProvider;
  apiKey?: string;
  webhookUrl?: string;
  baseUrl?: string;
  /** When true, each new AI exchange is also sent to the configured endpoint (webhook only from client). */
  autoDump: boolean;
}

const defaultConfig: AiTrainingConfig = {
  provider: "webhook",
  autoDump: false,
};

export function getTrainingConfig(): AiTrainingConfig {
  if (typeof window === "undefined") return defaultConfig;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultConfig;
    const parsed = JSON.parse(raw) as Partial<AiTrainingConfig>;
    return {
      provider: parsed.provider ?? defaultConfig.provider,
      apiKey: parsed.apiKey,
      webhookUrl: parsed.webhookUrl,
      baseUrl: parsed.baseUrl,
      autoDump: parsed.autoDump ?? defaultConfig.autoDump,
    };
  } catch {
    return defaultConfig;
  }
}

export function setTrainingConfig(config: AiTrainingConfig): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (e) {
    console.warn("aiTrainingConfig: save failed", e);
  }
}

/** Check if we should auto-send each new exchange (client-side: only webhook is supported). */
export function shouldAutoSendToEndpoint(): { ok: boolean; url?: string } {
  const c = getTrainingConfig();
  if (!c.autoDump || !c.webhookUrl?.trim()) return { ok: false };
  if (c.provider !== "webhook") return { ok: false };
  try {
    new URL(c.webhookUrl);
    return { ok: true, url: c.webhookUrl.trim() };
  } catch {
    return { ok: false };
  }
}
