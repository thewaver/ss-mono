import { style } from "@vanilla-extract/css";

export const icicleRoot = style({
    position: "relative",
    width: "100%",
    height: "100%",
    overflow: "hidden",
});

export const icicleList = style({
    position: "absolute",
    inset: 0,
    listStyle: "none",
    margin: 0,
    padding: 0,
});

export const icicleItem = style({
    position: "absolute",

    selectors: {
        "&:focus-within": {
            zIndex: 1,
        },
    },
});

export const icicleLeaving = style({
    pointerEvents: "none",
});

export const icicleCell = style({
    width: "100%",
    height: "100%",

    selectors: {
        "&:focus:not(:focus-visible)": {
            outline: "0 none",
        },
    },
});
