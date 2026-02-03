"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowUp, Sparkles, Send, X, Bot, User, Download, Trash2, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { getAiAnswer, AiResponse } from "@/lib/aiAssistant";
import { useLanguage } from "@/contexts/language-context";
import { SafeImage } from "@/components/shared/safe-image";
import {
  logExchange,
  getOrCreateSessionId,
  getDump,
  exportDumpAsJson,
  clearDump,
} from "@/lib/aiPromptDump";
import { shouldAutoSendToEndpoint } from "@/lib/aiTrainingConfig";
import Link from "next/link";
import { useParams } from "next/navigation";

interface Message {
  role: "user" | "assistant";
  content: string;
  recommendations?: AiResponse["recommendations"];
}

export function FloatingControls({ 
  isOpen, 
  onClose,
  onOpen 
}: { 
  isOpen?: boolean; 
  onClose?: () => void; 
  onOpen?: () => void;
}) {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const params = useParams();
  const locale = (params?.locale as string) ?? "en";
  const { t, language } = useLanguage();

  // AI Chat State
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: t("Ask me anything") }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const MEMORY_STORAGE_KEY = "bq-ai-memory";

  // Session memory: persisted so the AI remembers across visits (memory agent)
  const [sessionMemory, setSessionMemory] = useState<{ location?: string; interest?: string }>(() => {
    if (typeof window === "undefined") return {};
    try {
      const raw = localStorage.getItem(MEMORY_STORAGE_KEY);
      if (!raw) return {};
      const parsed = JSON.parse(raw) as { location?: string; interest?: string };
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch {
      return {};
    }
  });

  const sessionId = getOrCreateSessionId();

  const isAiOpen = isOpen !== undefined ? isOpen : internalIsOpen;
  const handleClose = onClose || (() => setInternalIsOpen(false));
  const handleOpen = onOpen || (() => setInternalIsOpen(true));

  // Scroll to bottom of chat
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isAiOpen]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleActivateAi = (prompt?: string) => {
    if (isOpen !== undefined) {
        if (!isOpen && handleOpen) handleOpen();
    } else {
        if (!internalIsOpen) setInternalIsOpen(true);
    }

    if (prompt) {
        handleSendMessage(prompt);
    }
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    // Add user message
    const userMsg: Message = { role: "user", content: text };
    setMessages(prev => [...prev, userMsg]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await getAiAnswer(text, { language, memory: sessionMemory });

      const memoryAfter =
        response.memoryUpdate && Object.keys(response.memoryUpdate).length > 0
          ? { ...sessionMemory, ...response.memoryUpdate }
          : sessionMemory;

      if (response.memoryUpdate && Object.keys(response.memoryUpdate).length > 0) {
        setSessionMemory((prev) => {
          const next = { ...prev, ...response.memoryUpdate };
          try {
            localStorage.setItem(MEMORY_STORAGE_KEY, JSON.stringify(next));
          } catch {}
          return next;
        });
      }

      logExchange({
        prompt: text.trim(),
        response: response.answer,
        sessionId,
        language,
        memoryBefore: sessionMemory,
        memoryAfter,
      });

      const autoSend = shouldAutoSendToEndpoint();
      if (autoSend.ok && autoSend.url) {
        const entry = {
          id: `bq-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
          timestamp: new Date().toISOString(),
          sessionId,
          prompt: text.trim(),
          response: response.answer,
          language,
          ...(Object.keys(sessionMemory).length > 0 && { memoryBefore: sessionMemory }),
          ...(Object.keys(memoryAfter).length > 0 && { memoryAfter }),
        };
        fetch(autoSend.url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify([entry]),
        }).catch(() => {});
      }

      const aiMsg: Message = {
        role: "assistant",
        content: response.answer,
        recommendations: response.recommendations,
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: "assistant", content: "Sorry, I couldn't process that request." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportTrainingData = () => {
    const json = exportDumpAsJson();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bq-ai-training-dump-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClearTrainingDump = () => {
    if (typeof window !== "undefined" && window.confirm("Clear all logged prompts? This cannot be undone.")) {
      clearDump();
      setDumpCount(0);
    }
  };

  // Avoid hydration mismatch: server has no localStorage, so render 0 until mounted
  const [dumpCount, setDumpCount] = useState(0);
  useEffect(() => {
    setDumpCount(getDump().length);
  }, [messages]);

  return (
    <div className={cn("fixed bottom-6 right-6 z-50 flex flex-col gap-3 items-end pointer-events-none", language === "ar" ? "left-6 right-auto items-start" : "")}>
      
      {/* Floating Action Row: AI Stub + Scroll To Top */}
      <div className={cn(
        "flex items-center gap-3 transition-all duration-300 pointer-events-auto",
        showScrollTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none",
        language === "ar" ? "flex-row-reverse" : ""
      )}>
        
        {/* Floating AI Search Stub (Mini version) */}
        {!isAiOpen && (
             <div 
                onClick={() => handleActivateAi("Where can I take my kids this weekend?")}
                className="relative group cursor-pointer hidden lg:block"
                role="button"
                tabIndex={0}
            >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 rounded-full opacity-40 group-hover:opacity-75 blur-md transition duration-500" />
                <div className={cn(
                    "relative flex items-center bg-[#0F0F1A] rounded-full p-2 pl-4 pr-2 shadow-2xl border border-white/10 group-active:scale-[0.99] transition-transform h-12 w-[320px]",
                    language === "ar" ? "pr-4 pl-2 flex-row-reverse" : ""
                )}>
                    <Sparkles className={cn("w-4 h-4 text-[#ffdd00] animate-pulse shrink-0", language === "ar" ? "ml-3" : "mr-3")} />
                    <div className="flex-1 flex flex-col justify-center overflow-hidden">
                        <span className="text-[9px] font-bold text-primary uppercase tracking-wider leading-tight">{t("Ask AI")}</span>
                        <span className="text-white text-xs truncate leading-tight opacity-90">{t("Where can I take my kids this weekend?")}</span>
                    </div>
                    <div className={cn("rounded-full h-8 px-4 shrink-0 bg-white text-black hover:bg-white/90 font-bold text-xs transition-all flex items-center justify-center", language === "ar" ? "mr-2" : "ml-2")}>
                        {t("Ask AI")}
                    </div>
                </div>
            </div>
        )}

        {/* Scroll To Top - Desktop Only */}
        <div className="hidden md:block">
            <Button
            size="icon"
            className="rounded-full w-10 h-10 shadow-lg bg-black/40 backdrop-blur-md border border-white/10 hover:bg-primary hover:border-primary transition-all duration-300"
            onClick={scrollToTop}
            >
            <ArrowUp className="w-4 h-4" />
            </Button>
        </div>
      </div>

      {/* AI Assistant Window - live, attractive panel */}
      <div className={cn(
        "relative bg-gradient-to-b from-[#0F0F1A] to-[#0a0a12] backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl w-[90vw] md:w-[380px] overflow-hidden transition-all duration-500 ease-out mb-2 absolute bottom-16 pointer-events-auto flex flex-col",
        "ring-2 ring-primary/20 shadow-[0_0_40px_rgba(124,58,237,0.15)]",
        language === "ar" ? "left-0 origin-bottom-left" : "right-0 origin-bottom-right",
        isAiOpen ? "opacity-100 scale-100 h-[520px] translate-y-0" : "opacity-0 scale-95 translate-y-2 pointer-events-none h-0"
      )}>
        {/* Subtle gradient glow behind header */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none rounded-2xl" />

         {/* Chat Header - gradient, live indicator */}
        <div className={cn(
          "relative p-4 bg-gradient-to-r from-primary/15 via-primary/10 to-transparent border-b border-white/10 flex items-center justify-between",
          language === "ar" ? "flex-row-reverse" : ""
        )}>
            <div className={cn("flex items-center gap-3", language === "ar" ? "flex-row-reverse" : "")}>
                <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-primary/40 blur-md animate-pulse" />
                    <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center border border-white/20 shadow-lg">
                        <Sparkles className="w-5 h-5 text-white drop-shadow-sm" />
                    </div>
                    <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#0F0F1A] animate-pulse" title="Live" />
                </div>
                <div className={cn("text-start", language === "ar" ? "text-right" : "text-left")}>
                    <h4 className="font-bold text-sm text-white tracking-tight">{t("AI Assistant")}</h4>
                    <p className="text-xs text-white/60">{t("Ask me anything")}</p>
                </div>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors" onClick={handleClose}>
                <X className="w-4 h-4" />
            </Button>
        </div>

         {/* Chat Body */}
         <div ref={scrollRef} className="relative flex-1 p-4 overflow-y-auto space-y-4 min-h-0 scroll-smooth">
            {messages.map((msg, i) => (
                <div
                    key={i}
                    className={cn(
                        "flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300",
                        msg.role === "user" ? "justify-end" : "justify-start"
                    )}
                    style={{ animationDelay: `${i * 30}ms` }}
                >
                    {msg.role === "assistant" && (
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 border border-white/10 shrink-0 flex items-center justify-center self-start mt-1 flex-shrink-0">
                            <Bot className="w-4 h-4 text-primary" />
                        </div>
                    )}
                    <div className={cn(
                        "max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-lg",
                        msg.role === "user"
                            ? "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-tr-sm rounded-bl-2xl"
                            : "bg-white/5 border border-white/5 rounded-tl-sm rounded-br-2xl text-white/95"
                    )}>
                        {msg.content}

                        {/* Recommendations Grid - attractive cards */}
                        {msg.recommendations && msg.recommendations.length > 0 && (
                            <div className="mt-4 space-y-2">
                                <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-2">{t("Suggested")}</p>
                                <div className="grid grid-cols-1 gap-2.5">
                                    {msg.recommendations.map((rec, idx) => (
                                        <div
                                            key={rec.id}
                                            className="flex items-center gap-3 bg-white/5 border border-white/10 p-2.5 rounded-xl hover:bg-white/10 hover:border-primary/30 transition-all duration-300 cursor-pointer group hover:shadow-lg hover:shadow-primary/10"
                                            style={{ animationDelay: `${idx * 80}ms` }}
                                        >
                                            <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 ring-1 ring-white/10 group-hover:ring-primary/30 transition-all">
                                                <SafeImage src={rec.image} alt={rec.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h5 className="font-bold text-xs text-white truncate group-hover:text-primary transition-colors">{rec.title}</h5>
                                                <p className="text-[10px] text-white/50 truncate mt-0.5">{rec.reason}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    {msg.role === "user" && (
                        <div className="w-9 h-9 rounded-full bg-white/10 border border-white/10 shrink-0 flex items-center justify-center self-start mt-1">
                            <User className="w-4 h-4 text-white" />
                        </div>
                    )}
                </div>
            ))}
            {isLoading && (
                 <div className="flex gap-3 animate-in fade-in duration-200">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 border border-white/10 shrink-0 flex items-center justify-center self-start mt-1">
                        <Bot className="w-4 h-4 text-primary animate-pulse" />
                    </div>
                    <div className="bg-white/5 border border-white/5 p-3.5 rounded-2xl rounded-tl-sm text-sm leading-relaxed flex items-center gap-2">
                        <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
                        <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
                        <span className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                        <span className="text-xs text-white/50 ml-1">Thinking...</span>
                    </div>
                </div>
            )}
        </div>

        {/* Chat Footer - polished input + training dump */}
        <div className="p-3 border-t border-white/10 bg-black/30 shrink-0 space-y-2">
            <form className="relative group" onSubmit={(e) => { e.preventDefault(); handleSendMessage(inputValue); }}>
                <Input
                    placeholder={t("Type a message...")}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className={cn(
                        "h-11 bg-white/5 border-white/10 focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:border-primary/30 rounded-xl text-white placeholder:text-white/40 transition-all",
                        language === "ar" ? "pl-12 text-right" : "pr-12"
                    )}
                    dir={language === "ar" ? "rtl" : "ltr"}
                />
                <Button
                    type="submit"
                    size="icon"
                    className={cn(
                        "absolute top-1/2 -translate-y-1/2 h-9 w-9 rounded-lg bg-white dark:bg-card text-primary border-2 border-primary hover:bg-primary/5 shadow-md transition-all disabled:opacity-50",
                        language === "ar" ? "left-1" : "right-1"
                    )}
                    disabled={isLoading || !inputValue.trim()}
                >
                    <Send className="w-4 h-4" />
                </Button>
            </form>
            <div className={cn("flex items-center justify-between gap-2 text-[10px] text-white/40", language === "ar" ? "flex-row-reverse" : "")}>
                <span title="Logged prompts for training">{dumpCount} prompts logged</span>
                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-white/50 hover:text-white hover:bg-white/10 rounded text-[10px]"
                        asChild
                    >
                        <Link href={`/${locale}/ai-training`}>
                            <Settings2 className="w-3 h-3 mr-1" />
                            Training settings
                        </Link>
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-white/50 hover:text-white hover:bg-white/10 rounded text-[10px]"
                        onClick={handleExportTrainingData}
                    >
                        <Download className="w-3 h-3 mr-1" />
                        Export for training
                    </Button>
                    {dumpCount > 0 && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 text-white/40 hover:text-red-400 hover:bg-white/5 rounded text-[10px]"
                            onClick={handleClearTrainingDump}
                        >
                            <Trash2 className="w-3 h-3" />
                        </Button>
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}


