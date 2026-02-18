"use client";

import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SectionHeroProps {
  title: string;
  subtitle?: string;
  primaryCta?: { label: string; href?: string; onClick?: () => void };
  secondaryCta?: { label: string; href?: string; onClick?: () => void };
  className?: string;
  children?: ReactNode;
}

export function SectionHero({
  title,
  subtitle,
  primaryCta,
  secondaryCta,
  className,
  children,
}: SectionHeroProps) {
  return (
    <section
      className={cn(
        "relative py-16 md:py-24 overflow-hidden",
        "bg-gradient-to-br from-primary/15 via-background to-primary/5 dark:from-primary/20 dark:to-primary/5",
        "border-b border-border/50",
        className
      )}
    >
      <div className="container mx-auto px-4 sm:px-5 md:px-6 text-center max-w-3xl">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold tracking-tight text-foreground">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-4 text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
            {subtitle}
          </p>
        )}
        {(primaryCta || secondaryCta) && (
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {primaryCta && (
              primaryCta.href ? (
                <Button asChild>
                  <a href={primaryCta.href}>{primaryCta.label}</a>
                </Button>
              ) : (
                <Button onClick={primaryCta.onClick}>{primaryCta.label}</Button>
              )
            )}
            {secondaryCta && (
              secondaryCta.href ? (
                <Button variant="outline" asChild>
                  <a href={secondaryCta.href}>{secondaryCta.label}</a>
                </Button>
              ) : (
                <Button variant="outline" onClick={secondaryCta.onClick}>
                  {secondaryCta.label}
                </Button>
              )
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
