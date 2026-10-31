"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { useIsMobile } from "@/hooks/useIsMobile";

/** Trazos tipo "cableado" por donde corre la corriente animada. */
const TRACES = [
  {
    d: "M 230 -40 L 230 300 Q 230 344 274 344 L 470 344 Q 514 344 514 388 L 514 1040",
    dur: 8.5,
    delay: 0,
  },
  {
    d: "M 1190 -40 L 1190 470 Q 1190 514 1146 514 L 980 514 Q 936 514 936 558 L 936 1040",
    dur: 10.5,
    delay: 1.6,
  },
  { d: "M 712 -40 L 712 1040", dur: 7.2, delay: 0.8 },
  {
    d: "M 1330 -40 L 1330 230 Q 1330 274 1286 274 L 1130 274 Q 1086 274 1086 318 L 1086 1040",
    dur: 11.5,
    delay: 2.4,
  },
];

/** Fondo del hero: grilla, trazos con corriente y un foco que sigue al cursor. */
export default function HeroCanvas({ bold = false }: { bold?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const touch = window.matchMedia("(hover: none), (pointer: coarse)").matches;
    if (reduced || touch) return;

    let raf = 0;
    let x = 0;
    let y = 0;
    let pending = false;
    const flush = () => {
      pending = false;
      el.style.setProperty("--mx", `${x}px`);
      el.style.setProperty("--my", `${y}px`);
    };
    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
      if (!pending) {
        pending = true;
        raf = requestAnimationFrame(flush);
      }
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  const spotMask = `radial-gradient(${bold ? 260 : 220}px circle at var(--mx) var(--my), #000 0%, rgba(0,0,0,0.35) 55%, transparent 78%)`;
  const gridMask = `radial-gradient(${bold ? 300 : 240}px circle at var(--mx) var(--my), #000 0%, transparent 75%)`;

  return (
    <div
      ref={ref}
      className="absolute inset-0 z-0 overflow-hidden"
      style={{ "--mx": "50%", "--my": "30%" } as CSSProperties}
      aria-hidden="true"
    >
      <div
        className="absolute inset-0"
        style={{
          background: bold
            ? "linear-gradient(180deg, #08080A 0%, #050506 100%)"
            : "linear-gradient(180deg, #0C0C0F 0%, #060607 100%)",
        }}
      />
      <div className="pr-grid absolute inset-0" style={{ opacity: bold ? 0.9 : 0.7 }} />

      <div
        className="absolute inset-0"
        style={{
          maskImage: "linear-gradient(180deg, transparent 0%, #000 12%, #000 88%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(180deg, transparent 0%, #000 12%, #000 88%, transparent 100%)",
        }}
      >
        <svg className="w-full h-full" viewBox="0 0 1440 1000" preserveAspectRatio="xMidYMid slice">
          <defs>
            <filter id="pr-canvas-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {TRACES.map((t, i) => (
            <g key={i}>
              <path
                d={t.d}
                fill="none"
                stroke={`rgba(255,255,255,${bold ? 0.08 : 0.055})`}
                strokeWidth="1.5"
              />
              {!isMobile && (
                <path
                  className="pr-current"
                  d={t.d}
                  fill="none"
                  stroke="var(--pr-accent)"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeDasharray="86 1534"
                  filter="url(#pr-canvas-glow)"
                  style={{ animationDuration: `${t.dur}s`, animationDelay: `${t.delay}s` }}
                />
              )}
            </g>
          ))}
        </svg>
      </div>

      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at var(--mx) var(--my), color-mix(in oklab, var(--pr-accent) 22%, transparent) 0%, transparent 60%)",
          opacity: bold ? 0.95 : 0.85,
        }}
      />

      {!isMobile && (
        <>
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(to right, color-mix(in oklab, var(--pr-accent) 18%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in oklab, var(--pr-accent) 18%, transparent) 1px, transparent 1px)",
              backgroundSize: "54px 54px",
              maskImage: gridMask,
              WebkitMaskImage: gridMask,
            }}
          />
          <div className="absolute inset-0" style={{ maskImage: spotMask, WebkitMaskImage: spotMask }}>
            <svg className="w-full h-full" viewBox="0 0 1440 1000" preserveAspectRatio="xMidYMid slice">
              {TRACES.map((t, i) => (
                <path
                  key={i}
                  d={t.d}
                  fill="none"
                  strokeWidth="2"
                  strokeLinecap="round"
                  style={{
                    stroke: "color-mix(in oklab, var(--pr-accent) 80%, #ffffff)",
                    filter: "drop-shadow(0 0 4px color-mix(in oklab, var(--pr-accent) 70%, transparent))",
                  }}
                />
              ))}
            </svg>
          </div>
        </>
      )}

      <div
        className="absolute inset-0 z-[2]"
        style={{
          background: "radial-gradient(110% 70% at 50% 0%, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0) 60%)",
        }}
      />
      <div
        className="absolute inset-0 z-[2]"
        style={{
          background:
            "linear-gradient(90deg, rgba(0,0,0,0.40) 0%, rgba(0,0,0,0) 20%, rgba(0,0,0,0) 80%, rgba(0,0,0,0.40) 100%)",
        }}
      />
      <div
        className="absolute inset-0 z-[2]"
        style={{
          background: "radial-gradient(125% 100% at 50% 55%, transparent 52%, rgba(0,0,0,0.55) 100%)",
        }}
      />
      <div className="pr-noise absolute inset-0 z-[2] opacity-[0.05] mix-blend-overlay" />
    </div>
  );
}
