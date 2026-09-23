import { style } from "@vanilla-extract/css";

export const dieRoot = style({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexGrow: 0,
    flexShrink: 0,
});

export const diePerspective = style({
    position: "relative",
    flexShrink: 0,
});

export const dieBody = style({
    position: "absolute",
    inset: 0,
    transformOrigin: "center center",
    transformStyle: "preserve-3d",
});

export const dieFace = style({
    position: "absolute",
    transformOrigin: "center center",
    backfaceVisibility: "hidden",
});
