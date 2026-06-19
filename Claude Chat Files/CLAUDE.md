# SP Handbook — Build Spec

This file is the source of truth for building **SP Handbook**, a calm, editorial
internal employee handbook & people directory. A working single-file React +
Tailwind prototype lives at `SPHandbook.jsx` — treat it as the visual reference
and match its look, layout, flow, and behavior exactly. This document is the
written brief that goes with it.

---

## 1. What we're building

A small internal web app where staff sign in, browse the company by department,
drill into a department's sections, see the people in a section, and flip
through colleague profiles presented as a paged "photobook." It should feel
premium and quiet — think Apple, Notion, and Monocle combined: editorial serif
headlines, generous white space, hairline rules, and restrained motion.

- **Deliverable:** a production-ready **Next.js (App Router) + TypeScript +
  Tailwind** app, deployable on **Vercel**, installable as a **PWA**.
- **Audience:** internal staff, on desktop and phone browsers. One codebase
  serves both with responsive layouts (no native app).
- **Data:** mock data for now (in the prototype), structured behind a clean data
  layer so it can later be swapped for **Supabase** without touching the UI.

---

## 2. Tech stack & conventions

- **Framework:** Next.js, App Router, TypeScript.
- **Styling:** Tailwind. Port the prototype's design tokens into the Tailwind
  theme + a global stylesheet. The prototype currently ships CSS in an injected
  `<style>` tag using CSS variables + plain class names (because the artifact
  sandbox forbids Tailwind arbitrary values); in the real app, move colors into
  the Tailwind config and keep component classes semantic.
- **Client vs server:** the app is mostly interactive, so the screen components
  that hold state or handle gestures must be **client components** (`"use
  client"`): login state, search, section chips, and the photobook
  swipe/flip/keyboard logic. Keep static shells as server components where it's
  easy.
- **Fonts:** load **Newsreader** (display serif) and **Inter** (UI/body) via
  `next/font/google`.
- **Images:** portraits currently come from `randomuser.me`. Route them through
  `next/image` and keep the source swappable. Provide a monogram-initials
  fallback when an image fails to load (the prototype already does this).
- **Icons:** `lucide-react`.
- **PWA:** add a web app manifest, icons, and "Add to Home Screen" support so it
  installs on phones.
- **No `localStorage`/`sessionStorage` reliance** for core state; use React
  state. Persisted preferences (if any) can come later via the data layer.
- **Accessibility & motion:** respect `prefers-reduced-motion` (disable
  transitions/animations); keep visible keyboard focus rings; dialogs use
  `role="dialog"` + `aria-modal`; all icon-only buttons have `aria-label`.

---

## 3. Brand & design tokens

**Wordmark:** `SP` in wide-tracked caps, preceded by a small navy dot. Product
name in copy: **SP Handbook**. Sample emails use `@sp.co`.

### 3.1 Color palette (CSS variables)

```
--ivory:      #F7F4ED   /* app background */
--paper:      #FCFAF4   /* cards, panels */
--sand:       #ECE4D5   /* photo placeholder, soft fills */
--line:       #E4DCCC   /* hairline borders, dividers */
--taupe:      #B4A88E   /* numerals, subtle accents */
--taupe-deep: #8C7F66   /* eyebrows, small caps, icons */
--navy:       #27344A   /* primary buttons, org node, active chip, ink accents */
--navy-soft:  #3A4A64   /* button hover */
--ink:        #2B2925   /* primary text */
--muted:      #766E5F   /* secondary/body text */
--panel:      #EFE7D6   /* photobook text-panel tint (the colored block) */
```

Supporting literals used on dark (navy) surfaces:
`#F3EFE6` light text · `#BCAE93` eyebrow-on-navy · `#CBC4B5` muted-on-navy ·
`#1D2433` phone bezel · `#D9D0BD` photo-fallback gradient end ·
`#A89F8D` input placeholder.

### 3.2 Typography

- **Display serif — Newsreader**, weights 400/500 (+ italic), used for all
  headlines, names, numerals, and the italic pull-quote.
- **UI/body — Inter**, weights 400/500/600, used for everything else.

Type scale (px unless noted; `clamp()` where the prototype is fluid):

