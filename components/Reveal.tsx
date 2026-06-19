"use client";

import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { useReduceMotion } from "@/lib/hooks";

/** Staggered fade-up reveal, matched to the prototype's timing. */
export function Reveal({
  delay = 0,
  children,
  className = "",
  style = {},
}: {
  delay?: number;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  const reduce = useReduceMotion();
  const [on, setOn] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setOn(true), reduce ? 0 : delay);
    return () => clearTimeout(t);
  }, [reduce, delay]);
  return (
    <div
      className={className}
      style={{
        ...style,
        opacity: on ? 1 : 0,
        transform: on ? "none" : "translateY(14px)",
        transition: reduce
          ? "none"
          : "opacity .7s cubic-bezier(.2,.7,.2,1), transform .7s cubic-bezier(.2,.7,.2,1)",
      }}
    >
      {children}
    </div>
  );
}
