"use client";

import { useEffect, useMemo, useState } from "react";
import { allPhotoUrls } from "@/lib/data";
import { useReduceMotion } from "@/lib/hooks";

/** Mixed-size tile layout over a 6-column grid (10 tiles filling 6×3 cells). */
const TILES = [
  { col: "1 / 3", row: "1 / 3" },
  { col: "3 / 4", row: "1 / 2" },
  { col: "4 / 6", row: "1 / 3" },
  { col: "6 / 7", row: "1 / 2" },
  { col: "3 / 4", row: "2 / 3" },
  { col: "6 / 7", row: "2 / 3" },
  { col: "1 / 2", row: "3 / 4" },
  { col: "2 / 4", row: "3 / 4" },
  { col: "4 / 5", row: "3 / 4" },
  { col: "5 / 7", row: "3 / 4" },
];

/** One tile that crossfades whenever its `src` prop changes. */
function Tile({ src, col, row }: { src: string; col: string; row: string }) {
  const [st, setSt] = useState({ slots: [src, src], top: 0 });
  const [first, setFirst] = useState(true);

  useEffect(() => {
    if (first) {
      setFirst(false);
      return;
    }
    setSt((p) => {
      const next = p.top ^ 1;
      const slots = [...p.slots];
      slots[next] = src;
      return { slots, top: next };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  return (
    <div className="pb-tile" style={{ gridColumn: col, gridRow: row }}>
      {st.slots.map((s, i) => (
        <img
          key={i}
          src={s}
          alt=""
          aria-hidden="true"
          loading="lazy"
          className="pb-img"
          style={{ opacity: st.top === i ? 1 : 0 }}
        />
      ))}
    </div>
  );
}

/** Ambient, low-opacity mosaic of everyone's portraits — a quiet "wall of faces". */
export function PhotoBand() {
  const photos = useMemo(() => allPhotoUrls(), []);
  const reduce = useReduceMotion();
  const [assign, setAssign] = useState<number[]>(() =>
    TILES.map((_, i) => (photos.length ? i % photos.length : 0)),
  );

  useEffect(() => {
    if (reduce || photos.length <= 1) return;
    const id = setInterval(() => {
      setAssign((prev) => {
        const next = [...prev];
        const t = Math.floor(Math.random() * TILES.length);
        const shown = new Set(next);
        let cand = next[t];
        for (let i = 0; i < 24; i++) {
          const c = Math.floor(Math.random() * photos.length);
          if (!shown.has(c)) {
            cand = c;
            break;
          }
        }
        next[t] = cand;
        return next;
      });
    }, 2200);
    return () => clearInterval(id);
  }, [reduce, photos.length]);

  if (photos.length === 0) return null;

  return (
    <div className="photo-band" aria-hidden="true">
      <div className="pb-grid">
        {TILES.map((t, i) => (
          <Tile
            key={i}
            src={photos[assign[i] % photos.length]}
            col={t.col}
            row={t.row}
          />
        ))}
      </div>
    </div>
  );
}
