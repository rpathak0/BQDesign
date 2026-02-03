import { useRef } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ContentRailProps {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
  rows?: 1 | 2;
}

export function ContentRail({ title, children, action, rows = 1 }: ContentRailProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = direction === "left" ? -400 : 400;
      current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="py-6 md:py-8 space-y-6">
      <div className="container mx-auto flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-xl md:text-3xl font-display font-bold tracking-tight md:whitespace-nowrap">
            {title}
          </h2>
          <div className="h-1 w-16 md:w-20 bg-primary mt-2 rounded-full" />
        </div>
        
        <div className="flex items-center justify-start md:justify-end gap-3 md:gap-4 flex-wrap md:flex-nowrap mt-1 md:mt-0">
          {/* Navigation arrows */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full w-9 h-9 border-border/50 hover:bg-primary hover:text-white hover:border-primary transition-colors"
              onClick={() => scroll("left")}
              data-testid={`button-rail-prev-${title.toLowerCase().replace(/\s+/g, "-")}`}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full w-9 h-9 border-border/50 hover:bg-primary hover:text-white hover:border-primary transition-colors"
              onClick={() => scroll("right")}
              data-testid={`button-rail-next-${title.toLowerCase().replace(/\s+/g, "-")}`}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Discover More CTA - desktop only; black in light mode, yellow in dark */}
          <Button
            variant="link"
            className="hidden md:inline-flex text-black dark:text-[#ffdd00] text-sm font-semibold items-center gap-1 whitespace-nowrap px-0"
            data-testid={`button-rail-discover-${title.toLowerCase().replace(/\s+/g, "-")}`}
          >
            Discover More
            <ArrowRight className="w-3 h-3" />
          </Button>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className={cn(
          "pb-6 md:pb-8 container mx-auto no-scrollbar snap-x overflow-x-auto",
          rows === 1 
            ? "flex gap-4 md:gap-6" 
            : "grid grid-rows-2 grid-flow-col gap-4 auto-cols-max"
        )}
      >
        {children}
      </div>
    </div>
  );
}
