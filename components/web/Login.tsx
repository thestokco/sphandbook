"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useState } from "react";
import { Masthead } from "@/components/Masthead";
import { Reveal } from "@/components/Reveal";

export function Login({
  onBack,
  onSubmit,
}: {
  onBack: () => void;
  onSubmit: () => void;
}) {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  return (
    <div className="screen-bg min-h-screen flex flex-col">
      <Masthead
        left="Sign in"
        right={
          <button className="btn btn-ghost" onClick={onBack}>
            <ArrowLeft size={16} /> Back
          </button>
        }
      />
      <main className="flex-1 flex items-center justify-center page-pad">
        <Reveal delay={80} className="w-full" style={{ maxWidth: 420 }}>
          <div className="card login-card">
            <p className="eyebrow">Welcome back</p>
            <h2
              className="display"
              style={{ fontSize: 34, lineHeight: 1.1, marginTop: 8 }}
            >
              Open the handbook
            </h2>
            <p className="lede mt-3" style={{ fontSize: 15 }}>
              Enter any details to continue — this is a demonstration.
            </p>
            <div className="mt-7 flex flex-col gap-4">
              <label className="field">
                <span className="field-label">Email</span>
                <input
                  type="email"
                  className="field-input"
                  placeholder="you@sp.co"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>
              <label className="field">
                <span className="field-label">Password</span>
                <input
                  type="password"
                  className="field-input"
                  placeholder="••••••••"
                  value={pw}
                  onChange={(e) => setPw(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && onSubmit()}
                />
              </label>
              <button
                className="btn btn-primary mt-2 w-full justify-center"
                onClick={onSubmit}
              >
                Sign in <ArrowRight size={17} strokeWidth={2} />
              </button>
            </div>
          </div>
        </Reveal>
      </main>
    </div>
  );
}
