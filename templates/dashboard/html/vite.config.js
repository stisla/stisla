import { defineConfig } from "vite";
import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import meridianNunjucks from "./nunjucks.mjs";

const root = fileURLToPath(new URL(".", import.meta.url));

// The dashboard consumes the framework through bare specifiers — `import "@stisla/css"`
// and `import "@stisla/vanilla"` in main.js — which resolve to the workspace packages via
// node_modules. No deep relative paths, no aliases: the same way a real consumer imports it.
export default defineConfig({
  root,
  plugins: [tailwindcss(), meridianNunjucks({ root })],
});
