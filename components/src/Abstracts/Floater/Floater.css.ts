import { style } from "@vanilla-extract/css";

export const floater = style({
    position: "absolute",
    zIndex: -1,

    display: "grid",
    pointerEvents: "none",
    transition: "width, height, left, top",
});
