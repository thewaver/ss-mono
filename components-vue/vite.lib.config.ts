import { defineConfig } from "vite";

import vueJsx from "@vitejs/plugin-vue-jsx";

const EXTERNAL_PACKAGES = ["vue", "@thewaver/ss-components", "@thewaver/ss-utils", "@tanstack/virtual-core"];

const isExternal = (id: string) => EXTERNAL_PACKAGES.some((pkg) => id === pkg || id.startsWith(`${pkg}/`));

export default defineConfig({
    plugins: [vueJsx()],
    build: {
        outDir: "dist",
        emptyOutDir: true,
        target: "esnext",
        minify: false,
        sourcemap: true,
        lib: {
            entry: "src/index.ts",
            formats: ["es"],
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
