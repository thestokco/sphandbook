"use client";

import { LogOut } from "lucide-react";
import { Avatar } from "@/components/Avatar";
import { MHeader } from "@/components/MHeader";
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

export function MCompanyOrg({
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
    <button className="m-leaf" onClick={() => onOpenSection(dept, s.key)}>
      <span className="m-leaf-name">{s.name}</span>
    </button>
  );

  return (
    <div className="m-screen">
      <MHeader
        title={COMPANY_GROUP}
        onBack={onBack}
        right={
          <button className="m-iconbtn" onClick={onSignOut} aria-label="Sign out">
            <LogOut size={17} />
          </button>
        }
      />
      <div className="m-pad">
        <Reveal delay={40}>
          <p className="eyebrow">{COMPANY_GROUP} · Company</p>
          <h2
            className="display"
            style={{ fontSize: 28, lineHeight: 1.08, marginTop: 6 }}
          >
            {name}
          </h2>
          <p className="lede" style={{ fontSize: 14, marginTop: 8 }}>
            {ceo
              ? `Led by ${ceo.name}, ${ceo.title}.`
              : "No teams have been added to this company yet."}
          </p>
        </Reveal>

        {ceo ? (
          <Reveal delay={180}>
            <div className="m-tree" style={{ marginTop: 22 }}>
              <button className="m-ceo-node" onClick={() => onOpenCeo(ceo)}>
                <Avatar emp={ceo} size={56} />
                <span className="m-ceo-main">
                  <span className="m-ceo-name">{ceo.name}</span>
                  <span className="m-ceo-title">{ceo.title}</span>
                  <span className="m-ceo-tag">CEO</span>
                </span>
              </button>
              {depts.map((d) => {
                const branches = branchesOf(d.key);
                return (
                  <div key={d.key}>
                    <div className="org-node m-node org-node-sm">
                      <span className="org-node-glyph" />
                      <span className="org-node-label">Department</span>
                      <span className="org-node-name">{d.name}</span>
                    </div>
                    {branches ? (
                      branches.map((b) => (
                        <div className="m-group" key={b.key}>
                          <div className="m-group-label">{b.key}</div>
                          <div className="m-branch">
                            <span className="m-branch-line" />
                            {b.sections.map((s) => (
                              <Leaf key={s.key} s={s} dept={d.key} />
                            ))}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="m-branch" style={{ marginTop: 16 }}>
                        <span className="m-branch-line" />
                        {sectionsOf(d.key).map((s) => (
                          <Leaf key={s.key} s={s} dept={d.key} />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Reveal>
        ) : (
          <Reveal delay={160}>
            <div className="empty" style={{ padding: "56px 10px" }}>
              <p className="display" style={{ fontSize: 21 }}>
                Nothing here yet.
              </p>
              <p className="lede mt-2" style={{ fontSize: 14 }}>
                {name} hasn&apos;t been organised into teams yet.
              </p>
            </div>
          </Reveal>
        )}
      </div>
    </div>
  );
}
