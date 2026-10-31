// Crea data/events.json (cinta "Hemos energizado") con eventos de ejemplo,
// solo si aún no existe. Uso: npm run seed:events   (--force para sobrescribir)
import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";

const dataDir = process.env.PR_DATA_DIR ?? path.join(process.cwd(), "data");
const file = path.join(dataDir, "events.json");
const force = process.argv.includes("--force");

const names = ["FIDAE", "Lollapalooza Chile", "Festival de Viña del Mar", "Teletón", "Fiestas Patrias"];

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
  const events = names.map((name, i) => ({
    id: randomUUID(),
    name,
    order: i,
    createdAt: now + i,
    updatedAt: now + i,
  }));

  await fs.mkdir(dataDir, { recursive: true });
  await fs.writeFile(file, JSON.stringify(events, null, 2), "utf8");
  console.log(`✔ ${events.length} eventos escritos en ${file}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
