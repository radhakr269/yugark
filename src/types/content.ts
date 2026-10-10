/**
 * CMS Content Type Definitions for Yugark Digital Studio
 * Designed for public routing and future Supabase / Admin Dashboard integration (Step 2).
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

export interface ServiceProcessStep {
  step: string;
  title: string;
  description: string;
}

export interface ServiceFAQ {
  question: string;
  answer: string;
}

export interface ServiceItem {
  id: string;
  slug: string;
  title: string;
  lines: string[];
  tagline: string;
  description: string;
  longDescription: string;
  iconType: 'code' | 'chat' | 'target' | 'sparkles' | 'palette' | 'video' | 'compass' | string;
  features: string[];
  deliverables: string[];
  process: ServiceProcessStep[];
  faqs: ServiceFAQ[];
  metaDescription?: string;
  priceDisplay?: string;
  regularPrice?: number;
  launchPrice?: number;
  billingType?: 'one-time' | 'monthly';
  deliveryTime?: string;
  badge?: string;
  category?: string;
  imageUrl?: string;
}

export interface ProjectItem {
  id: string;
  slug: string;
  title: string;
  category: string;
  tagline: string;
  description: string;
  image: string;
  alt: string;
  client?: string;
  isConcept: boolean; // clearly distinguishing concept/demo projects from confirmed client work
  year: string;
  deliverables: string[];
  challenge: string;
  solution: string;
  keyFeatures: string[];
  techStack: string[];
  externalUrl?: string;
  featured?: boolean;
}

export interface DemoItem {
  id: string;
  slug: string;
  title: string;
  category: string;
  industry: string;
  image: string;
  alt: string;
  liveDemoUrl: string; // configured external live demo website or preview
  description: string;
  features: string[];
  techStack: string[];
  featured: boolean;
  displayOrder: number;
  status: 'published' | 'draft';
}

export interface BlogPostItem {
  id: string;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  richParagraphs?: string[];
  author: string;
  authorRole: string;
  readTime: string;
  publishedDate: string;
  status: 'published' | 'draft';
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
  metaDescription?: string;
}

export interface PricingPackage {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  investment: string;
  turnaround: string;
  popular?: boolean;
  bestFor: string;
  features: string[];
  deliverables: string[];
  inquiryMessage: string;
  badge?: string;
  regularPrice?: number;
  launchPrice?: number;
  type?: 'one-time' | 'monthly';
  billingType?: 'one-time' | 'monthly';
  deliveryTime?: string;
  ctaText?: string;
}

export interface PricingCalculatorItem {
  id: string;
  title: string;
  price: number;
  unit: string;
  category: 'website' | 'social' | 'ads' | 'video' | 'content' | string;
  billingType: 'one-time' | 'monthly';
  deliveryTime: string;
  description: string;
  features: string[];
  originalPrice?: number;
  badge?: string;
  isPopular?: boolean;
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
  whatsappNumber: string;
  whatsappUrl: string;
  location: string;
  socials: {
    instagram: string;
    linkedin: string;
    youtube: string;
  };
}
