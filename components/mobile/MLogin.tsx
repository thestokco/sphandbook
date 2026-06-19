"use client";

import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { MHeader } from "@/components/MHeader";
import { Reveal } from "@/components/Reveal";

export function MLogin({
  onBack,
  onSubmit,
}: {
  onBack: () => void;
  onSubmit: () => void;
}) {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  return (
    <div className="m-screen">
      <MHeader title="Sign in" onBack={onBack} />
      <div className="m-pad flex flex-col flex-1">
        <Reveal delay={60}>
          <p className="eyebrow" style={{ marginTop: 14 }}>
            Welcome back
          </p>
          <h2
            className="display"
            style={{ fontSize: 30, lineHeight: 1.1, marginTop: 8 }}
          >
            Open the handbook
          </h2>
          <p className="lede" style={{ fontSize: 15, marginTop: 10 }}>
            Enter any details to continue.
          </p>
          <div className="flex flex-col gap-4" style={{ marginTop: 26 }}>
            <label className="field">
              <span className="field-label">Email</span>
              <input
                type="email"
                className="field-input m-field"
                placeholder="you@sp.co"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <label className="field">
              <span className="field-label">Password</span>
              <input
                type="password"
                className="field-input m-field"
                placeholder="••••••••"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && onSubmit()}
              />
            </label>
          </div>
        </Reveal>
        <div style={{ flex: 1 }} />
        <button
          className="btn btn-primary w-full justify-center"
          style={{ padding: "15px 20px", fontSize: 15 }}
          onClick={onSubmit}
        >
          Sign in <ArrowRight size={17} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
