"use client";

import { notFound, useParams, useRouter } from "next/navigation";
import { MSections } from "@/components/mobile/MSections";
import { ResponsiveShell } from "@/components/ResponsiveShell";
import { Sections } from "@/components/web/Sections";
import { isDeptKey } from "@/lib/data";

export default function SectionsPage() {
  const router = useRouter();
  const params = useParams<{ dept: string }>();
  const dept = params.dept;
  if (!isDeptKey(dept)) notFound();

  const openSection = (s: string) =>
    router.push(`/directory/${dept}?section=${s}`);
  const toDepartments = () => router.push("/departments");
  const signOut = () => router.push("/");

  return (
    <ResponsiveShell
      web={
        <Sections
          deptKey={dept}
          onOpenSection={openSection}
          onBack={toDepartments}
          onSignOut={signOut}
        />
      }
      mobile={
        <MSections
          deptKey={dept}
          onOpenSection={openSection}
          onBack={toDepartments}
          onSignOut={signOut}
        />
      }
    />
  );
}
