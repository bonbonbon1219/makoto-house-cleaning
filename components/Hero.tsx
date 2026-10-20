import { site } from "@/lib/site";
import { OptimizedImage } from "@/components/OptimizedImage";
import styles from "./Hero.module.css";

export function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="hero-brand">
      <div className={styles.media} aria-hidden="true">
        <OptimizedImage
          src="/hero-kitchen.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className={styles.image}
        />
        <div className={styles.shade} />
        <div className={styles.wash} />
      </div>

      <div className={`container ${styles.content}`}>
        <p id="hero-brand" className={styles.brand}>
          <span className={styles.brandEn}>{site.brandEn}</span>
          <span className={styles.brandJa}>{site.brandJa}</span>
        </p>
        <h1 className={styles.title}>
          <span className={styles.titleSeo}>福岡市周辺のエアコン・ハウスクリーニング</span>
          <span className={styles.titleCatch}>
            換気扇も、エアコンも。
            <br />
            中まで、きちんと。
          </span>
        </h1>
        <p className={styles.lead}>
          {site.tagline}
          福岡市7区・春日市・那珂川市・大野城市・太宰府市・筑紫野市・糸島市に対応します。
        </p>
        <div className={styles.actions}>
          <div className={styles.call}>
            <a href={`tel:${site.phoneTel}`} className="btn btn-primary">
              電話で相談する {site.phone}
            </a>
            <p className={styles.phoneNote}>{site.phoneNote}</p>
          </div>
          <a href="/#contact" className="btn btn-ghost">
            フォームで問い合わせ
          </a>
        </div>
      </div>
    </section>
  );
}
