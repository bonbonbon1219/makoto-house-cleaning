import { site } from "@/lib/site";
import { MARK_LABEL, type MarkValue } from "./types";

export type BookingMailPayload = {
  id: string;
  status: string;
  date: string;
  name: string;
  phone: string;
  email: string;
  address?: string;
  area: string;
  otherArea?: string;
  service: string;
  message?: string;
  estimateNote?: string;
  adminNote?: string;
  markAfter?: MarkValue;
};

function areaLine(payload: BookingMailPayload) {
  return payload.otherArea ? `${payload.area}（${payload.otherArea}）` : payload.area;
}

function baseLines(payload: BookingMailPayload) {
  return [
    `予約ID: ${payload.id}`,
    `状態: ${payload.status}`,
    `希望日: ${payload.date}`,
    `お名前: ${payload.name}`,
    `電話: ${payload.phone}`,
    `メール: ${payload.email}`,
    payload.address ? `住所: ${payload.address}` : null,
    `地域: ${areaLine(payload)}`,
    `メニュー: ${payload.service}`,
    payload.estimateNote ? `見積メモ: ${payload.estimateNote}` : null,
    "",
    "メッセージ:",
    payload.message || "（なし）",
  ].filter((line): line is string => line !== null);
}

export function provisionalShopMail(payload: BookingMailPayload) {
  const markNote = payload.markAfter
    ? `カレンダー表示は自動で「${MARK_LABEL[payload.markAfter]}」に更新しました。`
    : null;
  return {
    subject: `【仮予約】${payload.service} / ${payload.name}様 / ${payload.date}`,
    text: [
      "ホームページから仮予約が入りました。管理画面で確定してください。",
      markNote,
      "",
      ...baseLines(payload),
      "",
      "管理画面: https://makoto-hk.com/admin/bookings",
    ]
      .filter((line): line is string => line !== null)
      .join("\n"),
  };
}

export function provisionalCustomerMail(payload: BookingMailPayload) {
  return {
    subject: `【仮予約を受付ました】${site.brandJa}`,
    text: [
      `${payload.name} 様`,
      "",
      `${site.brandJa}です。仮予約を受け付けました。`,
      "内容を確認のうえ、確定のご連絡をいたします。時間帯は別途調整する場合があります。",
      "",
      ...baseLines(payload),
      "",
      "※まだ確定ではありません。",
      "",
      `電話: ${site.phone}`,
      `メール: ${site.email}`,
    ].join("\n"),
  };
}

export function confirmedCustomerMail(payload: BookingMailPayload) {
  return {
    subject: `【ご予約確定】${site.brandJa} / ${payload.date}`,
    text: [
      `${payload.name} 様`,
      "",
      "ご予約が確定しました。当日お伺いします。",
      "",
      ...baseLines(payload),
      payload.adminNote ? `\n店舗メモ:\n${payload.adminNote}` : null,
      "",
      `電話: ${site.phone}`,
      `メール: ${site.email}`,
    ]
      .filter((line): line is string => line !== null)
      .join("\n"),
  };
}

export function cancelledCustomerMail(payload: BookingMailPayload) {
  return {
    subject: `【予約キャンセル】${site.brandJa} / ${payload.date}`,
    text: [
      `${payload.name} 様`,
      "",
      "ご予約をキャンセルいたしました。",
      "改めてのご希望は、サイトの予約ページまたはお電話でご連絡ください。",
      "",
      ...baseLines(payload),
      "",
      `電話: ${site.phone}`,
      `メール: ${site.email}`,
    ].join("\n"),
  };
}
