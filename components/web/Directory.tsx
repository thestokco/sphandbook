"use client";

import { ArrowDownUp, ArrowLeft, LogOut, Search, X } from "lucide-react";
import { Avatar } from "@/components/Avatar";
import { Masthead } from "@/components/Masthead";
import { Reveal } from "@/components/Reveal";
import {
  COMPANY,
  DEPARTMENTS,
  deptName,
  sectionName,
  sectionsOf,
  sectionTag,
  sortLabel,
} from "@/lib/data";
import type { DeptKey, Employee, SortKey } from "@/lib/types";

export function Directory({
  dept,
  section,
  setSection,
  query,
  setQuery,
  sort,
  onCycleSort,
  results,
  onBack,
  backLabel = "Sections",
  onSignOut,
  onSelect,
}: {
  dept: DeptKey;
  section: string;
  setSection: (s: string) => void;
  query: string;
  setQuery: (q: string) => void;
  sort: SortKey;
  onCycleSort: () => void;
  results: Employee[];
  onBack: () => void;
  backLabel?: string;
  onSignOut: () => void;
  onSelect: (e: Employee) => void;
}) {
  const title = section === "all" ? deptName(dept) : sectionName(dept, section);
  const tag =
    section === "all"
      ? DEPARTMENTS.find((d) => d.key === dept)?.tag
      : sectionTag(dept, section);
  return (
    <div className="screen-bg min-h-screen flex flex-col">
      <div className="dir-sticky">
        <Masthead
          left="Directory"
          right={
            <button className="btn btn-ghost" onClick={onSignOut}>
              <LogOut size={15} /> Sign out
            </button>
          }
        />
        <div className="page-pad dir-controls">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <p className="eyebrow mb-2">
                {COMPANY} · {deptName(dept)}
              </p>
              <div className="dir-titlerow">
                <h2 className="display section-title">{title}</h2>
                {tag && <span className="dir-tag">{tag}</span>}
                <span className="dir-count">
                  {results.length} {results.length === 1 ? "person" : "people"}
                </span>
              </div>
            </div>
            <button className="btn btn-ghost" onClick={onBack}>
              <ArrowLeft size={16} /> {backLabel}
            </button>
          </div>
          <div className="mt-6 flex items-center gap-3 flex-wrap">
            <div className="search-wrap" style={{ flex: "1 1 320px" }}>
              <Search size={18} className="search-icon" />
              <input
                className="search-input"
                placeholder="Search by name, section, or title…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
              />
              {query && (
                <button
                  className="search-clear"
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            <button
              className="sort-btn"
              onClick={onCycleSort}
              aria-label={`Sort: ${sortLabel(sort)}. Tap to change.`}
            >
              <ArrowDownUp size={15} /> {sortLabel(sort)}
            </button>
          </div>
          <div className="chips mt-5">
            <button
              className={`chip ${section === "all" ? "chip-active" : ""}`}
              onClick={() => setSection("all")}
            >
              All of {deptName(dept)}
            </button>
            {sectionsOf(dept).map((s) => (
              <button
                key={s.key}
                className={`chip ${section === s.key ? "chip-active" : ""}`}
                onClick={() => setSection(s.key)}
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>
      </div>
      <main className="flex-1 page-pad dir-cards">
        {results.length > 0 ? (
          <div
            key={dept + "-" + section}
            className="card-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
          >
            {results.map((e, i) => (
              <Reveal key={e.id} delay={Math.min(i, 10) * 45}>
                <button className="emp-card" onClick={() => onSelect(e)}>
                  <Avatar emp={e} size={72} />
                  <h3 className="emp-name">{e.name}</h3>
                  <p className="emp-title">{e.title}</p>
                  <span className="emp-dept">
                    {sectionName(e.dept, e.section)}
                  </span>
                </button>
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="empty">
            <p className="display" style={{ fontSize: 24 }}>
              No one matches that yet.
            </p>
            <p className="lede mt-2">Try a different name, section, or job title.</p>
          </div>
        )}
      </main>
    </div>
  );
}
