import type { Plugin } from "vite";

const LOADING_TEXT = "Loading…";

export const loadingScreen = (): Plugin => ({
    name: "loading-screen",
    transformIndexHtml: () => [
        {
            tag: "style",
            injectTo: "head",
            children: `#root:empty { position: fixed; inset: 0; display: flex; align-items: center; justify-content: center; font-family: system-ui, sans-serif; font-size: 20px; color: white; background-color: black; } #root:empty::before { content: "${LOADING_TEXT}"; }`,
        },
    ],
});
