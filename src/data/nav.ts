// Primary nav (事業内容/会社情報) shared verbatim by SiteHeader and SiteFooter — was
// duplicated identically in both files; single-sourced here so a future nav change
// (e.g. adding a News link, see README's footer discrepancy note) only needs one edit.
export interface NavItem {
  key: 'service' | 'company';
  label: string;
  href: string;
}

export const mainNavItems: NavItem[] = [
  { key: 'service', label: '事業内容', href: '/service' },
  { key: 'company', label: '会社情報', href: '/company' },
];
