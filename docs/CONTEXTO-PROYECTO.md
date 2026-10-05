# Contexto del proyecto (para continuar desde otro PC)

Este archivo es una copia de la memoria de Claude Code de este proyecto
(`~/.claude/projects/<ruta-del-proyecto>/memory/agsupply-site.md`), que vive solo
en el PC original y no viaja con git. Al abrir el repo en otro equipo, pidele a
Claude que lea este archivo, o copialo a su carpeta de memoria.

**No incluido a proposito (secretos):** `.env*` — recrearlo con `.env.example`
(`ODOO_URL`, `ODOO_DB`, `ODOO_USER`, `ODOO_API_KEY`; ver `docs/DATA-IMPORT.md`).
Tampoco `scripts/odoo-raw.json` (se regenera con `scripts/import-from-odoo.mjs`).

**Arranque en el PC nuevo:** `git clone https://github.com/agsupplytic/ag-supply`,
`npm install`, `npm run dev` (puerto 3000; ver `.claude/launch.json`). Ojo con
`AGENTS.md`: esta version de Next.js tiene cambios incompatibles, leer
`node_modules/next/dist/docs/` antes de tocar APIs de Next.

**Nota de vigencia:** la memoria de abajo se escribio hasta la ronda 15 (3-sep-2026).
Las rondas posteriores estan en `git log`; las ultimas fueron: integrar fotografia
real (planta, Bonche, headers, categorias), tarjetas de marca sin placa blanca,
logos de marca nitidos + buscador en catalogo, hero de marca con logo grande, y
BrandSplit con foto de producto real. Pasada de consistencia (commit `37c4395`):
prop `body` en `PageHero`, FAB de WhatsApp oculto mientras el hero es visible,
copy "8 categorias" en el home, "Bio" -> "Bonche" en papel higienico, y loader de
imagen con `width`. Verificar contra el codigo antes de dar por cierto algo de abajo.

---


`C:\Users\judit\Desktop\AG SITIO` is the AG Supply SRL institutional B2B site, built from scratch
2026-08-28. Stack: Next.js 16 (App Router) + TypeScript + Tailwind v4 (brand tokens in
`@theme` in `app/globals.css` — the only place hex lives), Radix primitives + lucide-react,
`sonner` toasts. For Vercel.

**Content pipeline**: product data comes from Odoo (`product.template`, MCP server `odoo-agsupply`).
`scripts/import-from-odoo.mjs` (JSON-RPC, needs ODOO_* env) → `scripts/odoo-raw.json` →
`scripts/normalize-odoo.mjs` (all curation heuristics: exclude/classify/brand/spec-parsing) →
`content/{products,categories,brands}.json` (168 products, 8 categories, 33 with real photos).
`scripts/extract-odoo-images.mjs` decodes Odoo base64 images to `public/images/products/odoo-<id>.webp`.
The site reads content only via `lib/content` (adapter `local` today; `sanity` ready behind
`CONTENT_SOURCE=sanity`).

**Quote flow**: no e-commerce. `lib/quote/context.tsx` (React Context + localStorage, `QuoteItem`
stays `{slug,name,brand,qty,note?}` — no image stored). `/cotizacion` = server page that fetches
`getProducts()` and passes a `slug → {image,placeholderImage,category,keySpecs,sku}` index to the
client `components/site/quote-view.tsx`, so item cards show real thumbnails + specs even for old
carts. Layout: blue-gradient header band, 2-col (item cards left / sticky "Resumen" panel right with
qty totals + WhatsApp send + "Ver el mensaje"). `buildWhatsAppMessage` → `wa.me/18096122020?text=`
(format unchanged). Verified end-to-end.

**Real images (round 8-9)**: client delivered 6 real section photos → `public/images/placeholders/`
`hero-1/2/3.webp`, `section-manufactura/nosotros/cta.webp` (sources in `C:\Users\judit\Downloads\Sitio Web AG\*.webp.png`).
`lib/real-images.ts` `REAL` set → `Figure`/`BackgroundCarousel` hide the "Imagen de prueba" badge for
those. **`scripts/gen-placeholders.mjs` no longer lists hero-*/section-*/brand-* jobs** — running it
only regenerates planta-*/cat-*/producto and won't clobber the real photos. Placeholders no longer
carry a blueprint grid. Still placeholder: `planta-1..5`, `cat-*`, `producto`, ~135 Odoo product photos.

