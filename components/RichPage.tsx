import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/BreadcrumbJsonLd";
import {
  areaServiceLinks,
  areaSlugByName,
  serviceAreaLinks,
  serviceCluster,
  type SeoPage,
  type SeoSection,
} from "@/lib/seoContent";
import { site } from "@/lib/site";
import styles from "./RichPage.module.css";

export const richPageUpdatedAt = "2026年10月26日";

type Crumb = { href?: string; label: string };

type LayoutProps = {
  kicker: string;
  title: string;
  catchLine?: string;
  lead: string;
  crumbs: Crumb[];
  jsonLd?: Record<string, unknown>[];
  children: React.ReactNode;
};

function splitLead(lead: string) {
  const parts = lead.split("。").map((part) => part.trim()).filter(Boolean);
  if (parts.length < 2) return { catchLine: undefined, rest: lead };
  return { catchLine: `${parts[0]}。`, rest: `${parts.slice(1).join("。")}。` };
}

function flowFromParagraph(text: string) {
  const sentences = text.split("。").map((part) => part.trim()).filter(Boolean);
  const index = sentences.findIndex((sentence) => sentence.includes("→"));
  if (index < 0) return { steps: null as string[] | null, rest: text };
  const clause = sentences[index].split("、の順")[0];
  const steps = clause.split("→").map((step) => step.trim()).filter(Boolean);
  if (steps.length < 3) return { steps: null, rest: text };
  const rest = sentences.filter((_, sentenceIndex) => sentenceIndex !== index).map((sentence) => `${sentence}。`).join("");
  return { steps: steps.map((step) => (step.endsWith("。") ? step : `${step}。`)), rest };
}

function bulletCard(item: string) {
  const index = item.indexOf("：");
  if (index > 0 && index <= 28) {
    return { title: item.slice(0, index), body: item.slice(index + 1) };
  }
  return { title: item, body: "" };
}

function isContactOnly(section: SeoSection) {
  return section.heading === "お問い合わせ" && !section.bullets?.length && (section.paragraphs?.length ?? 0) <= 1;
}

export function RichLayout({ kicker, title, catchLine, lead, crumbs, jsonLd = [], children }: LayoutProps) {
  return (
    <>
      <BreadcrumbJsonLd
        items={crumbs.map((crumb) => ({ name: crumb.label, ...(crumb.href ? { path: crumb.href } : {}) }))}
      />
      {jsonLd.map((data, index) => (
        <script key={String(data["@type"] ?? index)} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
      ))}

      <article className={styles.page}>
        <div className="container">
          <nav className={styles.crumbs} aria-label="パンくずリスト">
            <ol>
              {crumbs.map((crumb) => (
                <li key={crumb.label}>
                  {crumb.href ? <Link href={crumb.href}>{crumb.label}</Link> : <span>{crumb.label}</span>}
                </li>
              ))}
            </ol>
          </nav>

          <header className={styles.hero}>
            <p className={styles.kicker}>{kicker}</p>
            <h1>{title}</h1>
            {catchLine ? <p className={styles.catch}>{catchLine}</p> : null}
            <p className={styles.lead}>{lead}</p>
            <div className={styles.actions}>
              <Link href="/booking" className="btn btn-primary">
                オンライン予約
              </Link>
              <a href={`tel:${site.phoneTel}`} className="btn btn-outline">
                電話 {site.phone}
              </a>
            </div>
            <p className={styles.phoneNote}>{site.phoneNote}</p>
            <p className={styles.updated}>最終更新日：{richPageUpdatedAt}</p>
          </header>

          {children}

          <section className={styles.section} aria-labelledby="contact-title">
            <h2 id="contact-title">予約・お問い合わせ</h2>
            <p className={styles.intro}>
              希望日の空きはオンライン予約で確認できます。内容の相談はお問い合わせ、電話、メールでも受けています。
            </p>
            <div className={styles.actions}>
              <Link href="/booking" className="btn btn-primary">
                オンライン予約
              </Link>
              <Link href="/#contact" className="btn btn-outline">
                お問い合わせ
              </Link>
            </div>
            <p className={styles.phoneNote}>
              <a href={`tel:${site.phoneTel}`}>{site.phone}</a>
              {" · "}
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </p>
            <p className={styles.phoneNote}>{site.hours}</p>
          </section>
        </div>
      </article>
    </>
  );
}

