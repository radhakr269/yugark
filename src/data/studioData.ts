import {
  SiteConfig,
  NavLink,
  ValueHighlight,
  ProjectItem,
  ServiceItem,
  DemoItem,
  BlogPostItem,
  PricingPackage,
  PricingCalculatorItem,
} from '../types/content';

export const siteConfig: SiteConfig = {
  studioName: 'YUGARK',
  tagline: 'Digital Studio',
  headlineLine1: 'We Build.',
  headlineLine2: 'We Create.',
  headlineLine3Accent: 'We Grow Brands.',
  heroDescription:
    'Websites, creative content and digital marketing solutions designed to help your brand look better, connect deeper and grow further.',
  heroImage: '/assets/images/hero.jpg',
  contactEmail: 'business@yugark.in',
  whatsappNumber: '+91 9125205132',
  whatsappUrl: 'https://wa.me/919125205132',
  location: 'Global Digital Studio',
  socials: {
    instagram: 'https://www.instagram.com/yugark.in/',
    linkedin: 'https://linkedin.com',
    youtube: 'https://youtube.com',
  },
};

export const navigationLinks: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'Work', href: '/work' },
  { label: 'Demos', href: '/demos' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Blog', href: '/blog' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
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
  ctaHref: '/about',
};

export const selectedWorkProjects: ProjectItem[] = [
  {
    id: 'aurora-living',
    slug: 'aurora-living',
    title: 'Aurora Living',
    category: 'Website Development',
    tagline: 'Architecture & Interior (Demo Showcase)',
    isConcept: true,
    year: '2025–2026',
    description:
      'Elevated spaces and timeless interior architecture crafted with serene spatial proportions, refined serif typography, and responsive luxury presentation.',
    image: '/assets/images/Aurora living.jpg',
    alt: 'Aurora Living Architecture & Interior Demo',
    client: 'Aurora Living Studio',
    deliverables: [
      'Custom React/Vite Responsive Architecture',
      'Editorial Layout System',
      'High-Resolution Device Mockup Showcase',
      'Sub-Second Performance Optimization'
    ],
    challenge:
      'Architectural practices require spatial breathing room. The challenge was displaying high-resolution interior photography without sluggish load times or visual clutter.',
    solution:
      'We engineered a tailored, minimalist portfolio system pairing warm ivory substrates with high-contrast architectural serifs and pre-cached image delivery.',
    keyFeatures: [
      'Bespoke Project Gallery with Zero Layout Shift',
      'Tactile Editorial Typography System',
      'Client Inquiry Pipeline with Direct Routing',
      'Adaptive Mobile Screen Presets'
    ],
    techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Vite'],
    featured: true,
  },
  {
    id: 'sole-beauty',
    slug: 'sole-beauty',
    title: 'Solé Beauty',
    category: 'Branding & Creative',
    tagline: 'Beauty & Wellness (Demo Showcase)',
    isConcept: true,
    year: '2025–2026',
    description:
      'Holistic skincare and wellness portal created with tactile warm stone hues, gentle biological curves, and seamless appointment bookings.',
    image: '/assets/images/Sole beauty.jpg',
    alt: 'Solé Beauty and Wellness Website Demo',
    client: 'Solé Botanical Radiance',
    deliverables: [
      'Brand Identity & Color Token Design',
      'Responsive E-Commerce & Treatment Portal',
      'Treatment Scheduling System',
      'Social Asset Design System'
    ],
    challenge:
      'Modern cosmetic and wellness brands struggle with sterile clinic aesthetics. Solé required an organic, botanical warmth that feels both scientifically credible and deeply restorative.',
    solution:
      'Formulated an editorial palette grounded in champagne gold, soft stone linen, and deep forest accents, paired with friction-free appointment inquiries.',
    keyFeatures: [
      'Treatment Catalog with Duration & Pricing Clarity',
      'Direct WhatsApp Booking Integration',
      'Product Formula Showcase',
      'Mobile-First Touch Optimization'
    ],
    techStack: ['React', 'Tailwind CSS', 'TypeScript'],
    featured: true,
  },
  {
    id: 'pixelplay',
    slug: 'pixelplay',
    title: 'PixelPlay',
    category: 'Website + Content',
    tagline: 'Creative Portfolio (Demo Showcase)',
    isConcept: true,
    year: '2025–2026',
    description:
      'High-energy creative studio showreel and digital production portfolio engineered for immersive visual impact, cinematic previews, and bold aesthetics.',
    image: '/assets/images/pixelplay.jpg',
    alt: 'PixelPlay Creative Portfolio Website Demo',
    client: 'PixelPlay Media Lab',
    deliverables: [
      'Cinematic Dark-Canvas Experience',
      'Video Showreel Container Integration',
      'Creative Service Matrix',
      'Multi-Device Responsive Grid'
    ],
    challenge:
      'Creative production agencies need their visual showreels to make immediate visceral impact without overpowering navigable portfolio case-studies.',
    solution:
      'Crafted a high-contrast dark-canvas layout with razor-sharp typography, immersive preview grids, and lightning-fast navigation transitions.',
    keyFeatures: [
      'Hero Video Showcase Support',
      'Modular Production Case-Studies',
      'Interactive Media Player Controls',
      'Direct WhatsApp Brief Submission'
    ],
    techStack: ['React', 'Tailwind CSS', 'Vite'],
    featured: true,
  },
];

