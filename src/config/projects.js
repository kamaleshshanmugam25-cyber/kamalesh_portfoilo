/**
 * CENTRALIZED GITHUB & PROJECT CONFIGURATION
 * 
 * GitHub Profile: https://github.com/kamaleshshanmugam25-cyber
 * 
 * Custom metadata overrides: map live URLs, custom titles, accent colors,
 * and mark which repositories appear as featured apps on the desktop.
 */

export const GITHUB_USERNAME = 'kamaleshshanmugam25-cyber';
export const GITHUB_PROFILE_URL = 'https://github.com/kamaleshshanmugam25-cyber';

export const PROJECT_CATEGORIES = [
  'All',
  'Business Websites',
  'E-commerce',
  'Enterprise Applications',
  'SaaS Platforms',
  'Web Applications',
  'Personal Projects'
];

/**
 * Custom overrides for specific repositories.
 * Live URLs, featured status, custom titles, and icons are mapped here.
 */
export const REPO_OVERRIDES = {
  'RSK-Traders': {
    id: 'rsk-traders',
    displayName: 'RSK TRADERS',
    category: 'Business Websites',
    liveUrl: 'https://rsktraders.co.in',
    featured: true,
    accentColor: '#39D5C8',
    gradient: 'from-cyan-500/20 via-teal-500/10 to-transparent',
    iconGradient: 'from-emerald-400 to-teal-500',
    description: 'International global trade, logistics, and bulk commodity import-export enterprise platform.'
  },
  'Kavin-fotography': {
    id: 'kavin-fotography',
    displayName: 'Kavin Photography',
    category: 'Web Applications',
    liveUrl: 'https://kavinphotography.vercel.app',
    featured: true,
    accentColor: '#8B7CFF',
    gradient: 'from-purple-500/20 via-indigo-500/10 to-transparent',
    iconGradient: 'from-purple-400 to-indigo-600',
    description: 'High-end visual storytelling, editorial photography portfolio, and client showcase studio.'
  },
  'peru-covering': {
    id: 'peru-covering',
    displayName: 'Peru Covering Jewellery',
    category: 'E-commerce',
    liveUrl: '',
    featured: true,
    accentColor: '#F59E0B',
    gradient: 'from-amber-500/20 via-yellow-500/10 to-transparent',
    iconGradient: 'from-amber-300 via-yellow-500 to-amber-600',
    description: 'Fine gold covering and jewellery e-commerce catalog featuring traditional craftsmanship.'
  },
  'Food-billing-software': {
    id: 'food-billing-software',
    displayName: 'Food Restaurant Billing OS',
    category: 'SaaS Platforms',
    liveUrl: '',
    featured: true,
    accentColor: '#F43F5E',
    gradient: 'from-rose-500/20 via-red-500/10 to-transparent',
    iconGradient: 'from-rose-400 to-red-600',
    description: 'Point-of-sale billing software and table order management system built for food restaurants.'
  },
  'College-Erp': {
    id: 'college-erp',
    displayName: 'College ERP Suite',
    category: 'Enterprise Applications',
    liveUrl: '',
    featured: true,
    accentColor: '#10B981',
    gradient: 'from-emerald-500/20 via-teal-500/10 to-transparent',
    iconGradient: 'from-emerald-400 to-green-600',
    description: 'Comprehensive campus management suite for fee reconciliation, financial auditing, and student records.'
  },
  'school-ERP': {
    id: 'school-erp',
    displayName: 'School & Campus ERP',
    category: 'Enterprise Applications',
    liveUrl: '',
    featured: true,
    accentColor: '#3B82F6',
    gradient: 'from-blue-500/20 via-sky-500/10 to-transparent',
    iconGradient: 'from-blue-400 to-cyan-500',
    description: 'Multi-tenant educational ERP managing student admissions, grading, faculty schedules, and operations.'
  },
  '3D-WEBNIAR-LEAD': {
    id: '3d-webniar-lead',
    displayName: '3D Webinar Lead Generator',
    category: 'SaaS Platforms',
    liveUrl: 'https://webniarlead.vercel.app',
    featured: false,
    accentColor: '#EC4899',
    gradient: 'from-pink-500/20 via-purple-500/10 to-transparent',
    iconGradient: 'from-pink-400 to-rose-500',
    description: 'Interactive 3D webinar registration and lead capture platform with high-converting visual UI.'
  },
  'TrichyPreneurs': {
    id: 'trichy-preneurs',
    displayName: 'TrichyPreneurs Community',
    category: 'Business Websites',
    liveUrl: 'https://trichypreneurs.com/#home',
    featured: true,
    accentColor: '#8B5CF6',
    gradient: 'from-violet-500/20 via-indigo-500/10 to-transparent',
    iconGradient: 'from-violet-400 to-indigo-600',
    description: 'Entrepreneurial community ecosystem connecting founders, builders, and local business networks in Trichy.'
  },
  'Littlelemon': {
    id: 'littlelemon',
    displayName: 'Little Lemon Dining',
    category: 'Web Applications',
    liveUrl: '',
    featured: false,
    accentColor: '#FBBF24',
    gradient: 'from-yellow-500/20 via-amber-500/10 to-transparent',
    iconGradient: 'from-yellow-400 to-amber-600',
    description: 'Django restaurant application featuring reserve table workflows and Mediterranean menu curation.'
  },
  'django-react-auth-Login-Page-': {
    id: 'django-react-auth',
    displayName: 'Django React Authentication',
    category: 'Web Applications',
    liveUrl: '',
    featured: false,
    accentColor: '#06B6D4',
    gradient: 'from-cyan-500/20 via-sky-500/10 to-transparent',
    iconGradient: 'from-cyan-400 to-blue-500',
    description: 'Full-stack authentication portal using Python Django REST API and modern React frontend.'
  },
  'django_basic': {
    id: 'django-basic',
    displayName: 'Django Architecture Lab',
    category: 'Personal Projects',
    liveUrl: '',
    featured: false,
    accentColor: '#10B981',
    gradient: 'from-emerald-500/20 via-teal-500/10 to-transparent',
    iconGradient: 'from-emerald-400 to-green-600',
    description: 'Architectural exploration of Django models, views, templates, and RESTful routing patterns.'
  },
  'demo': {
    id: 'demo-workspace',
    displayName: 'Experimental Demo Workspace',
    category: 'Personal Projects',
    liveUrl: '',
    featured: false,
    accentColor: '#6B7280',
    gradient: 'from-gray-500/20 via-slate-500/10 to-transparent',
    iconGradient: 'from-gray-400 to-slate-600',
    description: 'Rapid prototyping and experimental codebase for testing emerging web capabilities.'
  },
  'kamalesh': {
    id: 'kamalesh-profile',
    displayName: 'Kamalesh GitHub Profile',
    category: 'Personal Projects',
    liveUrl: `https://github.com/${GITHUB_USERNAME}`,
    featured: false,
    accentColor: '#8B7CFF',
    gradient: 'from-purple-500/20 via-indigo-500/10 to-transparent',
    iconGradient: 'from-purple-400 to-indigo-600',
    description: 'Official developer GitHub configuration, bio repository, and technical ecosystem badges.'
  }
};

