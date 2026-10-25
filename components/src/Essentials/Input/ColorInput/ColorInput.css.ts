import { style } from "@vanilla-extract/css";

export const colorInputDescription = style({
    position: "absolute",
    width: 1,
    height: 1,
    padding: 0,
    border: 0,
    overflow: "hidden",
    clipPath: "inset(50%)",
    whiteSpace: "nowrap",
});

export const colorInputHue = style({
    display: "contents",
});

export const colorInputField = style({
    display: "flex",
    pointerEvents: "all",
    width: "100%",
    border: "none",
    padding: 0,
    background: "none",
    font: "inherit",
    color: "inherit",
    textAlign: "inherit",
});
