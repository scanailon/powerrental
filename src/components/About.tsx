import Image from "next/image";
import type { ReactNode } from "react";
import BoltMark from "./BoltMark";
import SectionBackdrop from "./SectionBackdrop";
import SectionLabel from "./SectionLabel";

const VALUES: { title: string; body: string; icon: ReactNode }[] = [
  {
    title: "Infraestructura propia",
    body: "Equipos de última tecnología para eventos masivos. Sin intermediarios, sin sorpresas en terreno.",
    icon: (
      <>
        <rect x="3.5" y="5.5" width="17" height="13.5" rx="2" />
        <path d="M13.2 8.8l-2.6 3.4h3.1l-2.6 3.4" />
      </>
    ),
  },
  {
    title: "Montaje ágil",
    body: "Mantención rigurosa y procesos afinados que reducen el tiempo en terreno, sin sacrificar seguridad.",
    icon: (
      <>
        <path d="M10 2h4" />
        <path d="M12 14l3-3" />
        <circle cx="12" cy="14" r="8" />
      </>
    ),
  },
  {
    title: "Mejora continua",
    body: "Cada día un mejor servicio, a la altura de lo que clientes y proyectos demandan.",
    icon: (
      <>
        <path d="M22 7l-8.5 8.5-5-5L2 17" />
        <path d="M16 7h6v6" />
      </>
    ),
  },
];

function ValueRow({ title, body, icon }: { title: string; body: string; icon: ReactNode }) {
  return (
    <div className="group/val relative flex items-start gap-4 md:gap-5 px-5 md:px-6 py-5 md:py-[26px] transition-colors duration-300 hover:bg-white/[0.035]">
      <span
        className="relative z-10 w-11 h-11 shrink-0 rounded-xl border flex items-center justify-center transition-all duration-300 border-white/15 group-hover/val:border-[color-mix(in_oklab,var(--pr-accent)_70%,transparent)] group-hover/val:shadow-[0_0_18px_-2px_color-mix(in_oklab,var(--pr-accent)_75%,transparent)]"
        style={{ background: "#12141F" }}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-[19px] h-[19px] transition-colors duration-300 text-[color-mix(in_oklab,var(--pr-accent)_55%,white)] group-hover/val:text-white"
          aria-hidden="true"
        >
          {icon}
        </svg>
      </span>
      <div className="flex flex-col gap-1 pt-0.5">
        <h3 className="text-[15.5px] md:text-[16.5px] font-medium text-white tracking-[-0.01em]">
          {title}
        </h3>
        <p className="text-[13.5px] md:text-[14px] text-white/50 leading-relaxed">{body}</p>
      </div>
    </div>
  );
}

