import { Compass, Lightbulb, Target, Users, type LucideIcon } from 'lucide-react';

export interface Stat {
  readonly label: string;
  /** Rendered with the scramble text animation (a year must not get a thousands separator). */
  readonly text?: string;
  readonly to?: number;
  readonly suffix?: string;
}

export const STATS: readonly Stat[] = [
  { text: '2023', label: 'Established' },
  { to: 50, suffix: '+', label: 'Projects Delivered' },
  { to: 20, suffix: '+', label: 'Happy Clients' },
  { to: 6, suffix: '+', label: 'Industries Served' },
];

export type DirectionId = 'vision' | 'mission' | 'values';

export interface Statement {
  readonly id: 'vision' | 'mission';
  readonly label: string;
  readonly icon: LucideIcon;
  readonly text: string;
}

export const STATEMENTS: readonly Statement[] = [
  {
    id: 'vision',
    label: 'Our Vision',
    icon: Target,
    text: 'To become the foremost creative services provider for local and international businesses.',
  },
  {
    id: 'mission',
    label: 'Our Mission',
    icon: Compass,
    text: 'To go beyond mere ideas, elevating businesses and the quality of freelancers in the Philippines. We empower them all to continuously strive for their North Stars.',
  },
];

export interface DirectionTab {
  readonly id: DirectionId;
  readonly label: string;
}

export const DIRECTION_TABS: readonly DirectionTab[] = [
  { id: 'vision', label: 'Vision' },
  { id: 'mission', label: 'Mission' },
  { id: 'values', label: 'Values' },
];

export interface ValueItem {
  readonly id: string;
  readonly icon: LucideIcon;
  readonly title: string;
  readonly description: string;
  readonly detail: string;
}

export const VALUES: readonly ValueItem[] = [
  {
    id: 'north-star',
    icon: Compass,
    title: 'Your North Star',
    description:
      'We prioritize your business goals and assist you in navigating every stage of your journey.',
    detail:
      'Every project starts with your goals. We map the route first, so each deliverable points the same way.',
  },
  {
    id: 'creative-excellence',
    icon: Lightbulb,
    title: 'Creative Excellence',
    description: 'Fresh and compelling creative solutions that address your marketing challenges.',
    detail:
      'Original concepts and polished craft, tested against the exact challenge the work has to solve.',
  },
  {
    id: 'collaboration',
    icon: Users,
    title: 'Collaboration First',
    description:
      'Strong communication with clients and freelancers sets us apart from other agencies.',
    detail:
      'One clear line between you, our team and the freelancers behind your project, from brief to delivery.',
  },
  {
    id: 'results',
    icon: Target,
    title: 'Results Driven',
    description: 'We go beyond mere ideas, elevating businesses through strategic creative work.',
    detail:
      'Strategy leads and execution follows, so the creative work moves what matters to your business.',
  },
];

export interface BrandMark {
  readonly src: string;
  readonly size: number;
  readonly opacity: number;
}

const YELLOW = '/logos/North-Star-Icon-Yellow_Kreativ-Nomads.png';
const IVORY = '/logos/North-Star-Icon-Ivory_Kreativ-Nomads.png';
const GREEN = '/logos/North-Star-Icon-Green_Kreativ-Nomads.png';

/** Three drifting rows of North-Star marks behind the brand plate. */
export const MARK_ROWS: readonly (readonly BrandMark[])[] = [
  [
    { src: YELLOW, size: 59, opacity: 0.55 },
    { src: IVORY, size: 40, opacity: 0.3 },
    { src: GREEN, size: 70, opacity: 0.6 },
    { src: IVORY, size: 49, opacity: 0.4 },
    { src: YELLOW, size: 38, opacity: 0.35 },
    { src: GREEN, size: 57, opacity: 0.5 },
  ],
  [
    { src: IVORY, size: 51, opacity: 0.35 },
    { src: YELLOW, size: 76, opacity: 0.5 },
    { src: GREEN, size: 46, opacity: 0.55 },
    { src: YELLOW, size: 40, opacity: 0.3 },
    { src: IVORY, size: 65, opacity: 0.4 },
    { src: GREEN, size: 54, opacity: 0.5 },
  ],
  [
    { src: GREEN, size: 62, opacity: 0.55 },
    { src: YELLOW, size: 43, opacity: 0.4 },
    { src: IVORY, size: 73, opacity: 0.3 },
    { src: GREEN, size: 40, opacity: 0.5 },
    { src: YELLOW, size: 59, opacity: 0.55 },
    { src: IVORY, size: 49, opacity: 0.35 },
  ],
];