export const servicesData: ServiceItem[] = [
  {
    id: 'website-development',
    slug: 'website-development',
    title: 'Website Development',
    lines: ['Website', 'Development'],
    tagline: 'Premium, mobile-friendly websites that help customers discover your business and send enquiries.',
    description: 'Premium, mobile-friendly websites that help customers discover your business and send enquiries.',
    longDescription:
      'We build high-performance, custom digital platforms engineered for speed, conversion, and brand credibility. From modern business websites to high-converting lead management dashboards, every line of code is written with surgical precision.',
    iconType: 'code',
    priceDisplay: 'Launch Offer: ₹9,999 (Reg. ₹15,999)',
    regularPrice: 15999,
    launchPrice: 9999,
    billingType: 'one-time',
    deliveryTime: '~7–14 Days',
    badge: 'LAUNCH OFFER',
    category: 'web',
    imageUrl: '/assets/images/website devlopment.jpg',
    features: [
      'Business Website: Launch Offer ₹9,999 (Reg. ₹15,999)',
      'Website + Lead Management Dashboard: Launch Offer ₹14,999 (Reg. ₹19,999)',
      'Modern, High-Converting Design (100% Mobile, Tablet & Desktop)',
      'Contact Form, WhatsApp & Direct Lead Capture Integration',
      'Basic Google SEO Setup & Meta Title/Description Tuning',
      'Fast Loading Speed, Clean Semantic Code & Zero Plugin Bloat'
    ],
    deliverables: [
      'Modern, High-Converting Design & Responsive Layouts',
      'Lead Capture Form & Instant WhatsApp Integration',
      'Secure Admin Dashboard & Excel/CSV Lead Export',
      'Automated Email & WhatsApp Lead Notifications',
      'Basic Google Search SEO Setup & Meta Tags',
      'Zero Monthly Platform Subscriptions & Full Code Ownership'
    ],
    process: [
      {
        step: '01',
        title: 'Connect & Requirements',
        description: 'You connect with us via WhatsApp, phone, or website inquiry form and share your business background, timeline, and goals.'
      },
      {
        step: '02',
        title: 'Architecture & Design System',
        description: 'We audit your target buyers and craft responsive layout wireframes, high-contrast typography, and conversion flows.'
      },
      {
        step: '03',
        title: 'Full-Stack Development',
        description: 'Writing clean React/TypeScript code with zero bloat, mobile optimization, lead databases, and sub-second load speeds.'
      },
      {
        step: '04',
        title: 'Launch & Google Indexing',
        description: 'Your website is deployed to production with Google Search indexing, WhatsApp routing, and admin access.'
      }
    ],
    faqs: [
      {
        question: 'What is the difference between Business Website and Website + Dashboard?',
        answer: 'The Business Website (₹9,999 Launch Offer) is a fast, premium website delivering leads to WhatsApp and email in ~7 days. The Website + Dashboard (₹14,999 Launch Offer) adds a custom database backend, secure admin dashboard, and 1-click Excel/CSV export in ~10–14 days.'
      },
      {
        question: 'Are there any recurring monthly platform subscriptions?',
        answer: 'No. Unlike proprietary website builders that charge recurring monthly fees, our custom platforms have zero monthly platform subscriptions. You own 100% of your code and business data.'
      },
      {
        question: 'How fast can our business website go live?',
        answer: 'Typical delivery is ~7 days for the Business Website and ~10–14 days for the Website + Lead Management Dashboard.'
      }
    ]
  },
  {
    id: 'social-media-management',
    slug: 'social-media-management',
    title: 'Social Media Management',
    lines: ['Social Media', 'Management'],
    tagline: 'Creative reels, branded posts and consistent content that keep your business active and engaging.',
    description: 'Creative reels, branded posts and consistent content that keep your business active and engaging.',
    longDescription:
      'Transform social channels into automated organic acquisition systems. We craft high-retention short-form video reels, branded visual carousels, and strategic copy that positions your brand as the undisputed authority in your niche.',
    iconType: 'chat',
    priceDisplay: 'From ₹9,999/month (Starter, Growth & Pro Plans)',
    regularPrice: 19999,
    launchPrice: 14999,
    billingType: 'monthly',
    deliveryTime: 'Ongoing Monthly Service',
    badge: 'MONTHLY RETAINER',
    category: 'social',
    imageUrl: '/assets/images/content-and-social-media.jpg',
    features: [
      'STARTER Social Media Plan: 4 Reels + 8 Graphic Posts (₹9,999/mo)',
      'GROWTH Social Media Plan: 8 Reels (2/wk) + 12 Graphic Posts (₹14,999/mo)',
      'PRO Social Media Plan: 12 Reels (3/wk) + 16 Posts + 1 YouTube Video (₹19,999/mo)',
      'Individual Custom Branded Posts from ₹500/post (24–48h turnaround)',
      'Monthly Content Strategy & Editorial Publishing Calendar',
      'Strategic Captions, High-Retention Hooks & Targeted Hashtags'
    ],
    deliverables: [
      'Ready-to-Publish Vertical Reels (15–30s) with Dynamic Subtitles',
      'High-Resolution Branded Feed Graphics & Multi-Slide Carousels',
      'Editorial Calendar & Competitor Trend Ideation',
      'Social Profile Optimization & Monthly Growth Review',
      'Direct WhatsApp Studio Support & Creative Direction'
    ],
    process: [
      {
        step: '01',
        title: 'Pillars & Hook Research',
        description: 'Analyzing your industry, customer objections, and competitor virality to structure monthly content themes.'
      },
      {
        step: '02',
        title: 'Editorial Calendar & Scripting',
        description: 'Planning weekly rhythms balancing high-retention reels, carousel graphics, and conversion offers.'
      },
      {
        step: '03',
        title: 'Batch Production & Polish',
        description: 'Editing vertical videos with dynamic subtitles, designing on-brand carousels, and writing persuasive copy.'
      },
      {
        step: '04',
        title: 'Publishing & Growth Reviews',
        description: 'Managing publishing schedules, monitoring engagement metrics, and adjusting creative hooks for higher reach.'
      }
    ],
    faqs: [
      {
        question: 'What is included in the monthly social plans?',
        answer: 'Every plan includes vertical video reels edited with dynamic captions, branded graphic feed posts, strategic captions with hashtags, an editorial publishing calendar, and monthly growth reviews.'
      },
      {
        question: 'Can I order a single graphic post or reel without a monthly retainer?',
        answer: 'Yes! We offer individual social media graphic posts at ₹500 per post (24–48 hours turnaround) and short ad videos at ₹3,000 per video.'
      },
      {
        question: 'Do you offer commitment discounts on monthly plans?',
        answer: 'Yes. We provide 10% OFF for 1-month commitment, 15% OFF for 6 months commitment, and 25% OFF for 1 year commitment across our monthly retainer plans.'
      }
    ]
  },
  {
    id: 'social-media-advertising',
    slug: 'social-media-advertising',
    title: 'Paid Advertising — Meta & Google',
    lines: ['Paid Advertising', 'Meta & Google'],
    tagline: 'Reach the right customers with targeted Facebook, Instagram and Google Ads.',
    description: 'Reach the right customers with targeted Facebook, Instagram and Google Ads.',
    longDescription:
      'Targeted advertising campaigns built to acquire qualified leads and drive high-margin revenue with positive ROAS across Meta (Facebook & Instagram) and Google Search & Performance Max networks.',
    iconType: 'target',
    priceDisplay: 'Launch Offer: ₹15,000/month (Reg. ₹20,000)',
    regularPrice: 20000,
    launchPrice: 15000,
    billingType: 'monthly',
    deliveryTime: 'Setup in 3–5 Days',
    badge: 'HIGH ROAS',
    category: 'ads',
    imageUrl: '/assets/images/business-pro.jpg',
    features: [
      'Meta Ads Management: Facebook & Instagram (₹15,000/mo)',
      'Google Ads Management: Search & Performance Max (₹15,000/mo)',
      'Targeted ad campaign architecture & custom audience segmentation',
      'High-converting ad creatives (9:16 vertical reels & carousel graphics)',
      'Meta Pixel, Conversion API, Google Tag Manager & lead tracking setup',
      'Weekly performance monitoring, search term audits & budget optimization'
    ],
    deliverables: [
      'High-Converting Ad Copywriting & Hook Variations',
      'Vertical 9:16 Video Ad Creatives & Static Graphics',
      'Conversion API & Pixel Tracking Setup',
      'Retargeting & Lookalike Audience Building',
      'Weekly Spend & ROAS Reports'
    ],
    process: [
      {
        step: '01',
        title: 'Audience & Offer Audit',
        description: 'Analyzing high-intent search terms, customer demographics, and crafting irresistible lead offers.'
      },
      {
        step: '02',
        title: 'Creative Production & Tracking',
        description: 'Producing vertical video hooks, high-contrast graphics, Meta Pixel, and Google Tag Manager conversion events.'
      },
      {
        step: '03',
        title: 'Campaign Launch & Split Testing',
        description: 'Deploying targeted campaigns across Meta and Google to pinpoint top-performing creative and copy angles.'
      },
      {
        step: '04',
        title: 'Scaling & Budget Optimization',
        description: 'Pruning underperforming keywords and reallocating spend toward winning audiences to maximize lead volume.'
      }
    ],
    faqs: [
      {
        question: 'What is included in the ₹15,000/month ad management fee?',
        answer: 'The ₹15,000/month fee covers campaign architecture, ad creative production (video reels and graphics), persuasive copy angles, Meta Pixel/Conversion API tracking, and ongoing weekly budget optimization.'
      },
      {
        question: 'Is advertising budget included in the management fee?',
        answer: 'No. The ad spend budget is paid directly to Meta or Google through your own ad account, ensuring complete transparency and ownership of all campaign data.'
      }
    ]
  },
  {
    id: 'ai-content-video',
    slug: 'ai-content-video',
    title: 'AI Content & Video Production',
    lines: ['AI Content &', 'Video Production'],
    tagline: 'Eye-catching promotional videos and creative content that help your brand get noticed.',
    description: 'Eye-catching promotional videos and creative content that help your brand get noticed.',
    longDescription:
      'Stop the scroll with high-converting short promotional videos tailored for your business. Whether using AI visual generation, product animations, or crisp video editing, we produce ads designed to get inquiries.',
    iconType: 'video',
    priceDisplay: '₹3,000 (Short Video) • ₹5,000 (Long-Form Video)',
    regularPrice: 5000,
    launchPrice: 3000,
    billingType: 'one-time',
    deliveryTime: '~7–15 Days',
    badge: 'A LA CARTE & BUNDLES',
    category: 'video',
    imageUrl: '/assets/images/pixelplay.jpg',
    features: [
      'Short Advertisement Video: ₹3,000 per video (~7 Days turnaround)',
      'Long-Form Brand / Explainer Video: ₹5,000 per video (~15 Days turnaround)',
      '15–30 second high-retention format for Instagram Reels, Shorts & Meta Ads',
      '3–5 minute comprehensive brand walkthrough for YouTube & Website Hero',
      'Compelling hook scripting, dynamic subtitle typography & calls-to-action',
      'AI-assisted visual enhancements, motion graphics & licensed audio'
    ],
    deliverables: [
      'Strategic 3-Second Hook & Script Breakdown',
      'Professional Motion Graphics & Typography Subtitles',
      'Voiceover & Background Music Licensing',
      'Vertical 9:16 Format for Reels & TikTok',
      'Horizontal 16:9 Format for YouTube & Web'
    ],
    process: [
      {
        step: '01',
        title: 'Story & Hook Scripting',
        description: 'Writing tight 3-second opening hooks, visual cues, and compelling calls-to-action tailored to your buyers.'
      },
      {
        step: '02',
        title: 'Visual Assets & AI Synthesis',
        description: 'Generating or editing high-resolution visual footage, motion typography, and product demonstration sequences.'
      },
      {
        step: '03',
        title: 'Sound Design & Subtitles',
        description: 'Adding dynamic karaoke subtitles, licensed background music, sound effects, and voiceover audio mastering.'
      },
      {
        step: '04',
        title: 'Review & Final Delivery',
        description: 'Delivering ready-to-run 9:16 vertical and 16:9 horizontal master video files with full commercial rights.'
      }
    ],
    faqs: [
      {
        question: 'What kind of videos do you produce for ₹3,000?',
        answer: 'High-impact 15–30 second promotional ad reels for Instagram, Facebook, and YouTube Shorts with hook scripting, motion graphics, audio mastering, and clear calls-to-action.'
      },
      {
        question: 'What is included in the Long-Form Brand Video for ₹5,000?',
        answer: 'A comprehensive 3–5 minute brand or product overview video featuring full storyboard scripting, motion graphics, voiceover mastering, and YouTube SEO guidance.'
      }
    ]
  },
  {
    id: 'digital-growth-strategy',
    slug: 'digital-growth-strategy',
    title: 'Digital Growth & Content Strategy',
    lines: ['Digital Growth &', 'Content Strategy'],
    tagline: 'Plan your content, improve your online presence and turn more visitors into paying customers.',
    description: 'Plan your content, improve your online presence and turn more visitors into paying customers.',
    longDescription:
      'End-to-end digital architecture for scaling businesses. We analyze your digital footprint, spot leverage points, and unite website, content, ads, and automation into a compounding growth engine.',
    iconType: 'compass',
    priceDisplay: 'Strategic Retainer & Consultation',
    billingType: 'monthly',
    deliveryTime: 'Monthly / Quarterly Cycles',
    badge: 'STRATEGIC ADVISORY',
    category: 'growth',
    imageUrl: '/assets/images/aurora-living.jpg',
    features: [
      '360-Degree Digital Presence & Conversion Audit',
      'Positioning, Pricing & Offer Optimization Matrix',
      'Multi-Channel Customer Acquisition Roadmap',
      'Content Strategy & Industry-Specific Editorial Calendars',
      'Cross-Platform Distribution & Repurposing Workflows',
      'Direct Strategic Direction by Mr. Radha Krishna'
    ],
    deliverables: [
      '360-Degree Digital Audit & Opportunity Matrix',
      'Brand Positioning & Messaging Blueprint',
      'Monthly Editorial Content Calendars',
      'Conversion Rate Optimization Reviews'
    ],
    process: [
      {
        step: '01',
        title: '360° Digital Footprint Audit',
        description: 'Benchmarking your website speed, conversion points, competitor positioning, and customer acquisition costs.'
      },
      {
        step: '02',
        title: 'Offer & Positioning Architecture',
        description: 'Refining your messaging, pricing tiers, and trust signals to convert premium buyers faster.'
      },
      {
        step: '03',
        title: 'Multi-Channel Growth Roadmap',
        description: 'Aligning your custom website, short-form reels, and paid ad funnels into a predictable lead pipeline.'
      },
      {
        step: '04',
        title: 'Quarterly Optimization Reviews',
        description: 'Auditing funnel conversion data, lead quality, and expanding profitable growth channels.'
      }
    ],
    faqs: [
      {
        question: 'Who leads the digital growth strategy engagements?',
        answer: 'Strategic advisory engagements are directed by YUGARK Founder & Managing Director Mr. Radha Krishna, delivering tailored growth architecture for your business.'
      },
      {
        question: 'Can strategy be combined with full execution?',
        answer: 'Yes. Most clients combine strategic roadmaps with our website development and monthly social media execution for complete synchronization.'
      }
    ]
  }
];

