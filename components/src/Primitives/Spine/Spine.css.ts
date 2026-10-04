import { style } from "@vanilla-extract/css";

export const spineRoot = style({
    position: "relative",
    width: "100%",
    height: "100%",
    flexShrink: 0,
});

export const spineBody = style({
    position: "absolute",
    inset: 0,
    transformStyle: "preserve-3d",
});

export const spineFace = style({
    position: "absolute",
    inset: 0,
    transformOrigin: "center center",
    transitionProperty: "transform",
    backfaceVisibility: "hidden",
});
