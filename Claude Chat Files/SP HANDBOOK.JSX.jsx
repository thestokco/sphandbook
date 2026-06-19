import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Search, X, ArrowRight, ArrowLeft, Mail, Phone, MapPin, LogOut,
  ChevronLeft, ChevronRight,
} from "lucide-react";

/* ============================================================================
   THE MERIDIAN HANDBOOK — calm, editorial employee handbook & people directory.
   Single file · React + Tailwind · no backend · WEB + MOBILE layouts.
   Flow: Landing → Login → Departments → Sections → Directory → Photobook.
   Profile is a paged "photobook": two photos per person; Next/Prev loops the
   whole department. Auto-detects screen size; a toggle forces Web / Mobile.
============================================================================ */

const DEPARTMENTS = [
  { key: "management",  name: "Management",      tag: "Direction, stewardship, and the long view." },
  { key: "hr",          name: "Human Resources", tag: "Hiring, wellbeing, and the shape of the team." },
  { key: "finance",     name: "Finance",         tag: "Numbers, planning, and steady footing." },
  { key: "operations",  name: "Operations",      tag: "The quiet machinery that keeps us moving." },
  { key: "engineering", name: "Engineering",     tag: "Building the things, and keeping them running." },
  { key: "sales",       name: "Sales",           tag: "Conversations that turn into partnerships." },
  { key: "marketing",   name: "Marketing",       tag: "Story, taste, and how we sound." },
  { key: "admin",       name: "Administration",  tag: "Logistics, spaces, and everything in between." },
];

const SECTIONS = {
  management: [ { key: "m-exec", name: "Executive Office", tag: "The leadership of the company." }, { key: "m-strat", name: "Strategy", tag: "Where the long-term plans are shaped." } ],
  hr: [ { key: "hr-talent", name: "Talent", tag: "Finding and welcoming new colleagues." }, { key: "hr-ops", name: "People Operations", tag: "Wellbeing, benefits, and belonging." } ],
  finance: [ { key: "fin-control", name: "Controlling", tag: "Reporting, planning, and the books." }, { key: "fin-treasury", name: "Treasury", tag: "Cash, currency, and capital." } ],
  operations: [ { key: "ops-logistics", name: "Logistics", tag: "Suppliers, shipping, and supply." }, { key: "ops-coord", name: "Coordination", tag: "Schedules, spaces, and standards." } ],
  engineering: [ { key: "eng-platform", name: "Platform", tag: "The infrastructure underneath everything." }, { key: "eng-product", name: "Product Engineering", tag: "Building what people actually use." } ],
  sales: [ { key: "sal-enterprise", name: "Enterprise", tag: "Our largest partnerships." }, { key: "sal-regional", name: "Regional", tag: "Markets across the world." } ],
  marketing: [ { key: "mkt-brand", name: "Brand", tag: "How Meridian looks and feels." }, { key: "mkt-content", name: "Content", tag: "The stories we tell." } ],
  admin: [ { key: "adm-office", name: "Office & Facilities", tag: "The places we work." }, { key: "adm-support", name: "Executive Support", tag: "A step ahead of the day." } ],
};

const deptName    = (k) => DEPARTMENTS.find((d) => d.key === k)?.name ?? k;
const sectionsOf  = (k) => SECTIONS[k] ?? [];
const sectionName = (d, s) => sectionsOf(d).find((x) => x.key === s)?.name ?? s;
const sectionTag  = (d, s) => sectionsOf(d).find((x) => x.key === s)?.tag ?? "";

const EMPLOYEES = [
  { id: 1,  name: "Eleanor Voss",     dept: "management",  section: "m-exec",    title: "Chief Executive",        loc: "London",     ext: "100", g: "w", p: 68, motto: "Decide slowly, act once.", bio: "Eleanor has led Meridian since its founding, arriving by way of industrial design. She is known for long walks before large decisions and a steady, unhurried hand." },
  { id: 3,  name: "Amara Okafor",     dept: "management",  section: "m-exec",    title: "Chief of Staff",         loc: "New York",   ext: "102", g: "w", p: 90, motto: "Keep the room calm and the work moving.", bio: "Amara connects the leadership team to the rest of the company. She keeps a tidy desk and an even tidier set of priorities." },
  { id: 2,  name: "Hiroshi Tanaka",   dept: "management",  section: "m-strat",   title: "Managing Director",      loc: "Tokyo",      ext: "101", g: "m", p: 52, motto: "Quality is a series of small refusals.", bio: "Hiroshi oversees the firm's regional houses and partnerships. He believes the best work comes from saying no often and clearly." },
  { id: 25, name: "Sven Larsen",      dept: "management",  section: "m-strat",   title: "Strategy Director",      loc: "Oslo",       ext: "103", g: "m", p: 24, motto: "Plan in decades, act in days.", bio: "Sven maps where the company is heading and the routes to get there. He keeps a long horizon and a short to-do list." },
  { id: 5,  name: "Daniel Brandt",    dept: "hr",          section: "hr-talent", title: "Talent Partner",         loc: "Copenhagen", ext: "121", g: "m", p: 32, motto: "Hire for curiosity.", bio: "Daniel leads recruiting across the northern offices. He is convinced the right question matters more than the right résumé." },
  { id: 26, name: "Marta Kowalski",   dept: "hr",          section: "hr-talent", title: "Recruiter",              loc: "Warsaw",     ext: "123", g: "w", p: 16, motto: "A good fit is felt, then proven.", bio: "Marta sources talent across central Europe. She reads between the lines of a résumé and trusts a good conversation." },
  { id: 4,  name: "Sofia Marchetti",  dept: "hr",          section: "hr-ops",    title: "Head of People",         loc: "Milan",      ext: "120", g: "w", p: 44, motto: "People first; everything else follows.", bio: "Sofia shapes how it feels to work here, from a first interview to a tenth anniversary. She reads more than she speaks." },
  { id: 6,  name: "Priya Nair",       dept: "hr",          section: "hr-ops",    title: "People Operations Lead", loc: "Singapore",  ext: "122", g: "w", p: 65, motto: "The small kindnesses add up.", bio: "Priya runs onboarding, benefits, and the quiet logistics of belonging. New joiners remember her name on their first day." },
  { id: 7,  name: "Marcus Lindqvist", dept: "finance",     section: "fin-control",  title: "Chief Financial Officer", loc: "Stockholm", ext: "140", g: "m", p: 41, motto: "Patience compounds.", bio: "Marcus stewards the company's finances with a long horizon. He prefers boring quarters and durable decisions." },
  { id: 8,  name: "Grace Chen",       dept: "finance",     section: "fin-control",  title: "Financial Controller",   loc: "Singapore", ext: "141", g: "w", p: 79, motto: "Precision is a courtesy.", bio: "Grace owns the numbers that everyone relies on. Her reports are clean enough to read like prose." },
  { id: 9,  name: "Thomas Reyes",     dept: "finance",     section: "fin-treasury", title: "Treasury Analyst",       loc: "Manila",    ext: "142", g: "m", p: 76, motto: "Measure, then move.", bio: "Thomas watches cash flow and currency with a calm eye. He finds the rhythm in a spreadsheet." },
  { id: 27, name: "Aisha Rahman",     dept: "finance",     section: "fin-treasury", title: "Treasury Analyst",       loc: "Dubai",     ext: "143", g: "w", p: 39, motto: "Liquidity is peace of mind.", bio: "Aisha manages cash positions across the firm's accounts. She keeps a buffer and a clear head." },
  { id: 11, name: "Omar Haddad",      dept: "operations",  section: "ops-logistics", title: "Logistics Lead",        loc: "Dubai",   ext: "161", g: "m", p: 64, motto: "A good plan rarely shouts.", bio: "Omar coordinates suppliers and shipments across three continents. Things simply arrive when he says they will." },
  { id: 28, name: "Diego Fernández",  dept: "operations",  section: "ops-logistics", title: "Logistics Analyst",     loc: "Madrid",  ext: "163", g: "m", p: 72, motto: "Track everything; trust the data.", bio: "Diego optimizes shipping routes and supplier timelines. He finds the shortest path that still arrives intact." },
  { id: 10, name: "Lena Hofmann",     dept: "operations",  section: "ops-coord",     title: "Head of Operations",    loc: "Berlin",  ext: "160", g: "w", p: 12, motto: "Smooth is fast.", bio: "Lena keeps the company's day-to-day running without friction. She removes obstacles before anyone trips on them." },
  { id: 12, name: "Yuki Sato",        dept: "operations",  section: "ops-coord",     title: "Operations Coordinator", loc: "Osaka",  ext: "162", g: "w", p: 26, motto: "Order is a kind of calm.", bio: "Yuki keeps schedules, spaces, and standards in quiet alignment. Her checklists are works of restraint." },
  { id: 13, name: "Arjun Mehta",      dept: "engineering", section: "eng-platform",  title: "Head of Engineering",   loc: "Bangalore", ext: "180", g: "m", p: 18, motto: "Make it work, then make it quiet.", bio: "Arjun leads the teams that build and maintain our platform. He values systems that ask for very little attention." },
  { id: 15, name: "Mateo Rossi",      dept: "engineering", section: "eng-platform",  title: "Platform Engineer",     loc: "Turin",     ext: "182", g: "m", p: 85, motto: "Boring software is good software.", bio: "Mateo keeps the infrastructure steady and unremarkable, which is exactly the point. He sleeps well on release days." },
  { id: 14, name: "Clara Nilsson",    dept: "engineering", section: "eng-product",   title: "Senior Engineer",       loc: "Gothenburg",ext: "181", g: "w", p: 33, motto: "Read the code twice.", bio: "Clara writes the kind of software people forget to worry about. She reviews carefully and ships with confidence." },
  { id: 29, name: "Sarah Lindgren",   dept: "engineering", section: "eng-product",   title: "Product Engineer",      loc: "Stockholm", ext: "183", g: "w", p: 53, motto: "Ship small, ship often.", bio: "Sarah builds the features customers touch every day. She prefers many small releases to one large promise." },
  { id: 17, name: "James Whitfield",  dept: "sales",       section: "sal-enterprise",title: "Account Director",      loc: "London",    ext: "201", g: "m", p: 3, motto: "A handshake is a promise.", bio: "James looks after our largest accounts with old-fashioned care. Clients stay because he keeps his word." },
  { id: 30, name: "Tobias Mahr",      dept: "sales",       section: "sal-enterprise",title: "Enterprise Account Executive", loc: "Vienna", ext: "203", g: "m", p: 36, motto: "Solve the problem, the sale follows.", bio: "Tobias works with our largest prospective clients. He leads with the problem, never the pitch." },
  { id: 16, name: "Isabella Santos",  dept: "sales",       section: "sal-regional",  title: "Head of Sales",         loc: "Lisbon",    ext: "200", g: "w", p: 50, motto: "Listen longer than feels comfortable.", bio: "Isabella leads partnerships across southern Europe. She closes deals by understanding them first." },
  { id: 18, name: "Nadia Khan",       dept: "sales",       section: "sal-regional",  title: "Sales Lead, APAC",      loc: "Singapore", ext: "202", g: "w", p: 57, motto: "Trust travels slowly and pays forever.", bio: "Nadia builds the company's presence across Asia-Pacific. She plays the long game and rarely loses it." },
  { id: 19, name: "Olivia Bergström", dept: "marketing",   section: "mkt-brand",     title: "Head of Marketing",     loc: "Copenhagen",ext: "220", g: "w", p: 8, motto: "Say less, mean more.", bio: "Olivia shapes how Meridian sounds in the world. She edits relentlessly and trusts white space." },
  { id: 20, name: "Felix Andersson",  dept: "marketing",   section: "mkt-brand",     title: "Brand Lead",            loc: "Malmö",     ext: "221", g: "m", p: 29, motto: "Taste is just attention.", bio: "Felix protects the look and feel of everything we make. He notices the half-pixel and the half-truth." },
  { id: 21, name: "Mei Lin",          dept: "marketing",   section: "mkt-content",   title: "Content Lead",          loc: "Hong Kong", ext: "222", g: "w", p: 71, motto: "Clarity is the kindest design.", bio: "Mei writes and curates the stories the company tells. She believes a clear sentence is a form of respect." },
  { id: 31, name: "Hana Suzuki",      dept: "marketing",   section: "mkt-content",   title: "Content Strategist",    loc: "Tokyo",     ext: "223", g: "w", p: 60, motto: "Edit until it's effortless.", bio: "Hana plans the company's editorial calendar and voice. She trims every sentence twice." },
  { id: 22, name: "Henry Park",       dept: "admin",       section: "adm-office",    title: "Office Director",       loc: "Seoul",     ext: "240", g: "m", p: 47, motto: "The details are the job.", bio: "Henry runs the houses where we work, down to the lighting. He treats hospitality as a discipline." },
  { id: 24, name: "Lucas Moreau",     dept: "admin",       section: "adm-office",    title: "Facilities Lead",       loc: "Paris",     ext: "242", g: "m", p: 55, motto: "A good space disappears.", bio: "Lucas looks after our buildings so no one has to think about them. Comfort, to him, is invisible work." },
  { id: 23, name: "Zara Ahmed",       dept: "admin",       section: "adm-support",   title: "Executive Assistant",   loc: "Dubai",     ext: "241", g: "w", p: 82, motto: "Anticipate, don't react.", bio: "Zara keeps the leadership team a step ahead of the day. She solves problems most people never see." },
  { id: 32, name: "Camille Dubois",   dept: "admin",       section: "adm-support",   title: "Executive Assistant",   loc: "Paris",     ext: "243", g: "w", p: 20, motto: "Calm is a service.", bio: "Camille keeps the leadership team's days running smoothly. She turns chaos into a clean schedule." },
];

