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
