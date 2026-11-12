/**
 * CENTRALIZED APPLICATION REGISTRY
 * 
 * Single source of truth for all 13 development fleet applications, window IDs,
 * aliases, spelling variations, ports, and execution metadata.
 */

import { APPLICATIONS } from './applications.js';

export const APPLICATION_REGISTRY = [
  {
    id: 'rsk-traders',
    name: 'RSK TRADERS',
    shortName: 'RSK Traders',
    windowId: 'rsk-traders',
    windowType: 'app',
    url: 'https://rsktraders.co.in',
    localUrl: 'http://127.0.0.1:5174',
    port: 5174,
    isLive: true,
    supportsIframe: true,
    category: 'Business Websites',
    accentColor: '#39D5C8',
    description: 'International global trade, logistics, and bulk commodity import-export platform.',
    techStack: ['HTML5', 'React', 'Node.js', 'PostgreSQL', 'Cloudflare'],
    aliases: [
      'rsk traders',
      'rsk-traders',
      'rsk',
      'rsk trader',
      'import export',
      'import and export',
      'trade',
      'trading',
      'logistics'
    ]
  },
  {
    id: 'trichy-preneurs',
    name: 'TRICHYPRENEURS',
    shortName: 'TrichyPreneurs',
    windowId: 'trichy-preneurs',
    windowType: 'app',
    url: 'https://trichypreneurs.com/#home',
    localUrl: 'http://127.0.0.1:5175',
    port: 5175,
    isLive: true,
    supportsIframe: true,
    category: 'Business Websites',
    accentColor: '#8B5CF6',
    description: 'Entrepreneurial community ecosystem connecting startup founders, builders, and local businesses in Trichy.',
    techStack: ['Node.js', 'Vite', 'React', 'Tailwind CSS', 'Cloudflare'],
    aliases: [
      'trichypreneurs',
      'trichy-preneurs',
      'trichy',
      'trichy preneurs',
      'trichy community',
      'entrepreneur',
      'entrepreneur community',
      'trichy website',
      'trichypreneurs.com'
    ]
  },
  {
    id: 'food-billing-software',
    name: 'Food Restaurant Billing OS',
    shortName: 'Billing OS',
    windowId: 'food-billing-software',
    windowType: 'app',
    url: '',
    localUrl: 'http://127.0.0.1:5176',
    port: 5176,
    isLive: false,
    supportsIframe: true,
    category: 'SaaS Platforms',
    accentColor: '#F43F5E',
    description: 'Point-of-sale restaurant billing software and table order management system with inventory tracking.',
    techStack: ['React', 'Vite', 'Tailwind CSS', 'Node.js'],
    aliases: [
      'food-billing-software',
      'food billing software',
      'billing software',
      'restaurant billing',
      'billing os',
      'restaurant',
      'restaurant website',
      'food website',
      'dining'
    ]
  },
  {
    id: 'college-erp',
    name: 'College ERP Suite',
    shortName: 'College ERP',
    windowId: 'college-erp',
    windowType: 'app',
    url: '',
    localUrl: 'http://127.0.0.1:5177',
    port: 5177,
    isLive: false,
    supportsIframe: true,
    category: 'Enterprise Applications',
    accentColor: '#10B981',
    description: 'Comprehensive campus management suite for fee reconciliation, student records, and financial accounting.',
    techStack: ['React', 'Vite', 'Python', 'Django REST', 'PostgreSQL'],
    aliases: [
      'college erp',
      'college-erp',
      'college',
      'erp',
      'campus erp',
      'campus management',
      'student erp'
    ]
  },
  {
    id: 'school-erp',
    name: 'School & Campus ERP',
    shortName: 'School ERP',
    windowId: 'school-erp',
    windowType: 'app',
    url: '',
    localUrl: 'http://127.0.0.1:5178',
    port: 5178,
    isLive: false,
    supportsIframe: true,
    category: 'Enterprise Applications',
    accentColor: '#3B82F6',
    description: 'Multi-tenant educational ERP managing student admissions, academic grading, and faculty operations.',
    techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Vite'],
    aliases: [
      'school erp',
      'school-erp',
      'school',
      'school portal',
      'campus school'
    ]
  },
  {
    id: 'kavin-fotography',
    name: 'Kavin Photography Studio',
    shortName: 'Photography',
    windowId: 'kavin-fotography',
    windowType: 'app',
    url: 'https://kavinphotography.vercel.app',
    localUrl: 'http://127.0.0.1:5179',
    port: 5179,
    isLive: true,
    supportsIframe: true,
    category: 'Web Applications',
    accentColor: '#8B7CFF',
    description: 'High-end visual storytelling, editorial photography studio, and client proofing portfolio.',
    techStack: ['React', 'Vite', 'Tailwind CSS', 'Framer Motion'],
    aliases: [
      'kavin-fotography',
      'kavin photography',
      'photography',
      'photography website',
      'photo',
      'photos',
      'camera',
      'photographer'
    ]
  },
  {
    id: 'peru-covering',
    name: 'Peru Covering Gold Jewellery',
    shortName: 'Gold Jewellery',
    windowId: 'peru-covering',
    windowType: 'app',
    url: '',
    localUrl: 'http://127.0.0.1:5180',
    port: 5180,
    isLive: false,
    supportsIframe: true,
    category: 'E-commerce',
    accentColor: '#F59E0B',
    description: 'Bespoke fine jewellery e-commerce boutique showcasing traditional gold covering collections.',
    techStack: ['React', 'Vite', 'Tailwind CSS'],
    aliases: [
      'peru-covering',
      'peru covering',
      'jewellery',
      'jewelry',
      'gold jewellery',
      'gold jewelry',
      'gold',
      'jewel',
      'ornaments'
    ]
  },
  {
    id: '3d-webniar-lead',
    name: '3D Webinar Lead Generator',
    shortName: '3D Webinar',
    windowId: '3d-webniar-lead',
    windowType: 'app',
    url: 'https://webniarlead.vercel.app',
    localUrl: 'http://127.0.0.1:5181',
    port: 5181,
    isLive: true,
    supportsIframe: true,
    category: 'SaaS Platforms',
    accentColor: '#EC4899',
    description: 'Interactive 3D webinar registration and lead capture platform with high-converting visual UI.',
    techStack: ['HTML5', 'Three.js', 'JavaScript', 'CSS3'],
    aliases: [
      '3d-webniar-lead',
      '3d webinar',
      'webinar lead',
      'webinar',
      '3d lead generator',
      '3d webinar lead'
    ]
  },
  {
    id: 'jobsphere',
    name: 'JobSphere Platform',
    shortName: 'JobSphere',
    windowId: 'jobsphere',
    windowType: 'app',
    url: '',
    localUrl: 'http://127.0.0.1:5182',
    port: 5182,
    isLive: false,
    supportsIframe: true,
    category: 'Job Aggregation Platform',
    accentColor: '#3B82F6',
    description: 'Next-generation tech job aggregation platform with AI candidate matching and salary insights.',
    techStack: ['React', 'Vite', 'Python', 'Django REST', 'PostgreSQL'],
    aliases: [
      'jobsphere',
      'job sphere',
      'jobspeher',
      'jobspher',
      'jobshere',
      'job seeker',
      'jobseeker',
      'job portal',
      'jobs'
    ]
  },
  {
    id: 'littlelemon',
    name: 'Little Lemon Dining',
    shortName: 'Little Lemon',
    windowId: 'littlelemon',
    windowType: 'app',
    url: '',
    localUrl: 'http://127.0.0.1:8004',
    port: 8004,
    isLive: false,
    supportsIframe: true,
    category: 'Web Applications',
    accentColor: '#FBBF24',
    description: 'Atmospheric Mediterranean dining portal featuring table reservations and curated menu preview.',
    techStack: ['HTML5', 'JavaScript', 'Django', 'CSS3'],
    aliases: [
      'littlelemon',
      'little lemon',
      'lemon',
      'little lemon restaurant'
    ]
  },
  {
    id: 'django-react-auth',
    name: 'Django React Authentication',
    shortName: 'Django Auth',
    windowId: 'django-react-auth',
    windowType: 'app',
    url: '',
    localUrl: 'http://127.0.0.1:5184',
    port: 5184,
    isLive: false,
    supportsIframe: true,
    category: 'Web Applications',
    accentColor: '#06B6D4',
    description: 'Full-stack authentication and user identity portal using Python Django REST API and React frontend.',
    techStack: ['Django REST', 'React', 'Vite', 'JWT'],
    aliases: [
      'django-react-auth',
      'django react auth',
      'django auth',
      'auth login',
      'react auth'
    ]
  },
  {
    id: 'django-basic',
    name: 'Django Architecture Lab',
    shortName: 'Django Lab',
    windowId: 'django-basic',
    windowType: 'app',
    url: '',
    localUrl: 'http://127.0.0.1:8005',
    port: 8005,
    isLive: false,
    supportsIframe: true,
    category: 'Personal Projects',
    accentColor: '#10B981',
    description: 'Architectural exploration of Django models, views, templates, and RESTful routing patterns.',
    techStack: ['Python', 'Django', 'SQLite', 'REST API'],
    aliases: [
      'django-basic',
      'django basic',
      'django lab',
      'python django lab'
    ]
  },
  {
    id: 'demo-workspace',
    name: 'Experimental Demo Workspace',
    shortName: 'Demo Workspace',
    windowId: 'demo-workspace',
    windowType: 'app',
    url: '',
    localUrl: 'http://127.0.0.1:5185',
    port: 5185,
    isLive: false,
    supportsIframe: true,
    category: 'Personal Projects',
    accentColor: '#6B7280',
    description: 'Rapid prototyping and experimental codebase for testing emerging full-stack web capabilities.',
    techStack: ['React', 'JavaScript', 'Vite', 'Tailwind CSS'],
    aliases: [
      'demo-workspace',
      'demo workspace',
      'demo',
      'wacrm',
      'experimental'
    ]
  }
];

