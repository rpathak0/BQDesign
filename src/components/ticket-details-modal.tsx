"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TicketDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  inclusions: string[];
  exclusions: string[];
}

const contentClass =
  "p-0 gap-0 max-h-[85vh] flex flex-col rounded-2xl overflow-hidden";

export function TicketDetailsModal({
  open,
  onOpenChange,
  title,
  inclusions,
  exclusions,
}: TicketDetailsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(contentClass)}
        onPointerDownOutside={(e) => onOpenChange(false)}
        onEscapeKeyDown={() => onOpenChange(false)}
      >
        <DialogTitle className="sr-only">{title} – Details</DialogTitle>
        <DialogDescription className="sr-only">
          Inclusion and exclusion details for this ticket.
        </DialogDescription>

        <div className="px-6 pt-6 pb-2">
          <h2 className="text-xl font-display font-bold text-foreground pr-10">
            {title}
          </h2>
        </div>

        <div className="px-6 pb-6 overflow-y-auto flex-1 min-h-0">
          {inclusions.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-semibold text-foreground mb-2">
                Inclusion:
              </h3>
              <ul className="list-disc list-inside space-y-1.5 text-sm text-muted-foreground">
                {inclusions.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {exclusions.length > 0 && (
            <div className="mt-5">
              <h3 className="text-sm font-semibold text-foreground mb-2">
                Exclusion:
              </h3>
              <ul className="list-disc list-inside space-y-1.5 text-sm text-muted-foreground">
                {exclusions.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="p-6 pt-0 flex justify-center">
          <DialogClose asChild>
            <Button
              variant="outline"
              className="rounded-xl min-w-[120px] border-border bg-background"
            >
              Close
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
