"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminChrome } from "@/components/admin/AdminChrome";
import { tokyoToday } from "@/lib/booking/types";
import styles from "../admin.module.css";

type BookingRow = {
  id: string;
  status: "provisional" | "confirmed" | "cancelled";
  date: string;
  name: string;
  phone: string;
  email: string;
  area: string;
  otherArea: string;
  service: string;
  message: string;
  estimateNote: string;
  adminNote: string;
};

const STATUS_LABEL = {
  provisional: "仮予約",
  confirmed: "確定",
  cancelled: "キャンセル",
} as const;

export default function AdminBookingsPage() {
  const router = useRouter();
  const [status, setStatus] = useState<"all" | BookingRow["status"]>("provisional");
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState("");
  const today = useMemo(() => tokyoToday(), []);

  async function load() {
    setError("");
    const params = new URLSearchParams();
    if (status !== "all") params.set("status", status);
    const res = await fetch(`/api/admin/bookings?${params}`, { cache: "no-store" });
    if (res.status === 401) {
      router.push("/admin");
      return;
    }
    const data = (await res.json()) as { ok?: boolean; bookings?: BookingRow[]; error?: string };
    if (!res.ok || !data.ok || !data.bookings) {
      setError("読み込みに失敗しました");
      return;
    }
    setBookings(data.bookings);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  async function patch(id: string, next: Partial<Pick<BookingRow, "status" | "adminNote">>) {
    setBusyId(id);
    setError("");
    try {
      const res = await fetch("/api/admin/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...next }),
      });
      if (res.status === 401) {
        router.push("/admin");
        return;
      }
      const data = (await res.json()) as { ok?: boolean };
      if (!res.ok || !data.ok) throw new Error("failed");
      await load();
    } catch {
      setError("更新に失敗しました");
    } finally {
      setBusyId("");
    }
  }

  function badgeClass(s: BookingRow["status"]) {
    if (s === "provisional") return styles.badgeProvisional;
    if (s === "confirmed") return styles.badgeConfirmed;
    return styles.badgeCancelled;
  }

  return (
    <AdminChrome>
      <div className={styles.card}>
        <h1 className={styles.title}>予約一覧</h1>
        <p className={styles.lead}>
          仮予約を確認し、必要なら電話で時間を調整してから確定してください。確定・キャンセル時はお客へメールします。
        </p>

        <div className={styles.filters}>
          {(
            [
              ["provisional", "仮予約"],
              ["confirmed", "確定"],
              ["cancelled", "キャンセル"],
              ["all", "すべて"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              className={status === value ? "btn btn-primary" : "btn"}
              onClick={() => setStatus(value)}
            >
              {label}
            </button>
          ))}
        </div>

        {error ? <p className={styles.error}>{error}</p> : null}

        <div className={styles.list}>
          {bookings.length === 0 ? <p className={styles.meta}>該当する予約はありません。</p> : null}
          {bookings.map((item) => (
            <article key={item.id} className={styles.item}>
              <div className={styles.itemHead}>
                <strong>
                  {item.date}
                  {item.date === today ? "（今日）" : ""}
                </strong>
                <span className={`${styles.badge} ${badgeClass(item.status)}`}>
                  {STATUS_LABEL[item.status]}
                </span>
              </div>
              <p className={styles.meta}>
                {item.name} / {item.phone} / {item.email}
              </p>
              <p className={styles.meta}>
                {item.area}
                {item.otherArea ? `（${item.otherArea}）` : ""} · {item.service}
              </p>
              {item.estimateNote ? <p className={styles.meta}>見積: {item.estimateNote}</p> : null}
              {item.message ? <p className={styles.meta}>備考: {item.message}</p> : null}
              <label className={styles.label}>
                店舗メモ
                <textarea
                  className={styles.textarea}
                  defaultValue={item.adminNote}
                  onBlur={(e) => {
                    if (e.target.value !== item.adminNote) {
                      patch(item.id, { adminNote: e.target.value });
                    }
                  }}
                />
              </label>
              <div className={styles.actions}>
                {item.status !== "confirmed" ? (
                  <button
                    type="button"
                    className={styles.primary}
                    disabled={busyId === item.id}
                    onClick={() => patch(item.id, { status: "confirmed" })}
                  >
                    確定する
                  </button>
                ) : null}
                {item.status !== "cancelled" ? (
                  <button
                    type="button"
                    disabled={busyId === item.id}
                    onClick={() => patch(item.id, { status: "cancelled" })}
                  >
                    キャンセル
                  </button>
                ) : null}
                {item.status === "cancelled" ? (
                  <button
                    type="button"
                    disabled={busyId === item.id}
                    onClick={() => patch(item.id, { status: "provisional" })}
                  >
                    仮予約に戻す
                  </button>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </div>
    </AdminChrome>
  );
}
