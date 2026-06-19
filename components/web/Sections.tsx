"use client";

import { ArrowLeft, LogOut } from "lucide-react";
import { Masthead } from "@/components/Masthead";
import { Reveal } from "@/components/Reveal";
import { branchesOf, COMPANY, DEPARTMENTS, sectionsOf } from "@/lib/data";
import type { DeptKey, Section } from "@/lib/types";

export function Sections({
  deptKey,
  onOpenSection,
  onBack,
  onSignOut,
}: {
  deptKey: DeptKey;
  onOpenSection: (s: string) => void;
  onBack: () => void;
  onSignOut: () => void;
}) {
  const dept = DEPARTMENTS.find((d) => d.key === deptKey)!;
  const branches = branchesOf(deptKey);
  const secs = sectionsOf(deptKey);

  const Leaf = ({ s }: { s: Section }) => (
    <button className="leaf" onClick={() => onOpenSection(s.key)} title={s.tag}>
      <span className="leaf-name">{s.name}</span>
    </button>
  );

  return (
    <div className="screen-bg min-h-screen flex flex-col">
      <div className="page-sticky">
        <Masthead
          left="Sections"
          right={
            <button className="btn btn-ghost" onClick={onSignOut}>
              <LogOut size={15} /> Sign out
            </button>
          }
        />
        <div className="page-pad page-head">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <p className="eyebrow mb-2">{COMPANY} · Department</p>
              <div className="dir-titlerow">
                <h2 className="display section-title">{dept.name}</h2>
                <span className="dir-tag">{dept.tag}</span>
              </div>
            </div>
            <button className="btn btn-ghost" onClick={onBack}>
              <ArrowLeft size={16} /> Departments
            </button>
          </div>
        </div>
      </div>
      <main className="flex-1 page-pad" style={{ paddingTop: 36, paddingBottom: 56 }}>
        <Reveal delay={220}>
          <div className="org-scroll mt-2">
            <div className="tree tree-compact">
              <ul>
                <li>
                  <div className="org-node org-node-sm">
                    <span className="org-node-glyph" />
                    <span className="org-node-label">Department</span>
                    <span className="org-node-name">{dept.name}</span>
                  </div>
                  <ul>
                    {branches
                      ? branches.map((b) => (
                          <li key={b.key}>
                            <div className="group-node">
                              <span className="group-node-name">{b.key}</span>
                            </div>
                            <ul>
                              {b.sections.map((s) => (
                                <li key={s.key}>
                                  <Leaf s={s} />
                                </li>
                              ))}
                            </ul>
                          </li>
                        ))
                      : secs.map((s) => (
                          <li key={s.key}>
                            <Leaf s={s} />
                          </li>
                        ))}
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </Reveal>
      </main>
    </div>
  );
}
