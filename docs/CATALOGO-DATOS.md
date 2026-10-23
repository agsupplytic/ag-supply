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

## Fichas sin indexar por contenido delgado (55 de 168)

Sin foto propia y sin datos técnicos aparte de la presentación: llevan `noindex` y no están en el
sitemap. Salen solas de esta lista al añadir una foto (`public/images/products/odoo-<id>.webp`)
o datos técnicos en Odoo y volver a ejecutar `npm run content:curate`.

- Combo Clear HW 2 PZAS Ten+cuchi (Odoo 3829)
- Combo HW 1 Pieza Impreso 100/1 (Odoo 3940)
- Combo HW 2 PZAS Impreso 100/1 (Odoo 3543)
- Combo HW 2 PZAS Impreso 100/1. Hight. Bolsas Lisas (Odoo 3583)
- Combos 2 Piezas Blancos MW 500/1 (Odoo 4175)
- Combos en Caja HW 2 Piezas 500/1. Hight. Caja (Odoo 3588)
- Combos en Caja HW 3 Piezas 10/25 Hight (Odoo 4324)
- Cuchillo Clear 1000/1 (Odoo 3830)
- Tenedor Clear 1000/1 (Odoo 3831)
- Fardo Funda Jardín (Odoo 3943)
- Funda MTZ 36 X 52 Hd Lisa 1/100 (Odoo 4145)
- Papel Encerado 16X24 Caja de 1000 (Odoo 3922)
- Papel Encerado 70 Pies Caja 24/1 (Odoo 4230)
- Papel Encerado Tipo Periódico 12X12 1000/1 (Odoo 4128)
- Papel MG Impresión 12X11 1000/1 (Odoo 4251)
- Plegadizas Papel Encerado Bonche (75 Pies X 12 Pulg) (Odoo 4186)
- Cartucho Jabón Espuma, Caja de 4 UD (Odoo 3576)
- Desinfectante Lavanda Mibea 4/1 (Odoo 3990)
- Dispensador de Jabón Cartucho (Odoo 3603)
- Dispensador de Jabón Líquido C/valvula (Odoo 3604)
- Dispensador de Papel Jumbo (Odoo 3991)
- Dispensador de Toalla (Odoo 4144)
- Dispensador Inox Jumbo (Odoo 3992)
- Esponja de Acero Inoxidable Durasol (Odoo 3608)
- Esponja Doble Uso Durasol (Odoo 3609)
- Higiénico 12/1, XL, Mopc (Odoo 3668)
- Higiénico 48/1 Sin Envoltura S.D (Odoo 4305)
- Higiénico 48/1, M, Individual Ocean Breeze (Odoo 3678)
- Higiénico 48/1, sin envoltura 5 pulgoso, 105 gr (Odoo 4237)
- Higiénico Jumbo 12/1, Especial (Odoo 3549)
- Papel Higiénico 12/1 Bionatural (Odoo 4012)
- Papel Higiénico 12/1 M Ocean Breeze (Odoo 3861)
- Papel Higiénico 48/1 M Individual Ocean Breeze (Odoo 3866)
- Papel Higiénico 6/1 9 Lbs (Odoo 3942)
- Papel Higiénico Jumbo 16 Libras 12/1 Caja (Odoo 3938)
- Papel Higiénico Xtra 30/1 (Odoo 3708)
- Dinner 12/100 doblez 1/4 (Odoo 4277)
- Dispenser Comprimidas 25 de 185 fardo (Odoo 4213)
- Servilleta Cocktail 1000/1 (Odoo 3726)
- Servilletas 60/1 (Odoo 3732)
- Servilletas Dinner (Odoo 3747)
- Servilletas Impresa (Odoo 4311)
- Toalla Cocina 2/1 Precortada Cja 9/2 (18) (Odoo 4214)
- Toalla Económica 6/1 (Odoo 3796)
- Toalla Económica Xtra 6/1 (Odoo 4266)
- Toalla Especial 6/1 830 Grs (Odoo 4094)
- Toalla TAD 13 Libras 6/1 con (Odoo 3770)
- Toalla TAD 6/1 Pro (Odoo 3771)
- Toalla TAD Caja 12/1 (Odoo 4219)
- Toalla TAD Económica 6/1 (Odoo 3901)
- Toalla TAD Smc 6/1 (Odoo 3773)
- Toallacocina Individual Precortada (Odoo 4158)
- Toallas 6/1 2/1 Ocean Breeze (Odoo 3774)
- Toallas Cocina 12/3 Ocean Breeze (Odoo 3777)
- Toallas Eco 6/1 Xtra (Odoo 3778)

## Siglas internas sin definición pública

MW, HW, SD, U.R, TAD, SMC, XL, Lc, Mopc, SHH, MB: aparecen en nombres de producto. 
Definirlas (o sustituirlas por una descripción) mejora la búsqueda y la comparación.

## Posibles erratas no corregidas automáticamente

- `Servilleta Dinner Azul 20150 2 PLY`: ¿es 20/150?
- `Toalla TAD 13 Libras 6/1 con`: nombre truncado.
