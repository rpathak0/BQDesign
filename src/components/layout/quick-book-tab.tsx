import { useState, useRef, useEffect } from "react";
import { Zap, ChevronRight, Calendar, Star, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { EVENTS } from "@/data/bqData";
import { MOVIES } from "@/data/mockContent";
import { SafeImage } from "@/components/shared/safe-image";
import { useLanguage } from "@/contexts/language-context";

export function QuickBookTab() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeCategory, setActiveCategory] = useState("Movies");
  const { language } = useLanguage();

  // Handle click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const categories = ['Movies', 'Events', 'Sports', 'Attractions'];
  
  // Get suggestions based on active category
  const getSuggestions = () => {
    if (activeCategory === "Movies") return MOVIES.slice(0, 2);
    return EVENTS.slice(0, 2);
  };

  const suggestions = getSuggestions();

  return (
    <div 
      ref={containerRef}
      className={cn(
        "absolute top-[88px] z-40",
        language === "ar" ? "right-0" : "left-0"
      )}
    >
        {/* The Tab Button */}
        <div className="relative group">
            <div 
                className={cn(
                    "bg-[#ffdd00] text-black font-display font-extrabold text-sm py-3 flex items-center gap-2 cursor-pointer transition-all duration-300 shadow-xl",
                    language === "ar" 
                        ? "pr-6 pl-10 clip-path-slant-rtl flex-row-reverse" 
                        : "pl-6 pr-10 clip-path-slant",
                    isOpen 
                        ? (language === "ar" ? "pl-12" : "pr-12")
                        : (language === "ar" ? "hover:pl-12" : "hover:pr-12")
                )}
                onClick={() => setIsOpen(!isOpen)}
            >
                <Zap className="w-4 h-4 fill-current" />
                <span>QUICK BOOK</span>
            </div>
            
            {/* Mega Menu Dropdown */}
            <div className={cn(
                "absolute top-full mt-2 w-[600px] bg-black/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-6 transition-all duration-300 transform grid grid-cols-[200px_1fr] gap-6",
                language === "ar" ? "right-0 origin-top-right text-right" : "left-0 origin-top-left text-left",
                isOpen 
                    ? "opacity-100 visible translate-y-0" 
                    : "opacity-0 invisible -translate-y-2 pointer-events-none"
            )}>
                {/* Categories */}
                <div className={cn(
                    "space-y-1 pr-6",
                    language === "ar" ? "border-l border-white/10 pl-6 border-r-0" : "border-r border-white/10"
                )}>
                    <h4 className="text-xs font-bold text-white/50 uppercase tracking-widest mb-4">Select Category</h4>
                    {categories.map(cat => (
                        <div 
                            key={cat} 
                            className={cn(
                                "p-3 rounded-lg cursor-pointer font-bold flex items-center justify-between group/item transition-colors",
                                activeCategory === cat ? "bg-white/10 text-white" : "text-white/70 hover:text-white hover:bg-white/5",
                                language === "ar" ? "flex-row-reverse" : ""
                            )}
                            onClick={() => setActiveCategory(cat)}
                        >
                            {cat}
                            {language === "ar" ? (
                                <ChevronLeft className={cn(
                                    "w-4 h-4 transition-opacity",
                                    activeCategory === cat ? "opacity-100 text-[#ffdd00]" : "opacity-0 group-hover/item:opacity-100"
                                )} />
                            ) : (
                                <ChevronRight className={cn(
                                    "w-4 h-4 transition-opacity",
                                    activeCategory === cat ? "opacity-100 text-[#ffdd00]" : "opacity-0 group-hover/item:opacity-100"
                                )} />
                            )}
                        </div>
                    ))}
                </div>
                
                {/* Suggestions */}
                <div className={language === "ar" ? "text-right" : "text-left"}>
                        <h4 className="text-xs font-bold text-white/50 uppercase tracking-widest mb-4">Recommended {activeCategory}</h4>
                        <div className="grid grid-cols-2 gap-4">
                        {suggestions.map((item: any) => (
                            <div key={item.id} className="group/movie cursor-pointer">
                                <div className="aspect-video rounded-lg overflow-hidden mb-2 relative border border-white/10">
                                    <SafeImage src={item.poster || item.image || item.backdrop} className="w-full h-full object-cover transition-transform duration-500 group-hover/movie:scale-110" />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/movie:opacity-100 flex items-center justify-center transition-opacity">
                                        <span className="text-[10px] bg-[#ffdd00] text-black px-3 py-1.5 font-bold rounded-full">Book Now</span>
                                    </div>
                                </div>
                                <p className="text-xs font-bold text-white truncate">{item.title}</p>
                                <p className="text-[10px] text-white/50 truncate">{item.genre ? item.genre[0] : item.location}</p>
                            </div>
                        ))}
                        </div>
                </div>
            </div>
        </div>

        <style>{`
          .clip-path-slant {
            clip-path: polygon(0 0, 100% 0, 85% 100%, 0% 100%);
          }
          .clip-path-slant-rtl {
            clip-path: polygon(0 0, 100% 0, 100% 100%, 15% 100%);
          }
        `}</style>
    </div>
  );
}