| Token / element        | Family    | Size                    | Notes |
|------------------------|-----------|-------------------------|-------|
| Wordmark               | Inter 600 | 13                      | letter-spacing .28em, caps |
| Eyebrow / small-caps   | Inter 600 | 11                      | letter-spacing .24em, uppercase, `--taupe-deep` |
| Body "lede"            | Inter 400 | 17 (line-height 1.65)   | `--muted` |
| Landing title          | Newsreader 500 | clamp(38, 6.4vw, 72) | line-height 1.04 |
| Section title          | Newsreader 500 | clamp(30, 4.4vw, 46) | line-height 1.05 |
| Org-node name          | Newsreader 500 | 26                  | on navy |
| Department name (card) | Newsreader 500 | 25                  | |
| Section name (card)    | Newsreader 500 | 22                  | |
| Photobook name         | Newsreader 500 | 33 (web) / 23 (mobile) | |
| Directory name         | Newsreader 500 | 20 (web) / 17 (mobile) | |
| Pull-quote             | Newsreader 500 italic | 20–23        | left rule `--taupe`; on mobile a top rule instead |
| Buttons                | Inter 500 | 14                      | |
| Inputs                 | Inter 400 | 15 (16 on mobile)       | |
| info label / value     | Inter     | 11 caps / 15            | |
| Mobile landing title   | Newsreader 500 | clamp(29, 8.5vw, 38) | |

### 3.3 Shape, spacing, motion

- **Page padding (web):** `clamp(20px, 6vw, 84px)` left/right.
- **Radii:** cards 22–26px; photos 14–18px; inputs 14px; pills/chips/buttons
  999px; bottom sheet 26px top corners.
- **Borders:** 1px `--line` hairlines everywhere.
- **Shadows:** soft, long, low-opacity warm-gray (e.g.
  `0 26px 44px -28px rgba(43,41,37,.5)`); navy buttons get a navy-tinted shadow.
- **Motion:** page transitions are a 300ms fade/translate. Cards lift ~6px on
  hover. Photobook pages use a directional page-flip (slide + slight 3-D
  `rotateY`). All disabled under `prefers-reduced-motion`.

---

## 4. Data model

> The prototype's `SPHandbook.jsx` contains the full sample dataset. Reproduce it
> verbatim, but move it into a typed data layer (e.g. `lib/data.ts` returning the
> arrays, with the helper functions below) so a Supabase-backed implementation
> can later satisfy the same interface.

### 4.1 Types

```ts
type DeptKey =
  | "management" | "hr" | "finance" | "operations"
  | "engineering" | "sales" | "marketing" | "admin";

interface Department { key: DeptKey; name: string; tag: string; }

interface Section { key: string; name: string; tag: string; } // 2 per department

interface Employee {
  id: number;
  name: string;
  dept: DeptKey;
  section: string;   // a Section.key within that dept
  title: string;
  loc: string;       // city
  ext: string;       // phone extension, shown as "x123"
  g: "w" | "m";      // portrait folder for the placeholder photo source
  p: number;         // portrait index for the placeholder photo source
  motto: string;     // short italic pull-quote
  bio: string;       // 1–2 sentences
}
```

### 4.2 Departments (8)

| key | name | tag |
|-----|------|-----|
| management | Management | Direction, stewardship, and the long view. |
| hr | Human Resources | Hiring, wellbeing, and the shape of the team. |
| finance | Finance | Numbers, planning, and steady footing. |
| operations | Operations | The quiet machinery that keeps us moving. |
| engineering | Engineering | Building the things, and keeping them running. |
| sales | Sales | Conversations that turn into partnerships. |
| marketing | Marketing | Story, taste, and how we sound. |
| admin | Administration | Logistics, spaces, and everything in between. |

### 4.3 Sections (2 per department)

- **management:** Executive Office (`m-exec`), Strategy (`m-strat`)
- **hr:** Talent (`hr-talent`), People Operations (`hr-ops`)
- **finance:** Controlling (`fin-control`), Treasury (`fin-treasury`)
- **operations:** Logistics (`ops-logistics`), Coordination (`ops-coord`)
- **engineering:** Platform (`eng-platform`), Product Engineering (`eng-product`)
- **sales:** Enterprise (`sal-enterprise`), Regional (`sal-regional`)
- **marketing:** Brand (`mkt-brand`), Content (`mkt-content`)
- **admin:** Office & Facilities (`adm-office`), Executive Support (`adm-support`)

Each section has its own one-line `tag` (see prototype).

### 4.4 Employees

