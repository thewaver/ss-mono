import type { Plugin } from "vite";

import { toBackdropGradient } from "../src/App/Theme.utils.ts";

const LOADING_TEXT = "Loading…";

type ThemeBackground = { light: string; dark: string; contrast: string };

export const themeLoading = ({ light, dark, contrast }: ThemeBackground): Plugin => ({
    name: "theme-loading",
    transformIndexHtml: () => [
        {
            tag: "style",
            injectTo: "head",
            children: `#root:empty { position: fixed; inset: 0; display: flex; align-items: center; justify-content: center; font-family: system-ui, sans-serif; font-size: 20px; color: ${contrast}; background-image: ${toBackdropGradient(light, dark)}; } #root:empty::before { content: "${LOADING_TEXT}"; }`,
        },
    ],
});
