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
  blogPostsData as initialBlogPosts,
  siteConfig as initialSiteConfig,
} from '../../data/studioData';
import {
  ServiceItem,
  DemoItem,
  ProjectItem,
  PricingPackage,
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
  BLOGS: 'yugark_cms_blogs',
  LEADS: 'yugark_cms_leads',
  MEDIA: 'yugark_cms_media',
  VIEWS: 'yugark_cms_views',
  PAGE_CONTENT: 'yugark_cms_pages',
};

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

// Initialize seed data into localStorage if empty
function initializeLocalStorageSeed() {
  if (typeof window === 'undefined') return;
  if (!localStorage.getItem(STORAGE_KEYS.DEMOS)) {
    safeSetStorage(STORAGE_KEYS.DEMOS, initialDemos);
  }
  if (!localStorage.getItem(STORAGE_KEYS.SERVICES)) {
    safeSetStorage(STORAGE_KEYS.SERVICES, initialServices);
  }
  if (!localStorage.getItem(STORAGE_KEYS.BLOGS)) {
    safeSetStorage(STORAGE_KEYS.BLOGS, initialBlogPosts);
  }
  if (!localStorage.getItem(STORAGE_KEYS.PROJECTS)) {
    safeSetStorage(STORAGE_KEYS.PROJECTS, initialProjects);
  }
  if (!localStorage.getItem(STORAGE_KEYS.PRICING)) {
    safeSetStorage(STORAGE_KEYS.PRICING, initialPricing);
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

    const settings = data as WebsiteSettingsRecord;
    return {
      studioName: settings.site_name || initialSiteConfig.studioName,
      tagline: settings.tagline || initialSiteConfig.tagline,
      headlineLine1: initialSiteConfig.headlineLine1,
      headlineLine2: initialSiteConfig.headlineLine2,
      headlineLine3Accent: initialSiteConfig.headlineLine3Accent,
      heroDescription: initialSiteConfig.heroDescription,
      heroImage: initialSiteConfig.heroImage,
      contactEmail: settings.business_email || 'business@yugark.in',
      whatsappNumber: settings.whatsapp_number || '+919125272460',
      whatsappUrl: `https://wa.me/${(settings.whatsapp_number || '919125272460').replace(/[^0-9]/g, '')}`,
      location: 'Global Digital Practice',
      socials: {
        instagram: settings.social_links?.instagram || initialSiteConfig.socials.instagram,
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
  return allServices.find((s) => s.slug === slug) || null;
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

    return (data as any[]).map((rec, index) => ({
      id: rec.id,
      slug: rec.slug,
      title: rec.title,
      category: rec.demo_categories?.name || rec.category_name || 'Turnkey Solution',
      industry: rec.demo_categories?.name || rec.category_name || 'Turnkey Solution',
      image: rec.thumbnail_url || '/assets/images/Business pro.jpg',
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
    }));
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
      tagline: rec.description,
      investment: rec.price || 'Custom Studio Quote',
      turnaround: rec.turnaround || '2 – 4 Weeks',
      popular: rec.is_featured,
      bestFor: rec.description,
      features: rec.features || [],
      deliverables: rec.deliverables || [],
      inquiryMessage: `Hello Yugark Studio, I would like to inquire about the ${rec.title} package.`,
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
  email: string;
  phone?: string;
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
    }
  } catch {
    // Server route unavailable, fallback
  }

  // 2. Direct Supabase insert if client configured
  if (isSupabaseConfigured) {
    if (payload.website_honeypot) {
      return { success: true, refId: 'YUG-SPAM-PREVENTED', message: 'Inquiry received.' };
    }

    const { data, error } = await supabase
      .from('leads')
      .insert({
        name: payload.name.trim(),
        email: payload.email.trim(),
        phone: payload.phone?.trim() || null,
        requirement: payload.requirement.trim(),
        service: payload.service || 'General Inquiry',
        timeline: payload.timeline || 'Standard (2–4 weeks)',
        page_source: payload.page_source || 'website_contact',
        status: 'new',
        priority: 'normal',
      })
      .select('id')
      .single();

    if (!error && data) {
      const refId = `YUG-${data.id.substring(0, 6).toUpperCase()}`;
      recordLeadLocally({ ...payload, id: refId });
      return { success: true, refId, message: 'Your project brief has been recorded in our studio system.' };
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
  const newLead: LeadRecord = {
    id: leadData.id || `lead-${Date.now()}`,
    name: leadData.name,
    email: leadData.email,
    phone: leadData.phone || null,
    business_name: leadData.business_name || null,
    requirement: leadData.requirement,
    service: leadData.service || 'General Inquiry',
    timeline: leadData.timeline || 'Standard (2–4 weeks)',
    page_source: leadData.page_source || 'website_contact',
    status: 'new',
    priority: 'normal',
    remarks: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  safeSetStorage(STORAGE_KEYS.LEADS, [newLead, ...existingLeads]);
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
      const { data, error } = await supabase
        .from('website_demos')
        .select('*, demo_categories(name)')
        .order('sort_order', { ascending: true });
      if (!error && data && data.length > 0) return data as WebsiteDemoRecord[];
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
    const id = demo.id || `demo-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newDemoRecord: WebsiteDemoRecord = {
      id,
      title: demo.title || 'Untitled Demo',
      slug: demo.slug || `demo-${Date.now()}`,
      category_name: demo.category_name || 'Turnkey Solution',
      category_id: demo.category_id || null,
      short_description: demo.short_description || '',
      full_description: demo.full_description || demo.short_description || '',
      thumbnail_url: demo.thumbnail_url || '/assets/images/Business pro.jpg',
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
      try {
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
          .select()
          .single();
        if (error) throw error;
        if (data) return data as WebsiteDemoRecord;
      } catch (err) {
        console.warn('Supabase createDemo failed, saving to local persistent store:', err);
      }
    }

    // Persist in local store
    const existing = safeGetStorage<DemoItem[]>(STORAGE_KEYS.DEMOS, initialDemos);
    const newDemoItem: DemoItem = {
      id: newDemoRecord.id,
      slug: newDemoRecord.slug,
      title: newDemoRecord.title,
      category: newDemoRecord.category_name || 'Turnkey Solution',
      industry: newDemoRecord.category_name || 'Turnkey Solution',
      image: newDemoRecord.thumbnail_url,
      alt: `${newDemoRecord.title} - Website Demo`,
      liveDemoUrl: newDemoRecord.demo_url,
      description: newDemoRecord.short_description,
      features: newDemoRecord.additional_images || ['Responsive Design', 'WhatsApp Lead Routing'],
      techStack: newDemoRecord.technology_tags,
      featured: newDemoRecord.is_featured,
      displayOrder: newDemoRecord.sort_order,
      status: newDemoRecord.status as any,
    };
    safeSetStorage(STORAGE_KEYS.DEMOS, [newDemoItem, ...existing]);
    return newDemoRecord;
  },

  async updateDemo(id: string, updates: Partial<WebsiteDemoRecord>): Promise<WebsiteDemoRecord> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('website_demos')
          .update({ ...updates, updated_at: new Date().toISOString() })
          .eq('id', id)
          .select()
          .single();
        if (error) throw error;
        if (data) return data as WebsiteDemoRecord;
      } catch (err) {
        console.warn('Supabase updateDemo failed, syncing local persistent store:', err);
      }
    }

    // Update in local store
    const existing = safeGetStorage<DemoItem[]>(STORAGE_KEYS.DEMOS, initialDemos);
    const updated = existing.map((d) => {
      if (d.id === id) {
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
    return { id, ...updates } as WebsiteDemoRecord;
  },

  async deleteDemo(id: string): Promise<boolean> {
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.from('website_demos').delete().eq('id', id);
        if (error) throw error;
      } catch (err) {
        console.warn('Supabase deleteDemo failed, removing locally:', err);
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
        await supabase
          .from('website_demos')
          .update({ sort_order: i + 1 })
          .eq('id', orderedIds[i]);
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
      try {
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
        if (error) throw error;
        if (data) return data as BlogPostRecord;
      } catch (err) {
        console.warn('Supabase createBlogPost error, storing locally:', err);
      }
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
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .update({ ...updates, updated_at: new Date().toISOString() })
          .eq('id', id)
          .select()
          .single();
        if (error) throw error;
        if (data) return data as BlogPostRecord;
      } catch (err) {
        console.warn('Supabase updateBlogPost error, storing locally:', err);
      }
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
      try {
        const { error } = await supabase.from('blog_posts').delete().eq('id', id);
        if (error) throw error;
      } catch (err) {
        console.warn('Supabase deleteBlogPost error:', err);
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
      try {
        const { data, error } = await supabase.from('services').insert(newRecord).select().single();
        if (!error && data) return data as ServiceRecord;
      } catch (err) {
        console.warn('Supabase createService error:', err);
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
      try {
        const { data, error } = await supabase
          .from('services')
          .update({ ...updates, updated_at: new Date().toISOString() })
          .eq('id', id)
          .select()
          .single();
        if (!error && data) return data as ServiceRecord;
      } catch (err) {
        console.warn('Supabase updateService error:', err);
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
      try {
        await supabase.from('services').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase deleteService error:', err);
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
      currency: 'USD',
      billing_type: 'Milestone-Based',
      turnaround: p.turnaround,
      features: p.features,
      deliverables: p.deliverables,
      cta_label: 'Request Scope',
      cta_url: '/contact',
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
      price: pkg.price || '$2,400',
      currency: pkg.currency || 'USD',
      billing_type: pkg.billing_type || 'Milestone-Based',
      turnaround: pkg.turnaround || '2–3 Weeks',
      features: pkg.features || [],
      deliverables: pkg.deliverables || [],
      cta_label: pkg.cta_label || 'Request Scope',
      cta_url: pkg.cta_url || '/contact',
      is_featured: pkg.is_featured ?? false,
      sort_order: pkg.sort_order ?? 10,
      status: pkg.status || 'published',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.from('pricing_packages').insert(newRecord).select().single();
        if (!error && data) return data as PricingPackageRecord;
      } catch (err) {
        console.warn('Supabase createPricing error:', err);
      }
    }

    const existing = safeGetStorage<PricingPackage[]>(STORAGE_KEYS.PRICING, initialPricing);
    const newPkgItem: PricingPackage = {
      id: newRecord.id,
      name: newRecord.title,
      slug: newRecord.slug,
      tagline: newRecord.description,
      investment: newRecord.price,
      turnaround: newRecord.turnaround,
      popular: newRecord.is_featured,
      bestFor: newRecord.description,
      features: newRecord.features,
      deliverables: newRecord.deliverables,
      inquiryMessage: `Inquiry for ${newRecord.title}`,
    };
    safeSetStorage(STORAGE_KEYS.PRICING, [...existing, newPkgItem]);
    return newRecord;
  },

  async updatePricing(id: string, updates: Partial<PricingPackageRecord>): Promise<PricingPackageRecord> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('pricing_packages')
          .update({ ...updates, updated_at: new Date().toISOString() })
          .eq('id', id)
          .select()
          .single();
        if (!error && data) return data as PricingPackageRecord;
      } catch (err) {
        console.warn('Supabase updatePricing error:', err);
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
          turnaround: updates.turnaround ?? p.turnaround,
          popular: updates.is_featured ?? p.popular,
          bestFor: updates.description ?? p.bestFor,
          features: updates.features ?? p.features,
          deliverables: updates.deliverables ?? p.deliverables,
        };
      }
      return p;
    });
    safeSetStorage(STORAGE_KEYS.PRICING, updated);
    return { id, ...updates } as PricingPackageRecord;
  },

  async deletePricing(id: string): Promise<boolean> {
    if (isSupabaseConfigured) {
      try {
        await supabase.from('pricing_packages').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase deletePricing error:', err);
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
      try {
        const { data, error } = await supabase.from('portfolio_projects').insert(newRecord).select().single();
        if (!error && data) return data as PortfolioProjectRecord;
      } catch (err) {
        console.warn('Supabase createProject error:', err);
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
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('portfolio_projects')
          .update({ ...updates, updated_at: new Date().toISOString() })
          .eq('id', id)
          .select()
          .single();
        if (!error && data) return data as PortfolioProjectRecord;
      } catch (err) {
        console.warn('Supabase updateProject error:', err);
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
      try {
        await supabase.from('portfolio_projects').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase deleteProject error:', err);
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
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) return data as LeadRecord[];
    }
    return safeGetStorage<LeadRecord[]>(STORAGE_KEYS.LEADS, [
      {
        id: 'YUG-918234',
        name: 'Aarav Mehta',
        email: 'aarav@solestudio.com',
        phone: '+91 98765 43210',
        business_name: 'Sole Beauty & Wellness',
        requirement: 'We need a high-conversion modern eCommerce and portfolio website with direct WhatsApp customer routing and interactive treatment booking.',
        service: 'Website Development',
        timeline: 'Standard (2–4 weeks)',
        page_source: 'website_contact',
        status: 'new',
        priority: 'high',
        remarks: 'High intent prospect inquiring for luxury skincare studio launch in Mumbai.',
        created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
        updated_at: new Date(Date.now() - 3600000 * 4).toISOString(),
      },
      {
        id: 'YUG-771249',
        name: 'Elena Rostova',
        email: 'elena@auroraliving.design',
        phone: '+44 7700 900077',
        business_name: 'Aurora Living Interior Practice',
        requirement: 'Looking for complete brand architecture, editorial typography layout, and turnkey portfolio demo setup.',
        service: 'Branding & Identity',
        timeline: 'Urgent (1–2 weeks)',
        page_source: 'demos_showcase',
        status: 'contacted',
        priority: 'urgent',
        remarks: 'Discussed initial scope on WhatsApp. Sending proposal by Friday.',
        created_at: new Date(Date.now() - 3600000 * 26).toISOString(),
        updated_at: new Date(Date.now() - 3600000 * 12).toISOString(),
      },
    ]);
  },

  async updateLeadStatus(id: string, status: LeadRecord['status'], remarks?: string): Promise<LeadRecord> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('leads')
          .update({ status, remarks, updated_at: new Date().toISOString() })
          .eq('id', id)
          .select()
          .single();
        if (!error && data) return data as LeadRecord;
      } catch (err) {
        console.warn('Supabase updateLeadStatus error:', err);
      }
    }

    const existing = safeGetStorage<LeadRecord[]>(STORAGE_KEYS.LEADS, []);
    const updated = existing.map((l) => (l.id === id ? { ...l, status, remarks: remarks ?? l.remarks, updated_at: new Date().toISOString() } : l));
    safeSetStorage(STORAGE_KEYS.LEADS, updated);
    const found = updated.find((l) => l.id === id);
    return found || ({ id, status, remarks } as any);
  },

  async updateLeadPriority(id: string, priority: LeadRecord['priority']): Promise<void> {
    if (isSupabaseConfigured) {
      try {
        await supabase
          .from('leads')
          .update({ priority, updated_at: new Date().toISOString() })
          .eq('id', id);
      } catch (err) {
        console.warn('Supabase updateLeadPriority error:', err);
      }
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
      { id: 'img-1', name: 'Hero.jpg', url: '/assets/images/Hero.jpg', size: '1.2 MB', type: 'image/jpeg', date: '2026-10-01' },
      { id: 'img-2', name: 'Business pro.jpg', url: '/assets/images/Business pro.jpg', size: '840 KB', type: 'image/jpeg', date: '2026-10-02' },
      { id: 'img-3', name: 'Aurora living.jpg', url: '/assets/images/Aurora living.jpg', size: '920 KB', type: 'image/jpeg', date: '2026-10-03' },
      { id: 'img-4', name: 'Fit Life.jpg', url: '/assets/images/Fit Life.jpg', size: '780 KB', type: 'image/jpeg', date: '2026-10-04' },
      { id: 'img-5', name: 'Sole beauty.jpg', url: '/assets/images/Sole beauty.jpg', size: '1.1 MB', type: 'image/jpeg', date: '2026-10-05' },
      { id: 'img-6', name: 'content-and-social-media.jpg', url: '/assets/images/content-and-social-media.jpg', size: '650 KB', type: 'image/jpeg', date: '2026-10-06' },
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
    safeSetStorage(STORAGE_KEYS.PAGE_CONTENT, content);
  },

  // --------------------------------------------------------------------------
  // SETTINGS & SEO
  // --------------------------------------------------------------------------
  async updateSettings(settings: Partial<WebsiteSettingsRecord>): Promise<any> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('website_settings')
          .update({ ...settings, updated_at: new Date().toISOString() })
          .eq('id', 'a0000000-0000-0000-0000-000000000001')
          .select()
          .single();
        if (!error && data) return data;
      } catch (err) {
        console.warn('Supabase updateSettings error:', err);
      }
    }

    const current = safeGetStorage<SiteConfig>(STORAGE_KEYS.SETTINGS, initialSiteConfig);
    const updated: SiteConfig = {
      ...current,
      studioName: settings.site_name || current.studioName,
      tagline: settings.tagline || current.tagline,
      contactEmail: settings.business_email || current.contactEmail,
      whatsappNumber: settings.whatsapp_number || current.whatsappNumber,
      whatsappUrl: `https://wa.me/${(settings.whatsapp_number || '919125272460').replace(/[^0-9]/g, '')}`,
      socials: {
        instagram: settings.social_links?.instagram || current.socials.instagram,
        linkedin: settings.social_links?.linkedin || current.socials.linkedin,
        youtube: settings.social_links?.youtube || current.socials.youtube,
      },
    };
    safeSetStorage(STORAGE_KEYS.SETTINGS, updated);
    return updated;
  },
};
