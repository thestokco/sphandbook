"use client";

import { useRouter } from "next/navigation";
import { MLanding } from "@/components/mobile/MLanding";
import { ResponsiveShell } from "@/components/ResponsiveShell";
import { Landing } from "@/components/web/Landing";

export default function LandingPage() {
  const router = useRouter();
  const enter = () => router.push("/login");
  return (
    <ResponsiveShell
      web={<Landing onEnter={enter} />}
      mobile={<MLanding onEnter={enter} />}
    />
  );
}
