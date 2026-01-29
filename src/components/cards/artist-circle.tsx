import { Artist } from "@/data/bqData";
import { SafeImage } from "@/components/shared/safe-image";

interface ArtistCircleProps {
  artist: Artist;
}

export function ArtistCircle({ artist }: ArtistCircleProps) {
  return (
    <div className="flex flex-col items-center gap-4 group cursor-pointer w-full shrink-0">
      <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-border/50 group-hover:border-primary transition-all duration-300 shadow-lg group-hover:shadow-[0_0_25px_rgba(99,101,239,0.4)] glass-3d">
        <SafeImage 
          src={artist.image} 
          alt={artist.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      <span className="text-sm font-bold text-center group-hover:text-[#ff0084] transition-colors">
        {artist.name}
      </span>
    </div>
  );
}
