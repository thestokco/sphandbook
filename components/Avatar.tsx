"use client";

import Image from "next/image";
import { useState } from "react";
import type { Employee } from "@/lib/types";
import { initials, photoUrl } from "@/lib/data";

/** Round portrait with a monogram-initials fallback when the image fails. */
export function Avatar({ emp, size = 56 }: { emp: Employee; size?: number }) {
  const [err, setErr] = useState(false);
  if (err) {
    return (
      <div
        className="avatar-fallback"
        style={{ width: size, height: size, fontSize: size * 0.34, flex: "none" }}
      >
        {initials(emp.name)}
      </div>
    );
  }
  return (
    <Image
      src={photoUrl(emp)}
      alt={`Portrait of ${emp.name}`}
      width={size}
      height={size}
      onError={() => setErr(true)}
      className="avatar"
      style={{ width: size, height: size, flex: "none" }}
      unoptimized
    />
  );
}
