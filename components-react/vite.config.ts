import { fileURLToPath } from "node:url";
import type { Plugin } from "vite";
import { defineConfig } from "vite";

import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import react from "@vitejs/plugin-react";

const fromHere = (path: string) => fileURLToPath(new URL(path, import.meta.url));

const SOLID_PACKAGE = /^solid-js(\/|$)/;

const refuseSolid = (): Plugin => ({
    name: "refuse-solid",
    enforce: "pre",
    resolveId(source, importer) {
        if (!SOLID_PACKAGE.test(source)) return undefined;

        this.error(`${importer ?? "A module"} imports ${source}; the core the React package builds on must not.`);
    },
});

export default defineConfig({
    root: fromHere("./gallery"),
    plugins: [refuseSolid(), react(), vanillaExtractPlugin()],
    resolve: {
        alias: {
            "@thewaver/ss-components": fromHere("../components/src/index.ts"),
            "@thewaver/ss-utils": fromHere("../utils/src/index.ts"),
        },
    },
    server: {
        port: 4174,
        hmr: false,
    },
});
