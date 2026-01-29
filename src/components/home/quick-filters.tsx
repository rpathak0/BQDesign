import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Filter, Calendar, X } from "lucide-react";
import { FILTERS } from "@/data/mockContent";
import { cn } from "@/lib/utils";

export function QuickFilters() {
  const [open, setOpen] = useState(false);
  const [activeDate, setActiveDate] = useState<string | null>(FILTERS[0] ?? null);

  return (
    <div className="w-full relative">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 pr-4 border-r border-border/50 shrink-0">
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 text-muted-foreground hover:text-primary"
            onClick={() => setOpen(true)}
            data-testid="button-open-filters"
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </Button>

          {activeDate && (
            <span
              className="hidden sm:inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium ml-2"
              data-testid="chip-active-date"
            >
              <Calendar className="w-3 h-3 mr-1" />
              {activeDate}
            </span>
          )}
        </div>

        {/* Hint text */}
        <p className="text-xs text-muted-foreground hidden md:block">
          Refine by date, category, price and more.
        </p>
      </div>

      {/* Filter panel */}
      {open && (
        <div className="fixed inset-0 z-40 md:absolute md:inset-auto md:top-full md:right-0 md:left-auto md:w-[420px]">
          {/* Backdrop on mobile */}
          <div
            className="block md:hidden absolute inset-0 bg-black/60"
            onClick={() => setOpen(false)}
          />

          <div className="absolute md:static bottom-0 left-0 right-0 md:left-auto md:right-0 md:mt-3 bg-black/95 border border-white/10 rounded-t-3xl md:rounded-2xl shadow-2xl max-h-[70vh] md:max-h-[460px] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 sticky top-0 bg-black/95 z-10">
              <div className="flex flex-col">
                <span className="text-xs uppercase tracking-[0.2em] text-white/40">Filters</span>
                <span className="text-sm font-medium text-white">Tune your perfect night out</span>
              </div>
              <button
                className="w-8 h-8 rounded-full flex items-center justify-center text-white/70 hover:bg-white/10"
                onClick={() => setOpen(false)}
                data-testid="button-close-filters"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-4 py-4 space-y-6">
              {/* Date section (Today, Tomorrow, This Weekend…) */}
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-white/40 mb-2">Date</p>
                <div className="flex flex-wrap gap-2">
                  {FILTERS.map((filter, i) => (
                    <button
                      key={filter}
                      className={cn(
                        "px-4 py-2 rounded-full text-xs font-semibold transition-all whitespace-nowrap border flex items-center gap-2",
                        activeDate === filter
                          ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/25"
                          : "bg-secondary/40 text-secondary-foreground border-transparent hover:bg-secondary hover:border-border"
                      )}
                      onClick={() => setActiveDate(filter)}
                      data-testid={`button-date-${filter.toLowerCase().replace(/\s+/g, "-")}`}
                    >
                      {i === 0 && <Calendar className="w-3 h-3" />}
                      {filter}
                    </button>
                  ))}
                </div>
              </div>

              {/* Placeholder feature filters – UI only */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <button
                  className="text-left px-3 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10"
                  data-testid="button-filter-price"
                >
                  <p className="text-white font-semibold mb-1">Price range</p>
                  <p className="text-white/60">Any</p>
                </button>
                <button
                  className="text-left px-3 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10"
                  data-testid="button-filter-genre"
                >
                  <p className="text-white font-semibold mb-1">Genre</p>
                  <p className="text-white/60">All categories</p>
                </button>
                <button
                  className="text-left px-3 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10"
                  data-testid="button-filter-time"
                >
                  <p className="text-white font-semibold mb-1">Time of day</p>
                  <p className="text-white/60">Any time</p>
                </button>
                <button
                  className="text-left px-3 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10"
                  data-testid="button-filter-location"
                >
                  <p className="text-white font-semibold mb-1">Area</p>
                  <p className="text-white/60">All locations</p>
                </button>
              </div>
            </div>

            {/* Footer actions */}
            <div className="flex items-center justify-between gap-3 px-4 py-3 border-t border-white/10 bg-black/90 sticky bottom-0">
              <button
                className="text-xs text-white/60 hover:text-white"
                onClick={() => setActiveDate(FILTERS[0] ?? null)}
                data-testid="button-reset-filters"
              >
                Reset
              </button>
              <Button
                size="sm"
                className="rounded-full bg-[#7C3AED] hover:bg-[#7C3AED]/90 px-6 text-xs font-semibold"
                data-testid="button-apply-filters"
              >
                Apply filters
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
