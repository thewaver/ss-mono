import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import checker from "vite-plugin-checker";

import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";

import { VUE_THEME_VALUES } from "../playground/src/App/Theme.const.ts";
import { componentApi } from "../playground/vite/componentApi.ts";
import { componentDependencies } from "../playground/vite/componentDependencies.ts";
import { playgroundSource } from "../playground/vite/playgroundSource.ts";
import { definePlaygroundUrls } from "../playground/vite/playgroundUrls.ts";
import { refuseFrameworks } from "../playground/vite/refuseFrameworks.ts";
import { themeLoading } from "../playground/vite/themeLoading.ts";

const fromRepo = (path: string) => fileURLToPath(new URL(path, import.meta.url));

export default defineConfig({
    root: fromRepo("."),
    plugins: [
        refuseFrameworks("vue"),
        themeLoading(VUE_THEME_VALUES.color.background),
        playgroundSource(),
        componentDependencies([fromRepo("../components-vue/src"), fromRepo("../components/src")]),
        componentApi(
            fromRepo("../components-vue/src"),
            fromRepo("../components/src"),
            fromRepo("../utils/src/index.ts"),
            { slotsSuffix: "Slots" },
        ),
        vue(),
        vueJsx(),
        checker({
            vueTsc: {
                tsconfigPath: "./tsconfig.json",
            },
        }),
        vanillaExtractPlugin(),
    ],
    resolve: {
        alias: {
            "@thewaver/ss-components": fromRepo("../components/src/index.ts"),
            "@thewaver/ss-components-vue": fromRepo("../components-vue/src/index.ts"),
            "@thewaver/ss-utils": fromRepo("../utils/src/index.ts"),
            "@thewaver/ss-playground": fromRepo("../playground/src"),
        },
    },
    define: definePlaygroundUrls(),
    server: {
        port: 8086,
    },
    build: {
        outDir: "dist",
        emptyOutDir: true,
    },
});
