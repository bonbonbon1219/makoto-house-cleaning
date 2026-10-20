import { NextResponse } from "next/server";
import { getMonthDays } from "@/lib/booking/availability";
import { tokyoYearMonth } from "@/lib/booking/types";
import { hasDatabase } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
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

  // Disallow requesting months before the current Tokyo month.
  if (year < now.year || (year === now.year && month < now.month)) {
    year = now.year;
    month = now.month;
  }

  try {
    const days = await getMonthDays(year, month);
    return NextResponse.json({ ok: true, year, month, days, minYear: now.year, minMonth: now.month });
  } catch (error) {
    console.error("availability failed", error);
    return NextResponse.json({ ok: false, error: "fetch_failed" }, { status: 500 });
  }
}
