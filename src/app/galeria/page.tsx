import type { Metadata } from "next";
import { pageVars } from "@/lib/theme";
import { SITE_NAME } from "@/lib/site";
import { getVisibleProjects } from "@/lib/projects";
import Gallery from "@/components/Gallery";

export const dynamic = "force-dynamic";

const TITLE = "Power Rental — Galería de proyectos";
const DESCRIPTION =
  "Eventos, faenas y producciones donde Power Rental puso equipos, instalación y operación técnica en terreno.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/galeria" },
  openGraph: {
    type: "website",
    locale: "es_CL",
    url: "/galeria",
    siteName: SITE_NAME,
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default async function GaleriaPage() {
  const items = await getVisibleProjects();
  return (
    <div className="w-full min-h-screen" style={{ background: "#FAFAFA", ...pageVars }}>
      <Gallery items={items} />
    </div>
  );
}
