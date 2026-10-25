import type { AnchorPlacement } from "@thewaver/ss-components";

export const ARROW_BED_PLACEMENTS: AnchorPlacement[] = [
    { x: "left_out", y: "top_out" },
    { x: "center", y: "top_out" },
    { x: "right_out", y: "top_out" },
    { x: "left_out", y: "center" },
    { x: "right_out", y: "center" },
    { x: "left_out", y: "bottom_out" },
    { x: "center", y: "bottom_out" },
    { x: "right_out", y: "bottom_out" },
];

export const ARROW_BED_SHAPES = ["box", "rounded_box", "octagon"] as const;

export type ArrowBedShape = (typeof ARROW_BED_SHAPES)[number];

export const ARROW_BED_ARROWS = ["triangle", "bolt"] as const;

export type ArrowBedArrow = (typeof ARROW_BED_ARROWS)[number];

export const ARROW_BED_BOX_SIZE = { width: 120, height: 60 };

export const ARROW_BED_GAP = 40;

export const ARROW_BED_CHAMFER_RATIO = 0.25;

export const DOCS_ROOT = "/src/App/Pages/TooltipPage/Docs";

export const FIELD_WIDTH = 110;

export const CIRCLING_MIN_DEGREES = 0;

export const CIRCLING_MAX_DEGREES = 359;

export const CIRCLING_STEP_DEGREES = 1;

export const STARTING_CIRCLING_DEGREES = 90;

export const CIRCLING_CORE_RATIO = 0.25;

export const CIRCLING_SLIDER_WIDTH = 320;
