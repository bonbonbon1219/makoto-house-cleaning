import { and, eq, gte, inArray, lte, sql } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { booking, dayMark } from "@/lib/db/schema";
import {
  DEFAULT_MARK,
  demoteMark,
  type DayInfo,
  type MarkValue,
  tokyoToday,
} from "./types";

function eachDate(from: string, to: string): string[] {
  const dates: string[] = [];
  const [fy, fm, fd] = from.split("-").map(Number);
  const [ty, tm, td] = to.split("-").map(Number);
  const cursor = new Date(Date.UTC(fy, fm - 1, fd));
  const end = new Date(Date.UTC(ty, tm - 1, td));
  while (cursor <= end) {
    const y = cursor.getUTCFullYear();
    const m = String(cursor.getUTCMonth() + 1).padStart(2, "0");
    const d = String(cursor.getUTCDate()).padStart(2, "0");
    dates.push(`${y}-${m}-${d}`);
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return dates;
}

export async function getMonthDays(year: number, month: number): Promise<DayInfo[]> {
  const from = `${year}-${String(month).padStart(2, "0")}-01`;
  const lastDay = new Date(year, month, 0).getDate();
  const to = `${year}-${String(month).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;
  return getRangeDays(from, to);
}

export async function getRangeDays(from: string, to: string): Promise<DayInfo[]> {
  const db = getDb();
  const dates = eachDate(from, to);
  const today = tokyoToday();

  const [marks, counts] = await Promise.all([
    db
      .select()
      .from(dayMark)
      .where(and(gte(dayMark.date, from), lte(dayMark.date, to))),
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

  const markMap = new Map(marks.map((row) => [row.date, row.mark as MarkValue]));
  const countMap = new Map(counts.map((row) => [row.date, Number(row.count)]));

  return dates.map((date) => {
    const mark = markMap.get(date) ?? DEFAULT_MARK;
    const bookingCount = countMap.get(date) ?? 0;
    const bookable = mark !== "full" && date >= today;
    return { date, mark, bookable, bookingCount };
  });
}

export async function getDayMark(date: string): Promise<MarkValue> {
  const db = getDb();
  const [row] = await db.select().from(dayMark).where(eq(dayMark.date, date)).limit(1);
  return (row?.mark as MarkValue | undefined) ?? DEFAULT_MARK;
}

export async function setDayMark(date: string, mark: MarkValue) {
  const db = getDb();
  await db
    .insert(dayMark)
    .values({ date, mark, updatedAt: new Date() })
    .onConflictDoUpdate({
      target: dayMark.date,
      set: { mark, updatedAt: new Date() },
    });

  const [day] = await getRangeDays(date, date);
  return day;
}

export async function demoteDayMark(date: string): Promise<MarkValue> {
  const current = await getDayMark(date);
  const next = demoteMark(current);
  await setDayMark(date, next);
  return next;
}
