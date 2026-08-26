import { style } from "@vanilla-extract/css";

export const barrelRoot = style({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexGrow: 0,
    flexShrink: 0,
});

export const barrelPerspective = style({
    position: "relative",
});

export const barrelBody = style({
    position: "absolute",
    inset: 0,
    transformOrigin: "center center",
    transformStyle: "preserve-3d",
});

export const barrelFace = style({
    position: "absolute",
    inset: 0,
    transformOrigin: "center center",
    transitionProperty: "transform",
    backfaceVisibility: "hidden",
});
