# Dashboard UI Kit

Click-through recreation of the DreamBricks project dashboard — the core
product described in the brief ("a website that shows a dashboard with
information about the projects that are happening or happened").

Not derived from a real codebase or Figma file (none was attached) — this is
an original screen set built with the extracted brand tokens, logo, and
mascot, composing the component library in `components/`.

## Screens
- **Login** — brand split-screen with the horizontal logo + J0Bson mascot
- **Overview** — stat cards, active/completed project tabs, project grid, recent activity
- **Project detail** — status, progress, team, at-risk callout, archive dialog + toast

## Files
- `index.html` — shell, loads the design-system bundle + screens
- `data.js` — sample project/activity data (fake, for the prototype)
- `Icons.jsx` — small inline icon set (Lucide-style, hand-drawn — see readme "Iconography")
- `App.jsx` — all screens (Login, Sidebar/TopBar, DashboardHome, ProjectDetail)
