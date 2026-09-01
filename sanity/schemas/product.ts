import { defineField, defineType } from "sanity";

/**
 * Product. Deliberately NO price field — AG Supply does not publish prices, and
 * the data model must reflect that, not just hide it in the frontend.
 */
export const product = defineType({
  name: "product",
  title: "Producto",
  type: "document",
  groups: [
    { name: "main", title: "General", default: true },
    { name: "specs", title: "Especificaciones" },
    { name: "meta", title: "Origen" },
  ],
  fields: [
    defineField({
      name: "name",
      title: "Nombre",
      type: "string",
      group: "main",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "main",
      options: { source: "name", maxLength: 64 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "brand",
      title: "Marca",
      type: "string",
      group: "main",
      options: {
        list: [
          { title: "Ocean Breeze", value: "ocean-breeze" },
          { title: "Bonche", value: "bonche" },
          { title: "Genérico", value: "generico" },
        ],
        layout: "radio",
      },
      initialValue: "generico",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "category",
      title: "Categoría",
      type: "reference",
      group: "main",
      to: [{ type: "category" }],
      validation: (r) => r.required(),
    }),
    defineField({
      name: "subcategory",
      title: "Subcategoría",
      type: "string",
      group: "main",
    }),
    defineField({
      name: "images",
      title: "Imágenes",
      type: "array",
      group: "main",
      of: [{ type: "image", options: { hotspot: true } }],
    }),
    defineField({
      name: "description",
      title: "Descripción",
      type: "text",
      group: "main",
      rows: 4,
    }),
    defineField({
      name: "keySpecs",
      title: "Specs clave (para la tarjeta)",
      type: "array",
      group: "main",
      of: [{ type: "string" }],
      validation: (r) => r.max(2),
      description: "1–2 etiquetas cortas, p. ej. «2 capas», «500 hojas».",
    }),
    defineField({
      name: "active",
      title: "Activo (visible en el sitio)",
      type: "boolean",
      group: "main",
      initialValue: true,
    }),

    defineField({
      name: "specs",
      title: "Especificaciones técnicas",
      type: "object",
      group: "specs",
      options: { collapsible: true, collapsed: false },
      fields: [
        { name: "ply", title: "Capas", type: "number" },
        { name: "widthCm", title: "Ancho (cm)", type: "number" },
        { name: "sheetLengthCm", title: "Largo de hoja (cm)", type: "number" },
        { name: "sheets", title: "Hojas por rollo/paquete", type: "number" },
        { name: "grammageGsm", title: "Gramaje (g/m²)", type: "number" },
        { name: "rollLengthM", title: "Longitud del rollo (m)", type: "number" },
        { name: "rollLengthFt", title: "Longitud del rollo (pies)", type: "number" },
        { name: "color", title: "Color", type: "string" },
        { name: "fold", title: "Doblez", type: "string" },
        { name: "finish", title: "Acabado", type: "string" },
        { name: "paperType", title: "Tipo de papel", type: "string" },
        { name: "packFormat", title: "Presentación (p. ej. 48/1)", type: "string" },
        { name: "packsPerBale", title: "Paquetes por fardo", type: "number" },
        { name: "packageDims", title: "Dimensiones del paquete", type: "string" },
        { name: "caseDims", title: "Dimensiones del fardo/caja", type: "string" },
        { name: "unitsPerPallet", title: "Unidades por paleta", type: "number" },
        { name: "compliance", title: "Cumplimiento normativo", type: "string" },
      ],
    }),

    defineField({
      name: "odooId",
      title: "ID de Odoo (product.template)",
      type: "number",
      group: "meta",
      readOnly: true,
    }),
    defineField({
      name: "sku",
      title: "Referencia interna (default_code)",
      type: "string",
      group: "meta",
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "brand", media: "images.0" },
  },
});
