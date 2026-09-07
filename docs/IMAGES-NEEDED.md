# Imágenes del sitio

> Para colocar una foto real: sube el `.webp` con el **nombre y proporción exactos** a
> `public/images/placeholders/`, añade su basename al `Set` de `lib/real-images.ts`, y (si la
> superficie usa un `slot`/`ImageSlot`) cámbialo por la `image` correspondiente.

## Cargadas — fotografía real en uso

| Archivo | px | Prop. | Dónde |
|---|---|---|---|
| `hero-1/2/3.webp` | 1920×1080 | 16:9 | Carrusel del hero de Inicio |
| `section-nosotros.webp` | 1920×1080 | 16:9 | Hero de Nosotros (fachada) |
| `section-manufactura.webp` | 1920×1080 | 16:9 | Split de Inicio · banda de planta de Nosotros · header de `/productos/[categoria]` · hero de `/ocean-breeze` |
| `section-cta.webp` | 1920×1080 | 16:9 | Cierre de Inicio · header de `/cotizacion` |
| `header-productos.webp` | 1920×1080 | 16:9 | Header de `/productos` |
| `brand-bonche-hero.webp` | 1600×1000 | 16:10 | Hero de `/bonche` (producto Bonche sobre verde) |
| `planta-1..5.webp` | 1200×900 | 4:3 | Nosotros › La planta — las 5 etapas |
| `cat-*.webp` (8) | 1200×900 | 4:3 | Tarjetas de categoría de Inicio (foto de producto tras el degradado azul) |

**Logos de marca** — `public/images/brand/{ocean-breeze,bonche}-logo.webp` ahora son **PNG/WebP
con transparencia real**. Se usan directamente sobre placa blanca en `brand-split`, `brand-landing`
y el mega-menú. `scripts/gen-brand-marks.mjs` y los `*-plate.webp` quedaron obsoletos.

## Faltan — NO bloquean (el sitio se ve terminado sin ellas)

### Fotos de producto — 900×900 px · 1:1 · fondo blanco

De los **168 productos**, **33 traen foto** de Odoo. Faltan **~135**. No se suben al sitio una por
una: se cargan en el `product.template` de Odoo y se re-corre `scripts/import-from-odoo.mjs`, o se
meten en Sanity al conectarlo. Detalle por SKU en `docs/PENDING-CONTENT.md`.

### Deseables

| Qué | px | Nota |
|---|---|---|
| Tomas propias para 3 headers (`/contacto`, `/cotizacion`, y una alterna de `/productos`) | 1920×1080 | Hoy `/contacto` y `/cotizacion` reutilizan `hero-3` / `section-cta`. |
| Foto HORECA para `/ocean-breeze` | 1920×1080 | Mesa de restaurante montada con servilleta Ocean Breeze; reemplazaría `section-manufactura` en ese header. |
| Fotos de categoría con más color | 1200×900 | Las `cat-*` actuales son producto sobre blanco; bajo el degradado azul se ven tenues. Una toma con más contraste luciría más. |

El logo AG, el `og.png` y el favicon ya están listos.
