"use client";

import Image from "next/image";
import { useState } from "react";
import type { Employee } from "@/lib/types";
import { initials, photoUrl } from "@/lib/data";

/**
 * Full-bleed portrait used inside the photobook frames (the parent figure is
 * positioned and sized). `mono` renders the desaturated companion treatment.
 * Falls back to a monogram tile if the image fails.
 */
export function Photo({
  emp,
  mono = false,
  src,
}: {
  emp: Employee;
  mono?: boolean;
  /** Explicit image source (e.g. a distinct second photo). Defaults to the primary portrait. */
  src?: string;
}) {
  const [err, setErr] = useState(false);
  if (err) {
    return (
      <div className={`photo-fallback ${mono ? "photo-mono" : ""}`}>
        <span>{initials(emp.name)}</span>
      </div>
    );
  }
  return (
    <Image
      src={src ?? photoUrl(emp)}
      alt={`Portrait of ${emp.name}`}
      fill
      sizes="(max-width: 640px) 100vw, 50vw"
      onError={() => setErr(true)}
      className={`photo-img ${mono ? "photo-mono" : ""}`}
      unoptimized
    />
  );
}
