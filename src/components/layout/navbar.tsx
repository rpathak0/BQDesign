"use client";

import Link from "next/link";
import { Search, MapPin, Menu, ChevronRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { SearchOverlay } from "@/components/search-overlay";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { useTranslations } from "next-intl";
import { useLanguage } from "@/contexts/language-context";

import { SafeImage } from "@/components/shared/safe-image";

export function Navbar({ onAiClick }: { onAiClick?: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const t_intl = useTranslations('Navbar'); // Keep original for now to avoid breaking
  const { t } = useLanguage(); // Use our context for specific overrides
  const showLoyalty = process.env.NEXT_PUBLIC_FEATURE_LOYALTY === 'true';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 hidden md:block",
          scrolled 
            ? "bg-black/80 backdrop-blur-xl border-b border-white/10 py-2" 
            : "bg-transparent border-transparent py-4"
        )}
      >
        <div className="px-6 flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
                <SafeImage 
                  src="/assets/hero-bg.png" 
                  alt="BookingQube" 
                  className="h-10 w-auto object-contain brightness-0 invert dark:brightness-100 dark:invert-0 transition-all"
                />
            </Link>

            {showLoyalty && (
               <Link href="/loyalty" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                  Loyalty Program
               </Link>
            )}
          </div>

          <div className="flex-1" />

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* Search Trigger - white in light mode for visibility on dark header */}
            <Button 
                variant="ghost" 
                size="icon" 
                className="hidden md:flex rounded-full w-10 h-10 text-white hover:text-white/90 hover:bg-white/10 dark:text-foreground dark:hover:bg-white/10 dark:hover:text-foreground"
                onClick={() => setSearchOpen(true)}
            >
                <Search className="w-5 h-5" />
            </Button>

            <Button variant="ghost" size="sm" className="hidden lg:flex gap-2 text-white hover:text-white/90 hover:bg-white/10 dark:text-foreground/80 dark:hover:text-foreground dark:hover:bg-white/10 rounded-full">
              <MapPin className="w-4 h-4" />
              <span>{t('dubai')}</span>
            </Button>
            
            <div className="h-6 w-px bg-border/50 hidden lg:block" />
            
            <ThemeToggle />
            <LanguageSwitcher />
            
            <Button className="rounded-full px-6 hidden sm:flex bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25">
              {t('login')}
            </Button>
            
            <Button variant="ghost" size="icon" className="sm:hidden">
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </nav>

      <SearchOverlay open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