export const websiteDemosData: DemoItem[] = [
  {
    id: 'business-pro',
    slug: 'business-pro',
    title: 'Business Pro',
    category: 'Corporate & Architecture',
    industry: 'Corporate & Business',
    image: '/assets/images/Business pro.jpg',
    alt: 'Business Pro - Aurora Builders Architecture',
    liveDemoUrl: 'https://aurorabuilders.demo.yugark.in',
    description:
      'Designed for corporate architecture firms, enterprise consultancies, and commercial development studios with authoritative proof points.',
    features: [
      'Interactive Project Showcase with Filtering',
      'Leadership & Board Profile Grid',
      'Instant Quote / Project Scope Builder',
      'Multi-Office Global Location Matrix'
    ],
    techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Vite'],
    featured: true,
    displayOrder: 1,
    status: 'published',
  },
  {
    id: 'glow-studio',
    slug: 'glow-studio',
    title: 'Glow Studio',
    category: 'Beauty & Lifestyle',
    industry: 'Beauty & Lifestyle',
    image: '/assets/images/glow Studio.jpg',
    alt: 'Glow Studio - Beauty & Lifestyle',
    liveDemoUrl: 'https://glowstudio.demo.yugark.in',
    description:
      'Soft champagne tones and organic layout for boutique wellness salons, dermatological studios, and aesthetic lifestyle practitioners.',
    features: [
      'Curated Treatment & Ritual Menu',
      'Direct WhatsApp Appointment Flow',
      'Client Transformation Stories',
      'Product Collection Showcase'
    ],
    techStack: ['React', 'Tailwind CSS', 'TypeScript'],
    featured: true,
    displayOrder: 2,
    status: 'published',
  },
  {
    id: 'dinecraft',
    slug: 'dinecraft',
    title: 'DineCraft',
    category: 'Hospitality & Dining',
    industry: 'Restaurant & Cafe',
    image: '/assets/images/dinecraft.jpg',
    alt: 'DineCraft - Restaurant & Cafe',
    liveDemoUrl: 'https://dinecraft.demo.yugark.in',
    description:
      'Atmospheric dark dining experience showcasing artisanal culinary creations, seasonal degustation menus, and seamless table booking.',
    features: [
      'Seasonal Degustation Menu Grid',
      'Table Reservation & Private Dining Request',
      'Artisanal Culinary Storytelling',
      'Sommelier Selection Highlights'
    ],
    techStack: ['React', 'Tailwind CSS', 'TypeScript'],
    featured: true,
    displayOrder: 3,
    status: 'published',
  },
  {
    id: 'fitlife',
    slug: 'fitlife',
    title: 'FitLife',
    category: 'Athletics & Training',
    industry: 'Fitness & Wellness',
    image: '/assets/images/Fit Life.jpg',
    alt: 'FitLife - Fitness & Wellness',
    liveDemoUrl: 'https://fitlife.demo.yugark.in',
    description:
      'High-impact performance training portal designed for personal coaches, boutique gyms, and high-energy athletic wellness clubs.',
    features: [
      'Weekly Program Schedule Matrix',
      'Trainer Credentials & Accreditations',
      'Tiered Membership Packages',
      'Video Training Previews'
    ],
    techStack: ['React', 'Tailwind CSS', 'TypeScript'],
    featured: true,
    displayOrder: 4,
    status: 'published',
  },
];

