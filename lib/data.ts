/**
 * Data layer for SP Handbook.
 *
 * Today this returns in-memory mock data. It is the single seam intended to be
 * reimplemented against Supabase later: keep the exported helper names and
 * signatures stable and the UI will not need to change. (The synchronous
 * helpers can become async/server queries; the screens already await nothing
 * but read derived arrays, so the swap is contained here.)
 */

import type {
  Branch,
  Department,
  DeptKey,
  Employee,
  Section,
  SortKey,
} from "./types";

/** The company at the top of the org tree. */
export const COMPANY = "SPPG";

export const DEPARTMENTS: Department[] = [
  { key: "management", name: "Management", tag: "Direction, stewardship, and the long view." },
  { key: "hr", name: "Human Resources", tag: "Hiring, wellbeing, and the shape of the team." },
  { key: "finance", name: "Finance", tag: "Numbers, planning, and steady footing." },
  { key: "operations", name: "Operations", tag: "The quiet machinery that keeps us moving." },
  { key: "engineering", name: "Engineering", tag: "Building the things, and keeping them running." },
  { key: "sales", name: "Sales", tag: "Conversations that turn into partnerships." },
  { key: "marketing", name: "Marketing", tag: "Story, taste, and how we sound." },
  { key: "admin", name: "Administration", tag: "Logistics, spaces, and everything in between." },
  { key: "projects", name: "Projects", tag: "Bringing power to homes, industry, and the city." },
];

export const SECTIONS: Record<DeptKey, Section[]> = {
  management: [
    { key: "m-exec", name: "Executive Office", tag: "The leadership of the company." },
    { key: "m-strat", name: "Strategy", tag: "Where the long-term plans are shaped." },
  ],
  hr: [
    { key: "hr-talent", name: "Talent", tag: "Finding and welcoming new colleagues." },
    { key: "hr-ops", name: "People Operations", tag: "Wellbeing, benefits, and belonging." },
  ],
  finance: [
    { key: "fin-control", name: "Controlling", tag: "Reporting, planning, and the books." },
    { key: "fin-treasury", name: "Treasury", tag: "Cash, currency, and capital." },
  ],
  operations: [
    { key: "ops-logistics", name: "Logistics", tag: "Suppliers, shipping, and supply." },
    { key: "ops-coord", name: "Coordination", tag: "Schedules, spaces, and standards." },
  ],
  engineering: [
    { key: "eng-platform", name: "Platform", tag: "The infrastructure underneath everything." },
    { key: "eng-product", name: "Product Engineering", tag: "Building what people actually use." },
  ],
  sales: [
    { key: "sal-enterprise", name: "Enterprise", tag: "Our largest partnerships." },
    { key: "sal-regional", name: "Regional", tag: "Markets across the world." },
  ],
  marketing: [
    { key: "mkt-brand", name: "Brand", tag: "How SP looks and feels." },
    { key: "mkt-content", name: "Content", tag: "The stories we tell." },
  ],
  admin: [
    { key: "adm-office", name: "Office & Facilities", tag: "The places we work." },
    { key: "adm-support", name: "Executive Support", tag: "A step ahead of the day." },
  ],
  // Projects has a three-level org chart: TRP / RCP / DP branches, each with its
  // own sections (see the `branch` field and branchesOf below).
  projects: [
    { key: "prj-ep", name: "EP", tag: "Electrical projects.", branch: "TRP" },
    { key: "prj-ehv", name: "EHV", tag: "Extra-high-voltage projects.", branch: "TRP" },
    { key: "prj-nrp", name: "NRP", tag: "Network renewal projects.", branch: "RCP" },
    { key: "prj-cpe", name: "CPE", tag: "Customer Projects East.", branch: "RCP" },
    { key: "prj-cpw", name: "CPW", tag: "Customer Projects West.", branch: "RCP" },
    { key: "prj-dp1", name: "DP 1", tag: "Development project 1.", branch: "DP" },
    { key: "prj-dp2", name: "DP 2", tag: "Development project 2.", branch: "DP" },
    { key: "prj-dp3", name: "DP 3", tag: "Development project 3.", branch: "DP" },
    { key: "prj-dp4", name: "DP 4", tag: "Development project 4.", branch: "DP" },
    { key: "prj-dp5", name: "DP 5", tag: "Development project 5.", branch: "DP" },
  ],
};

