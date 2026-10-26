import { type ArcDefs, PlacementLayoutUtils } from "@thewaver/ss-components";

export const EXAMPLE_NAMES = {
    default: "Default",
    refusing: "Refusing",
    pressed: "Pressed",
    sharedTooltip: "One tooltip for the row",
    palette: "A ring of tools",
};

export const NOTHING_RUN = "nothing run yet";

export const EXAMPLES_ROOT = "/src/App/Pages/ToolbarPage/Examples";

export const NO_WIDTH = 0;

export const WIDE_SPAN = 2;

export const DOCS_ROOT = "/src/App/Pages/ToolbarPage/Docs";

export const PALETTE_DEFS: ArcDefs = {
    ovalHeightRatio: 1,
    spreadDegrees: 360,
    facingDegrees: 67.5,
    itemWidthRatio: 0.3542,
    itemHeightRatio: 0.1667,
};

export const PALETTE_LAYOUT = PlacementLayoutUtils.createArc(PALETTE_DEFS);

export const PALETTE_WIDTH = "390px";
