"use server";

import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { headers } from "next/headers";
import {
  clearFailedLogins,
  getClientIP,
  loginRateLimit,
  recordFailedLogin,
  verifyPassword,
} from "@/lib/auth";
import { endSession, requireAdmin, startSession } from "@/lib/session";
import {
  createProject,
  deleteProject,
  getProject,
  getProjects,
  reorderFeatured,
  setFeatured,
  updateProject,
  type ProjectInput,
} from "@/lib/projects";
import { uploadsDir } from "@/lib/uploads";

export type ActionResult = { ok: boolean; message: string };

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

/* ── Sesión ── */

export async function login(formData: FormData): Promise<ActionResult> {
  const ip = getClientIP(await headers());
  const limit = loginRateLimit(ip);
  if (!limit.ok) {
    return {
      ok: false,
      message: `Demasiados intentos fallidos. Vuelve a intentar en ${limit.retryAfter}s.`,
    };
  }
  const password = String(formData.get("password") ?? "");  if (!verifyPassword(password)) {
    recordFailedLogin(ip);
    return { ok: false, message: "Contraseña incorrecta." };
  }
  clearFailedLogins(ip);
  await startSession();
  return { ok: true, message: "Sesión iniciada." };
}

export async function logout() {
  await endSession();
}

/* ── Proyectos ── */

function readProjectForm(formData: FormData): ProjectInput {
  const get = (k: string) => String(formData.get(k) ?? "").trim();
  const aspect = get("aspect");
  const desc = get("desc");
  const img = get("img");
  return {
    title: get("title"),
    kicker: get("kicker"),
    year: get("year"),
    category: get("category"),
    img: img || null,
    desc: desc || undefined,
    aspect: aspect || undefined,
    featured: formData.get("featured") === "on",
    featuredOrder: null,
    hidden: formData.get("hidden") === "on",
  };
}

/** Si el proyecto queda destacado, conserva su orden o lo manda al final. */
async function resolveFeaturedOrder(featured: boolean, current: number | null) {
  if (!featured) return null;
  if (typeof current === "number") return current;
  const all = await getProjects();
  const maxOrder = all.reduce(
    (m, p) => (typeof p.featuredOrder === "number" ? Math.max(m, p.featuredOrder) : m),
    -1,
  );
  return maxOrder + 1;
}

function validate(input: ProjectInput) {
  if (!input.title) return "Falta el título.";
  if (!input.kicker) return "Falta la etiqueta (kicker).";
  if (!input.year) return "Falta el año.";
  if (!input.category) return "Falta la categoría.";
  return null;
}

export async function createProjectAction(formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const input = readProjectForm(formData);
  const error = validate(input);
  if (error) return { ok: false, message: error };
  input.featuredOrder = await resolveFeaturedOrder(input.featured, null);
  await createProject(input);
  return { ok: true, message: "Proyecto creado." };
}

export async function updateProjectAction(
  id: string,
  formData: FormData,
): Promise<ActionResult> {
  await requireAdmin();
  const existing = await getProject(id);
  if (!existing) return { ok: false, message: "Proyecto no encontrado." };
  const input = readProjectForm(formData);
  const error = validate(input);
  if (error) return { ok: false, message: error };
  input.featuredOrder = await resolveFeaturedOrder(
    input.featured,
    existing.featured ? existing.featuredOrder : null,
  );
  await updateProject(id, input);
  return { ok: true, message: "Proyecto actualizado." };
}

export async function deleteProjectAction(id: string): Promise<ActionResult> {
  await requireAdmin();
  const project = await getProject(id);
  // Si la imagen fue subida desde el panel, se borra también del disco.
  if (project?.img?.startsWith("/uploads/")) {
    const file = path.join(uploadsDir(), path.basename(project.img));
    await fs.unlink(file).catch(() => {});
  }
  await deleteProject(id);
  return { ok: true, message: "Proyecto eliminado." };
}

export async function toggleHidden(id: string, hidden: boolean): Promise<ActionResult> {
  await requireAdmin();
  await updateProject(id, { hidden });
  return { ok: true, message: hidden ? "Ocultado." : "Visible." };
}

export async function toggleFeatured(id: string, featured: boolean): Promise<ActionResult> {
  await requireAdmin();
  await setFeatured(id, featured);
  return { ok: true, message: featured ? "Destacado." : "Quitado de inicio." };
}

export async function reorderFeaturedAction(ids: string[]): Promise<ActionResult> {
  await requireAdmin();
  await reorderFeatured(ids);
  return { ok: true, message: "Orden actualizado." };
}

/* ── Imágenes ── */

function detectImageType(buf: Buffer) {
  if (buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "jpg";
  if (buf.length >= 8 && buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) return "png";
  if (
    buf.length >= 12 &&
    buf[0] === 0x52 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x46 && // RIFF
    buf[8] === 0x57 && buf[9] === 0x45 && buf[10] === 0x42 && buf[11] === 0x50 // WEBP
  )
    return "webp";
  return null;
}

export async function uploadProjectImage(
  formData: FormData,
): Promise<ActionResult & { url?: string }> {
  await requireAdmin();
  const file = formData.get("file");
  if (!(file instanceof File)) return { ok: false, message: "No se recibió ningún archivo." };
  if (file.size === 0) return { ok: false, message: "El archivo está vacío." };
  if (file.size > MAX_UPLOAD_BYTES) return { ok: false, message: "La imagen pesa más de 10 MB." };

  const buf = Buffer.from(await file.arrayBuffer());
  const ext = detectImageType(buf);
  if (!ext) return { ok: false, message: "Formato no permitido. Usa JPG, PNG o WebP." };

  const dir = uploadsDir();
  await fs.mkdir(dir, { recursive: true });
  const name = `${randomUUID()}.${ext}`;
  await fs.writeFile(path.join(dir, name), buf);
  return { ok: true, url: `/uploads/${name}`, message: "Imagen subida." };
}
