"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/lib/projects";
import Footer from "./Footer";
import SectionLabel from "./SectionLabel";

/** Proporciones que se van alternando cuando el proyecto no define una. */
const ASPECT_CYCLE = [
  "aspect-[4/3]",
  "aspect-[4/5]",
  "aspect-[4/3]",
  "aspect-[1/1]",
  "aspect-[3/4]",
  "aspect-[4/3]",
  "aspect-[5/4]",
];

const ALL = "Todos";

type GalleryItem = Project & { _aspect: string };

function Chevron({ dir = "right", className = "w-4 h-4" }: { dir?: "left" | "right"; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {dir === "left" ? <path d="M15 6l-6 6 6 6" /> : <path d="M9 6l6 6-6 6" />}
    </svg>
  );
}

function Tile({ item, onOpen }: { item: GalleryItem; onOpen: () => void }) {
  const hasImg = !!item.img;
  const [failed, setFailed] = useState(false);
  const showImg = hasImg && !failed;

  return (
    <button
      type="button"
      onClick={onOpen}
      className={
        "group/tile relative overflow-hidden rounded-[1.25rem] md:rounded-[1.5rem] text-left cursor-pointer block w-full " +
        item._aspect
      }
      style={
        showImg
          ? { background: "#1A1A1B" }
          : { background: "#ffffff", border: "1px dashed rgba(10,10,11,0.18)" }
      }
    >
      {showImg ? (
        <Image
          src={item.img!}
          alt={item.title}
          fill
          sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          onError={() => setFailed(true)}
          className="object-cover transition-transform duration-[1200ms] ease-out group-hover/tile:scale-[1.04]"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-7 h-7 md:w-9 md:h-9"
              aria-hidden="true"
              style={{ color: "var(--pr-accent)", opacity: 0.85 }}
            >
              <path d="M13 2L4.5 13.5h6L9 22l9.5-12h-6L14 2z" />
            </svg>
            <span className="text-[10.5px] md:text-[11px] font-medium uppercase tracking-[0.2em] text-black/40">
              {failed ? "Imagen no disponible" : "Imagen pendiente"}
            </span>
          </div>
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.04]"
            style={{ backgroundImage: "repeating-linear-gradient(45deg, #000 0 1px, transparent 1px 14px)" }}
          />
        </div>
      )}

      {showImg && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.15) 50%, rgba(0,0,0,0.85) 100%)",
          }}
        />
      )}

      <span
        className="absolute top-4 right-4 md:top-5 md:right-5 w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center border backdrop-blur-md opacity-0 group-hover/tile:opacity-100 transition-all duration-300 group-hover/tile:scale-110"
        style={
          showImg
            ? { background: "rgba(255,255,255,0.10)", borderColor: "rgba(255,255,255,0.22)", color: "#fff" }
            : { background: "rgba(10,10,11,0.05)", borderColor: "rgba(10,10,11,0.18)", color: "#0A0A0B" }
        }
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.3-4.3" />
          <path d="M11 8v6M8 11h6" />
        </svg>
      </span>

      <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6 flex flex-col gap-1.5">
        <div className="flex items-center gap-3">
          <span
            className="text-[10.5px] md:text-[11px] font-medium uppercase tracking-[0.2em]"
            style={{ color: showImg ? "rgba(255,255,255,0.65)" : "rgba(10,10,11,0.5)" }}
          >
            {item.kicker}
          </span>
          <span
            className="text-[10.5px] md:text-[11px] font-medium"
            style={{ color: showImg ? "rgba(255,255,255,0.40)" : "rgba(10,10,11,0.30)" }}
          >
            ·
          </span>
          <span
            className="text-[10.5px] md:text-[11px] font-medium uppercase tracking-[0.2em]"
            style={{ color: showImg ? "rgba(255,255,255,0.65)" : "rgba(10,10,11,0.5)" }}
          >
            {item.year}
          </span>
        </div>
        <h3
          className="font-normal tracking-[-0.01em] leading-[1.15] text-[18px] md:text-[22px]"
          style={{ color: showImg ? "#fff" : "#0A0A0B" }}
        >
          {item.title}
        </h3>
      </div>

      <span
        className="absolute left-0 right-0 bottom-0 h-[3px] origin-left scale-x-0 group-hover/tile:scale-x-100 transition-transform duration-500"
        style={{ background: "var(--pr-accent)" }}
      />
    </button>
  );
}

