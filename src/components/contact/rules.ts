/**
 * Contact-form rules shared by the browser (inline errors) and the API route
 * (authoritative validation). Pure TypeScript: no React, no DOM.
 */

export const CONTACT_LIMITS = {
  nameMin: 2,
  nameMax: 100,
  emailMax: 254,
  companyMax: 120,
  messageMin: 10,
  messageMax: 4000,
} as const;

export interface ContactValues {
  readonly name: string;
  readonly email: string;
  readonly company: string;
  readonly message: string;
}

export type ContactField = keyof ContactValues;
export type ContactErrors = Partial<Record<ContactField, string>>;

export const EMPTY_CONTACT: ContactValues = { name: '', email: '', company: '', message: '' };

/** Pragmatic address check: one "@", no spaces, a dotted domain, no CR/LF. */
const EMAIL_PATTERN = /^[^\s@<>()[\]\,;:"]+@[^\s@<>()[\]\,;:"]+\.[^\s@<>()[\]\,;:"]{2,}$/;

export function isValidEmail(value: string): boolean {
  return value.length <= CONTACT_LIMITS.emailMax && EMAIL_PATTERN.test(value);
}

/** Validates already-trimmed values. Returns an empty object when all is well. */
export function validateContact(values: ContactValues): ContactErrors {
  const errors: { -readonly [K in ContactField]?: string } = {};
  const { name, email, company, message } = values;

  if (name.length < CONTACT_LIMITS.nameMin) {
    errors.name = `Please enter your name (at least ${CONTACT_LIMITS.nameMin} characters).`;
  } else if (name.length > CONTACT_LIMITS.nameMax) {
    errors.name = `Name must be ${CONTACT_LIMITS.nameMax} characters or fewer.`;
  }

  if (email.length === 0) {
    errors.email = 'Please enter your email address.';
  } else if (!isValidEmail(email)) {
    errors.email = 'That email address does not look right. Try name@company.com.';
  }

  if (company.length > CONTACT_LIMITS.companyMax) {
    errors.company = `Company must be ${CONTACT_LIMITS.companyMax} characters or fewer.`;
  }

  if (message.length < CONTACT_LIMITS.messageMin) {
    errors.message = `Tell us a little more (at least ${CONTACT_LIMITS.messageMin} characters).`;
  } else if (message.length > CONTACT_LIMITS.messageMax) {
    errors.message = `Message must be ${CONTACT_LIMITS.messageMax} characters or fewer.`;
  }

  return errors;
}

export function trimValues(values: ContactValues): ContactValues {
  return {
    name: values.name.trim(),
    email: values.email.trim(),
    company: values.company.trim(),
    message: values.message.trim(),
  };
}

/** JSON envelope returned by POST /api/contact. */
export interface ContactApiResponse {
  ok: boolean;
  error?: string;
  /** Machine-readable reason: 'not_configured' | 'rate_limited' | 'invalid' | ... */
  code?: string;
  fields?: ContactErrors;
}

/** Non-autofillable, unguessable name of the hidden honeypot field (client and server must agree). */
export const HONEYPOT_FIELD = 'kn_hp_contact_ref';
