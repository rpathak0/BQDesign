"use client";

import { Home, Compass, Ticket, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
// import { Link } from "wouter"; // Removed
import Link from "next/link"; // Added

export function MobileTabbar() {
  const [activeTab, setActiveTab] = useState("home");
  const [showBar, setShowBar] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show only when scrolled past a bit, hide when at very top
      setShowBar(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const tabs = [
    { id: "home", icon: Home, label: "Home", href: "/" },
    { id: "explore", icon: Compass, label: "Explore", href: "/explore" },
    { id: "bookings", icon: Ticket, label: "Bookings", href: "/bookings" },
    { id: "profile", icon: User, label: "Profile", href: "/profile" },
  ];

  return (
    <div 
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-t border-white/10 transition-transform duration-300 md:hidden pb-safe",
        showBar ? "translate-y-0" : "translate-y-full"
      )}
    >
      <div className="flex items-center justify-around p-2">
        {tabs.map((tab) => (
          <Link key={tab.id} href={tab.href} passHref>
              <Button
                variant="ghost"
                className={cn(
                  "flex flex-col items-center gap-1 h-auto py-2 px-4 rounded-xl hover:bg-white/5",
                  activeTab === tab.id ? "text-[#ffdd00]" : "text-muted-foreground"
                )}
                onClick={() => setActiveTab(tab.id)}
              >
                <tab.icon className={cn("w-6 h-6", activeTab === tab.id && "fill-current")} />
                <span className="text-[10px] font-medium">{tab.label}</span>
              </Button>
          </Link>
        ))}
      </div>
    </div>
  );
}
