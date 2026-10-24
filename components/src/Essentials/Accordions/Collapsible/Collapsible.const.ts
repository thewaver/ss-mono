import type { CollapsibleSide, CollapsibleSizing } from "./Collapsible.types";

export const COLLAPSIBLE_SIDES: CollapsibleSide[] = ["top", "right", "bottom", "left"];

export const COLLAPSIBLE_DEFAULTS = {
    transitionDurationMs: 200,
    sizing: "fill" as CollapsibleSizing,
    side: "bottom" as CollapsibleSide,
};
