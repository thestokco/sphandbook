"use client";

import { notFound, useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { MCompanyOrg } from "@/components/mobile/MCompanyOrg";
import { MPhotobook } from "@/components/mobile/MPhotobook";
import { ResponsiveShell } from "@/components/ResponsiveShell";
import { CompanyOrg } from "@/components/web/CompanyOrg";
import { Photobook } from "@/components/web/Photobook";
import { isCompanyKey } from "@/lib/data";
import type { DeptKey, Employee } from "@/lib/types";

export function CompanyScreen() {
  const router = useRouter();
  const params = useParams<{ key: string }>();
  const key = params.key;
  if (!isCompanyKey(key)) notFound();

  // The CEO opens in a single-page photobook overlay.
  const [ceo, setCeo] = useState<Employee | null>(null);

  const openSection = (dept: DeptKey, section: string) =>
    router.push(`/directory/${dept}?section=${section}`);
  const toGroup = () => router.push("/departments");
  const signOut = () => router.push("/");
  const noop = () => {};

  return (
    <ResponsiveShell
      web={
        <>
          <CompanyOrg
            companyKey={key}
            onOpenSection={openSection}
            onOpenCeo={setCeo}
            onBack={toGroup}
            onSignOut={signOut}
          />
          {ceo && (
            <Photobook
              list={[ceo]}
              index={0}
              onNext={noop}
              onPrev={noop}
              onClose={() => setCeo(null)}
            />
          )}
        </>
      }
      mobile={
        <>
          <MCompanyOrg
            companyKey={key}
            onOpenSection={openSection}
            onOpenCeo={setCeo}
            onBack={toGroup}
            onSignOut={signOut}
          />
          {ceo && (
            <MPhotobook
              list={[ceo]}
              index={0}
              onNext={noop}
              onPrev={noop}
              onClose={() => setCeo(null)}
            />
          )}
        </>
      }
    />
  );
}
