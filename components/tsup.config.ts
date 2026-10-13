import { defineConfig } from "tsup";

export default defineConfig({
    entry: ["src/index.ts", "src/internal.ts"],
    format: ["esm"],
    dts: { only: true },
    clean: false,
    outDir: "dist",
});
