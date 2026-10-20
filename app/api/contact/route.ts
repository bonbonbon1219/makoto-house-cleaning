import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { site } from "@/lib/site";

export const runtime = "nodejs";

const MAX_IMAGES = 1; // photos are sent one-by-one (CDN body limit)
const MAX_IMAGE_BYTES = 100 * 1024;

const ALLOWED_EXT = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp"]);

type ValidImage = {
  filename: string;
  contentType: string;
  content: Buffer;
};

function requiredEnv(name: string) {
  const value = process.env[name]?.trim();
  return value || "";
}

function extensionOf(filename: string) {
  const match = filename.toLowerCase().match(/\.[a-z0-9]+$/);
  return match?.[0] ?? "";
}

function sniffImageType(buffer: Buffer): "image/jpeg" | "image/png" | "image/webp" | null {
  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return "image/jpeg";
  }

  if (
    buffer.length >= 8 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return "image/png";
  }

  if (
    buffer.length >= 12 &&
    buffer.toString("ascii", 0, 4) === "RIFF" &&
    buffer.toString("ascii", 8, 12) === "WEBP"
  ) {
    return "image/webp";
  }

  return null;
}

function safeFilename(name: string, contentType: string, index: number) {
  const base = name
    .replace(/[^\w.\-()+ ]+/g, "_")
    .replace(/\s+/g, "_")
    .slice(0, 80);

  const ext =
    contentType === "image/png" ? ".png" : contentType === "image/webp" ? ".webp" : ".jpg";

  if (ALLOWED_EXT.has(extensionOf(base))) {
    return base;
  }

  return `photo-${index + 1}${ext}`;
}

async function parseImages(formData: FormData): Promise<
  { ok: true; images: ValidImage[] } | { ok: false; error: string }
> {
  const files = formData
    .getAll("photos")
    .filter((entry): entry is File => typeof File !== "undefined" && entry instanceof File);

  if (files.length > MAX_IMAGES) {
    return { ok: false, error: "too_many_images" };
  }

  const images: ValidImage[] = [];

  for (const [index, file] of files.entries()) {
    if (!file.size) continue;

    if (file.size > MAX_IMAGE_BYTES) {
      return { ok: false, error: "image_too_large" };
    }

    const declaredMime = (file.type || "").toLowerCase();
    const ext = extensionOf(file.name || "");

    if (declaredMime && !ALLOWED_MIME.has(declaredMime)) {
      return { ok: false, error: "invalid_image_type" };
    }

    if (ext && !ALLOWED_EXT.has(ext)) {
      return { ok: false, error: "invalid_image_type" };
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const sniffed = sniffImageType(buffer);

    if (!sniffed || !ALLOWED_MIME.has(sniffed)) {
      return { ok: false, error: "invalid_image_type" };
    }

    if (declaredMime && declaredMime !== sniffed) {
      return { ok: false, error: "invalid_image_type" };
    }

    images.push({
      filename: safeFilename(file.name || `photo-${index + 1}`, sniffed, index),
      contentType: sniffed,
      content: buffer,
    });
  }

  return { ok: true, images };
}

export async function POST(request: Request) {
  let formData: FormData;

  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_form" }, { status: 400 });
  }

  const clip = (value: string, max: number) => value.trim().slice(0, max);
  const name = clip(String(formData.get("name") ?? ""), 80);
  const phone = clip(String(formData.get("phone") ?? ""), 40);
  const email = clip(String(formData.get("email") ?? ""), 120);
  const area = clip(String(formData.get("area") ?? ""), 300);
  const otherArea = clip(String(formData.get("otherArea") ?? ""), 80);
  const service = clip(String(formData.get("service") ?? ""), 80);
  const message = clip(String(formData.get("message") ?? ""), 4000);
  const reference = clip(String(formData.get("reference") ?? ""), 40);
  const company = clip(String(formData.get("company") ?? ""), 120);
  const floorPlan = clip(String(formData.get("floorPlan") ?? ""), 40);
  const dueDate = clip(String(formData.get("dueDate") ?? ""), 80);
  const keyHandover = clip(String(formData.get("keyHandover") ?? ""), 200);
  const isBusiness = String(formData.get("inquiryType") ?? "").trim() === "business";
  const photoFollowUp = String(formData.get("photoFollowUp") ?? "").trim() === "1";
  const photoCount = String(formData.get("photoCount") ?? "").trim();

  if (!name || !phone || !email || !area || !service || (isBusiness && !company)) {
    return NextResponse.json({ ok: false, error: "missing_fields" }, { status: 400 });
  }

  const parsedImages = await parseImages(formData);
  if (!parsedImages.ok) {
    return NextResponse.json({ ok: false, error: parsedImages.error }, { status: 400 });
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
  const imageNote =
    parsedImages.images.length > 0
      ? `添付写真: ${parsedImages.images.length}枚`
      : photoFollowUp
        ? "添付写真: あり"
        : photoCount && photoCount !== "0"
          ? `添付写真: 別メールで${photoCount}枚送信予定`
          : "添付写真: なし";

  const text = [
    isBusiness
      ? "ホームページ 法人・管理会社からのご相談"
      : photoFollowUp
        ? "ホームページお問い合わせ（写真）"
        : "ホームページお問い合わせ",
    "",
    reference ? `お問い合わせ番号: ${reference}` : null,
    company ? `会社名: ${company}` : null,
    isBusiness ? `担当者名: ${name}` : `お名前: ${name}`,
    `電話番号: ${phone}`,
    `メール: ${email}`,
    isBusiness ? `物件所在地: ${areaLine}` : `地域: ${areaLine}`,
    floorPlan ? `間取り: ${floorPlan}` : null,
    dueDate ? `希望完了日: ${dueDate}` : null,
    keyHandover ? `鍵の受け渡し: ${keyHandover}` : null,
    `希望メニュー: ${service}`,
    imageNote,
    "",
    "メッセージ:",
    message || "（なし）",
  ]
    .filter((line): line is string => line !== null)
    .join("\n");

  const subject = isBusiness
    ? `【法人のご依頼】${service} / ${company}`
    : photoFollowUp
      ? `【お問い合わせ写真】${service} / ${name}様${reference ? ` / ${reference}` : ""}`
      : `【お問い合わせ】${service} / ${name}様${reference ? ` / ${reference}` : ""}`;

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
      subject,
      text,
      attachments: parsedImages.images.map((image) => ({
        filename: image.filename,
        content: image.content,
        contentType: image.contentType,
      })),
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("contact mail failed", error);
    return NextResponse.json({ ok: false, error: "send_failed" }, { status: 500 });
  }
}
