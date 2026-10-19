import Image, { type ImageProps } from "next/image";

type Props = ImageProps & {
  /** 画面外の写真は遅延読み込み（priority 時は無効） */
  eager?: boolean;
};

/**
 * サイト共通の画像設定。
 * 新しい写真は WebP 推奨（npm run optimize-images）。
 */
export function OptimizedImage({
  priority,
  eager,
  quality,
  loading,
  decoding = "async",
  ...props
}: Props) {
  const isPriority = Boolean(priority || eager);

  return (
    <Image
      {...props}
      priority={isPriority || undefined}
      loading={isPriority ? "eager" : loading ?? "lazy"}
      quality={quality ?? (isPriority ? 75 : 68)}
      decoding={decoding}
    />
  );
}
