import { useRef } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import React from "react";

interface ContentRailProps {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
  rows?: 1 | 2;
  /** Hide the prev/next arrow buttons (e.g. for Top events) */
  hideNavArrows?: boolean;
  /** Items per page (e.g. 8 = 2 rows × 4 columns). Chunk and snap scroll by this many. */
  itemsPerPage?: number;
}

export function ContentRail({ title, children, action, rows = 1, hideNavArrows, itemsPerPage }: ContentRailProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = direction === "left" ? -400 : 400;
      current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const childArray = React.Children.toArray(children);
  const perPage = itemsPerPage ?? 0;
  const useGrouped = perPage >= 4 && childArray.length > 0;
  const chunks = useGrouped
    ? Array.from({ length: Math.ceil(childArray.length / perPage) }, (_, i) => childArray.slice(i * perPage, i * perPage + perPage))
    : null;
  /* 2 rows × 4 cols: width = 4 × card(280/320) + 3 × gap(24) = 1192px / 1352px */
  const groupWidthClass = "w-[1192px] md:w-[1352px]";

  /* Same placement as Offers & Promotions: container + gutter, scroll track padding and gap */
  return (
    <div className="py-6 md:py-8 space-y-6 container mx-auto px-4 sm:px-5 md:px-6 w-full">
      <div className="flex items-center justify-between gap-4 mb-8">
        <h2 className="text-3xl font-display font-bold text-foreground min-w-0">
          {title}
        </h2>

        <div className="flex items-center gap-4 shrink-0">
          {!hideNavArrows && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full w-10 h-10 border-border/50 hover:bg-primary hover:text-white hover:border-primary transition-colors"
                onClick={() => scroll("left")}
                data-testid={`button-rail-prev-${title.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full w-10 h-10 border-border/50 hover:bg-primary hover:text-white hover:border-primary transition-colors"
                onClick={() => scroll("right")}
                data-testid={`button-rail-next-${title.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          )}

          {action ?? (
            <Button
              variant="link"
              className="text-black dark:text-[#ffdd00] font-semibold group hidden md:flex items-center gap-1 whitespace-nowrap px-0"
              data-testid={`button-rail-discover-${title.toLowerCase().replace(/\s+/g, "-")}`}
            >
              Discover More
              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Button>
          )}
        </div>
      </div>

      <div className="w-full min-w-0">
        <div
          ref={scrollRef}
          className={cn(
            "pb-6 md:pb-8 no-scrollbar overflow-x-auto w-full min-w-0 pr-6 sm:pr-8 md:pr-10",
            useGrouped ? "snap-x snap-mandatory" : "snap-x"
          )}
        >
          {useGrouped && chunks ? (
            <div className="flex gap-6 pr-10 sm:pr-12 md:pr-16">
              {chunks.map((chunk, i) => (
                <div
                  key={i}
                  className={cn("shrink-0 grid grid-cols-4 grid-rows-2 gap-6 snap-start", groupWidthClass)}
                >
                  {chunk}
                </div>
              ))}
            </div>
          ) : (
            <div
              className={cn(
                rows === 1
                  ? "flex gap-6 pr-10 sm:pr-12 md:pr-16"
                  : "grid grid-rows-2 grid-flow-col gap-6 auto-cols-max pr-10 sm:pr-12 md:pr-16"
              )}
            >
              {children}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
