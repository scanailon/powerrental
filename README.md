# Power Rental — powerrental.cl

Sitio en Next.js 16 (App Router + Turbopack), React 19 y Tailwind CSS 4.
Proyecto **reconstruido** el 29-10-2026 a partir del build de producción
(`_backup/powerrental-deploy-ORIGINAL.tar.gz`).

## Puesta en marcha local

```bash
npm install
cp .env.example .env.local          # y completa los valores
npm run gen-admin-hash -- "tu-contraseña"   # genera PR_ADMIN_HASH y PR_JWT_SECRET
npm run seed && npm run seed:events  # opcional: datos de ejemplo en ./data
npm run dev
```

## Estructura

| Ruta | Qué es |
| --- | --- |
| `src/app/page.tsx` | Landing (hero, servicios, eventos, cifras, registros, nosotros, contacto) |
| `src/app/galeria` | Galería pública de proyectos |
| `src/app/admin` | Panel admin (login, proyectos, destacados, eventos del marquee) |
| `src/app/actions` | Server actions: `admin.ts`, `events.ts`, `contact.ts` |
| `src/app/uploads/[...slug]` | Sirve las imágenes subidas desde el panel |
| `src/proxy.ts` | Protege `/admin/*` (cookie `pr_admin` firmada con JWT) |
| `src/lib` | Datos (JSON en disco), auth, correo, tema y geometría del logo |

## Datos

Los proyectos, eventos e imágenes subidas **no** son parte del código: viven en
`data/projects.json`, `data/events.json` y `data/uploads/` (o en `PR_DATA_DIR` /
`PR_UPLOADS_DIR`). En producción están en el servidor de cPanel; el deploy no los toca.

## Deploy a cPanel

```bash
npm run deploy:pack
```

Genera `powerrental-deploy.tar.gz` (build standalone + `.next/static` + `public`).
Súbelo a la carpeta de la Node.js App en cPanel, descomprímelo, verifica que las
variables de entorno (ver `.env.example`) estén configuradas y reinicia la app.
El archivo de arranque es `server.js`.
