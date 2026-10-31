"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

const SPOT = 300; // radio del foco en px
const CULL = 300; // ignora elementos excluidos lejos del cursor

/**
 * Construye un clip-path que recorta (evenodd) los elementos marcados con
 * `data-spotlight-exclude` (fotos, video, tarjetas) para que el foco no los tiña.
 */
function buildClip(els: Element[], x: number, y: number, vw: number, vh: number) {
  const holes: string[] = [];
  for (const el of els) {
    const r = el.getBoundingClientRect();
    if (
      r.width === 0 ||
      r.height === 0 ||
      r.right < x - CULL ||
      r.left > x + CULL ||
      r.bottom < y - CULL ||
      r.top > y + CULL
    )
      continue;
    const rad = Math.min(
      parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0,
      r.width / 2,
      r.height / 2,
    );
    const { left: l, top: t, width: w, height: h } = r;
    holes.push(
      `M${l + rad} ${t}H${l + w - rad}A${rad} ${rad} 0 0 1 ${l + w} ${t + rad}V${t + h - rad}A${rad} ${rad} 0 0 1 ${l + w - rad} ${t + h}H${l + rad}A${rad} ${rad} 0 0 1 ${l} ${t + h - rad}V${t + rad}A${rad} ${rad} 0 0 1 ${l + rad} ${t}Z`,
    );
  }
  return holes.length === 0 ? "none" : `path(evenodd, "M0 0H${vw}V${vh}H0Z ${holes.join(" ")}")`;
}

/** Foco de luz que sigue al cursor en toda la página (solo desktop). */
export default function CursorSpotlight() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const touch = window.matchMedia("(hover: none), (pointer: coarse)").matches;
    if (reduced || touch) return;

    let excluded = Array.from(document.querySelectorAll("[data-spotlight-exclude]"));
    let raf = 0;
    let x = 0;
    let y = 0;
    let pending = false;
    let hasPointer = false;
    let firstReveal = true;
    let lastClip = "none";

    const flush = () => {
      pending = false;
      el.style.setProperty("--mx", `${x}px`);
      el.style.setProperty("--my", `${y}px`);
      const clip = buildClip(excluded, x, y, window.innerWidth, window.innerHeight);
      if (clip !== lastClip) {
        lastClip = clip;
        el.style.setProperty("--pr-spot-clip", clip);
      }
      if (firstReveal && hasPointer) {
        firstReveal = false;
        setVisible(true);
      }
    };
    const schedule = () => {
      if (!pending) {
        pending = true;
        raf = requestAnimationFrame(flush);
      }
    };
    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      hasPointer = true;
      schedule();
    };
    const onScroll = () => {
      if (hasPointer) schedule();
    };
    const onResize = () => {
      excluded = Array.from(document.querySelectorAll("[data-spotlight-exclude]"));
      if (hasPointer) schedule();
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
    };
  }, []);

  const mask = `radial-gradient(${SPOT}px circle at var(--mx) var(--my), #000 0%, rgba(0,0,0,0.45) 52%, transparent 74%)`;
  const clip = "var(--pr-spot-clip, none)";

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[60] transition-opacity duration-700"
      style={
        {
          "--mx": "50vw",
          "--my": "-260px",
          "--pr-spot-clip": "none",
          opacity: visible ? 1 : 0,
        } as CSSProperties
      }
    >
      {/* Brillo sobre fondos oscuros */}
      <div
        className="absolute inset-0 mix-blend-screen"
        style={{
          background: `radial-gradient(${SPOT}px circle at var(--mx) var(--my), color-mix(in oklab, var(--pr-accent) 30%, transparent) 0%, transparent 62%)`,
          clipPath: clip,
        }}
      />
      {/* Tinte sutil sobre fondos claros */}
      <div
        className="absolute inset-0 mix-blend-multiply"
        style={{
          background: `radial-gradient(${SPOT * 0.82}px circle at var(--mx) var(--my), color-mix(in oklab, var(--pr-accent) 4.5%, transparent) 0%, transparent 60%)`,
          clipPath: clip,
        }}
      />
      {/* Grilla revelada alrededor del cursor */}
      <div
        className="absolute inset-0 mix-blend-screen"
        style={{
          backgroundImage:
            "linear-gradient(to right, color-mix(in oklab, var(--pr-accent) 18%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in oklab, var(--pr-accent) 18%, transparent) 1px, transparent 1px)",
          backgroundSize: "54px 54px",
          maskImage: mask,
          WebkitMaskImage: mask,
          clipPath: clip,
        }}
      />
      <div
        className="absolute inset-0 mix-blend-multiply"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(10,10,11,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(10,10,11,0.04) 1px, transparent 1px)",
          backgroundSize: "54px 54px",
          maskImage: mask,
          WebkitMaskImage: mask,
          clipPath: clip,
        }}
      />
    </div>
  );
}
