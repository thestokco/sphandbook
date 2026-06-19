import type { ReactNode } from "react";
import { SiteFooter } from "@/components/SiteFooter";

/**
 * Renders both layouts; the real viewport chooses which is visible via the
 * .layout-web / .layout-mobile media-query rules in globals.css. The mobile
 * branch gets its own scroll container (the prototype's .m-viewport) so its
 * sticky bars and bottom sheet behave like an app. The footer lives inside
 * each scroll context so the sticky header never shifts.
 */
export function ResponsiveShell({
  web,
  mobile,
}: {
  web: ReactNode;
  mobile: ReactNode;
}) {
  return (
    <>
      <div className="layout-web">
        {web}
        <SiteFooter />
      </div>
      <div className="layout-mobile">
        <div className="m-viewport" style={{ height: "100dvh" }}>
          {mobile}
          <SiteFooter />
        </div>
      </div>
    </>
  );
}
