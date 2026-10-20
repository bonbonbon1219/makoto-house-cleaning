import { NextResponse } from "next/server";
import { createProvisionalBooking } from "@/lib/booking/createBooking";
import { hasDatabase } from "@/lib/db";
import type { SlotId } from "@/lib/booking/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!hasDatabase()) {
    return NextResponse.json({ ok: false, error: "db_not_configured" }, { status: 503 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const result = await createProvisionalBooking({
    date: String(body.date ?? ""),
    slot: String(body.slot ?? "") as SlotId,
    name: String(body.name ?? ""),
    phone: String(body.phone ?? ""),
    email: String(body.email ?? ""),
    area: String(body.area ?? ""),
    otherArea: String(body.otherArea ?? ""),
    service: String(body.service ?? ""),
    message: String(body.message ?? ""),
    estimateNote: String(body.estimateNote ?? ""),
  });

  if (!result.ok) {
    const status =
      result.error === "day_full" || result.error === "slot_closed" ? 409 : 400;
    return NextResponse.json({ ok: false, error: result.error }, { status });
  }

  return NextResponse.json({
    ok: true,
    booking: {
      id: result.booking.id,
      date: result.booking.date,
      slot: result.booking.slot,
      status: result.booking.status,
    },
  });
}
