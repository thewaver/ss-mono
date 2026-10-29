import { style } from "@vanilla-extract/css";

export const particleSpawnerRoot = style({
    position: "relative",
    width: "100%",
    height: "100%",
    contain: "size layout style",
});

export const particleSpawnerRootMoving = style({
    willChange: "transform",
});

export const particleSpawnerItem = style({
    position: "absolute",
    left: 0,
    top: 0,
});

export const particleSpawnerBody = style({
    transformOrigin: "center center",
});
