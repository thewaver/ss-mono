import type { PageViewKey } from "./PageView.types";

export const PAGE_VIEW_KEYS: PageViewKey[] = ["docs", "api", "examples"];

export const PAGE_VIEW_LABELS: Record<PageViewKey, string> = {
    docs: "Docs",
    api: "API",
    examples: "Examples",
};

export const PAGE_VIEW_SEGMENTS: Record<PageViewKey, string> = {
    docs: "/docs",
    api: "/api",
    examples: "",
};

export const DEFAULT_PAGE_VIEW: PageViewKey = "docs";

export const toPageViewRoute = (baseRoute: string, key: PageViewKey) => `${baseRoute}${PAGE_VIEW_SEGMENTS[key]}`;

export const toPageViewKey = (pathname: string, baseRoute: string): PageViewKey => {
    const tail = pathname.slice(baseRoute.length);

    return PAGE_VIEW_KEYS.find((key) => PAGE_VIEW_SEGMENTS[key] === tail) ?? DEFAULT_PAGE_VIEW;
};

export const toBaseRoute = (pathname: string) => {
    const segment = PAGE_VIEW_KEYS.map((key) => PAGE_VIEW_SEGMENTS[key]).find(
        (candidate) => candidate.length > 0 && pathname.endsWith(candidate),
    );

    return segment === undefined ? pathname : pathname.slice(0, -segment.length);
};

export const TAB_GAP = 20;

export const TAB_ORIENTATION = "horizontal";

export const EXAMPLES_VIEW: PageViewKey = "examples";
