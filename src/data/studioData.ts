import {
  SiteConfig,
  NavLink,
  ValueHighlight,
  ProjectItem,
  ServiceItem,
  DemoItem,
  BlogPostItem,
  PricingPackage
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
  whatsappNumber: '+91 9125272460',
  whatsappUrl: 'https://wa.me/919125272460',
  location: 'Global Digital Studio',
  socials: {
    instagram: 'https://instagram.com',
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
    tagline: 'Bespoke, high-performing websites engineered to convert visitors into loyal clients.',
    description: 'Custom, high-performing websites that look premium and deliver results.',
    longDescription:
      'We architect bespoke websites tailored for ambitious businesses, premium consultancies, and innovative brands. Every interface is built with responsive precision, sub-second loading speeds, accessible UX, and headless CMS readiness.',
    iconType: 'code',
    features: [
      'Custom React / TypeScript Architecture',
      'Sub-Second Core Web Vitals Optimization',
      'Headless CMS & Database Readiness (Supabase)',
      '100% Mobile & Tablet Responsive Engineering',
      'Clean Semantic Code & Built-In SEO Structure',
      'Interactive Demos & Client Portal Foundations'
    ],
    deliverables: [
      'Production-Ready Source Code',
      'Design System & Component Token Library',
      'Validated Contact & Lead Form Routing',
      'Deployment & Hosting Configuration Support'
    ],
    process: [
      {
        step: '01',
        title: 'Discovery & Wireframing',
        description: 'We audit your brand objectives, competitor landscape, and information architecture before establishing structural wireframes.'
      },
      {
        step: '02',
        title: 'Design System & Prototyping',
        description: 'Crafting responsive layouts, refined typography pairings, and tactile components in alignment with your luxury brand tone.'
      },
      {
        step: '03',
        title: 'Full-Stack Development',
        description: 'Writing clean, typed React/TypeScript code with zero bloat, modular styling, and rigorous cross-device testing.'
      },
      {
        step: '04',
        title: 'Launch & Handoff',
        description: 'Comprehensive QA, performance audits, domain routing, and seamless handoff with documentation.'
      }
    ],
    faqs: [
      {
        question: 'What technologies do you build websites with?',
        answer: 'We specialize in modern frontend stacks including React, Next.js, TypeScript, Vite, and Tailwind CSS, backed by headless databases such as Supabase.'
      },
      {
        question: 'Will our team be able to update content without a developer?',
        answer: 'Yes. In Step 2 of our studio rollout, websites integrate with an intuitive Admin Dashboard and Supabase backend for effortless content editing.'
      },
      {
        question: 'How long does a custom studio website build take?',
        answer: 'Typical engagements range from 2 to 4 weeks depending on the number of bespoke templates, case-studies, and custom interactions.'
      }
    ]
  },
  {
    id: 'social-media',
    slug: 'social-media',
    title: 'Social Media',
    lines: ['Social Media'],
    tagline: 'Strategic content and creative narratives designed to build genuine brand authority.',
    description: "Engaging content and strategies to grow your brand's presence.",
    longDescription:
      'We craft elevated social media assets and disciplined publishing frameworks that cut through algorithm noise. Our focus is on high-retention storytelling, visual consistency, and converting casual scrollers into engaged brand advocates.',
    iconType: 'chat',
    features: [
      'Strategic Monthly Content Roadmaps',
      'High-Fidelity Visual Asset Production',
      'Platform-Native Copywriting & Hooks',
      'Brand Cohesion Across Instagram, LinkedIn & X',
      'Engagement Strategy & Community Frameworks',
      'Creative Performance Reviews'
    ],
    deliverables: [
      'Monthly High-Resolution Asset Packs',
      'Ready-to-Publish Captions & Tagging Sets',
      'Custom Brand Template Files (Figma / Vector)',
      'Quarterly Creative Trajectory Reports'
    ],
    process: [
      {
        step: '01',
        title: 'Brand Voice Audit',
        description: 'Analyzing existing engagement touchpoints and formalizing your distinctive brand tone and editorial pillars.'
      },
      {
        step: '02',
        title: 'Calendar Architecture',
        description: 'Structuring weekly rhythms balancing educational insight, proof points, and high-impact visual showpieces.'
      },
      {
        step: '03',
        title: 'Asset Design & Packaging',
        description: 'Producing custom carousels, typography boards, and story assets aligned with your brand guidelines.'
      },
      {
        step: '04',
        title: 'Iteration & Optimization',
        description: 'Refining hook structures and visual treatments based on real engagement data and audience response.'
      }
    ],
    faqs: [
      {
        question: 'Which platforms do you support?',
        answer: 'We focus primarily on Instagram, LinkedIn, and YouTube/X, tailoring asset dimensions and editorial tone for each platform.'
      },
      {
        question: 'Do you provide photography and design assets?',
        answer: 'Yes, we provide full digital asset creation including typographic carousels, mockups, product graphics, and story templates.'
      }
    ]
  },
  {
    id: 'ads',
    slug: 'ads',
    title: 'Ads',
    lines: ['Ads'],
    tagline: 'Precision advertising campaigns engineered for measurable return and scalable acquisition.',
    description: 'Data-driven ad campaigns across platforms to reach the right audience.',
    longDescription:
      'We design and deploy performance-driven ad campaigns across Meta and Google ecosystems. By uniting persuasive visual design with disciplined audience targeting and high-converting landing pages, we scale client acquisition systematically.',
    iconType: 'target',
    features: [
      'Multi-Format Creative Asset Testing (Static & Carousel)',
      'Meta & Google Ads Campaign Architecture',
      'Conversion-Optimized Landing Page Alignment',
      'Audience Segmentation & Retargeting Funnels',
      'Rigorous Attribution & Pixel Configuration',
      'Weekly Spend & ROAS Efficiency Audits'
    ],
    deliverables: [
      'Tested Campaign Ad Creatives',
      'High-Intent Copy Variations & Angles',
      'Campaign Architecture Documentation',
      'Performance Dashboard & Spend Tracking'
    ],
    process: [
      {
        step: '01',
        title: 'Customer Angle Analysis',
        description: 'Deconstructing your target demographic pain points, objections, and aspirational triggers.'
      },
      {
        step: '02',
        title: 'Creative Production',
        description: 'Designing bespoke ad creatives that match the visual sophistication of your primary brand presence.'
      },
      {
        step: '03',
        title: 'Structured Testing Launch',
        description: 'Deploying controlled budget experiments to identify high-performing creative and copy combinations.'
      },
      {
        step: '04',
        title: 'Scaling & Optimization',
        description: 'Reallocating spend toward proven winning variations while maintaining healthy acquisition costs.'
      }
    ],
    faqs: [
      {
        question: 'Do you manage both the ad creative and the campaign settings?',
        answer: 'Yes, we provide end-to-end support covering visual ad production, copywriting, platform configuration, and optimization.'
      },
      {
        question: 'What ad spend budget is required to start?',
        answer: 'We typically recommend minimum testing budgets that allow statistically valid iteration across target audience segments.'
      }
    ]
  },
  {
    id: 'ai-creative',
    slug: 'ai-creative',
    title: 'AI Creative',
    lines: ['AI Creative'],
    tagline: 'Modern, AI-assisted creative workflows that accelerate asset delivery without sacrificing taste.',
    description: 'Modern, AI-powered creative content for faster, smarter growth.',
    longDescription:
      'We combine human design taste with modern AI workflows to accelerate brand production. From rapid visual conceptualization and personalized imagery to automated copy variation systems, we give modern studios an unfair speed advantage.',
    iconType: 'sparkles',
    features: [
      'Brand-Trained Prompt Architectures',
      'High-Fidelity Concept Visualization',
      'Dynamic Copy & Angle Generation',
      'Automated Multi-Channel Asset Variations',
      'Custom Generative Image Styling Pipelines',
      'Ethical & IP-Protected Workflow Standards'
    ],
    deliverables: [
      'Custom Studio Prompt Libraries',
      'Generated Visual Asset Libraries',
      'Copy Generation Template Workflows',
      'Automated Workflow Documentation'
    ],
    process: [
      {
        step: '01',
        title: 'Workflow Mapping',
        description: 'Identifying creative bottlenecks in your current production pipeline suitable for intelligent acceleration.'
      },
      {
        step: '02',
        title: 'Prompt & Style Engineering',
        description: 'Calibrating AI models to adhere strictly to your typography, lighting, and palette rules.'
      },
      {
        step: '03',
        title: 'Human Curation & Polish',
        description: 'Reviewing and elevating every generated asset through expert designer hands before deployment.'
      },
      {
        step: '04',
        title: 'System Integration',
        description: 'Embedding automated creative workflows directly into your operational stack.'
      }
    ],
    faqs: [
      {
        question: 'Does AI creative replace human design?',
        answer: 'No. AI acts as a high-powered production engine, while human creative direction dictates taste, brand coherence, and quality.'
      },
      {
        question: 'Are all generated assets commercially safe?',
        answer: 'Yes, our workflows utilize commercially licensed enterprise models and bespoke style guidelines.'
      }
    ]
  },
  {
    id: 'branding',
    slug: 'branding',
    title: 'Branding',
    lines: ['Branding'],
    tagline: 'Distinctive brand identities crafted to command respect and stand out in competitive markets.',
    description: 'Distinctive brand identities that make a lasting impression.',
    longDescription:
      'We design timeless brand identities for modern founders, creative studios, and premium enterprises. From typographic hierarchy and balanced color tokens to stationery and digital style systems, we build identities that resonate deeply.',
    iconType: 'palette',
    features: [
      'Comprehensive Visual Identity Design',
      'Editorial Serif & Structural Sans Typography Pairings',
      'Color Token Architecture (Canvas, Accents, Substrates)',
      'Vector Logo & Studio Mark System',
      'Brand Guidelines Specification Document',
      'Digital Collateral & Social Media Master Files'
    ],
    deliverables: [
      'Comprehensive Brand Guidelines (PDF & Digital)',
      'Vector Master Assets (SVG, PNG, EPS)',
      'Typography System & Licensing Guidance',
      'Design Tokens for Web Implementation'
    ],
    process: [
      {
        step: '01',
        title: 'Brand Archetype Discovery',
        description: 'Uncovering the underlying values, competitive positioning, and emotional resonance of your organization.'
      },
      {
        step: '02',
        title: 'Visual Direction Exploration',
        description: 'Presenting distinct editorial moodboards and identity concepts for collaborative review.'
      },
      {
        step: '03',
        title: 'Identity Refinement',
        description: 'Polishing letterforms, color ratios, spatial margins, and application mockups.'
      },
      {
        step: '04',
        title: 'System Handoff',
        description: 'Delivering complete asset packages and digital tokens ready for immediate implementation.'
      }
    ],
    faqs: [
      {
        question: 'What is included in the final brand package?',
        answer: 'You receive primary wordmarks, secondary badges, color token palettes, typography rules, and usage guidelines in vector and web formats.'
      },
      {
        question: 'Can you implement our new brand into a website directly?',
        answer: 'Yes, our studio integrates identity design seamlessly with full website engineering for a unified rollout.'
      }
    ]
  },
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
    id: 'starter-launch',
    slug: 'starter-launch',
    name: 'Starter Launch',
    tagline: 'Ideal for emerging brands, boutique firms, and focused product launches.',
    investment: 'Custom Studio Quote',
    turnaround: '2 – 3 Weeks',
    bestFor: 'Founders and independent studios seeking an authoritative, luxury digital footprint.',
    features: [
      'Up to 5 Custom Responsive Templates',
      'Mobile-First Feathered Visual Architecture',
      'Clean Contact & WhatsApp Lead Flow',
      'Core Web Vitals Speed Tuning',
      'Basic On-Page SEO Foundations',
      'Supabase CMS Ready Architecture'
    ],
    deliverables: [
      'Complete React/TypeScript Source Code',
      'Production Deployment Setup',
      'Design Token Documentation',
      '2 Weeks Post-Launch Support'
    ],
    inquiryMessage: 'Hello Yugark Studio, I would like to inquire about the Starter Launch package.'
  },
  {
    id: 'growth-studio',
    slug: 'growth-studio',
    name: 'Growth Studio',
    tagline: 'Our flagship studio tier for scaling companies and established service practices.',
    investment: 'Custom Studio Quote',
    turnaround: '3 – 5 Weeks',
    popular: true,
    bestFor: 'Brands requiring complete design systems, extensive case-studies, and dynamic CMS capabilities.',
    features: [
      'Up to 12 Bespoke Templates & Case Studies',
      'Comprehensive Brand Token Alignment',
      'Dynamic Blog & Project Showcase Systems',
      'Interactive Template Demos & Previews',
      'Advanced Meta/Google Attribution Setup',
      'Direct WhatsApp & Secure Form Inquiries',
      'Priority Turnaround & Revision Cycles'
    ],
    deliverables: [
      'Full-Stack Source Repository',
      'Supabase Database Schema & Setup',
      'Custom Component Design System',
      '4 Weeks Dedicated Studio Support'
    ],
    inquiryMessage: 'Hello Yugark Studio, I would like to inquire about the Growth Studio package.'
  },
  {
    id: 'bespoke-enterprise',
    slug: 'bespoke-enterprise',
    name: 'Bespoke Enterprise',
    tagline: 'Comprehensive digital transformation, custom architectures, and ongoing studio partnership.',
    investment: 'Custom Studio Quote',
    turnaround: 'Bespoke Milestones',
    bestFor: 'Enterprise organizations, multi-brand portfolios, and agencies demanding tailored platforms.',
    features: [
      'Unlimited Bespoke Templates & Pages',
      'Custom Database & API Architecture',
      'End-to-End Brand Identity & Guidelines',
      'Multi-Role Admin Dashboard Prep',
      'Automated Lead Notification Pipelines',
      'Enterprise Performance & Security Audits',
      'Direct Studio Director Collaboration'
    ],
    deliverables: [
      'Enterprise Source Repository & IP Transfer',
      'Complete Master Asset Vector Packages',
      'Architectural Documentation & Walkthroughs',
      'Ongoing Retainer & Support Options'
    ],
    inquiryMessage: 'Hello Yugark Studio, I would like to inquire about the Bespoke Enterprise package.'
  }
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
    image: '/assets/images/Content & Social Media.jpg',
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
