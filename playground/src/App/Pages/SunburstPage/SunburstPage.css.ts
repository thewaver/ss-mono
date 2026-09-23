import { style } from "@vanilla-extract/css";

export const frame = style({
    position: "relative",
    width: 600,
    maxWidth: "100%",
    aspectRatio: "1",
});

export const hub = style({
    position: "absolute",
    display: "flex",
});