export const pricingPackagesData: PricingPackage[] = [
  {
    id: 'frontend-website',
    slug: 'business-website',
    name: 'Business Website',
    badge: 'LAUNCH OFFER',
    regularPrice: 15999,
    launchPrice: 9999,
    investment: 'Launch Offer: ₹9,999 (Reg. ₹15,999)',
    turnaround: '~7 Days Delivery',
    deliveryTime: 'Typical Delivery: ~7 Days',
    type: 'one-time',
    billingType: 'one-time',
    popular: false,
    ctaText: 'Choose Business Website — ₹9,999',
    tagline: 'A fast, premium and mobile-friendly website that clearly presents your business and makes it easy for customers to contact you.',
    bestFor: 'Startups, restaurants, clinics, consultants, and local businesses needing a fast, aesthetic digital presence.',
    features: [
      'Modern, High-Converting Design',
      '100% Mobile, Tablet & Desktop Responsive',
      'Contact Form & Direct Lead Capture',
      'WhatsApp Inquiry Integration',
      'Basic Google SEO Setup',
      'Fast Loading Speed',
      'Meta Title & Description Setup'
    ],
    deliverables: [
      'Production-Ready Clean React/TypeScript Codebase',
      'Responsive Across Mobile, Tablet & Desktop',
      '1-Click WhatsApp Lead Routing Integration',
      'Google Search Engine Indexing Setup',
      'Typical Delivery in ~7 Days with Zero Bloat'
    ],
    inquiryMessage: 'Hi Radha Krishna Sir, I would like to inquire about the Business Website package (₹9,999 Launch Offer).'
  },
  {
    id: 'fullstack-website',
    slug: 'website-dashboard',
    name: 'Website + Lead Management Dashboard',
    badge: 'COMPREHENSIVE',
    popular: true,
    regularPrice: 19999,
    launchPrice: 14999,
    investment: 'Launch Offer: ₹14,999 (Reg. ₹19,999)',
    turnaround: '~10–14 Days Delivery',
    deliveryTime: 'Typical Delivery: ~10–14 Days',
    type: 'one-time',
    billingType: 'one-time',
    ctaText: 'Choose Website + Dashboard — ₹14,999',
    tagline: 'A complete business website with a backend system where customer enquiries can be securely saved, managed and downloaded.',
    bestFor: 'Growing businesses requiring automated lead capture, backend data control, and lead export without monthly subscriptions.',
    features: [
      'Custom Website with Backend Infrastructure',
      'Lead Capture Form & Database',
      'Database & Lead Management Portal',
      'Secure Admin Dashboard Preview',
      'Excel / CSV Lead Export',
      'Automated Email Lead Notifications',
      'WhatsApp Lead Notifications'
    ],
    deliverables: [
      'Custom Website with Connected Supabase Database',
      'Secure Admin Dashboard with Role-Based Access',
      '1-Click Excel / CSV Lead Export Capability',
      'Automated Email & WhatsApp Inquiry Alerts',
      'Zero Monthly Third-Party Subscription Fees'
    ],
    inquiryMessage: 'Hi Radha Krishna Sir, I would like to inquire about the Website + Lead Management Dashboard package (₹14,999 Launch Offer).'
  },
  {
    id: 'growth-social-plan',
    slug: 'growth-social-plan',
    name: 'GROWTH Social Media & Content Plan',
    badge: 'MOST POPULAR PLAN',
    popular: true,
    regularPrice: 19999,
    launchPrice: 14999,
    investment: 'Launch Offer: ₹14,999/month (Reg. ₹19,999)',
    turnaround: 'Ongoing Monthly Service',
    deliveryTime: 'Ongoing Monthly Service',
    type: 'monthly',
    billingType: 'monthly',
    ctaText: 'Choose Growth Plan — ₹14,999/mo',
    tagline: '8 High-Retention Reels + 12 Branded Graphic Posts per month + Strategic Content Calendar.',
    bestFor: 'Ambitious brands seeking compounding algorithm reach, weekly short-form video, and category authority.',
    features: [
      '8 Custom High-Impact Reels / Shorts (2 per week)',
      '12 Branded Social Graphic Posts & Carousels',
      'Monthly Content Strategy & Editorial Calendar',
      'Strategic Captions & Viral Hook Variations',
      'Social Profile Optimization & Monthly Growth Review',
      'WhatsApp Direct Studio Support'
    ],
    deliverables: [
      '8 Short-Form Videos with Dynamic Subtitles & Audio',
      '12 High-Converting Feed Posts & Multi-Slide Carousels',
      'Editorial Calendar & Competitor Trend Research',
      'Bi-Weekly Content Delivery Batches',
      'Monthly Analytics & Strategy Review Session'
    ],
    inquiryMessage: 'Hi Radha Krishna Sir, I would like to inquire about the GROWTH Social Media & Content Plan (₹14,999/month).'
  },
  {
    id: 'paid-ads-management',
    slug: 'paid-ads-management',
    name: 'Meta / Google Paid Ads Management',
    badge: 'HIGH ROAS',
    popular: false,
    regularPrice: 20000,
    launchPrice: 15000,
    investment: 'Launch Offer: ₹15,000/month (Reg. ₹20,000)',
    turnaround: 'Setup in 3–5 Days',
    deliveryTime: 'Setup in 3–5 Days',
    type: 'monthly',
    billingType: 'monthly',
    ctaText: 'Choose Ads Management — ₹15,000/mo',
    tagline: 'Targeted performance campaigns built for qualified leads, direct sales, and high ROAS.',
    bestFor: 'Businesses with established offerings looking to drive direct inquiries and predictably scale customer acquisition.',
    features: [
      'Targeted campaign architecture & custom audience building',
      'Ad creatives, hook variations & high-converting copy',
      'Pixel, Conversion API & tracking setup',
      'Weekly performance monitoring & budget optimization'
    ],
    deliverables: [
      'Tested Ad Copywriting & Persuasive Hooks',
      'Vertical 9:16 Video Creatives & Graphic Carousels',
      'Meta Pixel & Google Tag Manager Tracking Setup',
      'Weekly Spend, Conversion & ROAS Reporting'
    ],
    inquiryMessage: 'Hi Radha Krishna Sir, I would like to inquire about the Meta / Google Paid Ads Management (₹15,000/month).'
  }
];

