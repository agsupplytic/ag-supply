# Datos del catálogo por corregir en Odoo

Generado por `scripts/curate-products.mjs`. El sitio muestra el SKU tal como viene de Odoo; 
no se inventan ni se reasignan códigos.

## SKU duplicados (2)

- `0889-TOA-33`:
  - Toalla Bleach 750 Pies Caja 12/1 (Odoo 4058)
  - Toalla Cocina 2/1 Precortada Cja 9/2 (18) (Odoo 4214)
  - Toalla Especial 6/1 830 Grs (Odoo 4094)
  - Toalla Kraft 22 Lbs 6/1 1578 (Odoo 4138)
- `0889-TOA-34`:
  - Toalla TAD Caja 12/1 (Odoo 4219)
  - Toallacocina Individual Precortada (Odoo 4158)

## SKU con formato inválido (2)

- `0889-[08-02` — Papel Higiénico 60 Mts Individual Ocean Breeze (Odoo 4125)
- `SER-01` — Servilletas Dispenser Bonche 10 Paquetes (Odoo 3552)

## Productos sin SKU (4)

- Cucharas Blanca MW 40/25 (Odoo 4107)
- Tenedor MW Blanco 40/25 (Odoo 4108)
- Funda 4 GLN 18X22 Blanca (Odoo 3628)
- Plegadizas Papel Encerado Bonche (75 Pies X 12 Pulg) (Odoo 4186)

## Siglas internas sin definición pública

MW, HW, SD, U.R, TAD, SMC, XL, Lc, Mopc, SHH, MB: aparecen en nombres de producto. 
Definirlas (o sustituirlas por una descripción) mejora la búsqueda y la comparación.

## Posibles erratas no corregidas automáticamente

- `Servilleta Dinner Azul 20150 2 PLY`: ¿es 20/150?
- `Toalla TAD 13 Libras 6/1 con`: nombre truncado.
