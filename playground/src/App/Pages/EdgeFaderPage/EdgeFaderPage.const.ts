import type { EdgeFaderEdge } from "@thewaver/ss-components";

export const COLUMN_ROWS = Array.from({ length: 16 }, (_, index) => `Row ${index + 1}`);

export const STRIP_CHIPS = Array.from({ length: 20 }, (_, index) => `Item ${index + 1}`);

export const GRID_TILES = Array.from({ length: 64 }, (_, index) => index + 1);

export const EXAMPLE_NAMES = {
    column: "Top and bottom",
    strip: "Left and right",
    grid: "All four sides",
    card: "Something that does not scroll",
};

export const EXAMPLES_ROOT = "/src/App/Pages/EdgeFaderPage/Examples";

export const DOCS_ROOT = "/src/App/Pages/EdgeFaderPage/Docs";

export const EDGE_LABELS: Record<EdgeFaderEdge, string> = {
    top: "Top",
    right: "Right",
    bottom: "Bottom",
    left: "Left",
};

export const DOCS_SECTIONS = {
    anyMixSides: {
        title: "Any mix of sides",
        content:
            "Pass [prop]edges[/prop] any mix of top, right, bottom and left; left out, all four fade. Where two faded sides meet, their fades meet in the corner.",
    },
    fadingOnlyOutOfView: {
        title: "Fading only what is out of view",
        content:
            "Set [prop]isScrollAware[/prop] and a side fades only while there is more to scroll to past it. The fade shrinks as that end comes into view and is gone once it is reached, so a box whose content fits shows no fade at all.",
    },
    aroundNonScrolling: {
        title: "Around something that does not scroll",
        content:
            "Left fixed, the default, the chosen sides fade whether or not anything scrolls, so the fade can soften the edges of any content.",
    },
};
