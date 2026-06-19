"use client";

import { LogOut } from "lucide-react";
import { Masthead } from "@/components/Masthead";
import { PhotoBand } from "@/components/PhotoBand";
import { Reveal } from "@/components/Reveal";
import { COMPANIES, COMPANY_GROUP, peopleInCompany } from "@/lib/data";
import { useGreeting } from "@/lib/hooks";

export function Dashboard({
  onOpen,
  onSignOut,
}: {
  onOpen: (k: string) => void;
  onSignOut: () => void;
}) {
  const greeting = useGreeting();
  return (
    <div className="screen-bg min-h-screen flex flex-col">
      <div className="page-sticky">
        <Masthead
          left={COMPANY_GROUP}
          right={
            <button className="btn btn-ghost" onClick={onSignOut}>
              <LogOut size={15} /> Sign out
            </button>
          }
        />
        <div className="page-pad page-head">
          <Reveal delay={60}>
            <p className="eyebrow mb-3">{greeting}</p>
            <h2 className="display section-title">{COMPANY_GROUP}</h2>
            <p className="lede mt-3" style={{ maxWidth: 520 }}>
              Choose a company to see how it&apos;s organised.
            </p>
          </Reveal>
        </div>
      </div>
      <main
        className="flex-1 page-pad flex flex-col"
        style={{ paddingTop: 28, paddingBottom: 0 }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {COMPANIES.map((c, i) => {
              const n = peopleInCompany(c.key);
              return (
                <Reveal key={c.key} delay={180 + i * 70}>
                  <button className="dept-card" onClick={() => onOpen(c.key)}>
                    <div className="dept-top">
                      <h3 className="display dept-name">{c.name}</h3>
                      <span className="dept-count">{n}</span>
                    </div>
                  </button>
                </Reveal>
              );
            })}
          </div>
        <Reveal delay={420} className="mt-auto">
          <PhotoBand />
        </Reveal>
      </main>
    </div>
  );
}
