"use client";

import { useEffect, useState } from "react";
import BoltMark from "./BoltMark";

const LINKS = [
  { label: "Servicios", href: "#servicios" },
  { label: "Registros", href: "#registros" },
  { label: "Nosotros", href: "#nosotros" },
  { label: "Contacto", href: "#contacto" },
];

/** Navegación flotante + botón de urgencias que aparecen al salir del hero. */
export default function FloatingChrome() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("inicio");
    if (!hero) return;
    const io = new IntersectionObserver(([entry]) => setShow(!entry.isIntersecting), {
      threshold: 0,
    });
    io.observe(hero);
    return () => io.disconnect();
  }, []);

  const visible = "opacity-100 translate-y-0";

  return (
    <>
      <nav
        aria-label="Navegación de secciones"
        className={
          "fixed top-3 md:top-4 left-1/2 -translate-x-1/2 z-[70] transition-all duration-500 " +
          (show ? visible : "opacity-0 -translate-y-3 pointer-events-none")
        }
      >
        <div
          className="flex items-center gap-0.5 md:gap-1 rounded-full border px-1.5 py-1.5 backdrop-blur-xl"
          style={{ background: "rgba(10,10,11,0.55)", borderColor: "rgba(255,255,255,0.14)" }}
        >
          <a
            href="#inicio"
            aria-label="Volver arriba"
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors duration-200"
          >
            <BoltMark className="w-[10px] h-[17px]" style={{ color: "var(--pr-accent)" }} />
          </a>
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-full px-2.5 md:px-3.5 py-1.5 text-[12px] md:text-[12.5px] font-medium text-white/80 hover:text-white hover:bg-white/10 transition-colors duration-200 no-underline whitespace-nowrap"
            >
              {l.label}
            </a>
          ))}
        </div>
      </nav>

      <a
        href="https://wa.me/56999180141"
        target="_blank"
        rel="noopener noreferrer"
        className={
          "fixed bottom-4 right-4 md:bottom-6 md:right-6 z-[70] group/quote flex items-center gap-3 rounded-full pl-5 pr-2 py-2 no-underline shadow-[0_10px_30px_-8px_rgba(44,46,255,0.55)] transition-all duration-500 hover:scale-[1.04] active:scale-[0.98] " +
          (show ? visible : "opacity-0 translate-y-3 pointer-events-none")
        }
        style={{ background: "var(--pr-accent)", color: "#fff" }}
      >
        <span className="text-[13px] md:text-[14px] font-medium tracking-wide">Urgencias 24/7</span>
        <span className="bg-white/20 p-1.5 rounded-full flex items-center justify-center">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-3.5 h-3.5"
            aria-hidden="true"
          >
            <path d="M7 17L17 7" />
            <path d="M7 7h10v10" />
          </svg>
        </span>
      </a>
    </>
  );
}
