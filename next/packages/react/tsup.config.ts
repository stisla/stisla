import { defineConfig } from "tsup";

// @stisla/react — thin Base UI wrappers over the @stisla/style composer. ESM + .d.ts.
// All runtime deps (react, base-ui, clsx, @stisla/style) stay external — resolved by the consumer.
export default defineConfig({
  entry: {
    index: "src/index.ts",
    "button/index": "src/button/index.tsx",
    "sidebar/index": "src/sidebar/index.tsx",
  },
  format: ["esm"],
  dts: true,
  clean: true,
  outDir: "dist",
  external: ["react", "react-dom", "@base-ui/react", "@stisla/style", "clsx"],
});
