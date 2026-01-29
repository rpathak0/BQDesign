"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface HoverVideoPreviewProps {
  videoUrl?: string;
  poster?: string;
  children: React.ReactNode;
  className?: string;
}

export function HoverVideoPreview({ videoUrl, poster, children, className }: HoverVideoPreviewProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => setIsPlaying(true), 500); // Delay before playing
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsPlaying(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  useEffect(() => {
    if (isPlaying && videoRef.current) {
      videoRef.current.play().catch(() => setIsPlaying(false));
    }
  }, [isPlaying]);

  return (
    <div 
      className={cn("relative overflow-hidden group", className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      
      {videoUrl && isPlaying && (
        <div className="absolute inset-0 z-10 bg-black transition-opacity duration-300 animate-in fade-in">
          <video
            ref={videoRef}
            src={videoUrl}
            className="w-full h-full object-cover"
            muted
            loop
            playsInline
            poster={poster}
          />
        </div>
      )}
    </div>
  );
}
