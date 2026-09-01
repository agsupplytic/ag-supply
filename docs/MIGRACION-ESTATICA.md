# De Next.js dinámico a HTML estático — lo que se hizo y por qué

El brief pedía **reescribir el sitio a HTML/CSS/JS puro** para "máximo SEO y visibilidad en IA".
Tras analizar el repo, la vía correcta fue otra: **activar el export estático de Next.js**. Este
documento explica la decisión, el cambio realizado y cómo desplegarlo.

---

## Por qué NO se reescribió a mano

| | Reescritura manual a HTML | Export estático (`output: 'export'`) — lo aplicado |
|---|---|---|
| Resultado servido al crawler | `.html` completo | `.html` completo — **idéntico para SEO/IA** |
| JS de framework en runtime | ~0 KB | ~90 KB gz (hidrata carrito, filtros, menú; el HTML ya está completo sin él) |
| 168 fichas de producto | escribir a mano o crear un generador propio | `generateStaticParams` ya lo hace |
| Carrito, filtros, formulario, carruseles | reimplementar en vanilla JS | ya funcionan (todo era client-side) |
| TypeScript, tokens, componentes | se pierden | se conservan |
| Riesgo tras el rediseño de la ronda 12 | alto (regresiones) | bajo (cambio de config) |
| Esfuerzo | semanas + doble mantenimiento | ~1 día |
| Ganancia SEO real | ninguna sobre el export | — |

**Premisa incorrecta del brief:** "Next.js perjudica el SEO por render JS". Este sitio ya
prerenderizaba las 191 rutas; el markup íntegro llegaba en la primera respuesta HTTP. Googlebot y
los crawlers de IA nunca vieron una página vacía. El único obstáculo para emitir archivos `.html`
estáticos era **una función**: `cookies()` en el i18n.

---

## Qué cambió

### 1. i18n → solo español
- `lib/i18n.ts`: eliminado `import { cookies } from "next/headers"`, `getLocale()`, `getT()` async
  y el diccionario `en`. Queda `makeT` + un `t` constante (`makeT("es")`).
- `app/layout.tsx`: sin `await getLocale()`; `lang="es-DO"` fijo.
- `app/page.tsx`, `site-header.tsx`, `site-footer.tsx`: usan el `t` constante.
- Borrado `components/site/language-toggle.tsx` y sus usos en `header-nav.tsx`.

Motivo: el diccionario inglés solo tenía ~50 strings de navegación y el propio código declaraba que
el catálogo se quedaba en español. Mantener un toggle que no traduce el contenido no aporta y
bloqueaba el export. Si el negocio pide inglés real más adelante: segmento de ruta `app/[locale]/`
con `generateStaticParams` → dos árboles estáticos + `hreflang`.

### 2. Configuración de export — `next.config.ts`
```ts
output: "export",              // escribe out/ con .html/.css/.js
images: { unoptimized: true }, // no hay optimizador en un sitio estático; las imágenes son .webp locales
trailingSlash: true,           // /ruta/ → out/ruta/index.html (lo que sirve un host de archivos)
```

### 3. Rutas de metadata
`app/robots.ts` y `app/sitemap.ts` llevan `export const dynamic = "force-static"` (requisito del
export). El sitemap añadió `/faq` y quitó `/cotizacion` (que es `noindex`).

### 4. Borrado
`app/api/revalidate/route.ts` — era un webhook de Sanity inerte (`SANITY_REVALIDATE_SECRET` sin
definir, `CONTENT_SOURCE=local`). Un Route Handler `POST` no puede existir en un export estático.

---

## Cómo generar el sitio

```bash
npm run build      # = next build; con output:'export' escribe ./out
```

`out/` contiene:
```
out/
├── index.html                         (home)
├── productos/index.html
├── productos/servilletas/index.html   (categoría)
├── productos/servilletas/<slug>/index.html   (× 168 fichas)
├── ocean-breeze/index.html
├── bonche/index.html
├── nosotros/index.html
├── nosotros/planta/index.html
├── faq/index.html
├── contacto/index.html
├── cotizacion/index.html
├── 404.html
├── sitemap.xml
├── robots.txt
├── llms.txt
├── images/ · fonts/ · _next/
```

Probar en local:
```bash
npx serve out          # o: cd out && python -m http.server 8000
```

---

## Despliegue

### Opción A — GitHub Pages (gratis, estático)
1. `Settings → Pages → Build and deployment → GitHub Actions`.
2. Workflow (`.github/workflows/deploy.yml`):
```yaml
name: Deploy
on: { push: { branches: [main] } }
permissions: { contents: read, pages: write, id-token: write }
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm }
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with: { path: out }
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment: { name: github-pages, url: "${{ steps.d.outputs.page_url }}" }
    steps:
      - id: d
        uses: actions/deploy-pages@v4
```
3. Dominio propio: `Settings → Pages → Custom domain` → `agsupply.com.do`; apuntar el DNS
   (`ALIAS`/`A` a los IPs de Pages) y crear `public/CNAME` con `agsupply.com.do`.

### Opción B — Netlify / Cloudflare Pages
Conectar el repo. Build command `npm run build`, publish directory `out`. Detecta Next.js.
Cloudflare Pages y Netlify sirven `out/` como estático sin funciones.

### Opción C — Vercel
También funciona (detecta `output: 'export'` y lo sirve estático), pero se pierde la razón de
usar Vercel (no hay SSR/ISR que aprovechar). Solo tiene sentido si más adelante se conecta Sanity
y se vuelve a SSR.

---

## Si en el futuro se conecta Sanity

`output: 'export'` y el webhook ISR (`/api/revalidate`) **no conviven**. Para editar contenido
desde un CMS sin rebuild manual habría que:
- quitar `output: 'export'` de `next.config.ts`,
- restaurar `app/api/revalidate/route.ts`,
- desplegar en Vercel (o similar con Node),
- `CONTENT_SOURCE=sanity` + las env de `docs/DEPLOY.md`.

Alternativa que mantiene el estático: dejar que cada publicación en Sanity dispare el workflow de
build de GitHub Actions (webhook → `repository_dispatch`). Rebuild completo (~1–2 min) en cada cambio.
