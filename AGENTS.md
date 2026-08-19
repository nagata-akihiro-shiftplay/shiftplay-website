# CLAUDE.md — ShiftPlay Corporate Website (実装リポジトリ)

このファイルは本プロジェクト(`app/shiftplay/`)固有のルールです。**今後この案件で実装を行う際は、必ずこの内容に従ってください。** グローバル規約(`~/.claude/CLAUDE.md`)よりこちらを優先します(特にスタック指定はNext.jsではなくAstroです)。

デザインの正本(`README.md` / `*.dc.html`)は `../../handoff/design_handoff_shiftplay_website/` に置かれています。そちらは参照専用の納品物であり、**変更・追記しないこと**。企画時点の設計判断は同ディレクトリの `CLAUDE.md` にも記録されていますが、実装が実際に動く場所はこの `app/shiftplay/` であるため、以後はこちらのCLAUDE.mdを実装の正としてください(内容は概ね同じですが、Tailwind v4採用に伴い一部更新されています)。

このファイルは `CLAUDE.md` からシンボリックリンクされています(Astroのスキャフォールドが自動生成した構成)。編集する際はどちらのパスから開いても同じ実体を編集することになります。

## 1. プロジェクト概要

- 株式会社ShiftPlay(生成AI法人研修・伴走型コンサルティング・顧問サービスを提供)のコーポレートサイト。**ユーザー自身が経営する会社の自社サイト**であり、外部クライアント承認は不要(ただし法務レビューが必要な箇所は除く)。
- 構成: ホーム(`/`)+ 8ページ(事業内容/生成AI法人研修/会社情報/お知らせ/資料ダウンロード/お問い合わせ/プライバシーポリシー)+ 共通ヘッダー・フッター。
- スタック: **Astro 7 + TypeScript(strict) + Tailwind CSS v4 + ESLint(flat config) + Prettier + @astrojs/sitemap**。パッケージ管理はpnpm。フレームワーク(React/Vue等)は導入しない。
- Fidelity: High-fidelity。色・タイポグラフィ・スペーシング・コピー・インタラクション仕様は `README.md` 記載の値を正として実装する。
- 未確定/未支給の要対応事項(実装時に都度確認):
  - 実ロゴは2026-07-22に納品・反映済み(`public/logo.png`、Header/Footer/OGPデフォルトで使用)。写真素材もCEO写真・Home事業内容/会社情報画像を同日に納品・反映済み。
  - プライバシーポリシー文言の法務レビュー
  - 利用規約・特定商取引法に基づく表記ページ(未構築)。2026-07-22、ページ未完成のままフッターに`#`リンクを残すのは望ましくないとの判断で、`SiteFooter.astro`の下段リンクから一旦削除した(プライバシーポリシー・お問い合わせのみ残す)。ページを用意でき次第、`SiteFooter.astro`の該当箇所にリンクを復活させること。
  - 会社情報(設立年月・所在地・資本金)の最終確認
  - フォーム送信先(Formspree継続 or 自社バックエンド)
  - フッターへの「お知らせ」リンク有無(README本文とデザインコードに齟齬あり、実装前に確認)
  - `astro.config.mjs` の `site: 'https://shiftplay.jp'` は仮ドメイン。本番ドメイン確定後に更新すること。
- **実装状況**: README Site Mapの全8ページ(Home/Service/Training/Company/News/Download/Contact/Privacy)実装済み。共通コンポーネントの基盤はCompanyまでで揃ったため、以降は大きな設計変更があった場合のみこのファイルを更新する。

## 2. ディレクトリ構成

