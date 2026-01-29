import { Venue } from "@/data/bqData";
import { MapPin } from "lucide-react";
import { SafeImage } from "@/components/shared/safe-image";

interface VenueCardProps {
  venue: Venue;
}

export function VenueCard({ venue }: VenueCardProps) {
  return (
    <div className="group relative w-[260px] h-[160px] rounded-xl overflow-hidden cursor-pointer shrink-0">
      <SafeImage 
        src={venue.image} 
        alt={venue.name} 
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
      
      <div className="absolute bottom-0 left-0 p-4 w-full">
        <h3 className="text-white font-bold text-lg mb-1">{venue.name}</h3>
        <div className="flex items-center gap-1 text-white/70 text-xs">
          <MapPin className="w-3 h-3" />
          {venue.location}
        </div>
      </div>
    </div>
  );
}
