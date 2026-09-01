# Imágenes del sitio

> Donde falta una foto se ve un panel tintado limpio (`components/site/image-slot.tsx` o el
> `slot` de `components/site/page-hero.tsx`) — nunca un cartel gritón.
> Para colocar una foto real: sube el `.webp` con el **nombre y proporción exactos** de la tabla
> a `public/images/placeholders/`, añádelo al `Set` de `lib/real-images.ts`, y cambia el
> `<ImageSlot>` / el `slot` del `<PageHero>` por la `image` correspondiente.

## Ya cargadas — 6 fotos reales

| Archivo | Tamaño (px) | Proporción | Dónde se usa |
|---|---|---|---|
| `hero-1.webp` | 1920 × 1080 | 16:9 | Carrusel del hero de **Inicio** |
| `hero-2.webp` | 1920 × 1080 | 16:9 | Carrusel de Inicio · **header de `/productos`** |
| `hero-3.webp` | 1920 × 1080 | 16:9 | Carrusel de Inicio · **header de `/contacto`** |
| `section-nosotros.webp` | 1920 × 1080 | 16:9 | Hero fijo de **Nosotros** (fachada) |
| `section-manufactura.webp` | 1600 × 1200 | 4:3 | Split de Inicio · banda de planta de **Nosotros** · header de `/productos/[categoria]` · **hero de `/ocean-breeze`** |
| `section-cta.webp` | 1920 × 1080 | 16:9 | Banda de cierre de Inicio · **header de `/cotizacion`** |

Como solo hay 6 fotos y 9 superficies fotográficas, `section-manufactura` y `hero-2`/`hero-3` se
reutilizan. Sustituir por tomas propias quita esa repetición (ver «Deseables»).

## Faltan — BLOQUEAN una sección

### 1. Header de la marca Bonche · **1920 × 1080 px** · 16:9

| Archivo | Dónde | Qué debe mostrar |
|---|---|---|
| `brand-bonche-hero.webp` | Hero de **`/bonche`** (hoy: degradado verde de marca + etiqueta del archivo en dev) | Producto Bonche real: servilletas / paquetes Bonche apilados, o una estiba en el colmado. Tono luminoso, no de nave oscura. Mientras no exista, el hero se queda en verde plano. |

### 2. Etapas de la planta — 5 fotos · **1200 × 900 px** · 4:3

| Archivo | Dónde se usa | Qué foto va |
|---|---|---|
| `planta-1.webp` | Nosotros (paso 1) · Nosotros › La planta (etapa 1) | Recepción de bobina: bobinas de gran diámetro entrando a la nave |
| `planta-2.webp` | Nosotros › La planta (etapa 2) | Rebobinado y control de tensión: la rebobinadora en marcha |
| `planta-3.webp` | Nosotros (paso 2) · La planta (etapa 3) | Corte a formato: corte al ancho y largo de hoja |
| `planta-4.webp` | Nosotros (paso 3) · La planta (etapa 4) | Doblado e interfoliado: dobladora de servilletas / toallas |
| `planta-5.webp` | Nosotros (paso 4) · La planta (etapa 5) | Empaque y fardo: producto empacado, fardos etiquetados |

## Faltan — NO bloquean (el sitio se ve terminado sin ellas)

### Fotos de producto — **900 × 900 px** · 1:1 · fondo blanco

De los **168 productos**, **33 traen foto** de Odoo. Faltan **~135**. No se suben al sitio una por
una: se cargan en el `product.template` de Odoo y se re-corre `scripts/import-from-odoo.mjs`, o se
meten en Sanity al conectarlo. Detalle por SKU en `docs/PENDING-CONTENT.md`.

### Deseables

| Archivo | Tamaño (px) | Proporción | Nota |
|---|---|---|---|
| `cat-<categoria>.webp` (8) | 1200 × 900 | 4:3 | Hoy las 8 tarjetas de categoría son **ícono + color** y se ven terminadas. Los 8 archivos actuales en `public/images/placeholders/` son sintéticos **idénticos** (6.680 B) y no se usan como fondo. Solo si más adelante se quiere una foto de ambiente por categoría. |
| tomas propias para headers | 1920 × 1080 | 16:9 | Una foto propia para el header de `/productos`, otra para `/contacto` y otra para `/cotizacion` eliminaría la reutilización de `hero-2` / `hero-3` / `section-cta`. |
| foto HORECA para `/ocean-breeze` | 1920 × 1080 | 16:9 | Mesa de restaurante montada con servilleta Ocean Breeze. Reemplazaría `section-manufactura` en ese header con algo más premium. |

## Logos de marca — nota técnica

`ocean-breeze-logo.webp` y `bonche-logo.webp` vienen **con fondo blanco horneado** (sin canal
alfa). El blanco es color de diseño en ambos (las letras «BONCHE», los brillos del script de Ocean
Breeze), así que **no se puede recortar el fondo automáticamente** sin agujerear el logotipo —
se intentó por umbral de luminancia y por flood-fill, ambos lo destruyen.

`scripts/gen-brand-marks.mjs` genera `*-plate.webp`: el logo recortado al contenido y re-encuadrado
sobre blanco limpio, para que llene su caja. Las tarjetas y los heros de marca lo muestran sobre
placa blanca a propósito.

**Para poder poner el logo directamente sobre color** haría falta un **PNG con transparencia real**
de cada logo (fondo recortado a mano en el archivo de origen).

---

## Resumen para el cliente

**Bloqueante (deja una sección incompleta):**
1. **1 foto de producto Bonche** — 1920 × 1080, luminosa, para el header de la página Bonche.
2. **5 fotos de la planta** — 1200 × 900 horizontal: recepción de bobina, rebobinado, corte,
   doblado/interfoliado, empaque.

**No bloqueante:**
3. ~135 fotos de producto (900 × 900, fondo blanco) — se cargan en Odoo, no en el sitio.
4. Logos Ocean Breeze y Bonche **en PNG con transparencia** — para poder mostrarlos sobre color
   sin la placa blanca.
5. Tomas propias para 3 headers y para la landing de Ocean Breeze (hoy reutilizan fotos existentes).

El logo AG, el `og.png` y el favicon ya están listos.
