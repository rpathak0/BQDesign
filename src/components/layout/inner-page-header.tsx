"use client";

import { ChevronLeft } from "lucide-react";

export interface InnerPageHeaderProps {
  /** Title shown next to the back chevron (e.g. "Check out", "Tickets", event name). */
  title: string;
  /** Called when the back button is clicked. */
  onBack: () => void;
}

/**
 * Fixed minimal header for inner/flow pages (event detail, tickets, date-time, seating, checkout).
 * Keeps the same ticket/flow header constant across all inner pages.
 */
export function InnerPageHeader({ title, onBack }: InnerPageHeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 dark:bg-background/95 backdrop-blur border-b border-border">
      <div className="container mx-auto flex items-center gap-4 h-14 md:h-16 px-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-foreground hover:text-primary transition-colors"
          aria-label="Back"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="font-semibold">{title}</span>
        </button>
      </div>
    </header>
  );
}