export const pricingCalculatorItemsData: PricingCalculatorItem[] = [
  {
    id: 'calc-frontend-web',
    title: 'Business Website',
    price: 9999,
    originalPrice: 15999,
    unit: 'per website',
    category: 'website',
    billingType: 'one-time',
    deliveryTime: '~7 Days Delivery',
    badge: 'LAUNCH OFFER',
    description: 'A fast, premium and mobile-friendly website that clearly presents your business and makes it easy for customers to contact you.',
    features: ['Modern, High-Converting', '100% Responsive', 'WhatsApp & Lead Capture', 'Fast Speed & SEO']
  },
  {
    id: 'calc-fullstack-web',
    title: 'Website + Lead Management Dashboard',
    price: 14999,
    originalPrice: 19999,
    unit: 'per website',
    category: 'website',
    billingType: 'one-time',
    deliveryTime: '~10–14 Days Delivery',
    badge: 'COMPREHENSIVE',
    isPopular: true,
    description: 'A complete business website with a backend system where customer enquiries can be securely saved, managed and downloaded.',
    features: ['Custom Backend', 'Database & Admin Dashboard', 'Excel / CSV Lead Export', 'WhatsApp & Email Alerts']
  },
  {
    id: 'calc-starter-plan',
    title: 'STARTER Social Media Plan',
    price: 9999,
    unit: 'per month',
    category: 'social',
    billingType: 'monthly',
    deliveryTime: 'Ongoing Monthly Service',
    description: '4 Reels + 8 Graphic Posts per month with strategic captions & scheduling.',
    features: ['4 Reels/Shorts', '8 Graphic Posts', 'Content Calendar', 'Captions & Hashtags']
  },
  {
    id: 'calc-growth-plan',
    title: 'GROWTH Social Media Plan',
    price: 14999,
    originalPrice: 19999,
    unit: 'per month',
    category: 'social',
    billingType: 'monthly',
    deliveryTime: 'Ongoing Monthly Service',
    badge: 'MOST POPULAR',
    isPopular: true,
    description: '8 Reels + 12 Graphic Posts per month + Strategy Calendar & Growth Review.',
    features: ['8 Reels (2/week)', '12 Graphic Posts', 'Strategy Calendar', 'Profile Optimization']
  },
  {
    id: 'calc-pro-plan',
    title: 'PRO Social Media Plan',
    price: 19999,
    unit: 'per month',
    category: 'social',
    billingType: 'monthly',
    deliveryTime: 'Ongoing Monthly Service',
    description: '12 Reels + 16 Posts + 1 Long-Form YouTube Video per month.',
    features: ['12 Reels (3/week)', '16 Posts/Carousels', '1 YouTube Video (~3–5 min)', 'Dedicated Strategy']
  },
  {
    id: 'calc-meta-ads',
    title: 'Meta Ads Management',
    price: 15000,
    unit: 'per month',
    category: 'ads',
    billingType: 'monthly',
    deliveryTime: 'Setup in 3–5 Days',
    description: 'Targeted Meta/Facebook/Instagram campaign architecture, creatives & optimization.',
    features: ['Targeted structure', 'Ad creatives', 'Pixel & CAPI', 'Weekly optimization']
  },
  {
    id: 'calc-google-ads',
    title: 'Google Ads Management',
    price: 15000,
    unit: 'per month',
    category: 'ads',
    billingType: 'monthly',
    deliveryTime: 'Setup in 3–5 Days',
    description: 'High-intent Google Search, Performance Max & YouTube Ads management.',
    features: ['Keyword research', 'Negative keywords', 'Search & PMax', 'Conversion tracking']
  },
  {
    id: 'calc-short-video',
    title: 'Short Advertisement Video',
    price: 3000,
    unit: 'per video',
    category: 'video',
    billingType: 'one-time',
    deliveryTime: '~7 Days Delivery',
    description: '15–30s high-retention promotional reel or paid social ad.',
    features: ['Hook script', 'Motion text', 'Voiceover', '9:16 format']
  },
  {
    id: 'calc-long-video',
    title: 'Long Brand / Explainer Video',
    price: 5000,
    unit: 'per video',
    category: 'video',
    billingType: 'one-time',
    deliveryTime: '~15 Days Delivery',
    description: '3–5 minute detailed brand overview or service walkthrough.',
    features: ['Storyboard', 'Deep narrative', 'YouTube SEO', '16:9 master']
  },
  {
    id: 'calc-single-post',
    title: 'Social Media Graphic Post',
    price: 500,
    unit: 'per post',
    category: 'content',
    billingType: 'one-time',
    deliveryTime: '24–48 Hours',
    description: 'Custom designed graphic or carousel slide with caption.',
    features: ['On-brand design', 'Written caption', 'Targeted hashtags']
  }
];

