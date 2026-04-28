# Automated Job Application Tracker

A full-featured, browser-based job application tracker with automated follow-up reminders, Kanban board, analytics dashboard, and CSV/JSON data management. Built as a portfolio project with React, TypeScript, and Tailwind CSS — deployed to GitHub Pages with zero backend required.

**Live Demo:** https://zaynnnextra.github.io/Automated-Job-Application-Tracker/

---

## Features

### Core Tracking
- Add, edit, and delete job applications with full detail: company, role, status, location, work mode, salary range, source, and job posting URL
- Status workflow: Wishlist → Applied → Phone Screen → Interview → Offer → Rejected / Withdrawn / Ghosted
- Priority levels (High / Medium / Low) with color-coded indicators
- Per-application notes with timestamps and full edit/delete
- Contact management per application (name, title, email, phone, LinkedIn)
- Status change history with timeline view

### Automation
- **Auto follow-up dates** — calculated automatically when status changes (configurable thresholds per status)
- **Overdue detection** — in-app banner + notification bell badge when follow-ups are past due
- **Browser notifications** — opt-in push notifications when applications are overdue (HTTPS only)
- **Next-action suggestions** — inline chips on cards and table rows ("Send follow-up", "Send thank-you note")
- **Configurable rules** — adjust day thresholds per status in Settings

### Views
- **Dashboard** — stats cards, weekly activity bar chart, status distribution pie chart, upcoming follow-ups
- **Applications table** — sortable columns, status/priority filter chips, full-text search
- **Kanban board** — drag-and-drop cards between status columns using `@dnd-kit`

### Data Management
- **Export JSON** — full fidelity (all notes, contacts, status history)
- **Export CSV** — flat fields for spreadsheet workflows
- **Import JSON / CSV** — merges with existing data (deduplicates by ID)
- Data stored in `localStorage` — private, instant, no account required

### UX
- Light / Dark / System theme with persistent preference
- Fully responsive — mobile bottom tab bar, desktop collapsible sidebar
- 8 realistic seed applications pre-loaded so the app looks great on first visit
- Deployed on GitHub Pages via GitHub Actions on every push to `main`

---

## Tech Stack

| Layer | Technology |
|---|---|
| UI framework | React 18 + TypeScript |
| Build tool | Vite 5 |
| Styling | Tailwind CSS + shadcn/ui |
| Charts | Recharts |
| Drag-and-drop | @dnd-kit/core + @dnd-kit/sortable |
| State | Zustand with localStorage persist middleware |
| Routing | React Router v6 (basename for GitHub Pages subpath) |
| Date utilities | date-fns |
| Icons | lucide-react |
| Deployment | GitHub Actions → GitHub Pages |

---

## Running Locally

```bash
git clone https://github.com/zaynnnextra/Automated-Job-Application-Tracker.git
cd Automated-Job-Application-Tracker
npm install
npm run dev
```

Open http://localhost:5173/Automated-Job-Application-Tracker/

---

## Deployment

The app deploys automatically via GitHub Actions on every push to `main`.

**One-time setup required:**
1. Go to repository **Settings → Pages**
2. Under **Source**, select **GitHub Actions**
3. Push to `main` — the workflow builds and deploys automatically

The workflow (`/.github/workflows/deploy.yml`) builds with Vite, copies `dist/index.html` to `dist/404.html` for SPA client-side routing support on GitHub Pages, then deploys with `actions/deploy-pages`.

---

## Architecture Highlights

- **`src/types/index.ts`** — single source of truth for all TypeScript interfaces, enums, and constants
- **`src/lib/automation.ts`** — pure functions: `calculateFollowUpDate`, `getAutoSuggestion`, `getOverdueApplications`
- **`src/store/useApplicationStore.ts`** — Zustand store with `persist` middleware; all CRUD logic including automatic follow-up date recalculation on status change
- **`src/hooks/useAutoReminders.ts`** — schedules browser notifications on mount and on tab focus

---

## Project Structure

```
src/
├── types/          # TypeScript interfaces & enums
├── store/          # Zustand stores (applications, UI, notifications)
├── lib/            # Pure utilities (automation, CSV/JSON, notifications)
├── hooks/          # Custom React hooks
├── components/
│   ├── ui/         # shadcn/ui base components
│   ├── layout/     # AppShell, Sidebar, TopBar, MobileNav
│   ├── dashboard/  # StatsCards, charts, reminder widgets
│   ├── kanban/     # KanbanColumn, KanbanCard (dnd-kit)
│   ├── applications/ # Table, Row, Toolbar
│   ├── forms/      # ApplicationForm, NoteForm, ContactForm
│   ├── reminders/  # ReminderBanner, ReminderList, AutoSuggestionChip
│   └── settings/   # DataManagement, NotificationSettings
└── pages/          # Route-level page components
```