**Brand assets are LOGOS, not photos**: client's `brand-ocean-breeze`/`brand-bonche` files were the
Ocean Breeze wordmark and "Bonche Servilletas" logo on white → moved to
`public/images/brand/{ocean-breeze,bonche}-logo.webp` and shown AS logos via
`components/site/brand-card.tsx` (`BrandCard`, exports `BRAND_LOGO`): light tinted panel + white
plate + `object-contain` logo. Used on `/` , `/nosotros`, mega-menu, and the `/ocean-breeze` +
`/bonche` heros (`brand-landing.tsx` — no more dark photo-overlay hero). Favicon: `scripts/gen-icons.mjs`
makes `app/icon.png` (rounded-corner squircle) + `app/apple-icon.png` from `public/images/brand/ag-monogram.png`.

**Round 15 — GitHub Pages en vivo**. `https://agsupplytic.github.io/ag-supply/` no cargaba: (1)
Pages estaba en `build_type: "legacy"` sirviendo la rama `main` cruda (código fuente), no el
workflow — cambiado a `workflow` vía `gh api -X PUT repos/agsupplytic/ag-supply/pages -f
build_type=workflow`; (2) faltaba el prefijo de subruta `/ag-supply/` → assets 404. Fix:
`next.config.ts` añade `basePath`/`assetPrefix` condicionales a `process.env.NEXT_PUBLIC_BASE_PATH`
(vacío = raíz, para el futuro `agsupply.com.do`; `/ag-supply` en Pages). `next/image` con
`unoptimized` NO antepone el basePath al `src` → se reemplazó `images.unoptimized` por un loader
propio `lib/image-loader.ts` (`{loader:"custom", loaderFile:"./lib/image-loader.ts"}`) que sí lo
antepone. El `<img>` crudo de miniaturas en la ficha de producto también se prefijó a mano.
`.github/workflows/deploy.yml`: `env: NEXT_PUBLIC_BASE_PATH: /ag-supply` + `touch out/.nojekyll`.
Deploy verde (build+deploy jobs OK), sitio verificado en vivo con estilos, navegación y FAQ.
**Para pasar a dominio propio**: quitar la línea `NEXT_PUBLIC_BASE_PATH` del workflow + añadir
`public/CNAME` con `agsupply.com.do` + DNS. HEAD = `36ad87c`. En Git Bash Windows, para builds
locales con basePath: `MSYS_NO_PATHCONV=1 NEXT_PUBLIC_BASE_PATH=/ag-supply npx next build`.

**Round 14b — "usa impeccable en el sitio completo"**: ran `detect.mjs` (mechanical) across the
whole `app/`+`components/` tree — 0 findings. Manual craft-floor sweep found what the detector
can't: a SECOND icon-chip style (`bg-brand-blue-50` + blue icon) competing with `.panel-icon`
(solid blue + white icon) from round 14a, still in `/contacto` (4 contact cards + 4 info tiles),
`quote-view.tsx` empty state, `/nosotros` (timeline number, conversion-step number),
`app/page.tsx` trust strip, product-detail manufacturer strip. All converted to `.panel-icon`.
Grepped clean for gradient-text, colored border-l/r, stray font-mono, decorative backdrop-blur —
none found elsewhere. Left alone on purpose: the mega-menu category chip (light→solid-on-hover is
an interaction affordance, not a static style clash) and the brand mini-logo chip (houses a raster
logo, needs neutral white). Commit `88d5d24`.

**Round 14 — panel system unified + brand cards rebuilt (via `impeccable` skill)**. User: "algunas
secciones tienen glassmorfismo, otras simple y aburrido... todo debe estar bajo la misma estética.
Además las tarjetas [de marca] aún están feísimas." Ran `impeccable`'s craft-floor checklist across
the whole site (not just the flagged spot) — it names both complaints as named anti-patterns:
"glass and blur as decoration" and "colored border-left on cards". Fixed both, everywhere, not just
where pointed: new `.panel` / `.panel-quiet` / `.panel-icon` classes in `app/globals.css` (`@layer
components`) are now the ONE card recipe — `.panel` = light sections (real shadow, no border-left
ever), `.panel-quiet` = translucent tint on color/photo bands (`inset ring`, **no `backdrop-blur`**
— that was the actual bug, in exactly 3 spots: `app/page.tsx` why-us pillars, `app/nosotros/page.tsx`
plant-band stats, `components/site/distributors.tsx`). Swept onto Nosotros (mission/vision — killed
the `border-l-4 border-l-brand-blue` side-tab the design hook flagged earlier — values, planta
stages), `spec-groups.tsx`, `category-card.tsx`, `operational-info.tsx`. **Brand nav cards, 6th and
(hopefully) final iteration**: stopped treating them as a card at all — new
`components/site/brand-split.tsx` is a full-bleed edge-to-edge split band (`grid md:grid-cols-2`),
each half full brand-color (`bg-brand-gradient` / `bg-bonche-gradient`) with the logo crisp on a
white inset plate (`/images/brand/{slug}-plate.webp`) top-left and bold headline/tag/body/CTA
bottom. Replaces `brand-feature-card.tsx` (deleted) on Inicio + Nosotros. Impeccable's mechanical
detector (`scripts/detect.mjs`) returns 0 findings on all touched files. Commit `fc755d7`.

