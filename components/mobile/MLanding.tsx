"use client";

import { LandingHero } from "@/components/LandingHero";

export function MLanding({ onEnter }: { onEnter: () => void }) {
  return (
    <div className="m-screen landing-bg">
      <LandingHero onEnter={onEnter} variant="mobile" />
    </div>
  );
}
