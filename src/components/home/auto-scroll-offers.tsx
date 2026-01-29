import { useRef, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OfferCard } from "@/components/cards/offer-card";
import { Offer } from "@/data/mockContent";

interface AutoScrollOffersProps {
  offers: Offer[];
}

export function AutoScrollOffers({ offers }: AutoScrollOffersProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-scroll logic
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let scrollInterval: NodeJS.Timeout;

    const startAutoScroll = () => {
      scrollInterval = setInterval(() => {
        if (!isPaused && scrollContainer) {
          if (scrollContainer.scrollLeft + scrollContainer.clientWidth >= scrollContainer.scrollWidth - 10) {
            // Reset to start if reached end (smooth loop effect would be better but simple reset is okay for now)
             scrollContainer.scrollTo({ left: 0, behavior: 'smooth' });
          } else {
             scrollContainer.scrollBy({ left: 1, behavior: 'auto' }); // Slow continuous scroll or incremental
             // For better UX, let's do incremental steps or continuous smooth scroll
          }
        }
      }, 30); // Speed of scroll
    };

    // Better approach: Interval to scroll by item width every few seconds
    const startStepScroll = () => {
        scrollInterval = setInterval(() => {
            if (!isPaused && scrollContainer) {
                const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;
                const nextScroll = scrollContainer.scrollLeft + 350 + 24; // Card width + gap
                
                if (scrollContainer.scrollLeft >= maxScroll - 50) { // Increased threshold slightly
                     scrollContainer.scrollTo({ left: 0, behavior: 'smooth' });
                } else {
                     scrollContainer.scrollTo({ left: nextScroll, behavior: 'smooth' });
                }
            }
        }, 3000); // Scroll every 3 seconds
    };

    startStepScroll();

    return () => clearInterval(scrollInterval);
  }, [isPaused]);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = direction === "left" ? -400 : 400;
      current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section 
        className="container mx-auto px-4 mb-16"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
    >
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-display font-bold text-white">Offers & Promotions</h2>
        
        <div className="flex items-center gap-4">
             {/* Navigation Buttons */}
             <div className="flex gap-2">
                <Button 
                    variant="outline" 
                    size="icon" 
                    className="rounded-full w-10 h-10 border-white/20 bg-transparent hover:bg-[#ffdd00] hover:text-black hover:border-[#ffdd00] transition-colors"
                    onClick={() => scroll("left")}
                >
                    <ChevronLeft className="w-5 h-5" />
                </Button>
                <Button 
                    variant="outline" 
                    size="icon" 
                    className="rounded-full w-10 h-10 border-white/20 bg-transparent hover:bg-[#ffdd00] hover:text-black hover:border-[#ffdd00] transition-colors"
                    onClick={() => scroll("right")}
                >
                    <ChevronRight className="w-5 h-5" />
                </Button>
            </div>

            <Button
              variant="link"
              className="text-[#ffdd00] font-semibold group hidden md:flex items-center gap-1"
            >
              Discover More
              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Button>
        </div>
      </div>
      
      <div 
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto pb-8 no-scrollbar snap-x"
      >
           {offers.map(offer => (
              <div key={offer.id} className="snap-start shrink-0">
                  <OfferCard offer={offer} />
              </div>
          ))}
      </div>
    </section>
  );
}