export default function About() {
  return (
    <section
      id="nosotros"
      className="relative w-full overflow-hidden py-20 md:py-32"
      style={{ background: "#FAFAFA" }}
    >
      <SectionBackdrop tone="light" aura="bl" auraStrength={7} />
      <div className="relative z-10 max-w-[1536px] mx-auto px-5 md:px-10">
        <div className="grid grid-cols-1">
          {/* Título: en desktop se superpone a la foto con esquinas invertidas */}
          <div className="relative col-start-1 row-start-1 z-10 mb-8 md:mb-10 lg:mb-0 lg:self-start lg:justify-self-start lg:max-w-[54%] lg:bg-[#FAFAFA] lg:rounded-br-[2.5rem] lg:pr-14 lg:pb-10">
            <span
              aria-hidden="true"
              className="hidden lg:block pointer-events-none absolute top-full left-0 w-10 h-10"
              style={{
                background:
                  "radial-gradient(circle farthest-side at bottom right, transparent 99%, #FAFAFA 100%)",
                transform: "translateY(-1px)",
              }}
            />
            <span
              aria-hidden="true"
              className="hidden lg:block pointer-events-none absolute top-0 left-full w-10 h-10"
              style={{
                background:
                  "radial-gradient(circle farthest-side at bottom right, transparent 99%, #FAFAFA 100%)",
                transform: "translateX(-1px)",
              }}
            />
            <div className="flex flex-col gap-4 max-w-3xl">
              <SectionLabel label="Sobre nosotros" />
              <h2 className="font-display text-[40px] md:text-[64px] lg:text-[56px] xl:text-[64px] font-light text-[#0A0A0B] tracking-[-0.025em] leading-[1.02]">
                Desde octubre de 1996,
                <br />
                <span className="text-black/45">amplificando Chile.</span>
              </h2>
            </div>
          </div>

          <div
            data-spotlight-exclude
            className="relative col-start-1 row-start-2 lg:row-start-1 w-full overflow-hidden rounded-[1.25rem] md:rounded-[2rem] aspect-[4/3] sm:aspect-[16/10] md:aspect-[16/9]"
            style={{ background: "#1A1A1B" }}
          >
            <Image
              src="/assets/sobre-nosotros.jpg"
              alt="Equipo Power Rental"
              fill
              sizes="(min-width: 1536px) 1456px, 100vw"
              className="object-cover"
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "linear-gradient(180deg, rgba(0,0,0,0) 45%, rgba(0,0,0,0.6) 100%)",
              }}
            />
            <div
              className="absolute top-5 right-5 md:top-7 md:right-7 flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-md border"
              style={{ background: "rgba(10,10,11,0.45)", borderColor: "rgba(255,255,255,0.18)" }}
            >
              <BoltMark className="w-[10px] h-[17px]" style={{ color: "var(--pr-accent)" }} />
              <span className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-white">
                Equipo propio · Todo Chile
              </span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-5 md:p-8 flex items-end justify-between gap-4">
              <div>
                <div className="font-mono text-[10.5px] md:text-[11px] font-medium uppercase tracking-[0.14em] text-white/60 mb-1">
                  Nuestro equipo · En terreno
                </div>
                <div className="text-[15px] md:text-[19px] font-normal text-white tracking-[-0.005em]">
                  Una sola coordinación, llave en mano.
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start mt-12 md:mt-16">
          <div className="flex flex-col gap-5 md:gap-6">
            <p className="text-[20px] md:text-[25px] text-[#0A0A0B] leading-[1.4] font-light tracking-[-0.015em]">
              Power Rental nace en <span className="font-normal">octubre de 1996</span>, prestando
              servicios de amplificación e iluminación para eventos pequeños.
            </p>
            <p className="text-[15px] md:text-[16.5px] text-black/65 leading-relaxed">
              Hoy somos una empresa chilena dedicada a brindar soluciones de energía segura,
              construidas sobre casi 30 años de experiencia en el rubro de eventos y espectáculos.
            </p>
            <p className="text-[15px] md:text-[16.5px] text-black/65 leading-relaxed">
              Sabemos que la energía eléctrica es imprescindible para el funcionamiento de un evento
              o negocio. Nuestro compromiso es generarla de manera sostenible, incorporando
              tecnologías innovadoras en el manejo de la energía y reduciendo los tiempos de montaje.
            </p>
            <div className="mt-1 md:mt-2 flex flex-col gap-5">
              <span className="pr-energized-line pr-energized-line--light" aria-hidden="true" />
              <p className="font-display text-[24px] md:text-[30px] font-light tracking-[-0.02em] leading-[1.15] text-[#0A0A0B]">
                Somos Power Rental,
                <br />
                <span className="text-black/45">damos soluciones de energía.</span>
              </p>
            </div>
            <div className="font-mono text-[10px] md:text-[10.5px] font-medium uppercase tracking-[0.14em] text-black/35">
              Respaldo corporativo — AB Audiovisual Ltda. · VVS Energía Ltda.
            </div>
          </div>

          <div
            data-spotlight-exclude
            className="relative overflow-hidden rounded-[1.5rem] border border-white/10 shadow-[0_30px_60px_-30px_rgba(12,14,32,0.55)]"
            style={{ background: "linear-gradient(180deg, #0E101C 0%, #0A0B12 100%)" }}
          >
            <span
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(420px circle at 100% 0%, color-mix(in oklab, var(--pr-accent) 14%, transparent), transparent 70%)",
              }}
            />
            <span aria-hidden="true" className="absolute inset-0 pr-grid pointer-events-none opacity-60" />

            <div className="relative flex items-center justify-between gap-4 px-5 md:px-6 py-4 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <BoltMark className="w-[9px] h-[15px]" style={{ color: "var(--pr-accent)" }} />
                <span className="font-mono text-[10.5px] md:text-[11px] font-medium uppercase tracking-[0.2em] text-white/60">
                  Lo que nos define
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="relative flex w-2 h-2">
                  <span
                    className="absolute inline-flex w-full h-full rounded-full animate-ping opacity-60"
                    style={{ background: "var(--pr-accent)", animationDuration: "2.4s" }}
                  />
                  <span
                    className="relative inline-flex w-2 h-2 rounded-full"
                    style={{ background: "var(--pr-accent)" }}
                  />
                </span>
                <span className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-white/40">
                  En operación
                </span>
              </div>
            </div>

            <div className="relative">
              <span
                aria-hidden="true"
                className="pr-energized-rail absolute left-[41px] md:left-[45px] top-7 bottom-7"
                style={{ position: "absolute" }}
              />
              <div className="relative divide-y divide-white/[0.06]">
                {VALUES.map((v) => (
                  <ValueRow key={v.title} {...v} />
                ))}
              </div>
            </div>

            <span
              aria-hidden="true"
              className="pr-energized-line inset-x-0 bottom-0"
              style={{ position: "absolute" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
