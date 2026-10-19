import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { site } from "@/lib/site";

export const runtime = "nodejs";

type ContactBody = {
  name?: string;
  phone?: string;
  email?: string;
  area?: string;
  otherArea?: string;
  service?: string;
  message?: string;
};

function requiredEnv(name: string) {
  const value = process.env[name]?.trim();
  return value || "";
}

export async function POST(request: Request) {
  let body: ContactBody;

  try {
    body = (await request.json()) as ContactBody;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const name = body.name?.trim() ?? "";
  const phone = body.phone?.trim() ?? "";
  const email = body.email?.trim() ?? "";
  const area = body.area?.trim() ?? "";
  const otherArea = body.otherArea?.trim() ?? "";
  const service = body.service?.trim() ?? "";
  const message = body.message?.trim() ?? "";

  if (!name || !phone || !email || !area || !service) {
    return NextResponse.json({ ok: false, error: "missing_fields" }, { status: 400 });
  }

  const smtpUser = requiredEnv("SMTP_USER") || site.email;
  const smtpPass = requiredEnv("SMTP_PASS");
  const smtpHost = requiredEnv("SMTP_HOST") || "smtp.lolipop.jp";
  const smtpPort = Number(requiredEnv("SMTP_PORT") || "465");
  const mailTo = requiredEnv("CONTACT_TO") || site.email;

  if (!smtpPass || !mailTo) {
    return NextResponse.json({ ok: false, error: "mail_not_configured" }, { status: 503 });
  }

  const areaLine = area === "その他地域" && otherArea ? `${area}（${otherArea}）` : area;
  const text = [
    "ホームページお問い合わせ",
    "",
    `お名前: ${name}`,
    `電話番号: ${phone}`,
    `メール: ${email}`,
    `地域: ${areaLine}`,
    `希望メニュー: ${service}`,
    "",
    "メッセージ:",
    message || "（なし）",
  ].join("\n");

  try {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    await transporter.sendMail({
      from: `"${site.brandJa}" <${smtpUser}>`,
      to: mailTo,
      replyTo: email,
      subject: `【お問い合わせ】${service} / ${name}様`,
      text,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("contact mail failed", error);
    return NextResponse.json({ ok: false, error: "send_failed" }, { status: 500 });
  }
}
