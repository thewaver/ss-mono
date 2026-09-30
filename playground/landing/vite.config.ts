import { fileURLToPath } from "node:url";
import type { Plugin } from "vite";
import { defineConfig } from "vite";

import {
    REACT_THEME_VALUES,
    SOLID_THEME_VALUES,
    SVELTE_THEME_VALUES,
    VUE_THEME_VALUES,
} from "../src/App/Theme.const.ts";
import { toCssFamily } from "../src/App/Theme.utils.ts";

const fromHere = (path: string) => fileURLToPath(new URL(path, import.meta.url));

const SOLID_PORT = Number(process.env.PLAYGROUND_SOLID_PORT ?? 8082);
const REACT_PORT = Number(process.env.PLAYGROUND_REACT_PORT ?? 8083);
const VUE_PORT = Number(process.env.PLAYGROUND_VUE_PORT ?? 8084);
const SVELTE_PORT = Number(process.env.PLAYGROUND_SVELTE_PORT ?? 8085);

const SOLID_PRIMARY = toCssFamily(SOLID_THEME_VALUES.color.primary);
const REACT_PRIMARY = toCssFamily(REACT_THEME_VALUES.color.primary);
const VUE_PRIMARY = toCssFamily(VUE_THEME_VALUES.color.primary);
const SVELTE_PRIMARY = toCssFamily(SVELTE_THEME_VALUES.color.primary);

const themeColors = (): Plugin => ({
    name: "theme-colors",
    transformIndexHtml: () => [
        {
            tag: "style",
            injectTo: "head",
            children: `:root { --solid-primary: ${SOLID_PRIMARY.main}; --solid-primary-light: ${SOLID_PRIMARY.light}; --solid-primary-dark: ${SOLID_PRIMARY.dark}; --react-primary: ${REACT_PRIMARY.main}; --vue-primary: ${VUE_PRIMARY.main}; --vue-primary-light: ${VUE_PRIMARY.light}; --vue-primary-dark: ${VUE_PRIMARY.dark}; --svelte-primary: ${SVELTE_PRIMARY.main}; }`,
        },
    ],
});

const BARE_BASE_PATTERN = /^\/(solid|react|vue|svelte)(\?.*)?$/;

const bareBaseRedirect = (): Plugin => ({
    name: "bare-base-redirect",
    configureServer: (server) => {
        server.middlewares.use((req, res, next) => {
            const match = req.url?.match(BARE_BASE_PATTERN);

            if (!match) return next();

            res.statusCode = 302;
            res.setHeader("Location", `/${match[1]}/${match[2] ?? ""}`);
            res.end();
        });
    },
});

export default defineConfig({
    root: fromHere("."),
    plugins: [themeColors(), bareBaseRedirect()],
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
