# Fotografía: estado y tomas necesarias

> **Fotos de producto**: hoy 33 de 168 referencias tienen foto. Las que faltan están listadas en
> `docs/FOTOS-PRODUCTOS.csv` (id, SKU, categoría, nombre). Cada foto se guarda en
> `public/images/products/` como `odoo-<id>.webp` (o `.jpg`/`.png`; varias fotos: `odoo-<id>-2.webp`),
> sobre fondo blanco, 1:1 o 4:3, mínimo 900 px. Después: `npm run content:curate` y `npm run content:photos`.
> Mientras no exista foto, el listado muestra el icono de la categoría y «Foto próximamente».

## Qué hay hoy (`public/images/fotos/`)

| Archivo | Uso | Observación |
|---|---|---|
| `hero-2`, `planta-2`, `planta-3`, `planta-4`, `planta-5` | Inicio, planta, categorías, catálogo | Retocadas con IA a partir de fotos de la planta (indicado por el cliente). El retoque puede alterar rótulos de empaque; no se usan en primer plano. |
| `section-nosotros` | Nosotros | Fachada. |
| `brand-bonche-hero` | Meta Open Graph de Bonche | Producto Bonche sobre fondo verde (original). |
| `bonche-productos` | Página de Bonche | Recorte del original sin el fondo verde (relleno por conectividad desde los bordes y despill). Si se dispone del archivo sin fondo, sustituirlo. |

**Retiradas del sitio** (siguen en el historial de Git): `hero-1`, `section-manufactura`
(rótulos de cajas deformados: «Klim Pel», «POP UP»), `planta-1` y `section-cta` (montacargas y
contenedor que no se pueden atribuir a la planta de Santiago), `header-productos` (rectángulos
negros sobre empaques y marca de terceros), `hero-3`, `cat-*` (fotos de archivo sin producto de AG).

## Tomas que aportarían más valor

Sin retoque, con luz natural o de nave, horizontales, mínimo 2400 px de ancho.

1. **Fachada y acceso** (Las Palomas), día despejado — 16:9.
2. **Bobinas** en almacén de materia prima, con la bobina de mayor diámetro en primer plano — 16:9.
3. **Rebobinadora y línea de corte** en operación, con operario — 4:3.
4. **Doblado/interfoliado**: máquina y producto saliendo — 4:3.
5. **Empaque**: línea de empaque con el empaque real de Ocean Breeze y de Bonche legible — 4:3.
6. **Almacén de producto terminado y despacho** (paletas, camión de AG) — 16:9.
7. **Producto terminado por categoría** (papel higiénico, toallas, servilletas, interfoliados,
   faciales) con empaque real sobre fondo blanco, misma luz y encuadre — 1:1, ~135 referencias sin foto
   (prioridad: las 30 de mayor venta).
8. **Aplicación**: producto en un hotel o restaurante cliente (con autorización) — 3:2.

## Logotipos

Pedir a diseño: logotipo de AG Supply en **vector** (SVG/AI) y en **versión en negativo** (blanco)
para fondo marino; logotipos de Ocean Breeze y Bonche en vector con fondo transparente.
Hoy el logotipo va sobre pastilla blanca en el pie.
