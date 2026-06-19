"use client";

import { useRouter } from "next/navigation";
import { MDashboard } from "@/components/mobile/MDashboard";
import { ResponsiveShell } from "@/components/ResponsiveShell";
import { Dashboard } from "@/components/web/Dashboard";

export default function DepartmentsPage() {
  const router = useRouter();
  const openCompany = (k: string) => router.push(`/company/${k}`);
  const signOut = () => router.push("/");
  return (
    <ResponsiveShell
      web={<Dashboard onOpen={openCompany} onSignOut={signOut} />}
      mobile={<MDashboard onOpen={openCompany} onSignOut={signOut} />}
    />
  );
}
