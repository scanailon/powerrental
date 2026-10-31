import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";

export type Project = {
  id: string;
  title: string;
  kicker: string;
  year: string;
  category: string;
  img: string | null;
  desc?: string;
  aspect?: string;
  featured: boolean;
  featuredOrder: number | null;
  hidden: boolean;
  createdAt: number;
  updatedAt: number;
};

export type ProjectInput = Omit<Project, "id" | "createdAt" | "updatedAt">;

function dataDir() {
  return process.env.PR_DATA_DIR ?? path.join(process.cwd(), "data");
}

function dataFile() {
  return path.join(dataDir(), "projects.json");
}

async function readAll(): Promise<Project[]> {
  try {
    const raw = await fs.readFile(dataFile(), "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// Escritura atómica: archivo temporal + rename.
async function writeAll(list: Project[]) {
  await fs.mkdir(dataDir(), { recursive: true });
  const tmp = path.join(dataDir(), `.projects.json.tmp.${process.pid}`);
  await fs.writeFile(tmp, JSON.stringify(list, null, 2), "utf8");
  await fs.rename(tmp, dataFile());
}

// Serializa las escrituras para evitar condiciones de carrera.
let queue: Promise<void> = Promise.resolve();
function withLock<T>(fn: () => Promise<T>): Promise<T> {
  const run = queue.then(fn, fn);
  queue = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

const byNewest = (a: Project, b: Project) => b.createdAt - a.createdAt;

export async function getProjects() {
  return (await readAll()).sort(byNewest);
}

export async function getProject(id: string) {
  return (await readAll()).find((p) => p.id === id) ?? null;
}

export async function getVisibleProjects() {
  return (await readAll()).filter((p) => !p.hidden).sort(byNewest);
}

export async function getFeaturedProjects(limit = 4) {
  return (await readAll())
    .filter((p) => p.featured && !p.hidden)
    .sort((a, b) => {
      const oa = a.featuredOrder ?? Number.MAX_SAFE_INTEGER;
      const ob = b.featuredOrder ?? Number.MAX_SAFE_INTEGER;
      return oa !== ob ? oa - ob : b.createdAt - a.createdAt;
    })
    .slice(0, limit);
}

export async function createProject(input: ProjectInput) {
  const now = Date.now();
  const project: Project = { id: randomUUID(), ...input, createdAt: now, updatedAt: now };
  await withLock(async () => {
    const list = await readAll();
    list.push(project);
    await writeAll(list);
  });
  return project;
}

export async function updateProject(id: string, patch: Partial<ProjectInput>) {
  return withLock(async () => {
    const list = await readAll();
    const idx = list.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    const updated = { ...list[idx], ...patch, id, updatedAt: Date.now() };
    list[idx] = updated;
    await writeAll(list);
    return updated;
  });
}

export async function deleteProject(id: string) {
  await withLock(async () => {
    const list = await readAll();
    await writeAll(list.filter((p) => p.id !== id));
  });
}

export async function setFeatured(id: string, featured: boolean) {
  await withLock(async () => {
    const list = await readAll();
    const idx = list.findIndex((p) => p.id === id);
    if (idx === -1) return;
    if (featured) {
      const maxOrder = list.reduce(
        (m, p) => (typeof p.featuredOrder === "number" ? Math.max(m, p.featuredOrder) : m),
        -1,
      );
      list[idx] = { ...list[idx], featured: true, featuredOrder: maxOrder + 1, updatedAt: Date.now() };
    } else {
      list[idx] = { ...list[idx], featured: false, featuredOrder: null, updatedAt: Date.now() };
    }
    await writeAll(list);
  });
}

export async function reorderFeatured(ids: string[]) {
  await withLock(async () => {
    const list = await readAll();
    const order = new Map(ids.map((id, i) => [id, i]));
    const next = list.map((p) =>
      order.has(p.id)
        ? { ...p, featured: true, featuredOrder: order.get(p.id)!, updatedAt: Date.now() }
        : p,
    );
    await writeAll(next);
  });
}
