"use client";

import { useEffect, useState } from "react";
import { useReduceMotion } from "@/lib/hooks";

/**
 * Route-transition wrapper. Remounts on each navigation and plays the
 * prototype's 300ms fade/translate entrance. Disabled under reduced motion.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const reduce = useReduceMotion();
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShown(true), 10);
    return () => clearTimeout(t);
  }, []);
  return (
    <div
      style={{
        opacity: shown ? 1 : 0,
        // Must settle to "none" (not "translateY(0)") — a lingering transform on
        // this ancestor would break position: sticky for the page headers.
        transform: shown ? "none" : "translateY(10px)",
        transition: reduce ? "none" : "opacity 300ms ease, transform 300ms ease",
      }}
    >
      {children}
    </div>
  );
}
