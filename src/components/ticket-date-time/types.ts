/**
 * Data model for the ticket date/time picker.
 * Map from API/event dateTimeOptions (DateOption[]) when integrating.
 */

export type DayAvailability = {
  dateISO: string; // "2026-02-06"
  price: number;
  currency: string;
  soldOut: boolean;
  slots: TimeSlotItem[];
};

export type TimeSlotItem = {
  id?: string;
  start: string; // "06:00"
  end: string;   // "07:00"
  price: number;
  available: boolean;
  fastSelling?: boolean;
};

export type TicketDateTimeApplyResult = {
  selectedDate: string;   // dateISO
  selectedSlot: TimeSlotItem;
  price: number;
};
