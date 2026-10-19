/** CDN/WAF on Deploy Now blocks larger POSTs; keep each image tiny. */
export const UPLOAD_MAX_BYTES = 7_000;

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("image_load_failed"));
    };
    image.src = url;
  });
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  quality: number,
): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), "image/jpeg", quality);
  });
}

export async function compressImageForUpload(
  file: File,
  maxBytes = UPLOAD_MAX_BYTES,
): Promise<File> {
  if (file.size <= maxBytes && /^image\/jpeg$/i.test(file.type)) {
    return file;
  }

  const image = await loadImage(file);
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) throw new Error("canvas_unavailable");

  let width = image.naturalWidth || image.width;
  let height = image.naturalHeight || image.height;
  const maxEdge = 1280;
  if (width > maxEdge || height > maxEdge) {
    const scale = maxEdge / Math.max(width, height);
    width = Math.max(1, Math.round(width * scale));
    height = Math.max(1, Math.round(height * scale));
  }

  let best: Blob | null = null;

  for (let attempt = 0; attempt < 10; attempt++) {
    canvas.width = width;
    canvas.height = height;
    context.fillStyle = "#fff";
    context.fillRect(0, 0, width, height);
    context.drawImage(image, 0, 0, width, height);

    let low = 0.35;
    let high = 0.85;
    for (let i = 0; i < 8; i++) {
      const quality = (low + high) / 2;
      const blob = await canvasToBlob(canvas, quality);
      if (!blob) break;
      best = blob;
      if (blob.size > maxBytes) {
        high = quality;
      } else {
        low = quality;
      }
    }

    if (best && best.size <= maxBytes) break;

    width = Math.max(240, Math.round(width * 0.75));
    height = Math.max(240, Math.round(height * 0.75));
  }

  if (!best) throw new Error("compress_failed");

  // Last resort: accept slightly over if still failing (should be rare)
  const name = file.name.replace(/\.[^.]+$/, "") || "photo";
  return new File([best], `${name}.jpg`, { type: "image/jpeg", lastModified: Date.now() });
}
