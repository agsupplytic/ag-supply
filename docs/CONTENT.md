# Gestión de contenido

## Modelo

Todo el sitio lee contenido a través de `lib/content` — nunca importa un JSON o
el cliente de Sanity directamente. Hay dos adaptadores con la **misma firma**:

| Adaptador | Archivo | Fuente | Cuándo |
|---|---|---|---|
| `local` | `lib/content/local.ts` | `content/*.json` | Ahora (por defecto) |
| `sanity` | `lib/content/sanity.ts` | GROQ a Sanity | Cuando `CONTENT_SOURCE=sanity` |

Cambiar de uno a otro es solo la variable `CONTENT_SOURCE`. Ver `docs/DEPLOY.md`.

## Editar contenido HOY (adaptador local)

Los tres archivos en `content/` se **generan** desde Odoo
(`scripts/normalize-odoo.mjs`). Para cambios puntuales antes de conectar Sanity:

- **Textos de categoría / marca**: edita `content/categories.json` /
  `content/brands.json` a mano (o mejor, los objetos `CATEGORIES` / `BRANDS` en
  `scripts/normalize-odoo.mjs` y re-ejecuta, así no se pierden al re-importar).
- **Un producto**: edita su objeto en `content/products.json`
  (`name`, `keySpecs`, `specs`, `description`, `active: false` para ocultarlo).
  Ojo: se sobrescribe al re-importar de Odoo.
- **Imagen de un producto**: coloca un `.webp` en
  `public/images/products/odoo-<odooId>.webp`, pon `"placeholderImage": false` y
  añade la ruta a `"images"`.
- Después de editar, reinicia `npm run dev` (los JSON se importan en build).

Fuente de verdad recomendada para cambios estructurales: los mapas y heurísticas
de `scripts/normalize-odoo.mjs`.

## Editar contenido con Sanity (cuando esté conectado)

1. Abre el Studio (`/studio` o el subdominio de Sanity).
2. Edita productos, categorías y marcas con el schema de `sanity/schemas/`.
3. Al **Publicar**, el webhook de `docs/DEPLOY.md` revalida las páginas
   afectadas en Vercel (ISR) sin rebuild completo.

El schema **no tiene campo de precio** a propósito: AG Supply no publica precios.

## Marcadores de pendientes

`<PendingContent label="…">` (en `components/site/pending-content.tsx`) marca
copy o imágenes sin confirmar. En desarrollo se ve un recuadro ámbar; en
producción muestra el texto de reserva. Cada uso debe tener su línea en
`docs/PENDING-CONTENT.md`.
