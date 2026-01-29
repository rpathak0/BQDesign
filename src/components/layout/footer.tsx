"use client";

import { Facebook, Twitter, Instagram, Youtube, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import { SafeImage } from "@/components/shared/safe-image";

export function Footer() {
  const t = useTranslations('Footer');

  return (
    <footer className="hidden md:block bg-card border-t border-border/50 pt-16 pb-8 mt-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <SafeImage 
                src="/assets/hero-bg.png" 
                alt="BookingQube" 
                className="h-8 w-auto object-contain"
              />
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Your premium gateway to the best movies, events, and experiences in the city. Book tickets seamlessly and enjoy exclusive offers.
            </p>
            {/* Social Links - Point 8 (Social earlier/visible) */}
            <div className="flex gap-4">
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10 hover:text-primary">
                <Facebook className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10 hover:text-primary">
                <Twitter className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10 hover:text-primary">
                <Instagram className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10 hover:text-primary">
                <Youtube className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Links - Point 10 (Avoid duplicates) */}
          <div>
            <h3 className="font-display font-semibold mb-6">Movies</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Now Showing</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Coming Soon</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Cinemas</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Experiences</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-display font-semibold mb-6">Support</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">{t('about')}</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">{t('privacy')}</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">{t('terms')}</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">{t('contact')}</a></li>
            </ul>
          </div>

          {/* Newsletter - Point 9 (Phone or Email) */}
          <div>
            <h3 className="font-display font-semibold mb-6">{t('subscribe')}</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Get the latest updates and exclusive offers directly.
            </p>
            <div className="flex gap-2">
              <Input placeholder={t('emailOrPhone')} className="bg-background" />
              <Button size="icon">
                <Mail className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <p>&copy; 2026 BookingQube. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-foreground">{t('privacy')}</a>
            <a href="#" className="hover:text-foreground">{t('terms')}</a>
            <a href="#" className="hover:text-foreground">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
