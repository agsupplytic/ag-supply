# Informe de renovación del sitio — octubre 2026

Rama: `claude/loving-lovelace-fnlkqn` (sin fusionar a `main`; no hay despliegue a producción).
Mediciones: Lighthouse 13 en Chromium local, `out/` servido con gzip (emula el `mod_deflate` del
hosting), perfil móvil y escritorio simulados. Son **datos de laboratorio**; no hay datos de campo
(CrUX/Search Console) ni acceso a ellos.

## 1. Estado inicial

- Estética de plantilla: degradados azul/rojo/verde, tarjetas con icono (17 usos), tres rejillas de
  3 tarjetas por página, contadores animados, carrusel, banda roja, protección anti-copia de imágenes.
- Catálogo (`/productos/` y las 8 categorías) con el listado fuera del HTML estático («Cargando
  catálogo…») y 116 de 168 fichas sin enlace interno.
- Afirmaciones sin respaldo: «Fabricado por AG Supply» en las 168 fichas (incluidos jabón, desechables,
  cubertería), «cada categoría se produce en planta», «blancura superior al 98 %», «precios justos».
- Marcas de clientes de maquila (Chito, Pannez, Rancho, Samey, Senator, Jerez…) en nombres y URLs.
- Fotografías con texto deformado y una foto ajena a la planta (`planta-1`, montacargas HANGCHA).
- SEO: sitemap/JSON-LD sin barra final (~190 URLs redirigidas), `Product` JSON-LD con SKU repetidos,
  `robots` bloqueando la página con `noindex`, Organization con distribuidores como `subOrganization`.
- Cotización: estado en contexto con `useEffect` (2 errores de lint), cantidades que no se podían
  vaciar, enlace de toast que ignoraba `basePath`, mensajes de WhatsApp sin límite de longitud.
- 3,4 MB de fuentes sin uso y ~1,5 MB de imágenes muertas; Node 20; workflow sin lint ni permisos.

## 2. Dirección visual

Industrial e institucional (ver `docs/SISTEMA-DISENO.md`): azul y rojo del logotipo, fondos planos,
una sola superficie oscura, esquinas rectas, tablas en lugar de tarjetas con icono, Barlow + Source
Sans 3. Ocean Breeze y Bonche conservan paleta y composición propias. **Es un cambio de dirección
respecto a las dos rondas que el cliente rechazó antes** (ver `docs/CONTEXTO-PROYECTO.md`): requiere
su visto bueno antes de fusionar.

## 3. Cambios principales

- **Diseño**: tokens, componentes base y las 12 plantillas de página reconstruidas sobre el mismo
  sistema; cabecera con barra de datos y menús accesibles por teclado; pie con datos de empresa.
- **Catálogo**: listado completo en HTML estático (168 productos sin JavaScript); vista tabla densa
  (SKU, producto, marca, presentación, cantidad) y tarjetas; orden; filtros con conteo; búsqueda
  multitérmino (producto, SKU, marca, presentación); estado en la URL; corrección de filtros huérfanos
  y del botón Atrás; panel de filtros en móvil.
- **Cotización**: almacén sobre `useSyncExternalStore` con validación de lo guardado, cantidad por
  presentación en lista y mensaje, aviso y partes cuando la lista es larga, «Copiar la lista».
- **Datos**: `scripts/curate-products.mjs` (nombres públicos sin marcas de terceros, tildes, erratas
  inequívocas, `ply` coherente, presentación unificada, `fabricated`), 37 redirecciones 301,
  informe de SKU, validación zod en build.
- **SEO**: canónico/OG/Twitter coherentes por página; títulos ≤ 70 y descripciones ≤ 165; barra final
  en sitemap, JSON-LD, llms y catálogo; `lastmod` real por archivo; Organization única sin
  LocalBusiness; Product mínimo sin `offers` ni `sku` repetido; FAQ con jerarquía h1→h2→h3;
  `robots` sin bloquear `/cotizacion`; `llms.txt`, `llms-full.txt` y `catalogo.json` sin claims indebidos.
- **Infraestructura**: `.htaccess` (charset, archivos ocultos, caché, cabeceras), workflow con
  lint, typecheck, `check:out`, Node 22 y permisos mínimos, `ftp-debug.yml` eliminado, dependencias
  (`motion`, dropdown-menu, `slugify`) y assets muertos fuera, OG regenerada.
- **Formulario**: señuelo anti-spam, validación de teléfono, `aria-invalid`/`aria-describedby`,
  `role=status`, `data.success`, `mailto` con CRLF.

## 4. Resultados de pruebas