**Round 13 — export estático + SEO/GEO + contenido**. El sitio ahora compila a HTML estático:
`next.config.ts` tiene `output: "export"` + `images: { unoptimized: true }` + `trailingSlash: true`
→ `npm run build` escribe `out/` con `.html` reales por ruta (191 páginas, cero servidor). El
único bloqueante para esto era `cookies()` en `lib/i18n.ts`, así que **el sitio pasó a solo
español**: `lib/i18n.ts` ya no importa `next/headers`, no hay `getLocale`/`getT` async ni
diccionario `en`; exporta `makeT` + un `t = makeT("es")` constante. Borrados
`components/site/language-toggle.tsx`, `app/api/revalidate/route.ts` (webhook Sanity inerte,
incompatible con export), y los huérfanos `brand-card.tsx` / `brand-backdrop.tsx` /
`section-divider.tsx`. `app/robots.ts` y `app/sitemap.ts` llevan `export const dynamic =
"force-static"`. **SEO:** `components/site/json-ld.tsx` reescrito con `JsonLd` helper + emisores
`WebSiteJsonLd` (en layout), `ProductJsonLd` + `BreadcrumbJsonLd` (en la ficha y la categoría),
`FaqJsonLd` (en /faq) — antes solo había Organization+LocalBusiness. Nuevo `lib/seo.ts` con
`ogFor(title, desc)` → Open Graph propio en las 8 páginas estáticas (antes heredaban el OG del
layout). Home con `title: { absolute: "AG Supply — Fabricante de papel higiénico..." }` propio.
Nuevo `public/llms.txt`. Nueva **`app/faq/page.tsx`** (14 preguntas SOLO de hechos verificables de
`site-config.ts`, cero inventado) + `components/site/faq-accordion.tsx` (usa el `components/ui/accordion.tsx`
que estaba sin usar); enlazada en header (`NAV` de `header-nav.tsx`) y footer. Nuevo
`components/site/operational-info.tsx` (pedido/plazo/cobertura/formato, sin precios) en `/productos`.
`components/site/contact-form.tsx` reescrito: POST opcional a Web3Forms vía
`NEXT_PUBLIC_WEB3FORMS_KEY` con `mailto:` de respaldo; quitada la nota "próximamente". Nuevo
`.github/workflows/deploy.yml` (build → GitHub Pages). Docs nuevos:
`docs/{AUDITORIA,PLAN-MEJORAS,MIGRACION-ESTATICA}.md`; `docs/DEPLOY.md` actualizado.
**El "prompt maestro" pedía reescribir a HTML puro a mano — se rechazó**: el sitio ya servía HTML
completo, el export estático da el mismo resultado SEO a 1/20 del coste. Abastra y Concaribe (que
el prompt llamaba "competidores") son distribuidores autorizados de AG Supply, no competidores.
Sigue pendiente: `gh auth login` + `git push` del usuario. HEAD = commit `17b1e34`.

**Round 12 — headers + brand palette + publish**. Git repo initialised, remote
`https://github.com/agsupplytic/ag-supply` (push needs `gh auth login` by the user — `gh` 2.98
installed). New `components/site/page-hero.tsx` = the single header for the whole site (replaced 7
hand-rolled `bg-brand-gradient` copies incl. the inline `PageHeader` in `app/productos/page.tsx`
and the header inside `quote-view.tsx`); `/productos`, `/productos/[categoria]`, `/contacto`,
`/cotizacion`, `/ocean-breeze` now use a real photo + `.hero-scrim-deep`. `/bonche` hero + the
product-detail header stay flat on purpose. `.hero-scrim-deep` and `--gradient-brand`/
`--gradient-bonche` were SOFTENED (client: "gradientes menos intensos"). New Bonche palette tokens
in `@theme`: `--color-bonche #3f8f3a` / `-dark #245f22` / `-100` / `-50` / `-accent #f2941d` (orange)
/ `--gradient-bonche` — used ONLY on Bonche surfaces (`/bonche`, the Bonche card) so the two brands
read differently; Ocean Breeze keeps the AG blue family. `brand-feature-card.tsx` rebuilt: white
logo plate on top + a LIGHT tinted foot (`bg-brand-blue-50` / `bg-bonche-50`) with a brand rule,
ink title, brand-coloured CTA — no saturated band. New `components/site/count-up.tsx` (scroll-in
number count, respects reduced-motion) on the home trust strip + `/nosotros` hero stats. `<Reveal>`
added across `/nosotros` and `brand-landing.tsx`. Revived "dead" sections: home categories →
`bg-brand-blue-50`, "cómo cotizar" → carded on `bg-surface`, contact closer → full-bleed
`section-cta` photo band; `/nosotros` plant band → full-bleed `section-manufactura` photo, values →
`bg-surface`.

