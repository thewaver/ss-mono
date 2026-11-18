import type { FlipCardAxis, FlipCardTurnDirection } from "@thewaver/ss-components";

export const EXAMPLE_NAMES = {
    pressed: "Turned toward the edge pressed",
};

export const AXIS_LABELS: Record<FlipCardAxis, string> = {
    row: "About the upright axis",
    column: "About the horizontal axis",
};

export const FIELD_WIDTH = 110;

export const SELECT_WIDTH = 220;

export const EXAMPLES_ROOT = "/src/App/Pages/FlipCardPage/Examples";

export const EDGE_LABELS: Record<FlipCardAxis, Record<FlipCardTurnDirection, string>> = {
    row: { backward: "Press the left edge", forward: "Press the right edge" },
    column: { backward: "Press the bottom edge", forward: "Press the top edge" },
};

export const PEEK_OTHER_SIDE_LABEL = "Peek at the other side";
