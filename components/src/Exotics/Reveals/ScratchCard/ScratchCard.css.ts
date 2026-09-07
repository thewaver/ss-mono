import { createVar, style } from "@vanilla-extract/css";

export const clearDurationVar = createVar();

export const scratchCardRoot = style({
    position: "relative",
    overflow: "hidden",
});

export const scratchCardDefs = style({
    position: "absolute",
    width: 0,
    height: 0,
});

export const scratchCardCover = style({
    position: "absolute",
    inset: 0,
    touchAction: "none",
    cursor: "crosshair",
    transitionProperty: "opacity",
    transitionDuration: clearDurationVar,
    transitionTimingFunction: "ease-out",
});

export const scratchCardCoverClearing = style({
    opacity: 0,
    pointerEvents: "none",
});

export const scratchCardBrush = style({
    position: "absolute",
    pointerEvents: "none",
});
