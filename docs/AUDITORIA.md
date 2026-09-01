# Auditoría del sitio AG Supply

Fecha: septiembre 2026. Rama analizada: `main` (Next.js 16.3.3, App Router, Tailwind v4).
Método: mapeo completo del repo + build de producción + revisión página por página.

> **Nota sobre la premisa del encargo.** El brief pedía migrar de Next.js a "HTML puro para
> máximo SEO". El sitio **ya se sirve como HTML completo**: cada ruta se prerenderiza y el
> markup íntegro llega en la primera respuesta (verificado en el build: 191 páginas estáticas).
> No hay render solo-cliente que perjudique la indexación. La ganancia SEO de reescribir a mano
> sobre un **export estático** (`output: 'export'`, ya aplicado en esta ronda) es esencialmente
> nula. El brief también contenía errores de hecho: dice "Next 14" (es 16), "Zustand" (es React
> Context), "Sanity CMS conectado" (está diferido; el contenido es `content/*.json`).

---

## 1. Resumen ejecutivo

| Aspecto | Nota /10 | Comentario |
|---|---:|---|
| Arquitectura de código | 8 | Adaptador de contenido con firma estable, tokens centralizados, TypeScript estricto. Limpio. |
| Sistema visual | 7 | Paleta coherente, tipografía con escala `clamp()`, ritmo de secciones trabajado (ronda 12). Baja por depender de placeholders. |
| UX de navegación y flujos | 7 | Mega-menú, filtro de catálogo con estado en URL, cotización→WhatsApp funcional de punta a punta. |
| Contenido | 4 | Sin FAQ (se añade en esta ronda), sin testimonios, sin certificaciones, sin equipo. 80 % del catálogo sin foto. |
| SEO técnico | 6 → 8 | Base sólida (sitemap, robots, canonical, JSON-LD Organization). Faltaba schema de producto/breadcrumb/FAQ, metadata propia de home, `llms.txt` — corregido en esta ronda. |
| Rendimiento | 8 | Estático, fuentes self-hosted, imágenes `.webp`. Sin datos Lighthouse formales todavía. |
| Accesibilidad | 7 | Auditoría de contraste WCAG hecha (ronda 5), foco visible, `prefers-reduced-motion`. Falta revisar el catálogo con lector de pantalla. |

**Problemas raíz (2):**
1. **Contenido pre-lanzamiento.** 135 de 168 productos sin foto (`placeholderImage: true`, `images: []`);
   132 de 168 son marca "genérico". Faltan 5 fotos de planta y 1 de la marca Bonche. Esto arrastra
   la nota visual y de contenido, no el código.
2. **Superficie SEO/GEO incompleta** (resuelto esta ronda): sin structured data de producto ni
   `llms.txt`, home sin metadata propia.

---

## 2. Estructura del proyecto — crítico vs opcional

**Crítico (no tocar sin cuidado):**
- `lib/content/{index,local,types}.ts` — única puerta al contenido. Todo el sitio depende de su firma.
- `lib/site-config.ts` — fuente única de teléfonos, dirección, horario, misión/visión, distribuidores.
- `app/globals.css` — **único lugar con valores hex**. `@theme` + utilidades.
- `lib/quote/context.tsx` + `build-message.ts` — el carrito entero (Context + localStorage).
- `app/layout.tsx` — fuentes, providers, JSON-LD, header/footer.
- `next.config.ts` — ahora fija `output: 'export'`.

**Opcional / de apoyo:**
- `sanity/` + `lib/content/sanity.ts` + `scripts/seed-sanity.mjs` — inerte hasta `CONTENT_SOURCE=sanity`.
- `scripts/*` — pipeline de importación de Odoo y generadores de placeholders/iconos. No corren en build.
- `components/site/pending-content.tsx` — solo en `/nosotros/planta`.

**Eliminado esta ronda por quedar huérfano:** `components/site/{brand-card,brand-backdrop,section-divider}.tsx`,
`components/site/language-toggle.tsx`, `app/api/revalidate/route.ts`.

---

## 3. Auditoría visual

| Sub-aspecto | Nota | Hallazgo |
|---|---:|---|
| Paleta | 8 | Azul de marca `#1C75BC` consistente; navy solo para texto/hover. Ronda 12 añadió paleta verde/naranja propia para Bonche (`--color-bonche*`), así OB y Bonche se diferencian de verdad. |
| Tipografía | 8 | Montserrat (títulos) + Inter (cuerpo), escala `clamp()` con `letter-spacing` negativo en H1/H2. Pesos diferenciados (500–800). |
| Espaciado | 7 | Sigue una escala coherente (`py-16 md:py-24` en secciones, gaps de 4/5/6). No es un grid 8px estricto pero es consistente. |
| Imágenes | 3 | **6 fotos reales** (hero + secciones). **135/168 fichas sin foto.** Las 8 `cat-*.webp` son archivos sintéticos idénticos de 6.680 B sin usar. Ver `docs/IMAGES-NEEDED.md`. |
| Componentes | 8 | Poca duplicación tras la ronda 12 (`PageHero` unificó 7 headers). Nomenclatura clara (`site/` vs `ui/`). |
| Animación | 8 | `Reveal` (scroll) + `CountUp` + carrusel con Ken Burns; todo respeta `prefers-reduced-motion`. Contenida, no sobrecargada. |

