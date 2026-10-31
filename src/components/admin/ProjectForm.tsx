"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { Project } from "@/lib/projects";
import { createProjectAction, updateProjectAction, uploadProjectImage } from "@/app/actions/admin";

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

const inputCls =
  "w-full bg-transparent border-0 border-b border-white/15 focus:border-white/60 outline-none py-2.5 text-[15px] text-white placeholder:text-white/30 transition-colors duration-200";
const labelCls = "text-[10.5px] font-medium uppercase tracking-[0.2em] text-white/50";

type Status = { type: "ok" | "error"; message: string };

/** Formulario para crear (sin `project`) o editar un proyecto. */
export default function ProjectForm({ project }: { project?: Project }) {
  const router = useRouter();
  const isEdit = !!project;
  const [img, setImg] = useState<string | null>(project?.img ?? null);
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<Status | null>(null);

  const onFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (file.size > MAX_UPLOAD_BYTES) {
      setUploadMsg(
        `La imagen pesa ${(file.size / 1024 / 1024).toFixed(1)} MB (máx 10 MB). Reduce su tamaño e intenta de nuevo.`,
      );
      return;
    }
    setUploading(true);
    setUploadMsg(null);
    try {
      const fd = new FormData();
      fd.set("file", file);
      const res = await uploadProjectImage(fd);
      if (res.ok && res.url) {
        setImg(res.url);
        setUploadMsg("Imagen lista.");
      } else {
        setUploadMsg(res.message);
      }
    } catch {
      setUploadMsg("No se pudo subir la imagen. Verifica tu conexión e intenta con una más liviana.");
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setStatus(null);
    const fd = new FormData(e.currentTarget);
    fd.set("img", img ?? "");
    try {
      const res = isEdit ? await updateProjectAction(project.id, fd) : await createProjectAction(fd);
      if (res.ok) {
        setStatus({ type: "ok", message: res.message + " Volviendo al panel…" });
        setTimeout(() => {
          router.push("/admin");
          router.refresh();
        }, 1100);
      } else {
        setStatus({ type: "error", message: res.message });
        setSaving(false);
      }
    } catch {
      setStatus({ type: "error", message: "No se pudo guardar. Intenta de nuevo." });
      setSaving(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-8 w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        <label className="flex flex-col gap-2">
          <span className={labelCls}>Título *</span>
          <input name="title" defaultValue={project?.title} required className={inputCls} placeholder="FIDAE 2024" />
        </label>
        <label className="flex flex-col gap-2">
          <span className={labelCls}>Etiqueta (kicker) *</span>
          <input
            name="kicker"
            defaultValue={project?.kicker}
            required
            className={inputCls}
            placeholder="Feria · Aeronáutica"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className={labelCls}>Año *</span>
          <input name="year" defaultValue={project?.year} required className={inputCls} placeholder="2024" />
        </label>
        <label className="flex flex-col gap-2">
          <span className={labelCls}>Categoría *</span>
          <input
            name="category"
            defaultValue={project?.category}
            required
            className={inputCls}
            placeholder="Eventos"
          />
        </label>
      </div>

      <div className="flex flex-col gap-3">
        <span className={labelCls}>Imagen</span>
        <div className="flex items-start gap-5">
          <div
            className="w-28 h-28 rounded-[0.75rem] overflow-hidden shrink-0 border flex items-center justify-center"
            style={{ background: "#1A1A1B", borderColor: "rgba(255,255,255,0.1)" }}
          >
            {img ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={img} alt="" className="w-full h-full object-cover" />
            ) : (
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-8 h-8"
                style={{ color: "var(--pr-accent)", opacity: 0.6 }}
                aria-hidden="true"
              >
                <path d="M13 2L4.5 13.5h6L9 22l9.5-12h-6L14 2z" />
              </svg>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-medium border cursor-pointer w-fit transition-colors hover:bg-white/5"
              style={{ borderColor: "rgba(255,255,255,0.18)", color: "#fff" }}
            >
              {uploading ? "Subiendo…" : img ? "Cambiar imagen" : "Subir imagen"}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={onFile}
                className="hidden"
                disabled={uploading}
              />
            </label>
            {img && (
              <button
                type="button"
                onClick={() => setImg(null)}
                className="text-[12px] text-white/45 hover:text-white/80 w-fit"
              >
                Quitar imagen
              </button>
            )}
            {uploadMsg && <span className="text-[12px] text-white/45">{uploadMsg}</span>}
            <span className="text-[11.5px] text-white/35">JPG, PNG o WebP · máx 10 MB</span>
          </div>
        </div>
      </div>

      <label className="flex flex-col gap-2">
        <span className={labelCls}>Descripción (solo tarjeta grande de la landing)</span>
        <textarea
          name="desc"
          defaultValue={project?.desc}
          rows={3}
          className={inputCls + " resize-none"}
          placeholder="Energía y soporte técnico durante la feria…"
        />
      </label>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        <label className="flex flex-col gap-2">
          <span className={labelCls}>Aspecto del tile (opcional)</span>
          <input
            name="aspect"
            defaultValue={project?.aspect}
            className={inputCls}
            placeholder="aspect-[4/5]  (vacío = automático)"
          />
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-6 pt-2">
        <label className="inline-flex items-center gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            name="featured"
            defaultChecked={project?.featured}
            className="w-4 h-4 accent-[var(--pr-accent)]"
          />
          <span className="text-[13.5px] text-white/80">Destacar en la landing</span>
        </label>
        <label className="inline-flex items-center gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            name="hidden"
            defaultChecked={project?.hidden}
            className="w-4 h-4 accent-[var(--pr-accent)]"
          />
          <span className="text-[13.5px] text-white/80">Ocultar de la galería</span>
        </label>
      </div>

      {status && (
        <div
          role="status"
          aria-live="polite"
          className="flex items-center gap-3 rounded-[0.85rem] border px-4 py-3"
          style={
            status.type === "ok"
              ? {
                  background: "color-mix(in oklab, var(--pr-accent) 12%, transparent)",
                  borderColor: "color-mix(in oklab, var(--pr-accent) 40%, transparent)",
                }
              : { background: "rgba(239,68,68,0.08)", borderColor: "rgba(239,68,68,0.35)" }
          }
        >
          <span
            className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
            style={
              status.type === "ok"
                ? { background: "var(--pr-accent)", color: "#fff" }
                : { background: "rgba(239,68,68,0.9)", color: "#fff" }
            }
          >
            {status.type === "ok" ? (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4"
              >
                <path d="M20 6L9 17l-5-5" />
              </svg>
            ) : (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4"
              >
                <path d="M12 8v5M12 16h.01" />
                <circle cx="12" cy="12" r="9" />
              </svg>
            )}
          </span>
          <span
            className="text-[13.5px]"
            style={{ color: status.type === "ok" ? "#fff" : "rgb(252,165,165)" }}
          >
            {status.message}
          </span>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="rounded-full px-6 py-3 text-[14px] font-medium tracking-wide transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none"
          style={{ background: "var(--pr-accent)", color: "#fff" }}
        >
          {saving ? "Guardando…" : isEdit ? "Guardar cambios" : "Crear proyecto"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-full pl-4 pr-5 py-3 text-[14px] font-medium border transition-colors hover:bg-white/5 inline-flex items-center gap-2"
          style={{ borderColor: "rgba(255,255,255,0.18)", color: "rgba(255,255,255,0.8)" }}
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
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Volver atrás
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin")}
          className="rounded-full px-5 py-3 text-[14px] font-medium text-white/55 hover:text-white/85 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
