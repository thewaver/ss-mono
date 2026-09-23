import { style } from "@vanilla-extract/css";

export const shadowCasterRoot = style({
    display: "grid",
    placeItems: "center",
    width: "100%",
    height: "100%",
    willChange: "filter",
});
