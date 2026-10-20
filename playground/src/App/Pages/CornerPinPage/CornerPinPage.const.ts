import type { CornerPinAxisLabels } from "@thewaver/ss-components";
import type { QuadCorner } from "@thewaver/ss-utils";

export const EXAMPLE_NAMES = {
    card: "Card",
};

export const EXAMPLES_ROOT = "/src/App/Pages/CornerPinPage/Examples";

export const FIELD_WIDTH = 110;

export const GRIP_LABELS: Record<QuadCorner, CornerPinAxisLabels> = {
    top_left: { x: "Top left corner, across", y: "Top left corner, down" },
    top_right: { x: "Top right corner, across", y: "Top right corner, down" },
    bottom_right: { x: "Bottom right corner, across", y: "Bottom right corner, down" },
    bottom_left: { x: "Bottom left corner, across", y: "Bottom left corner, down" },
};