const photoUrl = (e) => `https://randomuser.me/api/portraits/${e.g === "w" ? "women" : "men"}/${e.p}.jpg`;
const initials = (n) => n.split(" ").map((s) => s[0]).slice(0, 2).join("");
const emailOf  = (e) => `${e.name.toLowerCase().replace(/[^a-z ]/g, "").replace(/ /g, ".")}@meridian.co`;
const countIn = (k) => EMPLOYEES.filter((e) => e.dept === k).length;
const countInSection = (s) => EMPLOYEES.filter((e) => e.section === s).length;
const deptRoster = (k) => EMPLOYEES.filter((e) => e.dept === k);

function useReduceMotion() {
  const [r, setR] = useState(false);
  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    setR(m.matches);
    const h = (e) => setR(e.matches);
    m.addEventListener?.("change", h);
    return () => m.removeEventListener?.("change", h);
  }, []);
  return r;
}

function useViewport() {
  const get = () => (typeof window !== "undefined" ? window.innerWidth : 1200);
  const [w, setW] = useState(get);
  useEffect(() => { const f = () => setW(get()); window.addEventListener("resize", f); f(); return () => window.removeEventListener("resize", f); }, []);
  return w;
}

// Horizontal swipe (touch) + drag (mouse). onLeft fires on swipe-left, onRight on swipe-right.
function useSwipe(onLeft, onRight) {
  const s = useRef(null);
  const begin = (x, y) => { s.current = { x, y }; };
  const finish = (x, y) => {
    if (!s.current) return;
    const dx = x - s.current.x, dy = y - s.current.y;
    s.current = null;
    if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.4) { dx < 0 ? onLeft() : onRight(); }
  };
  return {
    onTouchStart: (e) => begin(e.touches[0].clientX, e.touches[0].clientY),
    onTouchEnd: (e) => finish(e.changedTouches[0].clientX, e.changedTouches[0].clientY),
    onMouseDown: (e) => begin(e.clientX, e.clientY),
    onMouseUp: (e) => finish(e.clientX, e.clientY),
  };
}

function Reveal({ delay = 0, children, className = "", style = {} }) {
  const reduce = useReduceMotion();
  const [on, setOn] = useState(false);
  useEffect(() => { const t = setTimeout(() => setOn(true), reduce ? 0 : delay); return () => clearTimeout(t); }, [reduce, delay]);
  return (
    <div className={className} style={{ ...style, opacity: on ? 1 : 0, transform: on ? "none" : "translateY(14px)", transition: reduce ? "none" : "opacity .7s cubic-bezier(.2,.7,.2,1), transform .7s cubic-bezier(.2,.7,.2,1)" }}>
      {children}
    </div>
  );
}

function Avatar({ emp, size = 56 }) {
  const [err, setErr] = useState(false);
  if (err) return <div className="avatar-fallback" style={{ width: size, height: size, fontSize: size * 0.34, flex: "none" }}>{initials(emp.name)}</div>;
  return <img src={photoUrl(emp)} alt={`Portrait of ${emp.name}`} onError={() => setErr(true)} className="avatar" style={{ width: size, height: size, flex: "none" }} />;
}

function Photo({ emp, mono }) {
  const [err, setErr] = useState(false);
  if (err) return <div className={`photo-fallback ${mono ? "photo-mono" : ""}`}><span>{initials(emp.name)}</span></div>;
  return <img src={photoUrl(emp)} alt={`Portrait of ${emp.name}`} onError={() => setErr(true)} className={`photo-img ${mono ? "photo-mono" : ""}`} />;
}

const greeting = () => { const h = new Date().getHours(); if (h < 12) return "Good morning"; if (h < 18) return "Good afternoon"; return "Good evening"; };

const filterPeople = (dept, section, query) => {
  let base = EMPLOYEES.filter((e) => e.dept === dept);
  if (section !== "all") base = base.filter((e) => e.section === section);
  const q = query.trim().toLowerCase();
  if (!q) return base;
  return base.filter((e) => e.name.toLowerCase().includes(q) || e.title.toLowerCase().includes(q) || deptName(e.dept).toLowerCase().includes(q) || sectionName(e.dept, e.section).toLowerCase().includes(q));
};

/* ============================== WEB LAYOUT ============================== */

function Masthead({ left, right }) {
  return (
    <header className="mast">
      <div className="mast-inner">
        <div className="flex items-center gap-3">
          <span className="wordmark-dot" /><span className="wordmark">MERIDIAN</span>
          {left && <span className="mast-divider" />}{left && <span className="eyebrow">{left}</span>}
        </div>
        <div className="flex items-center gap-3">{right}</div>
      </div>
      <div className="mast-rule" />
    </header>
  );
}

