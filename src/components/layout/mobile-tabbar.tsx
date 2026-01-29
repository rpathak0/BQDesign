"use client";

import { Home, Compass, Ticket, MoreHorizontal, User, Film, HelpCircle, Sparkles, LogIn, Gift } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useTranslations } from "next-intl";
import { ScrollArea } from "@/components/ui/scroll-area";

const showLoyalty = process.env.NEXT_PUBLIC_FEATURE_LOYALTY === "true";

export function MobileTabbar() {
  const params = useParams();
  const locale = (params?.locale as string) ?? "en";
  const t = useTranslations("Footer");
  const [activeTab, setActiveTab] = useState("home");
  const [showBar, setShowBar] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBar(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const base = `/${locale}`;

  const mainTabs = [
    { id: "home", icon: Home, label: "Home", href: base },
    { id: "explore", icon: Compass, label: "Explore", href: `${base}/explore` },
    { id: "bookings", icon: Ticket, label: "Bookings", href: `${base}/bookings` },
  ];

  const moreSections = [
    {
      title: "Account",
      items: [
        { icon: User, label: "Profile", href: `${base}/profile` },
        { icon: LogIn, label: "Login", href: `${base}/login` },
      ],
    },
    {
      title: "Movies",
      items: [
        { icon: Film, label: "Now Showing", href: "#" },
        { icon: Film, label: "Coming Soon", href: "#" },
        { icon: Film, label: "Cinemas", href: "#" },
        { icon: Film, label: "Experiences", href: "#" },
      ],
    },
    {
      title: "Support",
      items: [
        { icon: HelpCircle, label: t("about"), href: "#" },
        { icon: HelpCircle, label: t("privacy"), href: "#" },
        { icon: HelpCircle, label: t("terms"), href: "#" },
        { icon: HelpCircle, label: t("contact"), href: "#" },
      ],
    },
    ...(showLoyalty
      ? [
          {
            title: "Rewards",
            items: [{ icon: Gift, label: "Loyalty Program", href: `${base}/loyalty` }],
          },
        ]
      : []),
    {
      title: "AI & Training",
      items: [{ icon: Sparkles, label: "AI Training Settings", href: `${base}/ai-training` }],
    },
  ];

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 md:hidden pb-safe",
        "bg-white/80 dark:bg-black/70 backdrop-blur-xl",
        "border-t border-black/5 dark:border-white/10",
        "shadow-[0_-8px_32px_rgba(0,0,0,0.06)] dark:shadow-[0_-8px_32px_rgba(0,0,0,0.3)]",
        "transition-all duration-300 ease-out",
        showBar ? "translate-y-0" : "translate-y-full"
      )}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent pointer-events-none" />

      <div className="flex items-center justify-around gap-1 p-2 pt-3 pb-4">
        {mainTabs.map((tab) => (
          <Link key={tab.id} href={tab.href}>
            <Button
              variant="ghost"
              className={cn(
                "flex flex-col items-center gap-1.5 min-w-[64px] h-auto py-2.5 px-3 rounded-2xl",
                "transition-all duration-200",
                "hover:bg-primary/10 dark:hover:bg-white/10 active:scale-[0.97]",
                activeTab === tab.id
                  ? "text-primary dark:text-primary bg-primary/10 dark:bg-primary/15 font-medium"
                  : "text-muted-foreground dark:text-white/60"
              )}
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon
                className={cn(
                  "w-5 h-5 transition-all",
                  activeTab === tab.id && "text-primary"
                )}
              />
              <span className="text-[10px] font-medium tracking-tight">{tab.label}</span>
            </Button>
          </Link>
        ))}

        <Sheet open={moreOpen} onOpenChange={setMoreOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "flex flex-col items-center gap-1.5 min-w-[64px] h-auto py-2.5 px-3 rounded-2xl",
                "transition-all duration-200",
                "hover:bg-primary/10 dark:hover:bg-white/10 active:scale-[0.97]",
                moreOpen
                  ? "text-primary dark:text-primary bg-primary/10 dark:bg-primary/15 font-medium"
                  : "text-muted-foreground dark:text-white/60"
              )}
              onClick={() => setMoreOpen(true)}
            >
              <MoreHorizontal className="w-5 h-5" />
              <span className="text-[10px] font-medium tracking-tight">More</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="rounded-t-3xl max-h-[85vh] flex flex-col">
            <SheetHeader className="text-left pb-2 border-b border-border/50">
              <SheetTitle className="text-lg font-semibold">Menu</SheetTitle>
            </SheetHeader>
            <ScrollArea className="flex-1 min-h-0 -mx-6 px-6 py-4">
              <div className="space-y-6">
                {moreSections.map((section) => (
                  <div key={section.title}>
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">
                      {section.title}
                    </h3>
                    <ul className="space-y-0.5">
                      {section.items.map((item) => (
                        <li key={item.label}>
                          <Link
                            href={item.href}
                            onClick={() => setMoreOpen(false)}
                            className={cn(
                              "flex items-center gap-3 w-full py-3 px-3 rounded-xl",
                              "text-foreground dark:text-white/90",
                              "hover:bg-primary/10 dark:hover:bg-white/10 active:bg-primary/15",
                              "transition-colors"
                            )}
                          >
                            <item.icon className="w-5 h-5 text-primary shrink-0" />
                            <span className="text-sm font-medium">{item.label}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
