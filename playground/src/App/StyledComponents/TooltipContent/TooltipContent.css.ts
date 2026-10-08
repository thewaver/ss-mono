import { style, styleVariants } from "@vanilla-extract/css";

import { themeVars } from "../../Theme.css";

const SHADOW_REACH = "32px";
const ARROWED_SHADOW = "drop-shadow(0 2px 1px rgba(0, 0, 0, 0.8)) drop-shadow(0 4px 4px rgba(0, 0, 0, 0.65))";

export const isVisible = style({});

export const tooltipVisibility = style({
    boxShadow: themeVars.shadow.medium,
    opacity: 0,

    selectors: {
        [`&.${isVisible}`]: {
            opacity: 1,
        },
    },
});

export const tooltipArrowed = style({
    boxShadow: "none",
});

export const tooltipArrowShadow = style({
    filter: ARROWED_SHADOW,
});

export const tooltipRevealVariants = styleVariants({
    fade: {
        transitionProperty: "opacity",
    },
    zoom: {
        transitionProperty: "opacity, transform",
        transform: "scale(0.6)",

        selectors: {
            [`&.${isVisible}`]: {
                transform: "none",
            },
        },
    },
    slide: {
        transitionProperty: "opacity, transform",
        transform: `translateY(${themeVars.spacing.full})`,

        selectors: {
            [`&.${isVisible}`]: {
                transform: "none",
            },
        },
    },
    clip: {
        opacity: 1,
        transitionProperty: "clip-path",
        clipPath: `inset(-${SHADOW_REACH} 100% -${SHADOW_REACH} -${SHADOW_REACH})`,

        selectors: {
            [`&.${isVisible}`]: {
                clipPath: `inset(-${SHADOW_REACH})`,
            },
        },
    },
    blur: {
        transitionProperty: "opacity, filter",
        filter: `blur(${themeVars.spacing.full})`,

        selectors: {
            [`&.${isVisible}`]: {
                filter: "none",
            },
        },
    },
    flip: {
        transitionProperty: "opacity, transform",
        transformOrigin: "top center",
        transform: "perspective(400px) rotateX(-90deg)",

        selectors: {
            [`&.${isVisible}`]: {
                transform: "none",
            },
        },
    },
});

export const tooltipBody = style({
    color: themeVars.color.surface.contrast,
    padding: themeVars.spacing.full,

    maxWidth: 240,
});
