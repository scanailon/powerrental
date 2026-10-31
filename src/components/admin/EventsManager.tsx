"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { EventItem } from "@/lib/events";
import {
  createEventAction,
  deleteEventAction,
  reorderEventsAction,
  updateEventAction,
} from "@/app/actions/events";

/** Administra los nombres de la cinta "Hemos energizado". */
export default function EventsManager({ events }: { events: EventItem[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const run = (id: string, action: () => Promise<unknown>) => {
    setBusyId(id);
    startTransition(async () => {
      await action();
      router.refresh();
      setBusyId(null);
    });
  };

  const add = () => {
    const name = newName.trim();
    if (!name) return;
    const fd = new FormData();
    fd.set("name", name);
    setNewName("");
    run("__new__", () => createEventAction(fd));
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
  };

  const saveEdit = (id: string) => {
    const name = editName.trim();
    if (!name) return;
    const fd = new FormData();
    fd.set("name", name);
    setEditingId(null);
    run(id, () => updateEventAction(id, fd));
  };

  const move = (index: number, delta: number) => {
    const list = [...events];
    const target = index + delta;
    if (target < 0 || target >= list.length) return;
    [list[index], list[target]] = [list[target], list[index]];
    run(list[target].id, () => reorderEventsAction(list.map((e) => e.id)));
  };

  return (
    <section
      className="rounded-[1.25rem] border p-6 md:p-7"
      style={{ background: "#0F0F12", borderColor: "rgba(255,255,255,0.08)" }}
    >
      <div className="flex items-center justify-between gap-4 mb-5">
        <div className="flex flex-col gap-1">
          <h2 className="text-[16px] font-medium text-white">Eventos del marquee</h2>
          <p className="text-[12.5px] text-white/45">
            Los nombres que se desplazan en la sección “Hemos energizado” de la landing.
          </p>
        </div>
        <span
          className="text-[12px] font-medium tabular-nums px-2.5 py-1 rounded-full"
          style={{
            background: "color-mix(in oklab, var(--pr-accent) 16%, transparent)",
            color: "var(--pr-accent)",
          }}
        >
          {events.length} evento{events.length === 1 ? "" : "s"}
        </span>
      </div>

      <div className="flex items-center gap-2 mb-5">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          placeholder="Nombre del evento (ej. Lollapalooza Chile)"
          className="flex-1 rounded-full border bg-transparent px-4 py-2.5 text-[14px] text-white placeholder:text-white/30 outline-none focus:border-white/40 transition-colors"
          style={{ borderColor: "rgba(255,255,255,0.12)", background: "#0A0A0B" }}
        />
        <button
          type="button"
          disabled={pending || newName.trim() === ""}
          onClick={add}
          className="rounded-full px-5 py-2.5 text-[13px] font-medium tracking-wide transition-all hover:scale-[1.02] disabled:opacity-40 disabled:pointer-events-none shrink-0"
          style={{ background: "var(--pr-accent)", color: "#fff" }}
        >
          + Agregar
        </button>
      </div>

      {events.length === 0 ? (
        <p className="text-[13.5px] text-white/40 py-4">
          Aún no hay eventos. Agrega el primero arriba. (Sin eventos, la sección “Hemos energizado”
          aparece igual, pero el marquee queda vacío.)
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {events.map((ev, i) => {
            const busy = busyId === ev.id && pending;
            const editing = editingId === ev.id;
            return (
              <li
                key={ev.id}
                className="flex items-center gap-3 p-3 rounded-[0.85rem] border"
                style={{ background: "#0A0A0B", borderColor: "rgba(255,255,255,0.07)" }}
              >
                <span className="w-6 text-center text-[13px] font-medium tabular-nums text-white/40">
                  {i + 1}
                </span>
                {editing ? (
                  <input
                    type="text"
                    value={editName}
                    autoFocus
                    onChange={(e) => setEditName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        saveEdit(ev.id);
                      } else if (e.key === "Escape") {
                        cancelEdit();
                      }
                    }}
                    className="flex-1 min-w-0 rounded-lg border bg-transparent px-3 py-1.5 text-[14px] text-white outline-none focus:border-white/40 transition-colors"
                    style={{ borderColor: "rgba(255,255,255,0.18)" }}
                  />
                ) : (
                  <span className="flex-1 min-w-0 text-[14.5px] text-white font-normal truncate">
                    {ev.name}
                  </span>
                )}

                <div className="flex items-center gap-1">
                  {editing ? (
                    <>
                      <button
                        type="button"
                        disabled={pending || editName.trim() === ""}
                        onClick={() => saveEdit(ev.id)}
                        className="text-[12.5px] font-medium px-3 py-1.5 rounded-full disabled:opacity-40 transition-colors"
                        style={{ background: "var(--pr-accent)", color: "#fff" }}
                      >
                        Guardar
                      </button>
                      <button
                        type="button"
                        onClick={cancelEdit}
                        className="text-[12.5px] text-white/45 hover:text-white/80 px-2 transition-colors"
                      >
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        disabled={pending || i === 0}
                        onClick={() => move(i, -1)}
                        aria-label="Subir"
                        title="Subir"
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
                        disabled={pending || i === events.length - 1}
                        onClick={() => move(i, 1)}
                        aria-label="Bajar"
                        title="Bajar"
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
                        onClick={() => {
                          setEditingId(ev.id);
                          setEditName(ev.name);
                        }}
                        aria-label="Editar"
                        title="Editar"
                        className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/5 text-white/50 hover:text-white/80 disabled:opacity-40 transition-colors"
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
                      </button>
                      <button
                        type="button"
                        disabled={pending}
                        onClick={() => {
                          if (confirm(`¿Eliminar "${ev.name}" del marquee?`)) {
                            run(ev.id, () => deleteEventAction(ev.id));
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
                    </>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
