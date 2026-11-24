import { createVar, style, styleVariants } from "@vanilla-extract/css";

import { skinEntries } from "../../Skins/Skin.css";
import { themeVars } from "../../Theme.css";

const SHADOW_REACH = "32px";

export const isVisible = style({});

export const tooltipFrame = style({
    position: "relative",
    zIndex: 0,
});

export const tooltipBackdrop = style({
    position: "absolute",
    zIndex: -1,
    pointerEvents: "none",
});

export const tooltipText = style({
    display: "contents",
});

export const tooltipSkinProbe = style([
    skinEntries.tooltip,
    {
        position: "absolute",
        inset: 0,
        visibility: "hidden",
        pointerEvents: "none",
    },
]);

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
    padding: themeVars.spacing.full,

    maxWidth: 240,
});

export const tooltipBodyWide = style({
    maxWidth: "none",
});

export const tooltipRevealDuration = createVar();

export const tooltipReveal = style({
    transitionDuration: tooltipRevealDuration,
});

export const tooltipFadePart = style({
    transitionProperty: "opacity",
    transitionDuration: tooltipRevealDuration,

    selectors: {
        [`${tooltipReveal}:not(${isVisible}):not(${tooltipRevealVariants.clip}) &`]: {
            opacity: 0,
        },
    },
});
