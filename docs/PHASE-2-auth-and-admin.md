# SP Handbook — Phase 2: Auth, Roles & Admin

This spec covers turning the current no-auth, mock-data app into a real,
multi-user product with **two roles** and an **admin editing area**, backed by
**Supabase**. It is the plan to review *before* building.

Decisions locked in (from review):

- **Backend:** Supabase (Auth + Postgres + Storage + Row-Level Security).
- **Account creation:** both **admin invite** *and* **self sign-up** with a
  company email.
- **People vs. logins:** **separate** — directory entries are content managed by
  admins; login accounts (admin/member) are their own thing. A member just views
  the handbook and manages their own account (e.g. password).

---

## 1. Roles

| Capability | Member | Admin |
|---|---|---|
| Log in / log out | ✅ | ✅ |
| Browse departments, sections, directory, photobook | ✅ | ✅ |
| Change own account settings (password, etc.) | ✅ | ✅ |
| Add / edit / delete people (name, title, bio, photos, section…) | ❌ | ✅ |
| Upload / replace profile photos | ❌ | ✅ |
| Invite users / change roles | ❌ | ✅ |

Roles are enforced **in the database** via Row-Level Security, not just in the
UI — so a member literally cannot write data even if they bypass the interface.

---

## 2. Accounts & sign-in

- **Auth method:** email + password (Supabase Auth). Password reset via
  Supabase's built-in email flow.
- **Self sign-up:** anyone with an allowed company email domain (**`@sp.co`** —
  confirm) can register; they get the **member** role by default. (Email
  confirmation on/off — see open questions.)
- **Admin invite:** an admin invites a person by email and picks their role
  (member or admin). The invitee sets a password on first login.
- **First admin:** bootstrapped once (via the Supabase dashboard or seed) since
  there's no admin to invite the first admin.
- **Domain restriction** for self sign-up is enforced server-side (a trigger /
  pre-sign-up check), not only in the form.

---

## 3. Data model (Postgres)

SP is large and still being mapped, so instead of a fixed number of levels we
model **every box in the org chart as one row in an `org_units` table that
points to its parent**. New branches, sections — even new levels — are then just
*data an admin adds*, never an app change.

**Levels (top → bottom), with the leader title each carries:**

| kind | example | leader |
|---|---|---|
| `company` | SPPG | CEO |
| `department` | Projects | HOD |
| `branch` | TRP · RCP · DP | HOB |
| `section` | NRP · CPE · CPW | HOS |

People are attached to the **deepest box** they belong to (usually a Section).

```
org_units                              -- every node of the org chart
  id           uuid  primary key
  name         text                    -- "SPPG", "Projects", "RCP", "CPE"
  short_name   text  null              -- optional abbreviation
  kind         text  check (kind in ('company','department','branch','section'))
  parent_id    uuid  null → org_units.id   -- null only for the root (SPPG)
  head_id      uuid  null → employees.id   -- the CEO / HOD / HOB / HOS of this unit
  tag          text  null
  position     int                     -- order among siblings

employees
  id           uuid  primary key
  name         text
  unit_id      uuid  → org_units.id     -- the box they sit in (usually a Section)
  title        text
  loc          text
  ext          text
  motto        text
  bio          text                    -- "wording": paragraphs separated by blank lines
  photo_url    text  null              -- Storage URL (primary portrait)
  photo2_url   text  null              -- Storage URL (companion photo)
  position     int
  created_at   timestamptz default now()
  updated_at   timestamptz

profiles                               -- one row per login account (id = auth user id)
  id           uuid  primary key  → auth.users.id
  email        text
  role         text  check (role in ('admin','member')) default 'member'
  full_name    text  null
  created_at   timestamptz default now()
```

- **A Branch is optional.** Projects goes Department → **Branch** → Section; the
  other 8 departments can hold Sections directly (Department → Section). The tree
  handles both, and can go deeper later if SP needs it.
- **Each unit can have a `head`** (an employee) shown with the right title —
  CEO at SPPG, HOD at a department, HOB at a branch, HOS at a section.
- **Mapping today's data:** `SPPG (company)` → `Projects (department)` →
  Branches `TRP / RCP / DP` → Sections (`EP, EHV` under TRP; `NRP, CPE, CPW`
  under RCP; `DP 1…5` under DP). The 7 people sit in the **CPE section**. The
  current `sections.group` idea becomes real Branch + Section nodes.
- **Storage bucket** `portraits` holds uploaded photos; `photo_url`/`photo2_url`
  point at them.

---

## 4. Row-Level Security (the real guard)

A small SQL helper:

```sql
create function is_admin() returns boolean as $$
  select exists (
    select 1 from profiles
    where id = auth.uid() and role = 'admin'
  );
$$ language sql security definer stable;
```

Policies:

- `org_units`, `employees`
  - **SELECT:** any authenticated user.
  - **INSERT / UPDATE / DELETE:** `is_admin()` only.
- `profiles`
  - **SELECT/UPDATE own row:** `id = auth.uid()`.
  - **SELECT all / UPDATE role:** `is_admin()`.
- Storage `portraits`
  - **read:** authenticated; **write/delete:** `is_admin()`.

