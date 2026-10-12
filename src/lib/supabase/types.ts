/**
 * Supabase Database Schema Type Definitions
 * Yugark Digital Studio V2
 */

export interface WebsiteSettingsRecord {
  id: string;
  site_name: string;
  tagline: string;
  business_email: string;
  whatsapp_number: string;
  whatsapp_message: string;
  logo_url?: string | null;
  favicon_url?: string | null;
  social_links: {
    instagram?: string;
    linkedin?: string;
    youtube?: string;
  };
  footer_text: string;
  seo_defaults: {
    title: string;
    description: string;
  };
  updated_at: string;
}

export interface ServiceRecord {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  full_description: string;
  icon: 'code' | 'chat' | 'target' | 'sparkles' | 'palette' | string;
  image_url?: string | null;
  features: string[];
  benefits: string[];
  process: Array<{
    step: string;
    title: string;
    description: string;
  }>;
  faqs: Array<{
    question: string;
    answer: string;
  }>;
  price_display?: string;
  regular_price?: number;
  launch_price?: number;
  billing_type?: string;
  delivery_time?: string;
  badge?: string;
  category?: string;
  seo_title?: string | null;
  seo_description?: string | null;
  sort_order: number;
  is_featured: boolean;
  status: 'draft' | 'published' | 'archived';
  published_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface DemoCategoryRecord {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
  created_at: string;
}

export interface WebsiteDemoRecord {
  id: string;
  title: string;
  slug: string;
  category_id?: string | null;
  category_name?: string;
  short_description: string;
  full_description?: string | null;
  thumbnail_url: string;
  additional_images?: string[];
  demo_url: string;
  technology_tags: string[];
  is_featured: boolean;
  sort_order: number;
  status: 'draft' | 'published' | 'archived';
  published_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface PortfolioProjectRecord {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  thumbnail_url: string;
  gallery_images?: string[];
  project_url?: string | null;
  project_type: string;
  is_verified_client_work: boolean;
  is_featured: boolean;
  year: string;
  deliverables: string[];
  challenge?: string | null;
  solution?: string | null;
  key_features: string[];
  tech_stack: string[];
  sort_order: number;
  status: 'draft' | 'published' | 'archived';
  published_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface PricingPackageRecord {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: string;
  regular_price?: number;
  launch_price?: number;
  badge?: string;
  currency: string;
  billing_type: string;
  turnaround: string;
  features: string[];
  deliverables: string[];
  cta_label: string;
  cta_url: string;
  is_featured: boolean;
  sort_order: number;
  status: 'draft' | 'published' | 'archived';
  published_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface DiscountRuleRecord {
  id: string;
  name: string;
  discount_type: 'launch' | 'duration' | 'multi_website' | 'website_combo';
  discount_percentage: number;
  fixed_amount?: number;
  eligible_services?: string[];
  eligible_quantities?: number[];
  eligible_durations?: string[];
  calculation_basis: 'additional_services' | 'website' | 'combined_subtotal';
  stacking_priority: number;
  is_exclusive: boolean;
  max_discount?: number;
  start_date?: string;
  end_date?: string;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface PricingSettingsRecord {
  id: string;
  currency: string;
  allow_discount_stacking: boolean;
  default_combo_basis: 'additional_services' | 'website' | 'combined_subtotal';
  multi_website_min_quantity: number;
  multi_website_discount_pct: number;
  tax_included: boolean;
  tax_rate_pct: number;
  rounding_mode: 'round' | 'floor' | 'ceil';
  updated_at: string;
}

export interface BlogCategoryRecord {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  created_at: string;
}

export interface BlogPostRecord {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  rich_paragraphs?: string[];
  cover_image_url?: string | null;
  is_graphic_card?: boolean;
  graphic_data?: {
    framework: string;
    precision: string;
    architectureBadge: string;
    headline: string;
    playbookLabel: string;
  };
  category_id?: string | null;
  category_name?: string;
  author_id?: string | null;
  author_name: string;
  author_role: string;
  read_time: string;
  seo_title?: string | null;
  seo_description?: string | null;
  status: 'draft' | 'published' | 'scheduled' | 'archived';
  is_featured: boolean;
  published_at?: string | null;
  scheduled_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface LeadRecord {
  id: string;
  name: string;
  full_name?: string | null;
  email: string;
  phone?: string | null;
  whatsapp_number?: string | null;
  business_name?: string | null;
  business_company?: string | null;
  business_category?: string | null;
  requirement: string;
  project_requirement?: string | null;
  service?: string | null;
  timeline?: string | null;
  page_source?: string;
  status: 'new' | 'contacted' | 'in_discussion' | 'proposal_sent' | 'closed_won' | 'closed_lost';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  assigned_to?: string | null;
  remarks?: string | null;
  created_at: string;
  updated_at: string;
}

export interface AdminRoleRecord {
  id: string;
  user_id: string;
  role: 'super_admin' | 'admin' | 'editor';
  full_name?: string | null;
  permissions: {
    manage_content: boolean;
    manage_leads: boolean;
    manage_settings: boolean;
  };
  created_at: string;
  updated_at: string;
}