```
app/shiftplay/
├── .claude/launch.json          # Browser pane プレビュー用(npm run dev, port 4321)
├── astro.config.mjs             # sitemap + @tailwindcss/vite 登録, site URL
├── eslint.config.mjs            # flat config(eslint/config の defineConfig を使用)
├── prettier.config.mjs          # prettier-plugin-astro / prettier-plugin-tailwindcss
├── tsconfig.json                # astro/tsconfigs/strict 継承
├── pnpm-workspace.yaml          # allowBuilds(esbuild: true)等
├── public/
│   ├── favicon.ico / favicon.svg   # Astroデフォルト(実ロゴ確定後に差し替え)
│   ├── logo.png                    # 実ロゴ(2026-07-22納品、透過PNG。Logo.astroが参照する唯一の場所)
│   └── images/                     # 実写真。ページ単位ではなく役割・再利用性単位のフォルダ構成
│       ├── hero/                   # ページ最上部のキービジュアル用(Homeのヒーローは採用せずCSSアニメーション背景に変更したため、現状空)
│       ├── teasers/                # Homeの事業内容誘導セクションの添え画像(service.jpg 配置済み。会社情報誘導セクションは2026-08-19にpeople/ceo.jpgへ差し替え)
│       ├── people/                 # 代表者・スタッフのポートレート写真(ceo.jpg 配置済み)
│       └── og/                     # OGP/Twitter Card用のシェア画像(og-image.png 配置済み、全ページ共通デフォルト)
│           # 各フォルダの用途/推奨サイズ/推奨形式/使用ページ/使用コンポーネントは
│           # docs/images/README.md 以下に記載(public/直下に置くと本番から
│           # 閲覧できてしまうため、ドキュメントだけ docs/ に分離している)
├── src/
│   ├── layouts/
│   │   └── BaseLayout.astro     # <head>共通(meta/OGP/Twitter Card/canonical) + ページロードfade-in + <slot />
│   ├── components/
│   │   ├── SiteHeader.astro     # sticky header, scroll-shrink, mobile menu
│   │   ├── SiteFooter.astro     # 上部プロモカード2枚 + フッターバー
│   │   ├── Button.astro         # variant: outline | solid | solid-footer | dark | muted(色のみ、サイズは呼び出し側)
│   │   ├── Icon.astro           # name: download | mail | chevron-right | arrow-right(インラインSVG)
│   │   ├── Logo.astro           # 実ロゴ(`/logo.png`)を表示。header/footer共通の唯一の参照箇所
│   │   ├── HeroVisual.astro     # Homeヒーロー用、ミニマルなロボットの顔(瞬き+浮遊+アンテナ発光)と周回する粒子2つ(JS/canvas不使用、transform/opacity/box-shadowのみ。写真は使わない方針。枠なし・背景はページと同色。michikusa.techのLottieアニメーションの「テック感」に着想を得つつ、素材自体は自社トークンでゼロから作成)
│   │   ├── RevealOnScroll.astro # スクロール一回リビール汎用ラッパー(`duration`prop=600|700、全ページ共通)
│   │   ├── HomeTeaser.astro     # Home専用: Service/About共通ティザーレイアウト
│   │   ├── GhostHeading.astro   # ウォーターマーク英字見出し+ダッシュ+ラベル(下層ページ共通)
│   │   ├── TagChip.astro        # 枠線付きタグpill(色のみ固定、サイズは呼び出し側。下層ページ共通)
│   │   ├── ServiceCard.astro    # Serviceページ専用: タイトル+説明+タグ+全幅CTAバーのカード
│   │   ├── AnchorNav.astro      # ページ内クイックナビpill列(Training/Company共通)
│   │   ├── SectionTitle.astro   # 「青いh2見出し + 灰色サブラベル」パターン(Training/Company共通)
│   │   ├── StepCard.astro       # 番号付きステップカード(Trainingの「04 FLOW」で初採用)
│   │   ├── FaqItem.astro        # Q/Aペア(Trainingの「05 FAQ」で初採用)
│   │   ├── CTASection.astro     # 締めの紺色CTAバナー(Trainingの closing banner で初採用)
│   │   ├── ProfileRow.astro     # 定義リスト形式の1行(Companyの「03 会社情報」で初採用)
│   │   ├── NewsRow.astro        # お知らせ一覧の1行(Newsで初採用)
│   │   ├── PolicySection.astro  # 見出し+本文+任意の<slot/>(Privacyの第N条、7回反復するため)
│   │   ├── PolicyList.astro     # 条文内の箇条書き(Privacyの第1〜3条)
│   │   └── form/                # Download/Contact共通のフォーム部品(Downloadで新設)
│   │       ├── FormField.astro           # ラベル行+必須バッジ+任意のhint+<slot/>
│   │       ├── Input.astro               # text/email/tel入力
│   │       ├── Textarea.astro
│   │       ├── RadioGroup.astro
│   │       ├── PrivacyAgreementCheckbox.astro  # チェックボックス+プライバシーポリシーリンク(2ページで文言まで同一)
│   │       ├── SubmitButton.astro        # <button>。disabled状態はpropではなくJSがトグル
│   │       ├── FormErrorBanner.astro     # 送信失敗バナー([data-form-error]をJSがトグル)
│   │       └── FormSuccessPanel.astro    # 送信完了パネル(`message`propのみ差し替え)
│   ├── data/
│   │   └── news.ts              # News一覧データ(型 + 配列)。CMS/Markdown移行時はここだけ差し替える想定
│   ├── scripts/
│   │   └── formspreeForm.ts     # Download/Contact共通のフォーム送信ロジック(属性セレクタ駆動、IDに依存しない)
│   ├── styles/
│   │   └── global.css           # @theme(デザイントークン)+ @utility(container-*/section-px)
│   └── pages/
│       ├── index.astro                 # / (Home、実装済み)
│       ├── service/index.astro         # /service (Service、実装済み)
│       ├── service/training.astro      # /service/training (Training、実装済み)
│       ├── company.astro               # /company (Company、実装済み)
│       ├── news/index.astro            # /news (News、実装済み)
│       ├── download.astro              # /download (Download、実装済み)
│       ├── contact.astro               # /contact (Contact、実装済み)
│       └── privacy.astro               # /privacy (Privacy、実装済み)
```

