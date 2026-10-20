import { NextResponse } from "next/server";
import { getMonthAvailability } from "@/lib/booking/availability";
import { hasDatabase } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!hasDatabase()) {
    return NextResponse.json({ ok: false, error: "db_not_configured" }, { status: 503 });
  }

  const { searchParams } = new URL(request.url);
  const year = Number(searchParams.get("year"));
  const month = Number(searchParams.get("month"));

  if (!Number.isInteger(year) || !Number.isInteger(month) || month < 1 || month > 12) {
    return NextResponse.json({ ok: false, error: "invalid_params" }, { status: 400 });
  }

  try {
    const days = await getMonthAvailability(year, month);
    return NextResponse.json({ ok: true, year, month, days });
  } catch (error) {
    console.error("availability failed", error);
    return NextResponse.json({ ok: false, error: "fetch_failed" }, { status: 500 });
  }
}
