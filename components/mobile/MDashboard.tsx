"use client";

import { ChevronRight, LogOut } from "lucide-react";
import { MHeader } from "@/components/MHeader";
import { PhotoBand } from "@/components/PhotoBand";
import { Reveal } from "@/components/Reveal";
import { COMPANIES, COMPANY_GROUP, greeting } from "@/lib/data";

export function MDashboard({
  onOpen,
  onSignOut,
}: {
  onOpen: (k: string) => void;
  onSignOut: () => void;
}) {
  return (
    <div className="m-screen">
      <MHeader
        right={
          <button className="m-iconbtn" onClick={onSignOut} aria-label="Sign out">
            <LogOut size={17} />
          </button>
        }
      />
      <div className="m-pad">
        <Reveal delay={40}>
          <p className="eyebrow">{greeting()}</p>
          <h2
            className="display"
            style={{ fontSize: 28, lineHeight: 1.08, marginTop: 6 }}
          >
            {COMPANY_GROUP}
          </h2>
          <p className="lede" style={{ fontSize: 14, marginTop: 8 }}>
            Choose a company to see how it&apos;s organised.
          </p>
        </Reveal>
        <div className="m-list" style={{ marginTop: 22 }}>
          {COMPANIES.map((c, i) => {
            return (
              <Reveal key={c.key} delay={120 + i * 55}>
                <button className="m-row" onClick={() => onOpen(c.key)}>
                  <span className="m-row-main">
                    <span
                      className="m-row-title display"
                      style={{ fontSize: 26 }}
                    >
                      {c.name}
                    </span>
                  </span>
                  <ChevronRight size={20} className="m-row-chev" />
                </button>
              </Reveal>
            );
          })}
        </div>
      </div>
      <div className="mt-auto" style={{ paddingTop: 24 }}>
        <PhotoBand />
      </div>
    </div>
  );
}
