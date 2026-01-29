import { useState } from "react";
import { Movie, MOVIES } from "@/data/mockContent";
import { Button } from "@/components/ui/button";
import { Play, ChevronRight, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { SafeImage } from "@/components/shared/safe-image";

export function Top10Module() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const movies = MOVIES.slice(0, 10);
  const currentMovie = movies[selectedIndex];

  const nextSlide = () => {
    setSelectedIndex((prev) => (prev + 1) % movies.length);
  };

  const prevSlide = () => {
    setSelectedIndex((prev) => (prev - 1 + movies.length) % movies.length);
  };

  return (
    <section className="bg-black dark:bg-black pt-10 md:pt-12 pb-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-display font-bold text-white mb-6">Top 10 Movies</h2>

        <div className="relative rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-[#0f1f15] to-black border border-white/5 shadow-2xl h-[500px] md:h-[600px] group">
          {/* Main Content Area */}
          <div className="absolute inset-0 z-0">
             {/* Background Image with Fade */}
             <div 
                key={currentMovie.id}
                className="absolute inset-0 bg-cover bg-center transition-opacity duration-700 opacity-60 mix-blend-overlay"
                style={{ backgroundImage: `url(${currentMovie.backdrop})` }}
             />
             <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
             <div className="absolute inset-0 bg-gradient-to-t from-[#0f1f15] via-transparent to-transparent" />
          </div>

          {/* Text Content */}
          <div className="relative z-10 p-8 md:p-12 lg:pl-16 h-full flex flex-col justify-start pt-24 max-w-2xl">
              <h3 className="text-4xl md:text-6xl font-display font-black text-white mb-4 leading-none tracking-tight">
                  {currentMovie.title}
              </h3>
              
              <div className="flex flex-wrap items-center gap-3 mb-6 text-sm font-medium text-white/70">
                 <span>PG-13</span>
                 <span className="w-1 h-1 bg-white/50 rounded-full" />
                 <span>{currentMovie.duration}</span>
                 <span className="w-1 h-1 bg-white/50 rounded-full" />
                 <span>{currentMovie.genre.join(", ")}</span>
              </div>

              <div className="flex gap-4">
                  <Button className="bg-[#ffdd00] text-black hover:bg-[#ffdd00]/90 font-bold rounded-full px-8 py-6">
                      Book Now
                  </Button>
                  <Button variant="outline" className="rounded-full w-12 h-12 p-0 border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/40">
                      <Play className="w-5 h-5 text-white fill-current" />
                  </Button>
              </div>
          </div>

          {/* Bottom Thumbnails Strip */}
          <div className="absolute bottom-0 left-0 right-0 p-8 pb-10 z-20 bg-gradient-to-t from-black via-black/80 to-transparent">
             <div className="flex items-center justify-between gap-4">
                 <Button variant="ghost" size="icon" onClick={prevSlide} className="text-white hover:bg-white/10 rounded-full hidden md:flex">
                     <ChevronLeft className="w-6 h-6" />
                 </Button>

                 <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar px-4 mask-fade-sides flex-1 justify-center">
                     {movies.map((movie, index) => (
                         <div 
                            key={movie.id}
                            className={cn(
                                "relative shrink-0 w-32 aspect-video rounded-lg overflow-hidden cursor-pointer transition-all duration-300 border-2",
                                index === selectedIndex ? "border-[#ffdd00] scale-110 shadow-lg z-10" : "border-transparent opacity-50 hover:opacity-100"
                            )}
                            onClick={() => setSelectedIndex(index)}
                         >
                             <SafeImage src={movie.backdrop} alt={movie.title} className="w-full h-full object-cover" />
                             <div className="absolute inset-0 bg-black/20" />
                             <div className="absolute bottom-0 left-0 right-0 p-1 bg-black/60 backdrop-blur-sm">
                                 <p className="text-[10px] text-white truncate text-center font-bold">{movie.title}</p>
                             </div>
                         </div>
                     ))}
                 </div>

                 <Button variant="ghost" size="icon" onClick={nextSlide} className="text-white hover:bg-white/10 rounded-full hidden md:flex">
                     <ChevronRight className="w-6 h-6" />
                 </Button>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}