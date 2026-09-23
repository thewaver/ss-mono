import { style } from "@vanilla-extract/css";

export const cardStackRoot = style({
    position: "relative",
    display: "block",
    width: "100%",
    height: "100%",
});

export const cardStackCard = style({
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    marginInline: "auto",
    display: "grid",
    placeItems: "center",
    transitionProperty: "transform",
    transitionTimingFunction: "ease-out",
    willChange: "transform",
});
