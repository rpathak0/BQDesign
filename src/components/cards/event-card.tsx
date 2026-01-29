"use client";

import { Event } from "@/data/bqData";
import { BadgePill } from "@/components/ui/badge-pill";
import { Calendar, MapPin, Flame, Hourglass, Trophy, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { SafeImage } from "@/components/shared/safe-image";
import { HoverVideoPreview } from "@/components/ui/hover-video-preview";

interface EventCardProps {
  event: Event & { statusTag?: string; videoUrl?: string };
  variant?: "portrait" | "landscape";
}

export function EventCard({ event, variant = "landscape" }: EventCardProps) {
  const isLandscape = variant === "landscape";

  const getStatusConfig = (status?: string) => {
    switch (status) {
      case 'fast-selling':
        return { label: 'Fast Selling', icon: Flame, colorClass: 'bg-orange-500/10 text-orange-500 border-orange-500/20' };
      case 'limited-slots':
        return { label: 'Limited Slots', icon: Hourglass, colorClass: 'bg-red-500/10 text-red-500 border-red-500/20' };
      case 'best-seller':
        return { label: 'Best Seller', icon: Trophy, colorClass: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' };
      case 'new':
        return { label: 'New', icon: Sparkles, colorClass: 'bg-blue-500/10 text-blue-500 border-blue-500/20' };
      default:
        return null;
    }
  };

  const statusConfig = getStatusConfig(event.status);

  return (
    <div className={cn(
      "group relative overflow-hidden rounded-xl border border-border/50 bg-card hover:border-primary/50 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-lg",
      isLandscape ? "w-[280px] md:w-[320px]" : "w-[200px]"
    )}>
      {/* Image Section */}
      <HoverVideoPreview 
        videoUrl={event.videoUrl} 
        poster={event.image}
        className={cn(
          "relative overflow-hidden",
          isLandscape ? "aspect-[16/9]" : "aspect-[2/3]"
        )}
      >
        <SafeImage 
          src={event.image} 
          alt={event.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        
        {/* Price Tag */}
        <div className="absolute bottom-2 left-2 px-2 py-1 bg-background/90 backdrop-blur-md rounded text-xs font-bold shadow-sm z-20 text-white">
          {event.price}
        </div>

        {/* Status Tag */}
        {(statusConfig || event.statusTag || (event.tags && event.tags.length > 0)) && (
            <div className="absolute top-2 left-2 z-20 flex flex-col gap-1">
                {statusConfig && (
                   <div className={cn("px-2 py-1 rounded-md text-[10px] font-bold uppercase flex items-center gap-1 border backdrop-blur-md shadow-sm", statusConfig.colorClass)}>
                      <statusConfig.icon className="w-3 h-3" />
                      {statusConfig.label}
                   </div>
                )}
                
                {/* Fallback to tags if no status or additional tags needed */}
                {!statusConfig && (event.statusTag || (event.tags && event.tags[0])) && (
                    <BadgePill variant="accent" className="font-bold text-[10px] uppercase shadow-md bg-zinc-900/80 text-white border-white/20">
                        {event.statusTag || (event.tags && event.tags[0])}
                    </BadgePill>
                )}
            </div>
        )}
      </HoverVideoPreview>

      {/* Content Section */}
      <div className="p-4 space-y-2">
        <h3 className="font-display font-bold text-base leading-tight group-hover:text-primary transition-colors line-clamp-2">
          {event.title}
        </h3>
        
        <div className="space-y-1 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-primary" />
            <span>{event.date}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-primary" />
            <span className="line-clamp-1">{event.location}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
