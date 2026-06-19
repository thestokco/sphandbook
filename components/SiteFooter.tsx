import { COMPANY_GROUP } from "@/lib/data";

/** Thin global footer line. Minimal placeholder content for now — easy to fill later. */
export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <span className="site-footer-brand">{COMPANY_GROUP} · Internal Handbook</span>
        <span className="site-footer-note">Demo · 2026</span>
      </div>
    </footer>
  );
}
