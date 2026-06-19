"use client";

import { Photo } from "@/components/Photo";
import { deptName, sectionName } from "@/lib/data";
import type { Employee } from "@/lib/types";

/**
 * Mobile photobook spread — a single editorial column:
 *   1. Photo
 *   2. Wording panel (section, name, role, pull-quote, bio, contacts)
 *   3. Monochrome companion photo
 *
 * The web layout keeps its two-column spread (see components/BookSpread.tsx);
 * this is the phone-friendly stacked variant.
 */
export function MBookSpread({ emp }: { emp: Employee }) {
  return (
    <div className="m-pb">
      <figure className="m-pb-photo m-pb-photo-top">
        <Photo emp={emp} />
      </figure>
      <div className="m-pb-text">
        <span className="emp-dept">{sectionName(emp.dept, emp.section)}</span>
        <h2 className="display m-pb-name">{emp.name}</h2>
        <p className="m-pb-role">
          {emp.title} — {deptName(emp.dept)}
        </p>
        <blockquote className="pull m-pb-pull">
          &ldquo;{emp.motto}&rdquo;
        </blockquote>
        {emp.bio.split("\n\n").map((para, i) => (
          <p key={i} className="lede m-pb-bio">
            {para}
          </p>
        ))}
      </div>
      <figure className="m-pb-photo m-pb-photo-bottom">
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
