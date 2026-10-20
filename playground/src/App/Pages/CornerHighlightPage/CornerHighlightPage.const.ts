import type { QuadCorner } from "@thewaver/ss-utils";

export const EXAMPLE_NAMES = {
    default: "Around a box",
    control: "As a control's decoration",
    overlay: "Over content it does not own",
    focusFollow: "Following focus and hover",
    drawOn: "Drawn on",
};

export const EXAMPLES_ROOT = "/src/App/Pages/CornerHighlightPage/Examples";

export const CORNER_LABELS: Record<QuadCorner, string> = {
    top_left: "Top left",
    top_right: "Top right",
    bottom_left: "Bottom left",
    bottom_right: "Bottom right",
};

export const FIELD_WIDTH = 110;
