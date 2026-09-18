# 真（Makoto）ハウスクリーニング

福岡市・春日市・那珂川市・大野城市向けの公式サイト（Next.js）。

## 起動

```bash
npm install
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

## 公開前に差し替える項目

- 電話番号（現在は仮: `070-7480-0510`）… `lib/site.ts`
- 料金表の確定金額 … `lib/site.ts`
- 問い合わせフォームの送信先（メール / LINE / フォームサービス）
- 施工写真（ヒーローやサービス紹介）

## 技術

- Next.js (App Router)
- TypeScript
- CSS Modules
