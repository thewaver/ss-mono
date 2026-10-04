import { style } from "@vanilla-extract/css";

export const wraparoundRoot = style({
    position: "relative",
    overflow: "hidden",
    width: "100%",
    height: "100%",
    touchAction: "none",
    isolation: "isolate",
});

export const isDragging = style({
    cursor: "grabbing",
    userSelect: "none",
});

export const wraparoundPlane = style({
    position: "absolute",
    top: 0,
    left: 0,
    width: 0,
    height: 0,
});

export const wraparoundTile = style({
    position: "absolute",
    top: 0,
    left: 0,
    width: "max-content",
});
