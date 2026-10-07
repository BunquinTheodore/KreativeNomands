import type { Metadata } from 'next';
import { buildSocialMetadata } from '@/lib/seo';
import LegalPage, { type LegalSection } from '@/components/footer/LegalPage';
import { CONTACT_ADDRESS, CONTACT_EMAIL } from '@/components/contact/data';

/*
 * LEGAL REVIEW REQUIRED: this is a generic placeholder privacy notice for a
 * creative agency in the Philippines (Data Privacy Act of 2012, RA 10173). It
 * has not been reviewed by counsel; have a qualified Philippine lawyer review
 * and adapt it (vendors, retention periods, DPO details) before relying on it.
 */

const DESCRIPTION =
  'How Kreativ Nomads collects, uses and protects personal information shared through this website, in line with the Philippine Data Privacy Act of 2012.';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: DESCRIPTION,
  alternates: { canonical: '/privacy' },
  ...buildSocialMetadata('Privacy Policy | Kreativ Nomads', DESCRIPTION, '/privacy'),
};

const SECTIONS: readonly LegalSection[] = [
  {
    id: 'collect',
    heading: 'Information we collect',
    paragraphs: ['We keep what we collect to a minimum. When you use the contact form or email us, we receive:'],
    items: [
      'Your name, email address and, optionally, your company or brand name.',
      'The message you write, including anything you choose to share about your project.',
      'Basic technical data that web servers record automatically, such as IP address, browser type and the pages requested.',
    ],
  },
  {
    id: 'use',
    heading: 'How we use it',
    paragraphs: [
      'We use your details only to reply to your inquiry, prepare proposals or quotations you ask for, and run and secure this website. We do not sell personal information and we do not use it for unrelated marketing without your consent.',
    ],
  },
  {
    id: 'sharing',
    heading: 'Who we share it with',
    paragraphs: [
      'Your message is delivered to us through an email delivery provider, and the website is served by a hosting provider. These service providers handle data only to deliver their service to us. We may also disclose information when the law requires it.',
    ],
  },
  {
    id: 'storage',
    heading: 'Cookies and local storage',
    paragraphs: [
      'This site does not set advertising cookies. Your browser may store small preferences locally, such as whether site sounds are muted. You can clear them at any time in your browser settings.',
    ],
  },
  {
    id: 'retention',
    heading: 'Retention and security',
    paragraphs: [
      'We keep inquiry messages only as long as needed to respond and to maintain a record of our business dealings, then delete or anonymize them. We use reasonable organizational and technical measures to protect personal information, but no method of transmission over the internet is completely secure.',
    ],
  },
  {
    id: 'rights',
    heading: 'Your rights under the Data Privacy Act',
    paragraphs: ['Under the Data Privacy Act of 2012 (Republic Act No. 10173) you have the right to:'],
    items: [
      'be informed about how your personal data is processed;',
      'access the personal data we hold about you;',
      'object to processing and withdraw your consent;',
      'correct inaccurate or outdated data;',
      'request erasure or blocking of your data, where applicable;',
      'data portability, where applicable; and',
      'claim damages for any inaccurate, incomplete or unlawfully obtained data, and lodge a complaint with the National Privacy Commission.',
    ],
  },
  {
    id: 'contact-us',
    heading: 'Contact us',
    paragraphs: [
      `To exercise your rights or ask about this policy, email ${CONTACT_EMAIL} or write to us at ${CONTACT_ADDRESS}.`,
    ],
    closing:
      'We may update this policy from time to time; the date above shows when it last changed. This page is a general summary for visitors and is not legal advice.',
  },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Privacy Policy"
      subtitle="How we use data"
      updated="Last updated: October 2026"
      intro="Kreativ Nomads respects your privacy. This notice explains what personal information we collect through this website and what we do with it."
      sections={SECTIONS}
    />
  );
}
