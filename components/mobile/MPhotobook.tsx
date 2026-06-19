"use client";

import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { useEffect, useState } from "react";
import { MBookSpread } from "@/components/mobile/MBookSpread";
import { deptName, sectionName } from "@/lib/data";
import { useReduceMotion, useSwipe } from "@/lib/hooks";
import type { Employee } from "@/lib/types";

export function MPhotobook({
  list,
  index,
  onNext,
  onPrev,
  onClose,
}: {
  list: Employee[];
  index: number;
  onNext: () => void;
  onPrev: () => void;
  onClose: () => void;
}) {
  const reduce = useReduceMotion();
  const [on, setOn] = useState(false);
  const [dir, setDir] = useState(1);
  const emp = list[index];
  const total = list.length;
  const goNext = () => {
    setDir(1);
    onNext();
  };
  const goPrev = () => {
    setDir(-1);
    onPrev();
  };
  const swipe = useSwipe(goNext, goPrev);
  useEffect(() => {
    const t = setTimeout(() => setOn(true), 10);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);
  return (
    <div
      className="m-sheet-backdrop"
      onClick={onClose}
      style={{
        opacity: on ? 1 : 0,
        transition: reduce ? "none" : "opacity .3s ease",
      }}
    >
      <div
        className="m-sheet m-book-sheet"
        role="dialog"
        aria-modal="true"
        aria-label={`Profile of ${emp.name}`}
        onClick={(e) => e.stopPropagation()}
        style={{
          transform: on ? "translateY(0)" : "translateY(100%)",
          transition: reduce ? "none" : "transform .4s cubic-bezier(.2,.8,.2,1)",
        }}
      >
        <div className="m-grab" />
        <button className="m-sheet-close" onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>
        <div className="m-book-head">
          <span className="eyebrow" style={{ fontSize: 10 }}>
            {deptName(emp.dept)}
          </span>
          <span className="book-counter">
            {String(index + 1).padStart(2, "0")} /{" "}
            {String(total).padStart(2, "0")}
          </span>
        </div>
        <div
          className={`book-flip ${dir === 1 ? "book-flip-next" : "book-flip-prev"}`}
          key={emp.id}
          {...swipe}
        >
          <MBookSpread emp={emp} />
        </div>
        <div className="m-book-nav">
          <button
            className="m-iconbtn"
            onClick={goPrev}
            aria-label="Previous person"
          >
            <ArrowLeft size={18} />
          </button>
          <span className="m-book-count">
            {index + 1} of {total} in {sectionName(emp.dept, emp.section)}
          </span>
          <button className="m-book-next" onClick={goNext}>
            Next <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
