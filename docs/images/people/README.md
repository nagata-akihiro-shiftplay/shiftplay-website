# people/

## 用途

代表者・スタッフなど、人物のポートレート写真。

## 推奨サイズ

Companyページの代表挨拶セクションでは、画像枠は横幅最大280px・固定高さ340px(縦長、目安3:4〜4:5)。書き出しは縦1000px以上を推奨(Retina対応)。

## 推奨形式

JPG。

## 使用ページ

- Company(`/company`) の代表挨拶セクション
- Home(`/`) の「会社情報」誘導セクション(2026-08-19、代表挨拶との一貫性のため`teasers/company.jpg`から差し替え)

## 配置済みファイル(2026-07-22納品、同日Lighthouse対応でリサイズ・JPG化)

- `ceo.jpg`(675×900, JPEG q85, 約89KB) — 代表取締役 永田晃大の写真。納品時は`ceo.png`(1086×1448, PNG, 約1.6MB)だったが、LighthouseのImprove image delivery指摘を受けて表示サイズに合わせてリサイズしJPG化した。

## 使用コンポーネント

- [`src/pages/company.astro`](../../../src/pages/company.astro) 内の `astro:assets` の `<Image src="/images/people/ceo.jpg" alt="代表取締役 永田晃大" width={675} height={900} loading="lazy" class="rounded-block h-[320px] w-full object-cover min-[701px]:h-auto min-[701px]:min-h-[360px] min-[701px]:flex-1" />`
- [`src/pages/index.astro`](../../../src/pages/index.astro) の`eyebrow="ABOUT"`側の`HomeTeaser`に`imageSrc="/images/people/ceo.jpg"`として渡している(`src/components/HomeTeaser.astro`内は`object-cover`で表示box形状にトリミングされる)。

## 備考

代表取締役 永田晃大氏の写真は、将来お知らせ(News)の登壇報告記事やTrainingページの講師紹介、OGP画像などにも再利用される可能性があるため、Company専用フォルダにせず役割ベースの`people/`に配置している。スタッフ等が増え人物写真が追加される場合もこのフォルダにまとめる。

`public/images/`配下のためAstroのビルド時最適化は適用されない(ルートのREADME参照)。さらに圧縮したい場合は`src/assets/`へ移して`<Image>`の最適化対象にすることを検討する。