---

## 5. App architecture changes

- **Supabase clients:** `lib/supabase/server.ts` (server components / actions,
  reads the user's session cookie) and `lib/supabase/client.ts` (browser).
- **Env vars** (in `.env.local`, gitignored):
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY` (server only — for invites/admin tasks)
- **Reads:** the screens fetch from Supabase in **server components** and pass
  data into the existing client UI as props (keeps the current look; the helper
  names like `deptRoster`, `filterPeople` move into `lib/data.ts` as async
  queries). Search/sort stay client-side over the fetched list.
- **Writes:** **Next.js Server Actions** for add/edit/delete and photo upload,
  using the server client + the user's session. RLS enforces admin.
- **Route protection:** middleware redirects unauthenticated users to `/login`;
  admin-only routes (`/admin/**`) check the role.

---

## 6. Screens to build

**Auth**
- `/login` — real sign-in (replaces the demo).
- `/signup` — self sign-up (company-email gated).
- `/forgot-password` + reset handling.
- Invite-acceptance / email-confirmation landing.

**Everyone (member + admin)**
- Existing browse screens, now read-only from the DB.
- **Global "Find people" search** — a **search button in the header** (on every
  page) that opens a page searching **all** people across every department /
  branch / section at once (by name, title, department, branch, section). Results
  are cards that open the photobook, just like the directory. This complements
  the current *within-a-department* search.
- `/account` — settings: change password (and view name/email). No
  profile-content editing.

**Admin** (role-gated)
- Edit affordances in the directory/photobook: **Add person**, **Edit**, **Delete**.
- **Person form** — with **cascading dropdowns** that filter each other:
  1. **Department** (dropdown)
  2. **Branch** (dropdown — options filtered to the chosen department; optional /
     hidden when the department has no branches)
  3. **Section** (dropdown — options filtered to the chosen branch/department)
  then **Name**, **Photo(s)** (primary + companion, uploaded to Storage),
  **Motto**, **Wording / bio**, plus Title, Location, Extension.
  Save / Cancel / Delete.
- **Org units** — add/rename/reorder departments, branches, sections (nodes in
  the tree) and assign each unit's **head** (CEO / HOD / HOB / HOS).
- **Users & roles** — list accounts, **invite** by email, set member/admin.

A small **"Admin"** badge/menu appears in the header for admins; members never
see edit controls.

---

## 7. Migrating today's data

- A one-time **seed**: build the `org_units` tree (SPPG → Projects →
  TRP/RCP/DP → their sections, plus the other 8 departments and their sections)
  and insert all `EMPLOYEES` (including the 7 real CPE people) into Supabase, then
  **upload the local `/public/people/*` photos** into the `portraits` bucket,
  setting `photo_url`/`photo2_url`.
- Bootstrap the **first admin** account.
- The mock arrays can then be removed; `lib/data.ts` becomes the Supabase
  query layer with the same exported function names.

---

## 8. Suggested build phases (each is reviewable)

- **A — Foundation:** Supabase project, schema + RLS, seed data + photo upload,
  env config, Supabase clients. App reads from the DB but is still view-only.
- **B — Auth:** real login, self sign-up (`@sp.co`), sessions, route guards,
  roles; member **account settings** (password).
- **C — Admin CRUD:** add / edit / delete people + photo upload via server
  actions; admin-only UI.
- **D — User management & org editing:** admin **invites** + role management;
  add/edit org units (departments / branches / sections) and assign heads;
  validation and polish.

---

## 9. What I'll need from you

1. **A Supabase project** (free tier is fine) — its **URL**, **anon key**, and
   **service-role key**. I'll keep them in `.env.local` (never committed). I can
   walk you through creating it.
2. The **first admin's email**.
3. Confirm the allowed **email domain** for self sign-up (`@sp.co`?).
4. Whether **email confirmation** is required on self sign-up (more secure) or
   off (faster onboarding for the demo).

## 10. Open questions

- Email confirmation: **on** or **off** to start?
- **Hierarchy:** confirmed Company (SPPG) → Department → **Branch (optional)** →
  Section → People, modelled as a flexible tree so it can grow. The 8 original
  departments stay Department → Section (no branch) unless you add branches later.
  Confirm this naming is right.
- **Unit heads:** show each unit's leader (CEO/HOD/HOB/HOS) on the org chart /
  section pages? (Nice-to-have; the `head_id` field supports it.)
- Should admins manage the **org tree** (add branches/sections) in v1, or is
  editing **people** enough to start (org tree seeded by me)?
- Any need for an **audit trail** (who changed what), or skip for v1?
- Members editing *their own* directory profile later? (Out of scope now — we
  chose "separate".)

> **Can ship early (no backend needed):** the global **"Find people" search**
> works over the data we already have, so it can be built now against the
> current mock data and simply switch to Supabase later — a nice quick win while
> the Supabase project is being set up.

---

*Hosting note:* this all deploys cleanly on Vercel with the Supabase env vars
set in the Vercel project. (Local `next start` is flaky only because the project
sits in a OneDrive-synced folder; dev and Vercel are unaffected.)
