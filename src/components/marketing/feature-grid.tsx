"use client";

import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface FeatureGridItem {
  id: string;
  title: string;
  description: string;
  icon?: ReactNode;
}

interface FeatureGridProps {
  title?: string;
  items: FeatureGridItem[];
  columns?: 2 | 3 | 4;
  className?: string;
}

export function FeatureGrid({ title, items, columns = 3, className }: FeatureGridProps) {
  return (
    <section className={cn("py-12 md:py-16", className)}>
      <div className="container mx-auto px-4 sm:px-5 md:px-6">
        {title && (
          <h2 className="text-2xl md:text-3xl font-display font-bold text-center text-foreground mb-10">
            {title}
          </h2>
        )}
        <div
          className={cn(
            "grid gap-6",
            columns === 2 && "md:grid-cols-2",
            columns === 3 && "md:grid-cols-3",
            columns === 4 && "md:grid-cols-2 lg:grid-cols-4"
          )}
        >
          {items.map((item) => (
            <Card key={item.id} className="rounded-xl border bg-card">
              <CardContent className="p-6">
                {item.icon && <div className="mb-3 text-primary">{item.icon}</div>}
                <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
