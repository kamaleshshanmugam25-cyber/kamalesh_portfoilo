# KAMALESH — Digital Ecosystem & Interactive Workspace

A luxury, futuristic digital workspace combining a developer portfolio, interactive macOS-inspired desktop operating system, multi-website launcher, and in-window browser chrome.

---

## 🌟 Key Highlights

- **Desktop Operating System Experience**: Movable, resizable, minimizable, and maximizable windows with active z-index focus management.
- **macOS Floating Dock**: Magnification physics on cursor proximity, running indicator lights, and tooltips.
- **6 Configurable Flagship Applications**:
  1. **RSK Traders** (`https://rsktraders.co.in`) — Import & Export global trade portal.
  2. **Photography Website** — Creative services & visual storytelling studio.
  3. **Gold Jewellery Website** — Bespoke fine jewellery & luxury e-commerce.
  4. **Restaurant Website** — Gourmet dining, digital reservations & culinary tasting.
  5. **JobSphere** — Tech career aggregation & AI candidate matching platform.
  6. **College ERP** — Unified institutional management suite.
- **Internal Browser Engine**: In-window address bar, security SSL lock, reload, copy URL, and external tab link.
- **X-Frame-Options Resilience**: Graceful fallback detection when third-party sites restrict iframe embedding. Never shows a blank white screen.
- **Raycast Spotlight Command Palette (`⌘K` / `Ctrl+K`)**: Instant fuzzy search across apps, system commands, and portfolio views.
- **Interactive Developer Terminal**: Built-in CLI running commands (`help`, `skills`, `whoami`, `apps`, `launch <id>`, `clear`).
- **Projects Showcase & About Me**: Bento-grid project cards, animated technical skill meters, and direct contact portal with confetti celebration.
- **Responsive Architecture**: Desktop multi-window workspace, tablet adaptive grid, and mobile-first full-screen sheets with bottom tab navigation.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```

### 3. Build for Production
```bash
npm run build
```

### 4. Preview Production Build
```bash
npm run preview
```

---

## ⚙️ Adding & Updating Website URLs

All application data is centralized in one file:
👉 `src/config/applications.js`

To update a website URL or set a live production domain:
```javascript
{
  id: 'photography',
  name: 'PHOTOGRAPHY WEBSITE',
  shortName: 'Photography',
  category: 'Photography & Creative Services',
  url: 'https://your-photography-site.com', // Enter URL here
  status: 'live', // Change status to 'live'
  ...
}
```
Any change here automatically updates the desktop icons, dock, search launcher, internal browser, and project showcase.

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `⌘K` / `Ctrl+K` | Open Raycast Command Palette |
| `Escape` | Dismiss modal dialogs / command palette |
| `Double Click` on Desktop Icon | Launch application in window |

---

## 🌐 Deploy to Vercel

This project is fully configured for zero-configuration Vercel deployment:
1. Push this repository to GitHub/GitLab.
2. Import the project in Vercel.
3. Vercel will automatically detect `Vite`, run `npm run build`, and serve `dist` with `vercel.json` rewrite routing.
