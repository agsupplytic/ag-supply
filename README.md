# AG Supply — sitio institucional

Sitio de AG Supply SRL, convertidora de papel en Santiago de los Caballeros, República Dominicana
([agsupply.com.do](https://agsupply.com.do)). Next.js 16 (App Router, exportación estática),
TypeScript, Tailwind v4. Se publica como HTML estático en Hostinger.

> **Next.js de esta versión tiene cambios incompatibles.** Antes de tocar APIs de Next, lea la guía
> correspondiente en `node_modules/next/dist/docs/` (ver `AGENTS.md`).

## Arranque

```bash
npm ci
npm run dev        # http://localhost:3000
npm run check      # lint + typecheck
npm run build      # genera out/ (HTML estático)
npm run check:out  # verifica out/: enlaces, canónicos, hreflang, JSON-LD, sitemap, catálogo en HTML
npm run check:i18n # /en/ no debe contener texto en español
npm run verify     # todo lo anterior
```

Variable opcional: `NEXT_PUBLIC_WEB3FORMS_KEY` (formulario de contacto directo a la bandeja; sin ella
se abre el correo del visitante). Ver `.env.example`.

## Estructura

| Ruta | Contenido |
|---|---|
| `app/(es)/`, `app/(en)/en/` | Rutas (delgadas) en español (raíz) e inglés (`/en/`), cada una con su layout raíz; `sitemap`, `robots`, `llms-full.txt`, `catalogo.json` |
| `components/pages/` | Cuerpo de cada página, compartido por ambos idiomas (recibe `lang`) |
| `lib/i18n/` | Rutas por idioma, textos de interfaz y de empresa, glosario de nombres de producto |
| `components/site/` | Componentes del sitio (cabecera, pie, catálogo, tabla, formulario, JSON-LD…) |
| `components/ui/` | Primitivas (botón, insignia, acordeón, panel lateral, avisos) |
| `lib/site-config.ts` | **Única fuente** de teléfonos, correo, dirección, horario, cifras de planta y distribuidores |
| `lib/content/` | Acceso a `content/*.json` con validación (zod) en build |
| `lib/quote/` | Lista de cotización (almacén sobre `localStorage`) y mensaje de WhatsApp |
| `lib/seo.ts` | Metadatos por página, canónicos con barra final, descripción de producto |
| `content/` | Catálogo (`products.json`, `categories.json`, `brands.json`) y `slug-redirects.json` |
| `scripts/` | Importación desde Odoo, curación editorial, verificación de `out/` |
| `docs/` | Sistema de diseño, despliegue, seguridad, datos pendientes, fotografía, informe |

## Contenido y catálogo

El catálogo viene de Odoo: `import-from-odoo.mjs` → `normalize-odoo.mjs` →
`npm run content:curate` (nombres públicos, sin marcas de terceros; `fabricated`; redirecciones).
Ver `docs/DATA-IMPORT.md` y `docs/CATALOGO-DATOS.md`.

Regla editorial: solo se afirma «fabricado por AG Supply» para el papel tissue (`fabricated` en los
datos). No hay precios, valoraciones ni certificaciones inventadas.

## Documentación

`docs/SISTEMA-DISENO.md` · `docs/DEPLOY.md` · `docs/SECURITY.md` · `docs/DATOS-PENDIENTES.md` · `docs/FOTOS-PRODUCTOS.csv` ·
`docs/FOTOGRAFIA.md` · `docs/INFORME-RENOVACION.md`
