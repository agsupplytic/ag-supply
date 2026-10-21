# Sistema de diseño

Todo valor de color, tipografía, radio y sombra vive en `app/globals.css` (`@theme`). Ningún
componente lleva hex.

## Dirección

Industrial e institucional, con color de marca: bandas azules del logotipo, fondos planos,
rótulos en mayúsculas de peso alto, tablas de datos y fotografía real de planta. Los iconos son
**funcionales** (orientan: categorías, contacto, pasos, origen) y comparten un único estilo
(`.icon-chip`). Esquinas redondeadas moderadas. No hay degradados ni fondos oscuros.

## Tipografía (`lib/fonts.ts`, `next/font/google`)

| Uso | Familia | Notas |
|---|---|---|
| Titulares, nombres de producto, navegación, botones, etiquetas | **Archivo** (variable, eje de ancho) | `font-stretch: 112 %` y peso 700–800 en titulares; 100 % en nombres de producto y etiquetas (mayúsculas, 0,08 em). Aspecto de maquinaria y rotulación corporativa, afín a la «AG» pesada del logotipo |
| Texto corrido | **IBM Plex Sans** 400/500/600 | Herencia técnica, muy legible en español e inglés |

Escala: h1 `clamp(2rem, 4.4vw, 3.125rem)` · h2 `clamp(1.5rem, 2.8vw, 2.125rem)` · h3 `clamp(1.1875rem, 1.7vw, 1.4375rem)` ·
h4 1,0625 rem · texto 1,0625 rem/1,62 · pequeño 0,875–0,9375 rem · etiqueta 0,8125 rem.

## Color y contraste (WCAG 2.2 AA)

| Token | Valor | Uso | Contraste |
|---|---|---|---|
| `brand-blue` | `#1c75bc` | **Banda fuerte** (cabeceras, cierres) con texto **blanco**, botón primario, iconos | blanco encima 4,9:1 |
| `brand-blue-700` | `#175f9a` | Mosaicos sobre la banda, hover | blanco 6,6:1 |
| `brand-blue-dark` | `#124d7c` | Texto/enlaces sobre claro | 8,8:1 sobre blanco |
| `brand-blue-50` | `#eef5fb` | Secciones alternas, filas con hover, chips | `brand-blue-dark` 8,0:1 |
| `brand-red` | `#ed1c24` | Solo acento decorativo (filete de sección, subrayado de navegación, borde de la banda) | no se usa para texto |
| `brand-red-dark` | `#b8121a` | Texto de error/alerta | 6,7:1 sobre blanco |
| `ink` / `body` / `muted` | `#14222f` / `#36444f` / `#566573` | Texto | 16,2 / 10,0 / 6,0 |
| `surface` | `#f3f6f9` | Pie y secciones grises | `muted` 5,5:1 encima |
| `control-border` | `#76828e` | Bordes de campos | 3,9:1 (mín. 3:1) |
| Ocean Breeze | `ocean #12427f`, `ocean-50 #eaf6fc` | Solo páginas y panel de la marca | 9,0:1 |
| Bonche | `bonche #2f7a2b`, `bonche-dark #1f5a1d`, `bonche-50 #f4f9ee`, `bonche-accent #f2941d` (naranja del logo), `bonche-sky #12b8f0` | Solo páginas y panel de la marca | `bonche` blanco 5,3:1 |
| WhatsApp | `#25d366` con texto `#0b3d1f` | Botón de WhatsApp | 6,2:1 |

Sobre la banda azul todo el texto es blanco pleno (no hay texto tintado); los mosaicos usan
`brand-blue-700` para mantener ≥ 4,5:1.

## Forma, sombra y movimiento

- Contenedor 1200 px, márgenes 20/24/32 px; secciones `py-14 md:py-20`.
- Radios: controles 8 px, tarjetas/paneles/fotos 12 px, insignias 6 px, chips de icono 10 px, píldoras de filtro completas.
- Sombras suaves (`--shadow-md/lg`) solo en hover de tarjetas, menús y la franja de datos del inicio.
- `.card` (borde fino + radio) y `a.card:hover`/`.card-hover` (elevación de 2 px); `.rise`: entrada al
  desplazarse con `animation-timeline: view()` como mejora progresiva (sin soporte, el contenido está
  visible; se desactiva con `prefers-reduced-motion`). Sin librerías de animación.
- Foco: anillo azul oscuro de 2 px con separación blanca (blanco sobre banda).

## Componentes

`Section` (blanco / `soft` / `surface` / `band`) · `SectionHeading` · `PageHero` (banda azul, texto +
foto) · `Photo` · `Breadcrumbs` · `IconChip` / `CategoryIcon` · `CategoryCards` · `BrandPanels` ·
`ProductRow` / `ProductCard` / `ProductThumb` (miniatura + visor) · `Catalog` (chips de categoría con
icono, filtros con conteo, tabla/tarjetas, URL como estado) · `SpecGroups` · `ClosingCta` ·
`LanguageSwitch` · `spec-table` (clase CSS para fichas y datos).

## Marcas

AG Supply (azul de marca) es el fabricante. Ocean Breeze y Bonche comparten composición —logotipo
original con transparencia sobre el fondo claro de la marca, texto a la derecha, filete inferior— y se
distinguen por paleta (celeste/azul profundo frente a verde con acento naranja del logo). Ambas indican
«Fabricada por AG Supply». El logotipo de AG Supply va solo sobre fondos claros (no hay versión en negativo).

## Idiomas

Español en la raíz y `/en/` en inglés (dos raíces con su propio `<html lang>`). Los textos de interfaz
están en `lib/i18n/ui.ts`, los de cada página junto a ella en `components/pages/*`, los de empresa en
`lib/i18n/site-text.ts`, los de categorías y marcas en `content/en.json` y los nombres de producto salen
del glosario `lib/i18n/product-terms.ts` (+ `content/en-overrides.json`).
