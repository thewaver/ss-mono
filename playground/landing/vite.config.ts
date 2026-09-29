import { fileURLToPath } from "node:url";
import type { Plugin } from "vite";
import { defineConfig } from "vite";

import {
    REACT_THEME_VALUES,
    SOLID_THEME_VALUES,
    SVELTE_THEME_VALUES,
    VUE_THEME_VALUES,
} from "../src/App/Theme.const.ts";

const fromHere = (path: string) => fileURLToPath(new URL(path, import.meta.url));

const SOLID_PORT = Number(process.env.PLAYGROUND_SOLID_PORT ?? 8082);
const REACT_PORT = Number(process.env.PLAYGROUND_REACT_PORT ?? 8083);
const VUE_PORT = Number(process.env.PLAYGROUND_VUE_PORT ?? 8084);
const SVELTE_PORT = Number(process.env.PLAYGROUND_SVELTE_PORT ?? 8085);

const themeColors = (): Plugin => ({
    name: "theme-colors",
    transformIndexHtml: () => [
        {
            tag: "style",
            injectTo: "head",
            children: `:root { --solid-primary: ${SOLID_THEME_VALUES.color.primary.main}; --react-primary: ${REACT_THEME_VALUES.color.primary.main}; --vue-primary: ${VUE_THEME_VALUES.color.primary.main}; --svelte-primary: ${SVELTE_THEME_VALUES.color.primary.main}; }`,
        },
    ],
});

export default defineConfig({
    root: fromHere("."),
    plugins: [themeColors()],
    server: {
        port: 8080,
        strictPort: true,
        open: "/",
        proxy: {
            "/solid": { target: `http://localhost:${SOLID_PORT}`, ws: true },
            "/react": { target: `http://localhost:${REACT_PORT}`, ws: true },
            "/vue": { target: `http://localhost:${VUE_PORT}`, ws: true },
            "/svelte": { target: `http://localhost:${SVELTE_PORT}`, ws: true },
        },
    },
});
