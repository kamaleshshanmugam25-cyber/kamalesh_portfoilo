# KAMALESH — Digital Ecosystem & Interactive Workspace

A luxury, futuristic digital workspace combining a developer portfolio, interactive macOS-inspired desktop operating system, live GitHub-powered project discovery engine, multi-website launcher, and in-window browser chrome.

---

## 🌟 Key Highlights

- **Live GitHub REST API Synchronization**:
  - Automatically fetches all public repositories for [`kamaleshshanmugam25-cyber`](https://github.com/kamaleshshanmugam25-cyber).
  - Retrieves real stars, forks, primary languages, topics, and updated dates.
  - Zero token exposure (safe public REST API).
  - Rate-limit resilient with 1-hour `localStorage` caching and static snapshot fallback.
- **Intelligent Category Classifier**:
  - Automatically organizes repositories into 6 clean domains:
    1. **Business Websites** (`RSK-Traders`, `TrichyPreneurs`)
    2. **E-commerce** (`peru-covering`)
    3. **Enterprise Applications** (`College-Erp`, `school-ERP`)
    4. **SaaS Platforms** (`Food-billing-software`, `3D-WEBNIAR-LEAD`)
    5. **Web Applications** (`Kavin-fotography`, `Littlelemon`, `django-react-auth-Login-Page-`)
    6. **Personal Projects** (`django_basic`, `demo`, `kamalesh`)
- **Interactive Project Details Window**:
  - Full animated window displaying real GitHub metadata, language breakdown percentage bar, and on-demand **README.md viewer** decoded straight from GitHub.
- **Desktop Operating System Experience**:
  - Movable, resizable, minimizable, and maximizable windows with active z-index focus management.
  - Prominent **Cancel** buttons on every window header and internal browser toolbar.
- **macOS Floating Dock**:
  - Magnification physics on cursor proximity, running indicator lights, and tooltips.
- **Internal Browser Engine**:
  - In-window address bar, security SSL lock, reload, copy URL, and external tab link.
  - Graceful fallback detection when third-party sites restrict iframe embedding (`X-Frame-Options`).
- **Raycast Spotlight Command Palette (`⌘K` / `Ctrl+K`)**:
  - Instant fuzzy search across apps, GitHub repositories, system commands, and portfolio views.
- **Interactive Developer Terminal**:
  - Built-in CLI running commands (`help`, `repos`, `whoami`, `skills`, `apps`, `launch <id>`, `clear`).

---

## ⚙️ Centralized Configuration

All repository overrides, live deployment URLs, and featured flags are managed in one file:
👉 [`src/config/projects.js`](file:///e:/Website/cetralized%20hub/src/config/projects.js)

```javascript
export const REPO_OVERRIDES = {
  'RSK-Traders': {
    displayName: 'RSK TRADERS',
    category: 'Business Websites',
    liveUrl: 'https://rsktraders.co.in',
    featured: true
  },
  'Kavin-fotography': {
    displayName: 'Kavin Photography',
    category: 'Web Applications',
    liveUrl: 'https://kavinphotography.vercel.app',
    featured: true
  },
  ...
};
```

---

## 🚀 Quick Start

```bash
# 1. Install Dependencies
npm install

# 2. Run Local Development Server
npm run dev

# 3. Build for Production
npm run build
```
