"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import styles from "@/app/admin/admin.module.css";

export function AdminChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin");
    router.refresh();
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.topBar}>
        <p className={styles.brand}>真HK 管理</p>
        <nav className={styles.nav} aria-label="管理メニュー">
          <Link href="/admin/calendar" data-active={pathname?.startsWith("/admin/calendar") ? "true" : "false"}>
            〇△×カレンダー
          </Link>
          <Link href="/admin/bookings" data-active={pathname?.startsWith("/admin/bookings") ? "true" : "false"}>
            予約一覧
          </Link>
          <Link href="/booking">公開ページ</Link>
          <button type="button" onClick={logout}>
            ログアウト
          </button>
        </nav>
      </div>
      {children}
    </div>
  );
}