function Landing({ onEnter }) {
  return (
    <div className="screen-bg landing-bg min-h-screen flex flex-col">
      <Masthead right={<span className="eyebrow">Edition · MMXXVI</span>} />
      <main className="flex-1 flex items-center">
        <div className="page-pad w-full"><div className="mx-auto" style={{ maxWidth: 880 }}>
          <Reveal delay={120}><p className="eyebrow mb-6">Internal · The Company Handbook</p></Reveal>
          <Reveal delay={240}><h1 className="display landing-title">A quiet place<br />to know the people<br />you work with.</h1></Reveal>
          <Reveal delay={420}><p className="lede mt-7" style={{ maxWidth: 540 }}>Browse by department, open a section, and flip through each colleague's profile — getting acquainted with how Meridian works, at your own pace.</p></Reveal>
          <Reveal delay={560}><div className="mt-10 flex items-center gap-5 flex-wrap">
            <button className="btn btn-primary" onClick={onEnter}>Enter the handbook <ArrowRight size={17} strokeWidth={2} /></button>
            <span className="lede" style={{ fontSize: 14 }}>No password needed — it's a demo.</span>
          </div></Reveal>
        </div></div>
      </main>
      <Reveal delay={760}><footer className="page-pad pb-10">
        <div className="contents-rule" />
        <div className="contents-row"><span><i>01</i> Departments</span><span><i>02</i> Sections</span><span><i>03</i> People &amp; profiles</span></div>
      </footer></Reveal>
    </div>
  );
}

function Login({ onBack, onSubmit }) {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  return (
    <div className="screen-bg min-h-screen flex flex-col">
      <Masthead left="Sign in" right={<button className="btn btn-ghost" onClick={onBack}><ArrowLeft size={16} /> Back</button>} />
      <main className="flex-1 flex items-center justify-center page-pad">
        <Reveal delay={80} className="w-full" style={{ maxWidth: 420 }}>
          <div className="card login-card">
            <p className="eyebrow">Welcome back</p>
            <h2 className="display" style={{ fontSize: 34, lineHeight: 1.1, marginTop: 8 }}>Open the handbook</h2>
            <p className="lede mt-3" style={{ fontSize: 15 }}>Enter any details to continue — this is a demonstration.</p>
            <div className="mt-7 flex flex-col gap-4">
              <label className="field"><span className="field-label">Email</span><input type="email" className="field-input" placeholder="you@meridian.co" value={email} onChange={(e) => setEmail(e.target.value)} /></label>
              <label className="field"><span className="field-label">Password</span><input type="password" className="field-input" placeholder="••••••••" value={pw} onChange={(e) => setPw(e.target.value)} onKeyDown={(e) => e.key === "Enter" && onSubmit()} /></label>
              <button className="btn btn-primary mt-2 w-full justify-center" onClick={onSubmit}>Sign in <ArrowRight size={17} strokeWidth={2} /></button>
            </div>
          </div>
        </Reveal>
      </main>
    </div>
  );
}

function Dashboard({ onOpen, onSignOut }) {
  return (
    <div className="screen-bg min-h-screen flex flex-col">
      <Masthead left="Departments" right={<button className="btn btn-ghost" onClick={onSignOut}><LogOut size={15} /> Sign out</button>} />
      <main className="flex-1 page-pad py-12">
        <Reveal delay={60}>
          <p className="eyebrow mb-3">{greeting()}</p>
          <h2 className="display section-title">Eight teams, one company.</h2>
          <p className="lede mt-4" style={{ maxWidth: 520 }}>Choose a department to see how it's organised.</p>
        </Reveal>
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {DEPARTMENTS.map((d, i) => (
            <Reveal key={d.key} delay={180 + i * 70}>
              <button className="dept-card" onClick={() => onOpen(d.key)}>
                <div className="dept-top"><span className="dept-num">{String(i + 1).padStart(2, "0")}</span><span className="dept-count">{sectionsOf(d.key).length} sections</span></div>
                <h3 className="display dept-name">{d.name}</h3>
                <p className="dept-tag">{d.tag}</p>
                <span className="dept-cta">View sections <ArrowRight size={15} className="dept-arrow" /></span>
              </button>
            </Reveal>
          ))}
        </div>
      </main>
    </div>
  );
}

function Sections({ deptKey, onOpenSection, onBack, onSignOut }) {
  const dept = DEPARTMENTS.find((d) => d.key === deptKey);
  const secs = sectionsOf(deptKey);
  return (
    <div className="screen-bg min-h-screen flex flex-col">
      <Masthead left="Sections" right={<>
        <button className="btn btn-ghost" onClick={onBack}><ArrowLeft size={16} /> Departments</button>
        <button className="btn btn-ghost" onClick={onSignOut}><LogOut size={15} /> Sign out</button>
      </>} />
      <main className="flex-1 page-pad py-12">
        <Reveal delay={60}>
          <p className="eyebrow mb-3">Department</p>
          <h2 className="display section-title">{dept.name}</h2>
          <p className="lede mt-4" style={{ maxWidth: 540 }}>{dept.tag} Choose a section to meet its people.</p>
        </Reveal>
        <Reveal delay={220}>
          <div className="org-scroll mt-12"><div className="tree"><ul><li>
            <div className="org-node">
              <span className="org-node-glyph" />
              <span className="org-node-label">Department</span>
              <span className="org-node-name">{dept.name}</span>
              <span className="org-node-meta">{secs.length} sections · {countIn(deptKey)} people</span>
            </div>
            <ul>
              {secs.map((s, i) => (
                <li key={s.key}><button className="sec-card" onClick={() => onOpenSection(s.key)}>
                  <span className="sec-index">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="display sec-name">{s.name}</h3>
                  <p className="sec-tag">{s.tag}</p>
                  <span className="sec-meta">{countInSection(s.key)} people</span>
                  <span className="sec-cta">View people <ArrowRight size={14} className="sec-arrow" /></span>
                </button></li>
              ))}
            </ul>
          </li></ul></div></div>
        </Reveal>
      </main>
    </div>
  );
}

function Directory({ dept, section, setSection, query, setQuery, results, onBack, onSignOut, onSelect }) {
  const title = section === "all" ? deptName(dept) : sectionName(dept, section);
  const tag = section === "all" ? DEPARTMENTS.find((d) => d.key === dept)?.tag : sectionTag(dept, section);
  return (
    <div className="screen-bg min-h-screen flex flex-col">
      <Masthead left="Directory" right={<>
        <button className="btn btn-ghost" onClick={onBack}><ArrowLeft size={16} /> Sections</button>
        <button className="btn btn-ghost" onClick={onSignOut}><LogOut size={15} /> Sign out</button>
      </>} />
      <main className="flex-1 page-pad py-11">
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <p className="eyebrow mb-2">{deptName(dept)}</p>
            <h2 className="display section-title">{title}</h2>
            <p className="lede mt-3">{tag}</p>
          </div>
          <span className="result-count">{results.length} {results.length === 1 ? "person" : "people"}</span>
        </div>
        <div className="search-wrap mt-8">
          <Search size={18} className="search-icon" />
          <input className="search-input" placeholder="Search by name, section, or title…" value={query} onChange={(e) => setQuery(e.target.value)} autoFocus />
          {query && <button className="search-clear" onClick={() => setQuery("")} aria-label="Clear search"><X size={16} /></button>}
        </div>
        <div className="chips mt-5">
          <button className={`chip ${section === "all" ? "chip-active" : ""}`} onClick={() => setSection("all")}>All of {deptName(dept)}</button>
          {sectionsOf(dept).map((s) => (<button key={s.key} className={`chip ${section === s.key ? "chip-active" : ""}`} onClick={() => setSection(s.key)}>{s.name}</button>))}
        </div>
        {results.length > 0 ? (
          <div key={dept + "-" + section} className="mt-9 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {results.map((e, i) => (
              <Reveal key={e.id} delay={Math.min(i, 10) * 45}>
                <button className="emp-card" onClick={() => onSelect(e)}>
                  <Avatar emp={e} size={72} />
                  <h3 className="emp-name">{e.name}</h3>
                  <p className="emp-title">{e.title}</p>
                  <span className="emp-dept">{sectionName(e.dept, e.section)}</span>
                </button>
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="empty"><p className="display" style={{ fontSize: 24 }}>No one matches that yet.</p><p className="lede mt-2">Try a different name, section, or job title.</p></div>
        )}
      </main>
    </div>
  );
}

