import { ChevronLeft, Search } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { Logo } from "@/components/Logo";

/** Mobile sticky app bar: SP Group logo, optional back chevron, title, actions. */
export function MHeader({
  title,
  onBack,
  right,
}: {
  title?: ReactNode;
  onBack?: () => void;
  right?: ReactNode;
}) {
  return (
    <header className="m-head">
      <div className="m-head-left">
        {onBack && (
          <button className="m-iconbtn" onClick={onBack} aria-label="Back">
            <ChevronLeft size={20} />
          </button>
        )}
        <Link
          href="/departments"
          aria-label="SP Group — departments"
          className="logo-link"
        >
          <Logo size={38} showWord={!title} />
        </Link>
        {title && <span className="m-title">{title}</span>}
      </div>
      <div className="m-head-right">
        <Link href="/people" className="m-iconbtn" aria-label="Find people">
          <Search size={18} />
        </Link>
        {right}
      </div>
    </header>
  );
}
