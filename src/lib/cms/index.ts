/**
 * Centralized CMS Data Access Layer
 * Yugark Digital Studio V2
 *
 * Implements dynamic querying from Supabase PostgreSQL tables with
 * fallback to persistent client-side store when Supabase credentials are pending.
 * Broadcasts updates via 'yugark-cms-updated' events for seamless live synchronization.
 */

import { supabase, isSupabaseConfigured } from '../supabase/client';
import {
  servicesData as initialServices,
  websiteDemosData as initialDemos,
  selectedWorkProjects as initialProjects,
  pricingPackagesData as initialPricing,
  pricingCalculatorItemsData as initialCalculatorItems,
  blogPostsData as initialBlogPosts,
  siteConfig as initialSiteConfig,
} from '../../data/studioData';
import {
  ServiceItem,
  DemoItem,
  ProjectItem,
  PricingPackage,
  PricingCalculatorItem,
  BlogPostItem,
  SiteConfig,
} from '../../types/content';
import {
  ServiceRecord,
  WebsiteDemoRecord,
  PortfolioProjectRecord,
  PricingPackageRecord,
  BlogPostRecord,
  WebsiteSettingsRecord,
  LeadRecord,
} from '../supabase/types';

// ============================================================================
// STORAGE HELPERS (PERSISTENT CLIENT-SIDE STORE WHEN SUPABASE IS PENDING)
// ============================================================================
const STORAGE_KEYS = {
  SETTINGS: 'yugark_cms_settings',
  SERVICES: 'yugark_cms_services',
  DEMOS: 'yugark_cms_demos',
  PROJECTS: 'yugark_cms_projects',
  PRICING: 'yugark_cms_pricing',
  CALCULATOR: 'yugark_cms_calculator',
  DISCOUNT_RULES: 'yugark_cms_discount_rules',
  BLOGS: 'yugark_cms_blogs',
  LEADS: 'yugark_cms_leads',
  MEDIA: 'yugark_cms_media',
  VIEWS: 'yugark_cms_views',
  PAGE_CONTENT: 'yugark_cms_pages',
  HERO: 'yugark_cms_hero',
};

// ============================================================================
// PHASE 1 DATA PROTECTION: BACKUP & EXPORT UTILITIES
// ============================================================================

export interface MigrationRecordItem {
  table: 'website_settings' | 'hero' | 'pages' | 'website_demos' | 'services' | 'pricing_packages' | 'portfolio_projects' | 'blog_posts';
  key: string;
  id?: string;
  slug: string;
  localTitle: string;
  remoteTitle?: string;
  action: 'insert' | 'update' | 'identical' | 'conflict';
  status: 'safe_insert' | 'identical_skip' | 'protected_conflict';
  resolution: string;
  isProtected: boolean;
  differences: string[];
  localData?: any;
  remoteData?: any;
}

export interface SyncMigrationResult {
  success: boolean;
  isDryRun: boolean;
  summary: {
    settings: number;
    hero: number;
    pages: number;
    demos: number;
    services: number;
    pricing: number;
    projects: number;
    blogs: number;
    totalLocal: number;
    inserts: number;
    updates: number;
    identical: number;
    conflicts: number;
    approved: number;
  };
  records: MigrationRecordItem[];
  conflicts: Array<{ type: string; key: string; localTitle?: string; remoteTitle?: string; resolution: string }>;
  errors: string[];
}

export interface CmsExportPackage {
  timestamp: string;
  schemaVersion: string;
  environment: string;
  keys: string[];
  data: Record<string, any>;
}

/**
 * Creates an admin-only export backup of all browser-stored CMS content.
 * Strictly preserves all local data without clearing or modifying localStorage.
 */
export function exportCmsBackup(): CmsExportPackage {
  const result: Record<string, any> = {};
  const exportedKeys: string[] = [];

  if (typeof window !== 'undefined') {
    Object.entries(STORAGE_KEYS).forEach(([name, key]) => {
      try {
        const item = localStorage.getItem(key);
        if (item) {
          result[name.toLowerCase()] = JSON.parse(item);
          exportedKeys.push(key);
        }
      } catch (err) {
        console.warn(`[CMS Backup] Could not parse key ${key}:`, err);
      }
    });
  }

  return {
    timestamp: new Date().toISOString(),
    schemaVersion: '2026.10-production-cms-v2',
    environment: isSupabaseConfigured ? 'supabase-connected' : 'local-sandbox',
    keys: exportedKeys,
    data: result,
  };
}

/**
 * Triggers a browser file download of the full CMS JSON backup.
 */
export function downloadCmsBackupFile(): void {
  if (typeof window === 'undefined') return;
  const backup = exportCmsBackup();
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `yugark-cms-backup-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

function safeGetStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    return JSON.parse(item) as T;
  } catch {
    return fallback;
  }
}

function safeSetStorage<T>(key: string, data: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
    window.dispatchEvent(new CustomEvent('yugark-cms-updated', { detail: { key } }));
  } catch (err) {
    console.warn(`Failed to persist key ${key} to localStorage:`, err);
  }
}

// Initialize seed data into localStorage if empty or outdated
function initializeLocalStorageSeed() {
  if (typeof window === 'undefined') return;

  const SEED_VERSION_KEY = 'yugark_pricing_sync_v3';
  const CURRENT_SEED_VERSION = 'verified_yugark_in_2026_source_of_truth_v3';
  const hasOutdatedSeed = localStorage.getItem(SEED_VERSION_KEY) !== CURRENT_SEED_VERSION;
  const storedPricing = localStorage.getItem(STORAGE_KEYS.PRICING);
  const isOldInventedPricing = storedPricing && (storedPricing.includes('starter-launch') || storedPricing.includes('Growth Studio'));

  if (!localStorage.getItem(STORAGE_KEYS.DEMOS)) {
    safeSetStorage(STORAGE_KEYS.DEMOS, initialDemos);
  }
  if (!localStorage.getItem(STORAGE_KEYS.SERVICES) || isOldInventedPricing || hasOutdatedSeed) {
    safeSetStorage(STORAGE_KEYS.SERVICES, initialServices);
  }
  if (!localStorage.getItem(STORAGE_KEYS.BLOGS)) {
    safeSetStorage(STORAGE_KEYS.BLOGS, initialBlogPosts);
  }
  if (!localStorage.getItem(STORAGE_KEYS.PROJECTS)) {
    safeSetStorage(STORAGE_KEYS.PROJECTS, initialProjects);
  }
  if (!storedPricing || isOldInventedPricing || hasOutdatedSeed) {
    safeSetStorage(STORAGE_KEYS.PRICING, initialPricing);
    safeSetStorage(STORAGE_KEYS.CALCULATOR, initialCalculatorItems);
    localStorage.setItem(SEED_VERSION_KEY, CURRENT_SEED_VERSION);
  }
  if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
    safeSetStorage(STORAGE_KEYS.SETTINGS, initialSiteConfig);
  }
}

initializeLocalStorageSeed();

// ============================================================================
// 1. WEBSITE SETTINGS
// ============================================================================
export async function getWebsiteSettings(): Promise<SiteConfig> {
  if (!isSupabaseConfigured) {
    return safeGetStorage<SiteConfig>(STORAGE_KEYS.SETTINGS, initialSiteConfig);
  }

  try {
    const { data, error } = await supabase
      .from('website_settings')
      .select('*')
      .limit(1)
      .maybeSingle();

    if (error || !data) {
      return safeGetStorage<SiteConfig>(STORAGE_KEYS.SETTINGS, initialSiteConfig);
    }

    const settings = data as any;
    const rawNumber = settings.whatsapp_number;
    const isOldNumber = !rawNumber || rawNumber.includes('9125272460');
    const normalizedNumber = isOldNumber ? '+91 9125205132' : rawNumber;
    const cleanDigits = normalizedNumber.replace(/[^0-9]/g, '');

    const rawInstagram = settings.social_links?.instagram;
    const isOldInstagram = !rawInstagram || rawInstagram === 'https://instagram.com';
    const normalizedInstagram = isOldInstagram ? 'https://www.instagram.com/yugark.in/' : rawInstagram;

    return {
      studioName: settings.site_name || initialSiteConfig.studioName,
      tagline: settings.tagline || initialSiteConfig.tagline,
      headlineLine1: settings.page_content?.headlineLine1 || initialSiteConfig.headlineLine1,
      headlineLine2: settings.page_content?.headlineLine2 || initialSiteConfig.headlineLine2,
      headlineLine3Accent: settings.page_content?.headlineLine3Accent || initialSiteConfig.headlineLine3Accent,
      heroDescription: settings.page_content?.heroDescription || initialSiteConfig.heroDescription,
      heroImage: settings.hero_config?.heroImage || initialSiteConfig.heroImage,
      contactEmail: settings.business_email || 'business@yugark.in',
      whatsappNumber: normalizedNumber,
      whatsappUrl: `https://wa.me/${cleanDigits || '919125205132'}`,
      location: 'Global Digital Practice',
      socials: {
        instagram: normalizedInstagram,
        linkedin: settings.social_links?.linkedin || initialSiteConfig.socials.linkedin,
        youtube: settings.social_links?.youtube || initialSiteConfig.socials.youtube,
      },
    };
  } catch (err) {
    console.warn('Fallback to local website settings:', err);
    return safeGetStorage<SiteConfig>(STORAGE_KEYS.SETTINGS, initialSiteConfig);
  }
}

// ============================================================================
// 2. SERVICES
// ============================================================================
export async function getPublishedServices(): Promise<ServiceItem[]> {
  if (!isSupabaseConfigured) {
    const local = safeGetStorage<ServiceItem[]>(STORAGE_KEYS.SERVICES, initialServices);
    return local;
  }

  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('status', 'published')
      .order('sort_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return safeGetStorage<ServiceItem[]>(STORAGE_KEYS.SERVICES, initialServices);
    }

    return (data as ServiceRecord[]).map((rec) => ({
      id: rec.id,
      slug: rec.slug,
      title: rec.title,
      lines: [rec.title],
      tagline: rec.short_description,
      description: rec.short_description,
      longDescription: rec.full_description,
      iconType: (rec.icon as any) || 'code',
      priceDisplay: rec.price_display || (rec.launch_price ? `Launch Offer: ₹${rec.launch_price.toLocaleString('en-IN')}` : undefined),
      regularPrice: rec.regular_price,
      launchPrice: rec.launch_price,
      billingType: (rec.billing_type as any) || 'one-time',
      deliveryTime: rec.delivery_time,
      badge: rec.badge,
      category: rec.category,
      imageUrl: rec.image_url || undefined,
      features: rec.features || [],
      deliverables: rec.benefits || [],
      process: rec.process || [],
      faqs: rec.faqs || [],
      metaDescription: rec.seo_description || rec.short_description,
    }));
  } catch (err) {
    console.warn('Fallback to local services:', err);
    return safeGetStorage<ServiceItem[]>(STORAGE_KEYS.SERVICES, initialServices);
  }
}

export async function getServiceBySlug(slug: string): Promise<ServiceItem | null> {
  const allServices = await getPublishedServices();
  
  // Exact match
  const directMatch = allServices.find((s) => s.slug === slug || s.id === slug);
  if (directMatch) return directMatch;

  // Recognized slug aliases for legacy & deep links
  const aliasMap: Record<string, string> = {
    'social-media': 'social-media-management',
    'ads': 'social-media-advertising',
    'ai-creative': 'ai-content-video',
    'branding': 'digital-growth-strategy',
    'content-strategy': 'digital-growth-strategy',
  };

  const targetSlug = aliasMap[slug];
  if (targetSlug) {
    const aliasFound = allServices.find((s) => s.slug === targetSlug || s.id === targetSlug);
    if (aliasFound) return aliasFound;
  }

  return null;
}

export async function getPricingCalculatorItems(): Promise<PricingCalculatorItem[]> {
  return safeGetStorage<PricingCalculatorItem[]>(STORAGE_KEYS.CALCULATOR, initialCalculatorItems);
}

export async function getDiscountRules(): Promise<any[]> {
  const { defaultDiscountRules } = await import('../pricing/pricingEngine');
  return safeGetStorage<any[]>(STORAGE_KEYS.DISCOUNT_RULES, defaultDiscountRules);
}

export const STANDARD_DEMO_CATEGORIES = [
  { id: 'b0000000-0000-0000-0000-000000000005', name: 'Healthcare & Medical', slug: 'healthcare-medical', sort_order: 1 },
  { id: 'b0000000-0000-0000-0000-000000000001', name: 'Corporate & Business', slug: 'corporate-business', sort_order: 2 },
  { id: 'b0000000-0000-0000-0000-000000000002', name: 'Beauty & Lifestyle', slug: 'beauty-lifestyle', sort_order: 3 },
  { id: 'b0000000-0000-0000-0000-000000000003', name: 'Restaurant & Cafe', slug: 'restaurant-cafe', sort_order: 4 },
  { id: 'b0000000-0000-0000-0000-000000000004', name: 'Fitness & Wellness', slug: 'fitness-wellness', sort_order: 5 },
];

function resolveDemoImage(rec: { slug?: string; title?: string; thumbnail_url?: string }): string {
  const isPorwal =
    (rec.slug && rec.slug.toLowerCase().includes('porwal')) ||
    (rec.title && rec.title.toLowerCase().includes('porwal')) ||
    (rec.title && rec.title.toLowerCase().includes('gautam'));

  if (isPorwal) {
    if (!rec.thumbnail_url || rec.thumbnail_url.includes('Business pro')) {
      return '/assets/images/dr-gautam-porwal.svg';
    }
    return rec.thumbnail_url;
  }

  if (rec.thumbnail_url && rec.thumbnail_url.trim()) {
    return rec.thumbnail_url;
  }

  // Slug-specific approved static assets
  switch (rec.slug) {
    case 'business-pro':
      return '/assets/images/Business pro.jpg';
    case 'glow-studio':
      return '/assets/images/glow Studio.jpg';
    case 'dinecraft':
      return '/assets/images/dinecraft.jpg';
    case 'fitlife':
      return '/assets/images/Fit Life.jpg';
    default:
      return '/assets/images/dr-gautam-porwal.svg';
  }
}

