import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";

/** Evento mostrado en la cinta "Hemos energizado" de la home. */
export type EventItem = {
  id: string;
  name: string;
  order: number;
  createdAt: number;
  updatedAt: number;
};

function dataDir() {
  return process.env.PR_DATA_DIR ?? path.join(process.cwd(), "data");
}

function dataFile() {
  return path.join(dataDir(), "events.json");
}

async function readAll(): Promise<EventItem[]> {
  try {
    const raw = await fs.readFile(dataFile(), "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeAll(list: EventItem[]) {
  await fs.mkdir(dataDir(), { recursive: true });
  const tmp = path.join(dataDir(), `.events.json.tmp.${process.pid}`);
  await fs.writeFile(tmp, JSON.stringify(list, null, 2), "utf8");
  await fs.rename(tmp, dataFile());
}

let queue: Promise<void> = Promise.resolve();
function withLock<T>(fn: () => Promise<T>): Promise<T> {
  const run = queue.then(fn, fn);
  queue = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

const byOrder = (a: EventItem, b: EventItem) =>
  a.order !== b.order ? a.order - b.order : a.createdAt - b.createdAt;

export async function getEvents() {
  return (await readAll()).sort(byOrder);
}

export async function getEventNames() {
  return (await getEvents()).map((e) => e.name);
}

export async function createEvent(name: string) {
  return withLock(async () => {
    const list = await readAll();
    const maxOrder = list.reduce((m, e) => Math.max(m, e.order), -1);
    const now = Date.now();
    const item: EventItem = { id: randomUUID(), name, order: maxOrder + 1, createdAt: now, updatedAt: now };
    list.push(item);
    await writeAll(list);
    return item;
  });
}

export async function updateEvent(id: string, patch: Partial<Pick<EventItem, "name">>) {
  return withLock(async () => {
    const list = await readAll();
    const idx = list.findIndex((e) => e.id === id);
    if (idx === -1) return null;
    const updated = { ...list[idx], ...patch, id, updatedAt: Date.now() };
    list[idx] = updated;
    await writeAll(list);
    return updated;
  });
}

export async function deleteEvent(id: string) {
  await withLock(async () => {
    const list = await readAll();
    await writeAll(list.filter((e) => e.id !== id));
  });
}

export async function reorderEvents(ids: string[]) {
  await withLock(async () => {
    const list = await readAll();
    const order = new Map(ids.map((id, i) => [id, i]));
    const next = list.map((e) =>
      order.has(e.id) ? { ...e, order: order.get(e.id)!, updatedAt: Date.now() } : e,
    );
    await writeAll(next);
  });
}
