import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",

    // Old reference codebase (per constitution - DO NOT MODIFY):
    "backend/**",
    "js/**",
    "data/**",
    "server.js",
    "css/**",
    "images/**",
    "index.html",
    "category.html",
    "product.html",
    "cart.html",
    "profile.html",
    "admin.html",
    "contact.html",
    "procedure.md",
    "**/*.html",

    // Installed skills (not our application code):
    ".agents/skills/**",
    ".opencode/skills/**",
  ]),
]);

export default eslintConfig;
