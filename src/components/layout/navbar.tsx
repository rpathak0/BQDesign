"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, MapPin, Menu, User, Ticket, Settings, LogOut, Heart, Wallet, MessageCircle, Briefcase, PlusCircle, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { SearchOverlay } from "@/components/search-overlay";
import { useState, useEffect } from "react";
import { useParams, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { useTranslations } from "next-intl";
import { useLanguage } from "@/contexts/language-context";
import { useTheme } from "@/components/theme-provider";
import { SafeImage } from "@/components/shared/safe-image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type NavbarVariant = "default" | "light";

export function Navbar({ onAiClick, variant = "default" }: { onAiClick?: () => void; variant?: NavbarVariant }) {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const locale = (params?.locale as string) ?? "en";
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");
  const t_intl = useTranslations('Navbar'); // Keep original for now to avoid breaking
  const { t } = useLanguage(); // Use our context for specific overrides
  const showLoyalty = process.env.NEXT_PUBLIC_FEATURE_LOYALTY === 'true';
  const isLightVariant = variant === "light";
  const { theme } = useTheme();
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const root = typeof document !== "undefined" ? document.documentElement : null;
    setIsDark(root?.classList.contains("dark") ?? false);
    if (!root) return;
    const obs = new MutationObserver(() => setIsDark(root.classList.contains("dark")));
    obs.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, [theme]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const loggedIn = localStorage.getItem("bq_logged_in") === "true";
    setIsLoggedIn(loggedIn);
    if (loggedIn) {
      setUserName(localStorage.getItem("bq_user_name") || localStorage.getItem("bq_user_email") || "User");
      setUserEmail(localStorage.getItem("bq_user_email") || "");
    } else {
      setUserName("");
      setUserEmail("");
    }
  }, [pathname]);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("bq_logged_in");
      localStorage.removeItem("bq_user_email");
      localStorage.removeItem("bq_user_name");
    }
    setIsLoggedIn(false);
    router.push(`/${locale}`);
    router.refresh();
  };

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 hidden md:block",
          isLightVariant
            ? "backdrop-blur-md border-b py-3 shadow-sm"
            : scrolled
              ? "bg-black/80 backdrop-blur-xl border-b border-white/10 py-2"
              : "bg-transparent dark:bg-transparent backdrop-blur-sm py-4 border-b border-white/10 dark:border-transparent"
        )}
        style={isLightVariant || !isDark ? {
          backgroundColor: isDark ? "#0a0a0f" : "#ffffff",
          borderColor: isDark ? "rgba(255,255,255,0.1)" : "#e5e7eb",
          color: isDark ? "#f4f4f5" : "#171717",
        } : undefined}
      >
        <div
          className={cn(
            "container mx-auto flex items-center justify-between gap-4 px-4 sm:px-5 md:px-6",
            !isLightVariant && isDark && "text-white"
          )}
          style={isLightVariant || !isDark ? { color: isDark ? "#f4f4f5" : "#171717" } : undefined}
        >
          {/* Logo - dark in light theme, light in dark theme (both variants) */}
          <div className="flex items-center gap-6" style={isLightVariant || !isDark ? { color: "inherit" } : undefined}>
            <Link href="/" className="flex items-center gap-2" style={isLightVariant || !isDark ? { color: "inherit" } : undefined}>
                <SafeImage 
                  src="/assets/hero-bg.png" 
                  alt="BookingQube" 
                  className={cn(
                    "h-10 w-auto object-contain transition-all",
                    (isLightVariant || !isDark) ? "brightness-0 dark:invert" : "brightness-0 invert"
                  )}
                  style={(isLightVariant || !isDark) ? (!isDark ? { filter: "brightness(0)" } : { filter: "brightness(0) invert(1)" }) : undefined}
                />
            </Link>

            {showLoyalty && (
               <Link href="/loyalty" className="text-sm font-medium opacity-80 hover:opacity-100 hover:text-primary transition-colors" style={(isLightVariant || !isDark) ? { color: "inherit" } : undefined}>
                  Loyalty Program
               </Link>
            )}
          </div>

          <div className="flex-1" />

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-4" style={(isLightVariant || !isDark) ? { color: "inherit" } : undefined}>
            <Button 
                variant="ghost" 
                size="icon" 
                className={cn("hidden md:flex rounded-full w-10 h-10", (isLightVariant || !isDark) ? "hover:bg-gray-100 dark:hover:bg-white/10" : "opacity-90 hover:opacity-100 hover:bg-black/10 dark:hover:bg-white/10")}
                style={(isLightVariant || !isDark) ? { color: "inherit" } : undefined}
                onClick={() => setSearchOpen(true)}
            >
                <Search className="w-5 h-5" />
            </Button>

            <Button variant="ghost" size="sm" className={cn("hidden lg:flex gap-2 rounded-full", (isLightVariant || !isDark) ? "hover:bg-gray-100 dark:hover:bg-white/10" : "opacity-90 hover:opacity-100 hover:bg-black/10 dark:hover:bg-white/10")} style={(isLightVariant || !isDark) ? { color: "inherit" } : undefined}>
              <MapPin className="w-4 h-4" />
              <span>{t('dubai')}</span>
            </Button>
            
            <div className={cn("h-6 w-px hidden lg:block", (isLightVariant || !isDark) ? "bg-gray-300 dark:bg-gray-600" : "bg-current opacity-30")} />
            
            <ThemeToggle />
            <LanguageSwitcher />

            {isLoggedIn ? (
              mounted ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "rounded-full w-10 h-10 p-0 hidden sm:flex transition-all",
                      (isLightVariant || !isDark) ? "hover:bg-gray-100 dark:hover:bg-white/10 ring-offset-background data-[state=open]:ring-2 data-[state=open]:ring-primary/30" : "opacity-90 hover:opacity-100 hover:bg-white/10 dark:hover:bg-white/10 data-[state=open]:ring-2 data-[state=open]:ring-white/20"
                    )}
                    style={(isLightVariant || !isDark) ? { color: "inherit" } : undefined}
                  >
                    <Avatar className="h-9 w-9 transition-shadow">
                      <AvatarImage src="" alt="Profile" />
                      <AvatarFallback className={cn("text-sm font-medium", (isLightVariant || !isDark) ? "bg-primary/10 text-primary" : "bg-white/15 text-white")}>
                        <User className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  sideOffset={8}
                  className="w-72 rounded-xl border border-border/80 bg-popover/95 dark:bg-card/95 backdrop-blur-xl shadow-xl shadow-black/5 dark:shadow-black/30 p-0 min-w-[16rem] overflow-hidden"
                >
                  {/* User identity */}
                  <Link href={`/${locale}/profile`} className="flex items-center gap-3 p-4 hover:bg-primary/5 transition-colors cursor-pointer">
                    <Avatar className="h-12 w-12 shrink-0 ring-2 ring-border/50">
                      <AvatarImage src="" alt="" />
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
                        {userName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-foreground truncate">{userName}</p>
                      <p className="text-sm text-muted-foreground truncate">{userEmail}</p>
                    </div>
                  </Link>
                  <DropdownMenuSeparator className="bg-border/80" />
                  {/* Wallet */}
                  <Link href={`/${locale}/wallet`} className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-primary/5 transition-colors">
                    <span className="text-sm font-medium text-muted-foreground">Wallet</span>
                    <span className="text-sm font-semibold text-foreground">0 USD</span>
                  </Link>
                  <DropdownMenuSeparator className="bg-border/80" />
                  {/* Menu links */}
                  <div className="p-2">
                    <DropdownMenuItem asChild className="rounded-lg px-3 py-2.5 gap-3 focus:bg-primary/10 focus:text-foreground hover:bg-primary/10 cursor-pointer">
                      <Link href={`/${locale}/my-bookings`} className="flex items-center gap-3">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <Ticket className="w-4 h-4" />
                        </span>
                        <span className="font-medium">My tickets</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="rounded-lg px-3 py-2.5 gap-3 focus:bg-primary/10 focus:text-foreground hover:bg-primary/10 cursor-pointer">
                      <Link href={`/${locale}/favourites`} className="flex items-center gap-3">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <Heart className="w-4 h-4" />
                        </span>
                        <span className="font-medium">Favourites</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="rounded-lg px-3 py-2.5 gap-3 focus:bg-primary/10 focus:text-foreground hover:bg-primary/10 cursor-pointer">
                      <Link href={`/${locale}/settings`} className="flex items-center gap-3">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <Settings className="w-4 h-4" />
                        </span>
                        <span className="font-medium">Account settings</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="rounded-lg px-3 py-2.5 gap-3 focus:bg-primary/10 focus:text-foreground hover:bg-primary/10 cursor-pointer">
                      <Link href={`/${locale}/contact`} className="flex items-center gap-3">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <MessageCircle className="w-4 h-4" />
                        </span>
                        <span className="font-medium">Contact support</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="rounded-lg px-3 py-2.5 gap-3 focus:bg-primary/10 focus:text-foreground hover:bg-primary/10 cursor-pointer">
                      <Link href={`/${locale}/careers`} className="flex items-center gap-3">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <Briefcase className="w-4 h-4" />
                        </span>
                        <span className="font-medium">We are hiring</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="rounded-lg px-3 py-2.5 gap-3 focus:bg-primary/10 focus:text-foreground hover:bg-primary/10 cursor-pointer">
                      <Link href={`/${locale}/organisers`} className="flex items-center gap-3">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <PlusCircle className="w-4 h-4" />
                        </span>
                        <span className="font-medium">Create an event</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="rounded-lg px-3 py-2.5 gap-3 focus:bg-primary/10 focus:text-foreground hover:bg-primary/10 cursor-pointer">
                      <Link href={`/${locale}/affiliate`} className="flex items-center gap-3">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <Store className="w-4 h-4" />
                        </span>
                        <span className="font-medium">Sell tickets with us</span>
                      </Link>
                    </DropdownMenuItem>
                  </div>
                  <DropdownMenuSeparator className="bg-border/80" />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="rounded-none px-4 py-3 gap-3 text-destructive focus:bg-destructive/10 focus:text-destructive hover:bg-destructive/10 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 shrink-0" />
                    <span className="font-medium">Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              ) : (
              <div
                className={cn(
                  "rounded-full w-10 h-10 p-0 hidden sm:flex items-center justify-center transition-all",
                  isLightVariant ? "hover:bg-gray-100 dark:hover:bg-white/10" : "opacity-90 hover:opacity-100 hover:bg-white/10 dark:hover:bg-white/10"
                )}
                style={(isLightVariant || !isDark) ? { color: "inherit" } : undefined}
                aria-hidden
              >
                <Avatar className="h-9 w-9 transition-shadow">
                  <AvatarImage src="" alt="" />
                  <AvatarFallback className={cn("text-sm font-medium", (isLightVariant || !isDark) ? "bg-primary/10 text-primary" : "bg-white/15 text-white")}>
                    <User className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
              </div>
              )
            ) : (
              <Link href={`/${locale}/login`}>
                <Button className={cn(
                  "rounded-full px-6 hidden sm:flex border-2 shadow-lg",
                  (isLightVariant || !isDark)
                    ? "bg-primary text-primary-foreground border-primary hover:bg-primary/90"
                    : "bg-white dark:bg-white text-black dark:text-black border-white dark:border-white hover:bg-gray-100 dark:hover:bg-gray-100"
                )}>
                  {t('login')}
                </Button>
              </Link>
            )}

            <Button variant="ghost" size="icon" className={cn("sm:hidden", (isLightVariant || !isDark) ? "hover:bg-gray-100 dark:hover:bg-white/10" : "opacity-90 hover:opacity-100")} style={(isLightVariant || !isDark) ? { color: "inherit" } : undefined}>
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </nav>

      <SearchOverlay open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
