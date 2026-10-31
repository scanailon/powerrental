"use server";

import { requireAdmin } from "@/lib/session";
import { createEvent, deleteEvent, reorderEvents, updateEvent } from "@/lib/events";
import type { ActionResult } from "./admin";

export async function createEventAction(formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { ok: false, message: "Falta el nombre del evento." };
  await createEvent(name);
  return { ok: true, message: "Evento agregado." };
}

export async function updateEventAction(id: string, formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { ok: false, message: "Falta el nombre del evento." };
  const updated = await updateEvent(id, { name });
  return updated
    ? { ok: true, message: "Evento actualizado." }
    : { ok: false, message: "Evento no encontrado." };
}

export async function deleteEventAction(id: string): Promise<ActionResult> {
  await requireAdmin();
  await deleteEvent(id);
  return { ok: true, message: "Evento eliminado." };
}

export async function reorderEventsAction(ids: string[]): Promise<ActionResult> {
  await requireAdmin();
  await reorderEvents(ids);
  return { ok: true, message: "Orden actualizado." };
}
