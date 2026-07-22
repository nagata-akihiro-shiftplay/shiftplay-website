// News list content, kept separate from the page so it can later be swapped for a CMS
// or Markdown/content-collections source without touching src/pages/news/index.astro.
// Values below are the handoff's sample data (README / ShiftPlay News.dc.html).
export interface NewsItem {
  date: string;
  tag: string;
  title: string;
  href: string;
}

export const newsItems: NewsItem[] = [
  {
    date: '2026.06.15',
    tag: 'SERVICE',
    title: '生成AI研修プログラムの新コースを提供開始しました',
    href: '#',
  },
  {
    date: '2026.04.01',
    tag: 'COMPANY',
    title: 'オフィス移転のお知らせ',
    href: '#',
  },
  {
    date: '2026.02.20',
    tag: 'MEDIA',
    title: '代表 山田がAI活用セミナーに登壇しました',
    href: '#',
  },
  {
    date: '2025.12.10',
    tag: 'SERVICE',
    title: 'サービス紹介資料を更新しました',
    href: '#',
  },
];
