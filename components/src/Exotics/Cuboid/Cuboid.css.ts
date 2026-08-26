import { style } from "@vanilla-extract/css";

export const cuboidRoot = style({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexGrow: 0,
    flexShrink: 0,
});

export const cuboidPerspective = style({
    position: "relative",
});

export const cuboidBody = style({
    position: "absolute",
    inset: 0,
    transformOrigin: "center center",
    transformStyle: "preserve-3d",
    transitionProperty: "transform",
});

export const cuboidFace = style({
    position: "absolute",
    transformOrigin: "center center",
    backfaceVisibility: "hidden",
});
