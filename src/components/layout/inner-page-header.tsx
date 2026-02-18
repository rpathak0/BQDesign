"use client";

import { ChevronLeft } from "lucide-react";
import { useState, useEffect } from "react";

export interface InnerPageHeaderProps {
  /** Title shown next to the back chevron (e.g. "Check out", "Tickets", event name). */
  title: string;
  /** Called when the back button is clicked. */
  onBack: () => void;
}

/**
 * Fixed minimal header for inner/flow pages. Uses inline styles so text is always visible in light and dark theme.
 */
export function InnerPageHeader({ title, onBack }: InnerPageHeaderProps) {
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    const root = typeof document !== "undefined" ? document.documentElement : null;
    if (!root) return;
    const check = () => setIsDark(root.classList.contains("dark"));
    check();
    const obs = new MutationObserver(check);
    obs.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  const headerStyle = {
    backgroundColor: isDark ? "#0a0a0f" : "#ffffff",
    borderColor: isDark ? "rgba(255,255,255,0.1)" : "#e5e7eb",
    color: isDark ? "#f4f4f5" : "#0a0a0a",
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b shadow-sm"
      style={headerStyle}
    >
      <div className="container mx-auto flex items-center gap-4 h-14 md:h-16 px-4 sm:px-5 md:px-6">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 transition-colors hover:opacity-80 font-semibold"
          style={{ color: "inherit" }}
          aria-label="Back"
        >
          <ChevronLeft className="w-5 h-5 shrink-0" />
          <span>{title}</span>
        </button>
      </div>
    </header>
  );
}