| Prueba | Resultado | Estado |
|---|---|---|
| `npm run lint`, `tsc --noEmit`, `next build` | Sin errores ni avisos (antes: 2 errores, 4 avisos) | Verificado |
| `scripts/check-out.mjs` sobre 185 páginas | Enlaces internos resueltos, canónicos únicos con barra, 1 h1 por página, JSON-LD parseable, sitemap sin redirecciones, catálogo en HTML, sin marcas de terceros ni «0+» | Verificado |
| E2E Playwright (40 comprobaciones) | Filtros, búsqueda, URL, Atrás, tabla/tarjetas, añadir/persistir/editar cantidad, vaciar campo, WhatsApp (`wa.me/18096122020`), lista larga en 5 partes ≤ 3,7 KB codificados, `localStorage` corrupto, menú por teclado, formulario con `mailto`, `tel:`/`mailto:`, 0 errores de consola en 12 rutas, 404 | Verificado |
| axe-core (WCAG 2.2 A/AA + buenas prácticas), 13 rutas × 2 anchos | 0 violaciones (antes de las correcciones: 24) | Verificado |
| Desbordamiento horizontal 390/768/1280 px | Ninguno | Verificado |

## 5. Rendimiento (laboratorio, antes → después)

| Ruta | Rend. móvil | LCP móvil | Rend. escritorio | LCP escritorio | Transferencia |
|---|---|---|---|---|---|
| `/` | 86 → 90 | 4,2 → 3,6 s | 99 → 100 | 0,9 → 0,8 s | 1081 → 630 KB (móvil) |
| `/productos/` | 90 → 91 | 2,8 → 3,5 s | 100 → 100 | 0,7 → 0,8 s | 550 → 450 KB |
| `/productos/papel-higienico/` | 79 → 90 | 4,7 → 3,6 s | 100 → 100 | 0,7 → 0,8 s | 705 → 446 KB |
| `/contacto/` | 90 → 91 | 3,6 → 3,5 s | 100 → 100 | 0,7 → 0,8 s | 1008 → 929 KB (mapa) |

CLS 0 en todas; accesibilidad 100 (antes 97 en contacto); SEO 100 y mejores prácticas 100 en ambas
versiones. `/productos/` empeora 0,7 s de LCP móvil simulado porque ahora el HTML trae las 168 filas
(36 KB comprimido) en lugar de «Cargando…»: es el coste de que buscadores y asistentes lean el
catálogo. INP no es medible en laboratorio.

## 6. Limitaciones y pendientes

**Bloqueado por permisos o dependencias**
- Search Console, analítica y CrUX: sin acceso; no se verificó indexación ni datos de campo.
- Prueba de resultados enriquecidos de Google y `curl` al sitio desplegado: no se despliega sin autorización.
- Reglas `.htaccess` verificadas por lectura y por el destino de cada redirección, no contra Hostinger.

**Pendiente de decisión o dato del cliente** (detalle en `docs/DATOS-PENDIENTES.md`)
- Visto bueno al nuevo diseño; confirmar categorías que se fabrican; siglas internas; notación 12/1;
  SKU a corregir en Odoo; correo/horario/dirección definitivos; número de WhatsApp; clave Web3Forms.
- Fotografía: las imágenes actuales están retocadas con IA; ver `docs/FOTOGRAFIA.md` para las tomas
  necesarias y la solicitud de logotipos en vector y en negativo.
- FTPS/SFTP y HSTS (ver `docs/DEPLOY.md`).

**Recomendado, no implementado**
- Medición de conversiones (clic en WhatsApp, envío de cotización, formulario) con consentimiento.
- Descripciones por producto con datos reales; fotos de las ~135 referencias sin imagen.
- Los `Product` JSON-LD no serán elegibles para fragmentos hasta que haya precio u otro dato válido.

## 7. Evaluación (solo con evidencia)

| Criterio | Peso | Evidencia | Valoración |
|---|---|---|---|
| Identidad y dirección de arte | 20 % | Requiere juicio del cliente y fotografía sin retoque | No evaluable aún |
| UX y claridad comercial | 15 % | Flujos E2E superados; falta prueba con usuarios | Parcial: sin defectos conocidos |
| Coherencia entre páginas | 15 % | Un solo sistema en 12 plantillas; revisión visual en 3 anchos | Sin defectos conocidos |
| SEO técnico y semántico | 15 % | `check:out`, canónicos, JSON-LD, sitemap | Sin defectos conocidos; indexación no verificada |
| Arquitectura, mantenibilidad, seguridad | 15 % | Lint/tipos/build limpios, validación de datos, workflow con controles | Sin defectos conocidos; FTP en claro pendiente |
| Rendimiento y accesibilidad | 10 % | Lighthouse a11y 100, axe 0, perf móvil 90–91 (lab) | Cumple en laboratorio |
| Catálogo y cotización | 10 % | E2E 40/40; 168 filas en HTML | Sin defectos conocidos |

No se asigna una puntuación global: el 20 % de identidad depende de la validación del cliente y de la
fotografía, y no hay evidencia que lo sustituya.

