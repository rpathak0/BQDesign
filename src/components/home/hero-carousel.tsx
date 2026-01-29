import { useState, useEffect, useCallback, useRef } from "react";
import { Movie } from "@/data/mockContent";
import { Button } from "@/components/ui/button";
import { Play, ChevronRight, ChevronLeft, Ticket } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { cn } from "@/lib/utils";
import { SafeImage } from "@/components/shared/safe-image";

interface HeroCarouselProps {
  movies: Movie[];
}

// Placeholder video removed to avoid confusion with flower background
const SAMPLE_VIDEO = ""; 

export function HeroCarousel({ movies }: HeroCarouselProps) {
  // Main carousel for the background and text
  const [mainRef, mainApi] = useEmblaCarousel({ loop: true, duration: 40 });
  // Thumbnails carousel for the right side
  const [thumbsRef, thumbsApi] = useEmblaCarousel({ 
    align: "start", 
    containScroll: "keepSnaps", 
    dragFree: true,
    loop: true 
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const videoTimeoutRef = useRef<NodeJS.Timeout>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const onSelect = useCallback(() => {
    if (!mainApi || !thumbsApi) return;
    setSelectedIndex(mainApi.selectedScrollSnap());
    thumbsApi.scrollTo(mainApi.selectedScrollSnap());
    
    // Reset video state on slide change
    setIsVideoPlaying(false);
    if (videoTimeoutRef.current) clearTimeout(videoTimeoutRef.current);
    
    // Start video timer
    videoTimeoutRef.current = setTimeout(() => {
      setIsVideoPlaying(true);
      // We need to use a slight delay to ensure the DOM has updated if we are conditionally rendering
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.currentTime = 0;
          videoRef.current.play().catch((err) => {
            console.log("Autoplay prevented:", err);
            // Autoplay might be blocked, typically requires user interaction first
          });
        }
      }, 50);
    }, 1200);

  }, [mainApi, thumbsApi]);

  useEffect(() => {
    if (!mainApi) return;
    onSelect();
    mainApi.on("select", onSelect);
    mainApi.on("reInit", onSelect);
    
    return () => {
      mainApi.off("select", onSelect);
      mainApi.off("reInit", onSelect);
      if (videoTimeoutRef.current) clearTimeout(videoTimeoutRef.current);
    };
  }, [mainApi, onSelect]);

  const scrollTo = useCallback(
    (index: number) => {
      if (mainApi && thumbsApi) {
        mainApi.scrollTo(index);
        thumbsApi.scrollTo(index);
      }
    },
    [mainApi, thumbsApi]
  );

  const scrollPrev = useCallback(() => mainApi && mainApi.scrollPrev(), [mainApi]);
  const scrollNext = useCallback(() => mainApi && mainApi.scrollNext(), [mainApi]);

  const currentMovie = movies[selectedIndex];

  return (
    <section className="relative w-full h-[460px] md:h-screen min-h-[420px] overflow-hidden bg-black mb-0">
      
      {/* Main Background Carousel */}
      <div className="absolute inset-0 z-0" ref={mainRef}>
        <div className="flex h-full">
          {movies.map((movie, index) => (
            <div key={movie.id} className="relative flex-[0_0_100%] min-w-0 h-full">
              {/* Image Background */}
              <div className="absolute inset-0">
                  <SafeImage 
                    src={movie.backdrop} 
                    alt={movie.title}
                    className={cn(
                        "w-full h-full object-cover transition-opacity duration-1000",
                        index === selectedIndex && isVideoPlaying ? "opacity-0" : "opacity-100"
                    )}
                  />
              </div>
              
              {/* Video Background (Only for active slide) */}
              <div className={cn(
                "absolute inset-0 transition-opacity duration-1000",
                index === selectedIndex && isVideoPlaying ? "opacity-100" : "opacity-0 pointer-events-none"
              )}>
             {/* Only render video tag if we have a valid video URL */}
             {index === selectedIndex && SAMPLE_VIDEO && (
                <video
                    ref={videoRef}
                    src={SAMPLE_VIDEO} 
                    className="w-full h-full object-cover"
                    muted
                    loop
                    playsInline
                    autoPlay
                />
             )}
              </div>
              
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/40 to-transparent" />
              <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent" />
            </div>
          ))}
        </div>
      </div>

      {/* Content Container */}
      <div className="relative z-20 container mx-auto px-4 h-full flex flex-col md:flex-row items-end pb-8 md:pb-24 pt-10 md:pt-0 pointer-events-none">
        
        {/* Left Content (Text) - Adjusted width and text size for iPad */}
        <div className="w-full md:w-[50%] lg:w-[35%] mb-8 md:mb-0 space-y-6 animate-in fade-in slide-in-from-left rtl:slide-in-from-right duration-500 z-30 pointer-events-auto bg-gradient-to-r rtl:bg-gradient-to-l from-black/80 to-transparent md:pr-8 rtl:md:pr-0 rtl:md:pl-8 rounded-2xl md:rounded-xl p-4 md:p-0 text-left rtl:text-right">
           <div className="space-y-4 md:space-y-6">
             <div className="hidden md:flex flex-wrap gap-2 mb-4">
                {currentMovie?.tags.map((tag) => (
                  <span key={tag} className="px-2 py-1 bg-white/20 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest rounded-sm border border-white/10">
                    {tag}
                  </span>
                ))}
             </div>

             <h1 className="text-4xl md:text-6xl lg:text-8xl font-display font-black text-white leading-[0.9] tracking-tighter uppercase drop-shadow-lg break-words">
               {currentMovie?.title}
             </h1>

             {/* Description only on desktop to keep mobile minimal */}
             <p className="hidden md:block text-white/80 text-base md:text-lg max-w-xl line-clamp-3 font-medium text-shadow">
               As Spike is inducted into Jimmy Crystal's gang on the mainland, Dr. Kelson makes a discovery that could alter the world.
             </p>

             <div className="hidden md:flex items-center gap-4 pt-4">
               <Button className="bg-[#ffdd00] hover:bg-[#ffdd00]/90 text-black font-bold rounded-full px-6 py-6 md:px-8 md:py-7 text-base md:text-lg shadow-[0_0_20px_rgba(255,221,0,0.4)]">
                 Book Now
               </Button>
               <Button variant="ghost" className="text-white hover:bg-white/10 hover:text-white rounded-full px-4 py-6 md:px-6 md:py-7 text-base md:text-lg font-medium gap-2">
                 <Play className="fill-white w-4 h-4 rtl:rotate-180" /> Watch Trailer
               </Button>
             </div>
           </div>
        </div>

        {/* Right Content (Thumbnail Deck) */}
        <div className="hidden md:flex w-full md:w-[50%] lg:w-[65%] flex-col items-end rtl:items-start justify-end gap-8 pointer-events-auto pl-4 lg:pl-8 rtl:pl-0 rtl:pr-4 rtl:lg:pr-8 absolute bottom-12 right-0 rtl:right-auto rtl:left-0 md:right-0 rtl:md:right-auto rtl:md:left-0 max-w-[700px] overflow-hidden pr-4 rtl:pr-0 rtl:pl-4">
          
          {/* Thumbnails Carousel */}
          <div className="w-full overflow-visible p-2" ref={thumbsRef}>
            <div className="flex gap-4">
              {movies.map((movie, index) => (
                <div 
                  key={movie.id} 
                  className={cn(
                    "relative flex-[0_0_220px] aspect-[2/3] rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 ring-2 ring-transparent group z-10",
                    index === selectedIndex ? "ring-[#ffdd00] scale-100 shadow-2xl z-20 !ring-opacity-100" : "scale-90 opacity-60 hover:opacity-100"
                  )}
                  style={{
                    boxShadow: index === selectedIndex ? '0 0 0 4px #ffdd00' : 'none'
                  }}
                  onClick={() => scrollTo(index)}
                >
                  <SafeImage src={movie.poster} alt={movie.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-linear-to-t from-black/90 via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-0 left-0 rtl:left-auto rtl:right-0 p-3 w-full text-left rtl:text-right">
                    <p className={cn(
                      "text-white font-bold text-sm line-clamp-2 leading-tight",
                      index === selectedIndex ? "text-[#ffdd00]" : ""
                    )}>
                      {movie.title}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation & Progress */}
          <div className="flex items-center gap-6 w-full max-w-lg pl-16 rtl:pl-0 rtl:pr-16 flex-row rtl:flex-row-reverse">
             <div className="flex gap-2">
               <button 
                onClick={scrollPrev}
                className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-[#ffdd00] hover:text-black hover:border-[#ffdd00] transition-colors"
               >
                 <ChevronLeft className="w-6 h-6 rtl:rotate-180" />
               </button>
               <button 
                onClick={scrollNext}
                className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-[#ffdd00] hover:text-black hover:border-[#ffdd00] transition-colors"
               >
                 <ChevronRight className="w-6 h-6 rtl:rotate-180" />
               </button>
             </div>

             <div className="flex-1 h-[2px] bg-white/20 relative">
               <div 
                className="absolute top-0 left-0 rtl:left-auto rtl:right-0 h-full bg-[#ffdd00] transition-all duration-300"
                style={{ width: `${((selectedIndex + 1) / movies.length) * 100}%` }}
               />
             </div>
             
             <div className="text-white font-mono font-bold text-5xl">
               {selectedIndex + 1}
             </div>
          </div>

        </div>
      </div>

      {/* Mobile navigation + progress */}
      <div className="md:hidden absolute bottom-4 left-0 right-0 z-20 px-6 flex items-center gap-4">
        <div className="flex gap-2">
          <button
            onClick={scrollPrev}
            className="w-10 h-10 rounded-full border border-white/40 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
            data-testid="button-hero-prev"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={scrollNext}
            className="w-10 h-10 rounded-full border border-white/40 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
            data-testid="button-hero-next"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 flex items-center gap-3">
          <div className="flex-1 h-[2px] bg-white/20 relative overflow-hidden rounded-full">
            <div
              className="absolute top-0 left-0 h-full bg-[#ffdd00] transition-all duration-300"
              style={{ width: `${((selectedIndex + 1) / movies.length) * 100}%` }}
            />
          </div>
          <span className="text-white font-mono font-bold text-2xl">
            {selectedIndex + 1}
          </span>
        </div>
      </div>
    </section>
  );
}
