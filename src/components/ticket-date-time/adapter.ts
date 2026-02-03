import type { DateOption, TimeSlot } from "@/data/events";
import type { DayAvailability, TimeSlotItem } from "./types";

/**
 * Map event dateTimeOptions (DateOption[]) to DayAvailability[] for the picker.
 * Use this when integrating with EventDetail.dateTimeOptions.
 */
export function dateTimeOptionsToAvailability(
  options: DateOption[] | undefined
): DayAvailability[] {
  if (!options?.length) return [];
  return options.map((opt) => {
    const slots: TimeSlotItem[] = (opt.timeSlots as TimeSlot[]).map((t) => ({
      id: t.id,
      start: t.start,
      end: t.end,
      price: t.price,
      available: !t.soldOut,
      fastSelling: t.fastSelling,
    }));
    const soldOut =
      opt.timeSlots.length > 0 &&
      opt.timeSlots.every((t) => (t as TimeSlot).soldOut);
    const firstSlot = opt.timeSlots[0] as TimeSlot | undefined;
    const currency = firstSlot?.currency ?? "QAR";
    const price = opt.fromPrice ?? firstSlot?.price ?? 0;
    return {
      dateISO: opt.dateKey,
      price,
      currency,
      soldOut,
      slots,
    };
  });
}
