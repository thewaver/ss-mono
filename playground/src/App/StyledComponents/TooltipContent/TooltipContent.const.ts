import { type ShapeArrowTemplate, ShapeConst } from "@thewaver/ss-utils";

import { BORDER_RADIUS_FULL } from "../../Theme.const";

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

export const TOOLTIP_ARROWS = ["none", "even", "left", "right"] as const;

export type TooltipArrow = (typeof TOOLTIP_ARROWS)[number];

export const DEFAULT_TOOLTIP_ARROW: TooltipArrow = "even";

export const TOOLTIP_ARROW_LABELS: Record<TooltipArrow, string> = {
    none: "None",
    even: "Even",
    left: "Left",
    right: "Right",
};

export const TOOLTIP_ARROW_TEMPLATES: Record<
    Exclude<TooltipArrow, "none">,
    (width: number, length: number) => ShapeArrowTemplate
> = {
    even: (width, length) => ShapeConst.getIsoscelesArrow(width, length),
    left: (width, length) => ({
        baseStart: { x: -width, y: 0 },
        tip: { x: 0, y: length },
        baseEnd: { x: 0, y: 0 },
    }),
    right: (width, length) => ({
        baseStart: { x: width, y: 0 },
        tip: { x: 0, y: length },
        baseEnd: { x: 0, y: 0 },
    }),
};

export const JOIN_RADII = [BORDER_RADIUS_FULL];