---

# Ronda 2 — ajustes tras revisar la vista previa (octubre 2026)

Diez peticiones del cliente tras ver https://agsupplytic.github.io/ag-supply/. Mediciones en laboratorio.

| # | Petición | Qué se hizo | Estado |
|---|---|---|---|
| 1 | Fuentes poco industriales | Archivo (eje de ancho, 112 %, peso 800) + IBM Plex Sans; Barlow y Source Sans fuera | Verificado (fuentes cargadas en el navegador) |
| 2 | Colores oscuros | Se eliminó el marino: bandas en azul de marca con texto blanco (4,9:1), pie claro | Verificado (axe/Lighthouse contraste 0 fallos) |
| 3 | Bordes puntiagudos | Radios: controles 8 px, tarjetas/fotos 12 px, insignias 6 px, chips 10 px | Verificado (estilos calculados) |
| 4 | Logo con fondo | Sin pastilla ni caja blanca en pie ni Bonche; OG regenerada | Verificado |
| 5 | «Se eliminaron productos» | **No se eliminó ninguno** (168/168, 11/11 HW). Causa real: error de maquetación que dejaba los resultados fuera de vista con pocos resultados + búsqueda sin categoría. Corregidos; chips de categoría con icono; «combo»→12, «hw»→11, «cuberter»→24 | Verificado |
| 6 | Imágenes en el listado | Miniaturas 72 px (33 con foto) + visor accesible (Esc, foco); sin foto, icono de la categoría; `docs/FOTOS-PRODUCTOS.csv` con las 135 que faltan | Verificado; **faltan las fotos** |
| 7 | Secciones muertas | Datos de empresa en franja, tarjetas de categoría con miniaturas, proceso en 5 pasos con foto, bandas azules, mosaicos de mercados, hover y entrada al desplazarse (sin librerías, respeta reduced-motion) | Verificado visualmente |
| 8 | Bonche como Ocean Breeze | Misma composición, fondo claro de la marca, logo original; recorte del producto sin fondo verde | Verificado visualmente |
| 9 | Iconos | Iconos funcionales con un único estilo en categorías, contacto, pasos, origen, valores, filtros, pie | Verificado |
| 10 | Botón de inglés | `/en/` real: 185 páginas, hreflang recíproco, sitemap con ambas, selector EN/ES que conserva la página, WhatsApp y formulario en inglés | Verificado; **traducción pendiente de revisión** |

Pruebas: `npm run verify` (lint, tipos, build, `check:out` con hreflang y `<html lang>`, `check:i18n` sin texto
español en `/en/`), 82 comprobaciones E2E (catálogo ES/EN, visor, cotización ES→EN, mensaje largo, selector
de idioma en 11 tipos de ruta, 404, diseño, formularios, 22 rutas sin errores de consola), axe 0 violaciones
(24 rutas × 2 anchos). Lighthouse (laboratorio): accesibilidad, mejores prácticas y SEO 100; rendimiento escritorio
100, móvil 90–94; CLS 0.

Riesgos: la traducción al inglés es nuestra (revisar términos técnicos); el recorte de Bonche es por
software (sustituir si hay un archivo sin fondo); la animación de entrada usa `animation-timeline`
(sin soporte, el contenido se ve igual); `experimental.globalNotFound` es una opción experimental de Next.

## Ronda 3 — cierre SEO y teléfono

| Cambio | Estado |
|---|---|
| Medición de conversiones (`lib/analytics.ts`, `components/site/analytics.tsx`, `docs/MEDICION.md`): apagada sin ID; con ID solo mide a quien acepta; 6 eventos sin datos personales | Verificado en local con Playwright (17 comprobaciones, ID de prueba y peticiones a Google interceptadas); axe 0 violaciones con el aviso. **Pendiente del cliente:** ID de GA4, texto del aviso y política de privacidad |
| Fichas delgadas con `noindex` y fuera del sitemap (`lib/content/thin.ts`): 55 de 168; 113 indexables | Verificado: `check:out` comprueba noindex ⇔ regla y sitemap (258 URLs) |
| Guía de Search Console (`docs/GUIA-SEARCH-CONSOLE.md`) | Redactada; **no ejecutada** (requiere el sitio publicado y acceso al DNS) |
| Teléfono: solo `809-612-2020` (se retiró `809-778-9119` de contacto, FAQ, JSON-LD y `llms.txt`); los de distribuidores se mantienen | Verificado: sin rastro en `out/` |

## Ronda 4 — auditoría SEO y nombre del sitio (26 oct 2026)

Criterios que ahora vigila `npm run check:out` en todas las páginas indexables: título ≤ 60 caracteres sin repetir la marca, descripción de 110 a 160, texto alternativo en todas las imágenes y al menos 300 palabras visibles.

