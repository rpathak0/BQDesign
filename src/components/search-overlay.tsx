import { useState, useEffect } from "react";
import { Search, X, MapPin, Calendar, Star } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EVENTS, ARTISTS, CATEGORIES } from "@/data/bqData";
import { cn } from "@/lib/utils";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { SafeImage } from "@/components/shared/safe-image";

interface SearchOverlayProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchOverlay({ open, onOpenChange }: SearchOverlayProps) {
  const [query, setQuery] = useState("");

  // Filter data based on query (mock implementation)
  const filteredEvents = query ? EVENTS.filter(e => e.title.toLowerCase().includes(query.toLowerCase())) : EVENTS.slice(0, 5);
  const filteredArtists = query ? ARTISTS.filter(a => a.name.toLowerCase().includes(query.toLowerCase())) : ARTISTS.slice(0, 5);
  const filteredCategories = query ? CATEGORIES.filter(c => c.name.toLowerCase().includes(query.toLowerCase())) : CATEGORIES;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[100vw] h-[100vh] sm:rounded-none border-none p-0 bg-background/95 backdrop-blur-xl flex flex-col gap-0 z-[60] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right duration-500">
        <VisuallyHidden.Root>
            <DialogTitle>Search</DialogTitle>
        </VisuallyHidden.Root>
        
        {/* Header */}
        <div className="container mx-auto px-4 py-4 flex items-center gap-4 border-b border-border/20">
          <Search className="w-5 h-5 text-primary" />
          <Input 
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search event or category..." 
            className="flex-1 h-12 text-lg bg-transparent border-none shadow-none focus-visible:ring-0 px-0 placeholder:text-muted-foreground/50"
          />
          <div className="flex items-center gap-4">
             <span className="text-sm text-muted-foreground hidden sm:block">EN / QAR</span>
             <Button 
                variant="ghost" 
                className="text-muted-foreground hover:text-foreground"
                onClick={() => onOpenChange(false)}
             >
                Close
             </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto py-8">
          <div className="container mx-auto px-4 space-y-8">
            
            {/* Suggestion Chips */}
            <div className="flex flex-wrap gap-3">
              <Badge variant="outline" className="rounded-full px-4 py-2 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 cursor-pointer transition-colors">
                Live shows you might like ✨
              </Badge>
              <Badge variant="outline" className="rounded-full px-4 py-2 bg-secondary/50 text-secondary-foreground border-border hover:bg-secondary cursor-pointer transition-colors">
                Cultural experiences to discover 🕌
              </Badge>
              <Badge variant="outline" className="rounded-full px-4 py-2 bg-secondary/50 text-secondary-foreground border-border hover:bg-secondary cursor-pointer transition-colors">
                New events worth checking out 🎫
              </Badge>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pt-8">
              
              {/* Events & Attractions Column */}
              <div className="md:col-span-5 space-y-6">
                <h3 className="text-xl font-display font-bold">Events & Attractions</h3>
                <div className="space-y-4">
                  {filteredEvents.map(event => (
                    <div key={event.id} className="flex gap-4 group cursor-pointer">
                      <div className="w-24 h-16 rounded-lg overflow-hidden shrink-0">
                        <SafeImage src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <h4 className="font-bold text-sm leading-tight group-hover:text-primary transition-colors">{event.title}</h4>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span className="font-semibold text-foreground">{event.price}</span>
                            <span>•</span>
                            <span className="text-[#10B981] font-medium">Selling fast</span>
                        </div>
                        <div className="text-[10px] text-muted-foreground flex gap-2">
                           <span>{event.location}</span>
                           <span>{event.date}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Artists Column */}
              <div className="md:col-span-3 space-y-6">
                <h3 className="text-xl font-display font-bold">Artists</h3>
                <div className="space-y-4">
                  {filteredArtists.map(artist => (
                    <div key={artist.id} className="flex items-center gap-4 group cursor-pointer">
                      <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-border">
                        <SafeImage src={artist.image} alt={artist.name} className="w-full h-full object-cover" />
                      </div>
                      <span className="font-medium group-hover:text-primary transition-colors">{artist.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Categories Column */}
              <div className="md:col-span-4 space-y-6">
                <h3 className="text-xl font-display font-bold">Categories</h3>
                <div className="space-y-4">
                  {filteredCategories.map(category => (
                    <div key={category.id} className="flex items-center gap-4 group cursor-pointer">
                      <div className="w-10 h-10 rounded-full overflow-hidden shrink-0">
                        <SafeImage src={category.image} alt={category.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                      </div>
                      <span className="font-medium group-hover:text-primary transition-colors">{category.name}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
