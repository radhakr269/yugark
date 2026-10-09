/**
 * CMS Content Type Definitions for Yugark Digital Studio
 * Designed for future headless CMS / Supabase / Admin Dashboard integration.
 */

export interface NavLink {
  label: string;
  href: string;
  isPrimary?: boolean;
}

export interface ValueHighlight {
  id: string;
  title: string;
  subtitle: string;
  iconName: 'monitor' | 'layers' | 'zap' | 'bar-chart';
}

export interface ProjectItem {
  id: string;
  title: string;
  category: string;
  tagline: string;
  description: string;
  image: string;
  alt: string;
  client?: string;
  deliverables?: string[];
  externalUrl?: string;
  featured?: boolean;
}

export interface ServiceItem {
  id: string;
  title: string;
  lines: string[];
  description: string;
  iconType: 'code' | 'chat' | 'target' | 'sparkles' | 'palette';
  features?: string[];
  deliverables?: string[];
}

export interface DemoItem {
  id: string;
  title: string;
  industry: string;
  image: string;
  alt: string;
  previewUrl?: string;
  description: string;
  features?: string[];
  techStack?: string[];
}

export interface BlogPostItem {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  readTime: string;
  publishedDate: string;
  image?: string;
  alt?: string;
  isGraphicCard?: boolean;
  graphicData?: {
    framework: string;
    precision: string;
    architectureBadge: string;
    headline: string;
    playbookLabel: string;
  };
}

export interface SiteConfig {
  studioName: string;
  tagline: string;
  headlineLine1: string;
  headlineLine2: string;
  headlineLine3Accent: string;
  heroDescription: string;
  heroImage: string;
  contactEmail: string;
  contactPhone: string;
  location: string;
  socials: {
    instagram: string;
    linkedin: string;
    youtube: string;
  };
}
