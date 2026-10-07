import { Mail, MapPin, Phone, type LucideIcon } from 'lucide-react';

export const CONTACT_EMAIL = 'contact@kreativnomads.com.ph';
export const CONTACT_PHONE_DISPLAY = '+63 917 312 5071';
export const CONTACT_PHONE_HREF = 'tel:+639173125071';
export const CONTACT_ADDRESS = '2404 Discovery Suites, ADB Avenue, Ortigas Center, Pasig City';
export const CONTACT_MAP_HREF = 'https://maps.google.com/?q=Discovery+Suites+Ortigas';

export interface ContactInfoItem {
  readonly id: 'email' | 'phone' | 'location';
  readonly icon: LucideIcon;
  readonly label: string;
  readonly value: string;
  readonly href: string;
  readonly external: boolean;
  /** Text placed on the clipboard by the copy button. */
  readonly copyValue: string;
  readonly copyLabel: string;
}

export const CONTACT_INFO: readonly ContactInfoItem[] = [
  {
    id: 'email',
    icon: Mail,
    label: 'Email',
    value: CONTACT_EMAIL,
    href: `mailto:${CONTACT_EMAIL}`,
    external: false,
    copyValue: CONTACT_EMAIL,
    copyLabel: 'email address',
  },
  {
    id: 'phone',
    icon: Phone,
    label: 'Phone',
    value: CONTACT_PHONE_DISPLAY,
    href: CONTACT_PHONE_HREF,
    external: false,
    copyValue: CONTACT_PHONE_DISPLAY,
    copyLabel: 'phone number',
  },
  {
    id: 'location',
    icon: MapPin,
    label: 'Location',
    value: CONTACT_ADDRESS,
    href: CONTACT_MAP_HREF,
    external: true,
    copyValue: CONTACT_ADDRESS,
    copyLabel: 'address',
  },
];

export const SOCIAL_LINKS = [
  { id: 'facebook', href: 'https://facebook.com/kreativnomads', label: 'Facebook' },
  { id: 'instagram', href: 'https://instagram.com/kreativnomads', label: 'Instagram' },
  { id: 'linkedin', href: 'https://linkedin.com/company/kreativnomads', label: 'LinkedIn' },
] as const;
