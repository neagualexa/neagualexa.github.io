# CLAUDE.md — Personal Portfolio Website

## Project Overview

React-based personal portfolio website for Alexandra Neagu, deployed at https://neagualexa.github.io via GitHub Pages.

**Tech Stack:** React 19, React Router DOM 7, Create React App (react-scripts), gh-pages for deployment.

---

## Directory Structure

```
github.io/
├── public/               # Static assets (HTML entry, favicon, resume PDF, 404 handler)
├── src/
│   ├── App.js            # Root component — sets up routing and ThemeProvider
│   ├── index.js          # React entry point
│   ├── styles/           # All CSS — entry point index.css (see Theme System)
│   ├── components/       # Reusable UI components
│   ├── contexts/         # React Context (theme state)
│   ├── pages/            # Page-level components (one per route)
│   └── data/             # JSON content files — one per page/domain
│       └── misc/         # Media assets (images, videos, PDFs)
└── build/                # Production build output (committed to gh-pages branch)
```

---

## Routing

Defined in `src/App.js`:

| Route | Page Component | Description |
|-------|---------------|-------------|
| `/` | `HomePage.js` | Intro and contact |
| `/resume` | `ResumePage.js` | Education, experience, skills, certifications |
| `/projects` | `ProjectsPage.js` | Project showcase with category navigation |
| `/publications` | `PublicationsPage.js` | Research papers |

---

## Data Architecture

**Each page's content is stored in its own JSON file** under `src/data/`. Components import directly from these files — there is no backend or API.

| File | Used By | Contents |
|------|---------|----------|
| `personalInfo.json` | `HomePage.js` | Name, title, bio, contact links, social links |
| `newsData.json` | `NewsTimeline.js` | News events: `start`/`end` ISO dates, `title`, `description`, `type` (lane/tag; omitted = milestone), `links` |
| `projectsData.json` | `ProjectsPage.js` | Project categories, titles, descriptions, images, links, tags |
| `publicationsData.json` | `PublicationsPage.js` | Papers, authors, venues, links, abstract summaries |
| `resumeData.json` | `ResumePage.js` | Education, work experience, skills, certifications |

To update site content, edit the relevant JSON file — no component code changes needed.

---

## Components

**Layout / Navigation:**
- `Navigation.js` — Top navbar; hides on mobile scroll down
- `ThemeToggle.js` — Dark/light mode switch button

**Home Page:**
- `IntroSection.js` — Welcome hero section
- `ContactSection.js` — Contact info and social links
- `SocialLink.js` — Individual social media link with icon
- `MagicField.js` — Interactive stardust canvas behind the hero (motes that form constellations around the cursor; the pet dragon eats them, and they reappear); colors from the `--magic-*` tokens, static under `prefers-reduced-motion`
- `NewsTimeline.js` — News list from `newsData.json` (upcoming, then by year)
- `PetDragon.js` — Pet dragon: lives on a corner of the contact card (moves between corners now and then), follows the cursor after you click it (click again to send it home), and flies down the news timeline line as you scroll, eating the dots (they grow back on the way up); also eats hero stardust it flies near (via `petMouth.js`); naps only on its corner, waking every 10–25s to fly a little figure-eight (∞) or move to another corner. Colors from the `--dragon-*` tokens
- `drawDragon.js` — Canvas drawing of the top-down dragon (from the "Dragon Overhead" sketch) used by `PetDragon.js`

**Projects Page:**
- `ProjectsNavigation.js` — Tab navigation for project categories
- `ProjectSection.js` — Section wrapper rendering a list of project cards
- `ProjectCard.js` — Individual project display (title, description, media, links)
- `ImageGallery.js` — Image carousel used inside project cards

**Publications Page:**
- `PublicationCard.js` — Individual paper display

**Resume Page:**
- `ResumeSection.js` — Education and work history display
- `SkillsSection.js` — Technical skills listing
- `CertificationsSection.js` — AWS and other certification badges
- `OtherInterestsSection.js` — Languages, hobbies, extracurriculars

**Shared Utilities:**
- `Button.js` — Reusable button/link; `variant` and `size` props map to `.btn` classes
- `components/index.js` — Barrel export for all components

---

## Theme System

- `src/contexts/ThemeContext.js` — React Context providing `theme` and `toggleTheme`
- Defaults to system color scheme preference; persists to `localStorage`
- All CSS lives in `src/styles/`, loaded through `index.css` (imported once in `App.js`) in this order:

  | File | Purpose |
  |------|---------|
  | `theme.css` | Design tokens (colors, radii, motion, z-index, fonts) for light and `.dark-theme`, plus shared primitives. Components use the single accent (`--accent-primary`); the `--opal-*` colors are only for the news tags |
  | `base.css` | Reset and plain HTML elements (headings, links, text, lists) |
  | `layout.css` | Site chrome on every page: top nav, `<section>` wrapper, page intro, section nav / floating section dock |
  | `home.css` | `/` — intro hero, news timeline, contact, social links |
  | `resume.css` | `/resume` — resume items, skills, certifications |
  | `projects.css` | `/projects` — project cards, project links, image gallery, image/video modal |
  | `publications.css` | `/publications` — card grid and publication cards |
  | `media.css` | Dark-mode treatment for images and icons, across pages |

- Shared primitives in `theme.css`:
  - `.btn` + `btn--primary` / `--secondary` / `--neutral` / `--soft`, sizes `btn--sm` / `btn--icon`
  - `.card` (+ `card--muted`) — the one card style for every page: a single 1px `--border-color` line, no shadow (no shadows anywhere on the site)
  - `.toolbar` (+ `toolbar__btn`, `toolbar__divider`, `toolbar__text`) — frosted floating control bar, used by the section dock and the image viewer
  - `.tag`
- Page files reference tokens only — no raw colors, radii or shadows there or in components
- Each page file keeps its own responsive rules at the bottom under a "Responsive" heading

---

## Media Assets

All media lives in `src/data/misc/`:

```
misc/
├── profile_photo.jpg / profile_photo_full.jpg
├── Github_icon.png / LinkedIn_icon.png
├── projects/        # Project images, videos (MP4), and PDF reports
├── resume/          # School/company logos, certification images
└── publications/    # PDF papers
```

---

## Development & Deployment

```bash
npm start         # Dev server at localhost:3000
npm run build     # Production build → /build
npm run deploy    # Build + push to gh-pages branch (live site)
npm test          # Run tests
```

**Deployment flow:** Source code lives on `main`. `npm run deploy` compiles and pushes the built output to the `gh-pages` branch, which GitHub Pages serves.

---

## Key Conventions

- **Content changes** → edit JSON files in `src/data/`
- **Layout/style changes** → edit the matching file in `src/styles/` (one per page, plus `layout.css` for shared chrome)
- **New page** → add a page component in `src/pages/`, a route in `App.js`, a new JSON file in `src/data/`, and a `src/styles/<page>.css` imported from `index.css`
- **Theme colors, radii, borders, button/card styles** → edit `src/styles/theme.css`
