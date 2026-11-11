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
- **KAM AI — "Your Digital Guide"**:
  - Intelligent AI assistant grounded in Kamalesh's portfolio, 6 flagship websites, and GitHub repositories.
  - Safe frontend navigation action dispatcher: open apps, filter repositories, launch modals, and clear screen.
  - Voice assistant: Web Speech API speech-to-text and text-to-speech with mute/stop controls.
  - Dual architecture: Django REST Framework backend API (`POST /api/ai/chat/`) with automatic client-side knowledge engine fallback.
  - Neo-Brutalist design language matching KAMVERSE.

---

## 🤖 KAM AI Assistant & Backend Architecture

KAM AI provides both a Python / Django REST Framework API and a zero-latency client-side fallback engine:

- **Endpoint**: `POST /api/ai/chat/`
- **Health Check**: `GET /api/ai/health/`
- **Request Format**:
  ```json
  {
    "message": "Open RSK Traders",
    "conversation_id": "session-123"
  }
  ```
- **Response Format**:
  ```json
  {
    "response": "RSK TRADERS is an international import & export platform. Opening the browser window right now!",
    "action": {
      "type": "OPEN_APP",
      "payload": { "appId": "rsk-traders" }
    },
    "suggestions": ["Show all projects", "Open JobSphere", "Take me home"]
  }
  ```
- **Safe Permitted Actions**:
  - `OPEN_APP`: Opens any of the 6 flagship applications
  - `OPEN_PROJECT`: Opens project details and README modal for a repository
  - `NAVIGATE_VIEW`: Navigates to `projects`, `about`, `contact`, `terminal`, `launcher`, or `home`
  - `FILTER_PROJECTS`: Filters projects by technology (e.g. Python, JavaScript) or category
  - `OPEN_EXTERNAL`: Opens verified external destination safely (e.g. GitHub profile)
  - `MINIMIZE_ALL`: Clears workspace down to the desktop canvas

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

### 1. Frontend (React + Vite)
```bash
# Install frontend dependencies
npm install

# Start Vite development server
npm run dev

# Build for production
npm run build
```

### 2. Backend (Django REST Framework)
```bash
# Run unit tests
python backend/manage.py test ai_assistant

# Start Django backend server (http://127.0.0.1:8000)
npm run backend
# or: python backend/manage.py runserver
```