export const EMPLOYEES: Employee[] = [
  { id: 1, name: "Jimmy Khoo", dept: "management", section: "m-exec", title: "Chief Executive", loc: "Singapore", ext: "100", g: "m", p: 68, photo: "/people/jimmy-khoo-sq.jpg", photo2: "/people/jimmy-khoo.jpg", motto: "Decide slowly, act once.", bio: "Jimmy has led SP since its founding, arriving by way of industrial design. He is known for long walks before large decisions and a steady, unhurried hand." },

  // Projects · Customer Projects East (CPE) — real SP Group colleagues.
  { id: 33, name: "Wai Moe Kyaw", dept: "projects", section: "prj-cpe", title: "Principal Engineer", loc: "Singapore", ext: "301", photo: "/people/wai-moe-kyaw.jpg", photo2: "/people/wai-moe-kyaw-2.jpg", motto: "Well-lit streets — a quiet sense of fulfilment.", bio: "My name is Wai Moe Kyaw. You can call me Wai. I am from Myanmar, born in 86 and youngest among the siblings. I have joined SP Group in 2012 and been in CPE since day one. I enjoy my office life since we have friendly and helpful colleagues, making me feel appreciated and acknowledged. We have occasional team bonding and lunch sessions that maintain the synergy and strong team spirit.\n\nMy work involves providing electricity supply to residential and industrial areas in various parts of Singapore. Seeing that the streets are well lit while bringing smiles to the public enables me a sense of fulfilment and accomplishment at the same time.\n\nFor myself, I love dogs and have a very cute toy poodle named “Rick”. As for hobbies, I play badminton and swim once in awhile. I like travelling and photography too.\n\nThat's all about myself. Thanks for visiting my profile. Cheers." },
  { id: 34, name: "Ng Guan Jie", dept: "projects", section: "prj-cpe", title: "Senior Technical Officer", loc: "Singapore", ext: "302", photo: "/people/ng-guan-jie.jpg", photo2: "/people/ng-guan-jie-2.jpg", motto: "Keeping the city running gives me a sense of belonging.", bio: "My name is Ng Guan Jie. I am born in 1983. I am the middle child in my family with an elder sister and a younger brother.\n\nI have joined SP Group in 2007 and been in CPE since the first day of work. It's a challenging task as we need to handle customers request/feedback and also to manage contractor in order to complete projects in time.\n\nI am happy with my job as I have a team of helpful and friendly colleagues to tackle all the obstacle which we will face during project implementation.\n\nMy work involves in providing and upgrading supply to residential and industrial building. Providing energy to all of Singapore and keep the city running make me feel sense of belonging and fulfilment.\n\nFor myself, I am married with 2 kids. My hobbies are playing badminton, football and bringing my family out for movies and travelling holiday trips." },
  { id: 35, name: "Sheikh Mohammad Hafiz bin Suhaimi", dept: "projects", section: "prj-cpe", title: "Technical Officer", loc: "Singapore", ext: "303", photo: "/people/sheikh-hafiz.jpg", photo2: "/people/sheikh-hafiz-2.jpg", motto: "It's ‘we’, not ‘I’, that makes the team tick.", bio: "My name is Sheikh Mohd Hafiz. I have been working in SPPG for 15 years now, since 2007.\n\nMy job scope is mainly handling customer's project which is to provide new cables for customer's new premise. Keeping up with customer's demand in this fast-paced society has its own challenges and site situation is ever unpredictable, but the perks of it there will always be new knowledge for us to learn.\n\nI was a technician when I was being employed back in 2007. I took part time studies from 2009 till 2015 for career enhancement and was promoted to Technical officer in 2016.\n\nSPPG is great because of the opportunities to constantly upgrade ourselves as I have benefitted from it and there are many courses provided for our knowledge enhancement which are for our job scopes and also courses for us to build a better working environment with our colleagues.\n\nAs for my spare time, football is my passion and kick abouts is definitely i would look forward to for a bit of sweat and to relax. Family outings is also something I do like to do much just to have a strong healthy bond for my family.\n\nI enjoy working with my Team because of the teamwork and cooperation. The strong emphasis of the word ‘We’ rather than ‘I’ that makes the team tick as a family, and it makes the team have a strong working relationship. And it does make our everyday challenges a bit easier and definitely less stressful." },
  { id: 36, name: "Muhammad Amin Bin Ibrahim", dept: "projects", section: "prj-cpe", title: "Technical Officer", loc: "Singapore", ext: "304", photo: "/people/muhammad-amin.jpg", photo2: "/people/muhammad-amin-2.jpg", motto: "Power on — I'm energy efficient.", bio: "Hello! I'm Muhammad Amin. A Technical officer at Customer Projects East since 2013. My duty is to provide new electricity supply to residential and commercial building to the eastern part of Singapore. A great team player and always giving my best to deliver for work.\n\nEvery day here is a learning process. Not all time the grass is always green but end of the day we remained committed to finish our projects timely. This job gives me a sense of accomplishment delivering power to our nation. I'm energy efficient.\n\nOne of my memorable moments in SP was able to join the marching contingent for SG50 NDP. It is also the first time SP taking part. I am grateful for the opportunity and truly unforgettable experience. Power on!!!\n\nWhen I'm not on work I always like playing soccer. That's how I work out and let loose some of my stress. I also go fishing occasionally when I'm free too. Remember to always make time to enjoy life.\n\nThanks for taking time to visit my profile. Cheers" },
  { id: 37, name: "Marvin Yip Zhiming", dept: "projects", section: "prj-cpe", title: "Head of Section", loc: "Singapore", ext: "305", photo: "/people/marvin-yip.jpg", photo2: "/people/marvin-yip-2.jpg", motto: "My success is also my mentors' success.", bio: "My name is Yip Zhiming Marvin. In 2010, I joined CPE after graduating from NUS. Being my first job, it was an eye-opening experience seeing the senior engineers commissioned substations and telling me of stories of the many buildings they have provided supply to. I strove to be like them wanting to leave a legacy for myself. I have witnessed the transformation of the Northern part of Singapore, seeing the various HDB BTO, industrial buildings being built from the ground up.\n\nPart of the joy working in SPPG, is the camaraderie I share with my fellow colleagues. We have weathered through many storms together and we always joke that our bonds were forged through fire. Working in SPPG has also exposed me to different opportunities. I have attained my Advanced Certificate in Training and Assessment and teaching new engineers in SIPG too.\n\nIn my 12 years in CPE, I have grown with the company. From being single, to being married and now with 3 kids. I would like to thank the various mentors that have guided me though all the difficulties and I always tell them, my success is also their success." },
  { id: 38, name: "Lee Wen Xiang", dept: "projects", section: "prj-cpe", title: "Technical Officer", loc: "Singapore", ext: "306", photo: "/people/lee-wen-xiang.jpg", photo2: "/people/lee-wen-xiang-2.jpg", motto: "Teammates pull each other up.", bio: "My name is Lee Wen Xiang. I have been working in SPPG for about 2 years now, since 2020.\n\nMy daily tasks include conducting Toolbox Meetings, issuing work orders and vouchers for daily jobs while monitoring the upcoming jobs schedule.\n\nI was brought into SP Group through a career talk in my 2nd year of study in Singapore Polytechnic, which I eventually signed the contract with EMA and SP Group under the Energy Industry Scholarship. During the interview for this scholarship, I shared my poly intern experience of working under Cathay Cineplex to the interviewer and they are fascinated by my experience in dealing with nasty customers. I strongly believed that has led me into the Customer Project Department where I am in now.\n\nEvery site constrain is a memorable moment. Things we expect to be able to finish within two days will drag through the week, be it customer lead in pipes or cable route is impossible to follow, every time I've overcome these challenges are an achievement to me. People around my team are willing to share their knowledge with each other and we help each other grow. It's great when teammates pull each other up.\n\nIn my past spare time, I like to spend my time building model figurine called Gundam, however due to work schedules, I have dropped that hobby and spend more on watching shows.\n\nI enjoy working with my team because of how they help each other. As one who is embarking on a part time studies, my senior officers are understanding too, and they show full support for this decision. I'm grateful that I'm with a good team." },
  { id: 39, name: "Abdul Majid Bin Abdul Hamid", dept: "projects", section: "prj-cpe", title: "Senior Technician", loc: "Singapore", ext: "307", photo: "/people/abdul-majid.jpg", photo2: "/people/abdul-majid-2.jpg", motto: "Forty-five years on, the good times stay with me.", bio: "My name is Abdul Majid Bin Abdul Hamid. I have been working in SPPG since 1977 and just received 45 years long service award recently. When I joined the company in 1977, I first started as a member of mandor gang where I mainly handled excavation for cable laying. Subsequently, I was assigned as a cable jointer.\n\nCurrently, I am working as a senior technician at Customer Projects East (CPE) fitter team. My daily task includes 22kV and 6.6kV cable diversion works and OWTS. Our fitter team share a close bond among us. We used to have more members in our team previously, many of whom have retired. Although they are no longer with the company, I still remember the good times we shared together.\n\nIn my spare time, I like to go fishing at seaside in Pasir Ris since it is a great way for me to relax. I am married and have two daughters.\n\nI love to go shopping and enjoy vacation with my family during holiday. Finally, I would like to thank my colleagues, my superiors and my family for all the support throughout my career in SPPG." },
];

