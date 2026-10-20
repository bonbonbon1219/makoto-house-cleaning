import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { getMonthAvailability, upsertAvailability } from "@/lib/booking/availability";
import { hasDatabase } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  if (!hasDatabase()) {
    return NextResponse.json({ ok: false, error: "db_not_configured" }, { status: 503 });
  }

  const { searchParams } = new URL(request.url);
  const year = Number(searchParams.get("year"));
  const month = Number(searchParams.get("month"));
  if (!Number.isInteger(year) || !Number.isInteger(month) || month < 1 || month > 12) {
    return NextResponse.json({ ok: false, error: "invalid_params" }, { status: 400 });
  }

  const days = await getMonthAvailability(year, month);
  return NextResponse.json({ ok: true, year, month, days });
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
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ ok: false, error: "invalid_date" }, { status: 400 });
  }

  try {
    const day = await upsertAvailability({
      date,
      maxJobs: Number(body.maxJobs ?? 2),
      amOpen: Boolean(body.amOpen),
      pmOpen: Boolean(body.pmOpen),
      closed: Boolean(body.closed),
      note: String(body.note ?? ""),
    });
    return NextResponse.json({ ok: true, day });
  } catch (error) {
    console.error("availability update failed", error);
    return NextResponse.json({ ok: false, error: "update_failed" }, { status: 500 });
  }
}
