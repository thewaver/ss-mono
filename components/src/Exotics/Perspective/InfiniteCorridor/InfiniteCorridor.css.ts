import { style } from "@vanilla-extract/css";

export const infiniteCorridorRoot = style({
    position: "relative",
    isolation: "isolate",
    width: "100%",
    height: "100%",
    overflow: "hidden",
});

export const infiniteCorridorItem = style({
    position: "absolute",
    top: "50%",
    left: "50%",
    display: "grid",
});
