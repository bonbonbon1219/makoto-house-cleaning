import { NextResponse } from "next/server";
import { and, desc, eq, gte, lte } from "drizzle-orm";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import {
  cancelledCustomerMail,
  confirmedCustomerMail,
} from "@/lib/booking/mailCopy";
import { getDb, hasDatabase } from "@/lib/db";
import { booking, type BookingStatus } from "@/lib/db/schema";
import { getMailConfig, sendMail } from "@/lib/mail";

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
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const status = searchParams.get("status") as BookingStatus | null;

  const db = getDb();
  const conditions = [];
  if (from) conditions.push(gte(booking.date, from));
  if (to) conditions.push(lte(booking.date, to));
  if (status && ["provisional", "confirmed", "cancelled"].includes(status)) {
    conditions.push(eq(booking.status, status));
  }

  const rows = await db
    .select()
    .from(booking)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(desc(booking.date), desc(booking.createdAt))
    .limit(200);

  return NextResponse.json({ ok: true, bookings: rows });
}

export async function PATCH(request: Request) {
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

  const id = String(body.id ?? "");
  const nextStatus = String(body.status ?? "") as BookingStatus;
  const adminNote = body.adminNote !== undefined ? String(body.adminNote) : undefined;

  if (!id) {
    return NextResponse.json({ ok: false, error: "missing_id" }, { status: 400 });
  }
  if (nextStatus && !["provisional", "confirmed", "cancelled"].includes(nextStatus)) {
    return NextResponse.json({ ok: false, error: "invalid_status" }, { status: 400 });
  }

  const db = getDb();
  const [existing] = await db.select().from(booking).where(eq(booking.id, id)).limit(1);
  if (!existing) {
    return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
  }

  const [updated] = await db
    .update(booking)
    .set({
      status: nextStatus || existing.status,
      adminNote: adminNote ?? existing.adminNote,
      updatedAt: new Date(),
    })
    .where(eq(booking.id, id))
    .returning();

  if (!updated) {
    return NextResponse.json({ ok: false, error: "update_failed" }, { status: 500 });
  }

  const payload = {
    id: updated.id,
    status: updated.status,
    date: updated.date,
    name: updated.name,
    phone: updated.phone,
    email: updated.email,
    area: updated.area,
    otherArea: updated.otherArea,
    service: updated.service,
    message: updated.message,
    estimateNote: updated.estimateNote,
    adminNote: updated.adminNote,
  };

  try {
    if (nextStatus === "confirmed" && existing.status !== "confirmed") {
      const mail = confirmedCustomerMail(payload);
      await sendMail({ to: updated.email, subject: mail.subject, text: mail.text });
      const { mailTo } = getMailConfig();
      if (mailTo) {
        await sendMail({
          to: mailTo,
          subject: `【予約確定済】${updated.service} / ${updated.name}様 / ${updated.date}`,
          text: mail.text,
        });
      }
    }
    if (nextStatus === "cancelled" && existing.status !== "cancelled") {
      const mail = cancelledCustomerMail(payload);
      await sendMail({ to: updated.email, subject: mail.subject, text: mail.text });
    }
  } catch (error) {
    console.error("booking status mail failed", error);
  }

  return NextResponse.json({ ok: true, booking: updated });
}
