import { defineConfig } from "vite";

import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";

const EXTERNAL_PACKAGES = ["@thewaver/ss-utils", "colorthief", "@internationalized/date"];

const isExternal = (id: string) => EXTERNAL_PACKAGES.some((pkg) => id === pkg || id.startsWith(`${pkg}/`));

export default defineConfig({
    plugins: [vanillaExtractPlugin()],
    build: {
        outDir: "dist",
        emptyOutDir: true,
        target: "esnext",
        minify: false,
        sourcemap: true,
        cssCodeSplit: false,
        lib: {
            entry: "src/index.ts",
            formats: ["es"],
            cssFileName: "index",
        },
        rollupOptions: {
            external: isExternal,
            output: {
                preserveModules: true,
                preserveModulesRoot: "src",
                entryFileNames: (chunk) => `${chunk.name.replace(/^(?:.*\/)?node_modules\//, "_external/")}.js`,
            },
        },
    },
});
