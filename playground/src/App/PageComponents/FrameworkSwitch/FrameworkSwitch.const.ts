import type { PlaygroundFramework } from "./PlaygroundFramework.types";

export const PLAYGROUND_URLS = import.meta.env.VITE_PLAYGROUND_URLS as Readonly<Record<PlaygroundFramework, string>>;

export const toFrameworkHref = (framework: PlaygroundFramework, routePath: string) =>
    `${PLAYGROUND_URLS[framework]}${routePath.replace(/^\//, "")}`;

export const toRouterBase = (baseUrl: string) => baseUrl.replace(/\/$/, "");

export const toOwnAppHref = (href: string) =>
    href.startsWith("/") ? `${import.meta.env.BASE_URL}${href.slice(1)}` : href;

export const toRoutePath = (pathname: string) => {
    const base = toRouterBase(import.meta.env.BASE_URL);

    return base && pathname.startsWith(base) ? pathname.slice(base.length) || "/" : pathname;
};

export const PLAYGROUND_FRAMEWORKS: PlaygroundFramework[] = ["react", "solid", "svelte", "vue"];

export const PLAYGROUND_FRAMEWORK_LABELS: Record<PlaygroundFramework, string> = {
    solid: "Solid",
    react: "React",
    vue: "Vue",
    svelte: "Svelte",
};
