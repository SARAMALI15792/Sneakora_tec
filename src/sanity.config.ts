import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { presentationTool } from "sanity/presentation";
import { schemaTypes } from "@/sanity/schemaTypes";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!;

export default defineConfig({
  name: "sneakora",
  title: "Sneakora CMS",

  projectId,
  dataset,

  plugins: [
    structureTool(),
    visionTool(),
    presentationTool({
      previewUrl: {
        previewMode: {
          enable: "/api/draft-mode/enable",
        },
      },
    }),
  ],

  schema: {
    types: schemaTypes,
  },
});
