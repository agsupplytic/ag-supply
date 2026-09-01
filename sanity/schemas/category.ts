import { defineField, defineType } from "sanity";

export const category = defineType({
  name: "category",
  title: "Categoría",
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
      validation: (r) => r.required(),
    }),
    defineField({
      name: "order",
      title: "Orden",
      type: "number",
      initialValue: 99,
    }),
    defineField({
      name: "icon",
      title: "Icono (lucide-react)",
      type: "string",
      description:
        "Nombre exacto del icono de lucide-react: Disc3, Layers, Square, Rows3, Wind, SprayCan, Utensils, Boxes.",
    }),
    defineField({
      name: "description",
      title: "Descripción",
      type: "text",
      rows: 2,
    }),
  ],
  orderings: [
    { title: "Orden", name: "order", by: [{ field: "order", direction: "asc" }] },
  ],
  preview: { select: { title: "name", subtitle: "slug.current" } },
});
