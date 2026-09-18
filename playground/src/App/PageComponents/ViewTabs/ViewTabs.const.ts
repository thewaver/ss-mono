import type { PageViewKey } from "./ViewTabs.types";

export const PAGE_VIEW_KEYS: PageViewKey[] = ["docs", "api", "samples"];

export const PAGE_VIEW_LABELS: Record<PageViewKey, string> = {
    docs: "Docs",
    api: "API",
    samples: "Samples",
};

export const PAGE_VIEW_SEGMENTS: Record<PageViewKey, string> = {
    docs: "/docs",
    api: "/api",
    samples: "",
};

export const DEFAULT_PAGE_VIEW: PageViewKey = "samples";

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
