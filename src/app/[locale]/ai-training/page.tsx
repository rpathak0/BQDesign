"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Save, Upload, Download, Sparkles, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getTrainingConfig,
  setTrainingConfig,
  type AiTrainingConfig,
  type TrainingProvider,
} from "@/lib/aiTrainingConfig";
import { getDump, exportDumpAsJson } from "@/lib/aiPromptDump";

export default function AiTrainingPage() {
  const params = useParams();
  const locale = (params?.locale as string) ?? "en";

  const [config, setConfig] = useState<AiTrainingConfig>(getTrainingConfig());
  const [dumpCount, setDumpCount] = useState(0);
  const [exportStatus, setExportStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [exportMessage, setExportMessage] = useState("");

  useEffect(() => {
    setDumpCount(getDump().length);
  }, []);

  const handleSaveConfig = () => {
    setTrainingConfig(config);
    setExportStatus("idle");
    setExportMessage("Configuration saved.");
  };

  const handleExportNow = async () => {
    const entries = getDump();
    if (entries.length === 0) {
      setExportMessage("No prompts logged yet. Use the AI Assistant first.");
      setExportStatus("error");
      return;
    }

    setExportStatus("loading");
    setExportMessage("");

    try {
      const res = await fetch("/api/ai-training/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: config.provider,
          apiKey: config.apiKey?.trim() || undefined,
          webhookUrl: config.webhookUrl?.trim() || undefined,
          baseUrl: config.baseUrl?.trim() || undefined,
          entries,
        }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setExportStatus("error");
        setExportMessage(data.error ?? `Export failed (${res.status})`);
        return;
      }
      setExportStatus("success");
      setExportMessage(data.message ?? "Export completed.");
    } catch (e) {
      setExportStatus("error");
      setExportMessage(e instanceof Error ? e.message : "Export failed.");
    }
  };

  const handleDownloadJson = () => {
    const json = exportDumpAsJson();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bq-ai-training-dump-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-2xl mx-auto py-8 px-4">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/${locale}`} aria-label="Back">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight">AI Training Integration</h1>
          </div>
        </div>

        <p className="text-muted-foreground mb-6">
          Configure where to send conversation dumps (for fine-tuning or webhooks), then start dumping.
        </p>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings2 className="h-5 w-5" />
              Integration &amp; config
            </CardTitle>
            <CardDescription>
              Choose a destination and credentials. Data is sent when you click &quot;Export now&quot; or when auto-dump is on (webhook only).
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Provider</Label>
              <Select
                value={config.provider}
                onValueChange={(v) => setConfig((c) => ({ ...c, provider: v as TrainingProvider }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="webhook">Webhook (POST JSON to URL)</SelectItem>
                  <SelectItem value="openai">OpenAI (upload file for fine-tuning)</SelectItem>
                  <SelectItem value="google_vertex">Google Vertex (via webhook)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {(config.provider === "openai" || config.provider === "google_vertex") && (
              <div className="space-y-2">
                <Label htmlFor="apiKey">
                  {config.provider === "openai" ? "OpenAI API key" : "API key (optional for webhook)"}
                </Label>
                <Input
                  id="apiKey"
                  type="password"
                  placeholder="sk-..."
                  value={config.apiKey ?? ""}
                  onChange={(e) => setConfig((c) => ({ ...c, apiKey: e.target.value }))}
                  className="font-mono text-sm"
                />
              </div>
            )}

            {(config.provider === "webhook" || config.provider === "google_vertex") && (
              <div className="space-y-2">
                <Label htmlFor="webhookUrl">Webhook URL</Label>
                <Input
                  id="webhookUrl"
                  type="url"
                  placeholder="https://your-server.com/receive-dump"
                  value={config.webhookUrl ?? ""}
                  onChange={(e) => setConfig((c) => ({ ...c, webhookUrl: e.target.value }))}
                />
              </div>
            )}

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="autoDump">Auto-dump (send each new conversation to endpoint)</Label>
                <Switch
                  id="autoDump"
                  checked={config.autoDump}
                  onCheckedChange={(v) => setConfig((c) => ({ ...c, autoDump: v }))}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Only works with Webhook. Each new AI exchange is POSTed to the URL above.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-wrap gap-2">
            <Button onClick={handleSaveConfig}>
              <Save className="h-4 w-4 mr-2" />
              Save config
            </Button>
          </CardFooter>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Start dumping</CardTitle>
            <CardDescription>
              {dumpCount} prompts logged. Export them to the configured destination or download as JSON.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {exportMessage && (
              <p
                className={`text-sm ${
                  exportStatus === "error" ? "text-destructive" : exportStatus === "success" ? "text-green-600 dark:text-green-400" : "text-muted-foreground"
                }`}
              >
                {exportMessage}
              </p>
            )}
            <div className="flex flex-wrap gap-2">
              <Button onClick={handleExportNow} disabled={exportStatus === "loading" || dumpCount === 0}>
                <Upload className="h-4 w-4 mr-2" />
                {exportStatus === "loading" ? "Sending…" : "Export now"}
              </Button>
              <Button variant="outline" onClick={handleDownloadJson} disabled={dumpCount === 0}>
                <Download className="h-4 w-4 mr-2" />
                Download JSON
              </Button>
            </div>
          </CardContent>
        </Card>

        <p className="text-xs text-muted-foreground">
          API keys are stored in this browser only. For production, use server-side environment variables.
        </p>
      </div>
    </div>
  );
}
