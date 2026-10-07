import { CONTACT_EMAIL } from './data';
import type { ContactValues } from './rules';

/** Browsers and mail clients truncate very long mailto URLs; cap the encoded URL, not the raw body. */
const MAX_MAILTO_CHARS = 1900;
const ELLIPSIS = '\u2026';

export interface MailtoDraft {
  href: string;
  /** True when the message was shortened to fit the mailto length limit. */
  truncated: boolean;
}

/** Builds a prefilled mailto: link from the form values (used when the API is not configured). */
export function buildMailto(values: ContactValues): MailtoDraft {
  const header = [
    `Name: ${values.name}`,
    `Email: ${values.email}`,
    ...(values.company ? [`Company: ${values.company}`] : []),
  ];
  const fullBody = [...header, '', values.message].join('\n');
  const subject = values.name ? `Project inquiry from ${values.name}` : 'Project inquiry';
  const prefix = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=`;
  const fits = (body: string): boolean =>
    prefix.length + encodeURIComponent(body).length <= MAX_MAILTO_CHARS;

  if (fits(fullBody)) return { href: prefix + encodeURIComponent(fullBody), truncated: false };

  // Binary search the longest raw body (plus ellipsis) whose encoded URL still fits.
  let low = 0;
  let high = fullBody.length;
  while (low < high) {
    const mid = Math.ceil((low + high) / 2);
    if (fits(fullBody.slice(0, mid) + ELLIPSIS)) low = mid;
    else high = mid - 1;
  }
  let cut = fullBody.slice(0, low);
  // Do not split a surrogate pair.
  if (/[\uD800-\uDBFF]$/.test(cut)) cut = cut.slice(0, -1);
  return { href: prefix + encodeURIComponent(cut + ELLIPSIS), truncated: true };
}
