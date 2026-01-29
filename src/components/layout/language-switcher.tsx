"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/language-context";

export function LanguageSwitcher() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={toggleLanguage}
      className={cn(
        "rounded-full border-white/10 bg-white/5 hover:bg-white/10 text-xs font-medium px-3 h-8 gap-1",
        "text-white/90 hover:text-white"
      )}
    >
      <span className={cn(language === "en" ? "text-white" : "text-white/50")}>ENG</span>
      <span className="text-white/30">/</span>
      <span className={cn("font-arabic", language === "ar" ? "text-white" : "text-white/50")}>العربية</span>
    </Button>
  );
}

