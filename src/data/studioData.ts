import {
  SiteConfig,
  NavLink,
  ValueHighlight,
  ProjectItem,
  ServiceItem,
  DemoItem,
  BlogPostItem
} from '../types/content';

export const siteConfig: SiteConfig = {
  studioName: 'YUGARK',
  tagline: 'Digital Studio',
  headlineLine1: 'We Build.',
  headlineLine2: 'We Create.',
  headlineLine3Accent: 'We Grow Brands.',
  heroDescription:
    'Websites, creative content and digital marketing solutions designed to help your brand look better, connect deeper and grow further.',
  heroImage: '/assets/images/Hero.jpg',
  contactEmail: 'business@yugark.in',
  contactPhone: '',
  location: 'Global Digital Studio',
  socials: {
    instagram: 'https://instagram.com',
    linkedin: 'https://linkedin.com',
    youtube: 'https://youtube.com',
  },
};

export const navigationLinks: NavLink[] = [
  { label: 'Home', href: '#home' },
  { label: 'Services', href: '#services' },
  { label: 'Work', href: '#work' },
  { label: 'Demos', href: '#demos' },
  { label: 'Blog', href: '#blog' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
];

export const valueHighlights: ValueHighlight[] = [
  {
    id: 'websites',
    title: 'WEBSITES',
    subtitle: 'That Convert',
    iconName: 'monitor',
  },
  {
    id: 'content',
    title: 'CONTENT',
    subtitle: 'That Connects',
    iconName: 'layers',
  },
  {
    id: 'ads',
    title: 'ADS',
    subtitle: 'That Scale',
    iconName: 'zap',
  },
  {
    id: 'growth',
    title: 'GROWTH',
    subtitle: 'That Lasts',
    iconName: 'bar-chart',
  },
];

export const brandStatement = {
  kicker: 'CREATIVE. STRATEGIC. RESULT-DRIVEN.',
  headline: "A Digital Studio for What's Next.",
  description:
    'We combine design, technology and strategy to create digital experiences that help brands stand out and grow in a competitive world.',
  ctaText: 'Our Approach',
  ctaHref: '#about',
};

export const selectedWorkProjects: ProjectItem[] = [
  {
    id: 'aurora-living',
    title: 'Aurora Living',
    category: 'Website Development',
    tagline: 'Architecture & Interior (Demo)',
    description:
      'Elevated spaces and timeless interior architecture crafted with serene spatial proportions, refined serif typography, and responsive luxury presentation.',
    image: '/assets/images/Aurora living.jpg',
    alt: 'Aurora Living Architecture & Interior Demo',
    client: 'Aurora Living Studio',
    deliverables: ['Custom Next.js/React App', 'Editorial CMS', 'Mobile Architecture Showcase'],
    featured: true,
  },
  {
    id: 'sole-beauty',
    title: 'Solé Beauty',
    category: 'Branding & Creative',
    tagline: 'Beauty & Wellness (Demo)',
    description:
      'Holistic skincare and wellness portal created with tactile warm stone hues, gentle biological curves, and seamless appointment bookings.',
    image: '/assets/images/Sole beauty.jpg',
    alt: 'Solé Beauty and Wellness Website Demo',
    client: 'Solé Botanical Radiance',
    deliverables: ['Brand Identity Design', 'Shopify & Custom Web', 'Content Strategy'],
    featured: true,
  },
  {
    id: 'pixelplay',
    title: 'PixelPlay',
    category: 'Website + Content',
    tagline: 'Creative Portfolio (Demo)',
    description:
      'High-energy creative studio showreel and digital production portfolio engineered for immersive visual impact, cinematic previews, and bold aesthetics.',
    image: '/assets/images/pixelplay.jpg',
    alt: 'PixelPlay Creative Portfolio Website Demo',
    client: 'PixelPlay Media Lab',
    deliverables: ['Immersive Showreel Site', '3D Asset Integration', 'Performance Tuning'],
    featured: true,
  },
];

export const servicesData: ServiceItem[] = [
  {
    id: 'website-development',
    title: 'Website Development',
    lines: ['Website', 'Development'],
    description: 'Custom, high-performing websites that look premium and deliver results.',
    iconType: 'code',
    features: ['Custom Frontend Architecture', 'High Performance Core Web Vitals', 'Headless CMS Integration', 'Mobile-First Responsiveness'],
    deliverables: ['Responsive Web App', 'Design System', 'SEO Foundation'],
  },
  {
    id: 'social-media',
    title: 'Social Media',
    lines: ['Social Media'],
    description: "Engaging content and strategies to grow your brand's presence.",
    iconType: 'chat',
    features: ['Strategic Content Calendars', 'Platform-Native Copywriting', 'Visual Micro-Assets', 'Audience Growth Playbooks'],
    deliverables: ['Monthly Asset Packs', 'Content Guidelines', 'Engagement Reports'],
  },
  {
    id: 'ads',
    title: 'Ads',
    lines: ['Ads'],
    description: 'Data-driven ad campaigns across platforms to reach the right audience.',
    iconType: 'target',
    features: ['Meta & Google Ads Management', 'High-ROAS Creative Testing', 'Conversion Funnel Optimization', 'Pixel & Attribution Setup'],
    deliverables: ['Campaign Strategy', 'Ad Creatives', 'Weekly Performance Reviews'],
  },
  {
    id: 'ai-creative',
    title: 'AI Creative',
    lines: ['AI Creative'],
    description: 'Modern, AI-powered creative content for faster, smarter growth.',
    iconType: 'sparkles',
    features: ['Visual Prototyping & Generative Assets', 'Dynamic Copy Variations', 'Automated Content Pipelines', 'Intelligent Brand Workflows'],
    deliverables: ['Custom AI Pipelines', 'Brand-Trained Prompts', 'Accelerated Asset Deliveries'],
  },
  {
    id: 'branding',
    title: 'Branding',
    lines: ['Branding'],
    description: 'Distinctive brand identities that make a lasting impression.',
    iconType: 'palette',
    features: ['Comprehensive Visual Identity', 'Typography Pairing & Palette Architecture', 'Editorial Guidelines', 'Stationery & Digital Collateral'],
    deliverables: ['Brand Book PDF', 'Master Vector Assets', 'Component Tokens'],
  },
];

export const websiteDemosData: DemoItem[] = [
  {
    id: 'business-pro',
    title: 'Business Pro',
    industry: 'Corporate & Business',
    image: '/assets/images/Business pro.jpg',
    alt: 'Business Pro - Aurora Builders Architecture',
    description:
      'Designed for corporate architecture firms, enterprise consultancies, and commercial development studios with authoritative proof points.',
    features: ['Interactive Project Gallery', 'Team Leadership Profiles', 'Instant Quote Builder', 'Multi-Office Locators'],
    techStack: ['React', 'Tailwind CSS', 'Vite', 'Lucide'],
  },
  {
    id: 'glow-studio',
    title: 'Glow Studio',
    industry: 'Beauty & Lifestyle',
    image: '/assets/images/glow Studio.jpg',
    alt: 'Glow Studio - Beauty & Lifestyle',
    description:
      'Soft champagne tones and organic layout for boutique wellness salons, dermatological studios, and aesthetic lifestyle practitioners.',
    features: ['Service Menu & Rituals', 'Treatment Booking Flow', 'Client Transformations', 'Product Showcase'],
    techStack: ['React', 'Framer Motion', 'Tailwind CSS'],
  },
  {
    id: 'dinecraft',
    title: 'DineCraft',
    industry: 'Restaurant & Cafe',
    image: '/assets/images/dinecraft.jpg',
    alt: 'DineCraft - Restaurant & Cafe',
    description:
      'Atmospheric dark dining experience showcasing artisanal culinary creations, seasonal degustation menus, and seamless table booking.',
    features: ['Curated Menu Grid', 'Table Reservation System', 'Atmosphere & Storytelling', 'Chef Special Highlights'],
    techStack: ['React', 'Responsive Grid', 'Tailwind CSS'],
  },
  {
    id: 'fitlife',
    title: 'FitLife',
    industry: 'Fitness & Wellness',
    image: '/assets/images/Fit Life.jpg',
    alt: 'FitLife - Fitness & Wellness',
    description:
      'High-impact performance training portal designed for personal coaches, boutique gyms, and high-energy athletic wellness clubs.',
    features: ['Program Schedule Matrix', 'Trainer Spotlights', 'Membership Tiers', 'Video Training Teasers'],
    techStack: ['React', 'Dark Theme Architecture', 'Tailwind CSS'],
  },
];

export const blogPostsData: BlogPostItem[] = [
  {
    id: 'effective-website-2026',
    title: 'What Makes a Website Truly Effective in 2026?',
    category: 'Website Development',
    excerpt: 'Key elements that turn a good website into a powerful growth tool for modern business.',
    content:
      'In 2026, a successful website is no longer just an aesthetic brochure; it is an active conversion engine. Modern consumers expect sub-second load times, tactile micro-interactions, uncompromising mobile typography, and authentic brand storytelling that bridges proof directly to user value.',
    readTime: '4 min read',
    publishedDate: 'January 2026',
    image: '/assets/images/website devlopment.jpg',
    alt: 'Website Strategy notebook on marble desk',
  },
  {
    id: 'content-ideas-brand-ahead',
    title: 'Content Ideas to Keep Your Brand Ahead',
    category: 'Content & Social Media',
    excerpt: 'Creative content strategies to stay relevant, authentic and engaging in an ever-shifting landscape.',
    content:
      'The modern feed demands depth over noise. We explore how documenting genuine operational processes, behind-the-scenes decision making, and customer transformation narratives yields exponentially higher retention than repetitive trend-chasing.',
    readTime: '5 min read',
    publishedDate: 'February 2025',
    image: '/assets/images/Content & Social Media.jpg',
    alt: 'Content Creates Connection book on table',
  },
  {
    id: 'guide-better-ad-campaigns',
    title: 'A Simple Guide to Running Better Ad Campaigns',
    category: 'Digital Marketing',
    excerpt: 'Practical tips to get more out of your ad spend and reach the right audience consistently.',
    content:
      'Scaling paid channels requires rigorous testing architectures: decoupling hook testing from pitch mechanics, maintaining strict creative cadence, and structuring conversion-focused landing pages that mirror ad copy verbatim.',
    readTime: '6 min read',
    publishedDate: 'March 2025',
    isGraphicCard: true,
    graphicData: {
      framework: 'Framework 03',
      precision: 'Ad Precision',
      architectureBadge: 'High-ROAS Architecture',
      headline: 'Reach & Convert at Scale.',
      playbookLabel: 'Performance Playbook',
    },
  },
];