Selectコンポーネントは未作成(Download/Contactとも`<select>`を使わずradioのみのため使用箇所が無い)。フォームバリデーションはHTML5ネイティブの`required`のみで、JSによる追加バリデーションは無い(READMEの仕様通り)。

ルーティングは `README.md` のSite Map表と完全一致させること(`/service/training` はネストディレクトリで表現)。

## 3. コーディング規約

- 言語: TypeScript(Astroコンポーネントの`---`フェンス内含む)。Propsは必ず`interface Props`で型定義する。
- パッケージ管理: pnpm。ローカルにpnpmバイナリが無い環境では `npx --yes pnpm@latest <cmd>` で代替可能(このセットアップ時に実際に使用した方法)。
- **TypeScriptのバージョンはpnpmの最新解決に任せず `^6.0.x` 系に固定している**(package.json参照)。理由: セットアップ時点でTypeScript 7系がリリース済みだったが、`@astrojs/check`(`^5||^6`)と`typescript-eslint`(`<6.1.0`)がまだ追随しておらず、7系だとpeer依存エラーになるため。今後これらのツールがTS7に対応した場合のみアップグレードを検討する。
- コンポーネントファイル名はPascalCase(`SiteHeader.astro`)、ページファイル/URLスラッグは小文字ケバブ/英単語。
- コメントは「なぜそうしているか」が非自明な場合のみ最小限で書く。
- 1コンポーネント1責務。タスクに必要ない共通化・抽象化は行わない。
- `.dc.html`内の`state`/`renderVals()`は「その挙動を再現するための仕様書」として読み、Astro + Vanilla JSの慣用的な書き方に翻訳する(Reactの`isMobile`ステート管理などはCSSのみで代替できる場合は代替する。5節参照)。
- フォームの`required`属性は`required="required"`のように明示値で書く。

