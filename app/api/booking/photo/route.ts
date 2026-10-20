import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { getMailConfig } from "@/lib/mail";
import { parseUploadImages } from "@/lib/parseUploadImages";
import { site } from "@/lib/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_form" }, { status: 400 });
  }

  const bookingId = String(formData.get("bookingId") ?? "").trim();
  const date = String(formData.get("date") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const service = String(formData.get("service") ?? "").trim();
  const index = String(formData.get("index") ?? "").trim();
  const total = String(formData.get("total") ?? "").trim();

  if (!bookingId || !name || !email || !service) {
    return NextResponse.json({ ok: false, error: "missing_fields" }, { status: 400 });
  }

  const parsed = await parseUploadImages(formData);
  if (!parsed.ok) {
    return NextResponse.json({ ok: false, error: parsed.error }, { status: 400 });
  }
  if (!parsed.images.length) {
    return NextResponse.json({ ok: false, error: "missing_image" }, { status: 400 });
  }

  const { smtpUser, smtpPass, smtpHost, smtpPort, mailTo } = getMailConfig();
  if (!smtpPass || !mailTo) {
    return NextResponse.json({ ok: false, error: "mail_not_configured" }, { status: 503 });
  }

  const label = index && total ? `${index}/${total}` : "1";
  const text = [
    "ホームページ仮予約（写真）",
    "",
    `予約ID: ${bookingId}`,
    date ? `希望日: ${date}` : null,
    `お名前: ${name}`,
    `電話: ${phone}`,
    `メール: ${email}`,
    `メニュー: ${service}`,
    `写真: ${label}`,
  ]
    .filter((line): line is string => line !== null)
    .join("\n");

  try {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: { user: smtpUser, pass: smtpPass },
    });

    await transporter.sendMail({
      from: `"${site.brandJa}" <${smtpUser}>`,
      to: mailTo,
      replyTo: email,
      subject: `【仮予約写真】${service} / ${name}様 / ${bookingId.slice(0, 8)}`,
      text,
      attachments: parsed.images.map((image) => ({
        filename: image.filename,
        content: image.content,
        contentType: image.contentType,
      })),
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("booking photo mail failed", error);
    return NextResponse.json({ ok: false, error: "send_failed" }, { status: 500 });
  }
}
