"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ApplyButtonProps
  extends Omit<React.ComponentProps<typeof Button>, "disabled"> {
  disabled: boolean;
  children?: React.ReactNode;
}

export function ApplyButton({
  disabled,
  className,
  children = "Apply",
  ...props
}: ApplyButtonProps) {
  return (
    <Button
      type="button"
      disabled={disabled}
      className={cn(
        "w-full rounded-xl font-semibold",
        disabled &&
          "bg-muted text-muted-foreground cursor-not-allowed opacity-70",
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
}
