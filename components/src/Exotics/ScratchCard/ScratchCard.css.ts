import { style } from "@vanilla-extract/css";

export const scratchCardRoot = style({
    position: "relative",
    width: "100%",
    height: "100%",
    overflow: "hidden",
});

export const scratchCardCover = style({
    position: "absolute",
    inset: 0,
    display: "grid",
    touchAction: "none",
    cursor: "crosshair",
});

export const scratchCardCell = style({
    position: "relative",
    pointerEvents: "none",
});

export const scratchCardScratched = style({
    visibility: "hidden",
});
