"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface StepItem {
  id: string;
  title: string;
  description: string;
  icon?: ReactNode;
}

interface StepsSectionProps {
  title: string;
  steps: StepItem[];
  className?: string;
}

export function StepsSection({ title, steps, className }: StepsSectionProps) {
  return (
    <section className={cn("py-12 md:py-16", className)}>
      <div className="container mx-auto px-4 sm:px-5 md:px-6">
        <h2 className="text-2xl md:text-3xl font-display font-bold text-center text-foreground mb-10">
          {title}
        </h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <div key={step.id} className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-3">
                {step.icon ?? <span className="font-display font-bold">{i + 1}</span>}
              </div>
              <h3 className="font-semibold text-foreground mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
