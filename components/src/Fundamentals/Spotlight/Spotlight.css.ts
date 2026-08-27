import { style } from "@vanilla-extract/css";

export const SPOTLIGHT_Z_INDEX = 10;

export const spotlightOverlay = style({
    position: "absolute",
    inset: 0,
    display: "grid",
    zIndex: SPOTLIGHT_Z_INDEX,
    pointerEvents: "none",
});

export const spotlightBlocker = style({
    position: "absolute",
    inset: 0,
    zIndex: SPOTLIGHT_Z_INDEX,
    pointerEvents: "all",
});

export const spotlightDecoration = style({
    position: "absolute",
    zIndex: SPOTLIGHT_Z_INDEX,
    pointerEvents: "none",
});

export const spotlightPopup = style({
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: SPOTLIGHT_Z_INDEX,
    pointerEvents: "all",
});
