/**
 * LIVE GITHUB ACTIVITY SERVICE
 * 
 * Fetches, normalizes, and caches real-time GitHub activity data for kamaleshshanmugam25-cyber:
 * - Public User Profile & Overall Metrics
 * - Public Repositories (searchable, filterable, sortable)
 * - Public Events Stream (Pushes, branch creates, releases)
 * - Detailed Commit History (messages, short SHA, author, timestamp, URLs)
 * - Real 52-week Contribution Heatmap & Monthly Activity Totals
 * 
 * Includes 5-minute cache TTL and rate-limit safety.
 */

import { GITHUB_USERNAME } from '../config/projects';

const CACHE_KEY = `kamverse_gh_activity_${GITHUB_USERNAME}`;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Format relative date (e.g., "2 hours ago", "yesterday")
 */
export const formatRelativeTime = (isoString) => {
  if (!isoString) return 'recently';
  try {
    const date = new Date(isoString);
    const now = new Date();
    const diffSec = Math.floor((now - date) / 1000);

    if (diffSec < 60) return 'just now';
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
    if (diffSec < 604800) return `${Math.floor(diffSec / 86400)}d ago`;
    if (diffSec < 2592000) return `${Math.floor(diffSec / 604800)}w ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch (_) {
    return 'recently';
  }
};

/**
 * Generate 52-week contribution heatmap matrix based on real event and commit timestamps
 */
const buildContributionMatrix = (dateCountMap) => {
  const weeks = [];
  const today = new Date();
  
  // Calculate start date: 52 weeks ago, aligned to Sunday
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - (52 * 7) + (7 - today.getDay()));

  let currentDate = new Date(startDate);
  let totalAnnualContributions = 0;

  for (let w = 0; w < 52; w++) {
    const days = [];
    for (let d = 0; d < 7; d++) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const count = dateCountMap[dateStr] || 0;
      totalAnnualContributions += count;

      let level = 0;
      if (count > 0 && count <= 2) level = 1;
      else if (count >= 3 && count <= 5) level = 2;
      else if (count >= 6) level = 3;

      days.push({
        date: dateStr,
        count,
        level,
        dayOfWeek: d,
        month: currentDate.toLocaleString('default', { month: 'short' })
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }
    weeks.push({ weekIndex: w, days });
  }

  // Monthly contribution summary
  const monthlyMap = {};
  Object.entries(dateCountMap).forEach(([dateStr, count]) => {
    try {
      const d = new Date(dateStr);
      const key = d.toLocaleString('default', { month: 'short', year: 'numeric' });
      monthlyMap[key] = (monthlyMap[key] || 0) + count;
    } catch (_) {}
  });

  const monthlySummary = Object.entries(monthlyMap)
    .map(([month, count]) => ({ month, count }))
    .slice(-6); // last 6 active months

  return { weeks, totalAnnualContributions, monthlySummary };
};

/**
 * Fetch all GitHub Activity Data
 * 
 * @param {boolean} forceRefresh - Ignore cache and fetch live from API
 * @returns {Promise<Object>} Aggregated activity dataset
 */
export const fetchGitHubActivityData = async (forceRefresh = false) => {
  // 1. Check LocalStorage cache
  if (!forceRefresh) {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_TTL_MS && data && data.repos?.length > 0) {
          return {
            ...data,
            isFromCache: true,
            lastSynced: new Date(timestamp).toLocaleTimeString()
          };
        }
      }
    } catch (e) {
      console.warn('Error reading GitHub activity cache:', e);
    }
  }

  const headers = {
    'Accept': 'application/vnd.github.v3+json'
  };

  try {
    // 2. Fetch User Profile, Repositories, and Public Events in parallel
    const [profileRes, reposRes, eventsRes] = await Promise.all([
      fetch(`https://api.github.com/users/${GITHUB_USERNAME}`, { headers }),
      fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`, { headers }),
      fetch(`https://api.github.com/users/${GITHUB_USERNAME}/events/public`, { headers })
    ]);

    const isRateLimited = profileRes.status === 403 || reposRes.status === 403 || eventsRes.status === 403;

    if (isRateLimited) {
      throw new Error('GitHub API rate limit reached (60 requests/hour unauthenticated).');
    }

    const [rawProfile, rawRepos, rawEvents] = await Promise.all([
      profileRes.ok ? profileRes.json() : {},
      reposRes.ok ? reposRes.json() : [],
      eventsRes.ok ? eventsRes.json() : []
    ]);

    const safeRepos = Array.isArray(rawRepos) ? rawRepos : [];
    const safeEvents = Array.isArray(rawEvents) ? rawEvents : [];

    // Date frequency map for contribution heatmap
    const dateCountMap = {};

    // 3. Process Public Events
    const normalizedEvents = safeEvents.map((evt) => {
      const dateStr = evt.created_at ? evt.created_at.split('T')[0] : '';
      if (dateStr) {
        dateCountMap[dateStr] = (dateCountMap[dateStr] || 0) + 1;
      }

      let eventSummary = 'Public repository activity';
      let targetUrl = `https://github.com/${evt.repo?.name}`;

      if (evt.type === 'PushEvent') {
        const commitCount = evt.payload?.commits?.length || 1;
        eventSummary = `Pushed ${commitCount} ${commitCount === 1 ? 'commit' : 'commits'} to ${evt.payload?.ref?.replace('refs/heads/', '') || 'main'}`;
        if (evt.payload?.head) {
          targetUrl = `https://github.com/${evt.repo?.name}/commit/${evt.payload.head}`;
        }
      } else if (evt.type === 'CreateEvent') {
        eventSummary = `Created ${evt.payload?.ref_type || 'repository'} ${evt.payload?.ref || evt.repo?.name}`;
      } else if (evt.type === 'WatchEvent') {
        eventSummary = `Starred repository`;
      } else if (evt.type === 'ForkEvent') {
        eventSummary = `Forked repository`;
      }

      return {
        id: evt.id,
        type: evt.type,
        repoName: evt.repo?.name?.replace(`${GITHUB_USERNAME}/`, '') || evt.repo?.name,
        fullRepoName: evt.repo?.name,
        author: evt.actor?.login || GITHUB_USERNAME,
        avatarUrl: evt.actor?.avatar_url || rawProfile?.avatar_url,
        summary: eventSummary,
        createdAt: evt.created_at,
        timeAgo: formatRelativeTime(evt.created_at),
        targetUrl
      };
    });

    // 4. Fetch Commits from the top active repositories (concurrently with limit)
    const activeRepos = safeRepos
      .filter(r => !r.fork && r.size > 0)
      .slice(0, 4); // Fetch from top 4 active repos to stay well within rate limits

    let commitList = [];

    // First collect commits embedded directly inside PushEvents
    safeEvents.forEach(evt => {
      if (evt.type === 'PushEvent' && Array.isArray(evt.payload?.commits)) {
        evt.payload.commits.forEach(c => {
          const cDate = evt.created_at;
          const dateStr = cDate ? cDate.split('T')[0] : '';
          if (dateStr) {
            dateCountMap[dateStr] = (dateCountMap[dateStr] || 0) + 1;
          }
          commitList.push({
            sha: (c.sha || '').slice(0, 7),
            fullSha: c.sha,
            message: c.message || 'Updated codebase',
            author: c.author?.name || evt.actor?.login || GITHUB_USERNAME,
            date: cDate,
            timeAgo: formatRelativeTime(cDate),
            repoName: evt.repo?.name?.replace(`${GITHUB_USERNAME}/`, '') || evt.repo?.name,
            htmlUrl: `https://github.com/${evt.repo?.name}/commit/${c.sha}`
          });
        });
      }
    });

    // Next fetch actual commits endpoint from top 3 repos to guarantee recent commit history
    try {
      const commitPromises = activeRepos.slice(0, 3).map(async (repo) => {
        try {
          const res = await fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${repo.name}/commits?per_page=6`, { headers });
          if (!res.ok) return [];
          const data = await res.json();
          if (!Array.isArray(data)) return [];
          return data.map(c => {
            const commitDate = c.commit?.author?.date || c.commit?.committer?.date;
            const dateStr = commitDate ? commitDate.split('T')[0] : '';
            if (dateStr) {
              dateCountMap[dateStr] = (dateCountMap[dateStr] || 0) + 1;
            }
            return {
              sha: (c.sha || '').slice(0, 7),
              fullSha: c.sha,
              message: c.commit?.message?.split('\n')[0] || 'Code update',
              author: c.commit?.author?.name || c.author?.login || GITHUB_USERNAME,
              avatarUrl: c.author?.avatar_url || rawProfile?.avatar_url,
              date: commitDate,
              timeAgo: formatRelativeTime(commitDate),
              repoName: repo.name,
              htmlUrl: c.html_url || `https://github.com/${GITHUB_USERNAME}/${repo.name}/commit/${c.sha}`
            };
          });
        } catch (_) {
          return [];
        }
      });

      const repoCommitsNested = await Promise.all(commitPromises);
      repoCommitsNested.forEach(list => {
        commitList = [...commitList, ...list];
      });
    } catch (_) {}

    // Deduplicate commits by fullSha / sha and sort newest first
    const seenShas = new Set();
    const uniqueCommits = [];
    commitList.forEach(c => {
      const id = c.fullSha || c.sha;
      if (id && !seenShas.has(id)) {
        seenShas.add(id);
        uniqueCommits.push(c);
      }
    });

    uniqueCommits.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));

    // 5. Build contribution matrix and stats
    const { weeks, totalAnnualContributions, monthlySummary } = buildContributionMatrix(dateCountMap);

    const totalStars = safeRepos.reduce((acc, r) => acc + (r.stargazers_count || 0), 0);
    const totalForks = safeRepos.reduce((acc, r) => acc + (r.forks_count || 0), 0);

    // Language tally
    const languageCounts = {};
    safeRepos.forEach(r => {
      if (r.language) {
        languageCounts[r.language] = (languageCounts[r.language] || 0) + 1;
      }
    });
    const sortedLanguages = Object.entries(languageCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([lang, count]) => ({ lang, count }));

    // 6. Format Repositories List
    const normalizedRepos = safeRepos.map(r => ({
      id: r.id,
      name: r.name,
      displayName: r.name.replace(/[-_]/g, ' '),
      description: r.description || 'Public GitHub repository crafted by Kamalesh.',
      language: r.language || 'Code',
      stars: r.stargazers_count || 0,
      forks: r.forks_count || 0,
      updatedAt: r.updated_at,
      timeAgo: formatRelativeTime(r.updated_at),
      htmlUrl: r.html_url,
      homepage: r.homepage || '',
      topics: r.topics || [],
      defaultBranch: r.default_branch || 'main'
    }));

    const resultData = {
      profile: {
        login: rawProfile.login || GITHUB_USERNAME,
        name: rawProfile.name || 'Kamalesh',
        avatarUrl: rawProfile.avatar_url || 'https://avatars.githubusercontent.com/u/291653639?v=4',
        bio: rawProfile.bio || 'Frontend Architect & Full-Stack Developer',
        publicRepos: rawProfile.public_repos || safeRepos.length || 13,
        followers: rawProfile.followers || 0,
        following: rawProfile.following || 0,
        createdAt: rawProfile.created_at,
        htmlUrl: rawProfile.html_url || `https://github.com/${GITHUB_USERNAME}`
      },
      stats: {
        totalRepos: safeRepos.length || 13,
        totalStars,
        totalForks,
        topLanguages: sortedLanguages,
        totalContributions: totalAnnualContributions || uniqueCommits.length || 21,
        latestActivityTime: uniqueCommits[0]?.timeAgo || normalizedEvents[0]?.timeAgo || 'recently'
      },
      commits: uniqueCommits.slice(0, 20),
      events: normalizedEvents.slice(0, 25),
      repos: normalizedRepos,
      heatmap: weeks,
      monthlySummary,
      isRateLimited: false,
      isFallback: false
    };

    // Save to Cache
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        data: resultData,
        timestamp: Date.now()
      }));
    } catch (_) {}

    return {
      ...resultData,
      isFromCache: false,
      lastSynced: new Date().toLocaleTimeString()
    };

  } catch (error) {
    console.warn('GitHub activity fetch warning:', error.message);

    // Try returning cached data even if expired
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        return {
          ...data,
          isFromCache: true,
          isRateLimited: true,
          lastSynced: new Date(timestamp).toLocaleTimeString()
        };
      }
    } catch (_) {}

    // Graceful fallback structure with static repository knowledge
    return {
      profile: {
        login: GITHUB_USERNAME,
        name: 'Kamalesh',
        avatarUrl: 'https://avatars.githubusercontent.com/u/291653639?v=4',
        bio: 'Frontend Architect & Full-Stack Developer',
        publicRepos: 13,
        followers: 0,
        following: 0,
        htmlUrl: `https://github.com/${GITHUB_USERNAME}`
      },
      stats: {
        totalRepos: 13,
        totalStars: 2,
        totalForks: 0,
        topLanguages: [{ lang: 'JavaScript', count: 6 }, { lang: 'Python', count: 4 }, { lang: 'HTML', count: 2 }],
        totalContributions: 21,
        latestActivityTime: 'recently'
      },
      commits: [
        {
          sha: '0f1489e',
          fullSha: '0f1489e863b08e6bc09f5529e1dc1bf6f4d4d1b3',
          message: 'Optimize RSK Traders website performance',
          author: GITHUB_USERNAME,
          date: '2026-11-09T04:19:42Z',
          timeAgo: '2d ago',
          repoName: 'RSK-Traders',
          htmlUrl: `https://github.com/${GITHUB_USERNAME}/RSK-Traders/commit/0f1489e863b08e6bc09f5529e1dc1bf6f4d4d1b3`
        },
        {
          sha: 'b391ae4',
          fullSha: 'b391ae427d47edd08c2b3022a31fc745c239d747',
          message: 'Improve RSK Traders SEO metadata and tags',
          author: GITHUB_USERNAME,
          date: '2026-11-09T03:44:06Z',
          timeAgo: '2d ago',
          repoName: 'RSK-Traders',
          htmlUrl: `https://github.com/${GITHUB_USERNAME}/RSK-Traders/commit/b391ae427d47edd08c2b3022a31fc745c239d747`
        },
        {
          sha: '32c4605',
          fullSha: '32c46058c0455187f3dbd0a287af714270ec8193',
          message: 'Add SEO sitemap and robots.txt',
          author: GITHUB_USERNAME,
          date: '2026-11-09T03:26:57Z',
          timeAgo: '2d ago',
          repoName: 'RSK-Traders',
          htmlUrl: `https://github.com/${GITHUB_USERNAME}/RSK-Traders/commit/32c46058c0455187f3dbd0a287af714270ec8193`
        }
      ],
      events: [
        {
          id: 'evt-1',
          type: 'PushEvent',
          repoName: 'RSK-Traders',
          author: GITHUB_USERNAME,
          summary: 'Pushed 3 commits to main',
          timeAgo: '2d ago',
          targetUrl: `https://github.com/${GITHUB_USERNAME}/RSK-Traders`
        },
        {
          id: 'evt-2',
          type: 'PushEvent',
          repoName: 'django_basic',
          author: GITHUB_USERNAME,
          summary: 'Pushed commits to main',
          timeAgo: '2w ago',
          targetUrl: `https://github.com/${GITHUB_USERNAME}/django_basic`
        }
      ],
      repos: [],
      heatmap: [],
      monthlySummary: [],
      isFromCache: true,
      isRateLimited: true,
      isFallback: true,
      lastSynced: 'Cached'
    };
  }
};
