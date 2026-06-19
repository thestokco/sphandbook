"use client";

import { ArrowDownUp, ChevronRight, LogOut, Search, X } from "lucide-react";
import { Avatar } from "@/components/Avatar";
import { MHeader } from "@/components/MHeader";
import { Reveal } from "@/components/Reveal";
import { deptName, sectionName, sortLabel } from "@/lib/data";
import type { Employee, SortKey } from "@/lib/types";

export function MPeople({
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
    <div className="m-screen">
      <MHeader
        title="Find people"
        onBack={onBack}
        right={
          <button className="m-iconbtn" onClick={onSignOut} aria-label="Sign out">
            <LogOut size={17} />
          </button>
        }
      />
      <div className="m-subhead">
        <div
          className="flex items-baseline justify-between"
          style={{ marginBottom: 12, gap: 12 }}
        >
          <h2 className="display" style={{ fontSize: 22, lineHeight: 1.05 }}>
            Find people
          </h2>
          <span className="result-count" style={{ whiteSpace: "nowrap" }}>
            {results.length} {results.length === 1 ? "person" : "people"}
          </span>
        </div>
        <div style={{ display: "flex", gap: 9, alignItems: "center" }}>
          <div className="search-wrap" style={{ flex: 1 }}>
            <Search size={17} className="search-icon" />
            <input
              className="search-input"
              placeholder="Search name, title, section…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
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
      <div className="m-pad" style={{ paddingTop: 18 }}>
        {results.length > 0 ? (
          <div className="m-list">
            {results.map((e, i) => (
              <Reveal key={e.id} delay={Math.min(i, 8) * 30}>
                <button className="m-emp" onClick={() => onSelect(e)}>
                  <Avatar emp={e} size={52} />
                  <span className="m-emp-main">
                    <span className="m-emp-name">{e.name}</span>
                    <span className="m-emp-title">{e.title}</span>
                    <span className="m-emp-sec">
                      {deptName(e.dept)} · {sectionName(e.dept, e.section)}
                    </span>
                  </span>
                  <ChevronRight size={18} className="m-row-chev" />
                </button>
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="empty" style={{ padding: "60px 10px" }}>
            <p className="display" style={{ fontSize: 21 }}>
              No one matches that yet.
            </p>
            <p className="lede mt-2" style={{ fontSize: 14 }}>
              Try a different name, title, or section.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
