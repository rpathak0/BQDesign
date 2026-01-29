import { useState } from "react";
import { cn } from "@/lib/utils";
import { Image as ImageIcon } from "lucide-react";

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
}

export function ImageWithFallback({ 
  src, 
  alt, 
  className, 
  fallbackSrc = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop", 
  ...props 
}: ImageWithFallbackProps) {
  const [error, setError] = useState(false);

  if (error || !src) {
    return (
      <div className={cn("bg-secondary/20 flex items-center justify-center overflow-hidden relative", className)}>
        <img 
          src={fallbackSrc} 
          alt={alt || "Fallback"} 
          className="w-full h-full object-cover opacity-50 blur-sm scale-110"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/10">
            <ImageIcon className="w-8 h-8 text-muted-foreground/50" />
        </div>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
      {...props}
    />
  );
}
