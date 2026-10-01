import { style } from "@vanilla-extract/css";

export const scrambleTextWord = style({
    display: "inline-block",
});

export const scrambleTextCharacter = style({
    position: "relative",
    display: "inline-block",
});

export const scrambleTextSettling = style({
    color: "transparent",
});

export const scrambleTextNoise = style({
    position: "absolute",
    inset: 0,
    display: "flex",
    justifyContent: "center",
    pointerEvents: "none",
});
