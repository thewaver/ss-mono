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
