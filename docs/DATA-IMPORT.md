# Import del catálogo desde Odoo

El catálogo (`content/products.json`, `categories.json`, `brands.json`) se
genera a partir de `product.template` de Odoo. **No se edita a mano** salvo
parches puntuales (ver `docs/CONTENT.md`).

## Pipeline

```
Odoo ──(1) extracción──▶ scripts/odoo-raw.json
                          public/images/products/odoo-<id>.webp
     ──(2) normalización─▶ content/*.json
                          docs/PENDING-CONTENT.md
```

### 1. Extracción

**Producción (recomendado):**

```bash
export ODOO_URL=https://tu-odoo
export ODOO_DB=tu-db
export ODOO_USER=usuario@dominio
export ODOO_API_KEY=xxxx     # API key o contraseña
node scripts/import-from-odoo.mjs
```

Usa JSON-RPC (`/jsonrpc`), sin dependencias extra. Escribe `scripts/odoo-raw.json`
y convierte a webp las imágenes (`image_1024`) de los productos que las tengan.

**Primer seed de este repo:** se extrajo con las herramientas MCP de Odoo y se
guardó en `scripts/odoo-raw.json`; `scripts/extract-odoo-images.mjs` decodificó
esos volcados. Para un refresh normal usa el script de producción de arriba.

### 2. Normalización

```bash
node scripts/normalize-odoo.mjs
```

`scripts/normalize-odoo.mjs` concentra todas las reglas de curaduría:

- **Excluye** servicios, materia prima, material de empaque, productos de
  segunda, cajas/corrugado/bobinas y líneas internas.
- **Clasifica** en las 8 categorías del sitio por nombre + `categ_id` de Odoo.
- **Deriva la marca**: `ag_marca` si existe; si no, tokens del nombre
  (`OB`/`OCEAN BREEZE` → Ocean Breeze, `BONCHE` → Bonche, resto → Genérico).
  «Bonche» se trata como sub-línea dentro de Ocean Breeze en Odoo.
- **Specs**: usa los campos `ag_*` como autoridad; si faltan, parsea el nombre
  (`2 capas`, `35 MTS`, `350 hojas`, `48/1`, `12X12`…).
- Escribe los 3 JSON y regenera `docs/PENDING-CONTENT.md` con lo que quedó
  inferido o sin imagen, y los registros excluidos.

Ajusta las heurísticas en ese archivo (mapas `EXCLUDE_*`, `classify`,
`deriveBrand`, `buildSpecs`) y vuelve a ejecutar. Resultado actual: **168
productos**, 33 con foto real.

## Números de la última corrida

Ver `docs/PENDING-CONTENT.md` (se regenera en cada `normalize-odoo.mjs`).

## Cuando Sanity esté conectado

`node scripts/seed-sanity.mjs` sube estos mismos JSON a Sanity con `_id`
deterministas (idempotente). A partir de ahí la edición es en el Studio.
