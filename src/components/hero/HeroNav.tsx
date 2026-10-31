import Link from "next/link";
import { PR_ACCENT, boltTintMatrix } from "@/lib/theme";

const LINKS = [
  { label: "Servicios", href: "#servicios" },
  { label: "Registros", href: "#registros" },
  { label: "Nosotros", href: "#nosotros" },
  { label: "Contacto", href: "#contacto" },
];

export default function HeroNav({
  accent = PR_ACCENT,
  idSuffix = "",
}: {
  accent?: string;
  idSuffix?: string;
}) {
  const filterId = `pr-bolt-tint-nav${idSuffix}`;
  return (
    <nav className="relative z-20 py-6 px-6 md:py-8 md:px-14 flex items-center justify-between">
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <defs>
          <filter id={filterId} colorInterpolationFilters="sRGB">
            <feColorMatrix type="matrix" values={boltTintMatrix(accent)} />
          </filter>
        </defs>
      </svg>
      <Link href="/" className="flex items-center group/logo">
        <span className="relative inline-block h-14 md:h-20">
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
            style={{ filter: `url(#${filterId})` }}
            draggable={false}
          />
        </span>
      </Link>
      <ul className="hidden md:flex items-center gap-2 text-[13px]">
        {LINKS.map((l) => (
          <li key={l.label}>
            <a
              href={l.href}
              className="pr-nav-pill flex items-center gap-1 rounded-full px-4 py-2 font-medium tracking-[-0.01em] text-white/80 no-underline border backdrop-blur-md transition-[background,border-color,color,transform] duration-200 hover:text-white hover:-translate-y-px"
            >
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
