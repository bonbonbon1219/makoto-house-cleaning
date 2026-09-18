import Image from "next/image";
import { site } from "@/lib/site";
import styles from "./Hero.module.css";

export function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="hero-brand">
      <div className={styles.media} aria-hidden="true">
        <Image
          src="/hero-kitchen.jpg"
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
          換気扇も、エアコンも。
          <br />
          中まで、きちんと。
        </h1>
        <p className={styles.lead}>{site.tagline}</p>
        <div className={styles.actions}>
          <a href={`tel:${site.phoneTel}`} className="btn btn-primary">
            電話で相談する {site.phone}
          </a>
          <a href="/#contact" className="btn btn-ghost">
            フォームで問い合わせ
          </a>
        </div>
      </div>
    </section>
  );
}
