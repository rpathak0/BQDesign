import { Button } from "@/components/ui/button";
import { Apple, Play, Smartphone } from "lucide-react";
import { SafeImage } from "@/components/shared/safe-image";

export function AppDownloadBanner() {
  return (
    <section className="container mx-auto px-4 py-10 md:py-16">
      <div className="relative rounded-[2.5rem] overflow-hidden bg-black border border-white/10 shadow-2xl">
        <div className="grid lg:grid-cols-2 gap-0 items-center">
          
          {/* Left Content */}
          <div className="p-8 md:p-16 lg:pl-24 space-y-8 z-10 relative">
            <div className="space-y-4">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight text-white leading-tight">
                  Download <br/>
                  <span className="text-white">BookingQube App!</span>
                </h2>
                <p className="text-xl text-white/80 font-medium">
                  Easy Booking
                </p>
            </div>

            <div className="flex flex-wrap gap-4">
                {/* Google Play */}
                <a href="#" className="h-14 px-4 rounded-xl border border-white/30 hover:border-white bg-black hover:bg-white/5 transition-all flex items-center gap-3 group min-w-[160px]">
                    <div className="w-6 h-6">
                       <svg viewBox="0 0 24 24" className="w-full h-full fill-current text-white" xmlns="http://www.w3.org/2000/svg"><path d="M5.00018 20.2036L15.3908 14.2046L12.0163 10.8291L11.5658 11.2786L5.00018 4.71358V20.2036ZM12.9158 9.92858L17.7058 12.8686C18.6758 13.4336 18.6758 14.4826 17.7058 15.0486L12.9158 17.9886L16.2908 14.6146L12.9158 9.92858ZM12.0158 18.8896L5.8998 22.4196C5.5588 22.6166 5.2288 22.5846 5.0008 22.4546L12.0158 15.4396V18.8896ZM5.0008 2.46358C5.2288 2.33258 5.5588 2.30058 5.8998 2.49758L12.0158 6.02858V9.47858L5.0008 2.46358Z"/></svg>
                    </div>
                    <div className="text-left flex flex-col items-start leading-none">
                        <span className="text-[9px] font-medium text-white/70 uppercase tracking-wide">Get it on</span>
                        <span className="text-sm font-bold text-white">Google Play</span>
                    </div>
                </a>

                {/* App Store */}
                <a href="#" className="h-14 px-4 rounded-xl border border-white/30 hover:border-white bg-black hover:bg-white/5 transition-all flex items-center gap-3 group min-w-[160px]">
                    <div className="w-6 h-6">
                        <svg viewBox="0 0 24 24" className="w-full h-full fill-current text-white" xmlns="http://www.w3.org/2000/svg"><path d="M17.05 19.397c-1.378 1.984-2.414 3.28-3.53 3.317-1.08.038-2.545-0.783-3.79-0.783-1.282 0-2.67.797-3.754.797-1.154 0-2.28-1.28-3.41-3.32-1.92-3.436-2.07-8.23-0.088-10.707 0.99-1.233 2.75-1.986 4.38-1.986 1.48 0 2.82.906 3.7.906 0.84 0 2.21-1.018 3.86-0.897 0.65.03 2.85.292 4.14 2.18-0.12.075-2.44 1.43-2.44 4.25 0 3.376 2.99 4.54 3.06 4.58-0.03.11-0.45 1.54-1.33 2.83l-0.81 1.16zM12.92 3.16c0.69-0.838 1.16-2.013 1.03-3.16-1.06 0.04-2.31 0.71-3.03 1.54-0.62 0.7-1.12 1.83-0.98 2.96 1.16 0.09 2.34-0.54 2.98-1.34z"/></svg>
                    </div>
                    <div className="text-left flex flex-col items-start leading-none">
                        <span className="text-[9px] font-medium text-white/70 uppercase tracking-wide">Download on the</span>
                        <span className="text-sm font-bold text-white">App Store</span>
                    </div>
                </a>
                
                {/* App Gallery */}
                <a href="#" className="h-14 px-4 rounded-xl border border-white/30 hover:border-white bg-black hover:bg-white/5 transition-all flex items-center gap-3 group min-w-[160px]">
                     <div className="w-6 h-6 flex items-center justify-center">
                       <Smartphone className="w-5 h-5 text-white" />
                     </div>
                    <div className="text-left flex flex-col items-start leading-none">
                        <span className="text-[9px] font-medium text-white/70 uppercase tracking-wide">Explore it on</span>
                        <span className="text-sm font-bold text-white">App Gallery</span>
                    </div>
                </a>
            </div>
          </div>
          
          {/* Right Content - Phone & Image */}
          <div className="relative h-[260px] sm:h-[340px] md:h-[500px] flex items-end justify-center overflow-hidden">
             {/* Background Image Masked */}
             <div className="absolute inset-0 z-0">
                <SafeImage 
                   src="/assets/hero-bg.png" 
                   className="w-full h-full object-cover opacity-60 mix-blend-overlay" 
                   alt="Cinema Experience"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
             </div>

             {/* Phone Mockup */}
             <div className="relative w-64 md:w-72 aspect-[9/19] bg-black rounded-[3rem] border-8 border-gray-900 shadow-2xl z-10 transform translate-y-12">
                {/* Screen Content */}
                <div className="absolute inset-0 bg-[#1a1b1e] overflow-hidden rounded-[2.5rem] flex flex-col items-center justify-center relative">
                    {/* Status Bar */}
                    <div className="absolute top-0 left-0 right-0 h-8 z-20 flex justify-between px-6 items-center pt-2">
                        <span className="text-[10px] text-white font-medium">13:13</span>
                        <div className="flex gap-1">
                            <div className="w-3 h-3 rounded-full bg-white/20"></div>
                            <div className="w-3 h-3 rounded-full bg-white/20"></div>
                        </div>
                    </div>
                    
                    {/* Dynamic Island */}
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-7 bg-black rounded-full z-20"></div>

                    {/* Logo Splash */}
                    <div className="flex flex-col items-center gap-4 animate-in fade-in duration-1000 zoom-in-95">
                        <SafeImage 
                          src="/assets/hero-bg.png" 
                          alt="Logo" 
                          className="w-32 h-auto object-contain brightness-0 invert" 
                        />
                        <span className="text-white/50 text-xs tracking-[0.2em] uppercase mt-2">Premium Cinema</span>
                    </div>

                     {/* Bottom Gloss */}
                     <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-primary/10 to-transparent pointer-events-none"></div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}