/* ----------------------------- Derived helpers ----------------------------- */

export const deptName = (k: DeptKey | string): string =>
  DEPARTMENTS.find((d) => d.key === k)?.name ?? String(k);

export const sectionsOf = (k: DeptKey | string): Section[] =>
  SECTIONS[k as DeptKey] ?? [];

export const sectionName = (d: DeptKey | string, s: string): string =>
  sectionsOf(d).find((x) => x.key === s)?.name ?? s;

export const sectionTag = (d: DeptKey | string, s: string): string =>
  sectionsOf(d).find((x) => x.key === s)?.tag ?? "";

/**
 * Returns the Branches (middle tier) for a department whose sections define a
 * `branch`, preserving first-seen order. Returns null for the usual two-level
 * departments so callers can render the flat layout.
 */
export const branchesOf = (k: DeptKey | string): Branch[] | null => {
  const secs = sectionsOf(k);
  if (!secs.some((s) => s.branch)) return null;
  const order: string[] = [];
  const map = new Map<string, Section[]>();
  for (const s of secs) {
    const b = s.branch ?? "Other";
    if (!map.has(b)) {
      map.set(b, []);
      order.push(b);
    }
    map.get(b)!.push(s);
  }
  return order.map((key) => ({ key, sections: map.get(key)! }));
};

