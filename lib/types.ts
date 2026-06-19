/**
 * Domain types for SP Handbook.
 *
 * These describe the shape the UI consumes. A future Supabase-backed
 * implementation should satisfy the same interface (see lib/data.ts) so the
 * UI does not need to change.
 */

export type DeptKey =
  | "management"
  | "hr"
  | "finance"
  | "operations"
  | "engineering"
  | "sales"
  | "marketing"
  | "admin"
  | "projects";

export interface Department {
  key: DeptKey;
  name: string;
  tag: string;
}

/** A section within a department. `key` is unique across the whole app. */
export interface Section {
  key: string;
  name: string;
  tag: string;
  /**
   * Optional Branch this section sits under (the middle tier, e.g. Projects →
   * TRP/RCP/DP → sections). When present, the Sections screen renders a
   * Department → Branch → Section tree.
   */
  branch?: string;
}

/** A Branch (middle tier) and the sections beneath it (see branchesOf). */
export interface Branch {
  key: string;
  sections: Section[];
}

/** Directory sort modes. */
export type SortKey = "az" | "za" | "title";

export interface Employee {
  id: number;
  name: string;
  dept: DeptKey;
  /** A Section.key within this employee's department. */
  section: string;
  title: string;
  /** City. */
  loc: string;
  /** Phone extension, rendered as "x123". */
  ext: string;
  /** Portrait folder for the placeholder photo source ("w" | "m"). */
  g?: "w" | "m";
  /** Portrait index for the placeholder photo source. */
  p?: number;
  /** Explicit portrait URL (e.g. a real photo). Overrides the g/p placeholder. */
  photo?: string;
  /** Optional distinct second photo for the photobook's companion frame. */
  photo2?: string;
  /** Short italic pull-quote. */
  motto: string;
  /** Bio text. May contain multiple paragraphs separated by blank lines ("\n\n"). */
  bio: string;
}
