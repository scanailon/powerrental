"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import Image from "next/image";
import { useIsMobile } from "@/hooks/useIsMobile";
import BoltMark from "./BoltMark";

/* ── Medidor de potencias (solo en "Generadores") ── */

const KVA = [16, 20, 40, 50, 60, 70, 110, 150, 180, 200, 225, 250, 275, 450, 500];
const UPS_KVA = [40, 60, 110];

function KvaChip({ v, variant = "base" }: { v: number; variant?: "base" | "sync" | "ups" }) {
  const colors =
    variant === "ups"
      ? {
          color: "#fff",
          background: "color-mix(in oklab, var(--pr-accent) 26%, transparent)",
          borderColor: "color-mix(in oklab, var(--pr-accent) 55%, transparent)",
        }
      : variant === "sync"
        ? {
            color: "rgba(255,255,255,0.88)",
            background: "color-mix(in oklab, var(--pr-accent) 8%, transparent)",
            borderColor: "color-mix(in oklab, var(--pr-accent) 42%, transparent)",
          }
        : {
            color: "rgba(255,255,255,0.75)",
            background: "rgba(255,255,255,0.05)",
            borderColor: "rgba(255,255,255,0.14)",
          };
  return (
    <span
      className="font-mono font-medium tabular-nums rounded-md border leading-none"
      style={{
        fontSize: "clamp(10.5px, 1.5vh, 12px)",
        padding: "clamp(3px, 0.6vh, 5px) 7px",
        ...colors,
      }}
    >
      {v}
    </span>
  );
}

function PowerGauge() {
  return (
    <div className="w-full max-w-xl flex flex-col" style={{ gap: "clamp(8px, 1.6vh, 16px)" }}>
      <div>
        <div
          className="flex items-center justify-between"
          style={{ marginBottom: "clamp(6px, 1.1vh, 10px)" }}
        >
          <span className="font-mono text-[10.5px] md:text-[11px] font-medium uppercase tracking-[0.18em] text-white/45">
            Potencias disponibles
          </span>
          <span
            className="font-mono text-[11px] md:text-[12px] font-medium tabular-nums tracking-wide"
            style={{ color: "var(--pr-accent)" }}
          >
            16–500 KVA
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {KVA.map((v) => (
            <KvaChip key={v} v={v} variant={v >= 150 ? "sync" : "base"} />
          ))}
        </div>
      </div>

      <div
        className="flex items-center rounded-xl border"
        style={{
          gap: "clamp(8px, 1.2vw, 14px)",
          padding: "clamp(7px, 1.3vh, 12px) clamp(10px, 1.6vw, 16px)",
          background: "color-mix(in oklab, var(--pr-accent) 10%, transparent)",
          borderColor: "color-mix(in oklab, var(--pr-accent) 40%, transparent)",
          boxShadow: "inset 0 0 30px -12px color-mix(in oklab, var(--pr-accent) 50%, transparent)",
        }}
      >
        <BoltMark className="w-[9px] h-[15px]" style={{ color: "var(--pr-accent)" }} />
        <span className="font-mono text-[10.5px] md:text-[11px] font-bold uppercase tracking-[0.18em] text-white/90 whitespace-nowrap">
          Sincronizables
        </span>
        <span className="pr-energized-line flex-1" style={{ minWidth: 24 }} />
        <span
          className="font-mono text-[12px] md:text-[13px] font-bold tabular-nums tracking-wide whitespace-nowrap"
          style={{ color: "var(--pr-accent)" }}
        >
          150–500 KVA
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
        <span className="font-mono text-[10.5px] md:text-[11px] font-medium uppercase tracking-[0.18em] text-white/45">
          UPS transición ATS o manual
        </span>
        <span className="flex flex-wrap gap-1.5">
          {UPS_KVA.map((v) => (
            <KvaChip key={v} v={v} variant="ups" />
          ))}
        </span>
      </div>
    </div>
  );
}

/* ── Servicios ── */

type Step = {
  n: string;
  eyebrow: string;
  title: string;
  body: string;
  imgs: string[];
  gauge?: boolean;
};

