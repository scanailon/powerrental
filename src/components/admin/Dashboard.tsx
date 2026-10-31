"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Project } from "@/lib/projects";
import {
  deleteProjectAction,
  reorderFeaturedAction,
  toggleFeatured,
  toggleHidden,
} from "@/app/actions/admin";

/** Cantidad de destacados que muestra la sección "Registros" de la landing. */
const FEATURED_ON_HOME = 4;
const ALL_CATEGORIES = "Todas";

type StatusFilter = "todos" | "destacados" | "ocultos";

function Thumb({ img }: { img: string | null }) {
  return (
    <div
      className="w-14 h-14 rounded-[0.6rem] overflow-hidden shrink-0 border flex items-center justify-center"
      style={{ background: "#1A1A1B", borderColor: "rgba(255,255,255,0.08)" }}
    >
      {img ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={img} alt="" className="w-full h-full object-cover" />
      ) : (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-5 h-5"
          style={{ color: "var(--pr-accent)", opacity: 0.6 }}
          aria-hidden="true"
        >
          <path d="M13 2L4.5 13.5h6L9 22l9.5-12h-6L14 2z" />
        </svg>
      )}
    </div>
  );
}

export default function Dashboard({ projects }: { projects: Project[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(ALL_CATEGORIES);
  const [status, setStatus] = useState<StatusFilter>("todos");

  const featured = projects
    .filter((p) => p.featured)
    .sort((a, b) => (a.featuredOrder ?? 0) - (b.featuredOrder ?? 0));

  const categories = useMemo(() => {
    const set = new Set<string>();
    for (const p of projects) if (p.category) set.add(p.category);
    return [ALL_CATEGORIES, ...Array.from(set).sort()];
  }, [projects]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects.filter(
      (p) =>
        (category === ALL_CATEGORIES || p.category === category) &&
        (status !== "destacados" || !!p.featured) &&
        (status !== "ocultos" || !!p.hidden) &&
        (!q || `${p.title} ${p.kicker} ${p.category} ${p.year}`.toLowerCase().includes(q)),
    );
  }, [projects, query, category, status]);

  const hasFilters = query.trim() !== "" || category !== ALL_CATEGORIES || status !== "todos";
  const clearFilters = () => {
    setQuery("");
    setCategory(ALL_CATEGORIES);
    setStatus("todos");
  };

  /** Ejecuta una acción del servidor y refresca los datos de la página. */
  const run = (id: string, action: () => Promise<unknown>) => {
    setBusyId(id);
    startTransition(async () => {
      await action();
      router.refresh();
      setBusyId(null);
    });
  };

  const move = (index: number, delta: number) => {
    const list = [...featured];
    const target = index + delta;
    if (target < 0 || target >= list.length) return;
    [list[index], list[target]] = [list[target], list[index]];
    run(list[index].id, () => reorderFeaturedAction(list.map((p) => p.id)));
  };

  return (
    <div className="flex flex-col gap-10">
      {/* ── Destacados ── */}
      <section
        className="rounded-[1.25rem] border p-6 md:p-7"
        style={{ background: "#0F0F12", borderColor: "rgba(255,255,255,0.08)" }}
      >
        <div className="flex items-center justify-between gap-4 mb-5">
          <div className="flex flex-col gap-1">
            <h2 className="text-[16px] font-medium text-white">Destacados en inicio</h2>
            <p className="text-[12.5px] text-white/45">
              Los primeros {FEATURED_ON_HOME} se muestran en la sección Proyectos de la landing. El
              primero es la tarjeta grande.
            </p>
          </div>
          <span
            className="text-[12px] font-medium tabular-nums px-2.5 py-1 rounded-full"
            style={{
              background: "color-mix(in oklab, var(--pr-accent) 16%, transparent)",
              color: "var(--pr-accent)",
            }}
          >
            {featured.length} destacado{featured.length === 1 ? "" : "s"}
          </span>
        </div>

        {featured.length === 0 ? (
          <p className="text-[13.5px] text-white/40 py-4">
            Aún no hay proyectos destacados. Marca alguno con la estrella abajo.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {featured.map((p, i) => {
              const onHome = i < FEATURED_ON_HOME;
              return (
                <li
                  key={p.id}
                  className="flex items-center gap-4 p-3 rounded-[0.85rem] border"
                  style={{
                    background: onHome ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.01)",
                    borderColor: onHome
                      ? "color-mix(in oklab, var(--pr-accent) 22%, transparent)"
                      : "rgba(255,255,255,0.06)",
                    opacity: onHome ? 1 : 0.55,
                  }}
                >
                  <span className="w-6 text-center text-[13px] font-medium tabular-nums text-white/50">
                    {i + 1}
                  </span>
                  <Thumb img={p.img} />
                  <div className="flex-1 min-w-0">
                    <div className="text-[14px] text-white font-normal truncate">{p.title}</div>
                    <div className="text-[12px] text-white/40 truncate">
                      {p.kicker}
                      {i === 0 ? " · tarjeta grande" : ""}
                      {i >= FEATURED_ON_HOME ? " · fuera del top 4" : ""}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      disabled={pending || i === 0}
                      onClick={() => move(i, -1)}
                      aria-label="Subir"
                      className="w-8 h-8 rounded-full flex items-center justify-center border text-white/70 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
                      style={{ borderColor: "rgba(255,255,255,0.15)" }}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-4 h-4"
                      >
                        <path d="M18 15l-6-6-6 6" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      disabled={pending || i === featured.length - 1}
                      onClick={() => move(i, 1)}
                      aria-label="Bajar"
                      className="w-8 h-8 rounded-full flex items-center justify-center border text-white/70 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
                      style={{ borderColor: "rgba(255,255,255,0.15)" }}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-4 h-4"
                      >
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      disabled={pending}
                      onClick={() => run(p.id, () => toggleFeatured(p.id, false))}
                      className="ml-1 text-[12px] text-white/45 hover:text-white/80 px-2 disabled:opacity-40"
                    >
                      Quitar
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* ── Todos los proyectos ── */}
      <section>
        <div className="flex items-center justify-between gap-4 mb-5">
          <h2 className="text-[16px] font-medium text-white">Todos los proyectos</h2>
          <Link
            href="/admin/new"
            className="rounded-full px-5 py-2.5 text-[13px] font-medium tracking-wide transition-all hover:scale-[1.02]"
            style={{ background: "var(--pr-accent)", color: "#fff" }}
          >
            + Nuevo proyecto
          </Link>
        </div>

        <div className="flex flex-col gap-3 mb-5">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/35 pointer-events-none">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-4.3-4.3" />
              </svg>
            </span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por título, etiqueta, categoría o año…"
              className="w-full rounded-full border bg-transparent pl-11 pr-10 py-2.5 text-[14px] text-white placeholder:text-white/30 outline-none focus:border-white/40 transition-colors"
              style={{ borderColor: "rgba(255,255,255,0.12)", background: "#0F0F12" }}
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Limpiar búsqueda"
                className="absolute right-3.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center text-white/40 hover:text-white/80 hover:bg-white/10 transition-colors"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-3.5 h-3.5"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {categories.map((c) => {
              const active = category === c;
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory(c)}
                  className="px-3.5 py-1.5 rounded-full text-[12.5px] font-medium border transition-colors"
                  style={
                    active
                      ? { background: "#fff", color: "#0A0A0B", borderColor: "#fff" }
                      : {
                          background: "transparent",
                          color: "rgba(255,255,255,0.7)",
                          borderColor: "rgba(255,255,255,0.14)",
                        }
                  }
                >
                  {c}
                </button>
              );
            })}
            <span className="w-px h-5 bg-white/10 mx-1 hidden sm:block" />
            {(
              [
                ["todos", "Todos"],
                ["destacados", "Destacados"],
                ["ocultos", "Ocultos"],
              ] as const
            ).map(([value, label]) => {
              const active = status === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setStatus(value)}
                  className="px-3.5 py-1.5 rounded-full text-[12.5px] font-medium border transition-colors"
                  style={
                    active
                      ? {
                          background: "color-mix(in oklab, var(--pr-accent) 90%, #000)",
                          color: "#fff",
                          borderColor: "transparent",
                        }
                      : {
                          background: "transparent",
                          color: "rgba(255,255,255,0.7)",
                          borderColor: "rgba(255,255,255,0.14)",
                        }
                  }
                >
                  {label}
                </button>
              );
            })}
            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="ml-1 text-[12.5px] text-white/45 hover:text-white/80 px-2 transition-colors"
              >
                Limpiar filtros
              </button>
            )}
            <span className="ml-auto text-[12.5px] text-white/40 tabular-nums">
              {filtered.length} de {projects.length}
            </span>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-[0.85rem] border border-dashed border-white/12 py-12 flex flex-col items-center gap-2 text-center">
            <span className="text-[14px] text-white/55">No hay proyectos que coincidan.</span>
            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-[13px] px-3"
                style={{ color: "var(--pr-accent)" }}
              >
                Limpiar filtros
              </button>
            )}
          </div>
        ) : (
          <ul className="flex flex-col gap-2">
            {filtered.map((p) => {
              const busy = busyId === p.id && pending;
              return (
                <li
                  key={p.id}
                  className="flex items-center gap-4 p-3 rounded-[0.85rem] border transition-opacity"
                  style={{
                    background: "#0F0F12",
                    borderColor: "rgba(255,255,255,0.07)",
                    opacity: p.hidden ? 0.5 : 1,
                  }}
                >
                  <Thumb img={p.img} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[14.5px] text-white font-normal truncate">{p.title}</span>
                      {p.featured && (
                        <span
                          className="text-[10px] font-medium uppercase tracking-wide px-1.5 py-0.5 rounded"
                          style={{
                            background: "color-mix(in oklab, var(--pr-accent) 18%, transparent)",
                            color: "var(--pr-accent)",
                          }}
                        >
                          Inicio
                        </span>
                      )}
                      {p.hidden && (
                        <span className="text-[10px] font-medium uppercase tracking-wide px-1.5 py-0.5 rounded bg-white/10 text-white/55">
                          Oculto
                        </span>
                      )}
                    </div>
                    <div className="text-[12px] text-white/40 truncate">
                      {p.kicker} · {p.year} · {p.category}
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={pending}
                      onClick={() => run(p.id, () => toggleFeatured(p.id, !p.featured))}
                      aria-label={p.featured ? "Quitar de inicio" : "Destacar en inicio"}
                      title={p.featured ? "Quitar de inicio" : "Destacar en inicio"}
                      className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/5 disabled:opacity-40 transition-colors"
                      style={{ color: p.featured ? "var(--pr-accent)" : "rgba(255,255,255,0.4)" }}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill={p.featured ? "currentColor" : "none"}
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-4 h-4"
                      >
                        <path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z" />
                      </svg>
                    </button>

                    <button
                      type="button"
                      disabled={pending}
                      onClick={() => run(p.id, () => toggleHidden(p.id, !p.hidden))}
                      aria-label={p.hidden ? "Mostrar" : "Ocultar"}
                      title={p.hidden ? "Mostrar en galería" : "Ocultar de galería"}
                      className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/5 text-white/50 hover:text-white/80 disabled:opacity-40 transition-colors"
                    >
                      {p.hidden ? (
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="w-4 h-4"
                        >
                          <path d="M17.9 17.9A10 10 0 0112 20C5 20 1 12 1 12a18 18 0 015.1-5.9M9.9 4.2A10 10 0 0112 4c7 0 11 8 11 8a18 18 0 01-2.2 3.2M1 1l22 22M9.9 9.9a3 3 0 004.2 4.2" />
                        </svg>
                      ) : (
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="w-4 h-4"
                        >
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>

                    <Link
                      href={`/admin/${p.id}/edit`}
                      aria-label="Editar"
                      title="Editar"
                      className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/5 text-white/50 hover:text-white/80 transition-colors"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-4 h-4"
                      >
                        <path d="M12 20h9" />
                        <path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z" />
                      </svg>
                    </Link>

                    <button
                      type="button"
                      disabled={pending}
                      onClick={() => {
                        if (confirm(`¿Eliminar "${p.title}"? Esta acción no se puede deshacer.`)) {
                          run(p.id, () => deleteProjectAction(p.id));
                        }
                      }}
                      aria-label="Eliminar"
                      title="Eliminar"
                      className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-red-500/10 text-white/45 hover:text-red-300 disabled:opacity-40 transition-colors"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-4 h-4"
                      >
                        <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m2 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6" />
                      </svg>
                    </button>

                    {busy && (
                      <span
                        className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white/70 animate-spin ml-1"
                        aria-hidden="true"
                      />
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
