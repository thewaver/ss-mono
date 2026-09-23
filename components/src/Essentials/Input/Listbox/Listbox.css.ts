import { style } from "@vanilla-extract/css";

export const listboxHorizontal = style({
    display: "flex",
    flexWrap: "wrap",
});

export const listboxEndMarker = style({
    width: "100%",
    height: 1,
    marginTop: -1,
});

export const listboxSizer = style({
    position: "relative",
    width: "100%",
});

export const listboxSizerRow = style({
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
});

export const listboxOption = style({
    width: "100%",
    cursor: "pointer",
    pointerEvents: "all",

    selectors: {
        "&[aria-disabled='true']": {
            cursor: "not-allowed",
        },
    },
});
