import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Outfit, Zen_Kaku_Gothic_New } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BackToTop } from "@/components/BackToTop";
import { site } from "@/lib/site";
import "./globals.css";

const display = Outfit({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
});

const body = Zen_Kaku_Gothic_New({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://makoto-cleaning.example"),
  title: {
    default: `${site.brandJa}｜福岡市のエアコン・ハウスクリーニング`,
    template: `%s｜${site.brandJa}`,
  },
  description:
    "福岡市・春日市・那珂川市・大野城市対応。キッチン換気扇の分解洗浄とエアコン洗浄を中心に、ハウスクリーニング一式をご提供します。",
  openGraph: {
    title: `${site.brandJa}｜福岡のハウスクリーニング`,
    description:
      "人気はキッチン換気扇分解洗浄とエアコン洗浄。業務用天井埋め込みにも対応。",
    locale: "ja_JP",
    type: "website",
    siteName: site.brandJa,
    images: [{ url: "/brand/makoto-logo.png", width: 512, height: 512, alt: site.brandFull }],
  },
  icons: {
    icon: [{ url: "/brand/makoto-logo.png" }],
    apple: [{ url: "/brand/makoto-logo.png" }],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f7f6" },
    { media: "(prefers-color-scheme: dark)", color: "#0d1517" },
  ],
  colorScheme: "light dark",
};

const themeBootScript = `
(function(){
  try {
    var saved = localStorage.getItem('makoto-theme');
    var theme = saved === 'light' || saved === 'dark'
      ? saved
      : (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.style.colorScheme = theme;
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className={`${display.variable} ${body.variable}`}>
        <Script id="theme-boot" strategy="beforeInteractive">
          {themeBootScript}
        </Script>
        <a href="#main" className="skipLink">
          本文へスキップ
        </a>
        <div id="top" tabIndex={-1} />
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <BackToTop />
      </body>
    </html>
  );
}
