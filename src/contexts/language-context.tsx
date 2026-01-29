"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Language = "en" | "ar";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  dir: "ltr" | "rtl";
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    const saved = localStorage.getItem("bookingqube-lang") as Language;
    if (saved && (saved === "en" || saved === "ar")) {
      setLanguage(saved);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("bookingqube-lang", language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === "en" ? "ar" : "en");
  };

  const dictionary: Record<string, Record<Language, string>> = {
    "Ask AI": { en: "Ask AI", ar: "اسأل الذكاء الاصطناعي" },
    "Suggested": { en: "Suggested", ar: "مقترح" },
    "Results": { en: "Results", ar: "النتائج" },
    "Close": { en: "Close", ar: "إغلاق" },
    "Where can I take my kids this weekend?": { 
      en: "Where can I take my kids this weekend?", 
      ar: "أين يمكنني اصطحاب أطفالي في عطلة نهاية الأسبوع؟" 
    },
    "Type a message...": { en: "Type a message...", ar: "اكتب رسالة..." },
    "AI Assistant": { en: "AI Assistant", ar: "المساعد الذكي" },
    "Ask me anything": { en: "Ask me anything", ar: "اسألني أي شيء" },
    "dubai": { en: "Dubai", ar: "دبي" },
    "login": { en: "Login", ar: "تسجيل الدخول" }
  };

  const t = (key: string) => {
    return dictionary[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, dir: language === "ar" ? "rtl" : "ltr", t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within a LanguageProvider");
  return context;
};
