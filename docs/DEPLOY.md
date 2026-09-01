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

## 1. Sitio estático — `docs/MIGRACION-ESTATICA.md`

El sitio se compila a **HTML estático** (`next.config.ts` → `output: 'export'`). `npm run build`
escribe la carpeta `out/`, desplegable sin servidor Node.

- **GitHub Pages** (recomendado, gratis): workflow completo en `docs/MIGRACION-ESTATICA.md`.
- **Netlify / Cloudflare Pages**: conectar el repo, build `npm run build`, publish `out`.
- **Vercel**: también sirve; solo tiene sentido si más adelante se vuelve a SSR para Sanity.

Env var opcional en el hosting: `NEXT_PUBLIC_WEB3FORMS_KEY` (formulario de contacto → inbox;
sin ella el formulario abre el cliente de correo del visitante).

Dominio `agsupply.com.do`: crear `public/CNAME` con el dominio y apuntar el DNS al host elegido.

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

> **Nota:** con el sitio en `output: 'export'` no hay `/api/revalidate` ni ISR. Para editar
> desde Sanity sin rebuild manual: o se vuelve a SSR en Vercel (quitar `output: 'export'`,
> restaurar la ruta), o se dispara el workflow de GitHub Actions con un webhook
> `repository_dispatch` en cada publicación (rebuild completo, ~1–2 min). Detalle en
> `docs/MIGRACION-ESTATICA.md`.

## 3. Webhook de revalidación (ISR) — solo si se vuelve a SSR

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
