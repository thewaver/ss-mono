import { style } from "@vanilla-extract/css";

export const SPOTLIGHT_Z_INDEX = 10;

export const spotlightOverlay = style({
    position: "fixed",
    inset: 0,
    display: "grid",
    zIndex: SPOTLIGHT_Z_INDEX,
    pointerEvents: "none",
});

export const spotlightBlocker = style({
    position: "fixed",
    inset: 0,
    zIndex: SPOTLIGHT_Z_INDEX,
    pointerEvents: "all",
});

export const spotlightDecoration = style({
    position: "fixed",
    zIndex: SPOTLIGHT_Z_INDEX,
    pointerEvents: "none",
});

export const spotlightPopup = style({
    position: "fixed",
    top: 0,
    left: 0,
    zIndex: SPOTLIGHT_Z_INDEX,
    pointerEvents: "all",
});
