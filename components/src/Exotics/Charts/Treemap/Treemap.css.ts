import { style } from "@vanilla-extract/css";

export const treemapRoot = style({
    position: "relative",
    width: "100%",
    height: "100%",
});

export const treemapZooming = style({
    overflow: "hidden",
});

export const treemapLayer = style({
    position: "absolute",
    inset: 0,
    listStyle: "none",
    margin: 0,
    padding: 0,

    selectors: {
        "&:focus:not(:focus-visible)": {
            outline: "0 none",
        },
    },
});

export const treemapLeaving = style({
    pointerEvents: "none",
});

export const treemapOnTop = style({
    zIndex: 1,
});

export const treemapItem = style({
    position: "absolute",

    selectors: {
        "&:focus-within": {
            zIndex: 1,
        },
    },
});

export const treemapTile = style({
    width: "100%",
    height: "100%",

    selectors: {
        "&:focus:not(:focus-visible)": {
            outline: "0 none",
        },
    },
});
