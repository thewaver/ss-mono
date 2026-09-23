import { keyframes, style } from "@vanilla-extract/css";

import { themeVars } from "../../Theme.css";

export const RING_SIZE = 96;
export const RING_STROKE = 8;

const spin = keyframes({
    "0%": { transform: "rotate(-90deg)" },
    "100%": { transform: "rotate(270deg)" },
});

export const isIndeterminate = style({});
export const hasError = style({});

export const progressRing = style({
    position: "relative",
    display: "grid",
    placeItems: "center",
    width: RING_SIZE,
    height: RING_SIZE,
});

export const progressRingSvg = style({
    position: "absolute",
    inset: 0,
    transform: "rotate(-90deg)",

    selectors: {
        [`${progressRing}.${isIndeterminate} &`]: {
            animation: `${spin} 1.2s linear infinite`,
        },
    },
});

export const progressRingTrack = style({
    fill: "none",
    stroke: "rgb(from currentColor r g b / 20%)",
});

export const progressRingFill = style({
    fill: "none",
    stroke: themeVars.color.primary.main,
    strokeLinecap: "round",
    transition: `stroke-dashoffset ${themeVars.animation.duration}`,

    selectors: {
        [`${progressRing}.${hasError} &`]: {
            stroke: themeVars.color.error.main,
        },
    },
});

export const progressRingReadout = style({
    fontSize: themeVars.fontSize.small,
    fontVariantNumeric: "tabular-nums",
});
