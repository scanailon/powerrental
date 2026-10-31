"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import BoltMark from "./BoltMark";
import SectionLabel from "./SectionLabel";

type Stat = {
  value?: number;
  display?: string;
  suffix?: string;
  unit: string;
  label: string;
  sub: string;
  live?: boolean;
};

const STATS: Stat[] = [
  { value: 30, suffix: "+", unit: "Trayectoria", label: "Años de experiencia", sub: "Desde octubre de 1996" },
  {
    display: "16–500",
    suffix: " KVA",
    unit: "Potencia",
    label: "Rango de generación",
    sub: "Sincronizables 150–500",
  },
  { value: 2000, suffix: "+", unit: "Alcance", label: "Eventos energizados", sub: "En todo Chile" },
  {
    value: 1000,
    suffix: "+",
    unit: "Operación",
    live: true,
    label: "Urgencias 24/7",
    sub: "Respuesta inmediata, todo el año",
  },
];

/** Cuenta de 0 a `target` con easing (ease-out cúbico) cuando `run` pasa a true. */
function useCountUp(target: number, run: boolean, duration = 1700) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!run) return;
    let raf = 0;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      raf = requestAnimationFrame(() => setValue(target));
      return () => cancelAnimationFrame(raf);
    }
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      setValue(Math.round(target * (1 - Math.pow(1 - t, 3))));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, run, duration]);
  return value;
}

function StatItem({ stat, index, run }: { stat: Stat; index: number; run: boolean }) {
  const count = useCountUp(stat.value ?? 0, run);
  const text = stat.display ?? `${count}`;
  const delay = `${150 + index * 130}ms`;
  const content: ReactNode = (
    <>
      {text}
      {stat.suffix && (
        <span className="font-mono font-medium tracking-normal" style={{ fontSize: "0.32em" }}>
          {stat.suffix}
        </span>
      )}
    </>
  );

  return (
    <div className="flex flex-col items-center text-center sm:items-start sm:text-left gap-3">
      <span className="flex items-center gap-2 font-mono text-[10.5px] md:text-[11px] font-medium uppercase tracking-[0.18em] text-black/45">
        {stat.live && (
          <span
            className="relative flex w-[9px] h-[15px]"
            style={{ color: "var(--pr-accent)" }}
            aria-hidden="true"
          >
            <BoltMark
              className="absolute inset-0 w-full h-full animate-ping opacity-60"
              style={{ animationDuration: "2.2s" }}
            />
            <BoltMark className="relative w-full h-full" />
          </span>
        )}
        {stat.unit}
      </span>

      {/* Número en contorno + relleno de acento que se "carga" de izquierda a derecha */}
      <div className="relative font-display font-medium leading-none tabular-nums tracking-[-0.03em] whitespace-nowrap max-w-full text-[min(15vw,64px)] sm:text-[clamp(38px,4.6vw,72px)]">
        <span
          className="block"
          style={{ color: "rgba(10,10,11,0.06)", WebkitTextStroke: "1.5px rgba(10,10,11,0.32)" }}
        >
          {content}
        </span>
        <span
          aria-hidden="true"
          className="absolute inset-0 block motion-reduce:transition-none"
          style={{
            color: "var(--pr-accent)",
            textShadow: "0 0 26px color-mix(in oklab, var(--pr-accent) 40%, transparent)",
            clipPath: run ? "inset(-10% -5% -10% 0)" : "inset(-10% 105% -10% 0)",
            transition: `clip-path 1300ms cubic-bezier(0.2,0.8,0.2,1) ${delay}`,
          }}
        >
          {content}
        </span>
      </div>

      <div className="flex flex-col gap-0.5">
        <div className="text-[14px] md:text-[15px] text-[#0A0A0B] font-normal tracking-[-0.01em]">
          {stat.label}
        </div>
        <div className="text-[12px] md:text-[12.5px] text-black/45">{stat.sub}</div>
      </div>
    </div>
  );
}

export default function StatsBand() {
  const ref = useRef<HTMLElement>(null);
  const [run, setRun] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRun(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="relative w-full overflow-hidden py-20 md:py-28"
      style={{ background: "#FAFAFA" }}
    >
      <div className="pr-grid-light absolute inset-0 pointer-events-none" aria-hidden="true" />
      <div
        className="absolute inset-x-0 top-0 h-px pointer-events-none"
        aria-hidden="true"
        style={{ background: "linear-gradient(90deg, transparent, rgba(44,46,255,0.5), transparent)" }}
      />
      <div className="relative max-w-[1536px] mx-auto px-5 md:px-10">
        <div className="mb-12 md:mb-16">
          <SectionLabel label="En números" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10 lg:gap-x-10">
          {STATS.map((s, i) => (
            <StatItem key={s.label} stat={s} index={i} run={run} />
          ))}
        </div>
      </div>
    </section>
  );
}
