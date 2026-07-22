# teasers/

## 用途

Homeの「事業内容」「会社情報」誘導セクション(HomeTeaser)で、見出し・本文・CTAボタンの横に添える、トピックを視覚的に表す画像。

## 推奨サイズ

- デスクトップ表示時の最小高さ: 280px(横幅はレイアウトにより500〜600px程度まで伸びる)
- モバイル表示時の最小高さ: 110px(モバイルでは画像がテキストより先に表示される)
- 書き出しサイズ: 横1200px以上、アスペクト比4:3〜1:1程度を推奨

## 推奨形式

JPG(PNGでも可。ただし写真をPNGで書き出すとファイルサイズが大きくなりやすいため、次回差し替え時はJPGを推奨)。

## 使用ページ

- Home(`/`) のみ(現状)

「事業内容」の画像はServiceページ、「会社情報」の画像はCompanyページの内容を視覚的に表しているため、**将来それらのページ本文にも画像枠が追加された場合に同じファイルを再利用できるよう**、ページ名別フォルダにせずこの役割ベースのフォルダに集約している。

## 配置済みファイル(2026-07-22、2026-07-22にLighthouse対応でリサイズ・JPG化)

- `service.jpg`(1200×800, JPEG q80, 約142KB) — 事業内容の誘導画像。納品時は`service.png`(1536×1024, PNG, 約1.9MB)だったが、LighthouseのLCP計測でHomeのLCP要素かつ配信1.8MB超過分が無駄と判定されたため、表示サイズに合わせてリサイズしJPG化した。
- `company.jpg`(1150×949, JPEG q82, 約156KB) — 会社情報の誘導画像。納品時(1290×1065, 約180KB)から表示サイズに合わせて微リサイズ。

## 使用コンポーネント

- [`src/components/HomeTeaser.astro`](../../../src/components/HomeTeaser.astro) 内の `astro:assets` の `<Image src={imageSrc} alt={imageAlt} width={imageWidth} height={imageHeight} loading={imageLoading} fetchpriority={imageFetchpriority} class="rounded-panel h-full w-full object-cover" />`。`service.jpg`はHomeのLCP要素のため`imageLoading="eager"` `imageFetchpriority="high"`を明示的に渡している(`company.jpg`はデフォルトの`lazy`のまま)。
- 呼び出し元は [`src/pages/index.astro`](../../../src/pages/index.astro) の2箇所(`eyebrow="SERVICE"` と `eyebrow="ABOUT"`)。`imageSrc`/`imageAlt`/`imageWidth`/`imageHeight`の4propで実画像を渡している。
- `public/images/` 配下のため、Astroのビルド時最適化(自動リサイズ・WebP変換等)は適用されない(このディレクトリのルートREADME参照)。さらに圧縮したい場合は`src/assets/`へ移して`<Image>`の最適化対象にすることを検討する。
