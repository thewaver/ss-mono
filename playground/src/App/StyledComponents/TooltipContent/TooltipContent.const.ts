import { tooltipRevealVariants } from "./TooltipContent.css";

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
