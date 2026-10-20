import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { getMonthDays, setDayMark } from "@/lib/booking/availability";
import { tokyoYearMonth, type MarkValue } from "@/lib/booking/types";
import { hasDatabase } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MARKS = new Set<MarkValue>(["open", "few", "full"]);

export async function GET(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  if (!hasDatabase()) {
    return NextResponse.json({ ok: false, error: "db_not_configured" }, { status: 503 });
  }

  const { searchParams } = new URL(request.url);
  let year = Number(searchParams.get("year"));
  let month = Number(searchParams.get("month"));
  const now = tokyoYearMonth();

  if (!Number.isInteger(year) || !Number.isInteger(month) || month < 1 || month > 12) {
    return NextResponse.json({ ok: false, error: "invalid_params" }, { status: 400 });
  }

  if (year < now.year || (year === now.year && month < now.month)) {
    year = now.year;
    month = now.month;
  }

  const days = await getMonthDays(year, month);
  return NextResponse.json({ ok: true, year, month, days, minYear: now.year, minMonth: now.month });
}

export async function PUT(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  if (!hasDatabase()) {
    return NextResponse.json({ ok: false, error: "db_not_configured" }, { status: 503 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const date = String(body.date ?? "");
  const mark = String(body.mark ?? "") as MarkValue;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !MARKS.has(mark)) {
    return NextResponse.json({ ok: false, error: "invalid_input" }, { status: 400 });
  }

  try {
    const day = await setDayMark(date, mark);
    return NextResponse.json({ ok: true, day });
  } catch (error) {
    console.error("mark update failed", error);
    return NextResponse.json({ ok: false, error: "update_failed" }, { status: 500 });
  }
}
