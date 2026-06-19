"use client";

import { ArrowRight } from "lucide-react";
import { useRef, useState, type CSSProperties } from "react";
import { Logo } from "@/components/Logo";
import { Reveal } from "@/components/Reveal";
import { useReduceMotion } from "@/lib/hooks";

type Tilt = { rx: number; ry: number; tx: number; ty: number; mx: number; my: number };
const REST: Tilt = { rx: 0, ry: 0, tx: 0, ty: 0, mx: 50, my: 42 };

/**
 * Landing hero with a cursor-reactive 3D tilt on the SP sphere: it floats,
 * tilts/parallax-shifts toward the pointer (CSS perspective), and a soft glow
 * follows the cursor. Tilt is pointer-only (desktop) and disabled under
 * prefers-reduced-motion.
 */
export function LandingHero({
  onEnter,
  variant,
}: {
  onEnter: () => void;
  variant: "web" | "mobile";
}) {
  const reduce = useReduceMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [t, setT] = useState<Tilt>(REST);
  const isMobile = variant === "mobile";

  const onMove = (e: React.PointerEvent) => {
    if (reduce || isMobile || e.pointerType !== "mouse") return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    setT({
      rx: -py * 14,
      ry: px * 18,
      tx: px * 16,
      ty: py * 12,
      mx: (px + 0.5) * 100,
      my: (py + 0.5) * 100,
    });
  };
  const reset = () => setT(REST);

  const tiltStyle: CSSProperties = reduce
    ? {}
    : {
        transform: `perspective(900px) translate3d(${t.tx}px, ${t.ty}px, 0) rotateX(${t.rx}deg) rotateY(${t.ry}deg)`,
      };

  return (
    <div
      ref={ref}
      className={`landing-hero${isMobile ? " landing-hero-m" : ""}`}
      onPointerMove={onMove}
      onPointerLeave={reset}
      style={{ "--spot-x": `${t.mx}%`, "--spot-y": `${t.my}%` } as CSSProperties}
    >
      <div className="hero-spot" aria-hidden="true" />
      <div className="hero-content">
        <Reveal delay={40}>
          <div className="hero-tilt" style={tiltStyle}>
            <Logo hero size={isMobile ? 64 : 110} />
          </div>
        </Reveal>
        <Reveal delay={240}>
          <h1
            className={`display ${isMobile ? "m-landing-title" : "landing-title"}`}
            style={{ marginTop: isMobile ? 22 : 30 }}
          >
            The people behind the power.
          </h1>
        </Reveal>
        <Reveal delay={420}>
          <p
            className="lede"
            style={{
              maxWidth: isMobile ? undefined : 560,
              fontSize: isMobile ? 16 : undefined,
              marginTop: isMobile ? 14 : 18,
            }}
          >
            {isMobile
              ? "Get to know your colleagues across SP Group — browse, open a section, and flip through each profile."
              : "Get to know your colleagues across SP Group — browse by department, open a section, and flip through each profile at your own pace."}
          </p>
        </Reveal>
        <Reveal delay={580} className={isMobile ? "w-full" : ""} style={{ marginTop: isMobile ? 26 : 34 }}>
          <button
            className={`btn btn-primary${isMobile ? " w-full justify-center" : ""}`}
            style={isMobile ? { padding: "15px 20px", fontSize: 15 } : undefined}
            onClick={onEnter}
          >
            Enter the handbook <ArrowRight size={17} strokeWidth={2} />
          </button>
        </Reveal>
      </div>
    </div>
  );
}