32 employees, exactly **2 per section** (4 per department). Full records
(name, title, location, extension, motto, bio, portrait fields) are in the
prototype — reproduce them. Per-section roster:

- **Executive Office:** Eleanor Voss (Chief Executive), Amara Okafor (Chief of Staff)
- **Strategy:** Hiroshi Tanaka (Managing Director), Sven Larsen (Strategy Director)
- **Talent:** Daniel Brandt (Talent Partner), Marta Kowalski (Recruiter)
- **People Operations:** Sofia Marchetti (Head of People), Priya Nair (People Operations Lead)
- **Controlling:** Marcus Lindqvist (CFO), Grace Chen (Financial Controller)
- **Treasury:** Thomas Reyes (Treasury Analyst), Aisha Rahman (Treasury Analyst)
- **Logistics:** Omar Haddad (Logistics Lead), Diego Fernández (Logistics Analyst)
- **Coordination:** Lena Hofmann (Head of Operations), Yuki Sato (Operations Coordinator)
- **Platform:** Arjun Mehta (Head of Engineering), Mateo Rossi (Platform Engineer)
- **Product Engineering:** Clara Nilsson (Senior Engineer), Sarah Lindgren (Product Engineer)
- **Enterprise:** James Whitfield (Account Director), Tobias Mahr (Enterprise AE)
- **Regional:** Isabella Santos (Head of Sales), Nadia Khan (Sales Lead, APAC)
- **Brand:** Olivia Bergström (Head of Marketing), Felix Andersson (Brand Lead)
- **Content:** Mei Lin (Content Lead), Hana Suzuki (Content Strategist)
- **Office & Facilities:** Henry Park (Office Director), Lucas Moreau (Facilities Lead)
- **Executive Support:** Zara Ahmed (Executive Assistant), Camille Dubois (Executive Assistant)

### 4.5 Derived helpers (keep these names/signatures)

```
deptName(key)               -> string
sectionsOf(deptKey)         -> Section[]
sectionName(dept, secKey)   -> string
sectionTag(dept, secKey)    -> string
photoUrl(emp)               -> string   // placeholder portrait URL
initials(name)              -> string   // monogram fallback, e.g. "OH"
emailOf(emp)                -> string   // firstname.lastname@sp.co
countIn(deptKey)            -> number
countInSection(secKey)      -> number
deptRoster(deptKey)         -> Employee[]   // used by the photobook paging
greeting()                  -> "Good morning|afternoon|evening"
filterPeople(dept, section, query) -> Employee[]
```

---

## 5. Navigation flow & state

```
Landing  →  Login  →  Departments  →  Sections  →  Directory  →  Photobook
                                                       ↑              (overlay)
                                          (filter by section/search)
```

App-level state: `view` (which screen), `dept`, `section` (or `"all"`),
`query` (search), and `book` (the open photobook: `{ list, index }` or null).
Screen changes run through a single `go(next, payload)` that plays the fade
transition and scrolls to top.

- **Login** accepts anything (demo). Real auth is future scope — see §8.
- **Departments → Sections:** sets `dept`.
- **Sections → Directory:** sets `dept` + `section`, clears search.
- **Directory → Photobook:** opens `book` with `list = deptRoster(dept)` (the
  **whole department**, regardless of the current section/search filter) and
  `index` = the tapped person's position. This is intentional: the photobook
  pages through the entire department.
- Back links: Directory → Sections, Sections → Departments. Sign out → Landing.

---

## 6. Responsive strategy

One codebase, two layouts, chosen by viewport width:

- **≤ 640px → mobile layout** (app-like: sticky bars, list rows, bottom sheet).
- **> 640px → web layout** (editorial masthead, multi-column grids, dialog).

The **prototype also includes a "Preview · Web / Mobile" toggle and a phone
frame** so both layouts can be demoed on one screen. **Remove these in the real
app** — production should just respond to the real viewport.

---

## 7. Screen-by-screen behavior

For each screen: same content and tokens across web/mobile; layout differs.

### 7.1 Landing
- Masthead (wordmark `SP` + "Edition · MMXXVI" eyebrow on web; compact on mobile).
- Eyebrow "Internal · The Company Handbook", a large serif headline
  ("A quiet place to know the people you work with."), a one-paragraph lede, and
  a primary "Enter the handbook" button. Soft radial-gradient background.
- Web shows a small numbered contents row (01 Departments / 02 Sections /
  03 People & profiles). Mobile pins the button toward the bottom (thumb reach).
