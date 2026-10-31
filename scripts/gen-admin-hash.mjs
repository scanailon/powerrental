// Genera el valor de PR_ADMIN_HASH para la contraseña del panel admin.
// Uso: npm run gen-admin-hash -- "mi-contraseña-segura"
import { randomBytes, scryptSync } from "node:crypto";

const password = process.argv[2];
if (!password) {
  console.error('Uso: npm run gen-admin-hash -- "tu-contraseña"');
  process.exit(1);
}

const salt = randomBytes(16);
const hash = scryptSync(password, salt, 64);

console.log("\nAgrega esta línea a tu .env.local (y a las variables de entorno en cPanel):\n");
console.log(`PR_ADMIN_HASH=${salt.toString("hex")}:${hash.toString("hex")}`);
console.log("\nY si aún no tienes un secreto para la sesión:\n");
console.log(`PR_JWT_SECRET=${randomBytes(32).toString("hex")}\n`);
