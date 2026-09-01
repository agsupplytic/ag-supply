import { defineField, defineType } from "sanity";

export const brand = defineType({
  name: "brand",
  title: "Marca",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Nombre",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name" },
      description: "ocean-breeze | bonche | generico",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "positioning",
      title: "Posicionamiento",
      type: "string",
      options: {
        list: [
          { title: "Premium", value: "premium" },
          { title: "Económica", value: "economica" },
          { title: "Genérico", value: "generico" },
        ],
      },
    }),
    defineField({
      name: "description",
      title: "Descripción",
      type: "text",
      rows: 3,
    }),
  ],
  preview: { select: { title: "name", subtitle: "positioning" } },
});
