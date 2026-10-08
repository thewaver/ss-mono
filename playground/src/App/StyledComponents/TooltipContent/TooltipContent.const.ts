import { type ShapeArrowTemplate, ShapeConst } from "@thewaver/ss-utils";

import { tooltipRevealVariants } from "./TooltipContent.css";

export const TOOLTIP_HOVER_DELAY_MS = 300;

export type TooltipReveal = keyof typeof tooltipRevealVariants;

export const TOOLTIP_REVEALS = Object.keys(tooltipRevealVariants) as TooltipReveal[];

export const TOOLTIP_REVEAL_LABELS: Record<TooltipReveal, string> = {
    fade: "Fade",
    zoom: "Zoom",
    slide: "Slide up",
    clip: "Wipe",
    blur: "Unblur",
    flip: "Flip down",
};

export const TOOLTIP_ARROWS = ["none", "triangle", "bolt"] as const;

export type TooltipArrow = (typeof TOOLTIP_ARROWS)[number];

export const TOOLTIP_ARROW_LABELS: Record<TooltipArrow, string> = {
    none: "None",
    triangle: "Triangle",
    bolt: "Lightning bolt",
};

export const TOOLTIP_ARROW_TEMPLATES: Record<
    Exclude<TooltipArrow, "none">,
    (width: number, length: number) => ShapeArrowTemplate
> = {
    triangle: (width, length) => ShapeConst.getIsoscelesArrow(width, length),
    bolt: (width, length) => ({
        baseStart: { x: -width, y: 0 },
        tip: { x: 0, y: length },
        baseEnd: { x: -width * 0.5, y: 0 },
    }),
};
