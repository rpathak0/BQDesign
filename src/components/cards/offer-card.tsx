import { Offer } from "@/data/mockContent";
import { ArrowRight } from "lucide-react";
import { SafeImage } from "@/components/shared/safe-image";
import { Button } from "@/components/ui/button";

interface OfferCardProps {
  offer: Offer;
}

export function OfferCard({ offer }: OfferCardProps) {
  return (
    <div className="w-[300px] md:w-[350px] group cursor-pointer space-y-4">
      {/* Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden rounded-[2rem] border border-white/10 shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_30px_rgba(99,101,239,0.2)]">
        <SafeImage 
          src={offer.image} 
          alt={offer.title} 
          className="w-full h-full object-cover"
        />
        {/* Optional Badge - Removed as per new design */}
      </div>

      {/* Text Content */}
      <div className="space-y-2">
        <h3 className="text-xl font-display font-bold text-white group-hover:text-primary transition-colors">
            {offer.title}
        </h3>
        <p className="text-white/60 text-sm leading-relaxed line-clamp-2">
            {offer.description}
        </p>
      </div>
    </div>
  );
}
