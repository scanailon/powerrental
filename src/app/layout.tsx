import type { Metadata } from "next";
import { Archivo, Inter, JetBrains_Mono } from "next/font/google";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import Analytics from "@/components/Analytics";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jbmono",
  display: "swap",
});

const TITLE = "Power Rental — Soluciones de energía";
const DESCRIPTION =
  "Arriendo de grupos electrógenos y sistemas Line Array para eventos, faenas y producciones. Equipos, instalación y operación técnica en terreno, en todo Chile, 24/7.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  verification: { google: "eZOU-018MjL8ZmubJ-cTn1a2mL6mGL-1T35hl7FhhS0" },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_CL",
    url: "/",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${archivo.variable} ${jetbrainsMono.variable}`}
    >
      <body>{children}</body>
      <Analytics />
    </html>
  );
}
