// Primary nav shared verbatim by SiteHeader and SiteFooter. Both items are anchors into
// the Home page's sections, so they work the same from Home and from any other page.
export interface NavItem {
  key: 'service' | 'company';
  label: string;
  href: string;
}

export const mainNavItems: NavItem[] = [
  { key: 'service', label: 'サービス', href: '/#services' },
  { key: 'company', label: '会社概要', href: '/#company' },
];
