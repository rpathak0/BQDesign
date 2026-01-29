import { NextRequest, NextResponse } from "next/server";

/** Dump entry shape (matches aiPromptDump.DumpEntry) */
interface DumpEntry {
  id: string;
  timestamp: string;
  sessionId: string;
  prompt: string;
  response: string;
  memoryBefore?: { location?: string; interest?: string };
  memoryAfter?: { location?: string; interest?: string };
  language: string;
}

interface ExportBody {
  provider: "openai" | "webhook" | "google_vertex";
  apiKey?: string;
  webhookUrl?: string;
  baseUrl?: string;
  entries: DumpEntry[];
}

/** Convert dump entries to OpenAI fine-tuning JSONL (messages format). */
function toOpenAIJsonl(entries: DumpEntry[]): string {
  return entries
    .map((e) =>
      JSON.stringify({
        messages: [
          { role: "user" as const, content: e.prompt },
          { role: "assistant" as const, content: e.response },
        ],
      })
    )
    .join("\n");
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ExportBody;
    const { provider, apiKey, webhookUrl, entries } = body;

    if (!Array.isArray(entries) || entries.length === 0) {
      return NextResponse.json(
        { ok: false, error: "No entries to export" },
        { status: 400 }
      );
    }

    if (provider === "webhook") {
      if (!webhookUrl?.trim()) {
        return NextResponse.json(
          { ok: false, error: "Webhook URL is required" },
          { status: 400 }
        );
      }
      const res = await fetch(webhookUrl.trim(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entries),
      });
      if (!res.ok) {
        const text = await res.text();
        return NextResponse.json(
          { ok: false, error: `Webhook failed: ${res.status} ${text.slice(0, 200)}` },
          { status: 502 }
        );
      }
      return NextResponse.json({ ok: true, message: "Sent to webhook" });
    }

    if (provider === "openai") {
      if (!apiKey?.trim()) {
        return NextResponse.json(
          { ok: false, error: "OpenAI API key is required" },
          { status: 400 }
        );
      }
      const jsonl = toOpenAIJsonl(entries);
      const blob = new Blob([jsonl], { type: "application/jsonl" });
      const formData = new FormData();
      formData.append("file", blob, "bq-ai-training.jsonl");
      formData.append("purpose", "fine-tune");

      const res = await fetch("https://api.openai.com/v1/files", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey.trim()}` },
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        const msg = (err as { error?: { message?: string } })?.error?.message ?? res.statusText;
        return NextResponse.json(
          { ok: false, error: `OpenAI upload failed: ${msg}` },
          { status: 502 }
        );
      }
      const data = (await res.json()) as { id?: string };
      return NextResponse.json({ ok: true, fileId: data.id, message: "Uploaded to OpenAI" });
    }

    if (provider === "google_vertex") {
      // Google Vertex: forward to webhook if provided; otherwise require webhook URL for now.
      if (webhookUrl?.trim()) {
        const res = await fetch(webhookUrl.trim(), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(entries),
        });
        if (!res.ok) {
          const text = await res.text();
          return NextResponse.json(
            { ok: false, error: `Webhook failed: ${res.status} ${text.slice(0, 200)}` },
            { status: 502 }
          );
        }
        return NextResponse.json({ ok: true, message: "Sent to webhook (Vertex)" });
      }
      return NextResponse.json(
        { ok: false, error: "Google Vertex: provide a webhook URL to receive the export" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { ok: false, error: "Unknown provider" },
      { status: 400 }
    );
  } catch (e) {
    console.error("ai-training export:", e);
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "Export failed" },
      { status: 500 }
    );
  }
}
