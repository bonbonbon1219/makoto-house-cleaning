import { getDb } from "@/lib/db";
import { booking } from "@/lib/db/schema";
import { getMailConfig, sendMail } from "@/lib/mail";
import { demoteDayMark, getDayMark } from "./availability";
import { provisionalCustomerMail, provisionalShopMail } from "./mailCopy";
import { tokyoToday } from "./types";

export type CreateBookingInput = {
  date: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  area?: string;
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
  if (
    !input.name?.trim() ||
    !input.phone?.trim() ||
    !input.email?.trim() ||
    !input.address?.trim() ||
    !input.service?.trim()
  ) {
    return { ok: false as const, error: "missing_fields" };
  }

  const today = tokyoToday();
  if (input.date < today) {
    return { ok: false as const, error: "past_date" };
  }

  const mark = await getDayMark(input.date);
  if (mark === "full") {
    return { ok: false as const, error: "day_full" };
  }

  const db = getDb();
  const [created] = await db
    .insert(booking)
    .values({
      status: "provisional",
      date: input.date,
      name: input.name.trim().slice(0, 120),
      phone: input.phone.trim().slice(0, 40),
      email: input.email.trim().slice(0, 200),
      address: input.address.trim().slice(0, 300),
      area: (input.area ?? "").trim().slice(0, 80),
      otherArea: (input.otherArea ?? "").trim().slice(0, 120),
      service: input.service.trim().slice(0, 200),
      message: (input.message ?? "").trim().slice(0, 4000),
      estimateNote: (input.estimateNote ?? "").trim().slice(0, 2000),
    })
    .returning();

  if (!created) {
    return { ok: false as const, error: "create_failed" };
  }

  const markAfter = await demoteDayMark(input.date);

  const payload = {
    id: created.id,
    status: created.status,
    date: created.date,
    name: created.name,
    phone: created.phone,
    email: created.email,
    address: created.address,
    area: created.area,
    otherArea: created.otherArea,
    service: created.service,
    message: created.message,
    estimateNote: created.estimateNote,
    markAfter,
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
  }

  return { ok: true as const, booking: created, markAfter };
}
