import type { Metadata } from 'next';
import { buildSocialMetadata } from '@/lib/seo';
import LegalPage, { type LegalSection } from '@/components/footer/LegalPage';
import { CONTACT_EMAIL } from '@/components/contact/data';

/*
 * LEGAL REVIEW REQUIRED: this is a generic placeholder set of website terms
 * for a creative agency in the Philippines. It has not been reviewed by
 * counsel; have a qualified Philippine lawyer review and adapt it (including
 * the engagement, payment and liability terms) before relying on it.
 */

const DESCRIPTION =
  'The terms for using the Kreativ Nomads website and how our creative engagements are agreed.';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: DESCRIPTION,
  alternates: { canonical: '/terms' },
  ...buildSocialMetadata('Terms of Service | Kreativ Nomads', DESCRIPTION, '/terms'),
};

const SECTIONS: readonly LegalSection[] = [
  {
    id: 'use',
    heading: 'Using this website',
    paragraphs: [
      'By browsing this website you agree to these terms. Please use the site lawfully and do not try to disrupt it, probe it for weaknesses, or send spam or malicious content through the contact form.',
    ],
  },
  {
    id: 'services',
    heading: 'Our services',
    paragraphs: [
      'Descriptions of our content strategy, design, photo and video post-production and IT services are for general information. The scope, timeline, fees and deliverables of any project are set out in a separate written proposal or agreement, which prevails over this page.',
    ],
  },
  {
    id: 'ip',
    heading: 'Portfolio and intellectual property',
    paragraphs: [
      'The portfolio shows work created for our clients. The brands, logos and materials in it belong to their respective owners and appear with their context only to illustrate our work. The Kreativ Nomads name, logo and the site design belong to us; please ask before reusing them.',
    ],
  },
  {
    id: 'content',
    heading: 'What you send us',
    paragraphs: [
      'Information you submit through the contact form should be accurate and yours to share. We use it as described in our Privacy Policy. Please do not send confidential material until we have agreed how it will be handled.',
    ],
  },
  {
    id: 'liability',
    heading: 'Disclaimers and liability',
    paragraphs: [
      'The website is provided as is, and we work to keep it accurate and available but cannot guarantee it will always be error-free or uninterrupted. To the extent permitted by Philippine law, Kreativ Nomads is not liable for losses arising from your use of, or inability to use, this website. Nothing here limits rights you have that cannot be limited by law.',
    ],
  },
  {
    id: 'links',
    heading: 'Third-party links',
    paragraphs: [
      'This site links to third-party services such as social networks and maps. We do not control those sites and are not responsible for their content or practices.',
    ],
  },
  {
    id: 'law',
    heading: 'Governing law and changes',
    paragraphs: [
      'These terms are governed by the laws of the Republic of the Philippines. We may update them from time to time; continued use of the site after a change means you accept the updated terms.',
    ],
  },
  {
    id: 'contact-us',
    heading: 'Contact us',
    paragraphs: [`Questions about these terms? Email ${CONTACT_EMAIL}.`],
    closing: 'This page is a general summary for visitors and is not legal advice.',
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Terms of Service"
      subtitle="The ground rules"
      updated="Last updated: October 2026"
      intro="These terms cover your use of the Kreativ Nomads website. Project work is agreed separately in writing."
      sections={SECTIONS}
    />
  );
}
