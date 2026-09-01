# AG Supply — sitio institucional

Sitio B2B de **AG Supply SRL**, convertidora de papel en Licey al Medio, Santiago
de los Caballeros. Catálogo sin precios + cotización que termina en WhatsApp.
Marcas propias: **Ocean Breeze** (premium/HORECA) y **Bonche** (económica/masiva).

## Stack

- **Next.js 16** (App Router) + TypeScript, para Vercel
- **Tailwind v4** — tokens de marca en `@theme` dentro de `app/globals.css`
  (única fuente de hex; nada de colores hardcodeados en componentes)
- **Radix primitives** + `lucide-react` (iconografía única)
- **React Context + localStorage** para la cotización (sin backend, sin login)
- Contenido: capa `lib/content` con adaptadores `local` (hoy, `content/*.json`)
  y `sanity` (listo, se activa con `CONTENT_SOURCE=sanity`)

## Desarrollo

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # build de producción (type-check + 187 páginas estáticas)
```

No hace falta configurar nada: por defecto lee `content/*.json`.

## Estructura

```
app/                 rutas (App Router)
components/ui/        primitivos (button, sheet, accordion, badge, toaster)
components/site/      header, footer, swoosh, catálogo, tarjetas, cotización…
lib/content/          adaptador de contenido (local | sanity) + tipos
lib/quote/            contexto de cotización + generador de mensaje WhatsApp
lib/site-config.ts    teléfonos, correo, dirección, número de WhatsApp
content/             seed generado desde Odoo (products/categories/brands.json)
sanity/ + sanity.config.ts   schema de Sanity (definido, sin desplegar)
scripts/             import de Odoo + normalización + seed de Sanity
docs/                DEPLOY, CONTENT, DATA-IMPORT, PENDING-CONTENT
```

## Reglas de contenido (no romper)

- Nunca «distribuidor» → «convertidora de papel» / «fabricante»
- Nunca «24 horas» de entrega → «entrega en tiempo acordado»
- Sin precios en ningún punto del sitio
- Sin emojis en copy institucional
- Texto no confirmado → `<PendingContent>` + entrada en `docs/PENDING-CONTENT.md`

## Documentación

| Archivo | Contenido |
|---|---|
| [docs/DEPLOY.md](docs/DEPLOY.md) | Vercel, Sanity Studio, webhook ISR, dominio |
| [docs/CONTENT.md](docs/CONTENT.md) | Editar contenido (hoy local, mañana Sanity) |
| [docs/DATA-IMPORT.md](docs/DATA-IMPORT.md) | Re-importar el catálogo desde Odoo |
| [docs/PENDING-CONTENT.md](docs/PENDING-CONTENT.md) | Pendientes antes de publicar (auto) |
