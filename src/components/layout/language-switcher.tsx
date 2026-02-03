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
        "rounded-full text-xs font-medium px-3 h-8 gap-1",
        "border-current/20 bg-current/5 hover:bg-current/10 text-current",
        "opacity-90 hover:opacity-100"
      )}
    >
      <span className={cn(language === "en" ? "opacity-100" : "opacity-50")}>ENG</span>
      <span className="opacity-30">/</span>
      <span className={cn("font-arabic", language === "ar" ? "opacity-100" : "opacity-50")}>العربية</span>
    </Button>
  );
}