/** Portrait URL: a real photo when provided, else the placeholder source. */
export const photoUrl = (e: Employee): string =>
  e.photo ??
  `https://randomuser.me/api/portraits/${e.g === "w" ? "women" : "men"}/${e.p}.jpg`;

/** Monogram fallback, e.g. "OH". */
export const initials = (n: string): string =>
  n
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("");

/** firstname.lastname@sp.co */
export const emailOf = (e: Employee): string =>
  `${e.name
    .toLowerCase()
    .replace(/[^a-z ]/g, "")
    .replace(/ /g, ".")}@sp.co`;

export const countIn = (k: DeptKey | string): number =>
  EMPLOYEES.filter((e) => e.dept === k).length;

export const countInSection = (s: string): number =>
  EMPLOYEES.filter((e) => e.section === s).length;

/** The whole department, in roster order — used by the photobook paging. */
export const deptRoster = (k: DeptKey | string): Employee[] =>
  EMPLOYEES.filter((e) => e.dept === k);

export const greeting = (): "Good morning" | "Good afternoon" | "Good evening" => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
};

export const filterPeople = (
  dept: DeptKey | string,
  section: string,
  query: string,
): Employee[] => {
  let base = EMPLOYEES.filter((e) => e.dept === dept);
  if (section !== "all") base = base.filter((e) => e.section === section);
  const q = query.trim().toLowerCase();
  if (!q) return base;
  return base.filter(
    (e) =>
      e.name.toLowerCase().includes(q) ||
      e.title.toLowerCase().includes(q) ||
      deptName(e.dept).toLowerCase().includes(q) ||
      sectionName(e.dept, e.section).toLowerCase().includes(q),
  );
};

