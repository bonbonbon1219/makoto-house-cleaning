import { site } from "@/lib/site";
import styles from "./Trust.module.css";

const items = [
  {
    title: "地域密着",
    text: `${site.areas.join("・")}を中心に対応`,
  },
  {
    title: "分解洗浄",
    text: "見えにくい内部まで丁寧に仕上げ",
  },
  {
    title: "明朗な料金",
    text: "税込料金を明示し、変更時は事前にご説明",
  },
  {
    title: "安心の対応",
    text: "養生から確認まで、最後まで同席可能",
  },
] as const;

export function Trust() {
  return (
    <section className={styles.section} aria-label="安心のポイント">
      <div className={`container ${styles.grid}`}>
        {items.map((item) => (
          <div key={item.title} className={styles.item}>
            <p className={styles.title}>{item.title}</p>
            <p className={styles.text}>{item.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