// Helper alias mappings for legacy window IDs
export const LEGACY_WINDOW_MAPPINGS = {
  'photography': 'kavin-fotography',
  'jewellery': 'peru-covering',
  'restaurant': 'food-billing-software'
};

const normalizeText = (text = '') => {
  return text
    .toLowerCase()
    .replace(/[_-]/g, ' ')
    .replace(/[^\w\s]/gi, '')
    .trim()
    .replace(/\s+/g, ' ');
};

export const resolveApplication = (query = '') => {
  if (!query || typeof query !== 'string') return null;

  const rawClean = query.trim().toLowerCase();
  const normalized = normalizeText(query);
  const compact = normalized.replace(/\s+/g, '');

  // Check legacy mapping first
  if (LEGACY_WINDOW_MAPPINGS[rawClean]) {
    const targetId = LEGACY_WINDOW_MAPPINGS[rawClean];
    const found = APPLICATION_REGISTRY.find(a => a.id === targetId);
    if (found) return found;
  }

  // 1. Direct ID match
  const directId = APPLICATION_REGISTRY.find(app => 
    app.id === rawClean || app.id === normalized || app.windowId === rawClean
  );
  if (directId) return directId;

  // 2. Direct Name / ShortName exact match
  const directName = APPLICATION_REGISTRY.find(app => 
    app.name.toLowerCase() === rawClean || 
    app.shortName.toLowerCase() === rawClean ||
    normalizeText(app.name) === normalized ||
    normalizeText(app.shortName) === normalized
  );
  if (directName) return directName;

  // 3. Exact alias match
  for (const app of APPLICATION_REGISTRY) {
    for (const alias of app.aliases) {
      const normAlias = normalizeText(alias);
      if (normalized === normAlias || compact === normAlias.replace(/\s+/g, '')) {
        return app;
      }
    }
  }

  // 4. Substring / phrase match in normalized text
  const sortedAliases = [];
  for (const app of APPLICATION_REGISTRY) {
    for (const alias of app.aliases) {
      sortedAliases.push({ app, alias: normalizeText(alias), len: alias.length });
    }
  }
  sortedAliases.sort((a, b) => b.len - a.len);

  for (const item of sortedAliases) {
    if (normalized.includes(item.alias) || compact.includes(item.alias.replace(/\s+/g, ''))) {
      return item.app;
    }
  }

  return null;
};
