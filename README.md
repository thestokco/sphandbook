# SP Handbook

A calm, editorial internal **employee handbook & people directory**. Staff sign
in, browse the company by department, drill into a department's sections, see the
people in a section, and flip through colleague profiles presented as a paged
**photobook**.

Built with **Next.js (App Router) + TypeScript + Tailwind**, deployable on
**Vercel**, installable as a **PWA**. One responsive codebase serves desktop and
mobile browsers — there is no native app.

---

## Quick start

```bash
npm install
npm run dev
```

Open the printed URL (default <http://localhost:3000>).

### Scripts

| Command          | What it does                                  |
| ---------------- | --------------------------------------------- |
| `npm run dev`    | Start the dev server (HMR).                   |
| `npm run build`  | Production build.                             |
| `npm run start`  | Serve the production build (run `build` first). |
| `npm run lint`   | ESLint (`next/core-web-vitals`).              |

> Note: `npm run start` requires a prior `npm run build`. Running `npm run dev`
> overwrites the production `.next` output, so rebuild before serving prod.

### Regenerating PWA icons

Icons are pre-generated in `public/icons/` (and `app/icon.png`,
`app/apple-icon.png`, `app/favicon.ico`). To regenerate them from the inline SVG
source:

```bash
node scripts/generate-icons.mjs
```

---

## Project structure

```
app/
  layout.tsx              Root layout: next/font (Newsreader + Inter), PWA metadata, .app-root
  template.tsx            300ms fade/translate route transition (respects reduced motion)
  globals.css             All design tokens + component styles (ported from the prototype)
  page.tsx                Landing  (/)
  login/page.tsx          Login    (/login)
  departments/page.tsx    Departments dashboard (/departments)
  sections/[dept]/page.tsx        Sections org chart (/sections/:dept)
  directory/[dept]/page.tsx       Directory + Photobook overlay (/directory/:dept?section=)
  not-found.tsx           404
  icon.png, apple-icon.png, favicon.ico

components/
  Masthead.tsx  MHeader.tsx        Web masthead / mobile app bar
  Reveal.tsx                        Staggered fade-up
  Avatar.tsx  Photo.tsx             next/image portraits with monogram fallback
  ResponsiveShell.tsx               Renders both layouts; CSS picks one by viewport
  web/                              Web layout screens
  mobile/                           Mobile layout screens (list rows, bottom sheet)
  screens/DirectoryScreen.tsx       Directory state + photobook paging (client)

lib/
  types.ts                Domain types (Department, Section, Employee)
  data.ts                 Mock data + derived helpers — the Supabase seam
  hooks.ts                useReduceMotion, useSwipe

public/
  manifest.webmanifest    PWA manifest
  icons/                  192 / 512 / maskable-512 PNGs

scripts/
  generate-icons.mjs      Regenerates the icon set with sharp
```

### Responsive strategy

The web and mobile component trees are both rendered; the **real viewport**
chooses which is visible via media-query rules in `globals.css`
(`.layout-web` / `.layout-mobile`, breakpoint **640px**). This avoids hydration
flicker and works without JavaScript. The prototype's "Preview · Web / Mobile"
toggle and phone frame have been removed — production responds to the device
only.

### Navigation flow

```
Landing → Login → Departments → Sections → Directory → Photobook (overlay)
```

- **Login** is open / no-auth for the demo (any input proceeds). Real auth is
  future scope.
- **Directory → Photobook** opens the photobook over the **whole department**
  (`deptRoster(dept)`), regardless of the current section/search filter, and
  pages through it with wraparound.
- **Photobook gestures:** swipe (touch) + click-drag (mouse) to flip; on web,
  arrow keys ←/→ flip and `Esc` closes, with a page counter + dots; on mobile, a
  slide-up bottom sheet with a Prev / "x of n" / Next bar. Vertical scrolling
  keeps working — only a clear horizontal swipe flips.

---

## Data layer (Supabase-ready)

All data lives behind `lib/data.ts`, which currently returns in-memory mock data
and exposes a stable set of helpers:

```
deptName, sectionsOf, sectionName, sectionTag,
photoUrl, initials, emailOf,
countIn, countInSection, deptRoster,
greeting, filterPeople, isDeptKey
```

To move to **Supabase**, reimplement these helpers against `departments`,
`sections`, and `employees` tables (the synchronous helpers can become async /
server queries) while keeping the same names and return shapes. The UI imports
only from `lib/data.ts`, so it should not need to change. Portraits are served
through `next/image` from a single `photoUrl()` source — swap that (and the
`next.config.mjs` `images.remotePatterns`) when real photography lands.

---

## Accessibility & motion

- `prefers-reduced-motion` disables transitions and animations.
- Visible keyboard focus rings (`:focus-visible`).
- Dialogs use `role="dialog"` + `aria-modal`; icon-only buttons have
  `aria-label`.

---

## Deploying to Vercel

1. Push this repository to GitHub/GitLab/Bitbucket.
2. In [Vercel](https://vercel.com/new), **Import** the repository.
3. Vercel auto-detects Next.js — no settings needed. Build command
   `next build`, output handled automatically.
4. Deploy. The app installs as a PWA from the deployed URL
   ("Add to Home Screen").

No environment variables are required today. When Supabase is added, set its URL
and keys as Vercel environment variables and the image `remotePatterns` for the
storage host.

### Deploy from the CLI (optional)

```bash
npm i -g vercel
vercel          # preview deploy
vercel --prod   # production deploy
```
