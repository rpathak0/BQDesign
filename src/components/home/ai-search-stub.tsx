"use client";

import { Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function AISearchStub({ onActivate }: { onActivate?: () => void }) {
  return (
    <div className="w-full max-w-3xl mx-auto my-6 relative z-20 px-4 md:px-0">
      <div 
        onClick={onActivate}
        className="relative group cursor-pointer"
        role="button"
        tabIndex={0}
      >
        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 rounded-full opacity-40 group-hover:opacity-75 blur-md transition duration-500" />
        <div className="relative flex items-center bg-[#0F0F1A] rounded-full p-2 pl-6 shadow-2xl border border-white/10 group-active:scale-[0.99] transition-transform">
          <Sparkles className="w-5 h-5 text-[#ffdd00] mr-4 animate-pulse shrink-0" />
          <div className="flex-1 flex flex-col justify-center h-12 overflow-hidden">
             <span className="text-[10px] font-bold text-primary uppercase tracking-wider leading-tight">Ask AI</span>
             <span className="text-white text-sm md:text-base truncate leading-tight">Where can I take my kids this weekend?</span>
          </div>
          <div className="hidden md:flex items-center gap-2 mr-4">
             <span className="text-[10px] uppercase font-bold text-white/40 tracking-wider">Press Enter</span>
          </div>
          <div className="rounded-full h-10 px-6 shrink-0 bg-white text-black hover:bg-white/90 font-bold transition-all flex items-center justify-center">
             Ask
          </div>
        </div>
      </div>
    </div>
  );
}
