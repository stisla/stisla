import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "node:url";

const fromHere = (p: string) => fileURLToPath(new URL(p, import.meta.url));

// Plugin order matters: tanstackStart() before viteReact() (per the TanStack docs).
// @stisla/* resolve to workspace source so docs track the live components (dev, no build).
export default defineConfig({
  server: { port: 3001 },
  plugins: [tailwindcss(), tanstackStart(), viteReact()],
  resolve: {
    alias: {
      "~": fromHere("./src"),
      "@stisla/react": fromHere("../packages/react/src/index.ts"),
      "@stisla/style": fromHere("../packages/style/src/index.ts"),
    },
  },
});
