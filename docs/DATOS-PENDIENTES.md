# Datos por confirmar con el cliente

Nada de esto se publica como hecho hasta que se confirme.

| Tema | Detalle | Dónde afecta |
|---|---|---|
| Categorías que fabrica | El sitio afirma «fabricado» solo para papel higiénico, toallas, servilletas, interfoliados y facial (`fabricated` en `content/categories.json`). Confirmar, y si alguna referencia de otras categorías sí se fabrica, marcarla. | Fichas, FAQ, llms.txt |
| Toalla de tela | `Toalla Tela Cocina` está excluida de «fabricado». | Ficha |
| Marcas de terceros | Se retiraron del texto público (Chito, Pannez, Rancho, Samey, Senator, Jerez, Maine, Sumeh, Barcelo, Geto, La Terminal). Durasol y Mibea se mantienen por ser marcas que AG suministra: confirmar. | Catálogo |
| Siglas internas | MW, HW, SD, U.R, TAD, SMC, XL, Lc, Mopc, SHH, MB: definir o reemplazar por descripción. | Nombres de producto |
| Notación 12/1, 48/1 | Confirmar qué significa cada cifra y la unidad de pedido. | FAQ, cotización |
| SKU | Duplicados, malformados y ausentes: `docs/CATALOGO-DATOS.md`. Corregir en Odoo. | Catálogo, JSON-LD |
| Cifras | 400 t/mes, 2 000/1 000 m², año 2007/2014: ya en `siteConfig` como confirmadas por el cliente. | Inicio, Nosotros |
| Correo y horario | `agsupplycxc@gmail.com` y lun–vie 8:00–17:00: confirmar que son los definitivos. | Todo el sitio |
| Dirección | Solo «Sector Las Palomas, Santiago»; falta calle/número/código postal. | Contacto, JSON-LD |
| WhatsApp | El número `809-612-2020` figura como «Central»; confirmar que recibe WhatsApp. | Cotización |
| Pedido mínimo, plazos, cobertura | No existen como dato; el sitio dice «se coordina por pedido». | Catálogo |
| Certificaciones, clientes, equipo | No hay; no se publica ninguna. | Nosotros |
| Web3Forms | Crear la clave, restringirla a agsupply.com.do y cargarla como secreto `NEXT_PUBLIC_WEB3FORMS_KEY`. | Formulario |
| Bonche | Solo 2 referencias en catálogo: confirmar el resto de la línea. | Página Bonche |
| Versión en inglés | Redacción y glosario de nombres de producto hechos por nosotros (`lib/i18n/*`, `content/en.json`, `content/en-overrides.json`): revisar términos técnicos. Eslogan en inglés usado: «Feel the clean» (el oficial es «Siente la limpieza»). | `/en/` |
| Nombre «5 pulgoso» | Aparece en un higiénico 48/1 sin envoltura (Odoo 4237); en inglés se omitió. ¿Qué significa? | Ficha |
| Fotos de producto | 135 referencias sin foto: `docs/FOTOS-PRODUCTOS.csv`. | Catálogo |