function Lightbox({
  items,
  index,
  onClose,
  onPrev,
  onNext,
}: {
  items: GalleryItem[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const item = items[index];
  const startX = useRef<number | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") onPrev();
      else if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose, onPrev, onNext]);

  if (!item) return null;

  const btn =
    "w-11 h-11 rounded-full flex items-center justify-center text-white/80 hover:text-white border border-white/15 hover:border-white/40 transition-colors";
  const btnStyle = { background: "rgba(255,255,255,0.05)" };

  return (
    <div
      className="fixed inset-0 z-[2147483600] flex items-center justify-center px-3 pt-16 pb-4 md:px-24 md:pt-20 md:pb-8"
      style={{ background: "rgba(5,5,5,0.92)", backdropFilter: "blur(12px)" }}
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Cerrar"
        className={btn + " fixed top-3 right-3 md:top-6 md:right-6 z-10"}
        style={btnStyle}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4"
          aria-hidden="true"
        >
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onPrev();
        }}
        aria-label="Anterior"
        className={btn + " hidden md:flex fixed left-6 top-1/2 -translate-y-1/2 z-10"}
        style={btnStyle}
      >
        <Chevron dir="left" />
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onNext();
        }}
        aria-label="Siguiente"
        className={btn + " hidden md:flex fixed right-6 top-1/2 -translate-y-1/2 z-10"}
        style={btnStyle}
      >
        <Chevron dir="right" />
      </button>

      <div className="fixed top-[18px] left-3 md:left-1/2 md:-translate-x-1/2 text-[11px] md:text-[12px] font-medium uppercase tracking-[0.2em] text-white/55 z-10 tabular-nums">
        {String(index + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
      </div>

      <div
        className="relative w-full max-w-6xl max-h-full flex flex-col items-center gap-3 md:gap-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="relative w-full rounded-[1rem] md:rounded-[1.25rem] overflow-hidden select-none h-[calc(100dvh-275px)] md:h-auto md:aspect-[16/10] md:max-h-[calc(100dvh-290px)]"
          style={{ background: "#0A0A0B", touchAction: "pan-y" }}
          onPointerDown={(e) => {
            startX.current = e.clientX;
          }}
          onPointerUp={(e) => {
            if (startX.current == null) return;
            const dx = e.clientX - startX.current;
            if (dx > 44) onPrev();
            else if (dx < -44) onNext();
            startX.current = null;
          }}
        >
          {item.img ? (
            <Image
              src={item.img}
              alt={item.title}
              fill
              draggable={false}
              sizes="(min-width: 1280px) 1152px, 100vw"
              className="object-contain"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-white/40">
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-12 h-12"
                aria-hidden="true"
                style={{ color: "var(--pr-accent)" }}
              >
                <path d="M13 2L4.5 13.5h6L9 22l9.5-12h-6L14 2z" />
              </svg>
              <span className="text-[12px] font-medium uppercase tracking-[0.2em]">Imagen pendiente</span>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-1.5 md:gap-2 px-2 text-center w-full max-w-2xl">
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[10.5px] md:text-[11px] font-medium uppercase tracking-[0.2em] text-white/55">
            <span>{item.kicker}</span>
            <span className="text-white/30">·</span>
            <span>{item.year}</span>
            <span className="text-white/30">·</span>
            <span>{item.category}</span>
          </div>
          <h3 className="text-white text-[17px] md:text-[26px] font-light tracking-[-0.015em] leading-snug">
            {item.title}
          </h3>
          {item.desc && (
            <p className="text-[13px] md:text-[14.5px] text-white/60 leading-relaxed line-clamp-3 md:line-clamp-2">
              {item.desc}
            </p>
          )}
        </div>

        <div className="flex md:hidden items-center gap-3">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
            aria-label="Anterior"
            className={btn}
            style={btnStyle}
          >
            <Chevron dir="left" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            aria-label="Siguiente"
            className={btn}
            style={btnStyle}
          >
            <Chevron dir="right" />
          </button>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ category }: { category: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 md:py-32 rounded-[1.5rem] border border-dashed border-black/15 bg-white/40">
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-9 h-9"
        aria-hidden="true"
        style={{ color: "var(--pr-accent)", opacity: 0.6 }}
      >
        <path d="M13 2L4.5 13.5h6L9 22l9.5-12h-6L14 2z" />
      </svg>
      <div className="flex flex-col items-center gap-1 text-center max-w-md px-6">
        <h3 className="text-[20px] md:text-[24px] font-normal text-[#0A0A0B] tracking-[-0.01em]">
          Sin eventos en {category} todavía.
        </h3>
        <p className="text-[14px] text-black/55 leading-relaxed">
          Pronto sumaremos trabajos a esta categoría. Mientras tanto, revisa los demás.
        </p>
      </div>
    </div>
  );
}

function Masonry({ items }: { items: Project[] }) {
  const withAspect = useMemo<GalleryItem[]>(
    () =>
      items.map((p, i) => ({
        ...p,
        _aspect: p.aspect ? p.aspect : ASPECT_CYCLE[i % ASPECT_CYCLE.length],
      })),
    [items],
  );
  const [open, setOpen] = useState<number | null>(null);

  if (withAspect.length === 0) return <EmptyState category={ALL} />;

  return (
    <>
      <div className="pr-gallery-masonry">
        {withAspect.map((item, i) => (
          <div key={item.id + i} className="pr-gallery-masonry-item">
            <Tile item={item} onOpen={() => setOpen(i)} />
          </div>
        ))}
      </div>
      {open !== null && (
        <Lightbox
          items={withAspect}
          index={open}
          onClose={() => setOpen(null)}
          onPrev={() => setOpen((i) => (i === null ? i : (i - 1 + withAspect.length) % withAspect.length))}
          onNext={() => setOpen((i) => (i === null ? i : (i + 1) % withAspect.length))}
        />
      )}
    </>
  );
}

function GalleryNav() {
  return (
    <nav className="relative z-10 max-w-[1536px] mx-auto py-5 px-5 md:py-6 md:px-10 flex items-center justify-between">
      <Link href="/" className="flex items-center group/logo">
        <span className="relative inline-block h-10 md:h-12">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/logo-power-rental.png"
            alt="Power Rental"
            className="h-full w-auto select-none block"
            draggable={false}
          />
        </span>
      </Link>
      <Link
        href="/"
        className="group/back flex items-center rounded-full pl-2 pr-5 py-2 gap-3 border transition-colors duration-200 no-underline"
        style={{ background: "#ffffff", borderColor: "rgba(10,10,11,0.12)", color: "#0A0A0B" }}
      >
        <span
          className="p-1.5 rounded-full flex items-center justify-center group-hover/back:-translate-x-0.5 transition-transform duration-200"
          style={{ background: "rgba(10,10,11,0.06)" }}
        >
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
            <path d="M15 6l-6 6 6 6" />
          </svg>
        </span>
        <span className="text-[13px] font-medium tracking-wide">Volver al inicio</span>
      </Link>
    </nav>
  );
}

function GalleryHeader({ count }: { count: number }) {
  return (
    <header className="max-w-[1536px] mx-auto px-5 md:px-10 pt-10 md:pt-16 pb-10 md:pb-14">
      <div className="flex flex-col gap-4 max-w-3xl">
        <SectionLabel label={`Galería · ${count} eventos`} />
        <h1 className="text-[44px] md:text-[80px] font-light text-[#0A0A0B] tracking-[-0.03em] leading-[1.02]">
          Trabajo en terreno.
          <br />
          <span className="text-black/40">Energía que se ve.</span>
        </h1>
        <p className="text-[15px] md:text-[17px] text-black/55 leading-relaxed max-w-xl mt-2">
          Una mirada a los eventos, faenas y producciones donde Power Rental puso equipos,
          instalación y operación técnica.
        </p>
      </div>
    </header>
  );
}

function CategoryFilter({
  value,
  onChange,
  categories,
}: {
  value: string;
  onChange: (c: string) => void;
  categories: string[];
}) {
  return (
    <div className="max-w-[1536px] mx-auto px-5 md:px-10 pb-10 md:pb-14">
      <div className="flex items-center gap-2 flex-wrap">
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => onChange(c)}
            className="px-4 md:px-5 py-2 md:py-2.5 rounded-full text-[12.5px] md:text-[13px] font-medium tracking-wide border transition-all duration-200"
            style={
              value === c
                ? { background: "#0A0A0B", color: "#ffffff", borderColor: "#0A0A0B" }
                : { background: "#ffffff", color: "rgba(10,10,11,0.75)", borderColor: "rgba(10,10,11,0.12)" }
            }
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}

/** Categorías en el orden en que aparecen, precedidas de "Todos". */
function collectCategories(items: Project[]) {
  const seen = new Set<string>();
  const list = [ALL];
  for (const p of items) {
    if (!p || p.hidden) continue;
    if (p.category && !seen.has(p.category)) {
      seen.add(p.category);
      list.push(p.category);
    }
  }
  return list;
}

export default function Gallery({ items }: { items: Project[] }) {
  const [category, setCategory] = useState(ALL);
  const categories = useMemo(() => collectCategories(items), [items]);
  const filtered = useMemo(
    () => items.filter((p) => !p.hidden && (category === ALL || p.category === category)),
    [items, category],
  );

  return (
    <>
      <GalleryNav />
      <GalleryHeader count={filtered.length} />
      <CategoryFilter value={category} onChange={setCategory} categories={categories} />
      <main className="max-w-[1536px] mx-auto px-5 md:px-10 pb-20 md:pb-32">
        <Masonry items={filtered} />
      </main>
      <Footer />
    </>
  );
}
