import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

import { svelte } from "@sveltejs/vite-plugin-svelte";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";

import { componentApi } from "../playground/vite/componentApi.ts";
import { componentDependencies } from "../playground/vite/componentDependencies.ts";
import { playgroundSource } from "../playground/vite/playgroundSource.ts";
import { definePlaygroundUrls } from "../playground/vite/playgroundUrls.ts";
import { refuseFrameworks } from "../playground/vite/refuseFrameworks.ts";

const fromRepo = (path: string) => fileURLToPath(new URL(path, import.meta.url));

export default defineConfig({
    root: fromRepo("."),
    plugins: [
        refuseFrameworks("svelte"),
        playgroundSource(),
        componentDependencies([fromRepo("../components-svelte/src"), fromRepo("../components/src")]),
        componentApi(
            fromRepo("../components-svelte/src"),
            fromRepo("../components/src"),
            fromRepo("../utils/src/index.ts"),
        ),
        svelte(),
        vanillaExtractPlugin(),
    ],
    resolve: {
        alias: {
            "@thewaver/ss-components": fromRepo("../components/src/index.ts"),
            "@thewaver/ss-components-svelte": fromRepo("../components-svelte/src/index.ts"),
            "@thewaver/ss-utils": fromRepo("../utils/src/index.ts"),
            "@thewaver/ss-playground": fromRepo("../playground/src"),
        },
    },
    define: definePlaygroundUrls(),
    server: {
        port: 8087,
    },
    build: {
        outDir: "dist",
        emptyOutDir: true,
    },
});
