import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import checker from "vite-plugin-checker";
import solid from "vite-plugin-solid";

import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";

import { componentApi } from "../playground-core/vite/componentApi.ts";
import { componentDependencies } from "../playground-core/vite/componentDependencies.ts";
import { playgroundSource } from "../playground-core/vite/playgroundSource.ts";

const fromRepo = (path: string) => fileURLToPath(new URL(path, import.meta.url));

// https://vitejs.dev/config/
export default defineConfig({
    root: fromRepo("."),
    plugins: [
        playgroundSource(),
        componentDependencies([fromRepo("../components-solid/src"), fromRepo("../components/src")]),
        componentApi(
            fromRepo("../components-solid/src"),
            fromRepo("../components/src"),
            fromRepo("../utils/src/index.ts"),
        ),
        solid(),
        checker({
            typescript: {
                tsconfigPath: "./tsconfig.json",
            },
        }),
        vanillaExtractPlugin(),
    ],
    resolve: {
        alias: {
            "@thewaver/ss-components": fromRepo("../components/src/index.ts"),
            "@thewaver/ss-components-solid": fromRepo("../components-solid/src/index.ts"),
            "@thewaver/ss-utils": fromRepo("../utils/src/index.ts"),
            "@thewaver/ss-playground-core": fromRepo("../playground-core/src"),
        },
    },
    define: {
        "import.meta.env.VITE_OTHER_PLAYGROUND_URL": JSON.stringify(
            process.env.VITE_OTHER_PLAYGROUND_URL ?? "http://localhost:8081/",
        ),
    },
    server: {
        port: 8080,
    },
    build: {
        outDir: "dist",
        emptyOutDir: true,
    },
});
