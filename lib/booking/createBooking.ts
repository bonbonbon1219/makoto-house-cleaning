import { and, eq, inArray, sql } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { availabilityDay, booking } from "@/lib/db/schema";
import { getMailConfig, sendMail } from "@/lib/mail";
import { assertSlotBookable } from "./availability";
import { provisionalCustomerMail, provisionalShopMail } from "./mailCopy";
import { DEFAULT_MAX_JOBS, type SlotId } from "./types";

export type CreateBookingInput = {
  date: string;
  slot: SlotId;
  name: string;
  phone: string;
  email: string;
  area: string;
  otherArea?: string;
  service: string;
  message?: string;
  estimateNote?: string;
};

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export async function createProvisionalBooking(input: CreateBookingInput) {
  if (!DATE_RE.test(input.date)) {
    return { ok: false as const, error: "invalid_date" };
  }
  if (input.slot !== "am" && input.slot !== "pm") {
    return { ok: false as const, error: "invalid_slot" };
  }
  if (!input.name?.trim() || !input.phone?.trim() || !input.email?.trim() || !input.area?.trim() || !input.service?.trim()) {
    return { ok: false as const, error: "missing_fields" };
  }

  const today = new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Tokyo" });
  if (input.date < today) {
    return { ok: false as const, error: "past_date" };
  }

  const check = await assertSlotBookable(input.date, input.slot);
  if (!check.ok) {
    return { ok: false as const, error: check.error };
  }

  const db = getDb();

  // Re-check capacity inside a serializable-ish flow: count then insert if still free.
  const [countRow] = await db
    .select({ count: sql<number>`cast(count(*) as int)` })
    .from(booking)
    .where(
      and(eq(booking.date, input.date), inArray(booking.status, ["provisional", "confirmed"])),
    );

  const [avail] = await db
    .select()
    .from(availabilityDay)
    .where(eq(availabilityDay.date, input.date))
    .limit(1);

  const maxJobs = avail?.maxJobs ?? DEFAULT_MAX_JOBS;
  const closed = avail?.closed ?? false;
  const booked = Number(countRow?.count ?? 0);

  if (closed || booked >= maxJobs) {
    return { ok: false as const, error: "day_full" };
  }

  if (input.slot === "am" && !(avail?.amOpen ?? true)) {
    return { ok: false as const, error: "slot_closed" };
  }
  if (input.slot === "pm" && !(avail?.pmOpen ?? true)) {
    return { ok: false as const, error: "slot_closed" };
  }

  const [created] = await db
    .insert(booking)
    .values({
      status: "provisional",
      date: input.date,
      slot: input.slot,
      name: input.name.trim().slice(0, 120),
      phone: input.phone.trim().slice(0, 40),
      email: input.email.trim().slice(0, 200),
      area: input.area.trim().slice(0, 80),
      otherArea: (input.otherArea ?? "").trim().slice(0, 120),
      service: input.service.trim().slice(0, 200),
      message: (input.message ?? "").trim().slice(0, 4000),
      estimateNote: (input.estimateNote ?? "").trim().slice(0, 2000),
    })
    .returning();

  if (!created) {
    return { ok: false as const, error: "create_failed" };
  }

  const payload = {
    id: created.id,
    status: created.status,
    date: created.date,
    slot: created.slot,
    name: created.name,
    phone: created.phone,
    email: created.email,
    area: created.area,
    otherArea: created.otherArea,
    service: created.service,
    message: created.message,
    estimateNote: created.estimateNote,
  };

  const { mailTo } = getMailConfig();
  try {
    const shop = provisionalShopMail(payload);
    const customer = provisionalCustomerMail(payload);
    if (mailTo) {
      await sendMail({ to: mailTo, subject: shop.subject, text: shop.text, replyTo: created.email });
    }
    await sendMail({ to: created.email, subject: customer.subject, text: customer.text });
  } catch (error) {
    console.error("booking mail failed", error);
    // Booking is kept; admin can still see it.
  }

  return { ok: true as const, booking: created };
}