function resolveDemoCategory(rec: { slug?: string; title?: string; category_name?: string; demo_categories?: { name?: string } }): string {
  const isPorwal =
    (rec.slug && rec.slug.toLowerCase().includes('porwal')) ||
    (rec.title && rec.title.toLowerCase().includes('porwal')) ||
    (rec.title && rec.title.toLowerCase().includes('gautam'));

  if (isPorwal) {
    return 'Healthcare & Medical';
  }

  return rec.demo_categories?.name || rec.category_name || 'Turnkey Solution';
}

// ============================================================================
// 3. WEBSITE DEMOS (HIGH-PRIORITY MODULE)
// ============================================================================
export async function getPublishedDemos(): Promise<DemoItem[]> {
  if (!isSupabaseConfigured) {
    const local = safeGetStorage<DemoItem[]>(STORAGE_KEYS.DEMOS, initialDemos);
    return local.filter((d) => d.status === 'published').sort((a, b) => a.displayOrder - b.displayOrder);
  }

  try {
    const { data, error } = await supabase
      .from('website_demos')
      .select(`
        *,
        demo_categories(name)
      `)
      .eq('status', 'published')
      .order('sort_order', { ascending: true });

    if (error || !data || data.length === 0) {
      const local = safeGetStorage<DemoItem[]>(STORAGE_KEYS.DEMOS, initialDemos);
      return local.filter((d) => d.status === 'published').sort((a, b) => a.displayOrder - b.displayOrder);
    }

    return (data as any[]).map((rec, index) => {
      const category = resolveDemoCategory(rec);
      const image = resolveDemoImage(rec);

      return {
        id: rec.id,
        slug: rec.slug,
        title: rec.title,
        category,
        industry: category,
        image,
        alt: `${rec.title} - Website Demo`,
        liveDemoUrl: rec.demo_url,
        description: rec.short_description,
        features: (rec.additional_images && rec.additional_images.length > 0)
          ? rec.additional_images
          : [
              'Responsive Architecture with Fast Load Times',
              'Direct WhatsApp Lead Routing',
              'Tailored Layout & Typographic Tokens',
              'Turnkey Setup in 5 to 7 Business Days',
            ],
        techStack: rec.technology_tags || ['React', 'TypeScript', 'Tailwind CSS'],
        featured: Boolean(rec.is_featured),
        displayOrder: rec.sort_order ?? (index + 1),
        status: rec.status,
      };
    });
  } catch (err) {
    console.warn('Fallback to local demos:', err);
    const local = safeGetStorage<DemoItem[]>(STORAGE_KEYS.DEMOS, initialDemos);
    return local.filter((d) => d.status === 'published').sort((a, b) => a.displayOrder - b.displayOrder);
  }
}

export async function getFeaturedDemos(): Promise<DemoItem[]> {
  const allDemos = await getPublishedDemos();
  const featured = allDemos.filter((d) => d.featured);
  return featured.length > 0 ? featured : allDemos;
}

// ============================================================================
// 4. PORTFOLIO PROJECTS
// ============================================================================
export async function getPortfolioProjects(): Promise<ProjectItem[]> {
  if (!isSupabaseConfigured) {
    return safeGetStorage<ProjectItem[]>(STORAGE_KEYS.PROJECTS, initialProjects);
  }

  try {
    const { data, error } = await supabase
      .from('portfolio_projects')
      .select('*')
      .eq('status', 'published')
      .order('sort_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return safeGetStorage<ProjectItem[]>(STORAGE_KEYS.PROJECTS, initialProjects);
    }

    return (data as PortfolioProjectRecord[]).map((rec) => ({
      id: rec.id,
      slug: rec.slug,
      title: rec.title,
      category: rec.category,
      tagline: rec.project_type || 'Studio Concept',
      isConcept: !rec.is_verified_client_work,
      year: rec.year || '2025–2026',
      description: rec.description,
      image: rec.thumbnail_url || '/assets/images/Aurora living.jpg',
      alt: `${rec.title} Project Showcase`,
      client: rec.project_type,
      deliverables: rec.deliverables || [],
      challenge: rec.challenge || 'Architecture and design challenge details.',
      solution: rec.solution || 'Engineered bespoke digital solution.',
      keyFeatures: rec.key_features || [],
      techStack: rec.tech_stack || ['React', 'Tailwind CSS'],
      externalUrl: rec.project_url || undefined,
      featured: rec.is_featured,
    }));
  } catch (err) {
    console.warn('Fallback to local portfolio projects:', err);
    return safeGetStorage<ProjectItem[]>(STORAGE_KEYS.PROJECTS, initialProjects);
  }
}

export async function getProjectBySlug(slug: string): Promise<ProjectItem | null> {
  const allProjects = await getPortfolioProjects();
  return allProjects.find((p) => p.slug === slug) || null;
}

// ============================================================================
// 5. PRICING PACKAGES
// ============================================================================
export async function getPublishedPricing(): Promise<PricingPackage[]> {
  if (!isSupabaseConfigured) {
    return safeGetStorage<PricingPackage[]>(STORAGE_KEYS.PRICING, initialPricing);
  }

  try {
    const { data, error } = await supabase
      .from('pricing_packages')
      .select('*')
      .eq('status', 'published')
      .order('sort_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return safeGetStorage<PricingPackage[]>(STORAGE_KEYS.PRICING, initialPricing);
    }

    return (data as PricingPackageRecord[]).map((rec) => ({
      id: rec.id,
      slug: rec.slug,
      name: rec.title,
      badge: rec.badge,
      regularPrice: rec.regular_price,
      launchPrice: rec.launch_price,
      tagline: rec.description,
      investment: rec.price || (rec.launch_price ? `Launch Offer: ₹${rec.launch_price.toLocaleString('en-IN')}` : 'Custom Studio Quote'),
      turnaround: rec.turnaround || '~7–14 Days',
      deliveryTime: rec.turnaround,
      popular: rec.is_featured,
      bestFor: rec.description,
      type: (rec.billing_type as any) || 'one-time',
      billingType: (rec.billing_type as any) || 'one-time',
      features: rec.features || [],
      deliverables: rec.deliverables || [],
      ctaText: rec.cta_label || `Choose ${rec.title}`,
      inquiryMessage: `Hi Radha Krishna Sir, I would like to inquire about the ${rec.title} package.`,
    }));
  } catch (err) {
    console.warn('Fallback to local pricing packages:', err);
    return safeGetStorage<PricingPackage[]>(STORAGE_KEYS.PRICING, initialPricing);
  }
}

// ============================================================================
// 6. BLOG POSTS & ANALYTICS
// ============================================================================
export async function getPublishedBlogPosts(): Promise<BlogPostItem[]> {
  if (!isSupabaseConfigured) {
    const local = safeGetStorage<BlogPostItem[]>(STORAGE_KEYS.BLOGS, initialBlogPosts);
    return local.filter((p) => p.status === 'published');
  }

  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('status', 'published')
      .lte('published_at', new Date().toISOString())
      .order('published_at', { ascending: false });

    if (error || !data || data.length === 0) {
      const local = safeGetStorage<BlogPostItem[]>(STORAGE_KEYS.BLOGS, initialBlogPosts);
      return local.filter((p) => p.status === 'published');
    }

    return (data as BlogPostRecord[]).map((rec) => ({
      id: rec.id,
      slug: rec.slug,
      title: rec.title,
      category: rec.category_name || 'Design Engineering',
      author: rec.author_name || 'Yugark Editorial',
      authorRole: rec.author_role || 'Design Engineering',
      excerpt: rec.excerpt,
      content: rec.content,
      richParagraphs: rec.rich_paragraphs || [],
      readTime: rec.read_time || '5 min read',
      publishedDate: rec.published_at
        ? new Date(rec.published_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
        : '2026',
      status: rec.status === 'published' ? 'published' : 'draft',
      image: rec.cover_image_url || undefined,
      isGraphicCard: rec.is_graphic_card || false,
      graphicData: rec.graphic_data || undefined,
      metaDescription: rec.seo_description || rec.excerpt,
    }));
  } catch (err) {
    console.warn('Fallback to local blog posts:', err);
    const local = safeGetStorage<BlogPostItem[]>(STORAGE_KEYS.BLOGS, initialBlogPosts);
    return local.filter((p) => p.status === 'published');
  }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPostItem | null> {
  const allPosts = await getPublishedBlogPosts();
  return allPosts.find((p) => p.slug === slug) || null;
}

/**
 * Record a privacy-conscious blog page view
 */
export async function trackBlogView(postSlug: string): Promise<void> {
  try {
    // Record view in local analytics store
    const localViews = safeGetStorage<Record<string, number>>(STORAGE_KEYS.VIEWS, {});
    localViews[postSlug] = (localViews[postSlug] || 0) + 1;
    safeSetStorage(STORAGE_KEYS.VIEWS, localViews);

    // Send to backend analytics endpoint
    await fetch('/api/analytics/view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        postSlug,
        referrer: typeof document !== 'undefined' && document.referrer ? new URL(document.referrer).hostname : 'direct',
      }),
    });
  } catch {
    // Non-blocking telemetry
  }
}

// ============================================================================
// 7. LEADS SUBMISSION
// ============================================================================
export interface SubmitLeadPayload {
  name: string;
  email?: string;
  phone?: string;
  business_name?: string;
  requirement: string;
  service?: string;
  timeline?: string;
  page_source?: string;
  website_honeypot?: string;
}

export async function submitLead(payload: SubmitLeadPayload): Promise<{ success: boolean; refId: string; message: string }> {
  // 1. Attempt via secure server endpoint
  try {
    const res = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const json = await res.json();
      // Record locally for CRM access
      recordLeadLocally({ ...payload, id: json.refId });
      return json;
    } else {
      const errorData = await res.json().catch(() => null);
      if (errorData?.error) {
        throw new Error(errorData.error);
      }
    }
  } catch (err: any) {
    if (err?.message && !err.message.includes('fetch')) {
      throw err;
    }
    // Server route unavailable or network issue, fallback
  }

  // 2. Direct Supabase insert if client configured
  if (isSupabaseConfigured) {
    if (payload.website_honeypot) {
      return { success: true, refId: 'YUG-SPAM-PREVENTED', message: 'Inquiry received.' };
    }

    const effectiveEmail = payload.email?.trim() || (payload.phone ? `${payload.phone.replace(/\D/g, '')}@whatsapp.demo` : 'inquiry@yugark.in');

    let { data, error } = await supabase
      .from('leads')
      .insert({
        full_name: payload.name.trim(),
        email: effectiveEmail,
        whatsapp_number: payload.phone?.trim() || null,
        business_company: payload.business_name?.trim() || null,
        project_requirement: payload.requirement.trim(),
        service: payload.service || 'General Inquiry',
        status: 'new',
        priority: payload.service === 'Free Website Demo' ? 'high' : 'normal',
      })
      .select('id')
      .single();

    if (error && (error.message.includes('column') || error.code === '42703' || error.code === 'PGRST204')) {
      const fallbackRes = await supabase
        .from('leads')
        .insert({
          name: payload.name.trim(),
          email: effectiveEmail,
          phone: payload.phone?.trim() || null,
          business_name: payload.business_name?.trim() || null,
          requirement: payload.requirement.trim(),
          service: payload.service || 'General Inquiry',
          timeline: payload.timeline || 'Standard (2–4 weeks)',
          page_source: payload.page_source || 'website_contact',
          status: 'new',
          priority: payload.service === 'Free Website Demo' ? 'high' : 'normal',
        })
        .select('id')
        .single();
      data = fallbackRes.data;
      error = fallbackRes.error;
    }

    if (!error && data) {
      const refId = `YUG-${data.id.substring(0, 6).toUpperCase()}`;
      recordLeadLocally({ ...payload, id: refId });
      return { success: true, refId, message: 'Your project brief has been recorded in our studio system.' };
    } else if (error) {
      console.error('Supabase lead submit error:', error);
      throw new Error('Unable to record your project brief at this time. Please connect directly via WhatsApp or email.');
    }
  }

  // 3. Local fallback persistence
  const generatedRef = `YUG-${Math.floor(100000 + Math.random() * 900000)}`;
  recordLeadLocally({ ...payload, id: generatedRef });
  return {
    success: true,
    refId: generatedRef,
    message: 'Your project brief has been received by our studio directors.',
  };
}

