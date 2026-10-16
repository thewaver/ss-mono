import { style } from "@vanilla-extract/css";

export const rgbSplitterRoot = style({
    display: "grid",
    placeItems: "center",
    width: "100%",
    height: "100%",
    willChange: "filter",
});

export const rgbSplitterFilterHost = style({
    position: "absolute",
    width: 0,
    height: 0,
    overflow: "hidden",
});
