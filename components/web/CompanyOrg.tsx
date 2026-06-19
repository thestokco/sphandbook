"use client";

import { ArrowLeft, LogOut } from "lucide-react";
import { Avatar } from "@/components/Avatar";
import { Masthead } from "@/components/Masthead";
import { Reveal } from "@/components/Reveal";
import {
  branchesOf,
  ceoOf,
  companyDepartments,
  companyName,
  COMPANY_GROUP,
  sectionsOf,
} from "@/lib/data";
import type { DeptKey, Employee, Section } from "@/lib/types";

export function CompanyOrg({
  companyKey,
  onOpenSection,
  onOpenCeo,
  onBack,
  onSignOut,
}: {
  companyKey: string;
  onOpenSection: (dept: DeptKey, section: string) => void;
  onOpenCeo: (e: Employee) => void;
  onBack: () => void;
  onSignOut: () => void;
}) {
  const name = companyName(companyKey);
  const ceo = ceoOf(companyKey);
  const depts = companyDepartments(companyKey);

  const Leaf = ({ s, dept }: { s: Section; dept: DeptKey }) => (
    <button
      className="leaf"
      onClick={() => onOpenSection(dept, s.key)}
      title={s.tag}
    >
      <span className="leaf-name">{s.name}</span>
    </button>
  );

  return (
    <div className="screen-bg min-h-screen flex flex-col">
      <div className="page-sticky">
        <Masthead
          left={name}
          right={
            <button className="btn btn-ghost" onClick={onSignOut}>
              <LogOut size={15} /> Sign out
            </button>
          }
        />
        <div className="page-pad page-head">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <p className="eyebrow mb-2">{COMPANY_GROUP} · Company</p>
              <div className="dir-titlerow">
                <h2 className="display section-title">{name}</h2>
                <span className="dir-tag">
                  {ceo
                    ? `Led by ${ceo.name}, ${ceo.title}`
                    : "No teams added yet"}
                </span>
              </div>
            </div>
            <button className="btn btn-ghost" onClick={onBack}>
              <ArrowLeft size={16} /> {COMPANY_GROUP}
            </button>
          </div>
        </div>
      </div>
      <main className="flex-1 page-pad" style={{ paddingTop: 36, paddingBottom: 56 }}>
        {ceo ? (
          <Reveal delay={220}>
            <div className="org-scroll mt-2">
              <div className="tree tree-compact">
                <ul>
                  <li>
                    <button
                      className="ceo-node"
                      onClick={() => onOpenCeo(ceo)}
                      title={`${ceo.name} — ${ceo.title}`}
                    >
                      <Avatar emp={ceo} size={66} />
                      <span className="ceo-node-name">{ceo.name}</span>
                      <span className="ceo-node-title">{ceo.title}</span>
                      <span className="ceo-node-tag">CEO</span>
                    </button>
                    <ul>
                      {depts.map((d) => {
                        const branches = branchesOf(d.key);
                        return (
                          <li key={d.key}>
                            <div className="org-node org-node-sm">
                              <span className="org-node-glyph" />
                              <span className="org-node-label">Department</span>
                              <span className="org-node-name">{d.name}</span>
                            </div>
                            <ul>
                              {branches
                                ? branches.map((b) => (
                                    <li key={b.key}>
                                      <div className="group-node">
                                        <span className="group-node-name">
                                          {b.key}
                                        </span>
                                      </div>
                                      <ul>
                                        {b.sections.map((s) => (
                                          <li key={s.key}>
                                            <Leaf s={s} dept={d.key} />
                                          </li>
                                        ))}
                                      </ul>
                                    </li>
                                  ))
                                : sectionsOf(d.key).map((s) => (
                                    <li key={s.key}>
                                      <Leaf s={s} dept={d.key} />
                                    </li>
                                  ))}
                            </ul>
                          </li>
                        );
                      })}
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
          </Reveal>
        ) : (
          <Reveal delay={200}>
            <div className="empty" style={{ marginTop: 48 }}>
              <p className="display" style={{ fontSize: 24 }}>
                Nothing here yet.
              </p>
              <p className="lede mt-2">
                {name} hasn&apos;t been organised into teams yet.
              </p>
            </div>
          </Reveal>
        )}
      </main>
    </div>
  );
}
