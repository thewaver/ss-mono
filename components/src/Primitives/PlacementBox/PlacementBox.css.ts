import { style } from "@vanilla-extract/css";

export const placementBox = style({
    position: "relative",
    containerType: "inline-size",
    width: "100%",
    flexShrink: 0,
});

export const placementSpacer = style({
    width: "100%",
    pointerEvents: "none",
});
