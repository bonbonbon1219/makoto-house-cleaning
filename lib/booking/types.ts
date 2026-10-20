export type MarkValue = "open" | "few" | "full";

export type DayInfo = {
  date: string;
  mark: MarkValue;
  bookable: boolean;
  bookingCount: number;
};

export const MARK_LABEL: Record<MarkValue, string> = {
  open: "〇",
  few: "△",
  full: "×",
};

export const DEFAULT_MARK: MarkValue = "open";

export function demoteMark(mark: MarkValue): MarkValue {
  if (mark === "open") return "few";
  if (mark === "few") return "full";
  return "full";
}

export function tokyoToday(): string {
  return new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Tokyo" });
}

export function tokyoYearMonth(): { year: number; month: number } {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
  }).formatToParts(new Date());
  return {
    year: Number(parts.find((p) => p.type === "year")?.value),
    month: Number(parts.find((p) => p.type === "month")?.value),
  };
}
