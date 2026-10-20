const MAX_IMAGES = 1;
const MAX_IMAGE_BYTES = 100 * 1024;

const ALLOWED_EXT = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp"]);

export type ValidImage = {
  filename: string;
  contentType: string;
  content: Buffer;
};

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

export async function parseUploadImages(
  formData: FormData,
): Promise<{ ok: true; images: ValidImage[] } | { ok: false; error: string }> {
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
