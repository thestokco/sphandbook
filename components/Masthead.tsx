import { Search } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { Logo } from "@/components/Logo";

/** Web editorial masthead: SP Group logo + optional eyebrow and right-side actions. */
export function Masthead({
  left,
  right,
}: {
  left?: ReactNode;
  right?: ReactNode;
}) {
  return (
    <header className="mast">
      <div className="mast-inner">
        <div className="flex items-center gap-3">
          <Link
            href="/departments"
            aria-label="SP Group — departments"
            className="logo-link"
          >
            <Logo size={56} />
          </Link>
          {left && <span className="mast-divider" />}
          {left && <span className="eyebrow">{left}</span>}
        </div>
        <div className="flex items-center gap-3">
          <Link href="/people" className="btn btn-ghost" aria-label="Find people">
            <Search size={15} /> Find people
          </Link>
          {right}
        </div>
      </div>
      <div className="mast-rule" />
    </header>
  );
}
