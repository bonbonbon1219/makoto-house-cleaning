"use client";

import { useMemo, useState } from "react";
import {
  calcSetDiscount,
  calcWallAcTotal,
  estimateItems,
  estimateRules,
} from "@/lib/site";
import { saveEstimateDraft } from "@/lib/estimateHandoff";
import styles from "./Estimate.module.css";

type QtyState = Record<string, number>;

function yen(value: number) {
  return `${value.toLocaleString("ja-JP")}円`;
}

function initialQty(): QtyState {
  return Object.fromEntries(estimateItems.map((item) => [item.id, 0]));
}

function ItemRow({
  item,
  value,
  disabled,
  disabledReason,
  nested,
  onChange,
}: {
  item: (typeof estimateItems)[number];
  value: number;
  disabled?: boolean;
  disabledReason?: string;
  nested?: boolean;
  onChange: (next: number) => void;
}) {
  return (
    <div className={`${styles.row} ${nested ? styles.rowNested : ""}`}>
      <div className={styles.info}>
        <p className={styles.name}>{item.name}</p>
        <p className={styles.hint}>{item.hint}</p>
        {disabled && disabledReason ? <p className={styles.lock}>{disabledReason}</p> : null}
      </div>
      <div className={styles.stepper}>
        <button
          type="button"
          className={styles.stepBtn}
          onClick={() => onChange(value - 1)}
          aria-label={`${item.name}を減らす`}
          disabled={disabled || value <= 0}
        >
          −
        </button>
        <span className={styles.qty} aria-live="polite">
          {value}
        </span>
        <button
          type="button"
          className={styles.stepBtn}
          onClick={() => onChange(value + 1)}
          aria-label={`${item.name}を増やす`}
          disabled={disabled}
        >
          ＋
        </button>
      </div>
    </div>
  );
}

