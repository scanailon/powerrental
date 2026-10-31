import { CONTACT, SITE_NAME, SITE_URL } from "@/lib/site";

const SERVICES = [
  "Arriendo de generadores / grupos electrógenos",
  "Tableros eléctricos",
  "Aterrizado de estructuras (puesta a tierra)",
  "Pasacables",
  "Guirnaldas de ampolletas",
];

const businessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${SITE_URL}/#business`,
  name: SITE_NAME,
  url: `${SITE_URL}/`,
  logo: `${SITE_URL}/assets/logo-full.png`,
  image: `${SITE_URL}/assets/showreel-poster.jpg`,
  description:
    "Arriendo de grupos electrógenos, tableros eléctricos, puesta a tierra, pasacables y guirnaldas para eventos, faenas industriales y producciones audiovisuales en todo Chile.",
  telephone: CONTACT.phones[0],
  email: CONTACT.email,
  foundingDate: "1996",
  areaServed: { "@type": "Country", name: "Chile" },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    opens: "00:00",
    closes: "23:59",
  },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Soluciones de energía en arriendo",
    itemListElement: SERVICES.map((name) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name,
        areaServed: { "@type": "Country", name: "Chile" },
      },
    })),
  },
};

/** Datos estructurados (schema.org) para Google. */
export default function JsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(businessSchema).replace(/</g, "\\u003c"),
      }}
    />
  );
}
