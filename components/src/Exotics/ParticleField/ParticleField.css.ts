import { style } from "@vanilla-extract/css";

export const particleFieldRoot = style({
    position: "relative",
    width: "100%",
    height: "100%",
});

export const particleFieldItem = style({
    position: "absolute",
    transform: "translate(-50%, -50%)",
});

export const particleFieldBody = style({
    transformOrigin: "center center",
});