function recordLeadLocally(leadData: any) {
  const existingLeads = safeGetStorage<LeadRecord[]>(STORAGE_KEYS.LEADS, []);
  const effectiveEmail = leadData.email || (leadData.phone ? `${leadData.phone.replace(/\D/g, '')}@whatsapp.demo` : 'inquiry@yugark.in');
  const newLead: LeadRecord = {
    id: leadData.id || `lead-${Date.now()}`,
    name: leadData.name,
    email: effectiveEmail,
    phone: leadData.phone || null,
    business_name: leadData.business_name || null,
    requirement: leadData.requirement,
    service: leadData.service || 'General Inquiry',
    timeline: leadData.timeline || 'Standard (2–4 weeks)',
    page_source: leadData.page_source || 'website_contact',
    status: 'new',
    priority: leadData.service === 'Free Website Demo' ? 'high' : 'normal',
    remarks: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  safeSetStorage(STORAGE_KEYS.LEADS, [newLead, ...existingLeads]);
}

// ============================================================================
// DATABASE LEAD MAPPER & NORMALIZER
// Bidirectionally maps and normalizes production Supabase records:
// full_name <-> name
// whatsapp_number <-> phone
// business_company / business_category <-> business_name
// project_requirement <-> requirement
// ============================================================================
export function mapDatabaseLead(row: any): LeadRecord {
  if (!row) {
    throw new Error('Invalid lead record data received.');
  }

  // 1. Full name mapping (handles full_name, name)
  const rawName = row.full_name || row.name || '';
  const name = String(rawName || 'Anonymous Client').trim();

  // 2. Phone / WhatsApp mapping (handles whatsapp_number, phone)
  const rawPhone = row.whatsapp_number || row.phone || null;
  const phone = rawPhone ? String(rawPhone).trim() : null;

  // 3. Email mapping with safe fallback for phone-only entries
  const rawEmail = row.email ? String(row.email).trim() : '';
  const email =
    rawEmail ||
    (phone ? `${phone.replace(/\D/g, '') || 'client'}@whatsapp.client` : 'inquiry@yugark.in');

  // 4. Business / Company / Category mapping
  // Handles business_company, business_category, business_name
  const rawBusiness = row.business_name || row.business_company || row.business_category || null;
  const business_name = rawBusiness ? String(rawBusiness).trim() : null;
  const business_company = row.business_company ? String(row.business_company).trim() : null;
  const business_category = row.business_category ? String(row.business_category).trim() : null;

  // 5. Project Requirement mapping (handles project_requirement, requirement)
  const rawRequirement = row.project_requirement || row.requirement || row.project_scope || '';
  const requirement = String(rawRequirement).trim() || 'No project description provided.';

  // 6. Service discipline (handles service, falling back to business_category)
  const rawService = row.service || row.business_category || 'General Inquiry';
  const service = String(rawService).trim();

  // 7. Timeline
  const timeline = row.timeline ? String(row.timeline).trim() : 'Standard (2–4 weeks)';

  // 8. Page Source
  const page_source = row.page_source ? String(row.page_source).trim() : 'website_contact';

  // 9. Status canonicalization
  const validStatuses: LeadRecord['status'][] = [
    'new',
    'contacted',
    'in_discussion',
    'proposal_sent',
    'closed_won',
    'closed_lost',
  ];
  const rawStatus = String(row.status || 'new').toLowerCase().trim();
  const status: LeadRecord['status'] = validStatuses.includes(rawStatus as any)
    ? (rawStatus as LeadRecord['status'])
    : 'new';

  // 10. Priority canonicalization
  const validPriorities: LeadRecord['priority'][] = ['low', 'normal', 'high', 'urgent'];
  const rawPriority = String(
    row.priority || (service === 'Free Website Demo' ? 'high' : 'normal')
  ).toLowerCase().trim();
  const priority: LeadRecord['priority'] = validPriorities.includes(rawPriority as any)
    ? (rawPriority as LeadRecord['priority'])
    : 'normal';

  // 11. Internal remarks / notes
  const remarks = row.remarks ? String(row.remarks).trim() : null;

  // 12. Timestamps
  const created_at = row.created_at || row.submitted_at || new Date().toISOString();
  const updated_at = row.updated_at || created_at;

  return {
    id: String(row.id || `lead-${Date.now()}`),
    name,
    full_name: name,
    email,
    phone,
    whatsapp_number: phone,
    business_name,
    business_company,
    business_category,
    requirement,
    project_requirement: requirement,
    service,
    timeline,
    page_source,
    status,
    priority,
    remarks,
    created_at,
    updated_at,
  };
}

// ============================================================================
// 8. FULL ADMIN CMS REPOSITORY (ALL CRUD MODULES)
// ============================================================================
export const adminCmsApi = {
  // --------------------------------------------------------------------------
  // DEMOS MANAGER (HIGHEST PRIORITY)
  // --------------------------------------------------------------------------
  async listDemos(): Promise<WebsiteDemoRecord[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('website_demos')
          .select('*, demo_categories(name)')
          .order('sort_order', { ascending: true });

        if (!error && data && data.length > 0) {
          return (data as any[]).map((rec) => {
            const isPorwal =
              (rec.slug && rec.slug.toLowerCase().includes('porwal')) ||
              (rec.title && rec.title.toLowerCase().includes('porwal')) ||
              (rec.title && rec.title.toLowerCase().includes('gautam'));

            let catName = rec.demo_categories?.name || rec.category_name;
            if (isPorwal && (!catName || catName === 'Restaurant & Cafe' || catName === 'Hospitality & Dining' || catName === 'Turnkey Solution')) {
              catName = 'Healthcare & Medical';
            } else if (!catName) {
              catName = 'Turnkey Solution';
            }

            let thumb = rec.thumbnail_url;
            if (isPorwal && (!thumb || thumb.includes('Business pro'))) {
              thumb = '/assets/images/dr-gautam-porwal.svg';
            }

            return {
              id: rec.id,
              title: rec.title,
              slug: rec.slug,
              category_id: rec.category_id,
              category_name: catName,
              short_description: rec.short_description,
              full_description: rec.full_description,
              thumbnail_url: thumb,
              additional_images: rec.additional_images || [],
              demo_url: rec.demo_url,
              technology_tags: rec.technology_tags || ['React', 'TypeScript', 'Tailwind CSS'],
              is_featured: Boolean(rec.is_featured),
              sort_order: rec.sort_order,
              status: rec.status,
              published_at: rec.published_at,
              created_at: rec.created_at,
              updated_at: rec.updated_at,
            } as WebsiteDemoRecord;
          });
        }
      } catch (err) {
        console.warn('Supabase listDemos query error:', err);
      }
    }
    // Local storage fallback
    const items = safeGetStorage<DemoItem[]>(STORAGE_KEYS.DEMOS, initialDemos);
    return items.map((d, idx) => ({
      id: d.id,
      title: d.title,
      slug: d.slug,
      category_name: d.category,
      category_id: null,
      short_description: d.description,
      full_description: d.description,
      thumbnail_url: d.image,
      additional_images: d.features,
      demo_url: d.liveDemoUrl,
      technology_tags: d.techStack,
      is_featured: d.featured,
      sort_order: d.displayOrder || idx + 1,
      status: d.status,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));
  },

  async createDemo(demo: Partial<WebsiteDemoRecord>): Promise<WebsiteDemoRecord> {
    if (demo.thumbnail_url && typeof demo.thumbnail_url === 'string' && demo.thumbnail_url.startsWith('blob:')) {
      throw new Error('Temporary browser blob URL cannot be persisted. Please upload the image file to Supabase Storage before saving.');
    }

    const id = demo.id || `demo-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const categoryName = demo.category_name || 'Healthcare & Medical';
    const matchedCategory = STANDARD_DEMO_CATEGORIES.find(
      (c) => c.name.toLowerCase() === categoryName.toLowerCase() ||
             c.slug.toLowerCase() === categoryName.toLowerCase()
    );
    const categoryId = demo.category_id || matchedCategory?.id || null;

    const newDemoRecord: WebsiteDemoRecord = {
      id,
      title: demo.title || 'Untitled Demo',
      slug: demo.slug || `demo-${Date.now()}`,
      category_name: categoryName,
      category_id: categoryId,
      short_description: demo.short_description || '',
      full_description: demo.full_description || demo.short_description || '',
      thumbnail_url: demo.thumbnail_url || '',
      additional_images: demo.additional_images || [],
      demo_url: demo.demo_url || 'https://yugark.in',
      technology_tags: demo.technology_tags || ['React', 'TypeScript', 'Tailwind CSS'],
      is_featured: demo.is_featured ?? true,
      sort_order: demo.sort_order ?? 10,
      status: demo.status || 'published',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('website_demos')
        .insert({
          title: newDemoRecord.title,
          slug: newDemoRecord.slug,
          category_id: newDemoRecord.category_id,
          short_description: newDemoRecord.short_description,
          full_description: newDemoRecord.full_description,
          thumbnail_url: newDemoRecord.thumbnail_url,
          additional_images: newDemoRecord.additional_images,
          demo_url: newDemoRecord.demo_url,
          technology_tags: newDemoRecord.technology_tags,
          is_featured: newDemoRecord.is_featured,
          sort_order: newDemoRecord.sort_order,
          status: newDemoRecord.status,
        })
        .select('*, demo_categories(name)')
        .single();

      if (error) {
        console.error('Supabase createDemo database failure:', error);
        throw new Error(error.message || 'Database error: Unable to create website demo in Supabase.');
      }
      if (!data) {
        throw new Error('Database returned no confirmed record after creating demo.');
      }
      newDemoRecord.id = data.id;
      if ((data as any).demo_categories?.name) {
        newDemoRecord.category_name = (data as any).demo_categories.name;
      }
    }

    // Persist in local store
    const existing = safeGetStorage<DemoItem[]>(STORAGE_KEYS.DEMOS, initialDemos);
    const newDemoItem: DemoItem = {
      id: newDemoRecord.id,
      slug: newDemoRecord.slug,
      title: newDemoRecord.title,
      category: newDemoRecord.category_name || 'Healthcare & Medical',
      industry: newDemoRecord.category_name || 'Healthcare & Medical',
      image: newDemoRecord.thumbnail_url || '/assets/images/dr-gautam-porwal.svg',
      alt: `${newDemoRecord.title} - Website Demo`,
      liveDemoUrl: newDemoRecord.demo_url,
      description: newDemoRecord.short_description,
      features: newDemoRecord.additional_images || ['Responsive Design', 'WhatsApp Lead Routing'],
      techStack: newDemoRecord.technology_tags,
      featured: newDemoRecord.is_featured,
      displayOrder: newDemoRecord.sort_order,
      status: newDemoRecord.status as any,
    };
    safeSetStorage(STORAGE_KEYS.DEMOS, [newDemoItem, ...existing.filter((d) => d.id !== newDemoRecord.id && d.slug !== newDemoRecord.slug)]);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('yugark-cms-updated', { detail: { key: STORAGE_KEYS.DEMOS } }));
    }
    return newDemoRecord;
  },

  async updateDemo(id: string, updates: Partial<WebsiteDemoRecord>): Promise<WebsiteDemoRecord> {
    if (updates.thumbnail_url && typeof updates.thumbnail_url === 'string' && updates.thumbnail_url.startsWith('blob:')) {
      throw new Error('Temporary browser blob URL cannot be persisted. Please upload the image file to Supabase Storage before saving.');
    }

    let resolvedCategoryId = updates.category_id;
    if (!resolvedCategoryId && updates.category_name) {
      const match = STANDARD_DEMO_CATEGORIES.find(
        (c) => c.name.toLowerCase() === updates.category_name?.toLowerCase() ||
               c.slug.toLowerCase() === updates.category_name?.toLowerCase()
      );
      if (match) resolvedCategoryId = match.id;
    }

    if (isSupabaseConfigured) {
      const payload: Record<string, any> = {
        updated_at: new Date().toISOString(),
      };
      if (updates.title !== undefined) payload.title = updates.title;
      if (updates.slug !== undefined) payload.slug = updates.slug;
      if (resolvedCategoryId !== undefined) payload.category_id = resolvedCategoryId;
      if (updates.short_description !== undefined) payload.short_description = updates.short_description;
      if (updates.full_description !== undefined) payload.full_description = updates.full_description;
      if (updates.thumbnail_url !== undefined) payload.thumbnail_url = updates.thumbnail_url;
      if (updates.additional_images !== undefined) payload.additional_images = updates.additional_images;
      if (updates.demo_url !== undefined) payload.demo_url = updates.demo_url;
      if (updates.technology_tags !== undefined) payload.technology_tags = updates.technology_tags;
      if (updates.is_featured !== undefined) payload.is_featured = updates.is_featured;
      if (updates.sort_order !== undefined) payload.sort_order = updates.sort_order;
      if (updates.status !== undefined) payload.status = updates.status;

      const { data, error } = await supabase
        .from('website_demos')
        .update(payload)
        .eq('id', id)
        .select('*, demo_categories(name)')
        .maybeSingle();

      if (error) {
        console.error('Supabase updateDemo database failure:', error);
        throw new Error(error.message || 'Database error: Unable to update website demo in Supabase.');
      }
      if (!data) {
        throw new Error(`Demo with ID "${id}" was not found in the Supabase database.`);
      }
    }

    // Update in local store
    const existing = safeGetStorage<DemoItem[]>(STORAGE_KEYS.DEMOS, initialDemos);
    const updated = existing.map((d) => {
      if (d.id === id || (updates.slug && d.slug === updates.slug)) {
        return {
          ...d,
          title: updates.title ?? d.title,
          slug: updates.slug ?? d.slug,
          category: updates.category_name ?? d.category,
          industry: updates.category_name ?? d.industry,
          image: updates.thumbnail_url ?? d.image,
          liveDemoUrl: updates.demo_url ?? d.liveDemoUrl,
          description: updates.short_description ?? d.description,
          featured: updates.is_featured ?? d.featured,
          displayOrder: updates.sort_order ?? d.displayOrder,
          status: (updates.status ?? d.status) as any,
          techStack: updates.technology_tags ?? d.techStack,
        };
      }
      return d;
    });
    safeSetStorage(STORAGE_KEYS.DEMOS, updated);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('yugark-cms-updated', { detail: { key: STORAGE_KEYS.DEMOS } }));
    }
    return { id, ...updates } as WebsiteDemoRecord;
  },

  async deleteDemo(id: string): Promise<boolean> {
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('website_demos').delete().eq('id', id);
      if (error) {
        console.error('Supabase deleteDemo database failure:', error);
        throw new Error(error.message || 'Database error: Unable to delete demo from Supabase.');
      }
    }
    const existing = safeGetStorage<DemoItem[]>(STORAGE_KEYS.DEMOS, initialDemos);
    safeSetStorage(STORAGE_KEYS.DEMOS, existing.filter((d) => d.id !== id));
    return true;
  },

  async reorderDemos(orderedIds: string[]): Promise<void> {
    const existing = safeGetStorage<DemoItem[]>(STORAGE_KEYS.DEMOS, initialDemos);
    const reordered = existing.map((item) => {
      const idx = orderedIds.indexOf(item.id);
      return idx !== -1 ? { ...item, displayOrder: idx + 1 } : item;
    });
    reordered.sort((a, b) => a.displayOrder - b.displayOrder);
    safeSetStorage(STORAGE_KEYS.DEMOS, reordered);

    if (isSupabaseConfigured) {
      for (let i = 0; i < orderedIds.length; i++) {
        const { error } = await supabase
          .from('website_demos')
          .update({ sort_order: i + 1 })
          .eq('id', orderedIds[i]);
        if (error) {
          console.error(`Supabase reorderDemos failed on ID ${orderedIds[i]}:`, error);
          throw new Error(error.message || 'Database error: Failed to reorder demos.');
        }
      }
    }
  },

  // --------------------------------------------------------------------------
  // BLOG MANAGER
  // --------------------------------------------------------------------------
  async listBlogPosts(): Promise<BlogPostRecord[]> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('published_at', { ascending: false });
      if (!error && data && data.length > 0) return data as BlogPostRecord[];
    }
    const items = safeGetStorage<BlogPostItem[]>(STORAGE_KEYS.BLOGS, initialBlogPosts);
    return items.map((p, idx) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      excerpt: p.excerpt,
      content: p.content,
      rich_paragraphs: p.richParagraphs || [],
      cover_image_url: p.image || null,
      is_graphic_card: p.isGraphicCard || false,
      graphic_data: p.graphicData || undefined,
      category_name: p.category,
      category_id: null,
      author_name: p.author,
      author_role: p.authorRole,
      read_time: p.readTime,
      seo_title: p.title,
      seo_description: p.excerpt,
      status: p.status as any,
      is_featured: idx === 0,
      published_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));
  },

  async createBlogPost(post: Partial<BlogPostRecord>): Promise<BlogPostRecord> {
    const id = post.id || `blog-${Date.now()}`;
    const newRecord: BlogPostRecord = {
      id,
      title: post.title || 'Untitled Post',
      slug: post.slug || `post-${Date.now()}`,
      excerpt: post.excerpt || '',
      content: post.content || '',
      rich_paragraphs: post.rich_paragraphs || [],
      cover_image_url: post.cover_image_url || '/assets/images/content-and-social-media.jpg',
      category_name: post.category_name || 'Design Engineering',
      author_name: post.author_name || 'Yugark Editorial',
      author_role: post.author_role || 'Studio Practice',
      read_time: post.read_time || '5 min read',
      seo_title: post.seo_title || post.title || '',
      seo_description: post.seo_description || post.excerpt || '',
      status: post.status || 'published',
      is_featured: post.is_featured ?? false,
      published_at: post.published_at || new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('blog_posts')
        .insert({
          title: newRecord.title,
          slug: newRecord.slug,
          excerpt: newRecord.excerpt,
          content: newRecord.content,
          rich_paragraphs: newRecord.rich_paragraphs,
          cover_image_url: newRecord.cover_image_url,
          category_name: newRecord.category_name,
          author_name: newRecord.author_name,
          author_role: newRecord.author_role,
          read_time: newRecord.read_time,
          seo_title: newRecord.seo_title,
          seo_description: newRecord.seo_description,
          status: newRecord.status,
          is_featured: newRecord.is_featured,
        })
        .select()
        .single();
      if (error) {
        console.error('Supabase createBlogPost database failure:', error);
        throw new Error(error.message || 'Database error: Unable to create blog post in Supabase.');
      }
      if (!data) {
        throw new Error('Database returned no confirmed record after creating blog post.');
      }
      return data as BlogPostRecord;
    }

    const existing = safeGetStorage<BlogPostItem[]>(STORAGE_KEYS.BLOGS, initialBlogPosts);
    const newPostItem: BlogPostItem = {
      id: newRecord.id,
      slug: newRecord.slug,
      title: newRecord.title,
      category: newRecord.category_name || 'Editorial',
      excerpt: newRecord.excerpt,
      content: newRecord.content,
      richParagraphs: newRecord.rich_paragraphs || [],
      author: newRecord.author_name,
      authorRole: newRecord.author_role,
      readTime: newRecord.read_time,
      publishedDate: 'Just Now',
      status: newRecord.status as any,
      image: newRecord.cover_image_url || undefined,
    };
    safeSetStorage(STORAGE_KEYS.BLOGS, [newPostItem, ...existing]);
    return newRecord;
  },

  async updateBlogPost(id: string, updates: Partial<BlogPostRecord>): Promise<BlogPostRecord> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('blog_posts')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (error) {
        console.error('Supabase updateBlogPost database failure:', error);
        throw new Error(error.message || 'Database error: Unable to update blog post in Supabase.');
      }
      if (!data) {
        throw new Error(`Blog post with ID "${id}" was not found in Supabase database.`);
      }
      return data as BlogPostRecord;
    }

    const existing = safeGetStorage<BlogPostItem[]>(STORAGE_KEYS.BLOGS, initialBlogPosts);
    const updated = existing.map((p) => {
      if (p.id === id) {
        return {
          ...p,
          title: updates.title ?? p.title,
          slug: updates.slug ?? p.slug,
          excerpt: updates.excerpt ?? p.excerpt,
          content: updates.content ?? p.content,
          richParagraphs: updates.rich_paragraphs ?? p.richParagraphs,
          category: updates.category_name ?? p.category,
          author: updates.author_name ?? p.author,
          authorRole: updates.author_role ?? p.authorRole,
          readTime: updates.read_time ?? p.readTime,
          image: updates.cover_image_url ?? p.image,
          status: (updates.status ?? p.status) as any,
        };
      }
      return p;
    });
    safeSetStorage(STORAGE_KEYS.BLOGS, updated);
    return { id, ...updates } as BlogPostRecord;
  },

  async deleteBlogPost(id: string): Promise<boolean> {
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('blog_posts').delete().eq('id', id);
      if (error) {
        console.error('Supabase deleteBlogPost database failure:', error);
        throw new Error(error.message || 'Database error: Unable to delete blog post from Supabase.');
      }
    }
    const existing = safeGetStorage<BlogPostItem[]>(STORAGE_KEYS.BLOGS, initialBlogPosts);
    safeSetStorage(STORAGE_KEYS.BLOGS, existing.filter((p) => p.id !== id));
    return true;
  },

  getBlogViews(postSlug: string): number {
    const views = safeGetStorage<Record<string, number>>(STORAGE_KEYS.VIEWS, {});
    return views[postSlug] || 0;
  },

  // --------------------------------------------------------------------------
  // SERVICES MANAGER
  // --------------------------------------------------------------------------
  async listServices(): Promise<ServiceRecord[]> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('sort_order', { ascending: true });
      if (!error && data && data.length > 0) return data as ServiceRecord[];
    }
    const items = safeGetStorage<ServiceItem[]>(STORAGE_KEYS.SERVICES, initialServices);
    return items.map((s, idx) => ({
      id: s.id,
      title: s.title,
      slug: s.slug,
      short_description: s.description,
      full_description: s.longDescription,
      icon: s.iconType,
      price_display: s.priceDisplay,
      regular_price: s.regularPrice,
      launch_price: s.launchPrice,
      billing_type: s.billingType || 'one-time',
      delivery_time: s.deliveryTime,
      badge: s.badge,
      category: s.category,
      features: s.features,
      benefits: s.deliverables,
      process: s.process,
      faqs: s.faqs,
      sort_order: idx + 1,
      is_featured: true,
      status: 'published',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));
  },

  async createService(service: Partial<ServiceRecord>): Promise<ServiceRecord> {
    const id = service.id || `srv-${Date.now()}`;
    const newRecord: ServiceRecord = {
      id,
      title: service.title || 'New Service',
      slug: service.slug || `service-${Date.now()}`,
      short_description: service.short_description || '',
      full_description: service.full_description || service.short_description || '',
      icon: service.icon || 'code',
      features: service.features || [],
      benefits: service.benefits || [],
      process: service.process || [],
      faqs: service.faqs || [],
      sort_order: service.sort_order ?? 10,
      is_featured: service.is_featured ?? true,
      status: service.status || 'published',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('services').insert(newRecord).select().single();
      if (error) {
        console.error('Supabase createService database failure:', error);
        throw new Error(error.message || 'Database error: Unable to create service in Supabase.');
      }
      if (!data) {
        throw new Error('Database returned no confirmed record after creating service.');
      }
    }

    const existing = safeGetStorage<ServiceItem[]>(STORAGE_KEYS.SERVICES, initialServices);
    const newServiceItem: ServiceItem = {
      id: newRecord.id,
      slug: newRecord.slug,
      title: newRecord.title,
      lines: [newRecord.title],
      tagline: newRecord.short_description,
      description: newRecord.short_description,
      longDescription: newRecord.full_description,
      iconType: (newRecord.icon as any) || 'code',
      features: newRecord.features,
      deliverables: newRecord.benefits,
      process: newRecord.process,
      faqs: newRecord.faqs,
    };
    safeSetStorage(STORAGE_KEYS.SERVICES, [...existing, newServiceItem]);
    return newRecord;
  },

  async updateService(id: string, updates: Partial<ServiceRecord>): Promise<ServiceRecord> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('services')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (error) {
        console.error('Supabase updateService database failure:', error);
        throw new Error(error.message || 'Database error: Unable to update service in Supabase.');
      }
      if (!data) {
        throw new Error(`Service with ID "${id}" was not found in the Supabase database.`);
      }
    }

    const existing = safeGetStorage<ServiceItem[]>(STORAGE_KEYS.SERVICES, initialServices);
    const updated = existing.map((s) => {
      if (s.id === id) {
        return {
          ...s,
          title: updates.title ?? s.title,
          slug: updates.slug ?? s.slug,
          tagline: updates.short_description ?? s.tagline,
          description: updates.short_description ?? s.description,
          longDescription: updates.full_description ?? s.longDescription,
          iconType: (updates.icon ?? s.iconType) as any,
          features: updates.features ?? s.features,
          deliverables: updates.benefits ?? s.deliverables,
          faqs: updates.faqs ?? s.faqs,
        };
      }
      return s;
    });
    safeSetStorage(STORAGE_KEYS.SERVICES, updated);
    return { id, ...updates } as ServiceRecord;
  },

  async deleteService(id: string): Promise<boolean> {
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('services').delete().eq('id', id);
      if (error) {
        console.error('Supabase deleteService database failure:', error);
        throw new Error(error.message || 'Database error: Unable to delete service from Supabase.');
      }
    }
    const existing = safeGetStorage<ServiceItem[]>(STORAGE_KEYS.SERVICES, initialServices);
    safeSetStorage(STORAGE_KEYS.SERVICES, existing.filter((s) => s.id !== id));
    return true;
  },

  // --------------------------------------------------------------------------
  // PRICING MANAGER
  // --------------------------------------------------------------------------
  async listPricing(): Promise<PricingPackageRecord[]> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('pricing_packages')
        .select('*')
        .order('sort_order', { ascending: true });
      if (!error && data && data.length > 0) return data as PricingPackageRecord[];
    }
    const items = safeGetStorage<PricingPackage[]>(STORAGE_KEYS.PRICING, initialPricing);
    return items.map((p, idx) => ({
      id: p.id,
      title: p.name,
      slug: p.slug,
      description: p.bestFor || p.tagline,
      price: p.investment,
      regular_price: p.regularPrice,
      launch_price: p.launchPrice,
      badge: p.badge,
      currency: 'INR',
      billing_type: p.billingType || p.type || 'one-time',
      turnaround: p.turnaround || p.deliveryTime || '~7–14 Days',
      features: p.features,
      deliverables: p.deliverables,
      cta_label: p.ctaText || `Choose ${p.name}`,
      cta_url: `/contact?package=${encodeURIComponent(p.name)}`,
      is_featured: Boolean(p.popular),
      sort_order: idx + 1,
      status: 'published',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));
  },

  async createPricing(pkg: Partial<PricingPackageRecord>): Promise<PricingPackageRecord> {
    const id = pkg.id || `price-${Date.now()}`;
    const newRecord: PricingPackageRecord = {
      id,
      title: pkg.title || 'New Package',
      slug: pkg.slug || `package-${Date.now()}`,
      description: pkg.description || '',
      price: pkg.price || (pkg.launch_price ? `₹${pkg.launch_price.toLocaleString('en-IN')}` : '₹9,999'),
      regular_price: pkg.regular_price,
      launch_price: pkg.launch_price,
      badge: pkg.badge,
      currency: pkg.currency || 'INR',
      billing_type: pkg.billing_type || 'one-time',
      turnaround: pkg.turnaround || '~7 Days Delivery',
      features: pkg.features || [],
      deliverables: pkg.deliverables || [],
      cta_label: pkg.cta_label || `Choose ${pkg.title || 'Package'}`,
      cta_url: pkg.cta_url || '/contact',
      is_featured: pkg.is_featured ?? false,
      sort_order: pkg.sort_order ?? 10,
      status: pkg.status || 'published',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('pricing_packages').insert(newRecord).select().single();
      if (error) {
        console.error('Supabase createPricing database failure:', error);
        throw new Error(error.message || 'Database error: Unable to create pricing package in Supabase.');
      }
      if (!data) {
        throw new Error('Database returned no confirmed record after creating pricing package.');
      }
    }

    const existing = safeGetStorage<PricingPackage[]>(STORAGE_KEYS.PRICING, initialPricing);
    const newPkgItem: PricingPackage = {
      id: newRecord.id,
      name: newRecord.title,
      slug: newRecord.slug,
      tagline: newRecord.description,
      investment: newRecord.price,
      regularPrice: newRecord.regular_price,
      launchPrice: newRecord.launch_price,
      badge: newRecord.badge,
      billingType: newRecord.billing_type as any,
      type: newRecord.billing_type as any,
      turnaround: newRecord.turnaround,
      deliveryTime: newRecord.turnaround,
      popular: newRecord.is_featured,
      bestFor: newRecord.description,
      features: newRecord.features,
      deliverables: newRecord.deliverables,
      ctaText: newRecord.cta_label,
      inquiryMessage: `Hi Radha Krishna Sir, I would like to inquire about the ${newRecord.title} package.`,
    };
    safeSetStorage(STORAGE_KEYS.PRICING, [...existing, newPkgItem]);
    return newRecord;
  },

  async updatePricing(id: string, updates: Partial<PricingPackageRecord>): Promise<PricingPackageRecord> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('pricing_packages')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (error) {
        console.error('Supabase updatePricing database failure:', error);
        throw new Error(error.message || 'Database error: Unable to update pricing package in Supabase.');
      }
      if (!data) {
        throw new Error(`Pricing package with ID "${id}" was not found in Supabase database.`);
      }
    }

    const existing = safeGetStorage<PricingPackage[]>(STORAGE_KEYS.PRICING, initialPricing);
    const updated = existing.map((p) => {
      if (p.id === id) {
        return {
          ...p,
          name: updates.title ?? p.name,
          slug: updates.slug ?? p.slug,
          investment: updates.price ?? p.investment,
          regularPrice: updates.regular_price ?? p.regularPrice,
          launchPrice: updates.launch_price ?? p.launchPrice,
          badge: updates.badge ?? p.badge,
          billingType: (updates.billing_type as any) ?? p.billingType,
          type: (updates.billing_type as any) ?? p.type,
          turnaround: updates.turnaround ?? p.turnaround,
          deliveryTime: updates.turnaround ?? p.deliveryTime,
          popular: updates.is_featured ?? p.popular,
          bestFor: updates.description ?? p.bestFor,
          tagline: updates.description ?? p.tagline,
          features: updates.features ?? p.features,
          deliverables: updates.deliverables ?? p.deliverables,
          ctaText: updates.cta_label ?? p.ctaText,
        };
      }
      return p;
    });
    safeSetStorage(STORAGE_KEYS.PRICING, updated);
    return { id, ...updates } as PricingPackageRecord;
  },

  async deletePricing(id: string): Promise<boolean> {
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('pricing_packages').delete().eq('id', id);
      if (error) {
        console.error('Supabase deletePricing database failure:', error);
        throw new Error(error.message || 'Database error: Unable to delete pricing package from Supabase.');
      }
    }
    const existing = safeGetStorage<PricingPackage[]>(STORAGE_KEYS.PRICING, initialPricing);
    safeSetStorage(STORAGE_KEYS.PRICING, existing.filter((p) => p.id !== id));
    return true;
  },

  // --------------------------------------------------------------------------
  // PORTFOLIO PROJECTS MANAGER
  // --------------------------------------------------------------------------
  async listProjects(): Promise<PortfolioProjectRecord[]> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('portfolio_projects')
        .select('*')
        .order('sort_order', { ascending: true });
      if (!error && data && data.length > 0) return data as PortfolioProjectRecord[];
    }
    const items = safeGetStorage<ProjectItem[]>(STORAGE_KEYS.PROJECTS, initialProjects);
    return items.map((p, idx) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      category: p.category,
      description: p.description,
      thumbnail_url: p.image,
      project_url: p.externalUrl || null,
      project_type: p.isConcept ? 'Studio Concept' : 'Client Work',
      is_verified_client_work: !p.isConcept,
      is_featured: Boolean(p.featured),
      year: p.year,
      deliverables: p.deliverables,
      challenge: p.challenge,
      solution: p.solution,
      key_features: p.keyFeatures,
      tech_stack: p.techStack,
      sort_order: idx + 1,
      status: 'published',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));
  },

  async createProject(project: Partial<PortfolioProjectRecord>): Promise<PortfolioProjectRecord> {
    if (project.thumbnail_url && typeof project.thumbnail_url === 'string' && project.thumbnail_url.startsWith('blob:')) {
      throw new Error('Temporary browser blob URL cannot be persisted. Please upload the image file to Supabase Storage before saving.');
    }

    const id = project.id || `proj-${Date.now()}`;
    const newRecord: PortfolioProjectRecord = {
      id,
      title: project.title || 'New Project',
      slug: project.slug || `project-${Date.now()}`,
      category: project.category || 'Architecture & Design',
      description: project.description || '',
      thumbnail_url: project.thumbnail_url || '/assets/images/Aurora living.jpg',
      project_url: project.project_url || null,
      project_type: project.is_verified_client_work ? 'Verified Client' : 'Studio Concept',
      is_verified_client_work: project.is_verified_client_work ?? false,
      is_featured: project.is_featured ?? true,
      year: project.year || '2025–2026',
      deliverables: project.deliverables || [],
      challenge: project.challenge || '',
      solution: project.solution || '',
      key_features: project.key_features || [],
      tech_stack: project.tech_stack || ['React', 'Tailwind CSS'],
      sort_order: project.sort_order ?? 10,
      status: project.status || 'published',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('portfolio_projects').insert(newRecord).select().single();
      if (error) {
        console.error('Supabase createProject database failure:', error);
        throw new Error(error.message || 'Database error: Unable to create project in Supabase.');
      }
      if (!data) {
        throw new Error('Database returned no confirmed record after creating project.');
      }
    }

    const existing = safeGetStorage<ProjectItem[]>(STORAGE_KEYS.PROJECTS, initialProjects);
    const newProjItem: ProjectItem = {
      id: newRecord.id,
      slug: newRecord.slug,
      title: newRecord.title,
      category: newRecord.category,
      tagline: newRecord.project_type,
      description: newRecord.description,
      image: newRecord.thumbnail_url,
      alt: newRecord.title,
      isConcept: !newRecord.is_verified_client_work,
      year: newRecord.year,
      deliverables: newRecord.deliverables,
      challenge: newRecord.challenge || '',
      solution: newRecord.solution || '',
      keyFeatures: newRecord.key_features,
      techStack: newRecord.tech_stack,
      externalUrl: newRecord.project_url || undefined,
      featured: newRecord.is_featured,
    };
    safeSetStorage(STORAGE_KEYS.PROJECTS, [...existing, newProjItem]);
    return newRecord;
  },

  async updateProject(id: string, updates: Partial<PortfolioProjectRecord>): Promise<PortfolioProjectRecord> {
    if (updates.thumbnail_url && typeof updates.thumbnail_url === 'string' && updates.thumbnail_url.startsWith('blob:')) {
      throw new Error('Temporary browser blob URL cannot be persisted. Please upload the image file to Supabase Storage before saving.');
    }

    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('portfolio_projects')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (error) {
        console.error('Supabase updateProject database failure:', error);
        throw new Error(error.message || 'Database error: Unable to update project in Supabase.');
      }
      if (!data) {
        throw new Error(`Project with ID "${id}" was not found in Supabase database.`);
      }
    }

    const existing = safeGetStorage<ProjectItem[]>(STORAGE_KEYS.PROJECTS, initialProjects);
    const updated = existing.map((p) => {
      if (p.id === id) {
        return {
          ...p,
          title: updates.title ?? p.title,
          slug: updates.slug ?? p.slug,
          category: updates.category ?? p.category,
          description: updates.description ?? p.description,
          image: updates.thumbnail_url ?? p.image,
          isConcept: updates.is_verified_client_work !== undefined ? !updates.is_verified_client_work : p.isConcept,
          externalUrl: updates.project_url ?? p.externalUrl,
          featured: updates.is_featured ?? p.featured,
        };
      }
      return p;
    });
    safeSetStorage(STORAGE_KEYS.PROJECTS, updated);
    return { id, ...updates } as PortfolioProjectRecord;
  },

  async deleteProject(id: string): Promise<boolean> {
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('portfolio_projects').delete().eq('id', id);
      if (error) {
        console.error('Supabase deleteProject database failure:', error);
        throw new Error(error.message || 'Database error: Unable to delete project from Supabase.');
      }
    }
    const existing = safeGetStorage<ProjectItem[]>(STORAGE_KEYS.PROJECTS, initialProjects);
    safeSetStorage(STORAGE_KEYS.PROJECTS, existing.filter((p) => p.id !== id));
    return true;
  },

  // --------------------------------------------------------------------------
  // LEADS CRM
  // --------------------------------------------------------------------------
  async listLeads(): Promise<LeadRecord[]> {
    if (isSupabaseConfigured) {
      let data: any[] | null = null;
      let directError: any = null;

      // 1. Direct Supabase Query using authenticated admin user session
      try {
        const res = await supabase
          .from('leads')
          .select('*')
          .order('created_at', { ascending: false });
        data = res.data;
        directError = res.error;
      } catch (err: any) {
        directError = err;
      }

      // If direct query succeeded and returned records, map and return them
      if (data && data.length > 0) {
        return data.map(mapDatabaseLead);
      }

      // 2. Authenticated Server API Fallback:
      // If direct query returned 0 rows (e.g. Row Level Security policy missing for SELECT)
      // or encountered a database error, query the secure /api/leads endpoint using admin JWT Bearer token
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const token = sessionData?.session?.access_token;
        if (token) {
          const apiRes = await fetch('/api/leads', {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
          if (apiRes.ok) {
            const apiJson = await apiRes.json();
            if (Array.isArray(apiJson.leads) && apiJson.leads.length > 0) {
              return apiJson.leads.map(mapDatabaseLead);
            }
          }
        }
      } catch (apiErr) {
        console.warn('[Yugark Studio] Authenticated API leads query fallback error:', apiErr);
      }

      if (directError && !data) {
        console.error('[Yugark Studio] Supabase listLeads error:', directError);
        throw new Error(directError.message || 'Unable to retrieve leads from the Supabase database. Please check authorization.');
      }

      if (data) {
        return data.map(mapDatabaseLead);
      }
    }

    // Never return mock demo leads in production dashboard
    return [];
  },

  async updateLeadStatus(id: string, status: LeadRecord['status'], remarks?: string): Promise<LeadRecord> {
    if (isSupabaseConfigured) {
      const updatePayload: Record<string, any> = {
        status,
        updated_at: new Date().toISOString(),
      };
      if (remarks !== undefined) {
        updatePayload.remarks = remarks;
      }

      let { data, error } = await supabase
        .from('leads')
        .update(updatePayload)
        .eq('id', id)
        .select()
        .single();

      // If remarks or updated_at column is missing, retry updating status only
      if (error && (error.message.includes('column') || error.code === '42703')) {
        const fallbackRes = await supabase
          .from('leads')
          .update({ status })
          .eq('id', id)
          .select()
          .single();
        data = fallbackRes.data;
        error = fallbackRes.error;
      }

      // If direct update failed due to RLS, try authenticated server API
      if (error) {
        try {
          const { data: sessionData } = await supabase.auth.getSession();
          const token = sessionData?.session?.access_token;
          if (token) {
            const apiRes = await fetch('/api/leads', {
              method: 'PATCH',
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ id, status, remarks }),
            });
            if (apiRes.ok) {
              const apiJson = await apiRes.json();
              if (apiJson.lead) {
                return mapDatabaseLead(apiJson.lead);
              }
            }
          }
        } catch (apiErr) {
          console.warn('[Yugark Studio] API updateLeadStatus fallback error:', apiErr);
        }

        console.error('[Yugark Studio] Supabase updateLeadStatus error:', error);
        throw new Error(error.message || 'Failed to update lead status in Supabase database.');
      }

      if (data) {
        return mapDatabaseLead(data);
      }
    }

    const existing = safeGetStorage<LeadRecord[]>(STORAGE_KEYS.LEADS, []);
    const updated = existing.map((l) =>
      l.id === id ? { ...l, status, remarks: remarks ?? l.remarks, updated_at: new Date().toISOString() } : l
    );
    safeSetStorage(STORAGE_KEYS.LEADS, updated);
    const found = updated.find((l) => l.id === id);
    return found ? mapDatabaseLead(found) : mapDatabaseLead({ id, status, remarks });
  },

  async updateLeadPriority(id: string, priority: LeadRecord['priority']): Promise<void> {
    if (isSupabaseConfigured) {
      let { error } = await supabase
        .from('leads')
        .update({ priority, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error && (error.message.includes('column') || error.code === '42703')) {
        const fallbackRes = await supabase
          .from('leads')
          .update({ priority })
          .eq('id', id);
        error = fallbackRes.error;
      }

      // If direct update failed due to RLS, try authenticated server API
      if (error) {
        try {
          const { data: sessionData } = await supabase.auth.getSession();
          const token = sessionData?.session?.access_token;
          if (token) {
            const apiRes = await fetch('/api/leads', {
              method: 'PATCH',
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ id, priority }),
            });
            if (apiRes.ok) {
              return;
            }
          }
        } catch (apiErr) {
          console.warn('[Yugark Studio] API updateLeadPriority fallback error:', apiErr);
        }

        console.error('[Yugark Studio] Supabase updateLeadPriority error:', error);
        throw new Error(error.message || 'Failed to update lead priority in Supabase database.');
      }
      return;
    }

    const existing = safeGetStorage<LeadRecord[]>(STORAGE_KEYS.LEADS, []);
    safeSetStorage(
      STORAGE_KEYS.LEADS,
      existing.map((l) => (l.id === id ? { ...l, priority, updated_at: new Date().toISOString() } : l))
    );
  },

  // --------------------------------------------------------------------------
  // MEDIA LIBRARY
  // --------------------------------------------------------------------------
  async listMediaAssets(): Promise<Array<{ id: string; name: string; url: string; size: string; type: string; date: string }>> {
    const bundledImages = [
      { id: 'img-1', name: 'hero.jpg', url: '/assets/images/hero.jpg', size: '445 KB', type: 'image/jpeg', date: '2026-10-01' },
      { id: 'img-2', name: 'Business pro.jpg', url: '/assets/images/Business pro.jpg', size: '840 KB', type: 'image/jpeg', date: '2026-10-02' },
      { id: 'img-3', name: 'Aurora living.jpg', url: '/assets/images/Aurora living.jpg', size: '920 KB', type: 'image/jpeg', date: '2026-10-03' },
      { id: 'img-4', name: 'Fit Life.jpg', url: '/assets/images/Fit Life.jpg', size: '780 KB', type: 'image/jpeg', date: '2026-10-04' },
      { id: 'img-5', name: 'Sole beauty.jpg', url: '/assets/images/Sole beauty.jpg', size: '1.1 MB', type: 'image/jpeg', date: '2026-10-05' },
      { id: 'img-6', name: 'content-and-social-media.jpg', url: '/assets/images/content-and-social-media.jpg', size: '336 KB', type: 'image/jpeg', date: '2026-10-06' },
    ];

    const userUploaded = safeGetStorage<any[]>(STORAGE_KEYS.MEDIA, []);
    return [...userUploaded, ...bundledImages];
  },

  async registerMediaAsset(asset: { name: string; url: string; size: string; type: string }): Promise<void> {
    const existing = safeGetStorage<any[]>(STORAGE_KEYS.MEDIA, []);
    const newAsset = {
      id: `media-${Date.now()}`,
      ...asset,
      date: new Date().toISOString().split('T')[0],
    };
    safeSetStorage(STORAGE_KEYS.MEDIA, [newAsset, ...existing]);

    if (isSupabaseConfigured) {
      try {
        await supabase.from('media_assets').insert({
          file_name: asset.name,
          storage_path: asset.name,
          public_url: asset.url,
          mime_type: asset.type,
          file_size: 1024,
        });
      } catch (err) {
        console.warn('Supabase media registration error:', err);
      }
    }
  },

  async deleteMediaAsset(id: string): Promise<void> {
    const existing = safeGetStorage<any[]>(STORAGE_KEYS.MEDIA, []);
    safeSetStorage(STORAGE_KEYS.MEDIA, existing.filter((m) => m.id !== id));
  },

  // --------------------------------------------------------------------------
  // PAGE CONTENT & HERO EDITOR
  // --------------------------------------------------------------------------
  async getHomepageContent(): Promise<{
    headlineLine1: string;
    headlineLine2: string;
    headlineLine3Accent: string;
    heroDescription: string;
    brandStatementTitle: string;
    brandStatementText: string;
    footerText: string;
  }> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('website_settings')
          .select('page_content')
          .limit(1)
          .maybeSingle();
        if (!error && data?.page_content && typeof data.page_content === 'object' && Object.keys(data.page_content).length > 0) {
          return data.page_content;
        }
      } catch (err) {
        console.warn('Supabase getHomepageContent error:', err);
      }
    }
    const settings = await getWebsiteSettings();
    const defaults = {
      headlineLine1: settings.headlineLine1 || 'We Build.',
      headlineLine2: settings.headlineLine2 || 'We Create.',
      headlineLine3Accent: settings.headlineLine3Accent || 'We Grow Brands.',
      heroDescription: settings.heroDescription || 'Websites, creative content and digital marketing solutions designed to help your brand look better, connect deeper and grow further.',
      brandStatementTitle: 'A Digital Studio for What\'s Next',
      brandStatementText: 'We help founders, brands, and modern businesses build unforgettable web experiences, tell compelling visual stories, and capture high-intent demand across digital channels.',
      footerText: 'Websites. Creative Content. Digital Marketing. We help modern brands build, create and grow in the digital world.',
    };
    return safeGetStorage(STORAGE_KEYS.PAGE_CONTENT, defaults);
  },

  async updateHomepageContent(content: any): Promise<void> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('website_settings')
        .update({ page_content: content, updated_at: new Date().toISOString() })
        .eq('id', 'a0000000-0000-0000-0000-000000000001')
        .select()
        .single();
      if (error) {
        console.error('Supabase updateHomepageContent database failure:', error);
        throw new Error(error.message || 'Database error: Unable to update page content in Supabase.');
      }
      if (!data) {
        throw new Error('Database updated 0 rows. Please verify website_settings table exists.');
      }
    }
    safeSetStorage(STORAGE_KEYS.PAGE_CONTENT, content);
  },

  // --------------------------------------------------------------------------
  // HERO MANAGER
  // --------------------------------------------------------------------------
  async getHeroSettings(): Promise<{
    heroImage: string;
    heroStates: Array<{
      eyebrow: string;
      headline: string;
      supportingText: string;
      labels: string[];
    }>;
    ctaPrimaryText: string;
    ctaSecondaryText: string;
    ctaDemoText: string;
  }> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('website_settings')
          .select('hero_config')
          .limit(1)
          .maybeSingle();
        if (!error && data?.hero_config && typeof data.hero_config === 'object' && Array.isArray((data.hero_config as any).heroStates)) {
          return data.hero_config;
        }
      } catch (err) {
        console.warn('Supabase getHeroSettings error:', err);
      }
    }
    const defaultHero = {
      heroImage: '/assets/images/hero.jpg',
      heroStates: [
        {
          eyebrow: 'DIGITAL STUDIO FOR MODERN BRANDS',
          headline: 'We Build.',
          supportingText: 'Premium websites and smart digital systems that help your business make a lasting impression.',
          labels: ['Business Websites', 'Landing Pages', 'Lead Management'],
        },
        {
          eyebrow: 'CREATIVE CONTENT THAT CONNECTS',
          headline: 'We Create.',
          supportingText: 'Engaging videos, social media content and brand creatives that make your business stand out.',
          labels: ['Promotional Videos', 'Social Media', 'Brand Creatives'],
        },
        {
          eyebrow: 'STRATEGY FOR BUSINESS GROWTH',
          headline: 'We Grow Brands.',
          supportingText: 'Targeted advertising and digital strategies that help your business reach more customers.',
          labels: ['Meta & Google Ads', 'Content Strategy', 'Digital Growth'],
        },
      ],
      ctaPrimaryText: 'Start Project',
      ctaSecondaryText: 'View Our Work',
      ctaDemoText: 'Get Your Free Website Demo',
    };
    return safeGetStorage(STORAGE_KEYS.HERO, defaultHero);
  },

  async updateHeroSettings(heroData: any): Promise<void> {
    if (heroData?.heroImage && typeof heroData.heroImage === 'string' && heroData.heroImage.startsWith('blob:')) {
      throw new Error('Temporary browser blob URL cannot be persisted. Please upload the hero image to Supabase Storage before saving.');
    }

    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('website_settings')
        .update({ hero_config: heroData, updated_at: new Date().toISOString() })
        .eq('id', 'a0000000-0000-0000-0000-000000000001')
        .select()
        .single();
      if (error) {
        console.error('Supabase updateHeroSettings database failure:', error);
        throw new Error(error.message || 'Database error: Unable to update hero settings in Supabase.');
      }
      if (!data) {
        throw new Error('Database updated 0 rows. Please verify website_settings table exists.');
      }
    }
    safeSetStorage(STORAGE_KEYS.HERO, heroData);
  },

  // --------------------------------------------------------------------------
  // SETTINGS & SEO
  // --------------------------------------------------------------------------
  async updateSettings(settings: Partial<WebsiteSettingsRecord>): Promise<any> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('website_settings')
        .update({ ...settings, updated_at: new Date().toISOString() })
        .eq('id', 'a0000000-0000-0000-0000-000000000001')
        .select()
        .single();
      if (error) {
        console.error('Supabase updateSettings database failure:', error);
        throw new Error(error.message || 'Database error: Unable to update website settings in Supabase.');
      }
      if (!data) {
        throw new Error('Database returned no confirmed record after updating website settings.');
      }
    }

    const current = safeGetStorage<SiteConfig>(STORAGE_KEYS.SETTINGS, initialSiteConfig);
    const updated: SiteConfig = {
      ...current,
      studioName: settings.site_name || current.studioName,
      tagline: settings.tagline || current.tagline,
      contactEmail: settings.business_email || current.contactEmail,
      whatsappNumber: settings.whatsapp_number || current.whatsappNumber,
      whatsappUrl: `https://wa.me/${(settings.whatsapp_number || current.whatsappNumber || '919125205132').replace(/[^0-9]/g, '')}`,
      socials: {
        instagram: settings.social_links?.instagram || current.socials.instagram || 'https://www.instagram.com/yugark.in/',
        linkedin: settings.social_links?.linkedin || current.socials.linkedin,
        youtube: settings.social_links?.youtube || current.socials.youtube,
      },
    };
    safeSetStorage(STORAGE_KEYS.SETTINGS, updated);
    return updated;
  },

  // --------------------------------------------------------------------------
  // BROWSER-TO-SUPABASE DATA MIGRATION UTILITY
  // --------------------------------------------------------------------------
  async syncLocalStorageToSupabase(
    dryRun: boolean = false,
    approvedRecordKeys: string[] = []
  ): Promise<SyncMigrationResult> {
    const summary: SyncMigrationResult['summary'] = {
      settings: 0,
      hero: 0,
      pages: 0,
      demos: 0,
      services: 0,
      pricing: 0,
      projects: 0,
      blogs: 0,
      totalLocal: 0,
      inserts: 0,
      updates: 0,
      identical: 0,
      conflicts: 0,
      approved: 0,
    };
    const records: MigrationRecordItem[] = [];
    const conflicts: Array<{ type: string; key: string; localTitle?: string; remoteTitle?: string; resolution: string }> = [];
    const errors: string[] = [];

    if (!isSupabaseConfigured) {
      return {
        success: false,
        isDryRun: dryRun,
        summary,
        records,
        conflicts,
        errors: ['Supabase connection credentials are not configured in environment.'],
      };
    }

    try {
      // 1. Fetch remote tables with comprehensive error reporting
      const [
        { data: remoteSettingsData, error: settingsError },
        { data: remoteDemosData, error: demosError },
        { data: remoteServicesData, error: servicesError },
        { data: remotePricingData, error: pricingError },
        { data: remoteProjectsData, error: projectsError },
        { data: remoteBlogsData, error: blogsError },
      ] = await Promise.all([
        supabase.from('website_settings').select('*').limit(1).maybeSingle(),
        supabase.from('website_demos').select('*'),
        supabase.from('services').select('*'),
        supabase.from('pricing_packages').select('*'),
        supabase.from('portfolio_projects').select('*'),
        supabase.from('blog_posts').select('*'),
      ]);

      if (settingsError) errors.push(`website_settings query: ${settingsError.message}`);
      if (demosError) errors.push(`website_demos query: ${demosError.message}`);
      if (servicesError) errors.push(`services query: ${servicesError.message}`);
      if (pricingError) errors.push(`pricing_packages query: ${pricingError.message}`);
      if (projectsError) errors.push(`portfolio_projects query: ${projectsError.message}`);
      if (blogsError) errors.push(`blog_posts query: ${blogsError.message}`);

      const remoteSettings = remoteSettingsData as any;
      const remoteDemos = (remoteDemosData || []) as any[];
      const remoteServices = (remoteServicesData || []) as any[];
      const remotePricing = (remotePricingData || []) as any[];
      const remoteProjects = (remoteProjectsData || []) as any[];
      const remoteBlogs = (remoteBlogsData || []) as any[];

      const remoteDemosBySlug = new Map(remoteDemos.map((d) => [d.slug, d]));
      const remoteDemosById = new Map(remoteDemos.filter((d) => d.id).map((d) => [d.id, d]));

      const remoteServicesBySlug = new Map(remoteServices.map((s) => [s.slug, s]));
      const remoteServicesById = new Map(remoteServices.filter((s) => s.id).map((s) => [s.id, s]));

      const remotePricingBySlug = new Map(remotePricing.map((p) => [p.slug, p]));
      const remotePricingById = new Map(remotePricing.filter((p) => p.id).map((p) => [p.id, p]));

      const remoteProjectsBySlug = new Map(remoteProjects.map((p) => [p.slug, p]));
      const remoteProjectsById = new Map(remoteProjects.filter((p) => p.id).map((p) => [p.id, p]));

      const remoteBlogsBySlug = new Map(remoteBlogs.map((b) => [b.slug, b]));
      const remoteBlogsById = new Map(remoteBlogs.filter((b) => b.id).map((b) => [b.id, b]));

      // ----------------------------------------------------------------------
      // 2. WEBSITE SETTINGS, HERO & PAGES (SINGLETON ENTITIES)
      // ----------------------------------------------------------------------
      const localSettings = safeGetStorage<any>(STORAGE_KEYS.SETTINGS, null);
      if (localSettings) {
        summary.settings = 1;
        const key = 'website_settings:singleton';
        if (!remoteSettings) {
          records.push({
            table: 'website_settings',
            key,
            id: 'a0000000-0000-0000-0000-000000000001',
            slug: 'singleton',
            localTitle: localSettings.studioName || 'Studio Settings',
            remoteTitle: undefined,
            action: 'insert',
            status: 'safe_insert',
            isProtected: false,
            resolution: 'New settings record. Safe to insert into Supabase.',
            differences: ['No remote settings record found in Supabase.'],
            localData: localSettings,
          });
        } else {
          const diffs: string[] = [];
          if (localSettings.studioName && localSettings.studioName !== remoteSettings.site_name) {
            diffs.push(`Studio Name differs: local "${localSettings.studioName}" vs remote "${remoteSettings.site_name}"`);
          }
          if (localSettings.tagline && localSettings.tagline !== remoteSettings.tagline) {
            diffs.push(`Tagline differs: local "${localSettings.tagline}" vs remote "${remoteSettings.tagline}"`);
          }
          if (localSettings.contactEmail && localSettings.contactEmail !== remoteSettings.business_email) {
            diffs.push(`Email differs: local "${localSettings.contactEmail}" vs remote "${remoteSettings.business_email}"`);
          }
          if (
            localSettings.whatsappNumber &&
            localSettings.whatsappNumber.replace(/\D/g, '') !== (remoteSettings.whatsapp_number || '').replace(/\D/g, '')
          ) {
            diffs.push(`WhatsApp differs: local "${localSettings.whatsappNumber}" vs remote "${remoteSettings.whatsapp_number}"`);
          }
          if (
            localSettings.socials?.instagram &&
            remoteSettings.social_links?.instagram &&
            localSettings.socials.instagram !== remoteSettings.social_links.instagram
          ) {
            diffs.push(`Instagram differs: local "${localSettings.socials.instagram}" vs remote "${remoteSettings.social_links.instagram}"`);
          }

          const hasDiff = diffs.length > 0;
          records.push({
            table: 'website_settings',
            key,
            id: remoteSettings.id || 'a0000000-0000-0000-0000-000000000001',
            slug: 'singleton',
            localTitle: localSettings.studioName || 'Studio Settings',
            remoteTitle: remoteSettings.site_name || 'Production Settings',
            action: hasDiff ? 'conflict' : 'identical',
            status: hasDiff ? 'protected_conflict' : 'identical_skip',
            isProtected: hasDiff,
            resolution: hasDiff
              ? 'Remote production settings differ. Protected from overwrite unless explicitly approved.'
              : 'Identical to production Supabase settings. Safe skip.',
            differences: hasDiff ? diffs : ['All primary fields match production Supabase record.'],
            localData: localSettings,
            remoteData: remoteSettings,
          });
        }
      }

      const localHero = safeGetStorage<any>(STORAGE_KEYS.HERO, null);
      if (localHero) {
        summary.hero = 1;
        const key = 'hero:config';
        const remoteHero = remoteSettings?.hero_config;
        if (!remoteHero) {
          records.push({
            table: 'hero',
            key,
            slug: 'hero-config',
            localTitle: 'Hero Configuration',
            remoteTitle: undefined,
            action: 'insert',
            status: 'safe_insert',
            isProtected: false,
            resolution: 'New hero configuration. Safe to insert into Supabase.',
            differences: ['No remote hero_config in website_settings.'],
            localData: localHero,
          });
        } else {
          const diffs: string[] = [];
          if (localHero.heroImage && localHero.heroImage !== remoteHero.heroImage) {
            diffs.push(`Hero image differs: local "${localHero.heroImage}" vs remote "${remoteHero.heroImage}"`);
          }
          if (localHero.heroStates?.[0]?.headline !== remoteHero.heroStates?.[0]?.headline) {
            diffs.push(`Primary headline differs: local "${localHero.heroStates?.[0]?.headline}" vs remote "${remoteHero.heroStates?.[0]?.headline}"`);
          }
          const hasDiff = diffs.length > 0;
          records.push({
            table: 'hero',
            key,
            slug: 'hero-config',
            localTitle: `Hero Config (${localHero.heroStates?.[0]?.headline || 'Default'})`,
            remoteTitle: `Production Hero (${remoteHero.heroStates?.[0]?.headline || 'Production'})`,
            action: hasDiff ? 'conflict' : 'identical',
            status: hasDiff ? 'protected_conflict' : 'identical_skip',
            isProtected: hasDiff,
            resolution: hasDiff ? 'Remote hero configuration differs. Protected from overwrite.' : 'Hero configuration matches production. Safe skip.',
            differences: hasDiff ? diffs : ['Hero images and slide headlines match production.'],
            localData: localHero,
            remoteData: remoteHero,
          });
        }
      }

      const localPages = safeGetStorage<any>(STORAGE_KEYS.PAGE_CONTENT, null);
      if (localPages) {
        summary.pages = 1;
        const key = 'pages:content';
        const remotePages = remoteSettings?.page_content;
        if (!remotePages) {
          records.push({
            table: 'pages',
            key,
            slug: 'page-content',
            localTitle: 'Page Content',
            remoteTitle: undefined,
            action: 'insert',
            status: 'safe_insert',
            isProtected: false,
            resolution: 'New page content. Safe to insert into Supabase.',
            differences: ['No remote page_content in website_settings.'],
            localData: localPages,
          });
        } else {
          const diffs: string[] = [];
          if (localPages.headlineLine1 !== remotePages.headlineLine1 || localPages.headlineLine2 !== remotePages.headlineLine2) {
            diffs.push(`Headlines differ: local "${localPages.headlineLine1} ${localPages.headlineLine2}" vs remote "${remotePages.headlineLine1} ${remotePages.headlineLine2}"`);
          }
          if (localPages.brandStatementTitle !== remotePages.brandStatementTitle) {
            diffs.push(`Brand statement differs`);
          }
          const hasDiff = diffs.length > 0;
          records.push({
            table: 'pages',
            key,
            slug: 'page-content',
            localTitle: 'Homepage Page Content',
            remoteTitle: 'Production Page Content',
            action: hasDiff ? 'conflict' : 'identical',
            status: hasDiff ? 'protected_conflict' : 'identical_skip',
            isProtected: hasDiff,
            resolution: hasDiff ? 'Remote page content differs. Protected from overwrite.' : 'Page content matches production. Safe skip.',
            differences: hasDiff ? diffs : ['All homepage content sections match production.'],
            localData: localPages,
            remoteData: remotePages,
          });
        }
      }

      // ----------------------------------------------------------------------
      // 3. WEBSITE DEMOS
      // ----------------------------------------------------------------------
      const localDemos = safeGetStorage<DemoItem[]>(STORAGE_KEYS.DEMOS, []);
      summary.demos = localDemos.length;
      for (const demo of localDemos) {
        const key = `website_demos:${demo.slug}`;
        const remote = remoteDemosBySlug.get(demo.slug) || (demo.id ? remoteDemosById.get(demo.id) : null);
        if (!remote) {
          records.push({
            table: 'website_demos',
            key,
            id: demo.id,
            slug: demo.slug,
            localTitle: demo.title,
            remoteTitle: undefined,
            action: 'insert',
            status: 'safe_insert',
            isProtected: false,
            resolution: 'New demo record not in Supabase. Safe to insert.',
            differences: ['Demo does not exist in production Supabase database.'],
            localData: demo,
          });
        } else {
          const diffs: string[] = [];
          if (demo.title?.trim() !== remote.title?.trim()) {
            diffs.push(`Title differs: local "${demo.title}" vs remote "${remote.title}"`);
          }
          if ((demo.description || '').trim() !== (remote.short_description || '').trim()) {
            diffs.push(`Description differs`);
          }
          if (demo.liveDemoUrl && remote.demo_url && demo.liveDemoUrl.trim() !== remote.demo_url.trim()) {
            diffs.push(`Demo URL differs: local "${demo.liveDemoUrl}" vs remote "${remote.demo_url}"`);
          }
          if (demo.image && remote.thumbnail_url && demo.image.trim() !== remote.thumbnail_url.trim()) {
            diffs.push(`Thumbnail image differs: local "${demo.image}" vs remote "${remote.thumbnail_url}"`);
          }
          if (demo.featured !== undefined && remote.is_featured !== undefined && Boolean(demo.featured) !== Boolean(remote.is_featured)) {
            diffs.push(`Featured flag differs: local ${demo.featured} vs remote ${remote.is_featured}`);
          }
          const hasDiff = diffs.length > 0;
          records.push({
            table: 'website_demos',
            key,
            id: remote.id || demo.id,
            slug: demo.slug,
            localTitle: demo.title,
            remoteTitle: remote.title,
            action: hasDiff ? 'conflict' : 'identical',
            status: hasDiff ? 'protected_conflict' : 'identical_skip',
            isProtected: hasDiff,
            resolution: hasDiff
              ? 'Existing production demo with matching slug will NOT be overwritten without admin approval.'
              : 'Demo record is identical to production Supabase record. Safe skip.',
            differences: hasDiff ? diffs : ['Record is identical to production database.'],
            localData: demo,
            remoteData: remote,
          });
        }
      }

      // ----------------------------------------------------------------------
      // 4. SERVICES
      // ----------------------------------------------------------------------
      const localServices = safeGetStorage<ServiceItem[]>(STORAGE_KEYS.SERVICES, []);
      summary.services = localServices.length;
      for (const s of localServices) {
        const key = `services:${s.slug}`;
        const remote = remoteServicesBySlug.get(s.slug) || (s.id ? remoteServicesById.get(s.id) : null);
        if (!remote) {
          records.push({
            table: 'services',
            key,
            id: s.id,
            slug: s.slug,
            localTitle: s.title,
            remoteTitle: undefined,
            action: 'insert',
            status: 'safe_insert',
            isProtected: false,
            resolution: 'New service record. Safe to insert into Supabase.',
            differences: ['Service does not exist in production Supabase database.'],
            localData: s,
          });
        } else {
          const diffs: string[] = [];
          if (s.title?.trim() !== remote.title?.trim()) {
            diffs.push(`Title differs: local "${s.title}" vs remote "${remote.title}"`);
          }
          if (s.regularPrice !== undefined && remote.regular_price !== undefined && Number(s.regularPrice) !== Number(remote.regular_price)) {
            diffs.push(`Regular price differs: local ₹${s.regularPrice} vs remote ₹${remote.regular_price}`);
          }
          if (s.launchPrice !== undefined && remote.launch_price !== undefined && Number(s.launchPrice) !== Number(remote.launch_price)) {
            diffs.push(`Launch price differs: local ₹${s.launchPrice} vs remote ₹${remote.launch_price}`);
          }
          if ((s.description || s.tagline || '').trim() !== (remote.short_description || '').trim()) {
            diffs.push(`Short description differs`);
          }
          const hasDiff = diffs.length > 0;
          records.push({
            table: 'services',
            key,
            id: remote.id || s.id,
            slug: s.slug,
            localTitle: s.title,
            remoteTitle: remote.title,
            action: hasDiff ? 'conflict' : 'identical',
            status: hasDiff ? 'protected_conflict' : 'identical_skip',
            isProtected: hasDiff,
            resolution: hasDiff
              ? 'Existing production service record found; preserved by default.'
              : 'Service is identical to production Supabase record. Safe skip.',
            differences: hasDiff ? diffs : ['Record is identical to production database.'],
            localData: s,
            remoteData: remote,
          });
        }
      }

      // ----------------------------------------------------------------------
      // 5. PRICING PACKAGES
      // ----------------------------------------------------------------------
      const localPricing = safeGetStorage<PricingPackage[]>(STORAGE_KEYS.PRICING, []);
      summary.pricing = localPricing.length;
      for (const p of localPricing) {
        const key = `pricing_packages:${p.slug}`;
        const remote = remotePricingBySlug.get(p.slug) || (p.id ? remotePricingById.get(p.id) : null);
        if (!remote) {
          records.push({
            table: 'pricing_packages',
            key,
            id: p.id,
            slug: p.slug,
            localTitle: p.name,
            remoteTitle: undefined,
            action: 'insert',
            status: 'safe_insert',
            isProtected: false,
            resolution: 'New pricing package. Safe to insert into Supabase.',
            differences: ['Pricing package does not exist in production database.'],
            localData: p,
          });
        } else {
          const diffs: string[] = [];
          if (p.name?.trim() !== remote.title?.trim()) {
            diffs.push(`Package name differs: local "${p.name}" vs remote "${remote.title}"`);
          }
          if (p.regularPrice !== undefined && remote.regular_price !== undefined && Number(p.regularPrice) !== Number(remote.regular_price)) {
            diffs.push(`Regular price differs: local ₹${p.regularPrice} vs remote ₹${remote.regular_price}`);
          }
          if (p.launchPrice !== undefined && remote.launch_price !== undefined && Number(p.launchPrice) !== Number(remote.launch_price)) {
            diffs.push(`Launch price differs: local ₹${p.launchPrice} vs remote ₹${remote.launch_price}`);
          }
          if (p.investment && remote.price && p.investment !== remote.price) {
            diffs.push(`Price display differs: local "${p.investment}" vs remote "${remote.price}"`);
          }
          const hasDiff = diffs.length > 0;
          records.push({
            table: 'pricing_packages',
            key,
            id: remote.id || p.id,
            slug: p.slug,
            localTitle: p.name,
            remoteTitle: remote.title,
            action: hasDiff ? 'conflict' : 'identical',
            status: hasDiff ? 'protected_conflict' : 'identical_skip',
            isProtected: hasDiff,
            resolution: hasDiff
              ? 'Existing production pricing found; protected against overwrite.'
              : 'Pricing package is identical to production Supabase record. Safe skip.',
            differences: hasDiff ? diffs : ['Record is identical to production database.'],
            localData: p,
            remoteData: remote,
          });
        }
      }

      // ----------------------------------------------------------------------
      // 6. PORTFOLIO PROJECTS
      // ----------------------------------------------------------------------
      const localProjects = safeGetStorage<ProjectItem[]>(STORAGE_KEYS.PROJECTS, []);
      summary.projects = localProjects.length;
      for (const p of localProjects) {
        const key = `portfolio_projects:${p.slug}`;
        const remote = remoteProjectsBySlug.get(p.slug) || (p.id ? remoteProjectsById.get(p.id) : null);
        if (!remote) {
          records.push({
            table: 'portfolio_projects',
            key,
            id: p.id,
            slug: p.slug,
            localTitle: p.title,
            remoteTitle: undefined,
            action: 'insert',
            status: 'safe_insert',
            isProtected: false,
            resolution: 'New portfolio project. Safe to insert into Supabase.',
            differences: ['Project does not exist in production database.'],
            localData: p,
          });
        } else {
          const diffs: string[] = [];
          if (p.title?.trim() !== remote.title?.trim()) {
            diffs.push(`Title differs: local "${p.title}" vs remote "${remote.title}"`);
          }
          if (p.category?.trim() !== remote.category?.trim()) {
            diffs.push(`Category differs: local "${p.category}" vs remote "${remote.category}"`);
          }
          if (p.image?.trim() !== remote.thumbnail_url?.trim()) {
            diffs.push(`Thumbnail differs: local "${p.image}" vs remote "${remote.thumbnail_url}"`);
          }
          const hasDiff = diffs.length > 0;
          records.push({
            table: 'portfolio_projects',
            key,
            id: remote.id || p.id,
            slug: p.slug,
            localTitle: p.title,
            remoteTitle: remote.title,
            action: hasDiff ? 'conflict' : 'identical',
            status: hasDiff ? 'protected_conflict' : 'identical_skip',
            isProtected: hasDiff,
            resolution: hasDiff
              ? 'Existing portfolio project found in database; will remain preserved.'
              : 'Portfolio project is identical to production Supabase record. Safe skip.',
            differences: hasDiff ? diffs : ['Record is identical to production database.'],
            localData: p,
            remoteData: remote,
          });
        }
      }

      // ----------------------------------------------------------------------
      // 7. BLOG POSTS
      // ----------------------------------------------------------------------
      const localBlogs = safeGetStorage<BlogPostItem[]>(STORAGE_KEYS.BLOGS, []);
      summary.blogs = localBlogs.length;
      for (const b of localBlogs) {
        const key = `blog_posts:${b.slug}`;
        const remote = remoteBlogsBySlug.get(b.slug) || (b.id ? remoteBlogsById.get(b.id) : null);
        if (!remote) {
          records.push({
            table: 'blog_posts',
            key,
            id: b.id,
            slug: b.slug,
            localTitle: b.title,
            remoteTitle: undefined,
            action: 'insert',
            status: 'safe_insert',
            isProtected: false,
            resolution: 'New blog post. Safe to insert into Supabase.',
            differences: ['Blog post does not exist in production database.'],
            localData: b,
          });
        } else {
          const diffs: string[] = [];
          if (b.title?.trim() !== remote.title?.trim()) {
            diffs.push(`Title differs: local "${b.title}" vs remote "${remote.title}"`);
          }
          const hasDiff = diffs.length > 0;
          records.push({
            table: 'blog_posts',
            key,
            id: remote.id || b.id,
            slug: b.slug,
            localTitle: b.title,
            remoteTitle: remote.title,
            action: hasDiff ? 'conflict' : 'identical',
            status: hasDiff ? 'protected_conflict' : 'identical_skip',
            isProtected: hasDiff,
            resolution: hasDiff
              ? 'Existing blog post found in database; will remain preserved.'
              : 'Blog post is identical to production Supabase record. Safe skip.',
            differences: hasDiff ? diffs : ['Record is identical to production database.'],
            localData: b,
            remoteData: remote,
          });
        }
      }

      // Compute aggregate metrics
      summary.totalLocal = records.length;
      summary.inserts = records.filter((r) => r.action === 'insert').length;
      summary.updates = records.filter((r) => r.action === 'update' || r.action === 'conflict').length;
      summary.identical = records.filter((r) => r.action === 'identical').length;
      summary.conflicts = records.filter((r) => r.isProtected).length;
      summary.approved = records.filter(
        (r) => approvedRecordKeys.includes(r.key) || approvedRecordKeys.includes(r.slug) || (r.id && approvedRecordKeys.includes(r.id))
      ).length;

      // Populate legacy conflicts summary for backwards compatibility
      for (const r of records) {
        if (r.isProtected) {
          conflicts.push({
            type: r.table,
            key: r.slug,
            localTitle: r.localTitle,
            remoteTitle: r.remoteTitle,
            resolution: r.resolution,
          });
        }
      }

      // ----------------------------------------------------------------------
      // 8. WRITE EXECUTION (STRICT PER-RECORD APPROVAL ENFORCEMENT)
      // ----------------------------------------------------------------------
      if (!dryRun) {
        // A. Website Settings, Hero & Pages
        const settingsRecord = records.find((r) => r.table === 'website_settings');
        const heroRecord = records.find((r) => r.table === 'hero');
        const pagesRecord = records.find((r) => r.table === 'pages');

        const isSettingsApproved = !settingsRecord?.isProtected || approvedRecordKeys.includes('website_settings:singleton');
        const isHeroApproved = !heroRecord?.isProtected || approvedRecordKeys.includes('hero:config');
        const isPagesApproved = !pagesRecord?.isProtected || approvedRecordKeys.includes('pages:content');

        if (isSettingsApproved || isHeroApproved || isPagesApproved) {
          const payload: Record<string, any> = {
            id: 'a0000000-0000-0000-0000-000000000001',
            updated_at: new Date().toISOString(),
          };
          if (localSettings && isSettingsApproved) {
            payload.site_name = localSettings.studioName || 'Yugark Digital Studio';
            payload.tagline = localSettings.tagline || 'We Build. We Create. We Grow Brands.';
            payload.business_email = localSettings.contactEmail || 'business@yugark.in';
            payload.whatsapp_number = localSettings.whatsappNumber || '+91 9125205132';
            payload.social_links = localSettings.socials || {};
          }
          if (localHero && isHeroApproved && !localHero.heroImage?.startsWith('blob:')) {
            payload.hero_config = localHero;
          }
          if (localPages && isPagesApproved) {
            payload.page_content = localPages;
          }

          const { error } = await supabase.from('website_settings').upsert(payload, { onConflict: 'id' });
          if (error) errors.push(`website_settings sync failed: ${error.message}`);
        }

        // B. Website Demos (protected records strictly skipped unless explicitly approved)
        for (const demo of localDemos) {
          if (demo.image?.startsWith('blob:')) continue;
          const rec = records.find((r) => r.table === 'website_demos' && r.slug === demo.slug);
          const isApproved = !rec?.isProtected || approvedRecordKeys.includes(rec?.key || '') || approvedRecordKeys.includes(demo.slug);

          if (!isApproved) continue; // PRESERVE PRODUCTION

          const isPorwal = demo.slug?.includes('porwal') || demo.title?.includes('Porwal') || demo.title?.includes('Gautam');
          const categoryId = isPorwal
            ? 'b0000000-0000-0000-0000-000000000005'
            : (STANDARD_DEMO_CATEGORIES.find((c) => c.name === demo.category)?.id || null);

          const { error } = await supabase.from('website_demos').upsert(
            {
              id: demo.id?.length === 36 ? demo.id : undefined,
              title: demo.title,
              slug: demo.slug,
              category_id: categoryId,
              short_description: demo.description || '',
              full_description: demo.description || '',
              thumbnail_url:
                isPorwal && (!demo.image || demo.image.includes('Business pro'))
                  ? '/assets/images/dr-gautam-porwal.svg'
                  : demo.image,
              demo_url: isPorwal ? 'https://dr-gautam-porwal.vercel.app/' : (demo.liveDemoUrl || 'https://yugark.in'),
              technology_tags: demo.techStack || ['React', 'TypeScript', 'Tailwind CSS'],
              is_featured: demo.featured ?? true,
              sort_order: demo.displayOrder || 1,
              status: (demo.status as any) || 'published',
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'slug' }
          );
          if (error) errors.push(`demo sync (${demo.slug}) failed: ${error.message}`);
        }

        // C. Services (protected records strictly skipped unless explicitly approved)
        for (let i = 0; i < localServices.length; i++) {
          const s = localServices[i];
          const rec = records.find((r) => r.table === 'services' && r.slug === s.slug);
          const isApproved = !rec?.isProtected || approvedRecordKeys.includes(rec?.key || '') || approvedRecordKeys.includes(s.slug);

          if (!isApproved) continue; // PRESERVE PRODUCTION

          const { error } = await supabase.from('services').upsert(
            {
              id: s.id?.length === 36 ? s.id : undefined,
              title: s.title,
              slug: s.slug,
              short_description: s.description || s.tagline || '',
              full_description: s.longDescription || s.description || '',
              icon: s.iconType || 'code',
              image_url: s.imageUrl || null,
              price_display: s.priceDisplay || null,
              regular_price: s.regularPrice || null,
              launch_price: s.launchPrice || null,
              billing_type: s.billingType || 'one-time',
              delivery_time: s.deliveryTime || null,
              badge: s.badge || null,
              category: s.category || null,
              features: s.features || [],
              benefits: s.deliverables || [],
              process: s.process || [],
              faqs: s.faqs || [],
              sort_order: i + 1,
              is_featured: true,
              status: 'published',
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'slug' }
          );
          if (error) errors.push(`service sync (${s.slug}) failed: ${error.message}`);
        }

        // D. Pricing Packages (protected records strictly skipped unless explicitly approved)
        for (let i = 0; i < localPricing.length; i++) {
          const p = localPricing[i];
          const rec = records.find((r) => r.table === 'pricing_packages' && r.slug === p.slug);
          const isApproved = !rec?.isProtected || approvedRecordKeys.includes(rec?.key || '') || approvedRecordKeys.includes(p.slug);

          if (!isApproved) continue; // PRESERVE PRODUCTION

          const { error } = await supabase.from('pricing_packages').upsert(
            {
              id: p.id?.length === 36 ? p.id : undefined,
              title: p.name,
              slug: p.slug,
              description: p.bestFor || p.tagline || '',
              price: p.investment,
              regular_price: p.regularPrice || null,
              launch_price: p.launchPrice || null,
              badge: p.badge || null,
              currency: 'INR',
              billing_type: p.billingType || p.type || 'one-time',
              turnaround: p.turnaround || p.deliveryTime || '~7 Days',
              features: p.features || [],
              deliverables: p.deliverables || [],
              cta_label: p.ctaText || `Choose ${p.name}`,
              cta_url: `/contact?package=${encodeURIComponent(p.name)}`,
              is_featured: Boolean(p.popular),
              sort_order: i + 1,
              status: 'published',
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'slug' }
          );
          if (error) errors.push(`pricing sync (${p.slug}) failed: ${error.message}`);
        }

        // E. Portfolio Projects (protected records strictly skipped unless explicitly approved)
        for (let i = 0; i < localProjects.length; i++) {
          const p = localProjects[i];
          if (p.image?.startsWith('blob:')) continue;
          const rec = records.find((r) => r.table === 'portfolio_projects' && r.slug === p.slug);
          const isApproved = !rec?.isProtected || approvedRecordKeys.includes(rec?.key || '') || approvedRecordKeys.includes(p.slug);

          if (!isApproved) continue; // PRESERVE PRODUCTION

          const { error } = await supabase.from('portfolio_projects').upsert(
            {
              id: p.id?.length === 36 ? p.id : undefined,
              title: p.title,
              slug: p.slug,
              category: p.category,
              description: p.description,
              thumbnail_url: p.image,
              project_url: p.externalUrl || null,
              project_type: p.isConcept ? 'Studio Concept' : 'Client Work',
              is_verified_client_work: !p.isConcept,
              is_featured: Boolean(p.featured),
              year: p.year || '2025–2026',
              deliverables: p.deliverables || [],
              sort_order: i + 1,
              status: 'published',
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'slug' }
          );
          if (error) errors.push(`project sync (${p.slug}) failed: ${error.message}`);
        }

        // F. Blog Posts (protected records strictly skipped unless explicitly approved)
        for (let i = 0; i < localBlogs.length; i++) {
          const b = localBlogs[i];
          const rec = records.find((r) => r.table === 'blog_posts' && r.slug === b.slug);
          const isApproved = !rec?.isProtected || approvedRecordKeys.includes(rec?.key || '') || approvedRecordKeys.includes(b.slug);

          if (!isApproved) continue; // PRESERVE PRODUCTION

          const { error } = await supabase.from('blog_posts').upsert(
            {
              id: b.id?.length === 36 ? b.id : undefined,
              title: b.title,
              slug: b.slug,
              excerpt: b.excerpt || '',
              content: b.content || '',
              status: b.status || 'published',
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'slug' }
          );
          if (error) errors.push(`blog sync (${b.slug}) failed: ${error.message}`);
        }
      }
    } catch (err: any) {
      errors.push(`General sync exception: ${err?.message || String(err)}`);
    }

    return {
      success: errors.length === 0,
      isDryRun: dryRun,
      summary,
      records,
      conflicts,
      errors,
    };
  },
};