/**
 * Built-in static fallback snapshot of all 13 repositories.
 * Used if GitHub unauthenticated rate limit is reached or when offline.
 */
export const STATIC_REPOS_SNAPSHOT = [
  {
    id: 1453456998,
    name: 'peru-covering',
    full_name: 'kamaleshshanmugam25-cyber/peru-covering',
    html_url: 'https://github.com/kamaleshshanmugam25-cyber/peru-covering',
    description: 'i made a website for gold covering shop',
    language: 'JavaScript',
    homepage: '',
    stargazers_count: 0,
    forks_count: 0,
    topics: ['ecommerce', 'jewellery', 'shop', 'gold-covering'],
    updated_at: '2026-11-11T03:04:04Z',
    default_branch: 'main'
  },
  {
    id: 1453453880,
    name: 'school-ERP',
    full_name: 'kamaleshshanmugam25-cyber/school-ERP',
    html_url: 'https://github.com/kamaleshshanmugam25-cyber/school-ERP',
    description: 'ERP for School and college',
    language: 'TypeScript',
    homepage: '',
    stargazers_count: 0,
    forks_count: 0,
    topics: ['erp', 'school', 'college', 'management-system'],
    updated_at: '2026-11-11T02:59:53Z',
    default_branch: 'main'
  },
  {
    id: 1453449015,
    name: 'Food-billing-software',
    full_name: 'kamaleshshanmugam25-cyber/Food-billing-software',
    html_url: 'https://github.com/kamaleshshanmugam25-cyber/Food-billing-software',
    description: 'BIlling software build for food resturant',
    language: 'JavaScript',
    homepage: '',
    stargazers_count: 0,
    forks_count: 0,
    topics: ['billing', 'pos', 'restaurant', 'food'],
    updated_at: '2026-11-11T02:54:00Z',
    default_branch: 'main'
  },
  {
    id: 1451982736,
    name: 'RSK-Traders',
    full_name: 'kamaleshshanmugam25-cyber/RSK-Traders',
    html_url: 'https://github.com/kamaleshshanmugam25-cyber/RSK-Traders',
    description: 'Import and Export Company',
    language: 'HTML',
    homepage: 'https://rsktraders.co.in',
    stargazers_count: 0,
    forks_count: 0,
    topics: ['import-export', 'logistics', 'trade'],
    updated_at: '2026-11-09T04:19:49Z',
    default_branch: 'main'
  },
  {
    id: 1445473841,
    name: 'College-Erp',
    full_name: 'kamaleshshanmugam25-cyber/College-Erp',
    html_url: 'https://github.com/kamaleshshanmugam25-cyber/College-Erp',
    description: 'Fee management and Financial management',
    language: 'Python',
    homepage: '',
    stargazers_count: 0,
    forks_count: 0,
    topics: ['college-erp', 'fee-management', 'django'],
    updated_at: '2026-10-29T12:14:34Z',
    default_branch: 'main'
  },
  {
    id: 1444634289,
    name: 'Kavin-fotography',
    full_name: 'kamaleshshanmugam25-cyber/Kavin-fotography',
    html_url: 'https://github.com/kamaleshshanmugam25-cyber/Kavin-fotography',
    description: 'Professional visual photography studio and client portfolio',
    language: 'JavaScript',
    homepage: 'https://kavinphotography.vercel.app',
    stargazers_count: 0,
    forks_count: 0,
    topics: ['photography', 'portfolio', 'gallery'],
    updated_at: '2026-10-28T03:55:50Z',
    default_branch: 'main'
  },
  {
    id: 1442118374,
    name: 'django_basic',
    full_name: 'kamaleshshanmugam25-cyber/django_basic',
    html_url: 'https://github.com/kamaleshshanmugam25-cyber/django_basic',
    description: 'Learning Django from youtube',
    language: 'Python',
    homepage: '',
    stargazers_count: 0,
    forks_count: 0,
    topics: ['django', 'python', 'backend'],
    updated_at: '2026-10-23T09:52:20Z',
    default_branch: 'main'
  },
  {
    id: 1428584850,
    name: '3D-WEBNIAR-LEAD',
    full_name: 'kamaleshshanmugam25-cyber/3D-WEBNIAR-LEAD',
    html_url: 'https://github.com/kamaleshshanmugam25-cyber/3D-WEBNIAR-LEAD',
    description: '3D interactive webinar lead capture and registration platform',
    language: 'HTML',
    homepage: 'https://webniarlead.vercel.app',
    stargazers_count: 0,
    forks_count: 0,
    topics: ['webinar', 'lead-generation', '3d-web'],
    updated_at: '2026-10-01T06:39:33Z',
    default_branch: 'main'
  },
  {
    id: 1428054900,
    name: 'Littlelemon',
    full_name: 'kamaleshshanmugam25-cyber/Littlelemon',
    html_url: 'https://github.com/kamaleshshanmugam25-cyber/Littlelemon',
    description: 'It is littlelemon project of the django',
    language: 'Python',
    homepage: '',
    stargazers_count: 0,
    forks_count: 0,
    topics: ['django', 'restaurant', 'booking'],
    updated_at: '2026-09-30T09:49:21Z',
    default_branch: 'main'
  },
  {
    id: 1423851720,
    name: 'TrichyPreneurs',
    full_name: 'kamaleshshanmugam25-cyber/TrichyPreneurs',
    html_url: 'https://github.com/kamaleshshanmugam25-cyber/TrichyPreneurs',
    description: 'It is an Entrepreneur community connecting founders and builders across Trichy',
    language: 'JavaScript',
    homepage: 'https://trichypreneurs.com/#home',
    stargazers_count: 0,
    forks_count: 0,
    topics: ['community', 'entrepreneurship', 'networking'],
    updated_at: '2026-09-23T02:57:46Z',
    default_branch: 'main'
  },
  {
    id: 1423455132,
    name: 'django-react-auth-Login-Page-',
    full_name: 'kamaleshshanmugam25-cyber/django-react-auth-Login-Page-',
    html_url: 'https://github.com/kamaleshshanmugam25-cyber/django-react-auth-Login-Page-',
    description: 'Using Python Creating Login page',
    language: 'Python',
    homepage: '',
    stargazers_count: 0,
    forks_count: 0,
    topics: ['django', 'react', 'authentication'],
    updated_at: '2026-09-22T12:27:16Z',
    default_branch: 'main'
  },
  {
    id: 1415951662,
    name: 'demo',
    full_name: 'kamaleshshanmugam25-cyber/demo',
    html_url: 'https://github.com/kamaleshshanmugam25-cyber/demo',
    description: 'Experimental testing workspace',
    language: 'JavaScript',
    homepage: '',
    stargazers_count: 0,
    forks_count: 0,
    topics: ['demo'],
    updated_at: '2026-09-09T03:06:55Z',
    default_branch: 'main'
  },
  {
    id: 1391741120,
    name: 'kamalesh',
    full_name: 'kamaleshshanmugam25-cyber/kamalesh',
    html_url: 'https://github.com/kamaleshshanmugam25-cyber/kamalesh',
    description: 'Special repository for GitHub user profile',
    language: 'Markdown',
    homepage: '',
    stargazers_count: 0,
    forks_count: 0,
    topics: ['github-profile'],
    updated_at: '2026-07-14T00:59:50Z',
    default_branch: 'main'
  }
];
