/**
 * CENTRALIZED APPLICATION REGISTRY
 * 
 * Single source of truth for all flagship applications, window IDs,
 * aliases, spelling variations, and live URL definitions.
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
    isLive: true,
    supportsIframe: true,
    category: 'Import & Export',
    accentColor: '#39D5C8',
    description: 'International global trade, logistics, and bulk commodity import-export platform.',
    techStack: ['React', 'Tailwind CSS', 'Node.js', 'PostgreSQL', 'Cloudflare'],
    aliases: [
      'rsk traders',
      'rsk-traders',
      'rsk',
      'rsk trader',
      'import export',
      'import and export',
      'import export website',
      'trade',
      'trading',
      'logistics',
      'bulk trade'
    ]
  },
  {
    id: 'trichy-preneurs',
    name: 'TRICHYPRENEURS',
    shortName: 'TrichyPreneurs',
    windowId: 'trichy-preneurs',
    windowType: 'app',
    url: 'https://trichypreneurs.com/#home',
    isLive: true,
    supportsIframe: true,
    category: 'Entrepreneur Community',
    accentColor: '#8B5CF6',
    description: 'Entrepreneurial community ecosystem connecting startup founders, builders, and local businesses in Trichy.',
    techStack: ['React', 'JavaScript', 'Tailwind CSS', 'Vite', 'Cloudflare'],
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
    id: 'jobsphere',
    name: 'JOBSPHERE',
    shortName: 'JobSphere',
    windowId: 'jobsphere',
    windowType: 'app',
    url: '', // No live URL deployed yet; opens project info window
    isLive: false,
    supportsIframe: false,
    category: 'Job Aggregation Platform',
    accentColor: '#3B82F6',
    description: 'Next-generation tech job aggregation platform with AI candidate matching and salary insights.',
    techStack: ['React', 'Python', 'Django REST', 'PostgreSQL', 'Tailwind CSS'],
    aliases: [
      'jobsphere',
      'job sphere',
      'jobspeher', // common misspelling
      'jobspher',  // common misspelling
      'jobshere',  // common misspelling
      'job seeker',
      'jobseeker',
      'job portal',
      'job aggregation',
      'jobs portal',
      'jobs'
    ]
  },
  {
    id: 'photography',
    name: 'PHOTOGRAPHY WEBSITE',
    shortName: 'Photography',
    windowId: 'photography',
    windowType: 'app',
    url: '',
    isLive: false,
    supportsIframe: false,
    category: 'Photography & Creative Services',
    accentColor: '#8B7CFF',
    description: 'High-end visual storytelling, editorial photography studio, and client booking suite.',
    techStack: ['Next.js', 'Framer Motion', 'Tailwind CSS', 'AWS S3', 'Stripe'],
    aliases: [
      'photography',
      'photography website',
      'photo',
      'photos',
      'photo website',
      'kavin photography',
      'kavin-fotography',
      'camera',
      'creative studio',
      'photographer'
    ]
  },
  {
    id: 'jewellery',
    name: 'GOLD JEWELLERY WEBSITE',
    shortName: 'Gold Jewellery',
    windowId: 'jewellery',
    windowType: 'app',
    url: '',
    isLive: false,
    supportsIframe: false,
    category: 'Jewellery & E-commerce',
    accentColor: '#F59E0B',
    description: 'Bespoke fine jewellery e-commerce platform with real-time bullion rate integration.',
    techStack: ['React', 'Django', 'PostgreSQL', 'Tailwind CSS', 'Razorpay'],
    aliases: [
      'jewellery',
      'jewelry',
      'gold jewellery',
      'gold jewelry',
      'jewellery website',
      'jewelry website',
      'gold jewellery website',
      'peru covering',
      'gold',
      'jewel',
      'jewels',
      'ornaments'
    ]
  },
  {
    id: 'restaurant',
    name: 'RESTAURANT WEBSITE',
    shortName: 'Restaurant',
    windowId: 'restaurant',
    windowType: 'app',
    url: '',
    isLive: false,
    supportsIframe: false,
    category: 'Restaurant & Food',
    accentColor: '#F43F5E',
    description: 'Gourmet dining portal featuring interactive digital menus, table reservations, and takeaway.',
    techStack: ['React', 'Tailwind CSS', 'Node.js', 'MongoDB', 'Socket.io'],
    aliases: [
      'restaurant',
      'restaurant website',
      'food',
      'food website',
      'dining',
      'food billing',
      'food billing software',
      'restaurant billing',
      'menu',
      'table booking'
    ]
  },
  {
    id: 'college-erp',
    name: 'COLLEGE ERP',
    shortName: 'College ERP',
    windowId: 'college-erp',
    windowType: 'app',
    url: '',
    isLive: false,
    supportsIframe: false,
    category: 'Enterprise Management System',
    accentColor: '#10B981',
    description: 'Comprehensive campus management suite for academic records, fees, faculty, and examinations.',
    techStack: ['React', 'Python', 'Django', 'PostgreSQL', 'Bootstrap', 'Redis'],
    aliases: [
      'college erp',
      'college-erp',
      'college',
      'erp',
      'school erp',
      'campus erp',
      'campus management',
      'academic erp',
      'student erp',
      'erp suite'
    ]
  }
];

/**
 * Fuzzy normalization: converts text to lowercase alphanumeric without extra spaces or symbols
 */
const normalizeText = (text = '') => {
  return text
    .toLowerCase()
    .replace(/[_-]/g, ' ')
    .replace(/[^\w\s]/gi, '')
    .trim()
    .replace(/\s+/g, ' ');
};

/**
 * Resolve an application from user text with typo tolerance and alias recognition.
 * Never invents an application that does not exist in APPLICATION_REGISTRY.
 * 
 * @param {string} query - Raw user query string
 * @returns {Object|null} Matching application definition or null
 */
export const resolveApplication = (query = '') => {
  if (!query || typeof query !== 'string') return null;

  const rawClean = query.trim().toLowerCase();
  const normalized = normalizeText(query);
  const compact = normalized.replace(/\s+/g, '');

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
  // Prioritize specific multi-word matches first
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

  // 5. Explicit typo handler for JobSphere common variations
  const jobSphereTypos = ['jobspeher', 'jobspher', 'jobshere', 'jobsphre', 'jobspheree', 'jobshpere'];
  if (jobSphereTypos.some(typo => normalized.includes(typo) || compact.includes(typo))) {
    return APPLICATION_REGISTRY.find(a => a.id === 'jobsphere');
  }

  return null;
};
