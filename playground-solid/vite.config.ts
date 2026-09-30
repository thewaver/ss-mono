import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import checker from "vite-plugin-checker";
import solid from "vite-plugin-solid";

import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";

import { SOLID_THEME_VALUES } from "../playground/src/App/Theme.const.ts";
import { componentApi } from "../playground/vite/componentApi.ts";
import { componentDependencies } from "../playground/vite/componentDependencies.ts";
import { playgroundSource } from "../playground/vite/playgroundSource.ts";
import { definePlaygroundUrls } from "../playground/vite/playgroundUrls.ts";
import { themeLoading } from "../playground/vite/themeLoading.ts";

const fromRepo = (path: string) => fileURLToPath(new URL(path, import.meta.url));

// https://vitejs.dev/config/
export default defineConfig({
    root: fromRepo("."),
    plugins: [
        themeLoading(SOLID_THEME_VALUES.color.background),
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
            "@thewaver/ss-playground": fromRepo("../playground/src"),
        },
    },
    define: definePlaygroundUrls(),
    server: {
        port: 8080,
    },
    build: {
        outDir: "dist",
        emptyOutDir: true,
    },
});
