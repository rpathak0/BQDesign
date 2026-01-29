"use client";

import { cn } from "@/lib/utils";

interface BadgePillProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "outline" | "secondary" | "accent";
}

export function BadgePill({ children, className, variant = "default" }: BadgePillProps) {
  const variants = {
    default: "bg-primary/10 text-primary border-primary/20",
    outline: "bg-transparent border-white/20 text-white",
    secondary: "bg-secondary/10 text-secondary-foreground border-secondary/20",
    accent: "bg-[#ffdd00]/10 text-[#ffdd00] border-[#ffdd00]/20"
  };

  return (
    <span className={cn(
      "px-3 py-1 rounded-full text-xs font-medium border backdrop-blur-sm",
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
}
