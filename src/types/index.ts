// Portfolio data types matching the JSON schema
export interface PortfolioAsset {
  src: string;
  type?: 'video' | 'image';
  title?: string;
  poster?: string; // Optional poster image for video assets
}

export interface Project {
  id: string;
  title: string;
  client: string;
  category: string;
  description: string;
  thumbnail: string;
  assets: PortfolioAsset[];
  services: string[];
  featured: boolean;
}

export interface Category {
  id: string;
  label: string;
}

export interface PortfolioData {
  projects: Project[];
  categories: Category[];
  services: string[];
}

// Navigation types
export interface NavLink {
  label: string;
  href: string;
}

// Service card types for the services section
export interface ServiceCard {
  id: string;
  title: string;
  description: string;
  icon: string;
}

// Contact form types
export interface ContactFormData {
  name: string;
  email: string;
  company?: string;
  message: string;
}

// Animation variants for Framer Motion
export interface AnimationVariants {
  hidden: object;
  visible: object;
}
