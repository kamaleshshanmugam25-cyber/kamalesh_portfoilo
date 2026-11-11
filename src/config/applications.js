/**
 * CENTRALIZED APPLICATIONS CONFIGURATION
 * 
 * To add, edit, or remove website applications, modify the items in this array.
 * URLs can be updated here and will automatically propagate through:
 * - Desktop Icons
 * - Bottom Dock
 * - Application Launcher & Search
 * - Internal In-App Browser & Iframes
 * - Projects Showcase Bento Grid
 */

export const APPLICATIONS = [
  {
    id: 'rsk-traders',
    name: 'RSK TRADERS',
    shortName: 'RSK Traders',
    category: 'Import & Export',
    url: 'https://rsktraders.co.in',
    status: 'live',
    supportsIframe: true,
    accentColor: '#39D5C8', // Cyan/Teal
    gradient: 'from-cyan-500/20 via-teal-500/10 to-transparent',
    iconGradient: 'from-emerald-400 to-teal-500',
    iconBg: '#092524',
    badge: 'LIVE PRODUCT',
    description: 'International global trade, logistics, and bulk commodity import-export platform.',
    longDescription: 'RSK Traders is an established import and export enterprise platform designed to facilitate cross-border merchant trade, bulk procurement, and international logistics distribution. Featuring catalog browsing, quotation requests, and supply chain tracking.',
    techStack: ['React', 'Tailwind CSS', 'Node.js', 'PostgreSQL', 'Cloudflare'],
    features: [
      'International commodity catalog with real-time inquiries',
      'Dynamic RFQ (Request for Quotation) engine',
      'Global logistics and port customs documentation portal',
      'High-performance mobile-optimized interface'
    ],
    metrics: [
      { label: 'Global Trade', value: '15+ Nations' },
      { label: 'Procurement', value: 'Bulk Supply' },
      { label: 'Availability', value: '99.9% Uptime' }
    ],
    previewMockup: {
      type: 'trade',
      headline: 'Global Commodity & Merchant Trade Hub',
      subheadline: 'Connecting global buyers and vetted bulk exporters with zero friction.'
    }
  },
  {
    id: 'photography',
    name: 'PHOTOGRAPHY WEBSITE',
    shortName: 'Photography',
    category: 'Photography & Creative Services',
    url: '', // Add photography URL when available
    status: 'coming-soon',
    supportsIframe: false,
    accentColor: '#8B7CFF', // Purple/Violet
    gradient: 'from-purple-500/20 via-indigo-500/10 to-transparent',
    iconGradient: 'from-purple-400 to-indigo-600',
    iconBg: '#1C1535',
    badge: 'CREATIVE STUDIO',
    description: 'High-end visual storytelling, editorial photography studio, and client booking suite.',
    longDescription: 'An immersive digital portfolio and booking platform crafted for professional photographers and cinematic studios. Includes full-bleed gallery views, EXIF data inspection, and private client proofing galleries.',
    techStack: ['Next.js', 'Framer Motion', 'Tailwind CSS', 'AWS S3', 'Stripe'],
    features: [
      'High-resolution masonry galleries with virtualized scrolling',
      'Client proofing & private protected album delivery',
      'Automated session booking and deposit checkout system',
      'Adaptive image compression and webp optimization pipeline'
    ],
    metrics: [
      { label: 'Resolution', value: 'Ultra HD 4K' },
      { label: 'Client Suites', value: 'Private & Secure' },
      { label: 'Deliveries', value: 'Instant Access' }
    ],
    previewMockup: {
      type: 'photography',
      headline: 'Editorial & Cinematic Visual Studio',
      subheadline: 'Crafting unforgettable frames, commercial campaigns, and intimate portraits.'
    }
  },
  {
    id: 'jewellery',
    name: 'GOLD JEWELLERY WEBSITE',
    shortName: 'Gold Jewellery',
    category: 'Jewellery & E-commerce',
    url: '', // Add jewellery URL when available
    status: 'coming-soon',
    supportsIframe: false,
    accentColor: '#F59E0B', // Warm Gold
    gradient: 'from-amber-500/20 via-yellow-500/10 to-transparent',
    iconGradient: 'from-amber-300 via-yellow-500 to-amber-600',
    iconBg: '#271D07',
    badge: 'E-COMMERCE',
    description: 'Bespoke fine jewellery e-commerce platform with real-time bullion rate integration.',
    longDescription: 'A luxury digital boutique showcasing 22K and 18K handcrafted gold ornaments, certified diamond collections, and bridal jewellery. Features daily live market rate tickers, 3D ring visualizer, and custom wedding consultations.',
    techStack: ['React', 'Django', 'PostgreSQL', 'Tailwind CSS', 'Razorpay'],
    features: [
      'Live daily gold & diamond market rate ticker',
      'Interactive 360-degree jewellery viewing carousel',
      'Hallmark certification and authenticity verification',
      'Custom bespoke order builder & appointment scheduler'
    ],
    metrics: [
      { label: 'Purity', value: '916 Hallmark' },
      { label: 'Craftsmanship', value: 'Artisan Handcrafted' },
      { label: 'Security', value: 'Vault Protected' }
    ],
    previewMockup: {
      type: 'jewellery',
      headline: 'Handcrafted Heritage & Contemporary Fine Gold',
      subheadline: 'Timeless heirlooms meticulously forged by master artisans.'
    }
  },
  {
    id: 'restaurant',
    name: 'RESTAURANT WEBSITE',
    shortName: 'Restaurant',
    category: 'Restaurant & Food',
    url: '', // Add restaurant URL when available
    status: 'coming-soon',
    supportsIframe: false,
    accentColor: '#F43F5E', // Rose/Crimson
    gradient: 'from-rose-500/20 via-red-500/10 to-transparent',
    iconGradient: 'from-rose-400 to-red-600',
    iconBg: '#2A0C14',
    badge: 'CULINARY EXPERIENCE',
    description: 'Gourmet dining portal featuring interactive digital menus, table reservations, and takeaway.',
    longDescription: 'An atmospheric dining experience connecting discerning food connoisseurs with chef-curated tasting menus. Features real-time table reservation management, sensory food photography, and integrated sommelier wine pairings.',
    techStack: ['React', 'Tailwind CSS', 'Node.js', 'MongoDB', 'Socket.io'],
    features: [
      'Sensory seasonal menu with dietary filters & allergen guide',
      'Live interactive table booking & seating floorplan selection',
      'Chef special tasting menu previews with wine pairing notes',
      'Seamless pickup order scheduling & contactless payment'
    ],
    metrics: [
      { label: 'Ambience', value: 'Fine Dining' },
      { label: 'Cuisine', value: 'Chef Curated' },
      { label: 'Reservations', value: 'Real-Time' }
    ],
    previewMockup: {
      type: 'restaurant',
      headline: 'Artisanal Culinary Arts & Dining Experience',
      subheadline: 'Where culinary tradition meets contemporary gastronomical elegance.'
    }
  },
  {
    id: 'jobsphere',
    name: 'JOBSPHERE',
    shortName: 'JobSphere',
    category: 'Job Aggregation Platform',
    url: '', // Add jobsphere URL when available
    status: 'coming-soon',
    supportsIframe: false,
    accentColor: '#3B82F6', // Blue
    gradient: 'from-blue-500/20 via-sky-500/10 to-transparent',
    iconGradient: 'from-blue-400 to-cyan-500',
    iconBg: '#0B1C33',
    badge: 'PLATFORM',
    description: 'Next-generation tech job aggregation platform with AI candidate matching and salary insights.',
    longDescription: 'JobSphere unifies verified job openings across leading tech companies, startups, and remote teams into a centralized intelligence stream. Features AI skill matching, transparent compensation benchmarks, and one-click applications.',
    techStack: ['React', 'Python', 'Django REST', 'PostgreSQL', 'Tailwind CSS'],
    features: [
      'Multi-board live job scraping and deduplication pipeline',
      'AI resume-to-job matching score and gap analysis',
      'Verified compensation bands and remote workplace ratings',
      'Instant application tracker with interview timeline kanban'
    ],
    metrics: [
      { label: 'Listings', value: 'Verified Postings' },
      { label: 'Matching', value: 'AI Powered' },
      { label: 'Privacy', value: 'Candidate First' }
    ],
    previewMockup: {
      type: 'jobsphere',
      headline: 'Next-Gen Tech Career Discovery & Matching',
      subheadline: 'Curating elite engineering, design, and product roles without the noise.'
    }
  },
  {
    id: 'college-erp',
    name: 'COLLEGE ERP',
    shortName: 'College ERP',
    category: 'Enterprise Management System',
    url: '', // Add college erp URL when available
    status: 'coming-soon',
    supportsIframe: false,
    accentColor: '#10B981', // Emerald
    gradient: 'from-emerald-500/20 via-teal-500/10 to-transparent',
    iconGradient: 'from-emerald-400 to-green-600',
    iconBg: '#092318',
    badge: 'ENTERPRISE SYSTEM',
    description: 'Comprehensive campus management suite for academic records, fees, faculty, and examinations.',
    longDescription: 'An enterprise-grade institutional operating system managing the entire higher education lifecycle. Provides integrated portals for students, faculty, admissions, fee reconciliation, attendance analytics, and automated examination scheduling.',
    techStack: ['React', 'Python', 'Django', 'PostgreSQL', 'Bootstrap', 'Redis'],
    features: [
      'Role-based role access control (Student, Faculty, Dean, Admin)',
      'Automated attendance, biometric tracking & leave workflows',
      'Online fee reconciliation, scholarship management & invoicing',
      'Examination grading engine, GPA analytics & transcript generation'
    ],
    metrics: [
      { label: 'Campus Scale', value: '10,000+ Students' },
      { label: 'Architecture', value: 'Role-Based ERP' },
      { label: 'Security', value: 'Enterprise Grade' }
    ],
    previewMockup: {
      type: 'erp',
      headline: 'Unified Campus Intelligence & Academic ERP',
      subheadline: 'Empowering institutions with streamlined operations and real-time student analytics.'
    }
  }
];

export const CATEGORIES = [
  'All',
  'Import & Export',
  'Photography & Creative Services',
  'Jewellery & E-commerce',
  'Restaurant & Food',
  'Job Aggregation Platform',
  'Enterprise Management System'
];
