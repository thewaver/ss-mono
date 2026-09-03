import { style } from "@vanilla-extract/css";

export const trailRoot = style({
    display: "block",
    position: "relative",
});

export const trailTrack = style({
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    overflow: "visible",
    pointerEvents: "none",
});

export const trailPath = style({
    fill: "none",
    stroke: "none",
});

export const trailTraveller = style({
    position: "absolute",
    top: 0,
    left: 0,
    display: "flex",
    willChange: "transform",
});
