import { BarChart3, Monitor, Palette, Video, type LucideIcon } from 'lucide-react';

export type ServiceId = 'content-strategy' | 'graphic-design' | 'post-production' | 'it-services';

export interface Service {
  readonly id: ServiceId;
  readonly icon: LucideIcon;
  /** Short label for the orbit selector. */
  readonly label: string;
  /** Rendered as "Nomads for" + title. */
  readonly title: string;
  readonly description: string;
  readonly features: readonly string[];
  /** Portfolio category route this service links to. */
  readonly portfolioHref: string;
}

export const SERVICES: readonly Service[] = [
  {
    id: 'content-strategy',
    icon: BarChart3,
    label: 'Content Strategy',
    title: 'Content Strategy',
    description:
      "Driving your brand's success with content strategies that captivate based on your current business goals.",
    features: [
      'Brand messaging & positioning',
      'Content calendar planning',
      'Campaign strategy',
      'Social media management',
    ],
    portfolioHref: '/portfolio/fnb',
  },
  {
    id: 'graphic-design',
    icon: Palette,
    label: 'Graphic Design',
    title: 'Graphic Design',
    description:
      'Transforming your vision into stunning visual experiences that leave a lasting impression.',
    features: [
      'Brand identity design',
      'Social media graphics',
      'Marketing collaterals',
      'Presentation design',
    ],
    portfolioHref: '/portfolio/insurance',
  },
  {
    id: 'post-production',
    icon: Video,
    label: 'Photo & Video Post-Production',
    title: 'Photo & Video Post-Production',
    description:
      'Elevating your visuals with meticulous post-production to create captivating imagery and engaging videos.',
    features: [
      'Video editing & color grading',
      'Photo retouching & enhancement',
      'Motion graphics',
      'Real estate photo editing',
    ],
    portfolioHref: '/portfolio/health',
  },
  {
    id: 'it-services',
    icon: Monitor,
    label: 'IT Services',
    title: 'IT Services',
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