| Cambio | Resultado medido (local) |
|---|---|
| Títulos: 28 páginas pasaban de 60 caracteres (inicio con 67); duplicaban «AG Supply» en marca y FAQ | Máximo 60, mediana 46 |
| Descripciones: 17 con menos de 120 y 5 con más de 160 | Mínimo 127, máximo 159 |
| Texto: 131 páginas con menos de 300 palabras (fichas, FAQ, contacto, planta, categorías) | Mínimo 312, mediana 459. Texto añadido solo con datos reales (categoría, origen, presentación, pasos de cotización, horario) |
| Imágenes sin alt (miniaturas del catálogo) | 0 |
| Nombre del sitio en Google: `WebSite` con `name` «AG Supply» y `alternateName`, ahora solo en la portada de cada idioma; ícono 192 px y `favicon.ico` | Pendiente: Google debe volver a rastrear la portada; la fecha no depende de nosotros |
| Peso: las miniaturas descargaban la foto completa (hasta 67 KB cada una); ahora variantes de 128 a 1080 px (`npm run images`, corre en prebuild) | Inicio móvil: 689 KB → 444 KB. HTML del catálogo: 636 → 550 KB |
| HSTS (`max-age=31536000`, sin includeSubDomains ni preload) | Se activa al desplegar `.htaccess` |
| Lighthouse móvil local: rendimiento 92–94; accesibilidad, buenas prácticas y SEO 100. axe: 0 violaciones; E2E: 82/82 | La puntuación de rendimiento varía de una corrida a otra (70 a 92 sobre producción con el mismo código) |

No cambiable desde el código: ID de Google Analytics, perfil de Google Maps, enlaces a más redes sociales, dirección completa. Varios auditores penalizan su ausencia.

### Ronda 4b — búsquedas por tipo de producto («papel toalla», «servilletas dinner»…)

- **Colecciones** (`lib/collections.ts`, rutas en `lib/i18n/routes.ts`): 9 páginas indexables por tipo, en español e inglés, en `/productos/<slug>/`: papel higiénico jumbo, papel toalla kraft, papel toalla de cocina, servilletas dinner, cocktail, kraft y para dispensador, combos de cubiertos desechables y cubertería desechable suelta. Cada una agrupa referencias reales por una regla sobre nombre o subcategoría; se publica solo con 3 o más. El texto usa datos calculados de esos productos (presentaciones, capas, colores).
- **Enlazado interno:** cada categoría lista sus tipos; cada ficha enlaza a sus colecciones; cada colección enlaza a las hermanas y a la categoría.
- **Categoría «Papel toalla»** (antes «Toallas de papel»), el término que usan los clientes y que el propio catálogo trae en `paperType`.
- **Títulos de ficha** con su categoría cuando caben en 60 caracteres: «Toalla Center Pull 6/1 · Papel toalla — AG Supply».
- Sitemap: 258 → 276 URLs. `check:out`, E2E (82/82 + 9 nuevas), axe 0 violaciones.
- **Límite:** esto mejora que Google entienda qué ofrece cada página. El puesto para búsquedas genéricas lo deciden el rastreo de Google, la competencia y la autoridad del dominio (enlaces externos, perfil de Google Maps); no se garantiza.

### Ronda 4c — informe de SEOptimer sobre producción (26 oct 2026, versión anterior)

Resultado: «su página se puede optimizar», 10 recomendaciones. Posicionamiento, GEO y usabilidad salieron bien; PageSpeed móvil bueno (LCP 2,3 s, TBT 0,02 s, CLS 0,049).

| Recomendación | Estado |
|---|---|
| Construir enlaces (alta): 1 solo backlink, nofollow, de un sitio de dominios | Fuera del código: directorios, Google Maps, enlaces de distribuidores y proveedores |
| Acortar el título (67 caracteres) | Hecho en la rama: ahora 54 («AG Supply — Papel higiénico, papel toalla y servilletas») |
| Recursos que bloquean el renderizado (CSS de 10 KB) | Probado `inlineCss`: engorda el HTML de 184 a 297 KB. Descartado |
| Optimizar imágenes (miniaturas de 66 KB descargadas a 128 px) | Hecho en la rama: variantes reducidas (3 a 4 KB) |
| Herramienta de analítica | Código listo y apagado; falta el ID de GA4 |
| Esquema de negocio local | Pendiente de dirección completa (calle y número) |
| Perfiles de YouTube, X, Facebook y LinkedIn | Solo si el cliente los crea; no se enlazan perfiles que no existen |
| Evitar múltiples redirecciones | `http://www…` pasa por 2 saltos (HTTPS de Hostinger y luego www→raíz). Se evita desactivando «Forzar HTTPS» en hPanel y dejando que `.htaccess` haga ambos; no se tocó |
