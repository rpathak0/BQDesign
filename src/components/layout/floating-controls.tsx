"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowUp, Sparkles, Send, X, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { getAiAnswer, AiResponse } from "@/lib/aiAssistant";
import { useLanguage } from "@/contexts/language-context";
import { SafeImage } from "@/components/shared/safe-image";

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
  const { t, language } = useLanguage();
  
  // AI Chat State
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: t("Ask me anything") }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

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
      const response = await getAiAnswer(text, { language });
      
      const aiMsg: Message = { 
        role: "assistant", 
        content: response.answer,
        recommendations: response.recommendations
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: "assistant", content: "Sorry, I couldn't process that request." }]);
    } finally {
      setIsLoading(false);
    }
  };

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

      {/* AI Assistant Window */}
      <div className={cn(
        "bg-card/95 backdrop-blur-xl border border-primary/20 rounded-2xl shadow-2xl w-[90vw] md:w-[350px] overflow-hidden transition-all duration-300 mb-2 absolute bottom-16 pointer-events-auto flex flex-col",
        language === "ar" ? "left-0 origin-bottom-left" : "right-0 origin-bottom-right",
        isAiOpen ? "opacity-100 scale-100 h-[500px]" : "opacity-0 scale-95 pointer-events-none h-0"
      )}>
         {/* Chat Header */}
        <div className={cn("p-4 bg-primary/10 border-b border-primary/10 flex items-center justify-between", language === "ar" ? "flex-row-reverse" : "")}>
            <div className={cn("flex items-center gap-3", language === "ar" ? "flex-row-reverse" : "")}>
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
                    <Sparkles className="w-4 h-4 text-primary" />
                </div>
                <div className={cn("text-start", language === "ar" ? "text-right" : "text-left")}>
                    <h4 className="font-bold text-sm">{t("AI Assistant")}</h4>
                    <p className="text-xs text-muted-foreground">{t("Ask me anything")}</p>
                </div>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-white/10" onClick={handleClose}>
                <X className="w-4 h-4" />
            </Button>
        </div>

         {/* Chat Body */}
         <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-4 min-h-0">
            {messages.map((msg, i) => (
                <div key={i} className={cn("flex gap-3", msg.role === "user" ? "justify-end" : "justify-start")}>
                    {msg.role === "assistant" && (
                        <div className="w-8 h-8 rounded-full bg-primary/20 shrink-0 flex items-center justify-center self-start mt-1">
                            <Bot className="w-4 h-4 text-primary" />
                        </div>
                    )}
                    <div className={cn(
                        "max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed",
                        msg.role === "user" 
                            ? "bg-primary text-primary-foreground rounded-tr-none" 
                            : "bg-white/5 rounded-tl-none"
                    )}>
                        {msg.content}
                        
                        {/* Recommendations Grid */}
                        {msg.recommendations && msg.recommendations.length > 0 && (
                            <div className="mt-3 space-y-2">
                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{t("Suggested")}</p>
                                <div className="grid grid-cols-1 gap-2">
                                    {msg.recommendations.map(rec => (
                                        <div key={rec.id} className="flex items-center gap-3 bg-black/20 p-2 rounded-lg hover:bg-black/30 transition-colors cursor-pointer group">
                                            <div className="w-12 h-12 rounded-md overflow-hidden shrink-0">
                                                <SafeImage src={rec.image} alt={rec.title} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h5 className="font-bold text-xs truncate group-hover:text-primary transition-colors">{rec.title}</h5>
                                                <p className="text-[10px] text-muted-foreground truncate">{rec.reason}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    {msg.role === "user" && (
                        <div className="w-8 h-8 rounded-full bg-white/10 shrink-0 flex items-center justify-center self-start mt-1">
                            <User className="w-4 h-4 text-white" />
                        </div>
                    )}
                </div>
            ))}
            {isLoading && (
                 <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 shrink-0 flex items-center justify-center self-start mt-1">
                        <Bot className="w-4 h-4 text-primary" />
                    </div>
                    <div className="bg-white/5 p-3 rounded-2xl rounded-tl-none text-sm leading-relaxed flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                        <span className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                        <span className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce"></span>
                    </div>
                </div>
            )}
        </div>

        {/* Chat Footer */}
        <div className="p-3 border-t border-white/5 bg-black/20 shrink-0">
            <form className="relative" onSubmit={(e) => { e.preventDefault(); handleSendMessage(inputValue); }}>
                <Input 
                    placeholder={t("Type a message...")}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className={cn(
                        "bg-black/20 border-white/10 focus-visible:ring-primary/50",
                        language === "ar" ? "pl-10 text-right" : "pr-10"
                    )}
                    dir={language === "ar" ? "rtl" : "ltr"}
                />
                <Button 
                    type="submit" 
                    size="icon" 
                    variant="ghost" 
                    className={cn(
                        "absolute top-1 h-8 w-8 text-primary hover:text-primary/80",
                        language === "ar" ? "left-1" : "right-1"
                    )}
                    disabled={isLoading || !inputValue.trim()}
                >
                    <Send className="w-4 h-4" />
                </Button>
            </form>
        </div>
      </div>
    </div>
  );
}


