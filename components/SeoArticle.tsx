import Link from "next/link";
import { areaServiceLinks, areaSlugByName, serviceAreaLinks, serviceCluster, type SeoPage } from "@/lib/seoContent";
import { site } from "@/lib/site";
import { BreadcrumbJsonLd } from "@/components/BreadcrumbJsonLd";
import { LegalPage } from "@/components/LegalPage";
import styles from "@/components/LegalPage.module.css";

type Props = {
  page: SeoPage;
  parent: { href: string; label: string };
};

export function SeoArticle({ page, parent }: Props) {
  const city = Object.entries(areaSlugByName).find(([, slug]) => slug === page.slug)?.[0];
  const menuLinks = city ? areaServiceLinks(city) : serviceCluster.filter((item) => item.href !== `/services/${page.slug}`);

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

        {parent.href === "/services" ? (
          <>
            <h2>対応エリア</h2>
            <p>{site.areas.join("・")}を中心に伺います。近隣もご相談ください。</p>
            <ul>
              {serviceAreaLinks(page.h1).map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </>
        ) : null}

        <h2>{city ? "このエリアでよく依頼されるメニュー" : "関連するサービス"}</h2>
        <ul>
          {menuLinks.map((item) => (
            <li key={item.href}>
              <Link href={item.href}>{item.label}</Link>
            </li>
          ))}
          <li>
            <Link href={parent.href}>{city ? "対応エリア一覧" : "ハウスクリーニングのサービス一覧"}</Link>
          </li>
        </ul>

        <h2>予約・お問い合わせ</h2>
        <p>
          希望日の空きは
          <Link href="/booking">オンライン予約</Link>
          で確認できます。内容の相談は
          <Link href="/#contact">お問い合わせ</Link>
          、電話
          <a href={`tel:${site.phoneTel}`}>{site.phone}</a>
          、メール
          <a href={`mailto:${site.email}`}>{site.email}</a>
          でも受けています。
        </p>
        <p className={styles.note}>{site.hours}</p>
      </LegalPage>
    </>
  );
}
