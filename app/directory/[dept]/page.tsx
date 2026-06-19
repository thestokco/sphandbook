import { Suspense } from "react";
import { DirectoryScreen } from "@/components/screens/DirectoryScreen";

export default function DirectoryPage() {
  // Suspense boundary required for useSearchParams() inside DirectoryScreen.
  return (
    <Suspense fallback={null}>
      <DirectoryScreen />
    </Suspense>
  );
}
