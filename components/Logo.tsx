/**
 * SP Group logo, rendered from the official assets in /public:
 *   public/sp-group-logo.png   full lockup (mark + "SPgroup")
 *   public/sp-group-mark.png   mark only (the sphere)
 * Replace those files (and re-run scripts/generate-logo.mjs for the icons) to
 * update the brand everywhere. A plain <img> is used so any aspect ratio works.
 */
export function Logo({
  size = 28,
  showWord = true,
  hero = false,
}: {
  size?: number;
  showWord?: boolean;
  hero?: boolean;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={showWord ? "/sp-group-logo.png" : "/sp-group-mark.png"}
      alt="SP Group"
      className={hero ? "sp-logo-img sp-logo-hero" : "sp-logo-img"}
      style={{ height: size, width: "auto" }}
      loading={hero ? "eager" : undefined}
    />
  );
}