function ContentSection({ section }: { section: SeoSection }) {
  if (isContactOnly(section)) return null;
  const pieces = (section.paragraphs ?? []).map(flowFromParagraph);
  const steps = pieces.flatMap((piece) => piece.steps ?? []);
  const paragraphs = pieces.map((piece) => piece.rest).filter(Boolean);
  if (!paragraphs.length && !steps.length && !section.bullets?.length) return null;

  return (
    <section className={styles.section} aria-labelledby={section.heading}>
      <h2 id={section.heading}>{section.heading}</h2>
      {paragraphs.map((text) => (
        <p key={text} className={styles.intro}>
          {text}
        </p>
      ))}
      {steps.length ? (
        <ol className={styles.steps}>
          {steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      ) : null}
      {section.bullets?.length ? (
        <div className={styles.cards}>
          {section.bullets.map((item) => {
            const card = bulletCard(item);
            return (
              <section key={item} className={styles.card}>
                <h3>{card.title}</h3>
                {card.body ? <p>{card.body}</p> : null}
              </section>
            );
          })}
        </div>
      ) : null}
    </section>
  );
}

export function RichPage({ page, parent, kicker }: { page: SeoPage; parent: { href: string; label: string }; kicker: string }) {
  const city = Object.entries(areaSlugByName).find(([, slug]) => slug === page.slug)?.[0];
  const { catchLine, rest } = splitLead(page.lead);
  const path = `${parent.href}/${page.slug}`;
  const serviceLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: page.h1,
    description: page.description,
    url: `https://makoto-hk.com${path}`,
    provider: {
      "@type": "LocalBusiness",
      name: site.brandJa,
      telephone: site.phone,
      email: site.email,
      url: "https://makoto-hk.com",
    },
    areaServed: city ? { "@type": "City", name: city } : site.areas.map((name) => ({ "@type": "City", name })),
  };

  return (
    <RichLayout
      kicker={kicker}
      title={page.h1}
      catchLine={catchLine}
      lead={rest}
      crumbs={[
        { href: "/", label: "ホーム" },
        { href: parent.href, label: parent.label },
        { label: page.h1 },
      ]}
      jsonLd={[serviceLd]}
    >
      {page.sections.map((section) => (
        <ContentSection key={section.heading} section={section} />
      ))}

      {city ? (
        <section className={styles.section} aria-labelledby="menu-title">
          <h2 id="menu-title">このエリアでよく依頼されるメニュー</h2>
          <ul className={styles.menus}>
            {areaServiceLinks(city).map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
            <li>
              <Link href="/areas">対応エリア一覧</Link>
            </li>
          </ul>
        </section>
      ) : (
        <>
          <section className={styles.section} aria-labelledby="area-title">
            <h2 id="area-title">対応エリア</h2>
            <p className={styles.intro}>{site.areas.join("・")}を中心に伺います。近隣もご相談ください。</p>
            <ul className={styles.menus}>
              {serviceAreaLinks(page.h1).map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </section>
          <section className={styles.section} aria-labelledby="related-title">
            <h2 id="related-title">関連するサービス</h2>
            <ul className={styles.menus}>
              {serviceCluster
                .filter((item) => item.href !== `/services/${page.slug}`)
                .map((item) => (
                  <li key={item.href}>
                    <Link href={item.href}>{item.label}</Link>
                  </li>
                ))}
              <li>
                <Link href="/services">サービス一覧</Link>
              </li>
            </ul>
          </section>
        </>
      )}
    </RichLayout>
  );
}
