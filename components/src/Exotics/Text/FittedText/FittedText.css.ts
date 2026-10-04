import { style } from "@vanilla-extract/css";

export const fittedTextRoot = style({
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    width: "100%",
    height: "100%",
    overflow: "hidden",
});

export const fittedTextLine = style({
    display: "block",
    whiteSpace: "pre",
});