**Brand logos CANNOT be de-backgrounded** (recurring ask — tried twice this session): both
`*-logo.webp` are opaque, and WHITE is a design colour in each (the "BONCHE" letters are white,
Ocean Breeze's script has white highlights + a pale-blue wave). Luminance-threshold keying AND
edge flood-fill both destroy the logo (holes through letters, black blobs). `scripts/gen-brand-marks.mjs`
now only makes `public/images/brand/{slug}-plate.webp` = the logo trimmed to content and re-framed
on clean white, so it fills its box. To put a logo directly on colour you need a hand-made
transparent PNG — logged in `docs/IMAGES-NEEDED.md`. Also missing: `brand-bonche-hero.webp`
(1920×1080, for the `/bonche` header — currently flat green + a dev filename badge) and `planta-1..5`.

**Deferred / not done** (see `docs/PENDING-CONTENT.md`, `docs/DEPLOY.md`): Sanity project not created
(schema in `sanity/schemas/`, `sanity.config.ts`, excluded from tsconfig; `scripts/seed-sanity.mjs`
ready). No real Vercel/Sanity deploy. Contact form uses `mailto:` (no backend provider). Planta page
uses placeholder photos. Mission/vision confirmed; Santo Domingo branch still `<PendingContent>`.

**Copy rules enforced**: never "distribuidor" for AG Supply itself (use convertidora/fabricante/
revendedor) — BUT the client explicitly wants a "Distribuidores autorizados" section on /contacto
(their reseller partners, data in `lib/site-config.ts` `distributors`). Never "24 horas". No prices.
No emojis. Slogan "Siente la limpieza" in every hero + footer.

**Confirmed company facts** (from client NotebookLM, in `lib/site-config.ts`): founded 2007 as
"A.G. Office Supply, S.R.L." (office supplies) → pivoted 2014 to paper conversion + renamed
"A.G. Supply, S.R.L."; plant in **Sector Las Palomas, Santiago** (NOT Licey al Medio); 2000 m²
land / 1000 m² built (200 office + 800 production); 400 tons paper/month; 500m from autopista,
800m from circunvalación norte, 3km from Aeropuerto del Cibao. Do NOT publish capital-social /
economic figures (client said so). Real misión/visión/6 valores/propuesta de valor and the 8
category + 2 brand descriptions are all in `lib/site-config.ts` + `scripts/normalize-odoo.mjs`
(`CATEGORIES`/`BRANDS` now have `short` + `description`).

**Categories (8)**: papel-higienico, toallas, servilletas, interfoliados, facial, jabon,
**desechables** (fundas de basura + papel encerado + bandejas/envases; icon Trash2), **cuberteria**
(cutlery + subcategory "Combos"; icon Utensils). "combos" is NOT a top-level category any more —
it's `subcategory: "Combos"` under cuberteria, filterable via `?sub=` on `/productos/cuberteria`
(the "Tipo" chip group in `catalog.tsx`). `Category` type has optional `subcategories: string[]`.

**Logo files** (client is picky — 3 rounds): `public/images/brand/agsupply-header.png` = the ORIGINAL
`Logo_1.png` (white bg, wordmark+swoosh, NO tagline) → header only. `public/images/brand/agsupply-logo.png`
= transparent PNG WITH "Siente la Limpieza !!!" script → footer + OG + json-ld. Logo component:
`variant: "header" | "full"`, never stretched/cropped (fixed natural ratios). Footer is now a
**light** surface (`bg-surface`) with a blue-gradient accent CTA band on top, so the transparent
full logo sits directly with no white box.

**Contrast/UX audit** (skill `anthropic-skills:uiux-contrast-auditor`, done): tokens in
`app/globals.css` are WCAG-tuned — `--color-body #535353` (AAA), `--color-muted #6a6a6a`,
`.label-eyebrow` = `brand-blue-dark`, `--color-control-border #8b9199` (form/chip borders, 3:1),
`--gradient-brand` starts `#1765a0`, `--gradient-red` `#c81a22→#8f0f16`, `--color-brand-red-900
#8f0f16`. `:focus-visible` = white outline + blue box-shadow. Button `outline/ghost/link` + footer
links = `brand-blue-dark`.

**WhatsApp green (round 9, client wanted the real green back)**: `--color-whatsapp #25d366` is the
button FILL; text/icon use `--color-whatsapp-ink #0b3d1f` (deep green, ~8:1 on the green) so it
still passes contrast. `--color-whatsapp-hover #1fb257`. The old `--color-whatsapp-cta/-dark` tokens
are gone.

**Round 10-11 — REVERTED to the original design.** The user rejected the round-9 flattening
AND a round-10 "navy/bold" redesign as "aburrido/horrible", then pointed at
`C:\Users\judit\Desktop\AG SITIO - copia\` (a snapshot of the pre-round-9 site) and said "quiero
que se parezca a esto". Restored from that copy: `app/globals.css`, all page files, and the
design components (`section.tsx`, `swoosh.tsx`, `category-card.tsx`, `distributors.tsx`,
`site-footer.tsx`, `brand-backdrop.tsx`, `header-nav.tsx`, `quote-view.tsx`, `brand-landing.tsx`,
`components/ui/{button,badge}.tsx`). The original look = bright brand-blue overlays + uppercase
`.label-eyebrow` labels + swoosh motif + a red "why us" band + `bg-brand-blue-50` trust strip +
photo-overlay cards. **That copy is the visual source of truth — do not "improve" the aesthetic
unprompted.** Kept on top of the restore: correct email `agsupplycxc@gmail.com`, `siteConfig.hours`
+ JSON-LD openingHours, WhatsApp `#25D366` fill + `--color-whatsapp-ink` text, rounded favicon
(`app/icon.png`/`apple-icon.png`), `/nosotros` hero as a single fixed image, contacto "dirección
exacta" alert removed, product-card/product-image without the swoosh/watermark over photos, and
the brand cards/heros/mega-menu adapted to show the **brand LOGOS** (Ocean Breeze / Bonche
wordmarks on a `bg-brand-blue-50` plate, not photos) since the client only supplied logos.

**(Superseded) Round 9 — full per-page section redesign** ("parecía muy de IA"): `SectionHeading`
(`components/site/section.tsx`) gained `variant="stacked"|"kicker"|"aside"` + optional `index` (2-digit
kicker number). Rule applied to every page: at most ONE full-bleed color band per page (rest are
`surface`/white/`bg-brand-blue-50` tint), card-grid monotony broken with `divide-y` list rows /
1px-gap grids / image-splits, fewer + varied swooshes. `components/site/swoosh.tsx` `field` now takes
`placement="top-right"|"bottom-left"|"wide-center"|"corner"` (different `preserveAspectRatio`/transform)
so sections don't all show the same art; ribbon paths were redrawn wider apart with a fatter rounded
left cap. `BrandBackdrop` lost its CSS grid overlay. `/nosotros` hero is now a FIXED single image
(`section-nosotros.webp`, no rotation); `/` hero still rotates hero-1/2/3. `Distributors` is now a
light `bg-surface` section (was a blue band). `/contacto` restructured: hero → 4 cards → balanced
info+form 2-col → full-width map → Distributors (killed the empty gap + the "dirección exacta" amber
alert). Email is `agsupplycxc@gmail.com`; `siteConfig.hours` = Lun–Vie 8:00 a.m.–5:00 p.m. (also in
`OrganizationJsonLd` `openingHoursSpecification`).

**Design system** (after client feedback round 2): brand blue kept bright (`#1c75bc` gradient
`--gradient-brand`, `.bg-brand-gradient`), dark navy only for text/hover. `components/site/swoosh.tsx`
= proper tapered dual ribbon (red thick + blue thin, filled paths, ~18°) like the logo — variants
`mark` (contained badge), `field` (full-bleed section accent), `draw` (hover). `motion` (framer)
installed for `BackgroundCarousel` (cross-fading section bg images) + `Reveal` (fail-safe scroll
reveal). All image slots use generated labelled placeholders in `public/images/placeholders/`
(`scripts/gen-placeholders.mjs`, "AQUÍ VA UNA IMAGEN" + "Imagen de prueba" badge via `Figure`/
`figure-note`) — real photos still pending. Fonts Montserrat (headings) + Inter (body). Logo at
`public/images/brand/agsupply-logo.png` (no alpha — white card on colored bg).
