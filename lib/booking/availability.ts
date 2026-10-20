import { and, eq, gte, inArray, lte, ne, sql } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { availabilityDay, booking } from "@/lib/db/schema";
import {
  DEFAULT_MAX_JOBS,
  type DayAvailability,
  type DayMark,
  type SlotId,
} from "./types";

function markFromRemaining(remaining: number, closed: boolean): DayMark {
  if (closed || remaining <= 0) return "full";
  if (remaining === 1) return "few";
  return "open";
}

function emptyDay(date: string): DayAvailability {
  return {
    date,
    mark: "open",
    remaining: DEFAULT_MAX_JOBS,
    maxJobs: DEFAULT_MAX_JOBS,
    booked: 0,
    closed: false,
    amOpen: true,
    pmOpen: true,
    amBookable: true,
    pmBookable: true,
  };
}

function eachDate(from: string, to: string): string[] {
  const dates: string[] = [];
  const cursor = new Date(`${from}T00:00:00+09:00`);
  const end = new Date(`${to}T00:00:00+09:00`);
  while (cursor <= end) {
    const y = cursor.getFullYear();
    const m = String(cursor.getMonth() + 1).padStart(2, "0");
    const d = String(cursor.getDate()).padStart(2, "0");
    dates.push(`${y}-${m}-${d}`);
    cursor.setDate(cursor.getDate() + 1);
  }
  return dates;
}

export async function getMonthAvailability(year: number, month: number): Promise<DayAvailability[]> {
  const from = `${year}-${String(month).padStart(2, "0")}-01`;
  const lastDay = new Date(year, month, 0).getDate();
  const to = `${year}-${String(month).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;
  return getRangeAvailability(from, to);
}

export async function getRangeAvailability(from: string, to: string): Promise<DayAvailability[]> {
  const db = getDb();
  const dates = eachDate(from, to);

  const [rows, counts] = await Promise.all([
    db
      .select()
      .from(availabilityDay)
      .where(and(gte(availabilityDay.date, from), lte(availabilityDay.date, to))),
    db
      .select({
        date: booking.date,
        count: sql<number>`cast(count(*) as int)`,
      })
      .from(booking)
      .where(
        and(
          gte(booking.date, from),
          lte(booking.date, to),
          inArray(booking.status, ["provisional", "confirmed"]),
        ),
      )
      .groupBy(booking.date),
  ]);

  const byDate = new Map(rows.map((row) => [row.date, row]));
  const bookedByDate = new Map(counts.map((row) => [row.date, Number(row.count)]));

  return dates.map((date) => {
    const row = byDate.get(date);
    const maxJobs = row?.maxJobs ?? DEFAULT_MAX_JOBS;
    const closed = row?.closed ?? false;
    const amOpen = row?.amOpen ?? true;
    const pmOpen = row?.pmOpen ?? true;
    const booked = bookedByDate.get(date) ?? 0;
    const remaining = closed ? 0 : Math.max(0, maxJobs - booked);
    const mark = markFromRemaining(remaining, closed);
    const hasCapacity = remaining > 0 && !closed;

    return {
      date,
      mark,
      remaining,
      maxJobs,
      booked,
      closed,
      amOpen,
      pmOpen,
      amBookable: hasCapacity && amOpen,
      pmBookable: hasCapacity && pmOpen,
    };
  });
}

export async function getDayAvailability(date: string): Promise<DayAvailability> {
  const [day] = await getRangeAvailability(date, date);
  return day ?? emptyDay(date);
}

export async function assertSlotBookable(date: string, slot: SlotId) {
  const day = await getDayAvailability(date);
  if (day.mark === "full" || day.remaining <= 0) {
    return { ok: false as const, error: "day_full", day };
  }
  if (slot === "am" && !day.amBookable) {
    return { ok: false as const, error: "slot_closed", day };
  }
  if (slot === "pm" && !day.pmBookable) {
    return { ok: false as const, error: "slot_closed", day };
  }
  return { ok: true as const, day };
}

export async function upsertAvailability(input: {
  date: string;
  maxJobs: number;
  amOpen: boolean;
  pmOpen: boolean;
  closed: boolean;
  note?: string;
}) {
  const db = getDb();
  const maxJobs = Math.max(0, Math.min(20, Math.floor(input.maxJobs)));

  await db
    .insert(availabilityDay)
    .values({
      date: input.date,
      maxJobs,
      amOpen: input.amOpen,
      pmOpen: input.pmOpen,
      closed: input.closed,
      note: input.note ?? "",
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: availabilityDay.date,
      set: {
        maxJobs,
        amOpen: input.amOpen,
        pmOpen: input.pmOpen,
        closed: input.closed,
        note: input.note ?? "",
        updatedAt: new Date(),
      },
    });

  return getDayAvailability(input.date);
}

export async function countActiveOnDate(date: string) {
  const db = getDb();
  const [row] = await db
    .select({ count: sql<number>`cast(count(*) as int)` })
    .from(booking)
    .where(and(eq(booking.date, date), ne(booking.status, "cancelled")));
  return Number(row?.count ?? 0);
}
