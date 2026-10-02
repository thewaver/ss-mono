import { style } from "@vanilla-extract/css";

export const paintedTextRoot = style({
    position: "relative",
});

export const paintedTextSourceWrap = style({
    position: "absolute",
    left: -999999,
    top: -999999,
    width: "100%",
    visibility: "hidden",
    pointerEvents: "none",
    whiteSpace: "pre",
});

export const paintedTextLayoutWrap = style({
    visibility: "hidden",
    pointerEvents: "none",
    whiteSpace: "pre",
});

export const paintedTextSVG = style({
    position: "absolute",
    inset: 0,
    overflow: "visible",
});

export const paintedTextCaret = style({
    position: "absolute",
    display: "flex",
    pointerEvents: "none",
});

export const paintedTextLayer = style({
    whiteSpace: "pre",
});
