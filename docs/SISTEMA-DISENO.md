# Sistema de diseño

Todo valor de color, tipografía, radio y sombra vive en `app/globals.css` (`@theme`). Ningún
componente lleva hex.

## Dirección

Industrial e institucional: fondos planos, esquinas rectas (2–4 px), filetes de 1 px, tablas y listas
en vez de tarjetas con icono, fotografía sin superposiciones. La marca es el azul y el rojo del
logotipo; el rojo es acento puntual (filete de sección, subrayado de navegación), nunca banda.

## Tipografía

| Uso | Familia | Notas |
|---|---|---|
| Titulares, navegación, botones | Barlow 500/600/700 (+ cursiva 600 para el eslogan) | Geometría y terminales técnicas cercanas a la «AG» oblicua del logotipo |
| Texto corrido | Source Sans 3 (variable) | Humanista, afín a «Supply»; buena cobertura del español |
| Etiquetas y datos | Barlow Semi Condensed 600, mayúsculas, 0,08 em | Clase `.label` |

Escala: display/h1 `clamp(2.125rem, 4.6vw, 3.25rem)` · h2 `clamp(1.625rem, 3vw, 2.25rem)` ·
h3 `clamp(1.25rem, 1.8vw, 1.5rem)` · h4 1,0625 rem · texto 1,0625 rem/1,6 · pequeño 0,875–0,9375 rem ·
etiqueta 0,8125 rem. Las fuentes las sirve `next/font` (autoalojadas en el build).

## Color y contraste (WCAG 2.2 AA)

| Token | Valor | Uso | Contraste |
|---|---|---|---|
| `brand-blue` | `#1c75bc` | Acción primaria, marca | blanco encima 4,9:1 |
| `brand-blue-dark` | `#124d7c` | Texto/enlaces sobre claro, hover | 8,8:1 sobre blanco |
| `brand-red` | `#ed1c24` | Solo acento decorativo (filete, subrayado) | no se usa para texto |
| `brand-red-dark` | `#b8121a` | Texto de error/alerta | 6,7:1 sobre blanco |
| `navy` | `#0f2a43` | Única superficie oscura (hero, datos, pie) | blanco 14,7:1 |
| `navy-300` | `#9db4c9` | Texto secundario sobre marino | 6,8:1 |
| `ink` / `body` / `muted` | `#14222f` / `#36444f` / `#566573` | Texto | 16,2 / 10,0 / 6,0 |
| `surface` | `#f3f6f9` | Fondo alterno | `muted` 5,5:1 encima |
| `control-border` | `#76828e` | Bordes de campos | 3,9:1 (mín. 3:1) |
| Ocean Breeze | `ocean #12427f`, `ocean-50 #eaf6fc` | Solo páginas de la marca | 9,0:1 |
| Bonche | `bonche #2f7a2b`, `bonche-50 #f1f6ec` | Solo páginas de la marca | blanco 5,3:1 |
| WhatsApp | `#25d366` con texto `#0b3d1f` | Botón de WhatsApp | 6,2:1 |

## Forma y espacio

- Contenedor 1200 px con márgenes 20/24/32 px. Secciones con `py-14 md:py-20`.
- Radio ≤ 4 px; sin sombras (solo `--shadow-menu` en los menús desplegables).
- Estados: foco con anillo azul oscuro de 2 px y separación blanca (blanco sobre marino);
  hover cambia color de fondo o subrayado, sin movimiento.

## Componentes

`Section` (blanco / `surface` / `navy`) · `SectionHeading` (filete rojo + titular) · `PageHero`
(banda marino, texto + foto sin superposición) · `Photo` (proporción fija) · `Breadcrumbs` ·
`CategoryList` · `BrandPanels` · `BrandLanding` (composición propia por marca) · `ProductRow` /
`ProductCard` · `Catalog` (tabla densa, tarjetas, filtros con conteo, URL como estado) ·
`spec-table` (clase CSS para fichas y datos) · `ClosingCta`.

## Marcas

AG Supply (azul/marino) es el fabricante. Ocean Breeze conserva su celeste/azul profundo y el
logotipo como protagonista; Bonche conserva su verde y una composición con fotografía de producto.
Ambas indican «Fabricada por AG Supply».