const STEPS: Step[] = [
  {
    n: "01",
    eyebrow: "Energía",
    title: "Generadores",
    body: "Grupos electrógenos. Energía confiable para eventos, obras y respaldo.",
    imgs: ["/assets/svc-generadores.jpg"],
    gauge: true,
  },
  {
    n: "02",
    eyebrow: "Distribución",
    title: "Tableros eléctricos",
    body: "Tableros eléctricos. Distribución segura desde el generador hasta cada punto de consumo.",
    imgs: ["/assets/svc-tableros.jpg"],
  },
  {
    n: "03",
    eyebrow: "Seguridad",
    title: "Aterrizado de estructuras",
    body: "Puesta a tierra para escenarios, torres y estructuras metálicas. Cumplimiento normativo y protección de personas y equipos ante fallas eléctricas.",
    imgs: ["/assets/svc-aterrizado.jpg", "/assets/svc-aterrizado-2.jpg"],
  },
  {
    n: "04",
    eyebrow: "Protección",
    title: "Pasacables",
    body: "Ordenamiento y protección del cableado con pasacables de alto tránsito. Rutas seguras para el público y los equipos en todo el recinto.",
    imgs: ["/assets/svc-pasacables.jpg"],
  },
  {
    n: "05",
    eyebrow: "Ambiente",
    title: "Guirnaldas de ampolletas",
    body: "Iluminación decorativa que da calidez y carácter al espacio. El cierre que transforma un evento en una experiencia memorable.",
    imgs: ["/assets/svc-guirnaldas.jpg"],
  },
];

const DOT_IDLE = "rgba(255,255,255,0.11)";
const RULE = "rgba(255,255,255,0.07)";

/** Paso activo y progreso (0–1) según cuánto se ha scrolleado dentro de la sección. */
function useScrollSteps(ref: RefObject<HTMLElement | null>, count: number) {
  const [state, setState] = useState({ active: 0, progress: 0 });
  useEffect(() => {
    let raf = 0;
    const measure = () => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      if (scrollable <= 0) return;
      const progress = Math.min(Math.max(-rect.top / scrollable, 0), 1);
      const active = Math.min(count - 1, Math.floor(progress * count));
      setState((prev) =>
        prev.active === active && Math.abs(prev.progress - progress) < 0.002
          ? prev
          : { active, progress },
      );
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
    };
  }, [ref, count]);
  return state;
}

