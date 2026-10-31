// Empaqueta el build standalone para subirlo a cPanel (Setup Node.js App).
// Se ejecuta con `npm run deploy:pack` (que primero hace `next build`).
//
// Resultado: powerrental-deploy.tar.gz con
//   server.js, package.json, node_modules/, .next/ (incl. static) y public/
// Los datos (data/projects.json, data/events.json, data/uploads/) NO se
// incluyen: viven en el servidor y no deben sobrescribirse en cada deploy.
import { promises as fs } from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const standalone = path.join(root, ".next", "standalone");
const out = path.join(root, "deploy");
const archive = path.join(root, "powerrental-deploy.tar.gz");

async function exists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  if (!(await exists(path.join(standalone, "server.js")))) {
    throw new Error("No se encontró .next/standalone/server.js. Ejecuta `next build` primero.");
  }

  await fs.rm(out, { recursive: true, force: true });
  await fs.cp(standalone, out, { recursive: true });
  // Next no copia los assets estáticos ni /public al standalone.
  await fs.cp(path.join(root, ".next", "static"), path.join(out, ".next", "static"), { recursive: true });
  await fs.cp(path.join(root, "public"), path.join(out, "public"), { recursive: true });
  // Nunca subir datos ni secretos locales.
  await fs.rm(path.join(out, "data"), { recursive: true, force: true });
  for (const f of await fs.readdir(out)) {
    if (f.startsWith(".env")) await fs.rm(path.join(out, f), { force: true });
  }

  await fs.rm(archive, { force: true });
  const res = spawnSync("tar", ["-czf", archive, "-C", out, "."], { stdio: "inherit" });
  if (res.status !== 0) throw new Error("Falló la creación del .tar.gz");

  const { size } = await fs.stat(archive);
  console.log(`\n✔ ${path.basename(archive)} listo (${(size / 1024 / 1024).toFixed(1)} MB)`);
  console.log("  Súbelo a cPanel, descomprímelo en la carpeta de la app y reinicia la Node.js App.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