## 4. Tailwind運用ルール

**Tailwind CSS v4を採用しているため、`tailwind.config.mjs`は存在しない。** デザイントークンは全て `src/styles/global.css` の `@theme` ブロックに集約している(CSSファースト設定)。

- 色トークン(`--color-*`): `page`(#f7f6f4) / `ink`(#14161c) / `muted`(#4b4f58) / `faint`(#8a8d94) / `ghost`(#e7e6e2) / `border`(#e2e0db) / `card`(#efeee9) / `accent`(#1a46e5) / `accent-hover`(#1336c2) / `accent-hover-footer`(#3a63ec) / `accent-bg`(#eef1fd) / `icon-dl`(#c3d4fb) / `icon-contact`(#dbe4fb) / `error`(#e0483c) / `error-bg`(#fdeceb) / `disabled`(#c7c9ce)。実装では常に `bg-accent` 等のトークン経由で参照し、生のhex値を書かない。
- フォント: `--font-sans` に `'Noto Sans JP', system-ui, -apple-system, sans-serif` を設定済み。`font-sans`ユーティリティで参照される。
- 角丸トークン(`--radius-*`): `button`(9px) / `card`(14px) / `block`(16px) / `panel`(20px) → `rounded-button` / `rounded-card` / `rounded-block` / `rounded-panel`。**ボタン角丸には2種類ある**: ヘッダー/フッターのnavバー内CTAはTailwind標準の`rounded-lg`(8px)、hero/ティザー/ページ本文内のCTAリンクは`rounded-button`(9px、カスタムトークン)。デザインソース上も実際にこの2値が混在しているため統一しないこと(README全体のデザイントークン表には明記が無い、`.dc.html`のインラインstyleを直接比較して発見した差異)。`block`(16px)はTrainingの「PROBLEM/SERVICE MENU」の灰色カード、Companyの「CEO写真の枠」「会社情報カード」の3箇所で使われている値で、既存の`card`(14px)/`panel`(20px)のどちらとも一致しないため、Company実装時に正式トークン化した(旧`rounded-[16px]`は置き換え済み)。
- 共通コンテナ幅・余白は `@utility` で自作ユーティリティ化している: `container-full`(1440px) / `container-article`(820px) / `container-form`(720px) / `container-news`(1080px、READMEのデザイントークン表に明記が無いがNewsページのみこの実測値) / `section-px`(`padding-inline: clamp(20px,5vw,64px)`)。
- 見出しclamp()フォントサイズ(ghost heading / H1 / section heading)はページごとに微妙に範囲が異なる(README Typography節参照)ため、共通トークン化していない。各コンポーネントで `text-[clamp(...)]` の任意値記法を都度使う。
- **ブレークポイントは名前付きscreensを追加せず、Tailwindの任意値バリアントで表現する**: ヘッダーnav切替は `min-[861px]:` / モバイル(≤860px)は`min-[861px]:hidden`、hero/セクション画像順序切替は`max-[700px]:`。JSの`matchMedia`で`isMobile`を判定する実装(元の`.dc.html`のReact風ロジック)には**しない**— CSSで両分岐をDOMに描画し、表示/非表示だけを切り替える方がAstro(非フレームワーク)向きで壊れにくい。
- **大きなインラインstyleブロックは書かない**。動的な実行時の値(スクロール位置に応じたheader padding等)は `data-*` 属性 + Tailwindの`group-data-[...]:`バリアントで表現する(`SiteHeader.astro`の`data-scrolled`属性を参照)。
- `Button.astro`はpadding・gap・角丸・font-size・transition・press時のscaleを一切内部に固定していない(色とホバー色、`inline-flex items-center justify-center whitespace-nowrap font-bold no-underline`のみがbase)。理由: ハンドオフを`.dc.html`単位で突き合わせると、ヘッダー/フッターのnavバーCTA(radius8px, gap7px, font14px, transition:background+transform 150ms, press scale0.96)とhero/ティザーのページ内CTA(radius9px, gap6-8px, font15px, transitionはtransformのみ100ms, press scale0.97)とで値が全て異なっており、共通化できる不変部分がほぼ無いため。呼び出し側で`class`にpadding/gap/radius/font-size/transition/active:scaleをまとめて渡す(`SiteHeader.astro`/`SiteFooter.astro`の`navCtaBase`, `HomeTeaser.astro`の呼び出し例を参照)。
- 同一要素に複数のpadding/gap系ユーティリティを混在させない(`flex-1` + `basis-[...]`も避け、`flex-[1_1_380px]`のような単一の`flex`ショートハンド任意値を使う)。Tailwindの生成CSSの出力順序次第でどちらが勝つか不安定になるため。
- `prettier-plugin-tailwindcss`導入済み。`pnpm format`(`prettier --write .`)でクラス順序は自動整列される。手でクラス順を気にする必要はない。
- important修飾子はv4の記法(末尾`!`、例: `hidden!`)を使う(v3の先頭`!`ではない)。

## 5. コンポーネント設計ルール

- `SiteHeader`/`SiteFooter`は`BaseLayout.astro`から1箇所だけで呼び出し、各ページに複製しない。
- `Button.astro`は`variant`(`outline` / `solid` / `solid-footer` / `dark` / `muted`)、サイズ・角丸・transition等を含む`class`、アイコン用の`<slot name="icon">`(アイコンをラベルの後に置きたい場合はnamed slotを使わず default slot内に`{label}<Icon .../>`の順で書く)を受け取る共通コンポーネント。`solid`と`solid-footer`はホバー色が異なる(README: ヘッダー#1336c2 / フッター#3a63ec)ため別variantにしている。`muted`(bg-muted、Serviceカードの2枚目以降のCTAバー用)はホバー色が仕様に明記されていないため`hover:opacity-90`で代替している。
- `Icon.astro`は`name`(`download` / `mail` / `chevron-right` / `arrow-right`)でハンドオフの`.dc.html`のSVGパスを一字一句再現している。`chevron-right`(山形、Home/Footerのリンク用)と`arrow-right`(横線+矢印、Serviceカードの全幅CTAバー用)は別パスなので混同しないこと。新しいアイコンが必要になったら`paths`レコードに追記する(このAstroファイル以外にアイコン定義を増やさない)。
- `Logo.astro`は`<image-slot>`(プロトタイピングツール専用要素)の代替として作ったプレースホルダーだったが、2026-07-22に実ロゴ(`public/logo.png`、透過PNG)を反映済み。`width`/`height`propは実ファイルの解像度ではなく**表示サイズ**として使う(`object-contain`で中身を縮小フィットさせるため、元画像の縦横比に関わらずヘッダー170×56/フッター160×56の箱にきれいに収まる)。ロゴを差し替える場合は`public/logo.png`を上書きするだけでよい。
- `ImagePlaceholder.astro`(写真未支給プレースホルダー)は実写真差し替え完了に伴い削除済み(2026-07-22)。Home service/about画像・Companyの代表者写真は`astro:assets`の`<Image src="/images/..." width height alt loading class="... object-cover" />`に置き換わっている(`width`/`height`は各画像の実寸、`public/images/`配下のためAstroの最適化パイプラインは通らない点は`docs/images/README.md`参照)。納品されたPNGはLighthouse対応でリサイズ・JPG化済み(2026-07-22、`docs/images/{teasers,people}/README.md`参照)。HomeのService teaser画像(`service.jpg`)はHomeのLCP要素のため`loading="eager"`+`fetchpriority="high"`。Homeのヒーローは写真ではなく`HeroVisual.astro`(アニメーションする幾何学図形)を採用しているため、`ImagePlaceholder`相当のコンポーネントは以後不要。
- `RevealOnScroll.astro`は「一度だけ表示された時にfade+translateY(28px)→0で現れる」演出の汎用ラッパー(`as`propでタグ名指定、`duration`propは`600|700`でデフォルト700。Homeの各セクションは0.7s、Serviceのカードは0.6sと`.dc.html`側で値が異なるため)。IntersectionObserver(threshold 0.15)は`[data-reveal]`属性のグローバルセレクタで動くため、複数箇所・複数ページで使ってもスクリプトは1つに重複排除される。**アンカーリンクの飛び先にする場合は`id`propを渡す**(例: `<RevealOnScroll as="section" id="faq">`)。`as`が実行時にしか決まらないタグ名のため、TypeScriptは通常の`id={id}`記法だとエラーになる(`Property 'id' does not exist on type 'IntrinsicAttributes'`)。`any`にせず`{...{ id }}`というオブジェクトスプレッド記法で渡すことで型エラーを回避している(Training実装時に判明。`astroHTML.JSX.IntrinsicElements`へのキャストは逆にAstroの動的タグ解決を壊すため使わないこと)。新しいpass-through属性が必要になったら同じスプレッド方式で追加する。
- `HomeTeaser.astro`はHomeページのService/Aboutティザー(ラベル+見出し+本文+CTA+画像、両方とも同一レイアウト)専用の共通コンポーネント。`body`propは`.dc.html`同様`<br />`を含む文字列を`set:html`で描画している(静的な自社コピーのみを渡す前提。ユーザー入力を絶対に渡さないこと)。
- `GhostHeading.astro`は「大きい薄灰色の英字ウォーターマーク + 短い横線 + 日本語ラベル」パターン(README: Service/Training/Company/Download/Contact/Privacyの6ページ共通)。`watermarkClass`propで`text-[clamp(...)]`を上書きする(ページごとにclamp値が微妙に異なるため、既定値`clamp(44px,9vw,84px)`はService/Company用。Trainingは`clamp(40px,8vw,76px)`を明示的に渡している。Download/Contact/Privacyを実装する際もそのページの`.dc.html`から正確な値を都度確認して渡すこと)。`labelRowClass`propでダッシュ+ラベル行のmargin-bottomも上書きできる(既定`mb-8`=32pxはService/Training用、Companyは`mb-7`=28pxを渡している。Company実装時に発見して追加したprop)。
- `TagChip.astro`は枠線付きの小さいpillラベル(README: Serviceカードの「サービス特徴」タグ、Trainingの「特徴」タグ等)。font-size/角丸/paddingは内部に固定していない(色・枠線・フォント太さのみがbase)。理由: Serviceの特徴タグ(`rounded-md`/`px-2.5`/`py-1.5`/`text-xs`)とTrainingの特徴タグ(`rounded-lg`/`px-4`/`py-[9px]`/`text-[13px]`)でサイズが異なると判明したため(`Button.astro`と同じ理由・同じ対処)。呼び出し側で必ずこれらを`class`に指定する。
- `ServiceCard.astro`はServiceページ専用(タイトル+説明を左、TagChip群を右、`ServiceCard`自身が`RevealOnScroll`でカード単位のスクロールリビールを行い、`Button`(variant`solid`/`muted`)+`Icon`(`arrow-right`)で全幅CTAバーを描画)。汎用カード名だが現状Serviceページ専用の構造(Training/CompanyのカードUIとは別物)なので、他ページで似た見た目が必要でも安易に転用せず、まず`.dc.html`の該当マークアップを確認すること。
- `AnchorNav.astro`はページ内クイックナビのpill列(`items: {num,label,href}[]`)。Training(5項目)とCompany(3項目、想定)でマークアップ・スタイルが完全一致していたため共通化。
- `SectionTitle.astro`は「青いh2見出し + 灰色の`NN — ラベル`サブ行」パターン(Trainingの5サブセクション、Companyの3セクションで使用)。`eyebrowClass`/`subLabelClass`propでフォントサイズ・margin-bottomを上書きする(Trainingは`clamp(22px,3.2vw,28px)`/`mb-5`がデフォルト。Companyは`clamp(24px,3.6vw,32px)`/`mb-7`。ページ内で3回とも同じ上書き値を使う場合は、Companyのように呼び出し側で`const sectionTitleSize = {...}`をまとめてスプレッドすると重複が減る)。
- `StepCard.astro`(番号付きステップカード、Trainingの「04 FLOW」)と`FaqItem.astro`(Q/Aペア、Trainingの「05 FAQ」)は今のところTraining専用だが、構造が汎用的なため将来似たセクションが出てきたら転用できる。
- `CTASection.astro`は締めの紺色CTAバナー(見出し+説明+ソリッドボタン)。現状Trainingの1箇所でしか使っていないが、ユーザーの指示で他ページ(Company/Download/Contact)での再利用を見込んで最初から共通コンポーネント化した(Companyには該当箇所が無かったため今回は未使用のまま)。
- `ProfileRow.astro`は定義リスト形式の1行(ラベル140px固定+値)。Companyの「03 会社情報」テーブルで使用。行ごとの下線色`#f0efec`はSiteHeaderのモバイルnav区切り線と同じ値だが、使用箇所が2つだけなのでトークン化はしていない。
- フォーム部品(今後作成)はDownload/Contact共通で使う。バリデーション必須表示や送信ボタンのdisabled制御ロジックも部品側に閉じ込める。
- インタラクティブな挙動(mobile menu開閉、header shrink-on-scroll)は各コンポーネントのscoped `<script>`に書く(`SiteHeader.astro`参照)。複数コンポーネントで使う共通ロジック(スクロールリビールは`RevealOnScroll.astro`に切り出し済み)は`src/scripts/`ではなくコンポーネント自体に同梱している(Astroが同一内容の`<script>`を自動で重複排除するため、共有ロジック=共有コンポーネントで十分)。
- Reactなど状態管理フレームワークは導入しない。
- フォーム送信(Formspree POST + チェックボックスによる送信ボタンの有効化 + 成功/失敗パネルの出し分け)は`src/scripts/formspreeForm.ts`の`initFormspreeForm()`に共通化済み(Contact実装時にDownloadと完全に同一のロジックだと確認できたため切り出した)。`data-form-root` / `data-form-content` / `data-form-success` / `data-formspree-form` / `[data-submit-button]` / `[data-form-error]`という属性セレクタだけで動くので、IDに依存しない。各ページは`<script>import { initFormspreeForm } from '../scripts/formspreeForm'; initFormspreeForm();</script>`を置くだけでよい(Formspreeエンドポイント`https://formspree.io/f/xvzdrbjk`もDownload/Contactで共通)。

## 6. Astro実装ルール

- ページは`.astro`ファイルでファイルベースルーティング。URLは`README.md`のSite Map表と完全一致させる。
- `<head>`共通部分は`BaseLayout.astro`にまとめている(charset/viewport/favicon/title/description/canonical/OGP/Twitter Card/Google Fonts)。ページ固有のtitle/description/OGP画像は`BaseLayout`の`Props`(`title`/`description`/`ogImage?`/`noindex?`)で渡す。`ogImage`はデフォルト値`/images/og/og-image.png`を持つため、個別指定しなくても全ページのog:image/twitter:imageに反映される(2026-07-22、OGP画像納品に伴い変更。ページ固有の画像を出したい場合のみ`ogImage`propで上書きする)。
- クライアントJSはAstro Islands(`client:load`等)を使わず、通常の`<script>`タグで実装する。
- 画像は`astro:assets`の`<Image />`を使い、`width`/`height`明示、hero画像のみ`loading="eager"`、その他は`loading="lazy"`。alt必須。
- ESLintは**flat config**(`eslint.config.mjs`)。ESLint 10 + `typescript-eslint` + `eslint-plugin-astro` + `eslint-config-prettier`の構成で、ESLintコア純正の `defineConfig`(`eslint/config`から import)でまとめている。`typescript-eslint`の`tseslint.config()`ヘルパーは非推奨警告が出るため使わないこと。`no-irregular-whitespace`はoffにしている(サイト全体の日本語コピーで全角スペースを意図的に使っている箇所があるため、Privacy実装時に判明)。
- `pnpm approve-builds`相当の設定は`pnpm-workspace.yaml`の`allowBuilds`に書く(現状`esbuild: true`のみ)。新しい依存で同様の警告が出たら同ファイルに追記する。
- 開発サーバー確認は `.claude/launch.json`(このディレクトリ直下に配置済み、`npm run dev` / port 4321)を使い、Browser paneの`preview_start({name:"shiftplay-astro"})`でプレビューする。
- ページロードfade-in(README: 全ページ共通、root wrapperが`opacity:0,translateY(10px)`→mount1フレーム後に`opacity:1,translateY(0)`, 0.5s)は**`BaseLayout.astro`に実装済み**(`#page-root`ラッパー+`requestAnimationFrame`)。ページ側で個別に実装する必要はない。ページ遷移(Astro View Transitions)自体の導入は未決定。導入する場合も`BaseLayout.astro`に一箇所だけ追加すること。
- ヘッダーのアクティブ状態は各ページから`SiteHeader`に`active="service"|"company"`propで渡す(`.dc.html`の`active="home"|"service"|"company"`踏襲)。Homeページは`active`を渡さない(`<SiteHeader />`のみでOK。`home`はnavItemsに存在しないキーなので渡しても渡さなくても見た目は同じだが、型上`'service'|'company'`しか受け付けないため渡さない)。
- **Browser paneでのスクロールリビール検証について**: この環境のBrowser pane(自動化ブラウザ)は`IntersectionObserver`のコールバックが実スクロール後も発火しないことがある(ページロードの`requestAnimationFrame`は正常に動くため、フレームワーク側の問題ではなく自動化ブラウザ側のタブ可視性/コンポジタの制約と推測される)。動作検証時は、DevToolsコンソール相当のJS評価で`document.querySelectorAll('[data-reveal]')`に対して手動で`opacity-0 translate-y-7`→`opacity-100 translate-y-0`のクラス付け替えを行い、最終表示状態を目視確認するとよい。実ブラウザ(Chrome等)では通常通りスクロールで発火する。

## 7. SEOルール

- 各ページで`BaseLayout`に個別の`title`/`description`を渡す(共通テンプレート+ページ差分)。
- OGP/Twitter Cardは`BaseLayout.astro`で共通定義済み。`Astro.site`(`astro.config.mjs`の`site`)を使い`canonical`/`og:url`/`og:image`の絶対URLを生成している。
- 構造化データ(JSON-LD)は未実装。該当ページ実装時に追加する: `Organization`(会社情報/トップ)、`BreadcrumbList`(下層ページ)、`FAQPage`(Trainingページの05 FAQセクション)。
- `@astrojs/sitemap`は導入済み・`astro.config.mjs`の`integrations`に登録済み。ページが無い現状は`[@astrojs/sitemap] No pages found!`という警告が出るが正常(ページ追加後に自動生成される)。
- `robots.txt`は未作成。ページ実装が進んだ段階で`public/robots.txt`を追加する。
- `<html lang="ja">`は`BaseLayout.astro`に設定済み。
- 画像には必ずalt属性を設定する(未支給画像はプレースホルダーalt→実写真差し替え時に更新)。

## Astro CLI Tips(Astroスキャフォールドの初期AGENTS.mdより)

開発サーバーはバックグラウンドモードで起動する:

```
astro dev --background
```

`astro dev stop` / `astro dev status` / `astro dev logs` で管理できる。

ドキュメント: https://docs.astro.build

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
