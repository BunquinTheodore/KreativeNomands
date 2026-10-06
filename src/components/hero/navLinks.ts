export interface NavLink {
  label: string;
  /** Section id (without the leading #). */
  id: string;
}

export const NAV_LINKS: readonly NavLink[] = [
  { label: 'Home', id: 'hero' },
  { label: 'About', id: 'about' },
  { label: 'Services', id: 'services' },
  { label: 'Portfolio', id: 'portfolio' },
  { label: 'Contact', id: 'contact' },
];

export const SECTION_IDS: readonly string[] = NAV_LINKS.map((link) => link.id);
