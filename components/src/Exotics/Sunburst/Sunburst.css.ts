import { style } from "@vanilla-extract/css";

export const sunburstRoot = style({
    position: "relative",
    width: "100%",
    height: "100%",
});

export const sunburstCanvas = style({
    display: "block",
    width: "100%",
    height: "100%",
    overflow: "visible",
});

export const sunburstLeaving = style({
    pointerEvents: "none",
});

export const sunburstArc = style({
    selectors: {
        "&:focus:not(:focus-visible)": {
            outline: "0 none",
        },
    },
});
