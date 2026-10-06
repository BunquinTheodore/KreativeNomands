'use client';

import type { MouseEvent } from 'react';
import { scrollToId } from '@/lib/scroll';

export interface FooterNavLink {
  readonly label: string;
  /** Section id on the home page (no "#"). */
  readonly id: string;
}

interface FooterNavProps {
  heading: string;
  links: readonly FooterNavLink[];
}

/** A footer link column: anchors smooth-scroll to section ids (falling back to the native hash jump). */
export default function FooterNav({ heading, links }: FooterNavProps) {
  const onClick = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    if (scrollToId(id)) event.preventDefault();
  };

  return (
    <nav aria-label={heading}>
      <h2 className="mb-4 font-display text-base font-semibold text-cream-500">{heading}</h2>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.label}>
            <a href={`/#${link.id}`} className="kn-flink" onClick={(event) => onClick(event, link.id)}>
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
