import Link from "next/link";

export default function NotFound() {
  return (
    <div className="screen-bg landing-bg min-h-screen flex flex-col items-center justify-center page-pad text-center">
      <p className="eyebrow mb-3">Error · 404</p>
      <h1 className="display section-title">This page wandered off.</h1>
      <p className="lede mt-4" style={{ maxWidth: 420 }}>
        The page you were looking for isn&apos;t here. Let&apos;s get you back to
        the handbook.
      </p>
      <Link href="/departments" className="btn btn-primary mt-8">
        Back to departments
      </Link>
    </div>
  );
}
