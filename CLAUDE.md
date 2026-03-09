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
│   ├── styles.css        # Global CSS with theme variables (CSS custom properties)
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

**Projects Page:**
- `ProjectsNavigation.js` — Tab navigation for project categories
- `ProjectSection.js` — Section wrapper rendering a list of project cards
- `ProjectCard.js` — Individual project display (title, description, media, links)
- `ImageGallery.js` — Image carousel used inside project cards

**Publications Page:**
- `PublicationsNavigation.js` — Tab navigation for publication types
- `PublicationSection.js` — Section wrapper for publication lists
- `PublicationCard.js` — Individual paper display

**Resume Page:**
- `ResumeSection.js` — Education and work history display
- `SkillsSection.js` — Technical skills listing
- `CertificationsSection.js` — AWS and other certification badges
- `OtherInterestsSection.js` — Languages, hobbies, extracurriculars

**Shared Utilities:**
- `Button.js` — Reusable styled button
- `components/index.js` — Barrel export for all components

---

## Theme System

- `src/contexts/ThemeContext.js` — React Context providing `theme` and `toggleTheme`
- Defaults to system color scheme preference; persists to `localStorage`
- `src/styles.css` defines CSS custom properties for both themes (`--bg-primary`, `--text-primary`, `--accent-primary`, etc.)
- All components use these CSS variables — no hardcoded colors in components

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
- **Layout/style changes** → edit components or `src/styles.css`
- **New page** → add a page component in `src/pages/`, a route in `App.js`, and a new JSON file in `src/data/`
- **Theme colors** → update CSS variables in `src/styles.css`, not component files