---

## 4. Auditoría UX por página

| Página | Nota | Fricción / observación |
|---|---:|---|
| Inicio | 8 | CTAs jerarquizados (catálogo primario, WhatsApp secundario). Ronda 12 rompió las secciones blancas seguidas. |
| `/productos` | 8 | Filtro con estado en URL (compartible), facetas que se ocultan si tienen ≤1 valor, conteo de resultados, estado vacío con "limpiar". Bien resuelto. Esta ronda añade el bloque de info operativa. |
| Ficha de producto | 8 | Reestructurada en la ronda 12 ("giro 360"): specs agrupadas, tarjeta de acción flotante, relacionados. Sin foto en el 80 % de los casos. |
| `/cotizacion` | 8 | Editable (cantidad, nota), "ver el mensaje", envío a `wa.me`. Nada se guarda en servidor. `noindex`, correcto. |
| `/ocean-breeze` · `/bonche` | 7 | Ahora diferenciadas por paleta (azul / verde). Bonche espera su foto de header. |
| `/nosotros` | 5 | Historia (2007→2014→hoy), cifras de planta, misión/visión/valores. **Sin equipo, sin liderazgo, sin lista de clientes.** |
| `/nosotros/planta` | 4 | 5 etapas descritas, todas con foto de prueba. Sin lista de equipos ni cifras de línea. |
| `/contacto` | 7 | 4 tarjetas + info + formulario + mapa + distribuidores. Formulario era solo `mailto:`; esta ronda añade envío directo opcional (Web3Forms) con `mailto:` de respaldo. |
| `/faq` | — | **Nueva en esta ronda.** 14 preguntas desde hechos verificables + schema `FAQPage`. |

---

## 5. Auditoría de contenido — lo que falta

| Elemento | Estado | Prioridad |
|---|---|---|
| Propuesta de valor | ✅ Clara ("fabricante, no revendedor"; dos marcas por público) | — |
| Descripciones de producto | ⚠️ Orientadas a specs, no a beneficios. `keySpecs` cortos. | P2 |
| Info operacional (MOQ, plazos, cobertura) | ⚠️ Ahora hay un bloque en `/productos` con lo verificable. MOQ y plazos concretos **no existen como dato** → pendiente del cliente. | P1 |
| Social proof (testimonios, logos, casos) | ❌ Ninguno | P1 |
| Certificaciones (ISO/HACCP/FSC…) | ❌ Ninguna. `ProductSpecs.compliance` existe pero vacío en los 168 productos. | P1 (si aplican) |
| FAQ | ✅ Añadida esta ronda | — |
| Equipo / liderazgo en Nosotros | ❌ | P2 |
| Fotografía real | ❌ 6 de ~15 superficies; 33 de 168 fichas | P0 (bloquea lanzamiento visual) |

Nada de lo anterior se inventó: los datos que el sitio no tiene (MOQ exacto, plazos, certificaciones,
nombres del equipo) quedan como pendientes de que el cliente los aporte.

---

## 6. Auditoría técnica SEO / GEO

| Check | Antes | Ahora (esta ronda) |
|---|---|---|
| HTML renderizado en el servidor | ✅ (191 páginas) | ✅ ahora export 100 % estático (`out/`) |
| `<title>` único por página | ⚠️ Home usaba el default del layout | ✅ Home con título propio con keywords |
| `description` única | ⚠️ Home = descripción del layout | ✅ |
| Canonical | ✅ Todas | ✅ |
| Open Graph por página | ⚠️ Solo las 2 rutas dinámicas; 6 subpáginas heredaban el OG del layout (título social ≠ título de página) | ✅ Helper `ogFor()` en las 8 |
| `hreflang` | ❌ (había toggle ES/EN sin traducción real) | N/A — sitio pasa a **solo español** |
| JSON-LD | ⚠️ Solo `Organization`+`LocalBusiness` site-wide | ✅ + `WebSite`, `Product`, `BreadcrumbList`, `FAQPage` |
| `sitemap.xml` / `robots.txt` | ✅ | ✅ (+ `/faq`, − `/cotizacion` del sitemap) |
| `llms.txt` (crawlers de IA) | ❌ | ✅ `public/llms.txt` |
| OG image por producto | ❌ (los 135 productos sin foto no la pueblan) | Sin cambio — depende de fotografía |

---

## 7. Nota sobre "competencia" (Abastra / Concaribe)

El brief pide comparar contra **Abastra (4/10)** y **Concaribe (3/10)**. Sin embargo, ambas figuran
en `lib/site-config.ts` (`distributors`) como **distribuidores autorizados de AG Supply**:
Concaribe en Santiago, Abastra en Santo Domingo. No son competidores head-to-head de una
convertidora — son sus revendedores. El encuadre competitivo del brief está mal dirigido; si el
objetivo es posicionar a AG Supply frente a otras **convertidoras** de la región, hace falta
identificar ésas primero.
