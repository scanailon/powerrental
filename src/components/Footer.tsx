import Image from "next/image";
import { CONTACT } from "@/lib/site";
import { PR_ACCENT, boltTintMatrix } from "@/lib/theme";
import BoltMark from "./BoltMark";

const WHATSAPP_URL = "https://wa.me/56999180141";

const COLUMNS: {
  title: string;
  items: { label: string; href: string; external?: boolean }[];
}[] = [
  {
    title: "Servicios",
    items: [
      { label: "Generadores", href: "/#servicios" },
      { label: "Tableros eléctricos", href: "/#servicios" },
      { label: "Aterrizado de estructuras", href: "/#servicios" },
      { label: "Pasacables", href: "/#servicios" },
      { label: "Guirnaldas de ampolletas", href: "/#servicios" },
    ],
  },
  {
    title: "Empresa",
    items: [
      { label: "Sobre Power Rental", href: "/#nosotros" },
      { label: "Registros", href: "/#registros" },
      { label: "Galería", href: "/galeria" },
    ],
  },
  {
    title: "Recursos",
    items: [
      { label: "Cotizar arriendo", href: "/#contacto" },
      { label: "Urgencias 24/7", href: WHATSAPP_URL, external: true },
      { label: "Trabaja con nosotros", href: `mailto:${CONTACT.email}` },
    ],
  },
];

const SOCIALS = [
  { l: "Instagram", href: "https://www.instagram.com/powerrentalchile/", icon: "/assets/instagram.png" },
  { l: "WhatsApp", href: WHATSAPP_URL, icon: "/assets/whatsapp.png" },
  { l: "Correo", href: `mailto:${CONTACT.email}`, icon: "/assets/gmail.png" },
];

/** Logo en blanco con el rayo teñido del color de acento. */
function FooterLogo({ accent = PR_ACCENT }: { accent?: string }) {
  return (
    <span className="relative inline-block h-12 md:h-14">
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <defs>
          <filter id="pr-bolt-tint-footer" colorInterpolationFilters="sRGB">
            <feColorMatrix type="matrix" values={boltTintMatrix(accent)} />
          </filter>
        </defs>
      </svg>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/assets/logo-power-rental.png"
        alt="Power Rental"
        className="h-full w-auto select-none block"
        style={{ filter: "brightness(0) invert(1)" }}
        draggable={false}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/assets/logo-power-rental.png"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-auto select-none pointer-events-none"
        style={{ filter: "url(#pr-bolt-tint-footer)" }}
        draggable={false}
      />
    </span>
  );
}

export default function Footer({ accent = PR_ACCENT }: { accent?: string }) {
  return (
    <footer
      className="relative w-full pt-10 md:pt-12 pb-10 md:pb-12"
      style={{ background: "#0F0F12", color: "#fff" }}
    >
      <div className="pr-energized-line absolute top-0 left-0" aria-hidden="true" />
      <div className="max-w-[1536px] mx-auto px-5 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 pb-10 md:pb-20 border-b border-white/10">
          <div className="md:col-span-5 flex flex-col gap-5 md:gap-6">
            <div className="hidden md:block">
              <FooterLogo accent={accent} />
            </div>
            <p className="text-[14px] md:text-[15px] text-white/55 leading-relaxed max-w-md">
              Soluciones de energía y sonido para eventos, producciones y más. Operamos en Chile,
              desde 1996.
            </p>
            <div className="flex items-center gap-4 mt-1">
              {SOCIALS.map((s) => {
                const isMail = s.href.startsWith("mailto:");
                return (
                  <a
                    key={s.l}
                    href={s.href}
                    target={isMail ? undefined : "_blank"}
                    rel={isMail ? undefined : "noopener noreferrer"}
                    aria-label={s.l}
                    className="transition-transform duration-200 hover:scale-110 active:scale-95"
                  >
                    <Image src={s.icon} alt="" width={36} height={36} className="w-9 h-9 object-contain" />
                  </a>
                );
              })}
            </div>
          </div>

          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-10 sm:gap-8">
            {COLUMNS.map((col) => (
              <div key={col.title} className="flex flex-col gap-5">
                <h4 className="flex flex-col gap-3">
                  <span className="flex items-center gap-2.5">
                    <BoltMark className="w-[9px] h-[15px]" style={{ color: "var(--pr-accent)" }} />
                    <span className="font-mono text-[12.5px] md:text-[13px] font-bold uppercase tracking-[0.2em] text-white">
                      {col.title}
                    </span>
                  </span>
                  <span className="h-px w-9" style={{ background: "var(--pr-accent)" }} aria-hidden="true" />
                </h4>
                <ul className="flex flex-col gap-3">
                  {col.items.map((item) => (
                    <li key={item.label}>
                      <a
                        href={item.href}
                        target={item.external ? "_blank" : undefined}
                        rel={item.external ? "noopener noreferrer" : undefined}
                        className="text-[14px] md:text-[15px] text-white/80 hover:text-white transition-colors duration-200"
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <p className="text-[12.5px] text-white/40">
            © {new Date().getFullYear()} Power Rental · Soluciones de Energía · Hecho en Chile
          </p>
          <a
            href={`mailto:${CONTACT.email}`}
            className="text-[12.5px] text-white/40 hover:text-white/80 transition-colors duration-200"
          >
            {CONTACT.email}
          </a>
        </div>
      </div>
    </footer>
  );
}