function Photobook({ list, index, onNext, onPrev, onClose }) {
  const reduce = useReduceMotion();
  const [on, setOn] = useState(false);
  const [dir, setDir] = useState(1);
  const emp = list[index];
  const total = list.length;
  const goNext = () => { setDir(1); onNext(); };
  const goPrev = () => { setDir(-1); onPrev(); };
  const swipe = useSwipe(goNext, goPrev);
  useEffect(() => {
    const t = setTimeout(() => setOn(true), 10);
    const onKey = (e) => { if (e.key === "Escape") onClose(); if (e.key === "ArrowRight") { setDir(1); onNext(); } if (e.key === "ArrowLeft") { setDir(-1); onPrev(); } };
    window.addEventListener("keydown", onKey);
    return () => { clearTimeout(t); window.removeEventListener("keydown", onKey); };
  }, [onClose, onNext, onPrev]);
  return (
    <div className="modal-backdrop" onClick={onClose} style={{ opacity: on ? 1 : 0, transition: reduce ? "none" : "opacity .32s ease" }}>
      <div className="book" role="dialog" aria-modal="true" aria-label={`Profile of ${emp.name}`} onClick={(e) => e.stopPropagation()}
        style={{ opacity: on ? 1 : 0, transform: on ? "translateY(0) scale(1)" : "translateY(16px) scale(.97)", transition: reduce ? "none" : "opacity .38s cubic-bezier(.2,.7,.2,1), transform .38s cubic-bezier(.2,.7,.2,1)" }}>
        <button className="modal-close" onClick={onClose} aria-label="Close"><X size={18} /></button>
        <div className="book-head">
          <span className="eyebrow">{deptName(emp.dept)} · Directory</span>
          <span className="book-counter">{String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</span>
        </div>
        <div className={`book-flip ${dir === 1 ? "book-flip-next" : "book-flip-prev"}`} key={emp.id} {...swipe}>
          <div className="book-spread">
            <div className="book-text">
              <span className="emp-dept">{sectionName(emp.dept, emp.section)}</span>
              <h2 className="display book-name">{emp.name}</h2>
              <p className="book-role">{emp.title} — {deptName(emp.dept)}</p>
              <blockquote className="pull">“{emp.motto}”</blockquote>
              <p className="lede book-bio">{emp.bio}</p>
              <div className="info-list">
                <div className="info-row"><Mail size={16} className="info-ic" /><span className="info-label">Email</span><span className="info-val">{emailOf(emp)}</span></div>
                <div className="info-row"><Phone size={16} className="info-ic" /><span className="info-label">Extension</span><span className="info-val">x{emp.ext}</span></div>
                <div className="info-row"><MapPin size={16} className="info-ic" /><span className="info-label">Location</span><span className="info-val">{emp.loc}</span></div>
              </div>
            </div>
            <figure className="book-photo book-photo-a"><Photo emp={emp} /></figure>
            <figure className="book-photo book-photo-b"><Photo emp={emp} mono /><figcaption className="book-cap">{emp.loc}</figcaption></figure>
          </div>
        </div>
        <div className="book-nav">
          <button className="book-btn" onClick={goPrev}><ArrowLeft size={16} /> Previous</button>
          <span className="book-dots">{list.map((p, i) => <span key={p.id} className={`book-dot ${i === index ? "book-dot-on" : ""}`} />)}</span>
          <button className="book-btn book-btn-primary" onClick={goNext}>Next <ArrowRight size={16} /></button>
        </div>
      </div>
    </div>
  );
}

function WebApp({ view, shown, dur, reduce, dept, section, setSection, query, setQuery, results, book, openBook, closeBook, nextPerson, prevPerson, nav }) {
  return (
    <>
      <div style={{ opacity: shown ? 1 : 0, transform: shown ? "translateY(0)" : "translateY(10px)", transition: reduce ? "none" : `opacity ${dur}ms ease, transform ${dur}ms ease` }}>
        {view === "landing" && <Landing onEnter={nav.enter} />}
        {view === "login" && <Login onBack={nav.toLanding} onSubmit={nav.login} />}
        {view === "dashboard" && <Dashboard onOpen={nav.openSections} onSignOut={nav.signOut} />}
        {view === "sections" && <Sections deptKey={dept} onOpenSection={nav.openDirectory} onBack={nav.toDashboard} onSignOut={nav.signOut} />}
        {view === "directory" && <Directory dept={dept} section={section} setSection={setSection} query={query} setQuery={setQuery} results={results} onBack={nav.toSections} onSignOut={nav.signOut} onSelect={openBook} />}
      </div>
      {book && <Photobook list={book.list} index={book.index} onNext={nextPerson} onPrev={prevPerson} onClose={closeBook} />}
    </>
  );
}

/* ============================== MOBILE LAYOUT ============================== */

function MHeader({ title, onBack, right }) {
  return (
    <header className="m-head">
      <div className="m-head-left">
        {onBack ? <button className="m-iconbtn" onClick={onBack} aria-label="Back"><ChevronLeft size={20} /></button>
          : <span className="m-brand"><span className="wordmark-dot" /><span className="wordmark" style={{ fontSize: 12 }}>MERIDIAN</span></span>}
        {title && <span className="m-title">{title}</span>}
      </div>
      <div className="m-head-right">{right}</div>
    </header>
  );
}

function MLanding({ onEnter }) {
  return (
    <div className="m-screen landing-bg">
      <MHeader right={<span className="eyebrow" style={{ fontSize: 10 }}>MMXXVI</span>} />
      <div className="m-pad flex flex-col flex-1">
        <Reveal delay={120}><p className="eyebrow" style={{ marginTop: 18 }}>Internal · Handbook</p></Reveal>
        <Reveal delay={240}><h1 className="display m-landing-title">A quiet place to know the people you work with.</h1></Reveal>
        <Reveal delay={420}><p className="lede" style={{ fontSize: 16, marginTop: 16 }}>Browse by department, open a section, and flip through each colleague's profile.</p></Reveal>
        <div style={{ flex: 1 }} />
        <Reveal delay={560}>
          <button className="btn btn-primary w-full justify-center" style={{ padding: "15px 20px", fontSize: 15 }} onClick={onEnter}>Enter the handbook <ArrowRight size={17} strokeWidth={2} /></button>
          <p className="lede" style={{ fontSize: 13, textAlign: "center", marginTop: 12 }}>No password needed — it's a demo.</p>
        </Reveal>
      </div>
    </div>
  );
}

function MLogin({ onBack, onSubmit }) {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  return (
    <div className="m-screen">
      <MHeader title="Sign in" onBack={onBack} />
      <div className="m-pad flex flex-col flex-1">
        <Reveal delay={60}>
          <p className="eyebrow" style={{ marginTop: 14 }}>Welcome back</p>
          <h2 className="display" style={{ fontSize: 30, lineHeight: 1.1, marginTop: 8 }}>Open the handbook</h2>
          <p className="lede" style={{ fontSize: 15, marginTop: 10 }}>Enter any details to continue.</p>
          <div className="flex flex-col gap-4" style={{ marginTop: 26 }}>
            <label className="field"><span className="field-label">Email</span><input type="email" className="field-input m-field" placeholder="you@meridian.co" value={email} onChange={(e) => setEmail(e.target.value)} /></label>
            <label className="field"><span className="field-label">Password</span><input type="password" className="field-input m-field" placeholder="••••••••" value={pw} onChange={(e) => setPw(e.target.value)} onKeyDown={(e) => e.key === "Enter" && onSubmit()} /></label>
          </div>
        </Reveal>
        <div style={{ flex: 1 }} />
        <button className="btn btn-primary w-full justify-center" style={{ padding: "15px 20px", fontSize: 15 }} onClick={onSubmit}>Sign in <ArrowRight size={17} strokeWidth={2} /></button>
      </div>
    </div>
  );
}

function MDashboard({ onOpen, onSignOut }) {
  return (
    <div className="m-screen">
      <MHeader right={<button className="m-iconbtn" onClick={onSignOut} aria-label="Sign out"><LogOut size={17} /></button>} />
      <div className="m-pad">
        <Reveal delay={40}>
          <p className="eyebrow">{greeting()}</p>
          <h2 className="display" style={{ fontSize: 28, lineHeight: 1.08, marginTop: 6 }}>Departments</h2>
          <p className="lede" style={{ fontSize: 14, marginTop: 8 }}>Choose a team to see how it's organised.</p>
        </Reveal>
        <div className="m-list" style={{ marginTop: 22 }}>
          {DEPARTMENTS.map((d, i) => (
            <Reveal key={d.key} delay={120 + i * 55}>
              <button className="m-row" onClick={() => onOpen(d.key)}>
                <span className="m-row-num">{String(i + 1).padStart(2, "0")}</span>
                <span className="m-row-main">
                  <span className="m-row-title display">{d.name}</span>
                  <span className="m-row-sub">{d.tag}</span>
                  <span className="m-row-meta">{sectionsOf(d.key).length} sections · {countIn(d.key)} people</span>
                </span>
                <ChevronRight size={20} className="m-row-chev" />
              </button>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}

function MSections({ deptKey, onOpenSection, onBack, onSignOut }) {
  const dept = DEPARTMENTS.find((d) => d.key === deptKey);
  const secs = sectionsOf(deptKey);
  return (
    <div className="m-screen">
      <MHeader title="Departments" onBack={onBack} right={<button className="m-iconbtn" onClick={onSignOut} aria-label="Sign out"><LogOut size={17} /></button>} />
      <div className="m-pad">
        <Reveal delay={40}>
          <p className="eyebrow">Department</p>
          <h2 className="display" style={{ fontSize: 28, lineHeight: 1.08, marginTop: 6 }}>{dept.name}</h2>
          <p className="lede" style={{ fontSize: 14, marginTop: 8 }}>{dept.tag} Choose a section to meet its people.</p>
        </Reveal>
        <Reveal delay={180}>
          <div className="m-tree" style={{ marginTop: 22 }}>
            <div className="org-node m-node">
              <span className="org-node-glyph" />
              <span className="org-node-label">Department</span>
              <span className="org-node-name">{dept.name}</span>
              <span className="org-node-meta">{secs.length} sections · {countIn(deptKey)} people</span>
            </div>
            <div className="m-branch">
              <span className="m-branch-line" />
              {secs.map((s, i) => (
                <button key={s.key} className="m-sec-card" onClick={() => onOpenSection(s.key)}>
                  <span className="m-row-main">
                    <span style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                      <span className="sec-index">{String(i + 1).padStart(2, "0")}</span>
                      <span className="m-row-title display">{s.name}</span>
                    </span>
                    <span className="m-row-sub">{s.tag}</span>
                    <span className="m-row-meta">{countInSection(s.key)} people</span>
                  </span>
                  <ChevronRight size={20} className="m-row-chev" />
                </button>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}

function MDirectory({ dept, section, setSection, query, setQuery, results, onBack, onSignOut, onSelect }) {
  const title = section === "all" ? deptName(dept) : sectionName(dept, section);
  return (
    <div className="m-screen">
      <MHeader title={deptName(dept)} onBack={onBack} right={<button className="m-iconbtn" onClick={onSignOut} aria-label="Sign out"><LogOut size={17} /></button>} />
      <div className="m-subhead">
        <div className="search-wrap">
          <Search size={17} className="search-icon" />
          <input className="search-input" placeholder="Search name, section, title…" value={query} onChange={(e) => setQuery(e.target.value)} />
          {query && <button className="search-clear" onClick={() => setQuery("")} aria-label="Clear search"><X size={16} /></button>}
        </div>
        <div className="m-chips">
          <button className={`chip ${section === "all" ? "chip-active" : ""}`} onClick={() => setSection("all")}>All of {deptName(dept)}</button>
          {sectionsOf(dept).map((s) => (<button key={s.key} className={`chip ${section === s.key ? "chip-active" : ""}`} onClick={() => setSection(s.key)}>{s.name}</button>))}
        </div>
      </div>
      <div className="m-pad" style={{ paddingTop: 16 }}>
        <div className="flex items-center justify-between" style={{ marginBottom: 14 }}>
          <h2 className="display" style={{ fontSize: 22 }}>{title}</h2>
          <span className="result-count">{results.length} {results.length === 1 ? "person" : "people"}</span>
        </div>
        {results.length > 0 ? (
          <div key={dept + "-" + section} className="m-list">
            {results.map((e, i) => (
              <Reveal key={e.id} delay={Math.min(i, 8) * 40}>
                <button className="m-emp" onClick={() => onSelect(e)}>
                  <Avatar emp={e} size={52} />
                  <span className="m-emp-main">
                    <span className="m-emp-name">{e.name}</span>
                    <span className="m-emp-title">{e.title}</span>
                    <span className="m-emp-sec">{sectionName(e.dept, e.section)}</span>
                  </span>
                  <ChevronRight size={18} className="m-row-chev" />
                </button>
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="empty" style={{ padding: "60px 10px" }}><p className="display" style={{ fontSize: 21 }}>No one matches that yet.</p><p className="lede mt-2" style={{ fontSize: 14 }}>Try a different name, section, or title.</p></div>
        )}
      </div>
    </div>
  );
}

function MPhotobook({ list, index, onNext, onPrev, onClose }) {
  const reduce = useReduceMotion();
  const [on, setOn] = useState(false);
  const [dir, setDir] = useState(1);
  const emp = list[index];
  const total = list.length;
  const goNext = () => { setDir(1); onNext(); };
  const goPrev = () => { setDir(-1); onPrev(); };
  const swipe = useSwipe(goNext, goPrev);
  useEffect(() => {
    const t = setTimeout(() => setOn(true), 10);
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => { clearTimeout(t); window.removeEventListener("keydown", onKey); };
  }, [onClose]);
  return (
    <div className="m-sheet-backdrop" onClick={onClose} style={{ opacity: on ? 1 : 0, transition: reduce ? "none" : "opacity .3s ease" }}>
      <div className="m-sheet m-book-sheet" role="dialog" aria-modal="true" aria-label={`Profile of ${emp.name}`} onClick={(e) => e.stopPropagation()}
        style={{ transform: on ? "translateY(0)" : "translateY(100%)", transition: reduce ? "none" : "transform .4s cubic-bezier(.2,.8,.2,1)" }}>
        <div className="m-grab" />
        <button className="m-sheet-close" onClick={onClose} aria-label="Close"><X size={18} /></button>
        <div className="m-book-head">
          <span className="eyebrow" style={{ fontSize: 10 }}>{deptName(emp.dept)}</span>
          <span className="book-counter">{String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</span>
        </div>
        <div className={`book-flip ${dir === 1 ? "book-flip-next" : "book-flip-prev"}`} key={emp.id} {...swipe}>
          <div className="m-book-grid">
            <div className="m-book-words">
              <span className="emp-dept">{sectionName(emp.dept, emp.section)}</span>
              <h2 className="display" style={{ fontSize: 23, lineHeight: 1.08, marginTop: 8 }}>{emp.name}</h2>
              <p className="lede" style={{ fontSize: 13.5, marginTop: 2 }}>{emp.title}</p>
              <blockquote className="pull m-pull">“{emp.motto}”</blockquote>
            </div>
            <figure className="m-book-photo m-book-photo-a"><Photo emp={emp} /></figure>
          </div>
          <p className="lede" style={{ fontSize: 15, lineHeight: 1.7, marginTop: 16 }}>{emp.bio}</p>
          <div className="info-list">
            <div className="info-row m-info-row"><Mail size={16} className="info-ic" /><span className="info-label">Email</span><span className="info-val">{emailOf(emp)}</span></div>
            <div className="info-row m-info-row"><Phone size={16} className="info-ic" /><span className="info-label">Extension</span><span className="info-val">x{emp.ext}</span></div>
            <div className="info-row m-info-row"><MapPin size={16} className="info-ic" /><span className="info-label">Location</span><span className="info-val">{emp.loc}</span></div>
          </div>
          <figure className="m-book-photo m-book-photo-b"><Photo emp={emp} mono /><figcaption className="book-cap">{emp.loc}</figcaption></figure>
        </div>
        <div className="m-book-nav">
          <button className="m-iconbtn" onClick={goPrev} aria-label="Previous person"><ArrowLeft size={18} /></button>
          <span className="m-book-count">{index + 1} of {total} in {deptName(emp.dept)}</span>
          <button className="m-book-next" onClick={goNext}>Next <ArrowRight size={16} /></button>
        </div>
      </div>
    </div>
  );
}

function MobileApp({ framed, view, shown, dur, reduce, dept, section, setSection, query, setQuery, results, book, openBook, closeBook, nextPerson, prevPerson, nav }) {
  return (
    <div className="m-viewport" style={{ height: framed ? "100%" : "100dvh" }}>
      <div style={{ opacity: shown ? 1 : 0, transform: shown ? "translateY(0)" : "translateY(8px)", transition: reduce ? "none" : `opacity ${dur}ms ease, transform ${dur}ms ease` }}>
        {view === "landing" && <MLanding onEnter={nav.enter} />}
        {view === "login" && <MLogin onBack={nav.toLanding} onSubmit={nav.login} />}
        {view === "dashboard" && <MDashboard onOpen={nav.openSections} onSignOut={nav.signOut} />}
        {view === "sections" && <MSections deptKey={dept} onOpenSection={nav.openDirectory} onBack={nav.toDashboard} onSignOut={nav.signOut} />}
        {view === "directory" && <MDirectory dept={dept} section={section} setSection={setSection} query={query} setQuery={setQuery} results={results} onBack={nav.toSections} onSignOut={nav.signOut} onSelect={openBook} />}
      </div>
      {book && <MPhotobook list={book.list} index={book.index} onNext={nextPerson} onPrev={prevPerson} onClose={closeBook} />}
    </div>
  );
}

function PhoneFrame({ children }) {
  return (
    <div className="frame-stage">
      <div className="phone">
        <div className="phone-notch" />
        <div className="phone-screen">{children}</div>
      </div>
    </div>
  );
}

function PreviewToggle({ isMobile, setForced }) {
  return (
    <div className="preview-toggle">
      <span className="pt-label">Preview</span>
      <button className={!isMobile ? "pt-active" : ""} onClick={() => setForced("web")}>Web</button>
      <button className={isMobile ? "pt-active" : ""} onClick={() => setForced("mobile")}>Mobile</button>
    </div>
  );
}

export default function App() {
  const reduce = useReduceMotion();
  const dur = reduce ? 0 : 300;
  const vw = useViewport();
  const [forced, setForced] = useState(null);
  const isMobile = forced ? forced === "mobile" : vw <= 640;
  const framed = isMobile && vw > 560;

  const [view, setView] = useState("landing");
  const [shown, setShown] = useState(true);
  const [dept, setDept] = useState("management");
  const [section, setSection] = useState("all");
  const [query, setQuery] = useState("");
  const [book, setBook] = useState(null);

  const go = (next, payload) => {
    setShown(false);
    setTimeout(() => {
      if (next === "sections") setDept(payload);
      if (next === "directory") {
        if (payload && typeof payload === "object") { setDept(payload.dept); setSection(payload.section ?? "all"); }
        setQuery("");
      }
      setView(next);
      window.scrollTo({ top: 0 });
      document.querySelectorAll(".m-viewport").forEach((el) => el.scrollTo({ top: 0 }));
      setShown(true);
    }, dur);
  };

  const results = useMemo(() => filterPeople(dept, section, query), [dept, section, query]);

  const openBook = (emp) => {
    const list = deptRoster(emp.dept);
    const index = Math.max(0, list.findIndex((e) => e.id === emp.id));
    setBook({ list, index });
  };
  const closeBook = () => setBook(null);
  const nextPerson = () => setBook((b) => (b ? { ...b, index: (b.index + 1) % b.list.length } : b));
  const prevPerson = () => setBook((b) => (b ? { ...b, index: (b.index - 1 + b.list.length) % b.list.length } : b));

  const nav = {
    enter: () => go("login"),
    login: () => go("dashboard"),
    openSections: (k) => go("sections", k),
    openDirectory: (s) => go("directory", { dept, section: s }),
    toDashboard: () => go("dashboard"),
    toSections: () => go("sections", dept),
    toLanding: () => go("landing"),
    signOut: () => go("landing"),
  };

  const shared = { view, shown, dur, reduce, dept, section, setSection, query, setQuery, results, book, openBook, closeBook, nextPerson, prevPerson, nav };

  return (
    <div className="app-root">
      <StyleSheet />
      {isMobile
        ? (framed ? <PhoneFrame><MobileApp framed {...shared} /></PhoneFrame> : <MobileApp framed={false} {...shared} />)
        : <WebApp {...shared} />}
      <PreviewToggle isMobile={isMobile} setForced={setForced} />
    </div>
  );
}

function StyleSheet() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;1,6..72,400;1,6..72,500&family=Inter:wght@400;500;600&display=swap');

      :root{
        --ivory:#F7F4ED; --paper:#FCFAF4; --sand:#ECE4D5; --line:#E4DCCC;
        --taupe:#B4A88E; --taupe-deep:#8C7F66; --navy:#27344A; --navy-soft:#3a4a64;
        --ink:#2B2925; --muted:#766E5F; --panel:#EFE7D6;
      }
      .app-root{ font-family:'Inter',system-ui,sans-serif; color:var(--ink); background:var(--ivory); -webkit-font-smoothing:antialiased; }
      .app-root *{ box-sizing:border-box; }
      .display{ font-family:'Newsreader',Georgia,serif; font-weight:500; letter-spacing:-0.01em; }

      .screen-bg{ background:var(--ivory); }
      .landing-bg{ background: radial-gradient(120% 90% at 85% -10%, rgba(180,168,142,.20), transparent 55%), radial-gradient(90% 70% at 0% 110%, rgba(39,52,74,.06), transparent 50%), var(--ivory); }
      .page-pad{ padding-left:clamp(20px,6vw,84px); padding-right:clamp(20px,6vw,84px); }

      .mast{ padding-top:22px; }
      .mast-inner{ display:flex; align-items:center; justify-content:space-between; gap:16px; flex-wrap:wrap; padding-left:clamp(20px,6vw,84px); padding-right:clamp(20px,6vw,84px); padding-bottom:16px; }
      .wordmark{ font-weight:600; letter-spacing:.28em; font-size:13px; color:var(--ink); }
      .wordmark-dot{ width:9px; height:9px; border-radius:50%; background:var(--navy); display:inline-block; flex:none; }
      .mast-divider{ width:1px; height:14px; background:var(--line); display:inline-block; }
      .mast-rule{ height:1px; background:var(--line); margin-left:clamp(20px,6vw,84px); margin-right:clamp(20px,6vw,84px); }

      .eyebrow{ font-size:11px; font-weight:600; letter-spacing:.24em; text-transform:uppercase; color:var(--taupe-deep); }
      .lede{ color:var(--muted); font-size:17px; line-height:1.65; }

      .btn{ display:inline-flex; align-items:center; gap:9px; font-size:14px; font-weight:500; border-radius:999px; padding:11px 20px; border:1px solid transparent; cursor:pointer; transition:transform .25s ease, background .25s ease, color .25s ease, box-shadow .25s ease, border-color .25s ease; }
      .btn-primary{ background:var(--navy); color:#F7F4ED; box-shadow:0 10px 24px -14px rgba(39,52,74,.7); }
      .btn-primary:hover{ background:var(--navy-soft); transform:translateY(-2px); box-shadow:0 16px 30px -16px rgba(39,52,74,.7); }
      .btn-ghost{ background:transparent; color:var(--muted); padding:8px 14px; border-color:var(--line); }
      .btn-ghost:hover{ color:var(--ink); border-color:var(--taupe); background:rgba(180,168,142,.10); }

      .landing-title{ font-size:clamp(38px,6.4vw,72px); line-height:1.04; color:var(--ink); }
      .contents-rule{ height:1px; background:var(--line); margin-bottom:16px; }
      .contents-row{ display:flex; gap:40px; flex-wrap:wrap; color:var(--muted); font-size:13px; letter-spacing:.04em; }
      .contents-row i{ color:var(--taupe-deep); font-style:normal; font-weight:600; margin-right:8px; }

      .card{ background:var(--paper); border:1px solid var(--line); border-radius:24px; box-shadow:0 30px 60px -40px rgba(43,41,37,.35); }
      .login-card{ padding:38px 36px; }
      .field{ display:flex; flex-direction:column; gap:7px; }
      .field-label{ font-size:12px; font-weight:600; letter-spacing:.06em; color:var(--muted); }
      .field-input{ width:100%; background:var(--ivory); border:1px solid var(--line); border-radius:14px; padding:12px 15px; font-size:15px; color:var(--ink); font-family:inherit; transition:border-color .2s ease, box-shadow .2s ease, background .2s ease; }
      .field-input::placeholder{ color:#a89f8d; }
      .field-input:focus{ outline:none; border-color:var(--navy); background:#fff; box-shadow:0 0 0 3px rgba(39,52,74,.12); }

      .section-title{ font-size:clamp(30px,4.4vw,46px); line-height:1.05; color:var(--ink); }

      .dept-card{ display:flex; flex-direction:column; text-align:left; width:100%; background:var(--paper); border:1px solid var(--line); border-radius:22px; padding:24px 24px 22px; cursor:pointer; min-height:184px; transition:transform .35s cubic-bezier(.2,.7,.2,1), box-shadow .35s ease, border-color .35s ease, background .35s ease; }
      .dept-card:hover{ transform:translateY(-6px); border-color:var(--taupe); box-shadow:0 26px 44px -28px rgba(43,41,37,.5); background:#fff; }
      .dept-top{ display:flex; align-items:center; justify-content:space-between; }
      .dept-num{ font-family:'Newsreader',serif; font-size:20px; color:var(--taupe); transition:color .35s ease; }
      .dept-card:hover .dept-num{ color:var(--navy); }
      .dept-count{ font-size:11px; letter-spacing:.12em; text-transform:uppercase; color:var(--muted); }
      .dept-name{ font-size:25px; margin-top:14px; color:var(--ink); }
      .dept-tag{ font-size:14px; color:var(--muted); line-height:1.5; margin-top:7px; flex:1; }
      .dept-cta{ display:inline-flex; align-items:center; gap:7px; font-size:13px; font-weight:600; color:var(--navy); margin-top:16px; }
      .dept-arrow{ transition:transform .35s ease; }
      .dept-card:hover .dept-arrow{ transform:translateX(5px); }

      .org-scroll{ overflow-x:auto; padding-bottom:10px; }
      .tree{ min-width:max-content; margin:0 auto; padding:6px 10px; }
      .tree ul{ display:flex; justify-content:center; position:relative; padding-top:34px; margin:0; }
      .tree > ul{ padding-top:0; }
      .tree li{ list-style:none; margin:0; position:relative; padding:34px 18px 0; display:flex; flex-direction:column; align-items:center; }
      .tree li::before, .tree li::after{ content:''; position:absolute; top:0; right:50%; width:50%; height:34px; border-top:1px solid var(--line); }
      .tree li::after{ right:auto; left:50%; border-left:1px solid var(--line); }
      .tree li::before{ border-right:1px solid var(--line); }
      .tree li:only-child::before, .tree li:only-child::after{ display:none; }
      .tree li:only-child{ padding-top:0; }
      .tree li:first-child::before, .tree li:last-child::after{ border:0 none; }
      .tree li:last-child::before{ border-right:1px solid var(--line); border-radius:0 9px 0 0; }
      .tree li:first-child::after{ border-radius:9px 0 0 0; }
      .tree ul ul::before{ content:''; position:absolute; top:0; left:50%; width:0; height:34px; border-left:1px solid var(--line); }

      .org-node{ display:flex; flex-direction:column; align-items:center; text-align:center; background:var(--navy); color:#F3EFE6; border-radius:20px; padding:22px 36px; min-width:248px; box-shadow:0 24px 46px -26px rgba(39,52,74,.85); }
      .org-node-glyph{ width:11px; height:11px; background:var(--taupe); transform:rotate(45deg); margin-bottom:12px; border-radius:2px; }
      .org-node-label{ font-size:10.5px; letter-spacing:.22em; text-transform:uppercase; color:#bcae93; font-weight:600; }
      .org-node-name{ font-family:'Newsreader',serif; font-size:26px; font-weight:500; margin-top:4px; }
      .org-node-meta{ font-size:12px; color:#cbc4b5; margin-top:8px; letter-spacing:.02em; }

      .sec-card{ display:flex; flex-direction:column; align-items:flex-start; text-align:left; background:var(--paper); border:1px solid var(--line); border-radius:20px; padding:22px 24px 20px; min-width:248px; max-width:290px; cursor:pointer; transition:transform .35s cubic-bezier(.2,.7,.2,1), box-shadow .35s ease, border-color .35s ease, background .35s ease; }
      .sec-card:hover{ transform:translateY(-6px); border-color:var(--taupe); box-shadow:0 24px 42px -28px rgba(43,41,37,.5); background:#fff; }
      .sec-index{ font-family:'Newsreader',serif; font-size:18px; color:var(--taupe); transition:color .35s ease; }
      .sec-card:hover .sec-index{ color:var(--navy); }
      .sec-name{ font-size:22px; margin-top:8px; color:var(--ink); }
      .sec-tag{ font-size:13.5px; color:var(--muted); line-height:1.5; margin-top:6px; }
      .sec-meta{ font-size:10.5px; font-weight:600; letter-spacing:.16em; text-transform:uppercase; color:var(--taupe-deep); margin-top:14px; border:1px solid var(--line); border-radius:999px; padding:4px 11px; }
      .sec-cta{ display:inline-flex; align-items:center; gap:7px; font-size:13px; font-weight:600; color:var(--navy); margin-top:14px; }
      .sec-arrow{ transition:transform .35s ease; }
      .sec-card:hover .sec-arrow{ transform:translateX(5px); }

      .search-wrap{ position:relative; max-width:560px; }
      .search-icon{ position:absolute; left:18px; top:50%; transform:translateY(-50%); color:var(--taupe-deep); }
      .search-input{ width:100%; background:var(--paper); border:1px solid var(--line); border-radius:999px; padding:14px 46px 14px 48px; font-size:15px; color:var(--ink); font-family:inherit; transition:border-color .2s ease, box-shadow .2s ease, background .2s ease; }
      .search-input::placeholder{ color:#a89f8d; }
      .search-input:focus{ outline:none; border-color:var(--navy); background:#fff; box-shadow:0 0 0 3px rgba(39,52,74,.12); }
      .search-clear{ position:absolute; right:14px; top:50%; transform:translateY(-50%); background:transparent; border:none; cursor:pointer; color:var(--muted); display:flex; }
      .search-clear:hover{ color:var(--ink); }

      .chips{ display:flex; flex-wrap:wrap; gap:9px; }
      .chip{ font-size:13px; padding:7px 15px; border-radius:999px; cursor:pointer; background:transparent; border:1px solid var(--line); color:var(--muted); transition:all .22s ease; font-family:inherit; }
      .chip:hover{ border-color:var(--taupe); color:var(--ink); }
      .chip-active{ background:var(--navy); border-color:var(--navy); color:#F7F4ED; }
      .chip-active:hover{ color:#F7F4ED; }

      .result-count{ font-size:12px; letter-spacing:.14em; text-transform:uppercase; color:var(--muted); }

      .emp-card{ display:flex; flex-direction:column; align-items:center; text-align:center; width:100%; background:var(--paper); border:1px solid var(--line); border-radius:22px; padding:30px 22px 26px; cursor:pointer; transition:transform .35s cubic-bezier(.2,.7,.2,1), box-shadow .35s ease, border-color .35s ease, background .35s ease; }
      .emp-card:hover{ transform:translateY(-7px); border-color:var(--taupe); box-shadow:0 26px 46px -28px rgba(43,41,37,.5); background:#fff; }
      .emp-name{ font-family:'Newsreader',serif; font-size:20px; font-weight:500; color:var(--ink); margin-top:16px; }
      .emp-title{ font-size:13.5px; color:var(--muted); margin-top:3px; }
      .emp-dept{ font-size:10.5px; font-weight:600; letter-spacing:.16em; text-transform:uppercase; color:var(--taupe-deep); margin-top:12px; border:1px solid var(--line); border-radius:999px; padding:4px 11px; }

      .avatar{ border-radius:50%; object-fit:cover; background:var(--sand); box-shadow:0 6px 16px -10px rgba(43,41,37,.6); }
      .avatar-fallback{ border-radius:50%; display:flex; align-items:center; justify-content:center; background:var(--sand); color:var(--navy); font-family:'Newsreader',serif; font-weight:500; box-shadow:0 6px 16px -10px rgba(43,41,37,.6); }

      .photo-img{ width:100%; height:100%; object-fit:cover; display:block; }
      .photo-mono{ filter:grayscale(1) contrast(1.04) brightness(1.02); }
      .photo-fallback{ width:100%; height:100%; display:flex; align-items:center; justify-content:center; background:linear-gradient(135deg,#ECE4D5,#D9D0BD); color:var(--navy); font-family:'Newsreader',serif; }
      .photo-fallback span{ font-size:clamp(34px,9vw,60px); }

      .empty{ text-align:center; padding:80px 20px; color:var(--ink); }

      .pull{ font-family:'Newsreader',serif; font-style:italic; font-size:23px; line-height:1.35; color:var(--navy); margin:0 0 20px; padding-left:18px; border-left:2px solid var(--taupe); }
      .info-list{ margin-top:26px; border-top:1px solid var(--line); }
      .info-row{ display:grid; grid-template-columns:24px 110px 1fr; align-items:center; gap:8px; padding:14px 0; border-bottom:1px solid var(--line); }
      .info-ic{ color:var(--taupe-deep); }
      .info-label{ font-size:11px; font-weight:600; letter-spacing:.14em; text-transform:uppercase; color:var(--muted); }
      .info-val{ font-size:15px; color:var(--ink); word-break:break-word; }

      .modal-backdrop{ position:fixed; inset:0; z-index:50; display:flex; align-items:center; justify-content:center; padding:24px; background:rgba(43,41,37,.42); backdrop-filter:blur(5px); -webkit-backdrop-filter:blur(5px); overflow-y:auto; }
      .modal-close{ position:absolute; top:18px; right:18px; width:38px; height:38px; display:flex; align-items:center; justify-content:center; border-radius:50%; border:1px solid var(--line); background:var(--ivory); color:var(--muted); cursor:pointer; transition:all .22s ease; z-index:3; }
      .modal-close:hover{ color:var(--ink); border-color:var(--taupe); background:#fff; }

      .book{ position:relative; width:100%; max-width:900px; background:var(--paper); border:1px solid var(--line); border-radius:26px; padding:28px 32px 24px; box-shadow:0 50px 90px -45px rgba(43,41,37,.6); margin:auto; }
      .book-head{ display:flex; align-items:center; justify-content:space-between; padding-right:48px; margin-bottom:18px; }
      .book-counter{ font-family:'Newsreader',serif; font-size:16px; color:var(--taupe-deep); letter-spacing:.06em; }
      .book-flip{ animation:bookIn .38s cubic-bezier(.2,.7,.2,1); will-change:transform, opacity; touch-action:pan-y; cursor:grab; }
      .book-flip:active{ cursor:grabbing; }
      .book-flip-next{ animation:flipNext .42s cubic-bezier(.2,.7,.2,1); }
      .book-flip-prev{ animation:flipPrev .42s cubic-bezier(.2,.7,.2,1); }
      @keyframes bookIn{ from{ opacity:0; transform:translateX(14px); } to{ opacity:1; transform:none; } }
      @keyframes flipNext{ from{ opacity:0; transform:perspective(1400px) rotateY(-7deg) translateX(46px); } to{ opacity:1; transform:none; } }
      @keyframes flipPrev{ from{ opacity:0; transform:perspective(1400px) rotateY(7deg) translateX(-46px); } to{ opacity:1; transform:none; } }
      .book-spread{ display:grid; grid-template-columns:1fr 1fr; gap:18px 22px; }
      .book-text{ grid-area:1 / 1 / 2 / 2; background:var(--panel); border:1px solid var(--line); border-radius:18px; padding:26px 26px 22px; display:flex; flex-direction:column; }
      .book-name{ font-size:33px; line-height:1.04; color:var(--ink); margin-top:8px; }
      .book-role{ font-size:14.5px; color:var(--muted); margin-top:4px; }
      .book-text .pull{ font-size:20px; margin:18px 0 16px; }
      .book-bio{ font-size:14.5px !important; line-height:1.6 !important; color:var(--muted); }
      .book-text .info-list{ margin-top:auto; }
      .book-text .info-row{ padding:11px 0; }
      .book-photo{ margin:0; position:relative; border-radius:18px; overflow:hidden; border:1px solid var(--line); background:var(--sand); box-shadow:0 18px 36px -26px rgba(43,41,37,.5); }
      .book-photo-a{ grid-area:1 / 2 / 2 / 3; min-height:300px; }
      .book-photo-b{ grid-area:2 / 1 / 3 / 3; aspect-ratio:16 / 6; }
      .book-cap{ position:absolute; left:12px; bottom:11px; font-size:10px; letter-spacing:.16em; text-transform:uppercase; color:#F3EFE6; background:rgba(39,52,74,.62); padding:4px 10px; border-radius:999px; }
      .book-nav{ display:flex; align-items:center; justify-content:space-between; gap:16px; margin-top:22px; padding-top:18px; border-top:1px solid var(--line); }
      .book-btn{ display:inline-flex; align-items:center; gap:8px; font-size:14px; font-weight:500; padding:10px 18px; border-radius:999px; border:1px solid var(--line); background:transparent; color:var(--ink); cursor:pointer; transition:all .22s ease; font-family:inherit; }
      .book-btn:hover{ border-color:var(--taupe); background:rgba(180,168,142,.1); transform:translateY(-1px); }
      .book-btn-primary{ background:var(--navy); color:#F7F4ED; border-color:var(--navy); }
      .book-btn-primary:hover{ background:var(--navy-soft); color:#F7F4ED; }
      .book-dots{ display:flex; gap:7px; flex-wrap:wrap; justify-content:center; }
      .book-dot{ width:7px; height:7px; border-radius:50%; background:var(--line); transition:all .25s ease; }
      .book-dot-on{ background:var(--navy); transform:scale(1.3); }

      .app-root :focus-visible{ outline:2px solid var(--navy); outline-offset:2px; border-radius:8px; }

      .m-viewport{ position:relative; transform:translateZ(0); overflow-y:auto; -webkit-overflow-scrolling:touch; background:var(--ivory); }
      .m-screen{ min-height:100%; display:flex; flex-direction:column; }
      .m-pad{ padding:16px 18px 30px; }
      .m-head{ position:sticky; top:0; z-index:20; display:flex; align-items:center; justify-content:space-between; gap:10px; padding:12px 14px; min-height:60px; background:rgba(247,244,237,.86); backdrop-filter:blur(10px); -webkit-backdrop-filter:blur(10px); border-bottom:1px solid var(--line); }
      .m-head-left{ display:flex; align-items:center; gap:10px; min-width:0; }
      .m-head-right{ display:flex; align-items:center; gap:8px; flex:none; }
      .m-title{ font-size:15px; font-weight:600; color:var(--ink); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
      .m-brand{ display:flex; align-items:center; gap:8px; }
      .m-iconbtn{ width:38px; height:38px; border-radius:50%; border:1px solid var(--line); background:var(--paper); display:flex; align-items:center; justify-content:center; color:var(--ink); cursor:pointer; flex:none; transition:transform .15s ease; }
      .m-iconbtn:active{ transform:scale(.92); }
      .m-landing-title{ font-size:clamp(29px,8.5vw,38px); line-height:1.1; color:var(--ink); margin-top:14px; }
      .m-field{ padding:14px 16px; font-size:16px; border-radius:14px; }
      .m-list{ display:flex; flex-direction:column; gap:12px; }
      .m-row, .m-sec-card, .m-emp{ display:flex; align-items:center; gap:13px; width:100%; text-align:left; background:var(--paper); border:1px solid var(--line); border-radius:18px; cursor:pointer; transition:transform .18s ease, box-shadow .18s ease, border-color .18s ease; }
      .m-row{ padding:16px; }
      .m-row:active, .m-sec-card:active, .m-emp:active{ transform:scale(.985); border-color:var(--taupe); box-shadow:0 12px 26px -18px rgba(43,41,37,.5); }
      .m-row-num{ font-family:'Newsreader',serif; font-size:18px; color:var(--taupe); width:24px; flex:none; }
      .m-row-main{ display:flex; flex-direction:column; min-width:0; flex:1; }
      .m-row-title{ font-size:18px; color:var(--ink); }
      .m-row-sub{ font-size:13px; color:var(--muted); margin-top:2px; line-height:1.4; }
      .m-row-meta{ font-size:10px; letter-spacing:.13em; text-transform:uppercase; color:var(--taupe-deep); margin-top:8px; }
      .m-row-chev{ color:var(--taupe-deep); flex:none; }
      .m-node{ width:100%; align-items:flex-start; text-align:left; padding:20px 22px; min-width:0; border-radius:18px; }
      .m-branch{ position:relative; padding-left:30px; }
      .m-branch-line{ position:absolute; left:14px; top:-4px; bottom:34px; width:1px; background:var(--line); }
      .m-sec-card{ position:relative; padding:16px; margin-top:14px; }
      .m-sec-card::before{ content:''; position:absolute; left:-16px; top:50%; width:16px; height:1px; background:var(--line); }
      .m-emp{ padding:11px 14px; }
      .m-emp-main{ display:flex; flex-direction:column; min-width:0; flex:1; }
      .m-emp-name{ font-family:'Newsreader',serif; font-size:17px; color:var(--ink); }
      .m-emp-title{ font-size:13px; color:var(--muted); margin-top:1px; }
      .m-emp-sec{ font-size:10px; letter-spacing:.13em; text-transform:uppercase; color:var(--taupe-deep); margin-top:5px; }
      .m-subhead{ position:sticky; top:60px; z-index:15; background:rgba(247,244,237,.93); backdrop-filter:blur(10px); -webkit-backdrop-filter:blur(10px); padding:12px 16px; border-bottom:1px solid var(--line); }
      .m-subhead .search-wrap{ max-width:none; }
      .m-subhead .search-input{ padding:12px 44px 12px 44px; font-size:15px; }
      .m-subhead .search-icon{ left:16px; }
      .m-chips{ display:flex; gap:8px; overflow-x:auto; margin-top:10px; padding-bottom:2px; scrollbar-width:none; }
      .m-chips::-webkit-scrollbar{ display:none; }
      .m-chips .chip{ white-space:nowrap; flex:none; }
      .m-sheet-backdrop{ position:fixed; inset:0; z-index:60; background:rgba(43,41,37,.45); backdrop-filter:blur(4px); -webkit-backdrop-filter:blur(4px); display:flex; align-items:flex-end; }
      .m-sheet{ position:relative; width:100%; max-height:92%; overflow-y:auto; background:var(--paper); border-radius:26px 26px 0 0; box-shadow:0 -30px 60px -30px rgba(43,41,37,.6); padding:10px 22px 34px; }
      .m-grab{ width:42px; height:5px; border-radius:999px; background:var(--line); margin:6px auto 16px; }
      .m-sheet-close{ position:absolute; top:14px; right:16px; width:36px; height:36px; display:flex; align-items:center; justify-content:center; border-radius:50%; border:1px solid var(--line); background:var(--ivory); color:var(--muted); cursor:pointer; z-index:3; }
      .m-pull{ padding-left:0; border-left:none; border-top:2px solid var(--taupe); padding-top:16px; margin-top:22px; font-size:21px; }
      .m-info-row{ grid-template-columns:24px 92px 1fr; }
      .m-book-sheet{ padding:10px 22px 0; }
      .m-book-head{ display:flex; align-items:center; justify-content:space-between; padding-right:44px; margin-bottom:14px; }
      .m-book-grid{ display:grid; grid-template-columns:1fr 108px; gap:14px; align-items:start; }
      .m-book-words{ min-width:0; }
      .m-book-words .pull{ font-size:17px; margin-top:14px; padding-top:14px; }
      .m-book-photo{ margin:0; position:relative; border-radius:14px; overflow:hidden; border:1px solid var(--line); background:var(--sand); }
      .m-book-photo-a{ width:108px; aspect-ratio:1/1; }
      .m-book-photo-b{ width:100%; aspect-ratio:16/9; margin-top:18px; }
      .m-book-nav{ position:sticky; bottom:0; margin:20px -22px 0; padding:14px 22px calc(16px + env(safe-area-inset-bottom)); background:linear-gradient(to top, var(--paper) 72%, rgba(252,250,244,0)); display:flex; align-items:center; justify-content:space-between; gap:12px; }
      .m-book-count{ font-size:12px; color:var(--muted); letter-spacing:.02em; text-align:center; flex:1; }
      .m-book-next{ display:inline-flex; align-items:center; gap:7px; background:var(--navy); color:#F7F4ED; border:none; border-radius:999px; padding:11px 20px; font-size:14px; font-weight:500; font-family:inherit; cursor:pointer; flex:none; }
      .m-book-next:active{ transform:scale(.97); }

      .frame-stage{ min-height:100vh; min-height:100dvh; display:flex; align-items:center; justify-content:center; padding:24px; background: radial-gradient(120% 90% at 50% -5%, rgba(180,168,142,.22), transparent 60%), var(--ivory); }
      .phone{ width:392px; max-width:100%; height:min(820px,86vh); background:#1d2433; border-radius:48px; padding:11px; box-shadow:0 50px 90px -40px rgba(29,36,51,.7), inset 0 0 0 2px rgba(255,255,255,.05); position:relative; }
      .phone-screen{ position:relative; width:100%; height:100%; border-radius:38px; overflow:hidden; background:var(--ivory); }
      .phone-notch{ position:absolute; top:14px; left:50%; transform:translateX(-50%); width:108px; height:24px; background:#1d2433; border-radius:999px; z-index:40; pointer-events:none; }

      .preview-toggle{ position:fixed; z-index:90; bottom:16px; left:50%; transform:translateX(-50%); display:flex; align-items:center; gap:6px; background:var(--navy); color:#F3EFE6; padding:6px 8px 6px 14px; border-radius:999px; box-shadow:0 14px 30px -14px rgba(39,52,74,.85); }
      .preview-toggle .pt-label{ letter-spacing:.14em; text-transform:uppercase; font-size:10px; color:#bcae93; font-weight:600; margin-right:2px; }
      .preview-toggle button{ border:none; cursor:pointer; font-size:12.5px; padding:6px 13px; border-radius:999px; background:transparent; color:#cbc4b5; font-family:inherit; transition:all .2s ease; }
      .preview-toggle button.pt-active{ background:#F3EFE6; color:var(--navy); font-weight:600; }

      @media (max-width:760px){
        .book{ padding:24px 20px 20px; }
        .book-spread{ grid-template-columns:1fr; gap:16px; }
        .book-text{ grid-area:auto; }
        .book-photo-a{ grid-area:auto; min-height:0; aspect-ratio:4/3; }
        .book-photo-b{ grid-area:auto; aspect-ratio:16/8; }
      }
      @media (prefers-reduced-motion: reduce){ .app-root *{ transition:none !important; animation:none !important; } }
    `}</style>
  );
}
