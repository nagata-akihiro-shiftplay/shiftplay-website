# og/

## 用途

X(Twitter)/Facebook/LINE・チャットツール等でページURLをシェアした際に表示されるリンクプレビュー画像(Open Graph / Twitter Card用)。ページ本文には表示されない、メタデータ専用の画像。

## 推奨サイズ

1200×630px(OGP標準比率 1.91:1)。

## 推奨形式

JPG推奨(ファイルサイズを抑えるため)。PNGでも可だが8MB以下を目安にする。

## 現在のステータス(2026-07-22更新)

**このフォルダは現在空。** 当初はAI生成の仮バナー画像(`og-image.png`)を全ページ共通デフォルトとして置いていたが、実ロゴ(`public/logo.png`)が納品されたタイミングで、`src/layouts/BaseLayout.astro`の`ogImage` propのデフォルト値を`/logo.png`に変更した(仮バナーは削除)。そのため全ページのOGP画像は現状ロゴそのものになっている。

## 使用ページ

全8ページ共通(`BaseLayout.astro`の`ogImage` propのデフォルト値経由)。将来ページ単位で専用のOGP画像を出したい場合のみ、該当ページの`<BaseLayout ogImage="...">`で上書きする。

## 使用コンポーネント

- [`src/layouts/BaseLayout.astro`](../../../src/layouts/BaseLayout.astro)(`ogImage` propのデフォルト値 → `og:image` / `twitter:image`)

## 備考

将来、ロゴ単体ではなくタグライン入りの専用OGPバナー(1200×630、ブランドカラー背景+ロゴ+コピー等)を作る場合は、このフォルダに`og-image.jpg`のように追加し、`BaseLayout.astro`のデフォルト値をそちらに向ける。ページ単位で専用画像を出したい場合(例: Downloadページで資料の表紙画像を見せたい等)は、このフォルダに`og-download.jpg`のように追加し、該当ページの`ogImage` propで個別に指定する。
