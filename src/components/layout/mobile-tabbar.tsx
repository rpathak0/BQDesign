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
        "fixed bottom-0 left-0 right-0 z-50 md:hidden pb-safe",
        "bg-white/70 dark:bg-black/50 backdrop-blur-2xl",
        "border-t border-white/20 dark:border-white/10",
        "shadow-[0_-4px_24px_rgba(0,0,0,0.08)] dark:shadow-[0_-4px_24px_rgba(0,0,0,0.4)]",
        "transition-[transform,background-color,border-color,box-shadow] duration-500 ease-out",
        showBar ? "translate-y-0" : "translate-y-full"
      )}
    >
      {/* Subtle inner glow line for glass effect */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 dark:via-white/20 to-transparent pointer-events-none" />

      <div className="flex items-center justify-around p-2 pt-3">
        {tabs.map((tab) => (
          <Link key={tab.id} href={tab.href} passHref>
            <Button
              variant="ghost"
              className={cn(
                "flex flex-col items-center gap-1 h-auto py-2 px-4 rounded-2xl",
                "transition-all duration-300 ease-out",
                "hover:bg-black/5 dark:hover:bg-white/5 active:scale-95",
                activeTab === tab.id
                  ? "text-[#ffdd00] dark:text-[#ffdd00] bg-black/5 dark:bg-white/5"
                  : "text-gray-600 dark:text-white/70"
              )}
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon
                className={cn(
                  "w-6 h-6 transition-all duration-300",
                  activeTab === tab.id && "fill-current drop-shadow-sm"
                )}
              />
              <span className="text-[10px] font-medium transition-colors duration-300">{tab.label}</span>
            </Button>
          </Link>
        ))}
      </div>
    </div>
  );
}
