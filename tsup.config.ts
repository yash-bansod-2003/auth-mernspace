import { defineConfig, type Options } from "tsup";

export default defineConfig((options: Options) => ({
  entryPoints: ["src/index.ts"],
  splitting: false,
  sourcemap: true,
  clean: true,
  minify: true,
  format: ["cjs"],
  ...options,
}));
