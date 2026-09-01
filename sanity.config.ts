/**
 * Sanity Studio config — NOT wired into the app build in this deliverable.
 *
 * To bring it up:
 *   npm i sanity @sanity/vision styled-components
 *   npx sanity init --env  (or set the env vars below)
 * then either run `npx sanity dev` locally, or embed the Studio at /studio with
 * `next-sanity` and deploy on Vercel (see docs/DEPLOY.md).
 *
 * Kept in the repo so the schema (sanity/schemas) is the source of truth and the
 * CONTENT_SOURCE=sanity swap in lib/content is a config change, not a rewrite.
 */
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./sanity/schemas";

export default defineConfig({
  name: "agsupply",
  title: "AG Supply — Contenido",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  basePath: "/studio",
  plugins: [structureTool()],
  schema: { types: schemaTypes },
});
