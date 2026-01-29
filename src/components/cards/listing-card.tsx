import { Event } from "@/data/bqData";
import { Badge } from "@/components/ui/badge";
import { Heart, Flame, Hourglass, Trophy, Sparkles } from "lucide-react";
import { SafeImage } from "@/components/shared/safe-image";
import { cn } from "@/lib/utils";

interface ListingCardProps {
  event: Event;
}

export function ListingCard({ event }: ListingCardProps) {
  
  const getStatusConfig = (status?: string) => {
    switch (status) {
      case 'fast-selling':
        return { label: 'Fast Selling', icon: Flame, colorClass: 'bg-orange-500 text-white' };
      case 'limited-slots':
        return { label: 'Limited Slots', icon: Hourglass, colorClass: 'bg-red-500 text-white' };
      case 'best-seller':
        return { label: 'Best Seller', icon: Trophy, colorClass: 'bg-yellow-500 text-black' };
      case 'new':
        return { label: 'New', icon: Sparkles, colorClass: 'bg-blue-500 text-white' };
      default:
        return null;
    }
  };

  const statusConfig = getStatusConfig(event.status);

  return (
    <div className="group w-[300px] flex-shrink-0 cursor-pointer">
      <div className="relative aspect-[3/2] overflow-hidden rounded-xl bg-card border border-white/10 shadow-sm transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(124,58,237,0.2)]">
        <SafeImage 
          src={event.image} 
          alt={event.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Heart Icon */}
        <button className="absolute top-3 right-3 p-2 bg-black/20 backdrop-blur-sm rounded-full hover:bg-white/20 transition-colors group/heart z-10">
            <Heart className="w-4 h-4 text-white group-hover/heart:fill-white transition-all" />
        </button>

        {/* Status Badge */}
        {statusConfig && (
            <div className="absolute top-3 left-3 z-10">
                <Badge className={cn("border-none font-bold text-[10px] px-2 py-1 rounded-sm shadow-sm gap-1", statusConfig.colorClass)}>
                    <statusConfig.icon className="w-3 h-3" />
                    {statusConfig.label}
                </Badge>
            </div>
        )}

        {/* Fallback Tag if no status */}
        {!statusConfig && event.tags && event.tags.includes("New") && (
            <div className="absolute top-3 left-3 z-10">
                <Badge className="bg-[#ffdd00] text-black hover:bg-[#ffdd00]/90 border-none font-bold text-xs px-2 py-0.5 rounded-sm shadow-sm">
                    New
                </Badge>
            </div>
        )}
      </div>

      <div className="pt-3 space-y-1.5">
        <h3 className="font-display font-bold text-base text-white leading-tight group-hover:text-[#7C3AED] transition-colors line-clamp-1">
          {event.title}
        </h3>
        
        <div className="flex items-center gap-2 text-sm">
            <span className="font-medium text-white">{event.price}</span>
            <span className="text-[#A855F7] text-xs">Best seats available</span>
        </div>

        <p className="text-sm text-white/50">{event.date}</p>
      </div>
    </div>
  );
}