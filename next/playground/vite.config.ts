import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "node:url";

const fromHere = (p: string) => fileURLToPath(new URL(p, import.meta.url));

// Consume the workspace packages straight from source (no build step needed for dev).
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@stisla/react": fromHere("../packages/react/src/index.ts"),
      "@stisla/style": fromHere("../packages/style/src/index.ts"),
    },
  },
});