export function Estimate() {
  const [qty, setQty] = useState<QtyState>(initialQty);
  const kitchenSelected = (qty.kitchen ?? 0) > 0;

  const summary = useMemo(() => {
    let subtotal = 0;
    let totalSets = 0;
    let wallAcQty = 0;
    let otherQty = 0;
    const lines: { id: string; name: string; qty: number; amount: number; detail: string }[] = [];
    const kitchenQty = qty.kitchen ?? 0;

    for (const item of estimateItems) {
      if (item.id === "range-hood" && kitchenQty > 0) continue;

      const n = qty[item.id] ?? 0;
      if (n <= 0) continue;
      totalSets += n;

      if (item.pricingType === "wallAc") {
        wallAcQty += n;
        const amount = calcWallAcTotal(n);
        subtotal += amount;
        lines.push({
          id: item.id,
          name: item.name,
          qty: n,
          amount,
          detail:
            n === 1
              ? `基本 ${yen(estimateRules.wallAcFirst)}`
              : `1台目${yen(estimateRules.wallAcFirst)}＋2台目以降${yen(estimateRules.wallAcExtra)}×${n - 1}`,
        });
      } else {
        otherQty += n;
        const amount = item.unitPrice * n;
        subtotal += amount;
        lines.push({
          id: item.id,
          name: item.name,
          qty: n,
          amount,
          detail:
            item.id === "kitchen"
              ? `${yen(item.unitPrice)} × ${n}（換気扇分解洗浄込み）`
              : `${yen(item.unitPrice)} × ${n}`,
        });
      }
    }

    const hasNonWallAc = otherQty > 0;
    const discount = calcSetDiscount(totalSets, hasNonWallAc);
    const total = Math.max(0, subtotal - discount);

    let discountLabel = "なし";
    if (discount === estimateRules.setDiscountThreePlus) {
      discountLabel = `3セット以上 −${yen(estimateRules.setDiscountThreePlus)}`;
    } else if (discount === estimateRules.setDiscountTwo) {
      discountLabel = `2セット −${yen(estimateRules.setDiscountTwo)}`;
    } else if (wallAcQty >= 2 && otherQty === 0) {
      discountLabel = "壁掛けエアコンは2台目以降7,000円で計算済み";
    }

    return { lines, subtotal, discount, discountLabel, total, totalSets };
  }, [qty]);

  function update(id: string, next: number) {
    setQty((prev) => {
      const value = Math.max(0, Math.min(20, next));
      const nextState = { ...prev, [id]: value };
      if (id === "kitchen" && value > 0) {
        nextState["range-hood"] = 0;
      }
      return nextState;
    });
  }

  function goContact() {
    if (summary.lines.length === 0) {
      document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    const lineText = summary.lines
      .map((line) => `・${line.name} × ${line.qty}（${line.detail}／${yen(line.amount)}）`)
      .join("\n");

    const discountText =
      summary.discount > 0 ? `セット割：−${yen(summary.discount)}\n` : "";

    const message = [
      "【自動見積の内容】",
      lineText,
      `小計：${yen(summary.subtotal)}`,
      `セット数：${summary.totalSets}`,
      discountText.trimEnd(),
      `合計（税込）：${yen(summary.total)}`,
      "",
      "※希望日・エリアなどがあれば追記してください。",
    ]
      .filter((line) => line !== "")
      .join("\n");

    const main = summary.lines[0]?.name ?? "その他・相談";
    let service = "その他・相談";
    if (main.includes("エアコン")) service = "エアコン洗浄";
    else if (main.includes("レンジフード") || main.includes("キッチン")) {
      service = "レンジフード・換気扇分解洗浄";
    } else if (main.includes("浴室") || main.includes("トイレ")) {
      service = "浴室・トイレ";
    }

    saveEstimateDraft({
      message,
      service,
      totalLabel: yen(summary.total),
    });

    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  }

  const airconItems = estimateItems.filter((item) =>
    ["wall-ac", "auto-ac", "ceiling-ac"].includes(item.id),
  );
  const wetItems = estimateItems.filter((item) => ["bath", "toilet"].includes(item.id));
  const kitchenParent = estimateItems.find((item) => item.id === "kitchen");
  const kitchenChild = estimateItems.find((item) => item.id === "range-hood");

  return (
    <section id="estimate" className={`section ${styles.section}`}>
      <div className="container">
        <div className="section-head">
          <p className="section-kicker">Estimate</p>
          <h2 className="section-title">かんたん自動見積</h2>
          <p className="section-lead">
            台数・件数を選ぶと料金が出ます。キッチン全体にはレンジフード・換気扇分解洗浄が含まれます。壁掛けエアコン（通常）は2台目以降7,000円です。
          </p>
        </div>

        <div className={styles.layout}>
          <div className={styles.menu}>
            {airconItems.map((item) => (
              <ItemRow
                key={item.id}
                item={item}
                value={qty[item.id] ?? 0}
                onChange={(next) => update(item.id, next)}
              />
            ))}

            {kitchenParent && kitchenChild ? (
              <div className={styles.kitchenGroup}>
                <p className={styles.groupLabel}>キッチン</p>
                <ItemRow
                  item={kitchenParent}
                  value={qty.kitchen ?? 0}
                  onChange={(next) => update("kitchen", next)}
                />
                <ItemRow
                  item={kitchenChild}
                  value={qty["range-hood"] ?? 0}
                  nested
                  disabled={kitchenSelected}
                  disabledReason="キッチン全体を選択中のため、単品は不要です"
                  onChange={(next) => update("range-hood", next)}
                />
              </div>
            ) : null}

            {wetItems.map((item) => (
              <ItemRow
                key={item.id}
                item={item}
                value={qty[item.id] ?? 0}
                onChange={(next) => update(item.id, next)}
              />
            ))}
          </div>

          <aside className={styles.summary} aria-live="polite">
            <p className={styles.summaryKicker}>見積サマリー</p>
            {summary.lines.length === 0 ? (
              <p className={styles.empty}>メニューの件数を選ぶと、ここに金額が表示されます。</p>
            ) : (
              <ul className={styles.lines}>
                {summary.lines.map((line) => (
                  <li key={line.id}>
                    <div>
                      <strong>
                        {line.name} × {line.qty}
                      </strong>
                      <span>{line.detail}</span>
                    </div>
                    <em>{yen(line.amount)}</em>
                  </li>
                ))}
              </ul>
            )}

            <dl className={styles.totals}>
              <div>
                <dt>小計</dt>
                <dd>{yen(summary.subtotal)}</dd>
              </div>
              <div>
                <dt>セット数</dt>
                <dd>{summary.totalSets}</dd>
              </div>
              <div>
                <dt>セット割</dt>
                <dd>{summary.discount > 0 ? `−${yen(summary.discount)}` : "−"}</dd>
              </div>
              <div className={styles.grand}>
                <dt>合計（税込）</dt>
                <dd>{yen(summary.total)}</dd>
              </div>
            </dl>

            <p className={styles.note}>{summary.discountLabel}</p>
            <p className={styles.note}>
              表示は税込です。汚れ・機種により変わる場合は、作業前にご説明します。
            </p>
            <button
              type="button"
              className={`btn btn-primary ${styles.cta}`}
              onClick={goContact}
              disabled={summary.lines.length === 0}
            >
              この内容で問い合わせる
            </button>
          </aside>
        </div>
      </div>
    </section>
  );
}