/** Foto(s) del servicio; si hay varias, se pueden pasar con flechas o deslizando. */
function StepMedia({
  step,
  visible,
  photoIdx,
  onPick,
}: {
  step: Step;
  visible: boolean;
  photoIdx: number;
  onPick: (i: number) => void;
}) {
  const startX = useRef<number | null>(null);
  const multi = step.imgs.length > 1;
  const total = step.imgs.length;
  const go = (delta: number) => onPick((photoIdx + delta + total) % total);

  return (
    <div
      className="absolute inset-0 transition-opacity duration-[650ms] ease-out select-none"
      style={{
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
        touchAction: "pan-y",
        cursor: multi ? "grab" : undefined,
      }}
      aria-hidden={!visible}
      onPointerDown={
        multi
          ? (e) => {
              startX.current = e.clientX;
            }
          : undefined
      }
      onPointerUp={
        multi
          ? (e) => {
              if (startX.current == null) return;
              const dx = e.clientX - startX.current;
              if (dx > 44) go(-1);
              else if (dx < -44) go(1);
              startX.current = null;
            }
          : undefined
      }
    >
      <div
        className="absolute inset-0 flex transition-transform duration-[550ms]"
        style={{
          transform: `translateX(-${photoIdx * 100}%)`,
          transitionTimingFunction: "cubic-bezier(0.2,0.8,0.2,1)",
        }}
      >
        {step.imgs.map((src) => (
          <div key={src} className="relative w-full h-full shrink-0">
            <Image
              src={src}
              alt=""
              fill
              draggable={false}
              sizes="(min-width: 768px) 52vw, 100vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>

      {multi && (
        <>
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Foto anterior"
            className="absolute left-3.5 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md border transition-all duration-200 hover:scale-110 active:scale-95"
            style={{
              background: "rgba(10,10,11,0.7)",
              borderColor: "rgba(255,255,255,0.4)",
              color: "#fff",
              boxShadow: "0 2px 14px rgba(0,0,0,0.5)",
            }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Foto siguiente"
            className="absolute right-3.5 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md border transition-all duration-200 hover:scale-110 active:scale-95"
            style={{
              background: "rgba(10,10,11,0.7)",
              borderColor: "rgba(255,255,255,0.4)",
              color: "#fff",
              boxShadow: "0 2px 14px rgba(0,0,0,0.5)",
            }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5"
            >
              <path d="M9 6l6 6-6 6" />
            </svg>
          </button>
          <div className="absolute left-5 bottom-[18px] z-10 flex items-center gap-2">
            {step.imgs.map((src, i) => (
              <button
                key={src}
                type="button"
                onClick={() => onPick(i)}
                aria-label={`Foto ${i + 1} de ${step.title}`}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === photoIdx ? 22 : 8,
                  height: 8,
                  background: i === photoIdx ? "var(--pr-accent)" : "rgba(255,255,255,0.5)",
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function Services() {
  const isMobile = useIsMobile();
  const sectionRef = useRef<HTMLElement>(null);
  const { active, progress } = useScrollSteps(sectionRef, STEPS.length);
  const [photoIdx, setPhotoIdx] = useState(0);
  const step = STEPS[active];

  // Al cambiar de servicio se vuelve a la primera foto.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setPhotoIdx(0), [active]);

  const scrollToStep = (index: number) => {
    const el = sectionRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const scrollable = rect.height - window.innerHeight;
    const top = rect.top + window.scrollY;
    window.scrollTo({
      top: top + (scrollable * index) / STEPS.length + scrollable / STEPS.length / 2,
      behavior: "smooth",
    });
  };

  const pad = "clamp(14px, 3.2vh, 36px)";
  const total = String(STEPS.length).padStart(2, "0");

  return (
    <section
      ref={sectionRef}
      id="servicios"
      className="relative w-full"
      style={{ background: "#0A0A0B", height: `${STEPS.length * 65}vh` }}
    >
      <div
        className="sticky top-0 h-screen w-full flex flex-col overflow-hidden"
        style={{
          background:
            "radial-gradient(1200px 800px at 75% 20%, color-mix(in oklab, var(--pr-accent) 9%, transparent), transparent 60%), #0A0A0B",
        }}
      >
        {/* Encabezado */}
        <div className="flex-none flex items-center justify-between px-5 md:px-14" style={{ paddingTop: pad }}>
          <div className="flex items-center gap-3">
            <span
              className="w-[26px] h-[26px] rounded-[7px] flex items-center justify-center"
              style={{ background: "var(--pr-accent)" }}
            >
              <BoltMark className="w-[9px] h-[15px]" style={{ color: "#fff" }} />
            </span>
            <span className="font-mono text-[12px] font-medium uppercase tracking-[0.28em] text-white/90">
              Qué hacemos
            </span>
          </div>
          <div className="font-mono text-[11px] md:text-[12px] font-medium tracking-[0.12em] tabular-nums text-white/40">
            <b className="font-bold" style={{ color: "var(--pr-accent)" }}>
              {step.n}
            </b>
            <span> / {total}</span>
            <span className="hidden lg:inline"> — Energía de principio a fin</span>
          </div>
        </div>

        {/* Contenido */}
        <div
          className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-[1.02fr_1fr] items-stretch px-5 md:pl-0 md:pr-24"
          style={{ paddingTop: pad, paddingBottom: pad, gap: "clamp(20px, 3.8vw, 72px)" }}
        >
          <div
            data-spotlight-exclude
            className="relative min-h-0 h-[34vh] md:h-auto overflow-hidden rounded-[18px] md:rounded-l-none md:rounded-r-[28px]"
            style={{ background: "#141416" }}
          >
            {STEPS.map((s, i) => (
              <StepMedia
                key={s.n}
                step={s}
                visible={i === active}
                photoIdx={i === active ? photoIdx : 0}
                onPick={setPhotoIdx}
              />
            ))}
            <div
              className="absolute inset-x-0 bottom-0 h-[120px] pointer-events-none"
              style={{ background: "linear-gradient(to top, rgba(10,10,11,0.75), transparent)" }}
            />
            <span
              className={
                "absolute right-5 bottom-[18px] pointer-events-none font-mono text-[11px] font-medium uppercase tracking-[0.2em] rounded-full border px-3 py-[7px] text-white/70 " +
                (isMobile ? "" : "backdrop-blur-md")
              }
              style={{ background: "rgba(10,10,11,0.55)", borderColor: "rgba(255,255,255,0.1)" }}
            >
              {step.eyebrow}
            </span>
          </div>

          <div
            className="relative min-w-0 min-h-0 overflow-hidden flex flex-col justify-center"
            style={{ gap: "clamp(14px, 3.2vh, 36px)" }}
          >
            <span
              aria-hidden="true"
              className="hidden md:block absolute right-[-24px] top-1/2 font-display font-bold select-none pointer-events-none text-white/[0.028]"
              style={{ transform: "translateY(-54%)", fontSize: "clamp(300px, 52vh, 560px)", lineHeight: 1 }}
            >
              {active + 1}
            </span>

            <div className="relative flex flex-col" style={{ gap: "clamp(10px, 1.8vh, 20px)" }}>
              <div className="flex items-center gap-3.5 font-mono text-[11px] md:text-[12px] font-medium uppercase tracking-[0.24em]">
                <span className="text-white/40 tabular-nums">{step.n}</span>
                <span className="w-9 h-px" style={{ background: "rgba(255,255,255,0.16)" }} />
                <span className="font-bold" style={{ color: "var(--pr-accent)" }}>
                  {step.eyebrow}
                </span>
              </div>
              <h2
                className="font-display font-light text-white tracking-[-0.03em] max-w-[12ch]"
                style={{ margin: 0, fontSize: "clamp(30px, min(4.6vw, 8.5vh), 76px)", lineHeight: 1.02 }}
              >
                {step.title}
              </h2>
              <p
                className="text-white/60 max-w-[44ch]"
                style={{ margin: 0, fontSize: "clamp(13px, 2.1vh, 18px)", lineHeight: 1.6, textWrap: "pretty" }}
              >
                {step.body}
              </p>
              {step.gauge && <PowerGauge />}
            </div>

            {/* Índice de servicios (desktop) */}
            <div className="relative hidden md:flex flex-col" style={{ borderTop: `1px solid ${RULE}` }}>
              {STEPS.map((s, i) => {
                const isActive = i === active;
                return (
                  <button
                    key={s.n}
                    type="button"
                    onClick={() => scrollToStep(i)}
                    aria-current={isActive ? "step" : undefined}
                    className="w-full flex items-center gap-[18px] text-left cursor-pointer transition-opacity duration-[400ms] hover:opacity-100"
                    style={{
                      padding: "clamp(6px, 1.5vh, 15px) 4px",
                      borderBottom: `1px solid ${RULE}`,
                      opacity: isActive ? 1 : 0.42,
                    }}
                  >
                    <span
                      className="font-mono text-[12px] font-medium tabular-nums w-[26px] flex-none"
                      style={{ color: isActive ? "var(--pr-accent)" : "rgba(255,255,255,0.42)" }}
                    >
                      {s.n}
                    </span>
                    <span
                      className="flex-1 font-medium tracking-[0.01em]"
                      style={{
                        fontSize: "clamp(13px, 1.8vh, 15px)",
                        color: isActive ? "#fff" : "rgba(255,255,255,0.68)",
                      }}
                    >
                      {s.title}
                    </span>
                    <span
                      className="w-2 h-2 rounded-full flex-none transition-all duration-[400ms]"
                      style={{
                        background: isActive ? "var(--pr-accent)" : DOT_IDLE,
                        boxShadow: isActive
                          ? "0 0 10px 0 color-mix(in oklab, var(--pr-accent) 80%, transparent)"
                          : "none",
                      }}
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Barra de progreso */}
        <div
          className="flex-none flex items-center gap-5 px-5 md:pl-14 md:pr-24"
          style={{ paddingBottom: "clamp(14px, 3.1vh, 34px)" }}
        >
          <span className="flex-none font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-white/35">
            Scroll
          </span>
          <div className="flex-1 h-[2px] rounded-sm overflow-hidden" style={{ background: DOT_IDLE }}>
            <div
              className="h-full rounded-sm"
              style={{
                width: `${(progress * 100).toFixed(1)}%`,
                background:
                  "linear-gradient(90deg, var(--pr-accent), color-mix(in oklab, var(--pr-accent) 55%, #fff))",
              }}
            />
          </div>
          <span className="flex-none font-mono text-[11px] font-medium tabular-nums tracking-[0.12em] text-white/35">
            {step.n} / {total}
          </span>
        </div>
      </div>
    </section>
  );
}
