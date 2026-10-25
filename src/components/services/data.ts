import { BriefcaseBusiness, Clapperboard, Megaphone, Monitor, type LucideIcon } from 'lucide-react';

export type ServiceId = 'it-digital' | 'creative-content' | 'virtual-support' | 'branding-marketing';

export interface Service {
  readonly id: ServiceId;
  readonly icon: LucideIcon;
  /** Short label for the orbit selector. */
  readonly label: string;
  /** Rendered as "Nomads for" + title. */
  readonly title: string;
  readonly description: string;
  readonly features: readonly string[];
  /** Portfolio service route this service links to. */
  readonly portfolioHref: string;
}

export const SERVICES: readonly Service[] = [
  {
    id: 'it-digital',
    icon: Monitor,
    label: 'IT & Digital Solutions',
    title: 'IT & Digital Solutions',
    description:
      'Comprehensive technology solutions to power your digital transformation and drive innovation.',
    features: [
      'Web & mobile development',
      'Cloud infrastructure',
      'Cybersecurity solutions',
      'IT consulting & support',
    ],
    portfolioHref: '/portfolio/it',
  },
  {
    id: 'creative-content',
    icon: Clapperboard,
    label: 'Creative & Digital Content',
    title: 'Creative & Digital Content',
    description:
      'Transforming ideas into compelling visual experiences through thoughtful design, photo and video editing, and polished digital content.',
    features: [
      'Graphic Design & Visual Assets',
      'Video Editing & Color Grading',
      'Photo Editing & Retouching',
      'Motion Graphics & Animation',
    ],
    portfolioHref: '/portfolio/photo-video',
  },
  {
    id: 'virtual-support',
    icon: BriefcaseBusiness,
    label: 'Business & Virtual Support',
    title: 'Business & Virtual Support',
    description:
      'Reliable operational and virtual support that keeps your business organized, efficient, and focused on what matters most.',
    features: [
      'Virtual Assistance & Administration',
      'Project & Operations Support',
      'Quality Assurance & Software Testing',
      'Data Management & Research',
    ],
    portfolioHref: '/portfolio/virtual-support',
  },
  {
    id: 'branding-marketing',
    icon: Megaphone,
    label: 'Branding & Marketing',
    title: 'Branding & Marketing',
    description:
      'Building distinctive brands and meaningful connections through strategic marketing that strengthens visibility and drives engagement.',
    features: [
      'Brand Strategy & Positioning',
      'Content Strategy & Planning',
      'Digital Marketing Campaigns',
      'Social Media Marketing & Management',
    ],
    portfolioHref: '/portfolio/brand-marketing',
  },
];

export interface ProcessStep {
  readonly step: string;
  readonly title: string;
  readonly description: string;
}

export const PROCESS_STEPS: readonly ProcessStep[] = [
  {
    step: '01',
    title: 'Introduce Your Brand',
    description: 'Tell us everything about your brand and creative needs, goals, and vision.',
  },
  {
    step: '02',
    title: 'Project Detail Finalization',
    description: 'Complete the brief form or schedule a meeting. Provide all brand and project assets.',
  },
  {
    step: '03',
    title: 'Project Pitch & Test',
    description: 'Once confirmed, invite us for a project pitch or test if necessary.',
  },
  {
    step: '04',
    title: 'Project Execution',
    description:
      'Sit back and wait for drafts within the agreed timeline while focusing on your business.',
  },
];
