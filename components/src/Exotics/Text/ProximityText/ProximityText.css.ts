import { keyframes, style } from "@vanilla-extract/css";

export const proximityTextSwell = keyframes({
    "0%": {
        fontWeight: 300,
    },
    "100%": {
        fontWeight: 800,
    },
});

export const proximityTextRoot = style({
    position: "relative",
});

export const proximityTextChildrenWrap = style({
    position: "absolute",
    left: -999999,
    top: -999999,
    width: "100%",
    visibility: "hidden",
    pointerEvents: "none",
    whiteSpace: "pre",
});

export const proximityTextLines = style({
    whiteSpace: "pre",
});

export const proximityTextRestLines = style({
    position: "absolute",
    left: 0,
    top: 0,
    visibility: "hidden",
    pointerEvents: "none",
    whiteSpace: "pre",
});

export const proximityTextLetter = style({
    display: "inline-block",
});

export const proximityTextBlockLikeAtomic = style({
    display: "inline-block",
    width: "100%",
});
