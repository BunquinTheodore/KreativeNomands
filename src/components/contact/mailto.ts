import { CONTACT_EMAIL } from './data';
import type { ContactValues } from './rules';

/** Browsers and mail clients truncate very long mailto URLs. */
const MAX_BODY_CHARS = 1800;

/** Builds a prefilled mailto: link from the form values (used when the API is not configured). */
export function buildMailto(values: ContactValues): string {
  const header = [
    `Name: ${values.name}`,
    `Email: ${values.email}`,
    ...(values.company ? [`Company: ${values.company}`] : []),
  ];
  const lines = [...header, '', values.message];
  const body = lines.join('\n').slice(0, MAX_BODY_CHARS);
  const subject = values.name ? `Project inquiry from ${values.name}` : 'Project inquiry';
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
