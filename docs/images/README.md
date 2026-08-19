# images/ ディレクトリ構成

サイト全体で使う実写真・OGP画像を、**掲載ページ単位ではなく「役割・再利用性」単位**で管理する。実際の画像ファイルは `public/images/` 配下に置くが、このドキュメント一式(用途・推奨サイズ等)は `public/` に置くと本番サイトから直接閲覧できてしまうため、`docs/images/` に配置している(2026-07-22、公開前チェックで発覚し移動)。フォルダ構成は `public/images/` と1対1で対応する。

## 方針

現在実装済みの8ページ(Home / Service / Training / Company / News / Download / Contact / Privacy)のうち、実際に画像枠(`ImagePlaceholder`)が存在するのは以下の4箇所のみ:

| 画像                     | 現在の使用ページ                                 | フォルダ                        |
| ------------------------ | ------------------------------------------------ | ------------------------------- |
| 事業内容の誘導画像       | Home(将来的にServiceページでも使う可能性あり)    | [`teasers/`](teasers/README.md) |
| 会社情報の誘導画像       | Home(将来的にCompanyページでも使う可能性あり)    | [`teasers/`](teasers/README.md) |
| 代表者(永田晃大氏)の写真 | Company(将来的にNews/Trainingでも使う可能性あり) | [`people/`](people/README.md)   |

Home のヒーローは写真ではなくロボットの顔+周回粒子のビジュアル([`HeroVisual.astro`](../../src/components/HeroVisual.astro))を採用したため、現状 [`hero/`](hero/README.md) に配置が必要な画像は無い(将来他ページに写真ヒーローを追加する場合の置き場所として維持)。

これに加えて、ページ本文には表示されないがSNSシェア時に必要な OGP/Twitter Card 用画像を [`og/`](og/README.md) にまとめている。

Service / Training / News / Download / Contact / Privacy には現状デザイン上どこにも画像枠が無いため、対応するフォルダは作成していない。将来これらのページに画像枠が追加された場合は、ページ名でフォルダを作らず、その画像の**役割**で判断して既存フォルダに追加する(例: ページ上部のキービジュアルなら `hero/`、本文中の添え画像なら `teasers/`、人物写真なら `people/`)。既存のどの役割にも当てはまらない場合のみ、新しい役割フォルダを追記する。

## ロゴについて

全8ページのヘッダー・フッターで共通使用するロゴは、このディレクトリには含めない。単一ファイル `public/logo.png` で管理する(`src/components/Logo.astro` が参照。当初の計画は`logo.svg`だったが、2026-07-22に納品された実ロゴが透過PNGだったため`.png`で管理している)。ロゴはサイズ違いや複数バリエーションの管理が発生しない単一アセットのため、フォルダ化していない。全ページ共通のOGP画像のデフォルトにも同じファイルを使っている(`BaseLayout.astro`の`ogImage`propのデフォルト値、詳細は[`og/README.md`](og/README.md)参照)。

## 実装時の注意(astro:assets について)

`public/images/` 配下のファイルは静的URLとしてそのまま配信され、Astroのビルド時画像最適化(自動リサイズ・WebP変換等)の対象には**ならない**。`CLAUDE.md` が指定する `astro:assets` の `<Image />` で最適化まで行いたい場合は、実装時に画像を `src/assets/images/` 側へ複製・移動してインポートする形に切り替える。まずは納品された写真をこの `public/images/` 配下にサイズ・形式の目安に沿って配置し、`ImagePlaceholder` を `<Image />` に置き換える際にどちらの方式にするか判断する。

## 現在のステータス(2026-07-22更新)

`teasers/`(`service.jpg`)・`people/`(`ceo.jpg`)の2枚を配置し、`ImagePlaceholder`から実画像への差し替えが完了した。Homeの「会社情報」誘導セクションは2026-08-19、代表挨拶との一貫性のため`teasers/company.jpg`から`people/ceo.jpg`に差し替え、`company.jpg`は削除した。納品時のPNGはLighthouse対応で表示サイズにリサイズ・JPG化済み(詳細は各フォルダのREADMEを参照)。`hero/`はHomeのヒーローがロボットの顔+周回粒子のビジュアル([`HeroVisual.astro`](../../src/components/HeroVisual.astro))を採用しているため引き続き配置不要。`og/`は実ロゴ納品に伴い仮バナー(`og-image.png`)を削除し、現状空(全ページのOGPデフォルトは`public/logo.png`を直接使用、詳細は[`og/README.md`](og/README.md)参照)。
