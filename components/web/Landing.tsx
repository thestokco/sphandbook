"use client";

import { LandingHero } from "@/components/LandingHero";

export function Landing({ onEnter }: { onEnter: () => void }) {
  return (
    <div className="screen-bg landing-bg min-h-screen flex flex-col">
      <LandingHero onEnter={onEnter} variant="web" />
    </div>
  );
}
