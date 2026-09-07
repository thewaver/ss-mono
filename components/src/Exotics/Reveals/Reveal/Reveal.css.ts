import { style } from "@vanilla-extract/css";

export const revealRoot = style({
    position: "relative",
    overflow: "hidden",
});

export const revealCover = style({
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
});
