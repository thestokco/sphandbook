"use client";

import { useRouter } from "next/navigation";
import { MLogin } from "@/components/mobile/MLogin";
import { ResponsiveShell } from "@/components/ResponsiveShell";
import { Login } from "@/components/web/Login";

export default function LoginPage() {
  const router = useRouter();
  // Demo: any input proceeds. Real auth is future scope.
  const toLanding = () => router.push("/");
  const login = () => router.push("/departments");
  return (
    <ResponsiveShell
      web={<Login onBack={toLanding} onSubmit={login} />}
      mobile={<MLogin onBack={toLanding} onSubmit={login} />}
    />
  );
}
