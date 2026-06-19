"use client";

import { Photo } from "@/components/Photo";
import { deptName, sectionName } from "@/lib/data";
import type { Employee } from "@/lib/types";

/**
 * The shared photobook spread, used by both the web dialog and the mobile
 * bottom sheet so every profile has the same layout at every width:
 *   Row 1 — two columns: tinted wording panel (left) + photo (right)
 *   Row 2 — one column:  full-width monochrome companion photo
 */
export function BookSpread({ emp }: { emp: Employee }) {
  return (
    <div className="book-spread">
      <div className="book-text">
        <span className="emp-dept">{sectionName(emp.dept, emp.section)}</span>
        <h2 className="display book-name">{emp.name}</h2>
        <p className="book-role">
          {emp.title} — {deptName(emp.dept)}
        </p>
        <blockquote className="pull">&ldquo;{emp.motto}&rdquo;</blockquote>
        {emp.bio.split("\n\n").map((para, i) => (
          <p key={i} className="lede book-bio">
            {para}
          </p>
        ))}
      </div>
      <figure className="book-photo book-photo-a">
        <Photo emp={emp} />
      </figure>
      <figure className="book-photo book-photo-b">
        {emp.photo2 ? (
          <Photo emp={emp} src={emp.photo2} />
        ) : (
          <Photo emp={emp} mono />
        )}
        <figcaption className="book-cap">{emp.loc}</figcaption>
      </figure>
    </div>
  );
}
