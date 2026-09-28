import type { PlaygroundFramework } from "./PlaygroundFramework.types";

export const OTHER_PLAYGROUND_URL = import.meta.env.VITE_OTHER_PLAYGROUND_URL;

export const toOtherFrameworkHref = (routePath: string) => `${OTHER_PLAYGROUND_URL}${routePath.replace(/^\//, "")}`;

export const toRouterBase = (baseUrl: string) => baseUrl.replace(/\/$/, "");

export const toOwnAppHref = (href: string) =>
    href.startsWith("/") ? `${import.meta.env.BASE_URL}${href.slice(1)}` : href;

export const toRoutePath = (pathname: string) => {
    const base = toRouterBase(import.meta.env.BASE_URL);

    return base && pathname.startsWith(base) ? pathname.slice(base.length) || "/" : pathname;
};

export const PLAYGROUND_FRAMEWORKS: PlaygroundFramework[] = ["solid", "react"];

export const PLAYGROUND_FRAMEWORK_LABELS: Record<PlaygroundFramework, string> = {
    solid: "Solid",
    react: "React",
};
