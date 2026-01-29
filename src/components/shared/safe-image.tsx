"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Image as ImageIcon } from "lucide-react";

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
}

export function SafeImage({ 
  src, 
  alt, 
  className, 
  // Reliable SVG placeholder (dark gray with icon)
  fallbackSrc = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' viewBox='0 0 800 600'%3E%3Crect fill='%231f2937' width='800' height='600'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='48' fill='%234b5563'%3EImage Not Found%3C/text%3E%3C/svg%3E", 
  ...props 
}: SafeImageProps) {
  const [error, setError] = useState(false);

  if (error || !src) {
    return (
      <div className={cn("bg-zinc-800 flex items-center justify-center overflow-hidden relative w-full h-full min-h-full", className)}>
        <div className="absolute inset-0 bg-zinc-800" />
        <div className="relative z-10 flex flex-col items-center justify-center gap-1 p-2 text-center w-full h-full">
            <ImageIcon className="w-1/3 h-1/3 max-w-8 max-h-8 text-zinc-500" />
        </div>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
      {...props}
    />
  );
}