- Content reveals with a staggered fade-up.

### 7.2 Login
- "Open the handbook" with Email + Password fields and a Sign-in button.
- Web: centered card. Mobile: full-width fields, button near the bottom, back
  chevron in the app bar. Enter key submits. Any input proceeds (demo).

### 7.3 Departments (Dashboard)
- Greeting eyebrow ("Good morning/…"), title, short lede.
- Web: responsive grid (1→4 cols) of department cards — number (01–08), name,
  tag, section count, "View sections →"; cards lift on hover.
- Mobile: full-width list rows — number, name, tag, "{n} sections · {n} people",
  chevron; press-down feedback. Sign-out icon in the app bar.

### 7.4 Sections (org chart)
- Title = department name; lede = department tag.
- Web: a classic top-down **org tree** — a navy department "node" branching via
  hairline connectors to its 2 section cards (number, name, tag, people count,
  "View people →").
- Mobile: a **vertical spine tree** — the department node on top, then a hairline
  rail down the left with elbow ticks into stacked section cards.
- Tapping a section → Directory for that section.

### 7.5 Directory (people)
- Header: department eyebrow, title (section or whole department), tag, and a
  people count.
- **Live search** (name / title / department / section) + **section chips**
  ("All of {Department}" + each section). Web: search bar + wrapped chips.
  Mobile: a sticky sub-header with the search field and a horizontally
  scrolling chip row.
- People: web = responsive grid of centered cards (round avatar, name, title,
  section pill). Mobile = list rows (avatar left; name/title/section; chevron).
- Empty state when nothing matches. Tapping a person opens the Photobook.

### 7.6 Photobook (profile) — the centerpiece
A paged, editorial profile that flips through the **whole department**, looping.

**Layout (both platforms), per the reference:**
- **Row 1 — two columns:** a tinted text panel (`--panel`) on the left with the
  section pill, name, "Title — Department", an italic pull-quote (the motto),
  the bio, and a contact list (email / extension / location); and a **photo** on
  the right.
- **Row 2 — one column:** a **full-width photo** (a monochrome companion frame,
  with a small location caption pill).
- Two photos per person. Since sample data has one source portrait each, the
  second frame is a desaturated (`grayscale`) treatment of the same image — a
  standard magazine pairing. With real data, these can be two distinct photos.
- Mobile stacks sensibly: row 1 = wording + a square photo; then bio + contacts
  full width; then the wide photo; then a sticky bottom nav bar.

**Paging & gestures:**
- **Next / Previous** loop through `deptRoster(dept)` (wraparound via modulo).
- **Swipe** left/right (touch) and **click-drag** left/right (mouse) flip pages.
- Each flip animates **directionally** (incoming page slides in from the side it
  came from, with a slight 3-D `rotateY` page-turn).
- Web: a page counter ("03 / 06") + dot indicators; **arrow keys** ←/→ flip,
  **Esc** closes.
- Web presents as a centered dialog over a dimmed/blurred backdrop; mobile as a
  slide-up **bottom sheet** with a grab handle and a sticky Prev / "x of n" /
  Next bar.
- Vertical scrolling must keep working on mobile — only a clear horizontal swipe
  flips.

---

## 8. Out of scope now / future work

- **Real authentication** (right now login accepts anything). Likely an
  email/SSO provider later.
- **Real data via Supabase** — the data layer (§4.5) is the seam. Implement the
  same helper interface against Supabase tables (`departments`, `sections`,
  `employees`) and the UI shouldn't need changes.
- **Real photography** — replace the placeholder portrait source; the two-photo
  photobook then shows two genuine images per person.
- **Admin/editing** of people and structure.

---

## 9. Definition of done

- Next.js App Router + TS + Tailwind project that runs locally and deploys to
  Vercel; README with run + deploy steps.
- Visual parity with `SPHandbook.jsx` (palette, fonts, spacing, layouts) on both
  desktop and phone widths, with the prototype's preview toggle/phone frame
  removed.
- Full flow works: Landing → Login → Departments → Sections → Directory →
  Photobook, including search, chips, and department-wide photobook paging with
  swipe/drag/keys.
- Installable as a PWA; portraits served through `next/image` with the
  monogram fallback; `prefers-reduced-motion` and keyboard focus respected.
- Sample data lives behind the typed data layer, ready to swap for Supabase.
