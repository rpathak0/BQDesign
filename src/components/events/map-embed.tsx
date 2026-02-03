"use client";

import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

interface MapEmbedProps {
  lat: number;
  lng: number;
  title?: string;
  className?: string;
}

/** Embeds a static Google Map placeholder. Replace with real map (e.g. Google Maps embed URL or Mapbox) when backend is ready. */
export function MapEmbed({ lat, lng, title = "Location", className }: MapEmbedProps) {
  const reduced = usePrefersReducedMotion();
  // Static map URL: optional. Using iframe placeholder; replace with actual embed URL.
  const embedUrl = `https://www.google.com/maps?q=${lat},${lng}&output=embed`;

  return (
    <div className={className}>
      {title ? <h3 className="font-display font-bold text-lg mb-3">{title}</h3> : null}
      <div className="rounded-xl overflow-hidden border border-border/50 bg-muted aspect-[16/9] min-h-[200px]">
        <iframe
          title={title}
          src={embedUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="w-full h-full min-h-[200px]"
        />
      </div>
      {reduced && (
        <p className="text-xs text-muted-foreground mt-2">
          Map loaded. Coordinates: {lat}, {lng}
        </p>
      )}
    </div>
  );
}
