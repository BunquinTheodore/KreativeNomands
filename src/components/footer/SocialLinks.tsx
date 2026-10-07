import { Facebook, Instagram, Linkedin, type LucideIcon } from 'lucide-react';
import { SOCIAL_LINKS } from '@/components/contact/data';

const ICONS: Record<(typeof SOCIAL_LINKS)[number]['id'], LucideIcon> = {
  facebook: Facebook,
  instagram: Instagram,
  linkedin: Linkedin,
};

/** The three social icons (original URLs, labels and rel/target preserved). */
export default function SocialLinks() {
  return (
    <ul className="flex items-center gap-3">
      {SOCIAL_LINKS.map((social) => {
        const Icon = ICONS[social.id];
        return (
          <li key={social.id}>
            <a
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
              className="kn-social glass"
              data-sfx-hover=""
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
