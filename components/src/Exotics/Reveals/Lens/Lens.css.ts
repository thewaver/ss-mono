import { style } from "@vanilla-extract/css";

export const lensRoot = style({
    position: "relative",
    overflow: "hidden",
});

export const lensLayer = style({
    position: "absolute",
    inset: 0,
    overflow: "hidden",
    pointerEvents: "none",
});

export const lensCopy = style({
    position: "absolute",
    inset: 0,
});
