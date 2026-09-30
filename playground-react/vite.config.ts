import { fileURLToPath } from "node:url";
import type { Plugin } from "vite";
import { defineConfig } from "vite";
import checker from "vite-plugin-checker";

import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import react from "@vitejs/plugin-react";

import { REACT_THEME_VALUES } from "../playground/src/App/Theme.const.ts";
import { componentApi } from "../playground/vite/componentApi.ts";
import { componentDependencies } from "../playground/vite/componentDependencies.ts";
import { playgroundSource } from "../playground/vite/playgroundSource.ts";
import { definePlaygroundUrls } from "../playground/vite/playgroundUrls.ts";
import { themeLoading } from "../playground/vite/themeLoading.ts";

const fromRepo = (path: string) => fileURLToPath(new URL(path, import.meta.url));

const SOLID_PACKAGE = /^(solid-js|@solidjs\/|@thewaver\/ss-components-solid)(\/|$)/;

const refuseSolid = (): Plugin => ({
    name: "refuse-solid",
    enforce: "pre",
    resolveId(source, importer) {
        if (!SOLID_PACKAGE.test(source)) return undefined;

        this.error(`${importer ?? "A module"} imports ${source}; the React Playground must not.`);
    },
});

export default defineConfig({
    root: fromRepo("."),
    plugins: [
        refuseSolid(),
        themeLoading(REACT_THEME_VALUES.color.background),
        playgroundSource(),
        componentDependencies([fromRepo("../components-react/src"), fromRepo("../components/src")]),
        componentApi(
            fromRepo("../components-react/src"),
            fromRepo("../components/src"),
            fromRepo("../utils/src/index.ts"),
        ),
        react(),
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
            "@thewaver/ss-components-react": fromRepo("../components-react/src/index.ts"),
            "@thewaver/ss-utils": fromRepo("../utils/src/index.ts"),
            "@thewaver/ss-playground": fromRepo("../playground/src"),
        },
    },
    define: definePlaygroundUrls(),
    server: {
        port: 8081,
    },
    build: {
        outDir: "dist",
        emptyOutDir: true,
    },
});
