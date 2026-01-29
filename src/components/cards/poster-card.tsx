import { Movie } from "@/data/mockContent";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Clock } from "lucide-react";
import { SafeImage } from "@/components/shared/safe-image";

interface PosterCardProps {
  movie: Movie;
}

export function PosterCard({ movie }: PosterCardProps) {
  return (
    <div className="group relative w-full cursor-pointer">
      <div className="relative aspect-[2/3] rounded-xl overflow-hidden shadow-lg transition-all duration-300 group-hover:shadow-[0_0_25px_rgba(124,58,237,0.25)] group-hover:-translate-y-2 border border-border/50">
        <SafeImage 
          src={movie.poster} 
          alt={movie.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
          <button className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-semibold transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 shadow-lg">
            Book Now
          </button>
        </div>

        {/* Rating Badge */}
        <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md text-white text-xs font-bold px-2 py-1 rounded border border-white/10 flex items-center gap-1">
          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
          {movie.rating}
        </div>
      </div>
      
      <div className="pt-3 space-y-1">
        <h3 className="font-display font-bold text-lg leading-tight group-hover:text-primary transition-colors line-clamp-1">
          {movie.title}
        </h3>
        <div className="flex items-center text-xs text-muted-foreground gap-2">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" /> {movie.duration}
          </span>
          <span>•</span>
          <span className="line-clamp-1">{movie.genre[0]}</span>
        </div>
      </div>
    </div>
  );
}
