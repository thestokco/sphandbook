"use client";

import { ArrowDownUp, ArrowLeft, LogOut, Search, X } from "lucide-react";
import { Avatar } from "@/components/Avatar";
import { Masthead } from "@/components/Masthead";
import { Reveal } from "@/components/Reveal";
import { COMPANY_GROUP, deptName, sectionName, sortLabel } from "@/lib/data";
import type { Employee, SortKey } from "@/lib/types";

export function People({
  query,
  setQuery,
  sort,
  onCycleSort,
  results,
  onBack,
  onSignOut,
  onSelect,
}: {
  query: string;
  setQuery: (q: string) => void;
  sort: SortKey;
  onCycleSort: () => void;
  results: Employee[];
  onBack: () => void;
  onSignOut: () => void;
  onSelect: (e: Employee) => void;
}) {
  return (
    <div className="screen-bg min-h-screen flex flex-col">
      <div className="dir-sticky">
        <Masthead
          left="Find people"
          right={
            <button className="btn btn-ghost" onClick={onSignOut}>
              <LogOut size={15} /> Sign out
            </button>
          }
        />
        <div className="page-pad dir-controls">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <p className="eyebrow mb-2">{COMPANY_GROUP}</p>
              <div className="dir-titlerow">
                <h2 className="display section-title">Find people</h2>
                <span className="dir-tag">Everyone across {COMPANY_GROUP}</span>
                <span className="dir-count">
                  {results.length} {results.length === 1 ? "person" : "people"}
                </span>
              </div>
            </div>
            <button className="btn btn-ghost" onClick={onBack}>
              <ArrowLeft size={16} /> {COMPANY_GROUP}
            </button>
          </div>
          <div className="mt-6 flex items-center gap-3 flex-wrap">
            <div className="search-wrap" style={{ flex: "1 1 320px" }}>
              <Search size={18} className="search-icon" />
              <input
                className="search-input"
                placeholder="Search by name, title, department, branch, or section…"
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
        </div>
      </div>
      <main className="flex-1 page-pad dir-cards">
        {results.length > 0 ? (
          <div className="card-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {results.map((e, i) => (
              <Reveal key={e.id} delay={Math.min(i, 10) * 30}>
                <button className="emp-card" onClick={() => onSelect(e)}>
                  <Avatar emp={e} size={72} />
                  <h3 className="emp-name">{e.name}</h3>
                  <p className="emp-title">{e.title}</p>
                  <span className="emp-dept">
                    {deptName(e.dept)} · {sectionName(e.dept, e.section)}
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
            <p className="lede mt-2">
              Try a different name, title, department, or section.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
