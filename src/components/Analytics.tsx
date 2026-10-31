"use client";

import { usePathname } from "next/navigation";
import { GoogleAnalytics } from "@next/third-parties/google";

export default function Analytics() {
  const pathname = usePathname();
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  // No medimos el panel de administración.
  if (!gaId || pathname.startsWith("/admin")) return null;
  return <GoogleAnalytics gaId={gaId} />;
}
