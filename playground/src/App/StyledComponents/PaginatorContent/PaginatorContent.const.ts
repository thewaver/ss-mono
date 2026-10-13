import type { PaginatorStep } from "@thewaver/ss-components";

export const HALF = 0.5;

export const GAP_MARK = "…";

export const PAGE_SIZE = 3;

export const FIRST_PAGE = 1;

export const RESULTS = [
    "Aurora",
    "Basalt",
    "Cinder",
    "Drift",
    "Ember",
    "Fathom",
    "Glimmer",
    "Hollow",
    "Iris",
    "Jetty",
    "Kelp",
    "Loam",
];

export const STEP_GLYPHS: Record<PaginatorStep, string> = {
    first: "«",
    previous: "‹",
    next: "›",
    last: "»",
};
