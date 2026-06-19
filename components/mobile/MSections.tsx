"use client";

import { LogOut } from "lucide-react";
import { MHeader } from "@/components/MHeader";
import { Reveal } from "@/components/Reveal";
import { branchesOf, COMPANY, DEPARTMENTS, sectionsOf } from "@/lib/data";
import type { DeptKey, Section } from "@/lib/types";

export function MSections({
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
    <button className="m-leaf" onClick={() => onOpenSection(s.key)}>
      <span className="m-leaf-name">{s.name}</span>
    </button>
  );

  return (
    <div className="m-screen">
      <MHeader
        title="Departments"
        onBack={onBack}
        right={
          <button className="m-iconbtn" onClick={onSignOut} aria-label="Sign out">
            <LogOut size={17} />
          </button>
        }
      />
      <div className="m-pad">
        <Reveal delay={40}>
          <p className="eyebrow">{COMPANY} · Department</p>
          <h2
            className="display"
            style={{ fontSize: 28, lineHeight: 1.08, marginTop: 6 }}
          >
            {dept.name}
          </h2>
          <p className="lede" style={{ fontSize: 14, marginTop: 8 }}>
            {dept.tag} Choose a section to meet its people.
          </p>
        </Reveal>
        <Reveal delay={180}>
          <div className="m-tree" style={{ marginTop: 22 }}>
            <div className="org-node m-node org-node-sm">
              <span className="org-node-glyph" />
              <span className="org-node-label">Department</span>
              <span className="org-node-name">{dept.name}</span>
            </div>
            {branches ? (
              branches.map((b) => (
                <div className="m-group" key={b.key}>
                  <div className="m-group-label">{b.key}</div>
                  <div className="m-branch">
                    <span className="m-branch-line" />
                    {b.sections.map((s) => (
                      <Leaf key={s.key} s={s} />
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="m-branch" style={{ marginTop: 16 }}>
                <span className="m-branch-line" />
                {secs.map((s) => (
                  <Leaf key={s.key} s={s} />
                ))}
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </div>
  );
}
