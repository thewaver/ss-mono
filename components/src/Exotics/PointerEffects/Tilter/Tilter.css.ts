import { style } from "@vanilla-extract/css";

export const tilterRoot = style({
    display: "grid",
    placeItems: "center",
    width: "100%",
    height: "100%",
});

export const tilterSurface = style({
    position: "relative",
    display: "grid",
    placeItems: "center",
    willChange: "transform",
});

export const tilterSheen = style({
    position: "absolute",
    inset: 0,
    display: "grid",
    pointerEvents: "none",
});
