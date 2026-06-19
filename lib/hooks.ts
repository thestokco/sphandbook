"use client";

import { useEffect, useRef, useState } from "react";

/** Tracks the user's prefers-reduced-motion setting. */
export function useReduceMotion(): boolean {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduce(m.matches);
    const handler = (e: MediaQueryListEvent) => setReduce(e.matches);
    m.addEventListener?.("change", handler);
    return () => m.removeEventListener?.("change", handler);
  }, []);
  return reduce;
}

type SwipeHandlers = {
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchEnd: (e: React.TouchEvent) => void;
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseUp: (e: React.MouseEvent) => void;
};

/**
 * Horizontal swipe (touch) + drag (mouse). `onLeft` fires on a swipe-left,
 * `onRight` on a swipe-right. A clear horizontal intent is required so vertical
 * scrolling keeps working.
 */
export function useSwipe(onLeft: () => void, onRight: () => void): SwipeHandlers {
  const start = useRef<{ x: number; y: number } | null>(null);
  const begin = (x: number, y: number) => {
    start.current = { x, y };
  };
  const finish = (x: number, y: number) => {
    if (!start.current) return;
    const dx = x - start.current.x;
    const dy = y - start.current.y;
    start.current = null;
    if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.4) {
      if (dx < 0) onLeft();
      else onRight();
    }
  };
  return {
    onTouchStart: (e) => begin(e.touches[0].clientX, e.touches[0].clientY),
    onTouchEnd: (e) =>
      finish(e.changedTouches[0].clientX, e.changedTouches[0].clientY),
    onMouseDown: (e) => begin(e.clientX, e.clientY),
    onMouseUp: (e) => finish(e.clientX, e.clientY),
  };
}
