import Link from "next/link";
import type { SeoPage } from "@/lib/seoContent";
import { site } from "@/lib/site";
import { BreadcrumbJsonLd } from "@/components/BreadcrumbJsonLd";
import { LegalPage } from "@/components/LegalPage";
import styles from "@/components/LegalPage.module.css";

type Props = {
  page: SeoPage;
  parent: { href: string; label: string };
};

export function SeoArticle({ page, parent }: Props) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "ホーム", path: "/" },
          { name: parent.label, path: parent.href },
          { name: page.h1 },
        ]}
      />
      <LegalPage
        title={page.h1}
        description={page.lead}
        updatedAt={site.legal.updatedAt}
        crumbs={[
          { href: "/", label: "ホーム" },
          { href: parent.href, label: parent.label },
          { label: page.h1 },
        ]}
      >
        {page.sections.map((section) => (
          <section key={section.heading}>
            <h2>{section.heading}</h2>
            {section.paragraphs?.map((text) => (
              <p key={text}>{text}</p>
            ))}
            {section.bullets?.length ? (
              <ul>
                {section.bullets.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}

        <h2>関連リンク</h2>
        <ul>
          {page.related.map((item) => (
            <li key={item.href}>
              <Link href={item.href}>{item.label}</Link>
            </li>
          ))}
        </ul>

        <h2>お問い合わせ</h2>
        <p>
          電話：
          <a href={`tel:${site.phoneTel}`}>{site.phone}</a>
          ／メール：
          <a href={`mailto:${site.email}`}>{site.email}</a>
          ／
          <Link href="/#contact">お問い合わせフォーム</Link>
        </p>
        <p className={styles.note}>{site.hours}</p>
      </LegalPage>
    </>
  );
}
