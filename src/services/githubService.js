/**
 * GITHUB REST API SERVICE
 * Handles fetching public repositories, intelligent categorization,
 * localStorage caching with TTL, and rate-limit fallback.
 */

import { GITHUB_USERNAME, REPO_OVERRIDES, STATIC_REPOS_SNAPSHOT } from '../config/projects';

const CACHE_KEY = `kamverse_github_repos_${GITHUB_USERNAME}`;
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

/**
 * Intelligently classify a repository into one of the 6 core categories.
 */
export const classifyCategory = (repo) => {
  const override = REPO_OVERRIDES[repo.name];
  if (override && override.category) {
    return override.category;
  }

  const textToScan = `${repo.name} ${repo.description || ''} ${(repo.topics || []).join(' ')}`.toLowerCase();

  if (/import|export|trade|trader|community|network|prenuer|business/.test(textToScan)) {
    return 'Business Websites';
  }
  if (/jewel|gold|covering|shop|store|ecommerce|e-commerce|cart|buy|product/.test(textToScan)) {
    return 'E-commerce';
  }
  if (/erp|school|college|campus|financial|fee|institution|student|faculty/.test(textToScan)) {
    return 'Enterprise Applications';
  }
  if (/billing|software|saas|pos|invoice|lead|webinar|tool|crm/.test(textToScan)) {
    return 'SaaS Platforms';
  }
  if (/demo|basic|learn|tutorial|kamalesh|portfolio-config/.test(textToScan)) {
    return 'Personal Projects';
  }
  return 'Web Applications';
};

/**
 * Format and enrich a raw GitHub repository item with overrides and computed metadata.
 */
export const formatRepository = (rawRepo) => {
  const override = REPO_OVERRIDES[rawRepo.name] || {};
  const category = classifyCategory(rawRepo);

  return {
    ...rawRepo,
    id: override.id || `gh-${rawRepo.id || rawRepo.name}`,
    displayName: override.displayName || rawRepo.name.replace(/[-_]/g, ' '),
    category,
    featured: override.featured ?? (category !== 'Personal Projects'),
    liveUrl: override.liveUrl || rawRepo.homepage || '',
    accentColor: override.accentColor || '#39D5C8',
    gradient: override.gradient || 'from-teal-500/20 via-cyan-500/10 to-transparent',
    iconGradient: override.iconGradient || 'from-teal-400 to-cyan-500',
    description: override.description || rawRepo.description || 'Modern software application crafted by Kamalesh.',
    stars: rawRepo.stargazers_count || 0,
    forks: rawRepo.forks_count || 0,
    language: rawRepo.language || 'Code',
    updatedAt: rawRepo.updated_at || new Date().toISOString(),
    githubUrl: rawRepo.html_url || `https://github.com/${GITHUB_USERNAME}/${rawRepo.name}`,
    defaultBranch: rawRepo.default_branch || 'main',
    topics: rawRepo.topics || []
  };
};

/**
 * Fetch all public repositories for the configured username.
 * Supports localStorage caching and rate-limit fallback.
 */
export const fetchAllRepositories = async (forceRefresh = false) => {
  // Check localStorage cache unless forceRefresh is true
  if (!forceRefresh) {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_TTL_MS && Array.isArray(data) && data.length > 0) {
          return {
            repositories: data,
            isFromCache: true,
            lastUpdated: new Date(timestamp).toLocaleTimeString()
          };
        }
      }
    } catch (e) {
      console.warn('Error reading repository cache:', e);
    }
  }

  try {
    const res = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (!res.ok) {
      throw new Error(`GitHub API returned status ${res.status}`);
    }

    const rawRepos = await res.json();
    if (!Array.isArray(rawRepos)) {
      throw new Error('Invalid response structure from GitHub API');
    }

    const formattedRepos = rawRepos.map(formatRepository);

    // Save to cache
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        data: formattedRepos,
        timestamp: Date.now()
      }));
    } catch (e) {
      console.warn('Error writing repository cache:', e);
    }

    return {
      repositories: formattedRepos,
      isFromCache: false,
      lastUpdated: new Date().toLocaleTimeString()
    };
  } catch (error) {
    console.warn('GitHub API fetch failed or rate-limited; utilizing static snapshot:', error.message);
    const fallbackRepos = STATIC_REPOS_SNAPSHOT.map(formatRepository);
    return {
      repositories: fallbackRepos,
      isFromCache: true,
      isFallback: true,
      lastUpdated: 'Snapshot'
    };
  }
};

/**
 * Fetch README content for a specific repository.
 */
export const fetchRepoReadme = async (repoName) => {
  const cacheKey = `kamverse_readme_${repoName}`;
  try {
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) return cached;
  } catch (_) {}

  try {
    const res = await fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${repoName}/readme`, {
      headers: { 'Accept': 'application/vnd.github.v3+json' }
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    if (data.content && data.encoding === 'base64') {
      // Decode UTF-8 base64 properly
      const decoded = decodeURIComponent(
        atob(data.content.replace(/\s/g, ''))
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      try {
        sessionStorage.setItem(cacheKey, decoded);
      } catch (_) {}
      return decoded;
    }
    return null;
  } catch (err) {
    console.warn(`Could not fetch README for ${repoName}:`, err);
    return null;
  }
};

/**
 * Fetch programming languages distribution for a repository.
 */
export const fetchRepoLanguages = async (repoName) => {
  const cacheKey = `kamverse_languages_${repoName}`;
  try {
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) return JSON.parse(cached);
  } catch (_) {}

  try {
    const res = await fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${repoName}/languages`);
    if (!res.ok) return null;

    const data = await res.json();
    const totalBytes = Object.values(data).reduce((acc, bytes) => acc + bytes, 0);

    const breakdown = Object.entries(data).map(([lang, bytes]) => ({
      name: lang,
      bytes,
      percentage: totalBytes > 0 ? ((bytes / totalBytes) * 100).toFixed(1) : 0
    }));

    try {
      sessionStorage.setItem(cacheKey, JSON.stringify(breakdown));
    } catch (_) {}

    return breakdown;
  } catch (err) {
    console.warn(`Could not fetch languages for ${repoName}:`, err);
    return null;
  }
};
