export type DayMark = "open" | "few" | "full";

export type SlotId = "am" | "pm";

export type DayAvailability = {
  date: string;
  mark: DayMark;
  remaining: number;
  maxJobs: number;
  booked: number;
  closed: boolean;
  amOpen: boolean;
  pmOpen: boolean;
  amBookable: boolean;
  pmBookable: boolean;
};

export const DEFAULT_MAX_JOBS = 2;

export const SLOT_LABEL: Record<SlotId, string> = {
  am: "午前（9:00–12:00）",
  pm: "午後（13:00–18:00）",
};

export const MARK_LABEL: Record<DayMark, string> = {
  open: "〇",
  few: "△",
  full: "×",
};
