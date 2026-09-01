# Plan de mejoras — AG Supply

Prioridades: **P0** bloquea el lanzamiento · **P1** alto impacto, hacer pronto · **P2** mejora incremental.
Estado a septiembre 2026 tras la ronda 13.

---

## Hecho en la ronda 13

- ✅ **Export estático** (`output: 'export'` + `images.unoptimized` + `trailingSlash`). El build
  genera `out/` con `.html` reales por ruta. Sin servidor Node. Ver `docs/MIGRACION-ESTATICA.md`.
- ✅ **Sitio a solo español** — retirado el toggle EN (nunca se tradujo el catálogo ni las páginas
  de empresa; la cookie de idioma bloqueaba el export).
- ✅ **Structured data**: `WebSite`, `Product`, `BreadcrumbList`, `FAQPage` además del
  `Organization`+`LocalBusiness` existente.
- ✅ **Metadata por página**: home con título/descripción propios; helper `ogFor()` da Open Graph
  correcto a las 8 páginas estáticas.
- ✅ **`public/llms.txt`** para crawlers de IA.
- ✅ **Página `/faq`** con 14 preguntas (solo hechos verificables) + `FAQPage` schema, enlazada en
  el header y el footer.
- ✅ **Bloque de información operativa** en `/productos` (pedido, plazo, cobertura, formato a medida).
- ✅ **Formulario de contacto** con envío directo opcional (Web3Forms vía `NEXT_PUBLIC_WEB3FORMS_KEY`)
  y `mailto:` de respaldo. Retirada la nota "próximamente".
- ✅ Limpieza de componentes huérfanos.

---

## P0 — Antes de publicar

| # | Acción | Responsable | Notas |
|---|---|---|---|
| 1 | **Fotografía de planta** — 5 fotos, 1200×900. | Cliente (fotógrafo) | Specs en `docs/IMAGES-NEEDED.md`. Estimado de producción: media jornada de fotógrafo industrial en sitio + edición. |
| 2 | **1 foto de producto Bonche** — 1920×1080, para el header de `/bonche`. | Cliente | Hoy el header es verde plano con etiqueta de archivo en dev. |
| 3 | `gh auth login` + `git push` + conectar el repo en Vercel/GitHub Pages. | Cliente / dev | `gh` ya instalado. Pasos en `docs/DEPLOY.md`. |
| 4 | Verificar el sitio desplegado con el **Rich Results Test** de Google (una ficha de producto, la home, `/faq`). | Dev | El structured data ya está; falta validarlo en vivo. |
| 5 | Crear la key de Web3Forms y ponerla en las env vars del hosting. | Cliente | Si no, el formulario abre el cliente de correo del visitante. |

---

## P1 — Primeras semanas post-lanzamiento

| # | Acción | Notas |
|---|---|---|
| 6 | **Fotos de producto reales** — priorizar los ~30 SKUs más pedidos. | Se cargan en Odoo y se re-corre `scripts/import-from-odoo.mjs`; no se suben al sitio una a una. |
| 7 | **Testimonios** (5–10). Estructura sugerida: `content/testimonials.json` `[{quote, author, role, company, zone}]` + sección en la home y en `/nosotros`. | Pedir a 3–4 clientes HORECA y 3–4 de retail. |
| 8 | **Certificaciones**, si las hay (registro sanitario, ISO, etc.). Superficie: badge en la ficha (`ProductSpecs.compliance`) + bloque en `/nosotros`. | Confirmar cuáles aplican realmente. |
| 9 | **Datos operativos concretos**: pedido mínimo por categoría, plazo típico de entrega por zona. Hoy el bloque dice "se coordina por pedido" por falta de dato. | Del área comercial. |
| 10 | **Logos PNG con transparencia** de Ocean Breeze y Bonche. | Los actuales tienen fondo blanco horneado; el blanco es color de diseño y no se puede recortar por software. Permite mostrar el logo sobre color sin placa. |
| 11 | Lighthouse formal sobre `out/` desplegado; objetivo SEO ≥ 95, LCP < 2,5 s. | |

---

## P2 — Mejora incremental

| # | Acción | Notas |
|---|---|---|
| 12 | Reescribir descripciones de producto orientadas a beneficio (no solo specs). | Empezar por las categorías con más tráfico. |
| 13 | Sección de equipo / liderazgo en `/nosotros` (foto + rol, sin datos personales sensibles). | Requiere fotos y consentimiento. |
| 14 | Búsqueda con autocompletado en el navbar (client-side sobre `products.json`, ya cargado). | El filtro actual cubre el 80 % del caso; esto es comodidad. |
| 15 | `content/faq.json` para que el cliente edite las preguntas sin tocar código. | Hoy están en `app/faq/page.tsx`. |
| 16 | Migrar a Sanity si el cliente quiere editar contenido sin dev (schema ya definido). Nota: Sanity + ISR no es compatible con `output: 'export'` — habría que volver a SSR/Vercel. | Decisión de negocio. |

---

## Plan de fotografía (resumen)

| Lote | Cantidad | Medidas | Uso | Bloqueante |
|---|---|---|---|---|
| Planta | 5 | 1200×900 (4:3) | `/nosotros`, `/nosotros/planta` | **Sí (P0)** |
| Header Bonche | 1 | 1920×1080 (16:9) | Header de `/bonche` | **Sí (P0)** |
| Producto | ~135 | 900×900 (1:1), fondo blanco | Fichas y tarjetas | No (P1, gradual) |
| Headers propios (opcional) | 3 | 1920×1080 | `/productos`, `/contacto`, `/cotizacion` (hoy reutilizan fotos existentes) | No (P2) |
| HORECA para OB (opcional) | 1 | 1920×1080 | Header de `/ocean-breeze` (hoy usa foto de planta) | No (P2) |

Detalle completo en `docs/IMAGES-NEEDED.md`.
