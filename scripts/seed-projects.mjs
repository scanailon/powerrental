// Crea data/projects.json con proyectos de ejemplo (solo si aún no existe).
// Uso: npm run seed            (agrega --force para sobrescribir)
//
// NOTA: este archivo se reconstruyó desde el build de producción; los datos
// reales del sitio viven en data/projects.json del servidor (no en el código).
import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";

const dataDir = process.env.PR_DATA_DIR ?? path.join(process.cwd(), "data");
const file = path.join(dataDir, "projects.json");
const force = process.argv.includes("--force");

const samples = [
  { title: "FIDAE", kicker: "Feria · Aeronáutica", year: "2024", category: "Eventos", img: "/assets/poster-fidae.jpg" },
  { title: "Escenario principal", kicker: "Festival · Música", year: "2024", category: "Eventos", img: "/assets/poster-stage.jpg" },
  { title: "Torres de iluminación", kicker: "Producción · Nocturna", year: "2023", category: "Producciones", img: "/assets/poster-towers-night.jpg" },
  { title: "Respaldo en garage", kicker: "Faena · Respaldo", year: "2023", category: "Faenas", img: "/assets/poster-garage.jpg" },
];

async function main() {
  try {
    await fs.access(file);
    if (!force) {
      console.log(`Ya existe ${file}. Usa --force para sobrescribir.`);
      return;
    }
  } catch {
    // no existe: lo creamos
  }

  const now = Date.now();
  const projects = samples.map((s, i) => ({
    id: randomUUID(),
    ...s,
    featured: true,
    featuredOrder: i,
    hidden: false,
    createdAt: now - i * 1000,
    updatedAt: now - i * 1000,
  }));

  await fs.mkdir(dataDir, { recursive: true });
  await fs.writeFile(file, JSON.stringify(projects, null, 2), "utf8");
  console.log(`✔ ${projects.length} proyectos escritos en ${file}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
