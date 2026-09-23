import { style } from "@vanilla-extract/css";

export const circlePackingRoot = style({
    position: "relative",
    width: "100%",
    height: "100%",
    overflow: "hidden",
});

export const circlePackingCanvas = style({
    display: "block",
    width: "100%",
    height: "100%",
});

export const circlePackingLeaf = style({
    pointerEvents: "none",
});

export const circlePackingCircle = style({
    selectors: {
        "&:focus:not(:focus-visible)": {
            outline: "0 none",
        },
    },
});

export const circlePackingLabels = style({
    pointerEvents: "none",
});