export const allVerifiedOfferingsData = [
  ...pricingPackagesData,
  ...pricingCalculatorItemsData
];

export const blogPostsData: BlogPostItem[] = [
  {
    id: 'effective-website-2026',
    slug: 'effective-website-2026',
    title: 'What Makes a Website Truly Effective in 2026?',
    category: 'Website Development',
    author: 'Yugark Editorial',
    authorRole: 'Design Engineering',
    excerpt: 'Key elements that turn a good website into a powerful growth tool for modern business.',
    content:
      'In 2026, a successful website is no longer just an aesthetic brochure; it is an active conversion engine. Modern consumers expect sub-second load times, tactile micro-interactions, uncompromising mobile typography, and authentic brand storytelling that bridges proof directly to user value.',
    richParagraphs: [
      'The modern web has grown intolerant of friction. Over-engineered animations, bloated client scripts, and jarring layout shifts immediately signal a lack of technical discipline. Conversely, interfaces that load instantly and respond deliberately establish unconscious trust before a single paragraph is read.',
      'True conversion effectiveness stems from typographic restraint. By establishing a clear hierarchy between characterful editorial serifs and crisp geometric body type, brands guide the eye naturally toward proof points and calls to action without visual coercion.',
      'Furthermore, the architecture beneath the canvas matters. Modern digital studios build with headless data layers and type-safe components from day one, allowing content to evolve without risking layout regressions or expensive rewrites.'
    ],
    readTime: '4 min read',
    publishedDate: 'January 2026',
    status: 'published',
    image: '/assets/images/website devlopment.jpg',
    alt: 'Website Strategy notebook on marble desk',
    metaDescription: 'Discover the essential principles of conversion-focused, high-performance web architecture in 2026.'
  },
  {
    id: 'content-ideas-brand-ahead',
    slug: 'content-ideas-brand-ahead',
    title: 'Content Ideas to Keep Your Brand Ahead',
    category: 'Content & Social Media',
    author: 'Yugark Creative',
    authorRole: 'Content Strategy',
    excerpt: 'Creative content strategies to stay relevant, authentic and engaging in an ever-shifting landscape.',
    content:
      'The modern feed demands depth over noise. We explore how documenting genuine operational processes, behind-the-scenes decision making, and customer transformation narratives yields exponentially higher retention than repetitive trend-chasing.',
    richParagraphs: [
      'Generic social feeds generate passive scrolling, not active interest. To build an enduring presence, modern brands must shift from superficial broadcast messaging to documentary transparency.',
      'Audiences connect with the philosophy and rigorous problem-solving behind a product. Sharing unvarnished project iterations, material selection rationale, and strategic lessons positions a brand as an authority rather than a vendor.',
      'By organizing social output into consistent editorial pillars, studios maintain predictable production cadences while ensuring every single post reinforces the master brand narrative.'
    ],
    readTime: '5 min read',
    publishedDate: 'February 2026',
    status: 'published',
    image: '/assets/images/content-and-social-media.jpg',
    alt: 'Content Creates Connection book on table',
    metaDescription: 'Explore actionable content strategies that cultivate authentic audience loyalty and long-term retention.'
  },
  {
    id: 'guide-better-ad-campaigns',
    slug: 'guide-better-ad-campaigns',
    title: 'A Simple Guide to Running Better Ad Campaigns',
    category: 'Digital Marketing',
    author: 'Yugark Growth Lab',
    authorRole: 'Performance Marketing',
    excerpt: 'Practical tips to get more out of your ad spend and reach the right audience consistently.',
    content:
      'Scaling paid channels requires rigorous testing architectures: decoupling hook testing from pitch mechanics, maintaining strict creative cadence, and structuring conversion-focused landing pages that mirror ad copy verbatim.',
    richParagraphs: [
      'High-return advertising is rarely about creative genius alone; it is about disciplined testing frameworks. The most successful performance campaigns decouple the opening 3-second hook from the underlying value proposition to pinpoint exact resonance factors.',
      'Equally crucial is message symmetry. When an ad creative promises a specific aesthetic or outcome, the destination landing page must reflect that exact imagery, headline tone, and promise within the initial viewport.',
      'By treating paid acquisition as an empirical feedback loop rather than a lottery, businesses build sustainable customer acquisition engines that compound alongside their organic authority.'
    ],
    readTime: '6 min read',
    publishedDate: 'March 2026',
    status: 'published',
    image: '',
    alt: 'High-ROAS Ad Precision Performance Architecture',
    isGraphicCard: true,
    graphicData: {
      framework: 'Framework 03',
      precision: 'Ad Precision',
      architectureBadge: 'High-ROAS Architecture',
      headline: 'Reach & Convert at Scale.',
      playbookLabel: 'Performance Playbook',
    },
    metaDescription: 'A systematic framework for testing, deploying, and scaling high-return digital advertising campaigns.'
  },
];