/** Branch name for an employee's section, if any (e.g. CPE → "RCP"). */
const branchOf = (e: Employee): string =>
  sectionsOf(e.dept).find((s) => s.key === e.section)?.branch ?? "";

/**
 * Global people search across the whole company — by name, title, department,
 * branch, or section. Empty query returns everyone. Always sorted A–Z by name.
 */
export const searchPeople = (query: string): Employee[] => {
  const q = query.trim().toLowerCase();
  const base = q
    ? EMPLOYEES.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          e.title.toLowerCase().includes(q) ||
          deptName(e.dept).toLowerCase().includes(q) ||
          branchOf(e).toLowerCase().includes(q) ||
          sectionName(e.dept, e.section).toLowerCase().includes(q),
      )
    : [...EMPLOYEES];
  return base.sort((a, b) => a.name.localeCompare(b.name));
};

/** ----------------------------- Companies ---------------------------------
 * The top of the org tree: SP Group is made of companies, each holding
 * departments. Today only SPPG is populated (CEO + Projects).
 */
export interface Company {
  key: string;
  name: string;
  deptKeys: DeptKey[];
}

export const COMPANY_GROUP = "SP Group";

export const COMPANIES: Company[] = [
  { key: "sppa", name: "SPPA", deptKeys: [] },
  { key: "sppg", name: "SPPG", deptKeys: ["projects"] },
  { key: "sps", name: "SPS", deptKeys: [] },
];

export const companyName = (k: string): string =>
  COMPANIES.find((c) => c.key === k)?.name ?? String(k);

export const isCompanyKey = (k: string): boolean =>
  COMPANIES.some((c) => c.key === k);

/** Departments that belong to a company. */
export const companyDepartments = (k: string): Department[] => {
  const c = COMPANIES.find((x) => x.key === k);
  return c ? DEPARTMENTS.filter((d) => c.deptKeys.includes(d.key)) : [];
};

/** The CEO shown at the top of a company's org (SPPG → the Chief Executive). */
export const ceoOf = (k: string): Employee | null =>
  k === "sppg" ? (EMPLOYEES.find((e) => e.title === "Chief Executive") ?? null) : null;

/** People in a company = its departments' people + its CEO. */
export const peopleInCompany = (k: string): number => {
  const c = COMPANIES.find((x) => x.key === k);
  if (!c) return 0;
  return (
    EMPLOYEES.filter((e) => c.deptKeys.includes(e.dept)).length +
    (ceoOf(k) ? 1 : 0)
  );
};

/** Which company a department belongs to (or null). */
export const companyOfDept = (dept: string): string | null =>
  COMPANIES.find((c) => c.deptKeys.includes(dept as DeptKey))?.key ?? null;

/** Every real uploaded photo (primary + companion), de-duplicated.
 * Used by the home-page photo mosaic; grows automatically as people are added. */
export const allPhotoUrls = (): string[] => {
  const set = new Set<string>();
  for (const e of EMPLOYEES) {
    if (e.photo) set.add(e.photo);
    if (e.photo2) set.add(e.photo2);
  }
  return [...set];
};

/** All department keys, useful for static params / validation. */
export const isDeptKey = (k: string): k is DeptKey =>
  DEPARTMENTS.some((d) => d.key === k);

/** Short label for a directory sort mode. */
export const sortLabel = (k: SortKey): string =>
  k === "az" ? "A–Z" : k === "za" ? "Z–A" : "Title";
