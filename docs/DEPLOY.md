# Despliegue

## 0. Publicar en GitHub (primera vez)

Repo destino: **`https://github.com/agsupplytic/ag-supply`** (vacío).

```bash
# una sola vez: autenticar GitHub CLI
winget install --id GitHub.cli -e
gh auth login          # elegir GitHub.com → HTTPS → login con el navegador

# desde C:\Users\judit\Desktop\AG SITIO
git init
git add -A
git commit -m "AG Supply — sitio institucional"
git branch -M main
git remote add origin https://github.com/agsupplytic/ag-supply.git
git push -u origin main
```

`.gitignore` ya excluye `node_modules/`, `.next/`, `.env*`, `.vercel` y `*.tsbuildinfo`.
Cambios posteriores: `git add -A && git commit -m "..." && git push`.

## 1. Vercel (sitio)

1. En **vercel.com → Add New → Project**, importa `agsupplytic/ag-supply`.
   Framework: Next.js (autodetectado). Build: `next build`. Output: por defecto.
   Cada `git push` a `main` genera un deploy con URL en vivo.
2. Variables de entorno (Project → Settings → Environment Variables):
   - `CONTENT_SOURCE=local` para lanzar ya con el catálogo del repo.
   - Cuando conectes Sanity, cámbiala a `sanity` y añade las de la sección 2.
3. Dominio: añade `agsupply.com.do` (y `www`) en Project → Domains y apunta los
   registros DNS que Vercel indique.
4. Deploy. El sitio es 100% estático salvo `/api/revalidate`.

Nada de esto necesita Sanity: el sitio arranca leyendo `content/*.json`.

## 2. Sanity (CMS headless) — cuando se decida activar

```bash
npm i sanity @sanity/vision styled-components next-sanity
npx sanity login
npx sanity init --project-name "AG Supply" --dataset production
```

Esto crea el proyecto y te da el **Project ID**.

### 2.1 Poblar el contenido inicial

```bash
export NEXT_PUBLIC_SANITY_PROJECT_ID=xxxx
export NEXT_PUBLIC_SANITY_DATASET=production
export SANITY_API_WRITE_TOKEN=<token Editor>
node scripts/seed-sanity.mjs
```

Sube las 8 categorías, las 3 marcas y los ~168 productos de `content/*.json`
(sin imágenes: la fotografía real se sube luego desde el Studio).

### 2.2 Desplegar el Studio

Opción A — Studio embebido en el mismo proyecto Next en `/studio`:

```bash
npm i next-sanity
```

Crea `app/studio/[[...tool]]/page.tsx` que renderice `<NextStudio config={config} />`
(config = `sanity.config.ts`, ya incluido con el schema). Redeploy en Vercel:
el Studio queda en `https://agsupply.com.do/studio`.

Opción B — Studio en subdominio propio:

```bash
npx sanity deploy    # queda en https://agsupply.sanity.studio
```

### 2.3 Activar Sanity como fuente

En Vercel: `CONTENT_SOURCE=sanity`, `NEXT_PUBLIC_SANITY_PROJECT_ID`,
`NEXT_PUBLIC_SANITY_DATASET`, `SANITY_API_READ_TOKEN` (Viewer). Redeploy.
`lib/content/index.ts` cambia de adaptador solo con esa variable.

## 3. Webhook de revalidación (ISR)

Para que publicar en Sanity actualice el sitio sin rebuild completo:

1. Vercel: añade `SANITY_REVALIDATE_SECRET=<cadena larga aleatoria>`.
2. Sanity → API → Webhooks → **Create webhook**:
   - URL: `https://agsupply.com.do/api/revalidate`
   - Trigger: `Create`, `Update`, `Delete` sobre `_type in ["product","category","brand"]`
   - HTTP method: `POST`
   - Headers: `x-webhook-secret: <mismo valor que SANITY_REVALIDATE_SECRET>`
   - Projection (opcional): `{ "type": _type, "slug": slug.current }`
3. El endpoint (`app/api/revalidate/route.ts`) revalida `/`, `/productos`,
   las páginas de categoría y la ficha afectada.

## 4. Checklist antes de publicar

- [ ] Revisar `docs/PENDING-CONTENT.md` (misión/visión, sucursal SD)
- [ ] `docs/IMAGES-NEEDED.md`: foto de producto Bonche (header `/bonche`) + 5 fotos de planta
- [ ] Logos Ocean Breeze / Bonche en PNG con transparencia (hoy van sobre placa blanca)
- [ ] Confirmar el proveedor de envío del formulario de contacto (hoy `mailto:`)
- [ ] `npm run build` en verde
- [ ] Probar la cotización → WhatsApp en un móvil real
- [ ] DNS de `agsupply.com.do` apuntando a Vercel
