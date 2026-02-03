# Ticket Date/Time Picker – theme tokens

- **Modal shell**: Uses `Dialog` from `@/components/ui/dialog`. Overlay is `bg-black/80`; to use a lighter “dark translucent gray”, override in `TicketDateTimeModal` via `DialogOverlay` (if you switch to a custom portal) or in `dialog.tsx`: e.g. `bg-black/60` or `bg-neutral-900/70`.
- **Corners**: Modal uses `rounded-2xl` (16px). For 20px use `rounded-[20px]` on `DialogContent` in `TicketDateTimeModal`.
- **Padding**: `px-6 pt-6 pb-6 md:px-8 md:pt-8 md:pb-8` (24–32px). Adjust in `TicketDateTimeModal.tsx`.
- **Primary / disabled button**: `ApplyButton` uses `Button` with `variant="default"`; disabled state uses `bg-muted text-muted-foreground`. Tweak in `ApplyButton.tsx` or via `buttonVariants` in `@/components/ui/button`.
- **Sold-out calendar cells**: Orange styling uses `border-orange-500`, `bg-orange-50`, `text-orange-700` (and dark variants). To align with a design token, replace with e.g. `border-destructive`, `bg-destructive/10`, `text-destructive` or add `--sold-out-*` in `global.css` and reference in `TwoMonthCalendar.tsx`.
- **Info banner**: Peach-style bar uses `bg-orange-50 dark:bg-orange-950/30`. Change in `TwoMonthCalendar.tsx` to match your “notice” or “warning” surface token.
