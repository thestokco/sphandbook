"use client";

import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { useEffect, useState } from "react";
import { BookSpread } from "@/components/BookSpread";
import { deptName } from "@/lib/data";
import { useReduceMotion, useSwipe } from "@/lib/hooks";
import type { Employee } from "@/lib/types";

export function Photobook({
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
      if (e.key === "ArrowRight") {
        setDir(1);
        onNext();
      }
      if (e.key === "ArrowLeft") {
        setDir(-1);
        onPrev();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose, onNext, onPrev]);
  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
      style={{
        opacity: on ? 1 : 0,
        transition: reduce ? "none" : "opacity .32s ease",
      }}
    >
      <div
        className="book"
        role="dialog"
        aria-modal="true"
        aria-label={`Profile of ${emp.name}`}
        onClick={(e) => e.stopPropagation()}
        style={{
          opacity: on ? 1 : 0,
          transform: on
            ? "translateY(0) scale(1)"
            : "translateY(16px) scale(.97)",
          transition: reduce
            ? "none"
            : "opacity .38s cubic-bezier(.2,.7,.2,1), transform .38s cubic-bezier(.2,.7,.2,1)",
        }}
      >
        <button className="modal-close" onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>
        <div className="book-head">
          <span className="eyebrow">{deptName(emp.dept)} · Directory</span>
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
          <BookSpread emp={emp} />
        </div>
        <div className="book-nav">
          <button className="book-btn" onClick={goPrev}>
            <ArrowLeft size={16} /> Previous
          </button>
          <span className="book-dots">
            {list.map((p, i) => (
              <span
                key={p.id}
                className={`book-dot ${i === index ? "book-dot-on" : ""}`}
              />
            ))}
          </span>
          <button className="book-btn book-btn-primary" onClick={goNext}>
            Next <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
