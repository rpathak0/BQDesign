"use client";

import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface CTABlockItem {
  id: string;
  title: string;
  description: string;
  buttonLabel: string;
  buttonHref?: string;
  onButtonClick?: () => void;
  icon?: ReactNode;
}

interface CTABlocksProps {
  title?: string;
  blocks: CTABlockItem[];
  className?: string;
}

export function CTABlocks({ title, blocks, className }: CTABlocksProps) {
  return (
    <section className={cn("py-12 md:py-16", className)}>
      <div className="container mx-auto px-4 sm:px-5 md:px-6">
        {title && (
          <h2 className="text-2xl md:text-3xl font-display font-bold text-center text-foreground mb-10">
            {title}
          </h2>
        )}
        <div className="grid gap-6 md:grid-cols-2 max-w-3xl mx-auto">
          {blocks.map((block) => (
            <Card key={block.id} className="rounded-xl border bg-card">
              <CardContent className="p-6 text-center">
                {block.icon && <div className="mb-3 flex justify-center text-primary">{block.icon}</div>}
                <h3 className="font-semibold text-foreground mb-2">{block.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{block.description}</p>
                {block.buttonHref ? (
                  <Button asChild>
                    <a href={block.buttonHref}>{block.buttonLabel}</a>
                  </Button>
                ) : (
                  <Button onClick={block.onButtonClick}>{block.buttonLabel}</Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
