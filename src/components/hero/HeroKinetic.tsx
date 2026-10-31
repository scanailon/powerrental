"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/lib/projects";
import { ArrowUpRight, ChevronRight } from "../icons";
import Bolt3D from "./Bolt3D";
import HeroCanvas from "./HeroCanvas";
import HeroNav from "./HeroNav";

const SERVICE_CHIPS = ["Generadores", "Tableros", "Aterrizado", "Pasacables", "Guirnaldas"];

/**
 * La sección #servicios es un scroll "pegajoso" con un panel por servicio:
 * baja hasta el tramo que corresponde al servicio elegido.
 */
function scrollToService(index: number) {
  const section = document.getElementById("servicios");
  if (!section) return;
  const rect = section.getBoundingClientRect();
  const scrollable = rect.height - window.innerHeight;
  const top = rect.top + window.scrollY;
  window.scrollTo({
    top:
      top + (scrollable * index) / SERVICE_CHIPS.length + scrollable / SERVICE_CHIPS.length / 2,
    behavior: "smooth",
  });
}

function HeroTitle({
  html,
  className = "",
  style,
}: {
  html: string;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <h1
      className={"font-display font-light text-white tracking-[-0.03em] leading-[1.02] " + className}
      style={{ fontWeight: 400, ...style }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

/** Botón "Cotizar arriendo" recortado en la esquina inferior derecha del hero. */
function CutoutCta() {
  return (
    <a
      href="#contacto"
      className="pr-anim-y absolute z-10 -bottom-px -right-px p-3 pt-5 pl-7 sm:p-4 sm:pt-6 sm:pl-9 md:p-6 md:pt-8 md:pl-12 rounded-tl-[1.5rem] sm:rounded-tl-[2rem] md:rounded-tl-[3rem] flex items-center gap-3 sm:gap-4 md:gap-5 no-underline group/cutout"
      style={{ animationDelay: "0.7s", background: "#FAFAFA" }}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-full right-0 w-6 h-6 sm:w-8 sm:h-8 md:w-12 md:h-12"
        style={{
          background: "radial-gradient(circle farthest-side at top left, transparent 99%, #FAFAFA 100%)",
          transform: "translateY(1px)",
        }}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 right-full w-6 h-6 sm:w-8 sm:h-8 md:w-12 md:h-12"
        style={{
          background: "radial-gradient(circle farthest-side at top left, transparent 99%, #FAFAFA 100%)",
          transform: "translateX(1px)",
        }}
      />
      <span
        className="relative w-10 h-10 md:w-14 md:h-14 rounded-full flex items-center justify-center border shrink-0 transition-transform duration-300 group-hover/cutout:scale-110 group-hover/cutout:-rotate-12"
        style={{
          background: "color-mix(in oklab, var(--pr-accent) 12%, transparent)",
          borderColor: "color-mix(in oklab, var(--pr-accent) 28%, transparent)",
          color: "var(--pr-accent)",
        }}
      >
        <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5" />
      </span>
      <span className="flex flex-col gap-0.5 pr-1 md:pr-2">
        <span className="text-[15px] md:text-[20px] font-normal text-[#0A0A0B] leading-tight">
          Cotizar arriendo
        </span>
        <span className="flex items-center gap-1 text-black/50 group-hover/cutout:text-black/80 transition-colors duration-200 text-[11.5px] md:text-[14px]">
          <span>Urgencias 24/7</span>
          <ChevronRight className="w-3 h-3 md:w-3.5 md:h-3.5" />
        </span>
      </span>
    </a>
  );
}

/** Miniatura del proyecto destacado que enlaza a la galería. */
function ProjectThumb({ project, count }: { project: Project | null; count: number }) {
  const img = project?.img || "/assets/poster-stage.jpg";
  const title = project?.title || "Eventos en terreno";
  return (
    <Link
      href="/galeria"
      className="group/thumb inline-flex items-center gap-3 rounded-2xl p-2 pr-4 border no-underline transition-transform duration-200 hover:scale-[1.015]"
      style={{ background: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.12)" }}
    >
      <span className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0">
        <Image src={img} alt={title} fill sizes="48px" className="object-cover" />
      </span>
      <span className="flex flex-col min-w-0">
        <span className="font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-white/45">
          Eventos
        </span>
        <span className="text-[13px] font-normal text-white/90 leading-snug truncate max-w-[180px]">
          {title}
        </span>
      </span>
      <span className="flex items-center gap-1 text-white/55 group-hover/thumb:text-white transition-colors duration-200">
        {count > 0 && <span className="text-[12px] font-normal">+{count}</span>}
        <ArrowUpRight className="w-3.5 h-3.5" />
      </span>
    </Link>
  );
}

export default function HeroKinetic({
  featuredProject = null,
  projectCount = 0,
}: {
  featuredProject?: Project | null;
  projectCount?: number;
}) {
  return (
    <div id="inicio" className="w-full px-0 pt-0 md:px-5 md:pt-5">
      <div className="relative w-full h-[100dvh] md:h-[calc(100vh-2.5rem)] md:min-h-[640px] rounded-none md:rounded-tl-[3rem] md:rounded-tr-[3rem] md:rounded-bl-[3rem] overflow-hidden group">
        <HeroCanvas bold />

        {/* Marca de agua del rayo en mobile */}
        <div className="md:hidden pointer-events-none absolute right-[-6%] top-1/2 -translate-y-1/2 z-[5] h-[78%] opacity-[0.18]">
          <Bolt3D className="h-full w-auto" glow={false} idPrefix="pr-bolt-wm" />
        </div>

        <div className="relative z-10 flex flex-col h-full">
          <HeroNav idSuffix="-ki" />

          <div className="flex-1 grid grid-cols-1 md:grid-cols-12 items-center gap-6 max-w-[1360px] w-full mx-auto px-6 md:px-12 pb-12 md:pb-16">
            <div className="md:col-span-6 flex flex-col items-start">
              <a
                href="https://wa.me/56999180141"
                target="_blank"
                rel="noopener noreferrer"
                className="pr-anim-y group/urg flex items-center gap-2.5 rounded-full border backdrop-blur-md px-4 py-[9px] mb-5 md:mb-6 no-underline transition-colors duration-200 hover:border-white/40"
                style={{
                  animationDelay: "0.1s",
                  background: "rgba(255,255,255,0.06)",
                  borderColor: "rgba(255,255,255,0.16)",
                }}
              >
                <span className="relative flex w-2 h-2" aria-hidden="true">
                  <span
                    className="absolute inline-flex w-full h-full rounded-full animate-ping opacity-60"
                    style={{ background: "var(--pr-accent)", animationDuration: "2.2s" }}
                  />
                  <span
                    className="relative inline-flex w-2 h-2 rounded-full"
                    style={{ background: "var(--pr-accent)" }}
                  />
                </span>
                <span className="text-[12.5px] md:text-[13.5px] font-medium tracking-wide text-white/85 group-hover/urg:text-white transition-colors duration-200">
                  Urgencias 24/7
                </span>
              </a>

              <HeroTitle
                html={
                  '<span class="pr-hero-current">Energía</span> que<br/>sostiene el <span class="pr-hero-current">momento</span>'
                }
                className="pr-anim-scale text-5xl sm:text-6xl md:text-7xl lg:text-[88px] leading-[0.98] max-w-[13ch]"
                style={{ animationDelay: "0.2s" }}
              />

              <div
                className="pr-anim-fade mt-8 md:mt-10 flex items-center gap-4 max-w-3xl"
                style={{ animationDelay: "0.5s" }}
              >
                <span className="hidden sm:block flex-1 pr-energized-line max-w-[90px]" />
                <ul className="flex flex-wrap items-center gap-2">
                  {SERVICE_CHIPS.map((label, i) => (
                    <li key={label}>
                      <button
                        type="button"
                        onClick={() => scrollToService(i)}
                        className="pr-nav-pill rounded-full border backdrop-blur-md px-3.5 py-1.5 text-[12.5px] md:text-[13.5px] font-medium tracking-[-0.01em] text-white/85 cursor-pointer transition-[background,border-color,color,transform] duration-200 hover:text-white hover:-translate-y-px active:translate-y-0"
                      >
                        {label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div
                className="pr-anim-y mt-9 md:mt-11 flex flex-wrap items-center gap-3 md:gap-4"
                style={{ animationDelay: "0.65s" }}
              >
                <a
                  href="#servicios"
                  className="group/cta flex items-center gap-3 rounded-full pl-5 pr-2 py-2 no-underline transition-all duration-200 hover:scale-[1.03] active:scale-[0.98] hover:shadow-[0_0_30px_rgba(44,46,255,0.5)]"
                  style={{ background: "var(--pr-accent)", color: "#fff" }}
                >
                  <span className="text-[13px] md:text-[14px] font-medium tracking-wide">
                    Ver servicios
                  </span>
                  <span className="bg-white/20 p-1.5 rounded-full flex items-center justify-center transition-transform duration-200 group-hover/cta:translate-y-0.5">
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
                      <path d="M12 5v14" />
                      <path d="M19 12l-7 7-7-7" />
                    </svg>
                  </span>
                </a>
              </div>

              <div className="pr-anim-fade mt-7" style={{ animationDelay: "0.8s" }}>
                <ProjectThumb project={featuredProject} count={projectCount} />
              </div>
            </div>

            <div className="hidden md:flex md:col-span-6 items-center justify-center">
              <div
                className="pr-anim-scale relative h-[56vh] max-h-[600px] w-full"
                style={{ animationDelay: "0.35s" }}
              >
                <Bolt3D className="w-full h-full" letters idPrefix="pr-bolt-main" />
              </div>
            </div>
          </div>
        </div>

        <CutoutCta />
      </div>
    </div>
  );
}
