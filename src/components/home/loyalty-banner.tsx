"use client";

import { Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function LoyaltyBanner() {
  return (
    <div className="container mx-auto my-12 px-4 sm:px-5 md:px-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-900/80 to-indigo-900/80 border border-white/10 p-8 md:p-12">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-yellow-400 text-xs font-bold uppercase tracking-wider border border-white/10">
              <Crown className="w-3 h-3 fill-current" />
              <span>BQ Rewards</span>
            </div>
            <h2 className="text-2xl md:text-4xl font-display font-bold text-white">
              Unlock Exclusive Perks with Loyalty
            </h2>
            <p className="text-white/80 text-sm md:text-lg">
              Earn points on every booking, access VIP presales, and enjoy member-only discounts.
            </p>
          </div>
          
          <Button 
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold text-base px-8 py-6 rounded-full shadow-lg shadow-yellow-400/20 hover:scale-105 transition-transform"
          >
            Join Free
          </Button>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl" />
      </div>
    </div>
  );
}
