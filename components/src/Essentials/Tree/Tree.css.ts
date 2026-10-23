import { style } from "@vanilla-extract/css";

export const treeRoot = style({
    position: "relative",
    isolation: "isolate",
});

export const treeNode = style({
    width: "100%",
    color: "inherit !important",
    textDecoration: "none !important",
    cursor: "pointer",
    pointerEvents: "all",

    selectors: {
        "&[aria-disabled='true']": {
            cursor: "not-allowed",
        },
    },
});

export const treeConnector = style({
    position: "absolute",
    inset: 0,
    zIndex: -2,
    pointerEvents: "none",
});

export const treeSizer = style({
    position: "relative",
    isolation: "isolate",
    width: "100%",
});

export const treeSizerRow = style({
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
});
